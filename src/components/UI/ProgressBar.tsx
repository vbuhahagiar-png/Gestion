import React from 'react';

interface ProgressBarProps {
  value: number; // 0–100
  color?: 'purple' | 'pink' | 'green' | 'yellow' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'purple',
  size = 'md',
  showLabel = false,
  animated = true,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const colors = {
    purple: 'from-primary-400 to-primary-600',
    pink: 'from-secondary-400 to-secondary-600',
    green: 'from-success-400 to-success-600',
    yellow: 'from-accent-400 to-accent-500',
    blue: 'from-blue-400 to-blue-600',
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full ${animated ? 'transition-all duration-700 ease-out' : ''}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs font-inter text-gray-500">{Math.round(clampedValue)}%</span>
        </div>
      )}
    </div>
  );
};
