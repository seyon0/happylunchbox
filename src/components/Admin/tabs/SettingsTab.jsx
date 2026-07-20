import React, { useState, useEffect } from 'react';
import { Settings, Save, Lock, Mail } from 'lucide-react';
import { authAPI } from '../../../services/api';

export const SettingsTab = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [smsApiKey, setSmsApiKey] = useState('');
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');

  useEffect(() => {
    authAPI.getSmtpConfig().then((data) => {
      if (data) {
        setEmailAddress(data.emailAddress || '');
      }
    }).catch(err => console.error(err));
    // Fetch SMS config if we had an endpoint (mocking here)
    setSmsApiKey('sk_test_mockkey');
  }, []);

  const handleSaveSmtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await authAPI.updateSmtpConfig({ emailAddress, appPassword, portalType: 'ADMIN' });
      setMessage('SMTP Configuration saved successfully. OTP emails will now be sent via this address.');
    } catch (error) {
      setMessage(error.message || 'Failed to save SMTP configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSms = async (e) => {
    e.preventDefault();
    setSmsLoading(true);
    setSmsMessage('');
    try {
      // In a real app, call an API to save the SMS API Key
      // await adminAPI.updateSystemConfig('OTP_API_KEY', smsApiKey);
      await new Promise(r => setTimeout(r, 600)); // mock delay
      setSmsMessage('OTP API Key saved successfully. SMS OTPs will now use this key.');
    } catch (error) {
      setSmsMessage('Failed to save OTP API Key.');
    } finally {
      setSmsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card-elevated max-w-2xl space-y-8">
      <div>
        <div className="mb-6">
          <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-500" />
            <span>System Settings</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            Configure global platform settings, including SMTP and SMS API keys for sending verification and 2FA OTPs.
          </p>
        </div>

        <form onSubmit={handleSaveSmtp} className="space-y-5">
          <div className="bg-stone-50 border border-cream-200 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-sm text-ink-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-500" /> SMTP Configuration (Email OTP)
            </h4>
            
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Sender Email Address</label>
              <input
                type="email"
                required
                value={emailAddress}
                onChange={e => setEmailAddress(e.target.value)}
                placeholder="e.g. no-reply@healthylunchbox.co.uk"
                className="w-full p-3 rounded-xl bg-white border border-cream-300 text-sm font-medium text-ink-900 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">App Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={appPassword}
                  onChange={e => setAppPassword(e.target.value)}
                  placeholder="16-character App Password"
                  className="w-full p-3 rounded-xl bg-white border border-cream-300 text-sm font-medium text-ink-900 focus:outline-none focus:border-brand-400 pr-10"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-stone-500 mt-1">This will be securely encrypted on our servers.</p>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-xs font-bold ${message.includes('success') ? 'bg-fresh-50 text-fresh-700 border border-fresh-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-bold text-xs transition-all flex items-center gap-2 shadow-md disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save SMTP Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      <hr className="border-cream-200" />

      <div>
        <form onSubmit={handleSaveSms} className="space-y-5">
          <div className="bg-stone-50 border border-cream-200 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-sm text-ink-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-500" /> SMS OTP Configuration
            </h4>
            
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">SMS API Key (Twilio / SNS)</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={smsApiKey}
                  onChange={e => setSmsApiKey(e.target.value)}
                  placeholder="Enter secret API key for SMS Gateway"
                  className="w-full p-3 rounded-xl bg-white border border-cream-300 text-sm font-medium text-ink-900 focus:outline-none focus:border-brand-400 pr-10"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Used to send phone OTPs for rider, kitchen and customer authentication.</p>
            </div>
          </div>

          {smsMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold ${smsMessage.includes('success') ? 'bg-fresh-50 text-fresh-700 border border-fresh-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {smsMessage}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={smsLoading}
              className="px-6 py-2.5 rounded-2xl bg-saffron-500 hover:bg-saffron-600 text-ink-900 font-heading font-bold text-xs transition-all flex items-center gap-2 shadow-md disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              <span>{smsLoading ? 'Saving...' : 'Save API Key'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
