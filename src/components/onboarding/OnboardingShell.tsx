import React from 'react';
import { Logo } from '../ui/Logo';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface OnboardingShellProps {
  children: React.ReactNode;
}

export const OnboardingShell: React.FC<OnboardingShellProps> = ({ children }) => {
  const { user, logout, navigate } = useAuth();

  return (
    <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
      {/* Top Header */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between py-3 border-b border-white/[0.04]">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#85878C] hidden sm:inline-block max-w-[150px] truncate">
            {user?.name || user?.email}
          </span>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs text-[#85878C] hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#B5122B]" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="max-w-xl mx-auto w-full my-auto py-6 sm:py-10">
        <div className="luxury-glass-card rounded-2xl p-6 sm:p-9 border border-white/[0.08] shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative overflow-hidden">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center py-3 text-[11px] text-[#85878C]/60">
        NEXT YOU — شناخت • مسیر • اقدام • پیشرفت
      </footer>
    </div>
  );
};
