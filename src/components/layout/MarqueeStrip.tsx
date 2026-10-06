import React from 'react';
import { Sparkles } from 'lucide-react';

export const MarqueeStrip: React.FC = () => {
  return (
    <div className="bg-[#0C1220] text-[#F7F4EC] py-2.5 overflow-hidden border-y border-[#242C3D] select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-4 text-xs sm:text-sm font-medium tracking-wide">
            <span className="text-[#5B8CFF] font-semibold">
              Next-Gen Precision Engineering
            </span>
            <span className="bg-[#151A24] text-[#22D3EE] border border-[#242C3D] px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest">
              Tech Accessories & Custom Devices
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
            <span className="text-[#A7AFBD]">Crafted with Precision</span>
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
            <span className="text-[#A7AFBD]">Free Express Global Shipping Above ₹499</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" />
            <span className="text-[#2DD4BF] font-semibold">Bundle Offer Live</span>
            <Sparkles className="w-3.5 h-3.5 text-[#5B8CFF] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

