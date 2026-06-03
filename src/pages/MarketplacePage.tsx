import React, { useState, useMemo } from 'react';
import { LayoutGrid, List, Star, ShoppingCart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { marketplaceItems } from '../data/marketplaceItems';
import { ProductGrid } from '../components/Marketplace/ProductGrid';
import { CategoryFilter } from '../components/Marketplace/CategoryFilter';
import { SearchBar } from '../components/Marketplace/SearchBar';
import { Button } from '../components/UI/Button';

export const MarketplacePage: React.FC = () => {
  const { currentUser, viewMode, setViewMode, setShowCart, cart } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [priceMax, setPriceMax] = useState(50);
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'wishlist'>('all');

  const balance = currentUser?.balance || 0;
  const wishlist = currentUser?.wishlist || [];
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const filteredItems = useMemo(() => {
    let items = marketplaceItems;

    // Category filter
    if (category !== 'all') {
      items = items.filter((p) => p.category === category);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Price
    items = items.filter((p) => p.price <= priceMax);

    // Tab
    if (activeTab === 'featured') {
      items = items.filter((p) => p.featured);
    } else if (activeTab === 'wishlist') {
      items = items.filter((p) => wishlist.includes(p.id));
    }

    return items;
  }, [category, search, priceMax, activeTab, wishlist]);

  const featuredItems = marketplaceItems.filter((p) => p.featured);
  const affordableItems = marketplaceItems.filter((p) => p.price <= balance && p.inStock);

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 p-5 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative">
          <h1 className="text-2xl font-nunito font-900 mb-1">🛍️ Boutique PiggyPal</h1>
          <p className="text-white/80 font-inter text-sm">
            {marketplaceItems.length} articles disponibles · Tu peux te permettre {affordableItems.length} articles
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
              <span className="font-nunito font-900 text-lg">{balance.toFixed(2)}€</span>
              <span className="text-white/70 text-xs font-inter">disponibles</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/20 text-white hover:bg-white/30 border-0 relative"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart size={16} />
              Panier
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-400 text-white text-xs font-700 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl">
        {[
          { id: 'all', label: '✨ Tout', count: marketplaceItems.length },
          { id: 'featured', label: '⭐ Vedettes', count: featuredItems.length },
          { id: 'wishlist', label: '❤️ Favoris', count: wishlist.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-nunito font-700 transition-all ${
              activeTab === tab.id ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter selected={category} onSelect={setCategory} />

        <div className="flex items-center gap-3">
          <label className="text-sm font-inter text-gray-500 whitespace-nowrap">
            Max: <span className="font-nunito font-700 text-primary-600">{priceMax}€</span>
          </label>
          <input
            type="range"
            min={1}
            max={50}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary-500"
          />
        </div>
      </div>

      {/* View toggle + results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-inter">
          <span className="font-nunito font-700 text-gray-800">{filteredItems.length}</span> article(s) trouvé(s)
        </p>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Featured carousel (top of all tab) */}
      {activeTab === 'all' && !search && category === 'all' && (
        <div>
          <h2 className="font-nunito font-800 text-gray-800 mb-3 flex items-center gap-2">
            <Star size={18} className="text-accent-500 fill-accent-400" /> Articles vedettes
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {featuredItems.map((product) => (
              <div
                key={product.id}
                className={`flex-shrink-0 w-36 h-36 rounded-2xl bg-gradient-to-br ${product.color} flex flex-col items-center justify-center gap-1 p-3 cursor-pointer hover:shadow-lg transition-all`}
                onClick={() => { setSearch(product.name); }}
              >
                <span className="text-4xl">{product.emoji}</span>
                <p className="text-white font-nunito font-700 text-xs text-center line-clamp-2">{product.name}</p>
                <p className="text-white/90 font-nunito font-900 text-sm">{product.price.toFixed(2)}€</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wishlist empty state */}
      {activeTab === 'wishlist' && wishlist.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="font-nunito font-800 text-gray-700 text-xl mb-2">Aucun favori</h3>
          <p className="text-gray-400 font-inter text-sm">
            Appuie sur le cœur ❤️ sur un article pour le sauvegarder ici.
          </p>
        </div>
      )}

      {/* Products Grid */}
      <ProductGrid products={filteredItems} viewMode={viewMode} />
    </div>
  );
};
