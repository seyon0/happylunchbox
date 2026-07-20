import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { shopsAPI, menuAPI, bookingsAPI } from '../../services/api';
import { KitchenLayout } from './KitchenLayout';
import { KitchenOrderQueue } from './KitchenOrderQueue';
import { MenuManagerLayout } from './MenuManagerLayout';
import { KitchenSettings } from './KitchenSettings';
import { KitchenDashboard } from './KitchenDashboard';
import socket, { connectToShop } from '../../services/socket';

export const ShopDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ORDERS');
  
  const [shop, setShop] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [isOperating, setIsOperating] = useState(true);
  
  // PWA Offline status
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Audio refs
  const newOrderAudio = useRef(null);
  const courierAudio = useRef(null);

  useEffect(() => {
    // Setup offline listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Init Audio
    newOrderAudio.current = new Audio('/audio/new_order.mp3');
    courierAudio.current = new Audio('/audio/courier.mp3');

    fetchDashboardData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (shop?.id) {
      connectToShop(shop.id);

      socket.on('order.created', (newOrder) => {
        playAudio('new_order');
        setActiveBookings(prev => {
          if (prev.some(b => b.id === newOrder.id)) return prev;
          return [...prev, newOrder];
        });
      });

      socket.on('order.updated', (updatedOrder) => {
        setActiveBookings(prev => prev.map(b => b.id === updatedOrder.id ? updatedOrder : b));
      });

      return () => {
        socket.off('order.created');
        socket.off('order.updated');
      };
    }
  }, [shop?.id]);

  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const fetchedShop = await shopsAPI.getMyShop();
      setShop(fetchedShop);
      setIsOperating(fetchedShop.isOperating ?? true);

      const fetchedItems = await menuAPI.items({ shopId: fetchedShop.id });
      setShopItems(fetchedItems);

      const fetchedQueue = await bookingsAPI.activeQueue(fetchedShop.id);
      setActiveBookings(fetchedQueue);
    } catch (err) {
      console.error('Failed to load shop dashboard data', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const playAudio = (type) => {
    const audio = type === 'new_order' ? newOrderAudio.current : courierAudio.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log('Audio autoplay blocked:', e));
    }
  };

  const handleUpdateStatus = async (bookingId, nextStatus) => {
    try {
      await bookingsAPI.updateStatus(bookingId, nextStatus);
      if (nextStatus === 'ON_WAY') playAudio('courier');
      
      setActiveBookings(prev => {
        if (nextStatus === 'DELIVERED') return prev.filter(b => b.id !== bookingId);
        return prev.map(b => b.id === bookingId ? { ...b, status: nextStatus } : b);
      });
    } catch (err) {
      console.error('Failed to update status', err);
      // If offline, maybe we can store in IndexedDB to sync later? 
      // For now, simple alert if offline.
      if (!navigator.onLine) {
        alert("You are offline. Cannot update order status.");
      }
    }
  };

  if (loading && !shop) {
    return (
      <div className="flex h-screen bg-ink-950 items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <KitchenLayout activeTab={activeTab} setActiveTab={setActiveTab} isOffline={isOffline}>
      {activeTab === 'ORDERS' && (
        <KitchenOrderQueue bookings={activeBookings} onUpdateStatus={handleUpdateStatus} />
      )}
      {activeTab === 'MENU' && (
        <MenuManagerLayout items={shopItems} fetchDashboardData={fetchDashboardData} />
      )}
      {activeTab === 'SETTINGS' && (
        <KitchenSettings shop={shop} isOperating={isOperating} setIsOperating={setIsOperating} />
      )}
      {activeTab === 'ANALYTICS' && (
        <KitchenDashboard 
          shop={shop} 
          isOffline={isOffline} 
          newOrderAudio={newOrderAudio} 
          fetchDashboardData={fetchDashboardData}
        />
      )}
      {activeTab === 'FINANCE' && (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="w-16 h-16 bg-ink-900 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <h2 className="text-xl font-black text-white mb-2">Finance Hub</h2>
          <p className="text-ink-400 text-sm">Payout history and revenue reports are coming soon to your Kitchen Portal.</p>
        </div>
      )}
    </KitchenLayout>
  );
};
