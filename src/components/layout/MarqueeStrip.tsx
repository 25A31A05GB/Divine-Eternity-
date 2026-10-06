import React from 'react';

export const MarqueeStrip: React.FC = () => {
  return (
    <div className="bg-[#FFD94A] text-[#231F20] py-3 overflow-hidden border-y-2 border-[#231F20] select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-4 text-xs sm:text-sm font-bold tracking-wide">
            <span className="font-serif-heading text-base sm:text-lg italic font-normal">
              Not just a phone case.
            </span>
            <span className="bg-[#231F20] text-white px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">
              A tiny outfit for the thing you hold all day
            </span>
            <span className="text-[#F0508C] text-lg">✦</span>
            <span>Handcrafted with Love</span>
            <span className="text-[#F0508C] text-lg">✦</span>
            <span>Free Express Shipping Above ₹499</span>
            <span className="text-[#F0508C] text-lg">✦</span>
            <span>Buy 3 Pay For 2 Offer Live</span>
            <span className="text-[#F0508C] text-lg">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
