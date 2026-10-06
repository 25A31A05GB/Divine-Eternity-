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
    <aside aria-label="Special Offers" className="bg-[#0C1220] text-[#F7F4EC] text-xs py-2 px-3 relative z-50 border-b border-[#242C3D] select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="p-1 hover:text-[#22D3EE] transition-colors rounded-full focus:outline-none text-[#A7AFBD]"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse hidden sm:inline" />
          <span>{current.text}</span>
          {current.code ? (
            <button
              onClick={() => handleCopyCode(current.code)}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-[#22D3EE] to-[#5B8CFF] hover:opacity-90 text-[#08090B] px-2.5 py-0.5 rounded-full font-extrabold text-[10px] tracking-wider transition-all transform active:scale-95 shadow-xs"
              title="Click to copy and apply in cart"
            >
              {current.code}
              {copied ? <Check className="w-2.5 h-2.5 text-[#08090B]" /> : <Copy className="w-2.5 h-2.5 opacity-90" />}
            </button>
          ) : (
            <span className="text-[#22D3EE] font-bold underline decoration-[#5B8CFF]">
              {current.highlight}
            </span>
          )}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next announcement"
          className="p-1 hover:text-[#22D3EE] transition-colors rounded-full focus:outline-none text-[#A7AFBD]"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
