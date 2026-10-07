import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useMediaCMS } from '../../context/MediaCMSContext';

export const NewsletterSection: React.FC = () => {
  const { newsletterData } = useMediaCMS();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (newsletterData?.isVisible === false) {
    return null;
  }

  const eyebrow = newsletterData?.eyebrow || '✦ LITTLE NOTES, BIG MOODS';
  const title = newsletterData?.title || 'Cute things are coming your way!';
  const subtitle = newsletterData?.subtitle || 'New personalized jewellery drops, luxury gift hampers & private discounts—only the good stuff.';
  const discountBadge = newsletterData?.discountBadge || 'Flat ₹100 Off';
  const couponCode = newsletterData?.couponCode || 'LOVE100';
  const buttonText = newsletterData?.buttonText || 'Join the club →';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('success');
    setErrorMessage('');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <section className="bg-[#FFD94A] pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#E05A47] flex items-center gap-1.5">
              <span>{eyebrow}</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 max-w-md">
              {subtitle}
            </p>
          </div>

          {/* Right Column: Big Pill Input */}
          <div className="lg:col-span-6 space-y-2">
            <div className="text-[11px] font-bold text-[#211D1C] ml-4 flex items-center justify-between">
              <span>Your email address</span>
              <span className="bg-[#211D1C] text-[#FFD94A] px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                {discountBadge}
              </span>
            </div>

            {status === 'success' ? (
              <div className="bg-white p-4 rounded-full shadow-md border border-white flex items-center justify-between px-6">
                <span className="text-xs font-bold text-[#211D1C]">
                  🌸 Welcome to the Divine’s Eternity Club! Use code <strong className="text-[#FF2E93]">{couponCode}</strong> at checkout.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-1.5">
                <div className="bg-white p-1.5 pl-6 rounded-full shadow-md border border-white flex items-center justify-between gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-xs sm:text-sm text-[#211D1C] placeholder-stone-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#211D1C] hover:bg-black text-white px-7 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    {buttonText}
                  </button>
                </div>
                {status === 'error' && (
                  <p className="text-xs text-rose-700 font-bold ml-4">
                    {errorMessage}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
