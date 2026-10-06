import React from 'react';
import { Sparkles, Heart, ShieldCheck, Truck, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';
import { CATEGORIES } from '../../data/products';

interface FooterProps {
  setCurrentView: (view: string, params?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const navigateTo = (view: string, params?: Record<string, string>) => {
    setCurrentView(view, params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A1819] text-[#FFF8F4] pt-16 pb-12 border-t border-slate-800 relative overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F0508C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#FFD94A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Four Trust Columns in Pre-Footer */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-white/10 mb-12">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-950/60 border border-pink-500/30 flex items-center justify-center text-[#F0508C] shrink-0">
              <Sparkles className="w-5 h-5 text-[#FFD94A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Thoughtfully Packed</h4>
              <p className="text-xs text-slate-400 mt-0.5">Gift-ready premium boxes with cute aesthetic stickers</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-950/60 border border-pink-500/30 flex items-center justify-center text-[#F0508C] shrink-0">
              <RefreshCw className="w-5 h-5 text-[#F0508C]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Replacements</h4>
              <p className="text-xs text-slate-400 mt-0.5">Zero hassle replacements if sizing or fit isn't 100% perfect</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-950/60 border border-pink-500/30 flex items-center justify-center text-[#F0508C] shrink-0">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">Speedy insured delivery on all orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-950/60 border border-pink-500/30 flex items-center justify-center text-[#F0508C] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#FFD94A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400 mt-0.5">UPI, Cards, NetBanking & Cash on Delivery available</p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Blurb (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Divine's Eternity
              </span>
              <span className="text-[#F0508C] text-base">✦</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              Gifts that stay in hearts. Handcrafted phone cases, pearl wristlet jewelry, mirror cases, and personalized custom keepsakes designed to bring pure joy to your everyday life.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5 font-sans">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F0508C]" />
                <span>support@divineseternity.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFD94A]" />
                <span>+91 98765 43210 (Mon - Sat, 10am - 7pm IST)</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>Divine Studio, Bandra West, Mumbai, Maharashtra 400050</span>
              </p>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h5 className="text-xs font-bold tracking-widest text-[#F0508C] uppercase mb-4">
              Shop Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
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
                  className="text-[#FFD94A] font-semibold hover:underline"
                >
                  View All Cases →
                </button>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h5 className="text-xs font-bold tracking-widest text-[#F0508C] uppercase mb-4">
              Customer Help
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5"
                >
                  <span>Track Your Order</span>
                  <span className="text-[10px] bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded font-mono">Live</span>
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
                  Shipping & Delivery Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white hover:translate-x-1 transition-all"
                >
                  Contact & WhatsApp Support
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
            <h5 className="text-xs font-bold tracking-widest text-[#F0508C] uppercase mb-4">
              Divine Club
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Join 45,000+ girls who treat their phone like a luxury aesthetic accessory.
            </p>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center gap-1 text-[11px] text-[#FFD94A] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Special Promo Offer</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Use code <span className="text-[#F0508C] font-bold font-mono">FLAT849</span> to get any 2 luxury cases for ₹849!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Divine's Eternity. Crafted with</span>
            <Heart className="w-3 h-3 text-[#F0508C] fill-current" />
            <span>for happy phones.</span>
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => navigateTo('policy', { tab: 'privacy' })}
              className="hover:text-white"
            >
              Privacy
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('policy', { tab: 'refund' })}
              className="hover:text-white"
            >
              Replacements
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('policy', { tab: 'shipping' })}
              className="hover:text-white"
            >
              Shipping
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('admin')}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
