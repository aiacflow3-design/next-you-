import crypto from 'crypto';
import { getDatabase, saveDatabase } from '../db/database';
import {
  ActionReport,
  ActionReportImage,
  CreateActionReportDTO,
  UpdateActionReportDTO,
} from '../domain/action-report.entity';
import { formatDateLabel, getTodayDateString } from '../application/progress.usecases';
import { getGrowthPathDefinition } from '../domain/growth-path-definitions';

export class ActionReportRepository {
  /**
   * Helper to format report dates and titles
   */
  private enrichReport(report: ActionReport): ActionReport {
    const todayStr = getTodayDateString();
    const createdDateStr = report.createdAt.split('T')[0];
    const dateLabel = formatDateLabel(createdDateStr, todayStr);

    let timeLabel = '';
    try {
      const d = new Date(report.createdAt);
      timeLabel = d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      timeLabel = '';
    }

    const pathDef = getGrowthPathDefinition(report.pathSlug || 'discipline');
    const stage = pathDef.stages.find((s) => s.order === report.stageOrder);

    return {
      ...report,
      dateLabel,
      timeLabel,
      pathTitle: pathDef.title,
      stageTitle: stage?.title || `مرحله ${report.stageOrder}`,
    };
  }

  /**
   * Fetch attached images for a report
   */
  private async findImagesByReportId(reportId: string): Promise<ActionReportImage[]> {
    const db = await getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM action_report_images WHERE report_id = :reportId ORDER BY created_at ASC'
    );
    stmt.bind({ ':reportId': reportId });

    const images: ActionReportImage[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      images.push({
        id: String(row.id),
        reportId: String(row.report_id),
        imageUrl: String(row.image_url),
        createdAt: String(row.created_at),
      });
    }
    stmt.free();
    return images;
  }

  /**
   * Create a new action report
   */
  async create(userId: string, data: CreateActionReportDTO): Promise<ActionReport> {
    const db = await getDatabase();
    const id = 'rep_' + crypto.randomUUID().replace(/-/g, '');
    const now = new Date().toISOString();

    const pathSlug = data.pathSlug || 'discipline';
    const stageOrder = data.stageOrder || 1;
    const actionTitle = data.actionTitle || 'اقدام رشد';
    const text = data.text ? data.text.trim() : '';

    // First image for direct column compatibility if provided
    const primaryImageUrl = data.images && data.images.length > 0 ? data.images[0] : null;

    db.run(
      `INSERT INTO action_reports (
        id, user_id, action_id, path_slug, stage_order, action_title, text, image_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        data.actionId,
        pathSlug,
        stageOrder,
        actionTitle,
        text,
        primaryImageUrl,
        now,
        now,
      ]
    );

    // Save image attachments if any
    const images: ActionReportImage[] = [];
    if (data.images && data.images.length > 0) {
      for (const imgUrl of data.images) {
        if (!imgUrl || typeof imgUrl !== 'string') continue;
        const imgId = 'img_' + crypto.randomUUID().replace(/-/g, '');
        db.run(
          `INSERT INTO action_report_images (id, report_id, image_url, created_at)
           VALUES (?, ?, ?, ?)`,
          [imgId, id, imgUrl, now]
        );
        images.push({
          id: imgId,
          reportId: id,
          imageUrl: imgUrl,
          createdAt: now,
        });
      }
    }

    saveDatabase();

    const report: ActionReport = {
      id,
      userId,
      actionId: data.actionId,
      pathSlug,
      stageOrder,
      actionTitle,
      text,
      images,
      createdAt: now,
      updatedAt: now,
    };

    return this.enrichReport(report);
  }

  /**
   * Find reports for a specific user, sorted newest first
   */
  async findByUserId(userId: string, limit?: number): Promise<ActionReport[]> {
    const db = await getDatabase();
    const query = limit && limit > 0
      ? 'SELECT * FROM action_reports WHERE user_id = :userId ORDER BY created_at DESC LIMIT :limit'
      : 'SELECT * FROM action_reports WHERE user_id = :userId ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const bindParams: Record<string, any> = { ':userId': userId };
    if (limit && limit > 0) {
      bindParams[':limit'] = limit;
    }
    stmt.bind(bindParams);

    const reports: ActionReport[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      reports.push({
        id: String(row.id),
        userId: String(row.user_id),
        actionId: String(row.action_id),
        pathSlug: String(row.path_slug || 'discipline'),
        stageOrder: Number(row.stage_order || 1),
        actionTitle: String(row.action_title || ''),
        text: String(row.text || ''),
        images: [],
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
      });
    }
    stmt.free();

    // Attach images
    for (const rep of reports) {
      rep.images = await this.findImagesByReportId(rep.id);
    }

    return reports.map((r) => this.enrichReport(r));
  }

  /**
   * Find a specific report by ID
   */
  async findById(id: string): Promise<ActionReport | null> {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM action_reports WHERE id = :id LIMIT 1');
    stmt.bind({ ':id': id });

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();

      const rep: ActionReport = {
        id: String(row.id),
        userId: String(row.user_id),
        actionId: String(row.action_id),
        pathSlug: String(row.path_slug || 'discipline'),
        stageOrder: Number(row.stage_order || 1),
        actionTitle: String(row.action_title || ''),
        text: String(row.text || ''),
        images: [],
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
      };

      rep.images = await this.findImagesByReportId(rep.id);
      return this.enrichReport(rep);
    }

    stmt.free();
    return null;
  }

  /**
   * Update report text and optional images
   */
  async update(id: string, userId: string, data: UpdateActionReportDTO): Promise<ActionReport | null> {
    const existing = await this.findById(id);
    if (!existing || existing.userId !== userId) {
      return null;
    }

    const db = await getDatabase();
    const now = new Date().toISOString();
    const updatedText = data.text !== undefined ? data.text.trim() : existing.text;

    let primaryImageUrl = existing.images[0]?.imageUrl || null;
    if (data.images !== undefined) {
      primaryImageUrl = data.images.length > 0 ? data.images[0] : null;

      // Replace images in action_report_images
      db.run('DELETE FROM action_report_images WHERE report_id = ?', [id]);
      for (const imgUrl of data.images) {
        if (!imgUrl || typeof imgUrl !== 'string') continue;
        const imgId = 'img_' + crypto.randomUUID().replace(/-/g, '');
        db.run(
          `INSERT INTO action_report_images (id, report_id, image_url, created_at)
           VALUES (?, ?, ?, ?)`,
          [imgId, id, imgUrl, now]
        );
      }
    }

    db.run(
      `UPDATE action_reports
       SET text = ?, image_url = ?, updated_at = ?
       WHERE id = ? AND user_id = ?`,
      [updatedText, primaryImageUrl, now, id, userId]
    );

    saveDatabase();
    return this.findById(id);
  }

  /**
   * Delete report (and its cascading images)
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing || existing.userId !== userId) {
      return false;
    }

    const db = await getDatabase();
    db.run('DELETE FROM action_report_images WHERE report_id = ?', [id]);
    db.run('DELETE FROM action_reports WHERE id = ? AND user_id = ?', [id, userId]);
    saveDatabase();
    return true;
  }
}

export const actionReportRepository = new ActionReportRepository();
