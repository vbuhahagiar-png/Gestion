import React from 'react';
import type { Task } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  isParent?: boolean;
  childView?: boolean;
  getChildName?: (id: string) => string;
  onComplete?: (taskId: string) => void;
  onApprove?: (taskId: string) => void;
  onReject?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  emptyMessage?: string;
  emptyEmoji?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks, isParent, childView,
  getChildName, onComplete, onApprove, onReject, onDelete,
  emptyMessage = 'Aucune tâche', emptyEmoji = '🎉',
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <span className="text-6xl mb-4">{emptyEmoji}</span>
        <p className="text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          isParent={isParent}
          childView={childView}
          childName={task.completedBy && getChildName ? getChildName(task.completedBy) : undefined}
          onComplete={onComplete}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
