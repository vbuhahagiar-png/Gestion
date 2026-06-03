import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Wallet, CheckSquare, Target, ShoppingBag,
  Trophy, Settings, LogOut, ShieldCheck
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const childLinks = [
  { to: '/dashboard', icon: Home, label: 'Tableau de Bord' },
  { to: '/wallet', icon: Wallet, label: 'Portefeuille' },
  { to: '/chores', icon: CheckSquare, label: 'Tâches' },
  { to: '/goals', icon: Target, label: 'Objectifs' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Boutique' },
  { to: '/achievements', icon: Trophy, label: 'Succès' },
];

const parentLinks = [
  { to: '/parent', icon: Home, label: 'Vue Parent' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Boutique' },
  { to: '/settings', icon: Settings, label: 'Paramètres' },
];

export const Sidebar: React.FC = () => {
  const { currentUser, logout, isParentUnlocked } = useStore();
  const navigate = useNavigate();

  const isParent = currentUser?.type === 'parent' && isParentUnlocked;
  const links = isParent ? parentLinks : childLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-purple rounded-2xl flex items-center justify-center text-2xl shadow-glow-purple">
            🐷
          </div>
          <div>
            <h1 className="text-xl font-nunito font-900 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              PiggyPal
            </h1>
            <p className="text-xs text-gray-400 font-inter">Gestion d'argent</p>
          </div>
        </div>
      </div>

      {/* User info */}
      {currentUser && (
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center text-xl">
              {currentUser.avatar}
            </div>
            <div>
              <p className="font-nunito font-700 text-gray-800 text-sm">{currentUser.name}</p>
              {currentUser.type === 'child' && (
                <p className="text-xs text-primary-500 font-inter">
                  {currentUser.balance?.toFixed(2)}€
                </p>
              )}
              {isParent && (
                <div className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-success-500" />
                  <span className="text-xs text-success-600 font-inter">Mode Parent</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl font-nunito font-600 text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        {currentUser?.type === 'child' && (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl font-nunito font-600 text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
              }`
            }
          >
            <Settings size={20} />
            Paramètres
          </NavLink>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-nunito font-600 text-sm text-danger-500 hover:bg-danger-50 transition-all duration-200"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};
