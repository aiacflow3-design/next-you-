export interface AssessmentCategoryScores {
  discipline: number;
  focus: number;
  confidence: number;
  habits: number;
  lifestyle: number;
}

export interface AssessmentResultRecord {
  id: string;
  userId: string;
  answers: Record<string, string>;
  disciplineScore: number;
  focusScore: number;
  confidenceScore: number;
  habitsScore: number;
  lifestyleScore: number;
  readinessScore: number;
  archetypeTitle: string;
  archetypeTagline: string;
  recommendedPath: string;
  strengths: Array<{ title: string; desc: string }>;
  opportunities: Array<{ title: string; desc: string }>;
  completedAt: string;
  createdAt: string;
}

export interface StoredGrowthProfile {
  discipline: number;
  focus: number;
  confidence: number;
  recommendedPath: string;
}
