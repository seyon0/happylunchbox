import React, { useState } from 'react';
import { UserPlus, Trash2, Mail, Check } from 'lucide-react';

export const StaffManagement = () => {
  const [staffList, setStaffList] = useState([
    { id: 1, email: 'owner@jaffnaroots.com', role: 'OWNER', name: 'John Doe' },
    { id: 2, email: 'manager@jaffnaroots.com', role: 'MANAGER', name: 'Jane Smith' },
    { id: 3, email: 'staff1@jaffnaroots.com', role: 'STAFF', name: 'Bob Kitchen' }
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('STAFF');
  const [loading, setLoading] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setLoading(true);
    setTimeout(() => {
      setStaffList([...staffList, { id: Date.now(), email: inviteEmail, role: inviteRole, name: 'Pending Invite' }]);
      setInviteEmail('');
      setInviteRole('STAFF');
      setLoading(false);
    }, 600);
  };

  const handleRemove = (id) => {
    setStaffList(staffList.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-ink-900 border border-ink-800 rounded-3xl p-6 shadow-card-elevated">
        <h3 className="text-xl font-heading font-black text-white mb-4">Invite Staff</h3>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Mail className="w-5 h-5 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="staff@example.com" 
              className="w-full pl-11 pr-4 py-3.5 bg-ink-950 border border-ink-800 rounded-2xl text-white text-sm font-medium focus:bg-ink-900 focus:outline-none"
              required
            />
          </div>
          <div className="w-full sm:w-40 relative">
            <select 
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-4 py-3.5 bg-ink-950 border border-ink-800 rounded-2xl text-white text-sm font-medium focus:bg-ink-900 focus:outline-none appearance-none"
            >
              <option value="STAFF">Staff</option>
              <option value="MANAGER">Manager</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <Check className="w-5 h-5 animate-pulse" /> : <UserPlus className="w-5 h-5" />}
            {loading ? 'Inviting...' : 'Invite'}
          </button>
        </form>
      </div>

      <div className="bg-ink-900 border border-ink-800 rounded-3xl p-6 shadow-card-elevated">
        <h3 className="text-xl font-heading font-black text-white mb-4">Current Staff</h3>
        <div className="space-y-3">
          {staffList.map(staff => (
            <div key={staff.id} className="flex items-center justify-between p-4 bg-ink-950 border border-ink-800 rounded-2xl">
              <div>
                <p className="font-bold text-white">{staff.name}</p>
                <p className="text-xs text-ink-400">{staff.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${staff.role === 'OWNER' ? 'bg-brand-500/20 text-brand-500' : staff.role === 'MANAGER' ? 'bg-saffron-500/20 text-saffron-500' : 'bg-ink-800 text-ink-300'}`}>
                  {staff.role}
                </span>
                {staff.role !== 'OWNER' && (
                  <button onClick={() => handleRemove(staff.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
