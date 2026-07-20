import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { menuAPI } from '../../services/api';

const ALLERGENS = [
  'Celery', 'Gluten', 'Crustaceans', 'Eggs', 'Fish', 'Lupin', 'Milk', 
  'Molluscs', 'Mustard', 'Nuts', 'Peanuts', 'Sesame', 'Soybeans', 'Sulphites'
];

export const MenuItemEditor = ({ item, onClose, fetchDashboardData }) => {
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    photoUrl: item?.photoUrl || '',
    categoryId: item?.categoryId || '',
    variants: item?.variants || [],
    addons: item?.addons || [],
    allergens: item?.allergens || []
  });

  useEffect(() => {
    menuAPI.categories().then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const toggleAllergen = (allergen) => {
    setFormData(prev => {
      const exists = prev.allergens.includes(allergen);
      if (exists) {
        return { ...prev, allergens: prev.allergens.filter(a => a !== allergen) };
      }
      return { ...prev, allergens: [...prev.allergens, allergen] };
    });
  };

  const handleSave = async () => {
    try {
      if (item?.id) {
        await menuAPI.updateItem(item.id, formData);
      } else {
        await menuAPI.createItem(formData);
      }
      fetchDashboardData();
      onClose();
    } catch (err) {
      console.error('Failed to save item', err);
    }
  };

  // Generic helper for adding groups (variants/addons)
  const addGroup = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { name: `New ${type === 'variants' ? 'Variant' : 'Add-on'} Group`, options: [] }]
    }));
  };

  const removeGroup = (type, index) => {
    setFormData(prev => {
      const newGroups = [...prev[type]];
      newGroups.splice(index, 1);
      return { ...prev, [type]: newGroups };
    });
  };

  const updateGroup = (type, index, value) => {
    setFormData(prev => {
      const newGroups = [...prev[type]];
      newGroups[index].name = value;
      return { ...prev, [type]: newGroups };
    });
  };

  const addOption = (type, groupIndex) => {
    setFormData(prev => {
      const newGroups = [...prev[type]];
      newGroups[groupIndex].options.push({ name: 'Option', price: 0 });
      return { ...prev, [type]: newGroups };
    });
  };

  const removeOption = (type, groupIndex, optionIndex) => {
    setFormData(prev => {
      const newGroups = [...prev[type]];
      newGroups[groupIndex].options.splice(optionIndex, 1);
      return { ...prev, [type]: newGroups };
    });
  };

  const updateOption = (type, groupIndex, optionIndex, field, value) => {
    setFormData(prev => {
      const newGroups = [...prev[type]];
      newGroups[groupIndex].options[optionIndex][field] = type === 'price' || field === 'price' ? Number(value) : value;
      return { ...prev, [type]: newGroups };
    });
  };

  const renderGroupEditor = (type) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-heading text-white capitalize">{type}</h3>
        <button
          onClick={() => addGroup(type)}
          className="flex items-center gap-2 px-3 py-1.5 bg-brand-500/20 text-brand-500 font-bold rounded-xl hover:bg-brand-500/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Group
        </button>
      </div>

      {formData[type].map((group, groupIndex) => (
        <div key={groupIndex} className="bg-ink-900 border border-ink-800 rounded-2xl p-4 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={group.name}
              onChange={(e) => updateGroup(type, groupIndex, e.target.value)}
              className="flex-1 bg-ink-950 border border-ink-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-brand-500"
              placeholder="Group Name (e.g. Size)"
            />
            <button onClick={() => removeGroup(type, groupIndex)} className="p-2 text-red-500 hover:text-red-400 bg-red-500/10 rounded-xl transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 pl-4 border-l-2 border-ink-800">
            {group.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={option.name}
                  onChange={(e) => updateOption(type, groupIndex, optionIndex, 'name', e.target.value)}
                  className="flex-1 bg-ink-950 border border-ink-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  placeholder="Option Name"
                />
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500">£</span>
                  <input
                    type="number"
                    value={option.price}
                    onChange={(e) => updateOption(type, groupIndex, optionIndex, 'price', e.target.value)}
                    className="w-full bg-ink-950 border border-ink-800 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-brand-500"
                    placeholder="0.00"
                  />
                </div>
                <button onClick={() => removeOption(type, groupIndex, optionIndex)} className="p-2 text-ink-500 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addOption(type, groupIndex)}
              className="flex items-center gap-1 text-brand-500 text-sm font-bold hover:text-brand-400 transition-colors mt-2"
            >
              <Plus className="w-4 h-4" /> Add Option
            </button>
          </div>
        </div>
      ))}
      {formData[type].length === 0 && (
        <div className="text-center p-6 bg-ink-950 border border-ink-800 border-dashed rounded-2xl text-ink-500 font-bold">
          No {type} added yet.
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-ink-950 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-ink-800 bg-ink-950">
        <h2 className="text-2xl font-heading text-white">{item ? 'Edit Menu Item' : 'New Menu Item'}</h2>
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 text-ink-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-ink-950 font-black rounded-xl hover:bg-brand-400 transition-colors">
            <Save className="w-5 h-5" />
            Save Item
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r border-ink-800 bg-ink-900 p-4 space-y-2">
          {['Basic Info', 'Variants & Add-ons', 'Dietary & Allergens'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${
                activeTab === tab ? 'bg-brand-500/10 text-brand-500' : 'text-ink-400 hover:bg-ink-800 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            {activeTab === 'Basic Info' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-ink-400 mb-2">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-ink-900 border border-ink-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    placeholder="e.g. Classic Beef Burger"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-ink-400 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-ink-900 border border-ink-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 resize-none"
                    placeholder="Describe the item..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-ink-400 mb-2">Base Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 font-bold">£</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full bg-ink-900 border border-ink-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink-400 mb-2">Category</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full bg-ink-900 border border-ink-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink-400 mb-2">Photo URL</label>
                  <input
                    type="text"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleChange}
                    className="w-full bg-ink-900 border border-ink-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    placeholder="https://..."
                  />
                  {formData.photoUrl && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-ink-800 h-48 bg-ink-950 flex items-center justify-center">
                      <img src={formData.photoUrl} alt="Preview" className="max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Variants & Add-ons' && (
              <div className="space-y-12">
                {renderGroupEditor('variants')}
                <hr className="border-ink-800" />
                {renderGroupEditor('addons')}
              </div>
            )}

            {activeTab === 'Dietary & Allergens' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-heading text-white mb-2">Allergens (Natasha's Law)</h3>
                  <p className="text-sm text-ink-400 mb-6">Select all allergens present in this item. This is required by UK law.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {ALLERGENS.map(allergen => {
                      const isSelected = formData.allergens.includes(allergen);
                      return (
                        <button
                          key={allergen}
                          onClick={() => toggleAllergen(allergen)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                            isSelected 
                              ? 'bg-brand-500/10 border-brand-500 text-white' 
                              : 'bg-ink-900 border-ink-800 text-ink-400 hover:border-ink-600'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-brand-500 border-brand-500' : 'border-ink-600'
                          }`}>
                            {isSelected && <X className="w-3 h-3 text-ink-950" style={{ transform: 'rotate(45deg)' }} />}
                          </div>
                          <span className="font-bold">{allergen}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
