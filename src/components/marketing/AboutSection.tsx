import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 bg-[#060709] overflow-hidden" dir="rtl">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
        
        {/* Subtle Category Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-[#9CA0A6]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B5122B]" />
          <span>درباره سامانه</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E8E6]">
          NEXT YOU چیست؟
        </h2>

        {/* Concise prose card */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0D0E12]/80 border border-white/[0.06] shadow-2xl backdrop-blur-sm">
          <p className="text-base sm:text-lg font-normal text-[#C7C9CC] leading-relaxed text-justify sm:text-center">
            NEXT YOU مسیری برای شناخت بهتر خودت، پیدا کردن نقطه‌های قابل‌بهبود، ساختن عادت‌های مؤثر و تبدیل تصمیم‌ها به اقدام واقعی است. از شناخت خودت شروع کن، مسیر رشدت را بساز و قدم‌به‌قدم پیشرفتت را دنبال کن.
          </p>
        </div>

      </div>
    </section>
  );
};
