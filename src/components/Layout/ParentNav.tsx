import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, Calendar, ShoppingCart, Settings, LogOut, Vault } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const navItems = [
  { to: '/parent', icon: LayoutDashboard, label: 'Tableau de bord', exact: true },
  { to: '/parent/tasks', icon: CheckSquare, label: 'Tâches' },
  { to: '/parent/children', icon: Users, label: 'Enfants' },
  { to: '/parent/calendar', icon: Calendar, label: 'Calendrier' },
  { to: '/parent/shopping', icon: ShoppingCart, label: 'Courses' },
  { to: '/parent/settings', icon: Settings, label: 'Paramètres' },
];

export const ParentNav: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen p-4 shrink-0">
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center text-white">
            <Vault className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-gray-900">TiPoche</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-purple-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all ${
                  isActive ? 'text-purple-600' : 'text-gray-400'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};
