import React from 'react';
import { PackageOpen, RefreshCw, Headphones, ShieldCheck } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const FEATURES = [
    {
      icon: PackageOpen,
      title: 'Thoughtfully Packed',
      desc: 'Wrapped in aesthetic silk tissue, protective bubble boxes, and collectible holographic stickers.',
      accent: 'text-[#F0508C]',
    },
    {
      icon: RefreshCw,
      title: 'Easy Replacements',
      desc: 'Zero-friction 7-day doorstep replacement if you switch models or need a different fit.',
      accent: 'text-[#FFD94A]',
    },
    {
      icon: Headphones,
      title: 'Here When You Need Us',
      desc: 'Real human assistance on WhatsApp and email. Monday through Saturday support.',
      accent: 'text-sky-500',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      desc: 'Military grade 256-bit encrypted checkout with UPI, Card, NetBanking & COD.',
      accent: 'text-emerald-500',
    },
  ];

  return (
    <section className="py-14 bg-white dark:bg-[#1E1A1D] border-b border-[#F3E8E2] dark:border-[#2D252A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FFF8F4] dark:bg-[#141113] border border-[#F3E8E2] dark:border-[#2D252A] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 border border-pink-100 dark:border-pink-950/40">
                    <Icon className={`w-6 h-6 ${item.accent}`} />
                  </div>
                  <h3 className="font-serif-heading text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
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
