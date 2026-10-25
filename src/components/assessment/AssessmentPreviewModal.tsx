import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
} from 'lucide-react';
import { Button } from '../ui/Button';

interface AssessmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGrowth?: () => void;
}

interface Question {
  id: number;
  trait: string;
  traitName: string;
  prompt: string;
  subtitle: string;
  options: { label: string; score: number }[];
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    trait: 'DISCIPLINE',
    traitName: 'نظم و پایداری در تعهدات',
    prompt: 'وقتی تصمیم به انجام کاری مهم می‌گیرید، احتمال اینکه آن را تا انتها پیگیری کنید چقدر است؟',
    subtitle: 'صادقانه پاسخ دهید؛ شناخت واقعیت نخستین گام صعود است.',
    options: [
      { label: 'تقریباً همیشه در میانه راه آن را به تعویق می‌اندازم یا فراموش می‌کنم', score: 1 },
      { label: 'با انگیزه شدید شروع می‌کنم اما پس از چند روز پایداری‌ام افت می‌کند', score: 2 },
      { label: 'بیشتر وظایف را با زحمت و کلنجار ذهنی زیاد به سرانجام می‌رسانم', score: 3 },
      { label: 'سیستم منسجمی دارم و تعهداتم را بدون اتکا به انگیزه لحظه‌ای اجرا می‌کنم', score: 5 },
    ],
  },
  {
    id: 2,
    trait: 'FOCUS',
    traitName: 'قدرت تمرکز و غرقگی',
    prompt: 'هنگام انجام یک کار عمیق و فکری، میزان حواس‌پرتی و فرار ذهنی شما چگونه است؟',
    subtitle: 'سنجش مقاومت در برابر هشدارهای دیجیتال و محرک‌های بیرونی.',
    options: [
      { label: 'به‌ندرت می‌توانم بیش از ۱۰ دقیقه بدون چک کردن گوشی متمرکز بمانم', score: 1 },
      { label: 'هر بار تمرکزم به هم می‌خورد، برگشتن به جریان کار برایم طولانی و فرساینده است', score: 2 },
      { label: 'در محیط‌های خلوت تمرکز متوسطی دارم اما در ساعات شلوغ پراکنده می‌شوم', score: 3 },
      { label: 'می‌توانم به مدت ۶۰ تا ۹۰ دقیقه در حالت غرقگی کامل (Deep Work) بمانم', score: 5 },
    ],
  },
  {
    id: 3,
    trait: 'CLARITY',
    traitName: 'شفافیت اهداف و اولویت‌بندی',
    prompt: 'در آغاز روز، چقدر شفاف می‌دانید که دقیقاً چه کاری اولویت شماره یک شماست؟',
    subtitle: 'تفکیک شفاف کارهای ضروری از کارهای کم‌ارزش پرمشغله‌نما.',
    options: [
      { label: 'روزهایم در پاسخ دادن به اتفاقات غیرمنتظره و سردرگمی سپری می‌شود', score: 1 },
      { label: 'فهرستی از ده‌ها کار دارم اما نمی‌دانم کدام واقعاً اهرم کلیدی پیشرفت است', score: 2 },
      { label: 'معمولاً هدف اصلی را می‌دانم اما کارهای فرعی انرژی‌ام را می‌بلعند', score: 3 },
      { label: 'یک اولویت تعیین‌کننده را قبل از شروع روز مشخص کرده‌ام و بر آن تمرکز دارم', score: 5 },
    ],
  },
];

export const AssessmentPreviewModal: React.FC<AssessmentPreviewModalProps> = ({
  isOpen,
  onClose,
  onStartGrowth,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCalculated, setIsCalculated] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentQ = SAMPLE_QUESTIONS[currentIndex];

  const handleSelectOption = (score: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: score,
    }));
  };

  const handleNext = () => {
    if (currentIndex < SAMPLE_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      try {
        localStorage.setItem('nextyou_assessment_answers', JSON.stringify(selectedAnswers));
      } catch {
        // Ignore
      }
      setIsCalculated(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const resetAll = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsCalculated(false);
  };

  const handleStartPath = () => {
    onClose();
    try {
      localStorage.setItem('nextyou_assessment_answers', JSON.stringify(selectedAnswers));
    } catch {
      // Ignore
    }
    if (onStartGrowth) {
      onStartGrowth();
    }
  };

  // Compute dynamic percentages from user answers
  const toPercent = (score?: number) => Math.round(((score || 2) / 5) * 100);
  const disciplineScore = toPercent(selectedAnswers[1]);
  const focusScore = toPercent(selectedAnswers[2]);
  const clarityScore = toPercent(selectedAnswers[3]);

  // Helper for color coding scores in chart bars
  const getBarColor = (score: number) => {
    if (score <= 40) {
      return {
        bar: 'bg-[#C8102E]',
        text: 'text-[#C8102E]',
        border: 'border-[#C8102E]/30',
        bg: 'bg-[#C8102E]/10',
        label: 'نیازمند تقویت (گلوگاه)',
      };
    }
    if (score < 70) {
      return {
        bar: 'bg-[#9CA3AF]',
        text: 'text-[#9CA3AF]',
        border: 'border-[#9CA3AF]/30',
        bg: 'bg-[#9CA3AF]/10',
        label: 'سطح متوسط',
      };
    }
    return {
      bar: 'bg-[#10B981]',
      text: 'text-[#10B981]',
      border: 'border-[#10B981]/30',
      bg: 'bg-[#10B981]/10',
      label: 'نقطه قوت',
    };
  };

  const isCurrentAnswered = selectedAnswers[currentQ.id] !== undefined;

  const lowestTrait =
    disciplineScore <= focusScore && disciplineScore <= clarityScore
      ? {
          name: 'نظم شخصی',
          title: 'نظم شخصی',
          actionTitle: 'قانون ۱۰ دقیقه',
          actionDesc: 'قبل از به تعویق انداختن کار، متعهد شو ۱۰ دقیقه بدون انصراف انجامش بدی.',
        }
      : focusScore <= clarityScore
      ? {
          name: 'قدرت تمرکز',
          title: 'قدرت تمرکز',
          actionTitle: 'بلوک ۳۰ دقیقه‌ای عمیق',
          actionDesc: 'گوشی رو دور بزار و ۳۰ دقیقه فقط روی مهم‌ترین کار امروز تمرکز کن.',
        }
      : {
          name: 'شفافیت اهداف',
          title: 'شفافیت اهداف',
          actionTitle: 'تعیین ۱ اولویت اصلی',
          actionDesc: 'قبل از شروع روز، فقط ۱ کار کلیدی رو به عنوان اولویت اول مشخص کن.',
        };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#191A1F] border border-white/10 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.95)] overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#08090B]/60">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                isCalculated || isCurrentAnswered
                  ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                  : 'bg-[#C8102E] shadow-[0_0_8px_#C8102E]'
              }`}
            />
            <span className="text-sm font-bold text-[#F4F0E8] tracking-wide">
              {isCalculated ? 'نتیجه ارزیابی خودشناسی NEXT YOU' : 'پیش‌نمایش ارزیابی خودشناسی NEXT YOU'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره ارزیابی"
            className="p-1.5 rounded-lg text-[#B7B8C0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {!isCalculated ? (
            <div>
              {/* Stepper Progress */}
              <div className="mb-3 flex items-center justify-between text-xs text-[#B7B8C0]">
                <span>
                  پرسش {currentIndex + 1} از {SAMPLE_QUESTIONS.length}
                </span>
                <span
                  className={`font-semibold transition-colors duration-300 ${
                    isCurrentAnswered ? 'text-[#10B981]' : 'text-[#C8102E]'
                  }`}
                >
                  {currentQ.traitName}
                </span>
              </div>

              {/* Segmented Step Bar: Red when asking, Green when answered */}
              <div className="grid grid-cols-3 gap-2 mb-7">
                {SAMPLE_QUESTIONS.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentIndex;
                  return (
                    <div
                      key={q.id}
                      className="h-1.5 bg-[#08090B] rounded-full overflow-hidden"
                    >
                      <div
                        className={`h-full transition-all duration-300 ${
                          isAnswered
                            ? 'w-full bg-[#10B981]'
                            : isCurrent
                            ? 'w-full bg-[#C8102E]'
                            : 'w-0 bg-white/10'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Question Body */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#F4F0E8] mb-2 leading-relaxed">
                  {currentQ.prompt}
                </h3>
                <p className="text-xs sm:text-sm text-[#B7B8C0]">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.score;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(opt.score)}
                      className={`w-full text-right p-4 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#08090B] border-[#10B981]/65 text-[#F4F0E8] shadow-[0_0_16px_rgba(16,185,129,0.14)]'
                          : 'bg-[#08090B]/50 border-white/8 hover:border-[#C8102E]/40 text-[#B7B8C0] hover:text-[#F4F0E8]'
                      }`}
                    >
                      <span className="leading-relaxed">{opt.label}</span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'border-[#10B981] bg-[#10B981]'
                            : 'border-white/25'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Stepper Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="text-xs text-[#B7B8C0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>پرسش قبلی</span>
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                  disabled={!isCurrentAnswered}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  {currentIndex === SAMPLE_QUESTIONS.length - 1 ? 'مشاهده نتیجه ارزیابی' : 'پرسش بعدی'}
                </Button>
              </div>
            </div>
          ) : (
            /* Result View: Clean, Minimal, Sleek Chart Breakdown & Impactful Recommended Path */
            <div className="animate-fadeIn">
              {/* Header: Preview Tag & Main Result Title */}
              <div className="mb-6 text-right">
                <span className="inline-block text-[11px] font-semibold text-[#9CA3AF] bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-2">
                  پیش‌نمایش
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#F4F0E8]">
                  نتیجه ارزیابی
                </h3>
              </div>

              {/* Trait Scores Breakdown - Sleek Visual Chart Bars */}
              <div className="space-y-4 p-4 sm:p-5 rounded-xl bg-[#08090B] border border-white/10 mb-6">
                {[
                  { name: 'نظم در تعهدات', score: disciplineScore },
                  { name: 'قدرت تمرکز', score: focusScore },
                  { name: 'شفافیت اهداف', score: clarityScore },
                ].map((item, idx) => {
                  const style = getBarColor(item.score);
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-medium text-[#F4F0E8]">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${style.bg} ${style.text} border ${style.border}`}>
                            {style.label}
                          </span>
                          <span className="font-bold text-[#F4F0E8] font-sans text-xs sm:text-sm">{item.score}٪</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommended Path - Short & Impactful */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#08090B]/90 border border-[#C8102E]/30 mb-6 text-right">
                <h4 className="text-xs sm:text-sm font-bold text-[#F4F0E8] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
                  <span>مسیر پیشنهادی</span>
                </h4>

                <div className="p-3.5 rounded-lg bg-[#191A1F] border border-white/5 text-xs text-[#B7B8C0]">
                  <div className="font-bold text-[#F4F0E8] mb-1">
                    قدم اول: <span className="text-[#C8102E]">{lowestTrait.actionTitle}</span>
                  </div>
                  <p className="leading-relaxed text-[#D1D5DB]">
                    {lowestTrait.actionDesc}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={resetAll}
                  className="text-xs text-[#B7B8C0] hover:text-white cursor-pointer py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  تکرار ارزیابی
                </button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStartPath}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  شروع مسیر با NEXT YOU
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
