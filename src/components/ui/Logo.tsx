import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

/**
 * Geometric NEXTYOU Origami Mountain / Ascending 'N' Logo Mark
 * Faithfully recreating the luxury geometric mark seen in the reference visual:
 * A faceted isometric mountain peak embodying ascension, stability, and the letter 'N'.
 */
export const LogoMark: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="NEXTYOU Emblem"
    >
      {/* Outer Mountain Ridge / Facet 1 (Left Ascent) */}
      <path
        d="M18 5L4 29H13L18 19L23 29H32L18 5Z"
        stroke="#E8E8E6"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Center Diagonal Ridge Fold (forms the dynamic 'N' traverse) */}
      <path
        d="M18 5L13 29"
        stroke="#E8E8E6"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <path
        d="M18 19L23 29"
        stroke="#B5122B"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Subtle Summit Peak Point Accent */}
      <circle cx="18" cy="5" r="1.5" fill="#B5122B" />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
}) => {
  const iconSizes = {
    sm: 22,
    md: 28,
    lg: 34,
  };

  const textSizes = {
    sm: 'text-sm tracking-[0.2em]',
    md: 'text-base sm:text-lg tracking-[0.22em]',
    lg: 'text-xl tracking-[0.24em]',
  };

  return (
    <div
      className={`flex items-center gap-3 select-none ${className}`}
      dir="ltr"
    >
      <LogoMark size={iconSizes[size]} />
      {showWordmark && (
        <span
          className={`font-bold text-[#E8E8E6] uppercase font-sans ${textSizes[size]}`}
        >
          NEXT<span className="text-[#B5122B]">YOU</span>
        </span>
      )}
    </div>
  );
};
