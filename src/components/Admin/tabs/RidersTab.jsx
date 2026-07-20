import React, { useState, useEffect } from 'react';
import { Bike, ShieldCheck, Star, Edit, Trash2, MapPin, Search } from 'lucide-react';
import { adminAPI } from '../../../services/api';

export const RidersTab = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getRiders(1, 100);
      setRiders(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load riders.');
      setLoading(false);
    }
  };

  const toggleAvailability = async (rider) => {
    try {
      await adminAPI.toggleRiderStatus(rider.id);
      setRiders(riders.map(r => r.id === rider.id ? { ...r, isBanned: !r.isBanned } : r));
    } catch (err) {
      console.error(err);
      alert('Failed to toggle rider status');
    }
  };

  const filteredRiders = riders.filter(r => 
    (r.firstName || '').toLowerCase().includes(search.toLowerCase()) || 
    (r.lastName || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.phone || '').includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
            <Bike className="w-5 h-5 text-brand-500" />
            Fleet Management
          </h3>
          <p className="text-sm text-stone-500">Manage delivery riders and their status</p>
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search riders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
            />
          </div>
          <button className="bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-brand-600 transition-colors whitespace-nowrap">
            + Add Rider
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-stone-400">Loading fleet data...</div>
      ) : filteredRiders.length === 0 ? (
        <div className="text-center py-12 text-stone-400">No riders found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRiders.map(rider => (
            <div key={rider.id} className="bg-white border border-cream-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center overflow-hidden">
                    {rider.profilePhoto ? (
                      <img src={rider.profilePhoto} alt={rider.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <Bike className="w-6 h-6 text-stone-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink-900">{rider.firstName} {rider.lastName}</h4>
                    <p className="text-xs text-stone-500">{rider.phone || 'No phone'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 text-stone-400 hover:text-brand-500 bg-cream-50 hover:bg-brand-50 rounded-lg transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-cream-50 p-2 rounded-lg text-center">
                  <p className="text-[10px] text-stone-400 uppercase font-bold">Vehicle</p>
                  <p className="text-xs font-bold text-ink-900 capitalize">{rider.vehicle_type || 'Unknown'}</p>
                </div>
                <div className="bg-cream-50 p-2 rounded-lg text-center">
                  <p className="text-[10px] text-stone-400 uppercase font-bold">Rating</p>
                  <p className="text-xs font-bold text-ink-900 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-saffron-500 fill-saffron-500" /> {rider.rating || 'N/A'}
                  </p>
                </div>
                <div className="bg-cream-50 p-2 rounded-lg text-center">
                  <p className="text-[10px] text-stone-400 uppercase font-bold">Active Jobs</p>
                  <p className="text-xs font-bold text-ink-900">{rider.active_deliveries || 0}</p>
                </div>
                <div className="bg-cream-50 p-2 rounded-lg text-center">
                  <p className="text-[10px] text-stone-400 uppercase font-bold">Total Done</p>
                  <p className="text-xs font-bold text-ink-900">{rider.total_deliveries || 0}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-cream-100">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${!rider.isBanned ? 'bg-fresh-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-bold text-stone-600">{!rider.isBanned ? 'Active' : 'Banned'}</span>
                </div>
                <button
                  onClick={() => toggleAvailability(rider)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                    !rider.isBanned 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-fresh-100 text-fresh-700 hover:bg-fresh-200'
                  }`}
                >
                  {!rider.isBanned ? 'Suspend Rider' : 'Unsuspend Rider'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
