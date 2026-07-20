import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export const Step2_DocumentUpload = ({ documents, setDocuments, onNext, onBack }) => {
  const reqDocs = [
    { id: 'companyRegistration', label: 'Company Registration', desc: 'Companies House number or sole-trader UTR', required: true },
    { id: 'foodHygieneRating', label: 'Food Hygiene Rating', desc: 'FSA FHRS certificate/number', required: true },
    { id: 'proofOfOwnership', label: 'Proof of Ownership', desc: 'Lease agreement or utility bill', required: true },
    { id: 'bankProof', label: 'Bank Proof', desc: 'Voided cheque equivalent / bank letter', required: true },
    { id: 'vatRegistration', label: 'VAT Registration', desc: 'Required if VAT-registered', required: false },
    { id: 'sampleMenu', label: 'Sample Menu', desc: 'PDF or image of your current menu', required: true },
  ];

  const handleFileUpload = (id, file) => {
    // In Phase 2 this will upload to S3/Cloud Storage. 
    // For Phase 1 (MVP) we just mock it in state.
    setDocuments(prev => ({ ...prev, [id]: file.name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const missing = reqDocs.filter(d => d.required && !documents[d.id]);
    if (missing.length > 0) {
      alert(`Please upload all required documents. Missing: ${missing.map(m => m.label).join(', ')}`);
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start gap-3 mb-6">
        <AlertCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-brand-800">
          All documents are required for manual verification by our compliance team. Files must be clear and legible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reqDocs.map(doc => {
          const isUploaded = !!documents[doc.id];
          return (
            <div key={doc.id} className={`border rounded-2xl p-5 transition-all ${isUploaded ? 'bg-fresh-50 border-fresh-200' : 'bg-white border-cream-200'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-sm text-ink-900 flex items-center gap-2">
                    {doc.label} {doc.required && <span className="text-red-500">*</span>}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">{doc.desc}</p>
                </div>
                {isUploaded && <CheckCircle className="w-5 h-5 text-fresh-600 shrink-0" />}
              </div>
              
              {!isUploaded ? (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-cream-300 rounded-xl cursor-pointer hover:bg-cream-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-6 h-6 text-stone-400 mb-2" />
                    <p className="text-xs font-bold text-stone-600">Click to upload</p>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(doc.id, e.target.files[0])} />
                </label>
              ) : (
                <div className="flex items-center gap-2 bg-white border border-fresh-100 p-2 rounded-lg">
                  <FileText className="w-4 h-4 text-fresh-600" />
                  <span className="text-xs font-bold text-fresh-700 truncate">{documents[doc.id]}</span>
                  <button type="button" onClick={() => handleFileUpload(doc.id, null)} className="ml-auto text-[10px] text-red-500 font-bold uppercase hover:underline">Remove</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          type="button" 
          onClick={onBack}
          className="w-1/3 py-4 rounded-xl bg-white border border-cream-200 hover:bg-cream-50 text-stone-600 font-heading font-bold text-sm uppercase tracking-wider transition-all"
        >
          Back
        </button>
        <button 
          type="submit" 
          className="w-2/3 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-black text-sm uppercase tracking-wider shadow-md transition-all"
        >
          Submit for Review
        </button>
      </div>
    </form>
  );
};
