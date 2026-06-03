import React, { useEffect } from 'react';
import { LEVELS } from '../../types';

interface LevelUpAnimationProps {
  level: number;
  onComplete: () => void;
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({ level, onComplete }) => {
  const levelData = LEVELS.find(l => l.level === level) || LEVELS[0];

  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 mx-4 text-center animate-scale-in shadow-2xl">
        <div className="text-7xl mb-4 animate-bounce">{levelData.emoji}</div>
        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-700 mb-1">
          NIVEAU UP !
        </div>
        <div className="text-xl font-bold text-gray-800">Niveau {level}</div>
        <div className="text-gray-600 mt-1">{levelData.name}</div>
        <div className="mt-4 text-4xl">🎉🎊🎉</div>
        <button onClick={onComplete} className="mt-4 text-sm text-gray-400 hover:text-gray-600">
          Continuer →
        </button>
      </div>
    </div>
  );
};
