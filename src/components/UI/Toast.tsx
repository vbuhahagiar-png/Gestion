import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Toast as ToastType } from '../../types';

const iconMap = {
  success: <CheckCircle size={20} className="text-success-500" />,
  error: <XCircle size={20} className="text-danger-500" />,
  warning: <AlertCircle size={20} className="text-accent-500" />,
  info: <Info size={20} className="text-primary-500" />,
};

const colorMap: Record<ToastType['type'], string> = {
  success: 'border-l-success-500 bg-success-50',
  error: 'border-l-danger-500 bg-danger-50',
  warning: 'border-l-accent-500 bg-accent-50',
  info: 'border-l-primary-500 bg-primary-50',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 md:bottom-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 min-w-64 max-w-sm p-4 rounded-2xl shadow-lg border-l-4 ${colorMap[toast.type]} animate-slide-up`}
        >
          {iconMap[toast.type]}
          <span className="flex-1 text-sm font-inter font-500 text-gray-700">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
