import React from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const Step3_StatusTracker = ({ status, rejectionReason, onResubmit, onProceedToContract }) => {
  // status: 'submitted', 'underReview', 'approved', 'rejected'
  
  const getStatusUI = () => {
    switch(status) {
      case 'submitted':
      case 'underReview':
        return {
          icon: Clock,
          color: 'text-saffron-500',
          bg: 'bg-saffron-50',
          border: 'border-saffron-200',
          title: 'Under Manual Review',
          desc: 'Our compliance team is currently reviewing your documents. This usually takes 1-2 business days. We will notify you via email once approved.'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-fresh-600',
          bg: 'bg-fresh-50',
          border: 'border-fresh-200',
          title: 'Application Approved!',
          desc: 'Congratulations! Your kitchen has been verified. Please proceed to sign the digital contract to activate your account.'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bg: 'bg-red-50',
          border: 'border-red-200',
          title: 'Action Required',
          desc: 'Your application requires attention before we can approve it.'
        };
      default:
        return {
          icon: Clock,
          color: 'text-stone-500',
          bg: 'bg-stone-50',
          border: 'border-stone-200',
          title: 'Status Unknown',
          desc: 'Please contact support.'
        };
    }
  };

  const ui = getStatusUI();
  const Icon = ui.icon;

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center ${ui.bg} ${ui.border} border-4`}>
        <Icon className={`w-12 h-12 ${ui.color}`} />
      </div>
      
      <div>
        <h2 className="font-heading text-2xl font-black text-ink-900 mb-2">{ui.title}</h2>
        <p className="text-sm font-medium text-stone-500 max-w-md mx-auto">{ui.desc}</p>
      </div>

      {status === 'rejected' && (
        <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-xl p-5 text-left mt-6">
          <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Reason for Rejection
          </h3>
          <p className="text-sm font-medium text-red-900">{rejectionReason || 'Documents missing or unclear.'}</p>
          <button 
            onClick={onResubmit}
            className="mt-4 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-xs font-bold shadow-sm hover:bg-red-50 transition-colors"
          >
            Update Application
          </button>
        </div>
      )}

      {status === 'approved' && (
        <button 
          onClick={onProceedToContract}
          className="mt-8 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-heading font-black text-sm uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
        >
          View & Sign Contract <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* MOCK CONTROLS (Remove in production) */}
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs flex gap-2 z-50">
        <span className="font-bold mr-2">Dev Mock:</span>
        <button className="underline" onClick={() => window.dispatchEvent(new CustomEvent('mock-status', {detail:'approved'}))}>Approve</button>
        <button className="underline" onClick={() => window.dispatchEvent(new CustomEvent('mock-status', {detail:'rejected'}))}>Reject</button>
      </div>
    </div>
  );
};
