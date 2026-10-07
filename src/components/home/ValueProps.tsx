import React from 'react';

export const ValueProps: React.FC = () => {
  const FEATURES = [
    {
      icon: '🌸',
      title: 'Thoughtfully packed',
      desc: 'Cute, secure packaging that feels gift-ready.',
    },
    {
      icon: '♡',
      title: 'Easy replacements',
      desc: 'Simple 7-day help for damaged or wrong items.',
    },
    {
      icon: '✦',
      title: 'Here when you need us',
      desc: 'Friendly WhatsApp support for custom names, orders & gifting.',
    },
    {
      icon: '✳',
      title: 'Secure payments',
      desc: 'Trusted checkout with UPI, cards and COD.',
    },
  ];

  return (
    <section className="bg-[#FFD94A] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner Strip */}
        <div className="text-center">
          <p className="font-serif-heading text-lg sm:text-2xl text-[#211D1C]">
            <span className="text-[#FF2E93] mr-2">✦</span>
            Not just a gift.{' '}
            <span className="font-serif italic text-[#FF2E93]">
              A timeless memory for moments that mean everything.
            </span>{' '}
            <span className="text-[#FF2E93] ml-1">♡</span>
          </p>
        </div>

        {/* 4 Feature Cards matching Screenshot 8 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-xs border border-white/60 flex flex-col items-center text-center space-y-3"
            >
              {/* Icon in pale yellow container */}
              <div className="w-12 h-12 rounded-xl bg-[#FFF9DE] border border-[#F5E6B8] flex items-center justify-center text-[#FF2E93] text-xl font-bold shadow-2xs">
                {item.icon}
              </div>
              <h3 className="font-bold text-base text-[#211D1C]">
                {item.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
