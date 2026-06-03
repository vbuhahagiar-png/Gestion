import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Transaction, Goal, Chore, CartItem, PendingPurchase, Toast } from '../types';
import { mockUsers } from '../data/mockUsers';
import { marketplaceItems } from '../data/marketplaceItems';

interface AppState {
  // Users
  users: User[];
  currentUser: User | null;
  isParentUnlocked: boolean;

  // Cart
  cart: CartItem[];

  // Pending purchases
  pendingPurchases: PendingPurchase[];

  // Toasts
  toasts: Toast[];

  // UI
  showCart: boolean;
  viewMode: 'grid' | 'list';

  // Actions: Auth
  login: (userId: string) => void;
  logout: () => void;
  unlockParent: (pin: string) => boolean;
  lockParent: () => void;

  // Actions: Balance
  addMoney: (childId: string, amount: number, description: string, category: Transaction['category']) => void;
  deductMoney: (childId: string, amount: number, description: string, category: Transaction['category'], productId?: string) => void;

  // Actions: Goals
  addGoal: (childId: string, goal: Omit<Goal, 'id' | 'completed'>) => void;
  updateGoalAmount: (childId: string, goalId: string, amount: number) => void;
  completeGoal: (childId: string, goalId: string) => void;
  deleteGoal: (childId: string, goalId: string) => void;

  // Actions: Chores
  addChore: (childId: string, chore: Omit<Chore, 'id'>) => void;
  updateChoreStatus: (childId: string, choreId: string, status: Chore['status']) => void;
  approveChore: (childId: string, choreId: string) => void;
  rejectChore: (childId: string, choreId: string) => void;

  // Actions: Cart
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setShowCart: (show: boolean) => void;

  // Actions: Wishlist
  toggleWishlist: (childId: string, productId: string) => void;

  // Actions: Purchases
  requestPurchase: () => void;
  approvePurchase: (purchaseId: string) => void;
  rejectPurchase: (purchaseId: string) => void;

  // Actions: Allowance
  setAllowance: (childId: string, amount: number, frequency: 'weekly' | 'monthly') => void;
  setSpendingLimit: (childId: string, limit: number) => void;

  // Actions: Toasts
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Actions: View
  setViewMode: (mode: 'grid' | 'list') => void;

  // Actions: User
  addChild: (child: Omit<User, 'id' | 'type' | 'achievements' | 'goals' | 'transactions' | 'chores' | 'wishlist'>) => void;

  // Selectors helpers
  getChildren: () => User[];
  getChildById: (id: string) => User | undefined;
}

const generateId = () => Math.random().toString(36).slice(2, 11);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: mockUsers,
      currentUser: null,
      isParentUnlocked: false,
      cart: [],
      pendingPurchases: [],
      toasts: [],
      showCart: false,
      viewMode: 'grid',

      // Auth
      login: (userId) => {
        const user = get().users.find((u) => u.id === userId);
        if (user) {
          set({ currentUser: user, isParentUnlocked: false });
        }
      },

      logout: () => set({ currentUser: null, isParentUnlocked: false, cart: [] }),

      unlockParent: (pin) => {
        const parent = get().users.find((u) => u.type === 'parent');
        if (parent && parent.pin === pin) {
          set({ isParentUnlocked: true });
          return true;
        }
        return false;
      },

      lockParent: () => set({ isParentUnlocked: false }),

      // Balance
      addMoney: (childId, amount, description, category) => {
        const transaction: Transaction = {
          id: generateId(),
          type: 'income',
          category,
          amount,
          description,
          date: new Date().toISOString(),
        };
        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              return {
                ...u,
                balance: (u.balance || 0) + amount,
                transactions: [transaction, ...u.transactions],
              };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      deductMoney: (childId, amount, description, category, productId) => {
        const transaction: Transaction = {
          id: generateId(),
          type: 'expense',
          category,
          amount,
          description,
          date: new Date().toISOString(),
          productId,
        };
        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              return {
                ...u,
                balance: Math.max(0, (u.balance || 0) - amount),
                transactions: [transaction, ...u.transactions],
              };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      // Goals
      addGoal: (childId, goalData) => {
        const goal: Goal = {
          ...goalData,
          id: generateId(),
          completed: false,
        };
        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              return { ...u, goals: [...u.goals, goal] };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      updateGoalAmount: (childId, goalId, amount) => {
        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              const goals = u.goals.map((g) => {
                if (g.id === goalId) {
                  const newAmount = Math.min(g.targetAmount, g.currentAmount + amount);
                  return { ...g, currentAmount: newAmount, completed: newAmount >= g.targetAmount };
                }
                return g;
              });
              return { ...u, goals };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      completeGoal: (childId, goalId) => {
        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              const goals = u.goals.map((g) =>
                g.id === goalId ? { ...g, completed: true } : g
              );
              return { ...u, goals };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      deleteGoal: (childId, goalId) => {
        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              return { ...u, goals: u.goals.filter((g) => g.id !== goalId) };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      // Chores
      addChore: (childId, choreData) => {
        const chore: Chore = { ...choreData, id: generateId() };
        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              return { ...u, chores: [...u.chores, chore] };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      updateChoreStatus: (childId, choreId, status) => {
        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              const chores = u.chores.map((c) =>
                c.id === choreId
                  ? { ...c, status, completedDate: status === 'pending_approval' ? new Date().toISOString() : c.completedDate }
                  : c
              );
              return { ...u, chores };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      approveChore: (childId, choreId) => {
        const child = get().users.find((u) => u.id === childId);
        const chore = child?.chores.find((c) => c.id === choreId);
        if (!chore) return;

        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              const chores = u.chores.map((c) =>
                c.id === choreId ? { ...c, status: 'completed' as const, completedDate: new Date().toISOString() } : c
              );
              const transaction: Transaction = {
                id: generateId(),
                type: 'income',
                category: 'chore',
                amount: chore.reward,
                description: chore.name,
                date: new Date().toISOString(),
              };
              return {
                ...u,
                chores,
                balance: (u.balance || 0) + chore.reward,
                transactions: [transaction, ...u.transactions],
              };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      rejectChore: (childId, choreId) => {
        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              const chores = u.chores.map((c) =>
                c.id === choreId ? { ...c, status: 'available' as const } : c
              );
              return { ...u, chores };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      // Cart
      addToCart: (productId) => {
        set((state) => {
          const existing = state.cart.find((item) => item.productId === productId);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { productId, quantity: 1 }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({ cart: state.cart.filter((item) => item.productId !== productId) }));
      },

      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      setShowCart: (show) => set({ showCart: show }),

      // Wishlist
      toggleWishlist: (childId, productId) => {
        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              const wishlist = u.wishlist.includes(productId)
                ? u.wishlist.filter((id) => id !== productId)
                : [...u.wishlist, productId];
              return { ...u, wishlist };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      // Purchases
      requestPurchase: () => {
        const { cart, currentUser } = get();
        if (!currentUser || cart.length === 0) return;

        const totalAmount = cart.reduce((sum, item) => {
          const product = marketplaceItems.find((p) => p.id === item.productId);
          return sum + (product?.price || 0) * item.quantity;
        }, 0);

        const purchase: PendingPurchase = {
          id: generateId(),
          childId: currentUser.id,
          items: [...cart],
          totalAmount,
          requestedDate: new Date().toISOString(),
          status: 'pending',
        };

        set((state) => ({ pendingPurchases: [...state.pendingPurchases, purchase], cart: [] }));
      },

      approvePurchase: (purchaseId) => {
        const purchase = get().pendingPurchases.find((p) => p.id === purchaseId);
        if (!purchase) return;

        const child = get().users.find((u) => u.id === purchase.childId);
        if (!child || (child.balance || 0) < purchase.totalAmount) return;

        const descriptions = purchase.items
          .map((item) => {
            const product = marketplaceItems.find((p) => p.id === item.productId);
            return product ? `${product.name} x${item.quantity}` : '';
          })
          .join(', ');

        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === purchase.childId) {
              const transaction: Transaction = {
                id: generateId(),
                type: 'expense',
                category: 'purchase',
                amount: purchase.totalAmount,
                description: `Achat: ${descriptions}`,
                date: new Date().toISOString(),
              };
              return {
                ...u,
                balance: (u.balance || 0) - purchase.totalAmount,
                transactions: [transaction, ...u.transactions],
              };
            }
            return u;
          });
          const pendingPurchases = state.pendingPurchases.map((p) =>
            p.id === purchaseId ? { ...p, status: 'approved' as const } : p
          );
          const currentUser = state.currentUser?.id === purchase.childId
            ? users.find((u) => u.id === purchase.childId) || state.currentUser
            : state.currentUser;
          return { users, pendingPurchases, currentUser };
        });
      },

      rejectPurchase: (purchaseId) => {
        set((state) => ({
          pendingPurchases: state.pendingPurchases.map((p) =>
            p.id === purchaseId ? { ...p, status: 'rejected' as const } : p
          ),
        }));
      },

      // Allowance & Limits
      setAllowance: (childId, amount, frequency) => {
        const nextDate = new Date();
        if (frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
        else nextDate.setMonth(nextDate.getMonth() + 1);

        set((state) => {
          const users = state.users.map((u) => {
            if (u.id === childId) {
              return {
                ...u,
                allowance: { amount, frequency, nextDate: nextDate.toISOString() },
              };
            }
            return u;
          });
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      setSpendingLimit: (childId, limit) => {
        set((state) => {
          const users = state.users.map((u) =>
            u.id === childId ? { ...u, spendingLimit: limit } : u
          );
          const currentUser = state.currentUser?.id === childId
            ? users.find((u) => u.id === childId) || state.currentUser
            : state.currentUser;
          return { users, currentUser };
        });
      },

      // Toasts
      addToast: (message, type) => {
        const toast: Toast = { id: generateId(), message, type };
        set((state) => ({ toasts: [...state.toasts, toast] }));
        setTimeout(() => {
          get().removeToast(toast.id);
        }, 4000);
      },

      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },

      // View
      setViewMode: (mode) => set({ viewMode: mode }),

      // Add child
      addChild: (childData) => {
        const child: User = {
          ...childData,
          id: generateId(),
          type: 'child',
          achievements: [],
          goals: [],
          transactions: [],
          chores: [],
          wishlist: [],
        };
        set((state) => ({ users: [...state.users, child] }));
      },

      // Selectors
      getChildren: () => get().users.filter((u) => u.type === 'child'),
      getChildById: (id) => get().users.find((u) => u.id === id),
    }),
    {
      name: 'piggypal-storage',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        pendingPurchases: state.pendingPurchases,
        viewMode: state.viewMode,
      }),
    }
  )
);
