import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutUs = () => {
  const { navigateTo } = useApp();
  return (
    <div className="min-h-screen bg-[#FDFDFB] text-slate-800 flex flex-col font-sans py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <button onClick={() => navigateTo('landing')} className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-ink-900 transition-colors uppercase tracking-wider">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
        <div className="space-y-4">
          <h1 className="font-heading text-4xl font-black text-ink-900 tracking-tight">About Jaffna Roots</h1>
          <p className="text-stone-500 text-sm leading-relaxed font-medium">
            Jaffna Roots is a home-cooked meal service bringing traditional cuisine straight to the tables of busy students and working professionals in the United Kingdom.
          </p>
        </div>
        <div className="border-t border-stone-200 pt-6 space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-ink-900">Why Jaffna Roots?</h3>
          <ul className="space-y-3 text-xs text-stone-500 font-medium">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <span><strong>Verified Local Cooks:</strong> All kitchens undergo strict hygiene and quality audits by our admin team before listing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <span><strong>Pure Traditional Taste:</strong> Authentic ingredients prepared using generational family recipes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <span><strong>Platform Managed Delivery:</strong> We supervise direct driver dispatches to guarantee freshness and hot deliveries.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
