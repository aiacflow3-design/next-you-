import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Calendar,
  TrendingUp,
  User as UserIcon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Settings,
  PenLine,
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';

interface AuthenticatedNavProps {
  activeSection?: 'dashboard' | 'growth-path' | 'today' | 'progress' | 'profile' | 'reports';
}

export const AuthenticatedNav: React.FC<AuthenticatedNavProps> = () => {
  const { user, logout, navigate, currentRoute } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const displayName = user?.name || user?.email?.split('@')[0] || 'کاربر گرامی';

  const navItems = [
    {
      id: 'dashboard',
      label: 'داشبورد',
      icon: LayoutDashboard,
      path: '/dashboard',
      active: currentRoute === '/dashboard',
    },
    {
      id: 'growth-path',
      label: 'مسیر رشد',
      icon: Compass,
      path: '/growth-path',
      active: currentRoute === '/growth-path',
    },
    {
      id: 'today',
      label: 'امروز',
      icon: Calendar,
      path: '/dashboard/action',
      active: currentRoute === '/dashboard/action',
    },
    {
      id: 'reports',
      label: 'گزارش‌ها',
      icon: PenLine,
      path: '/reports',
      active: currentRoute === '/reports',
    },
    {
      id: 'progress',
      label: 'پیشرفت',
      icon: TrendingUp,
      path: '/progress',
      active: currentRoute === '/progress',
    },
    {
      id: 'profile',
      label: 'پروفایل',
      icon: UserIcon,
      path: '/growth-profile',
      active: currentRoute === '/growth-profile',
    },
  ];

  return (
    <header
      className="max-w-4xl mx-auto w-full flex items-center justify-between py-3 border-b border-white/[0.05] select-none"
      dir="rtl"
    >
      <div className="flex items-center gap-6">
        <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
          <Logo size="md" />
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden sm:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer relative ${
                  item.active
                    ? 'text-white'
                    : 'text-[#9CA0A6] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.active ? 'text-[#B5122B]' : 'text-[#5C6068]'}`} />
                <span>{item.label}</span>
                {item.active && (
                  <span className="absolute bottom-0 right-3 left-3 h-[2px] bg-[#B5122B] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-[#B5122B]/15 border border-[#B5122B]/35 text-white flex items-center justify-center font-bold text-xs">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-[#E8E8E6] hidden sm:inline max-w-[120px] truncate">
            {displayName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#85878C]" />
        </button>

        {isMenuOpen && (
          <div
            className="absolute left-0 mt-2 w-52 rounded-xl bg-[#111215] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-1.5 z-50 animate-fadeIn text-right"
            dir="rtl"
          >
            <div className="p-2 border-b border-white/[0.05] mb-1">
              <span className="text-[10px] text-[#85878C] block font-mono">حساب کاربری</span>
              <span className="text-xs font-semibold text-white truncate block">
                {user?.email}
              </span>
            </div>

            {/* Mobile Nav Links inside menu */}
            <div className="sm:hidden border-b border-white/[0.05] pb-1 mb-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(item.path);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-[#85878C] hover:text-white hover:bg-white/[0.04] cursor-pointer"
                >
                  <item.icon className="w-3.5 h-3.5 text-[#B5122B]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/reports');
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-[#E8E8E6] hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <span>گزارش‌های من</span>
              <PenLine className="w-3.5 h-3.5 text-[#B5122B]" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/coach');
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-[#E8E8E6] hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <span>مربی رشد</span>
              <Compass className="w-3.5 h-3.5 text-[#B5122B]" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/settings');
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-[#E8E8E6] hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <span>تنظیمات</span>
              <Settings className="w-3.5 h-3.5 text-[#B5122B]" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer mt-1 border-t border-white/[0.05]"
            >
              <span>خروج از حساب</span>
              <LogOut className="w-3.5 h-3.5 text-[#B5122B]" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
