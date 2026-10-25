import { getDatabase, saveDatabase } from '../db/database';
import { Session } from '../domain/session.entity';
import crypto from 'crypto';

export class SessionRepository {
  async create(userId: string, durationDays = 30): Promise<Session> {
    const db = await getDatabase();
    const id = 'ses_' + crypto.randomUUID().replace(/-/g, '');
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    const createdAt = now.toISOString();

    db.run(
      `INSERT INTO sessions (id, session_token, user_id, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, sessionToken, userId, expiresAt, createdAt]
    );

    saveDatabase();

    return {
      id,
      sessionToken,
      userId,
      expiresAt,
      createdAt,
    };
  }

  async findByToken(token: string): Promise<Session | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM sessions WHERE session_token = :token LIMIT 1');
    stmt.bind({ ':token': token });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();

      // Check expiry
      const expiresAt = new Date(String(row.expires_at));
      if (expiresAt.getTime() < Date.now()) {
        await this.deleteByToken(token);
        return null;
      }

      return {
        id: String(row.id),
        sessionToken: String(row.session_token),
        userId: String(row.user_id),
        expiresAt: String(row.expires_at),
        createdAt: String(row.created_at),
      };
    }
    stmt.free();
    return null;
  }

  async deleteByToken(token: string): Promise<void> {
    const db = await getDatabase();
    db.run('DELETE FROM sessions WHERE session_token = ?', [token]);
    saveDatabase();
  }

  async deleteByUserId(userId: string): Promise<void> {
    const db = await getDatabase();
    db.run('DELETE FROM sessions WHERE user_id = ?', [userId]);
    saveDatabase();
  }
}

export const sessionRepository = new SessionRepository();
