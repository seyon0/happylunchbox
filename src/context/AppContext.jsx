import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MOCK_MENU_ITEMS,
  MOCK_USER,
  MOCK_BOOKINGS,
  CURATED_COMBOS,
  MOCK_SUBSCRIPTIONS,
  MOCK_TRANSACTIONS,
  MOCK_CAMPAIGNS,
  MOCK_SHOPS,
} from '../data/mockData';
import {
  authAPI,
  shopsAPI,
  menuAPI,
  bookingsAPI,
  couponsAPI,
  getSavedUser,
  clearTokens,
  getAccessToken,
} from '../services/api';

const AppContext = createContext();

const USE_API = true; // Changed from false to enable real API calls

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);

  // ── Auth State ────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAccessToken());
  const [user, setUser] = useState(() => getSavedUser() || MOCK_USER);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // ── Shop State ────────────────────────────────────────────────────────────
  const [shops, setShops] = useState(MOCK_SHOPS);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [shopsLoading, setShopsLoading] = useState(false);

  // ── Menu State ────────────────────────────────────────────────────────────
  const [menuItems, setMenuItems] = useState(MOCK_MENU_ITEMS);
  const [menuLoading, setMenuLoading] = useState(false);

  // ── Bookings State ────────────────────────────────────────────────────────
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  // ── Other State ───────────────────────────────────────────────────────────
  const [subscriptions]  = useState(MOCK_SUBSCRIPTIONS);
  const [transactions]   = useState(MOCK_TRANSACTIONS);
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);

  // ── Promo Codes ───────────────────────────────────────────────────────────
  const PROMO_CODES = {
    'JAFFNA10': { type: 'percent', value: 10, label: '10% off' },
    'WELCOME5': { type: 'fixed', value: 5.00, label: '£5 off your order' },
    'SUMMER20': { type: 'percent', value: 20, label: '20% off' },
    'FREESHIP': { type: 'fixed', value: 2.50, label: '£2.50 delivery discount' },
  };
  const [appliedPromo, setAppliedPromo] = useState(null);

  const applyPromoCode = async (code) => {
    try {
      if (!USE_API) {
        const promo = PROMO_CODES[code.toUpperCase()];
        if (promo) {
          setAppliedPromo({ code: code.toUpperCase(), ...promo });
          return { success: true, message: `Applied: ${promo.label}` };
        }
        return { success: false, message: 'Invalid or expired promo code.' };
      }

      const promo = await couponsAPI.validate(code);
      setAppliedPromo({
        code: promo.code,
        type: promo.type.toLowerCase() === 'percentage' ? 'percent' : 'fixed',
        value: promo.value,
        label: promo.label
      });
      return { success: true, message: `Applied: ${promo.label}` };
    } catch (err) {
      return { success: false, message: err?.message || 'Invalid or expired promo code.' };
    }
  };
  const removePromoCode = () => setAppliedPromo(null);

  // ── Favourites ────────────────────────────────────────────────────────────
  const [favouriteShops, setFavouriteShops] = useState(['shop-1']);
  const [favouriteItems, setFavouriteItems] = useState(['s2', 'm1']);

  const toggleFavouriteShop = (shopId) => {
    setFavouriteShops(prev =>
      prev.includes(shopId) ? prev.filter(id => id !== shopId) : [...prev, shopId]
    );
  };
  const toggleFavouriteItem = (itemId) => {
    setFavouriteItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  // ── Notifications ─────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'order_confirmed', title: 'Order Confirmed!', body: 'Your lunchbox order UK-LB-7710 has been confirmed.', time: '2 mins ago', is_read: false, created_at: new Date(Date.now() - 2 * 60000).toISOString() },
    { id: 'n2', type: 'promo', title: 'Summer Special!', body: 'Use code SUMMER20 for 20% off today only.', time: '1 hour ago', is_read: false, created_at: new Date(Date.now() - 60 * 60000).toISOString() },
    { id: 'n3', type: 'order_on_way', title: 'Out for Delivery', body: 'Your rider is on the way with your lunchbox!', time: 'Yesterday', is_read: true, created_at: new Date(Date.now() - 24 * 60 * 60000).toISOString() },
    { id: 'n4', type: 'system', title: 'New Menu Added', body: 'Jaffna Roots has added 5 new dishes to their menu.', time: '2 days ago', is_read: true, created_at: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString() },
  ]);

  const markNotifRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };
  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };
  const unreadNotifCount = notifications.filter(n => !n.is_read).length;

  const [promotionBanners, setPromotionBanners] = useState([]);

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate]   = useState(tomorrowStr);
  const [selectedDates, setSelectedDates] = useState([tomorrowStr]);
  const [selectedSlot, setSelectedSlot]   = useState('12:30 PM - 1:30 PM');
  const [recurringDays, setRecurringDays] = useState([]);
  const [spiceLevel, setSpiceLevel]       = useState('Medium');
  const [allergyNotes, setAllergyNotes]   = useState('');
  const [dailyOrderLimit, setDailyOrderLimit] = useState(25);

  const [lunchbox, setLunchbox] = useState({
    starter: [], main: [], side: [], drink: [],
  });

  const [savedLunchboxes, setSavedLunchboxes] = useState([
    { id: 'sb-1', name: 'My Daily High-Protein box', items: 2, description: 'Chicken Curry, Steamed Rice, Yogurt Drink' },
    { id: 'sb-2', name: 'Spicy Jaffna Veggie Pack', items: 3, description: 'Veg Samosa, Paneer Tikka, Mango Lassi' }
  ]);

  const saveLunchbox = (name, currentBox, totalItems) => {
    const allItems = [...currentBox.starter, ...currentBox.main, ...currentBox.side, ...currentBox.drink];
    const desc = allItems.map(i => i.name).join(', ');
    const newBox = {
      id: `sb-${Date.now()}`,
      name,
      items: totalItems,
      description: desc,
      boxData: currentBox 
    };
    setSavedLunchboxes(prev => [newBox, ...prev]);
  };

  const deleteSavedLunchbox = (id) => {
    setSavedLunchboxes(prev => prev.filter(b => b.id !== id));
  };

  // ── Fetch shops from backend (fall back to mock) ──────────────────────────
  const fetchShops = useCallback(async () => {
    if (!USE_API) return;
    setShopsLoading(true);
    try {
      const data = await shopsAPI.list();
      const list = Array.isArray(data) ? data : (data.results || []);
      if (list.length > 0) setShops(list);
    } catch (_) {
      // fall back to mock
    } finally {
      setShopsLoading(false);
    }
  }, []);

  // ── Fetch menu items from backend (fall back to mock) ─────────────────────
  const fetchMenuItems = useCallback(async () => {
    if (!USE_API) return;
    setMenuLoading(true);
    try {
      const items = await menuAPI.items();
      if (items.length > 0) setMenuItems(items);
    } catch (_) {
      // fall back to mock
    } finally {
      setMenuLoading(false);
    }
  }, []);

  // ── Fetch user bookings from backend ─────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    if (!USE_API) return;
    if (!isLoggedIn) return;
    try {
      const data = await bookingsAPI.list();
      if (data.length > 0) setBookings(data);
    } catch (_) {
      // fall back to local mock
    }
  }, [isLoggedIn]);

  const fetchPromotions = useCallback(async () => {
    if (!USE_API) return;
    try {
      const data = await adminAPI.getPromotions();
      if (data && data.length > 0) setPromotionBanners(data);
    } catch (_) {
      // ignore
    }
  }, []);

  useEffect(() => { fetchShops();    }, [fetchShops]);
  useEffect(() => { fetchMenuItems(); }, [fetchMenuItems]);
  useEffect(() => { fetchBookings();  }, [fetchBookings]);
  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (!USE_API) return;
    if (getAccessToken()) {
      authAPI.me()
        .then(u => { setUser(u); setIsLoggedIn(true); })
        .catch(() => { clearTokens(); setIsLoggedIn(false); });
    }
  }, []);

  // ── Navigation Wrapper ──────────────────────────────────────────────────
  const navigateTo = useCallback((screen, replace = false) => {
    // Map old screen names to new routes
    const routeMap = {
      'landing': '/',
      'landing-about': '/about',
      'landing-blog': '/blog',
      'landing-inquiry': '/inquiry',
      'landing-partnership': '/partnership',
      'customer-auth': '/login',
      'register': '/register',
      'shop-auth': '/shop-auth',
      'admin-auth': '/admin-auth',
      'rider-auth': '/rider-auth',
      'home': '/home',
      'shops': '/shops',
      'menu': '/menu',
      'builder': '/builder',
      'calendar': '/calendar',
      'bookings': '/bookings',
      'checkout': '/checkout',
      'confirmation': '/confirmation',
      'profile': '/profile',
      'wallet': '/wallet',
      'favourites': '/favourites',
      'notifications': '/notifications',
      'shop-detail': '/shops/detail', // Simplified for generic
      'admin': '/admin',
      'shop-dashboard': '/kitchen',
      'rider-dashboard': '/rider'
    };
    
    const targetRoute = routeMap[screen] || `/${screen}`;
    navigate(targetRoute, { replace });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const loginUser = async (email, password) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const data = await authAPI.login(email, password);
      setUser(data.user);
      setIsLoggedIn(true);
      await fetchBookings();
      navigateTo('home', true);
      return data;
    } catch (err) {
      const msg = err?.error || err?.detail || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const registerUser = async (formData) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const data = await authAPI.register(formData);
      setUser(data.user);
      setIsLoggedIn(true);
      if (data.user.role === 'ADMIN') navigateTo('admin', true);
      else if (data.user.role === 'KITCHEN') navigateTo('shop-dashboard', true);
      else if (data.user.role === 'RIDER') navigateTo('rider-dashboard', true);
      else navigateTo('home', true);
      return data;
    } catch (err) {
      const msg =
        err?.email?.[0] ||
        err?.password?.[0] ||
        err?.non_field_errors?.[0] ||
        err?.detail ||
        'Registration failed.';
      setAuthError(msg);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setIsLoggedIn(false);
    setUser(MOCK_USER);
    setBookings(MOCK_BOOKINGS);
    navigateTo('login', true);
  };

  const updateUserProfile = async (updatedFields) => {
    try {
      const updated = await authAPI.updateProfile(updatedFields);
      setUser(updated);
      return updated;
    } catch (_) {
      // optimistic local update
      setUser(prev => ({ ...prev, ...updatedFields }));
    }
  };

  // ── Shop actions ──────────────────────────────────────────────────────────
  const addShop = async (shopData) => {
    try {
      const created = await shopsAPI.create(shopData);
      setShops(prev => [created, ...prev]);
      return created;
    } catch (_) {
      const newShop = { ...shopData, id: `shop-${Date.now()}`, is_active: true };
      setShops(prev => [newShop, ...prev]);
    }
  };

  const updateShop = async (updatedShop) => {
    try {
      const saved = await shopsAPI.update(updatedShop.id, updatedShop);
      setShops(prev => prev.map(s => s.id === saved.id ? saved : s));
    } catch (_) {
      setShops(prev => prev.map(s => s.id === updatedShop.id ? updatedShop : s));
    }
  };

  const deleteShop = async (shopId) => {
    try { await shopsAPI.delete(shopId); } catch (_) { /* ignore */ }
    setShops(prev => prev.filter(s => s.id !== shopId));
  };

  const toggleShopActive = (shopId) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, isActive: !s.isActive, is_active: !s.is_active } : s));
  };

  const selectShop = (shopId) => {
    setSelectedShopId(shopId);
    clearLunchbox();
    navigateTo('shop-detail');
  };

  // ── Lunchbox ──────────────────────────────────────────────────────────────
  const addToSlot = (item) => setLunchbox(prev => ({ ...prev, [item.category]: [item] }));

  const removeFromSlot = (category, indexToRemove) =>
    setLunchbox(prev => ({
      ...prev,
      [category]: prev[category].filter((_, idx) => idx !== indexToRemove),
    }));

  const removeSpecificItemFromSlot = (item) => {
    const category = item.category;
    setLunchbox(prev => {
      const list  = prev[category] || [];
      const index = list.findIndex(i => i.id === item.id);
      if (index === -1) return prev;
      return { ...prev, [category]: list.filter((_, idx) => idx !== index) };
    });
  };

  const applyCombo = (comboId) => {
    const combo = CURATED_COMBOS.find(c => c.id === comboId);
    if (!combo) return;
    const newBox = { starter: [], main: [], side: [], drink: [] };
    combo.items.forEach(itemId => {
      const item = menuItems.find(i => i.id === itemId);
      if (item) newBox[item.category].push(item);
    });
    setLunchbox(newBox);
  };

  const clearLunchbox = () => setLunchbox({ starter: [], main: [], side: [], drink: [] });

  // ── Admin CRUD for Menu Items ─────────────────────────────────────────────
  const addMenuItem = async (newItem) => {
    try {
      const created = await menuAPI.createItem(newItem);
      setMenuItems(prev => [created, ...prev]);
    } catch (_) {
      const itemWithId = { ...newItem, id: `custom-${Date.now()}`, available: true };
      setMenuItems(prev => [itemWithId, ...prev]);
    }
  };

  const updateMenuItem = async (updatedItem) => {
    try {
      const saved = await menuAPI.updateItem(updatedItem.id, updatedItem);
      setMenuItems(prev => prev.map(item => item.id === saved.id ? saved : item));
    } catch (_) {
      setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    }
  };

  const deleteMenuItem = async (itemId) => {
    try { await menuAPI.deleteItem(itemId); } catch (_) { /* ignore */ }
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleMenuItemAvailability = (itemId) =>
    setMenuItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, available: !item.available } : item)
    );

  // ── Admin Order Status ────────────────────────────────────────────────────
  const updateOrderStatus = async (bookingId, newStatus) => {
    const STATUS_STEPS = { Pending: 0, Confirmed: 1, Cooking: 2, 'On Way': 3, Delivered: 4, Cancelled: 0 };
    const statusStep = STATUS_STEPS[newStatus] ?? 0;

    // Optimistic update
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: newStatus, statusStep, status_step: statusStep } : b)
    );
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
    } catch (_) { /* ignore, local already updated */ }
  };

  // ── Computed Stats ────────────────────────────────────────────────────────
  const filledCount = ['starter', 'main', 'side', 'drink'].reduce((s, k) => s + (lunchbox[k]?.length || 0), 0);
  const allSelectedItems = [...(lunchbox.starter||[]), ...(lunchbox.main||[]), ...(lunchbox.side||[]), ...(lunchbox.drink||[])];
  const totalPrice    = allSelectedItems.reduce((s, i) => s + (Number(i?.price) || 0), 0);
  const totalCalories = allSelectedItems.reduce((s, i) => s + (i?.calories || 0), 0);
  const isLunchboxComplete = filledCount > 0;

  const shopMenuItems = selectedShopId
    ? menuItems.filter(item => item.shopId === selectedShopId || item.shop === selectedShopId)
    : menuItems;

  // ── Multi-Date Toggle ─────────────────────────────────────────────────────
  const toggleSelectedDate = (dateStr) => {
    setSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        const next = prev.filter(d => d !== dateStr);
        if (next.length === 0) return prev;
        setSelectedDate(next[next.length - 1]);
        return next;
      } else {
        setSelectedDate(dateStr);
        return [...prev, dateStr];
      }
    });
  };

  // ── Place Order ───────────────────────────────────────────────────────────
  const placeOrder = async () => {
    const itemIds = allSelectedItems.map(i => i.id).filter(id => !String(id).startsWith('mock-') && !String(id).startsWith('custom-'));

    // Try real API booking first
    if (isLoggedIn && itemIds.length === allSelectedItems.length && selectedShopId) {
      try {
        const created = await bookingsAPI.create({
          shop: selectedShopId,
          delivery_date: selectedDates.length > 1 ? selectedDates.join(', ') : selectedDate,
          delivery_slot: selectedSlot,
          spice_level: spiceLevel,
          address: user?.addresses?.find(a => a.is_default || a.isDefault)?.street || user?.addresses?.[0]?.street || '123 Default St',
          item_ids: itemIds,
        });
        setBookings(prev => [created, ...prev]);
        clearLunchbox();
        navigateTo('confirmation');
        return;
      } catch (_) { /* fall through to mock */ }
    }

    // Fallback mock booking
    const newBooking = {
      id: `JR-${Math.floor(1000 + Math.random() * 9000)}`,
      shopId: selectedShopId,
      deliveryDate: selectedDates.length > 1 ? selectedDates.join(', ') : selectedDate,
      deliverySlot: selectedSlot,
      status: 'Confirmed',
      statusStep: 1,
      spiceLevel,
      totalPrice: Number(totalPrice.toFixed(2)),
      items: allSelectedItems.map(i => i.id),
      address: user?.addresses?.find(a => a.is_default || a.isDefault)?.street || user?.addresses?.[0]?.street || '123 Mock St',
    };
    setBookings(prev => [newBooking, ...prev]);
    clearLunchbox();
    navigateTo('confirmation');
  };

  // ── Promotion Banners ─────────────────────────────────────────────────────
  const addPromotionBanner = async (banner) => {
    try {
      const created = await adminAPI.createPromotion(banner);
      setPromotionBanners(prev => [created, ...prev]);
    } catch (err) {
      console.error(err);
      setPromotionBanners(prev => [{ ...banner, id: Date.now(), active: true }, ...prev]);
    }
  };
  const updatePromotionBanner = async (id, updatedFields) => {
    try {
      const updated = await adminAPI.updatePromotion(id, updatedFields);
      setPromotionBanners(prev => prev.map(b => b.id === id ? updated : b));
    } catch (err) {
      console.error(err);
      setPromotionBanners(prev => prev.map(b => b.id === id ? { ...b, ...updatedFields } : b));
    }
  };
  const deletePromotionBanner = async (id) => {
    try {
      await adminAPI.deletePromotion(id);
    } catch (err) {
      console.error(err);
    }
    setPromotionBanners(prev => prev.filter(b => b.id !== id));
  };

  return (
    <AppContext.Provider value={{
      // Navigation
      currentScreen: window.location.pathname.replace('/', '') || 'landing', 
      history: [], navigateTo, goBack,
      canGoBack: history.length > 1 || window.location.pathname !== '/',
      isAdminMode, setIsAdminMode,

      // Auth
      isLoggedIn, setIsLoggedIn, user, setUser,
      authLoading, authError, setAuthError,
      loginUser, registerUser, logout,
      updateUserProfile,

      // Shops
      shops, selectedShopId, setSelectedShopId,
      selectShop, addShop, updateShop,
      deleteShop, toggleShopActive, shopsLoading,
      fetchShops,

      // Delivery / Calendar
      selectedDate, setSelectedDate,
      selectedDates, setSelectedDates,
      toggleSelectedDate,
      selectedSlot, setSelectedSlot,
      recurringDays, setRecurringDays,
      spiceLevel, setSpiceLevel,
      allergyNotes, setAllergyNotes,
      dailyOrderLimit, setDailyOrderLimit,

      // Lunchbox
      lunchbox, setLunchbox, addToSlot, removeFromSlot,
      removeSpecificItemFromSlot, applyCombo,
      clearLunchbox, filledCount, allSelectedItems,
      totalPrice, totalCalories, isLunchboxComplete,
      savedLunchboxes, saveLunchbox, deleteSavedLunchbox,

      // Menu
      bookings, menuItems, shopMenuItems,
      menuLoading, fetchMenuItems,
      subscriptions, transactions, campaigns,
      addMenuItem, updateMenuItem, deleteMenuItem,
      toggleMenuItemAvailability,
      updateOrderStatus, placeOrder,
      fetchBookings,

      // Promotion Banners
      promotionBanners,
      addPromotionBanner,
      updatePromotionBanner,
      deletePromotionBanner,

      // Promo Codes
      appliedPromo, applyPromoCode, removePromoCode,

      // Favourites
      favouriteShops, favouriteItems,
      toggleFavouriteShop, toggleFavouriteItem,

      // Notifications
      notifications, markNotifRead, markAllNotifsRead, unreadNotifCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
