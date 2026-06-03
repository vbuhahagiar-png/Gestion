import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'pink' | 'green' | 'yellow' | 'red' | 'blue' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  size = 'sm',
  className = '',
}) => {
  const variants = {
    purple: 'bg-primary-100 text-primary-700',
    pink: 'bg-secondary-100 text-secondary-700',
    green: 'bg-success-100 text-success-700',
    yellow: 'bg-accent-100 text-accent-700',
    red: 'bg-danger-100 text-danger-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-100 text-gray-600',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-nunito font-600 rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
