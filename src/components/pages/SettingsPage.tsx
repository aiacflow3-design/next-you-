import React from 'react';
import { LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';
import { ReminderSettingsCard } from '../reminders/ReminderSettingsCard';

export const SettingsPage: React.FC = () => {
  const { user, logout, navigate } = useAuth();

  return (
    <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Logo size="md" />
          </div>
          <div className="h-4 w-px bg-white/[0.08]" />
          <span className="text-xs font-semibold text-[#85878C]">تنظیمات حساب و یادآوری‌ها</span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="text-xs text-[#85878C] hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>بازگشت به داشبورد</span>
        </button>
      </header>

      <main className="max-w-2xl mx-auto w-full my-auto py-8 text-right space-y-6" dir="rtl">
        {/* User Account Card */}
        <div className="luxury-glass-card rounded-2xl p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_70px_rgba(0,0,0,0.85)] space-y-6">
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
            <div className="w-12 h-12 rounded-xl bg-[#B5122B]/15 border border-[#B5122B]/35 flex items-center justify-center text-[#B5122B] text-lg font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white">{user?.name || 'کاربر سیستم'}</h1>
              <p className="text-xs text-[#85878C] font-mono">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
              <span className="text-[#85878C]">وضعیت سشن:</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>احراز هویت شده • پایدار</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
              <span className="text-[#85878C]">مرحله شناخت (Onboarding):</span>
              <span className="text-white font-mono">
                {user?.onboardingCompleted ? 'تکمیل شده' : 'در انتظار تکمیل'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>

        {/* In-App Reminder Center */}
        <ReminderSettingsCard />
      </main>

      <footer className="max-w-4xl mx-auto w-full text-center py-3 text-[11px] text-[#85878C]/60">
        NEXT YOU — سیستم رشد فردی
      </footer>
    </div>
  );
};
