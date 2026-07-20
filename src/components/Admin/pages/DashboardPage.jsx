import React, { useState, useEffect } from 'react';
import { PoundSterling, ShoppingBag, Users, Store, TrendingUp, TrendingDown, MapPin, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { adminAPI } from '../../../services/api';

const mockRevenueData = [
  { name: 'Mon', revenue: 4000, orders: 240 },
  { name: 'Tue', revenue: 3000, orders: 198 },
  { name: 'Wed', revenue: 2000, orders: 150 },
  { name: 'Thu', revenue: 2780, orders: 208 },
  { name: 'Fri', revenue: 1890, orders: 160 },
  { name: 'Sat', revenue: 5390, orders: 380 },
  { name: 'Sun', revenue: 6490, orders: 430 },
];

const mockZoneData = [
  { name: 'London Central', value: 400 },
  { name: 'Manchester', value: 300 },
  { name: 'Leeds', value: 200 },
  { name: 'Birmingham', value: 100 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
  <div className="bg-admin-900 border border-admin-800 rounded-2xl p-5 shadow-dark-elevated relative overflow-hidden group">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40 ${colorClass}`} />
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl ${colorClass.replace('bg-', 'bg-').replace('500', '500/10')} border border-${colorClass.replace('bg-', '').replace('500', '500/20')}`}>
        <Icon className={`w-5 h-5 text-${colorClass.replace('bg-', '')}`} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'text-fresh-500 bg-fresh-500/10' : 'text-brand-500 bg-brand-500/10'}`}>
        {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trendValue}
      </div>
    </div>
    
    <div className="relative z-10">
      <h3 className="text-admin-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-white text-3xl font-black tracking-tight">{value}</p>
    </div>
  </div>
);

export const DashboardPage = () => {
  const [salesData, setSalesData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminAPI.getDashboard();
        setSalesData({
          totalRevenue: data.totalRevenue,
          deliveredOrders: data.totalBookings,
          predictiveInsights: data.predictiveInsights
        });
        setCustomerData({
          totalCustomers: data.totalUsers,
          acquisitionRate: "+2.1%"
        });
      } catch (err) {
        console.error('Dashboard fetch failed, using mock data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Platform Overview</h1>
          <p className="text-sm font-semibold text-admin-400">Real-time metrics and live operations map.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-admin-800 border border-admin-700 text-admin-300 rounded-lg text-sm font-bold hover:text-white transition-colors">
            Last 7 Days
          </button>
          <button className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-bold hover:bg-brand-600 shadow-glow transition-all">
            Export PDF
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`£${salesData?.totalRevenue?.toFixed(2) || '24,550'}`} 
          icon={PoundSterling} trend="up" trendValue="+12.5%" colorClass="bg-brand-500" 
        />
        <StatCard 
          title="Active Orders" 
          value={salesData?.deliveredOrders || '342'} 
          icon={ShoppingBag} trend="up" trendValue="+5.2%" colorClass="bg-saffron-500" 
        />
        <StatCard 
          title="Total Customers" 
          value={customerData?.totalCustomers || '12,849'} 
          icon={Users} trend="up" trendValue={customerData?.acquisitionRate || "+2.1%"} colorClass="bg-blue-500" 
        />
        <StatCard 
          title="Active Vendors" 
          value="156" 
          icon={Store} trend="down" trendValue="-1.4%" colorClass="bg-purple-500" 
        />
      </div>

      {/* Predictive Trends & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Predictive Trends Card */}
        {salesData?.predictiveInsights && (
          <div className="lg:col-span-3 bg-indigo-900 border border-indigo-800 rounded-3xl p-6 shadow-dark-elevated">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-indigo-400" />
              AI Predictive Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-950/50 p-4 rounded-2xl border border-indigo-800/50">
                <p className="text-xs text-indigo-300 font-bold mb-1 uppercase">Forecasted Revenue (Next 7 Days)</p>
                <p className="text-2xl font-black text-white">£{salesData.predictiveInsights.forecastRevenueNextWeek?.toFixed(2)}</p>
              </div>
              <div className="bg-indigo-950/50 p-4 rounded-2xl border border-indigo-800/50">
                <p className="text-xs text-indigo-300 font-bold mb-1 uppercase">Trending Dishes</p>
                <p className="text-sm font-bold text-white leading-tight">
                  {salesData.predictiveInsights.trendingDishes?.join(', ')}
                </p>
              </div>
              <div className="bg-indigo-950/50 p-4 rounded-2xl border border-indigo-800/50">
                <p className="text-xs text-indigo-300 font-bold mb-1 uppercase">Expected Demand Spike</p>
                <p className="text-2xl font-black text-white">{salesData.predictiveInsights.demandSpikeExpected}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-admin-900 border border-admin-800 rounded-3xl p-6 shadow-dark-elevated">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-white">Revenue & Order Trends</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-admin-400"><div className="w-2 h-2 rounded-full bg-brand-500"/> Revenue</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-admin-400"><div className="w-2 h-2 rounded-full bg-saffron-500"/> Orders</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E63946" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E63946" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F77F00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F77F00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `£${value}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#E63946" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#F77F00" strokeWidth={3} fillOpacity={1} fill="url(#colorOrd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Zone Map (Simulated) */}
        <div className="bg-admin-900 border border-admin-800 rounded-3xl p-6 shadow-dark-elevated relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-500"/> Live Zones</h2>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"/>
              <span className="text-[10px] font-black text-brand-500 uppercase tracking-wider">Live</span>
            </div>
          </div>
          
          <div className="flex-1 bg-admin-950 rounded-2xl border border-admin-800 relative overflow-hidden flex items-center justify-center">
            {/* Simulated Map SVG Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Blips */}
            <div className="absolute top-1/4 left-1/4">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-3 h-3 bg-brand-500 rounded-full border-2 border-admin-950"></div>
              </div>
            </div>
            <div className="absolute top-1/2 right-1/3">
              <div className="relative">
                <div className="absolute inset-0 bg-saffron-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-3 h-3 bg-saffron-500 rounded-full border-2 border-admin-950"></div>
              </div>
            </div>
            <div className="absolute bottom-1/3 left-1/3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-3 h-3 bg-blue-500 rounded-full border-2 border-admin-950"></div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-admin-900/90 backdrop-blur border border-admin-800 rounded-xl p-3 flex justify-between items-center z-10">
               <div>
                 <p className="text-[10px] font-bold text-admin-400 uppercase tracking-wider">Active Riders</p>
                 <p className="text-white font-black text-lg">142</p>
               </div>
               <Activity className="w-5 h-5 text-admin-500" />
            </div>
          </div>
        </div>

      </div>

      {/* Zone Performance Bar Chart */}
      <div className="bg-admin-900 border border-admin-800 rounded-3xl p-6 shadow-dark-elevated h-80">
        <h2 className="text-base font-bold text-white mb-6">Orders by Zone</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockZoneData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} width={100} />
            <Tooltip cursor={{fill: '#1E293B'}} contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
            <Bar dataKey="value" fill="#E63946" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
