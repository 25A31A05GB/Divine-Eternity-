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
    <div className="fixed inset-0 z-50 bg-[#08090B]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#151A24] w-full max-w-lg rounded-2xl border border-[#242C3D] shadow-2xl p-6 sm:p-8 relative overflow-hidden text-left animate-in zoom-in-95 duration-200">
        
        {/* Ambient Subtle Background Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#5B8CFF]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-[#8B5CF6]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          aria-label="Close newsletter offer"
          className="absolute top-4 right-4 p-2 rounded-full text-[#A7AFBD] hover:text-[#F7F4EC] hover:bg-[#1B2230] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubscribed ? (
          <div className="space-y-5 relative z-10">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#1B2230] border border-[#242C3D] text-[#5B8CFF] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Insider VIP Privilege</span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F4EC]">
                Claim <span className="text-gradient-cyan-blue">₹100 Off</span> Your First Order
              </h3>
              <p className="text-xs sm:text-sm text-[#A7AFBD] leading-relaxed">
                Join our tech circle for early product access, release previews, and instant welcome savings on custom engineering & products.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#A7AFBD] block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#737C8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work or personal email"
                    className="w-full bg-[#0C1220] border border-[#242C3D] rounded-xl pl-10 pr-4 py-3 text-xs text-[#F7F4EC] placeholder-[#737C8C] focus:ring-2 focus:ring-[#5B8CFF] focus:border-transparent focus:outline-none shadow-xs transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gradient-blue-violet hover:opacity-95 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Unlock ₹100 Gift Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Trust Markers */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-[#737C8C] border-t border-[#242C3D]">
              <span className="flex items-center gap-1 text-[#2DD4BF] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Spam · Unsubscribe Anytime</span>
              </span>

              <button
                type="button"
                onClick={handleDismiss}
                className="hover:text-[#F7F4EC] underline transition-colors"
              >
                No thanks, skip offer
              </button>
            </div>

          </div>
        ) : (
          /* Success State */
          <div className="space-y-5 text-center py-2 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#0C1220] border border-[#2DD4BF]/40 text-[#2DD4BF] flex items-center justify-center mx-auto shadow-inner">
              <Gift className="w-8 h-8" />
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#2DD4BF] mb-1">
                Privilege Code Unlocked!
              </div>
              <h3 className="text-2xl font-bold text-[#F7F4EC]">
                Welcome to the Insider Circle
              </h3>
              <p className="text-xs text-[#A7AFBD] mt-1">
                Your ₹100 welcome code has been automatically applied to your session.
              </p>
            </div>

            <div className="p-4 bg-[#0C1220] border border-[#242C3D] rounded-xl space-y-2">
              <div className="text-[11px] text-[#737C8C] font-medium">Your Discount Code:</div>
              <div className="text-2xl font-mono font-bold tracking-widest text-gradient-cyan-blue">
                LOVE100
              </div>
            </div>

            <button
              onClick={handleCopyAndShop}
              className="w-full py-3.5 rounded-xl gradient-blue-violet hover:opacity-95 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-[#2DD4BF]" />
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

