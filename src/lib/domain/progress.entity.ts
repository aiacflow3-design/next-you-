import { ActionStatus } from './growth-path.entity';

export interface ActionHistoryRecordView {
  id: string;
  actionId: string;
  actionTitle: string;
  stageId: string;
  stageTitle: string;
  stageOrder: number;
  date: string; // YYYY-MM-DD
  dateLabel: string; // 'امروز' | 'دیروز' | '۲ روز پیش' etc.
  status: ActionStatus;
  completedAt: string | null;
}

export interface RecentActivityItemView {
  id: string;
  actionId: string;
  actionTitle: string;
  stageTitle: string;
  date: string;
  dateLabel: string;
  status: ActionStatus;
  statusLabel: string; // 'انجام شد' | 'رد شد'
}

export interface ActivitySummaryView {
  completedActionsCount: number;
  skippedActionsCount: number;
  lastActivityDateLabel: string;
  hasActivity: boolean;
}

export interface CurrentStageProgressView {
  stageId: string;
  stageOrder: number;
  stageTitle: string;
  stageSubtitle: string;
  stageGoal: string;
  completedRequiredActions: number;
  totalRequiredActions: number;
  remainingRequiredActions: number;
  stageProgressPercent: number;
  isStageComplete: boolean;
}

export interface NextStepView {
  title: string;
  description: string;
  ctaLabel: string;
  ctaPath: string;
  type: 'TODAY_ACTION' | 'ADVANCE_STAGE' | 'PATH_COMPLETED';
}

export interface ProgressOverviewView {
  // Growth Path Info
  pathSlug: string;
  pathTitle: string;
  pathDescription: string;
  overallPathProgress: number; // 0 - 100
  totalPathActionsCount: number;
  completedPathActionsCount: number;

  // Current Stage Details
  currentStage: CurrentStageProgressView;

  // Activity Summary
  activitySummary: ActivitySummaryView;

  // Action History (chronological records)
  actionHistory: ActionHistoryRecordView[];

  // Recent Activity (clean list)
  recentActivity: RecentActivityItemView[];

  // Next Step Guidance
  nextStep: NextStepView;

  // State
  isEmpty: boolean;
}
