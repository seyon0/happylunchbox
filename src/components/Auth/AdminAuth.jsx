import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { saveUser } from '../../services/api';

export const AdminAuth = () => {
  const { navigateTo, setIsLoggedIn, setUser, setIsAdminMode } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@gmail.com' && password === '12345678') {
        const adminUser = {
          id: 'admin-id',
          username: 'admin',
          email: 'admin@gmail.com',
          first_name: 'System',
          last_name: 'Administrator',
          user_type: 'admin',
          is_verified: true,
          is_admin_mode: true
        };
        saveUser(adminUser);
        setUser(adminUser);
        setIsLoggedIn(true);
        setIsAdminMode(true);
        navigateTo('admin', true);
      } else {
        setError('Unauthorized administrator credentials.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-6 relative">
      <button onClick={() => navigateTo('landing')} className="absolute top-6 left-6 inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-ink-900 transition-colors uppercase tracking-wider">
        <ArrowLeft className="w-3.5 h-3.5" /> Landing
      </button>

      <div className="w-full max-w-md bg-white border border-cream-200 rounded-[2rem] p-8 shadow-card-elevated space-y-6">
        <div className="text-center">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="font-heading text-3xl font-black text-ink-900 tracking-tight">Admin Console</h2>
          <p className="text-xs text-stone-500 font-medium mt-1">Authorized access only</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@gmail.com" 
                className="w-full pl-9 pr-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Security Password</label>
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
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>
    </div>
  );
};
