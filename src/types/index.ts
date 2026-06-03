export type UserRole = 'parent' | 'child';
export type TaskStatus = 'todo' | 'in_progress' | 'pending_approval' | 'done';
export type TaskCategory = 'maison' | 'ecole' | 'sport' | 'comportement' | 'creativite';
export type TaskFrequency = 'once' | 'daily' | 'weekly' | 'monthly';
export type RewardType = 'badge' | 'money' | 'both';
export type WithdrawalStatus = 'pending' | 'approved' | 'declined';
export type PlanType = 'free' | 'premium';

export interface User {
  id: string;
  role: UserRole;
  familyId: string;
  name: string;
  email?: string;
  avatar: string;
  color: string;
  pin?: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate: string;
  unlockedBadges: string[];
  createdAt: string;
}

export interface Family {
  id: string;
  name: string;
  inviteCode: string;
  parentIds: string[];
  childIds: string[];
  plan: PlanType;
  createdAt: string;
}

export interface Task {
  id: string;
  familyId: string;
  title: string;
  description: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  rewardType: RewardType;
  rewardMoney: number;
  rewardBadgeId?: string;
  rewardXP: number;
  assignedTo: string[];
  status: TaskStatus;
  completedBy?: string;
  completedAt?: string;
  approvedAt?: string;
  dueDate?: string;
  emoji: string;
  createdAt: string;
}

export interface Wallet {
  childId: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
}

export interface Transaction {
  id: string;
  childId: string;
  type: 'earn' | 'withdraw';
  amount: number;
  description: string;
  taskId?: string;
  date: string;
}

export interface WithdrawalRequest {
  id: string;
  childId: string;
  amount: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  note?: string;
}

export interface CalendarEvent {
  id: string;
  familyId: string;
  title: string;
  date: string;
  emoji: string;
  color: string;
  assignedTo?: string[];
}

export interface ShoppingItem {
  id: string;
  familyId: string;
  name: string;
  emoji: string;
  checked: boolean;
  addedBy: string;
  addedAt: string;
}

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  unlockCondition: string;
  isPremium: boolean;
}

export interface FamilyMessage {
  id: string;
  familyId: string;
  fromId: string;
  toId: string;
  text: string;
  emoji: string;
  read: boolean;
  createdAt: string;
}

export interface StoreReward {
  id: string;
  familyId: string;
  title: string;
  description: string;
  emoji: string;
  coinCost: number;
  color: string;
  available: boolean;
  createdAt: string;
}

export interface RewardClaim {
  id: string;
  rewardId: string;
  childId: string;
  familyId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task_pending' | 'withdrawal_request' | 'task_approved' | 'badge_unlocked' | 'level_up';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, string>;
}

export const LEVELS = [
  { level: 1, name: 'Petit Apprenti', xpRequired: 0, emoji: '🌱' },
  { level: 2, name: 'Étoile Montante', xpRequired: 100, emoji: '⭐' },
  { level: 3, name: 'Super Héros', xpRequired: 250, emoji: '🦸' },
  { level: 4, name: 'Champion', xpRequired: 500, emoji: '🏆' },
  { level: 5, name: 'Super Étoile', xpRequired: 1000, emoji: '✨' },
  { level: 6, name: 'Légende', xpRequired: 2000, emoji: '👑' },
  { level: 7, name: 'Maître Ultime', xpRequired: 4000, emoji: '🌟' },
];
