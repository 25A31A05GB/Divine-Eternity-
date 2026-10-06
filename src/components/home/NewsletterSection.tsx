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
    <section className="py-16 bg-[#0A0D14] text-[#F8FAFC] border-b border-[#232F42] relative overflow-hidden">
      {/* Decorative Sparkle Accents */}
      <Sparkles className="absolute top-4 left-6 w-6 h-6 text-[#3B82F6] opacity-30 animate-pulse-glow" />
      <Sparkles className="absolute bottom-6 right-8 w-8 h-8 text-[#A855F7] opacity-20 animate-pulse-glow" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-[#151D2A] border border-[#232F42] text-[#06B6D4] px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>The Insider Circle</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F8FAFC]">
          Join the Circle & get <span className="text-gradient-cyan-blue">₹100 OFF</span> your first order
        </h2>

        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto font-medium leading-relaxed">
          Be the first to access limited custom drops, private vault sales, and artisanal giveaways.
        </p>

        {status === 'success' ? (
          <div className="bg-[#151D2A] p-6 rounded-3xl max-w-md mx-auto shadow-2xl border border-[#232F42] space-y-2 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#2DD4BF] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">
              Welcome to the Insider Circle
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Here is your instant ₹100 discount coupon code:
            </p>
            <div className="bg-[#0F1420] p-2.5 rounded-xl border border-[#232F42] font-mono font-bold text-lg text-gradient-cyan-blue">
              LOVE100
            </div>
            <p className="text-[10px] text-[#64748B]">
              Auto-applied to your next order above ₹500!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-[#151D2A] p-2 rounded-2xl border border-[#232F42] shadow-lg">
              <div className="flex-1 flex items-center pl-3 gap-2">
                <Mail className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="gradient-blue-violet hover:opacity-95 text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
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
