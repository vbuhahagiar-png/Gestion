import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { redirectToCheckout } from '../../lib/stripe';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [loading] = useState(false);

  const handleCheckout = () => {
    redirectToCheckout(billing);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Passer à Premium ✨" size="md">
      <div className="space-y-4">
        {/* Billing toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${billing === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
          >
            Mensuel<br /><span className="text-xs font-normal">CHF 4.90/mois</span>
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${billing === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
          >
            Annuel<br />
            <span className="text-xs font-normal text-emerald-600 font-bold">CHF 49/an — Économisez 17% 🎉</span>
          </button>
        </div>

        {/* Price display */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-700 rounded-3xl p-5 text-white text-center">
          <div className="text-3xl font-black">
            {billing === 'monthly' ? 'CHF 4.90' : 'CHF 4.08'}
            <span className="text-lg font-normal opacity-75">/mois</span>
          </div>
          {billing === 'yearly' && (
            <div className="text-sm opacity-90 mt-1">Facturé CHF 49/an · Économisez CHF 9.80</div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2">
          {[
            '✅ Jusqu\'à 4 enfants (gratuit = 1 enfant)',
            '⚡ Tâches illimitées (gratuit = 5 tâches)',
            '🏆 Badges premium exclusifs',
            '📊 Statistiques avancées et graphiques hebdomadaires',
            '📅 Synchronisation Google Calendar & Outlook',
            '🎨 Thèmes personnalisés pour chaque enfant',
            '🔥 Streak freeze (1x par semaine)',
            '📩 Rappels automatiques par notification',
            '💰 Virement automatique d\'argent de poche programmé',
            '📄 Export PDF du rapport mensuel',
            '🎯 Missions bonus illimitées',
            '🌟 Support prioritaire',
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{text}</span>
            </div>
          ))}
        </div>

        <Button variant="primary" fullWidth size="lg" loading={loading} onClick={handleCheckout}>
          Passer Premium avec Stripe
        </Button>

        <p className="text-xs text-center text-gray-400">
          Annulable à tout moment · Paiement sécurisé par Stripe
        </p>
      </div>
    </Modal>
  );
};
