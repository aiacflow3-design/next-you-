import React, { useState } from 'react';
import { Sparkles, Brain, ArrowLeft, Check, Compass, Shield, Zap } from 'lucide-react';

interface RecommendationItem {
  id: string;
  category: string;
  sourceDimension: string;
  title: string;
  insight: string;
  actionLabel: string;
  icon: React.ElementType;
}

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'rec-1',
    category: 'تمرکز و کاهش اصطکاک',
    sourceDimension: 'مبتنی بر بعد شخصیت و الگوهای شروع',
    title: 'قانون ورود ۵ دقیقه‌ای برای غلبه بر وسواس تحلیلی',
    insight:
      'تحلیل ارزیابی نشان داد شروع کارهای بزرگ برایت بیشترین اصطکاک را دارد. متعهد شو فقط ۵ دقیقه بدون قضاوت کیفیت شروع کنی؛ پس از عبور از دقیقه ۵، مقاومت ذهنی فرو می‌ریزد.',
    actionLabel: 'افزودن به روتین روزانه',
    icon: Compass,
  },
  {
    id: 'rec-2',
    category: 'مدیریت ریتم انرژی',
    sourceDimension: 'مبتنی بر ساعات طلایی و ریتم زیستی',
    title: 'تعریف بلوک تمرکز مقدس در ساعات ۹:۰۰ تا ۱۱:۰۰ صبح',
    insight:
      'بالاترین ظرفیت شناختی مغز تو قبل از ظهر است. با انتقال جلسات و پیام‌های حاشیه‌ای به بعدازظهر، ۲ ساعت صبح را فقط به یک خروجی استراتژیک اختصاص بده.',
    actionLabel: 'تنظیم حریم ساعات طلایی',
    icon: Zap,
  },
  {
    id: 'rec-3',
    category: 'پایداری در ساخت عادت',
    sourceDimension: 'مبتنی بر بعد عادت‌ها و تاب‌آوری',
    title: 'اجرای قانون طلایی «هرگز دو بار پیاپی غیبت نکن»',
    insight:
      'در صورت از دست رفتن یک روتین، به‌جای سرزنش یا رها کردن کل هفته، مقیاس آن را به ۲ دقیقه تقلیل بده تا هویت عمل‌گرای تو در ذهن تثبیت بماند.',
    actionLabel: 'تثبیت اصل پایداری',
    icon: Shield,
  },
];

export const SmartRecommendationsSection: React.FC = () => {
  const [appliedRecommendations, setAppliedRecommendations] = useState<string[]>([]);

  const handleApply = (id: string) => {
    if (!appliedRecommendations.includes(id)) {
      setAppliedRecommendations([...appliedRecommendations, id]);
    }
  };

  return (
    <div className="w-full space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#B5122B]/15 text-[#B5122B] flex items-center justify-center border border-[#B5122B]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8E8E6] tracking-tight">
              پیشنهادهای هوشمند اختصاصی (Smart Recommendations)
            </h3>
            <p className="text-xs text-[#85878C]">
              شخصی‌سازی شده بر اساس نتایج آزمون ۴ بعدی و تیپ شخصیتی شما
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-[#85878C] bg-white/[0.04] px-3 py-1 rounded-full border border-white/5">
          تحلیل سازگار با NEXT YOU AI
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {RECOMMENDATIONS.map((rec) => {
          const Icon = rec.icon;
          const isApplied = appliedRecommendations.includes(rec.id);

          return (
            <div
              key={rec.id}
              className="p-5 rounded-xl bg-gradient-to-b from-[#131418] to-[#0E0F12] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#B5122B]/15 text-[#B5122B] flex items-center justify-center shrink-0 border border-[#B5122B]/20">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-[#85878C] bg-white/[0.03] px-2 py-0.5 rounded border border-white/5 truncate max-w-[170px]">
                    {rec.sourceDimension}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#B5122B] block mb-1">
                    {rec.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#E8E8E6] leading-snug">
                    {rec.title}
                  </h4>
                </div>

                <p className="text-[11px] text-[#85878C] leading-relaxed">
                  {rec.insight}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleApply(rec.id)}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isApplied
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'btn-secondary-glass hover:text-white hover:border-[#B5122B]/40'
                }`}
              >
                {isApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>فعال و ثبت شد</span>
                  </>
                ) : (
                  <>
                    <span>{rec.actionLabel}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
