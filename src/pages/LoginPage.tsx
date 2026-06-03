import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';

export const LoginPage: React.FC = () => {
  const { users, login, unlockParent } = useStore();
  const navigate = useNavigate();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const children = users.filter((u) => u.type === 'child');
  const parent = users.find((u) => u.type === 'parent');

  const handleChildLogin = (userId: string) => {
    login(userId);
    navigate('/dashboard');
  };

  const handleParentClick = () => {
    setShowPinModal(true);
  };

  const handlePinSubmit = () => {
    if (parent) {
      login(parent.id);
      const success = unlockParent(pin);
      if (success) {
        setShowPinModal(false);
        navigate('/parent');
      } else {
        setPinError(true);
        setPin('');
      }
    }
  };

  const colorGradients = [
    'from-blue-400 to-cyan-400',
    'from-pink-400 to-rose-400',
    'from-green-400 to-teal-400',
    'from-purple-400 to-violet-500',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-white to-secondary-100 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center text-5xl shadow-glow-purple mx-auto mb-4 animate-float">
          🐷
        </div>
        <h1 className="text-4xl font-nunito font-900 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          PiggyPal
        </h1>
        <p className="text-gray-500 font-inter text-sm mt-1">Gestion d'argent pour enfants</p>
      </div>

      {/* Who's logging in? */}
      <div className="w-full max-w-md animate-slide-up">
        <h2 className="text-center font-nunito font-800 text-gray-700 text-lg mb-5">
          Qui es-tu aujourd'hui ? 👋
        </h2>

        {/* Children */}
        <div className="space-y-3 mb-4">
          {children.map((child, index) => (
            <button
              key={child.id}
              onClick={() => handleChildLogin(child.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl bg-gradient-to-r ${child.color || colorGradients[index % colorGradients.length]} text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                {child.avatar}
              </div>
              <div className="text-left flex-1">
                <p className="font-nunito font-800 text-lg">{child.name}</p>
                <p className="text-white/80 font-inter text-sm">{child.age} ans</p>
              </div>
              <div className="text-right">
                <p className="font-nunito font-900 text-xl">{child.balance?.toFixed(2)}€</p>
                <p className="text-white/70 font-inter text-xs">Solde</p>
              </div>
            </button>
          ))}
        </div>

        {/* Parent */}
        {parent && (
          <button
            onClick={handleParentClick}
            className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white border-2 border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-3xl">
              {parent.avatar}
            </div>
            <div className="text-left flex-1">
              <p className="font-nunito font-800 text-lg text-gray-800">{parent.name}</p>
              <p className="text-gray-500 font-inter text-sm">Espace parent 🔒</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              🔐
            </div>
          </button>
        )}

        <p className="text-center text-xs text-gray-400 font-inter mt-6">
          Toutes les données sont sauvegardées sur cet appareil
        </p>
      </div>

      {/* Decorations */}
      <div className="fixed top-10 left-10 text-4xl opacity-20 animate-bounce-slow">💰</div>
      <div className="fixed top-20 right-16 text-3xl opacity-20 animate-pulse-slow">⭐</div>
      <div className="fixed bottom-20 left-8 text-3xl opacity-20 animate-spin-slow">🌟</div>
      <div className="fixed bottom-16 right-10 text-4xl opacity-20 animate-bounce-slow">🎯</div>

      {/* PIN Modal */}
      <Modal
        isOpen={showPinModal}
        onClose={() => { setShowPinModal(false); setPin(''); setPinError(false); }}
        title="🔒 Espace Parent"
        size="sm"
      >
        <p className="text-sm text-gray-500 mb-4">
          Entrez votre code PIN parent pour accéder au tableau de bord.
        </p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => { setPin(e.target.value); setPinError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
          placeholder="••••"
          className={`w-full text-center text-3xl tracking-widest border-2 rounded-2xl px-4 py-3 outline-none font-nunito transition-colors ${
            pinError ? 'border-danger-400 bg-danger-50' : 'border-primary-200 focus:border-primary-500'
          }`}
          autoFocus
        />
        {pinError && (
          <p className="text-sm text-danger-500 mt-2 text-center font-inter">
            Code incorrect. Réessayez.
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2 text-center font-inter">Code par défaut: 1234</p>
        <Button
          fullWidth
          className="mt-4"
          onClick={handlePinSubmit}
          disabled={pin.length < 4}
        >
          Accéder à l'espace parent
        </Button>
      </Modal>
    </div>
  );
};
