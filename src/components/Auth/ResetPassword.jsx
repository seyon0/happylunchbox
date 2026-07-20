import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ResetPassword = () => {
  const { navigateTo } = useApp();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // In a real app we'd get the ?token= from the URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      // Mock API call
      // await authAPI.resetPassword(token, password);
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-6 relative">
        <div className="w-full max-w-md bg-white border border-cream-200 rounded-[2rem] p-8 shadow-card-elevated text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-heading text-2xl font-black text-ink-900 tracking-tight">Password Reset Successfully</h2>
          <p className="text-sm text-stone-500 font-medium">
            Your password has been securely updated. You can now sign in with your new credentials.
          </p>
          <button 
            onClick={() => navigateTo('landing')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-saffron-500 text-white font-heading font-extrabold text-xs shadow-md transition-all mt-4"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-6 relative">
      <button onClick={() => navigateTo('landing')} className="absolute top-6 left-6 inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-ink-900 transition-colors uppercase tracking-wider">
        <ArrowLeft className="w-3.5 h-3.5" /> Landing
      </button>

      <div className="w-full max-w-md bg-white border border-cream-200 rounded-[2rem] p-8 shadow-card-elevated space-y-6">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-black text-ink-900 tracking-tight">Reset Password</h2>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Create a new strong password for your account
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-9 pr-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-9 pr-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-saffron-500 text-white font-heading font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>
    </div>
  );
};
