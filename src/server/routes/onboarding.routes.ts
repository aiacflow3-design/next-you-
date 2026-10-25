import { Router, Request, Response } from 'express';
import { getSessionUser } from '../../lib/auth/session';
import { completeOnboardingUseCase } from '../../lib/application/complete-onboarding.usecase';
import { onboardingRepository } from '../../lib/repositories/onboarding.repository';

export const onboardingRouter = Router();

/**
 * GET /api/onboarding
 * Enforces authentication
 */
onboardingRouter.get('/', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        authenticated: false,
        error: 'برای مشاهده وضعیت آشنایی، لطفاً وارد شوید.',
      });
    }

    const profile = await onboardingRepository.findByUserId(currentUser.id);
    return res.status(200).json({
      authenticated: true,
      onboardingCompleted: currentUser.onboardingCompleted,
      profile: profile || null,
    });
  } catch (error) {
    console.error('Onboarding get error:', error);
    return res.status(500).json({ error: 'خطای سرور.' });
  }
});

/**
 * POST /api/onboarding/complete
 * Persists onboarding data (name, primaryGoal, mainObstacle, availableTime,
 * consistencyPattern, desiredSupport, futureSelfVision, completedAt),
 * marks onboardingCompleted = true in users table, and returns redirection to /assessment/initial
 */
onboardingRouter.post('/complete', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        error: 'برای تکمیل مرحله شناخت و آشنایی، ابتدا وارد حساب کاربری خود شوید.',
      });
    }

    const result = await completeOnboardingUseCase(currentUser.id, req.body);
    if (!result.success || !result.user) {
      return res.status(400).json({
        success: false,
        error: result.error || 'خطا در ثبت اطلاعات آشنایی.',
        fieldErrors: result.fieldErrors,
      });
    }

    return res.status(200).json({
      success: true,
      user: result.user,
      profile: result.profile,
      redirectTo: result.redirectTo || '/assessment/initial',
    });
  } catch (error) {
    console.error('Complete onboarding API error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ذخیره‌سازی اطلاعات آشنایی.',
    });
  }
});

/**
 * GET /api/onboarding/status
 * Returns user onboarding status and saved profile
 */
onboardingRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        authenticated: false,
        error: 'احراز هویت نشده.',
      });
    }

    const profile = await onboardingRepository.findByUserId(currentUser.id);

    return res.status(200).json({
      authenticated: true,
      onboardingCompleted: currentUser.onboardingCompleted,
      profile: profile || null,
      goals: currentUser.onboardingGoals || [],
      dailyTime: currentUser.onboardingDailyTime || null,
      experienceLevel: currentUser.onboardingExperienceLevel || null,
      primaryGrowthArea: currentUser.primaryGrowthArea || null,
      currentChallenge: currentUser.currentChallenge || null,
      onboardingCompletedAt: currentUser.onboardingCompletedAt || null,
    });
  } catch (error) {
    console.error('Onboarding status error:', error);
    return res.status(500).json({
      error: 'خطا در دریافت وضعیت آشنایی.',
    });
  }
});
