import React from 'react';
import { useLevel } from '../../hooks/useLevel';

interface LevelBadgeProps {
  xp: number;
  compact?: boolean;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ xp, compact = false }) => {
  const { currentLevel } = useLevel(xp);

  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold">
        <span>{currentLevel.emoji}</span>
        <span>Niv.{currentLevel.level}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-md">
      <span className="text-xl">{currentLevel.emoji}</span>
      <div>
        <div className="text-xs opacity-90 font-medium">Niveau {currentLevel.level}</div>
        <div className="text-sm font-bold">{currentLevel.name}</div>
      </div>
    </div>
  );
};
