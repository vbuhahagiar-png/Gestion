import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { marketplaceItems } from '../../data/marketplaceItems';
import { Button } from '../UI/Button';

interface CartProps {
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ onClose }) => {
  const {
    cart,
    currentUser,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    requestPurchase,
    addToast,
  } = useStore();

  const [confirming, setConfirming] = useState(false);

  const balance = currentUser?.balance || 0;
  const spendingLimit = currentUser?.spendingLimit || Infinity;

  const cartWithDetails = cart.map((item) => ({
    ...item,
    product: marketplaceItems.find((p) => p.id === item.productId),
  })).filter((item) => item.product);

  const total = cartWithDetails.reduce(
    (sum, item) => sum + (item.product!.price * item.quantity),
    0
  );

  const canAfford = balance >= total;
  const needsApproval = total > spendingLimit;

  const handleCheckout = () => {
    if (!canAfford) {
      addToast('Tu n\'as pas assez d\'argent pour cet achat 😢', 'error');
      return;
    }

    if (needsApproval) {
      requestPurchase();
      addToast('🙋 Demande envoyée à tes parents pour approbation !', 'info');
      onClose();
      return;
    }

    setConfirming(true);
  };

  const handleConfirm = () => {
    requestPurchase();
    addToast('🎉 Achat effectué avec succès !', 'success');
    setConfirming(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full flex flex-col animate-slide-in shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={22} className="text-primary-600" />
            <h2 className="text-xl font-nunito font-800 text-gray-800">Mon Panier</h2>
            {cart.length > 0 && (
              <span className="bg-primary-100 text-primary-700 text-xs font-nunito font-700 px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} article(s)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-danger-500 hover:text-danger-700 font-nunito font-600 flex items-center gap-1"
              >
                <Trash2 size={14} /> Vider
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Balance indicator */}
        <div className="mx-5 mt-4 p-3 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-inter text-gray-600">Ton solde</span>
            <span className="font-nunito font-900 text-primary-600">{balance.toFixed(2)}€</span>
          </div>
          {cart.length > 0 && (
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm font-inter text-gray-600">Après achat</span>
              <span className={`font-nunito font-900 text-sm ${balance - total >= 0 ? 'text-success-600' : 'text-danger-500'}`}>
                {(balance - total).toFixed(2)}€
              </span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cartWithDetails.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-400 font-inter">Ton panier est vide</p>
              <p className="text-gray-300 font-inter text-sm mt-1">Explore la boutique !</p>
            </div>
          ) : (
            cartWithDetails.map(({ productId, quantity, product }) => (
              <div key={productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product!.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {product!.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-nunito font-700 text-gray-800 text-sm truncate">{product!.name}</p>
                  <p className="text-primary-600 font-nunito font-800 text-sm">{product!.price.toFixed(2)}€</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartQuantity(productId, quantity - 1)}
                    className="w-7 h-7 bg-white rounded-lg border border-gray-200 flex items-center justify-center hover:bg-danger-50 hover:border-danger-200 transition-colors"
                  >
                    <Minus size={12} className="text-gray-600" />
                  </button>
                  <span className="w-6 text-center font-nunito font-700 text-gray-800 text-sm">{quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(productId, quantity + 1)}
                    className="w-7 h-7 bg-white rounded-lg border border-gray-200 flex items-center justify-center hover:bg-success-50 hover:border-success-200 transition-colors"
                  >
                    <Plus size={12} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => removeFromCart(productId)}
                    className="w-7 h-7 flex items-center justify-center text-danger-400 hover:text-danger-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartWithDetails.length > 0 && (
          <div className="p-5 border-t border-gray-100 space-y-3">
            {needsApproval && (
              <div className="flex items-center gap-2 p-3 bg-accent-50 rounded-2xl border border-accent-200">
                <AlertCircle size={16} className="text-accent-600 flex-shrink-0" />
                <p className="text-xs font-inter text-accent-700">
                  Ce montant dépasse ta limite de dépense ({spendingLimit}€). Une approbation parentale sera nécessaire.
                </p>
              </div>
            )}

            {confirming ? (
              <div className="space-y-2">
                <p className="text-center text-sm font-nunito font-600 text-gray-700">
                  Confirmer l'achat de <span className="text-primary-600 font-800">{total.toFixed(2)}€</span> ?
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" fullWidth onClick={() => setConfirming(false)}>
                    Annuler
                  </Button>
                  <Button variant="success" fullWidth onClick={handleConfirm}>
                    <CheckCircle size={16} /> Confirmer
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-nunito font-700 text-gray-700">Total</span>
                  <span className="text-2xl font-nunito font-900 text-gray-800">{total.toFixed(2)}€</span>
                </div>
                <Button
                  fullWidth
                  size="lg"
                  variant={canAfford ? 'primary' : 'ghost'}
                  onClick={handleCheckout}
                  disabled={!canAfford && !needsApproval}
                  className={!canAfford ? 'opacity-60' : ''}
                >
                  {!canAfford
                    ? `💸 Solde insuffisant (manque ${(total - balance).toFixed(2)}€)`
                    : needsApproval
                    ? '🙋 Demander à mes parents'
                    : '🛍️ Acheter maintenant'}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
