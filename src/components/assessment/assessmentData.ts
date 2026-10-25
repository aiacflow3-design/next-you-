import { Shield, Target, Sparkles, Repeat, Zap, Compass, Brain } from 'lucide-react';
import React from 'react';

export type AssessmentCategoryKey = 'discipline' | 'focus' | 'confidence' | 'habits' | 'lifestyle';

export interface AssessmentCategoryInfo {
  key: AssessmentCategoryKey;
  title: string;
  enTitle: string;
  icon: React.ElementType;
  description: string;
}

export const ASSESSMENT_CATEGORIES: AssessmentCategoryInfo[] = [
  {
    key: 'discipline',
    title: 'نظم شخصی',
    enTitle: 'Discipline',
    icon: Shield,
    description: 'سنجش میزان تعهد به خود، پایبندی به ساعات مقرر و اجرای وظایف بدون تعلل',
  },
  {
    key: 'focus',
    title: 'تمرکز',
    enTitle: 'Focus',
    icon: Target,
    description: 'بررسی توانایی کار عمیق، مدیریت توجه و حذف نویزها و حواس‌پرتی‌های محیطی',
  },
  {
    key: 'confidence',
    title: 'اعتماد به نفس',
    enTitle: 'Confidence',
    icon: Sparkles,
    description: 'ارزیابی خودباوری، تصمیم‌گیری مستقل، شهامت اقدام و برخورد با خطاها',
  },
  {
    key: 'habits',
    title: 'ساخت عادت‌ها',
    enTitle: 'Habits',
    icon: Repeat,
    description: 'بررسی سازوکار روتین‌های روزمره، پایداری زنجیره رفتارها و بازیابی پس از لغزش',
  },
  {
    key: 'lifestyle',
    title: 'سبک زندگی',
    enTitle: 'Lifestyle',
    icon: Zap,
    description: 'سنجش تعادل انرژی زیستی، ریتم خواب و بازیابی توان ذهنی برای عملکرد پایدار',
  },
];

export type QuestionType = 'multiple_choice' | 'scale_1_5';

export interface AssessmentQuestionOption {
  id: string;
  label: string;
  desc?: string;
  scoreWeight: number; // 1 to 5
}

export interface AssessmentQuestion {
  id: string;
  category: AssessmentCategoryKey;
  type: QuestionType;
  title: string;
  subtitle: string;
  scaleLabels?: { min: string; max: string };
  options: AssessmentQuestionOption[];
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // 1. DISCIPLINE (Scale 1-5)
  {
    id: 'q_disc_1',
    category: 'discipline',
    type: 'scale_1_5',
    title: 'میزان پایبندی روزانه خودت به برنامه‌ها و ساعات کاری تعیین‌شده را چطور می‌بینی؟',
    subtitle: 'امتیاز ۱ نشان‌دهنده تعلل مکرر و ۵ نشان‌دهنده انضباط و اجرای دقیق است.',
    scaleLabels: { min: 'به ندرت پایبندم', max: 'ثبات و تعهد کامل' },
    options: [
      { id: '1', label: '۱', desc: 'تعلل بسیار بالا و رها کردن برنامه‌ها', scoreWeight: 1 },
      { id: '2', label: '۲', desc: 'شروع خوب اما افت سریع نظم', scoreWeight: 2 },
      { id: '3', label: '۳', desc: 'متوسط؛ نوسانی بسته به انگیزه روزانه', scoreWeight: 3 },
      { id: '4', label: '۴', desc: 'خوب؛ اغلب به تعهداتم وفادارم', scoreWeight: 4 },
      { id: '5', label: '۵', desc: 'عالی؛ انضباط قوی حتی در روزهای سخت', scoreWeight: 5 },
    ],
  },
  // 2. DISCIPLINE (Multiple Choice)
  {
    id: 'q_disc_2',
    category: 'discipline',
    type: 'multiple_choice',
    title: 'وقتی کاری خسته‌کننده، تکراری یا سخت می‌شود، الگوی رفتاری غالب تو چیست؟',
    subtitle: 'نحوه مواجهه با کارهای نیازمند اراده را مشخص کن.',
    options: [
      {
        id: 'disc_2_a',
        label: 'به تعویق می‌اندازم و سراغ کارهای راحت‌تر یا شبکه‌های اجتماعی می‌روم',
        desc: 'تسلیم شدن موقت در برابر راحتی آنی و احساس عذاب وجدان پس از آن',
        scoreWeight: 1.5,
      },
      {
        id: 'disc_2_b',
        label: 'فقط زمانی که ضرب‌الاجل (Deadline) اورژانسی باشد تمامش می‌کنم',
        desc: 'نیاز به اضطرار خارجی برای غلبه بر مقاومت درونی',
        scoreWeight: 2.5,
      },
      {
        id: 'disc_2_c',
        label: 'کار را به بخش‌های بسیار کوچک تقسیم می‌کنم تا اصطکاک شروع کم شود',
        desc: 'استفاده از راهکارهای ساختاری برای دور زدن مقاومت مغز',
        scoreWeight: 4,
      },
      {
        id: 'disc_2_d',
        label: 'با اراده مستقیم و تمرکز عمیق بدون اتلاف وقت انجامش می‌دهم',
        desc: 'ظرفیت بالای تحمل سختی و انضباط خودانگیخته',
        scoreWeight: 5,
      },
    ],
  },

  // 3. FOCUS (Scale 1-5)
  {
    id: 'q_foc_1',
    category: 'focus',
    type: 'scale_1_5',
    title: 'توانایی حفظ تمرکز پیوسته بر یک موضوع مهم (بدون چک کردن گوشی) در چه سطحی است؟',
    subtitle: 'سنجش عمق کار بدون چندوظیفگی (Multitasking).',
    scaleLabels: { min: 'حواس‌پرتی دائمی', max: 'تمرکز عمیق و مستمر' },
    options: [
      { id: '1', label: '۱', desc: 'کمتر از ۵ دقیقه تمرکز متوالی', scoreWeight: 1 },
      { id: '2', label: '۲', desc: 'پرش مداوم توجه بین چند تب و نوتیفیکیشن', scoreWeight: 2 },
      { id: '3', label: '۳', desc: 'تمرکز متوسط برای ۱۵ تا ۲۰ دقیقه', scoreWeight: 3 },
      { id: '4', label: '۴', desc: 'بلوک‌های تمرکز ۴۵ دقیقه‌ای با بازدهی خوب', scoreWeight: 4 },
      { id: '5', label: '۵', desc: 'تسلط کامل بر کار عمیق بیش از ۶۰ دقیقه', scoreWeight: 5 },
    ],
  },
  // 4. FOCUS (Multiple Choice)
  {
    id: 'q_foc_2',
    category: 'focus',
    type: 'multiple_choice',
    title: 'بزرگ‌ترین عامل افت یا پراکندگی تمرکز تو در طول روز چیست؟',
    subtitle: 'شناسایی نقطه نفوذ حواس‌پرتی در جریان کاری روزمره.',
    options: [
      {
        id: 'foc_2_a',
        label: 'اعلان‌ها و وسوسه چک کردن مداوم پیام‌ها و شبکه‌های اجتماعی',
        desc: 'از دست رفتن زنجیره توجه با هر نوتیفیکیشن دریافتی',
        scoreWeight: 2,
      },
      {
        id: 'foc_2_b',
        label: 'نشخوار فکری و پریدن ذهن به دغدغه‌ها و نگرانی‌های آینده',
        desc: 'درگیری روانی با موضوعات نامرتبط در هنگام کار',
        scoreWeight: 2.5,
      },
      {
        id: 'foc_2_c',
        label: 'ابهام در اولویت؛ شروع هم‌زمان چند پروژه بدون اتمام یکی',
        desc: 'شروع‌های موازی و خستگی ناشی از سوئیچ کردن بین کارها',
        scoreWeight: 3,
      },
      {
        id: 'foc_2_d',
        label: 'محیط شلوغ فیزیکی یا درخواست‌های مکرر دیگران',
        desc: 'تداخل‌های محیطی خارج از کنترل مستقیم',
        scoreWeight: 3.5,
      },
    ],
  },

  // 5. CONFIDENCE (Scale 1-5)
  {
    id: 'q_conf_1',
    category: 'confidence',
    type: 'scale_1_5',
    title: 'چقدر خودت را در دستیابی به اهداف ۱ سال آینده توانمند و مطمئن می‌دانی؟',
    subtitle: 'سنجش میزان خودباوری درونی و اعتماد به صلاحیت‌های فردی.',
    scaleLabels: { min: 'شک و تردید شدید', max: 'باور قوی و استوار' },
    options: [
      { id: '1', label: '۱', desc: 'شک شدید به توانایی‌ها و ترس از شکست', scoreWeight: 1 },
      { id: '2', label: '۲', desc: 'امیدوار اما با نوسان دائمی در اعتماد به نفس', scoreWeight: 2 },
      { id: '3', label: '۳', desc: 'خودباوری متوسط در زمینه‌های آشنا', scoreWeight: 3 },
      { id: '4', label: '۴', desc: 'اعتماد به نفس بالا همراه با انگیزه اقدام', scoreWeight: 4 },
      { id: '5', label: '۵', desc: 'یقین کامل به توانایی یادگیری و غلبه بر موانع', scoreWeight: 5 },
    ],
  },
  // 6. CONFIDENCE (Multiple Choice)
  {
    id: 'q_conf_2',
    category: 'confidence',
    type: 'multiple_choice',
    title: 'در مواجهه با یک اشتباه یا نتیجه نامطلوب، اولین گفت‌وگوی درونی‌ات چیست؟',
    subtitle: 'نحوه قضاوت ذهن در برابر فاصله‌گرفتن از ایده‌آل‌ها.',
    options: [
      {
        id: 'conf_2_a',
        label: '«شاید من استعداد کافی ندارم» و دچار عذاب وجدان می‌شوم',
        desc: 'حمله به هویت فردی به جای تفکیک فرآیند از توانمندی',
        scoreWeight: 1.5,
      },
      {
        id: 'conf_2_b',
        label: 'احساس ناامیدی موقت می‌کنم و چند روز انگیزه کار کردن را از دست می‌دهم',
        desc: 'تأثیرپذیری عاطفی بالا از بازخوردهای منفی',
        scoreWeight: 2.5,
      },
      {
        id: 'conf_2_c',
        label: 'سریع استراتژی یا روش کارم را اصلاح می‌کنم و ادامه می‌دهم',
        desc: 'دیدگاه مهندسی و حل مسئله بدون غرق شدن در احساسات منفی',
        scoreWeight: 4.5,
      },
      {
        id: 'conf_2_d',
        label: 'اشتباه را یک داده یادگیری ارزشمند برای تصمیم بعدی می‌دانم',
        desc: 'ذهنیت رشد اصیل و استفاده از شکست به عنوان سکوی پرتاب',
        scoreWeight: 5,
      },
    ],
  },

  // 7. HABITS (Multiple Choice)
  {
    id: 'q_hab_1',
    category: 'habits',
    type: 'multiple_choice',
    title: 'وقتی ۳ روز متوالی یک عادت مهم را از دست می‌دهی، معمولاً چه اتفاقی می‌افتد؟',
    subtitle: 'سازوکار بازیابی پس از شکستن زنجیره عادت‌ها.',
    options: [
      {
        id: 'hab_1_a',
        label: 'کمال‌گرایی منفی مانع می‌شود و کلاً آن عادت را برای مدتی رها می‌کنم',
        desc: 'نگاه صفر و یکی که زنجیره پیوسته را ضروری می‌داند',
        scoreWeight: 1.5,
      },
      {
        id: 'hab_1_b',
        label: 'با فشار و سختی فراوان تلاش می‌کنم دوباره شروع سنگینی داشته باشم',
        desc: 'تکیه بر اراده مقطعی که انرژی روانی زیادی می‌طلبد',
        scoreWeight: 3,
      },
      {
        id: 'hab_1_c',
        label: 'بدون قضاوت منفی، با یک اقدام ۲ دقیقه‌ای بسیار سبک فوراً بازمی‌گردم',
        desc: 'اجرای قانون هرگز دو بار پیاپی غیبت نکن برای حفظ هویت عادت',
        scoreWeight: 4.5,
      },
      {
        id: 'hab_1_d',
        label: 'سیستم ره‌گیری ساده‌ای دارم که خودبه‌خود من را به مسیر بازمی‌گرداند',
        desc: 'تکیه بر سازوکارهای محیطی و یادآورهای سیستمی کم‌اصطکاک',
        scoreWeight: 5,
      },
    ],
  },

  // 8. LIFESTYLE (Multiple Choice)
  {
    id: 'q_life_1',
    category: 'lifestyle',
    type: 'multiple_choice',
    title: 'ریتم انرژی و بیشترین ظرفیت تمرکز روزانه‌ات معمولاً چگونه مدیریت می‌شود؟',
    subtitle: 'شناسایی وضعیت بازیابی و مدیریت توان بیولوژیک.',
    options: [
      {
        id: 'life_1_a',
        label: 'ساعات اولیه صبح با طراوت کامل و بیشترین تمرکز عمیق',
        desc: 'انرژی مطلوب در آغاز روز و ضرورت حفاظت از ساعات صبحگاهی',
        scoreWeight: 4.5,
      },
      {
        id: 'life_1_b',
        label: 'اواخر شب در سکوت، اما با احساس کمبود خواب و خستگی در طول روز',
        desc: 'تمرکز خوب در خلوت شبانه با چالش چرخه بیولوژیک خواب',
        scoreWeight: 3,
      },
      {
        id: 'life_1_c',
        label: 'نوسانی و وابسته به استرس، کافئین و رویدادهای پیش‌بینی‌نشده',
        desc: 'نبود لنگرهای ثبات زیستی (خواب و تغذیه منظم)',
        scoreWeight: 2,
      },
      {
        id: 'life_1_d',
        label: 'یکنواخت با احساس خستگی پنهان و استراحت‌های کاذب با گوشی',
        desc: 'استراحت ناکافی مغز به دلیل مصرف پیوسته محتواهای دیجیتال',
        scoreWeight: 2.5,
      },
    ],
  },
];

export interface AssessmentResultData {
  archetypeTitle: string;
  archetypeTagline: string;
  readinessScore: number;
  categoryScores: Record<AssessmentCategoryKey, number>;
  strengths: { title: string; desc: string }[];
  improvementOpportunities: { title: string; desc: string }[];
  recommendedFirstGrowthPath: {
    title: string;
    subtitle: string;
    durationLabel: string;
    milestones: string[];
  };
}

export function computeAssessmentResult(
  answers: Record<string, string>,
  userGoals?: string[]
): AssessmentResultData {
  let totalScore = 0;
  let maxPossible = 0;

  const catSums: Record<AssessmentCategoryKey, { sum: number; max: number }> = {
    discipline: { sum: 0, max: 0 },
    focus: { sum: 0, max: 0 },
    confidence: { sum: 0, max: 0 },
    habits: { sum: 0, max: 0 },
    lifestyle: { sum: 0, max: 0 },
  };

  for (const q of ASSESSMENT_QUESTIONS) {
    const selectedOptId = answers[q.id];
    const option = q.options.find((o) => o.id === selectedOptId) || q.options[0];

    catSums[q.category].sum += option.scoreWeight;
    catSums[q.category].max += 5;
    totalScore += option.scoreWeight;
    maxPossible += 5;
  }

  const readinessScore = Math.min(Math.round((totalScore / maxPossible) * 100), 100);

  const categoryScores: Record<AssessmentCategoryKey, number> = {
    discipline: Math.round((catSums.discipline.sum / catSums.discipline.max) * 100),
    focus: Math.round((catSums.focus.sum / catSums.focus.max) * 100),
    confidence: Math.round((catSums.confidence.sum / catSums.confidence.max) * 100),
    habits: Math.round((catSums.habits.sum / catSums.habits.max) * 100),
    lifestyle: Math.round((catSums.lifestyle.sum / catSums.lifestyle.max) * 100),
  };

  // Determine Archetype
  let archetypeTitle = 'سازنده باانگیزه نیازمند ساختار';
  let archetypeTagline = 'دارای اشتیاق بالا برای تغییر، نیازمند معماری سیستماتیک جهت تبدیل نیت به استمرار روزانه.';

  if (readinessScore >= 80) {
    archetypeTitle = 'استراتژیست متمرکز بر تحول پایدار';
    archetypeTagline = 'ثبات قدم و ذهنیت ساختاریافته بالا؛ آماده برای گام‌های جهشی و مقیاس‌پذیری عملکرد فردی.';
  } else if (readinessScore >= 65) {
    archetypeTitle = 'پیشگام در حال انضباط‌بخشی';
    archetypeTagline = 'درک دقیق از ارزش عادات؛ نیازمند کاهش اصطکاک روزانه و غلبه بر خستگی ناشی از اراده محض.';
  } else if (categoryScores.confidence > categoryScores.discipline) {
    archetypeTitle = 'ایده‌پرداز مشتاق در انتظار عمل‌گرایی';
    archetypeTagline = 'باور ذهنی شفاف و انرژی اولیه بالا که با ساخت روتین‌های روزمره به دستاوردهای ماندگار بدل می‌شود.';
  }

  // Strengths
  const strengths = [
    {
      title: 'انگیزه درونی و اشتیاق رشد',
      desc: 'آمادگی ذهنی شفاف برای بازنگری در الگوهای گذشته و تعهد به بهتر شدن روزمره.',
    },
    {
      title: 'صداقت در خودارزیابی و واقع‌بینی',
      desc: 'توانایی تفکیک مسائل و عدم انکار چالش‌ها که پیش‌نیاز هر تغییر بنیادین است.',
    },
    {
      title: 'ظرفیت بالای انطباق با ابزارهای ساختارمند',
      desc: 'پذیرش سریع سیستم‌های کم‌اصطکاک برای ساخت روتین‌های جدید.',
    },
  ];

  // Improvement Opportunities
  const improvementOpportunities = [
    {
      title: 'حفاظت از مرزهای تمرکز عمیق (Deep Focus)',
      desc: 'خاموش کردن محرک‌های خارجی و نوتیفیکیشن‌ها برای حضور ۱۰۰٪ در مهم‌ترین اولویت روز.',
    },
    {
      title: 'غلبه بر کمال‌گرایی منفی و مداومت ناقص',
      desc: 'پذیرش اصل ۱٪ بهبود تدریجی به جای توقع نتایج آنی و اجرای روتین‌ها حتی با حداقل مقیاس.',
    },
    {
      title: 'طراحی محیط کم‌اصطکاک برای عادت‌ها',
      desc: 'کاهش مقاومت شروع کارهای مهم و حذف وسوسه‌های حاشیه‌ای از فضای کار و زندگی.',
    },
  ];

  // Recommended First Growth Path
  const primaryGoal = userGoals && userGoals.length > 0 ? userGoals[0] : 'نظم شخصی';
  let pathTitle = 'مسیر روتین‌های غیرقابل‌شکست (Unbreakable Daily Habits)';
  let pathSubtitle = 'معماری روتین‌های کلیدی روزانه برای ایجاد انضباط خودانگیخته بدون فرسودگی.';

  if (primaryGoal === 'تمرکز') {
    pathTitle = 'مسیر کار عمیق و تسلط بر توجه (Deep Focus & Flow)';
    pathSubtitle = 'ساخت دژ تمرکز، خاموش کردن نویزهای محیطی و تثبیت جلسات کار بدون حواس‌پرتی.';
  } else if (primaryGoal === 'رشد شغلی') {
    pathTitle = 'مسیر بازدهی بالا و تصمیم‌گیری استراتژیک (Peak Performance)';
    pathSubtitle = 'مدیریت اولویت‌ها، حذف امور کم‌اثر و تسریع پیشرفت حرفه‌ای با انرژی پایدار.';
  } else if (primaryGoal === 'اعتماد به نفس') {
    pathTitle = 'مسیر خودباوری استوار و غلبه بر شک درونی (Inner Confidence)';
    pathSubtitle = 'ساخت هویت مقتدر، ثبت پیروزی‌های کوچک و ارتقای شجاعت در اقدامات تعیین‌کننده.';
  }

  const recommendedFirstGrowthPath = {
    title: pathTitle,
    subtitle: pathSubtitle,
    durationLabel: '۱۵ تا ۲۰ دقیقه روزانه • گام‌های ملموس',
    milestones: [
      'گام ۱: شناسایی ساعات طلایی و مسدودسازی منابع اتلاف انرژی',
      'گام ۲: ایجاد ۲ عادت لنگرگاهی پایدار در طول ۲۱ روز اول',
      'گام ۳: تثبیت سیستم ارزیابی هفتگی و ارتقای بازدهی',
    ],
  };

  return {
    archetypeTitle,
    archetypeTagline,
    readinessScore,
    categoryScores,
    strengths,
    improvementOpportunities,
    recommendedFirstGrowthPath,
  };
}
