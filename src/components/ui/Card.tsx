import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        'bg-card-bg border-2 border-primary-green/10 rounded-2xl p-6',
        hover && 'transition-all duration-300 hover:border-primary-green hover:shadow-xl hover:shadow-primary-green/20 hover:-translate-y-2',
        className
      )}
    >
      {children}
    </div>
  );
};
