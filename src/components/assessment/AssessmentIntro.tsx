import React from 'react';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { ASSESSMENT_CATEGORIES } from './assessmentData';

interface AssessmentIntroProps {
  onStart: () => void;
  onBackToHome?: () => void;
}

export const AssessmentIntro: React.FC<AssessmentIntroProps> = ({ onStart, onBackToHome }) => {
  return (
    <div className="space-y-7 animate-fadeIn text-right select-none py-2">
      {/* Top Tag & Badge */}
      <div className="text-center">
        <span className="text-[11px] font-mono tracking-widest text-[#B5122B] uppercase mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5122B]/10 border border-[#B5122B]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B5122B] animate-pulse" />
          <span>ارزیابی اولیه • NEXT YOU ASSESSMENT</span>
        </span>

        {/* Title & Subtitle specified by user */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#E8E8E6] tracking-tight leading-snug mb-3">
          شناخت خودت، اولین قدم تغییر است.
        </h1>

        <p className="text-sm sm:text-base text-[#85878C] max-w-lg mx-auto leading-relaxed">
          با چند سؤال کوتاه، وضعیت فعلی رشد تو را بررسی میکنیم.
        </p>
      </div>

      {/* 5 Pillars Preview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-6">
        {ASSESSMENT_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.key}
              className="p-3.5 sm:p-4 rounded-xl bg-[#0E0F12]/80 border border-white/[0.07] flex items-start gap-3 hover:border-white/15 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-[#B5122B]/10 text-[#B5122B] border border-[#B5122B]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#E8E8E6]">{cat.title}</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#85878C] mt-1 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meta indicators */}
      <div className="flex items-center justify-center gap-6 text-xs text-[#85878C]/70 py-1">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#B5122B]" />
          <span>زمان تخمینی: ۳ دقیقه</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>تحلیل محرمانه و اختصاصی</span>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-2 max-w-sm mx-auto space-y-3">
        <button
          type="button"
          onClick={onStart}
          className="w-full py-3.5 rounded-xl btn-primary-crimson text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(181,18,43,0.35)]"
        >
          <span>شروع ارزیابی</span>
          <ArrowLeft className="w-4 h-4" />
        </button>

        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="w-full py-2 text-xs text-[#85878C] hover:text-[#C7C9CC] transition-colors cursor-pointer"
          >
            بازگشت به صفحه اصلی
          </button>
        )}
      </div>
    </div>
  );
};
