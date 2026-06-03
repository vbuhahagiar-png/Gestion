import React, { useState } from 'react';
import { Flame, Trophy, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../../components/UI/Avatar';
import { Modal } from '../../components/UI/Modal';
import { WalletCard } from '../../components/Wallet/WalletCard';
import { TransactionList } from '../../components/Wallet/TransactionList';
import { XPBar } from '../../components/Gamification/XPBar';
import { BadgeGrid } from '../../components/Gamification/BadgeGrid';
import { StreakDisplay } from '../../components/Gamification/StreakDisplay';
import { PricingModal } from '../../components/Premium/PricingModal';
import { BADGES } from '../../data/badges';
import type { User } from '../../types';

const ChildDetailModal: React.FC<{ child: User; onClose: () => void }> = ({ child, onClose }) => {
  const { wallets, transactions } = useFamilyStore();
  const wallet = wallets.find(w => w.childId === child.id);
  const childTxns = transactions.filter(t => t.childId === child.id);
  const [tab, setTab] = useState<'stats' | 'transactions' | 'badges'>('stats');

  return (
    <Modal isOpen={true} onClose={onClose} size="lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Avatar emoji={child.avatar} color={child.color} size="lg" />
          <div>
            <h2 className="text-xl font-black text-gray-900">{child.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              {child.streak > 0 && (
                <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  <Flame className="w-3 h-3" /> {child.streak} jours
                </div>
              )}
              <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold">
                <Trophy className="w-3 h-3" /> {child.unlockedBadges.length} badges
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
          {(['stats', 'transactions', 'badges'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              {t === 'stats' ? '📊 Stats' : t === 'transactions' ? '💸 Cagnotte' : '🏆 Badges'}
            </button>
          ))}
        </div>

        {tab === 'stats' && (
          <div className="space-y-3">
            <XPBar xp={child.xp} />
            <StreakDisplay streak={child.streak} />
            {wallet && <WalletCard wallet={wallet} childName={child.name} />}
          </div>
        )}

        {tab === 'transactions' && (
          <div>
            {wallet && <WalletCard wallet={wallet} childName={child.name} />}
            <div className="mt-3">
              <TransactionList transactions={childTxns} />
            </div>
          </div>
        )}

        {tab === 'badges' && (
          <BadgeGrid badges={BADGES} unlockedIds={child.unlockedBadges} />
        )}
      </div>
    </Modal>
  );
};

export const ChildrenPage: React.FC = () => {
  const { allUsers, currentFamily } = useAuthStore();
  const { wallets, tasks } = useFamilyStore();
  const [selectedChild, setSelectedChild] = useState<User | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);

  const children = allUsers.filter(u => u.role === 'child');
  const isFreePlan = currentFamily?.plan === 'free';
  const atFreeLimit = isFreePlan && children.length >= 1;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black text-gray-900">Mes enfants</h1>

      <div className="space-y-3">
        {children.map(child => {
          const wallet = wallets.find(w => w.childId === child.id);
          const childTasks = tasks.filter(t => t.assignedTo.length === 0 || t.assignedTo.includes(child.id));
          const doneTasks = childTasks.filter(t => t.status === 'done').length;

          return (
            <div
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.07)] cursor-pointer hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <Avatar emoji={child.avatar} color={child.color} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900">{child.name}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {child.streak > 0 && (
                      <span className="flex items-center gap-1 text-xs text-orange-600 font-bold">
                        <Flame className="w-3 h-3" /> {child.streak} jours
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{doneTasks} tâches terminées</span>
                    <span className="text-xs text-gray-500">|</span>
                    <span className="text-xs text-purple-600 font-semibold">{child.unlockedBadges.length} badges</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-emerald-600">CHF {wallet?.balance.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-gray-400">cagnotte</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {atFreeLimit ? (
        <button
          onClick={() => setPricingOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-amber-300 text-amber-700 bg-amber-50 rounded-2xl text-sm font-semibold hover:bg-amber-100 transition-colors"
        >
          <Lock className="w-4 h-4" /> Ajouter un enfant (Premium)
        </button>
      ) : null}

      {selectedChild && (
        <ChildDetailModal child={selectedChild} onClose={() => setSelectedChild(null)} />
      )}

      <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  );
};
