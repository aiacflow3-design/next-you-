import { Router, Request, Response } from 'express';
import { getSessionUser } from '../../lib/auth/session';
import { getProgressOverviewUseCase } from '../../lib/application/progress.usecases';

export const progressRouter = Router();

/**
 * GET /api/progress
 * Loads user progress journal, stage statistics, activity summary, and chronological history.
 */
progressRouter.get('/', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای مشاهده تاریخچه و پیشرفت، ابتدا وارد حساب کاربری خود شوید.',
        redirectTo: '/login',
      });
    }

    const result = await getProgressOverviewUseCase(currentUser.id);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Progress route error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در دریافت اطلاعات پیشرفت و تاریخچه.',
    });
  }
});
