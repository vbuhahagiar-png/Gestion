import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { Transaction } from '../../types';
import { format, subDays, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SpendingChartProps {
  transactions: Transaction[];
  days?: number;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ transactions, days = 7 }) => {
  const data = Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const dayStart = startOfDay(date);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayTx = transactions.filter((t) => {
      const txDate = new Date(t.date);
      return txDate >= dayStart && txDate < dayEnd;
    });

    const income = dayTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = dayTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    return {
      name: format(date, 'EEE', { locale: fr }),
      Gagné: Math.round(income * 100) / 100,
      Dépensé: Math.round(expense * 100) / 100,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Nunito', fill: '#9ca3af' }} />
        <YAxis tick={{ fontSize: 11, fontFamily: 'Nunito', fill: '#9ca3af' }} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontFamily: 'Nunito' }}
          formatter={(value: number) => [`${value.toFixed(2)}€`]}
        />
        <Legend wrapperStyle={{ fontFamily: 'Nunito', fontSize: 12 }} />
        <Bar dataKey="Gagné" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Dépensé" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
