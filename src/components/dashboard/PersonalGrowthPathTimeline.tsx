import React from 'react';
import { Compass, Repeat, Target, Flag, Check, ChevronLeft } from 'lucide-react';

interface StageInfo {
  id: string;
  key: 'self-awareness' | 'habits' | 'focus' | 'goals';
  title: string;
  enTitle: string;
  desc: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: React.ElementType;
  progressPercent: number;
}

const STAGES: StageInfo[] = [
  {
    id: 'stage-1',
    key: 'self-awareness',
    title: 'خودآگاهی',
    enTitle: 'Self Awareness',
    desc: 'شناخت موانع ذهنی، ارزش‌های اصلی و ترسیم وضعیت نقطه صفر',
    status: 'completed',
    icon: Compass,
    progressPercent: 100,
  },
  {
    id: 'stage-2',
    key: 'habits',
    title: 'ساخت عادت‌ها',
    enTitle: 'Habits & Routine',
    desc: 'تثبیت روتین‌های صبح و شب، کاهش اصطکاک و قانون عدم غیبت دوگانه',
    status: 'current',
    icon: Repeat,
    progressPercent: 45,
  },
  {
    id: 'stage-3',
    key: 'focus',
    title: 'تمرکز عمیق',
    enTitle: 'Deep Focus',
    desc: 'تسلط بر بلوک‌های کار عمیق، حذف حواس‌پرتی‌های دیجیتال و جریان سیال',
    status: 'upcoming',
    icon: Target,
    progressPercent: 0,
  },
  {
    id: 'stage-4',
    key: 'goals',
    title: 'اهداف و تعالی',
    enTitle: 'Mastery & Goals',
    desc: 'دستیابی به خروجی‌های استراتژیک، مقیاس‌پذیری دستاوردها و اوج عملکرد',
    status: 'upcoming',
    icon: Flag,
    progressPercent: 0,
  },
];

export const PersonalGrowthPathTimeline: React.FC = () => {
  return (
    <div className="w-full space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#B5122B]/15 text-[#B5122B] flex items-center justify-center border border-[#B5122B]/30">
            <Compass className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8E8E6] tracking-tight">
              مسیر رشد فردی (Personal Growth Path)
            </h3>
            <p className="text-xs text-[#85878C]">
              نقشه ۴ مرحله‌ای صعود اختصاصی تو در NEXT YOU
            </p>
          </div>
        </div>

        {/* Current Active Stage Badge */}
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#B5122B]/10 border border-[#B5122B]/30 text-red-200 flex items-center gap-1.5 shadow-[0_0_15px_rgba(181,18,43,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#B5122B] animate-ping" />
          <span>مرحله فعال: ساخت عادت‌ها (۲ از ۴)</span>
        </span>
      </div>

      {/* Visual Journey Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 relative">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';
          const isUpcoming = stage.status === 'upcoming';

          return (
            <div
              key={stage.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] ${
                isCurrent
                  ? 'bg-gradient-to-b from-[#18191E] to-[#111215] border-2 border-[#B5122B] shadow-[0_0_30px_rgba(181,18,43,0.25)] ring-1 ring-[#B5122B]/30'
                  : isCompleted
                  ? 'bg-[#0E0F12]/80 border-emerald-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                  : 'bg-[#0B0C0E]/60 border-white/[0.05] opacity-60'
              }`}
            >
              {/* Highlight Glow for Current Stage */}
              {isCurrent && (
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#B5122B]/20 rounded-full blur-2xl pointer-events-none" />
              )}

              {/* Stage Top Bar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-[#B5122B] text-white shadow-[0_0_14px_rgba(181,18,43,0.5)]'
                        : isCompleted
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/[0.04] text-[#85878C] border border-white/5'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isCurrent
                        ? 'bg-[#B5122B]/20 text-red-200 border-[#B5122B]/30 font-bold'
                        : isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-white/[0.03] text-[#85878C] border-white/5'
                    }`}
                  >
                    گام {idx + 1}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4
                    className={`text-sm sm:text-base font-bold tracking-tight ${
                      isCurrent
                        ? 'text-[#E8E8E6]'
                        : isCompleted
                        ? 'text-emerald-300'
                        : 'text-[#85878C]'
                    }`}
                  >
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-[#85878C] leading-relaxed line-clamp-2">
                    {stage.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Progress Bar & State Tag */}
              <div className="pt-3 border-t border-white/[0.04] mt-3">
                <div className="flex items-center justify-between text-[10px] mb-1.5">
                  <span
                    className={
                      isCurrent
                        ? 'text-[#B5122B] font-bold'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-[#85878C]'
                    }
                  >
                    {isCurrent ? 'در حال اجرا (۴۵٪)' : isCompleted ? 'تکمیل شده (۱۰۰٪)' : 'در انتظار'}
                  </span>
                </div>
                <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCurrent
                        ? 'bg-[#B5122B]'
                        : isCompleted
                        ? 'bg-emerald-500'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${stage.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
