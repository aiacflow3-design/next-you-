import { getDatabase } from '../db/database';
import { userRepository } from '../repositories/user.repository';
import { growthProfileRepository } from '../repositories/growth-profile.repository';
import { growthPathRepository } from '../repositories/growth-path.repository';
import { actionReportRepository } from '../repositories/action-report.repository';
import {
  weeklyReflectionRepository,
  getDeterministicWeekRange,
} from '../repositories/weekly-reflection.repository';
import {
  WeeklyReflection,
  WeeklyReflectionView,
  SaveWeeklyReflectionDTO,
} from '../domain/weekly-reflection.entity';
import { getGrowthPathDefinition } from '../domain/growth-path-definitions';
import { ActionReport } from '../domain/action-report.entity';

export interface GetWeeklyReflectionResult {
  success: boolean;
  authenticated: boolean;
  data?: WeeklyReflectionView;
  error?: string;
}

export interface SaveWeeklyReflectionResult {
  success: boolean;
  authenticated: boolean;
  reflection?: WeeklyReflection;
  error?: string;
}

export async function getWeeklyReflectionOverviewUseCase(
  userId: string
): Promise<GetWeeklyReflectionResult> {
  const user = await userRepository.findById(userId);
  if (!user) {
    return { success: false, authenticated: false, error: 'کاربر معتبر نیست.' };
  }

  const { weekStart, weekEnd, weekLabel } = getDeterministicWeekRange();
  const db = await getDatabase();

  // 1. Path & Stage information
  let pathSlug = 'discipline';
  const growthProfile = await growthProfileRepository.findByUserId(userId);
  if (growthProfile && growthProfile.recommendedPath && growthProfile.recommendedPath.slug) {
    pathSlug = growthProfile.recommendedPath.slug;
  }

  const pathDef = getGrowthPathDefinition(pathSlug);
  const userGrowthPath = await growthPathRepository.getOrCreateUserGrowthPath(userId, pathSlug);
  const pathTitle = pathDef.title;
  const stage = pathDef.stages.find((s) => s.order === userGrowthPath.currentStageOrder);
  const stageTitle = stage?.title || 'مرحله اول';
  const stageOrder = stage?.order || 1;

  // 2. Count actions completed this week
  const actionStmt = db.prepare(
    `SELECT COUNT(*) as count FROM user_action_progress
     WHERE user_id = :userId AND status = 'DONE' AND date >= :weekStart AND date <= :weekEnd`
  );
  actionStmt.bind({ ':userId': userId, ':weekStart': weekStart, ':weekEnd': weekEnd });
  let completedActionsCount = 0;
  if (actionStmt.step()) {
    completedActionsCount = Number(actionStmt.getAsObject().count || 0);
  }
  actionStmt.free();

  // 3. Action reports written this week
  const allUserReports = await actionReportRepository.findByUserId(userId);
  const weekReports: ActionReport[] = allUserReports.filter((r) => {
    const reportDate = r.createdAt.split('T')[0];
    return reportDate >= weekStart && reportDate <= weekEnd;
  });

  // 4. Current week reflection if already created
  const currentReflection = await weeklyReflectionRepository.findByUserAndWeek(userId, weekStart);

  // 5. Previous reflections history
  const allReflections = await weeklyReflectionRepository.findHistoryByUserId(userId);
  const previousReflections = allReflections.filter((r) => r.weekStart !== weekStart);

  return {
    success: true,
    authenticated: true,
    data: {
      currentWeek: {
        weekStart,
        weekEnd,
        weekLabel,
      },
      summary: {
        completedActionsCount,
        reportsCount: weekReports.length,
        currentStageTitle: stageTitle,
        currentStageOrder: stageOrder,
        pathTitle,
        weekStart,
        weekEnd,
        weekLabel,
      },
      weekReports,
      currentReflection,
      previousReflections,
    },
  };
}

export async function saveWeeklyReflectionUseCase(
  userId: string,
  dto: SaveWeeklyReflectionDTO
): Promise<SaveWeeklyReflectionResult> {
  const user = await userRepository.findById(userId);
  if (!user) {
    return { success: false, authenticated: false, error: 'کاربر معتبر نیست.' };
  }

  if (!dto.weekStart || !dto.weekEnd) {
    return { success: false, authenticated: true, error: 'بازه هفته مشخص نشده است.' };
  }

  const reflection = await weeklyReflectionRepository.upsert(userId, dto);

  return {
    success: true,
    authenticated: true,
    reflection,
  };
}
