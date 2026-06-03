// Stripe Payment Links (mode test — remplacer par les liens live pour la production)
export const PAYMENT_LINKS = {
  monthly: 'https://buy.stripe.com/test_cNicN72Mq4VMdzZ1eu5gc00',
  yearly:  'https://buy.stripe.com/test_28E5kFaeSewm1RhcXc5gc01',
};

export const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51TeCz2R1PPnTWX5JBklca9rKvOp49IH1EPyMRT92Dgv3JkEUWLdeJ488icfvyDEb8IZVSUDmSsAimxLFkkO3J8ou00gfq9DPWi';

export const redirectToCheckout = (plan: 'monthly' | 'yearly') => {
  window.location.href = PAYMENT_LINKS[plan];
};
