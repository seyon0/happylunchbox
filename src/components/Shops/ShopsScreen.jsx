import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Clock, Star, ChefHat, ArrowRight, Sparkles } from 'lucide-react';

export const ShopsScreen = () => {
  const { shops, selectShop } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');

  const cuisines = ['all', ...new Set(shops.map(s => s.cuisineType))];

  const filtered = shops.filter(s => {
    if (!s.isActive) return false;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cuisineType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.deliveryArea.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = cuisineFilter === 'all' || s.cuisineType === cuisineFilter;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8 pb-28 lg:pb-12">

      {/* Header */}
      <div className="bg-gradient-to-br from-ink-900 via-stone-900 to-ink-900 text-white p-6 sm:p-10 rounded-3xl shadow-card-elevated overflow-hidden relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-saffron-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-saffron-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Homestyle Kitchen Marketplace</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Browse All Kitchens
          </h1>
          <p className="text-white/70 text-sm font-medium max-w-lg">
            Pick a kitchen, explore their menu, and build your perfect lunchbox — freshly cooked and delivered to your door.
          </p>

          {/* Search */}
          <div className="relative mt-6 max-w-md">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search kitchens, cuisine, area..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-xs font-medium placeholder:text-white/40 focus:outline-none focus:border-saffron-400 focus:bg-white/15 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Cuisine Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {cuisines.map(c => (
          <button
            key={c}
            onClick={() => setCuisineFilter(c)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              cuisineFilter === c
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white text-stone-600 border border-cream-200 hover:bg-cream-50'
            }`}
          >
            {c === 'all' ? '🍽️ All Cuisines' : c}
          </button>
        ))}
      </div>

      {/* Shop Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <ChefHat className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-heading font-extrabold text-xl text-ink-900">No kitchens found</h3>
          <p className="text-stone-400 text-sm font-medium">Try a different search or cuisine filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(shop => (
            <button
              key={shop.id}
              onClick={() => selectShop(shop.id)}
              className="group bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm hover:shadow-card-elevated hover:border-brand-300 transition-all duration-300 text-left flex flex-col"
            >
              {/* Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                <img
                  src={shop.bannerUrl}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Logo */}
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-white">
                  <img
                    src={shop.logoUrl}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>

                {/* Rating badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur shadow-sm">
                  <Star className="w-3 h-3 text-saffron-500 fill-saffron-500" />
                  <span className="text-xs font-extrabold text-ink-900">{shop.rating}</span>
                  <span className="text-[10px] text-stone-400">({shop.reviewCount})</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-heading font-extrabold text-lg text-ink-900 group-hover:text-brand-600 transition-colors leading-tight">
                      {shop.name}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-brand-600 mb-2">{shop.cuisineType}</p>
                  <p className="text-xs text-stone-500 font-medium line-clamp-2 leading-relaxed">
                    {shop.tagline}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-cream-100">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span>{shop.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-saffron-500 shrink-0" />
                    <span className="truncate">{shop.deliveryArea}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-stone-400 font-medium">
                    Min. order <strong className="text-ink-900">£{shop.minOrder.toFixed(2)}</strong>
                  </span>
                  <div className="flex items-center gap-1.5 text-brand-600 font-bold text-xs group-hover:gap-2.5 transition-all">
                    <span>Order Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
