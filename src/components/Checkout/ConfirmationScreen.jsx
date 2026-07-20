import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, ShoppingBag, Home, Download, Printer,
  MapPin, Clock, Calendar, Leaf
} from 'lucide-react';

export const ConfirmationScreen = () => {
  const { navigateTo, bookings, user, allSelectedItems, totalPrice, selectedDate, selectedSlot, spiceLevel } = useApp();
  const billRef = useRef(null);
  const latestBooking = bookings[0] || { id: 'HL-0000', deliveryDate: 'Tomorrow', deliverySlot: '11:00 AM - 1:00 PM' };
  const now = new Date();
  const orderTime = now.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const deliveryAddress = user.addresses.find(a => a.isDefault) || user.addresses[0];

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    // Open print dialog which lets users save as PDF
    window.print();
  };

  const vatRate = 0.0; // Food in UK is zero-rated VAT
  const subtotal = allSelectedItems.reduce((s, i) => s + (i?.price || 0), 0) || totalPrice;
  const deliveryCharge = 0;
  const grandTotal = subtotal + deliveryCharge;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 pb-28 lg:pb-16 space-y-6">

      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-fresh-500/10 text-fresh-600 mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-11 h-11" />
        </div>
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-fresh-500/15 text-fresh-700 font-bold text-xs mb-2">
            Order Confirmed
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
            Your Lunchbox is Booked!
          </h2>
          <p className="text-stone-500 text-sm font-medium mt-1">
            Thank you. Your tiffin has been registered in our kitchen.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 no-print">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 text-white font-heading font-bold text-sm shadow-md hover:bg-brand-600 transition-all"
        >
          <Download className="w-4 h-4" />
          Save Bill as PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-cream-200 text-stone-700 font-heading font-bold text-sm hover:bg-cream-50 transition-all"
        >
          <Printer className="w-4 h-4" />
          Print Receipt
        </button>
      </div>

      {/* THE BILL */}
      <div
        ref={billRef}
        id="printable-bill"
        className="bg-white border border-cream-200 rounded-3xl shadow-card-elevated overflow-hidden"
      >
        {/* Bill Header */}
        <div className="bg-gradient-to-r from-brand-600 to-saffron-500 px-6 sm:px-8 pt-8 pb-6 text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/20">
                  <img src="/source/683754474_17858463000690543_8878656858934875981_n.jpg" alt="Jaffna Roots" className="w-full h-full object-cover" />
                </div>
                <span className="text-saffron-200 text-xs font-bold uppercase tracking-widest">Jaffna Roots</span>
              </div>
              <h3 className="font-heading text-2xl font-extrabold tracking-tight">Tax Invoice</h3>
              <p className="text-white/70 text-xs font-medium mt-1">
                111A Manor Dr N, New Malden, KT3 5PD, UK
              </p>
              <p className="text-white/60 text-xs">hello@healthylunchbox.co.uk</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Invoice No.</p>
              <p className="font-heading font-extrabold text-2xl text-saffron-300">{latestBooking.id}</p>
              <p className="text-white/60 text-xs mt-1">{orderTime}</p>
            </div>
          </div>
        </div>

        {/* Bill to & Delivery details */}
        <div className="px-6 sm:px-8 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-cream-200 bg-cream-50">
          <div>
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">Bill To</p>
            <p className="font-heading font-extrabold text-ink-900 text-base">{user.name}</p>
            <p className="text-xs text-stone-600 font-medium">{user.email}</p>
            {deliveryAddress && (
              <div className="flex items-start gap-1.5 mt-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  {deliveryAddress.flat}, {deliveryAddress.street}, {deliveryAddress.city}, {deliveryAddress.pincode}
                </p>
              </div>
            )}
          </div>
          <div>
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">Delivery Details</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                <span className="font-semibold">Date:</span>
                <span className="font-bold text-ink-900">{latestBooking.deliveryDate || selectedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <Clock className="w-3.5 h-3.5 text-saffron-500" />
                <span className="font-semibold">Window:</span>
                <span className="font-bold text-ink-900">{latestBooking.deliverySlot || selectedSlot}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <span className="text-lg">🌶️</span>
                <span className="font-semibold">Spice:</span>
                <span className="font-bold text-ink-900">{spiceLevel || 'Medium'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6 sm:px-8 py-5">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="text-left pb-3 text-stone-400 font-bold uppercase tracking-wider">Item</th>
                <th className="text-center pb-3 text-stone-400 font-bold uppercase tracking-wider">Category</th>
                <th className="text-right pb-3 text-stone-400 font-bold uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {(allSelectedItems.length > 0 ? allSelectedItems : []).map((item, idx) => (
                <tr key={`${item?.id}-${idx}`} className="py-2">
                  <td className="py-2.5 font-medium text-ink-900 pr-4">
                    <span className="font-semibold">{item?.name}</span>
                    {item?.dietType && (
                      <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                        item.dietType === 'veg' ? 'bg-fresh-100 text-fresh-700' : 
                        item.dietType === 'jain' ? 'bg-saffron-100 text-saffron-700' : 
                        'bg-red-50 text-red-700'
                      }`}>
                        {item.dietType}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-center capitalize text-stone-500">{item?.category}</td>
                  <td className="py-2.5 text-right font-heading font-bold text-ink-900">£{(item?.price || 0).toFixed(2)}</td>
                </tr>
              ))}
              {allSelectedItems.length === 0 && (
                <tr><td colSpan={3} className="py-4 text-center text-stone-400 text-xs">Custom tiffin order placed</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 sm:px-8 py-5 border-t border-cream-200 bg-cream-50">
          <div className="max-w-xs ml-auto space-y-2 text-xs">
            <div className="flex justify-between text-stone-600 font-medium">
              <span>Subtotal:</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600 font-medium">
              <span>Delivery:</span>
              <span className="text-fresh-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-stone-600 font-medium">
              <span>VAT (0% – zero-rated food):</span>
              <span>£0.00</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-cream-300">
              <span className="font-heading font-extrabold text-base text-ink-900">Grand Total:</span>
              <span className="font-heading font-extrabold text-2xl text-brand-600">£{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-5 border-t border-cream-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
          <div className="text-xs text-stone-500 font-medium space-y-1">
            <p>Thank you for choosing Healthy Lunchbox!</p>
            <p className="text-[11px] text-stone-400">Food is freshly cooked each morning. Delivered 11am–1pm.</p>
          </div>
          <div className="text-right text-[11px] text-stone-400">
            <p>111A Manor Dr N, New Malden KT3 5PD</p>
            <p>hello@healthylunchbox.co.uk</p>
          </div>
        </div>
      </div>

      {/* Action Buttons bottom */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 no-print">
        <button
          onClick={() => navigateTo('bookings')}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-extrabold text-sm shadow-glow transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Track My Order</span>
        </button>
        <button
          onClick={() => navigateTo('home')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-cream-300 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Print-only styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #printable-bill { box-shadow: none !important; border: 1px solid #ddd !important; }
        }
      `}</style>
    </div>
  );
};
