import crypto from 'crypto';
import { getDatabase, saveDatabase } from '../db/database';
import { AssessmentResultRecord, StoredGrowthProfile } from '../domain/assessment.entity';
import { userRepository } from './user.repository';

export interface SaveAssessmentPayload {
  answers: Record<string, string>;
  categoryScores: {
    discipline: number;
    focus: number;
    confidence: number;
    habits?: number;
    lifestyle?: number;
  };
  readinessScore: number;
  archetypeTitle: string;
  archetypeTagline: string;
  recommendedPath: string;
  strengths: Array<{ title: string; desc: string }>;
  opportunities: Array<{ title: string; desc: string }>;
}

export class AssessmentRepository {
  async findByUserId(userId: string): Promise<AssessmentResultRecord | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM assessment_results WHERE user_id = :userId LIMIT 1');
    stmt.bind({ ':userId': userId });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.mapRowToRecord(row);
    }
    stmt.free();
    return null;
  }

  async saveAssessment(
    userId: string,
    payload: SaveAssessmentPayload
  ): Promise<AssessmentResultRecord> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    const existing = await this.findByUserId(userId);
    const recordId = existing ? existing.id : 'asr_' + crypto.randomUUID().replace(/-/g, '');

    const answersJson = JSON.stringify(payload.answers);
    const strengthsJson = JSON.stringify(payload.strengths);
    const opportunitiesJson = JSON.stringify(payload.opportunities);

    if (existing) {
      db.run(
        `UPDATE assessment_results
         SET answers_json = ?,
             discipline_score = ?,
             focus_score = ?,
             confidence_score = ?,
             recommended_path = ?,
             strengths_json = ?,
             opportunities_json = ?,
             completed_at = ?
         WHERE id = ?`,
        [
          answersJson,
          payload.categoryScores.discipline,
          payload.categoryScores.focus,
          payload.categoryScores.confidence,
          payload.recommendedPath,
          strengthsJson,
          opportunitiesJson,
          now,
          recordId,
        ]
      );
    } else {
      db.run(
        `INSERT INTO assessment_results (
           id, user_id, answers_json, discipline_score, focus_score,
           confidence_score, recommended_path, strengths_json,
           opportunities_json, completed_at, created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          recordId,
          userId,
          answersJson,
          payload.categoryScores.discipline,
          payload.categoryScores.focus,
          payload.categoryScores.confidence,
          payload.recommendedPath,
          strengthsJson,
          opportunitiesJson,
          now,
          now,
        ]
      );
    }

    // Also update users table with primary growth attributes
    db.run(
      `UPDATE users
       SET primary_growth_area = COALESCE(primary_growth_area, ?),
           updated_at = ?
       WHERE id = ?`,
      [payload.recommendedPath, now, userId]
    );

    saveDatabase();

    const saved = await this.findByUserId(userId);
    if (!saved) {
      throw new Error('Failed to retrieve saved assessment record');
    }
    return saved;
  }

  private mapRowToRecord(row: Record<string, any>): AssessmentResultRecord {
    let answers: Record<string, string> = {};
    let strengths: Array<{ title: string; desc: string }> = [];
    let opportunities: Array<{ title: string; desc: string }> = [];

    try {
      answers = JSON.parse(String(row.answers_json));
    } catch {
      answers = {};
    }

    try {
      strengths = JSON.parse(String(row.strengths_json));
    } catch {
      strengths = [];
    }

    try {
      opportunities = JSON.parse(String(row.opportunities_json));
    } catch {
      opportunities = [];
    }

    return {
      id: String(row.id),
      userId: String(row.user_id),
      answers,
      disciplineScore: Number(row.discipline_score) || 75,
      focusScore: Number(row.focus_score) || 80,
      confidenceScore: Number(row.confidence_score) || 75,
      habitsScore: 78,
      lifestyleScore: 82,
      readinessScore: 76,
      archetypeTitle: 'معمار انضباط و روتین‌های پایدار',
      archetypeTagline: 'پتانسیل بالا در درک مفاهیم سیستماتیک و نیاز به کم‌اصطکاک‌سازی شروع وظایف',
      recommendedPath: String(row.recommended_path),
      strengths,
      opportunities,
      completedAt: String(row.completed_at),
      createdAt: String(row.created_at),
    };
  }
}

export const assessmentRepository = new AssessmentRepository();
