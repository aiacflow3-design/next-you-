import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Trash2, Loader2, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ActionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionId: string;
  actionTitle: string;
  pathSlug?: string;
  stageOrder?: number;
  onReportSaved?: () => void;
}

export const ActionReportModal: React.FC<ActionReportModalProps> = ({
  isOpen,
  onClose,
  actionId,
  actionTitle,
  pathSlug = 'discipline',
  stageOrder = 1,
  onReportSaved,
}) => {
  const { authFetch } = useAuth();
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMsg('فرمت این تصویر پشتیبانی نمی‌شود. فقط JPG، PNG یا WebP مجاز است.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('حجم تصویر بیش از حد مجاز است (حداکثر ۵ مگابایت).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const res = await authFetch('/api/reports/upload', {
            method: 'POST',
            body: JSON.stringify({ dataUrl }),
          });

          const data = await res.json();
          if (res.ok && data.success && data.url) {
            setImages((prev) => [...prev, data.url]);
          } else {
            setErrorMsg(data.error || 'خطا در بارگذاری تصویر.');
          }
        } catch (err) {
          console.error('Upload failed:', err);
          setErrorMsg('خطای شبکه در بارگذاری تصویر.');
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        setErrorMsg('خطا در خواندن فایل.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorMsg('خطای بارگذاری تصویر.');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!text.trim() && images.length === 0) {
      setErrorMsg('لطفاً یادداشت یا تصویری برای گزارش خود ثبت کنید.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await authFetch('/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          actionId,
          actionTitle,
          pathSlug,
          stageOrder,
          text: text.trim(),
          images,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('گزارشت ثبت شد.');
        setTimeout(() => {
          if (onReportSaved) onReportSaved();
          onClose();
        }, 1200);
      } else {
        setErrorMsg(data.error || 'خطا در ثبت گزارش.');
      }
    } catch (err) {
      console.error('Error creating report:', err);
      setErrorMsg('خطای اتصال به سرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0f1013] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B5122B]/15 border border-[#B5122B]/30 flex items-center justify-center text-[#B5122B]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="report-modal-title" className="text-sm font-bold text-[#E8E8E6]">
                ثبت تجربه اقدام
              </h2>
              <p className="text-[11px] text-[#85878C] truncate max-w-xs sm:max-w-sm">
                {actionTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره گزارش"
            className="p-1.5 rounded-lg text-[#85878C] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-right">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[#E85D6F] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="report-textarea" className="block text-xs font-medium text-[#85878C]">
              یادداشت و مشاهدات شما (اختیاری)
            </label>
            <textarea
              id="report-textarea"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="چه اصطکاکی حس کردی؟ چطور انجام شد؟ چه نکته‌ای را دوست داری به خاطر بسپاری؟"
              className="w-full px-3.5 py-3 rounded-xl bg-[#080808] border border-white/[0.08] focus:border-[#B5122B]/60 focus:outline-none text-xs text-[#E8E8E6] placeholder-[#85878C]/40 leading-relaxed resize-none transition-all"
            />
          </div>

          {/* Image Attachments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#85878C]">تصویر ضمیمه (اختیاری)</span>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#B5122B] hover:text-[#d41c38] transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{isUploading ? 'در حال بارگذاری...' : 'افزودن تصویر'}</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/40"
                  >
                    <img
                      src={imgUrl}
                      alt={`ضمیمه ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      aria-label="حذف این تصویر"
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/70 hover:bg-red-500/90 text-white opacity-90 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-[#85878C] hover:text-white transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading || !!successMsg}
              className="px-5 py-2 rounded-xl bg-[#B5122B] hover:bg-[#c91833] text-white text-xs font-semibold cursor-pointer transition-all shadow-[0_0_15px_rgba(181,18,43,0.3)] disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>در حال ثبت...</span>
                </>
              ) : (
                <span>ثبت گزارش</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
