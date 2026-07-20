import React, { useState } from 'react';
import { Smartphone, Monitor, Globe, LogOut } from 'lucide-react';

export const SessionManagement = () => {
  const [sessions, setSessions] = useState([
    { id: 's1', device: 'iPhone 13', browser: 'Safari Mobile', location: 'London, UK', isCurrent: true, lastActive: 'Active now', type: 'mobile' },
    { id: 's2', device: 'Windows PC', browser: 'Chrome', location: 'London, UK', isCurrent: false, lastActive: '2 hours ago', type: 'desktop' },
    { id: 's3', device: 'MacBook Pro', browser: 'Safari', location: 'Manchester, UK', isCurrent: false, lastActive: 'Yesterday', type: 'desktop' }
  ]);

  const handleRevoke = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const getIcon = (type) => {
    if (type === 'mobile') return <Smartphone className="w-5 h-5" />;
    if (type === 'desktop') return <Monitor className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  return (
    <div className="bg-ink-900 border border-ink-800 rounded-3xl p-6 shadow-card-elevated">
      <h3 className="text-xl font-heading font-black text-white mb-1">Device Sessions</h3>
      <p className="text-sm text-ink-400 mb-6">Manage devices currently logged into your account.</p>
      
      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-ink-950 border border-ink-800 rounded-2xl gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${session.isCurrent ? 'bg-brand-500/20 text-brand-500' : 'bg-ink-800 text-ink-300'}`}>
                {getIcon(session.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white">{session.device}</p>
                  {session.isCurrent && (
                    <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 bg-brand-500 text-white rounded-full">Current</span>
                  )}
                </div>
                <p className="text-xs text-ink-400 mt-1">{session.browser} • {session.location}</p>
                <p className="text-xs text-ink-500 mt-0.5">Last active: {session.lastActive}</p>
              </div>
            </div>
            
            {!session.isCurrent && (
              <button 
                onClick={() => handleRevoke(session.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-ink-800 hover:bg-red-500/10 text-ink-300 hover:text-red-500 rounded-xl font-bold text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" /> Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
