import { userRepository } from '../repositories/user.repository';
import { growthProfileRepository } from '../repositories/growth-profile.repository';
import { assessmentRepository } from '../repositories/assessment.repository';
import { growthPathRepository } from '../repositories/growth-path.repository';
import { getGrowthPathDefinition } from '../domain/growth-path-definitions';
import { growthProgressEngine } from '../domain/growth-progress-engine';
import { ActionStatus, ActionDefinition, StageDefinition } from '../domain/growth-path.entity';
import { DashboardDataView, TodayActionView, RecentActivityItem } from '../domain/dashboard.entity';
import { getActionMetadata } from '../domain/action-metadata';
import { actionReportRepository } from '../repositories/action-report.repository';
import {
  weeklyReflectionRepository,
  getDeterministicWeekRange,
} from '../repositories/weekly-reflection.repository';
import { getUserGrowthContext } from './user-growth-context.builder';
import { actionPersonalizationEngine } from '../domain/action-personalization-engine';
import { reminderEligibilityService } from './reminder-eligibility.service';

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDateLabel(targetDate: string, todayStr: string): string {
  if (targetDate === todayStr) return 'امروز';

  const today = new Date(todayStr);
  const target = new Date(targetDate);
  const diffTime = today.getTime() - target.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'دیروز';
  if (diffDays > 1) return `${diffDays} روز قبل`;
  return targetDate;
}

export interface GetDashboardResult {
  success: boolean;
  authenticated: boolean;
  needsOnboarding?: boolean;
  needsAssessment?: boolean;
  needsGrowthProfile?: boolean;
  redirectTo?: string;
  data?: DashboardDataView;
  error?: string;
}

export interface GetTodayActionResult {
  success: boolean;
  authenticated: boolean;
  todayAction?: TodayActionView | null;
  redirectTo?: string;
  error?: string;
}

export interface CompleteTodayActionResult {
  success: boolean;
  authenticated: boolean;
  todayAction?: TodayActionView | null;
  percentProgress?: number;
  completedActionsCount?: number;
  totalActionsCount?: number;
  redirectTo?: string;
  error?: string;
}

/**
 * Deterministically loads the dashboard data view for an authenticated user.
 */
export async function getDashboardDataUseCase(userId: string): Promise<GetDashboardResult> {
  if (!userId) {
    return {
      success: false,
      authenticated: false,
      redirectTo: '/login',
      error: 'برای مشاهده داشبورد، ابتدا وارد حساب کاربری خود شوید.',
    };
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    return {
      success: false,
      authenticated: false,
      redirectTo: '/login',
      error: 'کاربر یافت نشد.',
    };
  }

  // Step 1: Check Onboarding status
  if (!user.onboardingCompleted) {
    return {
      success: false,
      authenticated: true,
      needsOnboarding: true,
      redirectTo: '/onboarding',
      error: 'لطفاً ابتدا مرحله شناخت و آشنایی را تکمیل کنید.',
    };
  }

  // Step 2: Check Assessment status
  const assessment = await assessmentRepository.findByUserId(userId);
  if (!assessment) {
    return {
      success: false,
      authenticated: true,
      needsAssessment: true,
      redirectTo: '/assessment/initial',
      error: 'برای مشاهده داشبورد، ابتدا ارزیابی اولیه را تکمیل کنید.',
    };
  }

  // Step 3: Check Growth Profile status
  let growthProfile = await growthProfileRepository.findByUserId(userId);
  let pathSlug = 'discipline';
  if (growthProfile && growthProfile.recommendedPath?.slug) {
    pathSlug = growthProfile.recommendedPath.slug;
  }

  const pathDef = getGrowthPathDefinition(pathSlug);
  const userGrowthPath = await growthPathRepository.getOrCreateUserGrowthPath(userId, pathSlug);
  const progressRecords = await growthPathRepository.findAllActionsProgressForPath(
    userId,
    userGrowthPath.id
  );

  const pathView = growthProgressEngine.calculateProgress({
    pathDef,
    userGrowthPath,
    progressRecords,
  });

  const todayStr = getTodayDateString();

  const currentStage = pathView.currentStage;
  const currentStageDef =
    pathDef.stages.find((s) => s.order === userGrowthPath.currentStageOrder) ||
    pathDef.stages[0];

  // Find Today's Action deterministically:
  // An action completed today takes priority to celebrate and show "اقدام امروز انجام شد ✓".
  // Check if any action was completed today (date === todayStr and status === 'DONE')
  const completedTodayRecord = progressRecords.find(
    (r) => r.date === todayStr && r.status === 'DONE'
  );

  // Find Today's Action using deterministic Personalization 2.0 Engine:
  const userContext = await getUserGrowthContext(userId);

  const personalizationResult = userContext
    ? actionPersonalizationEngine.selectTodayAction({
        currentStageActions: currentStageDef.actions,
        completedTodayActionId: completedTodayRecord?.actionId,
        context: userContext,
      })
    : {
        selectedAction: currentStageDef.actions[0],
        isCompletedToday: !!completedTodayRecord,
        personalizationReason: null,
        appliedRule: 'DEFAULT_SEQUENCE' as const,
      };

  const selectedActionDef = personalizationResult.selectedAction;
  const selectedActionStatus: ActionStatus = personalizationResult.isCompletedToday ? 'DONE' : 'PENDING';
  const isCompletedToday = personalizationResult.isCompletedToday;
  const personalizationReason = personalizationResult.personalizationReason;

  const metadata = selectedActionDef ? getActionMetadata(selectedActionDef) : { whyThisMatters: '', instruction: '' };

  const todayActionView: TodayActionView | null = selectedActionDef
    ? {
        action: selectedActionDef,
        status: selectedActionStatus,
        isCompletedToday,
        date: todayStr,
        stageOrder: currentStage.order,
        stageTitle: currentStage.title,
        stageGoal: currentStage.goal,
        pathSlug: pathDef.slug,
        pathTitle: pathDef.title,
        whyThisMatters: metadata.whyThisMatters,
        instruction: metadata.instruction,
        personalizationReason,
      }
    : null;

  // Build Recent Activity list from real progress records
  const recentRecords = [...progressRecords]
    .filter((r) => r.status === 'DONE')
    .sort((a, b) => (b.completedAt || b.date).localeCompare(a.completedAt || a.date))
    .slice(0, 5);

  const actionMap = new Map<string, ActionDefinition>();
  for (const stg of pathDef.stages) {
    for (const act of stg.actions) {
      actionMap.set(act.id, act);
    }
  }

  const recentActivities: RecentActivityItem[] = recentRecords.map((rec) => {
    const act = actionMap.get(rec.actionId);
    return {
      id: rec.id,
      actionId: rec.actionId,
      title: act?.title || 'اقدام رشد',
      date: rec.date,
      dateLabel: formatDateLabel(rec.date, todayStr),
      status: rec.status,
      completedAt: rec.completedAt,
    };
  });

  const displayName = user.name || user.email.split('@')[0] || 'همراه گرامی';

  // Current stage progress
  const stageDoneCount = currentStage.actions.filter((a) => a.status === 'DONE').length;
  const stageProgressLabel = `${stageDoneCount} از ${currentStage.actions.length} اقدام این مرحله`;

  // Latest Action Report (Requirement 7)
  const userReports = await actionReportRepository.findByUserId(userId, 1);
  const latestReport = userReports.length > 0
    ? {
        id: userReports[0].id,
        actionTitle: userReports[0].actionTitle,
        dateLabel: userReports[0].dateLabel || 'به تازگی',
        textPreview: userReports[0].text
          ? userReports[0].text.length > 100
            ? userReports[0].text.slice(0, 100) + '...'
            : userReports[0].text
          : '',
        imageUrl: userReports[0].images?.[0]?.imageUrl || null,
      }
    : null;

  // Weekly reflection status (Requirement 8)
  const { weekStart, weekEnd, weekLabel } = getDeterministicWeekRange();
  const currentWeekReflection = await weeklyReflectionRepository.findByUserAndWeek(userId, weekStart);
  const weeklyReflection = {
    isCompleted: !!currentWeekReflection,
    weekLabel,
    nextWeekFocus: currentWeekReflection?.nextWeekFocus || undefined,
  };

  // Next Step determination (Requirement 11)
  let nextStep = {
    label: 'اقدام امروز را انجام بده.',
    actionPath: '/dashboard/action',
    actionText: 'شروع اقدام',
    reason: 'یک گام کوچک و مشخص در انتظار شروع توست.',
  };

  if (isCompletedToday) {
    const hasReportForToday = userReports.some((r) => r.actionId === todayActionView?.action.id);
    if (!hasReportForToday) {
      nextStep = {
        label: 'اگر دوست داری، تجربه‌ات را ثبت کن.',
        actionPath: '/dashboard/action',
        actionText: 'ثبت گزارش',
        reason: 'ثبت تجربه باعث می‌شود آنچه یاد گرفتی به بخشی از حافظه رشد تو تبدیل شود.',
      };
    } else if (!weeklyReflection.isCompleted && progressRecords.filter((r) => r.status === 'DONE').length >= 1) {
      nextStep = {
        label: 'مرور این هفته را انجام بده.',
        actionPath: '/reflection/weekly',
        actionText: 'مرور مسیر',
        reason: 'چند دقیقه مکث برای نگاه به کل هفته و انتخاب تمرکز بعدی.',
      };
    } else if (currentStage.actions.every((a) => a.status === 'DONE')) {
      nextStep = {
        label: 'مرحله بعدی آماده است.',
        actionPath: '/growth-path',
        actionText: 'مشاهده مسیر رشد',
        reason: 'تمام اقدامات این مرحله را پشت سر گذاشتی؛ آماده ورود به مرحله بعد باش.',
      };
    } else {
      nextStep = {
        label: 'برای گام فردا آماده باش.',
        actionPath: '/growth-path',
        actionText: 'بررسی مسیر',
        reason: 'امروز قدمت را برداشتی؛ فردا با آرامش گام بعد را ادامه بده.',
      };
    }
  }

  // Reminder status (Section 9)
  const reminderEvaluation = await reminderEligibilityService.evaluateReminder(userId, new Date(), {
    isCompletedToday,
  });
  const reminderStatus = {
    enabled: reminderEvaluation.preference.enabled,
    preferredTime: reminderEvaluation.preference.preferredTime,
    hasReminder: reminderEvaluation.opportunity.hasReminder,
    message: reminderEvaluation.opportunity.hasReminder ? reminderEvaluation.opportunity.message : null,
    type: reminderEvaluation.opportunity.type,
  };

  const dashboardView: DashboardDataView = {
    user: {
      id: user.id,
      name: displayName,
      email: user.email,
    },
    greeting: {
      title: `سلام، ${displayName}`,
      contextLine: isCompletedToday
        ? 'اقدام امروز با موفقیت تکمیل شد. یک قدم کوچک، اما واقعی.'
        : 'امروز فقط روی قدم بعدی تمرکز کن.',
    },
    path: {
      slug: pathDef.slug,
      title: pathDef.title,
      description: pathDef.description,
    },
    currentStage: {
      order: currentStage.order,
      totalStages: pathDef.stages.length,
      title: currentStage.title,
      subtitle: currentStage.subtitle,
      goal: currentStage.goal,
      stageLabel: `مرحله ${currentStage.order} از ${pathDef.stages.length} — ${currentStage.title}`,
      stageProgressLabel,
    },
    todayAction: todayActionView,
    progress: {
      percent: pathView.percentProgress,
      completedActions: pathView.completedActionsCount,
      totalActions: pathView.totalActionsCount,
      progressLabel: `${pathView.completedActionsCount} از ${pathView.totalActionsCount} اقدام`,
    },
    recentActivities,
    nextStep,
    latestReport,
    weeklyReflection,
    reminderStatus,
  };

  return {
    success: true,
    authenticated: true,
    data: dashboardView,
  };
}

/**
 * Loads Today's Action for /dashboard/action
 */
export async function getTodayActionUseCase(userId: string): Promise<GetTodayActionResult> {
  const dashResult = await getDashboardDataUseCase(userId);
  if (!dashResult.success || !dashResult.data) {
    return {
      success: false,
      authenticated: dashResult.authenticated,
      redirectTo: dashResult.redirectTo,
      error: dashResult.error,
    };
  }

  return {
    success: true,
    authenticated: true,
    todayAction: dashResult.data.todayAction,
  };
}

/**
 * Completes today's primary action using the persisted progress system.
 */
export async function completeTodayActionUseCase(
  userId: string,
  actionId?: string
): Promise<CompleteTodayActionResult> {
  if (!userId) {
    return {
      success: false,
      authenticated: false,
      error: 'کاربر احراز هویت نشده است.',
    };
  }

  const todayStr = getTodayDateString();

  // Find user path
  let pathSlug = 'discipline';
  const growthProfile = await growthProfileRepository.findByUserId(userId);
  if (growthProfile && growthProfile.recommendedPath?.slug) {
    pathSlug = growthProfile.recommendedPath.slug;
  }

  const pathDef = getGrowthPathDefinition(pathSlug);
  const userGrowthPath = await growthPathRepository.getOrCreateUserGrowthPath(userId, pathSlug);
  const progressRecords = await growthPathRepository.findAllActionsProgressForPath(
    userId,
    userGrowthPath.id
  );

  const pathView = growthProgressEngine.calculateProgress({
    pathDef,
    userGrowthPath,
    progressRecords,
  });

  let targetActionId = actionId;
  if (!targetActionId) {
    // Select the first pending action in the current stage
    const pending = pathView.currentStage.actions.find((a) => a.status !== 'DONE');
    if (pending) {
      targetActionId = pending.id;
    } else {
      // Fallback to first action in current stage
      targetActionId = pathView.currentStage.actions[0]?.id;
    }
  }

  if (!targetActionId) {
    return {
      success: false,
      authenticated: true,
      error: 'اقدامی برای تکمیل یافت نشد.',
    };
  }

  // Persist completion using existing growthPathRepository
  await growthPathRepository.upsertActionProgress({
    userGrowthPathId: userGrowthPath.id,
    userId,
    actionId: targetActionId,
    date: todayStr,
    status: 'DONE',
  });

  // Re-fetch and re-calculate
  const updatedRecords = await growthPathRepository.findAllActionsProgressForPath(
    userId,
    userGrowthPath.id
  );

  const updatedView = growthProgressEngine.calculateProgress({
    pathDef,
    userGrowthPath,
    progressRecords: updatedRecords,
  });

  let completedActionDef: ActionDefinition | null = null;
  let actionStage = pathDef.stages.find((s) => s.order === userGrowthPath.currentStageOrder) || pathDef.stages[0];
  for (const stg of pathDef.stages) {
    const found = stg.actions.find((a) => a.id === targetActionId);
    if (found) {
      completedActionDef = found;
      actionStage = stg;
      break;
    }
  }
  if (!completedActionDef) {
    completedActionDef = pathDef.stages[0].actions[0];
  }
  const metadata = getActionMetadata(completedActionDef);

  const todayActionView: TodayActionView = {
    action: completedActionDef,
    status: 'DONE',
    isCompletedToday: true,
    date: todayStr,
    stageOrder: actionStage.order,
    stageTitle: actionStage.title,
    stageGoal: actionStage.goal,
    pathSlug: pathDef.slug,
    pathTitle: pathDef.title,
    whyThisMatters: metadata.whyThisMatters,
    instruction: metadata.instruction,
  };

  return {
    success: true,
    authenticated: true,
    todayAction: todayActionView,
    percentProgress: updatedView.percentProgress,
    completedActionsCount: updatedView.completedActionsCount,
    totalActionsCount: updatedView.totalActionsCount,
  };
}

/**
 * Marks today's action as skipped for the date.
 */
export async function skipTodayActionUseCase(
  userId: string,
  actionId?: string
): Promise<CompleteTodayActionResult> {
  const user = await userRepository.findById(userId);
  if (!user) {
    return {
      success: false,
      authenticated: false,
      redirectTo: '/login',
      error: 'کاربر یافت نشد.',
    };
  }

  const growthProfile = await growthProfileRepository.findByUserId(userId);
  let pathSlug = 'discipline';
  if (growthProfile && growthProfile.recommendedPath && growthProfile.recommendedPath.slug) {
    pathSlug = growthProfile.recommendedPath.slug;
  }

  const pathDef = getGrowthPathDefinition(pathSlug);
  const userGrowthPath = await growthPathRepository.getOrCreateUserGrowthPath(userId, pathSlug);

  const progressRecords = await growthPathRepository.findAllActionsProgressForPath(
    userId,
    userGrowthPath.id
  );

  const pathView = growthProgressEngine.calculateProgress({
    pathDef,
    userGrowthPath,
    progressRecords,
  });

  const todayStr = getTodayDateString();

  let targetActionId = actionId;
  if (!targetActionId) {
    const pending = pathView.currentStage.actions.find(
      (a) => a.status !== 'DONE' && a.status !== 'SKIPPED'
    );
    targetActionId = pending ? pending.id : pathView.currentStage.actions[0]?.id;
  }

  if (!targetActionId) {
    return {
      success: false,
      authenticated: true,
      error: 'اقدامی برای رد کردن یافت نشد.',
    };
  }

  await growthPathRepository.upsertActionProgress({
    userGrowthPathId: userGrowthPath.id,
    userId,
    actionId: targetActionId,
    date: todayStr,
    status: 'SKIPPED',
  });

  const updatedRecords = await growthPathRepository.findAllActionsProgressForPath(
    userId,
    userGrowthPath.id
  );

  const updatedView = growthProgressEngine.calculateProgress({
    pathDef,
    userGrowthPath,
    progressRecords: updatedRecords,
  });

  return {
    success: true,
    authenticated: true,
    percentProgress: updatedView.percentProgress,
    completedActionsCount: updatedView.completedActionsCount,
    totalActionsCount: updatedView.totalActionsCount,
  };
}
