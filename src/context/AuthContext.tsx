import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SafeUser } from '../lib/domain/user.entity';

export interface OnboardingSubmitPayload {
  name: string;
  primaryGoal: string;
  mainObstacle: string;
  availableTime: string;
  consistencyPattern: string;
  desiredSupport: string;
  futureSelfVision: string;
}

export interface GrowthProfile {
  discipline: number;
  focus: number;
  confidence: number;
  recommendedPath: string | { slug?: string; title?: string; tagline?: string; description?: string; targetTrait?: string; keyPractices?: string[] };
}

interface AuthContextType {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentRoute: string;
  growthProfile: GrowthProfile | null;
  setGrowthProfile: (profile: GrowthProfile) => void;
  navigate: (route: string) => void;
  login: (identifier: string, credential?: string, isOtp?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name?: string;
    identifier?: string;
    email?: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string> }>;
  checkIdentifier: (identifier: string) => Promise<{ success: boolean; exists: boolean; name?: string | null; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  submitOnboarding: (
    data: OnboardingSubmitPayload
  ) => Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string> }>;
  submitAssessment: (
    answers: Record<string, string>
  ) => Promise<{
    success: boolean;
    authenticated: boolean;
    result?: any;
    growthProfile?: GrowthProfile;
    error?: string;
    redirectTo?: string;
  }>;
  refreshSession: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dynamic Growth Profile state, persisted in localStorage
  const [growthProfile, setGrowthProfileState] = useState<GrowthProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nextyou_growth_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return {
      discipline: 78,
      focus: 84,
      confidence: 82,
      recommendedPath: 'مسیر روتین‌های غیرقابل‌شکست (Unbreakable Daily Habits)',
    };
  });

  const setGrowthProfile = useCallback((profile: GrowthProfile) => {
    setGrowthProfileState(profile);
    try {
      localStorage.setItem('nextyou_growth_profile', JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, []);

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const navigate = useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentRoute(path);
      // Instant reset to top on route change to prevent competing animation with Lenis
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /**
   * Helper that injects Authorization Bearer Header & credentials: 'include'
   * Guarantees session persistence across iFrames, mobile browsers, and page refreshes.
   */
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(options.headers || {});
      if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('nextyou_session_token') : null;
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('x-session-token', token);
      }

      return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    },
    []
  );

  // Fetch session on initial load and keep alive
  const refreshSession = useCallback(async () => {
    try {
      const res = await authFetch('/api/auth/me', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
          localStorage.removeItem('nextyou_session_token');
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Session verification request failed:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const handlePostAuthRedirect = async (userObj: SafeUser, token?: string) => {
    let savedAnswers: Record<string, string> | null = null;
    try {
      const savedStr = localStorage.getItem('nextyou_assessment_answers');
      if (savedStr) {
        savedAnswers = JSON.parse(savedStr);
      }
    } catch {
      // Ignore
    }

    if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      const sessionToken = token || localStorage.getItem('nextyou_session_token');
      const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (sessionToken) {
        authHeaders['Authorization'] = `Bearer ${sessionToken}`;
        authHeaders['x-session-token'] = sessionToken;
      }

      try {
        const submitRes = await fetch('/api/assessment/submit', {
          method: 'POST',
          headers: authHeaders,
          credentials: 'include',
          body: JSON.stringify({ answers: savedAnswers }),
        });
        const submitData = await submitRes.json();
        if (submitData.growthProfile) {
          setGrowthProfile(submitData.growthProfile);
        }
      } catch (err) {
        console.warn('Failed to submit pre-saved guest assessment:', err);
      }

      try {
        await fetch('/api/auth/complete-onboarding', {
          method: 'POST',
          headers: authHeaders,
          credentials: 'include',
        });
      } catch (err) {
        console.warn('Failed to mark onboarding complete:', err);
      }

      // Seamlessly land on dashboard
      navigate('/dashboard');
      return;
    }

    if (!userObj.onboardingCompleted) {
      navigate('/onboarding');
    } else if (!userObj.hasCompletedAssessment) {
      navigate('/assessment/initial');
    } else {
      navigate('/dashboard');
    }
  };

  const login = async (identifier: string, credential?: string, isOtp: boolean = false) => {
    try {
      const payload = {
        identifier,
        password: isOtp ? undefined : credential,
        otpCode: isOtp ? credential : undefined,
      };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'اطلاعات ورود صحیح نیست.',
        };
      }

      if (data.sessionToken) {
        localStorage.setItem('nextyou_session_token', data.sessionToken);
      }

      setUser(data.user);
      await handlePostAuthRedirect(data.user, data.sessionToken);

      return { success: true };
    } catch (err) {
      console.error('Login network error:', err);
      return {
        success: false,
        error: 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.',
      };
    }
  };

  const register = async (data: {
    name?: string;
    identifier?: string;
    email?: string;
    password: string;
  }) => {
    try {
      const payload = {
        identifier: data.identifier || data.email,
        name: data.name,
        password: data.password,
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const resData = await res.json();

      if (!res.ok || !resData.success) {
        return {
          success: false,
          error: resData.error || 'خطا در ساخت حساب کاربری.',
          fieldErrors: resData.fieldErrors,
        };
      }

      if (resData.sessionToken) {
        localStorage.setItem('nextyou_session_token', resData.sessionToken);
      }

      setUser(resData.user);
      await handlePostAuthRedirect(resData.user, resData.sessionToken);

      return { success: true };
    } catch (err) {
      console.error('Register network error:', err);
      return {
        success: false,
        error: 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.',
      };
    }
  };

  const checkIdentifier = async (identifier: string) => {
    try {
      const res = await fetch('/api/auth/check-identifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return {
          success: true,
          exists: Boolean(data.exists),
          name: data.name || null,
        };
      }
      return {
        success: false,
        exists: false,
        error: data.error || 'خطا در بررسی حساب.',
      };
    } catch (err) {
      console.error('Check identifier network error:', err);
      return {
        success: false,
        exists: false,
        error: 'خطا در برقراری ارتباط با سرور.',
      };
    }
  };

  const logout = async () => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      localStorage.removeItem('nextyou_session_token');
      localStorage.removeItem('nextyou_assessment_answers');
      setUser(null);
      navigate('/');
    }
  };

  const submitOnboarding = async (data: OnboardingSubmitPayload) => {
    try {
      const res = await authFetch('/api/onboarding/complete', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const resData = await res.json();

      if (!res.ok || !resData.success) {
        return {
          success: false,
          error: resData.error || 'خطا در ذخیره‌سازی اطلاعات آشنایی.',
          fieldErrors: resData.fieldErrors,
        };
      }

      setUser(resData.user);
      navigate(resData.redirectTo || '/assessment/initial');
      return { success: true };
    } catch (err) {
      console.error('Submit onboarding network error:', err);
      return {
        success: false,
        error: 'خطا در برقراری ارتباط با سرور.',
      };
    }
  };

  const submitAssessment = async (answers: Record<string, string>) => {
    try {
      const res = await authFetch('/api/assessment/submit', {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
      const resData = await res.json();

      if (!res.ok || !resData.success) {
        return {
          success: false,
          authenticated: resData.authenticated !== false,
          error: resData.error || 'خطا در ثبت و تحلیل ارزیابی.',
        };
      }

      if (resData.growthProfile) {
        setGrowthProfile(resData.growthProfile);
      }

      return {
        success: true,
        authenticated: true,
        result: resData.result,
        growthProfile: resData.growthProfile,
        redirectTo: resData.redirectTo || '/growth-profile',
      };
    } catch (err) {
      console.error('Submit assessment network error:', err);
      return {
        success: false,
        authenticated: true,
        error: 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.',
      };
    }
  };

  const completeOnboarding = async () => {
    try {
      const res = await authFetch('/api/auth/complete-onboarding', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      }
      navigate('/assessment/initial');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      navigate('/assessment/initial');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        currentRoute,
        growthProfile,
        setGrowthProfile,
        navigate,
        login,
        register,
        checkIdentifier,
        logout,
        completeOnboarding,
        submitOnboarding,
        submitAssessment,
        refreshSession,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
