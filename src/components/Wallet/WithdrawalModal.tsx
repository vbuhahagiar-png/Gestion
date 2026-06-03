import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import type { Wallet, WithdrawalRequest } from '../../types';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Wallet;
  childId: string;
  onSubmit: (request: WithdrawalRequest) => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose, wallet, childId, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) { setError('Montant invalide'); return; }
    if (val > wallet.balance) { setError(`Tu n'as que CHF ${wallet.balance.toFixed(2)}`); return; }

    onSubmit({
      id: `wr-${Date.now()}`,
      childId,
      amount: val,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      note: note.trim() || undefined,
    });

    setAmount('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Demander un retrait 💸">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-emerald-50 rounded-2xl p-3 text-center">
          <div className="text-sm text-emerald-700 font-medium">Solde disponible</div>
          <div className="text-2xl font-black text-emerald-600">CHF {wallet.balance.toFixed(2)}</div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Montant (CHF)</label>
          <input
            type="number"
            value={amount}
            onChange={e => { setAmount(e.target.value); setError(''); }}
            placeholder="0.00"
            min="0.50"
            max={wallet.balance}
            step="0.50"
            required
            className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-lg font-bold"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Pour quoi ? (optionnel)</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Ex: pour acheter des bonbons 🍬"
            className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
          />
        </div>

        <div className="bg-blue-50 rounded-2xl p-3 text-xs text-blue-700">
          <strong>Comment ça marche ?</strong><br />
          Tu demandes → Maman/Papa valide → Tu reçois l'argent en Twint ou en espèces ! 💝
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>Annuler</Button>
          <Button type="submit" variant="success" fullWidth>Demander</Button>
        </div>
      </form>
    </Modal>
  );
};
