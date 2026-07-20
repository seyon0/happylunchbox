import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { GripVertical, Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { menuAPI } from '../../services/api';

export const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await menuAPI.categories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const newCat = {
      name: 'New Category',
      startTime: '',
      endTime: '',
    };
    try {
      const saved = await menuAPI.createCategory(newCat);
      setCategories([...categories, saved]);
    } catch (err) {
      console.error(err);
      const fallback = { ...newCat, id: Date.now().toString() };
      setCategories([...categories, fallback]);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditForm(cat);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      await menuAPI.updateCategory(editingId, editForm);
      setCategories(categories.map(c => c.id === editingId ? { ...c, ...editForm } : c));
    } catch (err) {
      console.error(err);
      setCategories(categories.map(c => c.id === editingId ? { ...c, ...editForm } : c));
    }
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      setCategories(categories.filter(c => c.id !== id));
    } catch(err) {
      console.error(err);
    }
  };

  const handleReorder = (newOrder) => {
    setCategories(newOrder);
  };

  if (loading) return <div className="text-ink-400 p-4">Loading categories...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading text-white">Categories</h2>
          <p className="text-sm text-ink-400 mt-1">Drag to reorder. Set times to hide/show categories automatically.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-ink-950 font-black rounded-xl hover:bg-brand-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <Reorder.Group axis="y" values={categories} onReorder={handleReorder} className="space-y-3">
        {categories.map((cat) => (
          <Reorder.Item
            key={cat.id}
            value={cat}
            className="bg-ink-900 border border-ink-800 rounded-2xl p-4 shadow-dark-elevated flex items-center gap-4 cursor-default relative"
          >
            <div className="cursor-grab active:cursor-grabbing text-ink-500 hover:text-ink-300">
              <GripVertical className="w-5 h-5" />
            </div>

            {editingId === cat.id ? (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="bg-ink-950 border border-ink-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 w-full"
                  placeholder="Category Name"
                />
                <input
                  type="time"
                  value={editForm.startTime || ''}
                  onChange={e => setEditForm({ ...editForm, startTime: e.target.value })}
                  className="bg-ink-950 border border-ink-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 w-full"
                  placeholder="Start Time"
                />
                <input
                  type="time"
                  value={editForm.endTime || ''}
                  onChange={e => setEditForm({ ...editForm, endTime: e.target.value })}
                  className="bg-ink-950 border border-ink-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 w-full"
                  placeholder="End Time"
                />
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <span className="font-bold text-white">{cat.name}</span>
                <span className="text-sm text-ink-400">
                  {cat.startTime ? `Starts: ${cat.startTime}` : 'Always visible'}
                </span>
                <span className="text-sm text-ink-400">
                  {cat.endTime ? `Ends: ${cat.endTime}` : ''}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {editingId === cat.id ? (
                <>
                  <button onClick={saveEdit} className="p-2 text-green-500 hover:text-green-400 transition-colors">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={cancelEdit} className="p-2 text-ink-500 hover:text-ink-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(cat)} className="p-2 text-ink-400 hover:text-white transition-colors">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {categories.length === 0 && !loading && (
        <div className="p-8 text-center text-ink-500 font-bold bg-ink-950 rounded-3xl border border-ink-800 border-dashed">
          No categories found. Create one to get started.
        </div>
      )}
    </div>
  );
};
