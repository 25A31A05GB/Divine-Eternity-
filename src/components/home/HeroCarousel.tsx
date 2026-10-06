import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Play, Pause } from 'lucide-react';
import { Product } from '../../types';
import { PhoneCaseMockup } from '../../utils/productVisuals';
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
  const { setCouponCode, openCart } = useCart();

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[currentSlide] || activeSlides[0];

  if (!slide) return null;

  const featuredProd = featuredProducts.find((p) => p.id === slide.featuredProductId) || featuredProducts[0];
  const secondaryProd = featuredProducts.find((p) => p.id === slide.secondaryProductId) || featuredProducts[1];

  const handleApplyCoupon = (code: string) => {
    setCouponCode(code);
    openCart();
  };

  return (
    <section aria-label="Hero Promotion" className="relative overflow-hidden pt-4 pb-10 sm:pt-6 sm:pb-14 border-b border-[#EFE7DE] dark:border-[#282127]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Carousel Slide Card Container */}
        <div
          className={`relative rounded-3xl p-6 sm:p-10 lg:p-14 bg-gradient-to-br ${slide.bgGradient} border border-[#EFE7DE] dark:border-[#2A2229] shadow-sm overflow-hidden transition-all duration-700`}
        >
          {/* Real Background Video Support if set by Admin */}
          {slide.customVideoUrl && (
            <video
              src={slide.customVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            />
          )}

          {/* Subtle Ambient Gold Accents */}
          <div className="absolute top-6 left-8 text-xl text-[#C5A059] opacity-70 animate-pulse-glow">✦</div>
          <div className="absolute bottom-10 left-1/3 text-lg text-[#C5A059] opacity-50 animate-pulse-glow">✦</div>
          <div className="absolute top-1/4 right-8 text-2xl text-[#881337]/30">✦</div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Headlines, Promo Badge & CTA */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="flex items-center gap-3">
                <span className="bg-[#881337] dark:bg-[#BE123C] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest shadow-xs inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#E5C378]" />
                  {slide.eyebrow}
                </span>
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                  {slide.highlightBadge}
                </span>
              </div>

              {/* Main Headline with Serif Typography */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F0EB] leading-[1.15] text-balance">
                {slide.title.split(' ')[0]}{' '}
                <span className="italic text-[#881337] dark:text-[#FB7185]">
                  {slide.title.split(' ').slice(1, 4).join(' ')}
                </span>{' '}
                {slide.title.split(' ').slice(4).join(' ')}
              </h1>

              {/* Tagline */}
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-lg leading-relaxed font-normal">
                {slide.tagline}
              </p>

              {/* Coupon Badge Bar */}
              {slide.coupon && (
                <div className="bg-white/90 dark:bg-[#1A161A]/90 backdrop-blur-md p-2.5 px-4 rounded-xl border border-[#EFE7DE] dark:border-[#2F252D] inline-flex flex-wrap items-center gap-3 shadow-xs">
                  <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    Special Atelier Code:
                  </span>
                  <button
                    onClick={() => handleApplyCoupon(slide.coupon)}
                    className="bg-[#1C1917] hover:bg-[#881337] dark:bg-white dark:hover:bg-[#BE123C] text-white dark:text-[#1C1917] hover:text-white dark:hover:text-white px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider transition-colors"
                  >
                    {slide.coupon}
                  </button>
                  <span className="text-[11px] text-[#881337] dark:text-[#FB7185] font-semibold">
                    (Click to Apply)
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onShopNow(slide.ctaCategory || 'all')}
                  className="bg-[#881337] hover:bg-[#700f2d] dark:bg-[#BE123C] dark:hover:bg-[#9f1239] text-white px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-widest uppercase shadow-md flex items-center gap-2 transition-all transform active:scale-98"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {featuredProd && (
                  <button
                    onClick={() => onQuickView(featuredProd)}
                    className="bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase border border-[#EFE7DE] dark:border-stone-700 transition-colors shadow-xs"
                  >
                    Quick Customize
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-500 dark:text-stone-400 pt-2 font-medium">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Free 7-Day Replacement</span>
                </span>
                <span>·</span>
                <span>Archival Velvet Packaging</span>
                <span>·</span>
                <span>Insured Express Dispatch</span>
              </div>
            </div>

            {/* Right Column: Visual Showcase Mockup or Custom Image */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-72 sm:w-80 h-96 sm:h-[420px] flex items-center justify-center">
                {slide.customImageUrl ? (
                  <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-[#EFE7DE] dark:border-stone-800 shadow-2xl">
                    <img
                      src={slide.customImageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <>
                    {/* Secondary Product Backdrop Glow */}
                    {secondaryProd && (
                      <div className="absolute -left-6 bottom-4 w-44 h-64 opacity-50 blur-[1px] transform -rotate-12 scale-90 transition-all duration-500 hidden sm:block">
                        <PhoneCaseMockup
                          product={secondaryProd}
                          className="w-full h-full drop-shadow-xl"
                        />
                      </div>
                    )}

                    {/* Primary Slide Product Mockup */}
                    {featuredProd && (
                      <div
                        onClick={() => onQuickView(featuredProd)}
                        className="relative z-10 w-56 sm:w-64 h-80 sm:h-96 transform hover:scale-105 transition-transform duration-500 cursor-pointer drop-shadow-2xl"
                      >
                        <PhoneCaseMockup
                          product={featuredProd}
                          className="w-full h-full"
                        />
                        
                        {/* Floating Price Pill */}
                        <div className="absolute -bottom-2 right-2 bg-white/95 dark:bg-[#1A161A]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-md flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-[#1C1917] dark:text-white tabular-nums">
                            ₹{featuredProd.price}
                          </span>
                          <span className="text-[10px] text-stone-400 line-through tabular-nums">
                            ₹{featuredProd.mrp}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Navigation Dot Indicators */}
          {activeSlides.length > 1 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#EFE7DE]/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                {activeSlides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlide === idx
                        ? 'w-8 bg-[#881337] dark:bg-[#BE123C]'
                        : 'w-2 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                  className="w-8 h-8 rounded-lg bg-white/90 dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-100 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
                  className="w-8 h-8 rounded-lg bg-white/90 dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-100 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
