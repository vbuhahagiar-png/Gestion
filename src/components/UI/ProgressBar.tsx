import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'from-violet-500 to-purple-600',
  height = 'h-3',
  showLabel = false,
  animated = true,
  className = '',
}) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`relative ${className}`}>
      <div className={`${height} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} bg-gradient-to-r ${color} rounded-full transition-all duration-700 ease-out ${animated ? 'animate-pulse-slow' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 mt-1 block text-right">{Math.round(percent)}%</span>
      )}
    </div>
  );
};
