export type PrimaryGrowthArea = string;
export type CurrentChallenge = string;

export interface OnboardingData {
  goals: string[];
  dailyTime: string;
  experienceLevel: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  onboardingCompleted: boolean;
  hasCompletedAssessment?: boolean;
  onboardingGoals?: string[] | null;
  onboardingDailyTime?: string | null;
  onboardingExperienceLevel?: string | null;
  primaryGrowthArea?: string | null;
  currentChallenge?: string | null;
  onboardingCompletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;
