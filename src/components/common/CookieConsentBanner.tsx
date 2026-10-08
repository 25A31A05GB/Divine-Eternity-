import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import { setAnalyticsConsent, hasAnalyticsConsent } from '../../lib/analytics';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('de_analytics_consent_v1');
      if (!stored) {
        // Show after a subtle delay
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!isVisible) return null;

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    setAnalyticsConsent(false);
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[110] bg-white text-[#211D1C] p-4 sm:p-5 rounded-3xl border border-[#F3E8E2] shadow-2xl animate-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE] flex items-center justify-center text-[#FF2E93] shrink-0">
          <Cookie className="w-5 h-5 text-[#FFD94A]" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className="font-serif-heading font-bold text-sm text-[#211D1C]">
            Cookie & Experience Preferences
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            We use essential cookies for your shopping bag and optional analytics to personalize your experience. No tracking without your consent [REVIEW WITH LAWYER].
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
            >
              Essential Only
            </button>
            <a
              href="/privacy-policy"
              className="text-xs text-stone-500 hover:text-[#FF2E93] hover:underline ml-1"
            >
              Learn more
            </a>
          </div>
        </div>
        <button
          onClick={handleDecline}
          aria-label="Dismiss cookie notice"
          className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
