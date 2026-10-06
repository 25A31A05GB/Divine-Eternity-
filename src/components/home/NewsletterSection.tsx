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
    <section className="py-16 bg-[#111318] text-[#F5F2EA] border-b border-[#2A2B2F] relative overflow-hidden">
      {/* Decorative Sparkle Accents */}
      <Sparkles className="absolute top-4 left-6 w-6 h-6 text-[#5B8CFF] opacity-30 animate-pulse-glow" />
      <Sparkles className="absolute bottom-6 right-8 w-8 h-8 text-[#8B5CF6] opacity-20 animate-pulse-glow" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-[#17191F] border border-[#2A2B2F] text-[#D6B36A] px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F0D79A]" />
          <span>The Atelier Circle</span>
        </div>

        <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F2EA]">
          Join the Circle & get <span className="italic text-[#D6B36A] bg-[#17191F] px-3 py-0.5 rounded-xl border border-[#2A2B2F]">₹100 OFF</span> your first order
        </h2>

        <p className="text-xs sm:text-sm text-[#A7A7A2] max-w-md mx-auto font-medium leading-relaxed">
          Be the first to access limited custom drops, private vault sales, and artisanal giveaways.
        </p>

        {status === 'success' ? (
          <div className="bg-[#17191F] p-6 rounded-3xl max-w-md mx-auto shadow-2xl border border-[#2A2B2F] space-y-2 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-[#F5F2EA]">
              Welcome to the Divine Atelier
            </h3>
            <p className="text-xs text-[#A7A7A2]">
              Here is your instant ₹100 discount coupon code:
            </p>
            <div className="bg-[#111318] p-2.5 rounded-xl border border-[#2A2B2F] font-mono font-bold text-lg text-[#D6B36A]">
              LOVE100
            </div>
            <p className="text-[10px] text-stone-500">
              Auto-applied to your next order above ₹500!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-[#17191F] p-2 rounded-2xl border border-[#2A2B2F] shadow-lg">
              <div className="flex-1 flex items-center pl-3 gap-2">
                <Mail className="w-4 h-4 text-[#A7A7A2] shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-xs sm:text-sm text-[#F5F2EA] placeholder-[#A7A7A2] focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-[#D6B36A] hover:bg-[#b8934a] text-[#08090B] px-6 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <span>Join Circle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {status === 'error' && (
              <p className="text-xs font-bold text-rose-400">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};
