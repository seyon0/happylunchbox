import React, { useState, useEffect } from 'react';
import { DollarSign, Download, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

import { adminAPI } from '../../../services/api';

export const SettlementsTab = () => {
  const { bookings } = useApp();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExportCSV = () => {
    if (!payouts || payouts.length === 0) return alert('No payouts to export');
    let csv = 'Payout ID,Date,Destination,Amount,Status\n';
    payouts.forEach(p => {
      const pDate = (p.triggeredAt || p.createdAt || new Date().toISOString()).slice(0, 10);
      if (startDate && pDate < startDate) return;
      if (endDate && pDate > endDate) return;
      
      const destination = (p.shop?.name || 'Bank Transfer (BACS)').replace(/,/g, '');
      const amount = parseFloat(p.amount || 0).toFixed(2);
      
      csv += `${p.id},${pDate},${destination},${amount},${p.status}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payouts_export_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    adminAPI.getPayouts(1, 100).then(res => {
      setPayouts(res.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
  
  // Calculate mock settlement logic based on bookings for top level stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.totalAmount || b.totalPrice || b.total_price) || 0), 0);
  const platformFeePercentage = 15; // 15% platform fee
  const platformFees = totalRevenue * (platformFeePercentage / 100);
  const totalPayout = totalRevenue - platformFees;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Financial Settlements
        </h3>
        <p className="text-sm text-stone-500">Manage earnings, platform fees, and bank payouts</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-cream-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-stone-400" />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border border-cream-200 rounded-lg text-sm bg-cream-50 focus:outline-none focus:border-brand-500" />
          <span className="text-stone-400">to</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border border-cream-200 rounded-lg text-sm bg-cream-50 focus:outline-none focus:border-brand-500" />
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-stone-800 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">Gross Revenue</span>
          <span className="font-heading font-extrabold text-3xl text-ink-900">£{totalRevenue.toFixed(2)}</span>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-fresh-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8.4% this week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">Platform Fees ({platformFeePercentage}%)</span>
          <span className="font-heading font-extrabold text-3xl text-stone-600">£{platformFees.toFixed(2)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-green-200 shadow-sm flex flex-col justify-center bg-green-50">
          <span className="text-xs font-bold uppercase tracking-wider text-green-700 block mb-1">Net Earnings (Pending)</span>
          <span className="font-heading font-extrabold text-3xl text-green-600">£{totalPayout.toFixed(2)}</span>
          <button className="mt-3 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold shadow-sm self-start">
            Request Early Payout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-cream-200 flex items-center justify-between">
          <h4 className="font-heading font-extrabold text-lg text-ink-900">Payout History</h4>
        </div>
        
        <div className="divide-y divide-cream-100">
          {loading ? (
            <div className="p-5 text-center text-stone-400 text-sm">Loading payouts...</div>
          ) : payouts.length === 0 ? (
            <div className="p-5 text-center text-stone-400 text-sm">No payouts found.</div>
          ) : payouts.map(payout => (
            <div key={payout.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-heading font-extrabold text-sm text-ink-900">{payout.id.slice(-8)}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    payout.status === 'PAID' ? 'bg-fresh-100 text-fresh-700' : 'bg-saffron-100 text-saffron-700'
                  }`}>
                    {payout.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {(payout.triggeredAt || payout.createdAt || new Date().toISOString()).slice(0, 10)}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {payout.shop?.name || 'Bank Transfer (BACS)'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-heading font-extrabold text-xl text-ink-900 block">£{parseFloat(payout.amount || 0).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
