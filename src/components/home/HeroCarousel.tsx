import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useMediaCMS } from '../../context/MediaCMSContext';

interface HeroCarouselProps {
  onShopNow: (category?: string) => void;
  onQuickView: (product: Product) => void;
  featuredProducts: Product[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onShopNow,
  onQuickView,
  featuredProducts,
}) => {
  const { heroSlides } = useMediaCMS();
  const activeSlides = heroSlides.filter((s) => s.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { setCouponCode, openCart } = useCart();

  // Auto slide interval (pauses on hover)
  useEffect(() => {
    if (activeSlides.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length, isHovered]);

  // Clamp currentSlide if activeSlides array shrinks
  useEffect(() => {
    if (currentSlide >= activeSlides.length && activeSlides.length > 0) {
      setCurrentSlide(activeSlides.length - 1);
    }
  }, [activeSlides.length, currentSlide]);

  if (!activeSlides.length) return null;

  const slide = activeSlides[currentSlide] || activeSlides[0];
  const featuredProd = featuredProducts.find((p) => p.id === slide.featuredProductId) || featuredProducts[0];

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleSlideClick = () => {
    if (slide.coupon) {
      setCouponCode(slide.coupon);
    }
    if (slide.ctaCategory) {
      onShopNow(slide.ctaCategory);
    } else if (featuredProd) {
      onQuickView(featuredProd);
    } else {
      onShopNow('all');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40; // minimum distance for swipe
    if (diff > threshold) {
      // Swiped Left -> Next Slide
      nextSlide();
    } else if (diff < -threshold) {
      // Swiped Right -> Previous Slide
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Determine slide image source
  const slideImageUrl =
    slide.customImageUrl ||
    featuredProd?.images?.[0] ||
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=80';

  return (
    <section aria-label="Hero Banner Carousel" className="relative w-full overflow-hidden bg-[#FFFDF8]">
      
      {/* Full Screen Edge-to-Edge Banner Slide Container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleSlideClick}
        className="relative w-full h-[60vh] sm:h-[72vh] md:h-[80vh] lg:h-[86vh] xl:h-[90vh] min-h-[400px] max-h-[920px] overflow-hidden bg-stone-950 cursor-pointer group select-none shadow-xl"
      >
        {/* Custom Full-Cover Video if configured */}
        {slide.customVideoUrl ? (
          <video
            ref={videoRef}
            src={slide.customVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="relative w-full h-full overflow-hidden bg-stone-950 flex items-center justify-center">
            {/* Ambient Blurred Background for Ultra Luxury Visual Depth */}
            <img
              src={slideImageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-110 pointer-events-none"
            />
            
            {/* Full Screen Edge-to-Edge High-Fidelity Banner Image */}
            <img
              src={slideImageUrl}
              alt="Hero Banner Slide"
              className="relative z-10 w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=2000&q=85';
              }}
            />
          </div>
        )}

        {/* Previous & Next Navigation Arrows */}
        {activeSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer opacity-80 sm:opacity-0 sm:group-hover:opacity-100 border border-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer opacity-80 sm:opacity-0 sm:group-hover:opacity-100 border border-white/20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </>
        )}

        {/* Bottom Dot Indicators */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white/10">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? 'w-7 h-2.5 bg-[#FF2E93] shadow-md'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5 Value Pillars Navigation Row Below Full-Screen Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {[
            { id: 'products', icon: '🎁', label: 'Bespoke Gifts', sub: 'Names & Jewellery' },
            { id: 'personalization', icon: '✨', label: 'Personalization', sub: 'WhatsApp Direct' },
            { id: 'collaboration', icon: '🤝', label: 'Collaborations', sub: 'Creators & Brands' },
            { id: 'creator-club', icon: '👑', label: 'Creator Club', sub: 'Earn up to ₹7,000' },
            { id: 'podcast', icon: '🎙️', label: 'Podcast & Stories', sub: 'Entrepreneurship' },
          ].map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => onShopNow(pillar.id)}
              className="bg-white hover:bg-[#FFF5F8] backdrop-blur-md px-4 py-3 rounded-2xl border border-[#F3E8E2] shadow-xs hover:shadow-md transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{pillar.icon}</span>
              <div className="min-w-0">
                <div className="text-[13px] font-extrabold text-[#211D1C] group-hover:text-[#FF2E93] transition-colors truncate">
                  {pillar.label}
                </div>
                <div className="text-[11px] text-stone-500 font-medium truncate">
                  {pillar.sub}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
};
