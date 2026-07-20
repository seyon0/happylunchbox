import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Store, Settings, PoundSterling, Utensils, BarChart2, 
  AlertOctagon, CheckCircle2, ShieldAlert, Download, Camera
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const mockPerformanceData = [
  { name: 'Week 1', orders: 120, rating: 4.5, time: 25 },
  { name: 'Week 2', orders: 145, rating: 4.6, time: 24 },
  { name: 'Week 3', orders: 138, rating: 4.7, time: 22 },
  { name: 'Week 4', orders: 160, rating: 4.8, time: 20 },
];

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-dark-floating flex items-center gap-3 text-sm font-semibold animate-bounce-in ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
  </div>
);

export const VendorDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [profile, setProfile] = useState({
    name: 'Jaffna Roots', contact: '+44 7700 900200', address: '124 Baker Street, London', geoPin: '51.523,-0.158'
  });

  const [operations, setOperations] = useState({
    open: '10:00', close: '22:00', emergencyClose: false, zones: ['Central', 'East'], cuisineTags: 'Sri Lankan, Spicy, Vegan Options'
  });

  const [finances, setFinances] = useState({
    commissionMode: 'tiered', commissionFlat: 15, deliveryChargeRule: 'distanceBased', minOrder: 12.00, settlementCycle: 'weekly'
  });

  const menuItems = [
    { id: 1, name: 'Mutton Curry Box', category: 'Mains', price: 14.50, status: 'Active' },
    { id: 2, name: 'Vegan Thali', category: 'Mains', price: 12.00, status: 'Active' },
    { id: 3, name: 'Mango Lassi', category: 'Drinks', price: 4.50, status: 'Active' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/vendors')} className="p-2 bg-admin-900 border border-admin-800 rounded-xl hover:bg-admin-800 transition-colors shadow-dark-elevated">
          <ArrowLeft className="w-4 h-4 text-admin-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {profile.name}
            {operations.emergencyClose ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">Emergency Closed</span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">Active</span>
            )}
          </h1>
          <p className="text-sm text-admin-400 mt-1">Vendor ID: {id} · Joined 12/05/2026</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 overflow-hidden flex lg:flex-col">
            {[
              { id: 'profile', icon: Store, label: 'Profile & Brand' },
              { id: 'operations', icon: Settings, label: 'Operations & Routing' },
              { id: 'finances', icon: PoundSterling, label: 'Finances & Commission' },
              { id: 'menu', icon: Utensils, label: 'Menu Oversight' },
              { id: 'performance', icon: BarChart2, label: 'Performance & Reports' },
              { id: 'danger', icon: AlertOctagon, label: 'Danger Zone', color: 'text-red-400 hover:bg-red-500/10' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col lg:flex-row items-center lg:items-start lg:justify-start justify-center flex-1 lg:flex-none gap-2 p-4 text-xs font-bold transition-colors border-b border-admin-800/50 last:border-0 ${
                  activeTab === tab.id 
                    ? (tab.id === 'danger' ? 'bg-red-500/10 text-red-400 border-l-4 border-l-red-500' : 'bg-brand-500/10 text-brand-400 border-l-4 border-l-brand-500') 
                    : (tab.color || 'text-admin-400 hover:text-white hover:bg-admin-800/50')
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Brand Assets</h2>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-semibold text-admin-400">Cover Image</p>
                    <div className="h-32 bg-admin-950 rounded-xl border-2 border-dashed border-admin-700 flex items-center justify-center text-admin-500 hover:border-admin-500 cursor-pointer transition-colors">
                      <Camera className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="shrink-0 space-y-2">
                    <p className="text-xs font-semibold text-admin-400">Brand Logo</p>
                    <div className="w-32 h-32 bg-admin-950 rounded-full border-2 border-dashed border-admin-700 flex items-center justify-center text-admin-500 hover:border-admin-500 cursor-pointer transition-colors">
                      <Camera className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Business Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Business Name', key: 'name' },
                    { label: 'Contact Number', key: 'contact' },
                    { label: 'Registered Address', key: 'address' },
                    { label: 'Geo-Coordinates (Pin)', key: 'geoPin' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-bold text-admin-400 block mb-1">{f.label}</label>
                      <input 
                        type="text" 
                        value={profile[f.key]}
                        onChange={(e) => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white placeholder-admin-600 focus:outline-none focus:border-brand-500 transition-colors" 
                      />
                    </div>
                  ))}
                </div>
                <button onClick={() => showToast('Profile details updated')} className="mt-5 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-glow hover:bg-emerald-500 transition-colors">
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Emergency Override</h2>
                    <p className="text-xs text-admin-400 mt-1">Force close the kitchen independently of standard operating hours.</p>
                  </div>
                  <button 
                    onClick={() => { setOperations(o => ({ ...o, emergencyClose: !o.emergencyClose })); showToast('Emergency state toggled', 'success'); }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors ${operations.emergencyClose ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' : 'bg-red-600 text-white hover:bg-red-500'}`}
                  >
                    {operations.emergencyClose ? 'Lift Emergency Close' : 'Trigger Emergency Close'}
                  </button>
                </div>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Operations & Routing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-admin-400 block mb-1">Standard Opening Hour</label>
                    <input type="time" value={operations.open} onChange={e => setOperations(o => ({...o, open: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-admin-400 block mb-1">Standard Closing Hour</label>
                    <input type="time" value={operations.close} onChange={e => setOperations(o => ({...o, close: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-admin-400 block mb-1">Assigned Delivery Zones (Multi-assign)</label>
                    <input type="text" value={operations.zones.join(', ')} onChange={e => setOperations(o => ({...o, zones: e.target.value.split(', ')}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-admin-400 block mb-1">Cuisine Tags (Customer Filtering)</label>
                    <input type="text" value={operations.cuisineTags} onChange={e => setOperations(o => ({...o, cuisineTags: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                </div>
                <button onClick={() => showToast('Operations updated')} className="mt-5 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-glow hover:bg-emerald-500 transition-colors">
                  Save Operations
                </button>
              </div>
            </div>
          )}

          {activeTab === 'finances' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Commission Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-admin-400 block mb-1">Commission Mode</label>
                    <select value={finances.commissionMode} onChange={e => setFinances(f => ({...f, commissionMode: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-brand-500 transition-colors">
                      <option value="flat">Flat Percentage</option>
                      <option value="tiered">Tiered (Volume Based)</option>
                    </select>
                  </div>
                  {finances.commissionMode === 'flat' && (
                    <div>
                      <label className="text-xs font-bold text-admin-400 block mb-1">Flat Percentage (%)</label>
                      <input type="number" value={finances.commissionFlat} onChange={e => setFinances(f => ({...f, commissionFlat: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-brand-500 transition-colors" />
                    </div>
                  )}
                  {finances.commissionMode === 'tiered' && (
                    <div>
                      <label className="text-xs font-bold text-admin-400 block mb-1">Assigned Tier Profile</label>
                      <select className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-brand-500 transition-colors">
                        <option>Partner (12% up to £5k, 10% above)</option>
                        <option>Standard (15% up to £2k, 12% above)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Billing & Rules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-admin-400 block mb-1">Delivery Charge Rule</label>
                    <select value={finances.deliveryChargeRule} onChange={e => setFinances(f => ({...f, deliveryChargeRule: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-brand-500 transition-colors">
                      <option value="flat">Flat Fee</option>
                      <option value="distanceBased">Distance Based</option>
                      <option value="orderValueSlab">Order Value Slabs</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-admin-400 block mb-1">Minimum Order Value (£)</label>
                    <input type="number" value={finances.minOrder} onChange={e => setFinances(f => ({...f, minOrder: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-admin-400 block mb-1">Settlement Cycle</label>
                    <select value={finances.settlementCycle} onChange={e => setFinances(f => ({...f, settlementCycle: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-brand-500 transition-colors">
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => showToast('Financial rules updated')} className="mt-5 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-glow hover:bg-emerald-500 transition-colors">
                  Save Finances
                </button>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Menu Oversight</h2>
                    <p className="text-xs text-admin-400">Audit trail enabled. Monitor and edit live items.</p>
                  </div>
                  <button className="px-4 py-2 bg-admin-800 text-admin-300 border border-admin-700 text-xs font-bold rounded-xl hover:text-white transition-colors">
                    Add Item
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="border-b border-admin-800 text-xs text-admin-500 uppercase tracking-widest font-black">
                      <tr>
                        <th className="py-3 px-4">Item Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price (£)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-800/50">
                      {menuItems.map(item => (
                        <tr key={item.id} className="hover:bg-admin-800/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                          <td className="py-3 px-4 text-admin-400 font-medium">{item.category}</td>
                          <td className="py-3 px-4 font-bold text-admin-300">{item.price.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{item.status}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button className="text-xs font-bold text-brand-400 hover:text-brand-300 hover:underline">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6 border-l-4 border-l-brand-500">
                <h2 className="text-lg font-bold text-white mb-2">Promo Approval Workflow</h2>
                <p className="text-xs text-admin-400 mb-4">Review discounts proposed by the vendor before they go live on the customer app to prevent governance gaps.</p>
                <div className="p-4 bg-admin-950 rounded-xl border border-admin-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">Summer Special: 15% OFF Mains</p>
                    <p className="text-xs text-admin-500 mt-0.5">Proposed duration: 1 Aug 2026 - 31 Aug 2026</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => showToast('Promo Approved')} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg hover:bg-emerald-500/30 transition-colors">Approve</button>
                    <button onClick={() => showToast('Promo Rejected', 'error')} className="px-3 py-1.5 bg-admin-800 border border-admin-700 text-admin-300 text-xs font-bold rounded-lg hover:text-white transition-colors">Reject</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Order Volume', val: '583', sub: '+12% this month' },
                  { label: 'Cancellation Rate', val: '2.4%', sub: 'Target < 5%' },
                  { label: 'Avg Prep Time', val: '18 min', sub: 'Target < 20 min' },
                  { label: 'Rating Trend', val: '4.8 ⭐', sub: '+0.2 from last mo' },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-admin-900 rounded-2xl p-4 shadow-dark-elevated border border-admin-800">
                    <p className="text-[10px] font-bold text-admin-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                    <p className="text-xl font-black text-white">{kpi.val}</p>
                    <p className="text-[10px] font-semibold text-emerald-400 mt-1">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Performance Trend</h2>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '12px', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="orders" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Export Reports</h2>
                <p className="text-xs text-admin-400 mb-4">Generate localized reports for Sales, Orders, and Payments.</p>
                <div className="flex flex-wrap items-center gap-3">
                  {['Sales CSV', 'Sales XLSX', 'Tax Invoice PDF'].map(btn => (
                    <button key={btn} onClick={() => showToast(`Generating ${btn}...`)} className="flex items-center gap-1.5 px-4 py-2 bg-admin-800 border border-admin-700 text-admin-300 text-xs font-bold rounded-xl hover:text-white transition-colors shadow-sm">
                      <Download className="w-3.5 h-3.5" /> {btn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-red-400 mb-1">Suspend Vendor Account</h2>
                    <p className="text-sm text-admin-400 font-medium leading-relaxed mb-4">
                      Executing a soft-delete will immediately hide this vendor and all its menu items from the customer application. This action overrides all current operating statuses.
                    </p>
                    <button onClick={() => showToast('Vendor suspended successfully.', 'error')} className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-500 transition-colors shadow-glow">
                      Suspend Vendor (Soft Delete)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
