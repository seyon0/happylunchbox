import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Handshake, ShieldCheck, DollarSign, Store } from 'lucide-react';

export const Partnership = () => {
  const { navigateTo } = useApp();
  return (
    <div className="min-h-screen bg-[#FDFDFB] text-slate-800 flex flex-col font-sans py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <button onClick={() => navigateTo('landing')} className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-ink-900 transition-colors uppercase tracking-wider">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>

        <div className="space-y-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-saffron-50 text-saffron-500 flex items-center justify-center mb-2 mx-auto sm:mx-0">
            <Handshake className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-4xl font-black text-ink-900 tracking-tight">Partner with Jaffna Roots</h1>
          <p className="text-stone-500 text-sm font-medium">Turn your culinary passion into a successful local business.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl space-y-2">
            <ShieldCheck className="w-6 h-6 text-brand-500" />
            <h4 className="font-heading font-extrabold text-sm text-ink-900">Platform Verification</h4>
            <p className="text-xs text-stone-500 leading-relaxed font-medium">We verify all kitchens, providing a badge of trust that attracts local corporate subscriptions.</p>
          </div>
          <div className="bg-white border border-stone-200 p-6 rounded-3xl space-y-2">
            <DollarSign className="w-6 h-6 text-brand-500" />
            <h4 className="font-heading font-extrabold text-sm text-ink-900">Direct UPI Payouts</h4>
            <p className="text-xs text-stone-500 leading-relaxed font-medium">Register your UPI credentials to receive automatic platform commission payouts instantly.</p>
          </div>
        </div>

        <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-extrabold text-base text-ink-900">Ready to start?</h3>
            <p className="text-xs text-stone-500 font-medium">Register your kitchen portal account and request verification.</p>
          </div>
          <button 
            onClick={() => navigateTo('shop-auth')} 
            className="px-5 py-3 rounded-2xl bg-ink-900 text-white text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 shrink-0"
          >
            <Store className="w-4 h-4" /> Register Kitchen
          </button>
        </div>
      </div>
    </div>
  );
};
