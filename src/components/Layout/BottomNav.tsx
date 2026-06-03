import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Wallet, CheckSquare, Target, ShoppingBag, Trophy } from 'lucide-react';
import { useStore } from '../../store/useStore';

const childLinks = [
  { to: '/dashboard', icon: Home, label: 'Accueil' },
  { to: '/wallet', icon: Wallet, label: 'Argent' },
  { to: '/chores', icon: CheckSquare, label: 'Tâches' },
  { to: '/goals', icon: Target, label: 'Objectifs' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Boutique' },
  { to: '/achievements', icon: Trophy, label: 'Succès' },
];

const parentLinks = [
  { to: '/parent', icon: Home, label: 'Accueil' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Boutique' },
];

export const BottomNav: React.FC = () => {
  const { currentUser, isParentUnlocked } = useStore();
  const isParent = currentUser?.type === 'parent' && isParentUnlocked;
  const links = isParent ? parentLinks : childLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary-100' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-nunito font-600">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
