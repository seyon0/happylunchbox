import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  ChefHat, 
  ToggleLeft, 
  ToggleRight,
  Plus,
  Edit2,
  Trash2,
  X,
  Sliders,
  Map as MapIcon,
  Users,
  ClipboardList,
  Megaphone,
  Store,
  BarChart3,
  Bike,
  AlertOctagon,
  DollarSign,
  Settings
} from 'lucide-react';
import { SafeImage } from '../Common/SafeImage';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { RidersTab } from './tabs/RidersTab';
import { UsersTab } from './tabs/UsersTab';
import { DisputesTab } from './tabs/DisputesTab';
import { SettlementsTab } from './tabs/SettlementsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { AdminsTab } from './tabs/AdminsTab';
import { LiveMapTab } from './tabs/LiveMapTab';

// PromotionTab: rich CRUD for the homepage banner, supports PNG/JPG/SVG/MP4
const PromoPreview = ({ url }) => {
  const [imgError, setImgError] = useState(false);
  if (!url) {
    return (
      <div className="w-full h-44 rounded-2xl bg-cream-100 border-2 border-dashed border-cream-300 flex flex-col items-center justify-center text-stone-400">
        <ChefHat className="w-8 h-8 mb-2" />
        <span className="text-xs font-medium">No media selected</span>
      </div>
    );
  }
  const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  if (isVideo) {
    return (
      <video src={url} autoPlay loop muted playsInline className="w-full h-44 rounded-2xl object-cover bg-black" />
    );
  }
  if (imgError) {
    return (
      <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-cream-100 to-cream-200 border border-cream-300 flex flex-col items-center justify-center text-stone-400">
        <ChefHat className="w-8 h-8 mb-2" />
        <span className="text-xs font-medium">Preview unavailable</span>
        <span className="text-[10px] text-stone-400 mt-1 px-4 text-center break-all">{url}</span>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt="Promo Preview"
      className="w-full h-44 rounded-2xl object-cover"
      onError={() => setImgError(true)}
    />
  );
};

const PromotionTab = ({ promotionBanners, addPromotionBanner, updatePromotionBanner, deletePromotionBanner }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formState, setFormState] = useState({ title: '', subtitle: '', imageUrl: '', active: true });
  const fileInputRef = useRef(null);

  const openAdd = () => {
    setEditingBanner(null);
    setFormState({ title: '', subtitle: '', imageUrl: '', active: true });
    setShowModal(true);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    setFormState({
      title: banner.title,
      subtitle: banner.link || '',
      imageUrl: banner.imageUrl,
      active: banner.isActive
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      title: formState.title,
      link: formState.subtitle, // store subtitle in link temporarily
      imageUrl: formState.imageUrl,
      isActive: formState.active,
    };
    if (editingBanner) {
      updatePromotionBanner(editingBanner.id, payload);
    } else {
      addPromotionBanner(payload);
    }
    setShowModal(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setFormState(prev => ({ ...prev, imageUrl: objectUrl }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card-elevated space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-brand-500" />
            <span>Promotion Banners</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            Manage multiple active/inactive promotional banners shown on the landing page carousel.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Grid of Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotionBanners.map(banner => (
          <div key={banner.id} className="border border-cream-200 rounded-3xl p-5 bg-cream-50/50 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${banner.active ? 'bg-fresh-100 text-fresh-700' : 'bg-stone-200 text-stone-600'}`}>
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
                {/* Toggle button */}
                <button
                  onClick={() => updatePromotionBanner(banner.id, { isActive: !banner.isActive })}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${banner.isActive ? 'bg-brand-500' : 'bg-stone-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${banner.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div>
                <h4 className="font-heading font-extrabold text-lg text-ink-900 leading-tight">{banner.title}</h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">{banner.link}</p>
              </div>

              <div className="h-32 w-full overflow-hidden rounded-2xl bg-stone-200">
                <PromoPreview url={banner.imageUrl} />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-cream-100">
              <button
                onClick={() => openEdit(banner)}
                className="flex-1 py-2 rounded-xl border border-cream-300 hover:border-brand-500 hover:text-brand-600 text-stone-600 font-bold text-xs transition-colors text-center"
              >
                Edit
              </button>
              <button
                onClick={() => deletePromotionBanner(banner.id)}
                className="px-3 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-500 font-bold text-xs transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-2xl max-w-lg w-full space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h4 className="font-heading font-extrabold text-xl text-ink-900">
                {editingBanner ? 'Edit Promotion Banner' : 'Add New Banner'}
              </h4>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-cream-100 text-stone-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Banner Title</label>
              <input
                type="text"
                required
                value={formState.title}
                onChange={e => setFormState(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Summer Special"
                className="w-full p-3 rounded-xl bg-stone-50 border border-cream-300 text-sm font-medium text-ink-900 focus:outline-none focus:border-brand-400"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Subtitle / Description</label>
              <textarea
                rows={2}
                required
                value={formState.subtitle}
                onChange={e => setFormState(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="e.g. Get a free dessert on your first order!"
                className="w-full p-3 rounded-xl bg-stone-50 border border-cream-300 text-sm font-medium text-ink-900 focus:outline-none focus:border-brand-400 resize-none"
              />
            </div>

            {/* Upload or URL */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">Banner Image / Video</label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-cream-300 hover:border-brand-400 rounded-2xl p-4 text-center transition-colors bg-cream-50 flex flex-col justify-center items-center"
                >
                  <Plus className="w-5 h-5 text-brand-500 mb-1" />
                  <p className="text-[10px] font-bold text-stone-700">Upload Media</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml, video/mp4"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="rounded-xl overflow-hidden h-16 bg-stone-100 border border-cream-200">
                  <PromoPreview url={formState.imageUrl} />
                </div>
              </div>
              <input
                type="text"
                value={formState.imageUrl}
                onChange={e => setFormState(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Or paste media URL here..."
                className="w-full p-3 mt-2 rounded-xl bg-stone-50 border border-cream-300 text-xs font-medium text-ink-900 focus:outline-none focus:border-brand-400"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-cream-100">
              <span className="text-xs font-bold text-stone-700">Set Active Immediately</span>
              <button
                type="button"
                onClick={() => setFormState(prev => ({ ...prev, active: !prev.active }))}
                className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${formState.active ? 'bg-brand-500' : 'bg-stone-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${formState.active ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-cream-200">
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-bold text-sm shadow-md transition-all"
              >
                {editingBanner ? 'Save Changes' : 'Create Banner'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl border border-cream-300 hover:bg-cream-50 text-stone-600 font-bold text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const AdminCockpit = () => {
  const { 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    toggleMenuItemAvailability, 
    bookings, 
    updateOrderStatus,
    dailyOrderLimit,
    setDailyOrderLimit,
    promotionBanners,
    addPromotionBanner,
    updatePromotionBanner,
    deletePromotionBanner,
    shops,
    addShop,
    updateShop,
    deleteShop,
    toggleShopActive
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders');
  const [editingDish, setEditingDish] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(null); // stores booking id
  const [cutoffTriggered, setCutoffTriggered] = useState(false);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('starter');
  const [formShopId, setFormShopId] = useState(shops.length > 0 ? shops[0].id : '');
  const [formBasePrice, setFormBasePrice] = useState('3.99');
  const [formPrice, setFormPrice] = useState('4.99');
  const [formCalories, setFormCalories] = useState('180');
  const [formDiet, setFormDiet] = useState('veg');
  const [formSpice, setFormSpice] = useState('Medium');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=80');
  const menuImageInputRef = useRef(null);
  const [selectedAdminShopId, setSelectedAdminShopId] = useState(shops.length > 0 ? shops[0].id : 'all');

  // Shop form state
  const [showShopModal, setShowShopModal] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [shopName, setShopName] = useState('');
  const [shopCuisine, setShopCuisine] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [shopRating, setShopRating] = useState('4.5');
  const [shopDeliveryTime, setShopDeliveryTime] = useState('30-45');
  const [shopImageUrl, setShopImageUrl] = useState('');

  const handleMenuImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Revoke old blob URL if any
    if (formImageUrl && formImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formImageUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setFormImageUrl(objectUrl);
  };

  const openAddModal = () => {
    setFormName('');
    setFormCategory('starter');
    setFormShopId(shops.length > 0 ? shops[0].id : '');
    setFormBasePrice('3.99');
    setFormPrice('4.99');
    setFormCalories('180');
    setFormDiet('veg');
    setFormSpice('Medium');
    setFormDescription('');
    setFormImageUrl('https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=80');
    setShowAddModal(true);
  };

  const openEditModal = (dish) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormCategory(dish.category);
    setFormShopId(dish.shopId || '');
    setFormBasePrice(dish.basePrice ? dish.basePrice.toString() : '0');
    setFormPrice(dish.price.toString());
    setFormCalories(dish.calories.toString());
    setFormDiet(dish.dietType);
    setFormSpice(dish.spiceLevel);
    setFormDescription(dish.description);
    setFormImageUrl(dish.imageUrl);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formName) return;
    addMenuItem({
      name: formName,
      category: formCategory,
      shopId: formShopId,
      basePrice: parseFloat(formBasePrice) || 3.99,
      price: parseFloat(formPrice) || 4.99,
      calories: parseInt(formCalories) || 180,
      dietType: formDiet,
      spiceLevel: formSpice,
      description: formDescription || 'Authentic homestyle preparation.',
      imageUrl: formImageUrl
    });
    setShowAddModal(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingDish || !formName) return;
    updateMenuItem({
      ...editingDish,
      name: formName,
      category: formCategory,
      shopId: formShopId,
      basePrice: parseFloat(formBasePrice) || 3.99,
      price: parseFloat(formPrice) || 4.99,
      calories: parseInt(formCalories) || 180,
      dietType: formDiet,
      spiceLevel: formSpice,
      description: formDescription,
      imageUrl: formImageUrl
    });
    setEditingDish(null);
  };

  const openAddShop = () => {
    setShopName('');
    setShopCuisine('');
    setShopLocation('');
    setShopRating('4.5');
    setShopDeliveryTime('30-45');
    setShopImageUrl('');
    setShowShopModal(true);
  };

  const openEditShop = (shop) => {
    setEditingShop(shop);
    setShopName(shop.name);
    setShopCuisine(shop.cuisine);
    setShopLocation(shop.location);
    setShopRating(shop.rating.toString());
    setShopDeliveryTime(shop.deliveryTime);
    setShopImageUrl(shop.imageUrl);
  };

  const handleSaveShop = (e) => {
    e.preventDefault();
    if (!shopName) return;
    if (editingShop) {
      updateShop({
        ...editingShop,
        name: shopName,
        cuisine: shopCuisine,
        location: shopLocation,
        rating: parseFloat(shopRating) || 4.5,
        deliveryTime: shopDeliveryTime,
        imageUrl: shopImageUrl
      });
      setEditingShop(null);
    } else {
      addShop({
        name: shopName,
        cuisine: shopCuisine,
        location: shopLocation,
        rating: parseFloat(shopRating) || 4.5,
        deliveryTime: shopDeliveryTime,
        imageUrl: shopImageUrl
      });
      setShowShopModal(false);
    }
  };

  const dispatchRoute = [
    { stop: 1, name: 'Valued Customer', phone: '+44 7700 900077', address: 'Flat 4B, Regency House, Marylebone NW1 6XE', time: '12:35 PM', items: 'Moong Dal Soup, Maa Ki Dal, Basmati Rice, Chaas', status: 'On Way' },
    { stop: 2, name: 'Corporate Account', phone: '+44 7911 123456', address: 'Floor 4, 100 Bishopsgate, London EC2N 4AG', time: '12:55 PM', items: 'Chicken Handi, Phulka Basket, Nimbu Pani', status: 'Pending' },
    { stop: 3, name: 'Private Residence', phone: '+44 7800 334455', address: 'Villa 12, Pali Hill, London SW1A 1AA', time: '01:15 PM', items: 'Palak Paneer, Jeera Aloo, Aam Panna', status: 'Pending' },
  ];

  const totalRevenueToday = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6 pb-28 lg:pb-12">
      
      {/* Admin Header */}
      <div className="bg-ink-900 text-white p-4 sm:p-8 rounded-3xl shadow-card-elevated border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Owner Full Operations &amp; Status Control</span>
              <span className="sm:hidden">Owner Cockpit</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Kitchen Cockpit
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm font-medium mt-1 hidden sm:block">
              Managed by Master Chef Team (Kitchen Operations) &amp; Express Delivery Partner.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="bg-white/10 px-3 py-2 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Revenue</span>
              <span className="font-heading font-extrabold text-lg text-saffron-400">£{totalRevenueToday.toFixed(2)}</span>
            </div>
            <div className="bg-white/10 px-3 py-2 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Capacity</span>
              <span className="font-heading font-extrabold text-lg text-fresh-400">{bookings.length}/{dailyOrderLimit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs — scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'orders', label: 'Orders', icon: Truck },
          { id: 'liveMap', label: 'Live Map', icon: MapIcon },
          { id: 'shops', label: 'Kitchens', icon: Store },
          { id: 'prep', label: 'Prep', icon: ClipboardList },
          { id: 'menu', label: 'Menu', icon: ChefHat },
          { id: 'promotion', label: 'Promo', icon: Megaphone },
          { id: 'capacity', label: 'Capacity', icon: Sliders },
          { id: 'riders', label: 'Riders', icon: Bike },
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'disputes', label: 'Disputes', icon: AlertOctagon },
          { id: 'settlements', label: 'Finance', icon: DollarSign },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'admins', label: 'Admins', icon: ShieldCheck }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-heading font-bold text-xs transition-all whitespace-nowrap shrink-0 ${
              activeTab === id ? 'bg-brand-500 text-white shadow-md' : 'bg-white text-stone-600 border border-cream-200 hover:bg-cream-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'analytics' && <AnalyticsTab />}
      { activeTab === 'riders' && <RidersTab /> }
      { activeTab === 'customers' && <UsersTab /> }
      { activeTab === 'disputes' && <DisputesTab /> }
      { activeTab === 'settlements' && <SettlementsTab /> }
      { activeTab === 'settings' && <SettingsTab /> }
      { activeTab === 'admins' && <AdminsTab /> }
      { activeTab === 'liveMap' && <LiveMapTab /> }

      {/* TAB 1: ORDER STATUS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-500" />
              <span>Live Customer Orders & Status Dispatch</span>
            </h3>
            <span className="text-xs text-stone-400 font-medium">Change order statuses live</span>
          </div>

          <div className="space-y-4">
            {bookings.map((b) => (
              <div 
                key={b.id}
                className="bg-white rounded-3xl border border-cream-200 p-4 sm:p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cream-200">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-extrabold text-base sm:text-lg text-ink-900">{b.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        b.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        b.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        b.status === 'On Way' ? 'bg-blue-100 text-blue-700' :
                        b.status === 'Cooking' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 font-medium truncate">{b.address} · {b.deliveryDate}</p>
                  </div>
                  <span className="font-heading font-extrabold text-xl text-brand-600 shrink-0">£{b.totalPrice.toFixed(2)}</span>
                </div>

                {/* Status update buttons — horizontal scroll on mobile */}
                <div className="space-y-2">
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Update Status:</span>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {['Confirmed', 'Cooking', 'On Way', 'Delivered', 'Cancelled'].map((st) => (
                      <button
                        key={st}
                        onClick={() => updateOrderStatus(b.id, st)}
                        className={`px-3 py-2 rounded-xl font-heading font-bold text-xs transition-all whitespace-nowrap shrink-0 ${
                          b.status === st
                            ? 'bg-ink-900 text-white shadow-sm ring-2 ring-saffron-400'
                            : 'bg-cream-100 hover:bg-cream-200 text-stone-700 border border-cream-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: KITCHEN PREP SHEET */}
      {activeTab === 'prep' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-saffron-500" />
              <span>Kitchen Prep Sheet</span>
            </h3>
            <button 
              onClick={() => setCutoffTriggered(!cutoffTriggered)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${cutoffTriggered ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-700'}`}
            >
              {cutoffTriggered ? 'Cutoff Triggered (Locked)' : 'Trigger Daily Cutoff'}
            </button>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4">
            <p className="text-xs text-stone-500">Aggregated quantities for today's orders to assist the kitchen staff.</p>
            <div className="space-y-2">
              {menuItems.slice(0, 5).map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-cream-50 rounded-xl border border-cream-200">
                  <span className="font-bold text-stone-700 text-sm">{item.name}</span>
                  <span className="font-extrabold text-brand-600 text-lg">x{Math.floor(Math.random() * 20) + 5}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SHOPS MANAGEMENT */}
      {activeTab === 'shops' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-saffron-500" />
              <span>Kitchen / Shop Management</span>
            </h3>
            <button
              onClick={openAddShop}
              className="px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Kitchen</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shops.map(shop => (
              <div key={shop.id} className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${shop.isActive ? 'bg-white border-cream-200' : 'bg-stone-100 border-stone-200 opacity-70'}`}>
                <div className="flex items-start gap-4">
                  <SafeImage src={shop.imageUrl} alt={shop.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" placeholderClass="w-16 h-16 rounded-2xl" />
                  <div className="flex-1">
                    <h4 className="font-heading font-extrabold text-lg text-ink-900">{shop.name}</h4>
                    <p className="text-xs text-stone-500 font-medium">{shop.cuisine} · {shop.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-700">⭐ {shop.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-cream-100 mt-4">
                  <button onClick={() => toggleShopActive(shop.id)} className={`flex items-center gap-1 text-xs font-bold ${shop.isActive ? 'text-fresh-600' : 'text-stone-400'}`}>
                    {shop.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    <span>{shop.isActive ? 'Active' : 'Inactive'}</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditShop(shop)} className="p-2 rounded-xl bg-cream-100 hover:bg-brand-50 text-stone-600 hover:text-brand-600 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteShop(shop.id)} className="p-2 rounded-xl bg-cream-100 hover:bg-red-50 text-stone-600 hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MENU FULL CRUD */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-saffron-500" />
                <span>Menu Dish Management</span>
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={selectedAdminShopId} 
                onChange={(e) => setSelectedAdminShopId(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-white border border-cream-200 text-xs font-bold text-stone-700 outline-none"
              >
                <option value="all">All Kitchens</option>
                {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button
                onClick={openAddModal}
                className="px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Dish</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.filter(item => selectedAdminShopId === 'all' || item.shopId === selectedAdminShopId).map((dish) => {
              const shop = shops.find(s => s.id === dish.shopId);
              return (
              <div
                key={dish.id}
                className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                  dish.available ? 'bg-white border-cream-200 shadow-sm' : 'bg-stone-100/70 border-stone-200 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <SafeImage src={dish.imageUrl} alt={dish.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" placeholderClass="w-14 h-14 rounded-2xl" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-saffron-600 font-bold uppercase tracking-wider">{dish.category}</span>
                      </div>
                      <h4 className="font-heading font-extrabold text-sm text-ink-900 leading-snug truncate">{dish.name}</h4>
                      <p className="text-[10px] font-bold text-stone-400 mt-0.5">{shop?.name || 'Unknown Shop'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-stone-500 line-through">£{dish.basePrice?.toFixed(2)}</span>
                        <span className="font-heading font-extrabold text-brand-600 text-sm">£{dish.price?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-cream-100 mt-3">
                  <button
                    onClick={() => toggleMenuItemAvailability(dish.id)}
                    className={`flex items-center gap-1 text-xs font-bold ${dish.available ? 'text-fresh-600' : 'text-stone-400'}`}
                  >
                    {dish.available ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    <span>{dish.available ? 'Available' : 'Sold Out'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(dish)}
                      className="p-2 rounded-xl bg-cream-100 hover:bg-brand-50 text-stone-600 hover:text-brand-600 transition-colors"
                      title="Edit Dish"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMenuItem(dish.id)}
                      className="p-2 rounded-xl bg-cream-100 hover:bg-red-50 text-stone-600 hover:text-red-600 transition-colors"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'promotion' && (
        <PromotionTab
          promotionBanners={promotionBanners}
          addPromotionBanner={addPromotionBanner}
          updatePromotionBanner={updatePromotionBanner}
          deletePromotionBanner={deletePromotionBanner}
        />
      )}

      {/* TAB 3: DAILY CAPACITY LIMIT CONTROL */}
      {activeTab === 'capacity' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card-elevated space-y-6 max-w-2xl">
          <div>
            <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-500" />
              <span>Daily Order Capacity Limit Control</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Set the maximum number of tiffin box orders our kitchen can prepare in a single day.
            </p>
          </div>

          <div className="space-y-4 p-5 rounded-2xl bg-cream-50 border border-cream-200">
            <label className="text-xs font-bold text-stone-700 block">Maximum Orders Per Day</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={dailyOrderLimit}
                onChange={(e) => setDailyOrderLimit(parseInt(e.target.value) || 20)}
                className="w-32 px-4 py-3 rounded-xl bg-white border border-cream-300 font-heading font-extrabold text-xl text-ink-900 text-center"
              />
              <span className="text-xs font-semibold text-stone-500">Orders / Day</span>
            </div>

            <div className="pt-2">
              <span className="text-xs text-stone-400 block mb-1 font-medium">Quick Limit Presets:</span>
              <div className="flex flex-wrap gap-2">
                {[15, 20, 25, 30, 40].map((limitVal) => (
                  <button
                    key={limitVal}
                    onClick={() => setDailyOrderLimit(limitVal)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      dailyOrderLimit === limitVal ? 'bg-brand-500 text-white shadow-sm' : 'bg-white text-stone-600 border border-cream-200'
                    }`}
                  >
                    {limitVal} Orders
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* TAB: DELIVERY TRACKING */}
      {activeTab === 'delivery' && (
        <div className="space-y-4">
          <h3 className="font-heading text-xl font-extrabold text-ink-900 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-brand-500" />
            <span>Delivery Tracking & Routes</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.filter(b => b.status === 'On Way' || b.status === 'Cooking' || b.status === 'Confirmed').map(b => (
              <div key={b.id} className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-ink-900 text-sm mb-1">{b.id}</h4>
                  <p className="text-xs text-stone-500 font-medium mb-2">{b.address}</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.status === 'On Way' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                    {b.status}
                  </span>
                </div>
                <button 
                  onClick={() => setShowMapModal(b.id)}
                  className="mt-4 w-full py-2 bg-cream-100 hover:bg-brand-500 hover:text-white text-stone-700 font-bold text-xs rounded-xl transition-all"
                >
                  View Route on Map
                </button>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* ADD / EDIT DISH MODAL FORM */}
      {(showAddModal || editingDish) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={showAddModal ? handleSaveAdd : handleSaveEdit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h4 className="font-heading font-extrabold text-xl text-ink-900">
                {showAddModal ? 'Add New Dish to Menu' : `Edit Dish: ${editingDish?.name}`}
              </h4>
              <button 
                type="button" 
                onClick={() => { setShowAddModal(false); setEditingDish(null); }}
                className="p-1 text-stone-400 hover:text-ink-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Course Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Kitchen / Shop</label>
                  <select
                    value={formShopId}
                    onChange={(e) => setFormShopId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                  >
                    {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Base Cost (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formBasePrice}
                    onChange={(e) => setFormBasePrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Display Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium text-brand-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Calories</label>
                  <input
                    type="number"
                    value={formCalories}
                    onChange={(e) => setFormCalories(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Diet Type</label>
                  <select
                    value={formDiet}
                    onChange={(e) => setFormDiet(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="jain">Jain</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Spice Level</label>
                  <select
                    value={formSpice}
                    onChange={(e) => setFormSpice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Spicy">Spicy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                ></textarea>
              </div>

              {/* Image Upload Field */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">Dish Image</label>

                {/* Preview */}
                <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 mb-2">
                  {formImageUrl ? (
                    <img
                      key={formImageUrl}
                      src={formImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {/* Fallback placeholder */}
                  <div
                    className="absolute inset-0 flex-col items-center justify-center text-stone-400"
                    style={{ display: formImageUrl ? 'none' : 'flex' }}
                  >
                    <ChefHat className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-medium">No image selected</span>
                  </div>
                  {/* Clear button */}
                  {formImageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Upload button */}
                <input
                  ref={menuImageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml,image/avif,image/bmp,image/*"
                  className="hidden"
                  onChange={handleMenuImageUpload}
                />
                <button
                  type="button"
                  onClick={() => menuImageInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-bold text-xs hover:bg-brand-100 transition-colors flex items-center justify-center gap-2 mb-2"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  Upload Image (PNG, JPG, GIF, WebP, SVG, AVIF…)
                </button>

                {/* OR URL fallback */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-px bg-cream-200" />
                  <span className="text-[10px] text-stone-400 font-medium">or paste a URL</span>
                  <div className="flex-1 h-px bg-cream-200" />
                </div>
                <input
                  type="text"
                  placeholder="https://example.com/food.jpg"
                  value={formImageUrl.startsWith('blob:') ? '' : formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-cream-200">
              <button
                type="button"
                onClick={() => { setShowAddModal(false); setEditingDish(null); }}
                className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-500 text-white font-heading font-bold text-xs shadow-md"
              >
                {showAddModal ? 'Save New Dish' : 'Update Dish'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD / EDIT SHOP MODAL FORM */}
      {(showShopModal || editingShop) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveShop}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h4 className="font-heading font-extrabold text-xl text-ink-900">
                {showShopModal ? 'Add New Kitchen' : `Edit Kitchen: ${editingShop?.name}`}
              </h4>
              <button 
                type="button" 
                onClick={() => { setShowShopModal(false); setEditingShop(null); }}
                className="p-1 text-stone-400 hover:text-ink-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Kitchen Name</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Cuisine Type</label>
                  <input
                    type="text"
                    required
                    value={shopCuisine}
                    onChange={(e) => setShopCuisine(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Location / Area</label>
                  <input
                    type="text"
                    required
                    value={shopLocation}
                    onChange={(e) => setShopLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={shopRating}
                    onChange={(e) => setShopRating(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Delivery Time (mins)</label>
                  <input
                    type="text"
                    required
                    value={shopDeliveryTime}
                    onChange={(e) => setShopDeliveryTime(e.target.value)}
                    placeholder="e.g. 30-45"
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  required
                  value={shopImageUrl}
                  onChange={(e) => setShopImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-cream-200">
              <button
                type="button"
                onClick={() => { setShowShopModal(false); setEditingShop(null); }}
                className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-500 text-white font-heading font-bold text-xs shadow-md"
              >
                {showShopModal ? 'Save Kitchen' : 'Update Kitchen'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MOCK MAP MODAL */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fade-in flex flex-col">
            <div className="p-4 border-b border-cream-200 flex justify-between items-center">
              <h4 className="font-heading font-extrabold text-lg text-ink-900">Live Delivery Route - {showMapModal}</h4>
              <button onClick={() => setShowMapModal(null)} className="text-stone-400 hover:text-ink-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-80 bg-stone-200 relative">
              {/* Mock Map Image */}
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=London,UK&zoom=12&size=800x400&maptype=roadmap&markers=color:blue%7Clabel:K%7C51.5200,-0.1000&markers=color:red%7Clabel:D%7C51.5074,-0.1278&path=color:0x0000ff|weight:5|51.5200,-0.1000|51.5074,-0.1278&key=YOUR_API_KEY')] bg-cover bg-center opacity-80"></div>
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex justify-between items-center border border-white/20">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Driver</span>
                  <p className="font-bold text-sm text-ink-900">Alex Rider</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">ETA</span>
                  <p className="font-bold text-sm text-brand-600">12 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
