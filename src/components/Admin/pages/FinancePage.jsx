import React, { useState, useEffect, useMemo } from 'react';
import { 
  PoundSterling, TrendingUp, Clock, CreditCard, 
  Settings, Server, FileText, CheckCircle, AlertTriangle, ShieldAlert, Activity
} from 'lucide-react';
import { generateTaxInvoicePDF } from '../../../utils/pdfGenerator';

const API_URL = 'http://localhost:3000/api/finance';

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-dark-floating flex items-center gap-3 text-sm font-semibold animate-bounce-in ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
  </div>
);

export const FinancePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [metrics, setMetrics] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [reconciliation, setReconciliation] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [metricsRes, payoutsRes, webhooksRes, settingsRes, reconRes] = await Promise.all([
        fetch(`${API_URL}/dashboard`),
        fetch(`${API_URL}/payouts`),
        fetch(`${API_URL}/webhooks`),
        fetch(`${API_URL}/settings`),
        fetch(`${API_URL}/reconciliation`)
      ]);
      
      if (!metricsRes.ok) throw new Error('Failed to fetch data from backend');
      
      setMetrics(await metricsRes.json());
      setPayouts(await payoutsRes.json());
      setWebhooks(await webhooksRes.json());
      setSettings(await settingsRes.json());
      if (reconRes.ok) setReconciliation(await reconRes.json());
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

  const handleToggleHold = async (id) => {
    try {
      const res = await fetch(`${API_URL}/payouts/${id}/hold`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to toggle hold');
      showToast('Payout hold status updated');
      fetchData();
    } catch (e) {
      showToast('Error updating hold status', 'error');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      showToast('Finance settings updated successfully');
      fetchData();
    } catch (e) {
      showToast('Error saving settings', 'error');
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
        <h1 className="text-2xl font-bold text-white">Financial Management</h1>
        <p className="text-sm text-admin-400 mt-1">Full Stack Integration · Live Data via NestJS</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-admin-900 p-1.5 rounded-2xl w-fit border border-admin-800 shadow-dark-elevated">
        {[['dashboard', 'Dashboard', TrendingUp], ['payouts', 'Settlements & Payouts', PoundSterling], ['reconciliation', 'Reconciliation', Activity], ['settings', 'Tax & Gateway Settings', Settings]].map(([key, label, Icon]) => (
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

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && metrics && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-admin-900 p-5 rounded-2xl border border-admin-800 shadow-dark-elevated">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center"><PoundSterling className="w-4 h-4" /></div>
                <h3 className="text-xs font-bold text-admin-500 uppercase tracking-wider">Platform Revenue</h3>
              </div>
              <p className="text-3xl font-black text-white">£{metrics.platformRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-admin-900 p-5 rounded-2xl border border-admin-800 shadow-dark-elevated">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div>
                <h3 className="text-xs font-bold text-admin-500 uppercase tracking-wider">Commission Earned</h3>
              </div>
              <p className="text-3xl font-black text-white">£{metrics.commissionEarned.toFixed(2)}</p>
            </div>
            <div className="bg-admin-900 p-5 rounded-2xl border border-admin-800 shadow-dark-elevated">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 flex items-center justify-center"><Clock className="w-4 h-4" /></div>
                <h3 className="text-xs font-bold text-admin-500 uppercase tracking-wider">Pending Payouts</h3>
              </div>
              <p className="text-3xl font-black text-white">£{metrics.pendingPayouts.toFixed(2)}</p>
            </div>
            <div className="bg-admin-900 p-5 rounded-2xl border border-admin-800 shadow-dark-elevated">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center"><CreditCard className="w-4 h-4" /></div>
                <h3 className="text-xs font-bold text-admin-500 uppercase tracking-wider">VAT Collected</h3>
              </div>
              <p className="text-3xl font-black text-white">£{metrics.vatCollected.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-admin-900 border border-admin-800 shadow-dark-elevated rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-admin-800 flex justify-between items-center bg-admin-950/50">
              <h2 className="font-bold text-white flex items-center gap-2"><Server className="w-5 h-5 text-admin-500" /> Gateway Logs (Live)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-admin-950 border-b border-admin-800 text-xs text-admin-500 uppercase tracking-widest font-black">
                  <tr>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Gateway ID</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-800/50">
                  {webhooks.map(wh => (
                    <tr key={wh.id} className="hover:bg-admin-800/30 transition-colors">
                      <td className="px-6 py-3">
                        <span className="font-mono text-[10px] bg-admin-800 text-admin-300 px-2 py-0.5 rounded border border-admin-700">{wh.event}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs text-admin-400 font-mono">{wh.id}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs text-admin-400">{new Date(wh.time).toLocaleString('en-GB')}</span>
                      </td>
                    </tr>
                  ))}
                  {webhooks.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-admin-500 font-medium">No gateway logs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-admin-900 border border-admin-800 shadow-dark-elevated rounded-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="px-6 py-4 border-b border-admin-800 flex justify-between items-center bg-admin-950/50 shrink-0">
              <h2 className="font-bold text-white">Vendor Settlements</h2>
              <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 shadow-glow transition-colors">
                Process Pending Now
              </button>
            </div>
            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-admin-950/90 backdrop-blur-md z-40 border-b border-admin-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Vendor</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Period</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Gross Sales</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Commission</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Net Payout</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-800/50">
                  {payouts.map(row => (
                    <tr key={row.id} className="hover:bg-admin-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white">{row.shop?.name || 'Unknown'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-admin-400">{new Date(row.periodStart).toLocaleDateString('en-GB')} - {new Date(row.periodEnd).toLocaleDateString('en-GB')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-white">£{row.grossAmount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-red-400">-£{row.commission.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-emerald-400">£{row.netAmount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {row.isHeld ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border bg-red-500/10 text-red-400 border-red-500/20">HELD</span>
                        ) : (
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                            row.status === 'PENDING' ? 'bg-saffron-500/10 text-saffron-400 border-saffron-500/20' :
                            row.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {row.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleToggleHold(row.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                              row.isHeld 
                                ? 'bg-admin-800 text-admin-300 border-admin-700 hover:bg-admin-700 hover:text-white' 
                                : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                            }`}
                          >
                            {row.isHeld ? 'Release' : 'Hold'}
                          </button>
                          <button 
                            onClick={() => {
                              generateTaxInvoicePDF(row, { name: row.shop?.name || 'Vendor', vatNumber: 'GB999888777' });
                              showToast(`Generating invoice...`);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-admin-950 border border-admin-800 rounded-lg text-xs font-bold text-admin-400 hover:text-white hover:bg-admin-800 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" /> PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {payouts.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-admin-500 font-medium">No vendor settlements found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reconciliation Tab */}
      {activeTab === 'reconciliation' && reconciliation && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-admin-800 pb-4">
              <h2 className="font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-brand-500" /> Payment Reconciliation</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                reconciliation.status === 'MATCHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {reconciliation.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-admin-950 rounded-xl border border-admin-800">
                <p className="text-xs font-bold text-admin-500 uppercase tracking-wider mb-2">System Total (Bookings)</p>
                <p className="text-2xl font-black text-white">£{reconciliation.systemTotal.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-admin-950 rounded-xl border border-admin-800">
                <p className="text-xs font-bold text-admin-500 uppercase tracking-wider mb-2">Gateway Total (Stripe)</p>
                <p className="text-2xl font-black text-white">£{reconciliation.gatewayTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-admin-800 rounded-xl bg-admin-900">
                <p className="text-xs text-admin-400 font-bold mb-1">Discrepancy</p>
                <p className={`text-xl font-black ${reconciliation.discrepancyAmount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>£{reconciliation.discrepancyAmount.toFixed(2)}</p>
              </div>
              <div className="p-4 border border-admin-800 rounded-xl bg-admin-900">
                <p className="text-xs text-admin-400 font-bold mb-1">Matched Txs</p>
                <p className="text-xl font-black text-white">{reconciliation.matchedTransactions}</p>
              </div>
              <div className="p-4 border border-admin-800 rounded-xl bg-admin-900">
                <p className="text-xs text-admin-400 font-bold mb-1">Unmatched Txs</p>
                <p className="text-xl font-black text-white">{reconciliation.unmatchedTransactions}</p>
              </div>
            </div>
            <p className="text-xs text-admin-500 text-right">Last Run: {new Date(reconciliation.lastRun).toLocaleString('en-GB')}</p>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && settings && (
        <div className="space-y-6 animate-fade-in">
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6 space-y-4">
              <h2 className="font-bold text-white border-b border-admin-800 pb-4">Tax Engine (VAT)</h2>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-admin-400 block mb-1">Standard Rate (%)</label>
                  <input type="number" step="0.1" value={settings.vatStandardRate} onChange={e => setSettings({...settings, vatStandardRate: parseFloat(e.target.value)})} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-admin-400 block mb-1">Reduced Rate (%)</label>
                  <input type="number" step="0.1" value={settings.vatReducedRate} onChange={e => setSettings({...settings, vatReducedRate: parseFloat(e.target.value)})} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-admin-400 block mb-1">Zero Rate (%)</label>
                  <input type="number" step="0.1" value={settings.vatZeroRate} onChange={e => setSettings({...settings, vatZeroRate: parseFloat(e.target.value)})} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 transition-colors" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer mt-4">
                <input type="checkbox" checked={settings.vatIsInclusive} onChange={e => setSettings({...settings, vatIsInclusive: e.target.checked})} className="w-5 h-5 accent-brand-500 bg-admin-950 border-admin-800 rounded" />
                <span className="text-sm font-semibold text-admin-300">Display prices as VAT Inclusive on storefront</span>
              </label>
            </div>

            <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6 space-y-4">
              <h2 className="font-bold text-white border-b border-admin-800 pb-4">Platform Fees & Gateway</h2>
              <div className="pt-2">
                <label className="text-xs font-bold text-admin-400 block mb-1">Platform Service Fee (Flat £ per order)</label>
                <input type="number" step="0.1" value={settings.platformFeeFlat} onChange={e => setSettings({...settings, platformFeeFlat: parseFloat(e.target.value)})} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-admin-400 block mb-1">Gateway Provider</label>
                  <select value={settings.activeProvider} onChange={e => setSettings({...settings, activeProvider: e.target.value})} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-semibold text-white outline-none focus:border-brand-500 transition-colors">
                    <option value="STRIPE">Stripe</option>
                    <option value="GOCARDLESS">GoCardless</option>
                    <option value="PAYPAL">PayPal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-admin-400 block mb-1">Environment</label>
                  <select value={settings.gatewayMode} onChange={e => setSettings({...settings, gatewayMode: e.target.value})} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-semibold text-white outline-none focus:border-brand-500 transition-colors">
                    <option value="SANDBOX">Sandbox (Testing)</option>
                    <option value="LIVE">Live (Production)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end pt-4">
              <button type="submit" className="px-6 py-3 bg-brand-500 text-white text-sm font-bold rounded-xl shadow-glow hover:bg-brand-600 transition-colors">
                Save Global Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
