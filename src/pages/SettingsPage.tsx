import React, { useState } from 'react';
import { LogOut, User, Bell, Shield, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';

export const SettingsPage: React.FC = () => {
  const { currentUser, logout, users } = useStore();
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const appVersion = '1.0.0';

  return (
    <div className="space-y-5 max-w-xl mx-auto">
      {/* Profile Card */}
      <Card className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentUser.color || 'from-primary-400 to-secondary-400'} flex items-center justify-center text-3xl shadow-md`}>
            {currentUser.avatar}
          </div>
          <div>
            <h2 className="font-nunito font-900 text-gray-800 text-xl">{currentUser.name}</h2>
            {currentUser.age && (
              <p className="text-gray-500 font-inter text-sm">{currentUser.age} ans</p>
            )}
            {currentUser.type === 'child' && (
              <p className="text-primary-600 font-nunito font-700 text-sm">
                💰 {currentUser.balance?.toFixed(2)}€
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* App Info */}
      <Card className="p-5 divide-y divide-gray-100">
        <div className="flex items-center justify-between py-3 first:pt-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
              <User size={18} className="text-primary-500" />
            </div>
            <span className="font-nunito font-600 text-gray-700">Version de l'app</span>
          </div>
          <span className="text-sm text-gray-400 font-inter">{appVersion}</span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-success-50 rounded-xl flex items-center justify-center">
              <Bell size={18} className="text-success-500" />
            </div>
            <span className="font-nunito font-600 text-gray-700">Notifications</span>
          </div>
          <span className="text-sm text-success-500 font-nunito font-600">Activées</span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent-50 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-accent-500" />
            </div>
            <span className="font-nunito font-600 text-gray-700">Contrôle parental</span>
          </div>
          <span className="text-sm text-accent-500 font-nunito font-600">Activé</span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <span className="text-blue-500 text-sm">💾</span>
            </div>
            <span className="font-nunito font-600 text-gray-700">Données</span>
          </div>
          <span className="text-sm text-gray-400 font-inter">localStorage</span>
        </div>
      </Card>

      {/* Family Members */}
      <Card className="p-5">
        <h3 className="font-nunito font-800 text-gray-800 mb-4">👨‍👩‍👧‍👦 Ma famille</h3>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <div className={`w-10 h-10 rounded-full ${user.type === 'parent' ? 'bg-gradient-to-br from-gray-400 to-gray-600' : `bg-gradient-to-br ${user.color || 'from-primary-400 to-secondary-400'}`} flex items-center justify-center text-xl`}>
                {user.avatar}
              </div>
              <div className="flex-1">
                <p className="font-nunito font-700 text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400 font-inter">
                  {user.type === 'parent' ? '👨‍👩 Parent' : `${user.age} ans`}
                  {user.id === currentUser.id ? ' · C\'est toi !' : ''}
                </p>
              </div>
              {user.type === 'child' && (
                <span className="font-nunito font-700 text-primary-600 text-sm">
                  {user.balance?.toFixed(2)}€
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-5 border-2 border-danger-100">
        <h3 className="font-nunito font-800 text-danger-600 mb-4">⚠️ Zone de danger</h3>
        <div className="space-y-3">
          <button
            onClick={() => setShowReset(true)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-danger-50 text-danger-600 hover:bg-danger-100 transition-colors"
          >
            <RefreshCw size={18} />
            <div className="text-left">
              <p className="font-nunito font-700 text-sm">Réinitialiser les données</p>
              <p className="text-xs font-inter text-danger-400">Efface toutes les données de l'app</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Logout */}
      <Button
        fullWidth
        size="lg"
        variant="danger"
        onClick={handleLogout}
        className="mb-6"
      >
        <LogOut size={20} />
        Se déconnecter
      </Button>

      {/* Copyright */}
      <p className="text-center text-xs text-gray-300 font-inter pb-6">
        PiggyPal v{appVersion} · Fait avec ❤️ pour les enfants
      </p>

      {/* Reset Modal */}
      <Modal isOpen={showReset} onClose={() => setShowReset(false)} title="⚠️ Confirmer la réinitialisation" size="sm">
        <p className="text-sm text-gray-500 font-inter mb-4">
          Toutes les données seront effacées définitivement. Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setShowReset(false)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              localStorage.removeItem('piggypal-storage');
              window.location.reload();
            }}
          >
            Réinitialiser
          </Button>
        </div>
      </Modal>
    </div>
  );
};
