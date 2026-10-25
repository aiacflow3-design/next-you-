import React from 'react';
import { 
  SunMedium, 
  Users, 
  Briefcase, 
  Brain
} from 'lucide-react';

interface KeySkillsProps {
  onSelectCategory?: (category: string) => void;
}

export const KeySkills: React.FC<KeySkillsProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'lifestyle',
      number: '۰۱',
      title: 'سبک زندگی',
      description: 'تنظیم ساختار روز، روتین‌های آرامش‌بخش و رهایی از بی‌نظمی محیطی.',
      icon: SunMedium,
    },
    {
      id: 'relationships',
      number: '۰۲',
      title: 'روابط و ارتباطات',
      description: 'بیان شفاف نیازها، تعیین مرزهای سالم و ساخت ارتباطات عمیق و اصیل.',
      icon: Users,
    },
    {
      id: 'career',
      number: '۰۳',
      title: 'مهارت‌های شغلی',
      description: 'اولویت‌بندی کارها، کار عمیق و پیشبرد اهداف بدون استرس مزمن.',
      icon: Briefcase,
    },
    {
      id: 'mind-health',
      number: '۰۴',
      title: 'ذهن و سلامت',
      description: 'تسلط بر گفتگوی درونی، کیفیت خواب، مدیریت انرژی و پایداری روانی.',
      icon: Brain,
    },
  ];

  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Section Heading - Restrained, Medium Weight */}
        <div className="max-w-xl mx-auto text-center mb-12 md:mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-[#B5122B] mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5122B]"></span>
            <span>حوزه‌های بنیادی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#E8E8E6] tracking-tight mb-2.5">
            مهارت‌های کلیدی برای ساختن نسخه بهتر از خودت
          </h2>
          <p className="text-xs sm:text-sm text-[#85878C] font-normal leading-relaxed">
            رشد پایدار مستلزم توازن میان ۴ ستون اساسی است.
          </p>
        </div>

        {/* 4 Compact, Elegant Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                className="group relative p-5 rounded bg-[#0F1012] border border-white/[0.06] hover:border-white/15 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top: Number & minimal Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-sans font-medium text-[#85878C]/70 group-hover:text-[#B5122B] transition-colors">
                      {cat.number}
                    </span>
                    <Icon className="w-4 h-4 text-[#85878C] group-hover:text-[#E8E8E6] transition-colors" />
                  </div>

                  <h3 className="text-sm font-semibold text-[#E8E8E6] group-hover:text-white transition-colors mb-2">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-[#85878C] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
