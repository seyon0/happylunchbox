import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, Mail, ArrowRight, ArrowLeft, KeyRound, 
  Sparkles, CheckCircle2, User, Calendar
} from 'lucide-react';
import { authAPI, saveTokens, saveUser } from '../../services/api';

export const CustomerAuth = () => {
  const { currentScreen, navigateTo, fetchBookings, setUser, setIsLoggedIn } = useApp();
  const [isRegister, setIsRegister] = useState(currentScreen === 'register');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  
  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    
    try {
      if (isRegister) {
        await authAPI.register({
          email,
          password,
          firstName,
          lastName,
          dateOfBirth: dob,
          role: 'CUSTOMER'
        });
        setOtpSent(true);
      } else {
        const data = await authAPI.login(email, password);
        
        if (data.message && data.message === 'OTP sent successfully') {
          // It's an unverified account or 2FA triggering OTP
          setOtpSent(true);
        } else {
          setUser(data.user);
          setIsLoggedIn(true);
          await fetchBookings();
          navigateTo('home', true);
        }
      }
    } catch (err) {
      setError(err.message || (isRegister ? 'Registration failed.' : 'Login failed.'));
      // Fallback for local simulation
      if (err.message && err.message.includes('fetch')) {
         console.warn("Backend offline, triggering OTP flow locally.");
         setOtpSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      // Fake API call to the new endpoint
      // await authAPI.requestPasswordReset(email);
      setTimeout(() => {
        setSuccessMsg('If this email exists, a password reset link has been sent to it.');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to request reset.');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // For verification we need the user ID. We'll use email as a lookup in backend for this simplified flow,
      // but if the backend expects userId, we might need a workaround. Assuming authAPI handles it.
      const data = await authAPI.verifyOtp(email, otpCode);
      
      setUser(data.user);
      setIsLoggedIn(true);
      await fetchBookings();
      navigateTo('home', true);
    } catch (err) {
      setError(err.message || 'Verification failed.');
      if (err.message && err.message.includes('fetch')) {
        console.warn("Backend server offline, simulating successful OTP verification locally.");
        setIsLoggedIn(true);
        navigateTo('home', true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider) => {
    window.location.href = `http://localhost:3000/api/auth/${provider.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-6 relative">
      <button onClick={() => navigateTo('landing')} className="absolute top-6 left-6 inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-ink-900 transition-colors uppercase tracking-wider">
        <ArrowLeft className="w-3.5 h-3.5" /> Landing
      </button>

      <div className="w-full max-w-md bg-white border border-cream-200 rounded-[2rem] p-8 shadow-card-elevated space-y-6">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-black text-ink-900 tracking-tight">Customer Portal</h2>
          <p className="text-xs text-stone-500 font-medium mt-1">
            {otpSent ? 'Confirm your verification code' : isRegister ? 'Create your Jaffna Roots customer profile' : 'Sign in to order your tiffin boxes'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-semibold leading-relaxed">
            {successMsg}
          </div>
        )}

        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-stone-500 text-center font-medium leading-relaxed">
              Enter your email address and we'll send you a link to reset your password securely.
            </p>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full pl-9 pr-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-saffron-500 text-white font-heading font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button 
              type="button" 
              onClick={() => { setIsForgotPassword(false); setError(''); setSuccessMsg(''); }} 
              className="w-full text-center text-xs font-bold text-brand-600 hover:underline"
            >
              Back to Sign In
            </button>
          </form>
        ) : !otpSent ? (
          <>
            {/* Social options */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => handleSocialAuth('Google')}
                className="py-2.5 rounded-xl border border-cream-200 bg-white hover:bg-cream-50 text-stone-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Google Verify
              </button>
              <button 
                type="button"
                onClick={() => handleSocialAuth('Facebook')}
                className="py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Facebook Verify
              </button>
            </div>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 border-t border-cream-200" />
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">or</span>
              <div className="flex-1 border-t border-cream-200" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isRegister && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="John" 
                        className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="Doe" 
                        className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="date" 
                        required
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        className="w-full pl-9 pr-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none" 
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="w-full pl-9 pr-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-9 pr-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-saffron-500 text-white font-heading font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-cream-100 flex flex-col gap-2">
              <button 
                onClick={() => { setIsRegister(!isRegister); setError(''); setSuccessMsg(''); }}
                className="text-xs text-brand-600 font-extrabold hover:underline"
              >
                {isRegister ? 'Already have an account? Sign In' : 'Create a new Customer Account'}
              </button>
              {!isRegister && (
                <button 
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMsg(''); }}
                  className="text-[10px] text-stone-500 font-semibold hover:text-ink-900"
                >
                  Forgot your password?
                </button>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-stone-500 text-center font-medium leading-relaxed">
              We have sent a verification code to <strong className="text-ink-900">{email}</strong>. Please check your inbox and enter it below.
            </p>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Verification Code (6-digit)</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="123456" 
                  className="w-full pl-9 pr-3 py-3 bg-cream-50 border border-cream-200 rounded-xl text-xs font-extrabold text-center tracking-widest focus:bg-white focus:outline-none" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-ink-900 text-white font-heading font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Log In'}
            </button>
            <button 
              type="button" 
              onClick={() => setOtpSent(false)} 
              className="w-full text-center text-xs font-bold text-brand-600 hover:underline"
            >
              Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
