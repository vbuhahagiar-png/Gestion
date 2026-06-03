import type { TaskCategory } from '../types';

export interface TaskTemplate {
  title: string;
  description: string;
  category: TaskCategory;
  emoji: string;
  rewardMoney: number;
  rewardXP: number;
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  // Maison
  { title: 'Ranger sa chambre', description: 'Mettre en ordre sa chambre complètement', category: 'maison', emoji: '🛏️', rewardMoney: 1.00, rewardXP: 20 },
  { title: 'Faire la vaisselle', description: 'Laver et ranger la vaisselle', category: 'maison', emoji: '🍽️', rewardMoney: 1.50, rewardXP: 25 },
  { title: 'Passer l\'aspirateur', description: 'Passer l\'aspirateur dans le salon', category: 'maison', emoji: '🧹', rewardMoney: 2.00, rewardXP: 30 },
  { title: 'Mettre la table', description: 'Préparer la table pour le dîner', category: 'maison', emoji: '🍴', rewardMoney: 0.50, rewardXP: 10 },
  { title: 'Vider le lave-vaisselle', description: 'Ranger toute la vaisselle propre', category: 'maison', emoji: '✨', rewardMoney: 0.50, rewardXP: 10 },
  { title: 'Nourrir les animaux', description: 'Donner à manger aux animaux de la maison', category: 'maison', emoji: '🐕', rewardMoney: 0.50, rewardXP: 15 },
  { title: 'Sortir les poubelles', description: 'Descendre les poubelles et les ressortir', category: 'maison', emoji: '🗑️', rewardMoney: 1.00, rewardXP: 20 },
  { title: 'Arroser les plantes', description: 'Arroser toutes les plantes de la maison', category: 'maison', emoji: '🌱', rewardMoney: 0.50, rewardXP: 10 },
  { title: 'Plier le linge', description: 'Plier et ranger son linge propre', category: 'maison', emoji: '👕', rewardMoney: 1.00, rewardXP: 20 },
  { title: 'Nettoyer la salle de bain', description: 'Nettoyer le lavabo et ranger', category: 'maison', emoji: '🚿', rewardMoney: 2.00, rewardXP: 30 },

  // École
  { title: 'Faire ses devoirs', description: 'Terminer tous les devoirs du jour', category: 'ecole', emoji: '📚', rewardMoney: 1.50, rewardXP: 25 },
  { title: 'Réviser les tables de multiplication', description: 'Apprendre les tables de 1 à 10', category: 'ecole', emoji: '🔢', rewardMoney: 1.00, rewardXP: 20 },
  { title: 'Lire 20 minutes', description: 'Lire un livre pendant 20 minutes', category: 'ecole', emoji: '📖', rewardMoney: 0.50, rewardXP: 15 },
  { title: 'Ranger son sac d\'école', description: 'Préparer le sac pour demain', category: 'ecole', emoji: '🎒', rewardMoney: 0.50, rewardXP: 10 },
  { title: 'Pratiquer la lecture', description: 'Lire à voix haute pendant 15 minutes', category: 'ecole', emoji: '📝', rewardMoney: 0.50, rewardXP: 15 },
  { title: 'Apprendre le vocabulaire', description: 'Mémoriser 10 nouveaux mots', category: 'ecole', emoji: '🔤', rewardMoney: 1.00, rewardXP: 20 },
  { title: 'Réviser pour l\'examen', description: 'Réviser pendant 30 minutes', category: 'ecole', emoji: '📋', rewardMoney: 2.00, rewardXP: 35 },

  // Sport
  { title: 'Aller à l\'entraînement', description: 'Participer à l\'entraînement sans se plaindre', category: 'sport', emoji: '⚽', rewardMoney: 1.00, rewardXP: 20 },
  { title: 'Faire 15 minutes de sport', description: 'Exercice physique de 15 minutes', category: 'sport', emoji: '🤸', rewardMoney: 0.50, rewardXP: 15 },
  { title: 'Promenade à vélo', description: 'Faire une sortie vélo de 30 minutes', category: 'sport', emoji: '🚲', rewardMoney: 0.50, rewardXP: 15 },
  { title: 'Nager 30 minutes', description: 'Faire des longueurs à la piscine', category: 'sport', emoji: '🏊', rewardMoney: 1.00, rewardXP: 25 },
  { title: 'Pratiquer la danse', description: 'S\'entraîner aux chorégraphies', category: 'sport', emoji: '💃', rewardMoney: 1.00, rewardXP: 20 },

  // Comportement
  { title: 'Se coucher à l\'heure', description: 'Être au lit avant l\'heure prévue', category: 'comportement', emoji: '😴', rewardMoney: 0.50, rewardXP: 10 },
  { title: 'Être gentil avec ses frères/sœurs', description: 'Passer la journée sans dispute', category: 'comportement', emoji: '🤝', rewardMoney: 1.00, rewardXP: 20 },
  { title: 'Manger ses légumes', description: 'Finir son assiette de légumes sans râler', category: 'comportement', emoji: '🥦', rewardMoney: 0.50, rewardXP: 10 },
  { title: 'Dire merci et s\'il te plaît', description: 'Être poli toute la journée', category: 'comportement', emoji: '🙏', rewardMoney: 0.50, rewardXP: 10 },
  { title: 'Limiter le temps d\'écran', description: 'Respecter la limite de temps d\'écran', category: 'comportement', emoji: '📵', rewardMoney: 1.00, rewardXP: 20 },
  { title: 'Aider sans qu\'on demande', description: 'Proposer son aide spontanément', category: 'comportement', emoji: '💝', rewardMoney: 1.50, rewardXP: 30 },

  // Créativité
  { title: 'Dessiner ou peindre', description: 'Créer un dessin ou une peinture', category: 'creativite', emoji: '🎨', rewardMoney: 0.50, rewardXP: 15 },
  { title: 'Cuisiner un plat simple', description: 'Préparer le goûter ou un repas simple', category: 'creativite', emoji: '👩‍🍳', rewardMoney: 1.50, rewardXP: 25 },
  { title: 'Jouer d\'un instrument', description: 'Pratiquer son instrument 15 minutes', category: 'creativite', emoji: '🎹', rewardMoney: 1.00, rewardXP: 20 },
  { title: 'Construire avec des LEGO', description: 'Construire une création originale', category: 'creativite', emoji: '🧱', rewardMoney: 0.50, rewardXP: 10 },
  { title: 'Écrire une histoire', description: 'Écrire une courte histoire créative', category: 'creativite', emoji: '✍️', rewardMoney: 1.00, rewardXP: 20 },
];

export const TASK_EMOJIS = [
  '🛏️', '🍽️', '🧹', '🍴', '✨', '🐕', '🗑️', '🌱', '👕', '🚿',
  '📚', '🔢', '📖', '🎒', '📝', '🔤', '📋', '📌', '🖊️', '📐',
  '⚽', '🤸', '🚲', '🏊', '💃', '🏋️', '🎾', '🏈', '⛸️', '🥊',
  '😴', '🤝', '🥦', '🙏', '📵', '💝', '😊', '💪', '🌟', '❤️',
  '🎨', '👩‍🍳', '🎹', '🧱', '✍️', '🎭', '🎬', '📸', '🎤', '🎸',
];
