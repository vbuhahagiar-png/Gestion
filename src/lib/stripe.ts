import { loadStripe } from '@stripe/stripe-js';

const stripeKey: string = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const redirectToCheckout = async (priceId: string) => {
  if (!stripeKey) {
    alert('Stripe non configuré. Ajoutez VITE_STRIPE_PUBLISHABLE_KEY dans votre fichier .env');
    return;
  }
  const stripe = await loadStripe(stripeKey);
  await stripe?.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    successUrl: window.location.origin + '/payment-success',
    cancelUrl: window.location.origin + '/pricing',
  });
};

export const PRICES = {
  monthly: 'price_monthly_CHF790',
  yearly: 'price_yearly_CHF7900',
};
