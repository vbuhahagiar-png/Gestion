import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BalanceCard } from '../components/Dashboard/BalanceCard';
import { QuickStats } from '../components/Dashboard/QuickStats';
import { RecentTransactions } from '../components/Dashboard/RecentTransactions';
import { GoalProgress } from '../components/Dashboard/GoalProgress';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';

const achievementDefs: Record<string, { name: string; emoji: string; color: string }> = {
  saver: { name: 'Épargnant', emoji: '🐷', color: 'purple' },
  chore_champion: { name: 'Champion des tâches', emoji: '🏆', color: 'yellow' },
  goal_getter: { name: 'Objectif atteint', emoji: '🎯', color: 'green' },
  regular_saver: { name: 'Économiseur régulier', emoji: '⭐', color: 'blue' },
  smart_spender: { name: 'Acheteur malin', emoji: '💡', color: 'pink' },
};

export const ChildDashboard: React.FC = () => {
  const { currentUser } = useStore();

  if (!currentUser || currentUser.type !== 'child') return null;

  const pendingChores = currentUser.chores.filter(
    (c) => c.status === 'available' || c.status === 'in_progress'
  );

  const totalChoreRewards = pendingChores.reduce((s, c) => s + c.reward, 0);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Balance Card */}
      <BalanceCard
        balance={currentUser.balance || 0}
        name={currentUser.name}
        avatar={currentUser.avatar}
        color={currentUser.color}
      />

      {/* Quick Stats */}
      <QuickStats
        transactions={currentUser.transactions}
        goals={currentUser.goals}
        chores={currentUser.chores}
      />

      {/* Chores teaser */}
      {pendingChores.length > 0 && (
        <Card className="p-5" gradient="from-accent-50 to-orange-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-accent-100 rounded-xl flex items-center justify-center">
                <Zap size={18} className="text-accent-600" />
              </div>
              <div>
                <h3 className="font-nunito font-800 text-gray-800 text-sm">Tâches disponibles</h3>
                <p className="text-xs text-gray-500 font-inter">Tu peux gagner jusqu'à {totalChoreRewards.toFixed(2)}€ !</p>
              </div>
            </div>
            <Link
              to="/chores"
              className="flex items-center gap-1 text-accent-600 text-xs font-nunito font-700 hover:text-accent-700"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {pendingChores.slice(0, 3).map((chore) => (
              <div key={chore.id} className="flex items-center gap-3 p-2.5 bg-white rounded-xl">
                <span className="text-xl">{chore.emoji}</span>
                <span className="flex-1 text-sm font-nunito font-600 text-gray-700">{chore.name}</span>
                <Badge variant="yellow">+{chore.reward.toFixed(2)}€</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Goals Progress */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h2 className="font-nunito font-800 text-gray-800">Mes Objectifs</h2>
          </div>
          <Link
            to="/goals"
            className="flex items-center gap-1 text-primary-500 text-xs font-nunito font-700 hover:text-primary-700"
          >
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>
        <GoalProgress goals={currentUser.goals} />
      </Card>

      {/* Recent Transactions */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💳</span>
            <h2 className="font-nunito font-800 text-gray-800">Dernières transactions</h2>
          </div>
          <Link
            to="/wallet"
            className="flex items-center gap-1 text-primary-500 text-xs font-nunito font-700 hover:text-primary-700"
          >
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>
        <RecentTransactions transactions={currentUser.transactions} />
      </Card>

      {/* Achievements */}
      {currentUser.achievements.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <h2 className="font-nunito font-800 text-gray-800">Mes Succès</h2>
            </div>
            <Link
              to="/achievements"
              className="flex items-center gap-1 text-primary-500 text-xs font-nunito font-700 hover:text-primary-700"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentUser.achievements.map((achId) => {
              const ach = achievementDefs[achId];
              if (!ach) return null;
              return (
                <div
                  key={achId}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-primary-50 border border-primary-100"
                >
                  <span className="text-xl">{ach.emoji}</span>
                  <span className="text-xs font-nunito font-700 text-primary-700">{ach.name}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Mascot message */}
      <div className="flex items-center gap-4 p-5 rounded-3xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="text-4xl animate-wiggle">🐷</div>
        <div>
          <p className="font-nunito font-800 text-lg">Bravo {currentUser.name} !</p>
          <p className="text-white/80 font-inter text-sm">
            Continue d'économiser et d'accomplir tes tâches. Tu es sur la bonne voie ! 🌟
          </p>
        </div>
      </div>
    </div>
  );
};
