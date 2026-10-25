import { reminderPreferenceRepository, DEFAULT_REMINDER_TIMEZONE } from '../repositories/reminder-preference.repository';
import { growthPathRepository } from '../repositories/growth-path.repository';
import {
  weeklyReflectionRepository,
  getDeterministicWeekRange,
} from '../repositories/weekly-reflection.repository';
import { ReminderOpportunity, ReminderPreference } from '../domain/reminder.entity';

export function getUserLocalDateAndTime(date: Date, timezone: string): {
  localDate: string; // YYYY-MM-DD
  localTime: string; // HH:mm
  dayOfWeek: number; // 0=Sunday .. 6=Saturday
} {
  let validTimezone = timezone;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
  } catch {
    validTimezone = DEFAULT_REMINDER_TIMEZONE;
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: validTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '00';

    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hour = getPart('hour');
    const minute = getPart('minute');

    const localDate = `${year}-${month}-${day}`;
    const localTime = `${hour}:${minute}`;

    // Get day of week in timezone
    const dayFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: validTimezone,
      weekday: 'narrow',
    });
    // JS Date.getDay(): 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
    const dayOfWeek = new Date(`${localDate}T${localTime}:00Z`).getUTCDay();

    return { localDate, localTime, dayOfWeek };
  } catch (err) {
    console.warn('Fallback timezone calculation:', err);
    const nowIso = date.toISOString();
    return {
      localDate: nowIso.split('T')[0],
      localTime: nowIso.split('T')[1].slice(0, 5),
      dayOfWeek: date.getDay(),
    };
  }
}

export class ReminderEligibilityService {
  async evaluateReminder(
    userId: string,
    now: Date = new Date(),
    options?: { isCompletedToday?: boolean }
  ): Promise<{
    preference: ReminderPreference;
    opportunity: ReminderOpportunity;
  }> {
    const preference = await reminderPreferenceRepository.getOrCreate(userId);

    // 1. Reminders totally disabled by user
    if (!preference.enabled) {
      return {
        preference,
        opportunity: {
          hasReminder: false,
          type: null,
          title: '',
          message: '',
          actionUrl: '',
          actionText: '',
          reason: 'REMINDERS_DISABLED',
        },
      };
    }

    const { localDate, dayOfWeek } = getUserLocalDateAndTime(now, preference.timezone);

    // 2. Active days of week check
    if (Array.isArray(preference.activeDays) && !preference.activeDays.includes(dayOfWeek)) {
      return {
        preference,
        opportunity: {
          hasReminder: false,
          type: null,
          title: '',
          message: '',
          actionUrl: '',
          actionText: '',
          reason: 'DAY_NOT_ACTIVE',
        },
      };
    }

    // 3. Daily Action Reminder Check
    if (preference.dailyActionEnabled) {
      let isCompletedToday = options?.isCompletedToday;
      if (isCompletedToday === undefined) {
        isCompletedToday = await growthPathRepository.hasCompletedActionOnDate(userId, localDate);
      }

      if (!isCompletedToday) {
        return {
          preference,
          opportunity: {
            hasReminder: true,
            type: 'DAILY_ACTION',
            title: 'اقدام امروز',
            message: 'اقدام امروزت هنوز منتظر توست. اگر امروز فرصت داری، می‌تونی قدم امروزت رو انجام بدی.',
            actionUrl: '/dashboard/action',
            actionText: 'مشاهده اقدام',
            reason: 'DAILY_ACTION_PENDING',
          },
        };
      }
    }

    // 4. Weekly Reflection Reminder Check
    if (preference.weeklyReflectionEnabled) {
      const { weekStart } = getDeterministicWeekRange(now);
      const existingReflection = await weeklyReflectionRepository.findByUserAndWeek(userId, weekStart);

      if (!existingReflection) {
        return {
          preference,
          opportunity: {
            hasReminder: true,
            type: 'WEEKLY_REFLECTION',
            title: 'مرور هفتگی',
            message: 'هفته‌ات رو مرور کردی؟ چند دقیقه برای ثبت تجربه‌ات وقت بذار.',
            actionUrl: '/reflection/weekly',
            actionText: 'مرور هفته',
            reason: 'WEEKLY_REFLECTION_PENDING',
          },
        };
      }
    }

    // 5. Everything completed or suppressed
    return {
      preference,
      opportunity: {
        hasReminder: false,
        type: null,
        title: '',
        message: '',
        actionUrl: '',
        actionText: '',
        reason: 'ALL_UP_TO_DATE',
      },
    };
  }
}

export const reminderEligibilityService = new ReminderEligibilityService();
