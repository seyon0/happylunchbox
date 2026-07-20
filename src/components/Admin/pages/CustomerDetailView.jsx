import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, ShoppingBag, Wallet, MessageSquare, 
  CheckCircle2, AlertCircle, Ban, TrendingUp, History 
} from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-dark-floating flex items-center gap-3 text-sm font-semibold animate-bounce-in ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
  </div>
);

export const CustomerDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [profile, setProfile] = useState({
    name: 'Anita Sharma', email: 'anita@example.com', phone: '+44 7700 900555', status: 'ACTIVE', banReason: '', segment: 'VIP'
  });

  const [wallet, setWallet] = useState({
    balance: 45.00,
    adjustAmount: '',
    adjustReason: 'goodwill',
    adjustNotes: ''
  });

  const [walletHistory, setWalletHistory] = useState([
    { id: 1, type: 'credit', amount: 5.00, reason: 'goodwill', date: '2026-07-10', admin: 'sysadmin' },
    { id: 2, type: 'debit', amount: 15.00, reason: 'order', date: '2026-06-25', admin: 'system' }
  ]);

  const handleWalletAdjust = (e) => {
    e.preventDefault();
    if (!wallet.adjustAmount || isNaN(wallet.adjustAmount)) return;
    const amt = parseFloat(wallet.adjustAmount);
    
    setWallet(prev => ({ ...prev, balance: prev.balance + amt, adjustAmount: '', adjustNotes: '' }));
    setWalletHistory([{
      id: Date.now(), type: amt > 0 ? 'credit' : 'debit', amount: Math.abs(amt), reason: wallet.adjustReason, date: new Date().toISOString().split('T')[0], admin: 'current_user'
    }, ...walletHistory]);
    
    showToast(`Successfully adjusted wallet by £${Math.abs(amt).toFixed(2)}.`);
  };

  const handleBanToggle = (e) => {
    e.preventDefault();
    if (profile.status === 'ACTIVE' && !profile.banReason.trim()) {
      showToast('You must provide a ban reason.', 'error');
      return;
    }
    
    if (profile.status === 'ACTIVE') {
      setProfile(p => ({ ...p, status: 'BANNED' }));
      showToast('Customer has been banned from placing orders.', 'error');
    } else {
      setProfile(p => ({ ...p, status: 'ACTIVE', banReason: '' }));
      showToast('Customer ban lifted.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/customers')} className="p-2 bg-admin-900 border border-admin-800 rounded-xl hover:bg-admin-800 transition-colors shadow-dark-elevated">
          <ArrowLeft className="w-4 h-4 text-admin-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {profile.name}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
              profile.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {profile.status}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {profile.segment}
            </span>
          </h1>
          <p className="text-sm text-admin-400 mt-1">Customer ID: {id} · Member since 2024</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 overflow-hidden flex lg:flex-col">
            {[
              { id: 'profile', icon: User, label: 'Profile & Status' },
              { id: 'orders', icon: ShoppingBag, label: 'Order History & LTV' },
              { id: 'wallet', icon: Wallet, label: 'Wallet Credit' },
              { id: 'complaints', icon: MessageSquare, label: 'Complaints Log' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col lg:flex-row items-center lg:items-start lg:justify-start justify-center flex-1 lg:flex-none gap-2 p-4 text-xs font-bold transition-colors border-b border-admin-800/50 last:border-0 ${
                  activeTab === tab.id 
                    ? 'bg-brand-500/10 text-brand-400 border-l-4 border-l-brand-500' 
                    : 'text-admin-400 hover:text-white hover:bg-admin-800/50'
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
                <h2 className="text-lg font-bold text-white mb-6">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', key: 'name' },
                    { label: 'Email Address', key: 'email' },
                    { label: 'Phone Number', key: 'phone' },
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
                <button onClick={() => showToast('Profile details updated')} className="mt-5 px-5 py-2.5 bg-brand-500 text-white text-xs font-bold rounded-xl shadow-glow hover:bg-brand-600 transition-colors">
                  Save Profile
                </button>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-red-500/20 p-6 opacity-95">
                <div className="flex items-center gap-2 mb-2">
                  <Ban className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold text-white">Ban Configuration</h2>
                </div>
                <p className="text-xs text-admin-400 mb-6">Banning a customer prevents them from placing new orders or using COD.</p>
                
                <form onSubmit={handleBanToggle} className="space-y-4">
                  {profile.status === 'ACTIVE' ? (
                    <>
                      <div>
                        <label className="text-xs font-bold text-admin-400 block mb-1">Reason for Ban (Required)</label>
                        <textarea 
                          required
                          value={profile.banReason}
                          onChange={e => setProfile(p => ({ ...p, banReason: e.target.value }))}
                          placeholder="e.g. Repeated fraudulent cancellations / COD refusal..."
                          className="w-full p-3 bg-admin-950 border border-admin-800 rounded-xl text-sm text-white outline-none focus:border-red-500 resize-none h-24 transition-colors"
                        />
                      </div>
                      <button type="submit" className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow-glow hover:bg-red-500 transition-colors">
                        Enforce Ban
                      </button>
                    </>
                  ) : (
                    <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      <p className="text-xs font-bold text-red-400 mb-1">Customer is currently BANNED</p>
                      <p className="text-sm font-medium text-red-300 mb-4">Reason: "{profile.banReason}"</p>
                      <button type="submit" className="px-5 py-2.5 bg-admin-800 text-white text-xs font-bold border border-admin-700 rounded-xl shadow-sm hover:bg-admin-700 transition-colors">
                        Lift Ban & Restore Access
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-admin-900 rounded-2xl p-6 shadow-dark-elevated border border-admin-800 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-admin-500 uppercase tracking-wider mb-1">Lifetime Value (LTV)</p>
                    <p className="text-3xl font-black text-white">£892.50</p>
                  </div>
                </div>
                <div className="bg-admin-900 rounded-2xl p-6 shadow-dark-elevated border border-admin-800 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-admin-500 uppercase tracking-wider mb-1">Lifetime Orders</p>
                    <p className="text-3xl font-black text-white">67</p>
                  </div>
                </div>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-admin-800">
                  <h2 className="font-bold text-white">Order History Feed</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="border-b border-admin-800 text-xs text-admin-500 uppercase tracking-widest font-black">
                      <tr>
                        <th className="py-3 px-6">Order ID</th>
                        <th className="py-3 px-6">Date</th>
                        <th className="py-3 px-6">Restaurant</th>
                        <th className="py-3 px-6">Total (£)</th>
                        <th className="py-3 px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-800/50">
                      {[
                        { id: 'HL-0102', date: '2026-07-15', rest: 'Spice Garden', total: 18.50, status: 'Delivered' },
                        { id: 'HL-0084', date: '2026-07-10', rest: 'Green Bowl', total: 12.00, status: 'Delivered' },
                        { id: 'HL-0012', date: '2026-06-25', rest: 'Sushi Hub', total: 24.50, status: 'Cancelled' },
                      ].map(ord => (
                        <tr key={ord.id} className="hover:bg-admin-800/30 transition-colors">
                          <td className="py-3 px-6 font-bold text-brand-400">{ord.id}</td>
                          <td className="py-3 px-6 text-admin-400">{ord.date}</td>
                          <td className="py-3 px-6 font-medium text-white">{ord.rest}</td>
                          <td className="py-3 px-6 font-bold text-white">£{ord.total.toFixed(2)}</td>
                          <td className="py-3 px-6">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Balance & Form */}
                <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                  <div className="text-center py-6 mb-4 border-b border-admin-800">
                    <p className="text-[10px] font-bold text-admin-500 uppercase tracking-wider mb-1">Current Balance</p>
                    <p className="text-5xl font-black text-emerald-400">£{wallet.balance.toFixed(2)}</p>
                  </div>
                  
                  <form onSubmit={handleWalletAdjust} className="space-y-4">
                    <h3 className="font-bold text-white text-sm">Manual Adjustment</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-admin-400 block mb-1">Amount (£)</label>
                        <input 
                          required
                          type="number" step="0.50"
                          value={wallet.adjustAmount}
                          onChange={e => setWallet(w => ({...w, adjustAmount: e.target.value}))}
                          placeholder="+ / - value"
                          className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-bold text-white outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-admin-400 block mb-1">Use Case / Tag</label>
                        <select 
                          value={wallet.adjustReason}
                          onChange={e => setWallet(w => ({...w, adjustReason: e.target.value}))}
                          className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-semibold text-white outline-none focus:border-brand-500 transition-colors"
                        >
                          <option value="goodwill">Goodwill (Apology)</option>
                          <option value="refund">Refund (Cancelled Order)</option>
                          <option value="correction">Admin Correction</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-admin-400 block mb-1">Internal Note (Required)</label>
                      <input 
                        required
                        type="text"
                        value={wallet.adjustNotes}
                        onChange={e => setWallet(w => ({...w, adjustNotes: e.target.value}))}
                        placeholder="Reason for this manual adjustment..."
                        className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm text-white outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-glow hover:bg-emerald-500 transition-colors">
                      Process Adjustment
                    </button>
                  </form>
                </div>

                {/* Ledger */}
                <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 overflow-hidden flex flex-col max-h-[500px]">
                  <div className="px-6 py-4 border-b border-admin-800">
                    <h3 className="font-bold text-white">Wallet Ledger</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                    {walletHistory.map(tx => (
                      <div key={tx.id} className="p-3 hover:bg-admin-800/50 rounded-xl border-b border-admin-800/50 last:border-0 flex items-center justify-between transition-colors">
                        <div>
                          <p className="font-bold text-white text-sm flex items-center gap-2">
                            {tx.type === 'credit' ? <span className="text-emerald-400">+£{tx.amount.toFixed(2)}</span> : <span className="text-red-400">-£{tx.amount.toFixed(2)}</span>}
                          </p>
                          <p className="text-xs text-admin-400 mt-0.5">Tag: {tx.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-admin-300">{tx.date}</p>
                          <p className="text-[10px] text-admin-500">by: {tx.admin}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-white">Linked Support Tickets</h2>
                  <p className="text-xs text-admin-400">Historical complaints raised by this account.</p>
                </div>
                <button className="px-4 py-2 bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold rounded-xl hover:bg-brand-500/20 transition-colors">
                  Open Support Hub
                </button>
              </div>

              {[
                { id: 'TK-1004', subject: 'Order arrived cold', date: '2026-07-10', status: 'RESOLVED', resolution: 'Issued £5.00 goodwill wallet credit.' },
                { id: 'TK-0992', subject: 'Missing drink', date: '2026-06-25', status: 'RESOLVED', resolution: 'Refunded drink value to wallet.' },
              ].map(tk => (
                <div key={tk.id} className="bg-admin-900 p-5 rounded-2xl border border-admin-800 shadow-dark-elevated">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">{tk.id} — {tk.subject}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{tk.status}</span>
                  </div>
                  <p className="text-xs text-admin-500 mb-2">Logged on {tk.date}</p>
                  <div className="p-3 bg-admin-950 rounded-lg text-xs font-medium text-admin-300 border border-admin-800">
                    <span className="font-bold text-white">Resolution: </span> {tk.resolution}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
