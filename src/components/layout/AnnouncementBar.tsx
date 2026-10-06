import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Copy, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useMediaCMS } from '../../context/MediaCMSContext';

export const AnnouncementBar: React.FC = () => {
  const { announcements } = useMediaCMS();
  const activeAnnouncements = announcements.filter((a) => a.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { setCouponCode, openCart } = useCart();

  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeAnnouncements.length]);

  if (activeAnnouncements.length === 0) return null;

  const current = activeAnnouncements[currentIndex] || activeAnnouncements[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  const handleCopyCode = (code: string) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCouponCode(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    openCart();
  };

  return (
    <aside aria-label="Special Offers" className="bg-[#FFF0F3] text-[#211D1C] text-xs py-2.5 px-3 relative z-50 border-b border-[#FFE0E6] select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="p-1 text-[#211D1C] hover:text-[#FF2E93] transition-colors rounded-full focus:outline-none"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-2 text-center text-xs font-semibold tracking-wide">
          <span className="text-[#FF2E93] text-sm">✦</span>
          <span>{current.text || "Buy 1 Case, Get ₹100 Off"}</span>
          {current.code ? (
            <button
              onClick={() => handleCopyCode(current.code)}
              className="inline-flex items-center gap-1 bg-[#FF2E93] hover:bg-[#e02680] text-white px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wider transition-all transform active:scale-95 shadow-xs"
              title="Click to copy and apply in cart"
            >
              {current.code}
              {copied ? <Check className="w-2.5 h-2.5 text-white" /> : <Copy className="w-2.5 h-2.5 opacity-90" />}
            </button>
          ) : current.highlight ? (
            <span className="text-[#FF2E93] font-bold">
              {current.highlight}
            </span>
          ) : null}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next announcement"
          className="p-1 text-[#211D1C] hover:text-[#FF2E93] transition-colors rounded-full focus:outline-none"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
