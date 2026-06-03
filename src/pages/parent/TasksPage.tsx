import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useFamilyStore } from '../../store/useFamilyStore';
import { TaskList } from '../../components/Tasks/TaskList';
import { TaskForm } from '../../components/Tasks/TaskForm';
import { Modal } from '../../components/UI/Modal';
import type { TaskStatus } from '../../types';

const tabs: { label: string; filter: TaskStatus | 'all' }[] = [
  { label: 'Toutes', filter: 'all' },
  { label: 'À valider', filter: 'pending_approval' },
  { label: 'En cours', filter: 'in_progress' },
  { label: 'Terminées', filter: 'done' },
];

export const TasksPage: React.FC = () => {
  const { allUsers, currentFamily } = useAuthStore();
  const { tasks, addTask, approveTask, rejectTask, deleteTask } = useFamilyStore();
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);

  const children = allUsers.filter(u => u.role === 'child');

  const filtered = activeTab === 'all' ? tasks : tasks.filter(t => t.status === activeTab);

  const getChildName = (id: string) => allUsers.find(u => u.id === id)?.name || id;

  const pendingCount = tasks.filter(t => t.status === 'pending_approval').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-gray-900">Tâches</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.filter}
            onClick={() => setActiveTab(tab.filter)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.filter
                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            {tab.label}
            {tab.filter === 'pending_approval' && pendingCount > 0 && (
              <span className="bg-amber-400 text-amber-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <TaskList
        tasks={filtered}
        isParent
        getChildName={getChildName}
        onApprove={approveTask}
        onReject={rejectTask}
        onDelete={deleteTask}
        emptyMessage={activeTab === 'all' ? 'Aucune tâche. Créez-en une !' : 'Aucune tâche dans cette catégorie'}
        emptyEmoji={activeTab === 'done' ? '🎉' : activeTab === 'pending_approval' ? '✅' : '📋'}
      />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Nouvelle tâche" size="lg">
        <TaskForm
          familyId={currentFamily?.id || ''}
          childIds={children.map(c => c.id)}
          getChildName={id => allUsers.find(u => u.id === id)?.name || id}
          onSubmit={task => { addTask(task); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
};
