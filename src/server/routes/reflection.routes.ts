import { Router, Request, Response } from 'express';
import { getSessionUser } from '../../lib/auth/session';
import {
  getWeeklyReflectionOverviewUseCase,
  saveWeeklyReflectionUseCase,
} from '../../lib/application/weekly-reflection.usecases';

export const reflectionRouter = Router();

/**
 * GET /api/reflection/weekly
 * Returns current week facts, reports, existing reflection, and history
 */
reflectionRouter.get('/weekly', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای دسترسی به مرور هفتگی، لطفاً وارد حساب خود شوید.',
      });
    }

    const result = await getWeeklyReflectionOverviewUseCase(currentUser.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Get weekly reflection error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در بازیابی مرور هفتگی.',
    });
  }
});

/**
 * POST /api/reflection/weekly
 * Saves or updates weekly reflection for current week
 */
reflectionRouter.post('/weekly', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای ثبت مرور هفتگی، لطفاً وارد حساب خود شوید.',
      });
    }

    const { weekStart, weekEnd, whatWentWell, whatWasDifficult, whatILearned, nextWeekFocus } = req.body;
    if (!weekStart || !weekEnd) {
      return res.status(400).json({
        success: false,
        error: 'بازه زمانی هفته الزامی است.',
      });
    }

    const result = await saveWeeklyReflectionUseCase(currentUser.id, {
      weekStart,
      weekEnd,
      whatWentWell,
      whatWasDifficult,
      whatILearned,
      nextWeekFocus,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Save weekly reflection error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ثبت مرور هفتگی.',
    });
  }
});
