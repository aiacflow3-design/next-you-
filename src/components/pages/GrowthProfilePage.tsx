import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Target,
  Shield,
  Zap,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';
import { AuthenticatedNav } from '../navigation/AuthenticatedNav';
import { GrowthProfile, GrowthDimension } from '../../lib/domain/growth-profile.entity';

// Dimension icon mapper (extensible for future traits)
function getDimensionIcon(key: string) {
  switch (key) {
    case 'discipline':
      return Shield;
    case 'focus':
      return Target;
    case 'clarity':
      return Eye;
    case 'energy':
      return Zap;
    default:
      return Sparkles;
  }
}

export const GrowthProfilePage: React.FC = () => {
  const { user, navigate, authFetch } = useAuth();
  const [profile, setProfile] = useState<GrowthProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchGrowthProfile() {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const res = await authFetch('/api/growth-profile');
        if (!isMounted) return;

        if (res.status === 401) {
          navigate('/login');
          return;
        }

        const data = await res.json();
        if (!isMounted) return;

        if (data.hasCompletedAssessment === false) {
          // User has not completed assessment, redirect to appropriate step
          navigate(data.redirectTo || '/assessment/initial');
          return;
        }

        if (data.success && data.profile) {
          setProfile(data.profile);
        } else {
          setErrorMsg(data.error || 'پروفایل رشد یافت نشد.');
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching growth profile:', err);
          setErrorMsg('خطا در دریافت پرونده رشد. لطفاً دوباره تلاش کنید.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchGrowthProfile();

    return () => {
      isMounted = false;
    };
  }, [authFetch, navigate]);

  const handleStartGrowthPath = () => {
    navigate('/growth-path');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col items-center justify-center p-6 select-none" dir="rtl">
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-[#B5122B]/15 border border-[#B5122B]/35 flex items-center justify-center text-[#B5122B]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-xs sm:text-sm text-[#85878C]">
            در حال بارگذاری پرونده رشد اختصاصی شما...
          </p>
        </div>
      </div>
    );
  }

  if (errorMsg || !profile) {
    return (
      <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col items-center justify-center p-6 select-none" dir="rtl">
        <div className="luxury-glass-card rounded-2xl p-7 max-w-md w-full border border-white/[0.08] text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-[#B5122B] mx-auto flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">پرونده ارزیابی یافت نشد</h2>
          <p className="text-xs text-[#85878C] leading-relaxed">
            {errorMsg || 'برای ساختن پروفایل رشد، ابتدا باید ارزیابی اولیه را تکمیل کنید.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/assessment/initial')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#B5122B] hover:bg-[#c91833] text-white text-xs font-semibold cursor-pointer transition-all"
          >
            شروع ارزیابی رشد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
      {/* Authenticated Navigation */}
      <AuthenticatedNav activeSection="profile" />

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto w-full my-auto py-8 sm:py-12 text-right" dir="rtl">
        <div className="space-y-8 animate-fadeIn">
          {/* 1. TOP SECTION (Exact phrasing requested) */}
          <section className="text-center space-y-2">
            <h1 className="typography-h1">
              پروفایل رشد تو
            </h1>
            <p className="typography-body-sm text-[#85878C] max-w-lg mx-auto">
              شناخت بهتر خودت، اولین قدم برای ساختن مسیر درست است.
            </p>
          </section>

          {/* 2. THE FOUR GROWTH DIMENSIONS (Extensible Trait Visualization) */}
          <section
            aria-label="ابعاد چهارگانه رشد فردی"
            className="luxury-glass-card rounded-2xl p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.7)] space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <span className="typography-label text-[#85878C] uppercase">ابعاد بنیادین ارزیابی</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                محاسبه بر اساس داده‌های واقعی
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.dimensions.map((dim: GrowthDimension) => {
                const IconComponent = getDimensionIcon(dim.key);
                return (
                  <div
                    key={dim.key}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#E8E8E6]">
                          <IconComponent className="w-3.5 h-3.5 text-[#B5122B]" />
                        </div>
                        <span className="typography-body-sm font-medium text-white">
                          {dim.name}
                        </span>
                      </div>
                      <span className="typography-metric text-base sm:text-lg font-semibold text-white">
                        {dim.score}٪
                      </span>
                    </div>

                    {/* Elegant hairline progress bar */}
                    <div
                      className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={dim.score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-[#B5122B] to-[#e62241] rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>

                    <p className="typography-caption leading-relaxed">
                      {dim.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. PROFILE SUMMARY CARD (Concise, human-readable, non-clinical) */}
          <section className="luxury-glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] relative overflow-hidden">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#B5122B]/15 border border-[#B5122B]/35 flex items-center justify-center text-[#B5122B] shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold text-white tracking-tight">
                  تحلیل و بینش بنیادین
                </h2>
                <p className="text-xs sm:text-sm text-[#C7C9CC] leading-relaxed">
                  {profile.summary}
                </p>
              </div>
            </div>
          </section>

          {/* 4 & 5. KEY STRENGTH & GROWTH OPPORTUNITY */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Key Strength (Highest Dimension) */}
            <div className="luxury-glass-card rounded-2xl p-5 sm:p-6 border border-emerald-500/20 bg-emerald-950/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  نقطه قوت فعلی تو
                </span>
                <span className="text-xs font-bold font-mono text-emerald-400">
                  {profile.traitScores[profile.keyStrength.dimensionKey] ?? ''}٪
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {profile.keyStrength.dimensionName}: {profile.keyStrength.title}
                </h3>
                <p className="text-xs text-[#85878C] mt-1.5 leading-relaxed">
                  {profile.keyStrength.description}
                </p>
              </div>
            </div>

            {/* Growth Opportunity (Lowest Dimension) */}
            <div className="luxury-glass-card rounded-2xl p-5 sm:p-6 border border-[#B5122B]/30 bg-[#B5122B]/[0.05] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#E85D6F] bg-[#B5122B]/15 px-2 py-0.5 rounded border border-[#B5122B]/30">
                  فرصت اصلی رشد
                </span>
                <span className="text-xs font-bold font-mono text-[#E85D6F]">
                  {profile.traitScores[profile.growthOpportunity.dimensionKey] ?? ''}٪
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {profile.growthOpportunity.dimensionName}: {profile.growthOpportunity.title}
                </h3>
                <p className="text-xs text-[#85878C] mt-1.5 leading-relaxed">
                  {profile.growthOpportunity.description}
                </p>
              </div>
            </div>
          </section>

          {/* 6. RECOMMENDED PATH & PRIMARY ACTION (Requirement 12) */}
          <section className="luxury-glass-card rounded-2xl p-6 sm:p-8 border border-[#B5122B]/40 bg-gradient-to-b from-[#15161c] to-[#0c0d10] space-y-5 shadow-[0_15px_50px_rgba(181,18,43,0.15)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#B5122B]" />
                <span className="text-xs font-bold text-[#E85D6F]">مسیر پیشنهادی تو</span>
              </div>
              <span className="text-[10px] font-mono text-[#85878C]">طراحی منطبق با وضعیت تو</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {profile.recommendedPath.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#85878C] leading-relaxed">
                {profile.recommendedPath.description}
              </p>
            </div>

            {profile.recommendedPath.keyPractices && profile.recommendedPath.keyPractices.length > 0 && (
              <div className="pt-2 border-t border-white/[0.05] space-y-2">
                <span className="text-[11px] font-semibold text-[#85878C] block">تمرکزهای کلیدی این مسیر:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {profile.recommendedPath.keyPractices.map((practice, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center gap-2 text-xs text-[#C7C9CC]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary CTA (Requirement 12) */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06]">
              <span className="text-xs text-[#85878C]">
                آماده‌ای اولین گام عملی را در این مسیر برداری؟
              </span>

              <button
                type="button"
                onClick={handleStartGrowthPath}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#B5122B] hover:bg-[#c91833] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_25px_rgba(181,18,43,0.35)]"
              >
                <span>شروع مسیر رشد</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center py-4 text-[11px] text-[#85878C]/60">
        NEXT YOU — سیستم رشد فردی و تحول گام‌به‌گام
      </footer>
    </div>
  );
};
