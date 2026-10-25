export interface OnboardingProfile {
  id: string;
  userId: string;
  name: string;
  primaryGoal: string;
  mainObstacle: string;
  availableTime: string;
  consistencyPattern: string;
  desiredSupport: string;
  futureSelfVision: string;
  completedAt: string;
  createdAt: string;
}

export type OnboardingSubmissionPayload = {
  name: string;
  primaryGoal: string;
  mainObstacle: string;
  availableTime: string;
  consistencyPattern: string;
  desiredSupport: string;
  futureSelfVision: string;
};
