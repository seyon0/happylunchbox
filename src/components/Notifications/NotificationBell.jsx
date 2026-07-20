import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Package, ChefHat, Truck, CheckCircle2, Megaphone, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NOTIF_ICONS = {
  order_confirmed: { icon: Package,      color: 'text-brand-600',   bg: 'bg-brand-50' },
  order_cooking:   { icon: ChefHat,      color: 'text-saffron-600', bg: 'bg-saffron-50' },
  order_on_way:    { icon: Truck,        color: 'text-blue-600',    bg: 'bg-blue-50' },
  order_delivered: { icon: CheckCircle2, color: 'text-fresh-600',   bg: 'bg-fresh-50' },
  order_cancelled: { icon: X,            color: 'text-red-600',     bg: 'bg-red-50' },
  promo:           { icon: Megaphone,    color: 'text-purple-600',  bg: 'bg-purple-50' },
  system:          { icon: Settings,     color: 'text-stone-600',   bg: 'bg-stone-100' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export const NotificationBell = () => {
  const { notifications, unreadNotifCount, markNotifRead, markAllNotifsRead, fetchNotifications } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Refresh notifications when bell opens
  useEffect(() => {
    if (open && fetchNotifications) fetchNotifications();
  }, [open]);

  const displayNotifs = (notifications || []).slice(0, 15);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="relative p-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-stone-600 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotifCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-cream-200 z-[500] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-cream-100">
            <div>
              <h4 className="font-heading font-extrabold text-base text-ink-900">Notifications</h4>
              {unreadNotifCount > 0 && (
                <p className="text-xs text-stone-400">{unreadNotifCount} unread</p>
              )}
            </div>
            {unreadNotifCount > 0 && (
              <button
                onClick={markAllNotifsRead}
                className="text-xs text-brand-600 font-bold hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-cream-50">
            {displayNotifs.length === 0 ? (
              <div className="p-8 flex flex-col items-center gap-2 text-stone-400">
                <Bell className="w-8 h-8" />
                <p className="text-sm font-medium">No notifications yet</p>
              </div>
            ) : displayNotifs.map(notif => {
              const { icon: Icon, color, bg } = NOTIF_ICONS[notif.type] || NOTIF_ICONS.system;
              return (
                <button
                  key={notif.id}
                  onClick={() => markNotifRead(notif.id)}
                  className={`w-full text-left p-4 flex items-start gap-3 hover:bg-cream-50 transition-colors ${!notif.is_read ? 'bg-brand-50/40' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${!notif.is_read ? 'text-ink-900' : 'text-stone-600'} leading-tight`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{notif.body}</p>
                    <p className="text-[10px] text-stone-400 mt-1">{timeAgo(notif.created_at)}</p>
                  </div>
                  {!notif.is_read && (
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
