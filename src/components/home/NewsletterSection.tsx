import React, { useState } from 'react';
import { Mail, Sparkles, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMediaCMS } from '../../context/MediaCMSContext';

export const NewsletterSection: React.FC = () => {
  const { newsletter } = useMediaCMS();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (newsletter.isActive === false) return null;

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
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#211D1C] flex items-center gap-1.5">
              <span>✦</span>
              <span>{newsletter.discountBadge || 'SPECIAL GIFT PRIVILEGE'}</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
              {newsletter.title || 'Join the Divine’s Eternity Club'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-800 max-w-md">
              {newsletter.subtitle || 'Receive exclusive early access to limited edition creations, special holiday discounts, and engraving inspiration.'}
            </p>
          </div>

          {/* Right Column: Input */}
          <div className="lg:col-span-6 space-y-2">
            <div className="text-[11px] font-bold text-[#211D1C] ml-4">
              Your email address
            </div>

            {status === 'success' ? (
              <div className="bg-white p-4 rounded-full shadow-md border border-white flex items-center justify-between px-6 animate-in fade-in">
                <span className="text-xs font-bold text-[#211D1C]">
                  🌸 Welcome to the Divine’s Eternity Club! Use code <strong className="text-[#FF2E93]">{newsletter.discountCode || 'LOVE100'}</strong> at checkout.
                </span>
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="name@domain.com"
                  className="w-full pl-6 pr-36 sm:pr-44 py-4 rounded-full bg-white text-[#211D1C] text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF2E93] shadow-md"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-[#211D1C] hover:bg-[#FF2E93] text-white px-5 sm:px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
                >
                  {newsletter.buttonText || 'Subscribe'}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-xs text-rose-700 font-semibold ml-4">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
