import crypto from 'crypto';
import {
  GrowthDimension,
  GrowthProfile,
  GrowthProfileTraitScores,
  GrowthInsight,
} from './growth-profile.entity';
import { recommendationEngine } from './recommendation-engine';
import { ASSESSMENT_QUESTIONS } from '../../components/assessment/assessmentData';

export interface AssessmentCalculationInput {
  userId: string;
  assessmentId?: string;
  answers: Record<string, string>;
  userGoals?: string[];
}

/**
 * Descriptions for dimensions
 */
const DIMENSION_METADATA: Record<string, { name: string; description: string }> = {
  discipline: {
    name: 'نظم',
    description: 'توانایی تعهد به برنامه‌ریزی، غلبه بر اصطکاک شروع کار و اجرای پیوسته وظایف',
  },
  focus: {
    name: 'تمرکز',
    description: 'عمق توجه ذهنی، توانایی کار پیوسته بدون پرش حواس و کنترل محرک‌های محیطی',
  },
  clarity: {
    name: 'وضوح',
    description: 'شفافیت در اولویت‌بندی، کاهش نشخوار فکری و خودباوری در اتخاذ تصمیمات مهم',
  },
  energy: {
    name: 'انرژی',
    description: 'ریتم سرزندگی زیستی، کیفیت بازیابی روزمره و پایداری عملکرد بدون فرسودگی',
  },
};

/**
 * Descriptive insights for strengths
 */
const STRENGTH_INSIGHTS: Record<string, { title: string; desc: string }> = {
  discipline: {
    title: 'تعهد به چارچوب‌ها و پشتکار اجرایی',
    desc: 'پاسخ‌هایت نشان می‌دهد توانایی مناسبی در پذیرش اصطکاک اولیه و وفاداری به تعهدات داری که پایه‌ای استوار برای هر ساختار جدید است.',
  },
  focus: {
    title: 'عمق توجه و ظرفیت کار بدون وقفه',
    desc: 'پاسخ‌هایت نشان می‌دهد ذهن تو پتانسیل خوبی برای ورود به حالت تمرکز عمیق و حفظ امتداد توجه روی اهداف اصلی دارد.',
  },
  clarity: {
    title: 'دید شفاف و استقلال در اولویت‌گذاری',
    desc: 'پاسخ‌هایت نشان می‌دهد درک روشنی از مسیر مطلوبت داری و توانایی تصمیم‌گیری هوشمندانه یکی از اهرم‌های قدرت توست.',
  },
  energy: {
    title: 'ریتم زیستی و سرزندگی در اقدام',
    desc: 'پاسخ‌هایت نشان می‌دهد از نظر توان بیولوژیک و اشتیاق شروع، ظرفیت بالایی برای پذیرش بار شناختی و رشد فردی داری.',
  },
};

/**
 * Constructive insights for growth opportunities
 */
const OPPORTUNITY_INSIGHTS: Record<string, { title: string; desc: string }> = {
  discipline: {
    title: 'معماری روتین‌های روزمره و انضباط سیستماتیک',
    desc: 'به نظر می‌رسد تقویت نظم خرد و کم‌اصطکاک‌سازی شروع وظایف می‌تواند همان زنجیره اتصالی باشد که سایر توانمندی‌هایت را به ثمر می‌نشاند.',
  },
  focus: {
    title: 'ایزوله‌سازی توجه و مهار ورودی‌های محیطی',
    desc: 'به نظر می‌رسد طراحی محیطی با حداقل حواس‌پرتی و تقسیم روز به بلوک‌های تک‌وظیفه‌ای، راندمان ذهنی‌ات را به طور چشمگیری مضاعف می‌کند.',
  },
  clarity: {
    title: 'شفاف‌سازی گام‌های بعدی و مهار تردیدها',
    desc: 'به نظر می‌رسد مشخص کردن تنها یک اولویت روزانه و مهار نشخوار فکری، مسیر اقدام را برایت بسیار روان‌تر و بااعتمادتر خواهد کرد.',
  },
  energy: {
    title: 'بهینه‌سازی ریتم خواب و بازیابی توان ذهنی',
    desc: 'به نظر می‌رسد استراحت‌های واقعی بدون نمایشگر و تنظیم ساعت خواب می‌تواند پایداری اراده تو را در طول روز تضمین کند.',
  },
};

export class AssessmentEngine {
  /**
   * Deterministically calculates the 4 core dimensions from actual answers
   */
  public calculateGrowthProfile(input: AssessmentCalculationInput): GrowthProfile {
    const { userId, assessmentId, answers } = input;

    // Default weight accumulators
    let disciplineSum = 0;
    let disciplineMax = 0;

    let focusSum = 0;
    let focusMax = 0;

    let claritySum = 0;
    let clarityMax = 0;

    let energySum = 0;
    let energyMax = 0;

    for (const q of ASSESSMENT_QUESTIONS) {
      const selectedId = answers[q.id];
      const opt = q.options.find((o) => o.id === selectedId) || q.options[0];
      const weight = opt.scoreWeight;

      if (q.category === 'discipline') {
        disciplineSum += weight;
        disciplineMax += 5;
      } else if (q.category === 'focus') {
        focusSum += weight;
        focusMax += 5;
      } else if (q.category === 'confidence') {
        // Confidence maps directly to Clarity & self-efficacy
        claritySum += weight;
        clarityMax += 5;
      } else if (q.category === 'lifestyle') {
        // Lifestyle questions map directly to Energy & biological rhythm
        energySum += weight;
        energyMax += 5;
      } else if (q.category === 'habits') {
        // Habits contribute evenly to discipline and clarity
        disciplineSum += weight * 0.5;
        disciplineMax += 2.5;
        energySum += weight * 0.5;
        energyMax += 2.5;
      }
    }

    // Normalization to 0–100 integers
    const disciplineScore = Math.min(100, Math.max(10, Math.round((disciplineSum / (disciplineMax || 1)) * 100)));
    const focusScore = Math.min(100, Math.max(10, Math.round((focusSum / (focusMax || 1)) * 100)));
    const clarityScore = Math.min(100, Math.max(10, Math.round((claritySum / (clarityMax || 1)) * 100)));
    const energyScore = Math.min(100, Math.max(10, Math.round((energySum / (energyMax || 1)) * 100)));

    const traitScores: GrowthProfileTraitScores = {
      discipline: disciplineScore,
      focus: focusScore,
      clarity: clarityScore,
      energy: energyScore,
    };

    const dimensions: GrowthDimension[] = [
      {
        key: 'discipline',
        name: DIMENSION_METADATA.discipline.name,
        score: disciplineScore,
        description: DIMENSION_METADATA.discipline.description,
      },
      {
        key: 'focus',
        name: DIMENSION_METADATA.focus.name,
        score: focusScore,
        description: DIMENSION_METADATA.focus.description,
      },
      {
        key: 'clarity',
        name: DIMENSION_METADATA.clarity.name,
        score: clarityScore,
        description: DIMENSION_METADATA.clarity.description,
      },
      {
        key: 'energy',
        name: DIMENSION_METADATA.energy.name,
        score: energyScore,
        description: DIMENSION_METADATA.energy.description,
      },
    ];

    // Identify Highest (Strength) and Lowest (Opportunity)
    // In edge case where all scores are equal, deterministic resolution chooses focus/discipline gracefully
    const sorted = [...dimensions].sort((a, b) => b.score - a.score);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    // If highest and lowest have the same score (equal scores edge case):
    const isAllEqual = highest.score === lowest.score;
    const strengthDim = isAllEqual ? dimensions[1] : highest; // e.g. Focus
    const opportunityDim = isAllEqual ? dimensions[0] : lowest; // e.g. Discipline

    const keyStrength: GrowthInsight = {
      dimensionKey: strengthDim.key,
      dimensionName: strengthDim.name,
      title: STRENGTH_INSIGHTS[strengthDim.key]?.title || 'تمرکز و ظرفیت ذهنی',
      description:
        STRENGTH_INSIGHTS[strengthDim.key]?.desc ||
        `پاسخ‌هایت نشان می‌دهد در بعد ${strengthDim.name} پتانسیل پایه‌ای بسیار خوبی داری.`,
    };

    const growthOpportunity: GrowthInsight = {
      dimensionKey: opportunityDim.key,
      dimensionName: opportunityDim.name,
      title: OPPORTUNITY_INSIGHTS[opportunityDim.key]?.title || 'انضباط و تثبیت عادات',
      description:
        OPPORTUNITY_INSIGHTS[opportunityDim.key]?.desc ||
        `به نظر می‌رسد ارتقای بعد ${opportunityDim.name} می‌تواند اهرم اصلی برای پیشرفت کلی تو باشد.`,
    };

    // Concise, human-readable, non-clinical summary
    let summary: string;
    if (isAllEqual) {
      summary = `پاسخ‌های تو نشان می‌دهد که ابعاد رشد فردی‌ات در وضعیت همگنی قرار دارند؛ در این شرایط، ساختن یک شالوده انضباطی مشخص می‌تواند سریع‌ترین مسیر را برای ایجاد شتاب در تمام جنبه‌ها فراهم کند.`;
    } else {
      summary = `پاسخ‌هایت نشان می‌دهد که در بعد «${strengthDim.name}» نقطه اتکا و انرژی بسیار خوبی داری؛ در عین حال، به نظر می‌رسد ارتقای «${opportunityDim.name}» می‌تواند بیشترین فرصت رشد را برای هماهنگی و اثربخشی پایدار اقدامات روزانه‌ات ایجاد کند.`;
    }

    // Recommendation based on actual scores
    const recommendedPath = recommendationEngine.evaluate(traitScores);

    const now = new Date().toISOString();

    return {
      id: 'gp_' + crypto.randomUUID().replace(/-/g, ''),
      userId,
      assessmentId: assessmentId || null,
      dimensions,
      traitScores,
      summary,
      keyStrength,
      growthOpportunity,
      recommendedPath,
      createdAt: now,
      updatedAt: now,
    };
  }
}

export const assessmentEngine = new AssessmentEngine();
