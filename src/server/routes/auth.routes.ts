import { Router, Request, Response } from 'express';
import { registerUseCase } from '../../lib/application/register.usecase';
import { loginUseCase } from '../../lib/application/login.usecase';
import { normalizeIdentifier } from '../../lib/auth/validation';
import {
  setSessionCookie,
  clearSessionCookie,
  getSessionUser,
  SESSION_COOKIE_NAME,
} from '../../lib/auth/session';
import { sessionRepository } from '../../lib/repositories/session.repository';
import { userRepository } from '../../lib/repositories/user.repository';

export const authRouter = Router();

/**
 * POST /api/auth/check-identifier
 * Checks whether an email or phone number is already registered
 */
authRouter.post('/check-identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.body;
    if (!identifier || typeof identifier !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'ایمیل یا شماره موبایل وارد نشده است.',
      });
    }

    const normalized = normalizeIdentifier(identifier);
    const existing = await userRepository.findByEmail(normalized);

    return res.status(200).json({
      success: true,
      exists: !!existing,
      identifier: normalized,
      hasName: !!existing?.name,
      name: existing?.name || null,
    });
  } catch (error) {
    console.error('Check identifier error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطایی در بررسی شناسه رخ داد.',
    });
  }
});

/**
 * POST /api/auth/register
 * Validates with Zod, creates user with bcrypt hash, auto-logs in with HTTP-only cookie
 */
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const result = await registerUseCase(req.body);
    if (!result.success || !result.user || !result.sessionToken) {
      return res.status(400).json({
        success: false,
        error: result.error || 'خطا در ثبت نام.',
        fieldErrors: result.fieldErrors,
      });
    }

    setSessionCookie(res, result.sessionToken, req);

    return res.status(201).json({
      success: true,
      user: result.user,
      sessionToken: result.sessionToken,
    });
  } catch (error) {
    console.error('Registration server error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطایی در سرور رخ داد. لطفاً دوباره تلاش کنید.',
    });
  }
});

/**
 * POST /api/auth/login
 * Validates with Zod, verifies credentials, sets HTTP-only cookie, prevents user enumeration
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const result = await loginUseCase(req.body);
    if (!result.success || !result.user || !result.sessionToken) {
      return res.status(401).json({
        success: false,
        error: result.error || 'ایمیل یا رمز عبور صحیح نیست.',
        fieldErrors: result.fieldErrors,
      });
    }

    setSessionCookie(res, result.sessionToken, req);

    return res.status(200).json({
      success: true,
      user: result.user,
      sessionToken: result.sessionToken,
    });
  } catch (error) {
    console.error('Login server error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطایی در سرور رخ داد. لطفاً دوباره تلاش کنید.',
    });
  }
});

/**
 * GET /api/auth/me
 * Returns current authenticated user profile from HTTP-only session cookie
 */
authRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return res.status(200).json({
        authenticated: false,
        user: null,
      });
    }

    return res.status(200).json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(500).json({
      authenticated: false,
      user: null,
      error: 'خطا در بررسی سشن',
    });
  }
});

/**
 * POST /api/auth/logout
 * Deletes server-side session and clears HTTP-only cookie
 */
authRouter.post('/logout', async (req: Request, res: Response) => {
  try {
    let token = req.cookies?.[SESSION_COOKIE_NAME];
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7).trim();
    }
    if (token && typeof token === 'string') {
      await sessionRepository.deleteByToken(token);
    }
    clearSessionCookie(res, req);
    return res.status(200).json({
      success: true,
      message: 'خروج با موفقیت انجام شد.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    clearSessionCookie(res, req);
    return res.status(200).json({
      success: true,
    });
  }
});

/**
 * POST /api/auth/complete-onboarding
 * Marks onboarding as complete for the logged-in user
 */
authRouter.post('/complete-onboarding', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        error: 'برای تکمیل آشنایی، ابتدا وارد شوید.',
      });
    }

    const updated = await userRepository.updateOnboardingStatus(currentUser.id, true);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد.',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        onboardingCompleted: true,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی وضعیت آنبوردینگ',
    });
  }
});
