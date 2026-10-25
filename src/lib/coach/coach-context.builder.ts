import { userRepository } from '../repositories/user.repository';
import { onboardingRepository } from '../repositories/onboarding.repository';
import { growthProfileRepository } from '../repositories/growth-profile.repository';
import { getProgressOverviewUseCase } from '../application/progress.usecases';
import { getTodayActionUseCase } from '../application/dashboard.usecases';

export interface CoachUserContext {
  userName: string;
  onboarding: {
    primaryGoal: string;
    mainObstacle: string;
    availableTime: string;
    consistencyPattern: string;
    desiredSupport: string;
    futureSelfVision: string;
  } | null;
  growthProfile: {
    recommendedPath: string;
    disciplineScore?: number;
    focusScore?: number;
    confidenceScore?: number;
  } | null;
  path: {
    title: string;
    slug: string;
    overallProgress: number; // 0 - 100
    completedActionsCount: number;
    totalActionsCount: number;
  };
  currentStage: {
    order: number;
    title: string;
    subtitle: string;
    goal: string;
    completedActions: number;
    totalActions: number;
    remainingActions: number;
    isStageComplete: boolean;
  };
  todayAction: {
    id: string;
    title: string;
    description: string;
    estimatedMinutes: number;
    type?: string;
    isCompletedToday: boolean;
    personalizationReason?: string | null;
  } | null;
  recentActivity: Array<{
    actionTitle: string;
    stageTitle: string;
    dateLabel: string;
    date: string;
    status: 'DONE' | 'SKIPPED';
  }>;
  nextStepSummary: {
    title: string;
    description: string;
    type: string;
  };
}

/**
 * Builds a sanitized, high-signal, safe context for the AI Coach.
 * Excludes sensitive fields (passwords, tokens, internal IDs).
 * Never mutates system state.
 */
export async function buildCoachContext(userId: string): Promise<CoachUserContext | null> {
  if (!userId) return null;

  const user = await userRepository.findById(userId);
  if (!user) return null;

  const onboardingProfile = await onboardingRepository.findByUserId(userId);
  const growthProfile = await growthProfileRepository.findByUserId(userId);
  const progressResult = await getProgressOverviewUseCase(userId);
  const todayActionResult = await getTodayActionUseCase(userId);

  const userName =
    onboardingProfile?.name ||
    user.name ||
    user.email?.split('@')[0] ||
    'همراه گرامی';

  // Extract progress overview
  const progressData = progressResult.data;
  const pathTitle = progressData?.pathTitle || 'نظم شخصی';
  const pathSlug = progressData?.pathSlug || 'discipline';
  const overallProgress = progressData?.overallPathProgress ?? 0;
  const completedActionsCount = progressData?.completedPathActionsCount ?? 0;
  const totalActionsCount = progressData?.totalPathActionsCount ?? 12;

  // Extract current stage
  const stage = progressData?.currentStage;
  const currentStage = {
    order: stage?.stageOrder ?? 1,
    title: stage?.stageTitle ?? 'شناخت',
    subtitle: stage?.stageSubtitle ?? 'شناسایی الگوها',
    goal: stage?.stageGoal ?? 'شناخت نقاط اصطکاک و تعویق',
    completedActions: stage?.completedRequiredActions ?? 0,
    totalActions: stage?.totalRequiredActions ?? 3,
    remainingActions: stage?.remainingRequiredActions ?? 3,
    isStageComplete: stage?.isStageComplete ?? false,
  };

  // Extract today's action
  const todayAct = todayActionResult.todayAction;
  const todayAction = todayAct
    ? {
        id: todayAct.action.id,
        title: todayAct.action.title,
        description: todayAct.action.description,
        estimatedMinutes: todayAct.action.estimatedMinutes,
        type: todayAct.action.type,
        isCompletedToday: todayAct.isCompletedToday,
        personalizationReason: todayAct.personalizationReason || null,
      }
    : null;

  // Extract recent activity (last 5 records)
  const recentActivity = (progressData?.actionHistory || [])
    .slice(0, 5)
    .map((r) => ({
      actionTitle: r.actionTitle,
      stageTitle: r.stageTitle,
      dateLabel: r.dateLabel,
      date: r.date,
      status: r.status as 'DONE' | 'SKIPPED',
    }));

  const nextStepSummary = {
    title: progressData?.nextStep?.title || 'اقدام امروزت را انجام بده',
    description: progressData?.nextStep?.description || 'یک گام کوچک بردار.',
    type: progressData?.nextStep?.type || 'TODAY_ACTION',
  };

  return {
    userName,
    onboarding: onboardingProfile
      ? {
          primaryGoal: onboardingProfile.primaryGoal,
          mainObstacle: onboardingProfile.mainObstacle,
          availableTime: onboardingProfile.availableTime,
          consistencyPattern: onboardingProfile.consistencyPattern,
          desiredSupport: onboardingProfile.desiredSupport,
          futureSelfVision: onboardingProfile.futureSelfVision,
        }
      : null,
    growthProfile: growthProfile
      ? {
          recommendedPath:
            typeof growthProfile.recommendedPath === 'object' && growthProfile.recommendedPath !== null
              ? (growthProfile.recommendedPath as any).title || pathTitle
              : typeof growthProfile.recommendedPath === 'string' && growthProfile.recommendedPath
              ? growthProfile.recommendedPath
              : pathTitle,
          disciplineScore: growthProfile.traitScores?.discipline,
          focusScore: growthProfile.traitScores?.focus,
          confidenceScore: growthProfile.traitScores?.clarity,
        }
      : null,
    path: {
      title: pathTitle,
      slug: pathSlug,
      overallProgress,
      completedActionsCount,
      totalActionsCount,
    },
    currentStage,
    todayAction,
    recentActivity,
    nextStepSummary,
  };
}
