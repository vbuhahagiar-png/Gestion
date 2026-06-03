import React, { useState } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { globalChores } from '../data/mockUsers';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import type { Chore } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusConfig: Record<Chore['status'], { label: string; color: string; bg: string }> = {
  available: { label: 'Disponible', color: 'text-gray-500', bg: 'bg-gray-100' },
  in_progress: { label: 'En cours', color: 'text-blue-600', bg: 'bg-blue-50' },
  pending_approval: { label: 'En attente', color: 'text-accent-600', bg: 'bg-accent-50' },
  completed: { label: 'Terminé ✅', color: 'text-success-600', bg: 'bg-success-50' },
};

export const ChoresPage: React.FC = () => {
  const { currentUser, updateChoreStatus, addChore, addToast } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newChore, setNewChore] = useState({
    name: '',
    description: '',
    reward: '',
    emoji: '⭐',
    frequency: 'once' as Chore['frequency'],
  });
  const [activeTab, setActiveTab] = useState<'mine' | 'available' | 'history'>('mine');

  if (!currentUser || currentUser.type !== 'child') return null;

  const myChores = currentUser.chores;
  const completedChores = myChores.filter((c) => c.status === 'completed');
  const activeChores = myChores.filter((c) => c.status !== 'completed');

  const availableToAdd = globalChores.filter(
    (g) => !myChores.some((mc) => mc.name === g.name)
  );

  const totalEarnedFromChores = currentUser.transactions
    .filter((t) => t.category === 'chore')
    .reduce((s, t) => s + t.amount, 0);

  const handleStatusChange = (choreId: string, newStatus: Chore['status']) => {
    updateChoreStatus(currentUser.id, choreId, newStatus);
    if (newStatus === 'pending_approval') {
      addToast('🙋 Tâche soumise pour approbation !', 'info');
    } else if (newStatus === 'in_progress') {
      addToast('💪 Tâche démarrée !', 'success');
    }
  };

  const handleAddGlobalChore = (chore: typeof globalChores[0]) => {
    addChore(currentUser.id, {
      ...chore,
      status: 'available',
      assignedTo: currentUser.id,
    });
    addToast(`✅ "${chore.name}" ajoutée à tes tâches !`, 'success');
  };

  const handleAddCustomChore = () => {
    if (!newChore.name || !newChore.reward) return;
    addChore(currentUser.id, {
      name: newChore.name,
      description: newChore.description,
      reward: parseFloat(newChore.reward),
      emoji: newChore.emoji,
      frequency: newChore.frequency,
      status: 'available',
      assignedTo: currentUser.id,
    });
    addToast(`🌟 Tâche personnalisée créée !`, 'success');
    setShowAdd(false);
    setNewChore({ name: '', description: '', reward: '', emoji: '⭐', frequency: 'once' });
  };

  const emojis = ['⭐', '🧹', '🛏️', '🍽️', '🐕', '📖', '🌿', '🗑️', '🚿', '🧺', '🧴', '🪴'];

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-gradient-to-br from-accent-400 to-orange-400 text-white">
          <p className="text-xs text-white/70 font-inter">Tâches actives</p>
          <p className="text-2xl font-nunito font-900">{activeChores.length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-success-400 to-teal-400 text-white">
          <p className="text-xs text-white/70 font-inter">Complétées</p>
          <p className="text-2xl font-nunito font-900">{completedChores.length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-primary-400 to-secondary-400 text-white">
          <p className="text-xs text-white/70 font-inter">Total gagné</p>
          <p className="text-xl font-nunito font-900">{totalEarnedFromChores.toFixed(2)}€</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl">
        {[
          { id: 'mine', label: 'Mes tâches' },
          { id: 'available', label: 'Disponibles' },
          { id: 'history', label: 'Historique' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-nunito font-700 transition-all ${
              activeTab === tab.id ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* My Chores Tab */}
      {activeTab === 'mine' && (
        <div className="space-y-3">
          {activeChores.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-nunito font-700 text-gray-600">Toutes tes tâches sont terminées !</p>
              <p className="text-gray-400 font-inter text-sm mt-1">Bravo champion ! 🏆</p>
            </div>
          ) : (
            activeChores.map((chore) => {
              const status = statusConfig[chore.status];
              return (
                <Card key={chore.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${status.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {chore.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-nunito font-800 text-gray-800">{chore.name}</h3>
                        <span className={`text-xs font-nunito font-600 px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-inter mt-0.5">{chore.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="yellow">💰 {chore.reward.toFixed(2)}€</Badge>
                        <Badge variant="gray">{chore.frequency === 'daily' ? '📆 Quotidien' : chore.frequency === 'weekly' ? '🗓️ Hebdo' : '1️⃣ Unique'}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    {chore.status === 'available' && (
                      <Button
                        size="sm"
                        variant="primary"
                        fullWidth
                        onClick={() => handleStatusChange(chore.id, 'in_progress')}
                      >
                        <Clock size={14} /> Commencer
                      </Button>
                    )}
                    {chore.status === 'in_progress' && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          className="flex-1"
                          onClick={() => handleStatusChange(chore.id, 'pending_approval')}
                        >
                          <CheckCircle size={14} /> J'ai fini !
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1"
                          onClick={() => handleStatusChange(chore.id, 'available')}
                        >
                          Annuler
                        </Button>
                      </>
                    )}
                    {chore.status === 'pending_approval' && (
                      <div className="flex-1 flex items-center justify-center gap-2 p-2 bg-accent-50 rounded-xl">
                        <AlertCircle size={16} className="text-accent-500" />
                        <span className="text-xs font-nunito font-600 text-accent-600">
                          En attente de validation parentale...
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Available Chores Tab */}
      {activeTab === 'available' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-inter text-gray-500">Ajoute des tâches à ta liste</p>
            <Button size="sm" onClick={() => setShowAdd(true)}>
              <Plus size={14} /> Personnalisé
            </Button>
          </div>

          {availableToAdd.map((chore) => (
            <Card key={chore.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {chore.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-nunito font-800 text-gray-800">{chore.name}</h3>
                  <p className="text-xs text-gray-500 font-inter mt-0.5">{chore.description}</p>
                  <Badge variant="yellow" className="mt-1">💰 {chore.reward.toFixed(2)}€</Badge>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAddGlobalChore(chore)}
                >
                  <Plus size={14} /> Ajouter
                </Button>
              </div>
            </Card>
          ))}

          {availableToAdd.length === 0 && (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">✨</div>
              <p className="text-gray-400 font-inter text-sm">Tu as déjà toutes les tâches !</p>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {completedChores.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-gray-400 font-inter text-sm">Pas encore d'historique</p>
            </div>
          ) : (
            completedChores.map((chore) => (
              <div key={chore.id} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-card">
                <div className="w-10 h-10 bg-success-50 rounded-xl flex items-center justify-center text-xl">
                  {chore.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-nunito font-700 text-gray-700">{chore.name}</p>
                  {chore.completedDate && (
                    <p className="text-xs text-gray-400 font-inter">
                      Terminé le {format(new Date(chore.completedDate), 'd MMM yyyy', { locale: fr })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="green">+{chore.reward.toFixed(2)}€</Badge>
                  <CheckCircle size={18} className="text-success-500" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Custom Chore Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="✨ Créer une tâche">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-2 block">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setNewChore({ ...newChore, emoji: e })}
                  className={`w-10 h-10 rounded-xl text-xl transition-all ${newChore.emoji === e ? 'bg-primary-100 ring-2 ring-primary-400' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Nom de la tâche</label>
            <input
              type="text"
              value={newChore.name}
              onChange={(e) => setNewChore({ ...newChore, name: e.target.value })}
              placeholder="Ex: Laver la voiture"
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Description</label>
            <input
              type="text"
              value={newChore.description}
              onChange={(e) => setNewChore({ ...newChore, description: e.target.value })}
              placeholder="Description de la tâche..."
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-1 block">Récompense (€)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={newChore.reward}
              onChange={(e) => setNewChore({ ...newChore, reward: e.target.value })}
              placeholder="2.00"
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 font-inter text-sm outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="text-sm font-nunito font-600 text-gray-700 mb-2 block">Fréquence</label>
            <div className="flex gap-2">
              {(['once', 'daily', 'weekly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setNewChore({ ...newChore, frequency: f })}
                  className={`flex-1 py-2 rounded-xl text-xs font-nunito font-700 transition-all ${
                    newChore.frequency === f ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {f === 'once' ? 'Unique' : f === 'daily' ? 'Quotidien' : 'Hebdo'}
                </button>
              ))}
            </div>
          </div>
          <Button fullWidth onClick={handleAddCustomChore} disabled={!newChore.name || !newChore.reward}>
            Créer la tâche
          </Button>
        </div>
      </Modal>
    </div>
  );
};
