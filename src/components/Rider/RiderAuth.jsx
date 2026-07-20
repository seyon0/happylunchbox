import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authAPI } from '../../services/api';
import { Truck, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export const RiderAuth = () => {
  const { navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login(email, password);
      // Validate role
      if (res.user.role !== 'RIDER') {
        authAPI.logout();
        setError('Unauthorized: Account is not a registered Rider.');
        setLoading(false);
        return;
      }
      navigateTo('rider-dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 50%, #111827 100%)' }}
    >
      {/* Back link */}
      <button
        onClick={() => navigateTo('landing')}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-white transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </button>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #22c55e, transparent)', transform: 'translate(30%, -30%)' }}
      />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translate(-30%, 30%)' }}
      />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo / Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
          >
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading text-4xl font-black text-white tracking-tight">Rider Portal</h1>
          <p className="text-stone-400 text-sm font-medium mt-1">Healthy Lunchbox Delivery Network</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 shadow-2xl border border-white/10"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="raj@rider.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm font-medium text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm font-medium text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-heading font-extrabold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: loading ? '#166534' : 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing In...
                </span>
              ) : (
                <>
                  Sign In as Rider
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-stone-500 mt-6 font-medium">
            Authorized delivery partners only
          </p>
        </div>
      </div>
    </div>
  );
};
