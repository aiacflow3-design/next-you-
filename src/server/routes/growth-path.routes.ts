import { Router, Request, Response } from 'express';
import { getSessionUser } from '../../lib/auth/session';
import {
  getUserGrowthPathUseCase,
  updateActionProgressUseCase,
  advanceStageIfCompleteUseCase,
} from '../../lib/application/growth-path.usecases';
import { ActionStatus } from '../../lib/domain/growth-path.entity';

export const growthPathRouter = Router();

/**
 * GET /api/growth-path
 * Returns the recommended Growth Path and current stage/actions progress for the authenticated user.
 */
growthPathRouter.get('/', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای مشاهده مسیر رشد، ابتدا وارد حساب کاربری خود شوید.',
        redirectTo: '/login',
      });
    }

    const result = await getUserGrowthPathUseCase(currentUser.id);
    if (!result.success || !result.data) {
      return res.status(400).json({
        success: false,
        error: result.error || 'خطا در بارگذاری مسیر رشد.',
      });
    }

    return res.status(200).json({
      success: true,
      authenticated: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Growth path route error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در دریافت مسیر رشد.',
    });
  }
});

/**
 * POST /api/growth-path/actions/:actionId
 * Updates the completion state (DONE / PENDING / SKIPPED) of a specific action.
 */
growthPathRouter.post('/actions/:actionId', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای ثبت اقدامات، ابتدا وارد حساب کاربری خود شوید.',
      });
    }

    const { actionId } = req.params;
    const { status = 'DONE', date } = req.body;

    const validStatuses: ActionStatus[] = ['DONE', 'PENDING', 'SKIPPED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'وضعیت ارسال‌شده نامعتبر است.',
      });
    }

    const result = await updateActionProgressUseCase({
      userId: currentUser.id,
      actionId,
      status,
      date,
    });

    if (!result.success || !result.data) {
      return res.status(400).json({
        success: false,
        error: result.error || 'خطا در به‌روزرسانی وضعیت اقدام.',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Update action progress error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ثبت اقدام.',
    });
  }
});

/**
 * POST /api/growth-path/advance-stage
 * Advances user to the next stage if all actions in current stage are completed.
 */
growthPathRouter.post('/advance-stage', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای ورود به مرحله بعد، ابتدا وارد حساب کاربری خود شوید.',
      });
    }

    const result = await advanceStageIfCompleteUseCase(currentUser.id);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'امکان ارتقای مرحله وجود ندارد.',
        data: result.data,
      });
    }

    return res.status(200).json({
      success: true,
      advanced: result.advanced,
      data: result.data,
    });
  } catch (error) {
    console.error('Advance stage error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ارتقای مرحله مسیر رشد.',
    });
  }
});
