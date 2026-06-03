import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const configs = {
    success: { icon: CheckCircle, bg: 'bg-emerald-500', text: 'text-white' },
    error: { icon: XCircle, bg: 'bg-red-500', text: 'text-white' },
    warning: { icon: AlertCircle, bg: 'bg-amber-500', text: 'text-white' },
    info: { icon: Info, bg: 'bg-blue-500', text: 'text-white' },
  };

  const { icon: Icon, bg, text } = configs[type];

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl ${bg} ${text} animate-slide-up max-w-xs w-full mx-4`}>
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="shrink-0 opacity-75 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast context
interface ToastState {
  show: (message: string, type?: ToastType) => void;
}

let toastCallback: ((message: string, type?: ToastType) => void) | null = null;

export const useToast = (): ToastState => ({
  show: (message, type) => toastCallback?.(message, type),
});

interface ToastContainerProps {
  children: React.ReactNode;
}

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

export const ToastProvider: React.FC<ToastContainerProps> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    toastCallback = (message: string, type: ToastType = 'success') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
    };
    return () => { toastCallback = null; };
  }, []);

  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <>
      {children}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
      ))}
    </>
  );
};
