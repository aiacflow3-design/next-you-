export interface SkillCategory {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  iconName: string;
  highlights: string[];
}

export interface GrowthPathPreview {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: 'مقدماتی' | 'متوسط' | 'پیشرفته';
  estimatedWeeks: number;
  stagesCount: number;
  activeCount?: string;
  targetTrait: string;
}

export interface JourneyStage {
  step: number;
  stageName: string;
  subTitle: string;
  description: string;
  focus: string;
  tag: string;
}
