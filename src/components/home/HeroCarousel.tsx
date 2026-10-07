import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useMediaCMS } from '../../context/MediaCMSContext';

interface HeroCarouselProps {
  onShopNow: (category?: string) => void;
  onQuickView: (product: Product) => void;
  featuredProducts: Product[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onShopNow }) => {
  const { heroSlides } = useMediaCMS();
  const activeSlides = heroSlides.filter((s) => s.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused]);

  // Clamp currentSlide if activeSlides shrinks
  useEffect(() => {
    if (currentSlide >= activeSlides.length && activeSlides.length > 0) {
      setCurrentSlide(activeSlides.length - 1);
    }
  }, [activeSlides.length, currentSlide]);

  if (!activeSlides.length) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <section
      aria-label="Hero Carousel"
      className="relative w-full p-0 m-0 overflow-hidden bg-[#FFFDF8]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 100% Edge-to-Edge Full-Bleed Carousel — Absolutely 0 space on left and right */}
      <div className="relative w-full h-[100vw] sm:h-[65vw] md:h-[700px] lg:h-[800px] xl:h-[860px] max-h-[92vh] min-h-[360px] overflow-hidden group select-none">
        
        {/* Slides: Completely ONLY Image, 100% full width */}
        {activeSlides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            onClick={() => onShopNow(slide.ctaCategory || 'all')}
            className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-700 ease-in-out ${
              idx === currentSlide
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.customImageUrl}
              alt={`Hero Slide ${idx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center select-none"
            />
          </div>
        ))}

        {/* Navigation Controls: Previous Button */}
        {activeSlides.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/35 hover:bg-black/65 text-white backdrop-blur-md flex items-center justify-center shadow-2xl transition-all opacity-85 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </button>
        )}

        {/* Navigation Controls: Next Button */}
        {activeSlides.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/35 hover:bg-black/65 text-white backdrop-blur-md flex items-center justify-center shadow-2xl transition-all opacity-85 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </button>
        )}

        {/* Navigation Dots Indicator */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-black/35 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-8 h-2.5 bg-white shadow-xs'
                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
