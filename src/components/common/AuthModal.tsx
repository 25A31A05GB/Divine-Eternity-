import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, Phone, ArrowLeft, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { SEO } from '../common/SEO';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup' | 'forgot';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMsg('Please enter your email address');
        setIsLoading(false);
        return;
      }
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/#reset-password`,
        });
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Password reset instructions sent to your email.');
        }
      } else {
        setSuccessMsg('Reset link sent to ' + email);
      }
      setIsLoading(false);
      return;
    }

    if (mode === 'signup') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Email and password are required');
        setIsLoading(false);
        return;
      }
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: fullName.trim() || undefined,
              phone: phone.trim() || undefined,
            },
          },
        });
        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }
        if (data.session) {
          setSuccessMsg('Account created successfully!');
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 800);
        } else {
          setSuccessMsg('Please check your email inbox to confirm your account.');
        }
      } else {
        await login(email.trim(), fullName.trim());
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 500);
      }
      setIsLoading(false);
      return;
    }

    // Login flow
    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Email and password are required');
        setIsLoading(false);
        return;
      }
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }
      } else {
        await login(email.trim());
      }

      setSuccessMsg('Welcome back!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 500);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] w-full max-w-md rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in duration-200 text-[#211D1C]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E93] block">
              DIVINE’S ETERNITY
            </span>
            <h3 className="font-serif-heading font-bold text-xl text-[#211D1C] mt-0.5">
              {mode === 'login' && 'Patron Sign In'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#211D1C] block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#211D1C] block">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#211D1C] outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#211D1C] block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#211D1C] outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#211D1C]">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-[#FF2E93] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#211D1C] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="pt-3 border-t border-[#F3E8E2] text-center text-xs text-stone-500">
          {mode === 'login' && (
            <p>
              New to Divine’s Eternity?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-bold text-[#FF2E93] hover:underline cursor-pointer"
              >
                Join Atelier VIP
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-[#FF2E93] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <button
              onClick={() => setMode('login')}
              className="font-bold text-[#FF2E93] hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
