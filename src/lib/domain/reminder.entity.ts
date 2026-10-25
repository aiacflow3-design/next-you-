export interface ReminderPreference {
  id: string;
  userId: string;
  enabled: boolean;
  timezone: string;
  preferredTime: string; // "HH:mm" e.g. "20:00"
  activeDays: number[]; // [0, 1, 2, 3, 4, 5, 6] (0=Sunday ... 6=Saturday)
  dailyActionEnabled: boolean;
  weeklyReflectionEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ReminderType = 'DAILY_ACTION' | 'WEEKLY_REFLECTION';

export interface ReminderOpportunity {
  hasReminder: boolean;
  type: ReminderType | null;
  title: string;
  message: string;
  actionUrl: string;
  actionText: string;
  reason: string;
}

export interface UpdateReminderPreferenceDTO {
  enabled?: boolean;
  timezone?: string;
  preferredTime?: string;
  activeDays?: number[];
  dailyActionEnabled?: boolean;
  weeklyReflectionEnabled?: boolean;
}
