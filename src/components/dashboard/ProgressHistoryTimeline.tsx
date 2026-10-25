import React from 'react';
import { History, TrendingUp, CheckCircle, Sparkles, Calendar } from 'lucide-react';

interface TimelineEvent {
  id: string;
  timeLabel: string;
  title: string;
  description: string;
  metricGain: string;
  isMilestone?: boolean;
}

const EVENTS: TimelineEvent[] = [
  {
    id: 'ev-1',
    timeLabel: 'امروز',
    title: 'تکمیل جلسه کار عمیق ۲۵ دقیقه‌ای بدون نویز',
    description: 'تمرکز مطلق روی اولویت شماره یک کاری بدون دست زدن به شبکه‌های اجتماعی.',
    metricGain: '+۱.۰٪ رشد مرکب',
  },
  {
    id: 'ev-2',
    timeLabel: 'دیروز',
    title: 'پایبندی به ساعت خاموشی و آمادگی خواب',
    description: 'تنظیم محیط اتاق خواب و خاموش کردن ابزارهای دیجیتال ۴۵ دقیقه قبل از خواب.',
    metricGain: '+۱.۰٪ نظم زیستی',
  },
  {
    id: 'ev-3',
    timeLabel: '۳ روز پیش',
    title: 'تثبیت ۲ عادت لنگرگاهی صبحگاهی',
    description: 'نوشیدن آب و ۵ دقیقه یادداشت‌برداری بلافاصله پس از بیداری بدون وقفه.',
    metricGain: '+۱.۲٪ پایداری',
  },
  {
    id: 'ev-4',
    timeLabel: '۵ روز پیش',
    title: 'تکمیل ارزیابی ۴ بعدی و ترسیم ماتریس نقاط قوت',
    description: 'شناسایی ریشه کمال‌گرایی منفی و انتخاب اولین مسیر تحول فردی در NEXT YOU.',
    metricGain: '+۲.۵٪ جهش شناخت',
    isMilestone: true,
  },
  {
    id: 'ev-5',
    timeLabel: '۷ روز پیش',
    title: 'شروع سفر تحول و ثبت‌نام در NEXT YOU',
    description: 'تعیین اهداف اولیه تمرکز و تعهد به روزانه ۱۵ دقیقه رشد فردی پیوسته.',
    metricGain: 'نقطه عطف شروع',
    isMilestone: true,
  },
];

export const ProgressHistoryTimeline: React.FC = () => {
  return (
    <div className="w-full p-6 sm:p-7 rounded-2xl bg-[#0E0F12]/80 border border-white/[0.08] shadow-[0_15px_40px_rgba(0,0,0,0.5)] select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/[0.06] pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#B5122B]/15 text-[#B5122B] flex items-center justify-center border border-[#B5122B]/30">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8E8E6] tracking-tight">
              تاریخچه پیشرفت و اثر مرکب (Progress History)
            </h3>
            <p className="text-xs text-[#85878C]">
              ردپای گام‌های ملموس و نتایج تدریجی قانون ۱٪ رشد روزمره
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>مجموع رشد ثبت‌شده: +۶.۷٪</span>
        </div>
      </div>

      {/* Minimalist Timeline Thread */}
      <div className="relative pr-4 space-y-6 before:absolute before:right-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-[#B5122B] before:via-white/10 before:to-transparent">
        {EVENTS.map((event) => {
          return (
            <div key={event.id} className="relative pr-6 group">
              {/* Timeline Node Point */}
              <div
                className={`absolute right-[-4.5px] top-1.5 w-3 h-3 rounded-full border-2 transition-transform duration-200 group-hover:scale-125 ${
                  event.isMilestone
                    ? 'bg-[#B5122B] border-[#B5122B] shadow-[0_0_10px_rgba(181,18,43,0.8)]'
                    : 'bg-[#151619] border-white/30'
                }`}
              />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#85878C] bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                      {event.timeLabel}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#E8E8E6] tracking-tight">
                      {event.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#85878C] leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded shrink-0 self-start sm:self-center border ${
                    event.isMilestone
                      ? 'bg-[#B5122B]/15 text-red-200 border-[#B5122B]/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {event.metricGain}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
