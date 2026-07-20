import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertCircle, Tag, Search, ArrowLeft } from 'lucide-react';

export const NotificationsScreen = () => {
  const { notifications, markAllNotificationsRead, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifs = notifications?.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'orders') return n.type === 'order';
    if (activeTab === 'promos') return n.type === 'promo';
    return true;
  }) || [];

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <CheckCircle2 className="w-5 h-5 text-fresh-500" />;
      case 'promo': return <Tag className="w-5 h-5 text-saffron-500" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-brand-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 space-y-6 pb-28 lg:pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('home')} className="lg:hidden p-2 -ml-2 rounded-full hover:bg-stone-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-heading text-2xl font-extrabold text-ink-900 tracking-tight">Notifications</h2>
        </div>
        <button 
          onClick={markAllNotificationsRead}
          className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'orders', 'promos'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-bold text-xs capitalize transition-all ${
              activeTab === tab 
                ? 'bg-ink-900 text-white' 
                : 'bg-white text-stone-600 border border-cream-200 hover:border-ink-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3 animate-fade-in">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map(notif => (
            <div 
              key={notif.id} 
              className={`p-4 rounded-2xl border transition-all flex gap-4 items-start ${
                notif.read 
                  ? 'bg-white border-cream-200' 
                  : 'bg-brand-50/30 border-brand-200'
              }`}
            >
              <div className="shrink-0 p-2 rounded-full bg-cream-100">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h4 className={`font-heading font-extrabold text-sm truncate ${notif.read ? 'text-ink-900' : 'text-brand-900'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-medium text-stone-400 shrink-0">{notif.time}</span>
                </div>
                <p className={`text-xs ${notif.read ? 'text-stone-500' : 'text-stone-700 font-medium'}`}>
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0 shadow-sm shadow-brand-500/50"></div>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 bg-cream-100 text-stone-300 rounded-full flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8" />
            </div>
            <p className="font-heading font-extrabold text-lg text-ink-900">All caught up!</p>
            <p className="text-sm text-stone-500">You have no new notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};
