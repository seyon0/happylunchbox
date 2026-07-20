import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Search, Filter, MoreVertical, Eye, CheckCircle2, Clock, XCircle, MapPin, Truck, ChevronLeft, ChevronRight, ArrowUpDown, AlertTriangle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    'Confirmed': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Cooking': 'bg-saffron-500/10 text-saffron-400 border-saffron-500/20',
    'On Way': 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    'Delivered': 'bg-fresh-500/10 text-fresh-400 border-fresh-500/20',
    'Cancelled': 'bg-admin-500/10 text-admin-400 border-admin-500/20'
  };

  const icons = {
    'Confirmed': <CheckCircle2 className="w-3 h-3" />,
    'Cooking': <Clock className="w-3 h-3" />,
    'On Way': <Truck className="w-3 h-3" />,
    'Delivered': <MapPin className="w-3 h-3" />,
    'Cancelled': <XCircle className="w-3 h-3" />
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${styles[status] || styles.Confirmed}`}>
      {icons[status]} {status}
    </span>
  );
};

export const OrdersPage = () => {
  const { bookings, updateOrderStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [activeDropdown, setActiveDropdown] = useState(null);

  const statuses = ['All', 'Confirmed', 'Cooking', 'On Way', 'Delivered', 'Cancelled'];

  const filteredOrders = bookings.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.restaurantName && b.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Orders Management</h1>
          <p className="text-sm font-semibold text-admin-400">High-density view of all platform transactions.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-admin-800 border border-admin-700 text-admin-300 rounded-lg text-sm font-bold hover:text-white transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-admin-900 p-2 rounded-2xl border border-admin-800 shadow-dark-elevated">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-admin-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID or Restaurant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-admin-950 border border-admin-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-admin-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === status 
                ? 'bg-brand-500 text-white shadow-glow' 
                : 'bg-admin-950 text-admin-400 border border-admin-800 hover:text-admin-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 bg-admin-900 border border-admin-800 rounded-3xl overflow-hidden shadow-dark-elevated flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-admin-950/80 backdrop-blur sticky top-0 z-10 border-b border-admin-800">
              <tr>
                <th className="px-5 py-4 text-[10px] font-black text-admin-500 uppercase tracking-wider cursor-pointer group" onClick={() => requestSort('id')}>
                  <div className="flex items-center gap-1 hover:text-admin-300 transition-colors">Order ID <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-5 py-4 text-[10px] font-black text-admin-500 uppercase tracking-wider cursor-pointer group" onClick={() => requestSort('date')}>
                  <div className="flex items-center gap-1 hover:text-admin-300 transition-colors">Date & Time <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-5 py-4 text-[10px] font-black text-admin-500 uppercase tracking-wider cursor-pointer group" onClick={() => requestSort('restaurantName')}>
                  <div className="flex items-center gap-1 hover:text-admin-300 transition-colors">Vendor <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-5 py-4 text-[10px] font-black text-admin-500 uppercase tracking-wider cursor-pointer group" onClick={() => requestSort('total')}>
                  <div className="flex items-center gap-1 hover:text-admin-300 transition-colors">Total <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-5 py-4 text-[10px] font-black text-admin-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-[10px] font-black text-admin-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-800/50">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-admin-500 font-semibold text-sm">
                    No orders match your filters.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-admin-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{order.id}</span>
                        {order.riskScore > 75 && (
                          <span title={`High Fraud Risk: ${order.riskScore}`} className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-500">
                            <AlertTriangle className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-xs font-semibold text-admin-300">{order.date || 'Today'}</div>
                      <div className="text-[10px] font-bold text-admin-500">{order.timeSlot || '12:00 PM'}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-semibold text-admin-200">{order.restaurantName || 'Healthy Kitchen'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-bold text-brand-400">£{(order.total || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                        className="p-1.5 rounded-lg text-admin-500 hover:text-white hover:bg-admin-800 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Inline Action Dropdown */}
                      {activeDropdown === order.id && (
                        <div className="absolute right-10 top-3 w-40 bg-admin-800 border border-admin-700 rounded-xl shadow-dark-floating overflow-hidden z-50 text-left">
                          <button className="w-full px-4 py-2 text-xs font-bold text-admin-300 hover:text-white hover:bg-admin-700 flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5" /> View Details
                          </button>
                          <button 
                            onClick={() => { updateOrderStatus(order.id, 'Delivered'); setActiveDropdown(null); }}
                            className="w-full px-4 py-2 text-xs font-bold text-admin-300 hover:text-white hover:bg-admin-700 flex items-center gap-2"
                          >
                            <MapPin className="w-3.5 h-3.5" /> Mark Delivered
                          </button>
                          <button 
                            onClick={() => { updateOrderStatus(order.id, 'Cancelled'); setActiveDropdown(null); }}
                            className="w-full px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-admin-700 flex items-center gap-2 border-t border-admin-700"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel Order
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-5 py-4 border-t border-admin-800 bg-admin-950/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-admin-500">
            Showing <strong className="text-white">1</strong> to <strong className="text-white">{sortedOrders.length}</strong> of <strong className="text-white">{sortedOrders.length}</strong> entries
          </span>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-lg bg-admin-900 border border-admin-800 text-admin-500 hover:text-white transition-colors disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg bg-admin-900 border border-admin-800 text-admin-500 hover:text-white transition-colors disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
