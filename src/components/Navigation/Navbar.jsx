import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  UtensilsCrossed, 
  User, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  ShoppingBag,
  Home,
  LogIn
} from 'lucide-react';
import { NotificationBell } from '../Notifications/NotificationBell';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { 
    currentScreen, 
    navigateTo, 
    goBack, 
    canGoBack, 
    isAdminMode, 
    setIsAdminMode,
    isLoggedIn,
    user,
    filledCount
  } = useApp();
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const getAssetPath = (path) => {
    if (path && path.startsWith('/')) {
      return `.${path}`;
    }
    return path;
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'builder': return 'Custom Lunchbox Builder';
      case 'calendar': return 'Delivery Schedule';
      case 'menu': return 'Homestyle UK Menu';
      case 'bookings': return 'My Orders';
      case 'checkout': return 'Checkout';
      case 'confirmation': return 'Order Placed';
      case 'profile': return 'Customer Profile';
      case 'admin': return 'Owner Cockpit';
      case 'login': return 'Account Sign In';
      case 'register': return 'Create Account';
      default: return null;
    }
  };

  const title = getScreenTitle();

  return (
    <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-cream-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Section: Brand or Back Button */}
        <div className="flex items-center gap-3">
          {canGoBack && currentScreen !== 'home' ? (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-ink-900 border border-cream-200 shadow-sm hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all font-medium text-sm group"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-brand-600 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
          ) : (
            <div 
              onClick={() => navigateTo('home', true)}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-glow group-hover:scale-105 transition-transform border border-cream-200">
                <img
                  src={getAssetPath('/source/683754474_17858463000690543_8878656858934875981_n.jpg')}
                  alt="Jaffna Roots"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-lg text-ink-900 leading-tight group-hover:text-brand-600 transition-colors">
                  Jaffna Roots
                </h1>
                <p className="text-xs text-brand-600 font-medium tracking-wide flex items-center gap-1">
                  <span>Homestyle Kitchen</span>
                  <span className="w-1 h-1 rounded-full bg-saffron-500 inline-block"></span>
                  <span className="text-stone-500">Fresh Daily</span>
                </p>
              </div>
            </div>
          )}

          {title && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-cream-300">
              <span className="text-xs sm:text-sm font-bold text-ink-900 font-heading tracking-tight">{title}</span>
            </div>
          )}
        </div>

        {/* Center/Right Section */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-cream-200 text-xs text-stone-600 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-brand-500" />
            <span>Postcode <strong className="text-ink-900 font-semibold">{user.pincode}</strong></span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 bg-white/80 p-1 rounded-full border border-cream-200 shadow-xs">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentScreen === 'home' ? 'bg-brand-500 text-white shadow-sm' : 'text-stone-600 hover:text-ink-900 hover:bg-cream-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => navigateTo('builder')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentScreen === 'builder' ? 'bg-brand-500 text-white shadow-sm' : 'text-stone-600 hover:text-ink-900 hover:bg-cream-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
              <span>Builder</span>
              {filledCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-saffron-500 text-ink-900 text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {filledCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigateTo('calendar')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentScreen === 'calendar' ? 'bg-brand-500 text-white shadow-sm' : 'text-stone-600 hover:text-ink-900 hover:bg-cream-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </button>
            <button
              onClick={() => navigateTo('bookings')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentScreen === 'bookings' ? 'bg-brand-500 text-white shadow-sm' : 'text-stone-600 hover:text-ink-900 hover:bg-cream-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>My Orders</span>
            </button>
          </nav>

          {/* Auth Nav Links / Profile */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold transition-all border bg-white text-stone-700 border-cream-300 hover:bg-stone-50"
              title="Toggle Language"
            >
              {i18n.language === 'ta' ? 'TA' : 'EN'}
            </button>
            <button
              onClick={() => navigateTo('login')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                currentScreen === 'login' || currentScreen === 'register'
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white text-stone-700 border-cream-300 hover:bg-stone-50'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-brand-500" />
              <span className="hidden sm:inline">Sign In</span>
            </button>

            <button
              onClick={() => {
                const nextAdmin = !isAdminMode;
                setIsAdminMode(nextAdmin);
                navigateTo(nextAdmin ? 'admin' : 'home', true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isAdminMode 
                  ? 'bg-ink-900 text-saffron-400 border-ink-900 shadow-sm' 
                  : 'bg-white text-stone-700 border-cream-300 hover:bg-stone-50'
              }`}
              title="Switch between Customer app & Owner Cockpit"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isAdminMode ? 'text-saffron-400' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">{isAdminMode ? 'Owner Mode' : 'Admin'}</span>
            </button>

            {isLoggedIn && <NotificationBell />}

            <button
              onClick={() => navigateTo('profile')}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all border-2 ${
                currentScreen === 'profile'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 shadow-sm scale-105'
                  : 'border-cream-300 bg-white text-stone-700 hover:border-brand-300'
              }`}
              title="Profile & Preferences"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
