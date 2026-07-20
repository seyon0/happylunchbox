import React from 'react';
import { ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { menuAPI } from '../../services/api';

export const KitchenMenuManager = ({ items, fetchDashboardData }) => {

  const handleToggle = async (item) => {
    try {
      // Optimistically we'd update state, but here we just call API and refresh for safety
      await menuAPI.updateItem(item.id, { isAvailable: !item.isAvailable });
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to toggle item availability', err);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24 h-full">
      <div className="bg-ink-900 border border-ink-800 rounded-3xl p-5 shadow-dark-elevated">
        <h2 className="text-xl font-black text-white mb-1">Menu Availability</h2>
        <p className="text-xs text-ink-400 font-medium mb-6">Quickly mark items as out of stock if you run out of ingredients.</p>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-ink-950 border border-ink-800 rounded-2xl">
              <div>
                <p className={`text-base font-bold transition-colors ${item.isAvailable ? 'text-white' : 'text-ink-500 line-through'}`}>{item.name}</p>
                <p className="text-xs font-bold text-brand-500 mt-0.5">£{item.price.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => handleToggle(item)}
                className={`p-2 transition-colors ${item.isAvailable ? 'text-brand-500 hover:text-brand-400' : 'text-ink-600 hover:text-ink-500'}`}
              >
                {item.isAvailable ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="p-4 text-center text-ink-500 font-bold bg-ink-950 rounded-2xl border border-ink-800 border-dashed">
              No menu items found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
