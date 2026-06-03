import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  gradient?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, gradient, hover = false }) => {
  const base = 'rounded-3xl overflow-hidden';
  const bg = gradient ? `bg-gradient-to-br ${gradient}` : 'bg-white';
  const shadow = 'shadow-[0_4px_24px_rgba(0,0,0,0.08)]';
  const hoverClass = hover || onClick ? 'cursor-pointer hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-200 active:scale-[0.98]' : '';

  return (
    <div className={`${base} ${bg} ${shadow} ${hoverClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
