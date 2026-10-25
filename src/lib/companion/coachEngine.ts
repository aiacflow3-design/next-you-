import { SafeUser } from '../domain/user.entity';
import { GrowthProfile } from '../../context/AuthContext';

export interface CompanionMessage {
  id: string;
  sender: 'companion' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    route: string;
  };
}

export interface GrowthInsight {
  id: string;
  title: string;
  category: 'discipline' | 'focus' | 'confidence' | 'lifestyle';
  description: string;
  actionableStep: string;
  priority: 'بالا' | 'متوسط' | 'راهبردی';
}

export interface CoachingSuggestion {
  id: string;
  label: string;
  prompt: string;
  category: string;
}

export interface CompanionContextData {
  user: SafeUser | null;
  growthProfile: GrowthProfile | null;
  dailyTime?: string | null;
  goals?: string[] | null;
  streakDays?: number;
  xp?: number;
}

/**
 * Default starter suggestions for visitors (unauthenticated)
 */
export const VISITOR_SUGGESTIONS: CoachingSuggestion[] = [
  {
    id: 'v1',
    label: 'سیستم NEXT YOU چطور کار می‌کنه؟',
    prompt: 'می‌خواهم بدانم متدولوژی و رویکرد NEXT YOU در رشد فردی چیست؟',
    category: 'آشنایی',
  },
  {
    id: 'v2',
    label: 'ارزیابی اولیه چیست؟',
    prompt: 'ارزیابی خودشناسی شامل چه مواردی است و چه کمکی به من می‌کند؟',
    category: 'ارزیابی',
  },
  {
    id: 'v3',
    label: 'چرا انضباط مهم‌تر از انگیزه است؟',
    prompt: 'چرا تمرکز شما بیشتر روی انضباط و سیستم است تا انگیزه کوتاه‌مدت؟',
    category: 'فلسفه',
  },
  {
    id: 'v4',
    label: 'چطور شروع کنم؟',
    prompt: 'چطور می‌توانم اولین قدم را برای شروع مسیر بردارم؟',
    category: 'شروع',
  },
];

/**
 * Generate personalized suggestions based on user profile
 */
export function getPersonalizedSuggestions(data: CompanionContextData): CoachingSuggestion[] {
  if (!data.user) {
    return VISITOR_SUGGESTIONS;
  }

  const suggestions: CoachingSuggestion[] = [];
  const profile = data.growthProfile;

  if (profile) {
    if (profile.discipline < 75) {
      suggestions.push({
        id: 'p_disc',
        label: 'غلبه بر اهمال‌کاری امروز',
        prompt: 'امروز احساس سستی و اهمال‌کاری دارم. چه پروتکل سریعی برای شکستن این مقاومت ذهنی پیشنهاد می‌کنی؟',
        category: 'انضباط',
      });
    }

    if (profile.focus < 80) {
      suggestions.push({
        id: 'p_focus',
        label: 'ساخت بلوک تمرکز عمیق ۹۰ دقیقه‌ای',
        prompt: 'چگونه می‌توانم یک بلوک کار عمیق بدون هیچ حواس‌پرتی بسازم؟',
        category: 'تمرکز',
      });
    }

    if (profile.confidence < 80) {
      suggestions.push({
        id: 'p_conf',
        label: 'مواجهه با خودانتقادی و تردید',
        prompt: 'وقتی در تصمیم‌گیری‌ها دچار شک و نشخوار فکری می‌شوم، چه چارچوبی به من کمک می‌کند؟',
        category: 'اعتماد به نفس',
      });
    }
  }

  suggestions.push({
    id: 'p_daily',
    label: `برنامه‌ریزی بر اساس زمان روزانه‌ام (${data.dailyTime || '۲۰ دقیقه'})`,
    prompt: `با توجه به تعهد روزانه من (${data.dailyTime || '۲۰ دقیقه'})، مؤثرترین توالی اقدامات برای امروز چیست؟`,
    category: 'روتین',
  });

  suggestions.push({
    id: 'p_path',
    label: 'تحلیل مسیر رشد فعلی من',
    prompt: 'مسیر رشدی که در ارزیابی برای من تعیین شده را چطور در زندگی واقعی تثبیت کنم؟',
    category: 'مسیر',
  });

  return suggestions;
}

/**
 * Generate personal growth insights based on assessment profile
 */
export function getGrowthInsights(data: CompanionContextData): GrowthInsight[] {
  const profile = data.growthProfile;
  const time = data.dailyTime || '۲۰ الی ۳۰ دقیقه';

  const insights: GrowthInsight[] = [
    {
      id: 'ins_1',
      title: 'اهرم انضباط سیستماتیک به جای اتکا به اراده',
      category: 'discipline',
      description:
        'اراده یک منبع بیولوژیک محدود است که در طول روز تخلیه می‌شود. کلید ماندگاری در ایجاد موانع اصطکاکی برای عادات بد و هموارسازی مسیر برای اقدامات کلیدی است.',
      actionableStep: 'سخت‌ترین وظیفه روز را در اولین ساعت بیداری (پیش از چک کردن تلفن) در بلوک ۲۰ دقیقه‌ای به پایان برسان.',
      priority: 'بالا',
    },
    {
      id: 'ins_2',
      title: 'تک‌محوری در برابر توهم چندوظیفگی (Multitasking)',
      category: 'focus',
      description:
        'سوئیچ مداوم بین وظایف، باقی‌مانده توجه (Attention Residue) ایجاد می‌کند و راندمان شناختی را تا ۴۰٪ کاهش می‌دهد.',
      actionableStep: 'در زمان کار، تمام اعلان‌ها را مسدود کن و فقط یک تب فعال در مرورگر باز بگذار.',
      priority: 'بالا',
    },
    {
      id: 'ins_3',
      title: 'تنظیم ریتم بر اساس تعهد روزانه',
      category: 'lifestyle',
      description: `تعهد زمانی شما (${time}) برای ساخت شتاب اولیه بسیار عالی است. پایداری یک عادت ۲۰ دقیقه‌ای در ۹۰ روز، اثری بزرگ‌تر از جهش‌های موقت چندساعته دارد.`,
      actionableStep: 'به قانون دو دقیقه پایبند باش: هرگز اجازه نده دو روز متوالی زنجیره عادت بشکند.',
      priority: 'متوسط',
    },
  ];

  if (profile && profile.confidence < 75) {
    insights.push({
      id: 'ins_4',
      title: 'اعتماد به نفس از اقدام می‌آید، نه از تفکر',
      category: 'confidence',
      description:
        'خودباوری واقعی نتیجه جمع‌آوری شواهد غیرقابل‌انکار از وفاداری به قول‌هایی است که به خودتان می‌دهید.',
      actionableStep: 'امشب یک تعهد بسیار کوچک اما قطعی ثبت کن و فردا بدون معطلی انجامش بده.',
      priority: 'راهبردی',
    });
  }

  return insights;
}

/**
 * Generate coach response intelligently based on query and context
 */
export function generateCoachResponse(
  userQuery: string,
  context: CompanionContextData
): { text: string; action?: { label: string; route: string } } {
  const q = userQuery.trim().toLowerCase();
  const userName = context.user?.name || 'همراه گرامی';
  const isAuth = !!context.user;

  // Unauthenticated inquiries
  if (!isAuth) {
    if (q.includes('چطور شروع') || q.includes('ثبت‌نام') || q.includes('شروع کنم')) {
      return {
        text: 'برای شروع، بهترین قدم انجام «ارزیابی اولیه خودشناسی» است. این ارزیابی رایگان در ۳ دقیقه ۵ بُعد اساسی رشد شما شامل نظم، تمرکز، اعتماد‌به‌نفس و عادات را تحلیل کرده و مسیر اختصاصی‌تان را مشخص می‌کند.',
        action: {
          label: 'شروع ارزیابی و ثبت‌نام',
          route: '/register',
        },
      };
    }

    if (q.includes('چیست') || q.includes('سیستم') || q.includes('متدولوژی') || q.includes('معرفی')) {
      return {
        text: 'NEXT YOU یک پلتفرم رشد فردی مبتنی بر فلسفه عمل‌گرایی و علوم شناختی است. ما اعتقاد داریم انگیزه زودگذر است، اما «سیستم‌های انضباط فردی»، «تمرکز عمیق» و «عادت‌های کوچک پیوسته» شخصیت آینده تو را می‌سازند.',
        action: {
          label: 'مشاهده ارزیابی خودشناسی',
          route: '/register',
        },
      };
    }

    if (q.includes('انضباط') || q.includes('انگیزه')) {
      return {
        text: 'انگیزه جرقه‌ای است که شما را راه می‌اندازد، اما انضباط آتشی است که شما را در مسیر نگه می‌دارد. وقتی خسته یا بی‌حوصله‌اید، انگیزه شما را رها می‌کند؛ اما یک سیستم شفاف دقیقاً به شما می‌گوید چه کاری را در چه زمانی انجام دهید.',
      };
    }

    return {
      text: 'من دستیار و مربی همراه شما در NEXT YOU هستم. می‌توانم به شما در شناخت نقشه رشد، شروع ارزیابی اختصاصی و ساخت عادات پایدار کمک کنم. چه سؤالی درباره متدولوژی ما داری؟',
      action: {
        label: 'ورود و شروع مسیر',
        route: '/login',
      },
    };
  }

  const profile = context.growthProfile;
  const rawPath = profile?.recommendedPath;
  const path =
    typeof rawPath === 'object' && rawPath !== null
      ? (rawPath as any).title || 'مسیر عادات پایدار'
      : typeof rawPath === 'string' && rawPath
      ? rawPath
      : 'مسیر عادات پایدار';
  const goalsText = context.goals?.join('، ') || 'ارتقای تمرکز و انضباط فردی';
  const dailyTime = context.dailyTime || '۲۰ الی ۳۰ دقیقه';

  if (q.includes('اهمال') || q.includes('تنبلی') || q.includes('سستی') || q.includes('مقاومت')) {
    return {
      text: `${userName} عزیز، اهمال‌کاری نشانه ضعف شخصیتی نیست؛ بلکه مکانیزم مغز برای محافظت از انرژی در برابر ابهام یا وظایف بیش از حد بزرگ است.\n\nپروتکل شکستن اهمال‌کاری:\n۱. مقیاس وظیفه را به ۵ دقیقه اول کاهش بده.\n۲. فقط متعهد شو وسایل کار را آماده کنی بدون الزام به تمام کردن کل پروژه.\n۳. یک لیوان آب بنوش و گوشی را در اتاق دیگری قرار بده.\n\nحرکت، انگیزه تولید می‌کند، نه برعکس. همین الان اولین گام ۵ دقیقه‌ای را بردار.`,
    };
  }

  if (q.includes('تمرکز') || q.includes('حواس') || q.includes('عمیق')) {
    return {
      text: `بر اساس شاخص تمرکز شما (${profile?.focus || 80}٪)، ذهن شما پتانسیل ورود به حالت جریان (Flow State) را دارد.\n\nراهبرد پیشنهادی:\n۱. قانون ۹۰/۲۰: ۹۰ دقیقه کار بدون وقفه، سپس ۲۰ دقیقه استراحت کامل فیزیکی بدون نمایشگر.\n۲. ایجاد اصطکاک برای شبکه‌های اجتماعی.\n۳. نوشتن سریع عوامل حواس‌پرتی روی یک برگه کاغذ و بازگشت فوری به کار.`,
    };
  }

  if (q.includes('زمان') || q.includes('برنامه') || q.includes('امروز')) {
    return {
      text: `با توجه به تعهد روزانه شما (${dailyTime}) و اهدافتان در زمینه «${goalsText}»، بهترین ساختار امروز:\n\n• ۱۰ دقیقه اول: انجام مأموریت اصلی در «${path}»\n• ۱۰ دقیقه دوم: یادداشت‌برداری از دستاوردها و مرور اهداف فردا\n• ۵ دقیقه پایانی: آماده‌سازی فیزیکی محیط کار برای شروع بی‌دردسر فردا`,
      action: {
        label: 'مشاهده داشبورد و مأموریت‌ها',
        route: '/dashboard',
      },
    };
  }

  if (q.includes('مسیر') || q.includes('پیشرفت') || q.includes('گزارش') || q.includes('پروفایل')) {
    return {
      text: `وضعیت رشد شما تا این لحظه، ${userName}:\n\n• مسیر فعال: ${path}\n• شاخص نظم: ${profile?.discipline || 78}٪\n• شاخص تمرکز: ${profile?.focus || 84}٪\n• شاخص اعتماد به نفس: ${profile?.confidence || 82}٪\n• اهداف انتخابی: ${goalsText}\n\nپیشنهاد من این است که روی پیوستگی مأموریت‌های روزانه تمرکز کنی تا ضریب پایداری‌ات تثبیت شود.`,
      action: {
        label: 'ورود به داشبورد رشد',
        route: '/dashboard',
      },
    };
  }

  if (q.includes('اعتماد') || q.includes('تردید') || q.includes('شک')) {
    return {
      text: `تردید زمانی رشد می‌کند که فاصله زیادی بین تصمیم و اقدام وجود داشته باشد. برای تقویت اعتماد به نفس، به جای تلاش برای متقاعد کردن ذهنت، تعهدات بسیار کوچک بگذار و بدون تأخیر انجامشان بده.\nهر تعهدی که عملی می‌کنی، یک رأی اعتماد به هویّت برتر خودت ثبت می‌کنی.`,
    };
  }

  // General contextual coaching reply
  return {
    text: `درود ${userName}. من بر اساس داده‌های ارزیابی و مسیر رشد شما («${path}») همراهت هستم.\n\nتعهد روزانه شما ${dailyTime} است. آیا امروز قدمت را در مأموریت‌های فعال برداشته‌ای؟ اگر با مانع یا بی‌نظمی مواجه شدی، مطرح کن تا با هم راه‌حل ملموس طراحی کنیم.`,
  };
}
