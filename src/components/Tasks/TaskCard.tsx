import React from 'react';
import { Check, Clock, Trash2 } from 'lucide-react';
import type { Task } from '../../types';
import { Button } from '../UI/Button';

interface TaskCardProps {
  task: Task;
  childName?: string;
  isParent?: boolean;
  onComplete?: (taskId: string) => void;
  onApprove?: (taskId: string) => void;
  onReject?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  childView?: boolean;
}

const categoryConfig: Record<string, { gradient: string; pill: string; label: string; emoji: string }> = {
  maison:       { gradient: 'from-green-400 to-emerald-500',  pill: 'bg-green-100 text-green-700',    label: 'Maison',        emoji: '🏠' },
  ecole:        { gradient: 'from-blue-400 to-cyan-500',      pill: 'bg-blue-100 text-blue-700',      label: 'École',         emoji: '📚' },
  sport:        { gradient: 'from-orange-400 to-red-500',     pill: 'bg-orange-100 text-orange-700',  label: 'Sport',         emoji: '⚽' },
  comportement: { gradient: 'from-pink-400 to-rose-500',      pill: 'bg-pink-100 text-pink-700',      label: 'Comportement',  emoji: '🤝' },
  creativite:   { gradient: 'from-violet-400 to-purple-500',  pill: 'bg-violet-100 text-violet-700',  label: 'Créativité',    emoji: '🎨' },
};

const fallbackConfig = { gradient: 'from-gray-400 to-gray-500', pill: 'bg-gray-100 text-gray-600', label: 'Autre', emoji: '📌' };

export const TaskCard: React.FC<TaskCardProps> = ({
  task, childName, isParent = false,
  onComplete, onApprove, onReject, onDelete, childView = false,
}) => {
  const cat = categoryConfig[task.category] || fallbackConfig;
  const isDone = task.status === 'done';
  const isPending = task.status === 'pending_approval';

  return (
    <div className={`bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden ${isDone ? 'opacity-70' : ''}`}>
      <div className={`h-1.5 bg-gradient-to-r ${cat.gradient}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Big emoji icon */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-3xl shrink-0 shadow-sm`}>
            {task.emoji}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title + pending dot */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className={`font-bold text-gray-900 text-sm leading-tight ${isDone ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>
              {isPending && (
                <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse mt-1" title="En attente de validation" />
              )}
            </div>

            {task.description && (
              <p className="text-xs text-gray-500 mb-1.5 line-clamp-1">{task.description}</p>
            )}

            {/* Category pill + reward */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cat.pill}`}>
                {cat.emoji} {cat.label}
              </span>
              {(task.rewardMoney > 0 || task.rewardXP > 0) && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {task.rewardMoney > 0 && `CHF ${task.rewardMoney.toFixed(2)}`}
                  {task.rewardMoney > 0 && task.rewardXP > 0 && ' + '}
                  {task.rewardXP > 0 && `✨ ${task.rewardXP} XP`}
                </span>
              )}
            </div>

            {/* Status label */}
            <div className="mt-1.5">
              {task.status === 'todo' && <span className="text-xs text-gray-400 font-medium">À faire</span>}
              {task.status === 'in_progress' && <span className="text-xs text-blue-500 font-semibold">En cours</span>}
              {isPending && (
                <span className="text-xs text-orange-500 font-semibold">
                  ⏳ En attente{childName ? ` · par ${childName}` : ''}
                </span>
              )}
              {isDone && <span className="text-xs text-emerald-600 font-semibold">✓ Terminé</span>}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {!isDone && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {/* Parent actions */}
            {isParent && isPending && (
              <>
                <Button size="sm" variant="success" onClick={() => onApprove?.(task.id)} className="flex-1">
                  <Check className="w-4 h-4" /> Valider
                </Button>
                <Button size="sm" variant="danger" onClick={() => onReject?.(task.id)} className="flex-1">
                  Refuser
                </Button>
              </>
            )}
            {isParent && !isPending && (
              <Button size="sm" variant="ghost" onClick={() => onDelete?.(task.id)} className="ml-auto text-red-400">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            {/* Child actions */}
            {childView && task.status === 'todo' && (
              <button
                onClick={() => onComplete?.(task.id)}
                className={`w-full py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${cat.gradient} shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2`}
              >
                <Check className="w-4 h-4" /> Marquer comme fait ✅
              </button>
            )}
            {childView && task.status === 'in_progress' && (
              <button
                onClick={() => onComplete?.(task.id)}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> J'ai terminé ! 🎉
              </button>
            )}
            {childView && isPending && (
              <div className="w-full flex items-center gap-2 bg-amber-50 text-amber-700 rounded-2xl px-3 py-2.5 text-xs font-medium">
                <Clock className="w-4 h-4 shrink-0" />
                En attente de validation par un parent
              </div>
            )}
          </div>
        )}

        {isDone && task.approvedAt && (
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <Check className="w-3 h-3" /> Validé
          </div>
        )}
      </div>
    </div>
  );
};
