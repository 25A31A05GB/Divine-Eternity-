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
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#FFFDF8] text-[#211D1C] w-full max-w-lg rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 relative overflow-hidden text-left animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          aria-label="Close newsletter offer"
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-[#211D1C] hover:bg-stone-100 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubscribed ? (
          <div className="space-y-5 relative z-10">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#FFF0F3] border border-[#FFE0E6] text-[#FF2E93] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span>Cute Covers Club Perk</span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#211D1C]">
                Get <span className="font-serif italic text-[#FF2E93]">₹100 Off</span> Your First Case
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Join our cute community for secret drop alerts, private discount codes, and aesthetic case inspiration!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-xs text-[#211D1C] placeholder-stone-400 focus:ring-2 focus:ring-[#FF2E93] focus:outline-none shadow-xs transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Unlock ₹100 Gift Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Trust Markers */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-200">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Spam · Free Returns</span>
              </span>

              <button
                type="button"
                onClick={handleDismiss}
                className="hover:text-[#211D1C] underline transition-colors cursor-pointer"
              >
                No thanks, skip offer
              </button>
            </div>

          </div>
        ) : (
          /* Success State */
          <div className="space-y-5 text-center py-2 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF0F3] border border-[#FFE0E6] text-[#FF2E93] flex items-center justify-center mx-auto shadow-xs">
              <Gift className="w-8 h-8" />
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#FF2E93] mb-1">
                Perk Unlocked!
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-[#211D1C]">
                Welcome to the Cute Covers Club
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Your ₹100 welcome code has been applied to your session!
              </p>
            </div>

            <div className="p-4 bg-[#FFF9DE] border border-[#F5E6B8] rounded-2xl space-y-2">
              <div className="text-[11px] text-stone-600 font-bold uppercase tracking-wider">Your Discount Code:</div>
              <div className="text-2xl font-mono font-bold tracking-widest text-[#FF2E93]">
                FLAT849
              </div>
            </div>

            <button
              onClick={handleCopyAndShop}
              className="w-full py-3.5 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Code Applied! Opening Cart...</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code & View Cart</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

