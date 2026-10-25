import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Target,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Compass,
  Zap,
  Repeat,
  Shield,
  Check,
} from 'lucide-react';
import { AssessmentResultData, ASSESSMENT_CATEGORIES } from './assessmentData';
import { useAuth } from '../../context/AuthContext';

interface AssessmentResultViewProps {
  result: AssessmentResultData;
  onRestart: () => void;
  onSaveAndFinish?: () => void;
}

export const AssessmentResultView: React.FC<AssessmentResultViewProps> = ({
  result,
  onRestart,
  onSaveAndFinish,
}) => {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    if (onSaveAndFinish) {
      setTimeout(() => {
        onSaveAndFinish();
      }, 600);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-right select-none py-2">
      {/* Top Header Badge */}
      <div className="text-center">
        <span className="text-[11px] font-mono tracking-widest text-[#B5122B] uppercase mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5122B]/10 border border-[#B5122B]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>پیش‌نمایش نتایج ارزیابی • RESULT PREVIEW</span>
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E8E8E6] tracking-tight leading-snug mb-2">
          گزارش و نقشه مسیر رشد اختصاصی تو
        </h1>

        <p className="text-xs sm:text-sm text-[#85878C] max-w-lg mx-auto leading-relaxed">
          تحلیل ۵ بُعد کلیدی: نظم شخصی، تمرکز، اعتماد به نفس، ساخت عادت‌ها و سبک زندگی.
        </p>
      </div>

      {/* 1. GROWTH PROFILE (پروفایل رشد) */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#141518] to-[#0E0F12] border border-white/[0.09] shadow-[0_15px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Subtle Ambient Red Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B5122B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-white/[0.06] pb-6 mb-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-sans font-semibold tracking-wider text-[#B5122B] uppercase">
              پروفایل و تیپ عملکردی شما
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#E8E8E6] tracking-tight">
              {result.archetypeTitle}
            </h2>
            <p className="text-xs text-[#85878C] leading-relaxed max-w-md">
              {result.archetypeTagline}
            </p>
          </div>

          {/* Readiness Score Gauge */}
          <div className="flex items-center gap-3.5 self-end sm:self-center shrink-0 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-left font-mono">
              <span className="text-2xl font-extrabold text-[#E8E8E6] block leading-none">
                {result.readinessScore}%
              </span>
              <span className="text-[10px] text-[#85878C]">شاخص آمادگی رشد</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#B5122B]/15 text-[#B5122B] flex items-center justify-center border border-[#B5122B]/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 5 Category Breakdown Progress Bars */}
        <div className="space-y-3.5">
          <span className="text-xs font-semibold text-[#85878C] block mb-1">
            وضعیت شاخص‌های ۵ بُعد ارزیابی:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ASSESSMENT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const score = result.categoryScores[cat.key];

              return (
                <div key={cat.key} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#C7C9CC] flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-[#B5122B]" />
                      <span className="text-[11px] font-medium">{cat.title}</span>
                    </span>
                    <span className="font-mono text-[#85878C] text-xs">{score}%</span>
                  </div>

                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7F0D20] via-[#B5122B] to-[#E51E40] rounded-full transition-all duration-700"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. STRENGTHS (نقاط قوت) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#E8E8E6]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>نقاط قوت بنیادین تو (Strengths)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {result.strengths.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0E0F12]/80 border border-emerald-500/20 space-y-1.5 relative overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <h3 className="text-xs font-bold text-[#E8E8E6]">{s.title}</h3>
              </div>
              <p className="text-[11px] text-[#85878C] leading-relaxed line-clamp-3">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. IMPROVEMENT OPPORTUNITIES (فرصت‌های رشد و بهبود) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#E8E8E6]">
          <Target className="w-4 h-4 text-[#B5122B]" />
          <span>فرصت‌های رشد و بهبود (Improvement Opportunities)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {result.improvementOpportunities.map((opp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0E0F12]/80 border border-[#B5122B]/25 space-y-1.5 relative overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#B5122B]/15 text-[#B5122B] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                </div>
                <h3 className="text-xs font-bold text-[#E8E8E6]">{opp.title}</h3>
              </div>
              <p className="text-[11px] text-[#85878C] leading-relaxed line-clamp-3">
                {opp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RECOMMENDED FIRST GROWTH PATH (اولین مسیر رشد پیشنهادی) */}
      <div className="p-6 rounded-2xl bg-[#111215] border-2 border-[#B5122B]/40 shadow-[0_0_35px_rgba(181,18,43,0.18)] space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-mono tracking-widest text-[#B5122B] uppercase px-2.5 py-0.5 rounded-full bg-[#B5122B]/10 border border-[#B5122B]/20">
            اولین مسیر رشد پیشنهادی • RECOMMENDED GROWTH PATH
          </span>
          <span className="text-xs text-[#85878C] bg-white/[0.04] px-2.5 py-1 rounded-md">
            {result.recommendedFirstGrowthPath.durationLabel}
          </span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#E8E8E6] tracking-tight mb-1">
            {result.recommendedFirstGrowthPath.title}
          </h3>
          <p className="text-xs text-[#85878C] leading-relaxed">
            {result.recommendedFirstGrowthPath.subtitle}
          </p>
        </div>

        {/* 3 Milestones */}
        <div className="space-y-2 pt-1 border-t border-white/[0.06]">
          <span className="text-[11px] text-[#85878C] block">نقشه ۳ گام آغازین:</span>
          {result.recommendedFirstGrowthPath.milestones.map((milestone, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-xs text-[#C7C9CC] p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.03]"
            >
              <div className="w-4 h-4 rounded-full bg-[#B5122B]/20 text-[#B5122B] flex items-center justify-center shrink-0 text-[10px] font-mono font-bold">
                {idx + 1}
              </div>
              <span className="leading-snug">{milestone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Controls */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaved}
          className={`w-full sm:flex-1 py-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            isSaved
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
              : 'btn-primary-crimson shadow-[0_0_24px_rgba(181,18,43,0.35)]'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAuthenticated ? 'مسیر شما با موفقیت ثبت شد' : 'در حال انتقال به صفحه ثبت‌نام...'}</span>
            </>
          ) : (
            <>
              <span>{isAuthenticated ? 'تثبیت و ورود به داشبورد' : 'ذخیره نتیجه و ورود به داشبورد عملیات روزانه'}</span>
              <ArrowLeft className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto px-5 py-3.5 rounded-xl btn-secondary-glass text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer text-[#85878C] hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>انجام مجدد ارزیابی</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 text-center animate-fadeIn space-y-1">
          <p className="font-semibold">مسیر رشد فردی اختصاصی شما در سامانه ثبت شد.</p>
          <p className="text-[11px] text-emerald-300/80">
            تمامی مؤلفه‌های ۵ بُعد ارزیابی در پروفایل شما پیکربندی شده است.
          </p>
        </div>
      )}
    </div>
  );
};
