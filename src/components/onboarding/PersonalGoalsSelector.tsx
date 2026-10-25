import React from 'react';
import { Check, Target, Shield, Repeat, Sparkles, TrendingUp, Compass } from 'lucide-react';

interface PersonalGoalsSelectorProps {
  selectedGoals: string[];
  onChange: (goals: string[]) => void;
}

interface GoalItem {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
}

const goalOptions: GoalItem[] = [
  {
    id: 'تمرکز',
    label: 'تمرکز',
    desc: 'کاهش حواس‌پرتی، کار عمیق و تسلط بر توجه پایدار',
    icon: Target,
  },
  {
    id: 'نظم شخصی',
    label: 'نظم شخصی',
    desc: 'پایداری در برنامه‌ریزی، سحرخیزی و متعهد ماندن به خود',
    icon: Shield,
  },
  {
    id: 'ساخت عادت',
    label: 'ساخت عادت',
    desc: 'ایجاد روتین‌های روزانه مؤثر و پایدار کردن رفتارهای سازنده',
    icon: Repeat,
  },
  {
    id: 'اعتماد به نفس',
    label: 'اعتماد به نفس',
    desc: 'غلبه بر شک درونی و باور استوار به توانایی‌های فردی',
    icon: Sparkles,
  },
  {
    id: 'رشد شغلی',
    label: 'رشد شغلی',
    desc: 'ارتقای مهارت، افزایش بازدهی و تصمیم‌گیری‌های شفاف کاری',
    icon: TrendingUp,
  },
  {
    id: 'توسعه فردی',
    label: 'توسعه فردی',
    desc: 'کشف ظرفیت‌های پنهان، خودآگاهی و ارتقای همه‌جانبه کیفیت زندگی',
    icon: Compass,
  },
];

export const PersonalGoalsSelector: React.FC<PersonalGoalsSelectorProps> = ({
  selectedGoals,
  onChange,
}) => {
  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      onChange(selectedGoals.filter((g) => g !== goalId));
    } else {
      onChange([...selectedGoals, goalId]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-5">
      {goalOptions.map((opt) => {
        const isSelected = selectedGoals.includes(opt.id);
        const Icon = opt.icon;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggleGoal(opt.id)}
            className={`w-full text-right p-3.5 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 select-none ${
              isSelected
                ? 'bg-[#151619] border-2 border-[#B5122B] shadow-[0_0_24px_rgba(181,18,43,0.2)]'
                : 'bg-[#0E0F12]/80 border border-white/[0.07] hover:border-white/20 hover:bg-[#131418]'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#B5122B] text-white shadow-[0_0_12px_rgba(181,18,43,0.45)]'
                    : 'bg-white/[0.04] text-[#85878C] border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Checkbox indicator */}
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#B5122B] border-[#B5122B] text-white shadow-[0_0_10px_rgba(181,18,43,0.4)]'
                    : 'border-white/20 bg-transparent'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div className="text-right min-w-0">
              <span
                className={`text-sm font-bold block transition-colors ${
                  isSelected ? 'text-[#E8E8E6]' : 'text-[#C7C9CC]'
                }`}
              >
                {opt.label}
              </span>
              <p className="text-[11px] text-[#85878C] mt-1 leading-relaxed line-clamp-2">
                {opt.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
