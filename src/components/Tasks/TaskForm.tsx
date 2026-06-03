import React, { useState } from 'react';
import { Button } from '../UI/Button';
import type { Task, TaskCategory, TaskFrequency, RewardType } from '../../types';
import { TASK_EMOJIS } from '../../data/taskTemplates';

interface TaskFormProps {
  familyId: string;
  childIds: string[];
  getChildName: (id: string) => string;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ familyId, childIds, getChildName, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'maison' as TaskCategory,
    frequency: 'once' as TaskFrequency,
    rewardType: 'money' as RewardType,
    rewardMoney: '1.00',
    rewardXP: '20',
    assignedTo: [] as string[],
    emoji: '🛏️',
    dueDate: '',
  });

  const categories: { value: TaskCategory; label: string; emoji: string }[] = [
    { value: 'maison', label: 'Maison', emoji: '🏠' },
    { value: 'ecole', label: 'École', emoji: '📚' },
    { value: 'sport', label: 'Sport', emoji: '⚽' },
    { value: 'comportement', label: 'Comportement', emoji: '😊' },
    { value: 'creativite', label: 'Créativité', emoji: '🎨' },
  ];

  const frequencies: { value: TaskFrequency; label: string }[] = [
    { value: 'once', label: 'Une fois' },
    { value: 'daily', label: 'Chaque jour' },
    { value: 'weekly', label: 'Chaque semaine' },
    { value: 'monthly', label: 'Chaque mois' },
  ];

  const toggleChild = (id: string) => {
    setForm(f => ({
      ...f,
      assignedTo: f.assignedTo.includes(id) ? f.assignedTo.filter(c => c !== id) : [...f.assignedTo, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    onSubmit({
      id: `task-${Date.now()}`,
      familyId,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      frequency: form.frequency,
      rewardType: form.rewardType,
      rewardMoney: parseFloat(form.rewardMoney) || 0,
      rewardXP: parseInt(form.rewardXP) || 0,
      assignedTo: form.assignedTo,
      status: 'todo',
      emoji: form.emoji,
      dueDate: form.dueDate || undefined,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Emoji picker */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Emoji</label>
        <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
          {TASK_EMOJIS.map(e => (
            <button
              key={e}
              type="button"
              onClick={() => setForm(f => ({ ...f, emoji: e }))}
              className={`w-9 h-9 rounded-xl text-lg transition-all ${form.emoji === e ? 'bg-purple-100 ring-2 ring-purple-500 scale-110' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Titre *</label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Ex: Ranger sa chambre"
          required
          className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={2}
          placeholder="Détails de la tâche..."
          className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Catégorie</label>
        <div className="grid grid-cols-5 gap-1.5">
          {categories.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setForm(f => ({ ...f, category: c.value }))}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl text-xs font-medium transition-all ${form.category === c.value ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <span className="text-lg">{c.emoji}</span>
              <span className="text-[10px]">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Fréquence</label>
        <select
          value={form.frequency}
          onChange={e => setForm(f => ({ ...f, frequency: e.target.value as TaskFrequency }))}
          className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
        >
          {frequencies.map(freq => (
            <option key={freq.value} value={freq.value}>{freq.label}</option>
          ))}
        </select>
      </div>

      {/* Rewards */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Récompense</label>
        <div className="flex gap-2 mb-3">
          {(['money', 'badge', 'both'] as RewardType[]).map(rt => (
            <button
              key={rt}
              type="button"
              onClick={() => setForm(f => ({ ...f, rewardType: rt }))}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${form.rewardType === rt ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {rt === 'money' ? '💰 Argent' : rt === 'badge' ? '🏆 Badge' : '🎁 Les deux'}
            </button>
          ))}
        </div>
        {(form.rewardType === 'money' || form.rewardType === 'both') && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">CHF</span>
            <input
              type="number"
              value={form.rewardMoney}
              onChange={e => setForm(f => ({ ...f, rewardMoney: e.target.value }))}
              min="0"
              step="0.50"
              className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-600">✨ XP</span>
          <input
            type="number"
            value={form.rewardXP}
            onChange={e => setForm(f => ({ ...f, rewardXP: e.target.value }))}
            min="0"
            step="5"
            className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Assign to */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Assigner à (vide = tous)</label>
        <div className="flex flex-wrap gap-2">
          {childIds.map(id => (
            <button
              key={id}
              type="button"
              onClick={() => toggleChild(id)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${form.assignedTo.includes(id) ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {getChildName(id)}
            </button>
          ))}
        </div>
      </div>

      {/* Due date */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Date limite (optionnel)</label>
        <input
          type="date"
          value={form.dueDate}
          onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth>Annuler</Button>
        <Button type="submit" variant="primary" fullWidth>Créer la tâche</Button>
      </div>
    </form>
  );
};
