import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  CompanionMessage,
  CoachingSuggestion,
  GrowthInsight,
  CompanionContextData,
} from '../lib/companion/coachEngine';

interface CompanionContextType {
  messages: CompanionMessage[];
  isTyping: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
  suggestions: CoachingSuggestion[];
  insights: GrowthInsight[];
  hasUnread: boolean;
  markAsRead: () => void;
}

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

export const CompanionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, growthProfile, authFetch, currentRoute, navigate } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [suggestions, setSuggestions] = useState<CoachingSuggestion[]>([]);

  // Storage key based on user status
  const storageKey = user ? `nextyou_companion_history_${user.id}` : 'nextyou_companion_history_visitor';

  const [messages, setMessages] = useState<CompanionMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }

    if (user) {
      return [
        {
          id: 'welcome_auth_init',
          sender: 'companion',
          text: `سلام، من دستیار رشد تو در NEXT YOU هستم.\n\nمن همگام با مسیر رشد شما، مأموریت‌های روزانه و شاخص‌های انضباط و تمرکزتان فعالیت می‌کنم. هر زمان نیاز به تصمیم‌گیری شفاف، غلبه بر خستگی اراده یا ساخت روتین مؤثر داشتی، در کنارت هستم.`,
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ];
    }

    return [
      {
        id: 'welcome_visitor_init',
        sender: 'companion',
        text: `سلام، من دستیار همراه رشد در NEXT YOU هستم.\n\nاینجا کمکت می‌کنم پتانسیل فردی‌ات را کشف کنی و با سیستم‌های انضباط شخصی، تمرکز عمیق و عادت‌های ماندگار، نسخه بهتری از خودت بسازی. مایلید اولین قدم را با ارزیابی ۳ دقیقه‌ای خودشناسی شروع کنید؟`,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        action: {
          label: 'شروع ارزیابی خودشناسی',
          route: '/register',
        },
      },
    ];
  });

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }, [messages, storageKey]);

  // Fetch dynamic, context-aware quick prompts
  useEffect(() => {
    let isMounted = true;
    async function loadPrompts() {
      try {
        const res = await authFetch('/api/coach/context');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.quickPrompts)) {
          setSuggestions(
            data.quickPrompts.map((p: any) => ({
              id: p.id,
              label: p.label,
              prompt: p.prompt,
              category: 'پیشنهادی',
            }))
          );
        }
      } catch (err) {
        console.error('Error loading coach quick prompts:', err);
      }
    }

    loadPrompts();
    return () => {
      isMounted = false;
    };
  }, [authFetch, user, currentRoute]);

  // On first login, ensure welcome message appears
  useEffect(() => {
    if (!user) return;
    const greetedKey = `nextyou_first_login_greeted_${user.id}`;
    const alreadyGreeted = localStorage.getItem(greetedKey);

    if (!alreadyGreeted) {
      localStorage.setItem(greetedKey, 'true');
      const welcomeMsg: CompanionMessage = {
        id: `welcome_${Date.now()}`,
        sender: 'companion',
        text: `سلام، من دستیار رشد تو در NEXT YOU هستم.\n\nپروفایل شما ثبت شد و مأموریت‌های اختصاصی بر پایه اهدافتان («${user.onboardingGoals?.join('، ') || 'انضباط و تمرکز'}») تنظیم شده است. من در تمام صفحات همراه شما خواهم بود تا با هم پایداری این مسیر را تضمین کنیم.`,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        action: {
          label: 'مشاهده داشبورد رشد',
          route: '/dashboard',
        },
      };

      setMessages((prev) => {
        if (prev.some((m) => m.text.includes('سلام، من دستیار رشد تو در NEXT YOU هستم.'))) {
          return prev;
        }
        return [welcomeMsg, ...prev];
      });
      setHasUnread(true);
    }
  }, [user]);

  // Contextual route awareness
  useEffect(() => {
    if (user && currentRoute === '/growth-profile') {
      const growthKey = `nextyou_growth_profile_companion_${user.id}`;
      try {
        if (!sessionStorage.getItem(growthKey)) {
          sessionStorage.setItem(growthKey, 'true');
          const profileMsg: CompanionMessage = {
            id: `gp_${Date.now()}`,
            sender: 'companion',
            text: `حالا که تصویر اولیه‌ای از وضعیتت داریم، می‌تونیم ببینیم کدوم مسیر برایت مناسب‌تره.\n\nمن شاخص‌های ۴ گانه تو رو بررسی کردم. هر سؤالی درباره نقطه قوت یا فرصت رشدت داری، همین‌جا بپرس.`,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, profileMsg]);
          setHasUnread(true);
        }
      } catch {
        // Ignore
      }
    } else if (user && currentRoute === '/growth-path') {
      const pathKey = `nextyou_growth_path_companion_${user.id}`;
      try {
        if (!sessionStorage.getItem(pathKey)) {
          sessionStorage.setItem(pathKey, 'true');
          const pathMsg: CompanionMessage = {
            id: `path_${Date.now()}`,
            sender: 'companion',
            text: `امروز لازم نیست کل مسیر رو جلو ببری.\nفقط قدم بعدی رو انجام بده. قدم‌های کوچک اما پیوسته، پایدارترین سیستم‌ها رو می‌سازن.`,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, pathMsg]);
          setHasUnread(true);
        }
      } catch {
        // Ignore
      }
    }
  }, [user, currentRoute]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setHasUnread(false);
      return next;
    });
  }, []);

  const markAsRead = useCallback(() => {
    setHasUnread(false);
  }, []);

  const clearHistory = useCallback(() => {
    const fresh: CompanionMessage[] = user
      ? [
          {
            id: `init_${Date.now()}`,
            sender: 'companion',
            text: `سلام، من مربی رشد تو در NEXT YOU هستم. تمام تاریخچه گفتگو بازنشانی شد. چطور می‌توانم در تمرکز یا انضباط امروز به تو کمک کنم؟`,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          },
        ]
      : [
          {
            id: `init_${Date.now()}`,
            sender: 'companion',
            text: `سلام، من راهنمای NEXT YOU هستم. چه سؤالی درباره متدولوژی رشد یا شروع ارزیابی داری؟`,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            action: {
              label: 'شروع ارزیابی',
              route: '/register',
            },
          },
        ];
    setMessages(fresh);
    try {
      localStorage.setItem(storageKey, JSON.stringify(fresh));
    } catch {
      // Ignore
    }
  }, [user, storageKey]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: CompanionMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const historyPayload = messages.slice(-6).map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

        const res = await authFetch('/api/coach/chat', {
          method: 'POST',
          body: JSON.stringify({
            message: trimmed,
            history: historyPayload,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.response) {
          const companionMsg: CompanionMessage = {
            id: `companion_${Date.now()}`,
            sender: 'companion',
            text: data.response.text,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            action: data.response.action,
          };
          setMessages((prev) => [...prev, companionMsg]);
        } else {
          const errMsg: CompanionMessage = {
            id: `companion_err_${Date.now()}`,
            sender: 'companion',
            text: data.error || 'خطا در برقراری ارتباط با مربی رشد. لطفاً لحظاتی بعد مجدداً تلاش کنید.',
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, errMsg]);
        }
      } catch (err) {
        console.error('Error sending message to coach:', err);
        const errMsg: CompanionMessage = {
          id: `companion_err_${Date.now()}`,
          sender: 'companion',
          text: 'خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsTyping(false);
        if (!isOpen) {
          setHasUnread(true);
        }
      }
    },
    [authFetch, isOpen, messages]
  );

  return (
    <CompanionContext.Provider
      value={{
        messages,
        isTyping,
        isOpen,
        setIsOpen,
        toggleOpen,
        sendMessage,
        clearHistory,
        suggestions,
        insights: [],
        hasUnread,
        markAsRead,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
};

export const useCompanion = (): CompanionContextType => {
  const context = useContext(CompanionContext);
  if (!context) {
    throw new Error('useCompanion must be used within a CompanionProvider');
  }
  return context;
};
