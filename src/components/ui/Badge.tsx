import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary',
  className 
}) => {
  const variants = {
    primary: 'bg-gradient-green text-dark-bg',
    secondary: 'bg-secondary-green text-dark-bg',
    success: 'bg-green-500 text-white',
    warning: 'bg-accent-yellow text-dark-bg',
    danger: 'bg-red-500 text-white',
  };

  return (
    <span
      className={cn(
        'inline-block px-4 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
