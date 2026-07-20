import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, ChevronDown, ChevronRight } from 'lucide-react';
import { menuAPI } from '../../services/api';

export const MenuStockManager = ({ items, fetchDashboardData }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggle = async (itemId, currentAvailable, type = 'ITEM', details = null) => {
    const nextAvailable = !currentAvailable;
    let durationHours = null;

    if (!nextAvailable) {
      const hours = prompt('Out of stock. Automatically make available after how many hours? (Leave blank to keep off indefinitely)');
      if (hours && !isNaN(hours)) {
        durationHours = Number(hours);
      }
    }

    try {
      const payload = {
        isAvailable: nextAvailable,
        durationHours,
        type,
        ...details
      };
      
      await menuAPI.updateStock(itemId, payload);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update stock', err);
      alert("Error saving stock status to server.");
    }
  };

  const renderStockToggle = (label, isAvailable, onToggle, isChild = false) => (
    <div className={`flex items-center justify-between p-4 ${isChild ? 'bg-ink-900 border-t border-ink-800' : 'bg-ink-950'}`}>
      <span className={`font-bold transition-colors ${isAvailable ? 'text-white' : 'text-ink-500 line-through'} ${isChild ? 'text-sm' : 'text-base'}`}>
        {label}
      </span>
      <button 
        onClick={onToggle}
        className={`p-2 transition-colors ${isAvailable ? 'text-brand-500 hover:text-brand-400' : 'text-ink-600 hover:text-ink-500'}`}
      >
        {isAvailable ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-4">
      <div className="bg-ink-900 border border-ink-800 rounded-3xl p-5 shadow-dark-elevated mb-6">
        <h2 className="text-xl font-heading text-white mb-1">Granular Stock Management</h2>
        <p className="text-sm text-ink-400 mt-1">Turn off entire items or specific variants/add-ons. Set auto-resume timers so you don't forget to turn them back on.</p>
      </div>

      {items.map(item => {
        const isExpanded = expandedItems[item.id];
        const hasChildren = (item.variants && item.variants.length > 0) || (item.addons && item.addons.length > 0);

        return (
          <div key={item.id} className="rounded-2xl overflow-hidden shadow-dark-elevated border border-ink-800 bg-ink-950">
            <div className="flex items-center">
              {hasChildren && (
                <button onClick={() => toggleExpand(item.id)} className="pl-4 py-4 pr-2 text-ink-400 hover:text-white transition-colors">
                  {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                </button>
              )}
              <div className={`flex-1 ${!hasChildren ? 'pl-4' : ''}`}>
                {renderStockToggle(item.name, item.isAvailable !== false, () => handleToggle(item.id, item.isAvailable !== false, 'ITEM'))}
              </div>
            </div>

            {isExpanded && hasChildren && (
              <div className="pl-12 pr-4 pb-4 space-y-3">
                {item.variants?.map((group, groupIndex) => (
                  <div key={groupIndex} className="bg-ink-950 border border-ink-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-ink-900 border-b border-ink-800 text-xs font-bold text-ink-400 uppercase tracking-wider">
                      Variant: {group.name}
                    </div>
                    {group.options?.map((option, optionIndex) => (
                      renderStockToggle(
                        option.name, 
                        option.isAvailable !== false, 
                        () => handleToggle(item.id, option.isAvailable !== false, 'VARIANT', { groupIndex, optionIndex }),
                        true
                      )
                    ))}
                  </div>
                ))}

                {item.addons?.map((group, groupIndex) => (
                  <div key={groupIndex} className="bg-ink-950 border border-ink-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-ink-900 border-b border-ink-800 text-xs font-bold text-ink-400 uppercase tracking-wider">
                      Add-on: {group.name}
                    </div>
                    {group.options?.map((option, optionIndex) => (
                      renderStockToggle(
                        option.name, 
                        option.isAvailable !== false, 
                        () => handleToggle(item.id, option.isAvailable !== false, 'ADDON', { groupIndex, optionIndex }),
                        true
                      )
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {items.length === 0 && (
        <div className="p-8 text-center text-ink-500 font-bold bg-ink-950 rounded-3xl border border-ink-800 border-dashed">
          No menu items found.
        </div>
      )}
    </div>
  );
};
