import React, { useState } from 'react';
import { Star, ThumbsUp, ChefHat, Truck, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const StarRating = ({ value, onChange, label }) => (
  <div className="flex flex-col gap-1">
    {label && <span className="text-xs font-bold text-stone-600">{label}</span>}
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="focus:outline-none"
        >
          <Star
            className={`w-7 h-7 transition-colors ${n <= value ? 'text-saffron-500 fill-saffron-500' : 'text-stone-300'}`}
          />
        </button>
      ))}
    </div>
  </div>
);

export const ReviewModal = ({ booking, shop, onClose, onSuccess }) => {
  const { submitReview } = useApp();
  const [overallRating, setOverallRating]   = useState(5);
  const [foodRating, setFoodRating]         = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [comment, setComment]               = useState('');
  const [submitting, setSubmitting]         = useState(false);
  const [submitted, setSubmitted]           = useState(false);
  const [error, setError]                   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitReview({
        booking_id:      booking?.id || '',
        shop:            shop?.id,
        rating:          overallRating,
        food_rating:     foodRating,
        delivery_rating: deliveryRating,
        comment,
      });
      setSubmitted(true);
      setTimeout(() => { onSuccess?.(); onClose?.(); }, 2000);
    } catch (err) {
      setError(err?.non_field_errors?.[0] || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-cream-200 overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 to-saffron-500 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Star className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl">Rate Your Order</h3>
              <p className="text-white/80 text-sm">{shop?.name || 'Your Lunchbox'}</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-fresh-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-fresh-600" />
            </div>
            <h4 className="font-heading font-extrabold text-xl text-ink-900">Thank You!</h4>
            <p className="text-stone-500 text-sm">Your review helps other customers find great food.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Overall Rating */}
            <div className="flex flex-col items-center gap-2 py-3 bg-cream-50 rounded-2xl">
              <span className="text-sm font-bold text-stone-700">Overall Experience</span>
              <StarRating value={overallRating} onChange={setOverallRating} />
              <span className="text-xs text-stone-400">
                {['', 'Terrible', 'Poor', 'OK', 'Good', 'Excellent'][overallRating]}
              </span>
            </div>

            {/* Granular Ratings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-100 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <ChefHat className="w-4 h-4" />
                  <span className="text-xs font-bold">Food Quality</span>
                </div>
                <StarRating value={foodRating} onChange={setFoodRating} />
              </div>
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-100 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs font-bold">Delivery</span>
                </div>
                <StarRating value={deliveryRating} onChange={setDeliveryRating} />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Your Comments <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="What did you love? What could be better?"
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm font-medium text-ink-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-400 resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-cream-300 text-stone-600 font-bold text-sm hover:bg-cream-50 transition-colors"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-saffron-500 text-white font-heading font-extrabold text-sm shadow-md hover:opacity-95 transition-all disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
