import type { BadgeDef } from '../types';

export const BADGES: BadgeDef[] = [
  // Tâches - Common
  { id: 'first_task', name: 'Premier Pas', description: 'Complète ta première tâche', emoji: '👶', rarity: 'common', color: 'from-green-400 to-emerald-500', unlockCondition: 'Compléter 1 tâche', isPremium: false },
  { id: 'tasks_5', name: 'Débutant Actif', description: 'Complète 5 tâches au total', emoji: '✅', rarity: 'common', color: 'from-blue-400 to-cyan-500', unlockCondition: 'Compléter 5 tâches', isPremium: false },
  { id: 'tasks_10', name: 'Travailleur', description: 'Complète 10 tâches au total', emoji: '💪', rarity: 'common', color: 'from-orange-400 to-amber-500', unlockCondition: 'Compléter 10 tâches', isPremium: false },
  { id: 'tasks_25', name: 'Régulier', description: 'Complète 25 tâches au total', emoji: '🌟', rarity: 'rare', color: 'from-purple-400 to-violet-500', unlockCondition: 'Compléter 25 tâches', isPremium: false },
  { id: 'tasks_50', name: 'Machine de Guerre', description: 'Complète 50 tâches au total', emoji: '🤖', rarity: 'epic', color: 'from-red-400 to-pink-500', unlockCondition: 'Compléter 50 tâches', isPremium: false },
  { id: 'tasks_100', name: 'Légende des Tâches', description: 'Complète 100 tâches au total', emoji: '🏆', rarity: 'legendary', color: 'from-yellow-400 to-orange-500', unlockCondition: 'Compléter 100 tâches', isPremium: false },

  // Maison
  { id: 'maison_1', name: 'Petit Rangeur', description: 'Complète 1 tâche de maison', emoji: '🏠', rarity: 'common', color: 'from-blue-300 to-indigo-400', unlockCondition: 'Compléter 1 tâche maison', isPremium: false },
  { id: 'maison_5', name: 'Super Rangeur', description: 'Complète 5 tâches de maison', emoji: '🧹', rarity: 'rare', color: 'from-cyan-400 to-blue-500', unlockCondition: 'Compléter 5 tâches maison', isPremium: false },
  { id: 'maison_20', name: 'Maître de la Maison', description: 'Complète 20 tâches de maison', emoji: '🏡', rarity: 'epic', color: 'from-indigo-400 to-purple-500', unlockCondition: 'Compléter 20 tâches maison', isPremium: false },

  // École
  { id: 'ecole_1', name: 'Écolier Sérieux', description: 'Complète 1 tâche scolaire', emoji: '📚', rarity: 'common', color: 'from-green-300 to-teal-400', unlockCondition: 'Compléter 1 tâche école', isPremium: false },
  { id: 'ecole_5', name: 'Élève Modèle', description: 'Complète 5 tâches scolaires', emoji: '🎓', rarity: 'rare', color: 'from-teal-400 to-green-500', unlockCondition: 'Compléter 5 tâches école', isPremium: false },
  { id: 'ecole_10', name: 'Génie des Maths', description: 'Complète 10 tâches scolaires', emoji: '🧮', rarity: 'epic', color: 'from-emerald-400 to-teal-500', unlockCondition: 'Compléter 10 tâches école', isPremium: false },

  // Sport
  { id: 'sport_1', name: 'Sportif en Herbe', description: 'Complète 1 tâche sportive', emoji: '⚽', rarity: 'common', color: 'from-orange-300 to-red-400', unlockCondition: 'Compléter 1 tâche sport', isPremium: false },
  { id: 'sport_5', name: 'Athlète', description: 'Complète 5 tâches sportives', emoji: '🏅', rarity: 'rare', color: 'from-red-400 to-rose-500', unlockCondition: 'Compléter 5 tâches sport', isPremium: false },
  { id: 'sport_10', name: 'Champion Sportif', description: 'Complète 10 tâches sportives', emoji: '🥇', rarity: 'epic', color: 'from-yellow-400 to-red-500', unlockCondition: 'Compléter 10 tâches sport', isPremium: false },

  // Comportement
  { id: 'comportement_1', name: 'Bonne Conduite', description: 'Reçois 1 badge de comportement', emoji: '😇', rarity: 'common', color: 'from-pink-300 to-rose-400', unlockCondition: 'Compléter 1 tâche comportement', isPremium: false },
  { id: 'comportement_5', name: 'Ange Gardien', description: 'Reçois 5 badges de comportement', emoji: '👼', rarity: 'rare', color: 'from-rose-400 to-pink-500', unlockCondition: 'Compléter 5 tâches comportement', isPremium: false },

  // Créativité
  { id: 'creativite_1', name: 'Petit Artiste', description: 'Complète 1 tâche créative', emoji: '🎨', rarity: 'common', color: 'from-violet-300 to-purple-400', unlockCondition: 'Compléter 1 tâche créativité', isPremium: false },
  { id: 'creativite_5', name: 'Mini Chef', description: 'Complète 5 tâches créatives', emoji: '👨‍🍳', rarity: 'rare', color: 'from-purple-400 to-fuchsia-500', unlockCondition: 'Compléter 5 tâches créativité', isPremium: false },

  // Streaks
  { id: 'streak_3', name: '3 Jours d\'Affilée', description: 'Maintiens une série de 3 jours', emoji: '🔥', rarity: 'common', color: 'from-orange-400 to-red-500', unlockCondition: 'Série de 3 jours', isPremium: false },
  { id: 'streak_7', name: 'Une Semaine Parfaite', description: 'Maintiens une série de 7 jours', emoji: '🌈', rarity: 'rare', color: 'from-yellow-400 to-orange-500', unlockCondition: 'Série de 7 jours', isPremium: false },
  { id: 'streak_14', name: 'Deux Semaines !', description: 'Maintiens une série de 14 jours', emoji: '⚡', rarity: 'rare', color: 'from-amber-400 to-yellow-500', unlockCondition: 'Série de 14 jours', isPremium: false },
  { id: 'streak_30', name: 'Mois de Feu', description: 'Maintiens une série de 30 jours', emoji: '💥', rarity: 'epic', color: 'from-red-500 to-orange-600', unlockCondition: 'Série de 30 jours', isPremium: false },
  { id: 'streak_100', name: 'Centenaire', description: 'Maintiens une série de 100 jours', emoji: '💎', rarity: 'legendary', color: 'from-cyan-400 to-blue-600', unlockCondition: 'Série de 100 jours', isPremium: false },

  // Économies
  { id: 'save_1', name: 'Petit Épargnant', description: 'Économise ton premier CHF', emoji: '🐷', rarity: 'common', color: 'from-pink-300 to-pink-500', unlockCondition: 'Gagner CHF 1', isPremium: false },
  { id: 'save_10', name: 'Bon Gestionnaire', description: 'Économise CHF 10', emoji: '💰', rarity: 'common', color: 'from-green-400 to-emerald-500', unlockCondition: 'Gagner CHF 10', isPremium: false },
  { id: 'save_50', name: 'Millionnaire Junior', description: 'Économise CHF 50', emoji: '💵', rarity: 'rare', color: 'from-emerald-500 to-green-600', unlockCondition: 'Gagner CHF 50', isPremium: false },
  { id: 'save_100', name: 'Banquier en Herbe', description: 'Économise CHF 100 au total', emoji: '🏦', rarity: 'epic', color: 'from-yellow-500 to-green-500', unlockCondition: 'Gagner CHF 100', isPremium: false },

  // Niveaux
  { id: 'level_2', name: 'Étoile Montante', description: 'Atteins le niveau 2', emoji: '⭐', rarity: 'common', color: 'from-yellow-300 to-amber-400', unlockCondition: 'Atteindre niveau 2', isPremium: false },
  { id: 'level_3', name: 'Super Héros', description: 'Atteins le niveau 3', emoji: '🦸', rarity: 'rare', color: 'from-blue-400 to-indigo-500', unlockCondition: 'Atteindre niveau 3', isPremium: false },
  { id: 'level_4', name: 'Champion', description: 'Atteins le niveau 4', emoji: '🏆', rarity: 'epic', color: 'from-yellow-500 to-orange-500', unlockCondition: 'Atteindre niveau 4', isPremium: false },
  { id: 'level_5', name: 'Super Étoile', description: 'Atteins le niveau 5', emoji: '✨', rarity: 'epic', color: 'from-purple-500 to-pink-500', unlockCondition: 'Atteindre niveau 5', isPremium: false },
  { id: 'level_6', name: 'Légende Vivante', description: 'Atteins le niveau 6', emoji: '👑', rarity: 'legendary', color: 'from-yellow-400 to-amber-600', unlockCondition: 'Atteindre niveau 6', isPremium: false },
  { id: 'level_7', name: 'Maître Ultime', description: 'Atteins le niveau maximum', emoji: '🌟', rarity: 'legendary', color: 'from-indigo-500 to-purple-600', unlockCondition: 'Atteindre niveau 7', isPremium: false },

  // Spéciaux
  { id: 'early_bird', name: 'Lève-Tôt', description: 'Complète une tâche avant 8h du matin', emoji: '🌅', rarity: 'rare', color: 'from-orange-300 to-yellow-400', unlockCondition: 'Tâche complétée avant 8h', isPremium: false },
  { id: 'perfectionist', name: 'Perfectionniste', description: 'Complète 3 tâches dans la même journée', emoji: '💯', rarity: 'rare', color: 'from-blue-400 to-purple-500', unlockCondition: '3 tâches en un jour', isPremium: false },
  { id: 'weekend_warrior', name: 'Guerrier du Weekend', description: 'Complète des tâches samedi et dimanche', emoji: '🏄', rarity: 'rare', color: 'from-teal-400 to-cyan-500', unlockCondition: 'Tâches le weekend', isPremium: false },
  { id: 'helper', name: 'Grand Cœur', description: 'Aide un autre membre de la famille', emoji: '🤝', rarity: 'rare', color: 'from-red-300 to-pink-400', unlockCondition: 'Tâche de famille', isPremium: false },
  { id: 'consistent', name: 'Sans Faille', description: 'Aucune tâche expirée pendant 2 semaines', emoji: '🎯', rarity: 'epic', color: 'from-green-500 to-teal-600', unlockCondition: '2 semaines sans retard', isPremium: false },
  { id: 'variety', name: 'Touche-à-Tout', description: 'Complète des tâches dans 5 catégories', emoji: '🎭', rarity: 'epic', color: 'from-fuchsia-400 to-violet-500', unlockCondition: '5 catégories différentes', isPremium: false },

  // Premium badges
  { id: 'premium_legend', name: 'Légende Familiale', description: 'Badge exclusif pour les familles Premium', emoji: '💜', rarity: 'legendary', color: 'from-purple-600 to-indigo-700', unlockCondition: 'Abonnement Premium actif', isPremium: true },
  { id: 'premium_diamond', name: 'Diamant de la Famille', description: 'Le badge ultime des familles Premium', emoji: '💠', rarity: 'legendary', color: 'from-cyan-500 to-blue-700', unlockCondition: 'Premium + 50 tâches', isPremium: true },
  { id: 'premium_gold', name: 'Famille en Or', description: 'Badge doré exclusif Premium', emoji: '🥇', rarity: 'legendary', color: 'from-yellow-400 to-amber-600', unlockCondition: 'Premium + série 30 jours', isPremium: true },
  { id: 'premium_star', name: 'Super Star Premium', description: 'Seulement pour les vrais champions', emoji: '🌠', rarity: 'legendary', color: 'from-violet-500 to-purple-700', unlockCondition: 'Premium + niveau 6', isPremium: true },

  // Fun & Special
  { id: 'night_owl', name: 'Chouette Nocturne', description: 'Marque une tâche après 21h', emoji: '🦉', rarity: 'rare', color: 'from-indigo-400 to-blue-600', unlockCondition: 'Tâche après 21h', isPremium: false },
  { id: 'comeback', name: 'Retour en Force', description: 'Reviens après 7 jours d\'absence', emoji: '🦅', rarity: 'rare', color: 'from-orange-500 to-red-500', unlockCondition: 'Retour après 7 jours', isPremium: false },
  { id: 'social', name: 'Esprit d\'Équipe', description: 'Toute la famille est active le même jour', emoji: '👨‍👩‍👧‍👦', rarity: 'epic', color: 'from-pink-400 to-rose-600', unlockCondition: 'Toute la famille active', isPremium: false },
  { id: 'speed_demon', name: 'Éclair', description: 'Complète 5 tâches en moins d\'une heure', emoji: '⚡', rarity: 'epic', color: 'from-yellow-400 to-amber-500', unlockCondition: '5 tâches en 1 heure', isPremium: false },
  { id: 'new_year', name: 'Bonne Année !', description: 'Actif le 1er janvier', emoji: '🎆', rarity: 'rare', color: 'from-blue-500 to-indigo-600', unlockCondition: 'Actif le 1er janvier', isPremium: false },
  { id: 'birthday', name: 'Joyeux Anniversaire', description: 'Actif le jour de ton anniversaire', emoji: '🎂', rarity: 'epic', color: 'from-pink-500 to-red-500', unlockCondition: 'Actif le jour de ton anniversaire', isPremium: false },
];
