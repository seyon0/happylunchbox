import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Map, Crosshair, PoundSterling, BarChart2, 
  MessageSquare, CheckCircle2, ShieldAlert, Bike, Clock, TrendingUp 
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-dark-floating flex items-center gap-3 text-sm font-semibold animate-bounce-in ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
  </div>
);

export const RiderDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [profile, setProfile] = useState({
    name: 'Raj Kumar', email: 'raj.k@riders.uk', phone: '+44 7700 900123', vehicle: 'Bicycle', status: 'ONLINE', currentZone: 'Central London'
  });

  const [assignment, setAssignment] = useState({
    autoLogic: 'nearestRider', maxRadius: 3.5, loadBalancing: true, manualOverride: false
  });

  const [earnings, setEarnings] = useState({
    payoutRate: 4.50, incentivesEnabled: true, payoutRun: 'weekly', bankAccount: '**** 1234'
  });

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'rider', text: 'I am stuck in traffic near Oxford St. Order #4012 might be 5 mins late.', time: '12:45 PM' },
    { id: 2, sender: 'admin', text: 'Noted Raj. I will update the customer eta.', time: '12:47 PM' },
  ]);

  return (
    <div className="space-y-6 pb-20">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/riders')} className="p-2 bg-admin-900 border border-admin-800 rounded-xl hover:bg-admin-800 transition-colors shadow-dark-elevated">
          <ArrowLeft className="w-4 h-4 text-admin-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {profile.name}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
              profile.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              profile.status === 'SUSPENDED' ? 'bg-saffron-500/10 text-saffron-400 border-saffron-500/20' :
              profile.status === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-admin-500/10 text-admin-400 border-admin-500/20'
            }`}>
              {profile.status}
            </span>
          </h1>
          <p className="text-sm text-admin-400 mt-1">Rider ID: {id} · Joined 01/03/2026</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 overflow-hidden flex lg:flex-col">
            {[
              { id: 'profile', icon: User, label: 'Profile & Status' },
              { id: 'tracking', icon: Map, label: 'Live Tracking' },
              { id: 'assignment', icon: Crosshair, label: 'Assignment & Workload' },
              { id: 'earnings', icon: PoundSterling, label: 'Earnings & Payouts' },
              { id: 'performance', icon: BarChart2, label: 'Performance & Availability' },
              { id: 'support', icon: MessageSquare, label: 'Support Hub' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col lg:flex-row items-center lg:items-start lg:justify-start justify-center flex-1 lg:flex-none gap-2 p-4 text-xs font-bold transition-colors border-b border-admin-800/50 last:border-0 ${
                  activeTab === tab.id 
                    ? 'bg-brand-500/10 text-brand-400 border-l-4 border-l-brand-500' 
                    : 'text-admin-400 hover:text-white hover:bg-admin-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Personal Details</h2>
                  <select 
                    value={profile.status} 
                    onChange={e => setProfile(p => ({...p, status: e.target.value}))}
                    className="bg-admin-950 border border-admin-800 text-white text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  >
                    <option value="ONLINE">Set Online</option>
                    <option value="OFFLINE">Set Offline</option>
                    <option value="SUSPENDED">Suspend (Temp)</option>
                    <option value="BLOCKED">Block (Perm)</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', key: 'name' },
                    { label: 'Email Address', key: 'email' },
                    { label: 'Phone Number', key: 'phone' },
                    { label: 'Vehicle Type', key: 'vehicle' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-bold text-admin-400 block mb-1">{f.label}</label>
                      <input 
                        type="text" 
                        value={profile[f.key]}
                        onChange={(e) => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white placeholder-admin-600 focus:outline-none focus:border-brand-500 transition-colors" 
                      />
                    </div>
                  ))}
                </div>
                <button onClick={() => showToast('Profile details updated')} className="mt-5 px-5 py-2.5 bg-brand-500 text-white text-xs font-bold rounded-xl shadow-glow hover:bg-brand-600 transition-colors">
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-admin-800 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-white">Live Geo-Tracking</h2>
                    <p className="text-xs text-admin-400">Real-time rider position (Phase 2)</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live</span>
                </div>
                <div className="h-[450px] w-full z-0 relative">
                  <MapContainer
                    center={[51.515, -0.072]}
                    zoom={15}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <CircleMarker
                      center={[51.515, -0.072]}
                      radius={12}
                      pathOptions={{ color: '#fff', fillColor: '#8b5cf6', fillOpacity: 1, weight: 3 }}
                    >
                      <Popup className="font-sans">
                        <div className="text-sm font-bold text-slate-900">{profile.name}</div>
                        <div className="text-xs text-slate-500 font-semibold">{profile.status}</div>
                      </Popup>
                    </CircleMarker>
                  </MapContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assignment' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white">Manual Dispatch Override</h2>
                  <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${assignment.manualOverride ? 'bg-amber-500' : 'bg-admin-700'}`} onClick={() => setAssignment(a => ({...a, manualOverride: !a.manualOverride}))}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${assignment.manualOverride ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
                <p className="text-xs text-admin-400 font-medium leading-relaxed">
                  When enabled, this overrides the global Auto-Assignment algorithm. You will manually assign orders to this rider bypassing standard distance rules.
                </p>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6 opacity-90">
                <h2 className="text-lg font-bold text-white mb-4">Auto-Assignment Algorithm Rules (Phase 2)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-admin-400 block mb-1">Routing Logic</label>
                    <select disabled={assignment.manualOverride} value={assignment.autoLogic} onChange={e => setAssignment(a => ({...a, autoLogic: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 disabled:opacity-50">
                      <option value="nearestRider">Nearest Rider (Distance)</option>
                      <option value="batchedRoute">Batched Route (Density)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-admin-400 block mb-1">Max Dispatch Radius (km)</label>
                    <input disabled={assignment.manualOverride} type="number" step="0.5" value={assignment.maxRadius} onChange={e => setAssignment(a => ({...a, maxRadius: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 disabled:opacity-50" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input disabled={assignment.manualOverride} type="checkbox" checked={assignment.loadBalancing} onChange={e => setAssignment(a => ({...a, loadBalancing: e.target.checked}))} className="w-4 h-4 rounded text-brand-500 bg-admin-950 border-admin-800" />
                    <span className="text-sm font-semibold text-admin-300">Enable Load Balancing (Prioritize idle riders in zone)</span>
                  </div>
                </div>
                <button disabled={assignment.manualOverride} onClick={() => showToast('Algorithm rules updated')} className="px-5 py-2.5 bg-brand-500 text-white text-xs font-bold rounded-xl shadow-glow hover:bg-brand-600 transition-colors disabled:opacity-50">
                  Save Algorithmic Config
                </button>
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Current Workload View</h2>
                <div className="p-4 bg-admin-950 rounded-xl border border-admin-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-xl flex items-center justify-center font-black text-xl">1</div>
                    <div>
                      <p className="font-bold text-white">Active Delivery (Order #HL-0091)</p>
                      <p className="text-xs text-admin-400 mt-1">Pickup: Spice Garden → Dropoff: 124 Baker St</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Payout Configuration</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-admin-400 block mb-1">Base Per-Delivery Rate (£)</label>
                      <input type="number" step="0.10" value={earnings.payoutRate} onChange={e => setEarnings(a => ({...a, payoutRate: parseFloat(e.target.value)}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-bold text-white outline-none focus:border-brand-500 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-admin-400 block mb-1">Payout Run Cycle</label>
                      <select value={earnings.payoutRun} onChange={e => setEarnings(a => ({...a, payoutRun: e.target.value}))} className="w-full p-2.5 bg-admin-950 border border-admin-800 rounded-xl text-sm font-medium text-white outline-none focus:border-brand-500 transition-colors">
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={earnings.incentivesEnabled} onChange={e => setEarnings(a => ({...a, incentivesEnabled: e.target.checked}))} className="w-4 h-4 rounded text-brand-500 bg-admin-950 border-admin-800" />
                      <span className="text-sm font-semibold text-admin-300">Eligible for weather/demand incentives</span>
                    </div>
                    <button onClick={() => showToast('Earnings config updated')} className="px-5 py-2 w-full bg-brand-500 text-white text-xs font-bold rounded-xl shadow-glow hover:bg-brand-600 transition-colors">
                      Save Payout Rules
                    </button>
                  </div>
                </div>
                
                <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Current Cycle Earnings</h2>
                  <div className="text-center py-6">
                    <p className="text-[10px] font-bold text-admin-500 uppercase tracking-wider mb-1">Week to Date (GBP)</p>
                    <p className="text-5xl font-black text-white tracking-tight">£142.50</p>
                    <p className="text-xs font-semibold text-emerald-400 mt-2 flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" /> +12% vs last week</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-admin-800 flex justify-between items-center text-sm">
                    <span className="text-admin-500 font-medium">Bank Target</span>
                    <span className="font-bold text-white">{earnings.bankAccount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Completed', val: '124' },
                  { label: 'Cancelled/Failed', val: '1', sub: '0.8% failure rate', color: 'text-red-400' },
                  { label: 'Avg Delivery Time', val: '22m', sub: 'Target: 25m' },
                  { label: 'Customer Rating', val: '4.8 ⭐', sub: 'Top 10%' },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-admin-900 rounded-2xl p-4 shadow-dark-elevated border border-admin-800">
                    <p className="text-[10px] font-bold text-admin-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                    <p className="text-xl font-black text-white">{kpi.val}</p>
                    {kpi.sub && <p className={`text-[10px] font-semibold mt-1 ${kpi.color || 'text-admin-400'}`}>{kpi.sub}</p>}
                  </div>
                ))}
              </div>

              <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Availability & Leave Schedule</h2>
                  <button className="px-4 py-2 bg-admin-800 border border-admin-700 text-admin-300 text-xs font-bold rounded-xl hover:text-white transition-colors shadow-sm">
                    + Log Absence
                  </button>
                </div>
                <div className="p-4 bg-admin-950 border border-admin-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-bold text-white text-sm">Pre-planned Leave</p>
                      <p className="text-xs text-admin-400">Aug 10 - Aug 14 (4 days)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">Approved</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="bg-admin-900 rounded-2xl shadow-dark-elevated border border-admin-800 flex flex-col h-[600px] animate-fade-in">
              <div className="px-5 py-4 border-b border-admin-800">
                <h2 className="text-lg font-bold text-white">Rider Support Hub</h2>
                <p className="text-xs text-admin-400">Live chat bridging Admin and Dispatch.</p>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${msg.sender === 'admin' ? 'bg-brand-600 text-white rounded-tr-none shadow-glow' : 'bg-admin-800 text-white border border-admin-700 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] font-semibold text-admin-500 mt-1">{msg.time}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-admin-800 flex items-center gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type message to rider..."
                  className="flex-1 p-3 bg-admin-950 border border-admin-800 rounded-xl text-sm text-white placeholder-admin-600 outline-none focus:border-brand-500 transition-colors"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && chatInput.trim()) {
                      setChatMessages([...chatMessages, { id: Date.now(), sender: 'admin', text: chatInput, time: 'Now' }]);
                      setChatInput('');
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (chatInput.trim()) {
                      setChatMessages([...chatMessages, { id: Date.now(), sender: 'admin', text: chatInput, time: 'Now' }]);
                      setChatInput('');
                    }
                  }}
                  className="px-5 py-3 bg-brand-500 text-white font-bold text-sm rounded-xl hover:bg-brand-600 transition-colors shadow-glow"
                >
                  Send
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
