import React, { useState } from 'react';
import { Search, Eye, Mail, Bell, ShieldAlert, CheckCircle2, Ban, ChevronLeft, ChevronRight, ArrowUpDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialCustomers = [
  { id: 'c1', name: 'Anita Sharma', email: 'anita@example.com', segment: 'VIP', ltv: 892.50, wallet: 45.00, orders: 67, lastOrder: '15/07/2026', status: 'Active' },
  { id: 'c2', name: 'Ben Carter', email: 'ben@example.com', segment: 'REGULAR', ltv: 312.75, wallet: 12.50, orders: 24, lastOrder: '12/07/2026', status: 'Active' },
  { id: 'c3', name: 'Chloe Evans', email: 'chloe@example.com', segment: 'AT_RISK', ltv: 180.00, wallet: 0.00, orders: 14, lastOrder: '20/06/2026', status: 'Active' },
  { id: 'c4', name: 'David Park', email: 'david@example.com', segment: 'VIP', ltv: 1245.00, wallet: 100.00, orders: 98, lastOrder: '16/07/2026', status: 'Active' },
  { id: 'c5', name: 'Emma Wilson', email: 'emma@example.com', segment: 'REGULAR', ltv: 432.25, wallet: 20.00, orders: 33, lastOrder: '10/07/2026', status: 'Active' },
  { id: 'c6', name: 'Faisal Ahmed', email: 'faisal@example.com', segment: 'NEW', ltv: 35.50, wallet: 0.00, orders: 3, lastOrder: '14/07/2026', status: 'Active' },
  { id: 'c7', name: 'Grace Lee', email: 'grace@example.com', segment: 'VIP', ltv: 780.00, wallet: 60.00, orders: 58, lastOrder: '13/07/2026', status: 'Active' },
  { id: 'c8', name: 'Harry Brown', email: 'harry@example.com', segment: 'AT_RISK', ltv: 120.00, wallet: 0.00, orders: 9, lastOrder: '30/05/2026', status: 'Active' },
  { id: 'c9', name: 'Isla Scott', email: 'isla@example.com', segment: 'REGULAR', ltv: 267.00, wallet: 5.00, orders: 20, lastOrder: '08/07/2026', status: 'Banned' },
  { id: 'c10', name: 'James Wong', email: 'james@example.com', segment: 'REGULAR', ltv: 390.00, wallet: 15.00, orders: 30, lastOrder: '11/07/2026', status: 'Active' },
];

const SegmentBadge = ({ segment }) => {
  const styles = {
    VIP: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    REGULAR: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    AT_RISK: 'bg-saffron-500/10 text-saffron-400 border-saffron-500/20',
    NEW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border ${styles[segment] || styles.REGULAR}`}>
      {segment.replace('_', ' ')}
    </span>
  );
};

export const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (segmentFilter === 'All') return matchesSearch;
    return matchesSearch && c.segment === segmentFilter;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Customer CRM</h1>
          <p className="text-sm font-semibold text-admin-400">High-density view of platform users and metrics.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-bold hover:bg-brand-600 shadow-glow transition-all flex items-center gap-2">
            <Mail className="w-4 h-4" /> Broadcast
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-admin-900 p-2 rounded-2xl border border-admin-800 shadow-dark-elevated">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-admin-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-admin-950 border border-admin-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-admin-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {['All', 'VIP', 'REGULAR', 'NEW', 'AT_RISK'].map(seg => (
            <button
              key={seg}
              onClick={() => setSegmentFilter(seg)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                segmentFilter === seg 
                ? 'bg-brand-500 text-white shadow-glow' 
                : 'bg-admin-950 text-admin-400 border border-admin-800 hover:text-admin-200'
              }`}
            >
              {seg.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 bg-admin-900 border border-admin-800 rounded-3xl shadow-dark-elevated overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto no-scrollbar relative">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-admin-950/90 backdrop-blur-md z-40 border-b border-admin-800">
              <tr>
                {[{key:'name', label:'Customer'}, {key:'segment', label:'Segment'}, {key:'ltv', label:'LTV (£)'}, {key:'wallet', label:'Wallet (£)'}, {key:'orders', label:'Orders'}, {key:'status', label:'Status'}].map((col) => (
                  <th 
                    key={col.key}
                    onClick={() => requestSort(col.key)}
                    className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === col.key ? 'text-brand-500' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-[10px] font-black text-admin-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-800/50">
              {sortedCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-admin-800/30 transition-colors group cursor-pointer" onClick={() => navigate(`/admin/customers/${c.id}`)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-admin-800 border border-admin-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{c.name}</p>
                        <p className="text-[10px] font-semibold text-admin-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <SegmentBadge segment={c.segment} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-white">£{c.ltv.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-emerald-400">£{c.wallet.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-admin-300">{c.orders}</span>
                      <span className="text-[10px] text-admin-500">Last: {c.lastOrder}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${c.status === 'Active' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {c.status === 'Active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/customers/${c.id}`); }}
                      className="px-3 py-1.5 bg-admin-800 border border-admin-700 text-admin-300 rounded-lg text-xs font-bold hover:text-white transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              
              {sortedCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <ShieldAlert className="w-12 h-12 text-admin-700 mx-auto mb-3" />
                    <p className="text-admin-400 font-semibold">No customers found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-admin-800 flex items-center justify-between bg-admin-950/50">
          <p className="text-xs font-semibold text-admin-500">
            Showing <span className="text-white">{sortedCustomers.length}</span> customers
          </p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-admin-900 border border-admin-800 text-admin-400 hover:text-white hover:bg-admin-800 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-admin-900 border border-admin-800 text-admin-400 hover:text-white hover:bg-admin-800 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
