import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Users, Bike, Download, ShieldAlert,
  TrendingUp, TrendingDown, DollarSign, Activity, FileSpreadsheet, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api/analytics';

const StatCard = ({ title, value, subtitle, trend, icon: Icon, colorClass, borderClass }) => (
  <div className={`bg-admin-900 p-6 rounded-3xl shadow-dark-elevated border flex flex-col justify-between hover:bg-admin-800 transition-all ${borderClass || 'border-admin-800'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl border ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${trend.includes('+') || trend.includes('High') || trend.includes('Good') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-black text-white">{value}</h3>
      <p className="text-sm font-bold text-admin-500 uppercase tracking-wide mt-1">{title}</p>
      {subtitle && <p className="text-xs text-admin-400 mt-2 font-medium">{subtitle}</p>}
    </div>
  </div>
);

export const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('sales');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [salesData, setSalesData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [riderData, setRiderData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, customersRes, ridersRes] = await Promise.all([
        fetch(`${API_URL}/sales`),
        fetch(`${API_URL}/customers`),
        fetch(`${API_URL}/riders`)
      ]);
      
      if (!salesRes.ok) throw new Error('Failed to fetch analytics data');
      
      setSalesData(await salesRes.json());
      setCustomerData(await customersRes.json());
      setRiderData(await ridersRes.json());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Cannot connect to the backend analytics engine. Is NestJS running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = (dataset) => {
    window.open(`${API_URL}/export?dataset=${dataset}`, '_blank');
  };

  if (loading) return <div className="p-8 text-center text-admin-500 font-bold animate-pulse">Aggregating Data...</div>;

  if (error) return (
    <div className="p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/20 mt-6 max-w-2xl mx-auto shadow-dark-elevated">
      <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-lg font-bold text-red-400 mb-2">Backend Connection Error</h2>
      <p className="text-sm text-red-300">{error}</p>
      <button onClick={fetchData} className="mt-6 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-500 transition-colors shadow-glow">Retry Connection</button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-full overflow-hidden pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics & Reporting</h1>
        <p className="text-sm text-admin-400 mt-1">Platform metrics, LTV, operations, and data exports</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-admin-900 p-1.5 rounded-2xl w-fit border border-admin-800 shadow-dark-elevated">
        {[['sales', 'Sales & Orders', BarChart2], ['customers', 'Customers', Users], ['riders', 'Logistics', Bike], ['export', 'Export Hub', Download]].map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === key 
                ? 'bg-brand-500/20 text-brand-400 shadow-glow' 
                : 'text-admin-400 hover:text-white hover:bg-admin-800'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Sales Tab */}
      {activeTab === 'sales' && salesData && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Revenue" 
              value={`£${salesData.totalRevenue.toFixed(2)}`} 
              trend="+15%" 
              icon={DollarSign} 
              colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
            />
            <StatCard 
              title="Avg Order Value" 
              value={`£${salesData.averageOrderValue.toFixed(2)}`} 
              icon={Activity} 
              colorClass="bg-blue-500/10 text-blue-400 border-blue-500/20" 
            />
            <StatCard 
              title="Delivered Orders" 
              value={salesData.deliveredOrders} 
              icon={CheckCircle} 
              colorClass="bg-brand-500/10 text-brand-400 border-brand-500/20" 
            />
            <StatCard 
              title="Cancelled Orders" 
              value={salesData.cancelledOrders} 
              icon={AlertTriangle} 
              colorClass="bg-red-500/10 text-red-400 border-red-500/20" 
            />
          </div>

          <div className="bg-admin-900 p-6 rounded-3xl shadow-dark-elevated border border-admin-800">
            <h3 className="font-bold text-white mb-6">Peak Hour Heatmap</h3>
            <div className="flex gap-4 items-end h-40">
              {salesData.peakHours.map((ph, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center group">
                  <div 
                    className="w-full bg-brand-500 rounded-t-lg transition-all group-hover:bg-brand-400 shadow-glow" 
                    style={{ height: `${(ph.volume / 120) * 100}%` }}
                  ></div>
                  <span className="text-[10px] font-bold text-admin-500 mt-2">{ph.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && customerData && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Customers" 
              value={customerData.totalCustomers} 
              trend={customerData.acquisitionRate} 
              icon={Users} 
              colorClass="bg-purple-500/10 text-purple-400 border-purple-500/20" 
            />
            <StatCard 
              title="Repeat Order Rate" 
              value={`${customerData.repeatRate}%`} 
              subtitle={`${customerData.repeatCustomers} active repeat users`}
              icon={TrendingUp} 
              colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
            />
            <StatCard 
              title="Estimated Churn" 
              value={customerData.churnRate} 
              icon={TrendingDown} 
              colorClass="bg-saffron-500/10 text-saffron-400 border-saffron-500/20" 
            />
          </div>
        </div>
      )}

      {/* Riders Tab */}
      {activeTab === 'riders' && riderData && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Fleet Size" 
              value={riderData.totalRiders} 
              subtitle={`${riderData.activeRiders} currently active`}
              icon={Bike} 
              colorClass="bg-saffron-500/10 text-saffron-400 border-saffron-500/20" 
            />
            <StatCard 
              title="Avg Delivery Time" 
              value={riderData.averageDeliveryTime} 
              icon={Clock} 
              colorClass="bg-blue-500/10 text-blue-400 border-blue-500/20" 
            />
            <StatCard 
              title="On-Time Rate" 
              value={riderData.onTimeRate} 
              icon={CheckCircle} 
              colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
            />
          </div>
          <div className="bg-admin-900 p-6 rounded-3xl shadow-dark-elevated border border-admin-800">
            <h3 className="font-bold text-white mb-4">Zone Coverage Alerts</h3>
            <div className="flex gap-2 flex-wrap">
              {riderData.zoneCoverageGaps.map(z => (
                <span key={z} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-bold border border-red-500/20">
                  {z} (Understaffed)
                </span>
              ))}
              {riderData.zoneCoverageGaps.length === 0 && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
                  All Zones Adequately Staffed
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Hub */}
      {activeTab === 'export' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-admin-900 p-8 rounded-3xl shadow-dark-elevated border border-admin-800 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileSpreadsheet className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Raw Data Export (CSV)</h2>
            <p className="text-admin-400 max-w-md mx-auto mb-8 text-sm">Download complete platform datasets for external BI analysis. The system will stream live data directly into a CSV format.</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => handleExport('sales')} className="px-6 py-3 bg-admin-950 text-white font-bold rounded-xl border border-admin-700 hover:bg-admin-800 hover:text-brand-400 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Sales Data
              </button>
              <button onClick={() => handleExport('customers')} className="px-6 py-3 bg-admin-950 text-white font-bold rounded-xl border border-admin-700 hover:bg-admin-800 hover:text-brand-400 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Customer Data
              </button>
              <button onClick={() => window.open(`${API_URL}/bi-export`, '_blank')} className="px-6 py-3 bg-brand-500 text-white font-bold rounded-xl shadow-glow hover:bg-brand-600 transition-colors flex items-center gap-2">
                <Activity className="w-4 h-4" /> Export BI JSON
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
