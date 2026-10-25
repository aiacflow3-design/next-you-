import crypto from 'crypto';
import { getDatabase, saveDatabase } from '../db/database';
import { OnboardingProfile, OnboardingSubmissionPayload } from '../domain/onboarding.entity';
import { userRepository } from './user.repository';
import { User } from '../domain/user.entity';

export class OnboardingRepository {
  async findByUserId(userId: string): Promise<OnboardingProfile | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM onboarding_profiles WHERE user_id = :userId LIMIT 1');
    stmt.bind({ ':userId': userId });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.mapRowToProfile(row);
    }
    stmt.free();
    return null;
  }

  async saveProfile(
    userId: string,
    payload: OnboardingSubmissionPayload
  ): Promise<{ profile: OnboardingProfile; updatedUser: User }> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    const existing = await this.findByUserId(userId);

    const profileId = existing ? existing.id : 'onb_' + crypto.randomUUID().replace(/-/g, '');

    if (existing) {
      db.run(
        `UPDATE onboarding_profiles
         SET name = ?,
             primary_goal = ?,
             main_obstacle = ?,
             available_time = ?,
             consistency_pattern = ?,
             desired_support = ?,
             future_self_vision = ?,
             completed_at = ?
         WHERE id = ?`,
        [
          payload.name.trim(),
          payload.primaryGoal.trim(),
          payload.mainObstacle.trim(),
          payload.availableTime.trim(),
          payload.consistencyPattern.trim(),
          payload.desiredSupport.trim(),
          payload.futureSelfVision.trim(),
          now,
          profileId,
        ]
      );
    } else {
      db.run(
        `INSERT INTO onboarding_profiles (
           id, user_id, name, primary_goal, main_obstacle,
           available_time, consistency_pattern, desired_support,
           future_self_vision, completed_at, created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profileId,
          userId,
          payload.name.trim(),
          payload.primaryGoal.trim(),
          payload.mainObstacle.trim(),
          payload.availableTime.trim(),
          payload.consistencyPattern.trim(),
          payload.desiredSupport.trim(),
          payload.futureSelfVision.trim(),
          now,
          now,
        ]
      );
    }

    // Also update users table with preferred name and mark onboarding_completed
    db.run(
      `UPDATE users
       SET name = ?,
           onboarding_completed = 1,
           onboarding_completed_at = ?,
           primary_growth_area = ?,
           current_challenge = ?,
           onboarding_daily_time = ?,
           onboarding_experience_level = ?,
           onboarding_goals = ?,
           updated_at = ?
       WHERE id = ?`,
      [
        payload.name.trim(),
        now,
        payload.primaryGoal.trim(),
        payload.mainObstacle.trim(),
        payload.availableTime.trim(),
        payload.consistencyPattern.trim(),
        JSON.stringify([payload.primaryGoal.trim()]),
        now,
        userId,
      ]
    );

    saveDatabase();

    const savedProfile = await this.findByUserId(userId);
    const updatedUser = await userRepository.findById(userId);

    if (!savedProfile || !updatedUser) {
      throw new Error('Failed to retrieve updated onboarding record');
    }

    return { profile: savedProfile, updatedUser };
  }

  private mapRowToProfile(row: Record<string, any>): OnboardingProfile {
    return {
      id: String(row.id),
      userId: String(row.user_id),
      name: String(row.name),
      primaryGoal: String(row.primary_goal),
      mainObstacle: String(row.main_obstacle),
      availableTime: String(row.available_time),
      consistencyPattern: String(row.consistency_pattern),
      desiredSupport: String(row.desired_support),
      futureSelfVision: String(row.future_self_vision),
      completedAt: String(row.completed_at),
      createdAt: String(row.created_at),
    };
  }
}

export const onboardingRepository = new OnboardingRepository();
