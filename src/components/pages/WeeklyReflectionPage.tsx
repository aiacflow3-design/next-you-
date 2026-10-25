import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  PenLine,
  History,
  Target,
  ChevronDown,
  ChevronUp,
  X,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthenticatedNav } from '../navigation/AuthenticatedNav';
import {
  WeeklyReflectionView,
  WeeklyReflection,
} from '../../lib/domain/weekly-reflection.entity';
import { ActionReport } from '../../lib/domain/action-report.entity';

export const WeeklyReflectionPage: React.FC = () => {
  const { user, navigate, authFetch } = useAuth();
  const [data, setData] = useState<WeeklyReflectionView | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [whatWentWell, setWhatWentWell] = useState('');
  const [whatWasDifficult, setWhatWasDifficult] = useState('');
  const [whatILearned, setWhatILearned] = useState('');
  const [nextWeekFocus, setNextWeekFocus] = useState('');

  // Selected past reflection modal
  const [selectedPastReflection, setSelectedPastReflection] = useState<WeeklyReflection | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const loadWeeklyData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await authFetch('/api/reflection/weekly');
      if (res.status === 401) {
        navigate('/login');
        return;
      }

      const result = await res.json();
      if (res.ok && result.success && result.data) {
        setData(result.data);
        if (result.data.currentReflection) {
          setWhatWentWell(result.data.currentReflection.whatWentWell || '');
          setWhatWasDifficult(result.data.currentReflection.whatWasDifficult || '');
          setWhatILearned(result.data.currentReflection.whatILearned || '');
          setNextWeekFocus(result.data.currentReflection.nextWeekFocus || '');
        }
      } else {
        setErrorMsg(result.error || 'خطا در بارگذاری اطلاعات مرور هفتگی.');
      }
    } catch (err) {
      console.error('Failed to load weekly reflection data:', err);
      setErrorMsg('خطای اتصال به سرور.');
    } finally {
      setIsLoading(false);
    }
  }, [authFetch, navigate]);

  useEffect(() => {
    loadWeeklyData();
  }, [loadWeeklyData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !data) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await authFetch('/api/reflection/weekly', {
        method: 'POST',
        body: JSON.stringify({
          weekStart: data.currentWeek.weekStart,
          weekEnd: data.currentWeek.weekEnd,
          whatWentWell,
          whatWasDifficult,
          whatILearned,
          nextWeekFocus,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setSuccessMsg('مرور این هفته با موفقیت ثبت شد.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setErrorMsg(result.error || 'خطا در ثبت مرور هفتگی.');
      }
    } catch (err) {
      console.error('Save reflection failed:', err);
      setErrorMsg('خطای شبکه در ذخیره‌سازی.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 select-none relative"
      dir="rtl"
    >
      {/* Navigation */}
      <AuthenticatedNav activeSection="dashboard" />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto w-full my-auto py-8 sm:py-12 text-right">
        <div className="space-y-7 animate-fadeIn">
          {/* Header */}
          <section className="text-center space-y-2">
            <span className="typography-label text-[#B5122B] uppercase inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5122B]/10 border border-[#B5122B]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مکث و مرور هفتگی</span>
            </span>

            <h1 className="typography-h1">
              مرور این هفته
            </h1>

            <p className="typography-body-sm text-[#85878C] max-w-md mx-auto">
              چند دقیقه به مسیرت برگرد. ببین چه کردی، چه یاد گرفتی و قدم بعدی چیست.
            </p>
          </section>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[#E85D6F] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-6 h-6 text-[#B5122B] animate-spin mx-auto" />
              <p className="text-xs text-[#85878C]">در حال محاسبه اطلاعات هفته...</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* ==================================================
                  Section 1: Factual Weekly Summary (Requirement 4)
                 ================================================== */}
              <section className="luxury-glass-card rounded-2xl p-5 border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B5122B]" />
                    <span>خلاصه واقعی این هفته</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#85878C]">
                    {data.summary.weekLabel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center pt-1">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                    <span className="text-lg font-bold text-white font-mono">
                      {data.summary.completedActionsCount}
                    </span>
                    <span className="text-[11px] text-[#85878C] block">اقدام انجام‌شده</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                    <span className="text-lg font-bold text-white font-mono">
                      {data.summary.reportsCount}
                    </span>
                    <span className="text-[11px] text-[#85878C] block">گزارش ثبت‌شده</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                    <span className="text-xs font-bold text-[#E85D6F] block truncate">
                      {data.summary.currentStageTitle}
                    </span>
                    <span className="text-[11px] text-[#85878C] block">مرحله فعلی</span>
                  </div>
                </div>
              </section>

              {/* ==================================================
                  Section 2: Reports from this week (Requirement 6)
                 ================================================== */}
              {data.weekReports && data.weekReports.length > 0 && (
                <section className="luxury-glass-card rounded-2xl p-5 border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <PenLine className="w-3.5 h-3.5 text-[#B5122B]" />
                      <span>تجربه‌های ثبت‌شده در این هفته ({data.weekReports.length})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/reports')}
                      className="text-xs text-[#85878C] hover:text-white transition-colors cursor-pointer"
                    >
                      دفترچه کامل
                    </button>
                  </div>

                  <div className="space-y-2">
                    {data.weekReports.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium truncate">{rep.actionTitle}</span>
                            <span className="text-[10px] font-mono text-[#85878C]">({rep.dateLabel})</span>
                          </div>
                          {rep.text && (
                            <p className="text-[11px] text-[#85878C] truncate max-w-sm">
                              {rep.text}
                            </p>
                          )}
                        </div>

                        {rep.images && rep.images.length > 0 && (
                          <div className="w-8 h-6 rounded overflow-hidden border border-white/10 shrink-0">
                            <img src={rep.images[0].imageUrl} alt="ضمیمه" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ==================================================
                  Section 3: Reflection Form (Requirement 5)
                 ================================================== */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Question 1 */}
                <div className="space-y-1.5">
                  <label htmlFor="q1-well" className="block text-xs font-medium text-[#C7C9CC]">
                    ۱. این هفته چه چیزی برایت خوب پیش رفت؟
                  </label>
                  <textarea
                    id="q1-well"
                    rows={2}
                    value={whatWentWell}
                    onChange={(e) => setWhatWentWell(e.target.value)}
                    placeholder="مثلاً: شروع سریع کارها در صبح، بستن نوتیفیکیشن‌ها..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f1013] border border-white/[0.08] focus:border-[#B5122B]/60 focus:outline-none text-xs text-[#E8E8E6] placeholder-[#85878C]/40 leading-relaxed resize-none transition-all"
                  />
                </div>

                {/* Question 2 */}
                <div className="space-y-1.5">
                  <label htmlFor="q2-difficult" className="block text-xs font-medium text-[#C7C9CC]">
                    ۲. چه چیزی سخت‌تر از چیزی بود که فکر می‌کردی؟
                  </label>
                  <textarea
                    id="q2-difficult"
                    rows={2}
                    value={whatWasDifficult}
                    onChange={(e) => setWhatWasDifficult(e.target.value)}
                    placeholder="مثلاً: خستگی عصرگاهی، وسوسه چندکاری همزمان..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f1013] border border-white/[0.08] focus:border-[#B5122B]/60 focus:outline-none text-xs text-[#E8E8E6] placeholder-[#85878C]/40 leading-relaxed resize-none transition-all"
                  />
                </div>

                {/* Question 3 */}
                <div className="space-y-1.5">
                  <label htmlFor="q3-learned" className="block text-xs font-medium text-[#C7C9CC]">
                    ۳. از این هفته چه چیزی یاد گرفتی؟
                  </label>
                  <textarea
                    id="q3-learned"
                    rows={2}
                    value={whatILearned}
                    onChange={(e) => setWhatILearned(e.target.value)}
                    placeholder="مثلاً: اگر شروع کنم، انگیزه در حین مسیر ایجاد می‌شود..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f1013] border border-white/[0.08] focus:border-[#B5122B]/60 focus:outline-none text-xs text-[#E8E8E6] placeholder-[#85878C]/40 leading-relaxed resize-none transition-all"
                  />
                </div>

                {/* Question 4 */}
                <div className="space-y-1.5">
                  <label htmlFor="q4-focus" className="block text-xs font-medium text-[#C7C9CC]">
                    ۴. هفته بعد می‌خواهی روی چه چیزی تمرکز کنی؟
                  </label>
                  <textarea
                    id="q4-focus"
                    rows={2}
                    value={nextWeekFocus}
                    onChange={(e) => setNextWeekFocus(e.target.value)}
                    placeholder="مثلاً: تثبیت گام ۱۰ دقیقه‌ای در ساعت ۹ صبح..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f1013] border border-white/[0.08] focus:border-[#B5122B]/60 focus:outline-none text-xs text-[#E8E8E6] placeholder-[#85878C]/40 leading-relaxed resize-none transition-all"
                  />
                </div>

                {/* CTA Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-full sm:w-auto text-xs text-[#85878C] hover:text-white transition-colors cursor-pointer py-2 text-center"
                  >
                    بعداً انجام می‌دهم
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#B5122B] hover:bg-[#c91833] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(181,18,43,0.35)] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>در حال ثبت مرور...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ثبت مرور هفته</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* ==================================================
                  Section 4: History of Past Reflections (Requirement 12)
                 ================================================== */}
              {data.previousReflections && data.previousReflections.length > 0 && (
                <section className="pt-6 border-t border-white/[0.06] space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full flex items-center justify-between text-xs text-[#85878C] hover:text-white transition-colors cursor-pointer p-2 rounded-xl hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-[#B5122B]" />
                      <span>مرورهای قبلی ({data.previousReflections.length})</span>
                    </div>
                    {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showHistory && (
                    <div className="space-y-2.5 animate-fadeIn">
                      {data.previousReflections.map((ref) => (
                        <div
                          key={ref.id}
                          onClick={() => setSelectedPastReflection(ref)}
                          className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-all cursor-pointer group flex items-center justify-between text-xs"
                        >
                          <div className="space-y-1 min-w-0 text-right">
                            <span className="text-white font-medium block">
                              هفته {ref.weekLabel}
                            </span>
                            {ref.nextWeekFocus && (
                              <p className="text-[11px] text-[#85878C] truncate max-w-md">
                                تمرکز: {ref.nextWeekFocus}
                              </p>
                            )}
                          </div>
                          <span className="text-[11px] text-[#85878C] group-hover:text-white transition-colors flex items-center gap-1 shrink-0">
                            <span>مشاهده</span>
                            <ArrowLeft className="w-3 h-3 text-[#B5122B]" />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>
          ) : null}
        </div>
      </main>

      {/* ==================================================
          Past Reflection Modal View
         ================================================== */}
      {selectedPastReflection && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0f1013] border border-white/[0.08] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
              <div>
                <span className="text-[10px] font-mono text-[#E85D6F]">مرور گذشته</span>
                <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                  هفته {selectedPastReflection.weekLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPastReflection(null)}
                aria-label="بستن پنجره"
                className="p-1.5 rounded-lg text-[#85878C] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-right text-xs">
              {selectedPastReflection.whatWentWell && (
                <div className="space-y-1">
                  <span className="text-[#85878C] font-medium">خوب پیش رفت:</span>
                  <p className="text-white p-3 rounded-xl bg-black/40 border border-white/[0.04] leading-relaxed">
                    {selectedPastReflection.whatWentWell}
                  </p>
                </div>
              )}

              {selectedPastReflection.whatWasDifficult && (
                <div className="space-y-1">
                  <span className="text-[#85878C] font-medium">سخت بود:</span>
                  <p className="text-white p-3 rounded-xl bg-black/40 border border-white/[0.04] leading-relaxed">
                    {selectedPastReflection.whatWasDifficult}
                  </p>
                </div>
              )}

              {selectedPastReflection.whatILearned && (
                <div className="space-y-1">
                  <span className="text-[#85878C] font-medium">یاد گرفتم:</span>
                  <p className="text-white p-3 rounded-xl bg-black/40 border border-white/[0.04] leading-relaxed">
                    {selectedPastReflection.whatILearned}
                  </p>
                </div>
              )}

              {selectedPastReflection.nextWeekFocus && (
                <div className="space-y-1">
                  <span className="text-[#85878C] font-medium">تمرکز هفته بعد:</span>
                  <p className="text-white p-3 rounded-xl bg-black/40 border border-white/[0.04] leading-relaxed">
                    {selectedPastReflection.nextWeekFocus}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/[0.06] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPastReflection(null)}
                className="px-4 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs text-white"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center py-4 text-[11px] text-[#85878C]/60">
        NEXT YOU — مکث کوتاه، وضوح مسیر، حرکت پیوسته
      </footer>
    </div>
  );
};
