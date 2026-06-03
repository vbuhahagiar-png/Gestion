import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import type { Transaction } from '../../types';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SavingsChartProps {
  transactions: Transaction[];
  currentBalance: number;
  days?: number;
}

export const SavingsChart: React.FC<SavingsChartProps> = ({
  transactions,
  currentBalance,
  days = 14,
}) => {
  // Calculate running balance going backwards from current
  const sortedTx = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let balance = currentBalance;
  const balanceByDay: Record<string, number> = {};

  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = subDays(today, i);
    const key = format(date, 'yyyy-MM-dd');
    balanceByDay[key] = balance;

    // Subtract transactions on this day going back
    const dayTx = sortedTx.filter(
      (t) => format(new Date(t.date), 'yyyy-MM-dd') === key
    );
    for (const tx of dayTx) {
      if (tx.type === 'income') balance -= tx.amount;
      else balance += tx.amount;
    }
  }

  const data = Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i);
    const key = format(date, 'yyyy-MM-dd');
    return {
      name: format(date, 'd MMM', { locale: fr }),
      Solde: Math.max(0, Math.round((balanceByDay[key] || 0) * 100) / 100),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Nunito', fill: '#9ca3af' }} />
        <YAxis tick={{ fontSize: 11, fontFamily: 'Nunito', fill: '#9ca3af' }} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontFamily: 'Nunito' }}
          formatter={(value: number) => [`${value.toFixed(2)}€`, 'Solde']}
        />
        <Area
          type="monotone"
          dataKey="Solde"
          stroke="#a855f7"
          strokeWidth={2.5}
          fill="url(#colorBalance)"
          dot={false}
          activeDot={{ r: 5, fill: '#a855f7' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
