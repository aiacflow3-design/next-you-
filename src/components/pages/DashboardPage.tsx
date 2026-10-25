import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
  Play,
  Target,
  ChevronLeft,
  PenLine,
  Calendar,
  Bell,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthenticatedNav } from '../navigation/AuthenticatedNav';
import { DashboardDataView } from '../../lib/domain/dashboard.entity';
import { ActionReportModal } from '../reports/ActionReportModal';

export const DashboardPage: React.FC = () => {
  const { user, navigate, authFetch } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardDataView | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isReminderDismissed, setIsReminderDismissed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadDashboard = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await authFetch('/api/dashboard');

      if (res.status === 401) {
        navigate('/login');
        return;
      }

      const result = await res.json();

      // Redirect check for new users
      if (!result.success) {
        if (result.needsOnboarding) {
          navigate('/onboarding');
          return;
        }
        if (result.needsAssessment) {
          navigate('/assessment/initial');
          return;
        }
        if (result.redirectTo) {
          navigate(result.redirectTo);
          return;
        }
        setErrorMsg(result.error || 'خطا در دریافت اطلاعات داشبورد.');
        return;
      }

      if (result.data) {
        setDashboardData(result.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setErrorMsg('خطا در برقراری ارتباط با سرور.');
    } finally {
      setIsLoading(false);
    }
  }, [authFetch, navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col items-center justify-center p-6 select-none"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#B5122B] animate-spin" />
          <span className="text-xs text-[#9CA0A6] font-mono tracking-wider">
            در حال برقراری ارتباط با مرکز فرمان...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (errorMsg || !dashboardData) {
    return (
      <div
        className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col items-center justify-center p-6 select-none"
        dir="rtl"
      >
        <div className="action-focus-plate rounded-2xl p-7 max-w-md w-full text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-[#B5122B] mx-auto flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">خطا در بارگذاری داشبورد</h2>
          <p className="text-xs text-[#9CA0A6] leading-relaxed">{errorMsg}</p>
          <button
            type="button"
            onClick={loadDashboard}
            className="w-full py-2.5 px-4 rounded-lg btn-forward-primary text-xs font-semibold cursor-pointer"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  const { greeting, path, currentStage, todayAction, progress, nextStep, latestReport, weeklyReflection, reminderStatus } = dashboardData;

  return (
    <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
      {/* Authenticated Global Navigation */}
      <AuthenticatedNav activeSection="dashboard" />

      {/* Main Command Center Layout (Open Architectural Space) */}
      <main className="max-w-3xl mx-auto w-full my-auto py-8 sm:py-12 text-right" dir="rtl">
        <div className="space-y-8 animate-fadeIn">
          
          {/* ==================================================
              1. GREETING & AMBIENT STATUS (Section 3 & 9)
             ================================================== */}
          <section className="space-y-2 border-b border-white/[0.05] pb-5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="typography-h1 text-white">
                {greeting.title}
              </h1>

              {/* Subtle Reminder Status text */}
              {reminderStatus && (
                <div className="flex items-center gap-2 text-xs text-[#9CA0A6]">
                  <span className={`w-1.5 h-1.5 rounded-full ${reminderStatus.enabled ? 'bg-[#B5122B]' : 'bg-white/20'}`} />
                  <span>
                    {reminderStatus.enabled
                      ? `یادآوری ساعت ${reminderStatus.preferredTime}`
                      : 'یادآوری‌ها خاموش'}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    className="text-[#9CA0A6] hover:text-white transition-colors cursor-pointer mr-1 underline underline-offset-4 text-[11px]"
                  >
                    تنظیمات
                  </button>
                </div>
              )}
            </div>

            <p className="typography-body-sm text-[#9CA0A6]">
              {greeting.contextLine}
            </p>
          </section>

          {/* Contextual Reminder Opportunity (Subtle & Dignified) */}
          {reminderStatus?.hasReminder && reminderStatus?.message && !isReminderDismissed && (
            <div className="p-3.5 sm:p-4 rounded-xl border border-white/[0.08] bg-[#101115]/80 flex items-center justify-between gap-3 text-xs transition-all">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#B5122B] beacon-indicator shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-[#E8E8E6] font-medium">{reminderStatus.message}</p>
                  <p className="text-[11px] text-[#5C6068]">
                    {reminderStatus.type === 'DAILY_ACTION' ? 'اقدام امروز در انتظار انجام است' : 'مرور مسیر هفتگی'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {reminderStatus.type === 'DAILY_ACTION' && !todayAction?.isCompletedToday && (
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/action')}
                    className="btn-forward-primary py-1.5 px-3 text-xs"
                  >
                    انجام اقدام
                  </button>
                )}
                {reminderStatus.type === 'WEEKLY_REFLECTION' && (
                  <button
                    type="button"
                    onClick={() => navigate('/reflection/weekly')}
                    className="btn-forward-secondary py-1.5 px-3 text-xs"
                  >
                    مرور هفته
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsReminderDismissed(true)}
                  className="p-1 text-[#5C6068] hover:text-white transition-colors cursor-pointer"
                  title="بستن"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              2. WHERE AM I? (CURRENT PATH & STAGE HORIZON)
             ================================================== */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#9CA0A6]">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{path.title}</span>
                <span aria-hidden="true">·</span>
                <span>{currentStage.stageLabel}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/growth-path')}
                className="text-[#9CA0A6] hover:text-white flex items-center gap-1 cursor-pointer transition-colors text-xs"
              >
                <span>مشاهده نقشه مسیر</span>
                <ChevronLeft className="w-3.5 h-3.5 text-[#B5122B]" />
              </button>
            </div>

            {/* Subtle Progress Horizon Line */}
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-[#B5122B] to-[#7D0E1F] transition-all duration-700 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#5C6068]">
              <span>{currentStage.stageProgressLabel}</span>
              <span className="font-mono">{progress.percent}٪ از کل مسیر</span>
            </div>
          </section>

          {/* ==================================================
              3. TODAY'S ACTION — DOMINANT FOCAL POINT (Section 9 & 10)
             ================================================== */}
          <section className="action-focus-plate rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B5122B] beacon-indicator" />
                <span className="text-xs font-semibold tracking-wider text-white">
                  اقدام امروز
                </span>
              </div>

              {todayAction?.isCompletedToday ? (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>انجام شد ✓</span>
                </span>
              ) : (
                <span className="text-[11px] font-mono text-[#9CA0A6] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#B5122B]" />
                  <span>{todayAction?.action.estimatedMinutes || 10} دقیقه تمرکز</span>
                </span>
              )}
            </div>

            {todayAction ? (
              <div className="space-y-4">
                <div>
                  <h2 className="typography-h2 font-semibold text-white">
                    {todayAction.action.title}
                  </h2>
                  <p className="typography-body text-[#C7C9CC] mt-2 leading-relaxed">
                    {todayAction.action.description}
                  </p>
                </div>

                {todayAction.whyThisMatters && (
                  <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs text-[#9CA0A6] space-y-1">
                    <span className="text-white font-medium block">چرایی این اقدام:</span>
                    <p className="leading-relaxed">{todayAction.whyThisMatters}</p>
                  </div>
                )}

                {todayAction.personalizationReason && (
                  <div className="text-xs text-[#E85D6F] flex items-center gap-2 pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B5122B]" />
                    <span>{todayAction.personalizationReason}</span>
                  </div>
                )}

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.05]">
                  <span className="text-[11px] text-[#5C6068]">
                    {todayAction.isCompletedToday
                      ? 'امروز گام خود را با موفقیت برداشتی.'
                      : 'فقط ۱۰ تا ۱۵ دقیقه بدون وقفه شروع کن.'}
                  </span>

                  {todayAction.isCompletedToday ? (
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
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/action')}
                      className="btn-forward-primary py-2.5 px-6 text-sm w-full sm:w-auto gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>شروع اقدام</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-[#9CA0A6]">
                در حال حاضر اقدامی در نوبت نیست.
              </div>
            )}
          </section>

          {/* ==================================================
              4. WHAT HAS CHANGED? (RECENT MEMORY & REPORT)
             ================================================== */}
          <section className="space-y-4 pt-1">
            <div className="flex items-center justify-between text-xs text-[#9CA0A6] border-b border-white/[0.04] pb-2">
              <span className="font-medium text-white">آخرین تجارب و تحولات</span>
              <button
                type="button"
                onClick={() => navigate('/reports')}
                className="hover:text-white transition-colors cursor-pointer text-xs"
              >
                مشاهده همه گزارش‌ها
              </button>
            </div>

            {/* Latest Report Highlight (If available) */}
            {latestReport ? (
              <div
                onClick={() => navigate('/reports')}
                className="p-4 rounded-xl architectural-plate hover:border-white/[0.14] cursor-pointer space-y-2 transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-[#5C6068]">
                  <span className="text-[#9CA0A6]">گزارش اقدام «{latestReport.actionTitle}»</span>
                  <span className="font-mono">{latestReport.dateLabel}</span>
                </div>
                {latestReport.textPreview && (
                  <p className="text-xs text-[#C7C9CC] leading-relaxed line-clamp-2">
                    «{latestReport.textPreview}»
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-lg border border-white/[0.03] text-xs text-[#5C6068]">
                هنوز گزارشی ثبت نشده است. پس از انجام هر اقدام، ثبت چند جمله به تثبیت تجربه کمک می‌کند.
              </div>
            )}

            {/* Recent Completed Activities List */}
            {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] text-[#5C6068] block">اقدامات تکمیل‌شده اخیر:</span>
                <div className="space-y-1.5">
                  {dashboardData.recentActivities.slice(0, 3).map((act) => (
                    <div
                      key={act.id}
                      className="py-1.5 px-3 rounded-lg bg-white/[0.015] flex items-center justify-between text-xs text-[#9CA0A6]"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-white/90">{act.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#5C6068]">{act.dateLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ==================================================
              5. WHAT COMES NEXT? (NEXT STEP HORIZON & REFLECTION)
             ================================================== */}
          <section className="space-y-3 pt-2">
            <span className="text-xs font-medium text-white block">قدم بعدی مسیر</span>

            <div className="p-4 rounded-xl architectural-plate flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 text-center sm:text-right">
                <span className="text-white font-medium block">{nextStep.label}</span>
                {nextStep.reason && (
                  <p className="text-[11px] text-[#9CA0A6]">{nextStep.reason}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate(nextStep.actionPath)}
                className="btn-forward-secondary py-2 px-4 text-xs whitespace-nowrap"
              >
                <span>{nextStep.actionText}</span>
                <ArrowLeft className="w-3.5 h-3.5 text-[#B5122B]" />
              </button>
            </div>

            {/* Weekly Reflection Status (Quiet Whisper) */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.01] text-xs text-[#5C6068]">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#B5122B]" />
                <span>مرور هفته جاری: {weeklyReflection?.isCompleted ? 'ثبت شده ✓' : 'چند دقیقه برای درنگ'}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/reflection/weekly')}
                className="text-[#9CA0A6] hover:text-white transition-colors cursor-pointer text-xs"
              >
                {weeklyReflection?.isCompleted ? 'مشاهده بازبینی' : 'ثبت مرور هفته'}
              </button>
            </div>
          </section>

        </div>
      </main>

      {/* Action Report Modal */}
      {todayAction && (
        <ActionReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onReportSaved={() => {
            loadDashboard();
            setIsReportModalOpen(false);
          }}
          actionId={todayAction.action.id}
          actionTitle={todayAction.action.title}
          stageOrder={todayAction.stageOrder}
          pathSlug={todayAction.pathSlug}
        />
      )}

      {/* Minimal Footer */}
      <footer className="max-w-3xl mx-auto w-full text-center py-4 text-[11px] text-[#5C6068]">
        NEXT YOU · مرکز فرمان رشد شخصی
      </footer>
    </div>
  );
};
