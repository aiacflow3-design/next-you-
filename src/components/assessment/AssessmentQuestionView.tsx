import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import {
  AssessmentQuestion,
  AssessmentCategoryInfo,
  ASSESSMENT_CATEGORIES,
} from './assessmentData';

interface AssessmentQuestionViewProps {
  question: AssessmentQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AssessmentQuestionView: React.FC<AssessmentQuestionViewProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  onNext,
  onBack,
}) => {
  const categoryInfo: AssessmentCategoryInfo =
    ASSESSMENT_CATEGORIES.find((c) => c.key === question.category) || ASSESSMENT_CATEGORIES[0];
  const CategoryIcon = categoryInfo.icon;
  const isLast = currentIndex === totalQuestions - 1;

  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  // Selected scale option info
  const selectedScaleOption = question.type === 'scale_1_5'
    ? question.options.find((o) => o.id === selectedOptionId)
    : null;

  return (
    <div className="space-y-6 animate-fadeIn text-right select-none">
      {/* Category & Progress Header */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2.5">
          {/* Category Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/5 text-[#E8E8E6]">
            <CategoryIcon className="w-3.5 h-3.5 text-[#B5122B]" />
            <span className="text-[11px] font-medium">{categoryInfo.title}</span>
          </div>

          {/* Current Question Number Indicator */}
          <div className="flex items-center gap-1 font-mono text-xs text-[#85878C] bg-white/[0.03] px-2.5 py-0.5 rounded border border-white/5" dir="ltr">
            <span className="text-white font-bold">{currentIndex + 1}</span>
            <span>/</span>
            <span>{totalQuestions}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-[2.5px] bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7F0D20] via-[#B5122B] to-[#E51E40] transition-all duration-300 ease-out shadow-[0_0_12px_rgba(181,18,43,0.5)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Title & Subtitle */}
      <div className="pt-1">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#E8E8E6] tracking-tight leading-snug mb-1.5">
          {question.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#85878C] leading-relaxed">
          {question.subtitle}
        </p>
      </div>

      {/* QUESTION BODY: SCALE (1-5) vs MULTIPLE CHOICE */}
      {question.type === 'scale_1_5' ? (
        /* ================= SCALE 1-5 QUESTION ================= */
        <div className="space-y-4 my-5">
          {/* Scale Labels: Min & Max */}
          {question.scaleLabels && (
            <div className="flex items-center justify-between text-[11px] text-[#85878C]">
              <span>{question.scaleLabels.min} (۱)</span>
              <span>{question.scaleLabels.max} (۵)</span>
            </div>
          )}

          {/* 5 Scale Cards / Buttons */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {question.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectOption(opt.id)}
                  className={`py-4 sm:py-5 rounded-xl border text-center font-mono font-bold text-base sm:text-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 select-none ${
                    isSelected
                      ? 'bg-[#151619] border-2 border-[#B5122B] text-white shadow-[0_0_24px_rgba(181,18,43,0.4)] scale-[1.03] ring-1 ring-[#B5122B]/30'
                      : 'bg-[#0E0F12]/85 border-white/[0.08] text-[#85878C] hover:border-white/25 hover:text-white hover:bg-[#131418]'
                  }`}
                >
                  <span>{opt.label}</span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      isSelected ? 'bg-[#B5122B]' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Detailed Feedback for Selected Scale Option */}
          {selectedScaleOption?.desc && (
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#C7C9CC] flex items-center gap-2 animate-fadeIn">
              <span className="text-[#B5122B] font-bold font-mono text-sm">
                امتیاز {selectedScaleOption.label}:
              </span>
              <span>{selectedScaleOption.desc}</span>
            </div>
          )}
        </div>
      ) : (
        /* ================= MULTIPLE CHOICE QUESTION ================= */
        <div className="space-y-3 my-4">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            const letter = ['الف', 'ب', 'ج', 'د'][idx] || `${idx + 1}`;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectOption(opt.id)}
                className={`w-full text-right p-4 sm:p-4.5 rounded-xl transition-all duration-200 cursor-pointer flex items-start justify-between gap-3.5 select-none ${
                  isSelected
                    ? 'bg-[#151619] border-2 border-[#B5122B] shadow-[0_0_24px_rgba(181,18,43,0.22)] scale-[1.01]'
                    : 'bg-[#0E0F12]/85 border border-white/[0.07] hover:border-white/20 hover:bg-[#131418]'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Option Letter Tag */}
                  <div
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-[#B5122B] text-white shadow-[0_0_12px_rgba(181,18,43,0.4)]'
                        : 'bg-white/[0.04] text-[#85878C] border border-white/5'
                    }`}
                  >
                    {letter}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <span
                      className={`text-xs sm:text-sm font-semibold block leading-relaxed transition-colors ${
                        isSelected ? 'text-[#E8E8E6]' : 'text-[#C7C9CC]'
                      }`}
                    >
                      {opt.label}
                    </span>
                    {opt.desc && (
                      <p className="text-[11px] text-[#85878C] leading-relaxed line-clamp-2">
                        {opt.desc}
                      </p>
                    )}
                  </div>
                </div>

                {/* Radio Indicator */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 mt-1 ${
                    isSelected
                      ? 'bg-[#B5122B] border-[#B5122B] text-white shadow-[0_0_10px_rgba(181,18,43,0.4)]'
                      : 'border-white/20 bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Navigation Controls: Back and Next Buttons */}
      <div className="pt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-3 rounded-lg btn-secondary-glass text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>قبلی</span>
        </button>

        <button
          type="button"
          disabled={!selectedOptionId}
          onClick={onNext}
          className="flex-1 py-3 rounded-lg btn-primary-crimson text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(181,18,43,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isLast ? 'تکمیل ارزیابی و تحلیل' : 'سؤال بعد'}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
