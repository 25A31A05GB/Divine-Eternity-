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
    <section className="py-16 bg-[#FFD94A] text-[#231F20] border-b-2 border-[#231F20] relative overflow-hidden">
      {/* Decorative Sparkle Accents */}
      <div className="absolute top-4 left-6 text-2xl text-[#F0508C] animate-pulse-glow">✦</div>
      <div className="absolute bottom-6 right-8 text-3xl text-white drop-shadow-sm animate-pulse-glow">✦</div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-[#231F20] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
          <span>The Divine Club</span>
        </div>

        <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Join the club & get <span className="italic text-[#F0508C] bg-white px-2 rounded-lg">₹100 OFF</span> your first drop
        </h2>

        <p className="text-xs sm:text-sm text-slate-800 max-w-md mx-auto font-medium">
          Be the first to get access to limited edition pearl charms, secret subscriber sales, and cute giveaways.
        </p>

        {status === 'success' ? (
          <div className="bg-white p-6 rounded-3xl max-w-md mx-auto shadow-xl border-2 border-[#231F20] space-y-2 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-slate-900">
              Welcome to the Divine Atelier
            </h3>
            <p className="text-xs text-slate-600">
              Here is your instant ₹100 discount coupon code:
            </p>
            <div className="bg-pink-50 p-2.5 rounded-xl border border-pink-300 font-mono font-bold text-base text-[#F0508C]">
              WELCOME100
            </div>
            <p className="text-[10px] text-slate-400">
              Auto-applied to your next order above ₹500!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-white p-1.5 rounded-2xl sm:rounded-full border-2 border-[#231F20] shadow-lg">
              <div className="flex-1 flex items-center pl-4 gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-[#231F20] hover:bg-[#F0508C] text-white px-6 py-3 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <span>Join The Club</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {status === 'error' && (
              <p className="text-xs font-bold text-rose-700">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};
