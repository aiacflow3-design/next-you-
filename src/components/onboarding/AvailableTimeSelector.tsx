import React from 'react';
import { Clock, Check } from 'lucide-react';

interface AvailableTimeSelectorProps {
  selectedTime: string;
  onChange: (time: string) => void;
}

interface TimeOption {
  id: string;
  label: string;
  desc: string;
}

const timeOptions: TimeOption[] = [
  {
    id: '۵ دقیقه',
    label: '۵ دقیقه',
    desc: 'یک اقدام بسیار کوچک اما پیوسته و روزمره',
  },
  {
    id: '۱۵ دقیقه',
    label: '۱۵ دقیقه',
    desc: 'زمان ایده‌آل برای تمرین کوتاه، تفکر و ارزیابی روزانه',
  },
  {
    id: '۳۰ دقیقه',
    label: '۳۰ دقیقه',
    desc: 'فضای کافی برای یادگیری عمیق، خواندن و ساخت پایه‌ها',
  },
  {
    id: 'بیشتر از ۱ ساعت',
    label: 'بیشتر از ۱ ساعت',
    desc: 'تمرکز فشرده و تعهد بالا برای تحول شتاب‌یافته',
  },
];

export const AvailableTimeSelector: React.FC<AvailableTimeSelectorProps> = ({
  selectedTime,
  onChange,
}) => {
  return (
    <div className="space-y-2.5 my-5">
      {timeOptions.map((opt) => {
        const isSelected = selectedTime === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`w-full text-right p-4 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-3.5 select-none ${
              isSelected
                ? 'bg-[#151619] border-2 border-[#B5122B] shadow-[0_0_24px_rgba(181,18,43,0.22)]'
                : 'bg-[#111214]/80 border border-white/[0.08] hover:border-white/20 hover:bg-[#141518]'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#B5122B] text-white shadow-[0_0_12px_rgba(181,18,43,0.5)]'
                    : 'bg-white/[0.04] text-[#85878C] border border-white/5'
                }`}
              >
                <Clock className="w-4 h-4" />
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
