import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User, MapPin, ShoppingBag, Bookmark, HelpCircle, Settings,
  Edit2, Plus, Trash2, Check, X, Star, ChevronRight, Heart,
  Bell, Lock, LogOut, AlertTriangle, Phone, Calendar, Mail, Camera,
  Wallet, Globe, Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { authAPI, addressAPI, supportAPI, bookingsAPI } from '../../services/api';

// ─── Constants ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',    label: 'Profile',      Icon: User },
  { id: 'addresses',  label: 'Addresses',    Icon: MapPin },
  { id: 'orders',     label: 'Orders',       Icon: ShoppingBag },
  { id: 'saved',      label: 'Saved Boxes',  Icon: Bookmark },
  { id: 'help',       label: 'Help',         Icon: HelpCircle },
  { id: 'settings',   label: 'Settings',     Icon: Settings },
];

// ─── Status badge helper ───────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    CONFIRMED:  'bg-brand-100 text-brand-700',
    COOKING:    'bg-saffron-100 text-saffron-700',
    ON_WAY:   'bg-blue-100 text-blue-700',
    DELIVERED:  'bg-fresh-100 text-fresh-700',
    CANCELLED:  'bg-red-100 text-red-600',
    PENDING:    'bg-stone-100 text-stone-600',
  };
  const cls = map[status?.toUpperCase()] || 'bg-stone-100 text-stone-600';
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cls}`}>
      {status}
    </span>
  );
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        value ? 'bg-brand-500' : 'bg-stone-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          value ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
export const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const ctx = useApp() || {};
  const { setLunchbox, navigateTo, addToSlot, logout } = ctx;

  // ── Live state ────────────────────────────────────────────────────────────
  const [rawUser, setRawUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [savedBoxes, setSavedBoxes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Load Initial Data ─────────────────────────────────────────────────────
  const loadData = async () => {
    try {
      const [u, o, a, t] = await Promise.all([
        authAPI.me(),
        bookingsAPI.list(),
        addressAPI.list(),
        supportAPI.myTickets()
      ]);
      setRawUser(u);
      setTwoFactorEnabled(u.twoFactorEnabled || false);
      setSavedBoxes(u.savedBoxes || []);
      setBookings(o);
      setAddresses(a);
      setTickets(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Active tab ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('profile');

  // ── Profile header edit ───────────────────────────────────────────────────
  const [showEditProfile, setShowEditProfile] = useState(false);

  // ── Tab 1: Personal Info edit state ──────────────────────────────────────
  const [editMode, setEditMode]           = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName]   = useState('');
  const [editEmail, setEditEmail]         = useState('');
  const [editPhone, setEditPhone]         = useState('');
  const [editDob, setEditDob]             = useState('');

  // Sync edit mode fields when rawUser changes
  useEffect(() => {
    setEditFirstName(rawUser.firstName || rawUser.first_name || rawUser.name || '');
    setEditLastName(rawUser.lastName || rawUser.last_name || '');
    setEditEmail(rawUser.email || '');
    setEditPhone(rawUser.phone || '');
    setEditDob(rawUser.dateOfBirth || rawUser.date_of_birth || '');
  }, [rawUser]);

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await authAPI.updateProfile({
        firstName: editFirstName,
        lastName: editLastName,
        phone: editPhone,
        dateOfBirth: editDob,
      });
      setRawUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      alert(err.message || 'Error updating profile');
    }
  };

  const handleCancelPersonal = () => {
    setEditFirstName(rawUser.firstName || rawUser.first_name || rawUser.name || '');
    setEditLastName(rawUser.lastName || rawUser.last_name || '');
    setEditEmail(rawUser.email || '');
    setEditPhone(rawUser.phone || '');
    setEditDob(rawUser.dateOfBirth || rawUser.date_of_birth || '');
    setEditMode(false);
  };

  // ── Tab 2: Addresses ──────────────────────────────────────────────────────
  const [showAddAddr, setShowAddAddr]   = useState(false);
  const [addrLabel, setAddrLabel]       = useState('');
  const [addrFlat, setAddrFlat]         = useState('');
  const [addrStreet, setAddrStreet]     = useState('');
  const [addrCity, setAddrCity]         = useState('London');
  const [addrPostcode, setAddrPostcode] = useState('');
  const [addrInstructions, setAddrInstructions] = useState('');

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addrStreet) return;
    try {
      const newAddr = await addressAPI.create({
        label: addrLabel || 'Other',
        flat: addrFlat,
        street: addrStreet,
        city: addrCity || 'London',
        postcode: addrPostcode,
        instructions: addrInstructions,
      });
      setAddresses(prev => [newAddr, ...prev]);
      setShowAddAddr(false);
      setAddrLabel(''); setAddrFlat(''); setAddrStreet('');
      setAddrCity('London'); setAddrPostcode(''); setAddrInstructions('');
    } catch (err) {
      alert(err.message || 'Error adding address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressAPI.setAsDefault(id);
      await loadData(); // Reload addresses
    } catch (err) {
      alert(err.message || 'Error setting default address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressAPI.delete(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert(err.message || 'Error deleting address');
    }
  };

  // ── Tab 3: Orders ─────────────────────────────────────────────────────────
  const [orderSubTab, setOrderSubTab] = useState('active');
  const activeStatuses = ['CONFIRMED', 'COOKING', 'ON_WAY', 'PENDING'];
  const pastStatuses   = ['DELIVERED', 'CANCELLED'];
  const activeOrders   = bookings.filter(b => activeStatuses.includes(b.status));
  const pastOrders     = bookings.filter(b => pastStatuses.includes(b.status));

  // ── Tab 4: Saved Boxes ────────────────────────────────────────────────────
  const handleOrderAgain = (box) => {
    if (box.boxData && typeof setLunchbox === 'function') {
      setLunchbox(box.boxData);
    }
    if (typeof navigateTo === 'function') navigateTo('builder');
  };

  const handleDeleteBox = async (id) => {
    try {
      const newBoxes = savedBoxes.filter(b => b.id !== id);
      const updatedUser = await authAPI.updateProfile({ savedBoxes: newBoxes });
      setSavedBoxes(updatedUser.savedBoxes || []);
    } catch (err) {
      alert('Error deleting box');
    }
  };

  // ── Tab 5: Help / Tickets ─────────────────────────────────────────────────
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket]   = useState(false);
  const [newSubject, setNewSubject]         = useState('');
  const [newMessage, setNewMessage]         = useState('');

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;
    try {
      const ticket = await supportAPI.createTicket({
        subject: newSubject,
        message: newMessage
      });
      setTickets(prev => [ticket, ...prev]);
      setNewSubject('');
      setNewMessage('');
      setShowNewTicket(false);
      setExpandedTicket(ticket.id);
    } catch (err) {
      alert(err.message || 'Error submitting ticket');
    }
  };

  // ── Tab 6: Settings ───────────────────────────────────────────────────────
  const [notifOrderUpdates, setNotifOrderUpdates] = useState(true);
  const [notifPromotions, setNotifPromotions]     = useState(true);
  const [notifNewMenus, setNotifNewMenus]         = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [pwSuccess, setPwSuccess]   = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) { alert('Passwords do not match.'); return; }
    try {
      await authAPI.changePassword(currentPw, newPw);
      setPwSuccess('Password updated successfully!');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => { setPwSuccess(''); setShowChangePassword(false); }, 2000);
    } catch (err) {
      alert(err.message || 'Error updating password');
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    if (typeof logout === 'function') logout();
  };

  // ── Derived display values ─────────────────────────────────────────────────
  if (loading) {
    return <div className="p-8 text-center text-stone-500 font-bold">Loading Profile...</div>;
  }

  const displayName  = rawUser.firstName
    ? `${rawUser.firstName} ${rawUser.lastName || ''}`.trim()
    : (rawUser.name || 'Customer');
  const displayEmail = rawUser.email || '';
  const avatarLetter = displayName.charAt(0).toUpperCase() || 'C';
  const walletBalance = 23.50; // Fixed for now
  const loyaltyPoints = rawUser.loyaltyPoints || 0;



  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-36 lg:pb-16">

      {/* ── PROFILE HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card-elevated p-6 flex flex-col sm:flex-row items-center gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-saffron-500 flex items-center justify-center text-white font-heading font-extrabold text-3xl shadow-md border-4 border-white">
            {avatarLetter}
          </div>
          <button
            onClick={() => setShowEditProfile(true)}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-cream-200 flex items-center justify-center text-stone-500 hover:text-brand-600 shadow"
            title="Change avatar"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Name + info */}
        <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="font-heading text-xl font-extrabold text-ink-900 truncate">{displayName}</h2>
            <button
              onClick={() => { setActiveTab('profile'); setEditMode(true); }}
              className="p-1 rounded-lg hover:bg-cream-100 text-stone-400 hover:text-brand-600 transition-colors"
              title="Edit profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-stone-500 font-medium truncate">{displayEmail}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold">Customer</span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-saffron-50 text-saffron-700 text-[11px] font-bold">
              <Wallet className="w-3 h-3" />
              £{walletBalance.toFixed(2)}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold">
              <Award className="w-3 h-3" />
              {loyaltyPoints} pts
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => typeof logout === 'function' && logout()}
          className="flex-shrink-0 px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* ── TAB PILLS ──────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-1 w-max">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-white text-stone-600 border border-cream-200 hover:border-brand-200 hover:text-brand-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: PERSONAL INFO
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-extrabold text-ink-900 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-500" />
              Personal Information
            </h3>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream-100 hover:bg-brand-500 hover:text-white text-stone-700 font-bold text-xs transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'First Name', value: rawUser.firstName || rawUser.name || 'Alice', Icon: User },
                { label: 'Last Name', value: rawUser.lastName || 'Smith', Icon: User },
                { label: 'Email Address', value: rawUser.email || 'alice@example.com', Icon: Mail },
                { label: 'Phone Number', value: rawUser.phone || '+44 7700 900123', Icon: Phone },
                { label: 'Date of Birth', value: rawUser.dateOfBirth || '1992-05-14', Icon: Calendar },
              ].map(({ label, value, Icon: FieldIcon }) => (
                <div key={label} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <FieldIcon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                  </div>
                  <p className="text-sm font-bold text-ink-900">{value || '—'}</p>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSavePersonal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">First Name</label>
                  <input
                    type="text" required value={editFirstName}
                    onChange={e => setEditFirstName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Last Name</label>
                  <input
                    type="text" value={editLastName}
                    onChange={e => setEditLastName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email" required value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone</label>
                  <input
                    type="text" value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Date of Birth</label>
                  <input
                    type="date" value={editDob}
                    onChange={e => setEditDob(e.target.value)}
                    className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm font-medium"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-cream-100">
                <button type="button" onClick={handleCancelPersonal}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs hover:bg-stone-200 transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-sm hover:bg-brand-600 transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: MY ADDRESSES
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-extrabold text-ink-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-500" />
              My Addresses
            </h3>
            <button
              onClick={() => setShowAddAddr(v => !v)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream-100 hover:bg-brand-500 hover:text-white text-stone-700 font-bold text-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New
            </button>
          </div>

          {/* Add address form */}
          {showAddAddr && (
            <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
              <h4 className="font-heading font-bold text-sm text-ink-900">New Address</h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text" placeholder="Label (e.g. Home, Work)"
                  value={addrLabel} onChange={e => setAddrLabel(e.target.value)}
                  className="p-2.5 rounded-xl bg-white border border-cream-200 text-xs"
                />
                <input
                  type="text" placeholder="Flat / Building"
                  value={addrFlat} onChange={e => setAddrFlat(e.target.value)}
                  className="p-2.5 rounded-xl bg-white border border-cream-200 text-xs"
                />
              </div>
              <input
                type="text" placeholder="Street *" required
                value={addrStreet} onChange={e => setAddrStreet(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-cream-200 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text" placeholder="City"
                  value={addrCity} onChange={e => setAddrCity(e.target.value)}
                  className="p-2.5 rounded-xl bg-white border border-cream-200 text-xs"
                />
                <input
                  type="text" placeholder="Postcode"
                  value={addrPostcode} onChange={e => setAddrPostcode(e.target.value)}
                  className="p-2.5 rounded-xl bg-white border border-cream-200 text-xs uppercase"
                />
              </div>
              <input
                type="text" placeholder="Delivery instructions (optional)"
                value={addrInstructions} onChange={e => setAddrInstructions(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-cream-200 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddAddr(false)}
                  className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-600 font-bold text-xs"
                >Cancel</button>
                <button type="submit"
                  className="px-4 py-1.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
                >Save Address</button>
              </div>
            </form>
          )}

          {/* Address cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-ink-900">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-fresh-100 text-fresh-700 text-[10px] font-bold">Default</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1 text-stone-300 hover:text-red-500 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-stone-700 font-medium">{addr.flat && `${addr.flat}, `}{addr.street}</p>
                <p className="text-xs text-stone-400">{addr.city} · {addr.pincode}</p>
                {addr.instructions && (
                  <p className="text-[11px] text-stone-400 italic">"{addr.instructions}"</p>
                )}
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="mt-1 text-[11px] font-bold text-brand-600 hover:underline"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))}
            {addresses.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-cream-50 rounded-2xl border border-dashed border-cream-300">
                <MapPin className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-stone-500">No addresses saved yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: ORDER HISTORY
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 space-y-5 animate-fade-in">
          <h3 className="font-heading text-lg font-extrabold text-ink-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-500" />
            Order History
          </h3>

          {/* Sub-tabs */}
          <div className="flex gap-2 border-b border-cream-100 pb-3">
            {[
              { id: 'active', label: 'Active Orders', count: activeOrders.length },
              { id: 'past',   label: 'Past Orders',   count: pastOrders.length },
            ].map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setOrderSubTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                  orderSubTab === id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-cream-50 text-stone-600 border border-cream-200 hover:bg-cream-100'
                }`}
              >
                {label}
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-extrabold ${
                  orderSubTab === id ? 'bg-white/30 text-white' : 'bg-stone-200 text-stone-600'
                }`}>{count}</span>
              </button>
            ))}
          </div>

          {/* Active orders */}
          {orderSubTab === 'active' && (
            <div className="space-y-3">
              {activeOrders.length === 0 ? (
                <div className="text-center py-10 bg-cream-50 rounded-2xl border border-dashed border-cream-300">
                  <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-stone-500">No active orders right now.</p>
                </div>
              ) : activeOrders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl border border-cream-200 hover:border-brand-200 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-extrabold text-sm text-ink-900">#{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-stone-500 font-medium">{order.deliveryDate || order.delivery_date || '—'}</p>
                      <p className="text-xs text-stone-400">{(order.items || []).length} item(s)</p>
                    </div>
                    <span className="font-heading font-extrabold text-base text-ink-900 flex-shrink-0">
                      £{(order.totalPrice || order.total_price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past orders */}
          {orderSubTab === 'past' && (
            <div className="space-y-3">
              {pastOrders.length === 0 ? (
                <div className="text-center py-10 bg-cream-50 rounded-2xl border border-dashed border-cream-300">
                  <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-stone-500">No past orders yet.</p>
                </div>
              ) : pastOrders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl border border-cream-200 hover:border-brand-200 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-extrabold text-sm text-ink-900">#{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-stone-500 font-medium">{order.deliveryDate || order.delivery_date || '—'}</p>
                      <p className="text-xs text-stone-400">{(order.items || []).length} item(s)</p>
                    </div>
                    <span className="font-heading font-extrabold text-base text-ink-900 flex-shrink-0">
                      £{(order.totalPrice || order.total_price || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-cream-100">
                    <button
                      onClick={() => {
                        if (order.items && order.items.length > 0 && typeof addToSlot === 'function') {
                          // Load items into builder
                        }
                        if (typeof navigateTo === 'function') navigateTo('builder');
                      }}
                      className="flex-1 py-2 rounded-xl bg-brand-50 text-brand-600 font-bold text-xs hover:bg-brand-100 transition-colors"
                    >
                      Reorder
                    </button>
                    <button className="flex-1 py-2 rounded-xl bg-saffron-50 text-saffron-700 font-bold text-xs hover:bg-saffron-100 transition-colors flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      Rate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4: SAVED LUNCHBOXES
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'saved' && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 space-y-5 animate-fade-in">
          <h3 className="font-heading text-lg font-extrabold text-ink-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-brand-500" />
            Saved Lunchboxes
          </h3>

          {savedBoxes.length === 0 ? (
            <div className="text-center py-12 bg-cream-50 rounded-2xl border border-dashed border-cream-300">
              <Bookmark className="w-9 h-9 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-500">No saved lunchboxes yet.</p>
              <p className="text-xs text-stone-400 mt-1">Build a box and save it to order again quickly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedBoxes.map(box => (
                <div key={box.id} className="p-5 rounded-3xl border border-stone-200 bg-white space-y-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-extrabold text-sm text-ink-900 truncate">{box.name}</h4>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-bold">
                        {box.items || 0} Items
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteBox(box.id)}
                      className="p-1.5 text-stone-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {box.description && (
                    <p className="text-xs text-stone-500 line-clamp-2">{box.description}</p>
                  )}
                  <button
                    onClick={() => handleOrderAgain(box)}
                    className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Order Again
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 5: HELP / SUPPORT TICKETS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'help' && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-extrabold text-ink-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-500" />
              Support Tickets
            </h3>
            <button
              onClick={() => { setShowNewTicket(v => !v); setExpandedTicket(null); }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New Ticket
            </button>
          </div>

          {/* New ticket form */}
          {showNewTicket && (
            <form onSubmit={handleSubmitTicket} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
              <h4 className="font-heading font-bold text-sm text-ink-900">Raise a Support Ticket</h4>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subject</label>
                <input
                  type="text" required placeholder="e.g. Wrong item delivered"
                  value={newSubject} onChange={e => setNewSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-cream-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Message</label>
                <textarea
                  required placeholder="Describe your issue…"
                  value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-white border border-cream-200 text-xs resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewTicket(false)}
                  className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-600 font-bold text-xs"
                >Cancel</button>
                <button type="submit"
                  className="px-4 py-1.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
                >Submit Ticket</button>
              </div>
            </form>
          )}

          {/* Ticket list */}
          <div className="space-y-3">
            {tickets.map(ticket => (
              <div key={ticket.id} className="rounded-2xl border border-cream-200 overflow-hidden">
                {/* Ticket header */}
                <button
                  onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-cream-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-ink-900">{ticket.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ticket.status === 'Open' ? 'bg-saffron-100 text-saffron-700' : 'bg-fresh-100 text-fresh-700'
                        }`}>{ticket.status}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">{ticket.id} · {ticket.date}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform ${
                    expandedTicket === ticket.id ? 'rotate-90' : ''
                  }`} />
                </button>

                {/* Message thread */}
                {expandedTicket === ticket.id && (
                  <div className="border-t border-cream-100 p-4 bg-stone-50 space-y-3">
                    {Array.isArray(ticket.messages) && ticket.messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs font-medium ${
                          msg.from === 'customer'
                            ? 'bg-brand-500 text-white rounded-br-none'
                            : 'bg-white text-stone-700 border border-cream-200 rounded-bl-none'
                        }`}>
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${msg.from === 'customer' ? 'text-white/70 text-right' : 'text-stone-400'}`}>
                            {new Date(msg.time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' && (
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const text = e.target.replyText.value;
                        if (!text.trim()) return;
                        try {
                          await supportAPI.replyTicket(ticket.id, text);
                          e.target.replyText.value = '';
                          loadData(); // reload tickets
                        } catch(err) { alert('Error replying to ticket'); }
                      }} className="mt-4 flex gap-2">
                        <input name="replyText" type="text" placeholder="Type a reply..." className="flex-1 p-2.5 text-xs rounded-xl border border-cream-200" required />
                        <button type="submit" className="px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-xl">Send</button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 6: SETTINGS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <div className="space-y-5 animate-fade-in">

          {/* Notifications section */}
          <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 space-y-4">
            <h3 className="font-heading text-base font-extrabold text-ink-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-500" />
              Notifications
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Order Updates',  sub: 'Get notified about your order status',       value: notifOrderUpdates, setter: setNotifOrderUpdates },
                { label: 'Promotions',     sub: 'Receive exclusive deals and offers',          value: notifPromotions,   setter: setNotifPromotions   },
                { label: 'New Menus',      sub: 'Be the first to know about new menu items',  value: notifNewMenus,     setter: setNotifNewMenus     },
              ].map(({ label, sub, value, setter }) => (
                <div key={label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold text-ink-900">{label}</p>
                    <p className="text-xs text-stone-400">{sub}</p>
                  </div>
                  <Toggle value={value} onChange={setter} />
                </div>
              ))}
            </div>
          </div>

          {/* Language section */}
          <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 space-y-4">
            <h3 className="font-heading text-base font-extrabold text-ink-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-500" />
              {t('profile.language', 'Language')}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-colors ${
                  i18n.language === 'en' 
                    ? 'bg-brand-50 border-brand-200 text-brand-700' 
                    : 'bg-cream-50 border-cream-200 text-stone-600 hover:border-brand-200'
                }`}
              >
                {t('lang.en', 'English')}
              </button>
              <button
                onClick={() => i18n.changeLanguage('ta')}
                className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-colors ${
                  i18n.language === 'ta' 
                    ? 'bg-brand-50 border-brand-200 text-brand-700' 
                    : 'bg-cream-50 border-cream-200 text-stone-600 hover:border-brand-200'
                }`}
              >
                {t('lang.ta', 'தமிழ் (Tamil)')}
              </button>
            </div>
          </div>

          {/* Account section */}
          <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 space-y-4">
            <h3 className="font-heading text-base font-extrabold text-ink-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-500" />
              Account
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-cream-50 border border-cream-200 mb-3">
              <div>
                <span className="text-sm font-bold text-ink-900 block">Two-Factor Authentication</span>
                <span className="text-xs text-stone-500">Add an extra layer of security</span>
              </div>
              <Toggle 
                value={twoFactorEnabled} 
                onChange={async (val) => {
                  setTwoFactorEnabled(val);
                  try {
                    await authAPI.update2FA(val);
                  } catch (e) {
                    setTwoFactorEnabled(!val);
                  }
                }} 
              />
            </div>

            {/* Change password */}
            <div>
              <button
                onClick={() => { setShowChangePassword(v => !v); setPwSuccess(''); }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-cream-50 border border-cream-200 hover:border-brand-200 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-stone-400" />
                  <span className="text-sm font-bold text-ink-900">Change Password</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${showChangePassword ? 'rotate-90' : ''}`} />
              </button>

              {showChangePassword && (
                <form onSubmit={handleChangePassword} className="mt-3 p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                  {pwSuccess && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-fresh-50 border border-fresh-200">
                      <Check className="w-4 h-4 text-fresh-600" />
                      <span className="text-xs font-bold text-fresh-700">{pwSuccess}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Current Password</label>
                    <input
                      type="password" required value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-cream-200 text-xs"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">New Password</label>
                    <input
                      type="password" required value={newPw} onChange={e => setNewPw(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-cream-200 text-xs"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Confirm New Password</label>
                    <input
                      type="password" required value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-cream-200 text-xs"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowChangePassword(false)}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-600 font-bold text-xs"
                    >Cancel</button>
                    <button type="submit"
                      className="px-4 py-1.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
                    >Update Password</button>
                  </div>
                </form>
              )}
            </div>

            {/* Delete account */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors text-left"
            >
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-600">Delete Account</p>
                <p className="text-xs text-red-400">Permanently remove your account and all data</p>
              </div>
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={() => typeof logout === 'function' && logout()}
            className="w-full py-4 rounded-3xl bg-ink-900 hover:bg-stone-800 text-white font-heading font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of Account
          </button>
        </div>
      )}

      {/* ── DELETE ACCOUNT CONFIRMATION MODAL ─────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-lg text-ink-900">Delete Account?</h4>
                <p className="text-xs text-stone-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-stone-600 p-4 rounded-2xl bg-red-50 border border-red-100">
              Are you sure you want to permanently delete your account? All your orders, saved boxes, and data will be removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-stone-100 text-stone-700 font-bold text-sm hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
