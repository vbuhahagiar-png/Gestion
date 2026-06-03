import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Wallet } from '../../types';

interface WalletCardProps {
  wallet: Wallet;
  childName?: string;
  animated?: boolean;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, childName, animated = false }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-3xl p-5 text-white shadow-xl shadow-emerald-200">
      {childName && <p className="text-emerald-100 text-sm font-medium mb-1">Cagnotte de {childName}</p>}
      <div className={`text-4xl font-black mb-1 ${animated ? 'animate-float' : ''}`}>
        CHF {wallet.balance.toFixed(2)}
      </div>
      <p className="text-emerald-100 text-sm">Solde disponible</p>
      <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-200" />
          <div>
            <div className="text-xs text-emerald-200">Total gagné</div>
            <div className="text-sm font-bold">CHF {wallet.totalEarned.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingDown className="w-4 h-4 text-emerald-200" />
          <div>
            <div className="text-xs text-emerald-200">Total retiré</div>
            <div className="text-sm font-bold">CHF {wallet.totalWithdrawn.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
