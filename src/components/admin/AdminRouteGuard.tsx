import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ForbiddenPage } from '../../pages/ForbiddenPage';
import { Lock, KeyRound, ShieldCheck, ArrowLeft, Eye, EyeOff, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { SEO } from '../common/SEO';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  onReturnToStore: () => void;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  onReturnToStore,
}) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  // Login Form States
  const [email, setEmail] = useState('admin@divineseternity.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback PIN state for offline/demo developer mode
  const [pinCode, setPinCode] = useState('');
  const [usePinMode, setUsePinMode] = useState(false);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    setLoading(true);

    // 1. Check Supabase Auth session if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          // Query user profile role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile?.role === 'admin' || session.user.email?.toLowerCase().includes('admin')) {
            setIsAdmin(true);
            setIsForbidden(false);
            setLoading(false);
            return;
          } else {
            setIsForbidden(true);
            setIsAdmin(false);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Session verification fallback', err);
      }
    }

    // 2. Check local session storage fallback
    try {
      const localAuth = sessionStorage.getItem('de_admin_authenticated');
      const localRole = sessionStorage.getItem('de_admin_role');
      if (localAuth === 'true' && localRole !== 'guest') {
        setIsAdmin(true);
        setIsForbidden(false);
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }

    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    // If using PIN shortcut (developer emergency unlock)
    if (usePinMode) {
      if (pinCode.trim() === '7788') {
        setIsAdmin(true);
        setIsForbidden(false);
        try {
          sessionStorage.setItem('de_admin_authenticated', 'true');
          sessionStorage.setItem('de_admin_role', 'director');
        } catch {
          // ignore
        }
        setIsSubmitting(false);
        return;
      } else {
        setLoginError('Invalid Atelier Security PIN. Contact chief curator.');
        setIsSubmitting(false);
        return;
      }
    }

    // Supabase Email + Password Login
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          setLoginError(error.message);
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          // Check role from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profile?.role === 'admin' || data.user.email?.toLowerCase().includes('admin')) {
            setIsAdmin(true);
            setIsForbidden(false);
          } else {
            setIsForbidden(true);
          }
        }
        setIsSubmitting(false);
        return;
      } catch (err: any) {
        setLoginError(err.message || 'Authentication failed');
        setIsSubmitting(false);
        return;
      }
    }

    // Offline / Standalone Fallback credentials
    if (email.toLowerCase().includes('admin') && (password === 'admin123' || password === 'admin@123' || password.length >= 6)) {
      setIsAdmin(true);
      setIsForbidden(false);
      try {
        sessionStorage.setItem('de_admin_authenticated', 'true');
        sessionStorage.setItem('de_admin_role', 'director');
      } catch {
        // ignore
      }
    } else {
      setLoginError('Invalid credentials. Default: admin@divineseternity.com / admin123');
    }

    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error', e);
      }
    }
    try {
      sessionStorage.removeItem('de_admin_authenticated');
      sessionStorage.removeItem('de_admin_role');
    } catch {
      // ignore
    }
    setIsAdmin(false);
    setIsForbidden(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#FF2E93] animate-spin" />
          <p className="text-xs font-serif text-stone-600 font-bold">Verifying Atelier Security Credentials...</p>
        </div>
      </div>
    );
  }

  // 403 Forbidden Screen if authenticated user lacks admin privileges
  if (isForbidden) {
    return (
      <ForbiddenPage
        onReturnToStore={onReturnToStore}
        onRetryLogin={() => {
          handleLogout();
        }}
      />
    );
  }

  // Authorized Admin View
  if (isAdmin) {
    return <>{children}</>;
  }

  // Unauthenticated: Present Luxury Atelier Admin Login
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-4 sm:p-6 text-[#211D1C]">
      <SEO
        title="Atelier Admin Portal Authentication — Divine’s Eternity"
        description="Secure management portal for Divine’s Eternity store administrators."
        noindex={true}
      />
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-10 space-y-6 animate-in fade-in duration-200">
        
        {/* Brand Crest */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#211D1C] to-[#FF2E93] text-white shadow-md mx-auto">
            <Lock className="w-6 h-6 text-[#FFD94A]" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E93] block">
            Executive Curator Access
          </span>
          <h1 className="font-serif-heading text-2xl font-bold text-[#211D1C]">
            Divine’s Eternity Admin
          </h1>
          <p className="text-xs text-stone-500">
            Sign in with verified administrator credentials to access catalog studio & order pipeline.
          </p>
        </div>

        {loginError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {!usePinMode ? (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@divineseternity.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#F3E8E2] focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] text-xs outline-hidden bg-[#FFFDF8]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    Staff Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setUsePinMode(true)}
                    className="text-[10px] text-[#FF2E93] hover:underline cursor-pointer"
                  >
                    Use Fast 4-Digit PIN
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (default: admin123)"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F3E8E2] focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] text-xs outline-hidden bg-[#FFFDF8] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">
                  4-Digit Atelier Master PIN
                </label>
                <button
                  type="button"
                  onClick={() => setUsePinMode(false)}
                  className="text-[10px] text-[#FF2E93] hover:underline cursor-pointer"
                >
                  Use Email & Password
                </button>
              </div>
              <input
                type="password"
                maxLength={4}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="•••• (Default: 7788)"
                autoFocus
                required
                className="w-full px-4 py-3 text-center tracking-[0.5em] font-mono text-lg rounded-xl border border-[#F3E8E2] focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] outline-hidden bg-[#FFFDF8]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#211D1C] hover:bg-[#FF2E93] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[#FFD94A]" />
            )}
            <span>Authenticate & Launch Studio</span>
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onReturnToStore}
            className="text-xs text-stone-500 hover:text-[#211D1C] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Divine’s Eternity Boutique</span>
          </button>
        </div>
      </div>
    </div>
  );
};
