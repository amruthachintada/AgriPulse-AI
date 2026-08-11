import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'healthy' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className
}) => {
  const variantStyles = {
    healthy: 'bg-[#76B85A]/20 text-[#76B85A] border-[#76B85A]/30',
    warning: 'bg-[#E8B85A]/20 text-[#E8B85A] border-[#E8B85A]/30',
    danger: 'bg-[#D86A5B]/20 text-[#D86A5B] border-[#D86A5B]/30',
    info: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    neutral: 'bg-white/10 text-[#EEF3E5] border-white/15'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border backdrop-blur-sm',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
