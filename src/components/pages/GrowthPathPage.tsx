import React, { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
  RotateCcw,
  Target,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthenticatedNav } from '../navigation/AuthenticatedNav';
import {
  UserGrowthPathView,
  ActionWithProgress,
  ActionStatus,
} from '../../lib/domain/growth-path.entity';

function formatActionTypeLabel(type?: string): string {
  switch (type) {
    case 'observation':
      return 'مشاهده و آگاهی';
    case 'habit':
      return 'ساخت روتین';
    case 'execution':
      return 'تمرین عملی';
    case 'review':
      return 'مرور و تثبیت';
    default:
      return 'اقدام رشد';
  }
}

export const GrowthPathPage: React.FC = () => {
  const { user, navigate, authFetch } = useAuth();
  const [pathView, setPathView] = useState<UserGrowthPathView | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingAction, setIsUpdatingAction] = useState<string | null>(null);
  const [isAdvancingStage, setIsAdvancingStage] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  const fetchGrowthPath = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await authFetch('/api/growth-path');
      if (res.status === 401) {
        navigate('/login');
        return;
      }

      const data = await res.json();
      if (data.success && data.data) {
        setPathView(data.data);
      } else {
        setErrorMsg(data.error || 'خطا در بارگذاری مسیر رشد.');
      }
    } catch (err) {
      console.error('Error fetching growth path:', err);
      setErrorMsg('خطای اتصال به سرور. لطفاً مجدداً امتحان کنید.');
    } finally {
      setIsLoading(false);
    }
  }, [authFetch, navigate]);

  useEffect(() => {
    fetchGrowthPath();
  }, [fetchGrowthPath]);

  const handleToggleAction = async (action: ActionWithProgress) => {
    if (isUpdatingAction) return;
    setIsUpdatingAction(action.id);
    setErrorMsg(null);
    setSuccessNote(null);

    const nextStatus: ActionStatus = action.status === 'DONE' ? 'PENDING' : 'DONE';

    try {
      const res = await authFetch(`/api/growth-path/actions/${action.id}`, {
        method: 'POST',
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setPathView(data.data);
        if (nextStatus === 'DONE') {
          setSuccessNote(`اقدام «${action.title}» ثبت شد.`);
          setTimeout(() => setSuccessNote(null), 3500);
        }
      } else {
        setErrorMsg(data.error || 'خطا در به‌روزرسانی وضعیت اقدام.');
      }
    } catch (err) {
      console.error('Action toggle error:', err);
      setErrorMsg('خطا در ارتباط با سرور.');
    } finally {
      setIsUpdatingAction(null);
    }
  };

  const handleAdvanceStage = async () => {
    if (isAdvancingStage) return;
    setIsAdvancingStage(true);
    setErrorMsg(null);
    setSuccessNote(null);

    try {
      const res = await authFetch('/api/growth-path/advance-stage', {
        method: 'POST',
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setPathView(data.data);
        setSuccessNote('تبریک! به مرحله بعد مسیر رشد وارد شدی.');
        setTimeout(() => setSuccessNote(null), 4000);
      } else {
        setErrorMsg(data.error || 'امکان ارتقا به مرحله بعد وجود ندارد.');
      }
    } catch (err) {
      console.error('Advance stage error:', err);
      setErrorMsg('خطا در ارتباط با سرور.');
    } finally {
      setIsAdvancingStage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col items-center justify-center p-6 select-none" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#B5122B] animate-spin" />
          <span className="text-xs text-[#9CA0A6] font-mono tracking-wider">
            در حال بارگذاری نقشه مسیر رشد...
          </span>
        </div>
      </div>
    );
  }

  if (errorMsg && !pathView) {
    return (
      <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col items-center justify-center p-6 select-none" dir="rtl">
        <div className="action-focus-plate rounded-2xl p-7 max-w-md w-full text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-[#B5122B] mx-auto flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">خطا در بارگذاری نقشه مسیر</h2>
          <p className="text-xs text-[#9CA0A6] leading-relaxed">{errorMsg}</p>
          <button
            type="button"
            onClick={fetchGrowthPath}
            className="w-full py-2.5 px-4 rounded-lg btn-forward-primary text-xs font-semibold cursor-pointer"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!pathView) return null;

  const { path, stages, currentStageOrder, percentProgress, isPathCompleted } = pathView;
  const currentStage = stages.find((s) => s.order === currentStageOrder) || stages[0];

  return (
    <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
      <AuthenticatedNav activeSection="growth-path" />

      <main className="max-w-4xl mx-auto w-full my-auto py-8 sm:py-12 text-right" dir="rtl">
        <div className="space-y-8 animate-fadeIn">
          {/* 1. EDITORIAL HEADER & OVERALL PROGRESS */}
          <section className="space-y-4 border-b border-white/[0.05] pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9CA0A6]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B5122B] beacon-indicator" />
                  <span className="tracking-wider uppercase font-mono text-[11px]">
                    نقشه مسیر رشد · {path.title}
                  </span>
                </div>
                <h1 className="typography-h1 text-white">
                  مسیر {path.title}
                </h1>
                <p className="typography-body-sm text-[#9CA0A6] max-w-xl">
                  {path.description}
                </p>
              </div>

              {/* Progress Metric (Editorial, unboxed) */}
              <div className="text-left sm:text-right shrink-0">
                <div className="text-2xl sm:text-3xl font-semibold typography-metric text-white">
                  {percentProgress}٪
                </div>
                <div className="text-[11px] text-[#9CA0A6]">
                  {pathView.completedActionsCount} از {pathView.totalActionsCount} اقدام انجام شده
                </div>
              </div>
            </div>

            {/* Quiet progress horizon line */}
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-[#B5122B] to-[#7D0E1F] transition-all duration-700 ease-out"
                style={{ width: `${percentProgress}%` }}
              />
            </div>
          </section>

          {/* 2. THE VISUAL JOURNEY: 4 PROGRESSION STAGES (Section 8 Metaphor) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#9CA0A6]">
              <span>مراحل چهارگانه مسیر</span>
              <span className="text-[11px] font-mono">شناخت → ساخت پایه → تمرین → تثبیت</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stages.map((stg) => {
                const isActive = stg.order === currentStageOrder;
                const isCompleted = stg.status === 'COMPLETED';

                return (
                  <div
                    key={stg.id}
                    className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[110px] ${
                      isActive
                        ? 'action-focus-plate border-[#B5122B]/40'
                        : isCompleted
                        ? 'architectural-plate border-emerald-500/20'
                        : 'architectural-plate opacity-45'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#9CA0A6]">
                        گام {stg.order}
                      </span>
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isActive ? (
                        <span className="w-2 h-2 rounded-full bg-[#B5122B] beacon-indicator" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      )}
                    </div>

                    <div className="mt-2 space-y-0.5">
                      <h4 className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-[#C7C9CC]'}`}>
                        {stg.title}
                      </h4>
                      <p className="text-[10px] text-[#9CA0A6] line-clamp-1">
                        {stg.subtitle}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-[#5C6068]">
                      {isCompleted ? 'تکمیل شده' : isActive ? 'مرحله فعال' : 'در امتداد مسیر'}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Toast / Feedback */}
          {successNote && (
            <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successNote}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-[#B5122B] shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 3. CURRENT ACTIVE STAGE (Central Focal Command Plate) */}
          <section className="action-focus-plate rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#9CA0A6] mb-1">
                  <span className="text-[#E85D6F] font-mono">مرحله {currentStage.order} از {stages.length}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentStage.subtitle}</span>
                </div>
                <h2 className="typography-h2 text-white">
                  {currentStage.title}
                </h2>
              </div>

              <div className="text-left sm:text-right text-xs">
                <span className="text-[#9CA0A6]">وضعیت اقدامات: </span>
                <span className="font-mono text-white font-medium">
                  {currentStage.completedActionsCount} از {currentStage.totalActionsCount} انجام شد
                </span>
              </div>
            </div>

            {/* Stage Goal & Core Concept (Open Layout, No Nested Card Overload) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1">
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <Target className="w-3.5 h-3.5 text-[#B5122B]" />
                  <span>هدف این مرحله</span>
                </div>
                <p className="text-[#9CA0A6] leading-relaxed">
                  {currentStage.goal}
                </p>
              </div>

              {currentStage.coreConcept && (
                <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400/90" />
                    <span>مفهوم کلیدی</span>
                  </div>
                  <p className="text-[#9CA0A6] leading-relaxed">
                    {currentStage.coreConcept}
                  </p>
                </div>
              )}
            </div>

            {/* ACTIONS LIST */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-[#9CA0A6]">
                <span className="font-medium text-white">اقدامات این مرحله</span>
                <span className="text-[11px]">تمرکز روی یک اقدام در هر روز</span>
              </div>

              <div className="space-y-2.5">
                {currentStage.actions.map((act) => {
                  const isDone = act.status === 'DONE';
                  const isUpdating = isUpdatingAction === act.id;
                  const typeLabel = formatActionTypeLabel(act.type);

                  return (
                    <div
                      key={act.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                        isDone
                          ? 'bg-white/[0.015] border-white/[0.05] opacity-75'
                          : 'bg-white/[0.03] border-white/[0.07] hover:border-white/[0.14]'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isDone ? 'bg-emerald-400' : 'bg-[#B5122B]'
                            }`}
                          />
                          <h3
                            className={`text-sm font-medium ${
                              isDone ? 'text-emerald-300 line-through decoration-emerald-500/30' : 'text-white'
                            }`}
                          >
                            {act.title}
                          </h3>
                          <span className="text-[11px] text-[#9CA0A6]">
                            · {typeLabel} · {act.estimatedMinutes} دقیقه
                          </span>
                        </div>

                        <p className="text-xs text-[#9CA0A6] leading-relaxed pr-3.5">
                          {act.description}
                        </p>
                      </div>

                      {/* Action toggle button */}
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleToggleAction(act)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 disabled:opacity-50 ${
                          isDone
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20'
                            : 'btn-forward-primary'
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isDone ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>انجام شد</span>
                          </>
                        ) : (
                          <>
                            <span>انجام اقدام</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stage Advancement Notice if Complete */}
            {currentStage.isStageComplete && (
              <div className="pt-4 border-t border-white/[0.06] animate-fadeIn">
                <div className="p-4 rounded-xl bg-[#0e1014] border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-right">
                    <span className="text-xs font-semibold text-white block">
                      {isPathCompleted
                        ? 'تبریک! تمام مراحل این مسیر با موفقیت به پایان رسید.'
                        : 'اقدامات این مرحله تکمیل شدند.'}
                    </span>
                    <p className="text-[11px] text-[#9CA0A6]">
                      {isPathCompleted
                        ? 'اکنون می‌توانی از انباشت این عادات در روزمره‌ات بهره ببری.'
                        : 'آماده‌ای برای حرکت به سمت مرحله بعدی؟'}
                    </p>
                  </div>

                  {!isPathCompleted && (
                    <button
                      type="button"
                      disabled={isAdvancingStage}
                      onClick={handleAdvanceStage}
                      className="btn-forward-primary bg-emerald-600 hover:bg-emerald-500 w-full sm:w-auto px-5 py-2.5 text-xs font-medium"
                    >
                      {isAdvancingStage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>در حال ارتقا...</span>
                        </>
                      ) : (
                        <>
                          <span>ورود به مرحله بعد</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* 4. OTHER STAGES AS THE TERRAIN AHEAD (No locked icons) */}
          <section className="space-y-3 pt-2">
            <span className="text-xs text-[#9CA0A6] block">سایر ایستگاه‌های این مسیر</span>

            <div className="space-y-2.5">
              {stages
                .filter((s) => s.id !== currentStage.id)
                .map((stg) => {
                  const isCompleted = stg.status === 'COMPLETED';

                  return (
                    <div
                      key={stg.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                        isCompleted
                          ? 'architectural-plate border-emerald-500/15 opacity-80'
                          : 'architectural-plate opacity-45'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono ${
                            isCompleted
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-white/[0.04] text-[#9CA0A6]'
                          }`}
                        >
                          {isCompleted ? <Check className="w-3 h-3" /> : stg.order}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-white">
                              {stg.title}
                            </span>
                            <span className="text-[11px] text-[#9CA0A6]">
                              · {stg.subtitle}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5C6068] line-clamp-1">{stg.goal}</p>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-[#5C6068] shrink-0">
                        {isCompleted ? 'تکمیل‌شده' : 'ایستگاه پیش‌رو'}
                      </span>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* 5. FOOTER RETURN CTA */}
          <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/growth-profile')}
              className="text-xs text-[#9CA0A6] hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>پروفایل رشد</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-forward-secondary text-xs"
            >
              <span>بازگشت به مرکز فرمان (داشبورد)</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#B5122B]" />
            </button>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full text-center py-4 text-[11px] text-[#5C6068]">
        NEXT YOU · مسیر اختصاصی رشد فردی
      </footer>
    </div>
  );
};
