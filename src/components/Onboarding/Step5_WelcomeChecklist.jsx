import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PartyPopper, ChevronRight } from 'lucide-react';

export const Step5_WelcomeChecklist = () => {
  const { navigateTo } = useApp();
  const [checklist, setChecklist] = useState({
    menu: false,
    hours: false,
    bankDetails: false,
    firstItemPhoto: false
  });

  const toggleCheck = (key) => setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  const allChecked = Object.values(checklist).every(Boolean);

  const handleGoToDashboard = () => {
    // Save completion state or update backend onboarding status to 'LIVE'
    navigateTo('shop-dashboard', true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <PartyPopper className="w-8 h-8 text-brand-600" />
        </div>
        <h3 className="font-heading font-black text-xl text-ink-900">You're Officially a Partner!</h3>
        <p className="text-sm text-stone-500 font-medium max-w-sm mx-auto mt-2">
          Before you can start receiving orders, complete these final setup tasks.
        </p>
      </div>

      <div className="space-y-3">
        {[
          { key: 'menu', label: 'Create your first menu item', desc: 'Add at least one dish with price and description' },
          { key: 'firstItemPhoto', label: 'Upload a menu photo', desc: 'Dishes with photos get 3x more orders' },
          { key: 'hours', label: 'Set operating hours', desc: 'Configure when you accept and deliver orders' },
          { key: 'bankDetails', label: 'Add payout details', desc: 'Provide your UPI ID or bank account in settings' },
        ].map(item => (
          <label 
            key={item.key} 
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              checklist[item.key] ? 'bg-brand-50 border-brand-500' : 'bg-white border-cream-200 hover:border-brand-300'
            }`}
          >
            <div className="pt-0.5">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-cream-300 text-brand-500 focus:ring-brand-500 cursor-pointer" 
                checked={checklist[item.key]}
                onChange={() => toggleCheck(item.key)}
              />
            </div>
            <div>
              <p className={`font-bold text-sm ${checklist[item.key] ? 'text-brand-900' : 'text-ink-900'}`}>{item.label}</p>
              <p className="text-xs font-medium text-stone-500">{item.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <button 
        disabled={!allChecked}
        onClick={handleGoToDashboard}
        className="w-full py-4 rounded-xl bg-saffron-500 hover:bg-saffron-600 disabled:bg-cream-200 disabled:text-stone-400 text-white font-heading font-black text-sm uppercase tracking-wider shadow-md transition-all mt-8 flex items-center justify-center gap-2"
      >
        Go to Kitchen Dashboard <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
