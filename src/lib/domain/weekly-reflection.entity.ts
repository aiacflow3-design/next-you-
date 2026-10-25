import { ActionReport } from './action-report.entity';

export interface WeeklyReflection {
  id: string;
  userId: string;
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;   // YYYY-MM-DD
  whatWentWell: string;
  whatWasDifficult: string;
  whatILearned: string;
  nextWeekFocus: string;
  createdAt: string;
  updatedAt: string;
  weekLabel?: string;
}

export interface WeeklySummary {
  completedActionsCount: number;
  reportsCount: number;
  currentStageTitle: string;
  currentStageOrder: number;
  pathTitle: string;
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
}

export interface WeeklyReflectionView {
  currentWeek: {
    weekStart: string;
    weekEnd: string;
    weekLabel: string;
  };
  summary: WeeklySummary;
  weekReports: ActionReport[];
  currentReflection: WeeklyReflection | null;
  previousReflections: WeeklyReflection[];
}

export interface SaveWeeklyReflectionDTO {
  weekStart: string;
  weekEnd: string;
  whatWentWell?: string;
  whatWasDifficult?: string;
  whatILearned?: string;
  nextWeekFocus?: string;
}
