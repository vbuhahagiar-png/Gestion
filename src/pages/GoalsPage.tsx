import React, { useState } from 'react';
import { Plus, Trash2, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../store/useStore';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { ProgressBar } from '../components/UI/ProgressBar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const emojiOptions = ['🚀', '🎮', '🎨', '🧸', '📚', '🎵', '⚽', '🏊', '🌍', '🦄', '🎯', '🏆', '💎', '🌈', '🎸'];

export const GoalsPage: React.FC = () => {
  const { currentUser, addGoal, deleteGoal, updateGoalAmount, addToast } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showDeposit, setShowDeposit] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [newGoal, setNewGoal] = useState({
    name: '',
    emoji: '🎯',
    targetAmount: '',
    deadline: '',
  });
  const [celebratedGoals, setCelebratedGoals] = useState<string[]>([]);

  if (!currentUser || currentUser.type !== 'child') return null;

  const { goals, balance = 0 } = currentUser;
  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return;
    const target = parseFloat(newGoal.targetAmount);
    if (isNaN(target) || target <= 0) return;

    addGoal(currentUser.id, {
      name: newGoal.name,
      emoji: newGoal.emoji,
      targetAmount: target,
      currentAmount: 0,
      deadline: newGoal.deadline ? new Date(newGoal.deadline).toISOString() : undefined,
    });
    addToast(`🎯 Objectif "${newGoal.name}" créé !`, 'success');
    setShowAdd(false);
    setNewGoal({ name: '', emoji: '🎯', targetAmount: '', deadline: '' });
  };

  const handleDeposit = (goalId: string) => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      addToast('Montant invalide ou solde insuffisant', 'error');
      return;
    }

    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const newAmount = Math.min(goal.targetAmount, goal.currentAmount + amount);
    const isCompleted = newAmount >= goal.targetAmount;

    updateGoalAmount(currentUser.id, goalId, amount);

    if (isCompleted && !celebratedGoals.includes(goalId)) {
      setCelebratedGoals([...celebratedGoals, goalId]);
      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#ec4899', '#fbbf24', '#22c55e'],
      });
      addToast(`🎉 Bravo ! Tu as atteint ton objectif "${goal.name}" !`, 'success');
    } else {
      addToast(`💰 ${amount.toFixed(2)}€ ajoutés à l'objectif !`, 'success');
    }

    setShowDeposit(null);
    setDepositAmount('');
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
          <p className="text-xs text-white/70 font-inter">Objectifs actifs</p>
          <p className="text-2xl font-nunito font-900">{activeGoals.length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-success-400 to-teal-400 text-white">
          <p className="text-xs text-white/70 font-inter">Complétés</p>
          <p className="text-2xl font-nunito font-900">{completedGoals.length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-accent-400 to-orange-400 text-white">
          <p className="text-xs text-white/70 font-inter">Mon solde</p>
          <p className="text-xl font-nunito font-900">{balance.toFixed(2)}€</p>
        </Card>
      </div>

      {/* Add goal button */}
      <Button
        fullWidth
        size="lg"
        onClick={() => setShowAdd(true)}
        className="border-2 border-dashed border-primary-300 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-3xl"
        variant="ghost"
      >
        <Plus size={20} /> Créer un nouvel objectif
      </Button>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="font-nunito font-800 text-gray-800 text-lg mb-3 flex items-center gap-2">
            <Target size={20} className="text-primary-500" /> Objectifs en cours
          </h2>
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
              const remaining = goal.targetAmount - goal.currentAmount;
              const canDeposit = balance > 0;

              return (
                <Card key={goal.id} className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center text-3xl">
                        {goal.emoji}
                      </div>
                      <div>
                        <h3 className="font-nunito font-800 text-gray-800 text-lg">{goal.name}</h3>
                        {goal.deadline && (
                          <p className="text-xs text-gray-400 font-inter">
                            Échéance: {format(new Date(goal.deadline), 'd MMM yyyy', { locale: fr })}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        deleteGoal(currentUser.id, goal.id);
                        addToast('Objectif supprimé', 'info');
                      }}
                      className="p-2 text-gray-300 hover:text-danger-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-nunito font-700 text-primary-600">
                        {goal.currentAmount.toFixed(2)}€
                      </span>
                      <span className="text-sm font-nunito font-700 text-gray-400">
                        {goal.targetAmount.toFixed(2)}€
                      </span>
                    </div>
                    <ProgressBar value={pct} color="purple" size="lg" />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-primary-500 font-nunito font-700">{Math.round(pct)}%</span>
                      <span className="text-xs text-gray-400 font-inter">Encore {remaining.toFixed(2)}€</span>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    variant={canDeposit ? 'primary' : 'ghost'}
                    onClick={() => setShowDeposit(goal.id)}
                    disabled={!canDeposit}
                    className="mt-2"
                  >
                    💰 Ajouter de l'argent
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="font-nunito font-800 text-gray-800 text-lg mb-3">🏆 Objectifs atteints</h2>
          <div className="space-y-3">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-3 p-4 bg-success-50 rounded-2xl border border-success-100">
                <div className="w-12 h-12 bg-success-100 rounded-2xl flex items-center justify-center text-2xl">
                  {goal.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-nunito font-800 text-gray-800">{goal.name}</p>
                  <p className="text-xs text-success-600 font-nunito font-600 mt-0.5">
                    ✅ {goal.targetAmount.toFixed(2)}€ atteint !
                  </p>
                </div>
                <div className="text-2xl">🎉</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-float">🎯</div>
          <h3 className="font-nunito font-800 text-gray-700 text-xl mb-2">Pas encore d'objectifs</h3>
          <p className="text-gray-400 font-inter text-sm">
            Crée ton premier objectif pour commencer à épargner !
          </p>
        </div>
      )}

      {/* Add Goal Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="🎯 Nouvel objectif">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-2 block">Choisir un emoji</label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((e) => (
                <button
                  key={e}
                  onClick={() => setNewGoal({ ...newGoal, emoji: e })}
                  className={`w-10 h-10 rounded-xl text-xl transition-all ${newGoal.emoji === e ? 'bg-primary-100 ring-2 ring-primary-400' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Nom de l'objectif</label>
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              placeholder="Ex: Nouvelle trottinette"
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Montant cible (€)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              placeholder="50.00"
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Date limite (optionnel)</label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            />
          </div>
          <Button fullWidth onClick={handleAddGoal} disabled={!newGoal.name || !newGoal.targetAmount}>
            Créer l'objectif 🎯
          </Button>
        </div>
      </Modal>

      {/* Deposit Modal */}
      {showDeposit && (
        <Modal isOpen={true} onClose={() => { setShowDeposit(null); setDepositAmount(''); }} title="💰 Ajouter de l'argent" size="sm">
          {(() => {
            const goal = goals.find((g) => g.id === showDeposit);
            if (!goal) return null;
            const remaining = goal.targetAmount - goal.currentAmount;
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-2xl">
                  <span className="text-2xl">{goal.emoji}</span>
                  <div>
                    <p className="font-nunito font-700 text-gray-800">{goal.name}</p>
                    <p className="text-xs text-gray-500 font-inter">
                      Encore {remaining.toFixed(2)}€ pour atteindre l'objectif
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-gray-500">Ton solde:</span>
                  <span className="font-nunito font-700 text-primary-600">{balance.toFixed(2)}€</span>
                </div>
                <input
                  type="number"
                  min="0.01"
                  max={Math.min(balance, remaining)}
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Montant à épargner"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
                  autoFocus
                />
                <div className="flex gap-2">
                  {[1, 2, 5].map((quick) => (
                    <button
                      key={quick}
                      onClick={() => setDepositAmount(String(Math.min(quick, balance, remaining)))}
                      className="flex-1 py-2 bg-gray-100 rounded-xl text-sm font-nunito font-700 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                    >
                      {quick}€
                    </button>
                  ))}
                  <button
                    onClick={() => setDepositAmount(String(Math.min(remaining, balance)))}
                    className="flex-1 py-2 bg-gray-100 rounded-xl text-sm font-nunito font-700 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                  >
                    Max
                  </button>
                </div>
                <Button
                  fullWidth
                  onClick={() => handleDeposit(showDeposit)}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || parseFloat(depositAmount) > balance}
                >
                  Épargner {depositAmount ? `${parseFloat(depositAmount).toFixed(2)}€` : ''}
                </Button>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};
