import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, UserPlus, CheckCircle2 } from 'lucide-react';
import { adminAPI } from '../../../services/api';

export const AdminsTab = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formUserId, setFormUserId] = useState('');
  const [formName, setFormName] = useState('');
  const [formIpAllowList, setFormIpAllowList] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminsRes, permsRes] = await Promise.all([
        adminAPI.getSubAdmins(),
        adminAPI.getPermissions()
      ]);
      setSubAdmins(adminsRes || []);
      setPermissions(permsRes || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load sub-admins.');
      setLoading(false);
    }
  };

  const togglePermission = (permId) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.updateSubAdmin(editingId, { name: formName, permissionIds: selectedPermissions });
        if (formIpAllowList !== undefined) {
          await adminAPI.updateIpAllowlist(formUserId, formIpAllowList);
        }
      } else {
        await adminAPI.createSubAdmin({ userId: formUserId, name: formName, permissionIds: selectedPermissions });
        if (formIpAllowList !== undefined && formUserId) {
          await adminAPI.updateIpAllowlist(formUserId, formIpAllowList);
        }
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save sub-admin.');
    }
  };

  const startEdit = (admin) => {
    setEditingId(admin.id);
    setFormUserId(admin.userId);
    setFormName(admin.name);
    setFormIpAllowList(admin.user?.ipAllowList || '');
    setSelectedPermissions(admin.permissions?.map(p => p.permissionId) || []);
    setShowForm(true);
  };

  const startNew = () => {
    setEditingId(null);
    setFormUserId('');
    setFormName('');
    setFormIpAllowList('');
    setSelectedPermissions([]);
    setShowForm(true);
  };

  if (loading) return <div className="text-stone-400 py-12 text-center">Loading admins...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start sm:items-center">
        <div>
          <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Roles & Permissions
          </h3>
          <p className="text-sm text-stone-500">Manage sub-admins and access control.</p>
        </div>
        <button 
          onClick={startNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Assign Sub-Admin
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>}

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm mb-6">
          <h4 className="font-heading font-extrabold text-lg text-ink-900 mb-4">{editingId ? 'Edit Sub-Admin' : 'New Sub-Admin'}</h4>
          <form onSubmit={handleSave} className="space-y-4">
            {!editingId && (
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">User ID</label>
                <input 
                  type="text" 
                  required
                  value={formUserId} 
                  onChange={e => setFormUserId(e.target.value)}
                  placeholder="Enter the ID of the user"
                  className="w-full p-2 border border-cream-200 rounded-xl text-sm"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Role Title</label>
              <input 
                type="text" 
                required
                value={formName} 
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. Support Agent, Finance Manager"
                className="w-full p-2 border border-cream-200 rounded-xl text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">IP Allowlist (Comma separated, optional)</label>
              <input 
                type="text" 
                value={formIpAllowList} 
                onChange={e => setFormIpAllowList(e.target.value)}
                placeholder="e.g. 192.168.1.1, 10.0.0.5"
                className="w-full p-2 border border-cream-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">Permissions</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {permissions.map(perm => (
                  <label key={perm.id} className="flex items-start gap-2 p-3 bg-cream-50 border border-cream-200 rounded-xl cursor-pointer hover:border-indigo-300">
                    <input 
                      type="checkbox" 
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      className="mt-1 accent-indigo-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-ink-900">{perm.module} : {perm.action}</p>
                      <p className="text-[10px] text-stone-500">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save Role
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subAdmins.length === 0 ? (
          <div className="col-span-2 text-center text-stone-400 py-12 text-sm">No sub-admins found.</div>
        ) : subAdmins.map(admin => (
          <div key={admin.id} className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-ink-900 text-sm">{admin.user?.firstName} {admin.user?.lastName}</h4>
                <p className="text-xs text-stone-500">{admin.user?.email}</p>
                <div className="mt-2 inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  {admin.name}
                </div>
              </div>
              <button onClick={() => startEdit(admin)} className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-stone-400">Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {admin.permissions?.length > 0 ? admin.permissions.map(p => (
                  <span key={p.id} className="text-[10px] font-medium px-2 py-0.5 bg-cream-100 text-stone-600 rounded-md">
                    {p.permission?.module}_{p.permission?.action}
                  </span>
                )) : <span className="text-[10px] text-stone-400">No specific permissions (Full Super Admin)</span>}
              </div>
            </div>
            
            {admin.user?.ipAllowList && (
              <div className="mt-2 space-y-1">
                <p className="text-[10px] font-bold uppercase text-stone-400">IP Allowlist</p>
                <p className="text-xs text-stone-600 font-mono">{admin.user.ipAllowList}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
