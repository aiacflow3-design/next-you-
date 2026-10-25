import React from 'react';
import { Unlink, Target, Brain } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const WhyNextYou: React.FC = () => {
  const sectionRef = useScrollReveal();

  const painPoints = [
    {
      id: 'ending',
      title: 'پایان‌های کم',
      desc: 'شروع می‌کنی، اما ادامه نمی‌دهی',
      icon: Unlink,
    },
    {
      id: 'goals',
      title: 'هدف‌های زیاد',
      desc: 'می‌خواهی بهتر شوی، اما نمی‌دانی از کجا شروع کنی',
      icon: Target,
    },
    {
      id: 'information',
      title: 'اطلاعات زیاد',
      desc: 'محتوای زیاد، بدون برنامه مشخص',
      icon: Brain,
    },
  ];

  return (
    <section id="why-nextyou" className="py-14 sm:py-16 md:py-20 relative">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-5 sm:px-8 reveal-on-scroll">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Text Narrative (Right column in RTL) */}
          <div className="lg:col-span-5 text-right">
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-[#B7B8C0] uppercase mb-3">
              <span>چرا</span>
              <span className="text-[#F4F0E8] font-sans">NEXT<span className="text-[#C8102E]">YOU</span>؟</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F4F0E8] tracking-tight leading-[1.28] mb-4">
              تغییر با انگیزه شروع می‌شود؛
              <br />
              با <span className="text-[#C8102E]">دیسیپلین</span> ادامه پیدا می‌کند.
            </h2>

            <p className="text-xs sm:text-sm text-[#B7B8C0] font-normal leading-relaxed max-w-md">
              شروع‌های زیاد، پایان‌های کم. اطلاعات زیاد، برنامه کم. هدف‌های بزرگ، اما بدون سیستم. NEXT YOU حلقه گمشده میان انگیزه و دستاورد واقعی است.
            </p>
          </div>

          {/* 3 Compact Editorial Cards with Dark Charcoal Surfaces (#191A1F) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {painPoints.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 rounded-xl bg-[#191A1F] border border-white/10 hover:border-[#C8102E]/60 shadow-lg flex flex-col items-center text-center group min-h-[185px] justify-between transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  {/* Circular Icon with delicate border and subtle red accent */}
                  <div className="w-11 h-11 rounded-full bg-[#08090B] border border-white/10 group-hover:border-[#C8102E]/60 flex items-center justify-center text-[#B7B8C0] group-hover:text-[#C8102E] transition-colors mb-3">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#F4F0E8] group-hover:text-white transition-colors mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#B7B8C0] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="w-3 h-[1px] bg-white/10 group-hover:w-6 group-hover:bg-[#C8102E] transition-all mt-3" />
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
