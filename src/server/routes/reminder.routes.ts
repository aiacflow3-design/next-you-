import { Router, Request, Response } from 'express';
import { getSessionUser } from '../../lib/auth/session';
import { reminderPreferenceRepository } from '../../lib/repositories/reminder-preference.repository';
import { reminderEligibilityService } from '../../lib/application/reminder-eligibility.service';

export const reminderRouter = Router();

/**
 * GET /api/reminders
 * Returns user's reminder preferences and current reminder opportunity
 */
reminderRouter.get('/', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای مشاهده یادآوری‌ها، لطفاً وارد حساب خود شوید.',
      });
    }

    const { preference, opportunity } = await reminderEligibilityService.evaluateReminder(currentUser.id);

    return res.status(200).json({
      success: true,
      preference,
      opportunity,
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در بازیابی یادآوری‌ها.',
    });
  }
});

/**
 * PUT /api/reminders/preferences
 * Updates user's reminder settings
 */
reminderRouter.put('/preferences', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای تغییر تنظیمات یادآوری، لطفاً وارد حساب خود شوید.',
      });
    }

    const {
      enabled,
      timezone,
      preferredTime,
      activeDays,
      dailyActionEnabled,
      weeklyReflectionEnabled,
    } = req.body;

    const updated = await reminderPreferenceRepository.update(currentUser.id, {
      enabled,
      timezone,
      preferredTime,
      activeDays,
      dailyActionEnabled,
      weeklyReflectionEnabled,
    });

    const { opportunity } = await reminderEligibilityService.evaluateReminder(currentUser.id);

    return res.status(200).json({
      success: true,
      preference: updated,
      opportunity,
    });
  } catch (error) {
    console.error('Update reminder preferences error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در ذخیره تنظیمات یادآوری.',
    });
  }
});
