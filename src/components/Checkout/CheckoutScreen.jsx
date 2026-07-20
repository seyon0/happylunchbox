import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { walletAPI } from '../../services/api';
import { SERVICEABLE_PINCODES } from '../../data/mockData';
import { 
  MapPin, 
  Flame, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Building2,
  X,
  Tag
} from 'lucide-react';

export const CheckoutScreen = () => {
  const { 
    allSelectedItems,
    selectedDate, 
    selectedSlot, 
    totalPrice, 
    spiceLevel, 
    setSpiceLevel, 
    allergyNotes, 
    setAllergyNotes,
    user,
    placeOrder,
    appliedPromo,
    applyPromoCode,
    removePromoCode
  } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState(user.addresses[0]?.id || 'addr-uk-1');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  
  const [promoInput, setPromoInput] = useState('');

  const promoDiscount = appliedPromo
    ? appliedPromo.type === 'percent'
      ? totalPrice * (appliedPromo.value / 100)
      : appliedPromo.value
    : 0;
  
  const subtotalAfterDiscount = Math.max(0, totalPrice - promoDiscount);
  // UK VAT rate from SystemConfig (mocked here as 20% standard rate for hot food)
  const vatAmount = subtotalAfterDiscount * 0.20;
  const finalTotal = subtotalAfterDiscount + vatAmount;

  const selectedAddress = user.addresses.find(a => a.id === selectedAddressId) || user.addresses[0];
  const isPincodeValid = SERVICEABLE_PINCODES.includes(selectedAddress?.pincode);

  const handlePay = async () => {
    if (paymentMethod === 'cod' || paymentMethod === 'wallet') {
      setIsProcessing(true);
      if (paymentMethod === 'wallet') {
        try {
          await walletAPI.deductFunds(finalTotal);
        } catch (err) {
          alert('Wallet deduction failed: ' + (err.message || 'Insufficient funds'));
          setIsProcessing(false);
          return;
        }
      }
      setTimeout(() => {
        setIsProcessing(false);
        placeOrder({ couponCode: appliedPromo?.code || '', paymentMethod });
      }, 1000);
    } else {
      setShowRazorpay(true);
    }
  };

  const handleRazorpaySuccess = () => {
    setShowRazorpay(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      placeOrder({ couponCode: appliedPromo?.code || '' });
    }, 1000);
  };

  // Build a Google Maps embed URL centered on the selected address postcode
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${encodeURIComponent((selectedAddress?.street || '') + ', ' + (selectedAddress?.city || '') + ', UK')}&zoom=14`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8 pb-28 lg:pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold mb-2">
          <Lock className="w-3.5 h-3.5" />
          <span>Encrypted 256-Bit UK Secure Checkout</span>
        </div>
        <h2 className="font-heading text-3xl font-extrabold text-ink-900 tracking-tight">
          Review Order & Delivery Details
        </h2>
        <p className="text-stone-500 text-sm font-medium mt-1">
          Verify your delivery address, customise spice level, and select payment method.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Address Picker */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4">
            <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-500" />
              <span>Delivery Address</span>
            </h3>

            <div className="space-y-3">
              {user.addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                      isSelected 
                        ? 'bg-brand-50/50 border-brand-500 shadow-sm' 
                        : 'bg-white border-cream-200 hover:border-brand-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-sm text-ink-900">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron-500/20 text-saffron-700">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 font-medium">{addr.flat}, {addr.street}</p>
                      <p className="text-xs text-stone-400">{addr.city} — {addr.pincode}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      isSelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-stone-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {!isPincodeValid && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Selected postcode is verified for standard UK driver delivery.</span>
              </div>
            )}

            {/* Live Map Embed */}
            <div className="mt-4 h-44 rounded-2xl overflow-hidden border border-cream-200 shadow-sm">
              <iframe
                title="Delivery Address Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent((selectedAddress?.street || 'New Malden') + ', ' + (selectedAddress?.city || 'London') + ', UK')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            {/* Delivery Instructions */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Driver Instructions (Optional)</label>
              <input
                type="text"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                placeholder="E.g., Leave at reception, call on arrival..."
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Spice Level */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-saffron-500" />
                <span>Spice Preference</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-medium">Applied to your entire tiffin batch.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 bg-cream-100 p-1.5 rounded-2xl border border-cream-200">
              {['Mild', 'Medium', 'Spicy'].map((level) => {
                const isSelected = spiceLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSpiceLevel(level)}
                    className={`py-3 rounded-xl font-heading font-extrabold text-xs transition-all ${
                      isSelected
                        ? level === 'Spicy' 
                          ? 'bg-red-600 text-white shadow-md'
                          : level === 'Medium'
                          ? 'bg-saffron-500 text-white shadow-md'
                          : 'bg-fresh-600 text-white shadow-md'
                        : 'text-stone-600 hover:text-ink-900'
                    }`}
                  >
                    {level} Spice
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Allergy Notes */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-3">
            <h3 className="font-heading text-lg font-extrabold text-ink-900">Allergy & Special Instructions</h3>
            <textarea
              rows="2"
              placeholder="E.g., No onions in gravy, nut allergy, please leave at concierge desk..."
              value={allergyNotes}
              onChange={(e) => setAllergyNotes(e.target.value)}
              className="w-full p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs font-medium text-ink-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
            ></textarea>
          </div>

          {/* 4. Payment Method */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4">
            <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-500" />
              <span>Payment Method</span>
            </h3>
            <div className="space-y-3">
              {[
                { id: 'wallet', name: 'My Wallet', desc: `Available Balance: £${(appContext?.user?.walletBalance || 0).toFixed(2)}` },
                { id: 'card', name: 'Credit / Debit Card (Visa, Mastercard)', desc: 'Instant 256-bit secure checkout' },
                { id: 'applepay', name: 'Apple Pay / Google Pay', desc: 'One-touch biometric checkout' },
                { id: 'cod', name: 'Pay on Delivery (Cash)', desc: 'Pay when driver delivers' },
              ].map((pm) => {
                const isWallet = pm.id === 'wallet';
                const hasSufficientFunds = isWallet ? (appContext?.user?.walletBalance || 0) >= finalTotal : true;
                return (
                <div
                  key={pm.id}
                  onClick={() => hasSufficientFunds && setPaymentMethod(pm.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    paymentMethod === pm.id 
                      ? 'bg-brand-50/50 border-brand-500 shadow-sm' 
                      : !hasSufficientFunds ? 'bg-stone-50 border-stone-100 opacity-50 cursor-not-allowed' : 'bg-white border-cream-200 hover:border-brand-200 cursor-pointer'
                  }`}
                >
                  <div>
                    <span className="font-heading font-extrabold text-sm text-ink-900 block">{pm.name}</span>
                    <span className="text-xs text-stone-500 font-medium">{pm.desc}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === pm.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-stone-300'
                  }`}>
                    {paymentMethod === pm.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Order Summary */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card-elevated space-y-5">
            <h3 className="font-heading text-xl font-extrabold text-ink-900 pb-3 border-b border-cream-200">
              Order Summary
            </h3>

            <div className="p-3.5 rounded-2xl bg-cream-100 text-xs text-stone-700 font-semibold space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-400">Date:</span>
                <strong className="text-ink-900">{selectedDate}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Slot:</span>
                <strong className="text-ink-900">{selectedSlot}</strong>
              </div>
            </div>

            {/* Selected items list */}
            <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
              {allSelectedItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex items-center justify-between text-xs py-1">
                  <span className="font-medium text-stone-700 truncate max-w-[200px]">{item.name}</span>
                  <span className="font-heading font-bold text-ink-900">£{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Cost Table & Coupon */}
            <div className="pt-4 border-t border-cream-200 space-y-4">
              
              {/* Promo Code Section */}
              <div className="bg-white rounded-3xl border border-cream-200 p-5">
                <h3 className="font-heading font-extrabold text-sm text-ink-900 mb-3">Promo Code</h3>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-fresh-50 rounded-2xl border border-fresh-200">
                    <span className="text-fresh-700 font-bold text-sm">
                      {appliedPromo.code} — {appliedPromo.label}
                    </span>
                    <button onClick={removePromoCode} className="text-xs text-red-500 font-bold hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium focus:outline-none focus:border-brand-500 uppercase"
                    />
                    <button
                      onClick={async () => {
                        const r = await applyPromoCode(promoInput);
                        if (!r.success) alert(r.message);
                        setPromoInput('');
                      }}
                      className="px-4 py-3 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>Items Subtotal:</span>
                  <span>£{totalPrice.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-fresh-600 font-bold">
                    <span>Discount ({appliedPromo.code}):</span>
                    <span>-£{promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>Delivery:</span>
                  <span className="text-fresh-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>VAT (20%):</span>
                  <span>£{vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-cream-200 text-ink-900">
                  <span className="font-heading font-extrabold text-base">Total:</span>
                  <span className="font-heading font-extrabold text-3xl text-brand-600">
                    £{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout CTA Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-saffron-500 text-white font-heading font-extrabold text-base shadow-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>Pay & Confirm (£{finalTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        </div>

      </div>

      {/* Mock Payment Modal */}
      {showRazorpay && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowRazorpay(false)} className="absolute top-4 right-4 text-stone-400 hover:text-ink-900">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6 pt-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-ink-900">Secure Payment</h3>
              <p className="text-xs text-stone-500 font-medium">256-bit encrypted checkout</p>
            </div>
            <div className="space-y-4 mb-6">
              <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 text-center">
                <span className="text-xs text-stone-500 block mb-1">Amount to Pay</span>
                <span className="font-heading font-extrabold text-2xl text-ink-900">£{finalTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleRazorpaySuccess}
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
              >
                Confirm Payment
              </button>
              <button 
                onClick={() => setShowRazorpay(false)}
                className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-sm font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
