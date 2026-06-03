import React from 'react';
import type { Goal } from '../../types';
import { ProgressBar } from '../UI/ProgressBar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GoalProgressProps {
  goals: Goal[];
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ goals }) => {
  const activeGoals = goals.filter((g) => !g.completed).slice(0, 3);

  if (activeGoals.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-2">🎯</div>
        <p className="text-gray-400 font-inter text-sm">Crée ton premier objectif !</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeGoals.map((goal) => {
        const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
        return (
          <div key={goal.id} className="p-4 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{goal.emoji}</span>
                <div>
                  <p className="font-nunito font-700 text-gray-800 text-sm">{goal.name}</p>
                  {goal.deadline && (
                    <p className="text-xs text-gray-400 font-inter">
                      Échéance: {format(new Date(goal.deadline), 'd MMM yyyy', { locale: fr })}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-nunito font-800 text-primary-600 text-sm">
                  {goal.currentAmount.toFixed(2)}€
                </p>
                <p className="text-xs text-gray-400 font-inter">/ {goal.targetAmount.toFixed(2)}€</p>
              </div>
            </div>
            <ProgressBar value={pct} color="purple" size="sm" />
            <p className="text-right text-xs text-primary-500 font-nunito font-600 mt-1">
              {Math.round(pct)}%
            </p>
          </div>
        );
      })}
    </div>
  );
};
