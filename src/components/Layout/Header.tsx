import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Bell, LogOut, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { Cart } from '../Marketplace/Cart';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tableau de Bord',
  '/wallet': 'Mon Portefeuille',
  '/chores': 'Mes Tâches',
  '/goals': 'Mes Objectifs',
  '/marketplace': '🛍️ Boutique',
  '/achievements': '🏆 Mes Succès',
  '/settings': '⚙️ Paramètres',
  '/parent': '👨‍👩‍👧‍👦 Espace Parent',
};

export const Header: React.FC = () => {
  const { currentUser, cart, logout, unlockParent, isParentUnlocked, lockParent, showCart, setShowCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const title = pageTitles[location.pathname] || 'PiggyPal';
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePinSubmit = () => {
    const success = unlockParent(pin);
    if (success) {
      setShowPinModal(false);
      setPin('');
      setPinError(false);
      navigate('/parent');
    } else {
      setPinError(true);
      setPin('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          {/* Mobile logo / Page title */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-9 h-9 bg-gradient-purple rounded-xl flex items-center justify-center text-xl">
              🐷
            </div>
            <h1 className="text-lg font-nunito font-800 text-gray-800 lg:text-xl">{title}</h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {currentUser?.type === 'child' && (
              <>
                {/* Cart button */}
                <button
                  onClick={() => setShowCart(true)}
                  className="relative p-2 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <ShoppingCart size={22} className="text-gray-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 text-white text-xs font-700 font-nunito rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Notification placeholder */}
                <button className="relative p-2 rounded-xl hover:bg-primary-50 transition-colors">
                  <Bell size={22} className="text-gray-600" />
                </button>

                {/* Parent mode */}
                {!isParentUnlocked ? (
                  <button
                    onClick={() => setShowPinModal(true)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-nunito font-600 text-primary-600 hover:bg-primary-50 transition-colors border border-primary-200"
                  >
                    <ShieldCheck size={14} />
                    Parent
                  </button>
                ) : (
                  <button
                    onClick={() => { lockParent(); navigate('/dashboard'); }}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-nunito font-600 text-success-600 bg-success-50 transition-colors border border-success-200"
                  >
                    <ShieldCheck size={14} />
                    Mode Parent
                  </button>
                )}
              </>
            )}

            {currentUser?.type === 'parent' && isParentUnlocked && (
              <button
                onClick={() => { lockParent(); navigate('/login'); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-nunito font-600 text-success-600 bg-success-50 border border-success-200"
              >
                <ShieldCheck size={14} />
                Mode Parent Actif
              </button>
            )}

            {/* Logout mobile */}
            <button
              onClick={handleLogout}
              className="lg:hidden p-2 rounded-xl hover:bg-danger-50 text-danger-500 transition-colors"
            >
              <LogOut size={20} />
            </button>

            {/* User avatar */}
            {currentUser && (
              <div className="hidden lg:flex w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 items-center justify-center text-lg">
                {currentUser.avatar}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* PIN Modal */}
      <Modal isOpen={showPinModal} onClose={() => { setShowPinModal(false); setPin(''); setPinError(false); }} title="🔒 Mode Parent" size="sm">
        <p className="text-sm text-gray-500 mb-4">Entrez votre code PIN pour accéder à l'espace parent.</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => { setPin(e.target.value); setPinError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
          placeholder="••••"
          className={`w-full text-center text-3xl tracking-widest border-2 rounded-2xl px-4 py-3 outline-none font-nunito transition-colors ${pinError ? 'border-danger-400 bg-danger-50' : 'border-primary-200 focus:border-primary-500'}`}
          autoFocus
        />
        {pinError && <p className="text-sm text-danger-500 mt-2 text-center">Code incorrect. Essayez encore.</p>}
        <p className="text-xs text-gray-400 mt-2 text-center">Code par défaut: 1234</p>
        <Button fullWidth className="mt-4" onClick={handlePinSubmit} disabled={pin.length < 4}>
          Valider
        </Button>
      </Modal>

      {/* Cart Drawer */}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </>
  );
};
