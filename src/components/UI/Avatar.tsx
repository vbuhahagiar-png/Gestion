import React from 'react';

interface AvatarProps {
  emoji: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ emoji, color = 'from-purple-400 to-pink-500', size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-7 h-7 text-base',
    sm: 'w-9 h-9 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
  };

  return (
    <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md ${className}`}>
      {emoji}
    </div>
  );
};
