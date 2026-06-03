import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuthStore } from '../../store/useAuthStore';
import { useFamilyStore } from '../../store/useFamilyStore';
import type { RewardClaim } from '../../types';

export const StorePage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { allUsers } = useAuthStore();
  const { storeRewards, rewardClaims, claimReward } = useFamilyStore();
  const [toast, setToast] = useState<string | null>(null);

  const child = allUsers.find(u => u.id === childId);
  const coins = child?.coins || 0;

  const availableRewards = storeRewards.filter(r => r.available);

  const getPendingClaim = (rewardId: string) =>
    rewardClaims.find(c => c.childId === childId && c.rewardId === rewardId && c.status === 'pending');

  const getApprovedClaim = (rewardId: string) =>
    rewardClaims.find(c => c.childId === childId && c.rewardId === rewardId && c.status === 'approved');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleClaim = (rewardId: string, coinCost: number, title: string) => {
    if (coins < coinCost) return;
    if (getPendingClaim(rewardId)) return;

    const claim: RewardClaim = {
      id: `claim-${Date.now()}`,
      rewardId,
      childId: childId!,
      familyId: child?.familyId || '',
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    claimReward(claim);
    showToast(`🎉 Demande envoyée pour "${title}" !`);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#f59e0b', '#10b981'],
    });
  };

  if (!child) return null;

  return (
    <div className="pb-28 min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <div className="px-4 pt-10 pb-6">
        <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-pink-600 rounded-3xl p-5 text-white shadow-2xl shadow-purple-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
              🏪
            </div>
            <div>
              <h1 className="text-xl font-black">Boutique des Récompenses</h1>
              <p className="text-purple-200 text-sm">Échange tes pièces contre des récompenses !</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-3xl">🪙</span>
            <div>
              <div className="text-3xl font-black">{coins}</div>
              <div className="text-purple-200 text-xs">pièces d'or disponibles</div>
            </div>
          </div>
        </div>
      </div>

      {/* My claims history */}
      {rewardClaims.filter(c => c.childId === childId).length > 0 && (
        <div className="px-4 mb-5">
          <h2 className="font-black text-gray-900 text-base mb-3">Mes demandes 📋</h2>
          <div className="space-y-2">
            {rewardClaims
              .filter(c => c.childId === childId)
              .slice(0, 3)
              .map(claim => {
                const reward = storeRewards.find(r => r.id === claim.rewardId);
                if (!reward) return null;
                return (
                  <div key={claim.id} className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
                    <span className="text-2xl">{reward.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 truncate">{reward.title}</div>
                      <div className="text-xs text-gray-400">🪙 {reward.coinCost} pièces</div>
                    </div>
                    {claim.status === 'pending' && (
                      <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-xl text-xs font-bold">
                        <Clock className="w-3 h-3" /> En attente
                      </div>
                    )}
                    {claim.status === 'approved' && (
                      <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-xl text-xs font-bold">
                        <CheckCircle className="w-3 h-3" /> Accordé !
                      </div>
                    )}
                    {claim.status === 'rejected' && (
                      <div className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-xl text-xs font-bold">
                        <XCircle className="w-3 h-3" /> Refusé
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Rewards grid */}
      <div className="px-4">
        <h2 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-purple-600" /> Récompenses disponibles
        </h2>
        {availableRewards.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-8 text-center">
            <div className="text-5xl mb-3">🏪</div>
            <div className="font-bold text-gray-700">La boutique est vide</div>
            <div className="text-sm text-gray-400 mt-1">Tes parents n'ont pas encore ajouté de récompenses</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {availableRewards.map(reward => {
              const canAfford = coins >= reward.coinCost;
              const pendingClaim = getPendingClaim(reward.id);
              const approvedClaim = getApprovedClaim(reward.id);
              const missing = reward.coinCost - coins;

              return (
                <div
                  key={reward.id}
                  className={`relative rounded-3xl overflow-hidden shadow-lg transition-all duration-200 ${
                    !canAfford && !pendingClaim ? 'opacity-70' : ''
                  }`}
                >
                  {/* Card background */}
                  <div className={`bg-gradient-to-br ${reward.color} p-4 text-white`}>
                    {/* Lock icon overlay for unaffordable */}
                    {!canAfford && !pendingClaim && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-black/30 rounded-full flex items-center justify-center">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    )}

                    {/* Emoji */}
                    <div className="text-4xl mb-2 text-center">{reward.emoji}</div>

                    {/* Title */}
                    <div className="font-black text-sm text-center leading-tight mb-2">{reward.title}</div>

                    {/* Description */}
                    <div className="text-xs opacity-80 text-center leading-tight mb-3 line-clamp-2">
                      {reward.description}
                    </div>

                    {/* Coin cost badge */}
                    <div className="flex justify-center mb-3">
                      <div className="bg-white/25 rounded-xl px-3 py-1 flex items-center gap-1 text-sm font-black">
                        🪙 {reward.coinCost}
                      </div>
                    </div>

                    {/* Action button */}
                    {approvedClaim ? (
                      <div className="w-full bg-white/30 rounded-2xl py-2 text-center text-xs font-bold">
                        ✅ Accordé !
                      </div>
                    ) : pendingClaim ? (
                      <div className="w-full bg-white/30 rounded-2xl py-2 text-center text-xs font-bold flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" /> En attente...
                      </div>
                    ) : canAfford ? (
                      <button
                        onClick={() => handleClaim(reward.id, reward.coinCost, reward.title)}
                        className="w-full bg-white text-gray-800 rounded-2xl py-2 text-xs font-black hover:bg-white/90 transition-all active:scale-95"
                      >
                        Réclamer ! 🎉
                      </button>
                    ) : (
                      <div className="w-full bg-white/20 rounded-2xl py-2 text-center text-xs font-semibold opacity-90">
                        Il te faut {missing} 🪙 de plus
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* How to earn more coins */}
      <div className="px-4 mt-5">
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl p-4 text-white">
          <div className="font-black text-base mb-1">💡 Comment gagner des pièces ?</div>
          <div className="text-sm opacity-90">
            Chaque tâche validée te rapporte des 🪙 pièces d'or en plus de tes CHF !
            Plus la tâche est importante, plus tu gagnes de pièces.
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-32 left-4 right-4 bg-gray-900 text-white rounded-2xl p-4 text-center font-bold text-sm shadow-2xl z-50 animate-bounce-in">
          {toast}
        </div>
      )}
    </div>
  );
};
