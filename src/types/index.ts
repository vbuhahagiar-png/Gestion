export interface User {
  id: string;
  type: 'parent' | 'child';
  name: string;
  avatar: string;
  balance?: number;
  age?: number;
  pin?: string;
  achievements: string[];
  goals: Goal[];
  transactions: Transaction[];
  chores: Chore[];
  wishlist: string[];
  allowance?: { amount: number; frequency: 'weekly' | 'monthly'; nextDate: string };
  spendingLimit?: number;
  color?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: 'allowance' | 'chore' | 'purchase' | 'gift' | 'penalty' | 'goal-deposit';
  amount: number;
  description: string;
  date: string;
  productId?: string;
}

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  completed: boolean;
}

export interface Chore {
  id: string;
  name: string;
  description: string;
  reward: number;
  emoji: string;
  status: 'available' | 'in_progress' | 'pending_approval' | 'completed';
  frequency: 'once' | 'daily' | 'weekly';
  assignedTo?: string;
  completedDate?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  ageMin: number;
  ageMax: number;
  inStock: boolean;
  featured?: boolean;
  color: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface PendingPurchase {
  id: string;
  childId: string;
  items: CartItem[];
  totalAmount: number;
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: string;
  color: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
