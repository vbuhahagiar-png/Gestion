import React from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/UI/Card';

interface AchievementDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  howTo: string;
  color: string;
  rarity: 'commun' | 'rare' | 'épique';
}

const allAchievements: AchievementDef[] = [
  {
    id: 'saver',
    name: 'Épargnant',
    description: 'Tu as économisé de l\'argent pour la première fois !',
    emoji: '🐷',
    howTo: 'Épargne de l\'argent vers un objectif',
    color: 'from-purple-400 to-violet-500',
    rarity: 'commun',
  },
  {
    id: 'chore_champion',
    name: 'Champion des Tâches',
    description: 'Tu as complété toutes tes tâches avec brio !',
    emoji: '🏆',
    howTo: 'Complete 5 tâches',
    color: 'from-amber-400 to-yellow-500',
    rarity: 'rare',
  },
  {
    id: 'goal_getter',
    name: 'Objectif Atteint',
    description: 'Félicitations ! Tu as réalisé un objectif d\'épargne !',
    emoji: '🎯',
    howTo: 'Complète un objectif d\'épargne',
    color: 'from-green-400 to-emerald-500',
    rarity: 'rare',
  },
  {
    id: 'regular_saver',
    name: 'Économiseur Régulier',
    description: 'Tu épargnes régulièrement chaque semaine !',
    emoji: '⭐',
    howTo: 'Épargne pendant 4 semaines consécutives',
    color: 'from-blue-400 to-indigo-500',
    rarity: 'épique',
  },
  {
    id: 'smart_spender',
    name: 'Acheteur Malin',
    description: 'Tu fais des achats réfléchis et intelligents !',
    emoji: '💡',
    howTo: 'Ne jamais dépenser plus que ton solde',
    color: 'from-pink-400 to-rose-500',
    rarity: 'commun',
  },
  {
    id: 'big_saver',
    name: 'Grand Épargnant',
    description: 'Tu as atteint 100€ d\'économies totales !',
    emoji: '💰',
    howTo: 'Accumule 100€ au total',
    color: 'from-orange-400 to-red-400',
    rarity: 'épique',
  },
  {
    id: 'generous',
    name: 'Généreux',
    description: 'Tu as reçu des cadeaux de ta famille !',
    emoji: '🎁',
    howTo: 'Reçois 3 cadeaux',
    color: 'from-teal-400 to-cyan-500',
    rarity: 'commun',
  },
  {
    id: 'marketplace_lover',
    name: 'Acheteur en Herbe',
    description: 'Tu as fait ton premier achat dans la boutique !',
    emoji: '🛍️',
    howTo: 'Effectue un achat dans la boutique',
    color: 'from-fuchsia-400 to-purple-500',
    rarity: 'commun',
  },
];

const rarityColors: Record<string, string> = {
  commun: 'bg-gray-100 text-gray-600 border-gray-200',
  rare: 'bg-blue-50 text-blue-600 border-blue-200',
  épique: 'bg-purple-50 text-purple-600 border-purple-200',
};

export const AchievementsPage: React.FC = () => {
  const { currentUser } = useStore();

  if (!currentUser || currentUser.type !== 'child') return null;

  const earned = currentUser.achievements;
  const earnedCount = earned.length;
  const totalCount = allAchievements.length;
  const pct = Math.round((earnedCount / totalCount) * 100);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-400 to-orange-500 p-6 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="relative">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-2xl font-nunito font-900 mb-1">Mes Succès</h1>
          <p className="text-white/80 font-inter text-sm mb-3">
            {earnedCount} / {totalCount} succès débloqués
          </p>
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-white/70 text-xs font-inter mt-1">{pct}% complété</p>
        </div>
      </div>

      {/* Earned badges */}
      {earnedCount > 0 && (
        <div>
          <h2 className="font-nunito font-800 text-gray-800 text-lg mb-3">✨ Débloqués ({earnedCount})</h2>
          <div className="grid grid-cols-2 gap-3">
            {allAchievements
              .filter((a) => earned.includes(a.id))
              .map((ach) => (
                <Card
                  key={ach.id}
                  className="overflow-hidden"
                >
                  <div className={`h-20 bg-gradient-to-br ${ach.color} flex items-center justify-center`}>
                    <span className="text-5xl animate-float">{ach.emoji}</span>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-nunito font-800 text-gray-800 text-sm">{ach.name}</h3>
                      <span className={`text-xs font-nunito font-600 px-2 py-0.5 rounded-full border ${rarityColors[ach.rarity]}`}>
                        {ach.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-inter">{ach.description}</p>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Locked badges */}
      <div>
        <h2 className="font-nunito font-800 text-gray-800 text-lg mb-3">🔒 À débloquer ({totalCount - earnedCount})</h2>
        <div className="grid grid-cols-2 gap-3">
          {allAchievements
            .filter((a) => !earned.includes(a.id))
            .map((ach) => (
              <Card key={ach.id} className="overflow-hidden opacity-60">
                <div className="h-20 bg-gray-200 flex items-center justify-center">
                  <span className="text-5xl grayscale">{ach.emoji}</span>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-nunito font-800 text-gray-600 text-sm">{ach.name}</h3>
                    <span className={`text-xs font-nunito font-600 px-2 py-0.5 rounded-full border ${rarityColors[ach.rarity]}`}>
                      {ach.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-inter italic">{ach.howTo}</p>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Encouragement */}
      <Card className="p-5 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100">
        <div className="flex items-center gap-4">
          <div className="text-4xl animate-wiggle">🐷</div>
          <div>
            <p className="font-nunito font-800 text-gray-800">Continue comme ça !</p>
            <p className="text-sm text-gray-500 font-inter">
              Tu n'es qu'à {totalCount - earnedCount} succès de les avoir tous ! Tu vas y arriver !
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
