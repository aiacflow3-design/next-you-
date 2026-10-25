import { ActionDefinition } from './growth-path.entity';
import { UserGrowthContext, ActionPersonalizationResult } from './personalization.types';

export class ActionPersonalizationEngine {
  /**
   * Deterministically selects the most relevant action for today based on real user context.
   */
  public selectTodayAction(params: {
    currentStageActions: ActionDefinition[];
    completedTodayActionId?: string | null;
    context: UserGrowthContext;
  }): ActionPersonalizationResult {
    const { currentStageActions, completedTodayActionId, context } = params;

    // 1. If an action was completed today, show it as completed
    if (completedTodayActionId) {
      const found = currentStageActions.find((a) => a.id === completedTodayActionId) || currentStageActions[0];
      return {
        selectedAction: found,
        isCompletedToday: true,
        personalizationReason: null,
        appliedRule: 'DEFAULT_SEQUENCE',
      };
    }

    // 2. Identify remaining pending actions in current stage
    const pendingActions = currentStageActions.filter(
      (a) => !context.completedActionIds.includes(a.id)
    );

    // If all actions in stage are done
    if (pendingActions.length === 0) {
      const lastAction = currentStageActions[currentStageActions.length - 1];
      return {
        selectedAction: lastAction,
        isCompletedToday: true,
        personalizationReason: null,
        appliedRule: 'DEFAULT_SEQUENCE',
      };
    }

    // If only one action is pending, no decision needed
    if (pendingActions.length === 1) {
      return {
        selectedAction: pendingActions[0],
        isCompletedToday: false,
        personalizationReason: null,
        appliedRule: 'DEFAULT_SEQUENCE',
      };
    }

    // Multiple pending actions available: apply deterministic rules
    let candidates = [...pendingActions];

    // Rule 1: Skip Avoidance — if user skipped an action, don't force it immediately if other actions exist
    const nonSkipped = candidates.filter((a) => !context.skippedActionIds.includes(a.id));
    if (nonSkipped.length > 0 && nonSkipped.length < candidates.length) {
      candidates = nonSkipped;
    }

    // Rule 2: Time Constraint Match
    // If available time is 10 minutes or less, prioritize actions with shortest estimatedMinutes
    if (context.availableMinutes <= 10) {
      const shortAction = candidates.find((a) => a.estimatedMinutes <= 5);
      if (shortAction && shortAction.id !== candidates[0].id) {
        return {
          selectedAction: shortAction,
          isCompletedToday: false,
          personalizationReason: 'با توجه به زمان در دسترس شما (تا ۱۰ دقیقه)، این اقدام کوتاه‌تر برای امروز در اولویت قرار گرفت.',
          appliedRule: 'TIME_CONSTRAINT',
        };
      }
    }

    // Rule 3: Obstacle Match
    // If user's main obstacle involves starting or procrastination, prioritize friction-reduction action
    const obstacle = (context.mainObstacle || '').toLowerCase();
    if (obstacle.includes('شروع') || obstacle.includes('تعویق') || obstacle.includes('اهمال')) {
      const frictionAction = candidates.find(
        (a) => a.tags?.includes('friction-reduction') || a.tags?.includes('micro-start')
      );
      if (frictionAction && frictionAction.id !== candidates[0].id) {
        return {
          selectedAction: frictionAction,
          isCompletedToday: false,
          personalizationReason: 'با توجه به مانع اصلی در شروع کارها، این اقدام متمرکز بر کاهش اصطکاک آغاز پیشنهاد شد.',
          appliedRule: 'OBSTACLE_MATCH',
        };
      }
    }

    // Fallback: Default sequential order
    return {
      selectedAction: candidates[0],
      isCompletedToday: false,
      personalizationReason: null,
      appliedRule: 'DEFAULT_SEQUENCE',
    };
  }
}

export const actionPersonalizationEngine = new ActionPersonalizationEngine();
