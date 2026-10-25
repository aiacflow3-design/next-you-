import React from 'react';

export const GrowthJourney: React.FC = () => {
  const steps = [
    {
      num: '۰۱',
      title: 'شناخت',
      enTitle: 'Self-Discovery',
      desc: 'سنجش شفاف وضعیت کنونی و شناسایی گلوگاه اصلی رشد.',
    },
    {
      num: '۰۲',
      title: 'مسیر',
      enTitle: 'Growth Path',
      desc: 'انتخاب یک نقشه صعود ساختاریافته متناسب با نیاز فعلی‌ات.',
    },
    {
      num: '۰۳',
      title: 'اقدام',
      enTitle: 'Daily Action',
      desc: 'اجرای روزانه یک گام کوچک و ۱۰ دقیقه‌ای بدون پیچیدگی.',
    },
    {
      num: '۰۴',
      title: 'پیشرفت',
      enTitle: 'Compounding Progress',
      desc: 'ثبت پایداری، انباشت اثر مرکب و تثبیت نسخه قوی‌تر تو.',
    },
  ];

  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <div className="max-w-xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-[#B5122B] mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5122B]"></span>
            <span>فلسفه سیستم</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#E8E8E6] tracking-tight mb-2.5">
            مسیر صعود: شناخت تا پیشرفت
          </h2>
          <p className="text-xs sm:text-sm text-[#85878C] font-normal leading-relaxed">
            رشد فردی تصادفی نیست؛ چرخه‌ای مداوم از آگاهی، جهت‌گیری و عمل است.
          </p>
        </div>

        {/* Minimal Crimson Journey Line & 4 Waypoints */}
        <div className="relative">
          {/* Subtle Horizontal Crimson Trail in Desktop */}
          <div className="hidden md:block absolute top-[28px] left-[8%] right-[8%] h-[1px] bg-gradient-to-r from-transparent via-[#B5122B]/40 to-transparent pointer-events-none" />

          {/* 4 Waypoints Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                {/* Minimal Waypoint Node */}
                <div className="w-14 h-14 rounded-full bg-[#0E0F11] border border-white/10 group-hover:border-[#B5122B]/50 flex items-center justify-center mb-5 transition-all duration-300 relative shadow-sm">
                  {/* Subtle inner pulse point */}
                  <span className="w-2 h-2 rounded-full bg-[#B5122B] shadow-[0_0_8px_#B5122B]" />
                  
                  {/* Step Number Tag */}
                  <span className="absolute -top-2 px-1.5 py-0.2 text-[10px] font-sans font-medium text-[#85878C] bg-[#16171A] rounded border border-white/5">
                    {st.num}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="text-base font-semibold text-[#E8E8E6] group-hover:text-white transition-colors mb-1">
                  {st.title}
                </h3>

                {/* Subtitle in English font */}
                <span className="text-[11px] font-sans tracking-wide text-[#85878C]/70 uppercase mb-2">
                  {st.enTitle}
                </span>

                {/* Short, Calm Description */}
                <p className="text-xs text-[#85878C] leading-relaxed max-w-[200px]">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Subtle Minimal Slogan Connection */}
        <div className="mt-14 pt-8 border-t border-white/[0.05] text-center">
          <span className="text-xs text-[#85878C] tracking-wide">
            «شناخت → مسیر → اقدام → پیشرفت» — هر گام، زمینه گام بعدی است.
          </span>
        </div>
      </div>
    </section>
  );
};
