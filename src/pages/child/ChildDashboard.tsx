import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useFamilyStore } from '../../store/useFamilyStore';
import { ChildNav } from '../../components/Layout/ChildNav';
import { Avatar } from '../../components/UI/Avatar';
import { TaskCard } from '../../components/Tasks/TaskCard';
import { BADGES } from '../../data/badges';
import { useLevel } from '../../hooks/useLevel';
import { getStreakEmoji, getStreakMessage } from '../../hooks/useStreak';
import { useFamilyStore as useFS } from '../../store/useFamilyStore';

export const ChildDashboard: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { allUsers, switchToParent } = useAuthStore();
  const { tasks, wallets, withdrawals } = useFamilyStore();

  const child = allUsers.find(u => u.id === childId);
  const wallet = wallets.find(w => w.childId === childId);
  const { currentLevel, nextLevel, progress, xpInCurrentLevel, xpNeededForNext } = useLevel(child?.xp || 0);

  const myTasks = tasks.filter(t =>
    (t.assignedTo.length === 0 || t.assignedTo.includes(childId || '')) &&
    t.status !== 'done'
  ).slice(0, 3);

  const pendingWithdrawals = withdrawals.filter(w => w.childId === childId && w.status === 'pending');
  const recentBadges = BADGES.filter(b => child?.unlockedBadges.includes(b.id)).slice(0, 3);

  const { completeTask } = useFS();

  if (!child) return null;

  return (
    <div className="pb-24">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-10 pb-4">
        <button onClick={() => { switchToParent(); navigate('/parent'); }} className="flex items-center gap-1 text-sm text-gray-500 font-medium">
          <ChevronLeft className="w-4 h-4" /> Parents
        </button>
        <div className="text-xs text-gray-400 font-medium">FamilyVault</div>
      </div>

      {/* Hero section */}
      <div className="px-4 mb-5">
        <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-pink-600 rounded-3xl p-5 text-white shadow-2xl shadow-purple-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Avatar emoji={child.avatar} color="from-white/20 to-white/10" size="lg" className="border-3 border-white/30" />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center text-sm">
                {currentLevel.emoji}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black">Salut {child.name} ! 🎉</h1>
              <div className="text-purple-200 text-sm">Niveau {currentLevel.level} · {currentLevel.name}</div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-purple-200">
              <span>{xpInCurrentLevel} XP</span>
              <span>{nextLevel !== currentLevel ? `${xpNeededForNext} XP → Niv.${nextLevel.level}` : 'Max !'}</span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Streak + Balance row */}
      <div className="px-4 mb-5 grid grid-cols-2 gap-3">
        {/* Streak */}
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-4 text-white shadow-lg shadow-orange-200">
          <div className="text-3xl mb-1 animate-wiggle">{getStreakEmoji(child.streak)}</div>
          <div className="text-2xl font-black">{child.streak}</div>
          <div className="text-xs opacity-90">{child.streak === 1 ? 'jour' : 'jours'} d'affilée</div>
          <div className="text-xs opacity-75 mt-0.5">{getStreakMessage(child.streak)}</div>
        </div>

        {/* Balance */}
        <div className="bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl p-4 text-white shadow-lg shadow-emerald-200 cursor-pointer" onClick={() => navigate(`/child/${childId}/wallet`)}>
          <div className="text-2xl mb-1 animate-float">💰</div>
          <div className="text-2xl font-black">CHF {wallet?.balance.toFixed(2) || '0.00'}</div>
          <div className="text-xs opacity-90">Ma cagnotte</div>
          {pendingWithdrawals.length > 0 && (
            <div className="text-xs opacity-75 mt-0.5">⏳ Retrait en attente</div>
          )}
        </div>
      </div>

      {/* Active tasks */}
      {myTasks.length > 0 && (
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-gray-900 text-base">Mes tâches du jour ✅</h2>
            <button onClick={() => navigate(`/child/${childId}/tasks`)} className="text-xs text-purple-600 font-semibold">Tout voir →</button>
          </div>
          <div className="space-y-3">
            {myTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                childView
                onComplete={tid => completeTask(tid, childId || '')}
              />
            ))}
          </div>
        </div>
      )}

      {myTasks.length === 0 && (
        <div className="px-4 mb-5">
          <div className="bg-emerald-50 rounded-3xl p-6 text-center">
            <div className="text-5xl mb-2">🎉</div>
            <div className="font-bold text-emerald-700">Toutes les tâches sont faites !</div>
            <div className="text-sm text-emerald-500">Tu es un champion !</div>
          </div>
        </div>
      )}

      {/* Recent badges */}
      {recentBadges.length > 0 && (
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-gray-900 text-base">Mes derniers badges 🏆</h2>
            <button onClick={() => navigate(`/child/${childId}/badges`)} className="text-xs text-purple-600 font-semibold">Tout voir →</button>
          </div>
          <div className="flex gap-3">
            {recentBadges.map(badge => (
              <div
                key={badge.id}
                className={`flex-1 bg-gradient-to-br ${badge.color} rounded-2xl p-3 text-white text-center shadow-md`}
              >
                <div className="text-3xl mb-1">{badge.emoji}</div>
                <div className="text-xs font-bold leading-tight">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational section */}
      <div className="px-4 mb-5">
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl p-4 text-white">
          <div className="text-lg font-black mb-0.5">
            {child.streak >= 7 ? '🔥 Tu es en feu !' :
             child.streak >= 3 ? '⭐ Continue comme ça !' :
             '💪 Prêt pour une nouvelle journée ?'}
          </div>
          <div className="text-sm opacity-90">
            {child.streak >= 7 ? `${child.streak} jours sans t'arrêter ! Incroyable !` :
             child.streak >= 3 ? 'Ta série continue ! Ne la brise pas !' :
             'Fais une tâche aujourd\'hui pour commencer ta série !'}
          </div>
        </div>
      </div>

      <ChildNav />
    </div>
  );
};
