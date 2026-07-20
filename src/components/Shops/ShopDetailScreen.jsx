import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import {
  Star, Clock, MapPin, ArrowRight, ChefHat, Search,
  Sparkles, CheckCircle2, X, Plus, Heart
} from 'lucide-react';
import { SafeImage } from '../Common/SafeImage';

export const ShopDetailScreen = () => {
  const { shops, selectedShopId, shopMenuItems, addToSlot, removeFromSlot,
          lunchbox, navigateTo, filledCount, isLoggedIn,
          favouriteShops, toggleFavouriteShop } = useApp();

  const shop = shops.find(s => s.id === selectedShopId);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <ChefHat className="w-16 h-16 text-stone-300 mx-auto" />
        <h2 className="font-heading text-2xl font-extrabold text-ink-900">Kitchen not found</h2>
        <button
          onClick={() => navigateTo('shops')}
          className="px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold text-sm"
        >
          Browse Kitchens
        </button>
      </div>
    );
  }

  const filteredItems = shopMenuItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Categories that have items in this shop
  const activeCategories = CATEGORIES.filter(c =>
    shopMenuItems.some(i => i.category === c.id)
  );

  return (
    <div className="max-w-7xl mx-auto pb-28 lg:pb-12">

      {/* Shop Banner */}
      <div className="relative h-52 sm:h-72 w-full overflow-hidden bg-stone-200">
        <SafeImage
          src={shop.bannerUrl}
          alt={shop.name}
          className="w-full h-full object-cover"
          placeholderClass="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Favorite Button */}
        <button 
          onClick={() => {
            if (!isLoggedIn) return alert('Please log in to save favourites.');
            toggleFavouriteShop(shop.id);
          }}
          className="absolute top-4 right-4 sm:top-6 sm:right-8 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors z-10"
        >
          <Heart className={`w-5 h-5 ${favouriteShops?.includes(shop.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>

        {/* Shop identity overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-5 flex items-end gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
            <SafeImage
              src={shop.logoUrl}
              alt={shop.name}
              className="w-full h-full object-cover"
              placeholderClass="w-full h-full"
            />
          </div>
          <div className="text-white pb-1 min-w-0">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold leading-tight truncate">
              {shop.name}
            </h1>
            <p className="text-white/80 text-sm font-medium">{shop.cuisineType}</p>
          </div>
        </div>
      </div>

      {/* Shop Meta Bar */}
      <div className="bg-white border-b border-cream-200 px-4 sm:px-8 py-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium text-stone-500">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-saffron-500 fill-saffron-500" />
            <span className="font-extrabold text-ink-900">{shop.rating}</span>
            <span>({shop.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>{shop.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-saffron-500" />
            <span>{shop.deliveryArea}</span>
          </div>
          <div className="ml-auto">
            <span className="text-stone-400">Min. order </span>
            <span className="font-extrabold text-ink-900">£{shop.minOrder.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 space-y-6">

        {/* Description */}
        <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-sm">
          <p className="text-sm text-stone-600 font-medium leading-relaxed">{shop.description}</p>
        </div>

        {/* CTA Banner */}
        {filledCount === 0 && (
          <div className="bg-gradient-to-r from-brand-500 to-saffron-500 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-brand-500/20">
            <div className="text-white text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-saffron-200" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Ready to order?</span>
              </div>
              <p className="font-heading font-extrabold text-lg leading-tight">
                Build your Lunchbox from<br className="hidden sm:block" /> {shop.name}
              </p>
            </div>
            <button
              onClick={() => {
                if (!isLoggedIn) return navigateTo('customer-auth');
                navigateTo('builder');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-brand-700 font-heading font-extrabold text-sm shadow-lg hover:bg-saffron-50 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Open Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Lunchbox mini-summary if items selected */}
        {filledCount > 0 && (
          <div className="bg-ink-900 text-white rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-heading font-extrabold text-lg shrink-0">
                {filledCount}
              </div>
              <div>
                <p className="font-heading font-extrabold text-sm">Items in your box</p>
                <p className="text-[11px] text-white/60 font-medium">From {shop.name}</p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('builder')}
              className="px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all"
            >
              <span>View Box</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Menu Section */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-extrabold text-ink-900">Menu</h2>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-cream-200 text-xs font-medium placeholder:text-stone-400 focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === 'all'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-white text-stone-600 border border-cream-200 hover:bg-cream-50'
              }`}
            >
              All Items
            </button>
            {activeCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white text-stone-600 border border-cream-200 hover:bg-cream-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => {
              const isSelected = (lunchbox[item.category] || [])[0]?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl border overflow-hidden shadow-sm transition-all flex flex-col ${
                    isSelected ? 'border-brand-500 shadow-md' : 'border-cream-200 hover:border-brand-200'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-36 w-full overflow-hidden">
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      placeholderClass="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        item.dietType === 'veg' ? 'bg-fresh-600' :
                        item.dietType === 'jain' ? 'bg-saffron-500' : 'bg-red-700'
                      }`}>
                        {item.dietType.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-3 right-3">
                      <span className="text-[10px] text-saffron-300 font-bold uppercase tracking-wide block">
                        {item.category}
                      </span>
                      <h4 className="font-heading font-extrabold text-sm text-white truncate">
                        {item.name}
                      </h4>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <p className="text-xs text-stone-500 font-medium line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-heading font-extrabold text-xl text-brand-600">
                          £{item.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-stone-400 ml-1">{item.calories} kcal</span>
                      </div>
                      {isSelected ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-fresh-600 text-white text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Box</span>
                          </div>
                          <button
                            onClick={() => removeFromSlot(item.category, 0)}
                            className="p-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (!isLoggedIn) return navigateTo('customer-auth');
                            addToSlot(item);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-10 space-y-2">
              <ChefHat className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-stone-400 text-sm font-medium">No dishes match your search.</p>
            </div>
          )}
        </div>

        {/* Proceed to Builder */}
        {filledCount > 0 && (
          <div className="sticky bottom-24 lg:bottom-6">
            <button
              onClick={() => {
                if (!isLoggedIn) return navigateTo('customer-auth');
                navigateTo('builder');
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-saffron-500 text-white font-heading font-extrabold text-base shadow-2xl shadow-brand-500/30 flex items-center justify-center gap-2 transition-all hover:opacity-95"
            >
              <span>Go to Lunchbox Builder ({filledCount} items)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
        {/* Reviews & Ratings Section */}
        <div className="pt-8 border-t border-cream-200 space-y-6">
          <h3 className="font-heading text-xl font-extrabold text-ink-900">Customer Reviews</h3>
          
          {isLoggedIn ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm">
              <h4 className="font-bold text-sm text-ink-900 mb-4">Write a Review & Rate</h4>
              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map(star => (
                  <button key={star} className="text-stone-300 hover:text-saffron-500 transition-colors">
                    <Star className="w-7 h-7 fill-current" />
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full bg-stone-50 border border-cream-200 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-brand-500 transition-colors resize-none"
                rows="4"
                placeholder="Share your experience with the kitchen and the menu..."
              ></textarea>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => alert("Review submitted successfully!")}
                  className="px-6 py-2.5 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Post Review
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-3xl p-8 border border-cream-200 text-center space-y-4">
              <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-stone-500 text-sm font-medium max-w-sm mx-auto">
                You must be logged into your account to rate the restaurant and write a review about the kitchen or menu.
              </p>
              <button 
                onClick={() => navigateTo('customer-auth')}
                className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                Sign In to Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
