import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '../../types';
import { PhoneCaseMockup } from '../../utils/productVisuals';
import { useCart } from '../../context/CartContext';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setCouponCode, openCart } = useCart();

  const SLIDES = [
    {
      id: 'slide-1',
      eyebrow: 'Bespoke Name Jewelry',
      title: '18k Gold Plated Custom Name Necklaces',
      tagline: 'Handcrafted luxury handwriting pendants in 18k thick gold. Comes in a plush rose velvet jewelry box.',
      coupon: 'LOVE100',
      highlightBadge: 'Most Gifted',
      ctaText: 'Personalize Yours',
      bgGradient: 'from-[#FDF2F4] via-[#FFF9F5] to-[#FFE5EC] dark:from-[#22151E] dark:via-[#141113] dark:to-[#1A1A24]',
      featuredProduct: featuredProducts[0] || null,
      secondaryProduct: featuredProducts[1] || null,
    },
    {
      id: 'slide-2',
      eyebrow: 'Everlasting Romance',
      title: 'Enchanted Real Rose in Glass Cloche',
      tagline: '100% natural preserved rose that blooms for 3-5 years with warm glowing fairy LED lights.',
      coupon: 'BUY3PAY2',
      highlightBadge: 'Valentine Special',
      ctaText: 'Explore Rose Domes',
      bgGradient: 'from-[#FFE5EC] via-[#FFF9F5] to-[#FFF1E6] dark:from-[#22151E] dark:via-[#141113] dark:to-[#201815]',
      featuredProduct: featuredProducts[1] || null,
      secondaryProduct: featuredProducts[2] || null,
    },
    {
      id: 'slide-3',
      eyebrow: 'Viral Music Keepsake',
      title: 'Scannable Spotify Acrylic Song Plaques',
      tagline: 'Your couple photo and favorite song on high-clarity acrylic with an illuminated warm wood stand.',
      coupon: 'FLAT849',
      highlightBadge: 'Couple Favorite',
      ctaText: 'Design Song Plaque',
      bgGradient: 'from-[#EDF2FB] via-[#FFF9F5] to-[#FDF2F4] dark:from-[#171E28] dark:via-[#141113] dark:to-[#22151E]',
      featuredProduct: featuredProducts[2] || null,
      secondaryProduct: featuredProducts[3] || null,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const slide = SLIDES[currentSlide];

  const handleApplyCoupon = (code: string) => {
    setCouponCode(code);
    openCart();
  };

  return (
    <section aria-label="Hero Promotion" className="relative overflow-hidden pt-4 pb-12 sm:pt-6 sm:pb-16 border-b border-[#F5E6E8] dark:border-[#2D252A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Carousel Slide Card Container */}
        <div
          className={`relative rounded-3xl p-6 sm:p-10 lg:p-14 bg-gradient-to-br ${slide.bgGradient} border border-white/80 dark:border-white/10 shadow-lg overflow-hidden transition-all duration-700`}
        >
          {/* Ambient Sparkles */}
          <div className="absolute top-6 left-8 text-xl text-[#E11D48] animate-pulse-glow">✦</div>
          <div className="absolute bottom-10 left-1/3 text-lg text-[#D4AF37] animate-pulse-glow">✦</div>
          <div className="absolute top-1/4 right-8 text-2xl text-[#E11D48]/40">✦</div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Headlines, Promo Badge & CTA */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="flex items-center gap-2">
                <span className="bg-[#E11D48] text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-widest shadow-xs inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
                  {slide.eyebrow}
                </span>
                <span className="bg-white/90 dark:bg-black/60 text-[#231F20] dark:text-white text-[11px] font-bold px-3 py-1 rounded-full border border-pink-200 dark:border-pink-900/40">
                  {slide.highlightBadge}
                </span>
              </div>

              {/* Main Headline with Serif Typography */}
              <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#231F20] dark:text-[#FDF9F7] leading-[1.15]">
                {slide.title.split(' ')[0]}{' '}
                <span className="italic text-[#E11D48]">
                  {slide.title.split(' ').slice(1, 4).join(' ')}
                </span>{' '}
                {slide.title.split(' ').slice(4).join(' ')}
              </h1>

              {/* Tagline */}
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-lg leading-relaxed font-normal">
                {slide.tagline}
              </p>

              {/* Coupon Badge Bar */}
              <div className="bg-white/90 dark:bg-[#1E1A1D]/90 backdrop-blur-md p-3 rounded-2xl border border-pink-200/80 dark:border-pink-900/40 inline-flex flex-wrap items-center gap-3 shadow-xs">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Special Offer Code:
                </span>
                <button
                  onClick={() => handleApplyCoupon(slide.coupon)}
                  className="bg-[#231F20] hover:bg-[#E11D48] text-white px-3 py-1 rounded-xl text-xs font-mono font-bold tracking-wider transition-colors shadow-xs"
                >
                  {slide.coupon}
                </button>
                <span className="text-[11px] text-[#E11D48] font-semibold">
                  (Auto-Applies at Bag)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onShopNow('all')}
                  className="bg-[#E11D48] hover:bg-[#be123c] text-white px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase shadow-lg shadow-pink-500/25 flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {slide.featuredProduct && (
                  <button
                    onClick={() => onQuickView(slide.featuredProduct!)}
                    className="bg-white/90 dark:bg-slate-800/90 hover:bg-white text-[#231F20] dark:text-white px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                  >
                    Quick Customize
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-2 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free 7-Day Replacement</span>
                </span>
                <span>·</span>
                <span>Luxury Velvet Gift Box</span>
                <span>·</span>
                <span>Cash on Delivery</span>
              </div>
            </div>

            {/* Right Column: Visual Duo Showcase */}
            <div className="lg:col-span-5 flex items-center justify-center relative min-h-[380px]">
              {slide.featuredProduct && (
                <div
                  onClick={() => onQuickView(slide.featuredProduct!)}
                  className="relative z-20 cursor-pointer transform hover:scale-105 transition-transform duration-300"
                >
                  <PhoneCaseMockup
                    product={slide.featuredProduct}
                    customText="Isabella"
                    className="w-[210px] h-[340px] sm:w-[230px] sm:h-[370px] drop-shadow-2xl"
                  />
                  <div className="absolute -bottom-2 inset-x-0 mx-auto w-fit bg-white/95 dark:bg-black/80 px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 dark:text-white border border-pink-200 shadow-md">
                    ₹{slide.featuredProduct.price} · Click to Personalize
                  </div>
                </div>
              )}

              {slide.secondaryProduct && (
                <div
                  onClick={() => onQuickView(slide.secondaryProduct!)}
                  className="absolute right-0 sm:right-6 top-6 z-10 opacity-70 hover:opacity-100 transform rotate-6 scale-90 cursor-pointer transition-all duration-300 hidden sm:block"
                >
                  <PhoneCaseMockup
                    product={slide.secondaryProduct}
                    className="w-[180px] h-[320px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    currentSlide === idx
                      ? 'w-8 bg-[#E11D48]'
                      : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-pink-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                aria-label="Previous slide"
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#E11D48] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
                aria-label="Next slide"
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#E11D48] hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
