import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';

/**
 * NEXT YOU Unified Scroll Controller
 * - Manages a single, global Lenis smooth-scrolling instance.
 * - Single requestAnimationFrame loop coordinating both Lenis and DOM-direct parallax updates.
 * - Completely avoids React virtual DOM re-renders during scrolling for visual parallax.
 * - Eliminates competing smooth scrolling conflicts between Lenis and native browser APIs.
 */

let lenisInstance: Lenis | null = null;
let rafId: number | null = null;
const parallaxSubscribers = new Set<(scrollY: number) => void>();
let isInitialized = false;

/**
 * Initialize Lenis and the unified RAF loop.
 * Idempotent: safe to call multiple times, guarantees only one loop exists.
 */
export function initScrollController(): () => void {
  if (typeof window === 'undefined') return () => {};

  if (!isInitialized) {
    isInitialized = true;

    // Respect user's reduced-motion settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    lenisInstance = new Lenis({
      duration: prefersReducedMotion ? 0.01 : 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      infinite: false,
    });

    const raf = (time: number) => {
      if (lenisInstance) {
        lenisInstance.raf(time);
        const currentScroll = lenisInstance.scroll;
        parallaxSubscribers.forEach((callback) => callback(currentScroll));
      }
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);
  }

  return () => {
    // Teardown if explicitly requested
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (lenisInstance) {
      lenisInstance.destroy();
      lenisInstance = null;
    }
    isInitialized = false;
  };
}

/**
 * Unified Smooth Scroll To helper.
 * Uses the primary Lenis instance to prevent duel-scrolling with native behavior.
 */
export function smoothScrollTo(
  target: string | HTMLElement,
  options?: { offset?: number; immediate?: boolean }
) {
  if (typeof window === 'undefined') return;

  const offset = options?.offset ?? -40;
  const immediate = options?.immediate ?? false;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      immediate,
      duration: immediate ? 0 : 0.85,
    });
  } else {
    // Fallback if Lenis is not mounted
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) {
        if (immediate) {
          const top = el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      if (immediate) {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

/**
 * Zero-Rerender Parallax Hook.
 * Updates DOM style.transform directly on the element ref in sync with Lenis RAF.
 * ZERO React state updates, ZERO component re-renders during scrolling!
 */
export function useScrollParallax<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  computeTransform: (scrollY: number) => string
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;

    // Apply initial position
    const initialY = lenisInstance ? lenisInstance.scroll : window.scrollY;
    el.style.transform = computeTransform(initialY);

    const update = (scrollY: number) => {
      if (ref.current) {
        ref.current.style.transform = computeTransform(scrollY);
      }
    };

    parallaxSubscribers.add(update);
    return () => {
      parallaxSubscribers.delete(update);
    };
  }, [ref, computeTransform]);
}

/**
 * Navbar threshold hook.
 * Only triggers a React state update when crossing the threshold (boolean flip).
 * While scrolling between 20px and 5000px: ZERO React re-renders!
 */
export function useNavbarScrolled(threshold = 20): boolean {
  const [scrolled, setScrolled] = useState(() => {
    if (typeof window !== 'undefined') {
      return (lenisInstance ? lenisInstance.scroll : window.scrollY) > threshold;
    }
    return false;
  });

  useEffect(() => {
    let lastState = (lenisInstance ? lenisInstance.scroll : window.scrollY) > threshold;

    const check = (scrollY: number) => {
      const isScrolled = scrollY > threshold;
      if (isScrolled !== lastState) {
        lastState = isScrolled;
        setScrolled(isScrolled);
      }
    };

    parallaxSubscribers.add(check);
    return () => {
      parallaxSubscribers.delete(check);
    };
  }, [threshold]);

  return scrolled;
}

/**
 * Backward-compatible useScrollY hook.
 * Shared subscription to the unified loop.
 */
export function useScrollY(): number {
  const [scrollY, setScrollY] = useState(() =>
    typeof window !== 'undefined'
      ? lenisInstance
        ? lenisInstance.scroll
        : window.scrollY
      : 0
  );

  useEffect(() => {
    const update = (y: number) => setScrollY(y);
    parallaxSubscribers.add(update);
    return () => {
      parallaxSubscribers.delete(update);
    };
  }, []);

  return scrollY;
}
