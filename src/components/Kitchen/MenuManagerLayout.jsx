import React, { useState } from 'react';
import { CategoryManager } from './CategoryManager';
import { MenuStockManager } from './MenuStockManager';
import { MenuItemEditor } from './MenuItemEditor';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { menuAPI } from '../../services/api';

export const MenuManagerLayout = ({ items, fetchDashboardData }) => {
  const [activeTab, setActiveTab] = useState('Categories');
  const [editingItem, setEditingItem] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const tabs = ['Categories', 'Menu Items', 'Stock Management'];

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await menuAPI.deleteItem(id);
        fetchDashboardData();
      } catch (err) {
        console.error('Failed to delete item', err);
      }
    }
  };

  const renderMenuItems = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-ink-950 font-black rounded-xl hover:bg-brand-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-ink-900 border border-ink-800 rounded-3xl p-5 shadow-dark-elevated flex flex-col justify-between">
            <div>
              {item.photoUrl && (
                <img src={item.photoUrl} alt={item.name} className="w-full h-32 object-cover rounded-xl mb-4" />
              )}
              <h3 className="text-xl font-heading text-white">{item.name}</h3>
              <p className="text-sm text-ink-400 mt-1 line-clamp-2">{item.description}</p>
              <p className="text-brand-500 font-bold mt-2">£{item.price?.toFixed(2)}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-ink-800">
              <button onClick={() => handleEditItem(item)} className="p-2 text-ink-400 hover:text-white transition-colors">
                <Edit3 className="w-5 h-5" />
              </button>
              <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-500 hover:text-red-400 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full p-8 text-center text-ink-500 font-bold bg-ink-950 rounded-3xl border border-ink-800 border-dashed">
            No menu items found. Click "Add Item" to create one.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="mb-6 flex gap-6 border-b border-ink-800">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`pb-3 text-lg font-heading transition-colors relative ${
              activeTab === tab
                ? 'text-brand-500'
                : 'text-ink-400 hover:text-ink-200'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
        {activeTab === 'Categories' && <CategoryManager />}
        {activeTab === 'Menu Items' && renderMenuItems()}
        {activeTab === 'Stock Management' && <MenuStockManager items={items} fetchDashboardData={fetchDashboardData} />}
      </div>

      {isEditorOpen && (
        <MenuItemEditor
          item={editingItem}
          onClose={() => setIsEditorOpen(false)}
          fetchDashboardData={fetchDashboardData}
        />
      )}
    </div>
  );
};
