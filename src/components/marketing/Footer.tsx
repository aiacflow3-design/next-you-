import React from 'react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { smoothScrollTo } from '../../lib/scrollController';

interface FooterProps {
  onOpenAssessment?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAssessment }) => {
  const { navigate, isAuthenticated } = useAuth();

  return (
    <footer className="relative z-10 bg-[#08090B] border-t border-white/[0.06] py-12 text-[#B7B8C0]" dir="rtl">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand & Slogan */}
        <div className="flex flex-col items-center sm:items-start gap-1.5 text-center sm:text-right">
          <button
            type="button"
            onClick={() => smoothScrollTo('#hero', { offset: 0 })}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Logo size="sm" />
          </button>
          <p className="text-xs text-[#7E808A]">هر روز، ۱ درصد بهتر.</p>
        </div>

        {/* Essential Working Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#B7B8C0]">
          <button
            type="button"
            onClick={() => smoothScrollTo('#hero', { offset: 0 })}
            className="hover:text-[#F4F0E8] transition-colors cursor-pointer"
          >
            صفحه اصلی
          </button>
          <button
            type="button"
            onClick={() => smoothScrollTo('#why-nextyou', { offset: -70 })}
            className="hover:text-[#F4F0E8] transition-colors cursor-pointer"
          >
            چرا NEXT YOU
          </button>
          {onOpenAssessment && (
            <button
              type="button"
              onClick={onOpenAssessment}
              className="hover:text-[#F4F0E8] transition-colors cursor-pointer"
            >
              ارزیابی رایگان
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            className="hover:text-[#F4F0E8] transition-colors cursor-pointer"
          >
            {isAuthenticated ? 'ورود به داشبورد' : 'حساب کاربری'}
          </button>
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#7E808A] text-center sm:text-left">
          © {new Date().getFullYear()} NEXT YOU. تمامی حقوق محفوظ است.
        </div>

      </div>
    </footer>
  );
};
