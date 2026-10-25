import { completeOnboardingSchema } from '../onboarding/validation';
import { onboardingRepository } from '../repositories/onboarding.repository';
import { userRepository } from '../repositories/user.repository';
import { SafeUser } from '../domain/user.entity';
import { OnboardingProfile } from '../domain/onboarding.entity';
import { toSafeUser } from '../auth/session';

export interface CompleteOnboardingResult {
  success: boolean;
  user?: SafeUser;
  profile?: OnboardingProfile;
  redirectTo?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function completeOnboardingUseCase(
  userId: string,
  input: unknown
): Promise<CompleteOnboardingResult> {
  if (!userId) {
    return {
      success: false,
      error: 'کاربر احراز هویت نشده است.',
    };
  }

  // Find user
  const user = await userRepository.findById(userId);
  if (!user) {
    return {
      success: false,
      error: 'کاربر مورد نظر یافت نشد.',
    };
  }

  // Validate input
  const parseResult = completeOnboardingSchema.safeParse(input);
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
      error: 'لطفاً پاسخ تمامی بخش‌ها را کامل کنید.',
      fieldErrors,
    };
  }

  try {
    const { profile, updatedUser } = await onboardingRepository.saveProfile(
      user.id,
      parseResult.data
    );

    return {
      success: true,
      user: toSafeUser(updatedUser),
      profile,
      redirectTo: '/assessment/initial',
    };
  } catch (error) {
    console.error('Failed to complete onboarding usecase:', error);
    return {
      success: false,
      error: 'خطا در ثبت پایدار اطلاعات آشنایی. لطفاً مجدداً تلاش کنید.',
    };
  }
}
