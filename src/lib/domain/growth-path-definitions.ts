import { GrowthPathDefinition } from './growth-path.entity';

export const DISCIPLINE_GROWTH_PATH: GrowthPathDefinition = {
  slug: 'discipline',
  title: 'نظم شخصی',
  description:
    'ساختن یک سیستم ساده و قابل‌اجرا برای اینکه کارهای مهم زندگی، وابسته به انگیزه لحظه‌ای نباشند.',
  stages: [
    {
      id: 'stg_disc_1',
      order: 1,
      title: 'شناخت',
      subtitle: 'شناسایی بدون قضاوت الگوها و نقاط نشت انرژی روزانه',
      goal: 'کشف الگوهای واقعی تعویق، ثبت اصطکاک‌های رفتاری و ساعات افت عملکرد قبل از هرگونه تلاش برای تغییر.',
      coreConcept:
        'اصطکاک‌های رفتاری قبل از اینکه قابل حل باشند، باید شفاف دیده شوند؛ سرکوب و انکار صرفاً شکست را به تعویق می‌اندازد.',
      completionCriteria:
        'شناسایی و ثبت ۲ موقعیت اصطکاک و ثبت ۳ اولویت پیش از شروع روزمرگی.',
      nextStageTransition:
        'با شفاف شدن الگوهای ناخودآگاه، در مرحله بعد پایه یک سیستم ضدلغزش و کم‌اصطکاک را پی‌ریزی می‌کنیم.',
      actions: [
        {
          id: 'act_disc_1_1',
          stageId: 'stg_disc_1',
          title: 'ردیابی ۲ موقعیت اصطکاک و تعویق',
          description:
            'امروز دو باری که شروع یک کار را به تعویق انداختی در یک خط یادداشت کن: چه کاری بود و دقیقاً قبل از شروع به چه کاری پناه بردی؟',
          estimatedMinutes: 5,
          order: 1,
          type: 'observation',
          required: true,
          difficulty: 'easy',
          tags: ['friction-reduction', 'observation', 'procrastination-trace'],
          suitableFor: ['low-time', 'starter', 'morning'],
        },
        {
          id: 'act_disc_1_2',
          stageId: 'stg_disc_1',
          title: 'مشخص کردن ۳ اولویت قبل از ورود به روز',
          description:
            'قبل از چک کردن پیام‌ها و کارهای متفرقه، ۳ کار ضروری که اگر انجام شوند امروز موفق است را روی کاغذ یا نوت بنویس.',
          estimatedMinutes: 5,
          order: 2,
          type: 'observation',
          required: true,
          difficulty: 'easy',
          tags: ['priority', 'clarity', 'focus'],
          suitableFor: ['morning', 'low-time'],
        },
        {
          id: 'act_disc_1_3',
          stageId: 'stg_disc_1',
          title: 'ثبت ساعت افت انرژی و تمرکز',
          description:
            'در طول امروز دقت کن در چه بازه‌ای از روز ذهنت کندترین حالت را دارد و این ساعت را ثبت کن تا کارهای سنگین در آن چیده نشوند.',
          estimatedMinutes: 3,
          order: 3,
          type: 'observation',
          required: true,
          difficulty: 'easy',
          tags: ['energy-tracking', 'quick', 'self-awareness'],
          suitableFor: ['micro-time', 'low-time'],
        },
      ],
    },
    {
      id: 'stg_disc_2',
      order: 2,
      title: 'ساخت پایه',
      subtitle: 'طراحی روتین با اصطکاک حداقلی برای شروع بدون اراده لحظه‌ای',
      goal: 'ساخت یک سیستم ساده و تکرارپذیر که آغاز کارهای مهم را مستقل از احساس آمادگی یا انگیزه کند.',
      coreConcept:
        'کم کردن اصطکاک شروع بسیار مؤثرتر از تقویت نیروی اراده است؛ سیستم‌های پیچیده در روزهای خستگی فرومی‌ریزند.',
      completionCriteria:
        'مسدودسازی یک ساعت ثابت برای کار متمرکز و اجرای قانون شروع ۱۰ دقیقه‌ای.',
      nextStageTransition:
        'روتین پایه آماده شد. در مرحله بعد سیستم را در مواجهه با مقاومت‌های ذهنی و حواس‌پرتی‌های واقعی به کار می‌گیریم.',
      actions: [
        {
          id: 'act_disc_2_1',
          stageId: 'stg_disc_2',
          title: 'قانون ورود ۱۰ دقیقه‌ای',
          description:
            'برای سخت‌ترین کار امروز تایمر را روی ۱۰ دقیقه بگذار؛ بدون انتظار برای تمام شدنش، فقط خودت را ملزم به شروع کن.',
          estimatedMinutes: 10,
          order: 1,
          type: 'habit',
          required: true,
        },
        {
          id: 'act_disc_2_2',
          stageId: 'stg_disc_2',
          title: 'مسدودسازی یک زمان ثابت در روز',
          description:
            'یک ساعت مشخص در روز را در تقویم رزرو کن و تحت هر شرایطی آن بازه را به کار اصلی اختصاص بده.',
          estimatedMinutes: 5,
          order: 2,
          type: 'habit',
          required: true,
        },
        {
          id: 'act_disc_2_3',
          stageId: 'stg_disc_2',
          title: 'حذف یک اصطکاک فیزیکی یا دیجیتال',
          description:
            'یک مانع تکراری شروع کار (مثل شلوغی میز کار، تب‌های اضافی باز یا نوتیفیکیشن مزاحم) را از پیش پای خود بردار.',
          estimatedMinutes: 5,
          order: 3,
          type: 'habit',
          required: true,
        },
      ],
    },
    {
      id: 'stg_disc_3',
      order: 3,
      title: 'تمرین',
      subtitle: 'اجرا در شرایط واقعی و غلبه بر مقاومت روانی',
      goal: 'تکرار رفتارها در مواجهه با افت انگیزه، مدیریت قطع‌کننده‌های توجه و تمرکز تک‌تسک.',
      coreConcept:
        'شروع کار نیازی به انگیزه ندارد؛ انگیزه بعد از انجام اولین قدم‌های کوچک به وجود می‌آید.',
      completionCriteria:
        'انجام کار در لحظه بی‌حوصلگی و اجرای یک بلوک کاری بدون هیچ‌گونه حواس‌پرتی.',
      nextStageTransition:
        'عضله اقدام تو تقویت شد. در مرحله نهایی، سیستم را برای پایداری بلندمدت و استقلال همیشگی تثبیت می‌کنیم.',
      actions: [
        {
          id: 'act_disc_3_1',
          stageId: 'stg_disc_3',
          title: 'شروع کار قبل از حس آمادگی',
          description:
            'در لحظه‌ای که احساس خستگی یا بی‌میلی می‌کنی، بدون جروبحث ذهنی در عرض ۲ دقیقه کار اولویت‌دار را شروع کن.',
          estimatedMinutes: 10,
          order: 1,
          type: 'execution',
          required: true,
        },
        {
          id: 'act_disc_3_2',
          stageId: 'stg_disc_3',
          title: 'یک بلوک کاری بدون حواس‌پرتی',
          description:
            'برای یک بازه ۱۵ دقیقه‌ای گوشی را دور از دسترس بگذار و تمام نوتیفیکیشن‌ها را قطع کن.',
          estimatedMinutes: 15,
          order: 2,
          type: 'execution',
          required: true,
        },
        {
          id: 'act_disc_3_3',
          stageId: 'stg_disc_3',
          title: 'تک‌تمرکزی روی یک تسک',
          description:
            'یک کار مشخص را بدون جابه‌جا شدن بین برنامه‌ها تا پایان بازه مشخص‌شده پیش ببر.',
          estimatedMinutes: 15,
          order: 3,
          type: 'execution',
          required: true,
        },
      ],
    },
    {
      id: 'stg_disc_4',
      order: 4,
      title: 'تثبیت',
      subtitle: 'پایداری بلندمدت و استقلال کامل از ابزارهای بیرونی',
      goal: 'تبدیل رفتارهای ساخته‌شده به یک ریتم شخصی پایدار و انعطاف‌پذیر در برابر چالش‌های زندگی.',
      coreConcept:
        'سیستمی پایدار است که با لغزش‌های گاه‌به‌گاه فرونپاشد، بلکه مکانیزم بازگشت سریع به ریتم داشته باشد.',
      completionCriteria:
        'مرور واقع‌بینانه هفتگی، تدوین قانون شخصی غیرقابل‌مذاکره و ساده‌سازی نهایی سیستم.',
      nextStageTransition:
        'مسیر نظم شخصی با موفقیت پیاده شد. سیستم درونی تو اکنون مستقل از این ابزار به کار خود ادامه می‌دهد.',
      actions: [
        {
          id: 'act_disc_4_1',
          stageId: 'stg_disc_4',
          title: 'مرور واقع‌بینانه عملکرد هفتگی',
          description:
            'در پایان هفته در ۵ دقیقه بررسی کن: کدام بخش سیستم جواب داد و کدام عامل مانع استمرار شد؟',
          estimatedMinutes: 10,
          order: 1,
          type: 'review',
          required: true,
        },
        {
          id: 'act_disc_4_2',
          stageId: 'stg_disc_4',
          title: 'تدوین قانون شخصی لغزش‌ناپذیر',
          description:
            'یک قانون غیرقابل‌مذاکره برای خودت بساز (مثال: در هیچ شرایطی دو روز متوالی کار اصلی به تعویق نمی‌افتد).',
          estimatedMinutes: 10,
          order: 2,
          type: 'review',
          required: true,
        },
        {
          id: 'act_disc_4_3',
          stageId: 'stg_disc_4',
          title: 'ساده‌سازی نهایی برای استقلال',
          description:
            'بخش‌های اضافه و دست‌وپاگیر سیستم را حذف کن تا روتین حتی در روزهای سخت و پرفشار هم سرپا بماند.',
          estimatedMinutes: 10,
          order: 3,
          type: 'review',
          required: true,
        },
      ],
    },
  ],
};

const GROWTH_PATHS_REGISTRY: Record<string, GrowthPathDefinition> = {
  discipline: DISCIPLINE_GROWTH_PATH,
};

export function getGrowthPathDefinition(slug: string): GrowthPathDefinition {
  return GROWTH_PATHS_REGISTRY[slug] || DISCIPLINE_GROWTH_PATH;
}
