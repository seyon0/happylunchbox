import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, LogOut, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { shopsAPI } from '../../services/api';import { KitchenLayout } from './KitchenLayout';
import { StaffManagement } from './StaffManagement';
import { SessionManagement } from './SessionManagement';

export const KitchenSettings = ({ shop, isOperating, setIsOperating }) => {
  const { logout } = useApp();
  const [upiId, setUpiId] = useState(shop?.upiId || '');
  const [savedStatus, setSavedStatus] = useState('');
  const [activeSettingsTab, setActiveSettingsTab] = useState('OPERATIONS');

  const handleToggleOps = async () => {
    const newState = !isOperating;
    setIsOperating(newState);
    try {
      await shopsAPI.updateOperations({ isOperating: newState });
    } catch (err) {
      console.error('Failed to toggle operations', err);
      setIsOperating(!newState);
    }
  };

  const handleSaveUpi = async (e) => {
    e.preventDefault();
    try {
      await shopsAPI.updateOperations({ upiId });
      setSavedStatus('UPI Updated');
      setTimeout(() => setSavedStatus(''), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24 h-full">
      {/* Local Tabs for Settings */}
      <div className="flex bg-ink-900 border border-ink-800 rounded-full p-1 mb-6">
        {['OPERATIONS', 'STAFF', 'SESSIONS'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSettingsTab(tab)}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
              activeSettingsTab === tab ? 'bg-brand-500 text-white' : 'text-ink-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSettingsTab === 'OPERATIONS' && (
        <div className="bg-ink-900 border border-ink-800 rounded-3xl p-5 shadow-dark-elevated">
          <h2 className="text-xl font-black text-white mb-6">Kitchen Operations</h2>
          
          <div className="flex items-center justify-between p-4 bg-ink-950 border border-ink-800 rounded-2xl mb-6">
            <div>
              <p className="text-base font-bold text-white">Accepting Orders</p>
              <p className="text-xs font-medium text-ink-400 mt-0.5">Pause all incoming orders immediately.</p>
            </div>
            <button 
              onClick={handleToggleOps}
              className={`p-1 transition-colors ${isOperating ? 'text-brand-500 hover:text-brand-400' : 'text-ink-600 hover:text-ink-500'}`}
            >
              {isOperating ? <ToggleRight className="w-12 h-12" /> : <ToggleLeft className="w-12 h-12" />}
            </button>
          </div>

          <form onSubmit={handleSaveUpi} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-400 mb-2 uppercase tracking-wider">Payout UPI ID</label>
              <input 
                type="text" 
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-4 bg-ink-950 border border-ink-800 rounded-2xl text-base font-bold text-white outline-none focus:border-brand-500 transition-colors"
                placeholder="e.g. restaurant@upi"
              />
            </div>
            <button type="submit" className="w-full py-4 bg-ink-800 text-white rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-ink-700 transition-colors">
              {savedStatus ? <><CheckCircle className="w-5 h-5 text-brand-500" /> {savedStatus}</> : 'Save Payment Details'}
            </button>
          </form>
        </div>
      )}

      {activeSettingsTab === 'STAFF' && <StaffManagement />}
      {activeSettingsTab === 'SESSIONS' && <SessionManagement />}

      <div className="pt-4">
        <button 
          onClick={logout}
          className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Sign Out Kitchen
        </button>
      </div>
    </div>
  );
};
