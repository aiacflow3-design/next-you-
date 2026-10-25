import { userRepository } from '../repositories/user.repository';
import { assessmentRepository } from '../repositories/assessment.repository';
import { growthProfileRepository } from '../repositories/growth-profile.repository';
import { assessmentEngine } from '../domain/assessment-engine';
import { GrowthProfile } from '../domain/growth-profile.entity';

export interface GetGrowthProfileResult {
  success: boolean;
  authenticated: boolean;
  hasCompletedAssessment?: boolean;
  profile?: GrowthProfile;
  redirectTo?: string;
  error?: string;
}

export async function getGrowthProfileUseCase(userId: string): Promise<GetGrowthProfileResult> {
  if (!userId) {
    return {
      success: false,
      authenticated: false,
      error: 'برای مشاهده پروفایل رشد ابتدا وارد حساب کاربری خود شوید.',
      redirectTo: '/login',
    };
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    return {
      success: false,
      authenticated: false,
      error: 'کاربر معتبر نیست.',
      redirectTo: '/login',
    };
  }

  // 1. Try to find existing Growth Profile in repository
  const existingProfile = await growthProfileRepository.findByUserId(userId);
  if (existingProfile) {
    return {
      success: true,
      authenticated: true,
      hasCompletedAssessment: true,
      profile: existingProfile,
    };
  }

  // 2. If not found in growth_profiles, check if user has an assessment_results record
  const assessment = await assessmentRepository.findByUserId(userId);
  if (assessment && assessment.answers && Object.keys(assessment.answers).length > 0) {
    // Generate and persist Growth Profile from actual assessment answers
    const calculated = assessmentEngine.calculateGrowthProfile({
      userId: user.id,
      assessmentId: assessment.id,
      answers: assessment.answers,
      userGoals: user.onboardingGoals || [],
    });

    const saved = await growthProfileRepository.saveProfile(calculated);
    return {
      success: true,
      authenticated: true,
      hasCompletedAssessment: true,
      profile: saved,
    };
  }

  // 3. User has not completed assessment
  return {
    success: false,
    authenticated: true,
    hasCompletedAssessment: false,
    redirectTo: '/assessment/initial',
    error: 'برای مشاهده پروفایل رشد، ابتدا ارزیابی اولیه را تکمیل کنید.',
  };
}
