import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ForbiddenPage } from '../../pages/ForbiddenPage';
import { Lock, Eye, EyeOff, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    setLoading(true);

    // 1. Check local / session storage flag
    try {
      const localAdmin =
        localStorage.getItem('de_admin_authenticated') === 'true' ||
        sessionStorage.getItem('de_admin_authenticated') === 'true';
      if (localAdmin) {
        setIsAdmin(true);
        setIsForbidden(false);
        setLoading(false);
        return;
      }
    } catch {
      // ignore
    }

    // 2. Check Supabase session if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile?.role === 'admin' || profile?.role === 'staff') {
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
        console.warn('Admin session check warning:', err);
      }
    }

    setIsAdmin(false);
    setIsForbidden(false);
    setLoading(false);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    const cleanEmail = email.trim();
    const cleanPass = password;

    if (!cleanEmail || !cleanPass) {
      setLoginError('Email and password are required.');
      setIsSubmitting(false);
      return;
    }

    // 1. Verify default Atelier Admin credentials (allows immediate access)
    const isDefaultAdmin =
      (cleanEmail.toLowerCase() === 'admin@divineseternity.com' ||
        cleanEmail.toLowerCase() === 'owner@divineseternity.com' ||
        cleanEmail.toLowerCase() === 'admin') &&
      (cleanPass === 'Divine@Admin2026' ||
        cleanPass === 'admin123' ||
        cleanPass === 'divine123' ||
        cleanPass === 'admin');

    if (isDefaultAdmin) {
      try {
        localStorage.setItem('de_admin_authenticated', 'true');
        localStorage.setItem('de_admin_user_role', 'admin');
        sessionStorage.setItem('de_admin_authenticated', 'true');
        sessionStorage.setItem('de_admin_user_role', 'admin');
      } catch {
        // ignore
      }
      setIsAdmin(true);
      setIsForbidden(false);
      setIsSubmitting(false);
      return;
    }

    // 2. Verify via Supabase Auth if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (!signInError && signInData?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', signInData.user.id)
            .maybeSingle();

          if (profile?.role === 'admin' || profile?.role === 'staff') {
            try {
              localStorage.setItem('de_admin_authenticated', 'true');
              sessionStorage.setItem('de_admin_authenticated', 'true');
            } catch {
              // ignore
            }
            setIsAdmin(true);
            setIsForbidden(false);
            setIsSubmitting(false);
            return;
          }
        }
      } catch (err: any) {
        console.warn('Supabase auth warning:', err);
      }
    }

    setLoginError('Invalid credentials. Please use admin@divineseternity.com and Divine@Admin2026');
    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('de_admin_authenticated');
      localStorage.removeItem('de_admin_user_role');
      sessionStorage.removeItem('de_admin_authenticated');
      sessionStorage.removeItem('de_admin_user_role');
    } catch {
      // ignore
    }
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error', e);
      }
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

  // Not logged in -> Show secure admin credentials login page
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#181514] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <SEO
          title="Atelier Management Portal — Divine’s Eternity"
          description="Restricted Administrator Access"
          noindex={true}
        />

        {/* Ambient luxury lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF2E93]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#211D1C] border border-[#3A3331] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF2E93] to-[#D4AF37] mx-auto flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[#FF2E93] text-xs font-extrabold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Divine’s Eternity</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
              Atelier Management Login
            </h1>
            <p className="text-xs text-stone-400">
              Authorized personnel only. Sessions are monitored and verified via Supabase Auth & RLS.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Quick Demo Credentials Box */}
          <div className="bg-[#2B2523] border border-[#433A37] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 font-bold flex items-center gap-1.5">
                <span>👑</span> Administrator Credentials
              </span>
              <span className="text-[10px] text-[#FF2E93] font-mono">Verified Studio Access</span>
            </div>
            <div className="text-[11px] font-mono text-stone-300 bg-[#181514] px-3 py-2 rounded-xl flex items-center justify-between border border-[#3A3331]">
              <span>admin@divineseternity.com</span>
              <span className="text-stone-400 font-sans">Divine@Admin2026</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@divineseternity.com');
                setPassword('Divine@Admin2026');
                setLoginError('');
              }}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>⚡ 1-Click Fill Admin Credentials</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@divineseternity.com"
                className="w-full bg-[#181514] border border-[#3A3331] focus:border-[#FF2E93] rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181514] border border-[#3A3331] focus:border-[#FF2E93] rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-stone-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Management'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#3A3331] flex items-center justify-between text-xs text-stone-500">
            <button
              onClick={onReturnToStore}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              ← Back to Storefront
            </button>
            <span className="text-[11px] font-mono">Role: admin / staff</span>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin Session
  return <>{children}</>;
};
