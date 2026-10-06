import React, { useState } from 'react';
import { Sparkles, Heart, ShieldCheck, Truck, RefreshCw, Mail, Phone, MapPin, Award, Gift, Lock } from 'lucide-react';
import { CATEGORIES } from '../../data/products';

interface FooterProps {
  setCurrentView: (view: string, params?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const [clickCount, setClickCount] = useState(0);

  const navigateTo = (view: string, params?: Record<string, string>) => {
    setCurrentView(view, params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stealth Access trigger: Triple tap on the brand copyright line opens the secret admin portal
  const handleStealthAccess = () => {
    const nextCount = clickCount + 1;
    if (nextCount >= 3) {
      setClickCount(0);
      navigateTo('secret-admin-portal');
    } else {
      setClickCount(nextCount);
      setTimeout(() => setClickCount(0), 1200);
    }
  };

  return (
    <footer className="bg-[#211D1C] text-white pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid matching Screenshot 8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Column (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-baseline">
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#FF2E93]">
                Gadgets
              </span>
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                Destiny
              </span>
              <span className="text-[#FFD94A] text-xl font-bold ml-1">✦</span>
            </div>
            
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              Phone covers for people who refuse to carry boring things. Designed with personality, built for everyday life.
            </p>
          </div>

          {/* Shop Column matching Screenshot 8 */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4">
              Shop
            </h5>
            <ul className="space-y-3 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="hover:text-[#FF2E93] transition-colors"
                >
                  Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('wishlist')}
                  className="hover:text-[#FF2E93] transition-colors"
                >
                  Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Help Column matching Screenshot 8 */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4">
              Help
            </h5>
            <ul className="space-y-3 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'all' })}
                  className="hover:text-[#FF2E93] transition-colors"
                >
                  Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-[#FF2E93] transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy', { tab: 'privacy' })}
                  className="hover:text-[#FF2E93] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy', { tab: 'refund' })}
                  className="hover:text-[#FF2E93] transition-colors"
                >
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Gadget Destinys Column matching Screenshot 8 */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4">
              Gadget Destinys
            </h5>
            <ul className="space-y-3 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-[#FF2E93] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'all' })}
                  className="hover:text-[#FF2E93] transition-colors"
                >
                  Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="hover:text-[#FF2E93] transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-[#FF2E93] transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Stealth Secret Admin Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p
            onClick={handleStealthAccess}
            className="cursor-pointer select-none transition-opacity hover:opacity-90"
            title="Gadgets Destiny"
          >
            © {new Date().getFullYear()} Gadgets Destiny. Cute Covers Club.
          </p>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => navigateTo('policy', { tab: 'privacy' })}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('policy', { tab: 'refund' })}
              className="hover:text-white transition-colors"
            >
              Refund Policy
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('secret-admin-portal')}
              className="text-stone-600 hover:text-stone-400 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

      </div>

      {/* Floating Scroll To Top Button on Bottom Right matching Screenshot 8 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-[#211D1C] border border-stone-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer"
      >
        <span className="text-base font-bold">↑</span>
      </button>
    </footer>
  );
};
