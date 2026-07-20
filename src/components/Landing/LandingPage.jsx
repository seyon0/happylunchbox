import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Send, CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UserPortalCarousel } from './UserPortalCarousel';

export const LandingPage = () => {
  const { navigateTo, isLoggedIn, user } = useApp();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // 3D Parallax Scroll setup
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.05]);
  const cardsY = useTransform(scrollY, [0, 800], [100, 0]);

  const getAssetPath = (path) => {
    if (path && path.startsWith('/')) {
      return `.${path}`;
    }
    return path;
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMsg('');
    }, 3000);
  };

  const userPortals = [
    {
      id: 'customer',
      title: 'Customer Portal',
      eyebrow: 'Order Food',
      description: 'Browse kitchens, subscribe to tiffin slots, and schedule healthy lunchboxes.',
      image: getAssetPath('/source/Medium_studio_shot_of_a_202607102031.jpeg'),
    },
    {
      id: 'kitchen',
      title: 'Kitchen Portal',
      eyebrow: 'Partner & Cook',
      description: 'Manage your menu, configure payouts, and track daily prep queues.',
      image: getAssetPath('/source/Medium_studio_shot_of_a_202607102023.jpeg'),
    },
    {
      id: 'admin',
      title: 'Admin Dashboard',
      eyebrow: 'Manage Platform',
      description: 'Oversee categories, dispatch, and monitor commission settlements.',
      image: getAssetPath('/source/Medium_studio_shot_of_a_202607102029.jpeg'),
    },
  ];

  const handlePortalNavigate = (portal) => {
    if (portal.id === 'customer') {
      if (isLoggedIn && user.user_type === 'customer') navigateTo('home');
      else navigateTo('customer-auth');
    } else if (portal.id === 'kitchen') {
      if (isLoggedIn && user.user_type === 'shop_owner') navigateTo('shop-dashboard');
      else navigateTo('shop-auth');
    } else if (portal.id === 'admin') {
      if (isLoggedIn && user.user_type === 'admin') navigateTo('admin');
      else navigateTo('admin-auth');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-slate-800 flex flex-col font-sans">
      {/* Minimalist Navbar */}
      <header className="border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('landing')}>
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm">
              <img src={getAssetPath('/source/683754474_17858463000690543_8878656858934875981_n.jpg')} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-heading font-extrabold text-lg text-ink-900 tracking-tight">Happy Lunch Box</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-stone-500 uppercase tracking-widest">
            <button onClick={() => navigateTo('landing-about')} className="hover:text-ink-900 transition-colors">About Us</button>
            <button onClick={() => navigateTo('landing-blog')} className="hover:text-ink-900 transition-colors">Blog</button>
            <button onClick={() => navigateTo('landing-inquiry')} className="hover:text-ink-900 transition-colors">Inquiry</button>
            <button onClick={() => navigateTo('landing-partnership')} className="hover:text-ink-900 transition-colors">Partnership</button>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">Hi, {user.first_name}</span>
                <button 
                  onClick={() => {
                    if (user.user_type === 'admin') navigateTo('admin');
                    else if (user.user_type === 'shop_owner') navigateTo('shop-dashboard');
                    else navigateTo('home');
                  }} 
                  className="px-4 py-2 rounded-xl bg-ink-900 text-white text-xs font-bold hover:bg-black transition-all"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigateTo('customer-auth')} 
                className="px-4 py-2 rounded-xl bg-ink-900 text-white text-xs font-bold hover:bg-black transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center overflow-hidden min-h-[90vh] py-16 md:py-24">
        
        {/* Parallax Background Elements */}
        <motion.div 
          style={{ y: useTransform(scrollY, [0, 1000], [0, -200]) }}
          className="absolute inset-0 pointer-events-none -z-10"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/40 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[50%] bg-saffron-200/30 rounded-full blur-3xl opacity-50" />
        </motion.div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="max-w-6xl mx-auto px-6 flex flex-col items-center space-y-8 relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-brand-100 text-brand-600 text-xs font-bold shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 fill-brand-500 text-brand-500" />
            <span>Fresh Homemade Lunchbox Subscriptions</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="font-heading text-5xl md:text-7xl font-black text-ink-900 tracking-tight max-w-4xl leading-[1.1]"
          >
            A Happy Lunch Box for <span className="bg-gradient-to-r from-brand-500 to-saffron-500 bg-clip-text text-transparent">Every Busy Day</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-stone-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed"
          >
            A minimalist platform linking health-conscious customers, verified local kitchens, and automated platform delivery dispatch.
          </motion.p>
        </motion.div>

        {/* 3D Portal Carousel */}
        <motion.div
          style={{ y: cardsY }}
          className="w-full max-w-5xl px-6 pt-16 md:pt-20 relative z-20"
        >
          <UserPortalCarousel
            portals={userPortals}
            onNavigate={handlePortalNavigate}
          />
        </motion.div>
      </section>

      {/* About Us Sub-Section / Modal style rendering if selected */}
      <section className="bg-stone-50 border-t border-stone-100 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="font-heading text-3xl font-black text-ink-900">Our Core Philosophy</h2>
          <p className="text-stone-500 text-sm leading-relaxed max-w-2xl mx-auto">
            Happy Lunch Box was created to bring home-cooked food straight to the tables of working professionals. 
            By eliminating expensive restaurant margins and focusing entirely on high-quality tiffins prepared by verified local cooks, we guarantee authentic taste and unmatched nutrition.
          </p>
        </div>
      </section>

      {/* Inquiry form directly in Landing page */}
      <section id="inquiry" className="max-w-md mx-auto w-full px-6 py-16 space-y-6">
        <div className="text-center">
          <h3 className="font-heading text-2xl font-extrabold text-ink-900">Have Questions?</h3>
          <p className="text-xs text-stone-500 mt-1">Get in touch with our team</p>
        </div>
        <form onSubmit={handleInquirySubmit} className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Your Name</label>
            <input 
              type="text" 
              required
              value={inquiryName}
              onChange={e => setInquiryName(e.target.value)}
              placeholder="John Doe" 
              className="w-full p-3 rounded-xl bg-stone-50 border border-transparent text-xs font-medium focus:bg-white focus:border-brand-500 focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={inquiryEmail}
              onChange={e => setInquiryEmail(e.target.value)}
              placeholder="john@example.com" 
              className="w-full p-3 rounded-xl bg-stone-50 border border-transparent text-xs font-medium focus:bg-white focus:border-brand-500 focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Message</label>
            <textarea 
              rows={3}
              required
              value={inquiryMsg}
              onChange={e => setInquiryMsg(e.target.value)}
              placeholder="Tell us what you need help with..." 
              className="w-full p-3 rounded-xl bg-stone-50 border border-transparent text-xs font-medium focus:bg-white focus:border-brand-500 focus:outline-none" 
            />
          </div>
          {inquirySubmitted ? (
            <div className="p-3 bg-fresh-50 border border-fresh-200 text-fresh-700 rounded-xl text-xs flex items-center justify-center gap-1.5 font-bold">
              <CheckCircle className="w-4 h-4" /> Message Sent Successfully!
            </div>
          ) : (
            <button 
              type="submit" 
              className="w-full py-3 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Send Message
            </button>
          )}
        </form>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-stone-100 py-8 text-center text-xs text-stone-400">
        <p>© 2026 Happy Lunch Box. All rights reserved. Platform Managed Delivery Dispatch.</p>
      </footer>
    </div>
  );
};
