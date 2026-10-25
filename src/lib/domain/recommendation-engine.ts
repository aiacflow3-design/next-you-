import { GrowthPathRecommendation, GrowthProfileTraitScores } from './growth-profile.entity';

export interface RecommendationRule {
  id: string;
  name: string;
  evaluate: (scores: GrowthProfileTraitScores) => GrowthPathRecommendation | null;
}

/**
 * Standard rule for V1:
 * If discipline is below threshold (e.g. <= 75) or represents the primary growth opportunity,
 * recommend the foundational "نظم شخصی" path.
 */
export const DisciplineFoundationRule: RecommendationRule = {
  id: 'discipline_foundation',
  name: 'قانون بنیادین انضباط فردی',
  evaluate: (scores: GrowthProfileTraitScores) => {
    // V1 primary rule: discipline is the foundation of the whole system
    if (scores.discipline <= 80 || scores.discipline <= scores.focus) {
      return {
        slug: 'discipline',
        title: 'نظم شخصی',
        tagline: 'معماری عادات پایدار و ساختارهای روزمره ضدلغزش',
        description:
          'سیستمی برای کاهش اصطکاک شروع وظایف، غلبه بر خستگی اراده و تثبیت تعهدات روزانه بدون اتکا به انگیزه‌های زودگذر.',
        targetTrait: 'نظم',
        keyPractices: [
          'قانون ورود ۲ دقیقه‌ای برای شکستن مقاومت شروع',
          'طراحی روتین صبحگاهی بدون نمایشگر و اعلان‌ها',
          'بستن حلقه‌های تعلل در پایان هر روز',
        ],
      };
    }
    return null;
  },
};

/**
 * Extensible rule for Focus path (ready for future activation)
 */
export const FocusFlowRule: RecommendationRule = {
  id: 'focus_flow',
  name: 'قانون کار عمیق و مهار حواس‌پرتی',
  evaluate: (scores: GrowthProfileTraitScores) => {
    if (scores.focus < scores.discipline && scores.focus < 65) {
      return {
        slug: 'focus',
        title: 'کار عمیق و تمرکز',
        tagline: 'تسلط بر توجه و حذف اضافات شناختی',
        description: 'ایجاد بلوک‌های کار عمیق ۹۰ دقیقه‌ای، ایزوله‌سازی حواس‌پرتی‌ها و ورود به حالت جریان ذهنی.',
        targetTrait: 'تمرکز',
        keyPractices: [
          'بلوک‌های تمرکز ۹۰ دقیقه‌ای بدون وقفه',
          'تک‌محوری در برابر توهم چندوظیفگی',
          'پروتکل تخلیه ذهن از دغدغه‌های شناور',
        ],
      };
    }
    return null;
  },
};

/**
 * Extensible rule for Clarity path (ready for future activation)
 */
export const ClarityPathRule: RecommendationRule = {
  id: 'clarity_path',
  name: 'قانون وضوح مسیر و تصمیم‌گیری',
  evaluate: (scores: GrowthProfileTraitScores) => {
    if (scores.clarity < 60 && scores.clarity < scores.discipline) {
      return {
        slug: 'clarity',
        title: 'وضوح مسیر و اولویت‌بندی',
        tagline: 'تفکیک اولویت‌های اساسی از کارهای کاذب',
        description: 'تمرکز بر تصمیم‌گیری شفاف، کاهش نشخوار فکری و شفاف‌سازی جهت‌گیری ۶ ماه آینده.',
        targetTrait: 'وضوح',
        keyPractices: [
          'قانون ۲۰/۸۰ در انتخاب اهداف کلیدی',
          'نوشتن روزانه اولویت بدون ابهام',
          'فیلتر کردن پروژه‌های موازی انرژی‌بر',
        ],
      };
    }
    return null;
  },
};

export class RecommendationEngine {
  private rules: RecommendationRule[];

  constructor(rules: RecommendationRule[] = [DisciplineFoundationRule, FocusFlowRule, ClarityPathRule]) {
    this.rules = rules;
  }

  public registerRule(rule: RecommendationRule): void {
    this.rules.push(rule);
  }

  public evaluate(scores: GrowthProfileTraitScores): GrowthPathRecommendation {
    for (const rule of this.rules) {
      const match = rule.evaluate(scores);
      if (match) {
        return match;
      }
    }

    // Default V1 Fallback
    return {
      slug: 'discipline',
      title: 'نظم شخصی',
      tagline: 'معماری عادات پایدار و ساختارهای روزمره ضدلغزش',
      description:
        'سیستمی برای کاهش اصطکاک شروع وظایف، غلبه بر خستگی اراده و تثبیت تعهدات روزانه بدون اتکا به انگیزه‌های زودگذر.',
      targetTrait: 'نظم',
      keyPractices: [
        'قانون ورود ۲ دقیقه‌ای برای شکستن مقاومت شروع',
        'طراحی روتین صبحگاهی بدون نمایشگر و اعلان‌ها',
        'بستن حلقه‌های تعلل در پایان هر روز',
      ],
    };
  }
}

export const recommendationEngine = new RecommendationEngine();
