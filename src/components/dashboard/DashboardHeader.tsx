import React, { useState } from 'react';
import { Flame, User as UserIcon, LogOut, ChevronDown, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { SafeUser } from '../../lib/domain/user.entity';
import { useAuth } from '../../context/AuthContext';

interface DashboardHeaderProps {
  user: SafeUser | null;
  onLogout: () => void;
  onNavigateHome: () => void;
  completedMissionsCount: number;
  totalMissionsCount: number;
  streakDays: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onLogout,
  onNavigateHome,
  completedMissionsCount,
  totalMissionsCount,
  streakDays,
}) => {
  const { navigate } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const displayName = user?.name || user?.email?.split('@')[0] || 'کاربر گرامی';
  const missionProgressPercent =
    totalMissionsCount > 0 ? Math.round((completedMissionsCount / totalMissionsCount) * 100) : 0;

  return (
    <header className="w-full border-b border-white/[0.06] pb-6 mb-8 select-none">
      {/* Top Bar with Logo & Actions */}
      <div className="flex items-center justify-between py-3 mb-6">
        <div className="flex items-center gap-6">
          <div className="cursor-pointer" onClick={onNavigateHome}>
            <Logo size="md" />
          </div>

          <nav className="hidden md:flex items-center gap-5 text-xs text-[#85878C]">
            <span className="text-[#E8E8E6] font-semibold border-b border-[#B5122B] pb-0.5">
              داشبورد رشد
            </span>
            <button
              type="button"
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              onClick={() => navigate('/coach')}
            >
              <Sparkles className="w-3 h-3 text-[#B5122B]" />
              <span>مربی رشد</span>
            </button>
            <span
              className="hover:text-white transition-colors cursor-pointer"
              onClick={onNavigateHome}
            >
              صفحه اصلی
            </span>
          </nav>
        </div>

        {/* User Profile Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-semibold text-[#E8E8E6] leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-[#85878C] font-mono leading-tight">
                {user?.email}
              </span>
            </div>

            <div className="w-8 h-8 rounded-lg bg-[#B5122B]/20 border border-[#B5122B]/40 text-[#E8E8E6] flex items-center justify-center font-bold text-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#85878C]" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[#111215] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-2 z-50 animate-fadeIn text-right">
              <div className="p-2 border-b border-white/[0.05] mb-1">
                <span className="text-[11px] text-[#85878C] block">حساب کاربری</span>
                <span className="text-xs font-semibold text-white truncate block">
                  {user?.email}
                </span>
                <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>تأیید شده • NEXT YOU PRO</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('/coach');
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-[#E8E8E6] hover:bg-white/[0.05] transition-colors cursor-pointer mb-1"
              >
                <span>مربی رشد اختصاصی</span>
                <Sparkles className="w-3.5 h-3.5 text-[#B5122B]" />
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <span>خروج از حساب</span>
                <LogOut className="w-3.5 h-3.5 text-[#B5122B]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Greeting & Key Indicators */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Exact Greeting text requested by user */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#E8E8E6] tracking-tight leading-tight">
            سلام، {displayName}
          </h1>
          <p className="text-sm sm:text-base text-[#85878C] font-normal">
            آماده‌ای امروز یک قدم جلوتر بروی؟
          </p>
        </div>

        {/* Indicators: Daily Streak & Today's Progress */}
        <div className="flex items-center flex-wrap gap-3 sm:gap-4">
          {/* Daily Streak Badge */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#121316] border border-white/[0.08] shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <div className="w-7 h-7 rounded-lg bg-[#B5122B]/15 text-[#B5122B] flex items-center justify-center border border-[#B5122B]/30 animate-pulse">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-[#E8E8E6] flex items-center gap-1">
                <span>{streakDays} روز</span>
                <span className="text-[10px] font-normal text-[#85878C]">استمرار</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono block">
                +۱٪ رشد روزانه
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121316] border border-white/[0.08] shadow-[0_0_20px_rgba(0,0,0,0.3)] min-w-[160px]">
            <div className="text-right flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[10px] text-[#85878C]">مأموریت امروز</span>
                <span className="font-mono text-xs font-bold text-[#E8E8E6]">
                  {missionProgressPercent}%
                </span>
              </div>
              {/* Hairline Progress Bar */}
              <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7F0D20] via-[#B5122B] to-[#D71937] transition-all duration-500 rounded-full"
                  style={{ width: `${missionProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
