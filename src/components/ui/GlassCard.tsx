import React from 'react';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  glow?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverEffect = false,
  glow = false,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'glass-card p-6 border border-white/10 relative overflow-hidden transition-all duration-300',
        hoverEffect && 'glass-card-hover cursor-pointer',
        glow && 'shadow-[0_0_25px_rgba(118,184,90,0.15)] border-[#76B85A]/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
