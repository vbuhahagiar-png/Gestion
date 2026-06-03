import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { Transaction } from '../../types';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, limit }) => {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <span className="text-4xl block mb-2">💸</span>
        Aucune transaction
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map(txn => (
        <div key={txn.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${txn.type === 'earn' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
            {txn.type === 'earn'
              ? <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
              : <ArrowDownCircle className="w-5 h-5 text-orange-600" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{txn.description}</div>
            <div className="text-xs text-gray-400">
              {format(parseISO(txn.date), 'd MMM yyyy', { locale: fr })}
            </div>
          </div>
          <div className={`font-bold text-sm shrink-0 ${txn.type === 'earn' ? 'text-emerald-600' : 'text-orange-600'}`}>
            {txn.type === 'earn' ? '+' : '-'}CHF {txn.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};
