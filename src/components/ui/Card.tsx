import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = true, ...props }) => (
  <div
    {...props}
    className={cn(
      'bg-card-bg/80 backdrop-blur border border-primary-green/10 rounded-3xl p-6',
      hover && 'transition-all duration-300 hover:border-primary-green/60 hover:shadow-xl hover:shadow-primary-green/10 hover:-translate-y-1',
      className
    )}
  >
    {children}
  </div>
);
