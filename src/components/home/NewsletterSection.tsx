import React, { useState } from 'react';
import { Mail, Sparkles, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
          
          {/* Left Column matching Screenshot 8 */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#E05A47] flex items-center gap-1.5">
              <span>✦</span>
              <span>LITTLE NOTES, BIG MOODS</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
              Cute things are <br />
              <span className="font-serif italic text-[#FF2E93] font-normal">coming your way!</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 max-w-md">
              New personalized jewellery drops, luxury gift hampers & private discounts—only the good stuff.
            </p>
          </div>

          {/* Right Column: Big Pill Input */}
          <div className="lg:col-span-6 space-y-2">
            <div className="text-[11px] font-bold text-[#211D1C] ml-4">
              Your email address
            </div>

            {status === 'success' ? (
              <div className="bg-white p-4 rounded-full shadow-md border border-white flex items-center justify-between px-6">
                <span className="text-xs font-bold text-[#211D1C]">
                  🌸 Welcome to the Divine’s Eternity Club! Use code <strong className="text-[#FF2E93]">LOVE100</strong> at checkout.
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
                    Join the club →
                  </button>
                </div>

                <div className="text-[10px] text-stone-600 ml-4">
                  No spam. We have better things to design.
                </div>

                {status === 'error' && (
                  <p className="text-xs font-bold text-rose-700 ml-4">{errorMessage}</p>
                )}
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
