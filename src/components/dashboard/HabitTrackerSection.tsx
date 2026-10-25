import React, { useState } from 'react';
import { Repeat, Flame, Check, Plus, Calendar, CheckCircle2 } from 'lucide-react';

export interface HabitItem {
  id: string;
  name: string;
  category: string;
  streakCount: number;
  monthlyConsistency: number; // e.g. 88%
  weeklyHistory: boolean[]; // 7 days (Sat to Fri)
  completedToday: boolean;
}

const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'h-1',
    name: 'جلسه کار عمیق ۹۰ دقیقه‌ای بدون گوشی',
    category: 'تمرکز',
    streakCount: 12,
    monthlyConsistency: 92,
    weeklyHistory: [true, true, true, true, false, true, true],
    completedToday: true,
  },
  {
    id: 'h-2',
    name: 'سحرخیزی و آماده‌سازی ذهنی روز (۵ دقیقه یادداشت)',
    category: 'نظم شخصی',
    streakCount: 8,
    monthlyConsistency: 85,
    weeklyHistory: [true, true, false, true, true, true, false],
    completedToday: false,
  },
  {
    id: 'h-3',
    name: 'مطالعه و استخراج ۱ نکته عملی از کتاب',
    category: 'ساخت عادت',
    streakCount: 15,
    monthlyConsistency: 95,
    weeklyHistory: [true, true, true, true, true, true, true],
    completedToday: true,
  },
  {
    id: 'h-4',
    name: 'قطع صفحه‌نمایش‌ها ۴۵ دقیقه پیش از خواب',
    category: 'سبک زندگی',
    streakCount: 6,
    monthlyConsistency: 78,
    weeklyHistory: [false, true, true, true, true, false, false],
    completedToday: false,
  },
];

const WEEK_DAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']; // شنبه تا جمعه

interface HabitTrackerSectionProps {
  onHabitToggled?: (habitId: string, newState: boolean) => void;
}

export const HabitTrackerSection: React.FC<HabitTrackerSectionProps> = ({ onHabitToggled }) => {
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const saved = localStorage.getItem('nextyou_habits_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_HABITS;
  });

  const handleToggleToday = (habitId: string) => {
    setHabits((prev) => {
      const updated = prev.map((h) => {
        if (h.id === habitId) {
          const newCompleted = !h.completedToday;
          const newStreak = newCompleted ? h.streakCount + 1 : Math.max(0, h.streakCount - 1);
          const newHistory = [...h.weeklyHistory];
          newHistory[newHistory.length - 1] = newCompleted;

          if (onHabitToggled) {
            onHabitToggled(habitId, newCompleted);
          }

          return {
            ...h,
            completedToday: newCompleted,
            streakCount: newStreak,
            weeklyHistory: newHistory,
          };
        }
        return h;
      });

      try {
        localStorage.setItem('nextyou_habits_data', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  return (
    <div className="w-full space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#B5122B]/15 text-[#B5122B] flex items-center justify-center border border-[#B5122B]/30">
            <Repeat className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8E8E6] tracking-tight">
              ره‌گیر عادات روزانه (Habit Tracker)
            </h3>
            <p className="text-xs text-[#85878C]">
              پایش زنجیره پایبندی به روتین‌های کلیدی و تداوم هفتگی
            </p>
          </div>
        </div>

        {/* Global Monthly Consistency Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.04] border border-white/5 text-[#E8E8E6] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>میانگین پایبندی ماهانه: ۸۷٪</span>
          </span>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {habits.map((habit) => {
          return (
            <div
              key={habit.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between gap-4 ${
                habit.completedToday
                  ? 'bg-gradient-to-b from-[#141519] to-[#0E0F12] border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                  : 'bg-[#101114]/90 border-white/[0.06] hover:border-white/15'
              }`}
            >
              {/* Top: Name, Category, Streak */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] font-medium text-[#85878C] bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                    {habit.category}
                  </span>

                  {/* Streak Count Badge */}
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{habit.streakCount} روز استمرار</span>
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#E8E8E6] leading-snug">
                  {habit.name}
                </h4>
              </div>

              {/* Middle: 7-Day Weekly Consistency Indicator */}
              <div className="pt-2 border-t border-white/[0.04]">
                <div className="flex items-center justify-between text-[10px] text-[#85878C] mb-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#B5122B]" />
                    <span>تداوم در ۷ روز اخیر</span>
                  </span>
                  <span className="font-mono">{habit.monthlyConsistency}٪ پایبندی</span>
                </div>

                {/* 7 Day Dots */}
                <div className="flex items-center justify-between gap-1.5 p-2 rounded-lg bg-black/30 border border-white/[0.03]">
                  {WEEK_DAYS.map((dayLabel, idx) => {
                    const isDone = habit.weeklyHistory[idx];
                    const isToday = idx === WEEK_DAYS.length - 1;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-[9px] font-sans text-[#85878C]/70">
                          {dayLabel}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] transition-all ${
                            isDone
                              ? 'bg-[#B5122B] text-white shadow-[0_0_8px_rgba(181,18,43,0.5)]'
                              : isToday
                              ? 'border border-[#B5122B]/50 bg-[#B5122B]/10 text-[#B5122B]'
                              : 'bg-white/[0.04] text-transparent border border-white/5'
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom: Interactive Today Completion Button */}
              <button
                type="button"
                onClick={() => handleToggleToday(habit.id)}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  habit.completedToday
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'btn-secondary-glass hover:border-[#B5122B]/40 hover:text-white'
                }`}
              >
                {habit.completedToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>امروز انجام شد (ثبت شده)</span>
                  </>
                ) : (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border border-current" />
                    <span>ثبت انجام برای امروز</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
