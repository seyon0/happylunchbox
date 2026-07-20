import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI, saveTokens } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn, fetchBookings } = useApp();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      saveTokens({ access_token: token });
      authAPI.me()
        .then(async (user) => {
          setUser(user);
          setIsLoggedIn(true);
          await fetchBookings();
          
          if (user.role === 'ADMIN') navigate('/admin', { replace: true });
          else if (user.role === 'KITCHEN') navigate('/kitchen', { replace: true });
          else if (user.role === 'RIDER') navigate('/rider', { replace: true });
          else navigate('/home', { replace: true });
        })
        .catch((err) => {
          console.error('Failed to fetch user profile:', err);
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        });
    } else {
      setError('No token found in redirect.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [searchParams, navigate, setUser, setIsLoggedIn, fetchBookings]);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100">
      <p className="text-stone-500 font-bold">Authenticating...</p>
    </div>
  );
};
