import { Router, Request, Response } from 'express';
import { getSessionUser } from '../../lib/auth/session';
import { getGrowthProfileUseCase } from '../../lib/application/get-growth-profile.usecase';

export const growthProfileRouter = Router();

/**
 * GET /api/growth-profile
 * Returns the authenticated user's persistent Growth Profile.
 * If user is not authenticated -> 401.
 * If user hasn't completed assessment -> returns hasCompletedAssessment: false and redirectTo: '/assessment/initial'
 */
growthProfileRouter.get('/', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای مشاهده پروفایل رشد، ابتدا وارد حساب خود شوید.',
        redirectTo: '/login',
      });
    }

    const result = await getGrowthProfileUseCase(currentUser.id);

    if (!result.success) {
      return res.status(200).json(result);
    }

    return res.status(200).json({
      success: true,
      authenticated: true,
      profile: result.profile,
    });
  } catch (error) {
    console.error('Growth profile API error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در بارگذاری پروفایل رشد.',
    });
  }
});
