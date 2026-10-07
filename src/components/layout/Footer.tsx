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
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Column (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-baseline">
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#FF2E93]">
                Divine’s
              </span>
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                Eternity
              </span>
              <span className="text-[#FFD94A] text-xl font-bold ml-1">✦</span>
            </div>
            
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              Discover the world of Divine’s Eternity, where every gift is created to make your special moments more memorable. Handcrafted keepsakes, custom jewellery, and creative collaborations.
            </p>
          </div>

          {/* Strictly Defined 7 Collections Column */}
          <div className="lg:col-span-1">
            <h5 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
              <span className="text-[#FF2E93]">✦</span>
              <span>7 Collections</span>
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'products' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  1. Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'personalization' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  2. Personalization
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'collaboration' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  3. Collaboration
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'upcoming-campaigns' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  4. Upcoming Campaigns
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'creator-club' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  5. Creator Club (₹7k)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'affiliate-marketing' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  6. Affiliate Marketing
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'podcast' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  7. Podcast
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4">
              Explore & Shop
            </h5>
            <ul className="space-y-3 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('wishlist')}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'products' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer"
                >
                  All Gift Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Policies Column */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4">
              Legal & Trust
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => navigateTo('policy', { tab: 'privacy' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy', { tab: 'terms' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy', { tab: 'refund' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  Refund & Cancellation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy', { tab: 'shipping' })}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  Shipping & Timelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-[#FF2E93] transition-colors cursor-pointer text-left"
                >
                  Contact & Atelier Support
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
            title="Divine’s Eternity"
          >
            © {new Date().getFullYear()} Divine’s Eternity. Gifts that stay in hearts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px]">
            <button
              onClick={() => navigateTo('policy', { tab: 'privacy' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('policy', { tab: 'terms' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('policy', { tab: 'refund' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Refunds
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('policy', { tab: 'shipping' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Shipping
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('secret-admin-portal')}
              className="hover:text-[#FF2E93] text-stone-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Atelier Management Portal"
            >
              <Lock className="w-3 h-3 text-[#FF2E93]" />
              <span>Admin Portal</span>
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
