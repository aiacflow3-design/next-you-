import { Router, Request, Response } from 'express';
import { getSessionUser } from '../../lib/auth/session';
import { coachService } from '../../lib/coach/coach.service';
import { buildCoachContext } from '../../lib/coach/coach-context.builder';

export const coachRouter = Router();

/**
 * POST /api/coach/chat
 * Handles conversational interaction with the AI Coach.
 * Derives userId strictly from authenticated session cookie.
 * NEVER trusts userId from request body.
 */
coachRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    const userId = currentUser ? currentUser.id : null;

    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'متن پیام الزامی است.',
      });
    }

    const response = await coachService.handleChat({
      userId,
      message: message.trim(),
      history: Array.isArray(history) ? history : [],
    });

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('Coach chat route error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ارتباط با مربی رشد.',
    });
  }
});

/**
 * GET /api/coach/context
 * Returns current context summary and context-aware quick prompts.
 */
coachRouter.get('/context', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    const userId = currentUser ? currentUser.id : null;

    const context = userId ? await buildCoachContext(userId) : null;
    const quickPrompts = coachService.getQuickPrompts(context);

    return res.status(200).json({
      success: true,
      authenticated: !!currentUser,
      quickPrompts,
      summary: context
        ? {
            userName: context.userName,
            pathTitle: context.path.title,
            currentStage: context.currentStage.title,
            overallProgress: context.path.overallProgress,
            todayAction: context.todayAction
              ? {
                  title: context.todayAction.title,
                  estimatedMinutes: context.todayAction.estimatedMinutes,
                  isCompletedToday: context.todayAction.isCompletedToday,
                }
              : null,
          }
        : null,
    });
  } catch (error) {
    console.error('Coach context route error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در دریافت بافتار مربی.',
    });
  }
});
