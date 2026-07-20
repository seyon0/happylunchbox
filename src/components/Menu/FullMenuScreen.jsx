import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { Search, Utensils, Plus, Check } from 'lucide-react';
import { SafeImage } from '../Common/SafeImage';

export const FullMenuScreen = () => {
  const { menuItems, addToSlot, removeFromSlot, lunchbox, navigateTo, shops } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [restaurantFilter, setRestaurantFilter] = useState('all');

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = dietFilter === 'all' || item.dietType === dietFilter;
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesRest = restaurantFilter === 'all' || item.shopId === restaurantFilter || item.shop === restaurantFilter;
    return matchesSearch && matchesDiet && matchesCat && matchesRest;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6 pb-28 lg:pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold mb-2">
            <Utensils className="w-3.5 h-3.5" />
            <span>Global Menu View</span>
          </div>
          <h2 className="font-heading text-3xl font-extrabold text-ink-900 tracking-tight">
            Explore All Authentic Recipes
          </h2>
          <p className="text-stone-500 text-sm font-medium mt-1">
            Browse the full repertoire of authentic recipes across all kitchens.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dish name, dal, chicken, soup..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-100 border border-cream-200 text-xs font-medium text-ink-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">Kitchen:</span>
          <button
            onClick={() => setRestaurantFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              restaurantFilter === 'all' 
                ? 'bg-ink-900 text-white shadow-sm' 
                : 'bg-white text-stone-600 border border-cream-200 hover:bg-cream-100'
            }`}
          >
            All Kitchens
          </button>
          {shops.filter(s => s.isActive || s.is_operating).map((shop) => (
            <button
              key={shop.id}
              onClick={() => setRestaurantFilter(shop.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                restaurantFilter === shop.id 
                  ? 'bg-ink-900 text-white shadow-sm' 
                  : 'bg-white text-stone-600 border border-cream-200 hover:bg-cream-100'
              }`}
            >
              {shop.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">Diet:</span>
          {[
            { id: 'all', label: 'All Dishes' },
            { id: 'veg', label: '🌱 Pure Veg' },
            { id: 'non-veg', label: '🍗 Non-Veg' },
            { id: 'jain', label: '✨ Jain Special' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDietFilter(d.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                dietFilter === d.id 
                  ? 'bg-ink-900 text-white shadow-sm' 
                  : 'bg-white text-stone-600 border border-cream-200 hover:bg-cream-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">Course:</span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === 'all' 
                ? 'bg-brand-500 text-white shadow-glow' 
                : 'bg-white text-stone-600 border border-cream-200 hover:bg-cream-100'
            }`}
          >
            All Courses
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat.id 
                  ? 'bg-brand-500 text-white shadow-glow' 
                  : 'bg-white text-stone-600 border border-cream-200 hover:bg-cream-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const countInBox = (lunchbox[item.category] || []).filter(i => i.id === item.id).length;

          return (
            <div 
              key={item.id}
              className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-card-elevated hover:border-brand-300 transition-all group flex flex-col justify-between"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <SafeImage 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  placeholderClass="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm ${
                    item.dietType === 'veg' ? 'bg-fresh-600' : item.dietType === 'jain' ? 'bg-saffron-500' : 'bg-red-700'
                  }`}>
                    {item.dietType.toUpperCase()}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] text-saffron-300 font-bold uppercase tracking-wider block">{item.category}</span>
                  <h4 className="font-heading font-extrabold text-lg text-white truncate">{item.name}</h4>
                  <p className="text-[10px] text-white/80 mt-0.5 truncate">
                    by {shops.find(s => s.id === (item.shopId || item.shop))?.name || 'Unknown Kitchen'}
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-500 line-clamp-2 font-medium leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-cream-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Price</span>
                    <span className="font-heading font-extrabold text-xl text-brand-600">£{item.price.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => {
                      addToSlot(item);
                      navigateTo('builder');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{countInBox > 0 ? `Add Another (${countInBox})` : 'Add to Builder'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
