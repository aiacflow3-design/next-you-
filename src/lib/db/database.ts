import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: Database | null = null;
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'nextyou.sqlite');

/**
 * Ensures data directory exists
 */
function ensureDirectoryExistence() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

/**
 * Saves current in-memory SQLite state to disk
 */
export function saveDatabase(): void {
  if (!dbInstance) return;
  try {
    ensureDirectoryExistence();
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (error) {
    console.error('Failed to save SQLite database to disk:', error);
  }
}

/**
 * Migrates existing tables if new columns are missing
 */
function migrateSchema(db: Database) {
  try {
    const res = db.exec("PRAGMA table_info(users);");
    if (res && res.length > 0 && res[0].values) {
      const columnNames = res[0].values.map((col: any) => col[1]);
      if (!columnNames.includes('primary_growth_area')) {
        db.run('ALTER TABLE users ADD COLUMN primary_growth_area TEXT;');
      }
      if (!columnNames.includes('current_challenge')) {
        db.run('ALTER TABLE users ADD COLUMN current_challenge TEXT;');
      }
      if (!columnNames.includes('onboarding_completed_at')) {
        db.run('ALTER TABLE users ADD COLUMN onboarding_completed_at TEXT;');
      }
      if (!columnNames.includes('onboarding_goals')) {
        db.run('ALTER TABLE users ADD COLUMN onboarding_goals TEXT;');
      }
      if (!columnNames.includes('onboarding_daily_time')) {
        db.run('ALTER TABLE users ADD COLUMN onboarding_daily_time TEXT;');
      }
      if (!columnNames.includes('onboarding_experience_level')) {
        db.run('ALTER TABLE users ADD COLUMN onboarding_experience_level TEXT;');
      }
    }

    // Ensure onboarding_profiles table exists
    db.run(`
      CREATE TABLE IF NOT EXISTS onboarding_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        primary_goal TEXT NOT NULL,
        main_obstacle TEXT NOT NULL,
        available_time TEXT NOT NULL,
        consistency_pattern TEXT NOT NULL,
        desired_support TEXT NOT NULL,
        future_self_vision TEXT NOT NULL,
        completed_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_user_id ON onboarding_profiles(user_id);

      CREATE TABLE IF NOT EXISTS assessment_results (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        answers_json TEXT NOT NULL,
        discipline_score INTEGER NOT NULL,
        focus_score INTEGER NOT NULL,
        confidence_score INTEGER NOT NULL,
        recommended_path TEXT NOT NULL,
        strengths_json TEXT NOT NULL,
        opportunities_json TEXT NOT NULL,
        completed_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);

      CREATE TABLE IF NOT EXISTS growth_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        assessment_id TEXT,
        discipline INTEGER NOT NULL,
        focus INTEGER NOT NULL,
        clarity INTEGER NOT NULL,
        energy INTEGER NOT NULL,
        trait_scores_json TEXT NOT NULL,
        dimensions_json TEXT NOT NULL,
        key_strength_json TEXT NOT NULL,
        growth_opportunity_json TEXT NOT NULL,
        recommended_path_json TEXT NOT NULL,
        summary TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_growth_profiles_user_id ON growth_profiles(user_id);

      CREATE TABLE IF NOT EXISTS user_growth_paths (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        path_slug TEXT NOT NULL,
        current_stage_order INTEGER NOT NULL DEFAULT 1,
        is_completed INTEGER NOT NULL DEFAULT 0,
        started_at TEXT NOT NULL,
        completed_at TEXT,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id, path_slug),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_user_growth_paths_user_id ON user_growth_paths(user_id);

      CREATE TABLE IF NOT EXISTS user_action_progress (
        id TEXT PRIMARY KEY,
        user_growth_path_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        action_id TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        completed_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id, action_id, date),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (user_growth_path_id) REFERENCES user_growth_paths (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_user_action_progress_user_action ON user_action_progress(user_id, action_id);
      CREATE INDEX IF NOT EXISTS idx_user_action_progress_path ON user_action_progress(user_growth_path_id);

      CREATE TABLE IF NOT EXISTS action_reports (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        action_id TEXT NOT NULL,
        path_slug TEXT NOT NULL DEFAULT 'discipline',
        stage_order INTEGER NOT NULL DEFAULT 1,
        action_title TEXT NOT NULL,
        text TEXT NOT NULL DEFAULT '',
        image_url TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_action_reports_user_id ON action_reports(user_id);
      CREATE INDEX IF NOT EXISTS idx_action_reports_user_action ON action_reports(user_id, action_id);
      CREATE INDEX IF NOT EXISTS idx_action_reports_created_at ON action_reports(created_at);

      CREATE TABLE IF NOT EXISTS action_report_images (
        id TEXT PRIMARY KEY,
        report_id TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (report_id) REFERENCES action_reports (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_action_report_images_report_id ON action_report_images(report_id);

      CREATE TABLE IF NOT EXISTS weekly_reflections (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        week_start TEXT NOT NULL,
        week_end TEXT NOT NULL,
        what_went_well TEXT DEFAULT '',
        what_was_difficult TEXT DEFAULT '',
        what_i_learned TEXT DEFAULT '',
        next_week_focus TEXT DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id, week_start),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_weekly_reflections_user ON weekly_reflections(user_id);
      CREATE INDEX IF NOT EXISTS idx_weekly_reflections_week ON weekly_reflections(user_id, week_start);

      CREATE TABLE IF NOT EXISTS reminder_preferences (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        enabled INTEGER NOT NULL DEFAULT 1,
        timezone TEXT NOT NULL DEFAULT 'Asia/Tehran',
        preferred_time TEXT NOT NULL DEFAULT '20:00',
        active_days TEXT NOT NULL DEFAULT '[0,1,2,3,4,5,6]',
        daily_action_enabled INTEGER NOT NULL DEFAULT 1,
        weekly_reflection_enabled INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_reminder_preferences_user ON reminder_preferences(user_id);
    `);
  } catch (err) {
    console.warn('Database migration notice:', err);
  }
}

/**
 * Initializes and returns the SQLite database instance
 */
export async function getDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  ensureDirectoryExistence();
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (err) {
      console.warn('Could not read existing database file, creating a fresh one:', err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Initialize schema with relational constraints and indexes
  dbInstance.run(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT NOT NULL,
      onboarding_completed INTEGER NOT NULL DEFAULT 0,
      primary_growth_area TEXT,
      current_challenge TEXT,
      onboarding_goals TEXT,
      onboarding_daily_time TEXT,
      onboarding_experience_level TEXT,
      onboarding_completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      session_token TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  `);

  migrateSchema(dbInstance);
  saveDatabase();
  return dbInstance;
}
