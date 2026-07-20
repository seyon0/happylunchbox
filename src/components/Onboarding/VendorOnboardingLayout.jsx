import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VendorOnboardingLayout = ({ children, currentStep, totalSteps, title, subtitle }) => {
  const { navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('landing')} className="text-stone-500 hover:text-ink-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-black text-xl text-ink-900">Partner Onboarding</h1>
            <p className="text-xs font-bold text-stone-500">Become a Kitchen Partner</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-6 md:p-10 z-10 relative">
        {/* Stepper */}
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-cream-200 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 rounded-full z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
          
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <div 
                key={stepNum} 
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted ? 'bg-brand-500 text-white shadow-glow' : 
                  isActive ? 'bg-white border-2 border-brand-500 text-brand-500' : 'bg-white border-2 border-cream-200 text-stone-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2rem] border border-cream-200 p-8 shadow-card-elevated">
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-black text-ink-900">{title}</h2>
            <p className="text-sm font-medium text-stone-500 mt-2">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};
