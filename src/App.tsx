/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AmbientBackground } from './components/ui/AmbientBackground';
import { Navbar } from './components/marketing/Navbar';
import { Hero } from './components/marketing/Hero';
import { FinalCta } from './components/marketing/FinalCta';
import { Footer } from './components/marketing/Footer';
import { AssessmentPreviewModal } from './components/assessment/AssessmentPreviewModal';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { OnboardingPage } from './components/pages/OnboardingPage';
import { InitialAssessmentPage } from './components/pages/InitialAssessmentPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { CoachPage } from './components/pages/CoachPage';
import { GrowthProfilePage } from './components/pages/GrowthProfilePage';
import { GrowthPathPage } from './components/pages/GrowthPathPage';
import { ActionDetailPage } from './components/pages/ActionDetailPage';
import { ProgressPage } from './components/pages/ProgressPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { WeeklyReflectionPage } from './components/pages/WeeklyReflectionPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { CompanionProvider } from './context/CompanionContext';
import { FloatingAssistantWidget } from './components/companion/FloatingAssistantWidget';
import { initScrollController } from './lib/scrollController';

function AppRouter() {
  const { currentRoute, isAuthenticated, user, navigate, isLoading } = useAuth();
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);

  // Initialize unified Lenis smooth scrolling with a single coordinated RAF loop
  useEffect(() => {
    return initScrollController();
  }, []);

  // Centralized route protection and redirects
  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      // If user visits /login, /register, or /auth while logged in
      if (currentRoute === '/login' || currentRoute === '/register' || currentRoute === '/auth') {
        if (!user?.onboardingCompleted) {
          navigate('/onboarding');
        } else if (!user?.hasCompletedAssessment) {
          navigate('/assessment/initial');
        } else {
          navigate('/dashboard');
        }
      }
      // If user has already completed onboarding, do not show onboarding again
      else if (user?.onboardingCompleted && currentRoute === '/onboarding') {
        navigate('/assessment/initial');
      }
      // If user has not completed onboarding and tries to visit assessment, dashboard, coach, growth-profile, or settings, redirect to onboarding
      else if (
        !user?.onboardingCompleted &&
        (currentRoute === '/assessment' ||
          currentRoute === '/assessment/initial' ||
          currentRoute.startsWith('/dashboard') ||
          currentRoute === '/coach' ||
          currentRoute === '/growth-profile' ||
          currentRoute === '/growth-path' ||
          currentRoute === '/progress' ||
          currentRoute === '/settings')
      ) {
        navigate('/onboarding');
      }
    }
  }, [isLoading, isAuthenticated, currentRoute, user, navigate]);

  const handleOpenAssessment = () => {
    setAssessmentModalOpen(true);
  };

  const handleCloseAssessment = () => {
    setAssessmentModalOpen(false);
  };

  const handleStartGrowth = () => {
    if (isAuthenticated) {
      if (!user?.onboardingCompleted) {
        navigate('/onboarding');
      } else if (!user?.hasCompletedAssessment) {
        navigate('/assessment/initial');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/assessment/initial');
    }
  };

  // Route: /coach (Protected)
  if (currentRoute === '/coach') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
          <CoachPage />
          <FloatingAssistantWidget />
        </div>
      </ProtectedRoute>
    );
  }

  // Route: /login, /register, /auth
  if (currentRoute === '/login' || currentRoute === '/register' || currentRoute === '/auth') {
    return (
      <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
        <LoginPage />
        <FloatingAssistantWidget />
      </div>
    );
  }

  // Route: /onboarding (Protected)
  if (currentRoute === '/onboarding') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
          <OnboardingPage />
          <FloatingAssistantWidget />
        </div>
      </ProtectedRoute>
    );
  }

  // Route: /assessment or /assessment/initial (Open to guests & authenticated users)
  if (currentRoute === '/assessment' || currentRoute === '/assessment/initial') {
    return (
      <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
        <InitialAssessmentPage />
        <FloatingAssistantWidget />
      </div>
    );
  }

  // Route: /dashboard/action (Protected)
  if (currentRoute === '/dashboard/action') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
          <ActionDetailPage />
          <FloatingAssistantWidget />
        </div>
      </ProtectedRoute>
    );
  }

  // Route: /dashboard (Protected)
  if (currentRoute === '/dashboard' || currentRoute.startsWith('/dashboard/')) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
          <DashboardPage />
          <FloatingAssistantWidget />
        </div>
      </ProtectedRoute>
    );
  }

  // Route: /growth-profile (Protected)
  if (currentRoute === '/growth-profile') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
          <GrowthProfilePage />
          <FloatingAssistantWidget />
        </div>
      </ProtectedRoute>
    );
  }

  // Route: /growth-path (Protected)
  if (currentRoute === '/growth-path') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
          <GrowthPathPage />
          <FloatingAssistantWidget />
        </div>
      </ProtectedRoute>
    );
  }

  // Route: /progress (Protected)
  if (currentRoute === '/progress') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
          <ProgressPage />
          <FloatingAssistantWidget />
        </div>
      </ProtectedRoute>
    );
  }

  // Route: /reports (Protected)
  if (currentRoute === '/reports') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
          <ReportsPage />
          <FloatingAssistantWidget />
        </div>
      </ProtectedRoute>
    );
  }

  // Route: /reflection/weekly (Protected)
  if (currentRoute === '/reflection/weekly') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
          <WeeklyReflectionPage />
          <FloatingAssistantWidget />
        </div>
      </ProtectedRoute>
    );
  }

  // Route: /settings (Protected)
  if (currentRoute === '/settings') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
          <SettingsPage />
          <FloatingAssistantWidget />
        </div>
      </ProtectedRoute>
    );
  }

  // Unknown Route -> 404 Page
  if (currentRoute !== '/' && currentRoute !== '') {
    return (
      <div className="min-h-screen bg-[#050505] text-[#E8E8E6] selection:bg-[#B5122B] selection:text-white font-sans antialiased relative">
        <NotFoundPage />
        <FloatingAssistantWidget />
      </div>
    );
  }

  // Default Route: / (Landing Page)
  return (
    <div className="landing-page-root min-h-screen bg-[#08090B] text-[#F4F0E8] selection:bg-[#C8102E] selection:text-white font-sans antialiased relative isolate">
      {/* 0. Systematic Ambient Background (Cinematic Crimson & Charcoal Glows) */}
      <AmbientBackground />

      {/* 1. Header / Navbar with Auth State */}
      <Navbar onOpenAssessment={handleOpenAssessment} />

      {/* Main Landing Page Stream */}
      <main className="relative z-10">
        {/* 1. Hero Section (includes Why NEXT YOU section in 3D cosmos scroll) */}
        <Hero
          onOpenAssessment={handleOpenAssessment}
          onStartGrowth={handleStartGrowth}
        />

        {/* 2. Final CTA */}
        <FinalCta onOpenAssessment={handleOpenAssessment} />
      </main>

      {/* 10. Minimalist Footer */}
      <Footer onOpenAssessment={handleOpenAssessment} />

      {/* Interactive Self-Discovery Assessment Modal */}
      <AssessmentPreviewModal
        isOpen={assessmentModalOpen}
        onClose={handleCloseAssessment}
        onStartGrowth={handleStartGrowth}
      />

      {/* Global Floating Companion Assistant Widget */}
      <FloatingAssistantWidget />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CompanionProvider>
        <AppRouter />
      </CompanionProvider>
    </AuthProvider>
  );
}
