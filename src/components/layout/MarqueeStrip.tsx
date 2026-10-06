import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const MarqueeStrip: React.FC = () => {
  return (
    <div className="bg-[#FFD94A] text-[#211D1C] py-2.5 overflow-hidden border-y border-[#F5C71A] select-none shadow-xs">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-4 text-xs sm:text-sm font-extrabold tracking-wider uppercase">
            <span className="flex items-center gap-1.5 text-[#FF2E93]">
              <span>✦</span> BUY 3 PAY FOR 2
            </span>
            <span className="text-[#211D1C]/40">·</span>
            <span className="bg-[#211D1C] text-white px-2.5 py-0.5 rounded-full text-[10px] tracking-widest font-bold">
              CUTE COVERS CLUB
            </span>
            <span className="text-[#211D1C]/40">·</span>
            <span className="text-[#211D1C]">FREE SHIPPING ABOVE ₹499</span>
            <span className="text-[#211D1C]/40">·</span>
            <span className="text-[#FF2E93] flex items-center gap-1">
              <span>♡</span> 40,000+ HAPPY PHONES
            </span>
            <span className="text-[#211D1C]/40">·</span>
            <span className="text-[#211D1C]">7-DAY HASSLE-FREE REPLACEMENTS</span>
            <span className="text-[#211D1C]/40">·</span>
          </div>
        ))}
      </div>
    </div>
  );
};

