import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';

export const Inquiry = () => {
  const { navigateTo } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMsg('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-slate-800 flex flex-col font-sans py-16 px-6">
      <div className="max-w-md mx-auto w-full space-y-8">
        <button onClick={() => navigateTo('landing')} className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-ink-900 transition-colors uppercase tracking-wider">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>

        <div className="text-center">
          <h1 className="font-heading text-3xl font-black text-ink-900 tracking-tight">Platform Inquiries</h1>
          <p className="text-stone-500 text-xs mt-1 font-medium">Submit your feedback, support requests, or feature requests</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 p-8 rounded-3xl shadow-sm space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Your Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe" 
              className="w-full p-3 rounded-xl bg-stone-50 border border-transparent text-xs font-medium focus:bg-white focus:border-brand-500 focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john@example.com" 
              className="w-full p-3 rounded-xl bg-stone-50 border border-transparent text-xs font-medium focus:bg-white focus:border-brand-500 focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Message</label>
            <textarea 
              rows={4}
              required
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="How can we assist you?" 
              className="w-full p-3 rounded-xl bg-stone-50 border border-transparent text-xs font-medium focus:bg-white focus:border-brand-500 focus:outline-none" 
            />
          </div>
          {submitted ? (
            <div className="p-3 bg-fresh-50 border border-fresh-200 text-fresh-700 rounded-xl text-xs flex items-center justify-center gap-1.5 font-bold">
              <CheckCircle className="w-4 h-4" /> Inquiry Submitted successfully!
            </div>
          ) : (
            <button 
              type="submit" 
              className="w-full py-3 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Submit Inquiry
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
