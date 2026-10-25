import crypto from 'crypto';
import { getDatabase, saveDatabase } from '../db/database';
import { ReminderPreference, UpdateReminderPreferenceDTO } from '../domain/reminder.entity';

export const DEFAULT_REMINDER_TIMEZONE = 'Asia/Tehran';
export const DEFAULT_PREFERRED_TIME = '20:00';
export const DEFAULT_ACTIVE_DAYS = [0, 1, 2, 3, 4, 5, 6];

export class ReminderPreferenceRepository {
  private mapRowToEntity(row: any): ReminderPreference {
    let activeDays: number[] = DEFAULT_ACTIVE_DAYS;
    try {
      if (row.active_days) {
        activeDays = JSON.parse(row.active_days);
      }
    } catch {
      activeDays = DEFAULT_ACTIVE_DAYS;
    }

    return {
      id: String(row.id),
      userId: String(row.user_id),
      enabled: Boolean(row.enabled),
      timezone: String(row.timezone || DEFAULT_REMINDER_TIMEZONE),
      preferredTime: String(row.preferred_time || DEFAULT_PREFERRED_TIME),
      activeDays,
      dailyActionEnabled: Boolean(row.daily_action_enabled),
      weeklyReflectionEnabled: Boolean(row.weekly_reflection_enabled),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  }

  async findByUserId(userId: string): Promise<ReminderPreference | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM reminder_preferences WHERE user_id = :userId LIMIT 1');
    stmt.bind({ ':userId': userId });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.mapRowToEntity(row);
    }
    stmt.free();
    return null;
  }

  async getOrCreate(userId: string): Promise<ReminderPreference> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      return existing;
    }

    const db = await getDatabase();
    const id = 'rem_' + crypto.randomUUID().replace(/-/g, '');
    const now = new Date().toISOString();

    db.run(
      `INSERT OR IGNORE INTO reminder_preferences (
        id, user_id, enabled, timezone, preferred_time, active_days,
        daily_action_enabled, weekly_reflection_enabled, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        1,
        DEFAULT_REMINDER_TIMEZONE,
        DEFAULT_PREFERRED_TIME,
        JSON.stringify(DEFAULT_ACTIVE_DAYS),
        1,
        1,
        now,
        now,
      ]
    );
    saveDatabase();

    const created = await this.findByUserId(userId);
    if (!created) {
      throw new Error('Failed to create default reminder preferences');
    }
    return created;
  }

  async update(userId: string, data: UpdateReminderPreferenceDTO): Promise<ReminderPreference> {
    // Ensure record exists
    const current = await this.getOrCreate(userId);
    const db = await getDatabase();
    const now = new Date().toISOString();

    const enabled = data.enabled !== undefined ? (data.enabled ? 1 : 0) : (current.enabled ? 1 : 0);
    const timezone = data.timezone !== undefined ? data.timezone : current.timezone;
    const preferredTime = data.preferredTime !== undefined ? data.preferredTime : current.preferredTime;
    const activeDays = data.activeDays !== undefined ? JSON.stringify(data.activeDays) : JSON.stringify(current.activeDays);
    const dailyActionEnabled = data.dailyActionEnabled !== undefined ? (data.dailyActionEnabled ? 1 : 0) : (current.dailyActionEnabled ? 1 : 0);
    const weeklyReflectionEnabled = data.weeklyReflectionEnabled !== undefined ? (data.weeklyReflectionEnabled ? 1 : 0) : (current.weeklyReflectionEnabled ? 1 : 0);

    db.run(
      `UPDATE reminder_preferences
       SET enabled = ?,
           timezone = ?,
           preferred_time = ?,
           active_days = ?,
           daily_action_enabled = ?,
           weekly_reflection_enabled = ?,
           updated_at = ?
       WHERE user_id = ?`,
      [enabled, timezone, preferredTime, activeDays, dailyActionEnabled, weeklyReflectionEnabled, now, userId]
    );
    saveDatabase();

    return (await this.findByUserId(userId))!;
  }
}

export const reminderPreferenceRepository = new ReminderPreferenceRepository();
