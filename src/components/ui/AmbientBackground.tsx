import React, { useRef } from 'react';
import { useScrollParallax } from '../../lib/scrollController';

/**
 * AmbientBackground
 * Premium Cinematic Ambient Lighting Effect (Ultra-Performant):
 * - Zero-rerender DOM-direct parallax via useScrollParallax
 * - Reduced blurs (55px - 65px) with rich radial-gradients for zero GPU repaint lag
 * - Zero CPU-heavy feTurbulence SVG filters
 * - Deep black canvas (#050505) with crimson and warm charcoal atmosphere
 * - Rendered strictly on the landing page route only
 */
export const AmbientBackground: React.FC = React.memo(() => {
  const topLightRef = useRef<HTMLDivElement>(null);
  const bottomLightRef = useRef<HTMLDivElement>(null);

  // Direct DOM parallax updates - ZERO React re-renders during scrolling
  useScrollParallax(topLightRef, (scrollY) => `translate3d(0, ${Math.min(scrollY * 0.016, 25)}px, 0)`);
  useScrollParallax(bottomLightRef, (scrollY) => `translate3d(0, ${Math.min(scrollY * -0.014, 20)}px, 0)`);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#08090B]"
      aria-hidden="true"
      style={{ contain: 'strict' }}
    >
      {/* 
        1. BRAND RED LIGHT — TOP-LEFT EDGE (Off-screen source):
      */}
      <div
        ref={topLightRef}
        className="absolute -top-[35vh] -left-[25vw] w-[120vw] min-w-[1000px] h-[110vh] min-h-[850px] pointer-events-none"
      >
        <div
          className="w-full h-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 15% 15%, rgba(200, 16, 46, 0.12) 0%, rgba(101, 21, 38, 0.06) 28%, rgba(101, 21, 38, 0.015) 52%, transparent 72%)',
            filter: 'blur(60px)',
            WebkitFilter: 'blur(60px)',
          }}
        />
      </div>

      {/* 
        2. WARM DARK CHARCOAL Fill:
      */}
      <div className="absolute top-[25vh] -left-[10vw] w-[100vw] min-w-[900px] h-[95vh] min-h-[750px] pointer-events-none">
        <div
          className="w-full h-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(25, 26, 31, 0.25) 0%, rgba(15, 16, 20, 0.08) 45%, transparent 75%)',
            filter: 'blur(65px)',
            WebkitFilter: 'blur(65px)',
          }}
        />
      </div>

      {/* 
        3. BRAND RED LIGHT — BOTTOM-RIGHT EDGE:
      */}
      <div
        ref={bottomLightRef}
        className="absolute -bottom-[35vh] -right-[25vw] w-[120vw] min-w-[1000px] h-[110vh] min-h-[850px] pointer-events-none"
      >
        <div
          className="w-full h-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 85% 85%, rgba(200, 16, 46, 0.10) 0%, rgba(101, 21, 38, 0.04) 28%, transparent 70%)',
            filter: 'blur(55px)',
            WebkitFilter: 'blur(55px)',
          }}
        />
      </div>
    </div>
  );
});

AmbientBackground.displayName = 'AmbientBackground';
