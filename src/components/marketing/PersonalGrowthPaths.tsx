import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

import thumbFocus from '../../assets/images/next_you_thumb_focus_1790363923666.jpg';
import thumbDiscipline from '../../assets/images/next_you_thumb_discipline_1790363935890.jpg';
import thumbConfidence from '../../assets/images/next_you_thumb_confidence_1790363948224.jpg';

interface PersonalGrowthPathsProps {
  onOpenAssessment: () => void;
}

export const PersonalGrowthPaths: React.FC<PersonalGrowthPathsProps> = ({ 
  onOpenAssessment 
}) => {
  const sectionRef = useScrollReveal();

  const paths = [
    {
      id: 'focus',
      title: 'تمرکز',
      desc: 'حواس‌پرتی را کمتر کن و روی مهم‌ها تمرکز کن',
      thumb: thumbFocus,
    },
    {
      id: 'discipline',
      title: 'نظم شخصی',
      desc: 'عادت‌های درست بساز و استمرار داشته باش',
      thumb: thumbDiscipline,
    },
    {
      id: 'confidence',
      title: 'اعتماد به نفس',
      desc: 'با ترس‌هایت رو‌به‌رو شو و خودت را باور کن',
      thumb: thumbConfidence,
    },
  ];

  return (
    <section id="paths" className="py-14 sm:py-16 md:py-20 relative">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-5 sm:px-8 reveal-on-scroll">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Text Section (Right column in RTL) */}
          <div className="lg:col-span-4 text-right">
            <span className="text-[11px] font-medium text-[#85878C] tracking-wider block mb-1.5 uppercase">
              مسیرهای رشد (نمونه)
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#E8E8E6] tracking-tight leading-tight mb-3">
              هر کسی مسیر خودش را دارد.
            </h2>
            <p className="text-xs sm:text-sm text-[#85878C] leading-relaxed mb-5">
              ما چند مسیر را برای شروع آماده کرده‌ایم. در آینده مسیرهای بیشتری به این مجموعه اضافه می‌شود.
            </p>
          </div>

          {/* 3 Visual Cards (Left column in RTL) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {paths.map((p) => (
                <div
                  key={p.id}
                  onClick={onOpenAssessment}
                  className="group rounded-xl luxury-glass-card overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  {/* Thumbnail Image */}
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#17181B] relative">
                    <img
                      src={p.thumb}
                      alt={p.title}
                      className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.1] group-hover:scale-104 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/90 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#E8E8E6] group-hover:text-white transition-colors mb-1 text-center">
                        {p.title}
                      </h3>
                      <p className="text-xs text-[#85878C] leading-relaxed text-center mb-3">
                        {p.desc}
                      </p>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-center gap-1.5 text-xs font-medium text-[#85878C] group-hover:text-[#B5122B] transition-colors">
                      <span>مشاهده مسیر</span>
                      <ArrowLeft className="w-3.5 h-3.5 text-[#B5122B]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider / Pagination Dots Indicator */}
            <div className="flex items-center justify-center gap-1.5 mt-6">
              <span className="w-2 h-2 rounded-full bg-[#B5122B] shadow-[0_0_6px_#B5122B]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
