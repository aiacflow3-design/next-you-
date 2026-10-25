import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Compass,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Calendar,
  Loader2,
  AlertCircle,
  Clock,
  Target,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthenticatedNav } from '../navigation/AuthenticatedNav';
import { ProgressOverviewView } from '../../lib/domain/progress.entity';

export const ProgressPage: React.FC = () => {
  const { user, navigate, authFetch } = useAuth();
  const [overview, setOverview] = useState<ProgressOverviewView | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await authFetch('/api/progress');
      if (res.status === 401) {
        navigate('/login');
        return;
      }

      const result = await res.json();
      if (!result.success) {
        if (result.redirectTo) {
          navigate(result.redirectTo);
          return;
        }
        setErrorMsg(result.error || 'خطا در دریافت اطلاعات پیشرفت.');
        return;
      }

      if (result.data) {
        setOverview(result.data);
      }
    } catch (err) {
      console.error('Error fetching progress overview:', err);
      setErrorMsg('خطا در برقراری ارتباط با سرور.');
    } finally {
      setIsLoading(false);
    }
  }, [authFetch, navigate]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
        <AuthenticatedNav activeSection="progress" />
        <div className="my-auto flex flex-col items-center justify-center gap-3 py-24" dir="rtl">
          <Loader2 className="w-8 h-8 text-[#B5122B] animate-spin" />
          <p className="text-xs text-[#9CA0A6] font-mono tracking-wider">
            در حال فراخوانی دفتر پیشرفت...
          </p>
        </div>
      </div>
    );
  }

  if (errorMsg && !overview) {
    return (
      <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
        <AuthenticatedNav activeSection="progress" />
        <div className="my-auto max-w-md mx-auto w-full py-16 text-center" dir="rtl">
          <div className="action-focus-plate rounded-2xl p-7 text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-[#B5122B] mx-auto flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">خطا در بارگذاری پیشرفت</h2>
            <p className="text-xs text-[#9CA0A6] leading-relaxed">{errorMsg}</p>
            <button
              type="button"
              onClick={fetchProgress}
              className="btn-forward-primary w-full py-2.5 px-4 text-xs font-semibold"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!overview) return null;

  const {
    pathTitle,
    overallPathProgress,
    totalPathActionsCount,
    completedPathActionsCount,
    currentStage,
    activitySummary,
    actionHistory,
    recentActivity,
    nextStep,
    isEmpty,
  } = overview;

  return (
    <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
      <AuthenticatedNav activeSection="progress" />

      {/* Main Editorial Progress Stream */}
      <main className="max-w-3xl mx-auto w-full my-auto py-8 sm:py-12 space-y-8" dir="rtl">
        {/* 1. HEADER */}
        <section className="space-y-1.5 border-b border-white/[0.05] pb-5">
          <div className="flex items-center gap-2 text-xs text-[#9CA0A6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5122B] beacon-indicator" />
            <span className="font-mono text-[11px] uppercase tracking-wider">
              سوابق حرکت رو به جلو
            </span>
          </div>
          <h1 className="typography-h1 text-white">
            پیشرفت و پایداری
          </h1>
          <p className="typography-body-sm text-[#9CA0A6]">
            رشد پایدار از تجمیع گام‌های واقعی روزانه شکل می‌گیرد.
          </p>
        </section>

        {/* 2. OVERALL PATH HORIZON METRICS */}
        <section className="action-focus-plate rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div className="space-y-1">
              <span className="text-xs text-[#9CA0A6]">مسیر فعال</span>
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#B5122B]" />
                <span>{pathTitle}</span>
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[11px] text-[#9CA0A6] block">پیشرفت مرحله</span>
                <span className="font-mono text-base font-semibold text-white">
                  {currentStage.stageProgressPercent}٪
                </span>
              </div>
              <div className="h-7 w-px bg-white/[0.08]" />
              <div className="text-right">
                <span className="text-[11px] text-[#9CA0A6] block">پیشرفت کل مسیر</span>
                <span className="font-mono text-base font-semibold text-[#B5122B]">
                  {overallPathProgress}٪
                </span>
              </div>
            </div>
          </div>

          {/* Minimal Path Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] font-mono text-[#9CA0A6]">
              <span>مرحله فعلی: {currentStage.stageTitle}</span>
              <span>
                {completedPathActionsCount} از {totalPathActionsCount} اقدام کل مسیر
              </span>
            </div>
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-[#B5122B] to-[#7D0E1F] transition-all duration-700 ease-out"
                style={{ width: `${overallPathProgress}%` }}
              />
            </div>
          </div>
        </section>

        {/* 3. CURRENT STAGE PROGRESSION */}
        <section className="p-5 sm:p-6 rounded-2xl architectural-plate space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#9CA0A6] mb-1">
                <span className="font-mono text-[#E85D6F]">مرحله {currentStage.stageOrder}</span>
                <span aria-hidden="true">·</span>
                <span>{currentStage.stageSubtitle}</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {currentStage.stageTitle}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => navigate('/growth-path')}
              className="btn-forward-secondary py-2 px-3.5 text-xs self-start sm:self-auto gap-1.5"
            >
              <span>مشاهده نقشه مسیر</span>
              <ChevronLeft className="w-3.5 h-3.5 text-[#B5122B]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[#9CA0A6] block text-[11px]">اقدامات انجام‌شده</span>
              <span className="text-sm font-mono font-medium text-white mt-0.5 block">
                {currentStage.completedRequiredActions} از {currentStage.totalRequiredActions}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[#9CA0A6] block text-[11px]">گام‌های پیش‌رو</span>
              <span className="text-sm font-mono font-medium text-[#C7C9CC] mt-0.5 block">
                {currentStage.remainingRequiredActions} اقدام تا پایان مرحله
              </span>
            </div>
          </div>
        </section>

        {/* 4. ACTIVITY SUMMARY (Unboxed Metrics) */}
        <section className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl architectural-plate text-right space-y-1">
            <span className="text-[11px] text-[#9CA0A6] block">اقدامات انجام‌شده</span>
            <span className="text-xl font-mono font-medium text-emerald-400 block">
              {activitySummary.completedActionsCount}
            </span>
          </div>

          <div className="p-4 rounded-xl architectural-plate text-right space-y-1">
            <span className="text-[11px] text-[#9CA0A6] block">اقدامات ردشده</span>
            <span className="text-xl font-mono font-medium text-[#5C6068] block">
              {activitySummary.skippedActionsCount}
            </span>
          </div>

          <div className="p-4 rounded-xl architectural-plate text-right space-y-1">
            <span className="text-[11px] text-[#9CA0A6] block">آخرین فعالیت</span>
            <span className="text-xs sm:text-sm font-medium text-white block truncate">
              {activitySummary.lastActivityDateLabel}
            </span>
          </div>
        </section>

        {/* 5. RECENT ACTIVITY STREAM */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#9CA0A6] border-b border-white/[0.04] pb-2">
            <span className="font-medium text-white flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#B5122B]" />
              <span>وقایع ثبت‌شده اخیر</span>
            </span>
            <span className="font-mono text-[11px]">روزشمار حرکت</span>
          </div>

          {recentActivity.length === 0 ? (
            <div className="p-6 text-center border border-white/[0.04] rounded-xl space-y-1">
              <span className="text-xs text-[#9CA0A6] block">هنوز فعالیتی ثبت نشده است.</span>
              <p className="text-[11px] text-[#5C6068]">
                با انجام اولین اقدام، سوابق شما در این بخش مرتب می‌گردد.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {recentActivity.map((item) => (
                <div key={item.id} className="py-2.5 px-3.5 rounded-lg bg-white/[0.015] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    {item.status === 'DONE' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#5C6068] shrink-0" />
                    )}
                    <div>
                      <span className="font-medium text-white block">{item.actionTitle}</span>
                      <span className="text-[10px] text-[#9CA0A6]">{item.stageTitle}</span>
                    </div>
                  </div>

                  <div className="text-left shrink-0 text-xs">
                    <span className="text-[11px] font-mono text-[#9CA0A6] block">{item.dateLabel}</span>
                    <span
                      className={`text-[10px] font-mono ${
                        item.status === 'DONE' ? 'text-emerald-400' : 'text-[#5C6068]'
                      }`}
                    >
                      {item.statusLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. CHRONOLOGICAL ACTION HISTORY */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#9CA0A6] border-b border-white/[0.04] pb-2">
            <span className="font-medium text-white flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#B5122B]" />
              <span>تاریخچه کامل اقدامات</span>
            </span>
            <span className="font-mono text-[11px]">
              {actionHistory.length} رکورد
            </span>
          </div>

          {isEmpty ? (
            <div className="p-8 text-center border border-white/[0.04] rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] text-[#B5122B] mx-auto flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-white">هنوز قدمی ثبت نشده است.</h4>
                <p className="text-xs text-[#9CA0A6]">
                  با اولین اقدام، مسیر پیشرفت تو شکل می‌گیرد.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard/action')}
                className="btn-forward-primary py-2 px-4 text-xs font-medium"
              >
                <span>شروع اولین اقدام</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {actionHistory.map((record) => {
                const isDone = record.status === 'DONE';

                return (
                  <div
                    key={record.id}
                    className="p-3.5 rounded-lg bg-white/[0.015] border border-white/[0.03] hover:border-white/[0.08] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isDone ? 'bg-emerald-400' : 'bg-[#5C6068]'
                          }`}
                        />
                        <span className="font-medium text-white">
                          {record.actionTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#9CA0A6] pr-3.5 block">
                        مرحله {record.stageTitle}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-left">
                      <span className="text-[11px] font-mono text-[#9CA0A6]">
                        {record.dateLabel} ({record.date})
                      </span>
                      <span
                        className={`text-[11px] font-mono ${
                          isDone ? 'text-emerald-400' : 'text-[#5C6068]'
                        }`}
                      >
                        · {isDone ? 'انجام شد' : 'رد شد'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 7. NEXT STEP HORIZON */}
        <section className="p-5 sm:p-6 rounded-2xl architectural-plate flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5 text-center sm:text-right">
            <span className="text-[10px] font-mono text-[#E85D6F] uppercase tracking-wider block">
              قدم بعدی مسیر
            </span>
            <h3 className="text-base font-semibold text-white">{nextStep.title}</h3>
            <p className="text-xs text-[#9CA0A6] max-w-lg leading-relaxed">{nextStep.description}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate(nextStep.ctaPath)}
            className="btn-forward-primary py-2.5 px-5 text-xs whitespace-nowrap gap-1.5"
          >
            <span>{nextStep.ctaLabel}</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto w-full text-center py-4 text-[11px] text-[#5C6068] select-none">
        NEXT YOU · شناخت · مسیر · اقدام · پیشرفت
      </footer>
    </div>
  );
};
