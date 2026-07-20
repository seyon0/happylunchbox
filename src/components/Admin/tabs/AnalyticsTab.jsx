import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign, BarChart2, Activity, ArrowUpRight, Clock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Download, Calendar } from 'lucide-react';
import { adminAPI } from '../../../services/api';

const StatCard = ({ icon: Icon, label, value, sub, color = 'brand' }) => {
  const colors = {
    brand:    { bg: 'bg-brand-50',    text: 'text-brand-600',    border: 'border-brand-100' },
    saffron:  { bg: 'bg-saffron-50',  text: 'text-saffron-600',  border: 'border-saffron-100' },
    fresh:    { bg: 'bg-fresh-50',    text: 'text-fresh-600',    border: 'border-fresh-100' },
    indigo:   { bg: 'bg-indigo-50',   text: 'text-indigo-600',   border: 'border-indigo-100' },
  };
  const c = colors[color] || colors.brand;
  return (
    <div className={`bg-white rounded-2xl border ${c.border} p-5 flex items-center gap-4 shadow-sm`}>
      <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${c.text}`} />
      </div>
      <div>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">{label}</p>
        <p className="font-heading text-2xl font-extrabold text-ink-900">{value}</p>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

const MiniBarChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="h-32 flex items-center justify-center text-stone-400 text-sm">No data yet</div>
  );
  const max = Math.max(...data.map(d => d.revenue || 0), 1);
  return (
    <div className="flex items-end gap-1 h-32">
      {data.slice(-14).map((d, i) => {
        const pct = ((d.revenue || 0) / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-saffron-400 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
              style={{ height: `${Math.max(pct, 4)}%` }}
            />
            <div className="absolute bottom-full mb-1 bg-ink-900 text-white text-[10px] px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              £{(d.revenue || 0).toFixed(2)} · {d.orders} orders
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const AnalyticsTab = () => {
  const { shops } = useApp();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allBookings, setAllBookings] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExportCSV = () => {
    if (!allBookings || allBookings.length === 0) return alert('No data to export');
    let csv = 'Order ID,Customer,Shop,Amount,Status,Date\n';
    allBookings.forEach(b => {
      const bDate = (b.created_at || b.createdAt || new Date().toISOString()).slice(0, 10);
      if (startDate && bDate < startDate) return;
      if (endDate && bDate > endDate) return;
      
      const customer = (b.user?.firstName || b.user_name || b.userName || '').replace(/,/g, '');
      const shop = (b.shop?.name || b.shop_name || b.shopName || '').replace(/,/g, '');
      const amount = parseFloat(b.totalAmount || b.total_price || b.totalPrice || 0).toFixed(2);
      
      csv += `${b.id},${customer},${shop},${amount},${b.status},${bDate}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_export_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [dashMetrics, orders] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getOrders(1, 100) // fetch recent 100
        ]);
        
        const bookings = orders.data || [];
        setAllBookings(bookings);

        const delivered = bookings.filter(b => b.status === 'DELIVERED' || b.status === 'Delivered');
        const active    = bookings.filter(b => ['CONFIRMED', 'COOKING', 'ON_WAY', 'Confirmed', 'Cooking', 'On Way'].includes(b.status));
        const totalRev  = delivered.reduce((s, b) => s + (parseFloat(b.totalPrice || b.total_price) || 0), 0);
        const avgOrder  = delivered.length > 0 ? totalRev / delivered.length : 0;

        // Group by date for chart
        const byDate = {};
        bookings.forEach(b => {
          const date = (b.created_at || b.createdAt || new Date().toISOString()).slice(0, 10);
          if (!byDate[date]) byDate[date] = { date, revenue: 0, orders: 0 };
          if (b.status === 'DELIVERED' || b.status === 'Delivered') byDate[date].revenue += parseFloat(b.totalPrice || b.total_price) || 0;
          byDate[date].orders += 1;
        });
        const daily = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));

        setAnalytics({
          totalRevenue:  dashMetrics.totalRevenue,
          totalOrders:   dashMetrics.totalBookings,
          activeOrders:  active.length,
          avgOrderValue: avgOrder,
          daily,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="p-8 text-center text-stone-400">Loading analytics...</div>;

  const a = analytics;

  return (
    <div className="space-y-6">
      {/* Date Pickers & Export */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-cream-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-stone-400" />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border border-cream-200 rounded-lg text-sm bg-cream-50 focus:outline-none focus:border-brand-500" />
          <span className="text-stone-400">to</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border border-cream-200 rounded-lg text-sm bg-cream-50 focus:outline-none focus:border-brand-500" />
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-stone-800 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign}   label="Total Revenue"  value={`£${a.totalRevenue.toFixed(2)}`}      color="brand" />
        <StatCard icon={ShoppingBag}  label="Total Orders"   value={a.totalOrders}                         color="saffron" />
        <StatCard icon={Activity}     label="Active Orders"  value={a.activeOrders}       sub="Live right now" color="fresh" />
        <StatCard icon={TrendingUp}   label="Avg Order Value" value={`£${a.avgOrderValue.toFixed(2)}`}    color="indigo" />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-heading font-extrabold text-base text-ink-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-brand-500" /> Daily Revenue (Last 14 Days)
            </h4>
            <p className="text-xs text-stone-400">Hover bars for details</p>
          </div>
          <span className="text-xs font-bold text-fresh-600 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Live Data
          </span>
        </div>
        <MiniBarChart data={a.daily} />
      </div>

      {/* Recent Orders Summary */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
        <h4 className="font-heading font-extrabold text-base text-ink-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-saffron-500" /> Recent Orders
        </h4>
        {bookings.length === 0 ? (
          <p className="text-sm text-stone-400 py-4 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-stone-400 uppercase text-[10px] tracking-wide border-b border-cream-100">
                  <th className="pb-2 text-left font-bold">Order ID</th>
                  <th className="pb-2 text-left font-bold">Customer</th>
                  <th className="pb-2 text-left font-bold">Shop</th>
                  <th className="pb-2 text-left font-bold">Amount</th>
                  <th className="pb-2 text-left font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-50">
                {allBookings.slice(0, 10).map(b => (
                  <tr key={b.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-2.5 font-bold text-brand-600">{b.id.slice(-6)}</td>
                    <td className="py-2.5 text-stone-600">{b.user?.firstName || b.user_name || b.userName || '—'}</td>
                    <td className="py-2.5 text-stone-600">{b.shop?.name || b.shop_name || b.shopName || '—'}</td>
                    <td className="py-2.5 font-bold text-ink-900">£{parseFloat(b.totalAmount || b.total_price || b.totalPrice || 0).toFixed(2)}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'DELIVERED' || b.status === 'Delivered' ? 'bg-fresh-100 text-fresh-700' :
                        b.status === 'CANCELLED' || b.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                        b.status === 'ON_WAY' || b.status === 'On Way'    ? 'bg-blue-100 text-blue-600' :
                        b.status === 'COOKING' || b.status === 'Cooking'   ? 'bg-saffron-100 text-saffron-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Shops Overview */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
        <h4 className="font-heading font-extrabold text-base text-ink-900 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" /> Kitchen Performance
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(shops || []).map(shop => {
            const shopOrders = allBookings.filter(b => b.shop === shop.id || b.shopId === shop.id || b.shop?.name === shop.name || b.shop_name === shop.name);
            const shopRev    = shopOrders.filter(b => b.status === 'DELIVERED' || b.status === 'Delivered').reduce((s, b) => s + (parseFloat(b.totalAmount || b.total_price || b.totalPrice) || 0), 0);
            return (
              <div key={shop.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 border border-cream-100">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                  {shop.image_url || shop.imageUrl ? (
                    <img src={shop.image_url || shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-lg font-bold">
                      {shop.name?.[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink-900">{shop.name}</p>
                  <p className="text-xs text-stone-400">{shopOrders.length} orders · £{shopRev.toFixed(2)} revenue</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${shop.is_active ? 'bg-fresh-100 text-fresh-700' : 'bg-stone-100 text-stone-500'}`}>
                  {shop.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
