import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  Globe,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ReminderPreference } from '../../lib/domain/reminder.entity';

const DAYS_OF_WEEK = [
  { dayIndex: 6, label: 'شنبه' },
  { dayIndex: 0, label: 'یکشنبه' },
  { dayIndex: 1, label: 'دوشنبه' },
  { dayIndex: 2, label: 'سه‌شنبه' },
  { dayIndex: 3, label: 'چهارشنبه' },
  { dayIndex: 4, label: 'پنج‌شنبه' },
  { dayIndex: 5, label: 'جمعه' },
];

const TIMEZONES = [
  { value: 'Asia/Tehran', label: 'تهران (GMT+3:30)' },
  { value: 'Asia/Dubai', label: 'دبی (GMT+4)' },
  { value: 'Europe/Istanbul', label: 'استانبول (GMT+3)' },
  { value: 'Europe/Berlin', label: 'برلین (GMT+1)' },
  { value: 'Europe/London', label: 'لندن (GMT+0)' },
  { value: 'America/New_York', label: 'نیویورک (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'لس‌آنجلس (GMT-8)' },
  { value: 'UTC', label: 'ساعت هماهنگ جهانی (UTC)' },
];

export const ReminderSettingsCard: React.FC = () => {
  const { authFetch } = useAuth();
  const [preference, setPreference] = useState<ReminderPreference | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPreferences() {
      try {
        const res = await authFetch('/api/reminders');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && data.preference) {
            setPreference(data.preference);
          }
        }
      } catch (err) {
        console.error('Failed to load reminder preferences:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadPreferences();
    return () => {
      isMounted = false;
    };
  }, [authFetch]);

  const handleUpdate = async (updates: Partial<ReminderPreference>) => {
    if (!preference || isSaving) return;
    setIsSaving(true);
    setFeedback(null);

    const updatedData = { ...preference, ...updates };

    try {
      const res = await authFetch('/api/reminders/preferences', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.preference) {
          setPreference(result.preference);
          setFeedback({ type: 'success', message: 'تنظیمات یادآوری با موفقیت به‌روزرسانی شد.' });
          setTimeout(() => setFeedback(null), 3000);
        }
      } else {
        setFeedback({ type: 'error', message: 'خطا در ذخیره تنظیمات یادآوری.' });
      }
    } catch (err) {
      console.error('Update preferences failed:', err);
      setFeedback({ type: 'error', message: 'خطای شبکه در اتصال به سرور.' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDay = (dayIndex: number) => {
    if (!preference) return;
    const currentDays = [...preference.activeDays];
    const exists = currentDays.includes(dayIndex);
    const newDays = exists
      ? currentDays.filter((d) => d !== dayIndex)
      : [...currentDays, dayIndex];
    handleUpdate({ activeDays: newDays });
  };

  if (isLoading) {
    return (
      <div className="luxury-glass-card rounded-2xl p-6 border border-white/[0.06] text-center space-y-2">
        <Loader2 className="w-5 h-5 text-[#B5122B] animate-spin mx-auto" />
        <span className="text-xs text-[#85878C]">در حال دریافت تنظیمات یادآوری...</span>
      </div>
    );
  }

  if (!preference) {
    return null;
  }

  return (
    <section className="luxury-glass-card rounded-2xl p-5 sm:p-7 border border-white/[0.07] space-y-5 text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3.5">
        <div className="flex items-center gap-2.5">
          <Bell className="w-4 h-4 text-[#B5122B]" />
          <div>
            <h2 className="text-sm sm:text-base font-medium text-[#E8E8E6]">یادآوری‌های من</h2>
            <p className="text-[11px] text-[#85878C]">
              تنظیمات در اختیار شماست؛ بدون ایجاد فشار روانی یا اعلان‌های پی‌درپی.
            </p>
          </div>
        </div>

        {/* Master Toggle */}
        <button
          type="button"
          onClick={() => handleUpdate({ enabled: !preference.enabled })}
          disabled={isSaving}
          className="flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08]"
        >
          {preference.enabled ? (
            <>
              <span className="text-emerald-400">فعال</span>
              <ToggleRight className="w-5 h-5 text-emerald-400" />
            </>
          ) : (
            <>
              <span className="text-[#85878C]">غیرفعال</span>
              <ToggleLeft className="w-5 h-5 text-[#85878C]" />
            </>
          )}
        </button>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-[#E85D6F]'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {preference.enabled ? (
        <div className="space-y-4">
          {/* Preferred Time & Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Preferred Time */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
              <label htmlFor="pref-time" className="text-xs text-[#85878C] flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#B5122B]" />
                <span>زمان یادآوری</span>
              </label>
              <input
                id="pref-time"
                type="time"
                value={preference.preferredTime}
                onChange={(e) => handleUpdate({ preferredTime: e.target.value })}
                className="w-full bg-[#0a0a0c] border border-white/[0.08] focus:border-[#B5122B]/60 rounded-lg px-3 py-1.5 text-xs text-[#E8E8E6] font-mono focus:outline-none transition-all"
              />
              <span className="text-[10px] text-[#85878C]/70 block">
                پیشنهاد: ساعتی که معمولاً ذهن شما برای مرور روز خلوت‌تر است.
              </span>
            </div>

            {/* Timezone */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
              <label htmlFor="pref-tz" className="text-xs text-[#85878C] flex items-center gap-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-[#B5122B]" />
                <span>منطقه زمانی</span>
              </label>
              <select
                id="pref-tz"
                value={preference.timezone}
                onChange={(e) => handleUpdate({ timezone: e.target.value })}
                className="w-full bg-[#0a0a0c] border border-white/[0.08] focus:border-[#B5122B]/60 rounded-lg px-2.5 py-1.5 text-xs text-[#E8E8E6] focus:outline-none transition-all cursor-pointer"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value} className="bg-[#111214] text-white">
                    {tz.label}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[#85878C]/70 block">
                محاسبه تاریخ روزانه و پایان هفته بر مبنای این زمان انجام می‌شود.
              </span>
            </div>
          </div>

          {/* Active Days of Week */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <span className="text-xs text-[#85878C] flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#B5122B]" />
              <span>روزهای فعال</span>
            </span>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {DAYS_OF_WEEK.map((d) => {
                const isActive = preference.activeDays.includes(d.dayIndex);
                return (
                  <button
                    key={d.dayIndex}
                    type="button"
                    onClick={() => toggleDay(d.dayIndex)}
                    disabled={isSaving}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#B5122B]/20 text-[#E85D6F] border border-[#B5122B]/40'
                        : 'bg-white/[0.02] text-[#85878C] border border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Daily Action */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#E8E8E6] font-medium block">یادآوری اقدام روز</span>
                <span className="text-[10px] text-[#85878C]">در صورت انجام نشدن گام امروز</span>
              </div>
              <button
                type="button"
                onClick={() => handleUpdate({ dailyActionEnabled: !preference.dailyActionEnabled })}
                disabled={isSaving}
                className="cursor-pointer"
              >
                {preference.dailyActionEnabled ? (
                  <ToggleRight className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-[#85878C]" />
                )}
              </button>
            </div>

            {/* Weekly Reflection */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#E8E8E6] font-medium block">مرور هفتگی</span>
                <span className="text-[10px] text-[#85878C]">در پایان بازه هفته</span>
              </div>
              <button
                type="button"
                onClick={() => handleUpdate({ weeklyReflectionEnabled: !preference.weeklyReflectionEnabled })}
                disabled={isSaving}
                className="cursor-pointer"
              >
                {preference.weeklyReflectionEnabled ? (
                  <ToggleRight className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-[#85878C]" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-center text-xs text-[#85878C] space-y-1">
          <p>یادآوری‌ها در حال حاضر خاموش هستند.</p>
          <p className="text-[11px] text-[#85878C]/70">
            می‌توانید هر زمان که مایل بودید، آن‌ها را فعال کنید تا در ساعت دلخواهتان شما را به مسیر بازگرداند.
          </p>
        </div>
      )}
    </section>
  );
};
