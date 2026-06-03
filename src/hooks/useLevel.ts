import { useMemo } from 'react';
import { LEVELS } from '../types';

export const useLevel = (xp: number) => {
  return useMemo(() => {
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];

    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].xpRequired) {
        currentLevel = LEVELS[i];
        nextLevel = LEVELS[i + 1] || LEVELS[i];
        break;
      }
    }

    const xpInCurrentLevel = xp - currentLevel.xpRequired;
    const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
    const progress = nextLevel === currentLevel ? 100 : Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

    return { currentLevel, nextLevel, progress, xpInCurrentLevel, xpNeededForNext };
  }, [xp]);
};
