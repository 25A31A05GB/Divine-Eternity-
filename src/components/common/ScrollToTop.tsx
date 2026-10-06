import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#231F20] dark:bg-white text-white dark:text-[#231F20] hover:bg-[#F0508C] dark:hover:bg-[#F0508C] dark:hover:text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 border-2 border-white/20 dark:border-black/20"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
