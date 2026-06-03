import React, { useState } from 'react';
import { Plus, CheckCircle, XCircle, DollarSign, Users, Clock, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { marketplaceItems } from '../data/marketplaceItems';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { Badge } from '../components/UI/Badge';
import { ProgressBar } from '../components/UI/ProgressBar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ParentDashboard: React.FC = () => {
  const {
    getChildren,
    pendingPurchases,
    approvePurchase,
    rejectPurchase,
    approveChore,
    rejectChore,
    addMoney,
    setAllowance,
    setSpendingLimit,
    addToast,
  } = useStore();

  const children = getChildren();
  const pendingOnly = pendingPurchases.filter((p) => p.status === 'pending');

  // All pending chore approvals across all children
  const pendingChores = children.flatMap((child) =>
    child.chores
      .filter((c) => c.status === 'pending_approval')
      .map((c) => ({ ...c, childName: child.name, childId: child.id, childAvatar: child.avatar }))
  );

  const [addMoneyModal, setAddMoneyModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [allowanceModal, setAllowanceModal] = useState(false);
  const [allowanceChild, setAllowanceChild] = useState<string | null>(null);
  const [allowanceAmount, setAllowanceAmount] = useState('');
  const [allowanceFreq, setAllowanceFreq] = useState<'weekly' | 'monthly'>('weekly');
  const [limitModal, setLimitModal] = useState(false);
  const [limitChild, setLimitChild] = useState<string | null>(null);
  const [limitAmount, setLimitAmount] = useState('');

  const handleAddMoney = () => {
    if (!selectedChild || !amount) return;
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    addMoney(selectedChild, num, description || 'Ajout de fonds', 'gift');
    addToast(`💰 ${num.toFixed(2)}€ ajoutés avec succès !`, 'success');
    setAddMoneyModal(false);
    setAmount('');
    setDescription('');
    setSelectedChild(null);
  };

  const handleSetAllowance = () => {
    if (!allowanceChild || !allowanceAmount) return;
    const num = parseFloat(allowanceAmount);
    if (isNaN(num) || num <= 0) return;
    setAllowance(allowanceChild, num, allowanceFreq);
    addToast('✅ Argent de poche configuré !', 'success');
    setAllowanceModal(false);
    setAllowanceAmount('');
    setAllowanceChild(null);
  };

  const handleSetLimit = () => {
    if (!limitChild || !limitAmount) return;
    const num = parseFloat(limitAmount);
    if (isNaN(num) || num <= 0) return;
    setSpendingLimit(limitChild, num);
    addToast('✅ Limite de dépense mise à jour !', 'success');
    setLimitModal(false);
    setLimitAmount('');
    setLimitChild(null);
  };

  const totalBalance = children.reduce((sum, c) => sum + (c.balance || 0), 0);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 rounded-3xl bg-gradient-to-r from-gray-700 to-gray-900 text-white">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-nunito font-900">Espace Parent</h1>
          <p className="text-white/70 font-inter text-sm">
            {children.length} enfant(s) · Total: {totalBalance.toFixed(2)}€
          </p>
        </div>
      </div>

      {/* Children Overview */}
      <div>
        <h2 className="font-nunito font-800 text-gray-800 text-lg mb-3 flex items-center gap-2">
          <Users size={20} className="text-primary-500" /> Mes Enfants
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {children.map((child) => {
            const totalGoal = child.goals.reduce((s, g) => s + g.targetAmount, 0);
            const savedForGoals = child.goals.reduce((s, g) => s + g.currentAmount, 0);
            const goalPct = totalGoal > 0 ? (savedForGoals / totalGoal) * 100 : 0;

            return (
              <Card key={child.id} className="p-4" gradient={child.color}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center text-2xl">
                    {child.avatar}
                  </div>
                  <div>
                    <p className="font-nunito font-800 text-white">{child.name}</p>
                    <p className="text-white/70 font-inter text-xs">{child.age} ans</p>
                  </div>
                </div>
                <p className="text-3xl font-nunito font-900 text-white mb-1">
                  {child.balance?.toFixed(2)}€
                </p>
                <ProgressBar value={goalPct} color="purple" size="sm" className="mb-2" />
                <p className="text-xs text-white/70 font-inter mb-3">
                  Objectifs: {savedForGoals.toFixed(2)}€ / {totalGoal.toFixed(2)}€
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 bg-white/20 text-white hover:bg-white/30 border-0"
                    onClick={() => { setSelectedChild(child.id); setAddMoneyModal(true); }}
                  >
                    <Plus size={14} /> Argent
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 bg-white/20 text-white hover:bg-white/30 border-0"
                    onClick={() => { setAllowanceChild(child.id); setAllowanceModal(true); }}
                  >
                    💰 Poche
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Pending Chore Approvals */}
      {pendingChores.length > 0 && (
        <Card className="p-5">
          <h2 className="font-nunito font-800 text-gray-800 text-lg mb-4 flex items-center gap-2">
            <Clock size={20} className="text-accent-500" />
            Tâches en attente ({pendingChores.length})
          </h2>
          <div className="space-y-3">
            {pendingChores.map((chore) => (
              <div key={`${chore.childId}-${chore.id}`} className="flex items-center gap-3 p-3 bg-accent-50 rounded-2xl border border-accent-100">
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center text-xl">
                  {chore.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-nunito font-700 text-gray-800 text-sm">{chore.name}</p>
                  <p className="text-xs text-gray-500 font-inter">
                    {chore.childAvatar} {chore.childName} · Récompense: {chore.reward.toFixed(2)}€
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      approveChore(chore.childId, chore.id);
                      addToast(`✅ Tâche de ${chore.childName} approuvée !`, 'success');
                    }}
                    className="w-9 h-9 bg-success-100 text-success-600 rounded-xl flex items-center justify-center hover:bg-success-200 transition-colors"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => {
                      rejectChore(chore.childId, chore.id);
                      addToast(`Tâche refusée.`, 'info');
                    }}
                    className="w-9 h-9 bg-danger-100 text-danger-600 rounded-xl flex items-center justify-center hover:bg-danger-200 transition-colors"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pending Purchases */}
      {pendingOnly.length > 0 && (
        <Card className="p-5">
          <h2 className="font-nunito font-800 text-gray-800 text-lg mb-4 flex items-center gap-2">
            🛍️ Achats en attente ({pendingOnly.length})
          </h2>
          <div className="space-y-3">
            {pendingOnly.map((purchase) => {
              const child = children.find((c) => c.id === purchase.childId);
              const itemsList = purchase.items
                .map((item) => {
                  const product = marketplaceItems.find((p) => p.id === item.productId);
                  return product ? `${product.emoji} ${product.name} x${item.quantity}` : '';
                })
                .filter(Boolean)
                .join(', ');

              return (
                <div key={purchase.id} className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{child?.avatar}</span>
                      <div>
                        <p className="font-nunito font-700 text-gray-800 text-sm">{child?.name}</p>
                        <p className="text-xs text-gray-400 font-inter">
                          {format(new Date(purchase.requestedDate), 'd MMM à HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <span className="font-nunito font-900 text-xl text-gray-800">{purchase.totalAmount.toFixed(2)}€</span>
                  </div>
                  <p className="text-xs text-gray-500 font-inter mb-3">{itemsList}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 font-inter">
                      Solde enfant: {child?.balance?.toFixed(2)}€
                      {child && (child.balance || 0) >= purchase.totalAmount
                        ? ' ✅'
                        : ' ⚠️ Insuffisant'}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => {
                          approvePurchase(purchase.id);
                          addToast(`✅ Achat approuvé pour ${child?.name} !`, 'success');
                        }}
                      >
                        <CheckCircle size={14} /> Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          rejectPurchase(purchase.id);
                          addToast(`Achat refusé.`, 'info');
                        }}
                      >
                        <XCircle size={14} /> Refuser
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Spending Limits */}
      <Card className="p-5">
        <h2 className="font-nunito font-800 text-gray-800 text-lg mb-4 flex items-center gap-2">
          💳 Limites de dépense
        </h2>
        <div className="space-y-3">
          {children.map((child) => (
            <div key={child.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xl">{child.avatar}</span>
                <span className="font-nunito font-600 text-gray-700 text-sm">{child.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="purple">
                  <DollarSign size={12} />
                  {child.spendingLimit ? `${child.spendingLimit}€` : 'Illimité'}
                </Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => { setLimitChild(child.id); setLimitAmount(String(child.spendingLimit || '')); setLimitModal(true); }}
                >
                  Modifier
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Purchases history */}
      {pendingPurchases.filter((p) => p.status !== 'pending').length > 0 && (
        <Card className="p-5">
          <h2 className="font-nunito font-800 text-gray-800 text-lg mb-4">📋 Historique des achats</h2>
          <div className="space-y-2">
            {pendingPurchases
              .filter((p) => p.status !== 'pending')
              .slice(0, 5)
              .map((purchase) => {
                const child = children.find((c) => c.id === purchase.childId);
                return (
                  <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span>{child?.avatar}</span>
                      <span className="text-sm font-nunito font-600 text-gray-700">{child?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-nunito font-700 text-sm">{purchase.totalAmount.toFixed(2)}€</span>
                      <Badge variant={purchase.status === 'approved' ? 'green' : 'red'}>
                        {purchase.status === 'approved' ? '✅ Approuvé' : '❌ Refusé'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* Add Money Modal */}
      <Modal isOpen={addMoneyModal} onClose={() => setAddMoneyModal(false)} title="💰 Ajouter de l'argent">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Enfant</label>
            <select
              value={selectedChild || ''}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            >
              <option value="">Choisir un enfant</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.avatar} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Montant (€)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Raison (optionnel)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cadeau, argent de poche..."
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            />
          </div>
          <Button fullWidth onClick={handleAddMoney} disabled={!selectedChild || !amount}>
            Ajouter l'argent
          </Button>
        </div>
      </Modal>

      {/* Allowance Modal */}
      <Modal isOpen={allowanceModal} onClose={() => setAllowanceModal(false)} title="📅 Configurer l'argent de poche">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Enfant</label>
            <select
              value={allowanceChild || ''}
              onChange={(e) => setAllowanceChild(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            >
              <option value="">Choisir un enfant</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.avatar} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Montant (€)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={allowanceAmount}
              onChange={(e) => setAllowanceAmount(e.target.value)}
              placeholder="5.00"
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Fréquence</label>
            <div className="flex gap-3">
              {(['weekly', 'monthly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setAllowanceFreq(f)}
                  className={`flex-1 py-2.5 rounded-2xl font-nunito font-700 text-sm transition-all ${
                    allowanceFreq === f
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'weekly' ? '🗓️ Hebdo' : '📆 Mensuel'}
                </button>
              ))}
            </div>
          </div>
          <Button fullWidth onClick={handleSetAllowance} disabled={!allowanceChild || !allowanceAmount}>
            Configurer
          </Button>
        </div>
      </Modal>

      {/* Spending Limit Modal */}
      <Modal isOpen={limitModal} onClose={() => setLimitModal(false)} title="💳 Limite de dépense" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-500 font-inter">
            L'enfant devra demander une approbation pour tout achat dépassant cette limite.
          </p>
          <input
            type="number"
            min="1"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            placeholder="20"
            className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
          />
          <Button fullWidth onClick={handleSetLimit} disabled={!limitChild || !limitAmount}>
            Enregistrer la limite
          </Button>
        </div>
      </Modal>
    </div>
  );
};
