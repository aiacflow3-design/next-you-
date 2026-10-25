import React from 'react';
import { CurrentChallenge } from '../../lib/domain/user.entity';
import { Check } from 'lucide-react';

interface ChallengeSelectorProps {
  value: CurrentChallenge | null;
  onChange: (challenge: CurrentChallenge) => void;
}

interface ChallengeOption {
  id: CurrentChallenge;
  title: string;
}

const challengeOptions: ChallengeOption[] = [
  {
    id: 'start_no_finish',
    title: 'شروع می‌کنم، ولی ادامه نمیدم',
  },
  {
    id: 'distraction_hard_focus',
    title: 'تمرکز کردن برام سخته',
  },
  {
    id: 'dont_know_where_to_start',
    title: 'نمی‌دونم از کجا شروع کنم',
  },
  {
    id: 'motivated_no_consistency',
    title: 'انگیزه دارم، ولی ثبات ندارم',
  },
  {
    id: 'trapped_multiple_goals',
    title: 'بین چند هدف مختلف گیر کردم',
  },
  {
    id: 'unsure_core_problem',
    title: 'هنوز دقیق نمی‌دونم مشکل اصلی کجاست',
  },
];

export const ChallengeSelector: React.FC<ChallengeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2.5 my-4">
      {challengeOptions.map((opt) => {
        const isSelected = value === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`w-full text-right p-4 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 select-none ${
              isSelected
                ? 'bg-[#151619] border-2 border-[#B5122B] shadow-[0_0_24px_rgba(181,18,43,0.22)]'
                : 'bg-[#111214]/80 border border-white/[0.08] hover:border-white/20 hover:bg-[#141518]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  isSelected ? 'bg-[#B5122B] shadow-[0_0_8px_#B5122B]' : 'bg-white/20'
                }`}
              />
              <span
                className={`text-xs sm:text-sm font-semibold transition-colors ${
                  isSelected ? 'text-[#E8E8E6]' : 'text-[#C7C9CC]'
                }`}
              >
                {opt.title}
              </span>
            </div>

            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                isSelected
                  ? 'bg-[#B5122B] border-[#B5122B] text-white shadow-[0_0_10px_rgba(181,18,43,0.5)]'
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
