import React, { useState, useEffect } from 'react';
import { LogOut, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import {
  ASSESSMENT_QUESTIONS,
  computeAssessmentResult,
  AssessmentResultData,
} from '../assessment/assessmentData';
import { AssessmentIntro } from '../assessment/AssessmentIntro';
import { AssessmentQuestionView } from '../assessment/AssessmentQuestionView';
import { AssessmentAnalyzingView } from '../assessment/AssessmentAnalyzingView';
import { AssessmentResultView } from '../assessment/AssessmentResultView';

type AssessmentFlowStage = 'intro' | 'questions' | 'analyzing' | 'result';

export const InitialAssessmentPage: React.FC = () => {
  const { user, logout, navigate, submitAssessment, authFetch } = useAuth();

  const [stage, setStage] = useState<AssessmentFlowStage>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('nextyou_assessment_answers');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return {};
  });
  const [result, setResult] = useState<AssessmentResultData | null>(null);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];

  // Load previous assessment from server if exists
  useEffect(() => {
    async function checkExistingAssessment() {
      try {
        const res = await authFetch('/api/assessment/latest');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.record) {
            // Pre-hydrate existing computed result
            const computed = computeAssessmentResult(
              data.record.answers || {},
              user?.onboardingGoals || []
            );
            setResult(computed);
          }
        }
      } catch (err) {
        // Ignore
      }
    }

    if (user) {
      checkExistingAssessment();
    }
  }, [user, authFetch]);

  // Stage Transitions
  const handleStartAssessment = () => {
    setSubmissionError(null);
    setStage('questions');
    setCurrentQuestionIndex(0);
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [currentQuestion.id]: optionId,
      };
      try {
        localStorage.setItem('nextyou_assessment_answers', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all questions, move to analyzing
      setStage('analyzing');
    }
  };

  const handleBackQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setStage('intro');
    }
  };

  /**
   * Conceptually:
   * submitAssessment()
   * → getCurrentUser() on server
   * → if no user: unauthorized ("برای تحلیل باید وارد حساب خودتون بشید")
   * → if user exists: process assessment, save response, generate growth profile
   * → continue to next step
   */
  const handleAnalysisComplete = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    // Compute result locally so guests get immediate, full result view
    const computed = computeAssessmentResult(answers, user?.onboardingGoals || []);
    setResult(computed);

    // Save in localStorage for post-auth sync
    try {
      localStorage.setItem('nextyou_assessment_answers', JSON.stringify(answers));
      localStorage.setItem('nextyou_growth_profile', JSON.stringify({
        discipline: computed.categoryScores.discipline,
        focus: computed.categoryScores.focus,
        confidence: computed.categoryScores.confidence,
        recommendedPath: computed.recommendedFirstGrowthPath.title,
      }));
    } catch {
      // Ignore
    }

    // If user is already authenticated, persist to server
    if (user) {
      try {
        await submitAssessment(answers);
      } catch (err) {
        console.warn('Failed to persist assessment on server:', err);
      }
    }

    setIsSubmitting(false);
    setStage('result');
  };

  const handleRestart = () => {
    setAnswers({});
    try {
      localStorage.removeItem('nextyou_assessment_answers');
      localStorage.removeItem('nextyou_growth_profile');
    } catch {
      // Ignore
    }
    setCurrentQuestionIndex(0);
    setResult(null);
    setSubmissionError(null);
    setStage('intro');
  };

  const handleGoToGrowthProfile = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      // Unauthenticated guest user: proceed to register/login to enter dashboard & daily actions
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#E8E8E6] flex flex-col justify-between p-4 sm:p-7 relative select-none">
      {/* Top Navbar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-3 border-b border-white/[0.05]">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-[#85878C] hidden sm:inline-block max-w-[150px] truncate">
                {user?.name || user?.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 text-xs text-[#85878C] hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-[#B5122B]" />
                <span>خروج</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1.5 text-xs text-[#E8E8E6] hover:text-white px-3.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all cursor-pointer font-medium"
            >
              <span>ورود / ثبت‌نام</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full my-auto py-6 sm:py-10">
        <div className="luxury-glass-card rounded-2xl p-6 sm:p-9 border border-white/[0.08] shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative overflow-hidden">
          {/* Submission / Authentication Error Banner */}
          {submissionError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn text-right" dir="rtl">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-[#B5122B] shrink-0" />
                <span className="font-semibold">{submissionError}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg bg-[#B5122B] hover:bg-[#c91833] text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
              >
                ورود مجدد به حساب
              </button>
            </div>
          )}

          {/* STAGE 1: INTRO */}
          {stage === 'intro' && (
            <AssessmentIntro
              onStart={handleStartAssessment}
              onBackToHome={() => navigate('/')}
            />
          )}

          {/* STAGE 2: QUESTIONS */}
          {stage === 'questions' && currentQuestion && (
            <AssessmentQuestionView
              question={currentQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              selectedOptionId={answers[currentQuestion.id]}
              onSelectOption={handleSelectOption}
              onNext={handleNextQuestion}
              onBack={handleBackQuestion}
            />
          )}

          {/* STAGE 3: ANALYZING */}
          {stage === 'analyzing' && (
            <AssessmentAnalyzingView onComplete={handleAnalysisComplete} />
          )}

          {/* STAGE 4: RESULT */}
          {stage === 'result' && result && (
            <AssessmentResultView
              result={result}
              onRestart={handleRestart}
              onSaveAndFinish={handleGoToGrowthProfile}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center py-3 text-[11px] text-[#85878C]/60">
        NEXT YOU — سیستم رشد فردی و تحول گام‌به‌گام
      </footer>
    </div>
  );
};
