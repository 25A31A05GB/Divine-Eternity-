import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, X, Check, Copy, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';

interface NewsletterModalProps {
  delayMs?: number;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ delayMs = 10000 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const { applyCoupon, openCart } = useCart();

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('de_newsletter_dismissed');
    if (isDismissed === 'true') return;

    // Trigger non-intrusively after delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('de_newsletter_dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribed(true);
    applyCoupon('LOVE100');
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    sessionStorage.setItem('de_newsletter_dismissed', 'true');
  };

  const handleCopyAndShop = () => {
    navigator.clipboard?.writeText('LOVE100');
    setCopiedCode(true);
    setTimeout(() => {
      handleDismiss();
      openCart();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#FAF7F2] dark:bg-[#181418] w-full max-w-lg rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-6 sm:p-8 relative overflow-hidden text-left animate-in zoom-in-95 duration-200">
        
        {/* Ambient Subtle Background Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#881337]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-[#C5A059]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          aria-label="Close newsletter offer"
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubscribed ? (
          <div className="space-y-5 relative z-10">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#881337] dark:bg-[#BE123C] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>Atelier Welcome Privilege</span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F0EB]">
                Claim ₹100 Off <span className="italic text-[#881337] dark:text-[#FB7185]">Your First Order</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                Join our private client circle for confidential drop announcements, artisanal gift previews, and instant savings on handcrafted keepsakes.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email (e.g. ananya@example.com)"
                    className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl pl-10 pr-4 py-3 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:ring-2 focus:ring-[#881337] focus:outline-none shadow-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#881337] hover:bg-[#700f2d] dark:bg-[#BE123C] dark:hover:bg-[#9f1239] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Unlock ₹100 Gift Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Trust Markers */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 border-t border-[#EFE7DE] dark:border-stone-800">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Spam · Unsubscribe Anytime</span>
              </span>

              <button
                type="button"
                onClick={handleDismiss}
                className="hover:text-stone-900 dark:hover:text-white underline transition-colors"
              >
                No thanks, skip offer
              </button>
            </div>

          </div>
        ) : (
          /* Success State */
          <div className="space-y-5 text-center py-2 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Gift className="w-8 h-8" />
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
                Privilege Code Unlocked!
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917] dark:text-[#F5F0EB]">
                Welcome to Divine's Atelier
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                Your ₹100 welcome code has been automatically applied to your cart.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-2xl space-y-2">
              <div className="text-[11px] text-stone-500 font-medium">Your Discount Code:</div>
              <div className="text-2xl font-mono font-bold tracking-widest text-[#881337] dark:text-[#FB7185]">
                LOVE100
              </div>
            </div>

            <button
              onClick={handleCopyAndShop}
              className="w-full py-3.5 rounded-xl bg-[#881337] hover:bg-[#700f2d] dark:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Code Applied! Opening Bag...</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code & View Bag</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
