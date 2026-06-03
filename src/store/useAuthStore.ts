import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Family } from '../types';

const DEMO_FAMILY: Family = {
  id: 'family-martin',
  name: 'Famille Martin',
  inviteCode: 'FAM123',
  parentIds: ['parent-sophie'],
  childIds: ['child-lea', 'child-noah', 'child-chloe'],
  plan: 'free',
  createdAt: '2024-01-01T00:00:00Z',
};

const DEMO_USERS: User[] = [
  {
    id: 'parent-sophie',
    role: 'parent',
    familyId: 'family-martin',
    name: 'Sophie Martin',
    email: 'demo@tipoche.ch',
    avatar: '👩‍💼',
    color: 'from-purple-500 to-indigo-600',
    level: 1,
    xp: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedBadges: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'child-lea',
    role: 'child',
    familyId: 'family-martin',
    name: 'Léa',
    avatar: '🧒',
    color: 'from-pink-400 to-rose-500',
    pin: '1234',
    level: 5,
    xp: 1150,
    streak: 12,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedBadges: ['first_task', 'tasks_5', 'tasks_10', 'streak_3', 'streak_7', 'maison_1', 'ecole_1', 'save_1', 'save_10', 'level_2', 'level_3'],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'child-noah',
    role: 'child',
    familyId: 'family-martin',
    name: 'Noah',
    avatar: '👦',
    color: 'from-blue-400 to-cyan-500',
    pin: '5678',
    level: 3,
    xp: 340,
    streak: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedBadges: ['first_task', 'tasks_5', 'streak_3', 'sport_1', 'save_1', 'level_2'],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'child-chloe',
    role: 'child',
    familyId: 'family-martin',
    name: 'Chloé',
    avatar: '👧',
    color: 'from-yellow-400 to-orange-500',
    pin: '9012',
    level: 2,
    xp: 180,
    streak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedBadges: ['first_task', 'maison_1', 'streak_3', 'save_1'],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

interface PendingSignup {
  name: string;
  email: string;
  password: string;
  familyName: string;
}

interface AuthState {
  currentUser: User | null;
  currentFamily: Family | null;
  isAuthenticated: boolean;
  allUsers: User[];
  pendingSignup: PendingSignup | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setPendingSignup: (data: PendingSignup) => void;
  createFamily: (opts: { familyName: string; parentAvatar: string; children: { name: string; age: string; avatar: string; pin: string }[] }) => void;
  switchToChild: (childId: string, pin: string) => boolean;
  switchToParent: () => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateFamily: (updates: Partial<Family>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      currentFamily: null,
      isAuthenticated: false,
      allUsers: DEMO_USERS,
      pendingSignup: null,

      setPendingSignup: (data) => set({ pendingSignup: data }),

      createFamily: ({ familyName, parentAvatar, children }) => {
        const pending = get().pendingSignup;
        const uid = () => Math.random().toString(36).slice(2, 10);
        const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();
        const now = new Date().toISOString();

        const parentId = 'parent-' + uid();
        const childUsers: User[] = children
          .filter(c => c.name.trim())
          .map(c => ({
            id: 'child-' + uid(),
            role: 'child' as const,
            familyId: '',
            name: c.name.trim(),
            avatar: c.avatar,
            color: ['from-pink-400 to-rose-500','from-blue-400 to-cyan-500','from-yellow-400 to-orange-500','from-green-400 to-teal-500'][Math.floor(Math.random()*4)],
            pin: c.pin || '1234',
            level: 1, xp: 0, streak: 0,
            lastActiveDate: now.split('T')[0],
            unlockedBadges: [],
            createdAt: now,
          }));

        const family: Family = {
          id: 'family-' + uid(),
          name: familyName || (pending?.familyName ?? 'Ma Famille'),
          inviteCode,
          parentIds: [parentId],
          childIds: childUsers.map(c => c.id),
          plan: 'free',
          createdAt: now,
        };

        const parent: User = {
          id: parentId,
          role: 'parent',
          familyId: family.id,
          name: pending?.name ?? 'Parent',
          email: pending?.email ?? '',
          avatar: parentAvatar,
          color: 'from-purple-500 to-indigo-600',
          level: 1, xp: 0, streak: 0,
          lastActiveDate: now.split('T')[0],
          unlockedBadges: [],
          createdAt: now,
        };

        const allUsers = [parent, ...childUsers.map(c => ({ ...c, familyId: family.id }))];

        set({
          currentUser: parent,
          currentFamily: family,
          isAuthenticated: true,
          allUsers,
          pendingSignup: null,
        });
      },

      login: async (email: string, password: string) => {
        if (email === 'demo@tipoche.ch' && password === 'demo1234') {
          const user = DEMO_USERS.find(u => u.email === email);
          if (user) {
            set({
              currentUser: user,
              currentFamily: DEMO_FAMILY,
              isAuthenticated: true,
              allUsers: DEMO_USERS,
            });
            return true;
          }
        }
        const user = get().allUsers.find(u => u.email === email);
        if (user && password.length >= 4) {
          set({ currentUser: user, currentFamily: DEMO_FAMILY, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null, currentFamily: null, isAuthenticated: false });
      },

      switchToChild: (childId: string, pin: string) => {
        const users = get().allUsers;
        const child = users.find(u => u.id === childId);
        if (child && child.pin === pin) {
          set({ currentUser: child });
          return true;
        }
        return false;
      },

      switchToParent: () => {
        const users = get().allUsers;
        const parent = users.find(u => u.role === 'parent');
        if (parent) {
          set({ currentUser: parent });
        }
      },

      updateUser: (userId: string, updates: Partial<User>) => {
        const users = get().allUsers.map(u => u.id === userId ? { ...u, ...updates } : u);
        const current = get().currentUser;
        set({
          allUsers: users,
          currentUser: current?.id === userId ? { ...current, ...updates } : current,
        });
      },

      updateFamily: (updates: Partial<Family>) => {
        const current = get().currentFamily;
        if (current) {
          set({ currentFamily: { ...current, ...updates } });
        }
      },
    }),
    { name: 'familyvault-auth' }
  )
);
