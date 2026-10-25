export type TraitKey = 'discipline' | 'focus' | 'clarity' | 'energy' | string;

export interface GrowthDimension {
  key: TraitKey;
  name: string; // e.g. "نظم", "تمرکز", "وضوح", "انرژی"
  score: number; // 0 to 100
  description: string;
}

export interface GrowthProfileTraitScores {
  discipline: number;
  focus: number;
  clarity: number;
  energy: number;
  [key: string]: number;
}

export interface GrowthInsight {
  dimensionKey: TraitKey;
  dimensionName: string;
  title: string;
  description: string;
}

export interface GrowthPathRecommendation {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  targetTrait: string;
  keyPractices: string[];
}

export interface GrowthProfile {
  id: string;
  userId: string;
  assessmentId?: string | null;
  dimensions: GrowthDimension[];
  traitScores: GrowthProfileTraitScores;
  summary: string;
  keyStrength: GrowthInsight;
  growthOpportunity: GrowthInsight;
  recommendedPath: GrowthPathRecommendation;
  createdAt: string;
  updatedAt: string;
}
