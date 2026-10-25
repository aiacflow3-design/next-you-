import { userRepository } from '../repositories/user.repository';
import { assessmentRepository } from '../repositories/assessment.repository';
import { growthProfileRepository } from '../repositories/growth-profile.repository';
import { computeAssessmentResult, AssessmentResultData } from '../../components/assessment/assessmentData';
import { assessmentEngine } from '../domain/assessment-engine';
import { GrowthProfile } from '../domain/growth-profile.entity';

export interface SubmitAssessmentResult {
  success: boolean;
  authenticated: boolean;
  result?: AssessmentResultData;
  growthProfile?: GrowthProfile;
  redirectTo?: string;
  error?: string;
}

export async function submitAssessmentUseCase(
  userId: string,
  answers: Record<string, string>
): Promise<SubmitAssessmentResult> {
  if (!userId) {
    return {
      success: false,
      authenticated: false,
      error: 'برای تحلیل باید وارد حساب خودتون بشید',
    };
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    return {
      success: false,
      authenticated: false,
      error: 'برای تحلیل باید وارد حساب خودتون بشید',
    };
  }

  if (!answers || Object.keys(answers).length === 0) {
    return {
      success: false,
      authenticated: true,
      error: 'لطفاً به پرسش‌های ارزیابی پاسخ دهید.',
    };
  }

  // 1. Compute assessment result for compatibility with assessment views
  const computed = computeAssessmentResult(answers, user.onboardingGoals || []);

  // 2. Persist assessment record
  const savedAssessment = await assessmentRepository.saveAssessment(user.id, {
    answers,
    categoryScores: computed.categoryScores,
    readinessScore: computed.readinessScore,
    archetypeTitle: computed.archetypeTitle,
    archetypeTagline: computed.archetypeTagline,
    recommendedPath: computed.recommendedFirstGrowthPath.title,
    strengths: computed.strengths,
    opportunities: computed.improvementOpportunities,
  });

  // 3. Deterministically calculate the real 4-dimension Growth Profile
  const calculatedProfile = assessmentEngine.calculateGrowthProfile({
    userId: user.id,
    assessmentId: savedAssessment.id,
    answers,
    userGoals: user.onboardingGoals || [],
  });

  // 4. Persist the Growth Profile entity in database
  const savedProfile = await growthProfileRepository.saveProfile(calculatedProfile);

  return {
    success: true,
    authenticated: true,
    result: computed,
    growthProfile: savedProfile,
    redirectTo: '/growth-profile',
  };
}
