import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, KeyRound, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface ForbiddenPageProps {
  onReturnToStore: () => void;
  onRetryLogin?: () => void;
}

export const ForbiddenPage: React.FC<ForbiddenPageProps> = ({
  onReturnToStore,
  onRetryLogin,
}) => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-4 sm:p-6 text-[#211D1C]">
      <SEO
        title="403 Forbidden — Administrative Access Restricted"
        description="Access restricted to authorized Divine’s Eternity atelier curators and store administrators."
        noindex={true}
      />
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#F3E8E2] shadow-2xl p-8 sm:p-10 text-center space-y-6 animate-in fade-in duration-200">
        
        {/* Crest Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-[#FFF0F5] border border-[#FFE0E6] flex items-center justify-center text-[#FF2E93] shadow-inner">
          <ShieldAlert className="w-10 h-10 text-[#FF2E93]" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#211D1C] text-[#FFD94A] flex items-center justify-center text-xs shadow-md">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E93] px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#FFE0E6] inline-block">
            HTTP 403 · Access Forbidden
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#211D1C]">
            Atelier Curators Only
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Your current account credentials do not hold Director or Administrator privileges for Divine’s Eternity Studio.
          </p>
        </div>

        {/* Security Note */}
        <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#F3E8E2] text-[11px] text-stone-500 text-left space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-stone-700">
            <KeyRound className="w-3.5 h-3.5 text-[#FF2E93]" />
            <span>Strict Role-Based Security (RLS) Active</span>
          </div>
          <p>
            Administrative actions, catalog updates, and order fulfillment require verified staff credentials via Supabase Auth.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {onRetryLogin && (
            <button
              onClick={onRetryLogin}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#211D1C] hover:bg-[#FF2E93] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#FFD94A]" />
              <span>Sign In with Staff Account</span>
            </button>
          )}

          <button
            onClick={onReturnToStore}
            className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Boutique Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
