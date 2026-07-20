import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, user, authLoading } = useApp();

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream-100">Loading...</div>;
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they have a role but it doesn't match, send them to their respective default dashboard
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'KITCHEN') return <Navigate to="/kitchen" replace />;
    if (user.role === 'RIDER') return <Navigate to="/rider" replace />;
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
