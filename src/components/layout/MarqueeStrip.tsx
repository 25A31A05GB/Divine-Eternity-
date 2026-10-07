import React from 'react';
import { useMediaCMS } from '../../context/MediaCMSContext';

export const MarqueeStrip: React.FC = () => {
  const { marqueeData } = useMediaCMS();

  if (marqueeData?.isVisible === false) {
    return null;
  }

  const messages = marqueeData?.messages && marqueeData.messages.length > 0
    ? marqueeData.messages
    : [
        '✦ DIVINE’S ETERNITY — THE ATELIER OF CHERISHED MOMENTS',
        '✦ 40,000+ CUSTOM KEEPSAKES DELIVERED PAN-INDIA',
        '✦ FLAT ₹100 OFF FIRST ORDER CODE: LOVE100',
        '✦ BUY 3 PAY FOR 2 AUTOMATIC ATELIER OFFER',
      ];

  return (
    <div className="bg-[#FFD94A] text-[#211D1C] py-2.5 overflow-hidden border-y border-[#F5C71A] select-none shadow-xs">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-4 text-xs sm:text-sm font-extrabold tracking-wider uppercase">
            {messages.map((msg, mIdx) => (
              <React.Fragment key={mIdx}>
                <span className="flex items-center gap-1.5 text-[#211D1C]">
                  {msg}
                </span>
                <span className="text-[#211D1C]/40">·</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
