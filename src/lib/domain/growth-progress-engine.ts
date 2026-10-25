import {
  GrowthPathDefinition,
  UserGrowthPath,
  UserActionProgress,
  StageWithProgress,
  ActionWithProgress,
  UserGrowthPathView,
  StageProgressStatus,
} from './growth-path.entity';

export class GrowthProgressEngine {
  /**
   * Transforms system definitions and user records into a unified UserGrowthPathView
   */
  public calculateProgress(params: {
    pathDef: GrowthPathDefinition;
    userGrowthPath: UserGrowthPath;
    progressRecords: UserActionProgress[];
  }): UserGrowthPathView {
    const { pathDef, userGrowthPath, progressRecords } = params;

    // Create a map of actionId -> latest progress
    const progressMap = new Map<string, UserActionProgress>();
    for (const record of progressRecords) {
      const existing = progressMap.get(record.actionId);
      if (!existing || record.date >= existing.date) {
        progressMap.set(record.actionId, record);
      }
    }

    let overallTotalActions = 0;
    let overallCompletedActions = 0;

    const stagesWithProgress: StageWithProgress[] = pathDef.stages.map((stage) => {
      let stageCompletedCount = 0;

      const actionsWithProgress: ActionWithProgress[] = stage.actions.map((action) => {
        const userProgress = progressMap.get(action.id);
        const status = userProgress ? userProgress.status : 'PENDING';
        if (status === 'DONE') {
          stageCompletedCount++;
          overallCompletedActions++;
        }
        overallTotalActions++;

        return {
          ...action,
          status,
          completedAt: userProgress?.completedAt || null,
          progressId: userProgress?.id,
          date: userProgress?.date,
        };
      });

      const isStageComplete =
        actionsWithProgress.length > 0 && stageCompletedCount === actionsWithProgress.length;

      let stageStatus: StageProgressStatus;
      if (stage.order < userGrowthPath.currentStageOrder) {
        stageStatus = 'COMPLETED';
      } else if (stage.order === userGrowthPath.currentStageOrder) {
        stageStatus = 'ACTIVE';
      } else {
        stageStatus = 'LOCKED';
      }

      return {
        id: stage.id,
        order: stage.order,
        title: stage.title,
        subtitle: stage.subtitle,
        goal: stage.goal,
        coreConcept: stage.coreConcept,
        completionCriteria: stage.completionCriteria,
        nextStageTransition: stage.nextStageTransition,
        status: stageStatus,
        actions: actionsWithProgress,
        completedActionsCount: stageCompletedCount,
        totalActionsCount: actionsWithProgress.length,
        isStageComplete,
      };
    });

    const currentStage =
      stagesWithProgress.find((s) => s.order === userGrowthPath.currentStageOrder) ||
      stagesWithProgress[0];

    const percentProgress =
      overallTotalActions > 0
        ? Math.round((overallCompletedActions / overallTotalActions) * 100)
        : 0;

    const isPathCompleted =
      userGrowthPath.isCompleted ||
      (userGrowthPath.currentStageOrder >= pathDef.stages.length && currentStage.isStageComplete);

    return {
      path: pathDef,
      currentStageOrder: userGrowthPath.currentStageOrder,
      currentStage,
      stages: stagesWithProgress,
      totalActionsCount: overallTotalActions,
      completedActionsCount: overallCompletedActions,
      percentProgress,
      isPathCompleted,
    };
  }
}

export const growthProgressEngine = new GrowthProgressEngine();
