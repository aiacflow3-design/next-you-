import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { GrowthCatalyst3D } from './GrowthCatalyst3D';

interface FinalCtaProps {
  onOpenAssessment: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenAssessment }) => {
  const sectionRef = useScrollReveal();

  return (
    <section id="final-cta" className="py-14 sm:py-20 md:py-24 relative z-10" dir="rtl">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-5 sm:px-8 reveal-on-scroll">
        
        {/* Interactive 3D Growth Catalyst Banner */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-white/[0.09] bg-gradient-to-b from-[#0e1017] via-[#090a0f] to-[#07080b] shadow-[0_24px_90px_rgba(0,0,0,0.92)] min-h-[380px] sm:min-h-[440px] flex items-end justify-center p-5 sm:p-8 pb-6 sm:pb-9">
          
          {/* Three.js Catalyst of Willpower & Growth Canvas (Ultra low-RAM, responsive, sleeping when offscreen) */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
            <GrowthCatalyst3D />
          </div>

          {/* Ethereal Vignettes & Horizon Blends */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090B]/95 via-transparent to-[#08090B]/50 pointer-events-none z-[1]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,16,46,0.15),transparent_70%)] pointer-events-none z-[1]" />

          {/* Compact Lower Action Box: "شروع ارزیابی" + "لذت رو به تعویق بنداز و شروع کن" */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-3.5 sm:p-4 px-5 rounded-xl bg-[#0c0d13]/85 backdrop-blur-md border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.8)] max-w-[270px] sm:max-w-[300px] w-full mx-auto transition-all duration-300 hover:border-white/[0.2]">
            <button
              type="button"
              onClick={onOpenAssessment}
              className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-white px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#C8102E] to-[#A30B24] hover:from-[#DF1334] hover:to-[#B5122B] transition-all duration-300 shadow-[0_4px_20px_rgba(200,16,46,0.4)] hover:shadow-[0_6px_28px_rgba(200,16,46,0.6)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-h-[40px]"
            >
              <span>شروع ارزیابی</span>
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            </button>

            {/* Minimal quote */}
            <p className="text-[11px] sm:text-xs text-[#B7B8C0] font-normal tracking-wide text-center mt-2 select-none">
              لذت رو به تعویق بنداز و شروع کن
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

