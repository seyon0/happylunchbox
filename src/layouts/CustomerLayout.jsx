import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navigation/Navbar';
import { BottomMobileNav } from '../components/Navigation/BottomMobileNav';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomMobileNav />
    </div>
  );
};
