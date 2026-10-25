import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-sm',
    md: 'text-sm px-5 py-2.5 gap-2 rounded-sm',
    lg: 'text-base px-7 py-3.5 gap-2.5 rounded-sm font-semibold tracking-wide',
  };

  const variantStyles = {
    primary: 'bg-[#B5122B] text-white hover:bg-[#990F24] border border-[#B5122B] shadow-[0_0_24px_rgba(181,18,43,0.35)] hover:shadow-[0_0_32px_rgba(181,18,43,0.55)]',
    secondary: 'bg-[#16171A] text-[#E8E8E6] hover:bg-[#1E2024] border border-white/10 hover:border-white/20',
    outline: 'bg-transparent text-[#E8E8E6] hover:bg-white/[0.04] border border-white/15 hover:border-white/30',
    ghost: 'bg-transparent text-[#85878C] hover:text-[#E8E8E6] hover:bg-white/[0.04]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
