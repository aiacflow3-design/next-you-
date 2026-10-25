import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { OnboardingShell } from '../onboarding/OnboardingShell';
import {
  PRIMARY_GOAL_CHOICES,
  MAIN_OBSTACLE_CHOICES,
  AVAILABLE_TIME_CHOICES,
  CONSISTENCY_PATTERN_CHOICES,
  DESIRED_SUPPORT_CHOICES,
} from '../../lib/onboarding/validation';

export interface OnboardingFormState {
  name: string;
  primaryGoal: string;
  mainObstacle: string;
  availableTime: string;
  consistencyPattern: string;
  desiredSupport: string;
  futureSelfVision: string;
}

const TOTAL_QUESTIONS = 7;

export const OnboardingPage: React.FC = () => {
  const { user, submitOnboarding, navigate } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form answers state, hydrated from user/localStorage
  const [answers, setAnswers] = useState<OnboardingFormState>(() => {
    try {
      const saved = localStorage.getItem('nextyou_real_onboarding_answers');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return {
      name: user?.name || '',
      primaryGoal: '',
      mainObstacle: '',
      availableTime: user?.onboardingDailyTime || '',
      consistencyPattern: '',
      desiredSupport: '',
      futureSelfVision: '',
    };
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const visionInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input on step change
  useEffect(() => {
    if (currentStep === 1) {
      setTimeout(() => nameInputRef.current?.focus(), 150);
    } else if (currentStep === 7) {
      setTimeout(() => visionInputRef.current?.focus(), 150);
    }
  }, [currentStep]);

  // Persist answers locally during the flow
  const updateAnswer = useCallback(
    <K extends keyof OnboardingFormState>(field: K, value: OnboardingFormState[K]) => {
      setErrorMsg(null);
      setAnswers((prev) => {
        const next = { ...prev, [field]: value };
        try {
          localStorage.setItem('nextyou_real_onboarding_answers', JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    },
    []
  );

  // Validation per step
  const validateCurrentStep = (): boolean => {
    setErrorMsg(null);
    switch (currentStep) {
      case 1:
        if (!answers.name.trim() || answers.name.trim().length < 2) {
          setErrorMsg('لطفاً نام یا نام مستعار خود را وارد کنید (حداقل ۲ نویسه).');
          return false;
        }
        return true;
      case 2:
        if (!answers.primaryGoal) {
          setErrorMsg('لطفاً یک گزینه را انتخاب کنید.');
          return false;
        }
        return true;
      case 3:
        if (!answers.mainObstacle) {
          setErrorMsg('لطفاً مانع اصلی را انتخاب کنید.');
          return false;
        }
        return true;
      case 4:
        if (!answers.availableTime) {
          setErrorMsg('لطفاً زمان مورد نظر را مشخص کنید.');
          return false;
        }
        return true;
      case 5:
        if (!answers.consistencyPattern) {
          setErrorMsg('لطفاً وضعیت معمول خود را انتخاب کنید.');
          return false;
        }
        return true;
      case 6:
        if (!answers.desiredSupport) {
          setErrorMsg('لطفاً اولویت حمایتی خود را انتخاب کنید.');
          return false;
        }
        return true;
      case 7:
        if (!answers.futureSelfVision.trim() || answers.futureSelfVision.trim().length < 2) {
          setErrorMsg('لطفاً حداقل چند کلمه درباره تصویر ۶ ماه آینده‌ات بنویس.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep < TOTAL_QUESTIONS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (currentStep > 1 && !isSubmitting) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await submitOnboarding({
        name: answers.name.trim(),
        primaryGoal: answers.primaryGoal,
        mainObstacle: answers.mainObstacle,
        availableTime: answers.availableTime,
        consistencyPattern: answers.consistencyPattern,
        desiredSupport: answers.desiredSupport,
        futureSelfVision: answers.futureSelfVision.trim(),
      });

      if (!res.success) {
        setIsSubmitting(false);
        setErrorMsg(res.error || 'خطا در ثبت اطلاعات آشنایی. لطفاً مجدداً امتحان کنید.');
      } else {
        // Clear draft storage
        try {
          localStorage.removeItem('nextyou_real_onboarding_answers');
        } catch {
          // Ignore
        }
        // Redirect to /assessment/initial handled by submitOnboarding, or manual fallback
        navigate('/assessment/initial');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('خطای شبکه در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input or textarea, handle Enter
      if (e.key === 'Enter' && !e.shiftKey) {
        if (currentStep !== 7) {
          e.preventDefault();
          handleNext();
        }
      }

      // Handle number keys 1-8 for quick option selection on choice steps
      if (currentStep >= 2 && currentStep <= 6) {
        let choices: readonly string[] = [];
        let field: keyof OnboardingFormState = 'primaryGoal';

        if (currentStep === 2) {
          choices = PRIMARY_GOAL_CHOICES;
          field = 'primaryGoal';
        } else if (currentStep === 3) {
          choices = MAIN_OBSTACLE_CHOICES;
          field = 'mainObstacle';
        } else if (currentStep === 4) {
          choices = AVAILABLE_TIME_CHOICES;
          field = 'availableTime';
        } else if (currentStep === 5) {
          choices = CONSISTENCY_PATTERN_CHOICES;
          field = 'consistencyPattern';
        } else if (currentStep === 6) {
          choices = DESIRED_SUPPORT_CHOICES;
          field = 'desiredSupport';
        }

        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= choices.length) {
          e.preventDefault();
          updateAnswer(field, choices[num - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, answers, updateAnswer]);

  return (
    <OnboardingShell>
      <div className="flex flex-col select-none" dir="rtl">
        {/* Subtle Progress Bar & Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#B5122B] tracking-wider uppercase bg-[#B5122B]/10 px-2 py-0.5 rounded border border-[#B5122B]/20">
              گام اول: شناخت
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#85878C]">
              {String(currentStep).padStart(2, '0')} / {String(TOTAL_QUESTIONS).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Hairline Progress Track */}
        <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-[#8B0E20] to-[#B5122B] transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>

        {/* Dynamic Question Container */}
        <div className="min-h-[280px] flex flex-col justify-center">
          {/* Question 1: Name */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight">
                  نامت چیست؟
                </h2>
                <p className="text-xs sm:text-sm text-[#85878C] leading-relaxed">
                  می‌خواهیم در این مسیر با نام یا عنوانی که خودت ترجیح می‌دهی صدایت کنیم.
                </p>
              </div>

              <div className="pt-2">
                <input
                  ref={nameInputRef}
                  type="text"
                  value={answers.name}
                  onChange={(e) => updateAnswer('name', e.target.value)}
                  placeholder="نام یا نام مستعار دلخواهت..."
                  className="w-full bg-white/[0.03] border border-white/[0.12] focus:border-[#B5122B]/60 focus:bg-white/[0.05] rounded-xl px-4 py-3.5 text-sm sm:text-base text-white placeholder-[#55575c] outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Question 2: Primary Goal */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight">
                  الان مهم‌ترین چیزی که می‌خواهی در زندگی‌ات بهتر کنی چیست؟
                </h2>
                <p className="text-xs sm:text-sm text-[#85878C]">
                  تمرکز اصلی‌ات را انتخاب کن تا ساختار نقشه رشد اولیه منطبق بر آن شکل بگیرد.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {PRIMARY_GOAL_CHOICES.map((choice, idx) => {
                  const isSelected = answers.primaryGoal === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => updateAnswer('primaryGoal', choice)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-right transition-all cursor-pointer text-xs sm:text-sm font-medium ${
                        isSelected
                          ? 'bg-[#B5122B]/15 border-[#B5122B] text-white shadow-[0_0_20px_rgba(181,18,43,0.25)]'
                          : 'bg-white/[0.02] border-white/[0.06] text-[#C7C9CC] hover:border-white/20 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[10px] font-mono flex items-center justify-center text-[#85878C]">
                          {idx + 1}
                        </span>
                        <span>{choice}</span>
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#B5122B]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 3: Main Obstacle */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight">
                  بزرگترین چیزی که الان جلوی پیشرفتت را می‌گیرد چیست؟
                </h2>
                <p className="text-xs sm:text-sm text-[#85878C]">
                  صادقانه به اصطکاک اصلی نگاه کن؛ شناخت مانع، پایه‌گذار طراحی سیستم ضدلغزش است.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {MAIN_OBSTACLE_CHOICES.map((choice, idx) => {
                  const isSelected = answers.mainObstacle === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => updateAnswer('mainObstacle', choice)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-right transition-all cursor-pointer text-xs sm:text-sm font-medium ${
                        isSelected
                          ? 'bg-[#B5122B]/15 border-[#B5122B] text-white shadow-[0_0_20px_rgba(181,18,43,0.25)]'
                          : 'bg-white/[0.02] border-white/[0.06] text-[#C7C9CC] hover:border-white/20 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[10px] font-mono flex items-center justify-center text-[#85878C]">
                          {idx + 1}
                        </span>
                        <span>{choice}</span>
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#B5122B]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 4: Available Time */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight">
                  در طول روز معمولاً چقدر زمان می‌توانی برای رشد خودت اختصاص بدهی؟
                </h2>
                <p className="text-xs sm:text-sm text-[#85878C]">
                  برنامه‌ها باید با ظرفیت بیولوژیک و زمانی واقعی تو هماهنگ باشند، نه آرمان‌گرایی زودگذر.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {AVAILABLE_TIME_CHOICES.map((choice, idx) => {
                  const isSelected = answers.availableTime === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => updateAnswer('availableTime', choice)}
                      className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-right transition-all cursor-pointer text-xs sm:text-sm font-medium ${
                        isSelected
                          ? 'bg-[#B5122B]/15 border-[#B5122B] text-white shadow-[0_0_20px_rgba(181,18,43,0.25)]'
                          : 'bg-white/[0.02] border-white/[0.06] text-[#C7C9CC] hover:border-white/20 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[10px] font-mono flex items-center justify-center text-[#85878C]">
                          {idx + 1}
                        </span>
                        <span>{choice}</span>
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#B5122B]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 5: Consistency Pattern */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight">
                  وقتی تصمیم می‌گیری چیزی را تغییر بدهی، معمولاً چه اتفاقی می‌افتد؟
                </h2>
                <p className="text-xs sm:text-sm text-[#85878C]">
                  الگوی رفتاری قبلی‌ات را بشناس تا سیستم بتواند در نقاط شکست احتمالی از تو محافظت کند.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {CONSISTENCY_PATTERN_CHOICES.map((choice, idx) => {
                  const isSelected = answers.consistencyPattern === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => updateAnswer('consistencyPattern', choice)}
                      className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-right transition-all cursor-pointer text-xs sm:text-sm font-medium ${
                        isSelected
                          ? 'bg-[#B5122B]/15 border-[#B5122B] text-white shadow-[0_0_20px_rgba(181,18,43,0.25)]'
                          : 'bg-white/[0.02] border-white/[0.06] text-[#C7C9CC] hover:border-white/20 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[10px] font-mono flex items-center justify-center text-[#85878C]">
                          {idx + 1}
                        </span>
                        <span>{choice}</span>
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#B5122B]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 6: Desired Support */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight">
                  الان بیشتر دوست داری NEXT YOU در چه چیزی به تو کمک کند؟
                </h2>
                <p className="text-xs sm:text-sm text-[#85878C]">
                  انتظار اصلی‌ات را مشخص کن تا نقش دستیار و چیدمان داشبورد برایت اولویت‌بندی شود.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {DESIRED_SUPPORT_CHOICES.map((choice, idx) => {
                  const isSelected = answers.desiredSupport === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => updateAnswer('desiredSupport', choice)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-right transition-all cursor-pointer text-xs sm:text-sm font-medium ${
                        isSelected
                          ? 'bg-[#B5122B]/15 border-[#B5122B] text-white shadow-[0_0_20px_rgba(181,18,43,0.25)]'
                          : 'bg-white/[0.02] border-white/[0.06] text-[#C7C9CC] hover:border-white/20 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[10px] font-mono flex items-center justify-center text-[#85878C]">
                          {idx + 1}
                        </span>
                        <span>{choice}</span>
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#B5122B]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 7: Future Self Vision */}
          {currentStep === 7 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight">
                  اگر ۶ ماه دیگر نسخه بهتری از خودت باشی، دوست داری چه چیزی در زندگی‌ات تغییر کرده باشد؟
                </h2>
                <p className="text-xs sm:text-sm text-[#85878C]">
                  در چند جمله کوتاه دیدگاهت را بنویس. این تصویر قطب‌نمای حرکت روزانه تو خواهد بود.
                </p>
              </div>

              <div className="pt-2">
                <textarea
                  ref={visionInputRef}
                  rows={4}
                  value={answers.futureSelfVision}
                  onChange={(e) => updateAnswer('futureSelfVision', e.target.value)}
                  placeholder="مثال: نظم ذهنی بالاتری داشته باشم، بدون حواس‌پرتی روی پروژه‌های عمیق کار کنم و احساس کنم روی زندگی‌ام تسلط دارم..."
                  className="w-full bg-white/[0.03] border border-white/[0.12] focus:border-[#B5122B]/60 focus:bg-white/[0.05] rounded-xl p-4 text-xs sm:text-sm text-white placeholder-[#55575c] outline-none transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#B5122B]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Contextual Companion Note (Requirement 5) */}
        <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-[11px] text-[#85878C]">
          <Sparkles className="w-3.5 h-3.5 text-[#B5122B] shrink-0" />
          <span>
            لازم نیست جواب درست یا کاملی بدی. فقط چیزی رو انتخاب کن که بیشتر شبیه خودته.
          </span>
        </div>

        {/* Navigation Actions (Back / Next / Submit) */}
        <div className="mt-8 flex items-center justify-between gap-4 pt-2">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-semibold text-[#85878C] hover:text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
            >
              <ArrowRight className="w-4 h-4" />
              <span>مرحله قبل</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-[#B5122B] hover:bg-[#c91833] text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer shadow-[0_0_25px_rgba(181,18,43,0.35)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>در حال ثبت شناخت...</span>
              </>
            ) : currentStep === TOTAL_QUESTIONS ? (
              <>
                <span>تکمیل و ورود به ارزیابی</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>ادامه</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
};
