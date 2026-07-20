import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, List, AlertTriangle, ShieldAlert, CheckCircle2, 
  RefreshCcw, Ban, PoundSterling, Clock, User, Bike, Store, MapPin
} from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-dark-floating flex items-center gap-3 text-sm font-semibold animate-bounce-in ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
  </div>
);

export const OrderDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('audit');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [order, setOrder] = useState({
    id: id || 'HL-1998',
    status: 'DELAYED',
    customer: 'Ben Carter',
    vendor: 'Spice Garden',
    rider: 'Raj Kumar',
    amount: 24.50,
    items: ['Chicken Curry + Rice', 'Mango Lassi'],
    payment: 'Stripe Card',
    disputeFiled: false,
    disputeTag: '',
    disputeNotes: ''
  });

  const auditTimeline = [
    { step: 'Order Placed', time: '12:05 PM', actor: 'System', done: true },
    { step: 'Confirmed by Vendor', time: '12:07 PM', actor: 'Vendor (Spice Garden)', done: true },
    { step: 'Rider Assigned', time: '12:15 PM', actor: 'System (Nearest)', done: true },
    { step: 'Flagged Delayed (>15m at pickup)', time: '12:45 PM', actor: 'System Alert', done: true, isError: true },
    { step: 'Delivered', time: '—', actor: 'Pending', done: false },
  ];

  const handleIntervention = (action) => {
    let msg = '';
    if (action === 'reassign') msg = 'Rider reassignment requested to closest available agent.';
    if (action === 'cancel') {
      msg = 'Order forcefully cancelled. Notification dispatched.';
      setOrder(o => ({...o, status: 'CANCELLED'}));
    }
    if (action === 'partial') msg = 'Partial refund of £10.00 initiated via Stripe.';
    if (action === 'full') {
      msg = `Full refund of £${order.amount.toFixed(2)} initiated.`;
      setOrder(o => ({...o, status: 'REFUNDED'}));
    }
    showToast(msg);
  };

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (!order.disputeTag) {
      showToast('Please select a Root Cause Tag.', 'error');
      return;
    }
    setOrder(o => ({...o, disputeFiled: true}));
    showToast('Dispute Workflow Initialized (Phase 2). Root cause logged.');
  };

  return (
    <div className="space-y-6 pb-20">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/orders')} className="p-2 bg-admin-900 border border-admin-800 rounded-xl hover:bg-admin-800 transition-colors shadow-dark-elevated">
          <ArrowLeft className="w-4 h-4 text-admin-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Order {order.id}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
              order.status === 'DELAYED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              order.status === 'CANCELLED' || order.status === 'REFUNDED' ? 'bg-admin-500/10 text-admin-400 border-admin-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {order.status}
            </span>
          </h1>
          <p className="text-sm text-admin-400 mt-1">Placed 12:05 PM Today · £{order.amount.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 overflow-hidden flex lg:flex-col">
            {[
              { id: 'audit', icon: List, label: 'Overview & Audit Trail' },
              { id: 'intervention', icon: AlertTriangle, label: 'Intervention Center' },
              { id: 'dispute', icon: ShieldAlert, label: 'Dispute Resolution' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col lg:flex-row items-center lg:items-start lg:justify-start justify-center flex-1 lg:flex-none gap-2 p-4 text-xs font-bold transition-colors border-b border-admin-800/50 last:border-0 ${
                  activeTab === tab.id 
                    ? 'bg-brand-500/10 text-brand-400 border-l-4 border-l-brand-500' 
                    : 'text-admin-400 hover:text-white hover:bg-admin-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-5">
                  <div className="flex items-center gap-2 mb-3 text-admin-400"><User className="w-4 h-4" /><span className="font-bold text-sm">Customer</span></div>
                  <p className="font-semibold text-white">{order.customer}</p>
                  <p className="text-xs text-admin-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> 12 Baker St, W1U</p>
                </div>
                <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-5">
                  <div className="flex items-center gap-2 mb-3 text-admin-400"><Store className="w-4 h-4" /><span className="font-bold text-sm">Vendor</span></div>
                  <p className="font-semibold text-white">{order.vendor}</p>
                  <p className="text-xs text-admin-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> 45 Commercial Rd</p>
                </div>
                <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-5">
                  <div className="flex items-center gap-2 mb-3 text-admin-400"><Bike className="w-4 h-4" /><span className="font-bold text-sm">Rider</span></div>
                  <p className="font-semibold text-white">{order.rider}</p>
                  <p className="text-[10px] font-bold text-brand-400 uppercase mt-1">Assigned</p>
                </div>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-admin-800">
                  <h2 className="font-bold text-white">Live Audit Trail</h2>
                  <p className="text-xs text-admin-500">Chronological history of status changes and exact actor.</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {auditTimeline.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${step.done ? (step.isError ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20') : 'bg-admin-800 text-admin-500 border-admin-700'}`}>
                            {step.done ? (step.isError ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />) : <Clock className="w-4 h-4" />}
                          </div>
                          {i !== auditTimeline.length - 1 && <div className={`w-0.5 h-full my-2 ${step.done ? 'bg-emerald-500/30' : 'bg-admin-800'}`} />}
                        </div>
                        <div className="pt-1 pb-4">
                          <p className={`font-bold text-sm ${step.done ? (step.isError ? 'text-red-400' : 'text-white') : 'text-admin-500'}`}>{step.step}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-medium text-admin-400">{step.time}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-admin-950 text-admin-300 border border-admin-800">
                              Actor: {step.actor}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'intervention' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-saffron-500/30 p-6 opacity-95">
                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-saffron-500" /> Operational Intervention</h2>
                <p className="text-xs text-admin-400 mb-6">These actions immediately affect live dispatch rules. Use with caution.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-admin-950 rounded-xl border border-admin-800">
                    <h3 className="font-bold text-white text-sm mb-1">Reassign Rider</h3>
                    <p className="text-xs text-admin-500 mb-4">Unassigns Raj Kumar and forces nearest-rider algorithm retry.</p>
                    <button onClick={() => handleIntervention('reassign')} className="w-full flex items-center justify-center gap-2 py-2 bg-brand-500 text-white font-bold text-xs rounded-lg hover:bg-brand-600 transition-colors shadow-glow">
                      <RefreshCcw className="w-3.5 h-3.5" /> Execute Reassignment
                    </button>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <h3 className="font-bold text-red-400 text-sm mb-1">Force Cancel Order</h3>
                    <p className="text-xs text-red-300 mb-4">Stops prep/delivery immediately. (Refund not automatic here).</p>
                    <button onClick={() => handleIntervention('cancel')} className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700 transition-colors">
                      <Ban className="w-3.5 h-3.5" /> Execute Cancellation
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><PoundSterling className="w-5 h-5 text-emerald-400" /> Financial Intervention (Stripe)</h2>
                <p className="text-xs text-admin-400 mb-6">Process refunds back to the customer's original Stripe card.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-admin-950 rounded-xl border border-admin-800">
                    <h3 className="font-bold text-white text-sm mb-1">Partial Refund (£10.00)</h3>
                    <p className="text-xs text-admin-500 mb-4">Refund specific items or offer goodwill discount without cancelling.</p>
                    <button onClick={() => handleIntervention('partial')} className="w-full py-2 bg-admin-800 text-white border border-admin-700 font-bold text-xs rounded-lg hover:bg-admin-700 transition-colors">
                      Process Partial
                    </button>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <h3 className="font-bold text-emerald-400 text-sm mb-1">Full Refund (£{order.amount.toFixed(2)})</h3>
                    <p className="text-xs text-emerald-300 mb-4">Refund the entire order value back to the payment method.</p>
                    <button onClick={() => handleIntervention('full')} className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-500 transition-colors">
                      Process Full Refund
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dispute' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 overflow-hidden flex flex-col md:flex-row min-h-[400px]">
                
                <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-admin-800">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Dispute Workflow (Phase 2 Preview)</h2>
                      <p className="text-xs text-admin-500">Root cause assignment for analytics and vendor penalty calculations.</p>
                    </div>
                  </div>

                  {order.disputeFiled ? (
                    <div className="p-5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-center">
                      <ShieldAlert className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="font-bold text-purple-300">Dispute Filed Successfully</p>
                      <p className="text-xs text-purple-400 mt-1">Root Cause Tag: {order.disputeTag}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleDisputeSubmit} className="space-y-5">
                      <div>
                        <label className="text-xs font-bold text-admin-400 block mb-2">Root Cause Tag</label>
                        <select 
                          required
                          value={order.disputeTag}
                          onChange={(e) => setOrder({ ...order, disputeTag: e.target.value })}
                          className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-semibold text-white outline-none focus:border-purple-500 transition-colors"
                        >
                          <option value="">-- Select Root Cause --</option>
                          <option value="restaurantFault">Restaurant Fault (Late Prep, Missing Items)</option>
                          <option value="riderFault">Rider Fault (Spilled, Delayed, No-show)</option>
                          <option value="customerFault">Customer Fault (Wrong Address, Unreachable)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-admin-400 block mb-2">Evidence / Notes</label>
                        <textarea
                          required
                          rows={4}
                          value={order.disputeNotes}
                          onChange={(e) => setOrder({ ...order, disputeNotes: e.target.value })}
                          placeholder="Log dispatcher notes or links to photo evidence..."
                          className="w-full p-3 bg-admin-950 border border-admin-800 rounded-xl text-sm text-white placeholder-admin-600 outline-none focus:border-purple-500 resize-none transition-colors"
                        />
                      </div>

                      <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold text-sm rounded-xl shadow-glow hover:bg-purple-500 transition-colors">
                        File Dispute & Tag
                      </button>
                    </form>
                  )}
                </div>

                <div className="w-full md:w-64 bg-admin-950 p-6 flex flex-col justify-center">
                  <h3 className="font-bold text-white text-sm mb-2">Why Tag Root Causes?</h3>
                  <p className="text-xs text-admin-500 leading-relaxed">
                    Accurately tagging faults powers the Vendor and Rider performance algorithms. Repeated `restaurantFault` flags will automatically increase their platform commission penalty in Phase 2.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
