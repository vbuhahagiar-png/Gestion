import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Wallet, Transaction, WithdrawalRequest, CalendarEvent, ShoppingItem, Notification, FamilyMessage, StoreReward, RewardClaim } from '../types';
import { useAuthStore } from './useAuthStore';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

const DEMO_TASKS: Task[] = [
  {
    id: 'task-1',
    familyId: 'family-martin',
    title: 'Ranger sa chambre',
    description: 'Mettre en ordre la chambre complètement, faire le lit',
    category: 'maison',
    frequency: 'daily',
    rewardType: 'money',
    rewardMoney: 1.00,
    rewardXP: 20,
    assignedTo: ['child-lea'],
    status: 'pending_approval',
    completedBy: 'child-lea',
    completedAt: today + 'T09:00:00Z',
    emoji: '🛏️',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'task-2',
    familyId: 'family-martin',
    title: 'Faire ses devoirs',
    description: 'Terminer tous les devoirs avant 18h',
    category: 'ecole',
    frequency: 'daily',
    rewardType: 'both',
    rewardMoney: 1.50,
    rewardBadgeId: 'ecole_1',
    rewardXP: 25,
    assignedTo: ['child-noah', 'child-lea'],
    status: 'pending_approval',
    completedBy: 'child-noah',
    completedAt: today + 'T15:30:00Z',
    emoji: '📚',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'task-3',
    familyId: 'family-martin',
    title: 'Mettre la table',
    description: 'Préparer la table pour le dîner',
    category: 'maison',
    frequency: 'daily',
    rewardType: 'money',
    rewardMoney: 0.50,
    rewardXP: 10,
    assignedTo: [],
    status: 'todo',
    emoji: '🍴',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'task-4',
    familyId: 'family-martin',
    title: 'Aller à l\'entraînement de foot',
    description: 'Participer à l\'entraînement du mercredi',
    category: 'sport',
    frequency: 'weekly',
    rewardType: 'money',
    rewardMoney: 1.00,
    rewardXP: 20,
    assignedTo: ['child-noah'],
    status: 'done',
    completedBy: 'child-noah',
    completedAt: twoDaysAgo + 'T17:00:00Z',
    approvedAt: twoDaysAgo + 'T18:00:00Z',
    emoji: '⚽',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'task-5',
    familyId: 'family-martin',
    title: 'Dessiner un tableau',
    description: 'Créer un dessin pour décorer le salon',
    category: 'creativite',
    frequency: 'once',
    rewardType: 'badge',
    rewardMoney: 0,
    rewardBadgeId: 'creativite_1',
    rewardXP: 30,
    assignedTo: ['child-chloe'],
    status: 'in_progress',
    emoji: '🎨',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'task-6',
    familyId: 'family-martin',
    title: 'Être gentil avec ses frères et sœurs',
    description: 'Passer la journée sans dispute ni crise',
    category: 'comportement',
    frequency: 'daily',
    rewardType: 'money',
    rewardMoney: 0.50,
    rewardXP: 15,
    assignedTo: [],
    status: 'todo',
    emoji: '🤝',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'task-7',
    familyId: 'family-martin',
    title: 'Lire 20 minutes',
    description: 'Lire un livre de son choix pendant 20 minutes',
    category: 'ecole',
    frequency: 'daily',
    rewardType: 'money',
    rewardMoney: 0.50,
    rewardXP: 15,
    assignedTo: ['child-lea', 'child-noah'],
    status: 'done',
    completedBy: 'child-lea',
    completedAt: yesterday + 'T19:00:00Z',
    approvedAt: yesterday + 'T20:00:00Z',
    emoji: '📖',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'task-8',
    familyId: 'family-martin',
    title: 'Vider le lave-vaisselle',
    description: 'Ranger toute la vaisselle propre dans les placards',
    category: 'maison',
    frequency: 'daily',
    rewardType: 'money',
    rewardMoney: 0.50,
    rewardXP: 10,
    assignedTo: ['child-chloe'],
    status: 'todo',
    emoji: '✨',
    createdAt: '2024-01-15T00:00:00Z',
  },
];

const DEMO_WALLETS: Wallet[] = [
  { childId: 'child-lea', balance: 23.50, totalEarned: 45.00, totalWithdrawn: 21.50 },
  { childId: 'child-noah', balance: 14.00, totalEarned: 28.50, totalWithdrawn: 14.50 },
  { childId: 'child-chloe', balance: 8.20, totalEarned: 15.70, totalWithdrawn: 7.50 },
];

const makeTransactions = (childId: string, entries: Array<{ type: 'earn' | 'withdraw', amount: number, description: string, daysAgo: number }>): Transaction[] =>
  entries.map((e, i) => ({
    id: `txn-${childId}-${i}`,
    childId,
    type: e.type,
    amount: e.amount,
    description: e.description,
    date: new Date(Date.now() - e.daysAgo * 86400000).toISOString(),
  }));

const DEMO_TRANSACTIONS: Transaction[] = [
  ...makeTransactions('child-lea', [
    { type: 'earn', amount: 1.00, description: 'Ranger sa chambre ✅', daysAgo: 0 },
    { type: 'earn', amount: 1.50, description: 'Devoirs terminés ✅', daysAgo: 1 },
    { type: 'withdraw', amount: 5.00, description: 'Retrait - Jouet LEGO', daysAgo: 2 },
    { type: 'earn', amount: 0.50, description: 'Mettre la table ✅', daysAgo: 2 },
    { type: 'earn', amount: 2.00, description: 'Passer l\'aspirateur ✅', daysAgo: 3 },
    { type: 'earn', amount: 1.00, description: 'Ranger sa chambre ✅', daysAgo: 4 },
    { type: 'withdraw', amount: 8.00, description: 'Retrait - Livres', daysAgo: 5 },
    { type: 'earn', amount: 1.50, description: 'Devoirs terminés ✅', daysAgo: 6 },
    { type: 'earn', amount: 0.50, description: 'Lire 20 minutes ✅', daysAgo: 7 },
    { type: 'earn', amount: 1.00, description: 'Ranger sa chambre ✅', daysAgo: 8 },
  ]),
  ...makeTransactions('child-noah', [
    { type: 'earn', amount: 1.50, description: 'Devoirs terminés ✅', daysAgo: 0 },
    { type: 'earn', amount: 1.00, description: 'Entraînement foot ✅', daysAgo: 2 },
    { type: 'withdraw', amount: 5.00, description: 'Retrait - Bonbons', daysAgo: 3 },
    { type: 'earn', amount: 0.50, description: 'Mettre la table ✅', daysAgo: 3 },
    { type: 'earn', amount: 2.00, description: 'Nager 30 minutes ✅', daysAgo: 4 },
    { type: 'earn', amount: 1.00, description: 'Ranger sa chambre ✅', daysAgo: 5 },
    { type: 'withdraw', amount: 3.50, description: 'Retrait - Cartes Pokémon', daysAgo: 6 },
    { type: 'earn', amount: 0.50, description: 'Être gentil ✅', daysAgo: 7 },
    { type: 'earn', amount: 1.50, description: 'Devoirs terminés ✅', daysAgo: 8 },
    { type: 'earn', amount: 1.00, description: 'Vélo 30 minutes ✅', daysAgo: 9 },
  ]),
  ...makeTransactions('child-chloe', [
    { type: 'earn', amount: 0.50, description: 'Vider le lave-vaisselle ✅', daysAgo: 1 },
    { type: 'earn', amount: 0.50, description: 'Être gentille ✅', daysAgo: 2 },
    { type: 'withdraw', amount: 2.00, description: 'Retrait - Cahier dessin', daysAgo: 3 },
    { type: 'earn', amount: 0.50, description: 'Arroser les plantes ✅', daysAgo: 4 },
    { type: 'earn', amount: 1.50, description: 'Cuisiner avec Maman ✅', daysAgo: 5 },
    { type: 'earn', amount: 0.50, description: 'Mettre la table ✅', daysAgo: 6 },
    { type: 'withdraw', amount: 3.00, description: 'Retrait - Peluche', daysAgo: 7 },
    { type: 'earn', amount: 0.50, description: 'Ranger sa chambre ✅', daysAgo: 8 },
    { type: 'earn', amount: 1.00, description: 'Dessiner un tableau ✅', daysAgo: 9 },
    { type: 'earn', amount: 0.20, description: 'Arroser les plantes ✅', daysAgo: 10 },
  ]),
];

const DEMO_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wr-1',
    childId: 'child-lea',
    amount: 10.00,
    status: 'pending',
    requestedAt: today + 'T10:00:00Z',
    note: 'Pour acheter le livre Harry Potter',
  },
  {
    id: 'wr-2',
    childId: 'child-noah',
    amount: 5.00,
    status: 'pending',
    requestedAt: yesterday + 'T16:00:00Z',
    note: 'Pour des bonbons',
  },
];

const DEMO_EVENTS: CalendarEvent[] = [
  { id: 'ev-1', familyId: 'family-martin', title: 'Entraînement foot Noah', date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], emoji: '⚽', color: 'bg-blue-500', assignedTo: ['child-noah'] },
  { id: 'ev-2', familyId: 'family-martin', title: 'Cours de danse Léa', date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], emoji: '💃', color: 'bg-pink-500', assignedTo: ['child-lea'] },
  { id: 'ev-3', familyId: 'family-martin', title: 'Sortie famille pique-nique', date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], emoji: '🧺', color: 'bg-green-500', assignedTo: [] },
  { id: 'ev-4', familyId: 'family-martin', title: 'Dentiste Chloé', date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], emoji: '🦷', color: 'bg-yellow-500', assignedTo: ['child-chloe'] },
  { id: 'ev-5', familyId: 'family-martin', title: 'Réunion parents-profs', date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0], emoji: '🏫', color: 'bg-purple-500', assignedTo: ['parent-sophie'] },
];

const DEMO_SHOPPING: ShoppingItem[] = [
  { id: 'sh-1', familyId: 'family-martin', name: 'Lait', emoji: '🥛', checked: false, addedBy: 'parent-sophie', addedAt: today + 'T08:00:00Z' },
  { id: 'sh-2', familyId: 'family-martin', name: 'Pommes', emoji: '🍎', checked: false, addedBy: 'child-lea', addedAt: today + 'T09:00:00Z' },
  { id: 'sh-3', familyId: 'family-martin', name: 'Pain', emoji: '🍞', checked: true, addedBy: 'parent-sophie', addedAt: yesterday + 'T10:00:00Z' },
  { id: 'sh-4', familyId: 'family-martin', name: 'Pâtes', emoji: '🍝', checked: false, addedBy: 'parent-sophie', addedAt: today + 'T08:30:00Z' },
  { id: 'sh-5', familyId: 'family-martin', name: 'Yaourts', emoji: '🥛', checked: true, addedBy: 'child-noah', addedAt: yesterday + 'T15:00:00Z' },
  { id: 'sh-6', familyId: 'family-martin', name: 'Bananes', emoji: '🍌', checked: false, addedBy: 'child-chloe', addedAt: today + 'T09:30:00Z' },
  { id: 'sh-7', familyId: 'family-martin', name: 'Fromage', emoji: '🧀', checked: true, addedBy: 'parent-sophie', addedAt: twoDaysAgo + 'T11:00:00Z' },
  { id: 'sh-8', familyId: 'family-martin', name: 'Jus d\'orange', emoji: '🍊', checked: true, addedBy: 'parent-sophie', addedAt: twoDaysAgo + 'T11:00:00Z' },
];

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'parent-sophie',
    type: 'task_pending',
    title: 'Tâche à valider',
    body: 'Léa a terminé "Ranger sa chambre" 🛏️',
    read: false,
    createdAt: today + 'T09:05:00Z',
    data: { taskId: 'task-1', childId: 'child-lea' },
  },
  {
    id: 'notif-2',
    userId: 'parent-sophie',
    type: 'task_pending',
    title: 'Tâche à valider',
    body: 'Noah a terminé ses devoirs 📚',
    read: false,
    createdAt: today + 'T15:35:00Z',
    data: { taskId: 'task-2', childId: 'child-noah' },
  },
  {
    id: 'notif-3',
    userId: 'parent-sophie',
    type: 'withdrawal_request',
    title: 'Demande de retrait',
    body: 'Léa demande CHF 10.00 pour un livre',
    read: false,
    createdAt: today + 'T10:05:00Z',
    data: { withdrawalId: 'wr-1', childId: 'child-lea' },
  },
];

const DEMO_REWARDS: StoreReward[] = [
  { id: 'reward-1', familyId: 'family-martin', title: '1h de jeux vidéo', description: 'Une heure supplémentaire de jeux vidéo ou tablette', emoji: '🎮', coinCost: 50, color: 'from-blue-400 to-indigo-500', available: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'reward-2', familyId: 'family-martin', title: 'Choisir le film du soir', description: 'Tu choisis le film ou la série du soir pour toute la famille', emoji: '🎬', coinCost: 30, color: 'from-purple-400 to-pink-500', available: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'reward-3', familyId: 'family-martin', title: 'Pas de tâches samedi', description: 'Un samedi entier sans corvées !', emoji: '🌴', coinCost: 120, color: 'from-green-400 to-teal-500', available: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'reward-4', familyId: 'family-martin', title: 'Pyjama party', description: 'Inviter un ami pour dormir à la maison', emoji: '🛏️', coinCost: 200, color: 'from-yellow-400 to-orange-500', available: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'reward-5', familyId: 'family-martin', title: 'Restaurant au choix', description: 'Tu choisis le restaurant pour le prochain repas en famille', emoji: '🍕', coinCost: 150, color: 'from-rose-400 to-red-500', available: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'reward-6', familyId: 'family-martin', title: 'Coucher 30min plus tard', description: 'Une soirée avec 30 minutes de plus avant de dormir', emoji: '🌙', coinCost: 40, color: 'from-violet-400 to-purple-500', available: true, createdAt: '2024-01-01T00:00:00Z' },
];

const DEMO_CLAIMS: RewardClaim[] = [];

interface FamilyState {
  tasks: Task[];
  wallets: Wallet[];
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  events: CalendarEvent[];
  shoppingItems: ShoppingItem[];
  notifications: Notification[];
  messages: FamilyMessage[];
  sendMessage: (fromId: string, toId: string, familyId: string, text: string, emoji: string) => void;
  markMessageRead: (messageId: string) => void;

  // Task actions
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string, childId: string) => void;
  approveTask: (taskId: string) => void;
  rejectTask: (taskId: string) => void;

  // Wallet actions
  getWallet: (childId: string) => Wallet | undefined;
  addTransaction: (transaction: Transaction) => void;

  // Withdrawal actions
  requestWithdrawal: (request: WithdrawalRequest) => void;
  approveWithdrawal: (requestId: string) => void;
  rejectWithdrawal: (requestId: string, note?: string) => void;

  // Calendar actions
  addEvent: (event: CalendarEvent) => void;
  deleteEvent: (eventId: string) => void;

  // Shopping actions
  addShoppingItem: (item: ShoppingItem) => void;
  toggleShoppingItem: (itemId: string) => void;
  deleteShoppingItem: (itemId: string) => void;
  clearCheckedItems: () => void;

  // Notification actions
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  addNotification: (notification: Notification) => void;

  // Store reward state
  storeRewards: StoreReward[];
  rewardClaims: RewardClaim[];

  // Store reward actions
  addStoreReward: (reward: StoreReward) => void;
  updateStoreReward: (rewardId: string, updates: Partial<StoreReward>) => void;
  deleteStoreReward: (rewardId: string) => void;
  claimReward: (claim: RewardClaim) => void;
  approveRewardClaim: (claimId: string, childId: string) => void;
  rejectRewardClaim: (claimId: string) => void;
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      tasks: DEMO_TASKS,
      wallets: DEMO_WALLETS,
      transactions: DEMO_TRANSACTIONS,
      withdrawals: DEMO_WITHDRAWALS,
      events: DEMO_EVENTS,
      shoppingItems: DEMO_SHOPPING,
      notifications: DEMO_NOTIFICATIONS,
      storeRewards: DEMO_REWARDS,
      rewardClaims: DEMO_CLAIMS,

      addTask: (task) => set(s => ({ tasks: [task, ...s.tasks] })),
      updateTask: (taskId, updates) => set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) })),
      deleteTask: (taskId) => set(s => ({ tasks: s.tasks.filter(t => t.id !== taskId) })),

      completeTask: (taskId, childId) => {
        set(s => ({
          tasks: s.tasks.map(t => t.id === taskId ? {
            ...t,
            status: 'pending_approval' as const,
            completedBy: childId,
            completedAt: new Date().toISOString(),
          } : t),
        }));
      },

      approveTask: (taskId) => {
        const state = get();
        const task = state.tasks.find(t => t.id === taskId);
        if (!task || !task.completedBy) return;

        const wallet = state.wallets.find(w => w.childId === task.completedBy);
        const newBalance = (wallet?.balance || 0) + task.rewardMoney;
        const newTotalEarned = (wallet?.totalEarned || 0) + task.rewardMoney;

        // Award coins = half XP value
        const coinsEarned = Math.floor(task.rewardXP / 2);
        if (coinsEarned > 0) {
          useAuthStore.getState().addCoins(task.completedBy!, coinsEarned);
        }

        set(s => ({
          tasks: s.tasks.map(t => t.id === taskId ? { ...t, status: 'done' as const, approvedAt: new Date().toISOString() } : t),
          wallets: s.wallets.map(w => w.childId === task.completedBy ? { ...w, balance: newBalance, totalEarned: newTotalEarned } : w),
          transactions: [{
            id: `txn-${Date.now()}`,
            childId: task.completedBy!,
            type: 'earn',
            amount: task.rewardMoney,
            description: `${task.emoji} ${task.title} ✅`,
            taskId: task.id,
            date: new Date().toISOString(),
          }, ...s.transactions],
          notifications: [{
            id: `notif-${Date.now()}`,
            userId: task.completedBy!,
            type: 'task_approved',
            title: 'Tâche validée ! 🎉',
            body: `"${task.title}" a été validée ! Tu gagnes CHF ${task.rewardMoney.toFixed(2)}${coinsEarned > 0 ? ` et 🪙 ${coinsEarned} pièces` : ''}`,
            read: false,
            createdAt: new Date().toISOString(),
          }, ...s.notifications],
        }));
      },

      rejectTask: (taskId) => {
        set(s => ({
          tasks: s.tasks.map(t => t.id === taskId ? {
            ...t,
            status: 'todo' as const,
            completedBy: undefined,
            completedAt: undefined,
          } : t),
        }));
      },

      getWallet: (childId) => get().wallets.find(w => w.childId === childId),

      addTransaction: (transaction) => set(s => ({ transactions: [transaction, ...s.transactions] })),

      requestWithdrawal: (request) => set(s => ({ withdrawals: [request, ...s.withdrawals] })),

      approveWithdrawal: (requestId) => {
        const state = get();
        const request = state.withdrawals.find(w => w.id === requestId);
        if (!request) return;

        const wallet = state.wallets.find(w => w.childId === request.childId);
        const newBalance = (wallet?.balance || 0) - request.amount;
        const newTotalWithdrawn = (wallet?.totalWithdrawn || 0) + request.amount;

        set(s => ({
          withdrawals: s.withdrawals.map(w => w.id === requestId ? { ...w, status: 'approved' as const, processedAt: new Date().toISOString() } : w),
          wallets: s.wallets.map(w => w.childId === request.childId ? { ...w, balance: Math.max(0, newBalance), totalWithdrawn: newTotalWithdrawn } : w),
          transactions: [{
            id: `txn-${Date.now()}`,
            childId: request.childId,
            type: 'withdraw',
            amount: request.amount,
            description: `💸 Retrait validé${request.note ? ` - ${request.note}` : ''}`,
            date: new Date().toISOString(),
          }, ...s.transactions],
        }));
      },

      rejectWithdrawal: (requestId, note) => {
        set(s => ({
          withdrawals: s.withdrawals.map(w => w.id === requestId ? {
            ...w,
            status: 'declined' as const,
            processedAt: new Date().toISOString(),
            note: note || w.note,
          } : w),
        }));
      },

      addEvent: (event) => set(s => ({ events: [event, ...s.events] })),
      deleteEvent: (eventId) => set(s => ({ events: s.events.filter(e => e.id !== eventId) })),

      addShoppingItem: (item) => set(s => ({ shoppingItems: [item, ...s.shoppingItems] })),
      toggleShoppingItem: (itemId) => set(s => ({
        shoppingItems: s.shoppingItems.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i),
      })),
      deleteShoppingItem: (itemId) => set(s => ({ shoppingItems: s.shoppingItems.filter(i => i.id !== itemId) })),
      clearCheckedItems: () => set(s => ({ shoppingItems: s.shoppingItems.filter(i => !i.checked) })),

      markNotificationRead: (notifId) => set(s => ({
        notifications: s.notifications.map(n => n.id === notifId ? { ...n, read: true } : n),
      })),
      markAllNotificationsRead: (userId) => set(s => ({
        notifications: s.notifications.map(n => n.userId === userId ? { ...n, read: true } : n),
      })),
      addNotification: (notification) => set(s => ({ notifications: [notification, ...s.notifications] })),

      addStoreReward: (reward) => set(s => ({ storeRewards: [...s.storeRewards, reward] })),
      updateStoreReward: (rewardId, updates) => set(s => ({
        storeRewards: s.storeRewards.map(r => r.id === rewardId ? { ...r, ...updates } : r),
      })),
      deleteStoreReward: (rewardId) => set(s => ({
        storeRewards: s.storeRewards.filter(r => r.id !== rewardId),
      })),
      claimReward: (claim) => set(s => ({ rewardClaims: [claim, ...s.rewardClaims] })),
      approveRewardClaim: (claimId, _childId) => set(s => ({
        rewardClaims: s.rewardClaims.map(c => c.id === claimId ? { ...c, status: 'approved' as const, processedAt: new Date().toISOString() } : c),
      })),
      rejectRewardClaim: (claimId) => set(s => ({
        rewardClaims: s.rewardClaims.map(c => c.id === claimId ? { ...c, status: 'rejected' as const, processedAt: new Date().toISOString() } : c),
      })),

      messages: [],
      sendMessage: (fromId, toId, familyId, text, emoji) => set(s => ({
        messages: [{
          id: `msg-${Date.now()}`,
          familyId,
          fromId,
          toId,
          text,
          emoji,
          read: false,
          createdAt: new Date().toISOString(),
        }, ...s.messages],
      })),
      markMessageRead: (messageId) => set(s => ({
        messages: s.messages.map(m => m.id === messageId ? { ...m, read: true } : m),
      })),
    }),
    { name: 'familyvault-data' }
  )
);
