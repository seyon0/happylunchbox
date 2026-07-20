import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tag, TrendingUp, Mail, FileText, CheckCircle, AlertTriangle, ShieldAlert,
  Plus, Trash2, Edit3, Save, Share2, PlayCircle
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api/marketing';

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-dark-floating flex items-center gap-3 text-sm font-semibold animate-bounce-in ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
  </div>
);

export const MarketingPage = () => {
  const [activeTab, setActiveTab] = useState('coupons');
  const [toast, setToast] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [coupons, setCoupons] = useState([]);
  const [boostedListings, setBoostedListings] = useState([]);
  const [cmsPages, setCmsPages] = useState([]);
  const [templates, setTemplates] = useState([]);

  // CMS Editor State
  const [editingCms, setEditingCms] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // New Form States
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'PERCENTAGE', value: '', scope: 'GLOBAL', usageLimit: '' });
  const [newBoosted, setNewBoosted] = useState({ shopId: '', slot: '1', startDate: '', endDate: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [couponsRes, boostedRes, cmsRes, templatesRes] = await Promise.all([
        fetch(`${API_URL}/coupons`),
        fetch(`${API_URL}/boosted-listings`),
        fetch(`${API_URL}/cms`),
        fetch(`${API_URL}/templates`)
      ]);
      
      if (!couponsRes.ok) throw new Error('Failed to fetch data');
      
      setCoupons(await couponsRes.json());
      setBoostedListings(await boostedRes.json());
      setCmsPages(await cmsRes.json());
      setTemplates(await templatesRes.json());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Cannot connect to the backend. Is NestJS running on port 3000?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- API Handlers ---

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon)
      });
      if (!res.ok) throw new Error('Failed');
      showToast('Coupon created successfully');
      setNewCoupon({ code: '', type: 'PERCENTAGE', value: '', scope: 'GLOBAL', usageLimit: '' });
      fetchData();
    } catch (e) {
      showToast('Error creating coupon', 'error');
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await fetch(`${API_URL}/coupons/${id}/toggle`, { method: 'PUT' });
      fetchData();
    } catch (e) {
      showToast('Error toggling coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await fetch(`${API_URL}/coupons/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      showToast('Error deleting coupon', 'error');
    }
  };

  const handleSaveCms = async (slug, data) => {
    try {
      const res = await fetch(`${API_URL}/cms/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      showToast('CMS Page updated successfully');
      setEditingCms(null);
      fetchData();
    } catch (e) {
      showToast('Error updating CMS', 'error');
    }
  };

  const handleSaveTemplate = async (slug, data) => {
    try {
      const res = await fetch(`${API_URL}/templates/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      showToast('Template updated successfully');
      setEditingTemplate(null);
      fetchData();
    } catch (e) {
      showToast('Error updating Template', 'error');
    }
  };


  if (loading) return <div className="p-8 text-center text-admin-500 font-bold animate-pulse">Connecting to backend...</div>;

  if (error) return (
    <div className="p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/20 mt-6 max-w-2xl mx-auto shadow-dark-elevated">
      <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-lg font-bold text-red-400 mb-2">Backend Connection Error</h2>
      <p className="text-sm text-red-300">{error}</p>
      <button onClick={fetchData} className="mt-6 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-500 shadow-glow transition-colors">Retry Connection</button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-full overflow-hidden pb-20">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-white">Marketing & Content</h1>
        <p className="text-sm text-admin-400 mt-1">Manage Promotions, Content Pages, and Notifications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-admin-900 p-1.5 rounded-2xl w-fit border border-admin-800 shadow-dark-elevated flex-wrap">
        {[['coupons', 'Promo & Coupons', Tag], ['boosted', 'Boosted Listings', TrendingUp], ['cms', 'CMS Editor', FileText], ['templates', 'Comms Templates', Mail]].map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === key 
                ? 'bg-brand-500/20 text-brand-400 shadow-glow' 
                : 'text-admin-400 hover:text-white hover:bg-admin-800'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-fade-in grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-admin-900 border border-admin-800 shadow-dark-elevated rounded-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="px-6 py-4 border-b border-admin-800 bg-admin-950/50 shrink-0">
              <h2 className="font-bold text-white">Active Coupons</h2>
            </div>
            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-admin-950/90 backdrop-blur-md z-40 border-b border-admin-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Code</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Scope</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Usage</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-800/50">
                  {coupons.map(row => (
                    <tr key={row.id} className="hover:bg-admin-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold font-mono px-2 py-1 bg-admin-800 border border-admin-700 rounded text-admin-300">{row.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white">{row.type === 'PERCENTAGE' ? `${row.value}% OFF` : `£${row.value.toFixed(2)} OFF`}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold uppercase">{row.scope}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-admin-400">{row.currentUsage} / {row.usageLimit || '∞'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${row.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {row.isActive ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleToggleCoupon(row.id)} className="px-2.5 py-1.5 bg-admin-800 hover:bg-admin-700 hover:text-white border border-admin-700 text-admin-400 rounded-lg text-xs font-bold transition-colors">Toggle</button>
                          <button onClick={() => handleDeleteCoupon(row.id)} className="px-2.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-admin-500 font-medium">No coupons active.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-admin-900 border border-admin-800 shadow-dark-elevated rounded-2xl p-6 h-fit">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-brand-500"/> Create Coupon</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-admin-400 block mb-1">Coupon Code</label>
                <input required type="text" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} placeholder="e.g. WELCOME10" className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-mono text-white placeholder-admin-600 outline-none focus:border-brand-500 transition-colors uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-admin-400 block mb-1">Discount Type</label>
                  <select value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value})} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-semibold text-white outline-none focus:border-brand-500 transition-colors">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (£)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-admin-400 block mb-1">Value</label>
                  <input required type="number" step="0.1" value={newCoupon.value} onChange={e => setNewCoupon({...newCoupon, value: e.target.value})} placeholder="10" className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm text-white placeholder-admin-600 outline-none focus:border-brand-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-admin-400 block mb-1">Scope</label>
                <select value={newCoupon.scope} onChange={e => setNewCoupon({...newCoupon, scope: e.target.value})} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-semibold text-white outline-none focus:border-brand-500 transition-colors">
                  <option value="GLOBAL">Global (All Shops)</option>
                  <option value="SHOP">Specific Shop</option>
                  <option value="CATEGORY">Specific Category</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-admin-400 block mb-1">Usage Limit (Leave blank for unlimited)</label>
                <input type="number" value={newCoupon.usageLimit} onChange={e => setNewCoupon({...newCoupon, usageLimit: e.target.value})} placeholder="e.g. 100" className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm text-white placeholder-admin-600 outline-none focus:border-brand-500 transition-colors" />
              </div>
              <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-glow transition-colors mt-2">
                Generate Coupon
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Boosted Listings Tab */}
      {activeTab === 'boosted' && (
        <div className="space-y-6 animate-fade-in text-center p-12 bg-admin-900 rounded-2xl border border-admin-800 shadow-dark-elevated">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Boosted Listings Allocation</h2>
          <p className="text-sm text-admin-400 max-w-md mx-auto mb-6">Allocate home screen slots to vendors who have paid for premium visibility. (Feature UI coming in Phase 2)</p>
          <div className="text-left max-w-lg mx-auto bg-admin-950 p-6 rounded-xl border border-admin-800 shadow-inner">
             <p className="text-xs font-mono text-admin-500 mb-2">// Raw Data from API:</p>
             <pre className="text-xs bg-black/50 text-emerald-400 p-4 rounded-lg overflow-auto border border-admin-800/50">
               {JSON.stringify(boostedListings, null, 2)}
             </pre>
          </div>
        </div>
      )}

      {/* CMS Pages Tab */}
      {activeTab === 'cms' && (
        <div className="space-y-6 animate-fade-in grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-admin-900 border border-admin-800 shadow-dark-elevated rounded-2xl overflow-hidden h-fit">
            <div className="px-6 py-4 border-b border-admin-800 bg-admin-950/50">
              <h2 className="font-bold text-white">Platform Pages</h2>
            </div>
            <div className="divide-y divide-admin-800/50">
              {cmsPages.map(page => (
                <div key={page.id} className="p-4 flex items-center justify-between hover:bg-admin-800/50 cursor-pointer transition-colors" onClick={() => setEditingCms({...page})}>
                  <div>
                    <h3 className="font-bold text-white text-sm">{page.title}</h3>
                    <p className="text-xs font-mono text-admin-500 mt-1">/{page.slug}</p>
                  </div>
                  <Edit3 className="w-4 h-4 text-admin-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-2">
            {editingCms ? (
              <div className="bg-admin-900 border border-admin-800 shadow-dark-elevated rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-admin-800">
                  <div>
                    <h2 className="font-bold text-white">Editing: {editingCms.title}</h2>
                    <p className="text-xs text-admin-400">Supports HTML/Markdown content.</p>
                  </div>
                  <button onClick={() => setEditingCms(null)} className="text-xs font-bold text-admin-500 hover:text-white transition-colors">Cancel</button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-admin-400 block mb-1">Page Title</label>
                    <input type="text" value={editingCms.title} onChange={e => setEditingCms({...editingCms, title: e.target.value})} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-bold text-white outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-admin-400 block mb-1">Content (HTML)</label>
                    <textarea rows="12" value={editingCms.content} onChange={e => setEditingCms({...editingCms, content: e.target.value})} className="w-full p-3 bg-black/30 text-white border border-admin-800 font-mono text-sm rounded-xl outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => handleSaveCms(editingCms.slug, editingCms)} className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-glow transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Page
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-admin-900/50 border border-admin-800 border-dashed rounded-2xl flex flex-col items-center justify-center h-full min-h-[400px] text-admin-500">
                <FileText className="w-12 h-12 mb-4 text-admin-600" />
                <p className="font-semibold text-sm">Select a page from the list to edit.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6 animate-fade-in grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-admin-900 border border-admin-800 shadow-dark-elevated rounded-2xl overflow-hidden h-fit">
            <div className="px-6 py-4 border-b border-admin-800 bg-admin-950/50">
              <h2 className="font-bold text-white">Comms Templates</h2>
            </div>
            <div className="divide-y divide-admin-800/50">
              {templates.map(tpl => (
                <div key={tpl.id} className="p-4 flex items-center justify-between hover:bg-admin-800/50 cursor-pointer transition-colors" onClick={() => setEditingTemplate({...tpl})}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${tpl.channel === 'EMAIL' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{tpl.channel}</span>
                      <h3 className="font-bold text-white text-sm">{tpl.slug}</h3>
                    </div>
                  </div>
                  <Edit3 className="w-4 h-4 text-admin-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-2">
            {editingTemplate ? (
              <div className="bg-admin-900 border border-admin-800 shadow-dark-elevated rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-admin-800">
                  <div>
                    <h2 className="font-bold text-white">Editing: {editingTemplate.slug}</h2>
                    <p className="text-xs text-admin-400">Use {'{{variables}}'} for dynamic data.</p>
                  </div>
                  <button onClick={() => setEditingTemplate(null)} className="text-xs font-bold text-admin-500 hover:text-white transition-colors">Cancel</button>
                </div>
                
                <div className="space-y-4">
                  {editingTemplate.channel === 'EMAIL' && (
                    <div>
                      <label className="text-xs font-bold text-admin-400 block mb-1">Subject Line</label>
                      <input type="text" value={editingTemplate.subject || ''} onChange={e => setEditingTemplate({...editingTemplate, subject: e.target.value})} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-bold text-white outline-none focus:border-brand-500 transition-colors" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-admin-400 block mb-1">Message Body</label>
                    <textarea rows="6" value={editingTemplate.body} onChange={e => setEditingTemplate({...editingTemplate, body: e.target.value})} className="w-full p-3 bg-admin-950 text-white border border-admin-800 text-sm rounded-xl outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => handleSaveTemplate(editingTemplate.slug, editingTemplate)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-glow transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Template
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-admin-900/50 border border-admin-800 border-dashed rounded-2xl flex flex-col items-center justify-center h-full min-h-[400px] text-admin-500">
                <Mail className="w-12 h-12 mb-4 text-admin-600" />
                <p className="font-semibold text-sm">Select a template from the list to edit.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
