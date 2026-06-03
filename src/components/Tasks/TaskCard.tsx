import React from 'react';
import { Check, Clock, Trash2 } from 'lucide-react';
import type { Task } from '../../types';
import { Button } from '../UI/Button';
import { Badge } from '../UI/Badge';

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

const categoryColors: Record<string, string> = {
  maison: 'from-blue-400 to-cyan-500',
  ecole: 'from-green-400 to-emerald-500',
  sport: 'from-orange-400 to-red-500',
  comportement: 'from-pink-400 to-rose-500',
  creativite: 'from-violet-400 to-purple-500',
};

const categoryNames: Record<string, string> = {
  maison: 'Maison',
  ecole: 'École',
  sport: 'Sport',
  comportement: 'Comportement',
  creativite: 'Créativité',
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'todo': return <Badge variant="default">À faire</Badge>;
    case 'in_progress': return <Badge variant="blue">En cours</Badge>;
    case 'pending_approval': return <Badge variant="warning">En attente</Badge>;
    case 'done': return <Badge variant="success">Terminé ✓</Badge>;
    default: return null;
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task, childName, isParent = false,
  onComplete, onApprove, onReject, onDelete, childView = false,
}) => {
  const gradient = categoryColors[task.category] || 'from-gray-400 to-gray-500';
  const isDone = task.status === 'done';
  const isPending = task.status === 'pending_approval';

  return (
    <div className={`bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden ${isDone ? 'opacity-70' : ''}`}>
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shrink-0`}>
            {task.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-bold text-gray-900 text-sm leading-tight ${isDone ? 'line-through' : ''}`}>{task.title}</h3>
              {statusBadge(task.status)}
            </div>
            {task.description && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="default">{categoryNames[task.category]}</Badge>
              {task.rewardMoney > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  💰 CHF {task.rewardMoney.toFixed(2)}
                </span>
              )}
              {task.rewardXP > 0 && (
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  ✨ +{task.rewardXP} XP
                </span>
              )}
              {childName && isPending && (
                <span className="text-xs text-gray-500">par {childName}</span>
              )}
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
              <Button size="sm" variant="primary" onClick={() => onComplete?.(task.id)} fullWidth>
                <Check className="w-4 h-4" /> Marquer comme terminé
              </Button>
            )}
            {childView && task.status === 'in_progress' && (
              <Button size="sm" variant="success" onClick={() => onComplete?.(task.id)} fullWidth>
                <Check className="w-4 h-4" /> J'ai terminé !
              </Button>
            )}
            {childView && isPending && (
              <div className="w-full flex items-center gap-2 bg-amber-50 text-amber-700 rounded-2xl px-3 py-2 text-xs font-medium">
                <Clock className="w-4 h-4" />
                En attente de validation par un parent
              </div>
            )}
          </div>
        )}

        {isDone && task.approvedAt && (
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
            <Check className="w-3 h-3" /> Validé
          </div>
        )}
      </div>
    </div>
  );
};
