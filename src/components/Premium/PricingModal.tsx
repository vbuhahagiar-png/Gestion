import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { Check, Zap, Star } from 'lucide-react';
import { redirectToCheckout, PRICES } from '../../lib/stripe';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    await redirectToCheckout(billing === 'monthly' ? PRICES.monthly : PRICES.yearly);
    setLoading(false);
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
            Mensuel<br /><span className="text-xs font-normal">CHF 7.90/mois</span>
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${billing === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
          >
            Annuel<br />
            <span className="text-xs font-normal text-emerald-600 font-bold">CHF 79/an — Économisez 15% 🎉</span>
          </button>
        </div>

        {/* Price display */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-700 rounded-3xl p-5 text-white text-center">
          <div className="text-3xl font-black">
            {billing === 'monthly' ? 'CHF 7.90' : 'CHF 6.58'}
            <span className="text-lg font-normal opacity-75">/mois</span>
          </div>
          {billing === 'yearly' && (
            <div className="text-sm opacity-90 mt-1">Facturé CHF 79/an · Économisez CHF 15.80</div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2.5">
          {[
            { icon: Zap, text: 'Tâches illimitées (au lieu de 5)' },
            { icon: Star, text: 'Badges premium exclusifs' },
            { icon: Check, text: 'Statistiques avancées & graphiques' },
            { icon: Check, text: 'Thèmes personnalisés pour les enfants' },
            { icon: Check, text: 'Streak freeze (1x/semaine)' },
            { icon: Check, text: 'Export PDF des rapports mensuels' },
            { icon: Check, text: 'Support prioritaire' },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">{text}</span>
            </div>
          ))}
        </div>

        <Button variant="primary" fullWidth size="lg" loading={loading} onClick={handleCheckout}>
          Passer Premium avec Stripe
        </Button>

        <div className="bg-amber-50 rounded-2xl p-3 text-xs text-amber-700">
          <strong>💡 Pour activer les paiements :</strong> Créez un compte Stripe sur stripe.com, puis ajoutez <code className="bg-amber-100 px-1 rounded">VITE_STRIPE_PUBLISHABLE_KEY</code> dans votre fichier <code className="bg-amber-100 px-1 rounded">.env</code>
        </div>

        <p className="text-xs text-center text-gray-400">
          Annulable à tout moment · Paiement sécurisé par Stripe
        </p>
      </div>
    </Modal>
  );
};
