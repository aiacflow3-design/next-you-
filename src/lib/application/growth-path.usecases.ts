import { growthPathRepository } from '../repositories/growth-path.repository';
import { growthProfileRepository } from '../repositories/growth-profile.repository';
import { getGrowthPathDefinition } from '../domain/growth-path-definitions';
import { growthProgressEngine } from '../domain/growth-progress-engine';
import {
  ActionStatus,
  UserGrowthPathView,
} from '../domain/growth-path.entity';

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Loads the authenticated user's recommended Growth Path and its complete progress
 */
export async function getUserGrowthPathUseCase(userId: string): Promise<{
  success: boolean;
  data?: UserGrowthPathView;
  error?: string;
}> {
  if (!userId) {
    return { success: false, error: 'کاربر احراز هویت نشده است.' };
  }

  // Retrieve user's persisted recommendation
  let pathSlug = 'discipline';
  const growthProfile = await growthProfileRepository.findByUserId(userId);
  if (growthProfile && growthProfile.recommendedPath && growthProfile.recommendedPath.slug) {
    pathSlug = growthProfile.recommendedPath.slug;
  }

  const pathDef = getGrowthPathDefinition(pathSlug);
  const userGrowthPath = await growthPathRepository.getOrCreateUserGrowthPath(userId, pathSlug);
  const progressRecords = await growthPathRepository.findAllActionsProgressForPath(
    userId,
    userGrowthPath.id
  );

  const view = growthProgressEngine.calculateProgress({
    pathDef,
    userGrowthPath,
    progressRecords,
  });

  return { success: true, data: view };
}

/**
 * Marks an action as completed (or skipped / pending) for the authenticated user
 */
export async function updateActionProgressUseCase(params: {
  userId: string;
  actionId: string;
  status: ActionStatus;
  date?: string;
}): Promise<{
  success: boolean;
  data?: UserGrowthPathView;
  error?: string;
}> {
  const { userId, actionId, status } = params;
  if (!userId) {
    return { success: false, error: 'کاربر احراز هویت نشده است.' };
  }

  const date = params.date || getTodayDateString();

  // Retrieve user's path
  let pathSlug = 'discipline';
  const growthProfile = await growthProfileRepository.findByUserId(userId);
  if (growthProfile && growthProfile.recommendedPath && growthProfile.recommendedPath.slug) {
    pathSlug = growthProfile.recommendedPath.slug;
  }

  const pathDef = getGrowthPathDefinition(pathSlug);
  const userGrowthPath = await growthPathRepository.getOrCreateUserGrowthPath(userId, pathSlug);

  // Validate that action exists and belongs to current or completed stage (not locked future stage)
  let targetStageOrder = -1;
  let actionExists = false;

  for (const stage of pathDef.stages) {
    const found = stage.actions.some((a) => a.id === actionId);
    if (found) {
      targetStageOrder = stage.order;
      actionExists = true;
      break;
    }
  }

  if (!actionExists) {
    return { success: false, error: 'اقدام مورد نظر در این مسیر یافت نشد.' };
  }

  // Prevent users from marking actions in locked future stages
  if (targetStageOrder > userGrowthPath.currentStageOrder) {
    return {
      success: false,
      error: 'برای ثبت این اقدام، ابتدا باید مراحل قبلی مسیر را تکمیل کنید.',
    };
  }

  // Upsert user action progress
  await growthPathRepository.upsertActionProgress({
    userGrowthPathId: userGrowthPath.id,
    userId,
    actionId,
    date,
    status,
  });

  // Re-fetch all progress and calculate new view
  const progressRecords = await growthPathRepository.findAllActionsProgressForPath(
    userId,
    userGrowthPath.id
  );

  const view = growthProgressEngine.calculateProgress({
    pathDef,
    userGrowthPath,
    progressRecords,
  });

  return { success: true, data: view };
}

/**
 * Advances user to the next stage if all actions in current stage are completed
 */
export async function advanceStageIfCompleteUseCase(userId: string): Promise<{
  success: boolean;
  advanced: boolean;
  data?: UserGrowthPathView;
  error?: string;
}> {
  if (!userId) {
    return { success: false, advanced: false, error: 'کاربر احراز هویت نشده است.' };
  }

  let pathSlug = 'discipline';
  const growthProfile = await growthProfileRepository.findByUserId(userId);
  if (growthProfile && growthProfile.recommendedPath && growthProfile.recommendedPath.slug) {
    pathSlug = growthProfile.recommendedPath.slug;
  }

  const pathDef = getGrowthPathDefinition(pathSlug);
  const userGrowthPath = await growthPathRepository.getOrCreateUserGrowthPath(userId, pathSlug);
  const progressRecords = await growthPathRepository.findAllActionsProgressForPath(
    userId,
    userGrowthPath.id
  );

  const view = growthProgressEngine.calculateProgress({
    pathDef,
    userGrowthPath,
    progressRecords,
  });

  if (!view.currentStage.isStageComplete) {
    return {
      success: false,
      advanced: false,
      error: 'تمام اقدامات این مرحله هنوز تکمیل نشده‌اند.',
      data: view,
    };
  }

  const nextStageOrder = userGrowthPath.currentStageOrder + 1;
  const isFinalStage = nextStageOrder > pathDef.stages.length;

  if (isFinalStage) {
    await growthPathRepository.updateStageOrder(userGrowthPath.id, pathDef.stages.length, true);
  } else {
    await growthPathRepository.updateStageOrder(userGrowthPath.id, nextStageOrder, false);
  }

  // Re-fetch updated path
  const updatedUserGrowthPath = await growthPathRepository.getOrCreateUserGrowthPath(
    userId,
    pathSlug
  );
  const updatedRecords = await growthPathRepository.findAllActionsProgressForPath(
    userId,
    updatedUserGrowthPath.id
  );

  const updatedView = growthProgressEngine.calculateProgress({
    pathDef,
    userGrowthPath: updatedUserGrowthPath,
    progressRecords: updatedRecords,
  });

  return {
    success: true,
    advanced: true,
    data: updatedView,
  };
}
