import React, { useState, useEffect, useMemo } from 'react';
import { 
  Inbox, Shield, Activity, Search, CheckCircle, AlertTriangle, ShieldAlert,
  MessageSquare, Star, Clock, User, Store, Bike, EyeOff
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api/support';

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-dark-floating flex items-center gap-3 text-sm font-semibold animate-bounce-in ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
  </div>
);

export const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [toast, setToast] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [tickets, setTickets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [trends, setTrends] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ticketsRes, reviewsRes, trendsRes] = await Promise.all([
        fetch(`${API_URL}/tickets`),
        fetch(`${API_URL}/reviews`),
        fetch(`${API_URL}/trends`)
      ]);
      
      if (!ticketsRes.ok) throw new Error('Failed to fetch data');
      
      setTickets(await ticketsRes.json());
      setReviews(await reviewsRes.json());
      setTrends(await trendsRes.json());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Cannot connect to the backend. Is NestJS running on port 3000?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- API Handlers ---

  const handleUpdateTicketStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/tickets/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      showToast(`Ticket marked as ${status}`);
      fetchData();
    } catch (e) {
      showToast('Error updating ticket status', 'error');
    }
  };

  const handleAssignTicket = async (id, assignedTo) => {
    try {
      await fetch(`${API_URL}/tickets/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo })
      });
      showToast(`Ticket assigned to ${assignedTo}`);
      fetchData();
    } catch (e) {
      showToast('Error assigning ticket', 'error');
    }
  };

  const handleHideReview = async (id, reason) => {
    if (!window.confirm(`Hide this review for reason: ${reason}?`)) return;
    try {
      await fetch(`${API_URL}/reviews/${id}/hide`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      showToast('Review hidden successfully');
      fetchData();
    } catch (e) {
      showToast('Error hiding review', 'error');
    }
  };

  if (loading) return <div className="p-8 text-center text-admin-500 font-bold animate-pulse">Connecting to backend...</div>;

  if (error) return (
    <div className="p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/20 mt-6 max-w-2xl mx-auto shadow-dark-elevated">
      <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-lg font-bold text-red-400 mb-2">Backend Connection Error</h2>
      <p className="text-sm text-red-300">{error}</p>
      <button onClick={fetchData} className="mt-6 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-500 shadow-glow transition-colors">Retry Connection</button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-full overflow-hidden pb-20">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-white">Support & Moderation</h1>
        <p className="text-sm text-admin-400 mt-1">Manage Support Tickets, Review Moderation, and Rating Trends</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-admin-900 p-1.5 rounded-2xl w-fit border border-admin-800 shadow-dark-elevated">
        {[['tickets', 'Ticket Inbox', Inbox], ['reviews', 'Review Moderation', Shield], ['trends', 'Rating Trends', Activity]].map(([key, label, Icon]) => (
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

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-admin-900 border border-admin-800 shadow-dark-elevated rounded-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="px-6 py-4 border-b border-admin-800 bg-admin-950/50 flex justify-between items-center shrink-0">
              <h2 className="font-bold text-white">Active Tickets</h2>
              <div className="flex items-center gap-2 text-xs font-bold text-admin-400 bg-admin-900 px-3 py-1.5 rounded-lg border border-admin-700">
                <Clock className="w-3 h-3 text-admin-500" /> SLA tracking enabled (Phase 2)
              </div>
            </div>
            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-admin-950/90 backdrop-blur-md z-40 border-b border-admin-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Subject</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Reporter</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Assignee</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-800/50">
                  {tickets.map(row => (
                    <tr key={row.id} className="hover:bg-admin-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-admin-500">{row.id.substring(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white">{row.subject}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-admin-400">{row.user?.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                          row.status === 'OPEN' ? 'bg-saffron-500/10 text-saffron-400 border-saffron-500/20' :
                          row.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={row.assignedTo || ''}
                          onChange={(e) => handleAssignTicket(row.id, e.target.value)}
                          className="text-xs p-1.5 rounded-lg border border-admin-700 bg-admin-950 text-white outline-none focus:border-brand-500 transition-colors"
                        >
                          <option value="">Unassigned</option>
                          <option value="Admin Team A">Admin Team A</option>
                          <option value="Admin Team B">Admin Team B</option>
                          <option value="Escalation">Escalation</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {row.status !== 'RESOLVED' && (
                            <button onClick={() => handleUpdateTicketStatus(row.id, 'RESOLVED')} className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-bold border border-emerald-500/20 transition-colors">Resolve</button>
                          )}
                          {row.status !== 'IN_PROGRESS' && row.status !== 'RESOLVED' && (
                            <button onClick={() => handleUpdateTicketStatus(row.id, 'IN_PROGRESS')} className="px-2.5 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-xs font-bold border border-blue-500/20 transition-colors">Start</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-admin-500 font-medium">No active tickets found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-admin-900 border border-admin-800 shadow-dark-elevated rounded-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="px-6 py-4 border-b border-admin-800 bg-admin-950/50 shrink-0">
              <h2 className="font-bold text-white">Platform Reviews</h2>
            </div>
            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-admin-950/90 backdrop-blur-md z-40 border-b border-admin-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Target</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Rating</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Review Content</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest">Visibility</th>
                    <th className="px-6 py-4 text-[10px] font-black text-admin-400 uppercase tracking-widest text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-800/50">
                  {reviews.map(row => (
                    <tr key={row.id} className="hover:bg-admin-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md border w-fit ${row.targetType === 'SHOP' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-saffron-500/10 text-saffron-400 border-saffron-500/20'}`}>
                          {row.targetType === 'SHOP' ? <Store className="w-3 h-3" /> : <Bike className="w-3 h-3" />}
                          {row.targetType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-saffron-500 font-bold text-sm">
                          {row.rating} <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md truncate text-sm text-admin-300 italic">"{row.comment || 'No comment provided'}"</div>
                      </td>
                      <td className="px-6 py-4">
                        {row.isHidden ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-admin-700 bg-admin-950 text-admin-500 flex items-center gap-1.5 w-fit">
                            <EyeOff className="w-3 h-3" /> HIDDEN ({row.hiddenReason})
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 w-fit">VISIBLE</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!row.isHidden && (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleHideReview(row.id, 'ABUSIVE')} className="px-2.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold border border-red-500/20 transition-colors">Flag Abusive</button>
                            <button onClick={() => handleHideReview(row.id, 'FAKE')} className="px-2.5 py-1.5 bg-admin-800 text-admin-400 hover:text-white hover:bg-admin-700 rounded-lg text-xs font-bold border border-admin-700 transition-colors">Flag Fake</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-admin-500 font-medium">No reviews found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && trends && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white shadow-glow relative overflow-hidden">
              <Star className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 text-white" />
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-brand-100 uppercase tracking-wider mb-2">Platform Global Average</h3>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black">{trends.platformAvg}</span>
                  <span className="text-lg font-bold text-brand-200 mb-1">/ 5.0</span>
                </div>
                <p className="text-sm text-brand-200 mt-4 font-semibold">Based on {trends.totalReviews} total reviews</p>
              </div>
            </div>
            <div className="bg-admin-900 rounded-3xl p-8 shadow-dark-elevated border border-admin-800 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-admin-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Store className="w-4 h-4 text-purple-500" /> Restaurant Average
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-white">{trends.shopAvg}</span>
                <span className="text-sm font-bold text-admin-500 mb-1">/ 5.0</span>
              </div>
            </div>
            <div className="bg-admin-900 rounded-3xl p-8 shadow-dark-elevated border border-admin-800 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-admin-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Bike className="w-4 h-4 text-saffron-500" /> Rider Average
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-white">{trends.riderAvg}</span>
                <span className="text-sm font-bold text-admin-500 mb-1">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
