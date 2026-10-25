import { getDatabase, saveDatabase } from '../db/database';
import { GrowthProfile } from '../domain/growth-profile.entity';

export class GrowthProfileRepository {
  async findByUserId(userId: string): Promise<GrowthProfile | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM growth_profiles WHERE user_id = :userId LIMIT 1');
    stmt.bind({ ':userId': userId });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.mapRowToProfile(row);
    }
    stmt.free();
    return null;
  }

  async saveProfile(profile: GrowthProfile): Promise<GrowthProfile> {
    const db = await getDatabase();
    const existing = await this.findByUserId(profile.userId);
    const now = new Date().toISOString();

    const traitScoresJson = JSON.stringify(profile.traitScores);
    const dimensionsJson = JSON.stringify(profile.dimensions);
    const keyStrengthJson = JSON.stringify(profile.keyStrength);
    const growthOpportunityJson = JSON.stringify(profile.growthOpportunity);
    const recommendedPathJson = JSON.stringify(profile.recommendedPath);

    if (existing) {
      db.run(
        `UPDATE growth_profiles
         SET assessment_id = ?,
             discipline = ?,
             focus = ?,
             clarity = ?,
             energy = ?,
             trait_scores_json = ?,
             dimensions_json = ?,
             key_strength_json = ?,
             growth_opportunity_json = ?,
             recommended_path_json = ?,
             summary = ?,
             updated_at = ?
         WHERE user_id = ?`,
        [
          profile.assessmentId || null,
          profile.traitScores.discipline,
          profile.traitScores.focus,
          profile.traitScores.clarity,
          profile.traitScores.energy,
          traitScoresJson,
          dimensionsJson,
          keyStrengthJson,
          growthOpportunityJson,
          recommendedPathJson,
          profile.summary,
          now,
          profile.userId,
        ]
      );
    } else {
      db.run(
        `INSERT INTO growth_profiles (
           id, user_id, assessment_id, discipline, focus, clarity, energy,
           trait_scores_json, dimensions_json, key_strength_json,
           growth_opportunity_json, recommended_path_json, summary,
           created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profile.id,
          profile.userId,
          profile.assessmentId || null,
          profile.traitScores.discipline,
          profile.traitScores.focus,
          profile.traitScores.clarity,
          profile.traitScores.energy,
          traitScoresJson,
          dimensionsJson,
          keyStrengthJson,
          growthOpportunityJson,
          recommendedPathJson,
          profile.summary,
          profile.createdAt || now,
          now,
        ]
      );
    }

    saveDatabase();

    const saved = await this.findByUserId(profile.userId);
    if (!saved) {
      throw new Error('Failed to retrieve saved growth profile');
    }
    return saved;
  }

  private mapRowToProfile(row: Record<string, any>): GrowthProfile {
    let traitScores = { discipline: 75, focus: 80, clarity: 75, energy: 70 };
    let dimensions = [];
    let keyStrength = {
      dimensionKey: 'focus',
      dimensionName: 'تمرکز',
      title: 'تمرکز و ظرفیت ذهنی',
      description: '',
    };
    let growthOpportunity = {
      dimensionKey: 'discipline',
      dimensionName: 'نظم',
      title: 'انضباط و تثبیت عادات',
      description: '',
    };
    let recommendedPath = {
      slug: 'discipline',
      title: 'نظم شخصی',
      tagline: 'ساخت عادات ماندگار و روتین‌های ضدلغزش',
      description: '',
      targetTrait: 'نظم',
      keyPractices: [],
    };

    try {
      traitScores = JSON.parse(String(row.trait_scores_json));
    } catch {
      // Fallback
    }

    try {
      dimensions = JSON.parse(String(row.dimensions_json));
    } catch {
      // Fallback
    }

    try {
      keyStrength = JSON.parse(String(row.key_strength_json));
    } catch {
      // Fallback
    }

    try {
      growthOpportunity = JSON.parse(String(row.growth_opportunity_json));
    } catch {
      // Fallback
    }

    try {
      recommendedPath = JSON.parse(String(row.recommended_path_json));
    } catch {
      // Fallback
    }

    return {
      id: String(row.id),
      userId: String(row.user_id),
      assessmentId: row.assessment_id ? String(row.assessment_id) : null,
      dimensions,
      traitScores,
      summary: String(row.summary),
      keyStrength,
      growthOpportunity,
      recommendedPath,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  }
}

export const growthProfileRepository = new GrowthProfileRepository();
