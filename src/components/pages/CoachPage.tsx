import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Compass,
  Flame,
  Shield,
  Lightbulb,
  CheckCircle2,
  Brain,
  Clock,
  Target,
} from 'lucide-react';
import { useCompanion } from '../../context/CompanionContext';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';

export const CoachPage: React.FC = () => {
  const { user, logout, navigate, growthProfile } = useAuth();
  const {
    messages,
    isTyping,
    sendMessage,
    clearHistory,
    suggestions,
    insights,
  } = useCompanion();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    sendMessage(inputVal.trim());
    setInputVal('');
  };

  const handleSuggestion = (prompt: string) => {
    sendMessage(prompt);
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'همراه گرامی';
  const rawPath = growthProfile?.recommendedPath;
  const pathTitle =
    typeof rawPath === 'object' && rawPath !== null
      ? (rawPath as any).title || 'مسیر عادات پایدار'
      : typeof rawPath === 'string' && rawPath
      ? rawPath
      : 'مسیر عادات پایدار';
  const dailyTime = user?.onboardingDailyTime || '۲۰ الی ۳۰ دقیقه';

  return (
    <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
      <main className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header Navigation */}
        <header className="w-full border-b border-white/[0.06] pb-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-[#85878C] hover:text-white transition-all flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>داشبورد</span>
            </button>
            <div className="h-5 w-px bg-white/[0.08]" />
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Logo size="sm" />
            </div>
            <div className="h-5 w-px bg-white/[0.08] hidden sm:block" />
            <span className="text-xs font-semibold text-[#85878C] hidden sm:inline">
              مربی رشد هوشمند
            </span>
          </div>

          {/* User Status Pills */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141519] border border-white/[0.08] text-xs">
              <Compass className="w-3.5 h-3.5 text-[#B5122B]" />
              <span className="text-[#85878C]">مسیر فعال:</span>
              <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
                {pathTitle}
              </span>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#141519] border border-white/[0.08] text-xs font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-bold">۵ روز استمرار</span>
            </div>

            <button
              type="button"
              onClick={clearHistory}
              title="شروع مجدد مکالمه"
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-[#85878C] hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Main Two-Column Coaching Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          {/* Main Column: Interactive Conversation Stream (8 cols) */}
          <section className="lg:col-span-8 flex flex-col h-[680px] rounded-2xl bg-[#0d0e12]/80 backdrop-blur-xl border border-white/[0.06] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
            {/* Conversation Header */}
            <div className="p-4 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B5122B]/15 border border-[#B5122B]/35 flex items-center justify-center text-[#B5122B]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>مربی رشد اختصاصی</span>
                    <span className="text-[10px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      همگام با پروفایل رشد
                    </span>
                  </h1>
                  <p className="text-xs text-[#85878C]">
                    تحلیل انضباط، تمرکز و راهکارهای غلبه بر اصطکاک‌های روزانه
                  </p>
                </div>
              </div>
            </div>

            {/* Conversation Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 text-right">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#B5122B] text-white rounded-br-xs shadow-[0_4px_20px_rgba(181,18,43,0.35)]'
                          : 'bg-[#14151a] text-[#E8E8E6] border border-white/[0.07] rounded-bl-xs shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line font-normal">{msg.text}</div>

                      {msg.action && (
                        <button
                          type="button"
                          onClick={() => navigate(msg.action!.route)}
                          className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span>{msg.action.label}</span>
                          <ArrowLeft className="w-3.5 h-3.5 text-[#B5122B]" />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-[#55575c] mt-1.5 px-2 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#14151a] border border-white/[0.06] w-fit">
                  <span className="w-2 h-2 bg-[#B5122B] rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-[#B5122B] rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-[#B5122B] rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                  <span className="text-xs text-[#85878C] mr-2">مربی در حال بررسی وضعیت...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips Above Input */}
            <div className="px-4 py-2.5 border-t border-white/[0.04] bg-[#090a0d]/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] text-[#6b6d72] shrink-0">پیشنهادات سریع:</span>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSuggestion(item.prompt)}
                  disabled={isTyping}
                  className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-[#B5122B]/15 border border-white/[0.06] hover:border-[#B5122B]/35 text-xs text-[#85878C] hover:text-white transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 border-t border-white/[0.06] bg-[#0c0d10] flex items-center gap-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="از مربی خود درباره انضباط شخصی، تمرکز یا موانع امروز بپرسید..."
                className="flex-1 bg-white/[0.03] border border-white/[0.08] focus:border-[#B5122B]/50 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-[#55575c] outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="px-5 py-3 rounded-xl bg-[#B5122B] hover:bg-[#c91833] disabled:opacity-40 disabled:hover:bg-[#B5122B] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(181,18,43,0.35)] shrink-0"
              >
                <span>ارسال</span>
                <Send className="w-3.5 h-3.5 rotate-180" />
              </button>
            </form>
          </section>

          {/* Sidebar Column: Growth Insights & Personalized Suggestions (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* 1. Growth Insights Card */}
            <div className="p-5 rounded-2xl bg-[#0d0e12]/80 backdrop-blur-xl border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Lightbulb className="w-4 h-4 text-[#B5122B]" />
                  <span>بینش‌های عمیق رشد (Insights)</span>
                </div>
                <span className="text-[10px] font-mono text-[#85878C]">اختصاصی شما</span>
              </div>

              <div className="space-y-3">
                {insights.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-all space-y-2 text-right"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white tracking-tight">
                        {ins.title}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-[#B5122B]/15 text-[#B5122B] font-mono">
                        {ins.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#85878C] leading-relaxed">
                      {ins.description}
                    </p>
                    <div className="pt-1 border-t border-white/[0.04] flex items-start gap-1.5 text-[10px] text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{ins.actionableStep}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Active Profile Summary Card */}
            <div className="p-5 rounded-2xl bg-[#0d0e12]/80 backdrop-blur-xl border border-white/[0.06] space-y-3.5 text-right">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Brain className="w-4 h-4 text-[#B5122B]" />
                  <span>شاخص‌های شناختی ارزیابی</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                  <span className="text-[10px] text-[#85878C] block">تمرکز</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {growthProfile?.focus ?? 84}٪
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                  <span className="text-[10px] text-[#85878C] block">انضباط</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {growthProfile?.discipline ?? 78}٪
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                  <span className="text-[10px] text-[#85878C] block">اعتماد به نفس</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {growthProfile?.confidence ?? 82}٪
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#85878C]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B5122B]" />
                    <span>تعهد زمانی روزانه:</span>
                  </span>
                  <span className="text-white font-medium">{dailyTime}</span>
                </div>
                <div className="flex items-center justify-between text-[#85878C]">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#B5122B]" />
                    <span>اهداف کلیدی:</span>
                  </span>
                  <span className="text-white font-medium truncate max-w-[170px]">
                    {user?.onboardingGoals?.join('، ') || 'تمرکز و انضباط'}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
