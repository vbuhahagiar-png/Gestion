import React from 'react';

interface AvatarProps {
  emoji: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  emoji,
  size = 'md',
  gradient = 'from-primary-400 to-secondary-400',
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} shadow-md ${sizes[size]} ${className}`}
    >
      {emoji}
    </div>
  );
};
