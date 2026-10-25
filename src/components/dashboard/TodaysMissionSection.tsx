import React, { useState } from 'react';
import { Check, CheckCircle2, Clock, Zap, Sparkles } from 'lucide-react';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  completed: boolean;
  xpReward?: number;
}

interface TodaysMissionSectionProps {
  missions: DailyMission[];
  onToggleMission: (id: string) => void;
}

export const TodaysMissionSection: React.FC<TodaysMissionSectionProps> = ({
  missions,
  onToggleMission,
}) => {
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const completedCount = missions.filter((m) => m.completed).length;
  const isAllCompleted = completedCount === missions.length && missions.length > 0;
  const progressPercent = missions.length > 0 ? Math.round((completedCount / missions.length) * 100) : 0;

  const handleToggle = (id: string) => {
    setAnimatingId(id);
    onToggleMission(id);
    setTimeout(() => {
      setAnimatingId(null);
    }, 600);
  };

  return (
    <div className="w-full space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#B5122B]/15 text-[#B5122B] flex items-center justify-center border border-[#B5122B]/30">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8E8E6] tracking-tight">
              مأموریت‌های امروز (Today's Mission)
            </h3>
            <p className="text-xs text-[#85878C]">
              اقدام‌های روزانه متمرکز برای تحقق قانون ۱٪ رشد روزمره
            </p>
          </div>
        </div>

        {/* Counter & Progress Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-[#121316] border border-white/[0.08] px-3 py-1 rounded-full text-xs">
            <span className="font-mono font-bold text-[#E8E8E6]">
              {completedCount} از {missions.length}
            </span>
            <div className="w-16 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7F0D20] via-[#B5122B] to-[#E51E40] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-[#85878C]">{progressPercent}%</span>
          </div>

          {isAllCompleted && (
            <span className="text-[11px] font-sans font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full animate-fadeIn flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>همه مأموریت‌ها انجام شد (+۱۲۰ XP)</span>
            </span>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {missions.map((task) => {
          const isJustAnimated = animatingId === task.id;

          return (
            <div
              key={task.id}
              onClick={() => handleToggle(task.id)}
              className={`p-4 sm:p-4.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-start justify-between gap-4 select-none relative overflow-hidden ${
                task.completed
                  ? 'bg-[#0E0F12]/60 border-white/[0.04] opacity-80'
                  : 'bg-[#121316] border-white/[0.08] hover:border-white/20 hover:bg-[#15161A] shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
              } ${isJustAnimated ? 'scale-[0.99] ring-1 ring-[#B5122B]/40' : ''}`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                {/* Interactive Checkbox with Completion Animation */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-300 shrink-0 mt-0.5 ${
                    task.completed
                      ? 'bg-[#B5122B] border-[#B5122B] text-white shadow-[0_0_14px_rgba(181,18,43,0.5)] scale-105'
                      : 'border-white/20 bg-white/[0.02] hover:border-white/40'
                  }`}
                >
                  {task.completed && (
                    <Check className="w-3.5 h-3.5 stroke-[3] animate-scaleUp" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs sm:text-sm font-semibold transition-all duration-300 ${
                        task.completed
                          ? 'line-through text-[#85878C]'
                          : 'text-[#E8E8E6]'
                      }`}
                    >
                      {task.title}
                    </span>

                    {task.completed && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 animate-fadeIn">
                        انجام شد
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-[11px] leading-relaxed transition-colors ${
                      task.completed ? 'text-[#85878C]/60' : 'text-[#85878C]'
                    }`}
                  >
                    {task.description}
                  </p>
                </div>
              </div>

              {/* Meta Chips */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <span className="text-[10px] text-[#85878C] flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                  <Clock className="w-3 h-3 text-[#B5122B]" />
                  <span>{task.duration}</span>
                </span>
                <span className="text-[10px] font-medium text-[#C7C9CC] bg-white/[0.04] px-2 py-0.5 rounded border border-white/5 hidden sm:inline-block">
                  {task.category}
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  +{task.xpReward || 40} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
