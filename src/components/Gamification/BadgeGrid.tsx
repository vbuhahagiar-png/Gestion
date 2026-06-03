import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import type { BadgeDef } from '../../types';
import { Modal } from '../UI/Modal';

interface BadgeGridProps {
  badges: BadgeDef[];
  unlockedIds: string[];
  compact?: boolean;
}

const rarityLabel = { common: 'Commun', rare: 'Rare', epic: 'Épique', legendary: 'Légendaire' };
const rarityBorder = {
  common: 'border-gray-200',
  rare: 'border-blue-300',
  epic: 'border-purple-400',
  legendary: 'border-amber-400',
};
const rarityGlow = {
  common: '',
  rare: 'shadow-blue-200',
  epic: 'shadow-purple-300',
  legendary: 'shadow-amber-300',
};

export const BadgeGrid: React.FC<BadgeGridProps> = ({ badges, unlockedIds, compact = false }) => {
  const [selected, setSelected] = useState<BadgeDef | null>(null);

  if (compact) {
    const unlocked = badges.filter(b => unlockedIds.includes(b.id)).slice(0, 4);
    return (
      <div className="flex gap-2">
        {unlocked.map(badge => (
          <div
            key={badge.id}
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-xl shadow-md border-2 border-white`}
          >
            {badge.emoji}
          </div>
        ))}
        {badges.filter(b => unlockedIds.includes(b.id)).length > 4 && (
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
            +{badges.filter(b => unlockedIds.includes(b.id)).length - 4}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {badges.map(badge => {
          const unlocked = unlockedIds.includes(badge.id);
          return (
            <button
              key={badge.id}
              onClick={() => setSelected(badge)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all ${
                unlocked
                  ? `${rarityBorder[badge.rarity]} bg-white shadow-md ${rarityGlow[badge.rarity]}`
                  : 'border-gray-100 bg-gray-50 opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${unlocked ? `bg-gradient-to-br ${badge.color}` : 'bg-gray-200'}`}>
                {unlocked ? badge.emoji : <Lock className="w-5 h-5 text-gray-400" />}
              </div>
              <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight line-clamp-2">{badge.name}</span>
            </button>
          );
        })}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="text-center space-y-4">
            <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-5xl shadow-xl ${
              unlockedIds.includes(selected.id) ? '' : 'grayscale opacity-50'
            }`}>
              {unlockedIds.includes(selected.id) ? selected.emoji : <Lock className="w-10 h-10 text-gray-400" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">{selected.name}</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {rarityLabel[selected.rarity]}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{selected.description}</p>
            <div className="bg-gray-50 rounded-2xl p-3 text-sm text-gray-500">
              <span className="font-semibold">Comment l'obtenir : </span>{selected.unlockCondition}
            </div>
            {selected.isPremium && (
              <div className="bg-amber-50 rounded-2xl p-3 text-sm text-amber-700 font-medium">
                ✨ Badge Premium exclusif
              </div>
            )}
            {unlockedIds.includes(selected.id) ? (
              <div className="bg-emerald-50 rounded-2xl p-3 text-emerald-700 font-semibold text-sm">
                ✅ Badge débloqué !
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-3 text-gray-500 text-sm">
                🔒 Pas encore débloqué
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};
