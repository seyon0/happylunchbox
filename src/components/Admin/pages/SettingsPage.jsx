import React, { useState, useEffect } from 'react';
import { 
  Settings, Key, Globe, ShieldAlert, Download, 
  Save, CheckCircle, Database
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api/settings';

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-dark-floating flex items-center gap-3 text-sm font-semibold animate-bounce-in ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
  </div>
);

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('GENERAL');
  const [toast, setToast] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({});
  const [thirdPartyIntegrations, setThirdPartyIntegrations] = useState([]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const integrationsRes = await fetch(`${API_URL}/integrations`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      setSettings(await res.json());
      if (integrationsRes.ok) {
        setThirdPartyIntegrations(await integrationsRes.json());
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Cannot connect to backend API. Is NestJS running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (category, key, nestedField, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (!newSettings[category]) newSettings[category] = {};
      
      if (nestedField) {
        newSettings[category][key] = {
          ...newSettings[category][key],
          ...({ [nestedField]: value })
        };
      } else {
        newSettings[category][key] = value;
      }
      return newSettings;
    });
  };

  const handleSave = async (key, value) => {
    try {
      const res = await fetch(`${API_URL}/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      if (!res.ok) throw new Error('Save failed');
      showToast(`${key} updated successfully`);
    } catch (e) {
      showToast(`Error updating ${key}`, 'error');
    }
  };

  const toggleIntegration = async (name, currentActive) => {
    try {
      const newActive = !currentActive;
      const res = await fetch(`${API_URL}/integrations/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newActive })
      });
      if (res.ok) {
        setThirdPartyIntegrations(prev => prev.map(i => i.name === name ? { ...i, isActive: newActive } : i));
        showToast(`${name} ${newActive ? 'enabled' : 'disabled'}`);
      }
    } catch (err) {
      showToast(`Error toggling ${name}`, 'error');
    }
  };

  const handleBackup = () => {
    window.open(`${API_URL}/backup`, '_blank');
  };

  if (loading) return <div className="p-8 text-center text-admin-500 font-bold animate-pulse">Loading System Config...</div>;

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
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-sm text-admin-400 mt-1">Manage global system configurations and API keys</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-admin-900 p-1.5 rounded-2xl w-fit border border-admin-800 shadow-dark-elevated">
        {[['GENERAL', 'General', Settings], ['INTEGRATIONS', 'Integrations & API', Key], ['SEO', 'SEO & Legal', Globe], ['SYSTEM', 'System / Backup', Database]].map(([key, label, Icon]) => (
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

      {/* GENERAL TAB */}
      {activeTab === 'GENERAL' && settings.GENERAL && (
        <div className="space-y-6 animate-fade-in max-w-3xl">
          <div className="bg-admin-900 p-8 rounded-3xl shadow-dark-elevated border border-admin-800">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-admin-800 pb-4">Platform Identity</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-admin-400 mb-1">Platform Name</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={settings.GENERAL.platformName || ''}
                    onChange={(e) => handleChange('GENERAL', 'platformName', null, e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 transition-colors"
                  />
                  <button onClick={() => handleSave('platformName', settings.GENERAL.platformName)} className="px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 shadow-glow transition-colors"><Save className="w-4 h-4"/></button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-admin-400 mb-1">Contact Email</label>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    value={settings.GENERAL.contactEmail || ''}
                    onChange={(e) => handleChange('GENERAL', 'contactEmail', null, e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 transition-colors"
                  />
                  <button onClick={() => handleSave('contactEmail', settings.GENERAL.contactEmail)} className="px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 shadow-glow transition-colors"><Save className="w-4 h-4"/></button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-admin-400 mb-1">Region</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={settings.GENERAL.region || ''}
                    onChange={(e) => handleChange('GENERAL', 'region', null, e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 transition-colors"
                  />
                  <button onClick={() => handleSave('region', settings.GENERAL.region)} className="px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 shadow-glow transition-colors"><Save className="w-4 h-4"/></button>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-admin-400 mb-2">Maintenance Mode</label>
                <div className="flex gap-3 items-center">
                  <input 
                    type="checkbox" 
                    checked={settings.GENERAL.maintenanceMode || false}
                    onChange={(e) => {
                      handleChange('GENERAL', 'maintenanceMode', null, e.target.checked);
                      handleSave('maintenanceMode', e.target.checked);
                    }}
                    className="w-5 h-5 accent-brand-500 bg-admin-950 border-admin-800 rounded cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-admin-300">Enable (blocks customer access)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTEGRATIONS TAB */}
      {activeTab === 'INTEGRATIONS' && settings.INTEGRATIONS && (
        <div className="space-y-6 animate-fade-in max-w-3xl">
          <div className="bg-admin-900 p-8 rounded-3xl shadow-dark-elevated border border-admin-800">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-admin-800 pb-4 flex items-center justify-between">
              Payment Gateway Keys
              <button onClick={() => handleSave('paymentKeys', settings.INTEGRATIONS.paymentKeys)} className="px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 shadow-glow transition-colors flex items-center gap-2"><Save className="w-4 h-4"/> Save Gateway</button>
            </h2>
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-admin-400 mb-1 uppercase tracking-wider">Provider</label>
                  <select 
                    value={settings.INTEGRATIONS.paymentKeys?.provider || 'Stripe'}
                    onChange={(e) => handleChange('INTEGRATIONS', 'paymentKeys', 'provider', e.target.value)}
                    className="w-full px-4 py-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-semibold text-white outline-none focus:border-brand-500 transition-colors"
                  >
                    <option value="Stripe">Stripe</option>
                    <option value="Worldpay">Worldpay</option>
                    <option value="GoCardless">GoCardless</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-admin-400 mb-1 uppercase tracking-wider">Mode</label>
                  <select 
                    value={settings.INTEGRATIONS.paymentKeys?.mode || 'sandbox'}
                    onChange={(e) => handleChange('INTEGRATIONS', 'paymentKeys', 'mode', e.target.value)}
                    className="w-full px-4 py-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-semibold text-white outline-none focus:border-brand-500 transition-colors"
                  >
                    <option value="sandbox">Sandbox / Test</option>
                    <option value="live">Live / Production</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-admin-400 mb-1 uppercase tracking-wider">Public Key</label>
                <input 
                  type="text" 
                  value={settings.INTEGRATIONS.paymentKeys?.publicKey || ''}
                  onChange={(e) => handleChange('INTEGRATIONS', 'paymentKeys', 'publicKey', e.target.value)}
                  className="w-full px-4 py-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-mono text-white outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-admin-400 mb-1 uppercase tracking-wider">Secret Key</label>
                <input 
                  type="password" 
                  value={settings.INTEGRATIONS.paymentKeys?.secretKey || ''}
                  onChange={(e) => handleChange('INTEGRATIONS', 'paymentKeys', 'secretKey', e.target.value)}
                  className="w-full px-4 py-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-mono text-white outline-none focus:border-brand-500 transition-colors placeholder-admin-600"
                  placeholder="sk_test_..."
                />
              </div>
            </div>
          </div>

          <div className="bg-admin-900 p-8 rounded-3xl shadow-dark-elevated border border-admin-800 mt-6">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-admin-800 pb-4">
              Third-Party Integrations
            </h2>
            <div className="space-y-4">
              {thirdPartyIntegrations.map(integration => (
                <div key={integration.name} className="flex justify-between items-center p-4 bg-admin-950 border border-admin-800 rounded-xl">
                  <div>
                    <h3 className="text-sm font-bold text-white">{integration.name}</h3>
                    <p className="text-xs text-admin-400 font-medium">Status: {integration.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <button 
                    onClick={() => toggleIntegration(integration.name, integration.isActive)}
                    className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${integration.isActive ? 'bg-brand-500' : 'bg-admin-700'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${integration.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
              {thirdPartyIntegrations.length === 0 && (
                <p className="text-sm text-admin-500">No integrations found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO TAB */}
      {activeTab === 'SEO' && settings.SEO && (
        <div className="space-y-6 animate-fade-in max-w-3xl">
          <div className="bg-admin-900 p-8 rounded-3xl shadow-dark-elevated border border-admin-800">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-admin-800 pb-4 flex items-center justify-between">
              SEO Metadata
              <button onClick={() => handleSave('seoMeta', settings.SEO.seoMeta)} className="px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 shadow-glow transition-colors flex items-center gap-2"><Save className="w-4 h-4"/> Save SEO</button>
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-admin-400 mb-1 uppercase tracking-wider">Meta Title</label>
                <input 
                  type="text" 
                  value={settings.SEO.seoMeta?.title || ''}
                  onChange={(e) => handleChange('SEO', 'seoMeta', 'title', e.target.value)}
                  className="w-full px-4 py-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-admin-400 mb-1 uppercase tracking-wider">Meta Description</label>
                <textarea 
                  value={settings.SEO.seoMeta?.description || ''}
                  onChange={(e) => handleChange('SEO', 'seoMeta', 'description', e.target.value)}
                  className="w-full px-4 py-3 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white h-32 outline-none focus:border-brand-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SYSTEM TAB */}
      {activeTab === 'SYSTEM' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-admin-900 p-8 rounded-3xl shadow-dark-elevated border border-admin-800 text-center max-w-3xl">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Database className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Platform Data Backup</h2>
            <p className="text-admin-400 max-w-md mx-auto mb-8 text-sm">Download a full JSON dump of the platform settings, users, and core configuration data for Disaster Recovery.</p>
            
            <button onClick={handleBackup} className="px-8 py-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 shadow-glow transition-colors flex items-center justify-center gap-3 mx-auto">
              <Download className="w-5 h-5" /> Generate & Download Backup
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
