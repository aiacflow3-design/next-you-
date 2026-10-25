import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Check } from 'lucide-react';

interface AssessmentAnalyzingViewProps {
  onComplete: () => void;
}

export const AssessmentAnalyzingView: React.FC<AssessmentAnalyzingViewProps> = ({
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stageText, setStageText] = useState('تحلیل ابعاد نظم، تمرکز و الگوهای خودباوری...');

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 6;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setIsCompleted(true);
        // Transition delay as requested by user before showing results
        setTimeout(() => {
          onComplete();
        }, 1100);
      }
      setProgress(current);

      if (current < 25) {
        setStageText('سنجش شاخص انضباط شخصی و مدیریت اراده...');
      } else if (current < 50) {
        setStageText('تحلیل ظرفیت کار عمیق و پرهیز از چندوظیفگی...');
      } else if (current < 75) {
        setStageText('ارزیابی باورهای درونی، هویت و سطح خودباوری...');
      } else if (current < 95) {
        setStageText('بررسی پایداری روتین‌ها و ریتم بیولوژیک انرژی...');
      } else {
        setStageText('تدوین ماتریس رشد و استخراج اولین مسیر تحول...');
      }
    }, 160);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="space-y-7 text-center py-8 select-none animate-fadeIn">
      {!isCompleted ? (
        /* Progress & Scanning Phase */
        <div className="space-y-6">
          {/* Circular Luxury Scanner */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            {/* Ambient Pulsing Glow */}
            <div className="absolute inset-0 rounded-full bg-[#B5122B]/15 blur-2xl animate-pulse" />

            {/* SVG Progress Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="2.5"
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
                className="text-[#B5122B] transition-all duration-200 ease-out"
                fill="transparent"
              />
            </svg>

            {/* Central Counter */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-mono text-3xl font-extrabold text-[#E8E8E6] tracking-tight">
                {progress}%
              </span>
              <span className="text-[10px] font-sans text-[#85878C] mt-0.5">در حال تحلیل</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold tracking-wider text-[#B5122B] uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>هوش تحلیلی NEXT YOU</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight">
              در حال پردازش ۵ بعد ارزیابی اولیه
            </h2>

            <p className="text-xs sm:text-sm text-[#85878C] max-w-sm mx-auto min-h-[36px] transition-all duration-300">
              {stageText}
            </p>
          </div>
        </div>
      ) : (
        /* Completion Screen with exact copy requested by user */
        <div className="space-y-4 animate-scaleUp py-4">
          <div className="w-16 h-16 rounded-2xl bg-[#B5122B]/20 border-2 border-[#B5122B] text-[#B5122B] flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(181,18,43,0.5)]">
            <Check className="w-8 h-8 stroke-[3] text-white" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full inline-block">
              تکمیل ارزیابی
            </span>
            {/* Exact title requested by user */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E8E8E6] tracking-tight pt-1">
              تحلیل مسیر رشد تو آماده شد
            </h2>
            <p className="text-xs text-[#85878C]">
              در حال بارگذاری گزارش و نقشه رشد اختصاصی...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
