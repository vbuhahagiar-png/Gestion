import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useFamilyStore } from '../../store/useFamilyStore';
import { TaskCard } from '../../components/Tasks/TaskCard';
import { ChildNav } from '../../components/Layout/ChildNav';
import type { TaskStatus } from '../../types';

const tabs: { label: string; filter: TaskStatus | 'active' }[] = [
  { label: '⏰ À faire', filter: 'todo' },
  { label: '🔄 En cours', filter: 'in_progress' },
  { label: '✅ Terminées', filter: 'done' },
];

export const MyTasksPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { tasks, completeTask } = useFamilyStore();
  const [activeTab, setActiveTab] = useState<TaskStatus | 'active'>('todo');
  const [showBravo, setShowBravo] = useState(false);
  const [bravoTaskName, setBravoTaskName] = useState('');

  const myTasks = tasks.filter(t =>
    t.assignedTo.length === 0 || t.assignedTo.includes(childId || '')
  );

  const filteredTasks = activeTab === 'todo'
    ? myTasks.filter(t => t.status === 'todo' || t.status === 'pending_approval')
    : myTasks.filter(t => t.status === activeTab);

  const handleComplete = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    completeTask(taskId, childId || '');
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6C63FF', '#FF6584', '#FFD700'],
    });
    if (task) {
      setBravoTaskName(task.title);
      setShowBravo(true);
    }
  }, [childId, completeTask, tasks]);

  const todoCounts = {
    todo: myTasks.filter(t => t.status === 'todo' || t.status === 'pending_approval').length,
    in_progress: myTasks.filter(t => t.status === 'in_progress').length,
    done: myTasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 pt-10 pb-5 px-4 text-white">
        <div className="text-xl font-black mb-1">Mes Tâches ✅</div>
        <div className="text-purple-200 text-sm">
          {todoCounts.todo} à faire · {todoCounts.done} terminées
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab.filter}
            onClick={() => setActiveTab(tab.filter)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.filter
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab.label}
            {tab.filter !== 'done' && todoCounts[tab.filter as keyof typeof todoCounts] > 0 && (
              <span className="ml-1 bg-white/30 text-white text-xs px-1 rounded-full">
                {todoCounts[tab.filter as keyof typeof todoCounts]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="px-4 pt-4 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-3">
              {activeTab === 'todo' ? '🎉' : activeTab === 'in_progress' ? '💪' : '🏆'}
            </div>
            <div className="font-bold text-gray-700 text-lg">
              {activeTab === 'todo' ? 'Toutes les tâches sont faites !' :
               activeTab === 'in_progress' ? 'Aucune tâche en cours' :
               'Pas encore de tâches terminées'}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {activeTab === 'todo' ? 'Tu es un champion ! 🏆' :
               activeTab === 'in_progress' ? 'Commence une tâche ci-dessus' :
               'Complète des tâches pour les voir ici'}
            </div>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              childView
              onComplete={handleComplete}
            />
          ))
        )}
      </div>

      <ChildNav />

      {showBravo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
             onClick={() => setShowBravo(false)}>
          <div className="bg-white rounded-3xl p-8 mx-4 text-center shadow-2xl animate-bounce-in max-w-xs">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Bravo !</h2>
            <p className="text-gray-600 text-sm mb-2">
              Tu as terminé <strong>{bravoTaskName}</strong>
            </p>
            <p className="text-purple-600 font-semibold text-sm">
              En attente de validation par tes parents 👀
            </p>
            <button
              onClick={() => setShowBravo(false)}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-2xl text-sm"
            >
              Super ! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
