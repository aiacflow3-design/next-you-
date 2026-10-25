import React from 'react';
import { User, Compass, Zap, TrendingUp, ArrowLeft } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const SimplePath: React.FC = () => {
  const sectionRef = useScrollReveal();

  const steps = [
    {
      step: '01',
      title: 'خودت را بشناس',
      desc: 'نقاط قوت، ضعف‌ها و مسیر رشدت را پیدا کن',
      icon: User,
    },
    {
      step: '02',
      title: 'مسیر مناسب را پیدا کن',
      desc: 'بر اساس شخصیت و اهداف، بهترین مسیر برای تو',
      icon: Compass,
    },
    {
      step: '03',
      title: 'هر روز یک قدم بردار',
      desc: 'تمرین‌های ساده و کاربردی برای رشد واقعی',
      icon: Zap,
    },
    {
      step: '04',
      title: 'پیشرفتت را ببین',
      desc: 'تغییرات را دنبال کن و انگیزه بیشتر به دست آور',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-14 sm:py-16 md:py-20 relative">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-5 sm:px-8 reveal-on-scroll">
        
        {/* Header with controlled spacing */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-[#85878C] uppercase mb-2.5">
            <span>چگونه کار می‌کند؟</span>
            <span className="text-white font-sans">NEXT<span className="text-[#B5122B]">YOU</span></span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#E8E8E6] tracking-tight leading-tight mb-3">
            یک مسیر ساده، برای یک تغییر بزرگ.
          </h2>
          <p className="text-xs sm:text-sm text-[#85878C] font-normal leading-relaxed">
            چهار گام مشخص و متوالی برای خروج از آشفتگی و رسیدن به تسلط فردی.
          </p>
        </div>

        {/* 4 Process Nodes Connected by Directional Arrows & Subtle Trail */}
        <div className="relative">
          {/* Subtle connecting horizontal line on desktop */}
          <div className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none -z-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isLast = idx === steps.length - 1;

              return (
                <div
                  key={st.step}
                  className="flex flex-col items-center text-center relative group"
                >
                  {/* Connecting Arrow for Desktop (Pointing Left in RTL) */}
                  {!isLast && (
                    <div className="hidden lg:flex items-center justify-center absolute top-6 -left-3.5 z-20 text-white/20">
                      <ArrowLeft className="w-3.5 h-3.5 text-[#85878C]/40 group-hover:text-[#B5122B] transition-colors" />
                    </div>
                  )}

                  {/* Circular Icon with Glass & Crimson Accent */}
                  <div className="w-14 h-14 rounded-full luxury-glass group-hover:border-[#B5122B]/70 flex items-center justify-center text-[#85878C] group-hover:text-[#B5122B] transition-all duration-300 relative shadow-sm mb-3">
                    <Icon className="w-5 h-5" />
                    
                    {/* Subtle red dot indicator */}
                    <span className="absolute -top-1 right-1.5 w-2 h-2 rounded-full bg-[#B5122B] shadow-[0_0_6px_#B5122B]" />
                  </div>

                  {/* Step Number */}
                  <span className="text-[11px] font-sans font-medium text-[#85878C] mb-1">
                    {st.step}
                  </span>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-semibold text-[#E8E8E6] group-hover:text-white transition-colors mb-1.5">
                    {st.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#85878C] leading-relaxed max-w-[200px]">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
