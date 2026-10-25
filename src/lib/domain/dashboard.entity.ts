import { ActionDefinition, ActionStatus } from './growth-path.entity';
import { GrowthProfile } from './growth-profile.entity';

export interface TodayActionView {
  action: ActionDefinition;
  status: ActionStatus; // 'PENDING' | 'DONE' | 'SKIPPED'
  isCompletedToday: boolean;
  date: string; // YYYY-MM-DD
  stageOrder: number;
  stageTitle: string;
  stageGoal: string;
  pathSlug: string;
  pathTitle: string;
  whyThisMatters: string;
  instruction: string;
  personalizationReason?: string | null;
}

export interface RecentActivityItem {
  id: string;
  actionId: string;
  title: string;
  date: string;
  dateLabel: string; // e.g. "امروز", "دیروز", "۲ روز قبل"
  status: ActionStatus;
  completedAt: string | null;
}

export interface DashboardNextStepView {
  label: string;
  actionPath: string;
  actionText: string;
  reason?: string;
}

export interface DashboardLatestReportView {
  id: string;
  actionTitle: string;
  dateLabel: string;
  textPreview: string;
  imageUrl?: string | null;
}

export interface DashboardWeeklyReflectionStatusView {
  isCompleted: boolean;
  weekLabel: string;
  nextWeekFocus?: string;
}

export interface DashboardReminderStatusView {
  enabled: boolean;
  preferredTime: string;
  hasReminder: boolean;
  message?: string | null;
  type?: 'DAILY_ACTION' | 'WEEKLY_REFLECTION' | null;
}

export interface DashboardDataView {
  user: {
    id: string;
    name: string;
    email: string;
  };
  greeting: {
    title: string; // e.g. "سلام، [نام کاربر]"
    contextLine: string; // e.g. "امروز فقط روی قدم بعدی تمرکز کن."
  };
  path: {
    slug: string;
    title: string;
    description: string;
  };
  currentStage: {
    order: number;
    totalStages: number;
    title: string;
    subtitle: string;
    goal: string;
    stageLabel: string; // e.g. "مرحله ۲ از ۴ — ساخت پایه"
    stageProgressLabel?: string; // e.g. "۱ از ۳ اقدام تکمیل شده"
  };
  todayAction: TodayActionView | null;
  progress: {
    percent: number; // e.g. 32
    completedActions: number; // e.g. 4
    totalActions: number; // e.g. 12 or 8
    progressLabel: string; // e.g. "۴ از ۸ اقدام"
  };
  recentActivities: RecentActivityItem[];
  nextStep: DashboardNextStepView;
  latestReport?: DashboardLatestReportView | null;
  weeklyReflection?: DashboardWeeklyReflectionStatusView | null;
  reminderStatus?: DashboardReminderStatusView | null;
}
