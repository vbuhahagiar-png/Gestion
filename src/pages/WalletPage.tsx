import React, { useState } from 'react';
import { Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { SpendingChart } from '../components/Charts/SpendingChart';
import { SavingsChart } from '../components/Charts/SavingsChart';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Transaction } from '../types';

const categoryLabels: Record<Transaction['category'], { label: string; emoji: string }> = {
  allowance: { label: 'Argent de poche', emoji: '💰' },
  chore: { label: 'Tâche', emoji: '✅' },
  purchase: { label: 'Achat', emoji: '🛍️' },
  gift: { label: 'Cadeau', emoji: '🎁' },
  penalty: { label: 'Pénalité', emoji: '⚠️' },
  'goal-deposit': { label: 'Objectif', emoji: '🎯' },
};

type FilterType = 'all' | 'income' | 'expense';
type CategoryFilter = 'all' | Transaction['category'];

export const WalletPage: React.FC = () => {
  const { currentUser } = useStore();
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  if (!currentUser || currentUser.type !== 'child') return null;

  const transactions = currentUser.transactions;

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // Group transactions by day
  const grouped: Record<string, Transaction[]> = {};
  filtered.forEach((t) => {
    const day = format(new Date(t.date), 'yyyy-MM-dd');
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(t);
  });
  const sortedDays = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Balance + Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 col-span-1 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
          <p className="text-xs text-white/70 font-inter">Solde actuel</p>
          <p className="text-2xl font-nunito font-900 mt-1">{currentUser.balance?.toFixed(2)}€</p>
        </Card>
        <Card className="p-4 col-span-1 bg-gradient-to-br from-success-50 to-success-100">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp size={14} className="text-success-500" />
            <p className="text-xs text-success-600 font-inter font-500">Revenus</p>
          </div>
          <p className="text-xl font-nunito font-900 text-success-600">+{totalIncome.toFixed(2)}€</p>
        </Card>
        <Card className="p-4 col-span-1 bg-gradient-to-br from-danger-50 to-danger-100">
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown size={14} className="text-danger-500" />
            <p className="text-xs text-danger-600 font-inter font-500">Dépenses</p>
          </div>
          <p className="text-xl font-nunito font-900 text-danger-500">-{totalExpense.toFixed(2)}€</p>
        </Card>
      </div>

      {/* Charts */}
      <Card className="p-5">
        <h3 className="font-nunito font-800 text-gray-800 mb-4">📊 Revenus & Dépenses (7 jours)</h3>
        <SpendingChart transactions={transactions} days={7} />
      </Card>

      <Card className="p-5">
        <h3 className="font-nunito font-800 text-gray-800 mb-4">📈 Évolution du solde</h3>
        <SavingsChart
          transactions={transactions}
          currentBalance={currentUser.balance || 0}
          days={14}
        />
      </Card>

      {/* Transactions */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-nunito font-800 text-gray-800">📋 Toutes les transactions</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-nunito font-600 hover:bg-gray-200 transition-colors"
          >
            <Filter size={14} /> Filtres
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-2xl space-y-3">
            <div>
              <p className="text-xs font-nunito font-600 text-gray-600 mb-2">Type</p>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'income', 'expense'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-nunito font-700 transition-all ${
                      typeFilter === f ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {f === 'all' ? 'Tout' : f === 'income' ? '📈 Revenus' : '📉 Dépenses'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-nunito font-600 text-gray-600 mb-2">Catégorie</p>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'allowance', 'chore', 'purchase', 'gift', 'penalty'] as CategoryFilter[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-nunito font-700 transition-all ${
                      categoryFilter === cat ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'Toutes' : `${categoryLabels[cat].emoji} ${categoryLabels[cat].label}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transaction list */}
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-400 font-inter text-sm">Aucune transaction</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDays.map((day) => (
              <div key={day}>
                <p className="text-xs font-nunito font-700 text-gray-400 uppercase tracking-wide mb-2 px-1">
                  {format(new Date(day), 'EEEE d MMMM', { locale: fr })}
                </p>
                <div className="space-y-1">
                  {grouped[day].map((tx) => {
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
                        <div className="flex-1">
                          <p className="text-sm font-nunito font-700 text-gray-800">{tx.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant={tx.type === 'income' ? 'green' : 'red'} size="sm">
                              {cat.label}
                            </Badge>
                            <span className="text-xs text-gray-400 font-inter">
                              {format(new Date(tx.date), 'HH:mm')}
                            </span>
                          </div>
                        </div>
                        <span className={`font-nunito font-900 text-sm ${tx.type === 'income' ? 'text-success-600' : 'text-danger-500'}`}>
                          {tx.type === 'income' ? '+' : '-'}{tx.amount.toFixed(2)}€
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
