import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Copy, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ANNOUNCEMENTS = [
  { text: '✨ ANY 2 CASES FOR ₹849 – CODE: ', code: 'FLAT849', highlight: 'FLAT849' },
  { text: '🎁 BUY 3 PAY FOR 2 – CHEAPEST CASE IS 100% FREE', code: 'BUY3PAY2', highlight: 'Auto-Applied' },
  { text: '⚡ BUY 1 CASE, GET ₹100 OFF – CODE: ', code: 'LOVE100', highlight: 'LOVE100' },
  { text: '🚚 FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹499', code: '', highlight: 'Pan-India' },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { setCouponCode, openCart } = useCart();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const current = ANNOUNCEMENTS[currentIndex];

  const handleCopyCode = (code: string) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCouponCode(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    openCart();
  };

  return (
    <aside aria-label="Special Offers" className="bg-[#231F20] text-[#FFF8F4] text-xs py-2 px-3 relative z-50 border-b border-pink-900/40 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="p-1 hover:text-[#F0508C] transition-colors rounded-full focus:outline-none"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD94A] animate-spin hidden sm:inline" />
          <span>{current.text}</span>
          {current.code ? (
            <button
              onClick={() => handleCopyCode(current.code)}
              className="inline-flex items-center gap-1 bg-[#F0508C] hover:bg-[#d63b74] text-white px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wider transition-all transform active:scale-95 shadow-xs"
              title="Click to copy and apply in cart"
            >
              {current.code}
              {copied ? <Check className="w-2.5 h-2.5 text-white" /> : <Copy className="w-2.5 h-2.5 opacity-80" />}
            </button>
          ) : (
            <span className="text-[#FFD94A] font-bold underline decoration-pink-500">
              {current.highlight}
            </span>
          )}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next announcement"
          className="p-1 hover:text-[#F0508C] transition-colors rounded-full focus:outline-none"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
