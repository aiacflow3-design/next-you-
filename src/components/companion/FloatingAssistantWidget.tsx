import React, { useState, useRef, useEffect } from 'react';
import { Compass, X, Send, Maximize2, RotateCcw, ArrowLeft, Shield } from 'lucide-react';
import { useCompanion } from '../../context/CompanionContext';
import { useAuth } from '../../context/AuthContext';

export const FloatingAssistantWidget: React.FC = () => {
  const {
    messages,
    isTyping,
    isOpen,
    toggleOpen,
    sendMessage,
    clearHistory,
    suggestions,
    hasUnread,
    markAsRead,
  } = useCompanion();

  const { user, navigate, currentRoute } = useAuth();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      markAsRead();
    }
  }, [messages, isOpen, isTyping, markAsRead]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt);
  };

  // If user is already on the dedicated /coach page, hide the floating panel or minimize it to avoid duplicate UI
  const isOnCoachPage = currentRoute === '/coach';

  return (
    <aside aria-label="دستیار همراه رشد NEXT YOU" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none">
      {/* Floating Chat Modal / Drawer */}
      {isOpen && !isOnCoachPage && (
        <div
          className="mb-3.5 w-[calc(100vw-2.5rem)] sm:w-[410px] h-[540px] max-h-[82vh] rounded-2xl bg-[#0c0d10]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(181,18,43,0.12)] flex flex-col overflow-hidden transition-all duration-300 animate-fadeIn"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-[#B5122B]/15 border border-[#B5122B]/35 flex items-center justify-center text-[#B5122B]">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#0c0d10]" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#E8E8E6] tracking-tight">
                    مربی همراه رشد
                  </span>
                  <span className="text-[9px] font-mono text-[#B5122B]">
                    · NEXT YOU
                  </span>
                </div>
                <p className="text-[10px] text-[#85878C]">
                  {user ? `همگام با مسیر رشد ${user.name || ''}` : 'راهنمای هوشمند سیستم رشد شخصی'}
                </p>
              </div>
            </div>

            {/* Actions: Open full Coach page, Reset, Close */}
            <div className="flex items-center gap-1 text-[#85878C]">
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    toggleOpen();
                    navigate('/coach');
                  }}
                  title="باز کردن صفحه کامل مربی رشد"
                  className="p-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={clearHistory}
                title="پاکسازی گفتگو"
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={toggleOpen}
                title="بستن"
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 text-right">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#B5122B] text-white rounded-br-xs shadow-[0_4px_16px_rgba(181,18,43,0.3)]'
                        : 'bg-[#15161b] text-[#E8E8E6] border border-white/[0.06] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line font-normal typography-body-sm leading-relaxed">{msg.text}</p>

                    {/* Action button if attached to message */}
                    {msg.action && (
                      <button
                        type="button"
                        onClick={() => {
                          toggleOpen();
                          navigate(msg.action!.route);
                        }}
                        className="mt-3 w-full py-2 px-3 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 typography-label text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>{msg.action.label}</span>
                        <ArrowLeft className="w-3 h-3 text-[#B5122B]" />
                      </button>
                    )}
                  </div>
                  <span className="text-[9px] text-[#55575c] mt-1 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-xl bg-[#15161b] border border-white/[0.06] w-fit">
                <span className="w-1.5 h-1.5 bg-[#B5122B] rounded-full animate-bounce" />
                <span
                  className="w-1.5 h-1.5 bg-[#B5122B] rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-1.5 h-1.5 bg-[#B5122B] rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 border-t border-white/[0.04] bg-[#090a0d]/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {suggestions.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSuggestionClick(item.prompt)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-[#B5122B]/15 border border-white/[0.06] hover:border-[#B5122B]/30 text-[10px] text-[#85878C] hover:text-white transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-white/[0.06] bg-[#0f1014] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="سؤال یا چالش رشد خود را بنویسید..."
              className="flex-1 bg-white/[0.03] border border-white/[0.08] focus:border-[#B5122B]/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#55575c] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-[#B5122B] hover:bg-[#c91833] disabled:opacity-40 disabled:hover:bg-[#B5122B] text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(181,18,43,0.35)] shrink-0"
            >
              <Send className="w-3.5 h-3.5 rotate-180" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (Always visible bottom-right) */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="دستیار همراه رشد"
        className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.7)] ${
          isOpen
            ? 'bg-[#141519] border-white/20 text-white'
            : 'bg-[#0f1013]/90 hover:bg-[#141519] border-white/[0.1] hover:border-[#B5122B]/40 text-[#E8E8E6] hover:shadow-[0_0_25px_rgba(181,18,43,0.25)]'
        }`}
      >
        {/* Soft Crimson Ambient Breathing Light */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#B5122B]/20 to-transparent blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Minimal Icon with subtle status dot */}
        <div className="relative flex items-center justify-center">
          <Compass className="w-4 h-4 text-[#B5122B] transition-transform group-hover:scale-105" />
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B5122B] beacon-indicator" />
          )}
        </div>

        {/* Minimal Text Label */}
        <span className="text-xs font-medium tracking-tight text-[#E8E8E6]">
          {isOpen ? 'بستن مربی' : 'مربی رشد'}
        </span>

        {/* Unread indicator badge */}
        {hasUnread && !isOpen && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        )}
      </button>
    </aside>
  );
};
