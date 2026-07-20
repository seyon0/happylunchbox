import React, { useState } from 'react';
import { Play, CheckSquare, Clock, MapPin, Package, Phone, AlertTriangle } from 'lucide-react';

export const KitchenOrderQueue = ({ bookings, onUpdateStatus }) => {
  const [queueTab, setQueueTab] = useState('LIVE');
  const [autoAccept, setAutoAccept] = useState(false);
  const [rejectPromptId, setRejectPromptId] = useState(null);

  const activeStatuses = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'HANDED_TO_RIDER'];
  
  const sortedBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const liveBookings = sortedBookings.filter(b => !b.isScheduled && activeStatuses.includes(b.status));
  const scheduledBookings = sortedBookings.filter(b => b.isScheduled && activeStatuses.includes(b.status));

  const displayBookings = queueTab === 'LIVE' ? liveBookings : scheduledBookings;

  const handleReject = (bookingId, reason) => {
    // We would pass reason to API, but for now just cancel it
    console.log(`Rejecting order ${bookingId} for reason: ${reason}`);
    onUpdateStatus(bookingId, 'CANCELLED');
    setRejectPromptId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-red-500/10 border-red-500/30 text-red-500';
      case 'ACCEPTED': return 'bg-saffron-500/10 border-saffron-500/30 text-saffron-500';
      case 'PREPARING': return 'bg-brand-500/10 border-brand-500/30 text-brand-500';
      case 'READY_FOR_PICKUP': return 'bg-fresh-500/10 border-fresh-500/30 text-fresh-500';
      default: return 'bg-ink-800 border-ink-700 text-ink-300';
    }
  };

  const getActionBtn = (booking) => {
    if (rejectPromptId === booking.id) {
      return (
        <div className="mt-4 p-4 bg-ink-950 rounded-xl border border-red-500/30">
          <p className="text-white text-sm font-bold mb-3 text-center">Select Rejection Reason</p>
          <div className="flex gap-2">
            <button onClick={() => handleReject(booking.id, 'outOfStock')} className="flex-1 bg-ink-800 text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-ink-700">Out of Stock</button>
            <button onClick={() => handleReject(booking.id, 'closing')} className="flex-1 bg-ink-800 text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-ink-700">Closing</button>
            <button onClick={() => handleReject(booking.id, 'tooBusy')} className="flex-1 bg-ink-800 text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-ink-700">Too Busy</button>
          </div>
          <button onClick={() => setRejectPromptId(null)} className="w-full mt-3 text-ink-400 text-sm font-bold">Cancel</button>
        </div>
      );
    }

    if (booking.status === 'PENDING') {
      return (
        <div className="flex gap-3 mt-4">
          <button 
            onClick={() => onUpdateStatus(booking.id, 'ACCEPTED')}
            className="flex-1 py-4 bg-brand-500 text-white rounded-xl font-black text-lg uppercase shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 transition-all"
          >
            Accept
          </button>
          <button 
            onClick={() => setRejectPromptId(booking.id)}
            className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl font-black text-lg uppercase active:scale-95 transition-all"
          >
            Reject
          </button>
        </div>
      );
    }
    if (booking.status === 'ACCEPTED') {
      return (
        <button 
          onClick={() => onUpdateStatus(booking.id, 'PREPARING')}
          className="w-full py-4 mt-4 bg-saffron-500 text-white rounded-xl font-black text-lg uppercase flex items-center justify-center gap-2 hover:bg-saffron-600 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          <Play className="w-6 h-6 fill-current" /> Start Prep
        </button>
      );
    }
    if (booking.status === 'PREPARING') {
      return (
        <button 
          onClick={() => onUpdateStatus(booking.id, 'READY_FOR_PICKUP')}
          className="w-full py-4 mt-4 bg-brand-500 text-white rounded-xl font-black text-lg uppercase flex items-center justify-center gap-2 hover:bg-brand-600 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        >
          <CheckSquare className="w-6 h-6" /> Ready for Pickup
        </button>
      );
    }
    if (booking.status === 'READY_FOR_PICKUP') {
      return (
        <button 
          onClick={() => onUpdateStatus(booking.id, 'HANDED_TO_RIDER')}
          className="w-full py-4 mt-4 bg-fresh-500 text-white rounded-xl font-black text-lg uppercase flex items-center justify-center gap-2 hover:bg-fresh-600 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <CheckSquare className="w-6 h-6" /> Hand to Rider
        </button>
      );
    }
    return (
      <div className="w-full py-4 mt-4 bg-brand-500/20 text-brand-500 rounded-xl font-black text-lg uppercase flex items-center justify-center border border-brand-500/30">
        Waiting for Courier
      </div>
    );
  };

  return (
    <div className="p-4 pb-24 h-full flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex bg-ink-900 p-1.5 rounded-2xl shadow-dark-elevated">
        <button 
          onClick={() => setQueueTab('LIVE')}
          className={`flex-1 py-2.5 rounded-xl font-black text-sm uppercase tracking-wide transition-colors ${queueTab === 'LIVE' ? 'bg-brand-500 text-white' : 'text-ink-400 hover:text-white'}`}
        >
          Live Queue ({liveBookings.length})
        </button>
        <button 
          onClick={() => setQueueTab('SCHEDULED')}
          className={`flex-1 py-2.5 rounded-xl font-black text-sm uppercase tracking-wide transition-colors ${queueTab === 'SCHEDULED' ? 'bg-brand-500 text-white' : 'text-ink-400 hover:text-white'}`}
        >
          Scheduled ({scheduledBookings.length})
        </button>
      </div>

      {/* Auto Accept Toggle */}
      <div className="flex justify-between items-center bg-ink-900 p-4 rounded-2xl shadow-dark-elevated">
        <span className="text-white font-bold">Auto-Accept New Orders</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={autoAccept} onChange={() => setAutoAccept(!autoAccept)} />
          <div className="w-11 h-6 bg-ink-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
        </label>
      </div>

      {displayBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in flex-1">
          <div className="w-24 h-24 bg-ink-900 rounded-full flex items-center justify-center mb-6 shadow-dark-floating border border-ink-800">
            <Clock className="w-10 h-10 text-ink-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No {queueTab === 'SCHEDULED' ? 'Scheduled' : 'Active'} Orders</h2>
          <p className="text-ink-400 font-medium">Wait for the bell to ring!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayBookings.map(booking => (
            <div 
              key={booking.id} 
              className={`bg-ink-900 border ${getStatusColor(booking.status).split(' ')[1]} rounded-3xl p-5 shadow-dark-elevated animate-fade-in relative overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${booking.status === 'PENDING' ? 'bg-red-500' : booking.status === 'ACCEPTED' ? 'bg-saffron-500' : 'bg-brand-500'}`} />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-bold text-ink-400 mb-1">
                    #{booking.id.split('-').pop()} 
                    {booking.isScheduled && <span className="ml-2 text-saffron-500 bg-saffron-500/10 px-2 py-0.5 rounded text-[10px]">SCHEDULED</span>}
                  </p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">{booking.user?.firstName} {booking.user?.lastName}</h3>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                    {booking.status.replace(/_/g, ' ')}
                  </div>
                  <button 
                    onClick={() => console.log('Disputed order:', booking.id)} 
                    className="text-red-500 flex items-center gap-1 text-[10px] font-bold hover:underline"
                  >
                    <AlertTriangle className="w-3 h-3" /> Flag Dispute
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-ink-950 p-3 rounded-xl border border-ink-800 flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-ink-500 uppercase flex items-center gap-1"><Package className="w-3 h-3 text-brand-500" /> Items</p>
                  <p className="text-sm font-bold text-white">{booking.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0} items</p>
                </div>
                <div className="bg-ink-950 p-3 rounded-xl border border-ink-800 flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-ink-500 uppercase flex items-center gap-1"><Clock className="w-3 h-3 text-saffron-500" /> Due At</p>
                  <p className="text-sm font-bold text-white">{booking.isScheduled ? (booking.scheduledFor ? new Date(booking.scheduledFor).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : booking.deliverySlot) : booking.deliverySlot || 'ASAP'}</p>
                </div>
                <div className="bg-ink-950 p-3 rounded-xl border border-ink-800 flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-ink-500 uppercase">Delivery Type</p>
                  <p className="text-sm font-bold text-white">{booking.deliveryType}</p>
                </div>
                <div className="bg-ink-950 p-3 rounded-xl border border-ink-800 flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-ink-500 uppercase">Payment</p>
                  <p className="text-sm font-bold text-white">{booking.paymentMethod}</p>
                </div>
              </div>

              <div className="bg-ink-950 p-4 rounded-xl border border-ink-800 space-y-2">
                 {booking.items?.length > 0 ? (
                   booking.items.map((item, idx) => (
                     <div key={item.id || idx} className="flex justify-between items-center text-sm font-bold border-b border-ink-800 pb-2 last:border-0 last:pb-0">
                       <span className="text-white">{item.quantity}x {item.name || item.menuItem?.name || 'Unknown Item'}</span>
                     </div>
                   ))
                 ) : (
                   <p className="text-ink-400 text-sm font-bold">No items found.</p>
                 )}
              </div>

              {getActionBtn(booking)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

