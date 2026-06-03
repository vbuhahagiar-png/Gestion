import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  gradient,
  onClick,
}) => {
  const base = 'rounded-3xl shadow-card overflow-hidden';
  const hoverClass = hover ? 'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer' : '';
  const bg = gradient ? `bg-gradient-to-br ${gradient}` : 'bg-white';

  return (
    <div
      className={`${base} ${bg} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
