import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { PricingModal } from './PricingModal';
import type { PlanType } from '../../types';

interface PremiumBannerProps {
  plan: PlanType;
}

export const PremiumBanner: React.FC<PremiumBannerProps> = ({ plan }) => {
  const [show, setShow] = useState(true);
  const [pricingOpen, setPricingOpen] = useState(false);

  if (plan === 'premium' || !show) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-4 flex items-center gap-3 shadow-lg shadow-amber-200">
        <Sparkles className="w-6 h-6 text-white shrink-0" />
        <div className="flex-1">
          <div className="font-bold text-white text-sm">Passer à Premium</div>
          <div className="text-xs text-amber-100">Tâches illimitées, badges exclusifs — CHF 7.90/mois</div>
        </div>
        <button
          onClick={() => setPricingOpen(true)}
          className="bg-white text-orange-600 font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-orange-50 transition-colors shrink-0"
        >
          Essayer
        </button>
        <button onClick={() => setShow(false)} className="text-white/70 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
    </>
  );
};
