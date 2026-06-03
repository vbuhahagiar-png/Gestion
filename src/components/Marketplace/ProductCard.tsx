import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import type { Product } from '../../types';
import { useStore } from '../../store/useStore';
import { Button } from '../UI/Button';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { currentUser, cart, addToCart, toggleWishlist, addToast, setShowCart } = useStore();
  const balance = currentUser?.balance || 0;
  const canAfford = balance >= product.price;
  const inCart = cart.some((item) => item.productId === product.id);
  const inWishlist = currentUser?.wishlist.includes(product.id) || false;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product.id);
    addToast(`${product.emoji} ${product.name} ajouté au panier !`, 'success');
    setShowCart(true);
  };

  const handleWishlist = () => {
    if (!currentUser) return;
    toggleWishlist(currentUser.id, product.id);
    addToast(
      inWishlist ? 'Retiré des favoris' : `${product.emoji} Ajouté aux favoris !`,
      inWishlist ? 'info' : 'success'
    );
  };

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center text-3xl flex-shrink-0`}>
          {product.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-nunito font-800 text-gray-800 text-sm">{product.name}</h3>
            {product.featured && (
              <span className="flex items-center gap-0.5 text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full font-nunito font-600">
                <Star size={10} fill="currentColor" /> Vedette
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-inter truncate mt-0.5">{product.description}</p>
          <p className="text-xs text-gray-400 font-inter">{product.category} · {product.ageMin}-{product.ageMax} ans</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-lg font-nunito font-900 ${canAfford ? 'text-gray-800' : 'text-gray-400'}`}>
            {product.price.toFixed(2)}€
          </span>
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-xl transition-colors ${inWishlist ? 'text-secondary-500 bg-secondary-50' : 'text-gray-300 hover:text-secondary-400 hover:bg-secondary-50'}`}
          >
            <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <Button
            size="sm"
            variant={inCart ? 'success' : 'primary'}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {!product.inStock ? 'Rupture' : inCart ? '✓ Panier' : 'Ajouter'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image area */}
      <div className={`relative h-36 bg-gradient-to-br ${product.color} flex items-center justify-center`}>
        <span className="text-5xl animate-float">{product.emoji}</span>
        {product.featured && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-nunito font-700 text-accent-600">
            <Star size={10} fill="currentColor" /> Vedette
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-3xl">
            <span className="bg-white/90 text-gray-700 text-xs font-nunito font-700 px-3 py-1 rounded-full">Rupture de stock</span>
          </div>
        )}
        {!canAfford && product.inStock && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-nunito font-700 px-2 py-0.5 rounded-full">
            Encore {(product.price - balance).toFixed(2)}€
          </div>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${inWishlist ? 'bg-secondary-500 text-white' : 'bg-white/80 text-gray-400 hover:bg-secondary-50 hover:text-secondary-500'}`}
        >
          <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-auto">
          <h3 className="font-nunito font-800 text-gray-800 text-sm leading-snug">{product.name}</h3>
          <p className="text-xs text-gray-400 font-inter mt-1 line-clamp-2">{product.description}</p>
          <p className="text-xs text-gray-300 font-inter mt-1">{product.ageMin}-{product.ageMax} ans</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className={`text-xl font-nunito font-900 ${canAfford ? 'text-gray-800' : 'text-gray-400'}`}>
            {product.price.toFixed(2)}€
          </span>
          <Button
            size="sm"
            variant={inCart ? 'success' : 'primary'}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="text-xs"
          >
            {!product.inStock ? '😢 Indisponible' : inCart ? '✓ Ajouté' : (
              <>
                <ShoppingCart size={14} /> Ajouter
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
