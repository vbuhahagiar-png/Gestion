import React, { useEffect, useState } from 'react';
import { TrendingUp, PiggyBank } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  name: string;
  avatar: string;
  color?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  name,
  avatar,
  color = 'from-primary-500 to-secondary-500',
}) => {
  const [displayBalance, setDisplayBalance] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepAmount = balance / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepAmount;
      if (current >= balance) {
        setDisplayBalance(balance);
        clearInterval(timer);
      } else {
        setDisplayBalance(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [balance]);

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${color} p-6 text-white shadow-xl`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-8" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm font-inter font-500">Bonjour, {name}! 👋</p>
            <p className="text-white/70 text-xs font-inter mt-0.5">Voici ton solde</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl animate-float">
            {avatar}
          </div>
        </div>

        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-nunito font-900">
            {displayBalance.toFixed(2)}
          </span>
          <span className="text-2xl font-nunito font-700 mb-1">€</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
            <TrendingUp size={14} />
            <span className="text-xs font-nunito font-600">Solde actuel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PiggyBank size={16} className="text-white/80" />
            <span className="text-xs text-white/80 font-inter">Continue d'épargner !</span>
          </div>
        </div>
      </div>
    </div>
  );
};
