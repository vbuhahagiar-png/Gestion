import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Home, CheckSquare, PiggyBank, Trophy, Calendar } from 'lucide-react';

export const ChildNav: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const base = `/child/${childId}`;

  const items = [
    { to: base, icon: '🏠', label: 'Accueil', lucide: Home, exact: true },
    { to: `${base}/tasks`, icon: '✅', label: 'Tâches', lucide: CheckSquare },
    { to: `${base}/wallet`, icon: '💰', label: 'Cagnotte', lucide: PiggyBank },
    { to: `${base}/badges`, icon: '🏆', label: 'Badges', lucide: Trophy },
    { to: `${base}/calendar`, icon: '📅', label: 'Calendrier', lucide: Calendar },
  ];

  const colors = ['from-violet-500 to-purple-600', 'from-green-500 to-emerald-600', 'from-amber-500 to-orange-600', 'from-pink-500 to-rose-600', 'from-blue-500 to-cyan-600'];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 z-40">
      <div className="flex items-center justify-around px-1 py-2">
        {items.map(({ to, icon, label, exact }, i) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 min-w-[56px] py-1 px-2 rounded-2xl transition-all duration-200 ${
                isActive ? 'scale-110' : 'scale-100 opacity-60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all ${isActive ? `bg-gradient-to-br ${colors[i]} shadow-lg` : 'bg-gray-100'}`}>
                  {icon}
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
