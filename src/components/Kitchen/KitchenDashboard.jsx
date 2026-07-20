import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { shopsAPI } from '../../services/api';
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Package, XCircle, Store, Box, RefreshCw } from 'lucide-react';

export const KitchenDashboard = ({ shop, isOffline, newOrderAudio, fetchDashboardData }) => {
  const { selectedShopId } = useApp();
  const [range, setRange] = useState('today');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);

  // Quick actions loading states
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (selectedShopId || shop?.id) {
      loadPerformanceData();
    }
  }, [selectedShopId, shop?.id, range]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const targetShopId = selectedShopId || shop?.id;
      if (!targetShopId) return;
      
      const data = await shopsAPI.getPerformance(targetShopId, range);
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOperatingStatus = async () => {
    try {
      setIsUpdatingStatus(true);
      const targetShopId = selectedShopId || shop?.id;
      const newStatus = !(metrics?.isOperating ?? shop?.isOperating);
      await shopsAPI.updateOperations(targetShopId, { isOperating: newStatus });
      await fetchDashboardData(); // Refresh overall data
      await loadPerformanceData();
    } catch (err) {
      alert("Failed to update status. Are you offline?");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // The active metrics
  const m = metrics || {
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    unavailableItemsCount: 0,
    isOperating: shop?.isOperating ?? true
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-stone-50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Date Range */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-heading font-extrabold text-ink-900">Dashboard Overview</h2>
            <p className="text-stone-500 text-sm font-medium mt-1">Real-time performance and operations hub</p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-full border border-cream-200 shadow-sm self-start md:self-auto">
            {['today', 'thisWeek', 'last12Weeks'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  range === r 
                    ? 'bg-ink-900 text-white' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {r === 'today' ? 'Today' : r === 'thisWeek' ? 'This Week' : '12 Weeks'}
              </button>
            ))}
          </div>
        </div>

        {/* Live Alerts Banner */}
        <div className="flex flex-col gap-2">
          {isOffline && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-bold text-red-800">You are currently offline</p>
                <p className="text-xs text-red-600 font-medium">Orders and metrics may not be up to date.</p>
              </div>
            </div>
          )}
          
          {!m.isOperating && (
            <div className="bg-saffron-50 border border-saffron-300 rounded-2xl p-4 flex items-center gap-3">
              <Store className="w-5 h-5 text-saffron-600" />
              <div>
                <p className="text-sm font-bold text-saffron-800">Your store is Paused</p>
                <p className="text-xs text-saffron-700 font-medium">You are not receiving new orders.</p>
              </div>
              <button onClick={handleToggleOperatingStatus} disabled={isUpdatingStatus} className="ml-auto px-4 py-2 bg-saffron-500 text-ink-900 rounded-xl text-xs font-bold hover:bg-saffron-600 transition-colors">
                Resume Store
              </button>
            </div>
          )}

          {m.unavailableItemsCount > 0 && (
            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-center gap-3">
              <Box className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-sm font-bold text-brand-800">Low Stock Warning</p>
                <p className="text-xs text-brand-700 font-medium">{m.unavailableItemsCount} menu item(s) are currently marked out of stock.</p>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Snapshots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SnapshotCard 
            title="Total Revenue" 
            value={`£${m.totalRevenue.toFixed(2)}`} 
            icon={<DollarSign className="w-5 h-5 text-fresh-500" />} 
            trend="+12%" 
            loading={loading} 
          />
          <SnapshotCard 
            title="Orders Received" 
            value={m.totalOrders} 
            icon={<Package className="w-5 h-5 text-brand-500" />} 
            trend="+5%" 
            loading={loading} 
          />
          <SnapshotCard 
            title="Completed" 
            value={m.completedOrders} 
            icon={<TrendingUp className="w-5 h-5 text-fresh-500" />} 
            trend="+8%" 
            loading={loading} 
          />
          <SnapshotCard 
            title="Cancellations" 
            value={m.cancelledOrders} 
            icon={<XCircle className="w-5 h-5 text-red-500" />} 
            trend="-2%" 
            loading={loading} 
            alert={m.cancelledOrders > 5}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-cream-200 rounded-3xl p-6 shadow-sm">
          <h3 className="font-heading text-lg font-extrabold text-ink-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={handleToggleOperatingStatus}
              disabled={isUpdatingStatus}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${m.isOperating ? 'bg-red-50 border-red-100 hover:border-red-300' : 'bg-fresh-50 border-fresh-100 hover:border-fresh-300'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${m.isOperating ? 'bg-red-100 text-red-500' : 'bg-fresh-100 text-fresh-600'}`}>
                <Store className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold ${m.isOperating ? 'text-red-700' : 'text-fresh-800'}`}>
                  {m.isOperating ? 'Pause Store' : 'Open Store'}
                </p>
                <p className={`text-xs ${m.isOperating ? 'text-red-500' : 'text-fresh-600'}`}>
                  {m.isOperating ? 'Stop receiving orders' : 'Start accepting orders'}
                </p>
              </div>
            </button>

            <button 
              onClick={() => {
                // To jump to menu, we could use navigateTo if we had it, but this component doesn't switch tabs natively unless we pass setActiveTab
                // For now, it's a static quick action that triggers a reload of data as a test
                loadPerformanceData();
              }}
              className="flex items-center gap-4 p-4 rounded-2xl border bg-stone-50 border-stone-200 hover:border-stone-300 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-ink-900">Refresh Data</p>
                <p className="text-xs text-stone-500">Sync latest dashboard metrics</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const SnapshotCard = ({ title, value, icon, trend, loading, alert }) => (
  <div className={`bg-white border ${alert ? 'border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-cream-200'} rounded-3xl p-6 shadow-sm flex flex-col`}>
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-sm font-bold text-stone-500">{title}</h4>
      <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center border border-cream-100">
        {icon}
      </div>
    </div>
    
    {loading ? (
      <div className="h-8 bg-stone-100 rounded-lg animate-pulse w-1/2 mt-auto"></div>
    ) : (
      <div className="flex items-end justify-between mt-auto">
        <p className={`text-3xl font-heading font-black ${alert ? 'text-red-600' : 'text-ink-900'}`}>{value}</p>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-fresh-50 text-fresh-600' : 'bg-red-50 text-red-500'}`}>
          {trend}
        </span>
      </div>
    )}
  </div>
);
