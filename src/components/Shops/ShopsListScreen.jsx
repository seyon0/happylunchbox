import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Clock, MapPin, Search, ArrowRight, Store, Heart, Filter } from 'lucide-react';
export const ShopsListScreen = () => {
  const { shops, selectShop, favouriteShops, toggleFavouriteShop, isLoggedIn } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [minRating, setMinRating] = useState(0);

  const toggleFavourite = (e, shopId) => {
    e.stopPropagation();
    if (!isLoggedIn) return alert('Please log in to save favourites.');
    toggleFavouriteShop(shopId);
  };
  // Extract all unique cuisines
  const cuisines = ['All', ...new Set(shops.map(shop => shop.cuisine).filter(Boolean))];

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shop.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || shop.cuisine === selectedCuisine;
    const matchesRating = parseFloat(shop.rating || 0) >= minRating;
    return matchesSearch && matchesCuisine && matchesRating && shop.isActive;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 pb-28 lg:pb-12">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-ink-900 mb-3 tracking-tight">
          Browse Our Kitchens
        </h1>
        <p className="text-stone-500 font-medium text-sm sm:text-base max-w-xl">
          Discover authentic local home cooks and professional kitchens delivering delicious, healthy lunchboxes straight to your door.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl border border-cream-200 p-5 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search kitchen names or cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-cream-50 border border-transparent text-xs font-medium placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
          />
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-cream-50 border border-transparent rounded-xl px-3 py-2 text-xs font-bold text-stone-600 focus:outline-none focus:bg-white focus:border-brand-500"
          >
            <option value={0}>Any Rating</option>
            <option value={4.5}>4.5+ Stars</option>
            <option value={4.0}>4.0+ Stars</option>
          </select>
        </div>

        {/* Cuisine Tags */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
          {cuisines.map(cuisine => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCuisine === cuisine
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-cream-50 text-stone-600 hover:bg-cream-100'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Kitchens Grid */}
      {filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShops.map(shop => (
            <div
              key={shop.id}
              onClick={() => selectShop(shop.id)}
              className="group cursor-pointer bg-white rounded-[2.5rem] border border-cream-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-300 transition-all duration-500 flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                <img
                  src={shop.bannerUrl || shop.imageUrl}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Favourite Button */}
                <button
                  onClick={(e) => toggleFavourite(e, shop.id)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors z-10"
                >
                  <Heart className={`w-4 h-4 ${favouriteShops?.includes(shop.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>

                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 z-10">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 bg-white p-0.5 shrink-0 shadow-lg">
                    <img
                      src={shop.logoUrl || shop.imageUrl}
                      alt={shop.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-white text-lg tracking-tight drop-shadow-sm">
                      {shop.name}
                    </h3>
                    <p className="text-white/80 text-[11px] font-bold uppercase tracking-wider">
                      {shop.cuisine}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-stone-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
                  {shop.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-cream-100">
                  <div className="flex items-center gap-3 text-xs font-bold text-stone-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-saffron-500 fill-saffron-500" />
                      <span>{shop.rating}</span>
                    </div>
                    <div className="w-1 h-1 bg-stone-300 rounded-full" />
                    <div className="flex items-center gap-1 text-brand-600">
                      <Clock className="w-4 h-4" />
                      <span>{shop.deliveryTime || '30-45m'}</span>
                    </div>
                  </div>

                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-cream-200">
          <Store className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold text-ink-900">No Kitchens Found</h3>
          <p className="text-stone-400 text-xs mt-1">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};
