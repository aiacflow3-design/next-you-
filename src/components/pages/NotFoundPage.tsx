import React from 'react';
import { Compass, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';

export const NotFoundPage: React.FC = () => {
  const { user, navigate } = useAuth();

  return (
    <div
      className="min-h-screen bg-[#050505] text-[#E8E8E6] flex flex-col justify-between p-6 select-none relative"
      dir="rtl"
    >
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/[0.06]">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <Logo size="md" />
        </div>
        <button
          type="button"
          onClick={() => navigate(user ? '/dashboard' : '/')}
          className="text-xs text-[#85878C] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>{user ? 'بازگشت به داشبورد' : 'صفحه اصلی'}</span>
          <ArrowLeft className="w-3.5 h-3.5 text-[#B5122B]" />
        </button>
      </header>

      <main className="max-w-md mx-auto w-full my-auto text-center space-y-6 animate-fadeIn py-12">
        <div className="w-16 h-16 rounded-2xl bg-[#B5122B]/10 border border-[#B5122B]/30 flex items-center justify-center text-[#B5122B] mx-auto shadow-[0_0_40px_rgba(181,18,43,0.2)]">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-[#E85D6F] tracking-widest uppercase">
            خطای ۴۰۴ • مسیر نامعتبر
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            صفحه مورد نظر یافت نشد
          </h1>
          <p className="text-xs sm:text-sm text-[#85878C] leading-relaxed">
            به نظر می‌رسد این آدرس در سیستم NEXT YOU تعریف نشده است. می‌توانید با بازگشت به مسیر اصلی، قدم بعدی خود را بردارید.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#B5122B] hover:bg-[#c91833] text-white text-xs font-semibold cursor-pointer transition-all shadow-[0_0_20px_rgba(181,18,43,0.3)]"
          >
            {user ? 'ورود به داشبورد' : 'بازگشت به صفحه اصلی'}
          </button>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full text-center py-4 text-[11px] text-[#85878C]/60">
        NEXT YOU — هر روز، ۱٪ بهتر.
      </footer>
    </div>
  );
};
