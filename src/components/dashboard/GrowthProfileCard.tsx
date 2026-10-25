import React from 'react';
import { Target, Shield, Sparkles, Compass } from 'lucide-react';

interface GrowthProfileCardProps {
  growthType?: string;
  focusScore?: number;
  disciplineScore?: number;
  confidenceScore?: number;
  recommendedPath?: string;
  userGoals?: string[] | null;
}

export const GrowthProfileCard: React.FC<GrowthProfileCardProps> = ({
  growthType = 'استراتژیست متمرکز بر تحول پایدار',
  focusScore = 84,
  disciplineScore = 78,
  confidenceScore = 82,
  recommendedPath,
  userGoals,
}) => {
  const pathTitle =
    typeof recommendedPath === 'object' && recommendedPath !== null
      ? (recommendedPath as any).title
      : typeof recommendedPath === 'string'
      ? recommendedPath
      : null;

  return (
    <div className="w-full p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#131418] via-[#0E0F12] to-[#0A0B0D] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden select-none">
      {/* Background Reflected Ambient Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B5122B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag & Growth Type */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5 mb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold tracking-wider text-[#B5122B] uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>پروفایل رشد اختصاصی • GROWTH PROFILE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight">
            {growthType}
          </h2>

          <p className="text-xs text-[#85878C] leading-relaxed max-w-lg">
            پتانسیل بالا در ترکیب دید استراتژیک با ساخت روتین‌های روزمره. تمرکز فعلی روی ثبات قدم و کاهش مقاومت ذهنی است.
          </p>
        </div>

        {/* Selected goals chips if available */}
        {userGoals && userGoals.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-end self-start sm:self-center">
            {userGoals.slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-[11px] font-medium text-[#C7C9CC] bg-white/[0.04] border border-white/5 px-2.5 py-1 rounded-lg"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recommended First Growth Path Banner if available */}
      {pathTitle && (
        <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-[#141518]/90 border border-[#B5122B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-[0_0_20px_rgba(181,18,43,0.12)]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#B5122B]/20 text-[#B5122B] flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-sans font-semibold text-[#85878C] block">
                اولین مسیر رشد پیشنهادی مبتنی بر ارزیابی:
              </span>
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {pathTitle}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shrink-0">
            مسیر فعال
          </span>
        </div>
      )}

      {/* 3 Metric Score Gauges: Focus, Discipline, Confidence */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Focus Score */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#85878C] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#B5122B]" />
              <span>شاخص تمرکز</span>
            </span>
            <span className="font-mono text-sm font-extrabold text-[#E8E8E6]">
              {focusScore} / ۱۰۰
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#B5122B] to-[#E51E40] rounded-full transition-all duration-700"
              style={{ width: `${focusScore}%` }}
            />
          </div>
          <span className="text-[10px] text-[#85878C]/70 block">
            توانایی کار عمیق و پرهیز از چندوظیفگی (Multitasking)
          </span>
        </div>

        {/* 2. Discipline Score */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#85878C] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#B5122B]" />
              <span>شاخص نظم شخصی</span>
            </span>
            <span className="font-mono text-sm font-extrabold text-[#E8E8E6]">
              {disciplineScore} / ۱۰۰
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#B5122B] to-[#E51E40] rounded-full transition-all duration-700"
              style={{ width: `${disciplineScore}%` }}
            />
          </div>
          <span className="text-[10px] text-[#85878C]/70 block">
            پایبندی به ساعات مقرر و اجرای روتین‌ها بدون تعلل
          </span>
        </div>

        {/* 3. Confidence Score */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#85878C] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B5122B]" />
              <span>شاخص اعتماد به نفس</span>
            </span>
            <span className="font-mono text-sm font-extrabold text-[#E8E8E6]">
              {confidenceScore} / ۱۰۰
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#B5122B] to-[#E51E40] rounded-full transition-all duration-700"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
          <span className="text-[10px] text-[#85878C]/70 block">
            باور به توانایی خروج از چالش‌ها و تصمیم‌گیری مستقل
          </span>
        </div>
      </div>
    </div>
  );
};
