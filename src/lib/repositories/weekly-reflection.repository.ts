import crypto from 'crypto';
import { getDatabase, saveDatabase } from '../db/database';
import {
  WeeklyReflection,
  SaveWeeklyReflectionDTO,
} from '../domain/weekly-reflection.entity';

/**
 * Returns deterministic week boundaries (Saturday to Friday)
 */
export function getDeterministicWeekRange(dateInput: Date = new Date()): {
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
} {
  const d = new Date(dateInput);
  d.setHours(12, 0, 0, 0); // Noon to prevent timezone boundary jumps

  // JS getDay(): 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const day = d.getDay();
  const daysSinceSaturday = (day + 1) % 7;

  const sat = new Date(d);
  sat.setDate(sat.getDate() - daysSinceSaturday);

  const fri = new Date(sat);
  fri.setDate(fri.getDate() + 6);

  const weekStart = sat.toISOString().split('T')[0];
  const weekEnd = fri.toISOString().split('T')[0];

  const weekLabel = `${weekStart} تا ${weekEnd}`;

  return { weekStart, weekEnd, weekLabel };
}

export class WeeklyReflectionRepository {
  /**
   * Helper to format reflection entity
   */
  private enrichReflection(row: any): WeeklyReflection {
    return {
      id: String(row.id),
      userId: String(row.user_id),
      weekStart: String(row.week_start),
      weekEnd: String(row.week_end),
      whatWentWell: String(row.what_went_well || ''),
      whatWasDifficult: String(row.what_was_difficult || ''),
      whatILearned: String(row.what_i_learned || ''),
      nextWeekFocus: String(row.next_week_focus || ''),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
      weekLabel: `${row.week_start} تا ${row.week_end}`,
    };
  }

  /**
   * Find reflection for a specific user and weekStart
   */
  async findByUserAndWeek(userId: string, weekStart: string): Promise<WeeklyReflection | null> {
    const db = await getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM weekly_reflections WHERE user_id = :userId AND week_start = :weekStart LIMIT 1'
    );
    stmt.bind({ ':userId': userId, ':weekStart': weekStart });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.enrichReflection(row);
    }

    stmt.free();
    return null;
  }

  /**
   * Find reflection by its unique ID
   */
  async findById(id: string): Promise<WeeklyReflection | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM weekly_reflections WHERE id = :id LIMIT 1');
    stmt.bind({ ':id': id });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.enrichReflection(row);
    }

    stmt.free();
    return null;
  }

  /**
   * Get all past reflections of a user in reverse chronological order
   */
  async findHistoryByUserId(userId: string): Promise<WeeklyReflection[]> {
    const db = await getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM weekly_reflections WHERE user_id = :userId ORDER BY week_start DESC'
    );
    stmt.bind({ ':userId': userId });

    const reflections: WeeklyReflection[] = [];
    while (stmt.step()) {
      reflections.push(this.enrichReflection(stmt.getAsObject()));
    }
    stmt.free();
    return reflections;
  }

  /**
   * Upsert reflection: If reflection exists for user and weekStart, updates it. Otherwise creates it.
   */
  async upsert(userId: string, data: SaveWeeklyReflectionDTO): Promise<WeeklyReflection> {
    const db = await getDatabase();
    const existing = await this.findByUserAndWeek(userId, data.weekStart);
    const now = new Date().toISOString();

    const whatWentWell = data.whatWentWell ? data.whatWentWell.trim() : '';
    const whatWasDifficult = data.whatWasDifficult ? data.whatWasDifficult.trim() : '';
    const whatILearned = data.whatILearned ? data.whatILearned.trim() : '';
    const nextWeekFocus = data.nextWeekFocus ? data.nextWeekFocus.trim() : '';

    if (existing) {
      db.run(
        `UPDATE weekly_reflections
         SET what_went_well = ?, what_was_difficult = ?, what_i_learned = ?, next_week_focus = ?, updated_at = ?
         WHERE id = ? AND user_id = ?`,
        [whatWentWell, whatWasDifficult, whatILearned, nextWeekFocus, now, existing.id, userId]
      );
      saveDatabase();
      return (await this.findById(existing.id))!;
    }

    const id = 'ref_' + crypto.randomUUID().replace(/-/g, '');
    db.run(
      `INSERT INTO weekly_reflections (
        id, user_id, week_start, week_end, what_went_well, what_was_difficult, what_i_learned, next_week_focus, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        data.weekStart,
        data.weekEnd,
        whatWentWell,
        whatWasDifficult,
        whatILearned,
        nextWeekFocus,
        now,
        now,
      ]
    );

    saveDatabase();
    return (await this.findById(id))!;
  }
}

export const weeklyReflectionRepository = new WeeklyReflectionRepository();
