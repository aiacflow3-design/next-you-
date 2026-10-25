import { ActionDefinition } from './growth-path.entity';
import { OnboardingProfile } from './onboarding.entity';
import { GrowthProfile } from './growth-profile.entity';
import { ActionReport } from './action-report.entity';
import { WeeklyReflection } from './weekly-reflection.entity';

export type AppliedPersonalizationRule =
  | 'TIME_CONSTRAINT'
  | 'OBSTACLE_MATCH'
  | 'SKIP_AVOIDANCE'
  | 'DEFAULT_SEQUENCE';

export interface UserGrowthContext {
  userId: string;
  name: string;
  email: string;
  onboarding: OnboardingProfile | null;
  availableMinutes: number; // e.g. 5, 10, 15, 30
  primaryGoal: string;
  mainObstacle: string;
  consistencyPattern: string;
  desiredSupport: string;
  profile: GrowthProfile | null;
  currentPathSlug: string;
  currentPathTitle: string;
  currentStageOrder: number;
  currentStageTitle: string;
  completedActionIds: string[];
  skippedActionIds: string[];
  recentReports: ActionReport[];
  weeklyReflection: WeeklyReflection | null;
}

export interface ActionPersonalizationResult {
  selectedAction: ActionDefinition;
  isCompletedToday: boolean;
  personalizationReason: string | null;
  appliedRule: AppliedPersonalizationRule;
}
