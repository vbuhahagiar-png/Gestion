import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFamilyStore } from '../../store/useFamilyStore';
import { ChildNav } from '../../components/Layout/ChildNav';
import { TransactionList } from '../../components/Wallet/TransactionList';
import { WithdrawalModal } from '../../components/Wallet/WithdrawalModal';
import { Button } from '../../components/UI/Button';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export const MyWalletPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { wallets, transactions, withdrawals, requestWithdrawal } = useFamilyStore();
  const [showModal, setShowModal] = useState(false);

  const wallet = wallets.find(w => w.childId === childId);
  const myTransactions = transactions.filter(t => t.childId === childId);
  const myWithdrawals = withdrawals.filter(w => w.childId === childId).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));

  const pendingWd = myWithdrawals.find(w => w.status === 'pending');

  if (!wallet) return null;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-green-600 pt-10 pb-8 px-4 text-white">
        <div className="text-xl font-black mb-4">Ma Cagnotte 💰</div>
        <div className="text-5xl font-black mb-1 animate-float">CHF {wallet.balance.toFixed(2)}</div>
        <div className="text-emerald-100 text-sm">Solde disponible</div>
        <div className="flex gap-4 mt-4">
          <div>
            <div className="text-emerald-200 text-xs">Gagné total</div>
            <div className="font-bold">CHF {wallet.totalEarned.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-emerald-200 text-xs">Retiré total</div>
            <div className="font-bold">CHF {wallet.totalWithdrawn.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Withdrawal request button */}
        {pendingWd ? (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-4 flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <div className="font-bold text-amber-700">Demande en attente</div>
              <div className="text-sm text-amber-600">CHF {pendingWd.amount.toFixed(2)} — En attente de validation</div>
            </div>
          </div>
        ) : (
          <Button
            variant="success"
            fullWidth
            size="lg"
            onClick={() => setShowModal(true)}
            disabled={wallet.balance < 0.50}
          >
            💸 Demander un retrait
          </Button>
        )}

        {/* How it works */}
        <div className="bg-blue-50 rounded-3xl p-4">
          <div className="font-bold text-blue-700 mb-2 text-sm">Comment recevoir mon argent ? 💡</div>
          <div className="space-y-2">
            {[
              { step: '1', text: 'Tu cliques "Demander un retrait"', icon: '💸' },
              { step: '2', text: 'Maman / Papa valide ta demande', icon: '👩' },
              { step: '3', text: 'Tu reçois l\'argent en Twint ou en cash !', icon: '💵' },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-2 text-sm text-blue-700">
                <span className="text-lg">{s.icon}</span>
                <span className="font-medium">{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent withdrawals */}
        {myWithdrawals.length > 0 && (
          <div>
            <div className="font-bold text-gray-900 mb-2">Mes demandes de retrait</div>
            <div className="space-y-2">
              {myWithdrawals.slice(0, 5).map(wd => (
                <div key={wd.id} className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
                  {wd.status === 'pending' && <Clock className="w-5 h-5 text-amber-500 shrink-0" />}
                  {wd.status === 'approved' && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
                  {wd.status === 'declined' && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">CHF {wd.amount.toFixed(2)}</div>
                    {wd.note && <div className="text-xs text-gray-500 truncate">{wd.note}</div>}
                  </div>
                  <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    wd.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    wd.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {wd.status === 'pending' ? 'En attente' : wd.status === 'approved' ? 'Validé ✓' : 'Refusé'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction history */}
        <div>
          <div className="font-bold text-gray-900 mb-2">Historique</div>
          <TransactionList transactions={myTransactions} />
        </div>
      </div>

      {wallet && (
        <WithdrawalModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          wallet={wallet}
          childId={childId || ''}
          onSubmit={requestWithdrawal}
        />
      )}

      <ChildNav />
    </div>
  );
};
