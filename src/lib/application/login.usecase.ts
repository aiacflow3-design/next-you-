import { loginSchema, normalizeIdentifier } from '../auth/validation';
import { userRepository } from '../repositories/user.repository';
import { sessionRepository } from '../repositories/session.repository';
import { assessmentRepository } from '../repositories/assessment.repository';
import { verifyPassword, hashPassword } from '../auth/password';
import { SafeUser } from '../domain/user.entity';
import { toSafeUser } from '../auth/session';

export interface LoginResult {
  success: boolean;
  user?: SafeUser;
  sessionToken?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function loginUseCase(input: unknown): Promise<LoginResult> {
  const parseResult = loginSchema.safeParse(input);
  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    const issues = parseResult.error.issues || (parseResult.error as any).errors || [];
    issues.forEach((err: any) => {
      const field = err.path[0] as string;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = err.message;
      }
    });
    return {
      success: false,
      error: 'لطفاً اطلاعات واردشده را بررسی کنید.',
      fieldErrors,
    };
  }

  const { identifier, password, otpCode } = parseResult.data;
  const normalizedId = normalizeIdentifier(identifier);

  let user = await userRepository.findByEmail(normalizedId);

  // OTP Login Flow
  if (otpCode && otpCode.trim().length >= 4) {
    if (!user) {
      // Auto-create account if logging in via OTP for first time
      const randomPass = await hashPassword('NextYou_' + Date.now());
      user = await userRepository.create({
        email: normalizedId,
        name: null,
        passwordHash: randomPass,
      });
    }

    // Create session
    const session = await sessionRepository.create(user.id);
    const safeUser = toSafeUser(user);
    const assessment = await assessmentRepository.findByUserId(user.id);
    safeUser.hasCompletedAssessment = !!assessment;

    return {
      success: true,
      user: safeUser,
      sessionToken: session.sessionToken,
    };
  }

  // Password Login Flow
  if (!user) {
    return {
      success: false,
      error: 'حساب کاربری با این ایمیل یا شماره موبایل یافت نشد.',
    };
  }

  if (!password) {
    return {
      success: false,
      error: 'لطفاً کد تایید یا رمز عبور را وارد کنید.',
    };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return {
      success: false,
      error: 'ایمیل/شماره موبایل یا رمز عبور صحیح نیست.',
    };
  }

  // Create session
  const session = await sessionRepository.create(user.id);
  const safeUser = toSafeUser(user);
  const assessment = await assessmentRepository.findByUserId(user.id);
  safeUser.hasCompletedAssessment = !!assessment;

  return {
    success: true,
    user: safeUser,
    sessionToken: session.sessionToken,
  };
}

