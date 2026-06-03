import React, { useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Store, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Modal } from '../../components/UI/Modal';
import { Button } from '../../components/UI/Button';
import { Avatar } from '../../components/UI/Avatar';
import type { StoreReward } from '../../types';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const PRESET_EMOJIS = ['🎮', '🎬', '🌴', '🛏️', '🍕', '🌙', '🎪', '🏖️', '🎯', '🧁', '📱', '🎵', '🎨', '🛒', '🎠'];

const PRESET_COLORS = [
  { label: 'Bleu', value: 'from-blue-400 to-indigo-500' },
  { label: 'Rose', value: 'from-purple-400 to-pink-500' },
  { label: 'Vert', value: 'from-green-400 to-teal-500' },
  { label: 'Jaune', value: 'from-yellow-400 to-orange-500' },
  { label: 'Rouge', value: 'from-rose-400 to-red-500' },
  { label: 'Violet', value: 'from-violet-400 to-purple-500' },
  { label: 'Cyan', value: 'from-cyan-400 to-blue-500' },
  { label: 'Lime', value: 'from-lime-400 to-green-500' },
];

interface RewardFormData {
  title: string;
  description: string;
  emoji: string;
  coinCost: number;
  color: string;
  available: boolean;
}

const defaultForm: RewardFormData = {
  title: '',
  description: '',
  emoji: '🎮',
  coinCost: 50,
  color: 'from-blue-400 to-indigo-500',
  available: true,
};

export const RewardsPage: React.FC = () => {
  const { allUsers, currentFamily } = useAuthStore();
  const { storeRewards, rewardClaims, addStoreReward, updateStoreReward, deleteStoreReward, approveRewardClaim, rejectRewardClaim } = useFamilyStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<RewardFormData>(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [approveConfirm, setApproveConfirm] = useState<string | null>(null);

  const children = allUsers.filter(u => u.role === 'child');
  const pendingClaims = rewardClaims.filter(c => c.status === 'pending');
  const familyRewards = storeRewards.filter(r => r.familyId === currentFamily?.id);

  const openAddForm = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (reward: StoreReward) => {
    setFormData({
      title: reward.title,
      description: reward.description,
      emoji: reward.emoji,
      coinCost: reward.coinCost,
      color: reward.color,
      available: reward.available,
    });
    setEditingId(reward.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingId) {
      updateStoreReward(editingId, formData);
    } else {
      const reward: StoreReward = {
        id: `reward-${Date.now()}`,
        familyId: currentFamily?.id || '',
        ...formData,
        createdAt: new Date().toISOString(),
      };
      addStoreReward(reward);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleApprove = (claimId: string, childId: string) => {
    setApproveConfirm(null);
    approveRewardClaim(claimId, childId);
  };

  const getChildForClaim = (childId: string) => allUsers.find(u => u.id === childId);
  const getRewardForClaim = (rewardId: string) => storeRewards.find(r => r.id === rewardId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-purple-600" /> Boutique des Récompenses
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Gérez les récompenses que vos enfants peuvent réclamer</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Pending claims */}
      {pendingClaims.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs">⏳</span>
            Demandes en attente ({pendingClaims.length})
          </h2>
          <div className="space-y-3">
            {pendingClaims.map(claim => {
              const child = getChildForClaim(claim.childId);
              const reward = getRewardForClaim(claim.rewardId);
              if (!child || !reward) return null;
              return (
                <div key={claim.id} className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar emoji={child.avatar} color={child.color} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm">{child.name} souhaite :</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-lg">{reward.emoji}</span>
                        <span className="font-semibold text-gray-800 text-sm">{reward.title}</span>
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold">
                          🪙 {reward.coinCost}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    Demandé le {format(parseISO(claim.requestedAt), 'dd MMMM à HH:mm', { locale: fr })}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setApproveConfirm(claim.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 text-white rounded-2xl py-2.5 text-sm font-bold hover:bg-emerald-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Accorder
                    </button>
                    <button
                      onClick={() => rejectRewardClaim(claim.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-100 text-red-600 rounded-2xl py-2.5 text-sm font-bold hover:bg-red-200 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Refuser
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rewards list */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Récompenses de la famille ({familyRewards.length})
        </h2>

        {familyRewards.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-8 text-center">
            <div className="text-5xl mb-3">🏪</div>
            <div className="font-bold text-gray-700">Aucune récompense</div>
            <div className="text-sm text-gray-400 mt-1 mb-4">Créez des récompenses pour motiver vos enfants !</div>
            <button
              onClick={openAddForm}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm"
            >
              + Ajouter une récompense
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {familyRewards.map(reward => (
              <div key={reward.id} className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex items-center gap-3">
                <div className={`w-14 h-14 bg-gradient-to-br ${reward.color} rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0`}>
                  {reward.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{reward.title}</span>
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold">
                      🪙 {reward.coinCost}
                    </span>
                    {!reward.available && (
                      <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">
                        Indisponible
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">{reward.description}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEditForm(reward)}
                    className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(reward.id)}
                    className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Children coin balances */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">🪙 Solde des enfants</h2>
        <div className="grid grid-cols-3 gap-3">
          {children.map(child => (
            <div key={child.id} className="bg-white rounded-3xl p-3 shadow-sm text-center">
              <div className="text-2xl mb-1">{child.avatar}</div>
              <div className="font-bold text-gray-900 text-sm">{child.name}</div>
              <div className="text-lg font-black text-amber-600">🪙 {child.coins || 0}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingId(null); }}
        title={editingId ? 'Modifier la récompense' : 'Nouvelle récompense'}
        size="md"
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Titre *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(v => ({ ...v, title: e.target.value }))}
              placeholder="Ex: 1h de jeux vidéo"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData(v => ({ ...v, description: e.target.value }))}
              placeholder="Ex: Une heure supplémentaire de jeux"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>

          {/* Emoji picker */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setFormData(v => ({ ...v, emoji }))}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    formData.emoji === emoji
                      ? 'bg-purple-100 ring-2 ring-purple-400 scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Coin cost */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Coût en pièces 🪙 ({formData.coinCost})
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={formData.coinCost}
              onChange={e => setFormData(v => ({ ...v, coinCost: Number(e.target.value) }))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10</span>
              <span className="font-bold text-purple-600">🪙 {formData.coinCost}</span>
              <span>500</span>
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Couleur</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setFormData(v => ({ ...v, color: value }))}
                  className={`h-10 bg-gradient-to-br ${value} rounded-xl transition-all ${
                    formData.color === value ? 'ring-2 ring-purple-400 scale-105' : ''
                  }`}
                  title={label}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Aperçu</label>
            <div className={`bg-gradient-to-br ${formData.color} rounded-2xl p-4 text-white text-center`}>
              <div className="text-3xl mb-1">{formData.emoji}</div>
              <div className="font-black text-sm">{formData.title || 'Titre de la récompense'}</div>
              <div className="text-xs opacity-80 mt-0.5">{formData.description || 'Description...'}</div>
              <div className="bg-white/25 rounded-xl px-3 py-1 inline-flex items-center gap-1 text-sm font-black mt-2">
                🪙 {formData.coinCost}
              </div>
            </div>
          </div>

          {/* Available toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">Disponible pour les enfants</label>
            <button
              onClick={() => setFormData(v => ({ ...v, available: !v.available }))}
              className={`w-12 h-6 rounded-full transition-all ${formData.available ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all mx-0.5 ${formData.available ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => { setShowForm(false); setEditingId(null); }}>
              Annuler
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={!formData.title.trim()}
            >
              {editingId ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Supprimer la récompense" size="sm">
        <div className="space-y-4">
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Êtes-vous sûr de vouloir supprimer cette récompense ?</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setDeleteConfirm(null)}>Annuler</Button>
            <Button variant="danger" fullWidth onClick={() => {
              deleteStoreReward(deleteConfirm!);
              setDeleteConfirm(null);
            }}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Approve confirmation */}
      <Modal isOpen={!!approveConfirm} onClose={() => setApproveConfirm(null)} title="Accorder la récompense 🎉" size="sm">
        {approveConfirm && (() => {
          const claim = rewardClaims.find(c => c.id === approveConfirm);
          const child = claim ? getChildForClaim(claim.childId) : null;
          const reward = claim ? getRewardForClaim(claim.rewardId) : null;
          return (
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                <div className="text-4xl mb-2">{reward?.emoji}</div>
                <p className="font-bold text-gray-900">
                  Vous accordez "{reward?.title}" à {child?.name} !
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="font-bold text-amber-800 mb-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Rappel important !
                </p>
                <p className="text-sm text-amber-700">
                  N'oubliez pas d'honorer cette récompense avec {child?.name} ! 🎉
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => setApproveConfirm(null)}>Pas encore</Button>
                <Button variant="success" fullWidth onClick={() => {
                  if (claim) handleApprove(claim.id, claim.childId);
                }}>
                  J'honorerai ! ✓
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};
