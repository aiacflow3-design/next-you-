import React, { useState } from 'react';
import { Calendar, CheckCircle2, TrendingUp, Target, Sparkles, Send, Award } from 'lucide-react';

export const WeeklyReviewSection: React.FC = () => {
  const [reflectionNote, setReflectionNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (reflectionNote.trim()) {
      setIsSaved(true);
    }
  };

  return (
    <div className="w-full p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#121316] via-[#0E0F12] to-[#0A0B0D] border border-white/[0.08] shadow-[0_15px_40px_rgba(0,0,0,0.5)] select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/[0.06] pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#B5122B]/15 text-[#B5122B] flex items-center justify-center border border-[#B5122B]/30">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8E8E6] tracking-tight">
              مرور و بازتاب هفتگی (Weekly Reflection)
            </h3>
            <p className="text-xs text-[#85878C]">
              سنجش کیفیت عملکرد ۷ روز گذشته، تثبیت پیروزی‌ها و هدف‌گذاری هفته آینده
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-[#85878C] bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">
          هفته جاری • دوره ۲۴ تا ۳۰ شهریور
        </span>
      </div>

      {/* 3 Metrics Cards: Completed Activities, Progress, Next Focus Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 1. Completed Activities */}
        <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#85878C] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>فعالیت‌های تکمیل‌شده</span>
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              ۹۰٪ موفقیت
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-lg font-bold text-[#E8E8E6] font-mono">
              ۱۹ از ۲۱ فعالیت
            </div>
            <p className="text-[11px] text-[#85878C] leading-relaxed">
              شامل ۶ جلسه کار عمیق (۳۶۰ دقیقه بدون حواس‌پرتی) و پایبندی کامل به روتین صبحگاهی.
            </p>
          </div>
        </div>

        {/* 2. Progress Highlights */}
        <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#85878C] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#B5122B]" />
              <span>شاخص بهبود و رشد</span>
            </span>
            <span className="font-mono text-xs font-bold text-red-200 bg-[#B5122B]/20 px-2 py-0.5 rounded border border-[#B5122B]/30">
              +۴.۸٪
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-lg font-bold text-[#E8E8E6]">
              افزایش استمرار کار عمیق
            </div>
            <p className="text-[11px] text-[#85878C] leading-relaxed">
              میانگین زمان شروع کار از ساعت ۱۰:۳۰ به ۹:۱۵ صبح کاهش یافته که نشان‌دهنده کنترل بهتر صبح‌هاست.
            </p>
          </div>
        </div>

        {/* 3. Next Focus Area */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-b from-[#18191E] to-[#121316] border border-[#B5122B]/30 space-y-2 shadow-[0_0_20px_rgba(181,18,43,0.15)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#85878C] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#B5122B]" />
              <span>تمرکز اصلی هفته آینده</span>
            </span>
            <span className="text-[10px] font-sans font-semibold text-[#B5122B] uppercase">
              اولویت ۱
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm sm:text-base font-bold text-[#E8E8E6]">
              مدیریت افت انرژی بعدازظهر
            </div>
            <p className="text-[11px] text-[#85878C] leading-relaxed">
              هدف‌گذاری برای پیاده‌روی کوتاه ۱۵ دقیقه‌ای پس از ناهار و عدم تکیه بر کافئین اضافی بعد از ساعت ۱۵:۰۰.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Interactive Weekly Reflection Note */}
      <form onSubmit={handleSaveReflection} className="space-y-3 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center justify-between">
          <label htmlFor="reflection" className="text-xs font-bold text-[#E8E8E6] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B5122B]" />
            <span>یک جمله بازتاب شخصی این هفته را یادداشت کن:</span>
          </label>
          <span className="text-[10px] text-[#85878C]">اختیاری و محرمانه</span>
        </div>

        <div className="flex gap-2">
          <input
            id="reflection"
            type="text"
            value={reflectionNote}
            onChange={(e) => setReflectionNote(e.target.value)}
            placeholder="مثال: این هفته فهمیدم آماده‌سازی میز کار در شب قبل، چقدر شروع صبح را سریع‌تر می‌کند..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#090A0C] border border-white/[0.08] focus:border-[#B5122B] focus:outline-none text-xs text-[#E8E8E6] placeholder:text-[#85878C]/50 transition-colors"
          />

          <button
            type="submit"
            disabled={!reflectionNote.trim() || isSaved}
            className="px-4 py-2.5 rounded-xl btn-primary-crimson text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(181,18,43,0.3)]"
          >
            <span>{isSaved ? 'ثبت شد' : 'ثبت بازتاب'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {isSaved && (
          <p className="text-[11px] text-emerald-400 animate-fadeIn">
            ✓ بازتاب هفتگی شما در تاریخچه پیشرفت ذخیره شد.
          </p>
        )}
      </form>
    </div>
  );
};
