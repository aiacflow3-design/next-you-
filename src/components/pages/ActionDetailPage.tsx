import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  Check,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
  Target,
  PenLine,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthenticatedNav } from '../navigation/AuthenticatedNav';
import { TodayActionView } from '../../lib/domain/dashboard.entity';
import { ActionReport } from '../../lib/domain/action-report.entity';
import { ActionReportModal } from '../reports/ActionReportModal';

export const ActionDetailPage: React.FC = () => {
  const { user, navigate, authFetch } = useAuth();
  const [todayAction, setTodayAction] = useState<TodayActionView | null>(null);
  const [previousReflection, setPreviousReflection] = useState<ActionReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTodayAction() {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const res = await authFetch('/api/dashboard/today-action');
        if (!isMounted) return;

        if (res.status === 401) {
          navigate('/login');
          return;
        }

        const result = await res.json();
        if (!isMounted) return;

        if (!result.success) {
          if (result.redirectTo) {
            navigate(result.redirectTo);
            return;
          }
          setErrorMsg(result.error || 'خطا در دریافت اطلاعات اقدام امروز.');
          return;
        }

        if (result.todayAction) {
          setTodayAction(result.todayAction);
          setIsCompleted(result.todayAction.isCompletedToday);

          // Check if user previously reported on this action
          try {
            const repRes = await authFetch('/api/reports');
            if (repRes.ok && isMounted) {
              const repData = await repRes.json();
              if (repData.success && repData.reports) {
                const match = repData.reports.find(
                  (r: ActionReport) => r.actionId === result.todayAction.action.id && r.text
                );
                if (match) {
                  setPreviousReflection(match);
                }
              }
            }
          } catch {
            // Non-blocking reflection check
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching today action:', err);
          setErrorMsg('خطا در برقراری ارتباط با سرور.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTodayAction();

    return () => {
      isMounted = false;
    };
  }, [authFetch, navigate]);

  const handleCompleteAction = async () => {
    if (isSubmitting || !todayAction) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await authFetch('/api/dashboard/today-action/complete', {
        method: 'POST',
        body: JSON.stringify({ actionId: todayAction.action.id }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setIsCompleted(true);
        if (result.todayAction) {
          setTodayAction(result.todayAction);
        }
      } else {
        setErrorMsg(result.error || 'خطا در ثبت انجام اقدام.');
      }
    } catch (err) {
      console.error('Complete action error:', err);
      setErrorMsg('خطا در ارتباط با سرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipAction = async () => {
    if (isSubmitting || !todayAction) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await authFetch('/api/dashboard/today-action/skip', {
        method: 'POST',
        body: JSON.stringify({ actionId: todayAction.action.id }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        navigate('/progress');
      } else {
        setErrorMsg(result.error || 'خطا در ثبت رد اقدام.');
      }
    } catch (err) {
      console.error('Skip action error:', err);
      setErrorMsg('خطا در ارتباط با سرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col items-center justify-center p-6 select-none"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#B5122B] animate-spin" />
          <p className="text-xs text-[#9CA0A6] font-mono tracking-wider">
            در حال بارگذاری اقدام امروز...
          </p>
        </div>
      </div>
    );
  }

  if (errorMsg && !todayAction) {
    return (
      <div
        className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col items-center justify-center p-6 select-none"
        dir="rtl"
      >
        <div className="action-focus-plate rounded-2xl p-7 max-w-md w-full text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-[#B5122B] mx-auto flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">اقدام یافت نشد</h2>
          <p className="text-xs text-[#9CA0A6] leading-relaxed">{errorMsg}</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-forward-primary w-full py-2.5 px-4 text-xs font-semibold"
          >
            بازگشت به داشبورد
          </button>
        </div>
      </div>
    );
  }

  if (!todayAction) return null;

  return (
    <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
      <AuthenticatedNav activeSection="today" />

      {/* Main Focus Chamber (Deep Architectural Stillness) */}
      <main className="max-w-2xl mx-auto w-full my-auto py-8 sm:py-12 text-right" dir="rtl">
        <div className="space-y-6 animate-fadeIn">
          {/* Breadcrumb Context (Unboxed) */}
          <div className="flex items-center justify-between text-xs text-[#9CA0A6]">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>بازگشت به مرکز فرمان</span>
            </button>

            <span className="font-mono text-[11px] text-[#9CA0A6]">
              {todayAction.pathTitle} · مرحله {todayAction.stageOrder}
            </span>
          </div>

          {/* Action Focus Plate */}
          <div className="action-focus-plate rounded-2xl p-6 sm:p-9 space-y-7">
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono tracking-widest text-white uppercase inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B5122B] beacon-indicator" />
                  <span>اقدام امروز</span>
                </span>

                <div className="flex items-center gap-1.5 text-xs text-[#9CA0A6] font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#B5122B]" />
                  <span>مدت زمان: {todayAction.action.estimatedMinutes} دقیقه</span>
                </div>
              </div>

              <h1 className="typography-h1 text-white">
                {todayAction.action.title}
              </h1>

              <p className="typography-body text-[#C7C9CC] leading-relaxed text-sm sm:text-base">
                {todayAction.action.description}
              </p>
            </div>

            {/* Why This Matters */}
            {todayAction.whyThisMatters && (
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1">
                <span className="text-white text-xs font-medium block">چرایی این گام:</span>
                <p className="text-xs text-[#9CA0A6] leading-relaxed">
                  {todayAction.whyThisMatters}
                </p>
              </div>
            )}

            {/* Personalization Reason */}
            {todayAction.personalizationReason && (
              <div className="text-xs text-[#E85D6F] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B5122B]" />
                <span>{todayAction.personalizationReason}</span>
              </div>
            )}

            {/* Previous Reflection Moment */}
            {previousReflection && (
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1 text-right animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-medium text-[#E85D6F]">
                  <PenLine className="w-3.5 h-3.5 text-[#B5122B]" />
                  <span>آخرین باری که این اقدام را انجام دادی ({previousReflection.dateLabel}):</span>
                </div>
                <p className="text-xs text-[#C7C9CC] leading-relaxed italic pr-5">
                  «{previousReflection.text}»
                </p>
              </div>
            )}

            {/* Simple instruction: "فقط شروع کن." */}
            <div className="p-3.5 rounded-lg bg-[#0e0f13] border border-white/[0.05] flex items-center justify-between text-xs">
              <span className="text-[#9CA0A6]">دستورالعمل اجرا:</span>
              <span className="font-semibold text-white font-mono text-xs tracking-wide">
                «بدون کمال‌گرایی، فقط شروع کن.»
              </span>
            </div>

            {/* Completion Notification Banner */}
            {isCompleted && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-right space-y-1 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>این اقدام با موفقیت ثبت شد.</span>
                </div>
                <p className="text-xs text-[#9CA0A6] pr-6">
                  یک قدم کوچک، اما پایدار به جلو.
                </p>
              </div>
            )}

            {/* Action CTA Buttons */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
              {isCompleted ? (
                <>
                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsReportModalOpen(true)}
                      className="btn-forward-secondary py-2 px-3.5 text-xs w-full sm:w-auto gap-1.5"
                    >
                      <PenLine className="w-3.5 h-3.5 text-[#B5122B]" />
                      <span>ثبت گزارش تجربه</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/growth-path')}
                      className="btn-forward-secondary py-2 px-3.5 text-xs w-full sm:w-auto gap-1.5"
                    >
                      <span>مشاهده نقشه مسیر</span>
                      <ArrowLeft className="w-3.5 h-3.5 text-[#B5122B]" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="btn-forward-secondary py-2 px-5 text-xs text-emerald-300 border-emerald-500/25 w-full sm:w-auto gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>بازگشت به مرکز فرمان</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#9CA0A6]">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="hover:text-white transition-colors cursor-pointer py-1.5"
                    >
                      بعداً انجام می‌دهم
                    </button>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSkipAction}
                      className="hover:text-[#E85D6F] transition-colors cursor-pointer py-1.5 disabled:opacity-50"
                    >
                      رد کردن این اقدام
                    </button>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => setIsReportModalOpen(true)}
                      className="hover:text-white transition-colors cursor-pointer py-1.5 flex items-center gap-1"
                    >
                      <PenLine className="w-3 h-3 text-[#B5122B]" />
                      <span>ثبت گزارش</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleCompleteAction}
                    className="btn-forward-primary py-2.5 px-7 text-xs sm:text-sm font-medium gap-2 w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>در حال ثبت...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>ثبت انجام اقدام</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Action Report Modal */}
      {todayAction && (
        <ActionReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          actionId={todayAction.action.id}
          actionTitle={todayAction.action.title}
          pathSlug={todayAction.pathSlug || 'discipline'}
          stageOrder={todayAction.stageOrder || 1}
        />
      )}

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center py-4 text-[11px] text-[#5C6068]">
        NEXT YOU · گام‌های کوچک، تحول بزرگ
      </footer>
    </div>
  );
};
