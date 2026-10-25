import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Lock,
  Mail,
  User,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Phone,
  CheckCircle2,
  Edit2,
  KeyRound,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { isEmail, isIranianPhone } from '../../lib/auth/validation';

export const UnifiedAuthPage: React.FC = () => {
  const { checkIdentifier, login, register, navigate } = useAuth();

  // Step 1: Input
  const [identifier, setIdentifier] = useState('');

  // Flow State: 'step1' -> checking -> 'login' (exists) or 'register' (new)
  const [step, setStep] = useState<'step1' | 'login' | 'register'>('step1');
  const [isChecking, setIsChecking] = useState(false);
  const [existingUserName, setExistingUserName] = useState<string | null>(null);

  // Login State
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [usePasswordLogin, setUsePasswordLogin] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Register State
  const [name, setName] = useState('');

  // Errors & Loading
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hasSavedAssessment] = useState(() => {
    try {
      const saved = localStorage.getItem('nextyou_assessment_answers');
      return !!saved && saved.length > 5;
    } catch {
      return false;
    }
  });

  // Countdown timer for OTP
  useEffect(() => {
    if (step === 'login' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  // Step 1 handler: Check if user exists and route appropriately
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const val = identifier.trim();
    if (!val) {
      setFieldErrors({ identifier: 'لطفاً ایمیل یا شماره موبایل خود را وارد کنید.' });
      return;
    }

    if (!isEmail(val) && !isIranianPhone(val)) {
      setFieldErrors({
        identifier: 'فرمت وارد شده معتبر نیست. لطفاً یک ایمیل یا شماره موبایل صحیح (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.',
      });
      return;
    }

    setIsChecking(true);
    try {
      const check = await checkIdentifier(val);
      if (!check.success) {
        setErrorMessage(check.error || 'خطا در بررسی اطلاعات. لطفاً دوباره تلاش کنید.');
        return;
      }

      if (check.exists) {
        // User exists -> Route to Login
        setExistingUserName(check.name || null);
        setCountdown(60);
        setOtpCode('12345'); // Pre-fill test code for ultra smooth login
        setStep('login');
      } else {
        // User does not exist -> Route to Register
        setStep('register');
      }
    } catch {
      setErrorMessage('خطایی در ارتباط با سرور رخ داد.');
    } finally {
      setIsChecking(false);
    }
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (usePasswordLogin) {
      if (!password) {
        setFieldErrors({ password: 'لطفاً رمز عبور خود را وارد کنید.' });
        return;
      }
    } else {
      if (!otpCode || otpCode.trim().length < 4) {
        setFieldErrors({ otpCode: 'لطفاً کد تایید را وارد کنید.' });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await login(
        identifier,
        usePasswordLogin ? password : otpCode,
        !usePasswordLogin
      );

      if (!result.success) {
        setErrorMessage(result.error || 'اطلاعات ورود معتبر نیست.');
      }
    } catch {
      setErrorMessage('خطایی در ارتباط با سرور رخ داد.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!password) {
      setFieldErrors({ password: 'لطفاً یک رمز عبور تعیین کنید.' });
      return;
    }

    if (password.length < 6) {
      setFieldErrors({ password: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        identifier,
        name: name.trim() || undefined,
        password,
      });

      if (!result.success) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setErrorMessage(result.error || 'خطا در ساخت حساب کاربری. لطفاً دوباره تلاش کنید.');
      }
    } catch {
      setErrorMessage('خطایی در ارتباط با سرور رخ داد.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPhoneType = isIranianPhone(identifier.trim());

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden select-none"
      dir="rtl"
    >
      {/* Back to Home Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-[#85878C] hover:text-[#E8E8E6] transition-colors p-2 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>بازگشت به صفحه اصلی</span>
        </button>
      </div>

      {/* Main Glass Auth Card */}
      <div className="w-full max-w-md luxury-glass-card rounded-2xl p-7 sm:p-9 relative z-10 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
        
        {/* Logo & Dynamic Header */}
        <div className="text-center mb-6">
          <div className="inline-block mb-3 cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="lg" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight mb-1.5">
            {step === 'step1' && (hasSavedAssessment ? 'ورود / ثبت‌نام و ذخیره ارزیابی' : 'ورود / ثبت‌نام')}
            {step === 'login' && 'ورود به حساب کاربری'}
            {step === 'register' && 'ایجاد حساب کاربری جدید'}
          </h1>
          <p className="text-xs text-[#85878C]">
            {step === 'step1' && 'ایمیل یا شماره موبایل خود را وارد کنید تا به‌طور هوشمند هدایت شوید.'}
            {step === 'login' && (existingUserName ? `خوش آمدید ${existingUserName}! کد تایید یا رمز عبور را وارد کنید.` : 'حساب شما یافت شد. کد تایید یا رمز عبور را وارد کنید.')}
            {step === 'register' && 'حسابی با این شناسه یافت نشد. برای ساخت حساب، نام و رمز عبور وارد کنید.'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 'step1' ? 'w-10 bg-[#B5122B]' : 'w-4 bg-white/20'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step !== 'step1' ? 'w-10 bg-[#B5122B]' : 'w-4 bg-white/20'
            }`}
          />
        </div>

        {/* Assessment Saved Welcome Banner (Subtle Green Positive Confirmation) */}
        {hasSavedAssessment && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2.5 text-xs text-[#F4F0E8] text-right">
            <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>
              ارزیابی شما انجام شده است! با ورود یا ثبت‌نام، پرونده شما ذخیره شده و وارد داشبورد می‌شوید.
            </span>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-[#B5122B]/10 border border-[#B5122B]/30 flex items-center gap-2.5 text-xs text-red-200 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-[#B5122B] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ==================== STEP 1: Combined Input ==================== */}
        {step === 'step1' && (
          <form onSubmit={handleStep1Submit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="auth-identifier"
                className="block text-xs font-medium text-[#C7C9CC] mb-2 text-right"
              >
                ایمیل یا شماره موبایل
              </label>
              <div className="relative">
                <input
                  id="auth-identifier"
                  type="text"
                  autoFocus
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (fieldErrors.identifier) setFieldErrors({});
                  }}
                  placeholder="09123456789  |  name@domain.com"
                  dir="ltr"
                  className={`w-full bg-[#111214] border ${
                    fieldErrors.identifier ? 'border-[#B5122B]' : 'border-white/10'
                  } rounded-xl px-4 py-3 pl-11 text-xs sm:text-sm text-[#E8E8E6] placeholder-[#85878C]/50 focus:outline-none focus:border-[#B5122B] focus:ring-1 focus:ring-[#B5122B]/40 transition-all text-left font-mono`}
                />
                {isPhoneType ? (
                  <Phone className="w-4 h-4 text-[#85878C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                ) : (
                  <Mail className="w-4 h-4 text-[#85878C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
              {fieldErrors.identifier && (
                <span className="text-[11px] text-[#B5122B] mt-1.5 block">
                  {fieldErrors.identifier}
                </span>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChecking}
                className="w-full py-3.5 rounded-xl btn-primary-crimson text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(181,18,43,0.35)]"
              >
                {isChecking ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>در حال بررسی...</span>
                  </>
                ) : (
                  <>
                    <span>ادامه</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ==================== STEP 2: LOGIN (User Exists) ==================== */}
        {step === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn" noValidate>
            {/* User Exists Badge */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-emerald-300 font-semibold block text-[11px]">حساب کاربری یافت شد</span>
                  <span className="text-[#E8E8E6] font-mono dir-ltr text-xs">{identifier}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep('step1')}
                className="text-[#85878C] hover:text-[#E8E8E6] flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>ویرایش</span>
              </button>
            </div>

            {!usePasswordLogin ? (
              /* OTP Code Option */
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="login-otp" className="text-xs font-medium text-[#C7C9CC]">
                    کد تایید ۵ رقمی
                  </label>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    کد تست: ۱۲۳۴۵
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="login-otp"
                    type="text"
                    autoFocus
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                      if (fieldErrors.otpCode) setFieldErrors({});
                    }}
                    placeholder="۱۲۳۴۵"
                    dir="ltr"
                    className={`w-full bg-[#111214] border ${
                      fieldErrors.otpCode ? 'border-[#B5122B]' : 'border-white/10'
                    } rounded-xl px-4 py-3 text-center text-lg font-mono tracking-[0.4em] text-[#E8E8E6] placeholder-[#85878C]/40 focus:outline-none focus:border-[#B5122B] focus:ring-1 focus:ring-[#B5122B]/40 transition-all`}
                  />
                  <KeyRound className="w-4 h-4 text-[#85878C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {fieldErrors.otpCode && (
                  <span className="text-[11px] text-[#B5122B] mt-1.5 block">
                    {fieldErrors.otpCode}
                  </span>
                )}

                <div className="flex items-center justify-between mt-3 text-[11px] text-[#85878C]">
                  <span>
                    {countdown > 0 ? (
                      `ارسال مجدد کد در ${countdown} ثانیه`
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setCountdown(60);
                          setOtpCode('12345');
                        }}
                        className="text-[#E8E8E6] hover:underline cursor-pointer"
                      >
                        ارسال مجدد کد
                      </button>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setUsePasswordLogin(true)}
                    className="text-[#85878C] hover:text-[#E8E8E6] underline cursor-pointer"
                  >
                    ورود با رمز عبور
                  </button>
                </div>
              </div>
            ) : (
              /* Password Option */
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="login-password" className="text-xs font-medium text-[#C7C9CC]">
                    رمز عبور
                  </label>
                  <button
                    type="button"
                    onClick={() => setUsePasswordLogin(false)}
                    className="text-[11px] text-[#85878C] hover:text-[#E8E8E6] underline cursor-pointer"
                  >
                    ورود با کد تایید
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors({});
                    }}
                    placeholder="••••••••"
                    dir="ltr"
                    className={`w-full bg-[#111214] border ${
                      fieldErrors.password ? 'border-[#B5122B]' : 'border-white/10'
                    } rounded-xl px-4 py-3 pl-11 text-xs sm:text-sm text-[#E8E8E6] placeholder-[#85878C]/50 focus:outline-none focus:border-[#B5122B] focus:ring-1 focus:ring-[#B5122B]/40 transition-all text-left`}
                  />
                  <Lock className="w-4 h-4 text-[#85878C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {fieldErrors.password && (
                  <span className="text-[11px] text-[#B5122B] mt-1.5 block">
                    {fieldErrors.password}
                  </span>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl btn-primary-crimson text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(181,18,43,0.35)]"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>در حال ورود...</span>
                  </>
                ) : (
                  <>
                    <span>ورود به حساب کاربری</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ==================== STEP 2: REGISTER (New User) ==================== */}
        {step === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fadeIn" noValidate>
            {/* New User Badge */}
            <div className="p-3.5 rounded-xl bg-[#C8102E]/10 border border-[#C8102E]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#C8102E] shrink-0" />
                <div>
                  <span className="text-[#F4F0E8] font-semibold block text-[11px]">حساب جدید</span>
                  <span className="text-[#E8E8E6] font-mono dir-ltr text-xs">{identifier}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep('step1')}
                className="text-[#85878C] hover:text-[#E8E8E6] flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>ویرایش</span>
              </button>
            </div>

            {/* Name Field */}
            <div>
              <label
                htmlFor="register-name"
                className="block text-xs font-medium text-[#C7C9CC] mb-1.5 text-right"
              >
                نام و نام‌خانوادگی <span className="text-[#85878C] font-normal">(اختیاری)</span>
              </label>
              <div className="relative">
                <input
                  id="register-name"
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً: علی رضایی"
                  className="w-full bg-[#111214] border border-white/10 rounded-xl px-4 py-3 pl-11 text-xs sm:text-sm text-[#E8E8E6] placeholder-[#85878C]/50 focus:outline-none focus:border-[#B5122B] focus:ring-1 focus:ring-[#B5122B]/40 transition-all text-right"
                />
                <User className="w-4 h-4 text-[#85878C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-medium text-[#C7C9CC] mb-1.5 text-right"
              >
                تعیین رمز عبور <span className="text-[#B5122B]">*</span>
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({});
                  }}
                  placeholder="حداقل ۶ کاراکتر"
                  dir="ltr"
                  className={`w-full bg-[#111214] border ${
                    fieldErrors.password ? 'border-[#B5122B]' : 'border-white/10'
                  } rounded-xl px-4 py-3 pl-11 text-xs sm:text-sm text-[#E8E8E6] placeholder-[#85878C]/50 placeholder:text-right focus:outline-none focus:border-[#B5122B] focus:ring-1 focus:ring-[#B5122B]/40 transition-all text-left`}
                />
                <Lock className="w-4 h-4 text-[#85878C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {fieldErrors.password && (
                <span className="text-[11px] text-[#B5122B] mt-1.5 block">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl btn-primary-crimson text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(181,18,43,0.35)]"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>در حال ساخت حساب...</span>
                  </>
                ) : (
                  <>
                    <span>ثبت‌نام و ورود به حساب</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
