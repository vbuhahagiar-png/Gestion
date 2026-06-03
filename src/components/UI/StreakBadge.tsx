import React from 'react';
import { getStreakEmoji, getStreakMessage } from '../../hooks/useStreak';

interface StreakBadgeProps {
  streak: number;
  compact?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, compact = false }) => {
  if (streak === 0) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
        <span>{getStreakEmoji(streak)}</span>
        <span>{streak}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-2xl shadow-md">
      <span className="text-xl animate-wiggle">{getStreakEmoji(streak)}</span>
      <div>
        <div className="text-xs opacity-90 font-medium">Série actuelle</div>
        <div className="text-sm font-bold">{getStreakMessage(streak)}</div>
      </div>
    </div>
  );
};
