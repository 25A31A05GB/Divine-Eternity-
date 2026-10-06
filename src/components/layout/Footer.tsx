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
    <footer className="bg-[#111318] text-[#F5F2EA] pt-16 pb-12 border-t border-[#2A2B2F] relative overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D6B36A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#D6B36A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Four Trust Columns in Pre-Footer */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-white/10 mb-12">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-[#C5A059] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif">Haute Atelier Craft</h4>
              <p className="text-xs text-stone-400 mt-0.5">18k gold vermeil and laser calligraphy precision</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-[#881337] dark:text-[#FB7185] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif">7-Day Replacement</h4>
              <p className="text-xs text-stone-400 mt-0.5">Zero-hassle exchange if sizing or fit needs adjustment</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif">Insured Express Dispatch</h4>
              <p className="text-xs text-stone-400 mt-0.5">Speedy courier delivery with live SMS updates</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-[#C5A059] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif">256-Bit Encrypted</h4>
              <p className="text-xs text-stone-400 mt-0.5">Instant UPI, Cards, NetBanking, and COD</p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Blurb (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Divine's Eternity
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              Gifts that stay in hearts. Handcrafted personalized jewelry, preserved eternal roses, acrylic song plaques, and custom keepsakes designed for timeless memories.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1.5 font-sans">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>concierge@divineseternity.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>+91 98765 43210 (Mon - Sat, 10am - 7pm IST)</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#881337]" />
                <span>Divine Atelier Studio, Bandra West, Mumbai 400050</span>
              </p>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h5 className="text-xs font-bold tracking-widest text-[#C5A059] uppercase mb-4 font-serif">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-300">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => navigateTo('collections', { category: cat.name })}
                    className="hover:text-white hover:translate-x-1 transition-all"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigateTo('collections', { category: 'all' })}
                  className="text-[#C5A059] font-semibold hover:underline"
                >
                  View All Keepsakes →
                </button>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h5 className="text-xs font-bold tracking-widest text-[#C5A059] uppercase mb-4 font-serif">
              Client Care
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5"
                >
                  <span>Track Your Order</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">Live</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy', { tab: 'refund' })}
                  className="hover:text-white hover:translate-x-1 transition-all"
                >
                  7-Day Replacement Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy', { tab: 'shipping' })}
                  className="hover:text-white hover:translate-x-1 transition-all"
                >
                  Shipping & Dispatch Timelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white hover:translate-x-1 transition-all"
                >
                  Contact & Concierge Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy', { tab: 'privacy' })}
                  className="hover:text-white hover:translate-x-1 transition-all"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policy', { tab: 'terms' })}
                  className="hover:text-white hover:translate-x-1 transition-all"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Explore & Brand Column */}
          <div>
            <h5 className="text-xs font-bold tracking-widest text-[#C5A059] uppercase mb-4 font-serif">
              Creator Collective
            </h5>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Join 250+ ambassador creators earning 15% recurring commissions with complimentary PR gift boxes.
            </p>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2 mb-3">
              <div className="flex items-center gap-1 text-[11px] text-[#C5A059] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Atelier Promotion</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Use code <span className="text-[#E5C378] font-bold font-mono">LOVE100</span> for ₹100 off your first bespoke order.
              </p>
            </div>

            <button
              onClick={() => navigateTo('creator-club')}
              className="w-full text-center py-2.5 px-3 rounded-xl bg-[#881337] hover:bg-[#700f2d] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Join Creator Club →</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar with Stealth Secret Admin Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p
            onClick={handleStealthAccess}
            className="cursor-default select-none transition-opacity hover:opacity-90"
            title="Divine's Eternity Studio"
          >
            © {new Date().getFullYear()} Divine's Eternity. Handcrafted for hearts that love deeply.
          </p>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
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
              Replacements
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('policy', { tab: 'shipping' })}
              className="hover:text-white transition-colors"
            >
              Shipping
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('secret-admin-portal')}
              className="text-stone-500 hover:text-[#E5C378] transition-colors p-1 flex items-center gap-1"
              title="Executive Admin Gate"
            >
              <Lock className="w-3 h-3 text-[#C5A059]" />
              <span className="hidden xs:inline text-[10px]">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
