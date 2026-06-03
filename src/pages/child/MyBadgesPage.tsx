import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ChildNav } from '../../components/Layout/ChildNav';
import { BADGES } from '../../data/badges';
import { Modal } from '../../components/UI/Modal';
import type { BadgeDef } from '../../types';

type Rarity = 'all' | 'common' | 'rare' | 'epic' | 'legendary';

const rarityLabel = { common: 'Commun', rare: 'Rare', epic: 'Épique', legendary: 'Légendaire' };
const rarityColors: Record<string, string> = {
  common: 'border-gray-200 bg-gray-50',
  rare: 'border-blue-200 bg-blue-50',
  epic: 'border-purple-200 bg-purple-50',
  legendary: 'border-amber-300 bg-amber-50',
};
const rarityGlow: Record<string, string> = {
  common: '',
  rare: 'shadow-blue-200',
  epic: 'shadow-purple-200',
  legendary: 'shadow-amber-200',
};

export const MyBadgesPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { allUsers } = useAuthStore();
  const [activeRarity, setActiveRarity] = useState<Rarity>('all');
  const [selected, setSelected] = useState<BadgeDef | null>(null);

  const child = allUsers.find(u => u.id === childId);
  const unlockedIds = child?.unlockedBadges || [];

  const filtered = BADGES.filter(b =>
    activeRarity === 'all' || b.rarity === activeRarity
  );

  const unlockedCount = BADGES.filter(b => unlockedIds.includes(b.id)).length;

  const tabs: { value: Rarity; label: string; emoji: string }[] = [
    { value: 'all', label: 'Tous', emoji: '🏅' },
    { value: 'common', label: 'Commun', emoji: '🟢' },
    { value: 'rare', label: 'Rare', emoji: '🔵' },
    { value: 'epic', label: 'Épique', emoji: '🟣' },
    { value: 'legendary', label: 'Légendaire', emoji: '🌟' },
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-red-500 pt-10 pb-6 px-4 text-white">
        <div className="text-xl font-black mb-1">Mes Badges 🏆</div>
        <div className="text-orange-100 text-sm">
          {unlockedCount} sur {BADGES.length} badges débloqués
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${Math.round((unlockedCount / BADGES.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Rarity tabs */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveRarity(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeRarity === tab.value
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badge grid */}
      <div className="px-4">
        <div className="grid grid-cols-4 gap-3">
          {filtered.map(badge => {
            const unlocked = unlockedIds.includes(badge.id);
            return (
              <button
                key={badge.id}
                onClick={() => setSelected(badge)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all active:scale-95 ${
                  unlocked
                    ? `${rarityColors[badge.rarity]} ${badge.rarity !== 'common' ? `shadow-lg ${rarityGlow[badge.rarity]}` : ''}`
                    : 'border-gray-100 bg-gray-50 opacity-40'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                  unlocked ? `bg-gradient-to-br ${badge.color}` : 'bg-gray-200'
                }`}>
                  {unlocked ? badge.emoji : <Lock className="w-5 h-5 text-gray-300" />}
                </div>
                <span className="text-[9px] font-bold text-gray-600 text-center leading-tight line-clamp-2">
                  {badge.name}
                </span>
                {badge.rarity !== 'common' && (
                  <span className={`text-[8px] font-black ${
                    badge.rarity === 'legendary' ? 'text-amber-600' :
                    badge.rarity === 'epic' ? 'text-purple-600' : 'text-blue-600'
                  }`}>
                    {rarityLabel[badge.rarity].toUpperCase()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badge detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="text-center space-y-4">
            <div className={`w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-6xl shadow-2xl ${
              unlockedIds.includes(selected.id) ? '' : 'grayscale opacity-50'
            }`}>
              {unlockedIds.includes(selected.id) ? selected.emoji : <Lock className="w-10 h-10 text-gray-300" />}
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900">{selected.name}</h3>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                selected.rarity === 'legendary' ? 'bg-amber-100 text-amber-700' :
                selected.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                selected.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {rarityLabel[selected.rarity].toUpperCase()}
              </span>
            </div>

            <p className="text-gray-600 text-sm">{selected.description}</p>

            <div className="bg-gray-50 rounded-2xl p-3 text-sm text-gray-500">
              <span className="font-semibold">Comment l'obtenir :</span>
              <br />{selected.unlockCondition}
            </div>

            {selected.isPremium && (
              <div className="bg-amber-50 rounded-2xl p-3 text-amber-700 font-semibold text-sm">
                ✨ Badge Premium exclusif
              </div>
            )}

            {unlockedIds.includes(selected.id) ? (
              <div className="bg-emerald-50 rounded-2xl p-3 text-emerald-700 font-bold">
                🎉 Badge débloqué ! Félicitations !
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-3 text-gray-500">
                🔒 Continue tes efforts pour débloquer ce badge !
              </div>
            )}
          </div>
        )}
      </Modal>

      <ChildNav />
    </div>
  );
};
