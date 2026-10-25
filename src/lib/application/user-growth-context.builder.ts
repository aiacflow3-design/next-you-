import { userRepository } from '../repositories/user.repository';
import { onboardingRepository } from '../repositories/onboarding.repository';
import { growthProfileRepository } from '../repositories/growth-profile.repository';
import { growthPathRepository } from '../repositories/growth-path.repository';
import { actionReportRepository } from '../repositories/action-report.repository';
import {
  weeklyReflectionRepository,
  getDeterministicWeekRange,
} from '../repositories/weekly-reflection.repository';
import { getGrowthPathDefinition } from '../domain/growth-path-definitions';
import { UserGrowthContext } from '../domain/personalization.types';

/**
 * Parses user-selected available time into numeric minutes
 */
export function parseAvailableMinutes(timeStr?: string | null): number {
  if (!timeStr) return 15;
  const str = timeStr.toLowerCase();

  if (str.includes('5') || str.includes('۵')) return 5;
  if (str.includes('10') || str.includes('۱۰')) return 10;
  if (str.includes('15') || str.includes('۱۵')) return 15;
  if (str.includes('30') || str.includes('۳۰') || str.includes('بیش')) return 30;

  return 15;
}

/**
 * Centralized, strongly-typed user growth context builder.
 * Aggregates all deterministic user context without duplicating business logic across pages.
 */
export async function getUserGrowthContext(userId: string): Promise<UserGrowthContext | null> {
  const user = await userRepository.findById(userId);
  if (!user) return null;

  const onboarding = await onboardingRepository.findByUserId(userId);
  const profile = await growthProfileRepository.findByUserId(userId);

  // Active path and stage
  let pathSlug = 'discipline';
  if (profile && profile.recommendedPath?.slug) {
    pathSlug = profile.recommendedPath.slug;
  }

  const pathDef = getGrowthPathDefinition(pathSlug);
  const userGrowthPath = await growthPathRepository.getOrCreateUserGrowthPath(userId, pathSlug);

  const stage = pathDef.stages.find((s) => s.order === userGrowthPath.currentStageOrder) || pathDef.stages[0];

  // Action history signals
  const allActionProgress = await growthPathRepository.findAllActionsProgressForUser(userId);
  const completedActionIds = allActionProgress
    .filter((p) => p.status === 'DONE')
    .map((p) => p.actionId);
  const skippedActionIds = allActionProgress
    .filter((p) => p.status === 'SKIPPED')
    .map((p) => p.actionId);

  // Recent reports
  const recentReports = await actionReportRepository.findByUserId(userId, 5);

  // Weekly reflection
  const { weekStart } = getDeterministicWeekRange();
  const weeklyReflection = await weeklyReflectionRepository.findByUserAndWeek(userId, weekStart);

  const availableMinutes = parseAvailableMinutes(onboarding?.availableTime);

  return {
    userId: user.id,
    name: user.name || user.email.split('@')[0],
    email: user.email,
    onboarding,
    availableMinutes,
    primaryGoal: onboarding?.primaryGoal || 'رشد فردی',
    mainObstacle: onboarding?.mainObstacle || 'مقاومت در شروع',
    consistencyPattern: onboarding?.consistencyPattern || 'شروع پرانرژی',
    desiredSupport: onboarding?.desiredSupport || 'گام‌های روزانه',
    profile,
    currentPathSlug: pathSlug,
    currentPathTitle: pathDef.title,
    currentStageOrder: stage.order,
    currentStageTitle: stage.title,
    completedActionIds,
    skippedActionIds,
    recentReports,
    weeklyReflection,
  };
}
