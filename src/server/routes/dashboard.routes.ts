import { Router, Request, Response } from 'express';
import { getSessionUser } from '../../lib/auth/session';
import {
  getDashboardDataUseCase,
  getTodayActionUseCase,
  completeTodayActionUseCase,
  skipTodayActionUseCase,
} from '../../lib/application/dashboard.usecases';

export const dashboardRouter = Router();

/**
 * GET /api/dashboard
 * Loads user dashboard data or next-step redirect.
 */
dashboardRouter.get('/', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای مشاهده داشبورد، ابتدا وارد حساب کاربری خود شوید.',
        redirectTo: '/login',
      });
    }

    const result = await getDashboardDataUseCase(currentUser.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Dashboard route error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در بارگذاری داشبورد.',
    });
  }
});

/**
 * GET /api/dashboard/today-action
 * Loads Today's Action data.
 */
dashboardRouter.get('/today-action', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای مشاهده اقدام امروز، ابتدا وارد حساب کاربری خود شوید.',
        redirectTo: '/login',
      });
    }

    const result = await getTodayActionUseCase(currentUser.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Today action route error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در دریافت اقدام امروز.',
    });
  }
});

/**
 * POST /api/dashboard/today-action/complete
 * Marks Today's Action as completed.
 */
dashboardRouter.post('/today-action/complete', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای تکمیل اقدام، ابتدا وارد حساب کاربری خود شوید.',
        redirectTo: '/login',
      });
    }

    const { actionId } = req.body;
    const result = await completeTodayActionUseCase(currentUser.id, actionId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Complete today action route error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ثبت اقدام امروز.',
    });
  }
});

/**
 * POST /api/dashboard/today-action/skip
 * Marks Today's Action as skipped.
 */
dashboardRouter.post('/today-action/skip', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای رد کردن اقدام، ابتدا وارد حساب کاربری خود شوید.',
        redirectTo: '/login',
      });
    }

    const { actionId } = req.body;
    const result = await skipTodayActionUseCase(currentUser.id, actionId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Skip today action route error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ثبت رد اقدام.',
    });
  }
});

/**
 * POST /api/dashboard/today-action/simulate-date
 * Used for testing date transitions between Day 1 and Day 2
 */
dashboardRouter.post('/today-action/simulate-date', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { actionId, newDate } = req.body;
    const { getDatabase, saveDatabase } = await import('../../lib/db/database');
    const db = await getDatabase();
    db.run(
      'UPDATE user_action_progress SET date = ? WHERE user_id = ? AND action_id = ?',
      [newDate, currentUser.id, actionId]
    );
    saveDatabase();
    return res.status(200).json({ success: true, updated: true });
  } catch (error) {
    console.error('Simulate date error:', error);
    return res.status(500).json({ success: false, error: 'Internal error' });
  }
});
