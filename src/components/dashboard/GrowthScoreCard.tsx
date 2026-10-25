import React from 'react';
import { Award, TrendingUp, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface GrowthScoreCardProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  levelTitle: string;
  dailyXPGained: number;
}

export const GrowthScoreCard: React.FC<GrowthScoreCardProps> = ({
  currentXP = 1450,
  nextLevelXP = 2000,
  level = 3,
  levelTitle = 'معمار عادات پایدار (Habit Architect)',
  dailyXPGained = 120,
}) => {
  const progressPercent = Math.min(Math.round((currentXP / nextLevelXP) * 100), 100);

  return (
    <div className="w-full p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#141519] via-[#0F1013] to-[#0A0B0D] border border-white/[0.08] shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden select-none">
      {/* Background Soft Reflected Light */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#B5122B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        {/* Left Side: Level & Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1C1E24] to-[#121316] border border-white/10 flex items-center justify-center text-[#E8E8E6] shadow-[0_0_20px_rgba(181,18,43,0.2)]">
              <span className="font-mono text-xl font-extrabold text-[#E8E8E6]">{level}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#B5122B] text-white flex items-center justify-center text-[10px] font-bold shadow-md">
              <Zap className="w-3 h-3 fill-current" />
            </div>
          </div>

          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#B5122B] uppercase px-2 py-0.5 rounded bg-[#B5122B]/10 border border-[#B5122B]/20">
                سطح عملکرد {level}
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+{dailyXPGained} XP امروز</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8E8E6] tracking-tight">
              {levelTitle}
            </h3>
            <p className="text-[11px] text-[#85878C]">
              امتیاز رشد تو با پایبندی به روتین‌ها و تکمیل مأموریت‌های روزانه افزایش می‌یابد.
            </p>
          </div>
        </div>

        {/* Right Side: XP & Hairline Progress Bar */}
        <div className="w-full md:w-80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#85878C] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B5122B]" />
              <span>امتیاز تحول فردی (XP):</span>
            </span>
            <div className="font-mono text-xs text-[#E8E8E6]">
              <span className="font-bold text-sm text-white">{currentXP.toLocaleString('fa-IR')}</span>
              <span className="text-[#85878C]"> / {nextLevelXP.toLocaleString('fa-IR')} XP</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#7F0D20] via-[#B5122B] to-[#E51E40] rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(181,18,43,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#85878C]/70">
            <span>{progressPercent}٪ تا سطح بعدی</span>
            <span className="flex items-center gap-1 text-[#C7C9CC]">
              <ShieldCheck className="w-3 h-3 text-[#B5122B]" />
              <span>پاداش بعد: بازگشایی ماتریس تصمیم‌گیری استراتژیک</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
