import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ProtectedRoute } from './components/Common/ProtectedRoute';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';

// Public/Common Screens
import { LandingPage } from './components/Landing/LandingPage';
import { AboutUs } from './components/Landing/AboutUs';
import { Blog } from './components/Landing/Blog';
import { Inquiry } from './components/Landing/Inquiry';
import { Partnership } from './components/Landing/Partnership';
import { CustomerAuth } from './components/Auth/CustomerAuth';
import { AuthCallback } from './components/Auth/AuthCallback';
import { ShopAuth } from './components/Auth/ShopAuth';
import { AdminAuth } from './components/Auth/AdminAuth';
import { ResetPassword } from './components/Auth/ResetPassword';
import { RiderAuth } from './components/Rider/RiderAuth';
import { VendorOnboarding } from './components/Onboarding/VendorOnboarding';
// Customer Screens
import { HomeScreen } from './components/Home/HomeScreen';
import { LunchboxBuilder } from './components/Builder/LunchboxBuilder';
import { CalendarDeliveryView } from './components/Calendar/CalendarDeliveryView';
import { FullMenuScreen } from './components/Menu/FullMenuScreen';
import { BookingsScreen } from './components/Bookings/BookingsScreen';
import { CheckoutScreen } from './components/Checkout/CheckoutScreen';
import { ConfirmationScreen } from './components/Checkout/ConfirmationScreen';
import { ProfileScreen } from './components/Profile/ProfileScreen';
import { ShopDetailScreen } from './components/Shops/ShopDetailScreen';
import { ShopsListScreen } from './components/Shops/ShopsListScreen';
import { WalletScreen } from './components/Wallet/WalletScreen';
import { FavouritesScreen } from './components/Favourites/FavouritesScreen';
import { NotificationsScreen } from './components/Notifications/NotificationsScreen';

// Portal Dashboards
import { AdminLayout } from './components/Admin/AdminLayout';
import { DashboardPage } from './components/Admin/pages/DashboardPage';
import { VendorsPage } from './components/Admin/pages/VendorsPage';
import { VendorDetailView } from './components/Admin/pages/VendorDetailView';
import { OrdersPage } from './components/Admin/pages/OrdersPage';
import { OrderDetailView } from './components/Admin/pages/OrderDetailView';
import { RidersPage } from './components/Admin/pages/RidersPage';
import { RiderDetailView } from './components/Admin/pages/RiderDetailView';
import { CustomersPage } from './components/Admin/pages/CustomersPage';
import { CustomerDetailView } from './components/Admin/pages/CustomerDetailView';
import { FinancePage } from './components/Admin/pages/FinancePage';
import { MarketingPage } from './components/Admin/pages/MarketingPage';
import { SupportPage } from './components/Admin/pages/SupportPage';
import { AnalyticsPage } from './components/Admin/pages/AnalyticsPage';
import { SettingsPage } from './components/Admin/pages/SettingsPage';
import { ShopDashboard } from './components/Kitchen/ShopDashboard';
import { RiderDashboard } from './components/Rider/RiderDashboard';

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/partnership" element={<Partnership />} />
          
          <Route path="/login" element={<CustomerAuth />} />
          <Route path="/register" element={<CustomerAuth />} />
          <Route path="/shop-auth" element={<ShopAuth />} />
          <Route path="/admin-auth" element={<AdminAuth />} />
          <Route path="/rider-auth" element={<RiderAuth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/onboarding" element={<VendorOnboarding />} />

          {/* Customer Portal (Layout with Nav) */}
          <Route element={<CustomerLayout />}>
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/shops" element={<ShopsListScreen />} />
            <Route path="/shops/:id" element={<ShopDetailScreen />} />
            <Route path="/menu" element={<FullMenuScreen />} />
            
            {/* Protected Customer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/builder" element={<LunchboxBuilder />} />
              <Route path="/calendar" element={<CalendarDeliveryView />} />
              <Route path="/bookings" element={<BookingsScreen />} />
              <Route path="/checkout" element={<CheckoutScreen />} />
              <Route path="/confirmation" element={<ConfirmationScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/wallet" element={<WalletScreen />} />
              <Route path="/favourites" element={<FavouritesScreen />} />
              <Route path="/notifications" element={<NotificationsScreen />} />
            </Route>
          </Route>

          {/* Admin Portal */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="vendors/:id" element={<VendorDetailView />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailView />} />
              <Route path="riders" element={<RidersPage />} />
              <Route path="riders/:id" element={<RiderDetailView />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:id" element={<CustomerDetailView />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="marketing" element={<MarketingPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Kitchen Portal */}
          <Route path="/kitchen/*" element={<ProtectedRoute allowedRoles={['KITCHEN']} />}>
            <Route index element={<ShopDashboard />} />
          </Route>

          {/* Rider Portal */}
          <Route path="/rider/*" element={<ProtectedRoute allowedRoles={['RIDER']} />}>
            <Route index element={<RiderDashboard />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
