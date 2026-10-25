import React from 'react';

export const ComplementarySloganSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 bg-[#08090C] border-t border-b border-white/[0.04] overflow-hidden" dir="rtl">
      {/* Background radial accent */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(181,18,43,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-5">
        <h2 className="text-2xl sm:text-4xl font-bold text-[#E8E8E6] leading-snug">
          تغییر با انگیزه شروع می‌شود؛ با دیسیپلین ادامه پیدا می‌کند.
        </h2>
        <p className="text-base sm:text-lg font-normal text-[#9CA0A6] max-w-2xl mx-auto leading-relaxed">
          قرار نیست یک‌شبه عوض شوی. قرار است هر روز، آگاهانه یک قدم جلوتر بروی.
        </p>
      </div>
    </section>
  );
};
