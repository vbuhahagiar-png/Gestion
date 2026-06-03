import { useMemo } from 'react';

export const useStreakBonus = (streak: number): number => {
  return useMemo(() => {
    if (streak >= 30) return 0.20;
    if (streak >= 7) return 0.10;
    if (streak >= 3) return 0.05;
    return 0;
  }, [streak]);
};

export const getStreakEmoji = (streak: number): string => {
  if (streak >= 30) return '💥';
  if (streak >= 14) return '⚡';
  if (streak >= 7) return '🔥';
  if (streak >= 3) return '✨';
  return '⭐';
};

export const getStreakMessage = (streak: number): string => {
  if (streak >= 30) return `${streak} jours ! Incroyable !`;
  if (streak >= 14) return `${streak} jours d'affilée !`;
  if (streak >= 7) return `${streak} jours - Super !`;
  if (streak >= 3) return `${streak} jours - Continue !`;
  if (streak === 1) return '1er jour - Bravo !';
  return 'Commence ta série !';
};
