import { useEffect, useRef } from 'react';

/**
 * Lightweight performant scroll reveal hook using IntersectionObserver
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    // Also observe any child elements with data-reveal
    const childElements = el.querySelectorAll('[data-reveal]');
    childElements.forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return ref;
}
