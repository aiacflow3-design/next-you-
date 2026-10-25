import React from 'react';
import { Compass, Check, Flame, Shuffle, Zap } from 'lucide-react';

interface ExperienceLevelSelectorProps {
  selectedLevel: string;
  onChange: (level: string) => void;
}

interface StateOption {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
}

const stateOptions: StateOption[] = [
  {
    id: 'انگیزه دارم اما مسیر مشخصی ندارم',
    label: 'انگیزه دارم اما مسیر مشخصی ندارم',
    desc: 'می‌خواهم نقشه راهی شفاف داشته باشم تا بدانم از کجا و چگونه شروع کنم',
    icon: Compass,
  },
  {
    id: 'برنامه دارم ولی استمرار سخت است',
    label: 'برنامه دارم ولی استمرار سخت است',
    desc: 'هدف‌ها مشخص است اما پایبندی و نظم روزانه چالش اصلی من در مسیر است',
    icon: Flame,
  },
  {
    id: 'هدف‌های زیادی دارم و احساس سردرگمی می‌کنم',
    label: 'هدف‌های زیادی دارم و احساس سردرگمی می‌کنم',
    desc: 'نیاز به اولویت‌بندی، فیلتر کردن اولویت‌ها و تمرکز بر مهم‌ترین اهداف دارم',
    icon: Shuffle,
  },
  {
    id: 'مسیر مشخصی دارم و میخواهم بهتر شوم',
    label: 'مسیر مشخصی دارم و می‌خواهم بهتر شوم',
    desc: 'در مسیر حرکت هستم و به دنبال بهینه‌سازی، وضوح بالاتر و ارتقای مداومم',
    icon: Zap,
  },
];

export const ExperienceLevelSelector: React.FC<ExperienceLevelSelectorProps> = ({
  selectedLevel,
  onChange,
}) => {
  return (
    <div className="space-y-2.5 my-5">
      {stateOptions.map((opt) => {
        const isSelected = selectedLevel === opt.id;
        const Icon = opt.icon;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`w-full text-right p-3.5 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-3.5 select-none ${
              isSelected
                ? 'bg-[#151619] border-2 border-[#B5122B] shadow-[0_0_24px_rgba(181,18,43,0.2)]'
                : 'bg-[#0E0F12]/80 border border-white/[0.07] hover:border-white/20 hover:bg-[#131418]'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#B5122B] text-white shadow-[0_0_12px_rgba(181,18,43,0.45)]'
                    : 'bg-white/[0.04] text-[#85878C] border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="text-right min-w-0">
                <span
                  className={`text-sm font-bold block transition-colors ${
                    isSelected ? 'text-[#E8E8E6]' : 'text-[#C7C9CC]'
                  }`}
                >
                  {opt.label}
                </span>
                <p className="text-[11px] text-[#85878C] mt-0.5 line-clamp-1">
                  {opt.desc}
                </p>
              </div>
            </div>

            {/* Radio indicator */}
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#B5122B] border-[#B5122B] text-white shadow-[0_0_10px_rgba(181,18,43,0.4)]'
                  : 'border-white/20 bg-transparent'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};
