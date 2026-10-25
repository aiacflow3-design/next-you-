import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'crimson' | 'muted' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'muted',
  size = 'md',
  className = '',
}) => {
  const base = 'inline-flex items-center font-normal tracking-wide select-none rounded-xs';
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };
  const variants = {
    crimson: 'bg-[#B5122B]/15 text-[#E85D6F] border border-[#B5122B]/30',
    muted: 'bg-white/[0.04] text-[#A6A8AD] border border-white/10',
    outline: 'border border-white/15 text-[#85878C]',
  };

  return (
    <span className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
