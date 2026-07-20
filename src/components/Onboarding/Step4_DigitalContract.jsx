import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FileSignature, RotateCcw } from 'lucide-react';

export const Step4_DigitalContract = ({ onNext }) => {
  const sigCanvas = useRef();
  const [error, setError] = useState('');

  const handleClear = () => {
    sigCanvas.current.clear();
    setError('');
  };

  const handleSign = (e) => {
    e.preventDefault();
    if (sigCanvas.current.isEmpty()) {
      setError('Please draw your signature to accept the agreement.');
      return;
    }
    // const signatureDataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    // We would normally save this to the backend
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="bg-cream-50 border border-cream-200 rounded-xl p-6 h-64 overflow-y-auto custom-scrollbar text-sm text-stone-700 space-y-4">
        <h3 className="font-heading font-black text-lg text-ink-900">Partner Agreement</h3>
        <p>This Digital Contract ("Agreement") is entered into between Healthy Lunchbox Ltd ("Platform") and the registered Kitchen Partner ("Vendor").</p>
        
        <h4 className="font-bold text-ink-900 mt-4">1. Commission & Fees</h4>
        <p>The Platform will charge a flat commission rate of <strong>15%</strong> on the gross order value (excluding VAT and delivery fees, unless otherwise specified) for all successful orders processed through the Platform.</p>
        
        <h4 className="font-bold text-ink-900 mt-4">2. Payout Cycle</h4>
        <p>Payouts will be processed on a <strong>weekly cycle (every Tuesday)</strong> for all delivered orders from the previous Monday-Sunday period. Funds will be remitted to the verified bank account or UPI ID provided.</p>
        
        <h4 className="font-bold text-ink-900 mt-4">3. Quality & Safety</h4>
        <p>The Vendor agrees to maintain all necessary food safety standards, including a valid FSA rating of 3 or higher. The Platform reserves the right to suspend accounts failing to meet quality standards.</p>
        
        <h4 className="font-bold text-ink-900 mt-4">4. Cancellations</h4>
        <p>The Vendor must adhere to the 24-hour cutoff time for order preparation. Unjustified cancellations may incur penalties as outlined in the full Terms of Service.</p>
      </div>

      <div>
        <label className="text-xs font-bold text-stone-700 block mb-2 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2"><FileSignature className="w-4 h-4" /> Draw E-Signature</span>
          <button type="button" onClick={handleClear} className="text-[10px] text-stone-400 hover:text-stone-600 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        </label>
        
        <div className="border-2 border-dashed border-cream-300 rounded-xl bg-white overflow-hidden">
          <SignatureCanvas 
            ref={sigCanvas} 
            canvasProps={{ className: 'w-full h-40 cursor-crosshair' }} 
            backgroundColor="white"
          />
        </div>
        {error && <p className="text-xs text-red-500 font-bold mt-2">{error}</p>}
      </div>

      <button 
        onClick={handleSign}
        className="w-full py-4 rounded-xl bg-ink-900 hover:bg-ink-800 text-white font-heading font-black text-sm uppercase tracking-wider shadow-md transition-all mt-8"
      >
        I Agree & Sign Contract
      </button>
    </div>
  );
};
