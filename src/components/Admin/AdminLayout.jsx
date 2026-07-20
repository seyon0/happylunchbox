import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Store, ClipboardList, Bike, Users, PoundSterling,
  Megaphone, MessageSquare, BarChart3, Settings, Menu, Bell,
  ChefHat, LogOut, ChevronRight, Shield, X, AlertTriangle, AlertCircle, Info, Search
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Vendors', icon: Store, to: '/admin/vendors' },
  { label: 'Orders', icon: ClipboardList, to: '/admin/orders' },
  { label: 'Riders', icon: Bike, to: '/admin/riders' },
  { label: 'Customers', icon: Users, to: '/admin/customers' },
  { label: 'Finance', icon: PoundSterling, to: '/admin/finance' },
  { label: 'Marketing', icon: Megaphone, to: '/admin/marketing' },
  { label: 'Support', icon: MessageSquare, to: '/admin/support' },
  { label: 'Analytics', icon: BarChart3, to: '/admin/analytics' },
  { label: 'Settings', icon: Settings, to: '/admin/settings' },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const [alerts, setAlerts] = useState([]);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/alerts/${id}/read`, { method: 'PUT' });
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  // Breadcrumb logic
  const pathnames = location.pathname.split('/').filter(x => x);
  const breadcrumbName = pathnames.length === 1 ? 'Dashboard' : pathnames[1].charAt(0).toUpperCase() + pathnames[1].slice(1);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-admin-950 border-r border-admin-800 text-admin-300">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-admin-800 flex items-center justify-between">
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-auto' : 'w-0 opacity-0'}`}>
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-brand-500 to-saffron-500 flex items-center justify-center shadow-glow">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div className="whitespace-nowrap">
            <p className="text-white font-black text-sm tracking-wide uppercase leading-none">Healthy Lunchbox</p>
            <p className="text-admin-400 text-[10px] tracking-widest font-semibold mt-1">OPERATIONS HUB</p>
          </div>
        </div>
        {!sidebarOpen && (
           <div className="w-9 h-9 shrink-0 mx-auto rounded-xl bg-gradient-to-br from-brand-500 to-saffron-500 flex items-center justify-center shadow-glow cursor-pointer" onClick={() => setSidebarOpen(true)}>
             <ChefHat className="w-5 h-5 text-white" />
           </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
        <div className={`text-xs font-bold text-admin-500 tracking-wider mb-4 px-3 uppercase ${sidebarOpen ? 'block' : 'hidden'}`}>Platform Modules</div>
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            onClick={() => setMobileMenuOpen(false)}
            title={!sidebarOpen ? label : ''}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-admin-800 text-white shadow-dark-elevated'
                  : 'text-admin-400 hover:bg-admin-900 hover:text-white'
              }`
            }
          >
            <Icon size={20} className={`shrink-0 transition-colors ${window.location.pathname === to || (to === '/admin' && window.location.pathname === '/admin') ? 'text-brand-500' : 'text-admin-500 group-hover:text-admin-300'}`} />
            <span className={`whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-admin-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 shrink-0 rounded-full bg-admin-800 border-2 border-admin-700 flex items-center justify-center text-white font-bold text-sm">
            {user?.firstName?.[0] || user?.first_name?.[0] || 'A'}
          </div>
          <div className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
            <p className="text-white text-sm font-bold truncate">
              {user?.firstName || user?.first_name || 'Admin'} {user?.lastName || user?.last_name || ''}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3 h-3 text-brand-500" />
              <p className="text-brand-500 text-[10px] font-black tracking-wider">SYSTEM ADMIN</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-admin-400 hover:bg-red-900/30 hover:text-red-400 text-sm font-bold transition-all ${sidebarOpen ? '' : 'p-2'}`}
          title={!sidebarOpen ? 'Sign Out' : ''}
        >
          <LogOut className="w-5 h-5" />
          <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-admin-900 text-admin-200 overflow-hidden font-sans selection:bg-brand-500 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64 bg-admin-950 flex flex-col shadow-dark-floating"><SidebarContent /></div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-saffron-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-admin-950/80 backdrop-blur-xl border-b border-admin-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-admin-800 text-admin-400 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 -ml-2 rounded-lg hover:bg-admin-800 text-admin-400 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-2 text-sm font-semibold">
              <span className="text-admin-500 uppercase tracking-wider text-xs">Admin Console</span>
              <ChevronRight className="w-3.5 h-3.5 text-admin-600" />
              <span className="text-white">{breadcrumbName}</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Global Search */}
            <div className="hidden md:flex relative group">
              <Search className="w-4 h-4 text-admin-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-brand-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search orders, users, vendors..."
                className="w-64 bg-admin-900 border border-admin-700 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-admin-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-admin-500">
                <kbd className="px-1.5 py-0.5 bg-admin-800 rounded border border-admin-700">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-admin-800 rounded border border-admin-700">K</kbd>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="relative p-2 rounded-full bg-admin-800 hover:bg-admin-700 text-admin-300 transition-colors border border-admin-700 shadow-sm"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-500 rounded-full animate-pulse ring-2 ring-admin-800" />
                )}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-3 w-80 bg-admin-900 rounded-2xl shadow-dark-floating border border-admin-700 overflow-hidden z-50">
                  <div className="px-5 py-4 border-b border-admin-800 flex justify-between items-center bg-admin-950">
                    <h3 className="font-bold text-white text-sm tracking-wide">Notifications</h3>
                    <span className="text-xs font-black text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto no-scrollbar">
                    {alerts.length === 0 ? (
                      <div className="p-8 text-center text-admin-500 text-sm font-semibold">No recent alerts. You're all caught up!</div>
                    ) : (
                      alerts.map(alert => (
                        <div 
                          key={alert.id} 
                          onClick={() => !alert.isRead && markAsRead(alert.id)}
                          className={`p-4 border-b border-admin-800 hover:bg-admin-800/50 cursor-pointer transition-all ${!alert.isRead ? 'bg-admin-800/30' : 'opacity-60 grayscale-[50%]'}`}
                        >
                          <div className="flex gap-3">
                            <div className="shrink-0 mt-0.5">
                              {alert.severity === 'CRITICAL' && <AlertTriangle className="w-4 h-4 text-brand-500" />}
                              {alert.severity === 'WARNING' && <AlertCircle className="w-4 h-4 text-saffron-500" />}
                              {alert.severity === 'INFO' && <Info className="w-4 h-4 text-blue-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold mb-1 truncate ${!alert.isRead ? 'text-white' : 'text-admin-300'}`}>{alert.type.replace('_', ' ')}</p>
                              <p className="text-xs text-admin-400 leading-relaxed line-clamp-2">{alert.message}</p>
                              <p className="text-[10px] text-admin-500 mt-2 font-semibold tracking-wider">
                                {new Date(alert.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!alert.isRead && <div className="w-2 h-2 bg-brand-500 rounded-full shrink-0 shadow-glow" />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-admin-800 bg-admin-950 text-center">
                    <button className="text-xs font-bold text-admin-400 hover:text-white transition-colors">View Alert History</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 no-scrollbar relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
