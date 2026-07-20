import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Ban, CheckCircle, Mail, MapPin } from 'lucide-react';
import { adminAPI } from '../../../services/api';

export const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCustomers(1, 100);
      setUsers(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    try {
      if (user.isBanned) {
        await adminAPI.unbanCustomer(user.id);
      } else {
        await adminAPI.banCustomer(user.id);
      }
      setUsers(users.map(u => u.id === user.id ? { ...u, isBanned: !u.isBanned } : u));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const filteredUsers = users.filter(u => 
    (u.email || '').toLowerCase().includes(search.toLowerCase()) || 
    ((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-indigo-500" />
            Customer Management
          </h3>
          <p className="text-sm text-stone-500">View and manage registered customers</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-cream-50 text-stone-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Wallet</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-stone-400">Loading...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-stone-400">No customers found.</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-ink-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-stone-500">ID: {user.id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-stone-600 text-xs">
                        <Mail className="w-3.5 h-3.5" /> {user.email}
                      </span>
                      {user.addresses && user.addresses.length > 0 && (
                        <span className="flex items-center gap-1.5 text-stone-500 text-[10px]">
                          <MapPin className="w-3.5 h-3.5" /> {user.addresses[0].city}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-ink-900">£{(user.walletBalance || user.wallet_balance || 0).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {!user.isBanned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-fresh-100 text-fresh-700 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                        <Ban className="w-3.5 h-3.5" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleStatus(user)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        !user.isBanned 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-fresh-600 hover:bg-fresh-50'
                      }`}
                    >
                      {!user.isBanned ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
