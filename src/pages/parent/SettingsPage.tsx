import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Crown, Info, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { PricingModal } from '../../components/Premium/PricingModal';
import { Avatar } from '../../components/UI/Avatar';
import { Button } from '../../components/UI/Button';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, currentFamily, logout } = useAuthStore();
  const [pricingOpen, setPricingOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black text-gray-900">Paramètres</h1>

      {/* Profile */}
      {currentUser && (
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
          <div className="flex items-center gap-4">
            <Avatar emoji={currentUser.avatar} color={currentUser.color} size="lg" />
            <div>
              <div className="font-black text-gray-900 text-lg">{currentUser.name}</div>
              {currentUser.email && <div className="text-gray-500 text-sm">{currentUser.email}</div>}
              <div className="text-xs text-gray-400 mt-0.5">
                Famille : {currentFamily?.name} • Code : {currentFamily?.inviteCode}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan */}
      <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Abonnement</div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${currentFamily?.plan === 'premium' ? 'bg-amber-100' : 'bg-gray-100'}`}>
              {currentFamily?.plan === 'premium' ? '👑' : '🆓'}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900">
                {currentFamily?.plan === 'premium' ? 'Premium actif' : 'Plan Gratuit'}
              </div>
              <div className="text-xs text-gray-500">
                {currentFamily?.plan === 'premium' ? 'Toutes les fonctionnalités actives' : '5 tâches actives · badges basiques'}
              </div>
            </div>
            {currentFamily?.plan !== 'premium' && (
              <button
                onClick={() => setPricingOpen(true)}
                className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
              >
                <Crown className="w-3.5 h-3.5" /> Upgrader
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">À propos</div>
        </div>
        {[
          { icon: Info, label: 'Version', value: '1.0.0' },
          { icon: Shield, label: 'Données', value: 'Stockées localement' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
            <Icon className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-sm text-gray-700">{label}</span>
            <span className="text-sm text-gray-400">{value}</span>
          </div>
        ))}
      </div>

      {/* Code famille */}
      <div className="bg-purple-50 border-2 border-purple-100 rounded-3xl p-4">
        <div className="text-sm font-semibold text-purple-700 mb-1">Code famille</div>
        <div className="text-3xl font-black text-purple-800 tracking-widest">{currentFamily?.inviteCode}</div>
        <div className="text-xs text-purple-500 mt-1">Partagez ce code avec vos enfants</div>
      </div>

      {/* Logout */}
      <Button variant="danger" fullWidth size="lg" onClick={handleLogout}>
        <LogOut className="w-5 h-5" /> Déconnexion
      </Button>

      <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  );
};
