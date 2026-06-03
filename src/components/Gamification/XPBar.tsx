import React from 'react';
import { useLevel } from '../../hooks/useLevel';
import { ProgressBar } from '../UI/ProgressBar';

interface XPBarProps {
  xp: number;
  compact?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({ xp, compact = false }) => {
  const { currentLevel, nextLevel, progress, xpInCurrentLevel, xpNeededForNext } = useLevel(xp);

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{currentLevel.emoji} Niv.{currentLevel.level}</span>
          <span>{xp} XP</span>
        </div>
        <ProgressBar value={progress} animated={false} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentLevel.emoji}</span>
          <div>
            <div className="font-bold text-gray-900 text-sm">Niveau {currentLevel.level}</div>
            <div className="text-xs text-gray-500">{currentLevel.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-purple-600">{xp} XP</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
      </div>
      <ProgressBar value={progress} color="from-violet-500 to-purple-600" />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{xpInCurrentLevel} XP</span>
        <span>{nextLevel !== currentLevel ? `${xpNeededForNext} XP pour niveau ${nextLevel.level}` : 'Niveau maximum !'}</span>
      </div>
    </div>
  );
};
