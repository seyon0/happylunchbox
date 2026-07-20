import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Star, Utensils, ChefHat, ShoppingBag } from 'lucide-react';

export const FavouritesScreen = () => {
  const {
    favouriteShops,
    favouriteItems,
    shops,
    menuItems,
    toggleFavouriteShop,
    toggleFavouriteItem,
    selectShop,
    addToSlot,
    navigateTo
  } = useApp();

  const [activeTab, setActiveTab] = useState('kitchens');

  const favoriteKitchens = shops.filter(shop => favouriteShops.includes(shop.id));
  const favoriteDishes = menuItems.filter(item => favouriteItems.includes(item.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6 pb-28 lg:pb-12">
      <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-ink-900 tracking-tight">My Favourites</h2>
          <p className="text-stone-500 text-sm font-medium mt-1">Your go-to kitchens and loved dishes.</p>
        </div>
      </div>

      <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('kitchens')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'kitchens'
              ? 'bg-brand-500 text-white shadow-md'
              : 'bg-white text-stone-600 border border-cream-200 hover:border-brand-200 hover:text-brand-600'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          Kitchens ({favoriteKitchens.length})
        </button>
        <button
          onClick={() => setActiveTab('dishes')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'dishes'
              ? 'bg-brand-500 text-white shadow-md'
              : 'bg-white text-stone-600 border border-cream-200 hover:border-brand-200 hover:text-brand-600'
          }`}
        >
          <Utensils className="w-4 h-4" />
          Dishes ({favoriteDishes.length})
        </button>
      </div>

      <div className="animate-fade-in">
        {activeTab === 'kitchens' && (
          favoriteKitchens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteKitchens.map(shop => (
                <div key={shop.id} className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm hover:shadow-card-elevated transition-all flex flex-col group relative">
                  <button 
                    onClick={() => toggleFavouriteShop(shop.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-red-500 hover:scale-110 transition-transform z-10"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                  <div className="h-32 bg-stone-100 relative">
                    <img src={shop.bannerUrl} alt={shop.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex flex-col flex-1 gap-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading font-extrabold text-lg text-ink-900">{shop.name}</h3>
                        <div className="flex items-center gap-1 text-xs font-extrabold text-ink-900 bg-saffron-100 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 text-saffron-500 fill-saffron-500" />
                          {shop.rating}
                        </div>
                      </div>
                      <p className="text-xs text-stone-500">{shop.cuisineType}</p>
                    </div>
                    <button
                      onClick={() => selectShop(shop.id)}
                      className="mt-auto w-full py-2.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white font-bold text-xs transition-colors flex justify-center items-center gap-1.5"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      View Kitchen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-cream-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-cream-100 text-stone-300 mx-auto flex items-center justify-center">
                <ChefHat className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-xl text-ink-900">No favorite kitchens yet</h4>
                <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">Explore our diverse range of home kitchens and save your favorites here.</p>
              </div>
              <button onClick={() => navigateTo('shops')} className="px-6 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-bold shadow-sm">
                Explore Kitchens
              </button>
            </div>
          )
        )}

        {activeTab === 'dishes' && (
          favoriteDishes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteDishes.map(item => (
                <div key={item.id} className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm hover:shadow-card-elevated transition-all flex items-center gap-3 p-3 relative">
                  <button 
                    onClick={() => toggleFavouriteItem(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-red-500 hover:scale-110 transition-transform z-10"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="font-heading font-extrabold text-sm text-ink-900 truncate">{item.name}</h4>
                    <p className="text-xs text-stone-500 capitalize">{item.category}</p>
                    <p className="text-sm font-bold text-brand-600 mt-1 mb-2">£{item.price.toFixed(2)}</p>
                    <button
                      onClick={() => { addToSlot(item); navigateTo('builder'); }}
                      className="w-full py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-brand-500 hover:text-white font-bold text-[11px] transition-colors flex justify-center items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Add to Builder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-cream-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-cream-100 text-stone-300 mx-auto flex items-center justify-center">
                <Utensils className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-xl text-ink-900">No favorite dishes yet</h4>
                <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">Found a dish you love? Tap the heart icon on any menu item to save it here.</p>
              </div>
              <button onClick={() => navigateTo('menu')} className="px-6 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-bold shadow-sm">
                Browse Full Menu
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
