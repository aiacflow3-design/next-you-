import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  PenLine,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  Compass,
  X,
  Search,
  Filter,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthenticatedNav } from '../navigation/AuthenticatedNav';
import { ActionReport } from '../../lib/domain/action-report.entity';

type FilterType = 'all' | 'week' | 'month' | 'has_image';

export const ReportsPage: React.FC = () => {
  const { user, navigate, authFetch } = useAuth();
  const [reports, setReports] = useState<ActionReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Selected report for detail view or edit
  const [selectedReport, setSelectedReport] = useState<ActionReport | null>(null);
  const [editingReport, setEditingReport] = useState<ActionReport | null>(null);
  const [editText, setEditText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Deletion confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Lightbox / image zoom
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await authFetch('/api/reports');
      if (res.status === 401) {
        navigate('/login');
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setReports(data.reports || []);
      } else {
        setErrorMsg(data.error || 'خطا در بارگذاری گزارش‌ها.');
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
      setErrorMsg('خطای اتصال به سرور.');
    } finally {
      setIsLoading(false);
    }
  }, [authFetch, navigate]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Filtered & Searched Reports
  const filteredReports = useMemo(() => {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    return reports.filter((rep) => {
      // Filter tab
      if (activeFilter === 'week') {
        const createdTime = new Date(rep.createdAt).getTime();
        if (createdTime < oneWeekAgo) return false;
      } else if (activeFilter === 'month') {
        const createdTime = new Date(rep.createdAt).getTime();
        if (createdTime < oneMonthAgo) return false;
      } else if (activeFilter === 'has_image') {
        if (!rep.images || rep.images.length === 0) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const titleMatch = (rep.actionTitle || '').toLowerCase().includes(q);
        const textMatch = (rep.text || '').toLowerCase().includes(q);
        const stageMatch = (rep.stageTitle || '').toLowerCase().includes(q);
        if (!titleMatch && !textMatch && !stageMatch) return false;
      }

      return true;
    });
  }, [reports, activeFilter, searchQuery]);

  const handleStartEdit = (report: ActionReport, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingReport(report);
    setEditText(report.text);
  };

  const handleSaveEdit = async () => {
    if (!editingReport) return;
    setIsUpdating(true);

    try {
      const res = await authFetch(`/api/reports/${editingReport.id}`, {
        method: 'PUT',
        body: JSON.stringify({ text: editText }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.report) {
        setReports((prev) =>
          prev.map((r) => (r.id === editingReport.id ? data.report : r))
        );
        if (selectedReport?.id === editingReport.id) {
          setSelectedReport(data.report);
        }
        setEditingReport(null);
      } else {
        setErrorMsg(data.error || 'خطا در ذخیره تغییرات.');
      }
    } catch (err) {
      console.error('Update report error:', err);
      setErrorMsg('خطای اتصال در ویرایش گزارش.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await authFetch(`/api/reports/${deletingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== deletingId));
        if (selectedReport?.id === deletingId) {
          setSelectedReport(null);
        }
        setDeletingId(null);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'خطا در حذف گزارش.');
      }
    } catch (err) {
      console.error('Delete report error:', err);
      setErrorMsg('خطای شبکه در حذف گزارش.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 select-none relative"
      dir="rtl"
    >
      {/* Navigation */}
      <AuthenticatedNav activeSection="reports" />

      {/* Main Journal Container */}
      <main className="max-w-3xl mx-auto w-full my-auto py-8 sm:py-12 text-right">
        <div className="space-y-8 animate-fadeIn">
          {/* Header */}
          <section className="text-center space-y-2">
            <span className="typography-label text-[#B5122B] uppercase inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5122B]/10 border border-[#B5122B]/20">
              <PenLine className="w-3.5 h-3.5" />
              <span>حافظه و ردپای رشد</span>
            </span>

            <h1 className="typography-h1">
              گزارش‌های من
            </h1>

            <p className="typography-body-sm text-[#85878C] max-w-lg mx-auto">
              ردپای اقدام‌هایی که انجام داده‌ای. آنچه ثبت می‌کنی، به درک واقعی و آرامش ذهن در مسیر تبدیل می‌شود.
            </p>
          </section>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[#E85D6F] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Search & Filter Bar (Requirement 3 & 4) */}
          {!isLoading && reports.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#85878C] absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در متن یا عنوان اقدام..."
                  className="w-full pr-9 pl-3 py-2 rounded-xl bg-[#080808] border border-white/[0.08] focus:border-[#B5122B]/50 focus:outline-none text-xs text-[#E8E8E6] placeholder-[#85878C]/50 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#85878C] hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs shrink-0 ${
                    activeFilter === 'all'
                      ? 'bg-[#B5122B] text-white font-semibold shadow-[0_0_12px_rgba(181,18,43,0.3)]'
                      : 'bg-white/[0.03] text-[#85878C] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  همه ({reports.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('week')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs shrink-0 ${
                    activeFilter === 'week'
                      ? 'bg-[#B5122B] text-white font-semibold shadow-[0_0_12px_rgba(181,18,43,0.3)]'
                      : 'bg-white/[0.03] text-[#85878C] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  این هفته
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('month')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs shrink-0 ${
                    activeFilter === 'month'
                      ? 'bg-[#B5122B] text-white font-semibold shadow-[0_0_12px_rgba(181,18,43,0.3)]'
                      : 'bg-white/[0.03] text-[#85878C] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  این ماه
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('has_image')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs shrink-0 flex items-center gap-1 ${
                    activeFilter === 'has_image'
                      ? 'bg-[#B5122B] text-white font-semibold shadow-[0_0_12px_rgba(181,18,43,0.3)]'
                      : 'bg-white/[0.03] text-[#85878C] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>دارای تصویر</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-6 h-6 text-[#B5122B] animate-spin mx-auto" />
              <p className="text-xs text-[#85878C]">در حال بازیابی گزارش‌ها...</p>
            </div>
          )}

          {/* Empty State (Overall) */}
          {!isLoading && reports.length === 0 && (
            <div className="luxury-glass-card rounded-2xl p-8 sm:p-12 text-center space-y-4 border border-white/[0.06]">
              <div className="w-14 h-14 rounded-2xl bg-[#B5122B]/10 border border-[#B5122B]/25 flex items-center justify-center text-[#B5122B] mx-auto shadow-[0_0_30px_rgba(181,18,43,0.15)]">
                <PenLine className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">
                  هنوز گزارشی ثبت نکرده‌ای.
                </h3>
                <p className="text-xs text-[#85878C] max-w-sm mx-auto leading-relaxed">
                  بعد از انجام یک اقدام، می‌توانی تجربه‌ات را اینجا ثبت کنی تا ردپای واقعی تلاشت باقی بماند.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/action')}
                  className="px-6 py-2.5 rounded-xl bg-[#B5122B] hover:bg-[#c91833] text-white text-xs font-semibold cursor-pointer transition-all shadow-[0_0_20px_rgba(181,18,43,0.3)] inline-flex items-center gap-2"
                >
                  <span>مشاهده اقدام امروز</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Empty State (Filtered / Search Result 0) */}
          {!isLoading && reports.length > 0 && filteredReports.length === 0 && (
            <div className="p-8 text-center space-y-3 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
              <p className="text-xs text-[#85878C]">
                گزارشی با فیلتر یا جستجوی انتخابی یافت نشد.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs text-[#E85D6F] hover:text-white underline cursor-pointer"
              >
                پاک کردن فیلترها
              </button>
            </div>
          )}

          {/* Chronological Journal Timeline (Requirement 2) */}
          {!isLoading && filteredReports.length > 0 && (
            <div className="relative border-r border-white/[0.08] mr-2.5 sm:mr-3.5 pr-5 sm:pr-7 space-y-6">
              {filteredReports.map((report) => (
                <div key={report.id} className="relative group">
                  {/* Timeline Dot Node */}
                  <span className="absolute -right-[26px] sm:-right-[35px] top-6 w-3 h-3 rounded-full bg-[#080808] border-2 border-[#B5122B] shadow-[0_0_8px_rgba(181,18,43,0.6)] group-hover:scale-125 transition-transform" />

                  {/* Journal Card */}
                  <article
                    onClick={() => setSelectedReport(report)}
                    className="luxury-glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer space-y-3.5"
                  >
                    {/* Card Header: Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.04] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#E85D6F] px-2.5 py-0.5 rounded bg-[#B5122B]/10 border border-[#B5122B]/20">
                          {report.stageTitle}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {report.actionTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#85878C]">
                        <span>{report.dateLabel}</span>
                        {report.timeLabel && <span>• {report.timeLabel}</span>}
                      </div>
                    </div>

                    {/* Text Content Preview */}
                    {report.text && (
                      <p className="text-xs sm:text-sm text-[#C7C9CC] leading-relaxed whitespace-pre-line line-clamp-3">
                        {report.text}
                      </p>
                    )}

                    {/* Image Thumbnails if present */}
                    {report.images && report.images.length > 0 && (
                      <div className="flex items-center gap-2.5 pt-1 overflow-x-auto">
                        {report.images.map((img, idx) => (
                          <div
                            key={img.id || idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(img.imageUrl);
                            }}
                            className="w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden border border-white/10 bg-black/40 shrink-0 hover:border-[#B5122B]/50 transition-colors"
                          >
                            <img
                              src={img.imageUrl}
                              alt="تصویر ضمیمه گزارش"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions Footer */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#85878C]">
                      <span className="group-hover:text-white transition-colors flex items-center gap-1 font-medium">
                        <span>مشاهده و بازتاب</span>
                        <ArrowLeft className="w-3 h-3 text-[#B5122B]" />
                      </span>

                      <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => handleStartEdit(report, e)}
                          aria-label="ویرایش گزارش"
                          className="p-1.5 rounded-lg text-[#85878C] hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(report.id);
                          }}
                          aria-label="حذف گزارش"
                          className="p-1.5 rounded-lg text-[#85878C] hover:text-[#E85D6F] hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ==================================================
          Report Detail Modal (Requirement 5)
         ================================================== */}
      {selectedReport && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0f1013] border border-white/[0.08] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[88vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
              <div>
                <span className="text-[10px] font-mono text-[#E85D6F] uppercase tracking-wider block">
                  گزارش اقدام • مسیر {selectedReport.pathTitle || 'رشد'}
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                  «{selectedReport.actionTitle}»
                </h2>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#85878C] mt-1">
                  <span>مرحله: {selectedReport.stageTitle}</span>
                  <span>•</span>
                  <span>{selectedReport.dateLabel}</span>
                  {selectedReport.timeLabel && <span>({selectedReport.timeLabel})</span>}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                aria-label="بستن پنجره"
                className="p-1.5 rounded-lg text-[#85878C] hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-right">
              {/* Full Text */}
              {selectedReport.text ? (
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-[#85878C]">متن تجربه و یادداشت:</span>
                  <p className="text-xs sm:text-sm text-[#E8E8E6] leading-relaxed whitespace-pre-line p-4 rounded-xl bg-black/40 border border-white/[0.04]">
                    {selectedReport.text}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#85878C] italic">
                  یادداشت متنی برای این گزارش ثبت نشده است.
                </p>
              )}

              {/* Images */}
              {selectedReport.images && selectedReport.images.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-[#85878C]">تصاویر ضمیمه:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedReport.images.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        onClick={() => setPreviewImage(img.imageUrl)}
                        className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/60 cursor-pointer hover:border-[#B5122B]/50 transition-colors"
                      >
                        <img
                          src={img.imageUrl}
                          alt="تصویر گزارش"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleStartEdit(selectedReport);
                    setSelectedReport(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-xs text-[#85878C] hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#B5122B]" />
                  <span>ویرایش متن</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(selectedReport.id)}
                  className="px-3.5 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 text-xs text-[#E85D6F] flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs text-white transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          Edit Report Modal
         ================================================== */}
      {editingReport && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0f1013] border border-white/[0.08] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-[#B5122B]" />
                <span>ویرایش یادداشت گزارش</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingReport(null)}
                className="p-1 rounded-lg text-[#85878C] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <textarea
                rows={5}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-[#080808] border border-white/[0.08] focus:border-[#B5122B]/60 focus:outline-none text-xs text-[#E8E8E6] leading-relaxed resize-none"
              />

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs text-[#85878C] hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 rounded-lg bg-[#B5122B] hover:bg-[#c91833] text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>ذخیره تغییرات</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          Delete Confirmation Modal
         ================================================== */}
      {deletingId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-sm rounded-2xl bg-[#0f1013] border border-red-500/20 p-5 text-center space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#E85D6F] mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">حذف گزارش تجربه</h4>
              <p className="text-xs text-[#85878C]">
                آیا از حذف این گزارش مطمئن هستید؟ این عملیات قابل بازگشت نیست.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#85878C] hover:text-white transition-colors"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>بله، حذف شود</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          Image Lightbox Preview
         ================================================== */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn cursor-zoom-out"
        >
          <img
            src={previewImage}
            alt="پیش‌نمایش تصویر"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain border border-white/10"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-3xl mx-auto w-full text-center py-4 text-[11px] text-[#85878C]/60">
        NEXT YOU — ردپای رشد فردی و استمرار در اقدام
      </footer>
    </div>
  );
};
