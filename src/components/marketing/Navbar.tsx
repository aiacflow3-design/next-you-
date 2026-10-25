import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Menu, X, ArrowLeft, LogOut, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useNavbarScrolled, smoothScrollTo } from '../../lib/scrollController';

interface NavbarProps {
  onOpenAssessment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssessment }) => {
  const { user, isAuthenticated, logout, navigate } = useAuth();
  const scrolled = useNavbarScrolled(20);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'hero' | 'why-nextyou' | 'final-cta'>('hero');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: 'hero' | 'why-nextyou' | 'final-cta') => {
    setMobileMenuOpen(false);
    setActiveNav(id);
    if (id === 'hero') {
      smoothScrollTo('#hero', { offset: 0 });
    } else {
      smoothScrollTo('#' + id, { offset: -70 });
    }
  };

  // Track active section while scrolling
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollY = window.scrollY;
      const whyEl = document.getElementById('why-nextyou');
      const finalEl = document.getElementById('final-cta');

      if (finalEl && scrollY >= finalEl.offsetTop - 280) {
        setActiveNav('final-cta');
      } else if (whyEl && scrollY >= whyEl.offsetTop - 280) {
        setActiveNav('why-nextyou');
      } else {
        setActiveNav('hero');
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const displayName = user?.name || user?.email?.split('@')[0] || 'کاربر گرامی';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 select-none ${
        scrolled
          ? 'bg-[#08090B]/92 backdrop-blur-md border-b border-white/[0.07] py-2.5 sm:py-3 shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
          : 'bg-transparent py-3.5 sm:py-4 border-b border-white/[0.02]'
      }`}
    >
      <div
        className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr] items-center"
        dir="ltr"
      >
        {/* 1. LEFT ZONE: NEXT YOU Brand Logo */}
        <div className="flex items-center justify-start justify-self-start">
          <button
            type="button"
            onClick={() => scrollTo('hero')}
            className="cursor-pointer transition-opacity hover:opacity-90 flex items-center"
            aria-label="NEXT YOU"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* 2. CENTER ZONE: Genuinely Centered Navigation (Only real, working sections) */}
        <nav
          className="hidden lg:flex items-center justify-center justify-self-center gap-7 text-xs font-medium text-[#B7B8C0]"
          dir="rtl"
          aria-label="منوی اصلی"
        >
          <button
            type="button"
            onClick={() => scrollTo('hero')}
            className={`transition-colors cursor-pointer relative py-1.5 px-1 ${
              activeNav === 'hero' ? 'text-[#F4F0E8] font-semibold' : 'hover:text-[#F4F0E8]'
            }`}
          >
            <span>خانه</span>
            {activeNav === 'hero' && (
              <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-[#C8102E] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo('why-nextyou')}
            className={`transition-colors cursor-pointer relative py-1.5 px-1 ${
              activeNav === 'why-nextyou' ? 'text-[#F4F0E8] font-semibold' : 'hover:text-[#F4F0E8]'
            }`}
          >
            <span>چرا NEXT YOU</span>
            {activeNav === 'why-nextyou' && (
              <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-[#C8102E] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo('final-cta')}
            className={`transition-colors cursor-pointer relative py-1.5 px-1 ${
              activeNav === 'final-cta' ? 'text-[#F4F0E8] font-semibold' : 'hover:text-[#F4F0E8]'
            }`}
          >
            <span>مسیر صعود</span>
            {activeNav === 'final-cta' && (
              <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-[#C8102E] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAssessment}
            className="inline-flex items-center gap-1.5 text-[#F4F0E8] hover:text-white transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]"
          >
            <Sparkles className="w-3 h-3 text-[#C8102E]" />
            <span>ارزیابی ۳ دقیقه‌ای</span>
          </button>
        </nav>

        {/* 3. RIGHT ZONE: Authentication / User Controls */}
        <div className="flex items-center justify-end justify-self-end gap-2.5 sm:gap-3" dir="rtl">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-lg bg-[#C8102E] hover:bg-[#DF1334] transition-all cursor-pointer shadow-[0_0_15px_rgba(200,16,46,0.35)]"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>داشبورد</span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
                  aria-expanded={userDropdownOpen}
                  aria-label="منوی حساب کاربری"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#C8102E]/15 border border-[#C8102E]/35 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-[#F4F0E8] max-w-[120px] sm:max-w-[160px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#B7B8C0]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-52 rounded-xl bg-[#191A1F] border border-white/10 p-2 shadow-2xl z-50 animate-fadeIn text-right">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs font-semibold text-[#F4F0E8] truncate">{displayName}</p>
                      <p className="text-[10px] text-[#B7B8C0] font-mono truncate">{user?.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full text-right px-3 py-2 text-xs text-[#F4F0E8] hover:bg-white/5 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>ورود به داشبورد</span>
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#C8102E]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/growth-path');
                      }}
                      className="w-full text-right px-3 py-2 text-xs text-[#F4F0E8] hover:bg-white/5 rounded-lg transition-colors cursor-pointer flex items-center justify-between mt-0.5"
                    >
                      <span>مسیر رشد من</span>
                      <ArrowLeft className="w-3.5 h-3.5 text-[#C8102E]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/coach');
                      }}
                      className="w-full text-right px-3 py-2 text-xs text-[#F4F0E8] hover:bg-white/5 rounded-lg transition-colors cursor-pointer flex items-center justify-between mt-0.5"
                    >
                      <span>مربی رشد</span>
                      <ArrowLeft className="w-3.5 h-3.5 text-[#C8102E]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-right px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer flex items-center justify-between mt-1 border-t border-white/5 pt-1.5"
                    >
                      <span>خروج از حساب</span>
                      <LogOut className="w-3.5 h-3.5 text-[#C8102E]" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-white px-4 py-2 rounded-xl bg-[#C8102E] hover:bg-[#DF1334] transition-all cursor-pointer shadow-[0_0_15px_rgba(200,16,46,0.35)]"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>ورود / ثبت‌نام</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#B7B8C0] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5 mr-1"
            aria-label="منوی ناوبری"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden bg-[#08090B]/98 backdrop-blur-xl border-b border-white/10 px-6 py-4 space-y-3 animate-fadeIn"
          dir="rtl"
        >
          <div className="flex flex-col gap-1 text-sm text-[#B7B8C0]">
            <button
              type="button"
              onClick={() => scrollTo('hero')}
              className={`text-right py-2.5 border-b border-white/5 cursor-pointer flex items-center justify-between ${
                activeNav === 'hero' ? 'text-[#F4F0E8] font-semibold' : 'hover:text-white'
              }`}
            >
              <span>خانه</span>
              {activeNav === 'hero' && <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />}
            </button>
            <button
              type="button"
              onClick={() => scrollTo('why-nextyou')}
              className={`text-right py-2.5 border-b border-white/5 cursor-pointer flex items-center justify-between ${
                activeNav === 'why-nextyou' ? 'text-[#F4F0E8] font-semibold' : 'hover:text-white'
              }`}
            >
              <span>چرا NEXT YOU</span>
              {activeNav === 'why-nextyou' && <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />}
            </button>
            <button
              type="button"
              onClick={() => scrollTo('final-cta')}
              className={`text-right py-2.5 border-b border-white/5 cursor-pointer flex items-center justify-between ${
                activeNav === 'final-cta' ? 'text-[#F4F0E8] font-semibold' : 'hover:text-white'
              }`}
            >
              <span>مسیر صعود</span>
              {activeNav === 'final-cta' && <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssessment();
              }}
              className="text-right py-2.5 text-[#C8102E] font-medium flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ارزیابی ۳ دقیقه‌ای رایگان</span>
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2 border-t border-white/5">
            {isAuthenticated ? (
              <>
                <div className="px-2 py-1 text-xs text-[#B7B8C0]">
                  وارد شده با عنوان: <span className="text-white font-semibold">{displayName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-white rounded-lg bg-[#C8102E] hover:bg-[#DF1334] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>ورود به داشبورد</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-center text-xs font-medium text-red-300 hover:text-red-200 cursor-pointer"
                >
                  خروج از حساب
                </button>
              </>
            ) : (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-3 text-center text-xs font-semibold text-white rounded-xl bg-[#C8102E] hover:bg-[#DF1334] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(200,16,46,0.35)]"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>ورود / ثبت‌نام</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
