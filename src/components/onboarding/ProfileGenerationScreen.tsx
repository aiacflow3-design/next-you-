import React, { useState, useEffect } from 'react';
import { Check, ArrowLeft, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface ProfileGenerationScreenProps {
  goals: string[];
  dailyTime: string;
  experienceLevel: string;
  onComplete: () => Promise<boolean>;
  onGoToAssessment: () => void;
}

export const ProfileGenerationScreen: React.FC<ProfileGenerationScreenProps> = ({
  goals,
  dailyTime,
  experienceLevel,
  onComplete,
  onGoToAssessment,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStageText, setCurrentStageText] = useState('در حال تحلیل اهداف و اولویت‌های رشد شما...');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progressive simulation & async save
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 6;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setProgress(current);

      if (current < 30) {
        setCurrentStageText('در حال تحلیل اهداف و اولویت‌های رشد فردی شما...');
      } else if (current < 65) {
        setCurrentStageText('تنظیم الگوی پایبندی بر اساس زمان متعهد روزانه...');
      } else if (current < 95) {
        setCurrentStageText('شخصی‌سازی معماری سیستم رشد NEXT YOU...');
      } else {
        setCurrentStageText('پروفایل رشد اختصاصی شما آماده شد!');
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  // When progress reaches 100, trigger save
  useEffect(() => {
    if (progress === 100 && !isSaved && !error) {
      const executeSave = async () => {
        try {
          const success = await onComplete();
          if (success) {
            setIsSaved(true);
          } else {
            setError('خطا در ثبت پروفایل. لطفاً دوباره تلاش کنید.');
          }
        } catch {
          setError('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
        }
      };
      executeSave();
    }
  }, [progress, isSaved, error, onComplete]);

  const handleRetry = async () => {
    setError(null);
    try {
      const success = await onComplete();
      if (success) {
        setIsSaved(true);
      } else {
        setError('خطا در ثبت پروفایل. لطفاً دوباره تلاش کنید.');
      }
    } catch {
      setError('خطا در ارتباط با سرور.');
    }
  };

  return (
    <div className="space-y-6 text-center py-4 select-none">
      {/* Loading & Generation Phase */}
      {!isSaved ? (
        <div className="space-y-7 animate-fadeIn">
          {/* Circular Luxury Scanner / Gauge */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 rounded-full bg-[#B5122B]/10 blur-xl animate-pulse" />

            {/* SVG Progress Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/[0.06]"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * progress) / 100}
                strokeLinecap="round"
                className="text-[#B5122B] transition-all duration-300 ease-out"
                fill="transparent"
              />
            </svg>

            {/* Percentage Display */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-extrabold text-[#E8E8E6] tracking-tight">
                {progress}%
              </span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold tracking-wider text-[#85878C] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B5122B]" />
              <span>گام پنجم • ساخت پروفایل اختصاصی</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight leading-snug mb-2">
              در حال ساخت پروفایل رشد شما
            </h2>

            <p className="text-xs text-[#85878C] max-w-sm mx-auto min-h-[32px] transition-all duration-300">
              {currentStageText}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-[#B5122B]/10 border border-[#B5122B]/30 text-xs text-red-200 flex items-center justify-between gap-3 text-right max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#B5122B] shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="px-3 py-1 rounded bg-[#B5122B] text-white text-[11px] font-medium flex items-center gap-1 hover:bg-[#D71937] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>تلاش مجدد</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Success & Ready to Begin Assessment */
        <div className="space-y-6 animate-fadeIn text-right">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#B5122B]/15 border border-[#B5122B]/30 text-[#B5122B] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(181,18,43,0.3)]">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase mb-2 inline-block px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              پروفایل رشد تکمیل شد
            </span>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#E8E8E6] tracking-tight leading-snug mb-2">
              پروفایل اختصاصی تو با موفقیت آماده شد
            </h2>

            <p className="text-xs text-[#85878C] max-w-md mx-auto leading-relaxed">
              اکنون با یک ارزیابی اولیه، وضعیت دقیق نقاط قوت و پتانسیل‌های رشد تو را بررسی می‌کنیم.
            </p>
          </div>

          {/* Profile Summary Card */}
          <div className="p-4 rounded-xl bg-[#0E0F12]/90 border border-white/[0.08] space-y-3.5 my-2">
            <div className="flex items-start justify-between text-xs gap-3">
              <span className="text-[#85878C] shrink-0 mt-0.5">اهداف انتخاب‌شده:</span>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {goals.map((g) => (
                  <span
                    key={g}
                    className="font-semibold text-white bg-white/[0.06] border border-white/5 px-2.5 py-0.5 rounded-md text-[11px]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.04]">
              <span className="text-[#85878C]">زمان متعهد روزانه:</span>
              <span className="font-semibold text-[#E8E8E6] bg-white/[0.06] px-2.5 py-0.5 rounded-md text-[11px]">
                {dailyTime}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.04]">
              <span className="text-[#85878C]">نقطه شروع کنونی:</span>
              <span className="font-semibold text-[#E8E8E6] bg-white/[0.06] px-2.5 py-0.5 rounded-md text-[11px] max-w-[220px] truncate">
                {experienceLevel}
              </span>
            </div>
          </div>

          {/* CTA: Go to Assessment */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onGoToAssessment}
              className="w-full py-3.5 rounded-xl btn-primary-crimson text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(181,18,43,0.35)]"
            >
              <span>شروع ارزیابی اولیه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
