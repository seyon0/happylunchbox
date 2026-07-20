import React, { useState, useEffect } from 'react';
import { AlertOctagon, CheckCircle2, MessageSquare, DollarSign } from 'lucide-react';
import { adminAPI } from '../../../services/api';

export const DisputesTab = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolvingId, setResolvingId] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSupportTickets(1, 100);
      setDisputes(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load disputes');
      setLoading(false);
    }
  };

  const handleResolve = async (id, newStatus) => {
    try {
      const ticket = disputes.find(d => d.id === id);
      const updatedMessages = Array.isArray(ticket.messages) ? [...ticket.messages] : [];
      if (adminResponse) {
        updatedMessages.push({ from: 'admin', text: adminResponse, time: new Date().toISOString() });
      }

      await adminAPI.updateTicket(id, { 
        status: newStatus === 'resolved' ? 'RESOLVED' : newStatus === 'rejected' ? 'CLOSED' : 'IN_PROGRESS', 
        messages: updatedMessages 
      });

      setDisputes(disputes.map(d => d.id === id ? { 
        ...d, 
        status: newStatus === 'resolved' ? 'RESOLVED' : 'CLOSED', 
        messages: updatedMessages,
        refund_issued: parseFloat(refundAmount) || 0 // Frontend only display
      } : d));
      
      setResolvingId(null);
      setAdminResponse('');
      setRefundAmount(0);
    } catch (err) {
      console.error(err);
      alert('Failed to resolve dispute');
    }
  };

  const statusColors = {
    open: 'bg-red-100 text-red-700',
    reviewing: 'bg-saffron-100 text-saffron-700',
    resolved: 'bg-fresh-100 text-fresh-700',
    rejected: 'bg-stone-100 text-stone-600'
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-500" />
          Dispute Resolution
        </h3>
        <p className="text-sm text-stone-500">Manage customer complaints and refunds</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-stone-400">Loading disputes...</div>
        ) : disputes.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-stone-400">No disputes found.</div>
        ) : disputes.map(dispute => {
          const isBreached = dispute.isEscalated || (dispute.slaDeadline && new Date(dispute.slaDeadline) < new Date() && (dispute.status === 'OPEN' || dispute.status === 'IN_PROGRESS' || dispute.status === 'open'));
          
          return (
          <div key={dispute.id} className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col ${isBreached ? 'border-red-500 shadow-red-100 ring-2 ring-red-500/50' : 'border-cream-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${statusColors[(dispute.status || 'open').toLowerCase()] || statusColors.open}`}>
                  {dispute.status}
                </span>
                {isBreached && <span className="ml-2 inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 bg-red-600 text-white animate-pulse">ESCALATED</span>}
                <h4 className="font-bold text-ink-900">{dispute.subject || `Ticket ${dispute.id.slice(-6)}`}</h4>
                <p className="text-xs text-stone-500">{dispute.user?.firstName || dispute.user_name || 'Customer'}</p>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                {(dispute.reason || dispute.priority || 'NORMAL').replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="bg-cream-50 p-3 rounded-xl mb-4 text-sm text-stone-700 flex-1">
              <p className="font-bold text-xs text-stone-400 mb-1">Customer Message</p>
              "{Array.isArray(dispute.messages) && dispute.messages.length > 0 ? dispute.messages[0].text || dispute.description : dispute.description || 'No description provided'}"
            </div>

            {dispute.status === 'open' || dispute.status === 'reviewing' || dispute.status === 'OPEN' || dispute.status === 'IN_PROGRESS' ? (
              <div className="mt-auto border-t border-cream-100 pt-4">
                {resolvingId === dispute.id ? (
                  <div className="space-y-3">
                    <textarea 
                      placeholder="Admin response to customer..."
                      value={adminResponse}
                      onChange={e => setAdminResponse(e.target.value)}
                      className="w-full p-2 bg-cream-50 border border-cream-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                      rows={2}
                    />
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <DollarSign className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input 
                          type="number" 
                          placeholder="Refund Amount (£)"
                          value={refundAmount}
                          onChange={e => setRefundAmount(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setResolvingId(null)} className="flex-1 py-2 text-xs font-bold text-stone-500 bg-stone-100 rounded-lg hover:bg-stone-200">Cancel</button>
                      <button onClick={() => handleResolve(dispute.id, 'rejected')} className="flex-1 py-2 text-xs font-bold text-white bg-stone-500 rounded-lg hover:bg-stone-600">Reject</button>
                      <button onClick={() => handleResolve(dispute.id, 'resolved')} className="flex-1 py-2 text-xs font-bold text-white bg-fresh-500 rounded-lg hover:bg-fresh-600">Resolve & Refund</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setResolvingId(dispute.id)}
                    className="w-full py-2 bg-brand-50 text-brand-600 font-bold text-sm rounded-xl hover:bg-brand-100 transition-colors"
                  >
                    Take Action
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-auto border-t border-cream-100 pt-4 space-y-2">
                <div className="flex items-start gap-2 text-sm text-stone-600">
                  <MessageSquare className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                  <p><strong>Response:</strong> {
                    Array.isArray(dispute.messages) && dispute.messages.find(m => m.from === 'admin') 
                      ? dispute.messages.find(m => m.from === 'admin').text 
                      : dispute.admin_response || 'No message provided.'
                  }</p>
                </div>
                {parseFloat(dispute.refund_issued || 0) > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-fresh-600 font-bold bg-fresh-50 p-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    Refund Issued: £{dispute.refund_issued}
                  </div>
                )}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
};
