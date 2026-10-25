import { Response, Request } from 'express';
import { userRepository } from '../repositories/user.repository';
import { sessionRepository } from '../repositories/session.repository';
import { assessmentRepository } from '../repositories/assessment.repository';
import { SafeUser, User } from '../domain/user.entity';

export const SESSION_COOKIE_NAME = 'next_you_session';

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    onboardingCompleted: user.onboardingCompleted,
    onboardingGoals: user.onboardingGoals || [],
    onboardingDailyTime: user.onboardingDailyTime || null,
    onboardingExperienceLevel: user.onboardingExperienceLevel || null,
    primaryGrowthArea: user.primaryGrowthArea || null,
    currentChallenge: user.currentChallenge || null,
    onboardingCompletedAt: user.onboardingCompletedAt || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Determines whether the connection is running over HTTPS (directly or through reverse proxy like Cloud Run)
 */
export function isSecureConnection(req?: Request): boolean {
  if (process.env.NODE_ENV === 'production') return true;
  if (!req) return false;
  const proto = req.headers['x-forwarded-proto'];
  if (proto && typeof proto === 'string') {
    return proto.toLowerCase().includes('https');
  }
  return !!req.secure;
}

/**
 * Sets an HTTP-only session cookie on the response.
 * Uses SameSite=None; Secure in HTTPS environments (including iFrames),
 * with Lax fallback for standard local development.
 */
export function setSessionCookie(res: Response, token: string, req?: Request): void {
  const secure = isSecureConnection(req);
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

/**
 * Clears the session cookie on the response
 */
export function clearSessionCookie(res: Response, req?: Request): void {
  const secure = isSecureConnection(req);
  res.clearCookie(SESSION_COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    secure: secure,
    sameSite: secure ? 'none' : 'lax',
  });
}

/**
 * Validates request session from Cookie OR Authorization Bearer Header.
 * This guarantees session survival across iFrames, mobile browsers, and page refreshes.
 */
export async function getSessionUser(req: Request): Promise<SafeUser | null> {
  let token: string | undefined = req.cookies?.[SESSION_COOKIE_NAME];

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token && req.headers['x-session-token']) {
    token = String(req.headers['x-session-token']).trim();
  }

  if (!token || typeof token !== 'string') {
    return null;
  }

  const session = await sessionRepository.findByToken(token);
  if (!session) {
    return null;
  }

  const user = await userRepository.findById(session.userId);
  if (!user) {
    return null;
  }

  const safeUser = toSafeUser(user);
  const assessment = await assessmentRepository.findByUserId(user.id);
  safeUser.hasCompletedAssessment = !!assessment;

  return safeUser;
}
