import React from 'react';
import { getStreakEmoji, getStreakMessage } from '../../hooks/useStreak';

interface StreakDisplayProps {
  streak: number;
  size?: 'sm' | 'lg';
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, size = 'sm' }) => {
  if (streak === 0) {
    return (
      <div className="bg-gray-100 rounded-2xl p-3 text-center">
        <div className="text-2xl mb-1">😴</div>
        <div className="text-xs text-gray-500">Pas encore de série</div>
        <div className="text-xs font-semibold text-gray-600">Complete une tâche !</div>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-5 text-white text-center shadow-xl shadow-orange-200">
        <div className="text-5xl mb-2 animate-wiggle">{getStreakEmoji(streak)}</div>
        <div className="text-4xl font-black">{streak}</div>
        <div className="text-sm opacity-90 mt-1">{streak === 1 ? 'jour d\'affilée' : 'jours d\'affilée'}</div>
        <div className="text-xs opacity-80 mt-2 font-medium">{getStreakMessage(streak)}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-orange-50 rounded-2xl px-3 py-2">
      <span className="text-xl animate-wiggle">{getStreakEmoji(streak)}</span>
      <div>
        <div className="font-bold text-orange-700 text-sm">{streak} {streak === 1 ? 'jour' : 'jours'}</div>
        <div className="text-xs text-orange-500">Série en cours</div>
      </div>
    </div>
  );
};
