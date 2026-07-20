import React, { useState } from 'react';
import { Bike, MapPin, Search, MoreVertical, Eye, ShieldAlert, CheckCircle2, Ban, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialRiders = [
  { id: 'r1', name: 'Raj Kumar', phone: '+44 7700 900123', vehicle: 'Bicycle', zone: 'Central London', status: 'ONLINE', rating: 4.8, deliveries: 124 },
  { id: 'r2', name: 'Priya Nair', phone: '+44 7700 900124', vehicle: 'Moped', zone: 'North London', status: 'ONLINE', rating: 4.9, deliveries: 89 },
  { id: 'r3', name: 'John Smith', phone: '+44 7700 900125', vehicle: 'Bicycle', zone: 'East London', status: 'SUSPENDED', rating: 4.2, deliveries: 45 },
  { id: 'r4', name: 'Amara Osei', phone: '+44 7700 900126', vehicle: 'Electric Scooter', zone: 'South London', status: 'OFFLINE', rating: 4.6, deliveries: 210 },
  { id: 'r5', name: 'Li Wei', phone: '+44 7700 900127', vehicle: 'Bicycle', zone: 'West London', status: 'ONLINE', rating: 4.8, deliveries: 156 },
  { id: 'r6', name: 'Nia Jones', phone: '+44 7700 900130', vehicle: 'Bicycle', zone: 'South London', status: 'BLOCKED', rating: 3.5, deliveries: 12 },
];

const StatusBadge = ({ status }) => {
  const map = {
    ONLINE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    OFFLINE: 'bg-admin-500/10 text-admin-400 border-admin-500/20',
    SUSPENDED: 'bg-saffron-500/10 text-saffron-400 border-saffron-500/20',
    BLOCKED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${map[status] || map.OFFLINE}`}>
      {status === 'ONLINE' ? <CheckCircle2 className="w-3 h-3" /> : (status === 'BLOCKED' ? <Ban className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-current opacity-70" />)}
      {status}
    </span>
  );
};

export const RidersPage = () => {
  const navigate = useNavigate();
  const [riders, setRiders] = useState(initialRiders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [activeDropdown, setActiveDropdown] = useState(null);

  const filteredRiders = riders.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.zone.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && r.status === statusFilter;
  });

  const sortedRiders = [...filteredRiders].sort((a, b) => {
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

  const toggleStatus = (id, newStatus) => {
    setRiders(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setActiveDropdown(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Riders Fleet</h1>
          <p className="text-sm font-semibold text-admin-400">High-density view of logistics partners.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-bold hover:bg-brand-600 shadow-glow transition-all">
            + Onboard Rider
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-admin-900 p-2 rounded-2xl border border-admin-800 shadow-dark-elevated">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-admin-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name or Zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-admin-950 border border-admin-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-admin-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'ONLINE', 'OFFLINE', 'SUSPENDED'].map(status => (
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
      <div className="flex-1 bg-admin-900 border border-admin-800 rounded-3xl shadow-dark-elevated overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto no-scrollbar relative">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-admin-950/90 backdrop-blur-md z-40 border-b border-admin-800">
              <tr>
                {[{key:'id', label:'ID'}, {key:'name', label:'Rider Info'}, {key:'zone', label:'Zone'}, {key:'vehicle', label:'Vehicle'}, {key:'rating', label:'Rating'}, {key:'status', label:'Status'}].map((col) => (
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
              {sortedRiders.map((rider) => (
                <tr key={rider.id} className="hover:bg-admin-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-admin-500">{rider.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-admin-800 border border-admin-700 flex items-center justify-center">
                        <Bike className="w-4 h-4 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{rider.name}</p>
                        <p className="text-[10px] font-semibold text-admin-500">{rider.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-sm font-semibold text-admin-300">
                      <MapPin className="w-3.5 h-3.5 text-admin-500" /> {rider.zone}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-admin-400">
                    {rider.vehicle}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-white bg-admin-800 px-2.5 py-1 rounded-lg border border-admin-700">
                      ★ {rider.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={rider.status} />
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === rider.id ? null : rider.id)}
                      className="p-2 text-admin-400 hover:text-white hover:bg-admin-800 rounded-xl transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Inline Action Dropdown */}
                    {activeDropdown === rider.id && (
                      <div className="absolute right-10 top-3 w-40 bg-admin-800 border border-admin-700 rounded-xl shadow-dark-floating overflow-hidden z-50 text-left">
                        <button 
                          onClick={() => { navigate(`/admin/riders/${rider.id}`); setActiveDropdown(null); }}
                          className="w-full px-4 py-2 text-xs font-bold text-admin-300 hover:text-white hover:bg-admin-700 flex items-center gap-2"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </button>
                        {rider.status !== 'SUSPENDED' ? (
                          <button 
                            onClick={() => toggleStatus(rider.id, 'SUSPENDED')}
                            className="w-full px-4 py-2 text-xs font-bold text-saffron-400 hover:text-saffron-300 hover:bg-admin-700 flex items-center gap-2 border-t border-admin-700"
                          >
                            <Ban className="w-3.5 h-3.5" /> Suspend
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleStatus(rider.id, 'OFFLINE')}
                            className="w-full px-4 py-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-admin-700 flex items-center gap-2 border-t border-admin-700"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Un-suspend
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              
              {sortedRiders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <ShieldAlert className="w-12 h-12 text-admin-700 mx-auto mb-3" />
                    <p className="text-admin-400 font-semibold">No riders found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-admin-800 flex items-center justify-between bg-admin-950/50">
          <p className="text-xs font-semibold text-admin-500">
            Showing <span className="text-white">{sortedRiders.length}</span> riders
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
