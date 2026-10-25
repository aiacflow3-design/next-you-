import { registerSchema, normalizeIdentifier } from '../auth/validation';
import { userRepository } from '../repositories/user.repository';
import { sessionRepository } from '../repositories/session.repository';
import { hashPassword } from '../auth/password';
import { SafeUser } from '../domain/user.entity';
import { toSafeUser } from '../auth/session';

export interface RegisterResult {
  success: boolean;
  user?: SafeUser;
  sessionToken?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function registerUseCase(input: unknown): Promise<RegisterResult> {
  const parseResult = registerSchema.safeParse(input);
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

  const { identifier, password, name } = parseResult.data;
  const normalizedId = normalizeIdentifier(identifier);

  // Check if identifier already registered
  const existingUser = await userRepository.findByEmail(normalizedId);
  if (existingUser) {
    return {
      success: false,
      error: 'این حساب (ایمیل یا شماره) قبلاً ثبت شده است. لطفاً وارد شوید.',
      fieldErrors: {
        identifier: 'این حساب قبلاً ثبت شده است.',
      },
    };
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await userRepository.create({
    email: normalizedId,
    name: name || null,
    passwordHash,
  });

  // Auto-create session
  const session = await sessionRepository.create(user.id);

  return {
    success: true,
    user: toSafeUser(user),
    sessionToken: session.sessionToken,
  };
}

