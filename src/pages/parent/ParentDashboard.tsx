import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CalendarPlus, CheckSquare, PiggyBank, Flame, Users, Activity } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../../components/UI/Avatar';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { Modal } from '../../components/UI/Modal';
import { TaskForm } from '../../components/Tasks/TaskForm';
import { PremiumBanner } from '../../components/Premium/PremiumBanner';
import { useLevel } from '../../hooks/useLevel';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const ChildCard: React.FC<{ userId: string }> = ({ userId }) => {
  const { allUsers } = useAuthStore();
  const { wallets } = useFamilyStore();
  const user = allUsers.find(u => u.id === userId);
  const wallet = wallets.find(w => w.childId === userId);
  const { currentLevel, progress } = useLevel(user?.xp || 0);

  if (!user) return null;

  return (
    <div className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="flex items-center gap-3 mb-3">
        <Avatar emoji={user.avatar} color={user.color} size="md" />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-500">{currentLevel.emoji} {currentLevel.name}</div>
        </div>
        {user.streak > 0 && (
          <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
            <Flame className="w-3 h-3" />
            {user.streak}
          </div>
        )}
      </div>
      <ProgressBar value={progress} animated={false} />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">Niv. {currentLevel.level}</span>
        <span className="text-sm font-bold text-emerald-600">CHF {wallet?.balance.toFixed(2) || '0.00'}</span>
      </div>
    </div>
  );
};

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, currentFamily, allUsers } = useAuthStore();
  const { tasks, withdrawals, addTask, approveTask, rejectTask, sendMessage } = useFamilyStore();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', emoji: '📅' });
  const [confirmWithdrawal, setConfirmWithdrawal] = useState<string | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>('');

  const PRESET_MESSAGES = [
    { emoji: '🏆', text: 'Bravo champion(ne) ! Je suis super fier(e) de toi !' },
    { emoji: '⭐', text: 'Tu fais un travail exceptionnel, continue comme ça !' },
    { emoji: '💪', text: 'Courage ! Tu y es presque, ne lâche pas !' },
    { emoji: '🌟', text: 'Tu es une étoile ! Toute la famille est fière de toi.' },
    { emoji: '🎉', text: 'Excellent travail cette semaine ! Tu mérites ta récompense.' },
    { emoji: '💝', text: 'Je t\'aime fort et je suis fier(e) de toi chaque jour.' },
    { emoji: '🚀', text: 'Tu progresses à toute vitesse ! Fantastique !' },
    { emoji: '😊', text: 'Merci pour ton aide à la maison, ça compte beaucoup !' },
  ];

  const { addEvent } = useFamilyStore();

  const children = allUsers.filter(u => u.role === 'child');
  const pendingTasks = tasks.filter(t => t.status === 'pending_approval');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

  // Weekly stats
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const weekDone = tasks.filter(t => t.status === 'done' && t.approvedAt && t.approvedAt > oneWeekAgo);

  const recentActivity = [
    ...pendingTasks.map(t => ({ id: t.id, icon: '✅', text: `${allUsers.find(u => u.id === t.completedBy)?.name || '?'} a terminé "${t.title}"`, time: t.completedAt || '', type: 'pending' as const })),
    ...pendingWithdrawals.map(w => ({ id: w.id, icon: '💸', text: `${allUsers.find(u => u.id === w.childId)?.name || '?'} demande CHF ${w.amount.toFixed(2)}`, time: w.requestedAt, type: 'withdrawal' as const })),
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);

  const getChildName = (id: string) => allUsers.find(u => u.id === id)?.name || id;

  return (
    <div className="space-y-5">
      {/* Header greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Bonjour {currentUser?.name?.split(' ')[0]} {currentUser?.avatar} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>
      </div>

      {/* Premium banner */}
      {currentFamily && <PremiumBanner plan={currentFamily.plan} />}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card
          gradient="from-amber-400 to-orange-500"
          className="p-3 text-white cursor-pointer"
          onClick={() => navigate('/parent/tasks')}
        >
          <CheckSquare className="w-5 h-5 mb-1 opacity-80" />
          <div className="text-2xl font-black">{pendingTasks.length}</div>
          <div className="text-xs opacity-80">À valider</div>
        </Card>
        <Card
          gradient="from-blue-400 to-cyan-500"
          className="p-3 text-white cursor-pointer"
          onClick={() => navigate('/parent/children')}
        >
          <PiggyBank className="w-5 h-5 mb-1 opacity-80" />
          <div className="text-2xl font-black">{pendingWithdrawals.length}</div>
          <div className="text-xs opacity-80">Retraits</div>
        </Card>
        <Card
          gradient="from-emerald-400 to-green-500"
          className="p-3 text-white"
        >
          <Activity className="w-5 h-5 mb-1 opacity-80" />
          <div className="text-2xl font-black">{weekDone.length}</div>
          <div className="text-xs opacity-80">Cette semaine</div>
        </Card>
      </div>

      {/* Pending tasks */}
      {pendingTasks.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs">⏳</span>
            Tâches à valider ({pendingTasks.length})
          </h2>
          <div className="space-y-2">
            {pendingTasks.slice(0, 3).map(task => (
              <div key={task.id} className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex items-center gap-3">
                <div className="text-2xl">{task.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{task.title}</div>
                  <div className="text-xs text-gray-500">par {task.completedBy ? getChildName(task.completedBy) : '?'}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveTask(task.id)} className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center text-lg hover:bg-emerald-600 transition-colors">✓</button>
                  <button onClick={() => rejectTask(task.id)} className="w-9 h-9 bg-red-100 text-red-500 rounded-xl flex items-center justify-center text-lg hover:bg-red-200 transition-colors">✗</button>
                </div>
              </div>
            ))}
            {pendingTasks.length > 3 && (
              <button onClick={() => navigate('/parent/tasks')} className="w-full py-2 text-sm text-purple-600 font-semibold">
                Voir toutes ({pendingTasks.length - 3} de plus)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pending withdrawals */}
      {pendingWithdrawals.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">💸</span>
            Demandes de retrait ({pendingWithdrawals.length})
          </h2>
          <div className="space-y-2">
            {pendingWithdrawals.map(wr => {
              const child = allUsers.find(u => u.id === wr.childId);
              return (
                <div key={wr.id} className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex items-center gap-3">
                  <Avatar emoji={child?.avatar || '👦'} color={child?.color || 'from-blue-400 to-cyan-500'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{child?.name} • CHF {wr.amount.toFixed(2)}</div>
                    {wr.note && <div className="text-xs text-gray-500 truncate">{wr.note}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmWithdrawal(wr.id)} className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors">✓</button>
                    <button onClick={() => useFamilyStore.getState().rejectWithdrawal(wr.id)} className="w-9 h-9 bg-red-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-200 transition-colors">✗</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 bg-blue-50 rounded-2xl px-3 py-2 text-xs text-blue-700 font-medium">
            💡 Pensez à remettre l'argent en Twint ou en espèces après validation !
          </div>
        </div>
      )}

      {/* Children overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" /> Mes enfants
          </h2>
          <button onClick={() => navigate('/parent/children')} className="text-xs text-purple-600 font-semibold">Détails →</button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {children.map(child => (
            <ChildCard key={child.id} userId={child.id} />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">Activité récente</h2>
          <div className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] space-y-3">
            {recentActivity.map(a => (
              <div key={a.id} className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{a.icon}</span>
                <span className="text-sm text-gray-700 flex-1">{a.text}</span>
                <span className="text-xs text-gray-400">
                  {a.time ? format(parseISO(a.time), 'HH:mm', { locale: fr }) : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">Actions rapides</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="primary" onClick={() => setShowTaskForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nouvelle tâche
          </Button>
          <Button variant="secondary" onClick={() => setShowEventForm(true)} className="flex items-center gap-2">
            <CalendarPlus className="w-4 h-4" /> Événement
          </Button>
          <button
            onClick={() => setShowMessages(true)}
            className="col-span-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-2xl hover:opacity-90 transition-opacity"
          >
            💬 Envoyer un message d'encouragement
          </button>
        </div>
      </div>

      {/* Withdrawal confirmation modal */}
      <Modal isOpen={!!confirmWithdrawal} onClose={() => setConfirmWithdrawal(null)} title="Confirmer le retrait 💸" size="sm">
        {confirmWithdrawal && (() => {
          const wr = withdrawals.find(w => w.id === confirmWithdrawal);
          const child = allUsers.find(u => u.id === wr?.childId);
          return (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">{child?.avatar}</div>
                <p className="font-bold text-gray-900">{child?.name} demande <span className="text-emerald-600">CHF {wr?.amount.toFixed(2)}</span></p>
                {wr?.note && <p className="text-sm text-gray-500 mt-1">"{wr.note}"</p>}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="font-bold text-amber-800 mb-2">📱 Avant de valider :</p>
                <p className="text-sm text-amber-700">Remettez <strong>CHF {wr?.amount.toFixed(2)}</strong> à {child?.name} via :</p>
                <div className="mt-2 space-y-1">
                  <div className="text-sm text-amber-700">• <strong>Twint</strong> — rapide et gratuit</div>
                  <div className="text-sm text-amber-700">• <strong>Virement bancaire</strong></div>
                  <div className="text-sm text-amber-700">• <strong>Espèces</strong> — en main propre</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => setConfirmWithdrawal(null)}>Pas encore</Button>
                <Button variant="success" fullWidth onClick={() => {
                  useFamilyStore.getState().approveWithdrawal(confirmWithdrawal);
                  setConfirmWithdrawal(null);
                }}>
                  J'ai payé ✓
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Messages modal */}
      <Modal isOpen={showMessages} onClose={() => setShowMessages(false)} title="💬 Message d'encouragement" size="md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Pour quel enfant ?</label>
            <div className="flex gap-2 flex-wrap">
              {children.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChild(c.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-semibold transition-all ${selectedChild === c.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {c.avatar} {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Choisir un message</label>
            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto">
              {PRESET_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  disabled={!selectedChild}
                  onClick={() => {
                    if (!selectedChild || !currentUser || !currentFamily) return;
                    sendMessage(currentUser.id, selectedChild, currentFamily.id, msg.text, msg.emoji);
                    setShowMessages(false);
                    setSelectedChild('');
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-purple-50 hover:ring-2 hover:ring-purple-200 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="text-2xl">{msg.emoji}</span>
                  <span className="text-sm text-gray-700">{msg.text}</span>
                </button>
              ))}
            </div>
          </div>
          {!selectedChild && <p className="text-xs text-amber-600 text-center">Sélectionnez d'abord un enfant</p>}
        </div>
      </Modal>

      {/* Task Form Modal */}
      <Modal isOpen={showTaskForm} onClose={() => setShowTaskForm(false)} title="Nouvelle tâche" size="lg">
        <TaskForm
          familyId={currentFamily?.id || ''}
          childIds={children.map(c => c.id)}
          getChildName={id => allUsers.find(u => u.id === id)?.name || id}
          onSubmit={task => { addTask(task); setShowTaskForm(false); }}
          onCancel={() => setShowTaskForm(false)}
        />
      </Modal>

      {/* Event Form Modal */}
      <Modal isOpen={showEventForm} onClose={() => setShowEventForm(false)} title="Ajouter un événement">
        <div className="space-y-4">
          <input
            type="text"
            value={newEvent.title}
            onChange={e => setNewEvent(v => ({ ...v, title: e.target.value }))}
            placeholder="Titre de l'événement"
            className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={e => setNewEvent(v => ({ ...v, date: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
          />
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setShowEventForm(false)}>Annuler</Button>
            <Button variant="primary" fullWidth onClick={() => {
              if (newEvent.title && newEvent.date) {
                addEvent({ id: `ev-${Date.now()}`, familyId: currentFamily?.id || '', title: newEvent.title, date: newEvent.date, emoji: '📅', color: 'bg-purple-500', assignedTo: [] });
                setShowEventForm(false);
                setNewEvent({ title: '', date: '', emoji: '📅' });
              }
            }}>Créer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
