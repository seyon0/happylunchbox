import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { bookingsAPI, authAPI } from '../../services/api';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  LogOut,
  ChevronRight,
  User,
  RefreshCw,
  Target,
  Award,
} from 'lucide-react';

const getDisplayStatus = (status) => {
  if (['CONFIRMED', 'COOKING'].includes(status)) return 'Pending Pickup';
  if (status === 'ON_WAY') return 'On Way';
  if (status === 'DELIVERED') return 'Delivered';
  return status;
};

const getNextStatus = (current) => {
  if (['CONFIRMED', 'COOKING'].includes(current)) return 'ON_WAY';
  if (current === 'ON_WAY') return 'DELIVERED';
  return null;
};

const getStatusStyle = (status) => {
  const display = getDisplayStatus(status);
  switch (display) {
    case 'Pending Pickup':
      return 'bg-amber-400 hover:bg-amber-500 text-amber-900';
    case 'On Way':
      return 'bg-brand-500 hover:bg-brand-600 text-white';
    case 'Delivered':
      return 'bg-green-600 text-white cursor-default';
    default:
      return 'bg-stone-300 text-stone-700';
  }
};

export const RiderDashboard = () => {
  const { navigateTo } = useApp();
  const [rider, setRider] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [incentives, setIncentives] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authenticate and load rider data
  useEffect(() => {
    const fetchRider = async () => {
      try {
        const res = await authAPI.me();
        if (res?.user?.role === 'RIDER') {
          setRider(res.user);
          fetchDeliveries();
        } else {
          throw new Error('Not a rider');
        }
      } catch (err) {
        navigateTo('rider-auth');
      }
    };
    fetchRider();
  }, [navigateTo]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const [delData, incData] = await Promise.all([
        bookingsAPI.riderDeliveries(),
        bookingsAPI.riderIncentives().catch(() => null)
      ]);
      setDeliveries(delData);
      setIncentives(incData);
    } catch (err) {
      console.error('Failed to fetch deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!rider || !rider.id) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 100%)' }}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-heading text-2xl font-black text-white">Loading...</h2>
        </div>
      </div>
    );
  }

  const handleAdvanceStatus = async (deliveryId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    // Optimistic update
    setDeliveries(prev =>
      prev.map(d => d.id === deliveryId ? { ...d, status: nextStatus } : d)
    );

    try {
      await bookingsAPI.updateStatus(deliveryId, nextStatus);
    } catch (err) {
      // Revert on failure
      alert('Failed to update status');
      fetchDeliveries();
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigateTo('rider-auth');
  };

  const pendingCount = deliveries.filter(d => d.status !== 'DELIVERED').length;
  const deliveredCount = deliveries.filter(d => d.status === 'DELIVERED').length;
  const earningsToday = deliveries
    .filter(d => d.status === 'DELIVERED')
    .reduce((sum, d) => sum + (d.totalAmount || 0), 0);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #0d1117 0%, #f5f5f0 220px)' }}
    >
      {/* Dark Header */}
      <div
        className="px-4 pt-8 pb-24"
        style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 60%, #111827 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Rider Portal</p>
                <p className="text-white font-heading font-extrabold text-base">Healthy Lunchbox</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>

          {/* Rider Info */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-3xl flex items-center justify-center text-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-black text-white">{rider.firstName} {rider.lastName}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-stone-400 text-xs font-medium">Delivery Partner</span>
                <span className="w-1 h-1 rounded-full bg-stone-600" />
                <span className="text-stone-400 text-xs font-medium">{rider.phone || 'No Phone'}</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <p className="font-heading text-2xl font-black text-white">£{earningsToday.toFixed(2)}</p>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mt-1">Order Volume</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <p className="font-heading text-2xl font-black text-white">{deliveredCount}</p>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mt-1">Delivered</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <p className="font-heading text-2xl font-black text-amber-400">{pendingCount}</p>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mt-1">Pending</p>
            </div>
          </div>

          {/* Incentives Card */}
          {incentives && (
            <div className="mt-6 bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-5 border border-brand-500 shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-500 rounded-full blur-2xl opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-saffron-300" />
                  <h3 className="font-heading font-extrabold text-white text-sm">Today's Bonus Challenge</h3>
                </div>
                <p className="text-brand-100 text-xs font-medium mb-4">{incentives.message}</p>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-black text-white">{incentives.currentProgress} / {incentives.dailyTarget}</span>
                  <span className="text-xs font-bold text-saffron-300 bg-black/20 px-2 py-1 rounded-lg">£{incentives.bonusAmount} Reward</span>
                </div>
                <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-saffron-400 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (incentives.currentProgress / incentives.dailyTarget) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delivery List */}
      <div className="max-w-2xl mx-auto px-4 -mt-12 pb-16 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-500" />
            Today's Deliveries
          </h2>
          <button onClick={fetchDeliveries} className="p-2 bg-white rounded-xl shadow-sm text-stone-500 hover:text-brand-500 transition-colors">
             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {deliveries.length === 0 && !loading && (
          <div className="bg-white rounded-3xl border border-cream-200 p-8 text-center text-stone-500">
            You have no assigned deliveries right now.
          </div>
        )}

        {deliveries.map((delivery) => {
          const nextStatus = getNextStatus(delivery.status);
          const isDelivered = delivery.status === 'DELIVERED';
          const displayStatus = getDisplayStatus(delivery.status);
          const customerName = delivery.user ? `${delivery.user.firstName} ${delivery.user.lastName}` : 'Unknown Customer';

          return (
            <div
              key={delivery.id}
              className="bg-white rounded-3xl border border-cream-200 shadow-card-elevated overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-5 pt-5 pb-4 border-b border-cream-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-extrabold text-lg text-ink-900">{customerName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream-100 text-stone-500">
                      Order {delivery.id.split('-')[0].toUpperCase()}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    isDelivered
                      ? 'bg-green-100 text-green-700'
                      : delivery.status === 'ON_WAY'
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}>
                    {displayStatus}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-5 py-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span className="font-medium">Customer's Default Address (via Profile)</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-medium">{delivery.deliverySlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <Package className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-medium">1 bundle</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-extrabold text-brand-600 text-sm">£{delivery.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Action */}
              <div className="px-5 pb-5">
                {isDelivered ? (
                  <div className="flex items-center gap-2 py-3 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-600">Delivered Successfully</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdvanceStatus(delivery.id, delivery.status)}
                    className={`w-full py-3 rounded-2xl font-heading font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${getStatusStyle(delivery.status)}`}
                  >
                    Mark as: {getDisplayStatus(nextStatus)}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
