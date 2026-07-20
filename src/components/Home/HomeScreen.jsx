import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  Leaf,
  Calendar,
  ChefHat,
  MapPin,
  Mail,
  Phone,
  Clock,
  Shield,
  Star,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

import { SafeImage } from '../Common/SafeImage';
import { useTranslation } from 'react-i18next';

// Main HomeScreen Component

export const HomeScreen = () => {
  const { t } = useTranslation();
  const { 
    navigateTo, 
    promotionBanners,
    shops,
    menuItems,
    selectShop,
    addToSlot,
  } = useApp();
  const [scrollY, setScrollY] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const heroRef = useRef(null);

  const getAssetPath = (path) => {
    if (path && path.startsWith('/')) {
      return `.${path}`;
    }
    return path;
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (promotionBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % promotionBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [promotionBanners.length]);

  const activeBanners = promotionBanners.filter(b => b.active !== false);
  const promotionBanner = activeBanners[currentBannerIndex] || activeBanners[0] || null;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ═══════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
      ═══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#FAFAF8] via-cream-100 to-cream-200 px-4 sm:px-8 pt-8 pb-24 lg:pt-0 lg:pb-0"
      >
        {/* Parallax Bg Blob */}
        <div
          className="absolute -top-20 -right-20 w-[40rem] h-[40rem] bg-saffron-400/20 rounded-full blur-[100px] pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.25}px)` }}
        />
        <div
          className="absolute bottom-0 -left-20 w-[30rem] h-[30rem] bg-brand-400/15 rounded-full blur-[80px] pointer-events-none"
          style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
        />

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-5 sm:space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-cream-200 shadow-sm">
              <div className="w-7 h-7 rounded-xl overflow-hidden">
                <img src={getAssetPath('/source/683754474_17858463000690543_8878656858934875981_n.jpg')} alt="Jaffna Roots" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-ink-900">{t('Welcome')} - Jaffna Roots</span>
              <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">Gatwick &amp; South West London</span>
            </div>

            <div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-extrabold text-ink-900 leading-[1.05] tracking-tight">
                Authentic Roots,{' '}
                <span className="relative inline-block">
                  <span className="text-brand-600">Made with</span>
                  <br />
                  <span className="text-saffron-500">Love.</span>
                </span>
              </h1>
              <p className="text-stone-600 text-sm sm:text-lg font-medium leading-relaxed max-w-xl mt-4">
                Jaffna Roots is one of the finest food delivery services in Gatwick and suburbs. We deliver freshly cooked food in neat, insulated, reusable metal dabbas.
              </p>
            </div>

            {/* Mobile Food Animation Strip — visible on small screens only */}
            <div className="lg:hidden flex items-center justify-center gap-2 py-2">
              <SafeImage
                src={getAssetPath('/source/fe3c221084c0a6dd3319ac02da655101-removebg-preview.png')}
                alt="Tiffin Box"
                className="w-20 h-20 object-contain drop-shadow-xl animate-[float_7s_ease-in-out_infinite_2s]"
                placeholderClass="w-20 h-20 rounded-2xl"
              />
              <SafeImage
                src={getAssetPath('/source/delicious-indian-meal-with-biryani-rice-photo-removebg-preview.png')}
                alt="Biryani"
                className="w-32 h-32 object-contain drop-shadow-2xl animate-[float_5s_ease-in-out_infinite] -mt-4"
                placeholderClass="w-32 h-32 rounded-full"
              />
              <SafeImage
                src={getAssetPath('/source/images-removebg-preview.png')}
                alt="Indian Curry"
                className="w-20 h-20 object-contain drop-shadow-xl animate-[float_6s_ease-in-out_infinite_1s]"
                placeholderClass="w-20 h-20 rounded-2xl"
              />
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <button
                onClick={() => navigateTo('shops')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-extrabold text-base shadow-xl shadow-brand-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Build Your Lunchbox</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigateTo('shops')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white border border-cream-300 hover:border-brand-400 text-ink-900 font-heading font-bold text-base shadow-sm transition-all text-center"
              >
                Explore Menu
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 sm:gap-4 pt-1">
              {[
                { icon: <Shield className="w-4 h-4" />, text: '100% Fresh Daily' },
                { icon: <Star className="w-4 h-4" />, text: 'Eco Metal Dabbas' },
                { icon: <Clock className="w-4 h-4" />, text: 'Delivered 11am–1pm' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-white border border-cream-200 px-3 py-2 rounded-full shadow-sm">
                  <span className="text-brand-500">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero Food Collage — desktop only */}
          <div
            className="hidden lg:flex relative items-center justify-center h-[520px]"
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          >
            {/* Main large dish */}
            <div className="absolute inset-0 flex items-center justify-center">
              <SafeImage
                src={getAssetPath('/source/delicious-indian-meal-with-biryani-rice-photo-removebg-preview.png')}
                alt="Biryani"
                className="w-[420px] h-[420px] object-contain drop-shadow-2xl animate-[float_5s_ease-in-out_infinite]"
                placeholderClass="w-80 h-80 rounded-full"
              />
            </div>
            {/* Floating small dish top-right */}
            <div
              className="absolute top-4 right-0"
              style={{ transform: `translateY(${scrollY * -0.12}px)` }}
            >
              <SafeImage
                src={getAssetPath('/source/images-removebg-preview.png')}
                alt="Indian Curry"
                className="w-36 h-36 object-contain drop-shadow-xl animate-[float_6s_ease-in-out_infinite_1s]"
                placeholderClass="w-28 h-28 rounded-2xl"
              />
            </div>
            {/* Floating tiffin bottom-left */}
            <div
              className="absolute bottom-4 left-0"
              style={{ transform: `translateY(${scrollY * 0.12}px)` }}
            >
              <SafeImage
                src={getAssetPath('/source/fe3c221084c0a6dd3319ac02da655101-removebg-preview.png')}
                alt="Tiffin Box"
                className="w-32 h-32 object-contain drop-shadow-xl animate-[float_7s_ease-in-out_infinite_2s]"
                placeholderClass="w-24 h-24 rounded-2xl"
              />
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-12 rounded-full border-2 border-dashed border-brand-500/20 animate-spin" style={{ animationDuration: '30s' }} />
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-stone-400 animate-bounce">
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-stone-400 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 1.5 — FEATURED KITCHENS
      ═══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-ink-900 tracking-tight mb-2">
                {t('Popular Kitchens')}
              </h2>
              <p className="text-stone-500 text-sm font-medium">Authentic home cooks near you.</p>
            </div>
            <button
              onClick={() => navigateTo('shops')}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-cream-50 text-ink-900 font-bold text-sm hover:bg-cream-100 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {shops.filter(s => s.isActive).slice(0, 3).map(shop => (
              <div
                key={shop.id}
                onClick={() => selectShop(shop.id)}
                className="group cursor-pointer bg-white rounded-[2rem] border border-cream-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-300 transition-all duration-500 flex flex-col"
              >
                {/* Banner */}
                <div className="relative h-40 overflow-hidden bg-stone-200">
                  <img src={getAssetPath(shop.bannerUrl)} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => e.target.style.display = 'none'} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div className="w-14 h-14 rounded-xl border-2 border-white overflow-hidden bg-white shadow-lg shrink-0">
                      <img src={getAssetPath(shop.logoUrl)} alt={shop.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-white font-bold text-xs">
                      <Star className="w-3 h-3 text-saffron-400 fill-saffron-400" />
                      <span>{shop.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-1 group-hover:text-brand-600 transition-colors">{shop.name}</h3>
                  <p className="text-brand-500 text-xs font-bold uppercase tracking-wider mb-3">{shop.cuisineType}</p>
                  <p className="text-stone-500 text-sm font-medium line-clamp-2 mb-4">{shop.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-cream-100 flex items-center justify-between text-xs font-semibold text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-400" />
                      <span>{shop.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-saffron-400" />
                      <span>{shop.deliveryArea}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigateTo('shops')}
            className="sm:hidden w-full mt-8 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-cream-50 text-ink-900 font-bold text-sm hover:bg-cream-100 transition-colors"
          >
            <span>View All Kitchens</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — PROMOTION BANNER (Full Width)
      ═══════════════════════════════════════════════ */}
      {promotionBanner && (
        <section className="w-full py-0 overflow-hidden relative">
          <div className="relative w-full min-h-[280px] sm:min-h-[380px] bg-gradient-to-r from-brand-700 via-brand-600 to-saffron-600 overflow-hidden flex items-center">
            {/* Bg decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-1/2 -right-1/4 w-[40rem] h-[40rem] bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-1/2 -left-1/4 w-[30rem] h-[30rem] bg-saffron-400/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center gap-8 py-10 sm:py-14">
              {/* Text side */}
              <div className="flex-1 text-white space-y-4 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-[11px] font-bold uppercase tracking-widest text-white/90">
                  <Sparkles className="w-3.5 h-3.5 text-saffron-300" />
                  <span>Today's Special</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                  {promotionBanner.title}
                </h2>
                <p className="text-white/80 text-sm sm:text-base font-medium max-w-lg">
                  {promotionBanner.link}
                </p>
                <button
                  onClick={() => navigateTo('shops')}
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3.5 rounded-2xl bg-white text-brand-700 font-heading font-extrabold text-sm shadow-xl hover:bg-saffron-400 hover:text-ink-900 transition-all"
                >
                  <span>Claim Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Image side */}
              <div className="flex-shrink-0 w-full sm:w-72 lg:w-96 h-48 sm:h-64 rounded-3xl overflow-hidden shadow-2xl bg-white/10">
                {promotionBanner.imageUrl ? (
                  promotionBanner.imageUrl.endsWith('.mp4') ? (
                    <video
                      src={promotionBanner.imageUrl}
                      autoPlay loop muted playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <SafeImage
                      src={promotionBanner.imageUrl}
                      alt="Promotion"
                      className="w-full h-full object-cover"
                      placeholderClass="w-full h-full"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/50">
                    <ChefHat className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Carousel indicators */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentBannerIndex ? 'bg-white scale-125' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION 3 — WHO WE ARE
      ═══════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-8 bg-white border-y border-cream-200 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className="relative hidden md:block"
            style={{ transform: `translateY(${(scrollY - 900) * -0.08}px)` }}
          >
            <div className="absolute -inset-4 bg-saffron-400/10 rounded-[2.5rem] -rotate-3" />
            <video
              src={getAssetPath('/source/product_transition.mp4')}
              autoPlay
              loop
              muted
              playsInline
              className="relative z-10 w-full aspect-[4/3] object-cover rounded-[2rem] shadow-2xl"
            />
            {/* Floating stat */}
            <div className="absolute -bottom-4 -right-4 z-20 bg-white rounded-2xl p-4 shadow-xl border border-cream-200">
              <span className="block font-heading text-3xl font-extrabold text-brand-600">£25</span>
              <span className="block text-[11px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Dabba Deposit</span>
            </div>
          </div>
          {/* Mobile Video without parallax */}
          <div className="relative md:hidden mb-8 mt-12 sm:mt-0">
            <div className="absolute -inset-4 bg-saffron-400/10 rounded-[2.5rem] -rotate-3" />
            <video
              src={getAssetPath('/source/product_transition.mp4')}
              autoPlay
              loop
              muted
              playsInline
              className="relative z-10 w-full aspect-[4/3] object-cover rounded-[2rem] shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-2 z-20 bg-white rounded-2xl p-4 shadow-xl border border-cream-200">
              <span className="block font-heading text-3xl font-extrabold text-brand-600">£25</span>
              <span className="block text-[11px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Dabba Deposit</span>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <div className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                Our Promise
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight leading-tight mb-4">
                Homemade Quality, <br />Zero Compromise.
              </h2>
              <p className="text-stone-600 font-medium leading-relaxed text-sm sm:text-base">
                Our promise is to deliver healthy food made with love. Every meal is freshly prepared that morning using authentic ground spices and seasonal vegetables — no shortcuts, no preservatives.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <Calendar className="w-5 h-5" />,
                  title: 'Pre-Book Your Meals',
                  body: 'Purchase any number of lunchboxes in advance and book them on your calendar. Minimum 24 hours advance booking required. Delivered between 11am and 1pm.'
                },
                {
                  icon: <Star className="w-5 h-5" />,
                  title: 'Our Metal Dabba Policy',
                  body: 'We charge a one-time £25 deposit for our special steel lunchboxes. Each delivery, we exchange the dabba for a fresh one. Return any time to get £20 back (£5 admin charge applies).'
                },
                {
                  icon: <Leaf className="w-5 h-5" />,
                  title: 'Eco-Friendly by Design',
                  body: 'Reusable steel dabbas mean zero single-use plastic. When you order from us, you contribute to a cleaner environment — one tiffin at a time.'
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-cream-50 border border-cream-100 hover:border-brand-200 transition-colors">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-ink-900 text-base mb-1">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — QUICK ACTIONS
      ═══════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight mb-3">
              Start Your Order Today
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium">Your homestyle meal, just a few taps away.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Sparkles />, label: 'Build Lunchbox', sub: 'Custom combos', screen: 'shops', color: 'brand' },
              { icon: <Calendar />, label: 'Schedule', sub: 'Monthly planner', screen: 'calendar', color: 'saffron' },
              { icon: <ChefHat />, label: 'Explore Menu', sub: 'Indian recipes', screen: 'shops', color: 'fresh' },
              { icon: <ShoppingBag />, label: 'My Orders', sub: 'Track status', screen: 'bookings', color: 'indigo' },
            ].map(item => (
              <button
                key={item.screen}
                onClick={() => navigateTo(item.screen)}
                className={`group cursor-pointer bg-white p-5 rounded-3xl border border-cream-200 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 text-left`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-${item.color}-50 text-${item.color}-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h4 className="font-heading font-extrabold text-base text-ink-900 group-hover:text-brand-600 transition-colors">{item.label}</h4>
                <p className="text-xs text-stone-500 mt-1 font-medium">{item.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════
          SECTION 4.5 — BROWSE BY CUISINE
      ══════════════════════════════════════════════╗ */}
      <section className="py-16 px-4 sm:px-8 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink-900">Browse by Cuisine</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Sri Lankan', emoji: '🍛', count: 12, bg: 'from-saffron-100 to-saffron-200' },
              { name: 'North Indian', emoji: '🪵', count: 8, bg: 'from-brand-100 to-brand-200' },
              { name: 'Keralan', emoji: '🥥', count: 6, bg: 'from-fresh-100 to-fresh-200' },
              { name: 'Healthy Bowls', emoji: '🥗', count: 5, bg: 'from-stone-100 to-stone-200' },
            ].map(c => (
              <button
                key={c.name}
                onClick={() => navigateTo('menu')}
                className={`bg-gradient-to-br ${c.bg} rounded-3xl p-5 text-left hover:scale-105 transition-transform`}
              >
                <span className="text-3xl block mb-2">{c.emoji}</span>
                <p className="font-heading font-extrabold text-sm text-ink-900">{c.name}</p>
                <p className="text-xs text-stone-500">{c.count} dishes</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════
          SECTION 4.6 — TOP RATED KITCHENS
      ══════════════════════════════════════════════╗ */}
      <section className="py-10 px-4 sm:px-8 bg-white border-y border-cream-200">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink-900">⭐ Top Rated Kitchens</h2>
            <button onClick={() => navigateTo('shops')} className="text-xs font-bold text-brand-600 hover:underline">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {[...shops].sort((a, b) => b.rating - a.rating).slice(0, 3).map(shop => (
              <button
                key={shop.id}
                onClick={() => selectShop(shop.id)}
                className="shrink-0 w-64 bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm hover:shadow-card-elevated transition-all text-left"
              >
                <div className="h-28 bg-stone-100 relative overflow-hidden">
                  <img src={shop.bannerUrl} alt={shop.name} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-white/95 rounded-full shadow-sm">
                    <span className="text-[10px] font-extrabold text-ink-900">⭐ {shop.rating}</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-heading font-extrabold text-sm text-ink-900">{shop.name}</p>
                  <p className="text-xs text-stone-400">{shop.cuisineType}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════
          SECTION 4.7 — MOST ORDERED THIS WEEK
      ══════════════════════════════════════════════╗ */}
      <section className="py-10 px-4 sm:px-8 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink-900">🔥 Most Ordered This Week</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {menuItems.slice(0, 4).map(item => (
              <button
                key={item.id}
                onClick={() => { addToSlot(item); navigateTo('builder'); }}
                className="shrink-0 w-48 bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm hover:shadow-card-elevated transition-all text-left"
              >
                <div className="h-24 bg-stone-100 relative overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                </div>
                <div className="p-3">
                  <p className="font-heading font-extrabold text-xs text-ink-900 truncate">{item.name}</p>
                  <p className="text-xs text-brand-600 font-bold">£{item.price.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════
          SECTION 5 — MAP & CONTACT
      ══════════════════════════════════════════════╗ */}
      <section className="py-24 px-4 sm:px-8 bg-white border-t border-cream-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-fresh-50 text-fresh-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              Delivery Zones
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight mb-3">
              Find Us & Contact
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium max-w-xl mx-auto">
              Based in New Malden, we serve South West London — Molesey, Esher, Surbiton, New Malden, Worcester Park, Morden, and Mitcham.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map — takes 2 cols */}
            <div className="lg:col-span-2 bg-stone-100 rounded-3xl overflow-hidden h-[360px] sm:h-[440px] relative shadow-card-elevated border border-cream-200 group">
              <iframe
                title="Healthy Lunchbox Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2488.8!2d-0.2488!3d51.3948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487608f28b3a43a9%3A0x0!2s111A%20Manor%20Dr%20N%2C%20New%20Malden%20KT3%205PD%2C%20UK!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full transition-transform duration-700 group-hover:scale-[1.01]"
              />
              {/* Address overlay badge */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-cream-100 p-4 max-w-[260px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-heading font-extrabold text-ink-900 text-sm leading-tight">111A Manor Dr N</p>
                    <p className="text-[11px] text-stone-500 font-medium">New Malden, KT3 5PD, UK</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="flex flex-col gap-4">
              <div className="bg-ink-900 rounded-3xl p-6 text-white flex-1 shadow-xl space-y-5">
                <h3 className="font-heading font-extrabold text-xl">{t('Contact Us')}</h3>

                <div className="space-y-4">
                  <a
                    href="mailto:admin@jaffnaroots.co.uk"
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Email Admin</p>
                      <p className="text-sm font-bold text-white break-all">admin@jaffnaroots.co.uk</p>
                    </div>
                  </a>

                  <a
                    href="tel:+447000000000"
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-saffron-500 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Call Us</p>
                      <p className="text-sm font-bold text-white">+44 700 000 0000</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/10">
                    <div className="w-10 h-10 rounded-xl bg-fresh-500 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Delivery Hours</p>
                      <p className="text-sm font-bold text-white">11:00 AM – 1:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigateTo('shops')}
                className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-extrabold text-base shadow-xl shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>{t('Order Now')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7 — DISCOVERY
      ═══════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 py-16 bg-cream-50 space-y-12 max-w-7xl mx-auto">
        
        {/* Browse by Cuisine */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-extrabold text-ink-900">Browse by Cuisine</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Sri Lankan', emoji: '🍛', count: 12, bg: 'from-saffron-100 to-saffron-200' },
              { name: 'North Indian', emoji: '🫕', count: 8, bg: 'from-brand-100 to-brand-200' },
              { name: 'Keralan', emoji: '🥥', count: 6, bg: 'from-fresh-100 to-fresh-200' },
              { name: 'Healthy Bowls', emoji: '🥗', count: 5, bg: 'from-stone-100 to-stone-200' },
            ].map(c => (
              <button key={c.name} onClick={() => navigateTo('menu')} className={`bg-gradient-to-br ${c.bg} rounded-3xl p-5 text-left hover:scale-105 transition-transform`}>
                <span className="text-3xl block mb-2">{c.emoji}</span>
                <p className="font-heading font-extrabold text-sm text-ink-900">{c.name}</p>
                <p className="text-xs text-stone-500">{c.count} dishes</p>
              </button>
            ))}
          </div>
        </div>

        {/* Top Rated Kitchens */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-heading text-xl font-extrabold text-ink-900">⭐ Top Rated Kitchens</h2>
            <button onClick={()=>navigateTo('shops')} className="text-xs font-bold text-brand-600">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {[...shops].sort((a,b)=>b.rating-a.rating).slice(0,3).map(shop=>(
              <button key={shop.id} onClick={()=>selectShop(shop.id)} className="shrink-0 w-64 bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm hover:shadow-card-elevated transition-all text-left">
                <div className="h-28 bg-stone-100 relative overflow-hidden">
                  <img src={shop.bannerUrl} alt={shop.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-white/95 rounded-full shadow-sm">
                    <span className="text-[10px] font-extrabold text-ink-900">⭐ {shop.rating}</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-heading font-extrabold text-sm text-ink-900">{shop.name}</p>
                  <p className="text-xs text-stone-400">{shop.cuisineType}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Most Ordered This Week */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-extrabold text-ink-900">🔥 Most Ordered This Week</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {menuItems.slice(0,4).map(item=>(
              <button key={item.id} onClick={()=>{addToSlot(item);navigateTo('builder');}} className="shrink-0 w-48 bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm hover:shadow-card-elevated transition-all text-left">
                <div className="h-24 bg-stone-100 relative overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'} />
                </div>
                <div className="p-3">
                  <p className="font-heading font-extrabold text-xs text-ink-900 truncate">{item.name}</p>
                  <p className="text-xs text-brand-600 font-bold">£{item.price.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
      `}</style>
    </div>
  );
};
