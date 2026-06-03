import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { Transaction } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecentTransactionsProps {
  transactions: Transaction[];
  limit?: number;
}

const categoryLabels: Record<Transaction['category'], { label: string; emoji: string }> = {
  allowance: { label: 'Argent de poche', emoji: '💰' },
  chore: { label: 'Tâche', emoji: '✅' },
  purchase: { label: 'Achat', emoji: '🛍️' },
  gift: { label: 'Cadeau', emoji: '🎁' },
  penalty: { label: 'Pénalité', emoji: '⚠️' },
  'goal-deposit': { label: 'Objectif', emoji: '🎯' },
};

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  limit = 5,
}) => {
  const recent = transactions.slice(0, limit);

  if (recent.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">💸</div>
        <p className="text-gray-400 font-inter text-sm">Aucune transaction pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recent.map((tx) => {
        const cat = categoryLabels[tx.category];
        return (
          <div
            key={tx.id}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
              tx.type === 'income' ? 'bg-success-50' : 'bg-danger-50'
            }`}>
              {cat.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-nunito font-700 text-gray-800 truncate">
                {tx.description}
              </p>
              <p className="text-xs text-gray-400 font-inter flex items-center gap-1">
                <span>{cat.label}</span>
                <span>·</span>
                <span>{format(new Date(tx.date), 'd MMM', { locale: fr })}</span>
              </p>
            </div>
            <div className={`flex items-center gap-0.5 font-nunito font-800 text-sm ${
              tx.type === 'income' ? 'text-success-600' : 'text-danger-500'
            }`}>
              {tx.type === 'income' ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownLeft size={14} />
              )}
              {tx.type === 'income' ? '+' : '-'}{tx.amount.toFixed(2)}€
            </div>
          </div>
        );
      })}
    </div>
  );
};
