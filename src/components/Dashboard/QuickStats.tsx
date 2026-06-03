import React from 'react';
import { TrendingUp, TrendingDown, Target, CheckCircle } from 'lucide-react';
import type { Transaction, Goal, Chore } from '../../types';
import { Card } from '../UI/Card';

interface QuickStatsProps {
  transactions: Transaction[];
  goals: Goal[];
  chores: Chore[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({ transactions, goals, chores }) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weekTransactions = transactions.filter(
    (t) => new Date(t.date) >= oneWeekAgo
  );

  const earnedThisWeek = weekTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const spentThisWeek = weekTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeGoals = goals.filter((g) => !g.completed).length;
  const pendingChores = chores.filter((c) => c.status === 'in_progress' || c.status === 'available').length;

  const stats = [
    {
      icon: TrendingUp,
      label: 'Gagné cette semaine',
      value: `+${earnedThisWeek.toFixed(2)}€`,
      color: 'text-success-500',
      bg: 'bg-success-50',
      iconBg: 'bg-success-100',
    },
    {
      icon: TrendingDown,
      label: 'Dépensé cette semaine',
      value: `-${spentThisWeek.toFixed(2)}€`,
      color: 'text-danger-500',
      bg: 'bg-danger-50',
      iconBg: 'bg-danger-100',
    },
    {
      icon: Target,
      label: 'Objectifs actifs',
      value: `${activeGoals}`,
      color: 'text-primary-500',
      bg: 'bg-primary-50',
      iconBg: 'bg-primary-100',
    },
    {
      icon: CheckCircle,
      label: 'Tâches disponibles',
      value: `${pendingChores}`,
      color: 'text-accent-500',
      bg: 'bg-accent-50',
      iconBg: 'bg-accent-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ icon: Icon, label, value, color, bg, iconBg }) => (
        <Card key={label} className={`p-4 ${bg}`}>
          <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center mb-2`}>
            <Icon size={18} className={color} />
          </div>
          <p className={`text-xl font-nunito font-900 ${color}`}>{value}</p>
          <p className="text-xs text-gray-500 font-inter mt-0.5">{label}</p>
        </Card>
      ))}
    </div>
  );
};
