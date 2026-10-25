export type ActionStatus = 'PENDING' | 'DONE' | 'SKIPPED';

export type StageProgressStatus = 'COMPLETED' | 'ACTIVE' | 'LOCKED';

export type ActionType = 'observation' | 'habit' | 'execution' | 'review';
export type ActionDifficulty = 'easy' | 'moderate' | 'deep';

export interface ActionDefinition {
  id: string;
  stageId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  order: number;
  type?: ActionType;
  required?: boolean;
  difficulty?: ActionDifficulty;
  tags?: string[];
  suitableFor?: string[];
}

export interface StageDefinition {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  goal: string;
  coreConcept?: string;
  completionCriteria?: string;
  nextStageTransition?: string;
  actions: ActionDefinition[];
}

export interface GrowthPathDefinition {
  slug: string;
  title: string;
  description: string;
  stages: StageDefinition[];
}

export interface UserGrowthPath {
  id: string;
  userId: string;
  pathSlug: string;
  currentStageOrder: number;
  isCompleted: boolean;
  startedAt: string;
  completedAt: string | null;
  updatedAt: string;
}

export interface UserActionProgress {
  id: string;
  userGrowthPathId: string;
  userId: string;
  actionId: string;
  date: string; // YYYY-MM-DD
  status: ActionStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActionWithProgress extends ActionDefinition {
  status: ActionStatus;
  completedAt: string | null;
  progressId?: string;
  date?: string;
}

export interface StageWithProgress extends Omit<StageDefinition, 'actions'> {
  status: StageProgressStatus;
  actions: ActionWithProgress[];
  completedActionsCount: number;
  totalActionsCount: number;
  isStageComplete: boolean;
}

export interface UserGrowthPathView {
  path: GrowthPathDefinition;
  currentStageOrder: number;
  currentStage: StageWithProgress;
  stages: StageWithProgress[];
  totalActionsCount: number;
  completedActionsCount: number;
  percentProgress: number;
  isPathCompleted: boolean;
}
