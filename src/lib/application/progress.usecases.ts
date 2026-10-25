import { userRepository } from '../repositories/user.repository';
import { growthProfileRepository } from '../repositories/growth-profile.repository';
import { assessmentRepository } from '../repositories/assessment.repository';
import { growthPathRepository } from '../repositories/growth-path.repository';
import { getGrowthPathDefinition } from '../domain/growth-path-definitions';
import { growthProgressEngine } from '../domain/growth-progress-engine';
import {
  ProgressOverviewView,
  ActionHistoryRecordView,
  RecentActivityItemView,
  ActivitySummaryView,
  CurrentStageProgressView,
  NextStepView,
} from '../domain/progress.entity';

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
  if (diffDays === 2) return '۲ روز پیش';
  if (diffDays > 2 && diffDays <= 7) return `${diffDays} روز پیش`;
  if (diffDays > 7 && diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} هفته پیش`;
  }
  return targetDate;
}

export interface GetProgressOverviewResult {
  success: boolean;
  authenticated: boolean;
  needsOnboarding?: boolean;
  needsAssessment?: boolean;
  redirectTo?: string;
  data?: ProgressOverviewView;
  error?: string;
}

/**
 * Loads the complete Progress & History overview for the authenticated user.
 * Progress calculations are 100% unified with the GrowthProgressEngine.
 */
export async function getProgressOverviewUseCase(userId: string): Promise<GetProgressOverviewResult> {
  if (!userId) {
    return {
      success: false,
      authenticated: false,
      redirectTo: '/login',
      error: 'برای مشاهده پیشرفت، ابتدا وارد حساب کاربری خود شوید.',
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

  if (!user.onboardingCompleted) {
    return {
      success: false,
      authenticated: true,
      needsOnboarding: true,
      redirectTo: '/onboarding',
      error: 'لطفاً ابتدا مرحله شناخت را تکمیل کنید.',
    };
  }

  const assessment = await assessmentRepository.findByUserId(userId);
  if (!assessment) {
    return {
      success: false,
      authenticated: true,
      needsAssessment: true,
      redirectTo: '/assessment/initial',
      error: 'لطفاً ابتدا ارزیابی اولیه را تکمیل کنید.',
    };
  }

  // Load User's Recommended Growth Path
  let pathSlug = 'discipline';
  const growthProfile = await growthProfileRepository.findByUserId(userId);
  if (growthProfile && growthProfile.recommendedPath && growthProfile.recommendedPath.slug) {
    pathSlug = growthProfile.recommendedPath.slug;
  }

  const pathDef = getGrowthPathDefinition(pathSlug);
  const userGrowthPath = await growthPathRepository.getOrCreateUserGrowthPath(userId, pathSlug);

  // Load progress records for the active path (Source of Truth)
  const pathRecords = await growthPathRepository.findAllActionsProgressForPath(
    userId,
    userGrowthPath.id
  );

  // Single Source of Truth for Progress calculations
  const pathView = growthProgressEngine.calculateProgress({
    pathDef,
    userGrowthPath,
    progressRecords: pathRecords,
  });

  const todayStr = getTodayDateString();

  // Load complete chronological action history for this user
  const allUserRecords = await growthPathRepository.findAllActionsProgressForUser(userId);

  // Map actions lookup for fast metadata retrieval
  const actionsMap = new Map<
    string,
    { title: string; stageId: string; stageTitle: string; stageOrder: number }
  >();

  for (const stage of pathDef.stages) {
    for (const act of stage.actions) {
      actionsMap.set(act.id, {
        title: act.title,
        stageId: stage.id,
        stageTitle: stage.title,
        stageOrder: stage.order,
      });
    }
  }

  // Filter and build chronological history (Date-aware, never merging multiple completions on different dates)
  const actionHistory: ActionHistoryRecordView[] = [];
  let doneCount = 0;
  let skippedCount = 0;

  for (const record of allUserRecords) {
    if (record.status === 'DONE') {
      doneCount++;
    } else if (record.status === 'SKIPPED') {
      skippedCount++;
    } else {
      continue; // Skip pending records from historical list
    }

    const info = actionsMap.get(record.actionId);
    actionHistory.push({
      id: record.id,
      actionId: record.actionId,
      actionTitle: info ? info.title : `اقدام (${record.actionId})`,
      stageId: info ? info.stageId : 'stage_unknown',
      stageTitle: info ? info.stageTitle : 'مرحله نامشخص',
      stageOrder: info ? info.stageOrder : 1,
      date: record.date,
      dateLabel: formatDateLabel(record.date, todayStr),
      status: record.status,
      completedAt: record.completedAt,
    });
  }

  // Build Recent Activity list (top 6 records)
  const recentActivity: RecentActivityItemView[] = actionHistory.slice(0, 6).map((item) => ({
    id: item.id,
    actionId: item.actionId,
    actionTitle: item.actionTitle,
    stageTitle: item.stageTitle,
    date: item.date,
    dateLabel: item.dateLabel,
    status: item.status,
    statusLabel: item.status === 'DONE' ? 'انجام شد' : 'رد شد',
  }));

  // Activity Summary
  const lastActivityDateLabel =
    actionHistory.length > 0 ? actionHistory[0].dateLabel : 'هنوز فعالیتی ثبت نشده';

  const activitySummary: ActivitySummaryView = {
    completedActionsCount: doneCount,
    skippedActionsCount: skippedCount,
    lastActivityDateLabel,
    hasActivity: actionHistory.length > 0,
  };

  // Current Stage
  const currentStageDef = pathView.currentStage;
  const totalRequired = currentStageDef.totalActionsCount;
  const completedRequired = currentStageDef.completedActionsCount;
  const remainingRequired = Math.max(0, totalRequired - completedRequired);
  const stageProgressPercent =
    totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;

  const currentStageView: CurrentStageProgressView = {
    stageId: currentStageDef.id,
    stageOrder: currentStageDef.order,
    stageTitle: currentStageDef.title,
    stageSubtitle: currentStageDef.subtitle,
    stageGoal: currentStageDef.goal,
    completedRequiredActions: completedRequired,
    totalRequiredActions: totalRequired,
    remainingRequiredActions: remainingRequired,
    stageProgressPercent,
    isStageComplete: currentStageDef.isStageComplete,
  };

  // Determine Next Step from real state
  let nextStep: NextStepView;

  if (pathView.isPathCompleted) {
    nextStep = {
      title: 'مسیر رشد فعلی کامل شده است',
      description:
        'تمام مراحل این مسیر با موفقیت پشت سر گذاشته شدند. سیستم شخصی تو اکنون تثبیت شده و آماده بهره‌برداری مداوم است.',
      ctaLabel: 'مشاهده مسیر رشد',
      ctaPath: '/growth-path',
      type: 'PATH_COMPLETED',
    };
  } else if (currentStageDef.isStageComplete) {
    nextStep = {
      title: 'وقت ورود به مرحله بعد است',
      description: `تمام اقدامات مرحله «${currentStageDef.title}» تکمیل شده‌اند. اکنون آماده‌ای برای ارتقا به مرحله بعد.`,
      ctaLabel: 'ورود به مرحله بعد',
      ctaPath: '/growth-path',
      type: 'ADVANCE_STAGE',
    };
  } else {
    // Check if an action was completed today
    const completedToday = allUserRecords.some(
      (r) => r.date === todayStr && r.status === 'DONE'
    );

    if (completedToday) {
      nextStep = {
        title: 'اقدام امروز با موفقیت انجام شد',
        description:
          'قدم ضروری امروز برداشته شد. تمرکزت را برای استمرار در روز بعد آماده نگه دار.',
        ctaLabel: 'مشاهده جزئیات اقدام',
        ctaPath: '/dashboard/action',
        type: 'TODAY_ACTION',
      };
    } else {
      const nextPendingAction =
        currentStageDef.actions.find((a) => a.status !== 'DONE') || currentStageDef.actions[0];

      nextStep = {
        title: 'اقدام امروزت را انجام بده',
        description: `امروز نوبت اقدام «${nextPendingAction?.title || 'اقدام روزانه'}» است. یک حرکت ساده و بدون اصطکاک.`,
        ctaLabel: 'انجام اقدام امروز',
        ctaPath: '/dashboard/action',
        type: 'TODAY_ACTION',
      };
    }
  }

  const isEmpty = actionHistory.length === 0;

  const overview: ProgressOverviewView = {
    pathSlug: pathDef.slug,
    pathTitle: pathDef.title,
    pathDescription: pathDef.description,
    overallPathProgress: pathView.percentProgress,
    totalPathActionsCount: pathView.totalActionsCount,
    completedPathActionsCount: pathView.completedActionsCount,
    currentStage: currentStageView,
    activitySummary,
    actionHistory,
    recentActivity,
    nextStep,
    isEmpty,
  };

  return {
    success: true,
    authenticated: true,
    data: overview,
  };
}
