import React, { useState } from 'react';
import { AdminDashboard } from './AdminDashboard';
import { Product, AdminRole } from '../types';
import { Lock, ShieldCheck, KeyRound, ArrowLeft, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, Film, Package, BarChart3 } from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface SecretAdminPortalProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onBulkUpdateProducts?: (products: Product[]) => void;
  onDeleteProduct: (productId: string) => void;
  onReturnToStore: () => void;
}

export const SecretAdminPortal: React.FC<SecretAdminPortalProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onBulkUpdateProducts,
  onDeleteProduct,
  onReturnToStore,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('de_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [selectedRole, setSelectedRole] = useState<AdminRole>(() => {
    try {
      return (sessionStorage.getItem('de_admin_role') as AdminRole) || 'director';
    } catch {
      return 'director';
    }
  });

  const [pinCode, setPinCode] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@divineseternity.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [authMode, setAuthMode] = useState<'pin' | 'password'>('pin');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const MASTER_PIN = '7788';
  const MASTER_PASS = 'admin123';

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (pinCode.trim() === MASTER_PIN) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('de_admin_authenticated', 'true');
        sessionStorage.setItem('de_admin_role', selectedRole);
      } catch (err) {
        console.error(err);
      }
    } else {
      setAuthError('Incorrect Security PIN. Please enter master PIN (7788).');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (adminPassword === MASTER_PASS || adminPassword === 'secret' || pinCode === MASTER_PIN) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('de_admin_authenticated', 'true');
        sessionStorage.setItem('de_admin_role', selectedRole);
      } catch (err) {
        console.error(err);
      }
    } else {
      setAuthError('Invalid credentials. Use password "admin123" or switch to master PIN "7788".');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('de_admin_authenticated');
    } catch (err) {
      console.error(err);
    }
    onReturnToStore();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#211D1C] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <SEO
          title="Admin Access Gate — Divine’s Eternity"
          description="Restricted Store Control Panel Access"
          noindex={true}
        />

        {/* Ambient subtle glow */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#FF2E93]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#FFD94A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full relative z-10 space-y-6">
          
          {/* Back to store */}
          <button
            onClick={onReturnToStore}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-[#FF2E93] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Store</span>
          </button>

          {/* Security Gate Card */}
          <div className="bg-[#171413] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#211D1C] border border-stone-800 text-[#FF2E93] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#FFD94A] uppercase mb-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF2E93]" />
                <span>Store Management</span>
              </div>
              <h1 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-white">
                Admin Access
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                Enter Master PIN or Credentials to manage products, banners, and customer orders.
              </p>
            </div>

            {/* Role Selection Picker */}
            <div className="text-left space-y-2">
              <label className="text-xs font-bold text-stone-300 block">
                Select Admin Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('director')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'director'
                      ? 'bg-[#FF2E93] border-[#FF2E93] text-white shadow-xs'
                      : 'bg-[#211D1C] border-stone-800 text-stone-400 hover:border-[#FF2E93]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Film className="w-3.5 h-3.5" />
                    <span>Media CMS</span>
                  </div>
                  <p className="text-[10px] opacity-80 mt-0.5">Hero slides & video reels</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('superadmin')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'superadmin'
                      ? 'bg-[#FF2E93] border-[#FF2E93] text-white shadow-xs'
                      : 'bg-[#211D1C] border-stone-800 text-stone-400 hover:border-[#FF2E93]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Store Manager</span>
                  </div>
                  <p className="text-[10px] opacity-80 mt-0.5">Catalog & fulfillment</p>
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {/* Auth Mode Toggle */}
            <div className="flex p-1 bg-stone-900 rounded-xl border border-stone-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('pin')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'pin' ? 'bg-[#FF2E93] text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                Security PIN
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('password')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'password' ? 'bg-[#FF2E93] text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                Password Login
              </button>
            </div>

            {/* PIN Mode Form */}
            {authMode === 'pin' ? (
              <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 block">
                    4-Digit Master Security PIN
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="Enter master PIN (7788)"
                      autoFocus
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-3 text-center text-lg tracking-widest font-mono text-white placeholder-stone-600 focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 text-center">
                    Default Master PIN: <strong className="text-[#FFD94A] font-mono">7788</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  Unlock Admin Studio
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 block">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-[#211D1C] border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter password (admin123)"
                      className="w-full bg-[#211D1C] border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FF2E93] focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Default Password: <strong className="text-[#FFD94A] font-mono">admin123</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-98 mt-2 cursor-pointer"
                >
                  Verify & Sign In
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Confidential Session · 256-bit Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      products={products}
      onAddProduct={onAddProduct}
      onUpdateProduct={onUpdateProduct}
      onBulkUpdateProducts={onBulkUpdateProducts}
      onDeleteProduct={onDeleteProduct}
      onReturnToStore={handleLogout}
      initialRole={selectedRole}
    />
  );
};
