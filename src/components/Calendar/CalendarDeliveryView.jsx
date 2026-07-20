import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight,
  Truck,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  X
} from 'lucide-react';

export const CalendarDeliveryView = () => {
  const { 
    selectedDate, 
    setSelectedDate, 
    selectedDates,
    toggleSelectedDate,
    selectedSlot, 
    setSelectedSlot, 
    recurringDays, 
    setRecurringDays,
    dailyOrderLimit,
    navigateTo,
    isLunchboxComplete,
    filledCount,
    shops,
    selectedShopId
  } = useApp();

  const [activeTab, setActiveTab] = useState('single');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1)); // July 2026

  // UK Bank Holidays (England & Wales) — calendar blocks these silently
  const UK_BANK_HOLIDAYS = new Set([
    '2025-01-01', '2025-04-18', '2025-04-21', '2025-05-05', '2025-05-26',
    '2025-08-25', '2025-12-25', '2025-12-26',
    '2026-01-01', '2026-04-03', '2026-04-06', '2026-05-04', '2026-05-25',
    '2026-08-31', '2026-12-25', '2026-12-28',
    '2027-01-01', '2027-03-26', '2027-03-29', '2027-05-03', '2027-05-31',
    '2027-08-30', '2027-12-27', '2027-12-28',
  ]);

  const generateMonthGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startOffset = (firstDay.getDay() + 6) % 7; // Mon-first

    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nowMs = Date.now();
    
    const activeShop = shops.find(s => s.id === selectedShopId) || {};
    const bookingCutoffHours = activeShop.booking_cutoff_hours || 24;

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dateObj = new Date(year, month, dayNum);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const isSunday = dateObj.getDay() === 0;
      const isUKHoliday = UK_BANK_HOLIDAYS.has(dateStr);
      const isFullyBooked = dayNum === 4 || dayNum === 18 || dayNum === 25;
      const isPast = dateObj < today;
      
      // Calculate lead time to a generic 12 PM delivery time on the target date
      const deliveryTimeMs = dateObj.getTime() + (12 * 60 * 60 * 1000); // 12 noon
      const leadHours = (deliveryTimeMs - nowMs) / (1000 * 60 * 60);
      const isCutoffMissed = leadHours < bookingCutoffHours;
      
      const isClosed = isPast || isCutoffMissed || isSunday || isUKHoliday;

      days.push({ dayNum, dateStr, isFullyBooked, isClosed, isCutoffMissed, isSunday });
    }

    return days;
  };

  const monthGridDays = generateMonthGrid();
  const monthName = currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const toggleRecurringDay = (dayId) => {
    if (recurringDays.includes(dayId)) {
      setRecurringDays(recurringDays.filter(d => d !== dayId));
    } else {
      setRecurringDays([...recurringDays, dayId]);
    }
  };

  // Format a dateStr nicely
  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6 pb-32 lg:pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 text-saffron-600 text-xs font-bold mb-2">
              <Clock className="w-3.5 h-3.5 text-saffron-500" />
              <span>Capacity: {dailyOrderLimit} orders/day</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
              Delivery Schedule
            </h2>
            <p className="text-stone-500 text-sm font-medium mt-1">
              Select one or more delivery dates. Tap a date to toggle selection.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-cream-100 p-1.5 rounded-2xl border border-cream-200 shrink-0">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'single' ? 'bg-brand-500 text-white shadow-sm' : 'text-stone-600 hover:text-ink-900'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'weekly' ? 'bg-brand-500 text-white shadow-sm' : 'text-stone-600 hover:text-ink-900'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {activeTab === 'single' ? (
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-cream-200 shadow-card-elevated space-y-4">
          {/* Month nav */}
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg sm:text-2xl font-extrabold text-ink-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-500" />
              <span>{monthName}</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-cream-100 hover:bg-brand-50 hover:text-brand-600 text-stone-700 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-cream-100 hover:bg-brand-50 hover:text-brand-600 text-stone-700 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Multi-date pills */}
          {selectedDates.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-brand-50 rounded-2xl border border-brand-100">
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider self-center mr-1">Selected:</span>
              {selectedDates.map(d => (
                <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500 text-white text-xs font-bold shadow-sm">
                  {formatDate(d)}
                  <button onClick={() => toggleSelectedDate(d)} className="hover:text-red-200 transition-colors ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Day headers — abbreviated for mobile */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysOfWeek.map((day, idx) => (
              <div key={`${day}-${idx}`} className={`py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${idx === 6 ? 'text-red-400' : 'text-stone-400'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Day cells — compact on mobile */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {monthGridDays.map((item, idx) => {
              if (!item) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const isSelected = selectedDates.includes(item.dateStr);
              const isDisabled = item.isFullyBooked || item.isClosed;

              return (
                <button
                  key={item.dateStr}
                  disabled={isDisabled}
                  onClick={() => toggleSelectedDate(item.dateStr)}
                  className={`relative aspect-square rounded-xl sm:rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-b from-brand-600 to-brand-500 text-white border-2 border-brand-600 shadow-md scale-105 z-10 ring-2 ring-brand-200/60'
                      : isDisabled
                        ? 'bg-stone-50 border border-stone-100 text-stone-300 cursor-not-allowed opacity-50'
                        : 'bg-white border border-cream-200 text-stone-700 hover:border-brand-400 hover:shadow-md hover:scale-105'
                  }`}
                >
                  <span className={`font-heading font-extrabold text-sm sm:text-xl leading-none ${isSelected ? 'text-white' : 'text-ink-900'}`}>
                    {item.dayNum}
                  </span>

                  {/* Status indicators — minimal text */}
                  <div className="mt-0.5 leading-none">
                    {isSelected && (
                      <span className="block w-1.5 h-1.5 rounded-full bg-saffron-300 mx-auto" />
                    )}
                    {item.isFullyBooked && !isSelected && (
                      <span className="hidden sm:block text-[8px] text-stone-400 font-bold leading-tight">Full</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-cream-200 text-[10px] text-stone-400 font-medium flex-wrap gap-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-brand-500" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-stone-100 border border-stone-200" />
              <span>Unavailable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-white border border-cream-200" />
              <span>Available</span>
            </div>
          </div>
        </div>
      ) : (
        /* Weekly Recurring */
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-cream-200 shadow-card-elevated space-y-5">
          <div>
            <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-saffron-500" />
              <span>Weekly Recurring</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Select days of the week for automatic weekly delivery.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayLabel) => {
              const dayId = dayLabel.substring(0, 3);
              const isChecked = recurringDays.includes(dayId);

              return (
                <button
                  key={dayId}
                  onClick={() => toggleRecurringDay(dayId)}
                  className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1 h-24 ${
                    isChecked
                      ? 'bg-saffron-500 text-white border-saffron-500 shadow-glow-orange scale-105'
                      : 'bg-cream-50 border-cream-200 text-stone-700 hover:bg-cream-100'
                  }`}
                >
                  <span className="text-xs font-bold uppercase">{dayId}</span>
                  <span className="font-heading font-extrabold text-xs hidden sm:block">{dayLabel}</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isChecked ? 'border-white bg-white text-saffron-600' : 'border-current opacity-40'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery Time Slot */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-cream-200 shadow-sm space-y-4">
        <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-brand-500" />
          <span>Delivery Window</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: '12:30 PM - 1:30 PM', name: 'Standard Lunch Slot', time: '12:30 PM – 1:30 PM', badge: 'Recommended' },
            { id: '11:30 AM - 12:30 PM', name: 'Early Office Slot', time: '11:30 AM – 12:30 PM', badge: 'Early Bird' },
          ].map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <div
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-4 sm:p-5 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected 
                    ? 'bg-brand-50 border-brand-500 shadow-md' 
                    : 'bg-white border-cream-200 hover:border-brand-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-extrabold text-sm sm:text-base text-ink-900">{slot.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron-500/20 text-saffron-700">
                      {slot.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span>{slot.time}</span>
                  </p>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 ${
                  isSelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-stone-300'
                }`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-gradient-to-r from-ink-900 to-stone-900 rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card-elevated">
        <div className="space-y-1 min-w-0">
          <span className="text-xs text-saffron-400 font-bold uppercase tracking-wider block">Your Schedule</span>
          <div className="flex items-center gap-2 flex-wrap">
            <CalendarDays className="w-4 h-4 text-saffron-400 shrink-0" />
            <p className="font-heading font-extrabold text-sm sm:text-base truncate">
              {selectedDates.length > 1
                ? `${selectedDates.length} dates selected`
                : selectedDate
              }
            </p>
            <span className="text-white/50">·</span>
            <p className="text-sm font-medium text-white/80 truncate">{selectedSlot}</p>
          </div>
          <p className="text-xs text-white/60">
            {filledCount > 0 ? `${filledCount} course${filledCount > 1 ? 's' : ''} in your tiffin.` : 'Build your tiffin first.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={() => navigateTo('builder')}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all flex-1 sm:flex-none text-center"
          >
            Edit Box
          </button>

          <button
            onClick={() => navigateTo('checkout')}
            disabled={!isLunchboxComplete}
            className={`px-6 py-3 rounded-2xl font-heading font-extrabold text-sm transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none shadow-lg ${
              isLunchboxComplete
                ? 'bg-gradient-to-r from-brand-500 to-saffron-500 text-white hover:opacity-95 shadow-glow'
                : 'bg-stone-700 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
