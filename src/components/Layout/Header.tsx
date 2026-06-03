import React, { useState } from 'react';
import { Bell, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Modal } from '../UI/Modal';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false, showNotifications = true }) => {
  const navigate = useNavigate();
  const { currentUser, currentFamily } = useAuthStore();
  const { notifications, markAllNotificationsRead } = useFamilyStore();
  const [showNotifModal, setShowNotifModal] = useState(false);

  const userNotifs = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifs.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
      {showBack && (
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}
      <div className="flex-1">
        {title && <h1 className="text-lg font-bold text-gray-900">{title}</h1>}
        {!title && currentFamily && <h1 className="text-lg font-bold text-gray-900">{currentFamily.name}</h1>}
      </div>
      {showNotifications && (
        <button
          onClick={() => setShowNotifModal(true)}
          className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      <Modal isOpen={showNotifModal} onClose={() => { setShowNotifModal(false); if (currentUser) markAllNotificationsRead(currentUser.id); }} title="Notifications">
        <div className="space-y-3">
          {userNotifs.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Aucune notification</p>
          ) : (
            userNotifs.slice(0, 10).map(n => (
              <div key={n.id} className={`p-3 rounded-2xl ${n.read ? 'bg-gray-50' : 'bg-purple-50 border border-purple-100'}`}>
                <div className="font-semibold text-sm text-gray-900">{n.title}</div>
                <div className="text-sm text-gray-600 mt-0.5">{n.body}</div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </header>
  );
};
