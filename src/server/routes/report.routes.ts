import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getSessionUser } from '../../lib/auth/session';
import {
  createActionReportUseCase,
  getUserActionReportsUseCase,
  getActionReportByIdUseCase,
  updateActionReportUseCase,
  deleteActionReportUseCase,
} from '../../lib/application/action-report.usecases';

export const reportRouter = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads', 'reports');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

/**
 * GET /api/reports
 * Lists reports for the authenticated user (supports ?limit=)
 */
reportRouter.get('/', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای مشاهده گزارش‌ها، لطفاً وارد حساب خود شوید.',
      });
    }

    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;
    const result = await getUserActionReportsUseCase(currentUser.id, limit);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Get reports error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در دریافت گزارش‌ها.',
    });
  }
});

/**
 * GET /api/reports/:id
 * Fetches a single report (strictly owned by current user)
 */
reportRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای مشاهده جزئیات گزارش، لطفاً وارد حساب خود شوید.',
      });
    }

    const { id } = req.params;
    const result = await getActionReportByIdUseCase(currentUser.id, id);

    if (!result.success || !result.report) {
      return res.status(404).json({
        success: false,
        error: 'گزارش مورد نظر یافت نشد.',
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Get single report error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در دریافت جزئیات گزارش.',
    });
  }
});

/**
 * POST /api/reports
 * Creates a new action report
 */
reportRouter.post('/', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای ثبت گزارش، ابتدا وارد حساب خود شوید.',
      });
    }

    const { actionId, text, images, pathSlug, stageOrder, actionTitle } = req.body;
    if (!actionId || typeof actionId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'شناسه اقدام الزامی است.',
      });
    }

    const result = await createActionReportUseCase(currentUser.id, {
      actionId,
      text: typeof text === 'string' ? text : '',
      images: Array.isArray(images) ? images : [],
      pathSlug: typeof pathSlug === 'string' ? pathSlug : 'discipline',
      stageOrder: typeof stageOrder === 'number' ? stageOrder : 1,
      actionTitle: typeof actionTitle === 'string' ? actionTitle : 'اقدام رشد',
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('Create report error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ذخیره گزارش.',
    });
  }
});

/**
 * PUT /api/reports/:id
 * Updates an existing report
 */
reportRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'احراز هویت نشده.',
      });
    }

    const { id } = req.params;
    const { text, images } = req.body;

    const result = await updateActionReportUseCase(currentUser.id, id, {
      text: typeof text === 'string' ? text : undefined,
      images: Array.isArray(images) ? images : undefined,
    });

    if (!result.success || !result.report) {
      return res.status(404).json({
        success: false,
        error: result.error || 'گزارش یافت نشد.',
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Update report error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ویرایش گزارش.',
    });
  }
});

/**
 * DELETE /api/reports/:id
 * Deletes a report owned by current user
 */
reportRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'احراز هویت نشده.',
      });
    }

    const { id } = req.params;
    const result = await deleteActionReportUseCase(currentUser.id, id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: 'گزارش یافت نشد یا حذف ناموفق بود.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'گزارش با موفقیت حذف شد.',
    });
  } catch (error) {
    console.error('Delete report error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در حذف گزارش.',
    });
  }
});

/**
 * POST /api/reports/upload
 * Accepts base64 image dataURL, validates type and size, writes file to disk safely
 */
reportRouter.post('/upload', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        error: 'برای بارگذاری تصویر ابتدا وارد حساب خود شوید.',
      });
    }

    const { dataUrl } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'داده تصویر ارسال نشده است.',
      });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        error: 'فرمت این تصویر پشتیبانی نمی‌شود.',
      });
    }

    const mimeType = matches[1].toLowerCase();
    const allowedMimeTypes: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };

    const extension = allowedMimeTypes[mimeType];
    if (!extension) {
      return res.status(400).json({
        success: false,
        error: 'فرمت این تصویر پشتیبانی نمی‌شود. فقط JPG، PNG یا WebP مجاز است.',
      });
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (buffer.length > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'حجم تصویر بیش از حد مجاز است (حداکثر ۵ مگابایت).',
      });
    }

    ensureUploadsDir();
    const filename = `rep_${Date.now()}_${crypto.randomBytes(8).toString('hex')}${extension}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/reports/${filename}`;
    return res.status(200).json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ذخیره‌سازی تصویر.',
    });
  }
});
