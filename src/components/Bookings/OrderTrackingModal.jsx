import React from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  PackageCheck,
  Star,
  ShoppingBag,
} from 'lucide-react';

const STEPS = [
  { label: 'Order Placed', icon: ShoppingBag },
  { label: 'Accepted', icon: CheckCircle2 },
  { label: 'Cooking', icon: ChefHat },
  { label: 'On the Way', icon: Truck },
  { label: 'Delivered', icon: PackageCheck },
];

const getActiveStep = (statusStep) => {
  // statusStep: 0=Placed, 1=Accepted/Confirmed, 2=Cooking, 3=On Way, 4=Delivered
  return Math.max(0, Math.min(4, statusStep ?? 0));
};

const getStatusMessage = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'Your order has been confirmed! The kitchen is preparing your lunchbox.';
    case 'Cooking':
      return 'Your lunchbox is being freshly prepared right now.';
    case 'On Way':
      return 'Your rider is on the way! Expected in 15–20 minutes.';
    case 'Delivered':
      return 'Your lunchbox has been delivered. Enjoy your meal! 🎉';
    default:
      return 'Your order is being processed.';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Confirmed':
      return { emoji: '✅', bg: 'bg-blue-50', color: 'text-blue-600' };
    case 'Cooking':
      return { emoji: '👨‍🍳', bg: 'bg-amber-50', color: 'text-amber-600' };
    case 'On Way':
      return { emoji: '🛵', bg: 'bg-brand-50', color: 'text-brand-600' };
    case 'Delivered':
      return { emoji: '🎉', bg: 'bg-green-50', color: 'text-green-600' };
    default:
      return { emoji: '📦', bg: 'bg-stone-50', color: 'text-stone-600' };
  }
};

export const OrderTrackingModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const status = booking.status || 'Confirmed';
  const activeStep = getActiveStep(booking.statusStep ?? booking.status_step ?? 1);
  const statusInfo = getStatusIcon(status);
  const statusMessage = getStatusMessage(status);
  const isDelivered = status === 'Delivered';
  const canCancel = status === 'Confirmed' || status === 'Cooking';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full mt-16 mb-8 shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-cream-200">
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Live Tracking</p>
            <h3 className="font-heading text-2xl font-extrabold text-ink-900">Order #{booking.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-stone-600" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Segmented Progress Bar */}
          <div>
            <div className="flex gap-1.5 mb-3">
              {STEPS.map((step, idx) => {
                const isCompleted = idx < activeStep;
                const isActive = idx === activeStep;
                const isInactive = idx > activeStep;

                let barClass = '';
                if (isCompleted || isDelivered) barClass = 'bg-brand-500';
                else if (isActive && !isDelivered) barClass = 'bg-saffron-500 animate-pulse';
                else barClass = 'bg-stone-200';

                return (
                  <div key={idx} className="flex-1">
                    <div className={`h-2 rounded-full transition-all duration-500 ${barClass} ${isActive && !isDelivered ? 'w-3/4' : 'w-full'}`} />
                  </div>
                );
              })}
            </div>

            {/* Step Labels */}
            <div className="flex">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isDoneOrActive = idx <= activeStep || isDelivered;
                return (
                  <div key={idx} className="flex-1 text-center">
                    <Icon className={`w-3.5 h-3.5 mx-auto mb-0.5 ${isDoneOrActive ? 'text-brand-500' : 'text-stone-300'}`} />
                    <p className={`text-[9px] font-bold leading-tight ${isDoneOrActive ? 'text-ink-900' : 'text-stone-400'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Icon + Message */}
          <div className={`${statusInfo.bg} rounded-3xl p-5 flex items-start gap-4`}>
            <div className="text-4xl">{statusInfo.emoji}</div>
            <div>
              <p className={`font-heading font-extrabold text-base ${statusInfo.color}`}>{status}</p>
              <p className="text-stone-600 text-sm font-medium mt-1 leading-relaxed">{statusMessage}</p>
            </div>
          </div>

          {/* Estimated Delivery Time */}
          <div className="bg-cream-50 border border-cream-200 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500" />
              <div>
                <p className="text-xs font-bold text-stone-700">Estimated Delivery</p>
                <p className="font-heading font-extrabold text-ink-900 text-sm">12:30 – 1:30 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Live Updates</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {isDelivered ? (
              <button
                className="w-full py-3.5 rounded-2xl font-heading font-extrabold text-sm text-white transition-all flex items-center justify-center gap-2 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                onClick={() => alert('Thank you for rating your order!')}
              >
                <Star className="w-4 h-4" />
                Rate Your Order
              </button>
            ) : canCancel ? (
              <button
                className="w-full py-3.5 rounded-2xl border-2 border-red-400 text-red-600 font-heading font-extrabold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this order?')) {
                    alert('Cancellation request submitted.');
                    onClose();
                  }
                }}
              >
                Cancel Order
              </button>
            ) : null}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-heading font-bold text-sm transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
