import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Sparkles, Calendar, ShoppingBag, Utensils, Heart } from 'lucide-react';

export const BottomMobileNav = () => {
  const { currentScreen, navigateTo, filledCount, isAdminMode } = useApp();

  if (isAdminMode) return null; // Admin has its own sidebar / tab navigation

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'builder', label: 'Builder', icon: Sparkles, badge: filledCount > 0 ? filledCount : null },
    { id: 'favourites', label: 'Favourites', icon: Heart },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'bookings', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto bg-ink-900/95 backdrop-blur-xl border border-white/10 rounded-full px-3 py-2 shadow-2xl flex items-center justify-around gap-1 max-w-md w-full text-white">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          const isBuilder = tab.id === 'builder';

          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? isBuilder
                    ? 'bg-gradient-to-r from-brand-500 to-saffron-500 text-white shadow-glow'
                    : 'bg-brand-500 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isBuilder && !isActive ? 'text-saffron-400' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-saffron-500 text-ink-900 font-extrabold text-[9px] flex items-center justify-center border border-ink-900 shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>

              {isActive && (
                <span className="font-heading tracking-tight animate-fade-in">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
