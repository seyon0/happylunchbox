import React, { useState } from 'react';
import { ChefHat, Utensils, Settings, Bell, WifiOff, PieChart, Banknote } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KitchenLayout = ({ children, activeTab, setActiveTab, isOffline }) => {
  const { user, selectedShopId, setSelectedShopId } = useApp();
  const shopRole = user?.shopRole || 'OWNER';

  const allTabs = [
    { id: 'ORDERS', label: 'Orders', icon: ChefHat },
    { id: 'MENU', label: 'Menu', icon: Utensils },
    { id: 'ANALYTICS', label: 'Analytics', icon: PieChart },
    { id: 'FINANCE', label: 'Finance', icon: Banknote },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  const tabs = shopRole === 'STAFF' 
    ? allTabs.filter(t => t.id === 'ORDERS' || t.id === 'MENU')
    : allTabs;

  const userShops = user?.shops || [
    { id: 'shop-1', name: 'Jaffna Roots' },
    { id: 'shop-2', name: 'Jaffna Express' }
  ];

  return (
    <div className="flex flex-col h-screen bg-ink-950 text-white overflow-hidden">
      {/* Top Header */}
      <header className="bg-ink-900 border-b border-ink-800 p-4 flex items-center justify-between shadow-dark-elevated z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/50 shadow-glow">
            <ChefHat className="w-5 h-5 text-brand-500" />
          </div>
          <div>
            <select 
              className="bg-transparent text-lg font-black tracking-tight leading-tight focus:outline-none appearance-none cursor-pointer"
              value={selectedShopId || userShops[0]?.id}
              onChange={(e) => setSelectedShopId(e.target.value)}
            >
              {userShops.map(s => (
                <option key={s.id} value={s.id} className="bg-ink-900 text-white text-base">
                  {s.name}
                </option>
              ))}
            </select>
            <p className="text-xs font-bold text-ink-400">VendorPanel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isOffline && (
            <div className="flex items-center gap-1 bg-red-500/20 text-red-500 px-3 py-1.5 rounded-full text-xs font-bold border border-red-500/30 animate-pulse">
              <WifiOff className="w-3.5 h-3.5" /> Offline
            </div>
          )}
          <button className="relative w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center hover:bg-ink-700 transition-colors">
            <Bell className="w-5 h-5 text-ink-300" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-500 rounded-full border-2 border-ink-800"></span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-0">
        {children}
      </main>

      {/* Mobile-First Bottom Nav for Kitchens */}
      <nav className="bg-ink-900 border-t border-ink-800 pb-safe shrink-0 z-10">
        <div className="flex items-center justify-around p-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-20 h-16 rounded-2xl transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-brand-500 text-white shadow-glow' 
                  : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800'
              }`}
            >
              <tab.icon className={`w-6 h-6 mb-1 ${activeTab === tab.id ? 'animate-bounce-in' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
