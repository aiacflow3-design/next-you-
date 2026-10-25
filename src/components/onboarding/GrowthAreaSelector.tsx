import React from 'react';
import { PrimaryGrowthArea } from '../../lib/domain/user.entity';
import { Shield, Target, Sparkles, HeartPulse, Users, TrendingUp, Check } from 'lucide-react';

interface GrowthAreaSelectorProps {
  value: PrimaryGrowthArea | null;
  onChange: (area: PrimaryGrowthArea) => void;
}

interface AreaOption {
  id: PrimaryGrowthArea;
  label: string;
  desc: string;
  icon: React.ElementType;
}

const options: AreaOption[] = [
  {
    id: 'personal_discipline',
    label: 'نظم شخصی',
    desc: 'پایداری در برنامه‌ریزی، بیدار شدن و متعهد ماندن به خود',
    icon: Shield,
  },
  {
    id: 'focus',
    label: 'تمرکز',
    desc: 'کاهش حواس‌پرتی و عمیق شدن در کارهای باارزش',
    icon: Target,
  },
  {
    id: 'self_confidence',
    label: 'اعتمادبه‌نفس',
    desc: 'باور به توانمندی‌ها و غلبه بر شک درونی و تردید',
    icon: Sparkles,
  },
  {
    id: 'health_energy',
    label: 'سلامت و انرژی',
    desc: 'خواب منظم، بازیابی انرژی جسمی و حال ذهنی پایدار',
    icon: HeartPulse,
  },
  {
    id: 'relationships',
    label: 'روابط',
    desc: 'ارتباطات مؤثر، مرزگذاری شفاف و شنیدن فعال',
    icon: Users,
  },
  {
    id: 'career_growth',
    label: 'رشد شغلی',
    desc: 'ارتقای مهارت، افزایش بهره‌وری و تصمیم‌گیری‌های شفاف',
    icon: TrendingUp,
  },
];

export const GrowthAreaSelector: React.FC<GrowthAreaSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = value === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`text-right p-4 rounded-xl transition-all duration-200 cursor-pointer flex items-start gap-3.5 relative select-none ${
              isSelected
                ? 'bg-[#151619] border-2 border-[#B5122B] shadow-[0_0_24px_rgba(181,18,43,0.22)]'
                : 'bg-[#111214]/80 border border-white/[0.08] hover:border-white/20 hover:bg-[#141518]'
            }`}
          >
            {/* Icon */}
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'bg-[#B5122B] text-white shadow-[0_0_12px_rgba(181,18,43,0.5)]'
                  : 'bg-white/[0.04] text-[#85878C] border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>

            {/* Label and description */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm font-bold tracking-tight transition-colors ${
                    isSelected ? 'text-[#E8E8E6]' : 'text-[#C7C9CC]'
                  }`}
                >
                  {opt.label}
                </span>

                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-[#B5122B] flex items-center justify-center text-white shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#85878C] leading-relaxed line-clamp-2">
                {opt.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
