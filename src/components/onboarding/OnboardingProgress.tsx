import React from 'react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels: Record<number, string> = {
  1: 'خوش‌آمدگویی',
  2: 'انتخاب اهداف',
  3: 'وضعیت کنونی',
  4: 'زمان روزانه',
  5: 'ساخت پروفایل',
};

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  const percentage = (currentStep / totalSteps) * 100;
  const currentLabel = stepLabels[currentStep] || 'مسیر آشنایی';

  return (
    <div className="w-full mb-6 select-none">
      <div className="flex items-center justify-between text-xs font-mono text-[#85878C] mb-2.5" dir="ltr">
        <span className="text-[#E8E8E6] font-bold tracking-widest text-[11px] bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/5">
          {currentStep} / {totalSteps}
        </span>
        <span className="text-[11px] font-sans tracking-wider text-[#85878C]/80" dir="rtl">
          {currentLabel}
        </span>
      </div>

      {/* Segmented / Hairline Ambient Progress Bar */}
      <div className="w-full h-[2.5px] bg-white/[0.06] rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-[#7F0D20] via-[#B5122B] to-[#D71937] transition-all duration-500 ease-out shadow-[0_0_12px_rgba(181,18,43,0.6)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
