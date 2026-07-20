import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_MENU_ITEMS } from '../../data/mockData';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChefHat, 
  Truck, 
  PackageCheck, 
  RefreshCw, 
  ChevronRight,
  Star,
  X,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { ReviewModal } from '../Reviews/ReviewModal';
import { OrderTrackingModal } from './OrderTrackingModal';

export const BookingsScreen = () => {
  const { bookings, shops, navigateTo, addToSlot } = useApp();
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);
  const [trackingBooking, setTrackingBooking] = useState(null);
  const [reviewBookingId, setReviewBookingId] = useState(null);
  const [disputeBooking, setDisputeBooking] = useState(null);
  const [disputeReason, setDisputeReason] = useState('late_delivery');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  const handleCancelOrder = (booking) => {
    try {
      const dateStr = booking.deliveryDate || booking.delivery_date;
      const dateParts = dateStr.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const day = parseInt(dateParts[2]);
      
      const targetDate = new Date(year, month, day, 12, 30, 0);
      const hoursDiff = (targetDate.getTime() - Date.now()) / (1000 * 60 * 60);

      const shop = shops.find(s => s.id === (booking.shopId || booking.shop)) || {};
      const leadHours = shop.cancellation_lead_hours || 6;
      
      if (hoursDiff < leadHours) {
        alert(`Cannot cancel! Kitchen policy requires cancellations at least ${leadHours} hours prior to delivery.`);
        return;
      }
      
      if (window.confirm('Are you sure you want to cancel this booking?')) {
        booking.status = 'Cancelled';
        booking.statusStep = 0;
        alert('Order cancelled.');
        navigateTo('bookings');
      }
    } catch (e) {
      if (window.confirm('Are you sure you want to cancel this booking?')) {
        booking.status = 'Cancelled';
        alert('Order cancelled.');
        navigateTo('bookings');
      }
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Cooking');
  const pastBookings = bookings.filter(b => b.status === 'Delivered');

  const handleReorder = (booking) => {
    booking.items.forEach(itemId => {
      const item = MOCK_MENU_ITEMS.find(i => i.id === itemId);
      if (item) addToSlot(item);
    });
    navigateTo('builder');
  };

  const handleRate = (bookingId) => {
    setReviewBookingId(bookingId);
  };

  const handleDisputeSubmit = async () => {
    if (!disputeDesc.trim()) return;
    setIsSubmittingDispute(true);
    try {
      // Mocking API call for disputes
      await new Promise(resolve => setTimeout(resolve, 800));
      alert('Dispute submitted successfully. Our team will review it shortly.');
      setDisputeBooking(null);
      setDisputeDesc('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit dispute. Please try again.');
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8 pb-28 lg:pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>UK Order Dispatch System</span>
          </div>
          <h2 className="font-heading text-3xl font-extrabold text-ink-900 tracking-tight">
            My Orders & Bookings
          </h2>
          <p className="text-stone-500 text-sm font-medium mt-1">
            Track live preparation status, UK delivery address & re-order past favorite boxes.
          </p>
        </div>

        <button
          onClick={() => navigateTo('builder')}
          className="px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+ Build New Lunchbox</span>
        </button>
      </div>

      {/* 1. Active / Confirmed Orders */}
      <div className="space-y-4">
        <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-fresh-500 animate-pulse"></div>
          <span>Active Upcoming Deliveries ({activeBookings.length})</span>
        </h3>

        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-cream-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cream-100 text-stone-400 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-extrabold text-lg text-ink-900">No Active Orders Yet</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto font-medium">
              Pick your favorite dishes in the builder and select a delivery date to lock in your lunch.
            </p>
            <button
              onClick={() => navigateTo('builder')}
              className="mt-2 px-6 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-sm hover:bg-brand-600 transition-all"
            >
              Build Lunchbox Now
            </button>
          </div>
        ) : (
          activeBookings.map((booking) => {
            const items = booking.items.map(id => MOCK_MENU_ITEMS.find(i => i.id === id)).filter(Boolean);

            return (
              <div 
                key={booking.id}
                className="bg-white rounded-3xl border border-cream-200 p-6 shadow-card-elevated space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cream-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-extrabold text-xl text-ink-900">{booking.id}</span>
                      <span className="px-3 py-0.5 rounded-full bg-fresh-500/10 text-fresh-700 font-bold text-xs">
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-500" />
                      <span>Scheduled for {booking.deliveryDate} ({booking.deliverySlot})</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-stone-400 block font-medium">Total Paid</span>
                    <span className="font-heading font-extrabold text-xl text-brand-600">£{booking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Live Preparation Timeline Progress */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Live Status Progress</span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { step: 1, label: 'Confirmed', icon: CheckCircle2 },
                      { step: 2, label: 'Cooking', icon: ChefHat },
                      { step: 3, label: 'On Way', icon: Truck },
                      { step: 4, label: 'Delivered', icon: PackageCheck },
                    ].map((st) => {
                      const Icon = st.icon;
                      const isDone = booking.statusStep >= st.step;
                      const isCurrent = booking.statusStep === st.step;

                      return (
                        <div key={st.step} className="space-y-1.5">
                          <div className={`h-2 rounded-full transition-all ${
                            isDone ? 'bg-fresh-500' : 'bg-stone-200'
                          }`}></div>
                          <div className="flex flex-col items-center">
                            <Icon className={`w-4 h-4 ${isCurrent ? 'text-fresh-600 animate-bounce' : isDone ? 'text-fresh-600' : 'text-stone-300'}`} />
                            <span className={`text-[11px] font-semibold ${isDone ? 'text-ink-900' : 'text-stone-400'}`}>
                              {st.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items preview pills */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Items in Tiffin Box</span>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <span key={item.id} className="px-3 py-1 rounded-xl bg-cream-100 text-stone-700 text-xs font-medium border border-cream-200 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.dietType === 'veg' ? 'bg-fresh-500' : 'bg-red-600'}`}></span>
                        <span>{item.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Address & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-cream-100 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="truncate">{booking.address}</span>
                  </div>

                  <div className="flex gap-2 items-center">
                    {['Confirmed', 'Cooking', 'Pending', 'On Way'].includes(booking.status) && (
                      <button
                        onClick={() => setTrackingBooking(booking)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white font-bold text-xs transition-all border border-brand-200 shrink-0"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Track Order
                      </button>
                    )}
                    {['Confirmed', 'Cooking', 'Pending'].includes(booking.status) && (
                      <button
                        onClick={() => handleCancelOrder(booking)}
                        className="text-red-600 font-bold hover:underline text-xs mr-3"
                      >
                        Cancel Order
                      </button>
                    )}
                    {booking.status === 'Delivered' ? (
                      <button
                        onClick={() => handleRate(booking.id)}
                        className="text-saffron-600 font-bold hover:underline flex items-center gap-1 shrink-0"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Rate Order</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setDisputeBooking(booking)}
                        className="text-red-600 font-bold hover:underline flex items-center gap-1 shrink-0"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Report Issue</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedBookingModal(booking)}
                      className="text-brand-600 font-bold hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      <span>Receipt</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Past Orders History */}
      <div className="space-y-4 pt-4">
        <h3 className="font-heading text-xl font-extrabold text-ink-900">
          Past Delivered Orders ({pastBookings.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pastBookings.map((booking) => {
            const items = booking.items.map(id => MOCK_MENU_ITEMS.find(i => i.id === id)).filter(Boolean);

            return (
              <div 
                key={booking.id}
                className="bg-white rounded-3xl border border-cream-200 p-5 shadow-sm space-y-4 hover:border-brand-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-heading font-extrabold text-lg text-ink-900">{booking.id}</span>
                    <span className="block text-xs text-stone-400 font-medium">Delivered on {booking.deliveryDate}</span>
                  </div>
                  <span className="font-heading font-extrabold text-lg text-brand-600">£{booking.totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {items.map(item => (
                    <span key={item.id} className="px-2.5 py-0.5 rounded-lg bg-cream-50 text-stone-600 text-[11px] font-medium">
                      {item.name}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleReorder(booking)}
                    className="flex-1 py-2.5 rounded-xl bg-cream-100 hover:bg-brand-500 text-stone-800 hover:text-white font-heading font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-order</span>
                  </button>
                  <button
                    onClick={() => handleRate(booking.id)}
                    className="flex-1 py-2.5 rounded-xl border border-cream-200 hover:border-saffron-400 hover:bg-saffron-50 text-stone-600 hover:text-saffron-600 font-heading font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Rate & Review</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Modal */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h4 className="font-heading font-extrabold text-xl text-ink-900">Order Details — {selectedBookingModal.id}</h4>
              <button onClick={() => setSelectedBookingModal(null)} className="p-1 text-stone-400 hover:text-ink-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-cream-100">
                <span className="text-stone-500">Delivery Date:</span>
                <strong className="text-ink-900 font-bold">{selectedBookingModal.deliveryDate}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-cream-100">
                <span className="text-stone-500">Time Window:</span>
                <strong className="text-ink-900 font-bold">{selectedBookingModal.deliverySlot}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-cream-100">
                <span className="text-stone-500">Spice Preference:</span>
                <strong className="text-brand-600 font-bold">{selectedBookingModal.spiceLevel} Spice</strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="w-full py-3 rounded-xl bg-brand-500 text-white font-bold text-xs"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewBookingId && (
        <ReviewModal
          bookingId={reviewBookingId}
          isOpen={!!reviewBookingId}
          onClose={() => setReviewBookingId(null)}
          onSuccess={() => {
            alert('Review submitted successfully!');
            setReviewBookingId(null);
          }}
        />
      )}

      {/* Dispute Modal */}
      {disputeBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h4 className="font-heading font-extrabold text-xl text-ink-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Report an Issue
              </h4>
              <button onClick={() => setDisputeBooking(null)} className="p-1 text-stone-400 hover:text-ink-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-stone-500 font-medium">Order: <strong className="text-ink-900">{disputeBooking.id}</strong></p>

            <div className="space-y-4 text-xs font-bold text-stone-700">
              <div>
                <label className="block mb-1">Issue Reason</label>
                <select 
                  value={disputeReason} 
                  onChange={e => setDisputeReason(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:border-red-400"
                >
                  <option value="late_delivery">Late Delivery</option>
                  <option value="missing_items">Missing Items</option>
                  <option value="quality_issue">Food Quality Issue</option>
                  <option value="wrong_order">Wrong Order Received</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea 
                  rows={3} 
                  placeholder="Please provide details..."
                  value={disputeDesc}
                  onChange={e => setDisputeDesc(e.target.value)}
                  className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:border-red-400 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setDisputeBooking(null)}
                className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeSubmit}
                disabled={isSubmittingDispute || !disputeDesc.trim()}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-50"
              >
                {isSubmittingDispute ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {trackingBooking && (
        <OrderTrackingModal
          booking={trackingBooking}
          onClose={() => setTrackingBooking(null)}
        />
      )}

    </div>
  );
};
