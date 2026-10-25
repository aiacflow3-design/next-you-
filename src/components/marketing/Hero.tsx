import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { HorizonHeroSection } from '../ui/horizon-hero-section';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface HeroProps {
  onOpenAssessment?: () => void;
  onStartGrowth: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAssessment, onStartGrowth }) => {
  const sectionRef = useScrollReveal();

  const handlePrimaryClick = () => {
    if (onOpenAssessment) {
      onOpenAssessment();
    } else {
      onStartGrowth();
    }
  };

  return (
    <HorizonHeroSection className="pt-20 pb-12 sm:pt-28 sm:pb-20">
      {/* Hero Main Content */}
      <div ref={sectionRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center reveal-on-scroll" dir="rtl">
        
        {/* Subtle Brand Tag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
          <span className="text-xs sm:text-sm font-medium text-[#F4F0E8] tracking-wide">
            سیستم هوشمند ارزیابی و تسلط فردی
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-estedad text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#F4F0E8] tracking-tight leading-[1.18] mb-7 [word-spacing:-0.1em]">
          هر روز{' '}
          <span className="text-[#C8102E] relative inline-block">
            ۱ درصد
          </span>{' '}
          بهتر.
        </h1>

        {/* Supporting Text - Single line on desktop/tablet, unclipped Persian ascenders/descenders */}
        <p className="font-estedad text-[11px] sm:text-xs md:text-sm lg:text-base font-normal text-[#F4F0E8]/90 sm:whitespace-nowrap max-w-4xl mx-auto mb-10 tracking-tight leading-relaxed py-1">
          «درد یا لذتِ کاری که می‌کنی می‌گذرد؛ اما افتخار یا شرمندگیِ نتیجه‌اش می‌ماند.»
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5">
          <button
            type="button"
            onClick={handlePrimaryClick}
            className="group relative inline-flex items-center justify-center gap-3 bg-[#C8102E] hover:bg-[#DF1334] text-white font-semibold text-base sm:text-lg px-9 py-4 rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(200,16,46,0.35)] hover:shadow-[0_12px_40px_rgba(200,16,46,0.5)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-full sm:w-auto min-h-[48px]"
          >
            <span>شروع مسیر</span>
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1.5" />
          </button>
        </div>

      </div>
    </HorizonHeroSection>
  );
};


