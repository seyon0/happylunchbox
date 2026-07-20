import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { 
  Sparkles, 
  Trash2, 
  CheckCircle2,
  Flame, 
  ArrowRight,
  RefreshCw,
  Soup,
  Utensils,
  Coffee,
  PieChart,
  ChevronRight,
  X,
  Save,
  Bookmark
} from 'lucide-react';
import { SafeImage } from '../Common/SafeImage';

export const LunchboxBuilder = () => {
  const { 
    lunchbox, 
    addToSlot, 
    removeFromSlot,
    clearLunchbox, 
    filledCount, 
    totalPrice, 
    totalCalories,
    isLunchboxComplete,
    shopMenuItems,
    navigateTo,
    applyCombo,
    selectedShopId,
    shops,
    saveLunchbox
  } = useApp();

  const [activeTab, setActiveTab] = useState('starter');
  const [portionSize, setPortionSize] = useState('regular');
  
  // Save Lunchbox Modal State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [customBoxName, setCustomBoxName] = useState('');
  // Touch drag state
  const [draggingItem, setDraggingItem] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const dragItemRef = useRef(null);

  const finalPrice = portionSize === 'large' ? totalPrice * 1.5 : totalPrice;
  const finalCalories = portionSize === 'large' ? Math.round(totalCalories * 1.5) : totalCalories;

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'starter': return Soup;
      case 'main': return Utensils;
      case 'side': return PieChart;
      case 'drink': return Coffee;
      default: return Utensils;
    }
  };

  // Desktop drag-and-drop handlers
  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e, catId) => {
    e.preventDefault();
    setDragOver(catId);
  };

  const handleDrop = (e, targetCatId) => {
    e.preventDefault();
    setDragOver(null);
    if (!draggingItem) return;
    if (draggingItem.category === targetCatId) {
      addToSlot(draggingItem);
    }
    setDraggingItem(null);
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
    setDragOver(null);
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e, item) => {
    dragItemRef.current = item;
    setDraggingItem(item);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleTouchEnd = (e) => {
    if (!dragItemRef.current) return;
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = el?.closest('[data-drop-category]');
    if (dropZone) {
      const targetCat = dropZone.getAttribute('data-drop-category');
      if (dragItemRef.current.category === targetCat) {
        addToSlot(dragItemRef.current);
      }
    }
    e.currentTarget.style.opacity = '1';
    dragItemRef.current = null;
    setDraggingItem(null);
    setDragOver(null);
  };

  const activeShop = shops.find(s => s.id === selectedShopId);
  const currentShelfItems = shopMenuItems.filter(item => item.category === activeTab);

  if (!selectedShopId || !activeShop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <Utensils className="w-16 h-16 text-stone-300 mx-auto" />
        <h2 className="font-heading text-3xl font-extrabold text-ink-900">Choose a Kitchen First</h2>
        <p className="text-stone-500 font-medium">You need to select a kitchen before building your lunchbox.</p>
        <button
          onClick={() => navigateTo('shops')}
          className="px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold text-sm mx-auto block"
        >
          Browse Kitchens
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6 pb-32 lg:pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
            <span>Tap or Drag to Build Your Tiffin</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
            Build Your {activeShop.name} Box
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm font-medium mt-1">
            Pick <strong className="text-brand-600">one item</strong> per category — Starter, Main, Side, Drink.
          </p>
        </div>

        {filledCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            <button
              onClick={clearLunchbox}
              className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-cream-100 hover:bg-red-50 text-stone-600 hover:text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Box</span>
            </button>
          </div>
        )}
      </div>

      {/* Curated Presets */}
      {filledCount === 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <div className="shrink-0 flex items-center justify-center px-4 rounded-2xl bg-ink-900 text-white font-heading font-extrabold text-xs">
            Quick Presets
          </div>
          <button onClick={() => applyCombo('combo-1')} className="shrink-0 px-4 py-2.5 rounded-2xl border border-brand-200 bg-brand-50 text-brand-700 font-bold text-xs hover:bg-brand-100 transition-colors">
            👨‍🍳 Chef's Special
          </button>
          <button onClick={() => applyCombo('combo-3')} className="shrink-0 px-4 py-2.5 rounded-2xl border border-fresh-200 bg-fresh-50 text-fresh-700 font-bold text-xs hover:bg-fresh-100 transition-colors">
            🥗 Healthy Diet Box
          </button>
          <button onClick={() => applyCombo('combo-4')} className="shrink-0 px-4 py-2.5 rounded-2xl border border-saffron-200 bg-saffron-50 text-saffron-700 font-bold text-xs hover:bg-saffron-100 transition-colors">
            🕉️ Pure Jain Box
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Tiffin Tray — the 4 drop zones */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="bg-gradient-to-b from-stone-900 to-ink-900 rounded-3xl p-5 sm:p-6 text-white shadow-card-elevated border border-stone-800">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-500 animate-pulse"></div>
                <h3 className="font-heading text-base font-extrabold tracking-tight">Your Tiffin</h3>
              </div>
              <span className="text-xs font-bold text-saffron-400 bg-saffron-500/10 px-3 py-1 rounded-full border border-saffron-500/20">
                {filledCount}/4 Slots
              </span>
            </div>

            {/* Portion Size Toggle */}
            <div className="flex bg-white/5 p-1 rounded-xl mb-4 border border-white/10">
              <button 
                onClick={() => setPortionSize('regular')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${portionSize === 'regular' ? 'bg-white text-ink-900 shadow-sm' : 'text-white/60 hover:text-white'}`}
              >
                Regular
              </button>
              <button 
                onClick={() => setPortionSize('large')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${portionSize === 'large' ? 'bg-brand-500 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
              >
                Large (+50%)
              </button>
            </div>

            {/* 4 Category Drop Zones */}
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const item = (lunchbox[cat.id] || [])[0]; // max 1
                const Icon = getCategoryIcon(cat.id);
                const isDropTarget = dragOver === cat.id;

                return (
                  <div
                    key={cat.id}
                    data-drop-category={cat.id}
                    onDragOver={(e) => handleDragOver(e, cat.id)}
                    onDrop={(e) => handleDrop(e, cat.id)}
                    onDragLeave={() => setDragOver(null)}
                    className={`relative rounded-2xl p-3 min-h-[130px] flex flex-col justify-between transition-all border-2 ${
                      isDropTarget
                        ? 'border-saffron-400 bg-saffron-500/10 scale-[1.02]'
                        : item
                          ? 'bg-white/10 border-saffron-500/50 shadow-md'
                          : 'bg-white/5 border-dashed border-white/20 hover:border-saffron-400/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-saffron-300">
                        {cat.name}
                      </span>
                      <Icon className="w-3.5 h-3.5 text-white/40" />
                    </div>

                    {item ? (
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 border border-white/10">
                          <SafeImage src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-lg object-cover shrink-0" placeholderClass="w-8 h-8 rounded-lg" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-white truncate leading-tight">{item.name}</p>
                            <p className="text-[10px] text-saffron-400 font-heading font-bold">£{item.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => removeFromSlot(cat.id, 0)}
                            className="text-white/50 hover:text-red-400 transition-colors shrink-0 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <CheckCircle2 className="w-3 h-3 text-fresh-400" />
                          <span className="text-[10px] text-fresh-400 font-bold">Selected</span>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto text-center py-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/30 mb-1">
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-semibold text-white/50">
                          {isDropTarget ? 'Drop here!' : `Pick ${cat.name}`}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Macros Footer */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-stone-300">
                <Flame className="w-4 h-4 text-saffron-500 animate-pulse" />
                <span>{finalCalories} kcal</span>
              </div>
              <div className="text-right">
                <strong className="text-saffron-400 font-heading font-extrabold text-lg">£{finalPrice.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Mobile hint */}
          <div className="lg:hidden bg-saffron-50 border border-saffron-200 rounded-2xl p-3 flex items-center gap-2 text-xs text-saffron-800 font-medium">
            <span className="text-base">👆</span>
            <span>Tap <strong>"Add to Box"</strong> or hold and drag items into the tiffin slots above</span>
          </div>
        </div>

        {/* Right: Menu Item Shelf */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = getCategoryIcon(cat.id);
              const isActive = activeTab === cat.id;
              const hasItem = (lunchbox[cat.id] || []).length > 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-brand-500 text-white shadow-glow' 
                      : 'bg-white text-stone-600 hover:bg-cream-200 border border-cream-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                  {hasItem && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-fresh-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Items */}
          <div className="space-y-3">
            {currentShelfItems.map((item) => {
              const isSelected = (lunchbox[item.category] || [])[0]?.id === item.id;

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, item)}
                  onTouchEnd={handleTouchEnd}
                  className={`bg-white rounded-3xl border p-4 flex items-center gap-3 sm:gap-4 transition-all cursor-grab active:cursor-grabbing hover:shadow-card-elevated ${
                    isSelected ? 'border-brand-500 bg-brand-50/30 shadow-md' : 'border-cream-200 hover:border-brand-200'
                  }`}
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0">
                    <SafeImage 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      placeholderClass="w-full h-full"
                    />
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                      item.dietType === 'veg' ? 'bg-fresh-600' : item.dietType === 'jain' ? 'bg-saffron-500' : 'bg-red-700'
                    }`}>
                      {item.dietType.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 text-left min-w-0">
                    <div className="flex items-center justify-start gap-2 flex-wrap">
                      <h4 className="font-heading font-extrabold text-sm sm:text-base text-ink-900 truncate">{item.name}</h4>
                      <span className="text-[10px] font-semibold text-stone-400 px-2 py-0.5 rounded-full bg-stone-100 shrink-0">
                        {item.spiceLevel}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 font-medium">{item.description}</p>
                    <div className="flex items-center gap-3 text-xs pt-0.5">
                      <span className="font-heading font-extrabold text-brand-600 text-sm">£{item.price.toFixed(2)}</span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-500 font-medium">{item.calories} kcal</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 justify-end">
                    {isSelected ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-fresh-600 text-white text-xs font-bold shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In Box</span>
                        </div>
                        <button
                          onClick={() => removeFromSlot(item.category, 0)}
                          className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToSlot(item)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-heading font-bold text-xs transition-all flex items-center justify-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white shadow-md hover:shadow-glow"
                      >
                        <span>Add to Box</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Action Card */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card-elevated space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Macros grid — 2-col on mobile */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-4 text-ink-900">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Total</span>
                  <span className="font-heading font-extrabold text-xl sm:text-2xl text-brand-600">£{finalPrice.toFixed(2)}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">kcal</span>
                  <span className="text-sm font-bold text-stone-700">{finalCalories}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Slots</span>
                  <span className="text-sm font-bold text-stone-700">{filledCount}/4</span>
                </div>
              </div>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                <button
                  disabled={!isLunchboxComplete}
                  onClick={() => setShowSaveModal(true)}
                  className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl font-heading font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-sm border-2 ${
                    isLunchboxComplete
                      ? 'border-brand-500 text-brand-600 bg-white hover:bg-brand-50'
                      : 'border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Save for Later</span>
                </button>
                <button
                  disabled={!isLunchboxComplete}
                  onClick={() => navigateTo('calendar')}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl font-heading font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isLunchboxComplete
                      ? 'bg-gradient-to-r from-brand-500 to-saffron-500 text-white hover:opacity-95 shadow-glow'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <span>{isLunchboxComplete ? 'Choose Delivery Date' : 'Add Items to Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Save Lunchbox Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h4 className="font-heading font-extrabold text-xl text-ink-900">Save Custom Box</h4>
              <button onClick={() => setShowSaveModal(false)} className="p-1 text-stone-400 hover:text-ink-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">Give your custom lunchbox a name:</label>
              <input 
                type="text" 
                value={customBoxName}
                onChange={e => setCustomBoxName(e.target.value)}
                placeholder="e.g. My Workout Monday Box" 
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm font-medium focus:bg-white focus:border-brand-500 focus:outline-none transition-colors" 
              />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-200 text-stone-600 hover:bg-stone-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={!customBoxName.trim()}
                onClick={() => {
                  saveLunchbox(customBoxName, lunchbox, filledCount);
                  setShowSaveModal(false);
                  setCustomBoxName('');
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-heading font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
