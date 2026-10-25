import crypto from 'crypto';
import { getDatabase, saveDatabase } from '../db/database';
import {
  UserGrowthPath,
  UserActionProgress,
  ActionStatus,
} from '../domain/growth-path.entity';

export class GrowthPathRepository {
  async findUserGrowthPath(userId: string, pathSlug: string): Promise<UserGrowthPath | null> {
    const db = await getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM user_growth_paths WHERE user_id = :userId AND path_slug = :pathSlug LIMIT 1'
    );
    stmt.bind({ ':userId': userId, ':pathSlug': pathSlug });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.mapRowToUserGrowthPath(row);
    }
    stmt.free();
    return null;
  }

  async getOrCreateUserGrowthPath(userId: string, pathSlug: string): Promise<UserGrowthPath> {
    const existing = await this.findUserGrowthPath(userId, pathSlug);
    if (existing) {
      return existing;
    }

    const db = await getDatabase();
    const now = new Date().toISOString();
    const id = 'ugp_' + crypto.randomUUID().replace(/-/g, '');

    db.run(
      `INSERT OR IGNORE INTO user_growth_paths (
         id, user_id, path_slug, current_stage_order, is_completed, started_at, completed_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, pathSlug, 1, 0, now, null, now]
    );

    saveDatabase();

    const created = await this.findUserGrowthPath(userId, pathSlug);
    if (!created) {
      throw new Error('Failed to create user growth path record');
    }
    return created;
  }

  async updateStageOrder(
    userGrowthPathId: string,
    nextStageOrder: number,
    isCompleted: boolean
  ): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();

    db.run(
      `UPDATE user_growth_paths
       SET current_stage_order = ?,
           is_completed = ?,
           completed_at = CASE WHEN ? = 1 THEN ? ELSE completed_at END,
           updated_at = ?
       WHERE id = ?`,
      [nextStageOrder, isCompleted ? 1 : 0, isCompleted ? 1 : 0, now, now, userGrowthPathId]
    );

    saveDatabase();
  }

  async findActionProgress(
    userId: string,
    actionId: string,
    date: string
  ): Promise<UserActionProgress | null> {
    const db = await getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM user_action_progress WHERE user_id = :userId AND action_id = :actionId AND date = :date LIMIT 1'
    );
    stmt.bind({ ':userId': userId, ':actionId': actionId, ':date': date });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.mapRowToActionProgress(row);
    }
    stmt.free();
    return null;
  }

  async findLatestActionProgress(
    userId: string,
    actionId: string
  ): Promise<UserActionProgress | null> {
    const db = await getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM user_action_progress WHERE user_id = :userId AND action_id = :actionId ORDER BY date DESC, updated_at DESC LIMIT 1'
    );
    stmt.bind({ ':userId': userId, ':actionId': actionId });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.mapRowToActionProgress(row);
    }
    stmt.free();
    return null;
  }

  async findAllActionsProgressForPath(
    userId: string,
    userGrowthPathId: string
  ): Promise<UserActionProgress[]> {
    const db = await getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM user_action_progress WHERE user_id = :userId AND user_growth_path_id = :pathId ORDER BY created_at ASC'
    );
    stmt.bind({ ':userId': userId, ':pathId': userGrowthPathId });

    const results: UserActionProgress[] = [];
    while (stmt.step()) {
      results.push(this.mapRowToActionProgress(stmt.getAsObject()));
    }
    stmt.free();
    return results;
  }

  async findAllActionsProgressForUser(userId: string): Promise<UserActionProgress[]> {
    const db = await getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM user_action_progress WHERE user_id = :userId ORDER BY date DESC, created_at DESC'
    );
    stmt.bind({ ':userId': userId });

    const results: UserActionProgress[] = [];
    while (stmt.step()) {
      results.push(this.mapRowToActionProgress(stmt.getAsObject()));
    }
    stmt.free();
    return results;
  }

  async hasCompletedActionOnDate(userId: string, date: string): Promise<boolean> {
    const db = await getDatabase();
    const stmt = db.prepare(
      "SELECT id FROM user_action_progress WHERE user_id = :userId AND date = :date AND status = 'DONE' LIMIT 1"
    );
    stmt.bind({ ':userId': userId, ':date': date });
    const hasRow = stmt.step();
    stmt.free();
    return hasRow;
  }

  async upsertActionProgress(params: {
    userGrowthPathId: string;
    userId: string;
    actionId: string;
    date: string;
    status: ActionStatus;
  }): Promise<UserActionProgress> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    const existing = await this.findActionProgress(params.userId, params.actionId, params.date);

    if (existing) {
      const completedAt = params.status === 'DONE' ? now : null;
      db.run(
        `UPDATE user_action_progress
         SET status = ?,
             completed_at = ?,
             updated_at = ?
         WHERE id = ?`,
        [params.status, completedAt, now, existing.id]
      );
    } else {
      const id = 'uap_' + crypto.randomUUID().replace(/-/g, '');
      const completedAt = params.status === 'DONE' ? now : null;
      db.run(
        `INSERT INTO user_action_progress (
           id, user_growth_path_id, user_id, action_id, date, status, completed_at, created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, params.userGrowthPathId, params.userId, params.actionId, params.date, params.status, completedAt, now, now]
      );
    }

    saveDatabase();

    const saved = await this.findActionProgress(params.userId, params.actionId, params.date);
    if (!saved) {
      throw new Error('Failed to retrieve updated action progress');
    }
    return saved;
  }

  private mapRowToUserGrowthPath(row: Record<string, any>): UserGrowthPath {
    return {
      id: String(row.id),
      userId: String(row.user_id),
      pathSlug: String(row.path_slug),
      currentStageOrder: Number(row.current_stage_order) || 1,
      isCompleted: Boolean(row.is_completed),
      startedAt: String(row.started_at),
      completedAt: row.completed_at ? String(row.completed_at) : null,
      updatedAt: String(row.updated_at),
    };
  }

  private mapRowToActionProgress(row: Record<string, any>): UserActionProgress {
    return {
      id: String(row.id),
      userGrowthPathId: String(row.user_growth_path_id),
      userId: String(row.user_id),
      actionId: String(row.action_id),
      date: String(row.date),
      status: (String(row.status) as ActionStatus) || 'PENDING',
      completedAt: row.completed_at ? String(row.completed_at) : null,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  }
}

export const growthPathRepository = new GrowthPathRepository();
