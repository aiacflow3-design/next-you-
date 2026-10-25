import React, { useRef } from 'react';
import { LayoutGrid, TrendingUp, CheckCircle, Compass } from 'lucide-react';
import systemSanctuaryImage from '../../assets/images/next_you_system_sanctuary_1790359550969.jpg';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useScrollParallax } from '../../lib/scrollController';

export const SystemSection: React.FC = () => {
  const sectionRef = useScrollReveal();
  const imgRef = useRef<HTMLImageElement>(null);

  // Zero-rerender parallax: updates DOM style.transform directly on the element ref
  useScrollParallax(
    imgRef,
    (y) => `translate3d(0, ${Math.min(Math.max((y - 2200) * 0.07, -25), 35)}px, 0)`
  );

  const pillars = [
    {
      id: 'ui',
      title: 'رابط کاربری مدرن',
      desc: 'سریع، ساده، لذت‌بخش',
      icon: LayoutGrid,
    },
    {
      id: 'tracking',
      title: 'پیگیری پیشرفت',
      desc: 'برای حفظ انگیزه و استمرار',
      icon: TrendingUp,
    },
    {
      id: 'exercises',
      title: 'تمرین‌های عملی',
      desc: 'ساده، کاربردی، مؤثر',
      icon: CheckCircle,
    },
    {
      id: 'paths',
      title: 'مسیرهای هدفمند',
      desc: 'بر اساس نیازها و اهداف تو',
      icon: Compass,
    },
  ];

  return (
    <section id="system" className="py-14 sm:py-16 md:py-20 relative">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-5 sm:px-8 reveal-on-scroll">
        
        {/* Section Header with controlled spacing */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-[#85878C] uppercase mb-2.5">
            <span>چرا</span>
            <span className="text-white font-sans">NEXT<span className="text-[#B5122B]">YOU</span>؟</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#E8E8E6] tracking-tight leading-tight mb-3">
            بیش از یک اپلیکیشن،{' '}
            <span className="text-[#B5122B] drop-shadow-[0_0_20px_rgba(181,18,43,0.45)]">
              یک سیستم رشد شخصی.
            </span>
          </h2>
        </div>

        {/* Wide Cinematic Sanctuary / Fortress Image Banner (Direct DOM transform, no transition delay) */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_16px_70px_rgba(0,0,0,0.9)] aspect-[21/9] sm:aspect-[21/8] mb-10 overflow-hidden">
          <img
            ref={imgRef}
            src={systemSanctuaryImage}
            alt="NEXTYOU System Sanctuary"
            className="w-full h-[115%] -top-[7%] absolute inset-0 object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/40 pointer-events-none" />
        </div>

        {/* 4 Feature Blocks with Dark Luxury Glass & Crimson Accent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p) => {
            const Icon = p.icon;

            return (
              <div
                key={p.id}
                className="p-5 rounded-xl luxury-glass-card text-center flex flex-col items-center group cursor-default"
              >
                {/* Icon inside circle with delicate crimson accent */}
                <div className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/10 group-hover:border-[#B5122B]/60 flex items-center justify-center text-[#85878C] group-hover:text-[#B5122B] transition-colors mb-3">
                  <Icon className="w-4 h-4" />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#E8E8E6] group-hover:text-white transition-colors mb-1">
                  {p.title}
                </h3>

                <p className="text-xs text-[#85878C] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
