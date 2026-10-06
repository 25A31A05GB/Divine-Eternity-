import React from 'react';
import { Award, ShieldCheck, Truck, Sparkles, Gift, HeartHandshake } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const FEATURES = [
    {
      icon: Award,
      title: 'Haute Atelier Craftsmanship',
      desc: 'Micro-laser calligraphy, 18k thick gold vermeil plating, and hand-selected AAA grade freshwater pearls.',
      accent: 'text-[#C5A059]',
    },
    {
      icon: Gift,
      title: 'Complimentary Velvet Packaging',
      desc: 'Every keepsake arrives in an embossed rose casket with silk ribbon and personalized gift card.',
      accent: 'text-[#881337] dark:text-[#FB7185]',
    },
    {
      icon: ShieldCheck,
      title: '7-Day White-Glove Replacement',
      desc: 'Zero-friction doorstep exchange guarantee for any custom fit or model discrepancy.',
      accent: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      icon: Truck,
      title: 'Insured Express Dispatch',
      desc: 'Real-time SMS tracking with 256-bit encrypted checkout across UPI, NetBanking, and Cards.',
      accent: 'text-[#C5A059]',
    },
  ];

  return (
    <section className="py-14 bg-white dark:bg-[#141113] border-b border-[#EFE7DE] dark:border-[#282127]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#1A161A] border border-[#EFE7DE] dark:border-[#2C242A] flex flex-col justify-between hover:border-[#C5A059]/50 transition-colors shadow-xs"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-white dark:bg-stone-900 shadow-xs flex items-center justify-center mb-4 border border-[#EFE7DE] dark:border-stone-800">
                    <Icon className={`w-5 h-5 ${item.accent}`} />
                  </div>
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
