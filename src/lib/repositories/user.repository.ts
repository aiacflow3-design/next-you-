import { getDatabase, saveDatabase } from '../db/database';
import { User, OnboardingData } from '../domain/user.entity';
import crypto from 'crypto';

export interface SaveOnboardingPayload {
  goals?: string[];
  dailyTime?: string;
  experienceLevel?: string;
  primaryGrowthArea?: string;
  currentChallenge?: string;
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const stmt = db.prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
    stmt.bind({ ':email': normalizedEmail });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.mapRowToUser(row);
    }
    stmt.free();
    return null;
  }

  async findById(id: string): Promise<User | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
    stmt.bind({ ':id': id });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.mapRowToUser(row);
    }
    stmt.free();
    return null;
  }

  async create(data: { email: string; name?: string | null; passwordHash: string }): Promise<User> {
    const db = await getDatabase();
    const id = 'usr_' + crypto.randomUUID().replace(/-/g, '');
    const now = new Date().toISOString();
    const normalizedEmail = data.email.trim().toLowerCase();

    db.run(
      `INSERT INTO users (id, email, name, password_hash, onboarding_completed, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, normalizedEmail, data.name || null, data.passwordHash, 0, now, now]
    );

    saveDatabase();

    const created = await this.findById(id);
    if (!created) {
      throw new Error('Failed to retrieve newly created user');
    }
    return created;
  }

  async updateOnboardingStatus(id: string, completed: boolean): Promise<User | null> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    db.run('UPDATE users SET onboarding_completed = ?, updated_at = ? WHERE id = ?', [
      completed ? 1 : 0,
      now,
      id,
    ]);
    saveDatabase();
    return this.findById(id);
  }

  async saveOnboardingData(id: string, data: SaveOnboardingPayload): Promise<User | null> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    const goalsJson = data.goals ? JSON.stringify(data.goals) : null;

    db.run(
      `UPDATE users 
       SET onboarding_completed = 1,
           onboarding_goals = COALESCE(?, onboarding_goals),
           onboarding_daily_time = COALESCE(?, onboarding_daily_time),
           onboarding_experience_level = COALESCE(?, onboarding_experience_level),
           primary_growth_area = COALESCE(?, primary_growth_area),
           current_challenge = COALESCE(?, current_challenge),
           onboarding_completed_at = ?,
           updated_at = ?
       WHERE id = ?`,
      [
        goalsJson,
        data.dailyTime || null,
        data.experienceLevel || null,
        data.primaryGrowthArea || null,
        data.currentChallenge || null,
        now,
        now,
        id,
      ]
    );
    saveDatabase();
    return this.findById(id);
  }

  private mapRowToUser(row: Record<string, any>): User {
    let parsedGoals: string[] | null = null;
    if (row.onboarding_goals) {
      try {
        parsedGoals = JSON.parse(String(row.onboarding_goals));
      } catch {
        parsedGoals = [];
      }
    }

    return {
      id: String(row.id),
      email: String(row.email),
      name: row.name ? String(row.name) : null,
      passwordHash: String(row.password_hash),
      onboardingCompleted: Boolean(row.onboarding_completed),
      onboardingGoals: parsedGoals,
      onboardingDailyTime: row.onboarding_daily_time ? String(row.onboarding_daily_time) : null,
      onboardingExperienceLevel: row.onboarding_experience_level ? String(row.onboarding_experience_level) : null,
      primaryGrowthArea: row.primary_growth_area ? String(row.primary_growth_area) : null,
      currentChallenge: row.current_challenge ? String(row.current_challenge) : null,
      onboardingCompletedAt: row.onboarding_completed_at ? String(row.onboarding_completed_at) : null,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  }
}

export const userRepository = new UserRepository();
