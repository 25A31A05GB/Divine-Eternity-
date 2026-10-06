import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Product } from '../../types';
import { PhoneCaseMockup } from '../../utils/productVisuals';
import { useCart } from '../../context/CartContext';
import { useMediaCMS } from '../../context/MediaCMSContext';

interface HeroCarouselProps {
  onShopNow: (category?: string) => void;
  onQuickView: (product: Product) => void;
  featuredProducts: Product[];
}

const HeroPosterCard: React.FC<{ slide: any; coupon: string }> = ({ slide, coupon }) => {
  if (coupon === 'DS1102') {
    // Poster 5: FIRST ORDER ?? Use DS1102 AND AVAIL FLAT 60% OFF
    return (
      <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-3xl bg-gradient-to-br from-[#FFF5F8] via-[#FFFDF8] to-[#FFF0F5] border-4 border-white shadow-2xl p-5 flex flex-col justify-between overflow-hidden text-center select-none">
        <div className="absolute top-3 left-3 bg-[#FF2E93] text-white font-black text-[10px] px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
          First Order Special
        </div>
        <div className="my-auto space-y-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-[#211D1C] font-serif-heading leading-tight">
            FIRST ORDER ??
          </div>
          <div className="bg-[#FF2E93] text-white p-3.5 rounded-2xl shadow-md border-2 border-pink-300">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFD94A]">USE CODE</p>
            <p className="font-mono font-black text-2xl sm:text-3xl text-white tracking-widest my-0.5">DS1102</p>
            <p className="text-xs font-extrabold text-white">AND AVAIL FLAT 60% OFF</p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-stone-700 text-left bg-white p-2.5 rounded-xl border border-pink-100 shadow-2xs">
            <div>☑ Beautiful Hampers</div>
            <div>✓ Bouquets</div>
            <div>✓ Jewellery</div>
            <div>✓ & More... ♡</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold text-[#FF2E93] bg-white p-2 rounded-xl border border-pink-100 shadow-2xs">
          <span>🚚 Fast Delivery</span>
          <span>🛡️ Safe Packaging</span>
          <span>💎 Premium Quality</span>
        </div>
      </div>
    );
  }

  if (coupon === 'CREATOR7K') {
    // Poster 2: EARN 5-7K PER MONTH THROUGH CREATOR CLUB
    return (
      <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-3xl bg-gradient-to-br from-[#FFF0F5] via-[#FFF9EB] to-[#FFF0F5] border-4 border-white shadow-2xl p-5 flex flex-col justify-between overflow-hidden text-center select-none">
        <div className="absolute top-3 left-3 bg-[#D97706] text-white font-black text-[10px] px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
          Creator Opportunities
        </div>
        <div className="my-auto space-y-3">
          <div className="bg-gradient-to-r from-[#FF2E93] to-[#881337] text-white p-3.5 rounded-2xl shadow-md">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD94A]">Divine Creator Club</p>
            <p className="font-serif-heading font-black text-2xl sm:text-3xl tracking-tight leading-tight">EARN 5–7K PER MONTH</p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-stone-700 text-left bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
            <div>☑ Create Reels</div>
            <div>✓ Get Paid</div>
            <div>✓ Be Independent</div>
            <div>✓ Live Your Dream ♡</div>
          </div>
        </div>
        <div className="text-[11px] font-bold text-[#881337] bg-white p-2 rounded-xl border border-pink-100 shadow-2xs">
          Shoot • Create • Grow • Earn ♡
        </div>
      </div>
    );
  }

  if (coupon === 'AFFILIATE15') {
    // Poster 3: LEARN AFFILIATE MARKETING WITH TOP BRANDS
    return (
      <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-3xl bg-gradient-to-br from-[#FFF9EB] via-[#FFFDF8] to-[#FFF0F5] border-4 border-white shadow-2xl p-5 flex flex-col justify-between overflow-hidden text-center select-none">
        <div className="absolute top-3 left-3 bg-emerald-600 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
          Passive Income
        </div>
        <div className="my-auto space-y-3">
          <div className="bg-gradient-to-r from-emerald-800 to-[#211D1C] text-white p-3.5 rounded-2xl shadow-md">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD94A]">Learn & Earn</p>
            <p className="font-serif-heading font-black text-xl sm:text-2xl tracking-tight leading-tight">AFFILIATE MARKETING</p>
            <p className="text-[10px] text-emerald-200 mt-1">With Meesho, Myntra, Amazon & Flipkart</p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-stone-700 text-left bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
            <div>☑ One Time Investment</div>
            <div>✓ Work From Anywhere</div>
            <div>✓ Flexible Time</div>
            <div>✓ Be Your Own Boss ♡</div>
          </div>
        </div>
        <div className="flex items-center justify-around text-[10px] font-extrabold bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-purple-700">Meesho</span>
          <span className="text-rose-600">Myntra</span>
          <span className="text-amber-600">Amazon</span>
          <span className="text-blue-600">Flipkart</span>
        </div>
      </div>
    );
  }

  if (coupon === 'MEMORABLE') {
    // Poster 4: MAKE YOUR SPECIAL ONES DAY MEMORABLE
    return (
      <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-3xl bg-gradient-to-br from-[#FFF0F5] via-[#FFFDF8] to-[#FFF9EB] border-4 border-white shadow-2xl p-5 flex flex-col justify-between overflow-hidden text-center select-none">
        <div className="absolute top-3 left-3 bg-[#FF2E93] text-white font-black text-[10px] px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
          Thoughtful Surprises
        </div>
        <div className="my-auto space-y-3">
          <div className="bg-gradient-to-r from-[#FF2E93] via-[#e02680] to-[#881337] text-white p-3.5 rounded-2xl shadow-md">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD94A]">Prettiest Surprises ♡</p>
            <p className="font-serif-heading font-black text-xl sm:text-2xl tracking-tight leading-tight">MAKE YOUR SPECIAL ONES DAY MEMORABLE</p>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-pink-100 text-xs font-bold text-stone-700 shadow-2xs">
            Bouquets ♡ Hampers ♡ Gifts ♡ Frames ♡ Jewellery & More... ♡
          </div>
        </div>
        <div className="text-[11px] font-bold text-[#FF2E93] bg-white p-2 rounded-xl border border-pink-100 shadow-2xs">
          Because they deserve the prettiest surprises ♡
        </div>
      </div>
    );
  }

  // Default Poster 1: YOUR GO-TO-GO PLATFORM
  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-3xl bg-gradient-to-br from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB] border-4 border-white shadow-2xl p-5 flex flex-col justify-between overflow-hidden text-center select-none">
      <div className="absolute top-3 left-3 bg-[#211D1C] text-[#FFD94A] font-black text-[10px] px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
        Cute Things Inside ♡
      </div>
      <div className="my-auto space-y-3">
        <div className="bg-gradient-to-r from-[#211D1C] to-[#881337] text-white p-4 rounded-2xl shadow-md">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD94A]">Divine’s Eternity</p>
          <p className="font-serif-heading font-black text-2xl sm:text-3xl tracking-tight leading-tight">YOUR GO-TO-GO PLATFORM</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-pink-100 text-xs font-bold text-stone-700 shadow-2xs">
          Hampers ♡ Bouquets ♡ Jewellery & More... ♡
        </div>
      </div>
      <div className="text-[11px] font-bold text-[#FF2E93] bg-white p-2 rounded-xl border border-pink-100 shadow-2xs">
        Thoughtful gifts for every special moment ♡
      </div>
    </div>
  );
};

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onShopNow,
  onQuickView,
  featuredProducts,
}) => {
  const { heroSlides } = useMediaCMS();
  const activeSlides = heroSlides.filter((s) => s.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { setCouponCode, openCart } = useCart();

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[currentSlide] || activeSlides[0];

  useEffect(() => {
    setCouponApplied(false);
  }, [currentSlide]);

  // Clamp currentSlide if activeSlides shrinks
  useEffect(() => {
    if (currentSlide >= activeSlides.length && activeSlides.length > 0) {
      setCurrentSlide(activeSlides.length - 1);
    }
  }, [activeSlides.length, currentSlide]);

  if (!slide) return null;

  const featuredProd = featuredProducts.find((p) => p.id === slide.featuredProductId) || featuredProducts[0];

  const handleApplyCoupon = (code: string) => {
    if (!code) return;
    setCouponCode(code);
    setCouponApplied(true);
    setTimeout(() => {
      openCart();
    }, 600);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <section aria-label="Hero Banner Carousel" className="relative overflow-hidden py-4 sm:py-6 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl min-h-[440px] sm:min-h-[500px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 transition-all duration-700 bg-gradient-to-br from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB] border border-[#F3E8E2]">
          
          {/* Custom Background Video if specified in Admin */}
          {slide.customVideoUrl && (
            <video
              ref={videoRef}
              src={slide.customVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            />
          )}

          {/* Decorative Sparkles */}
          <div className="absolute top-4 left-6 text-[#FF2E93]/30 text-4xl select-none pointer-events-none">✦</div>
          <div className="absolute top-12 right-20 text-[#FFD94A]/40 text-5xl select-none pointer-events-none">✦</div>
          <div className="absolute bottom-6 left-12 text-[#FFD94A] text-3xl select-none pointer-events-none">★</div>

          {/* Top Tag Bar */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#FF2E93] border border-[#F3E8E2] shadow-xs">
              <span className="text-[#FFD94A]">✦</span>
              <span className="uppercase tracking-wider">{slide.eyebrow || 'Divine’s Eternity Special'}</span>
              {slide.highlightBadge && (
                <>
                  <span className="text-stone-300">•</span>
                  <span className="text-[#211D1C] font-mono uppercase">{slide.highlightBadge}</span>
                </>
              )}
            </div>

            {/* Prev / Next controls */}
            {activeSlides.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#211D1C] flex items-center justify-center shadow-xs transition-all cursor-pointer"
                  title="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#211D1C] flex items-center justify-center shadow-xs transition-all cursor-pointer"
                  title="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Main Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-auto py-4">
            
            {/* Left Column: Dynamic Headline & Offer Code */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-block bg-[#211D1C] text-[#FFD94A] px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-xs">
                {slide.highlightBadge || 'ATELIER SPECIAL'}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-heading font-bold text-[#211D1C] tracking-tight leading-[1.1] drop-shadow-2xs">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
                {slide.tagline}
              </p>

              {/* Special Poster Sub-Highlights for specific slides */}
              {slide.coupon === 'DS1102' && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-stone-700">
                  <span className="bg-[#FFF0F5] border border-pink-200 text-[#FF2E93] px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                    🚚 Fast Delivery
                  </span>
                  <span className="bg-[#FFF0F5] border border-pink-200 text-[#FF2E93] px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                    🛡️ Safe Packaging
                  </span>
                  <span className="bg-[#FFF0F5] border border-pink-200 text-[#FF2E93] px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                    💎 Premium Quality
                  </span>
                </div>
              )}

              {slide.coupon === 'AFFILIATE15' && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-extrabold text-stone-800">
                  <span className="bg-white border border-[#F3E8E2] px-2.5 py-1 rounded-lg shadow-2xs">
                    🛍️ Meesho
                  </span>
                  <span className="bg-white border border-[#F3E8E2] px-2.5 py-1 rounded-lg shadow-2xs text-rose-600">
                    👗 Myntra
                  </span>
                  <span className="bg-white border border-[#F3E8E2] px-2.5 py-1 rounded-lg shadow-2xs text-amber-600">
                    📦 Amazon
                  </span>
                  <span className="bg-white border border-[#F3E8E2] px-2.5 py-1 rounded-lg shadow-2xs text-blue-600">
                    ⚡ Flipkart
                  </span>
                </div>
              )}

              {slide.coupon === 'CREATOR7K' && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-stone-700">
                  <span className="bg-[#FFF9EB] border border-[#F5E6CE] text-[#D97706] px-3 py-1 rounded-full flex items-center gap-1">
                    ✓ Create Reels
                  </span>
                  <span className="bg-[#FFF9EB] border border-[#F5E6CE] text-[#D97706] px-3 py-1 rounded-full flex items-center gap-1">
                    ✓ Get Paid
                  </span>
                  <span className="bg-[#FFF9EB] border border-[#F5E6CE] text-[#D97706] px-3 py-1 rounded-full flex items-center gap-1">
                    ✓ Live Your Dream
                  </span>
                </div>
              )}

              {/* Offer Code Badge */}
              {slide.coupon && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xs border border-[#F3E8E2] flex items-center gap-2.5">
                    <span className="text-xs font-bold uppercase text-stone-500">
                      SPECIAL CODE:
                    </span>
                    <button
                      onClick={() => handleApplyCoupon(slide.coupon || 'LOVE100')}
                      className="bg-[#FF2E93] hover:bg-[#e02680] text-white font-mono font-bold text-xs sm:text-sm px-3.5 py-1 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{slide.coupon}</span>
                      {couponApplied ? <Check className="w-3.5 h-3.5" /> : null}
                    </button>
                    <span className="text-[11px] font-bold text-stone-500 hidden sm:inline">
                      {couponApplied ? 'Applied!' : '(Click to Apply)'}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onShopNow(slide.ctaCategory || 'all')}
                  className="bg-[#211D1C] hover:bg-black text-white px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md flex items-center gap-2 transition-all transform active:scale-98 cursor-pointer"
                >
                  <span>{slide.ctaText || 'Shop Collection'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {featuredProd && (
                  <button
                    onClick={() => onQuickView(featuredProd)}
                    className="bg-white hover:bg-stone-50 text-[#211D1C] px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm border border-[#E7E2DA] shadow-xs transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF2E93]" />
                    <span>Quick Preview</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Dynamic Image or Mockup */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-sm flex items-center justify-center">
                {slide.customImageUrl || featuredProd?.images?.[0] ? (
                  <div
                    onClick={() => featuredProd && onQuickView(featuredProd)}
                    className="relative z-10 w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group cursor-pointer"
                  >
                    <img
                      src={slide.customImageUrl || featuredProd?.images?.[0]}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    
                    {/* Floating Price Pill */}
                    {featuredProd && (
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-[#F3E8E2] flex items-center gap-2 z-20">
                        <span className="font-extrabold text-sm text-[#FF2E93] tabular-nums">
                          ₹{featuredProd.price}
                        </span>
                        <span className="text-xs text-stone-400 line-through tabular-nums">
                          ₹{featuredProd.mrp}
                        </span>
                      </div>
                    )}
                  </div>
                ) : featuredProd ? (
                  <div
                    onClick={() => onQuickView(featuredProd)}
                    className="relative z-10 w-52 sm:w-64 h-72 sm:h-92 transform hover:scale-105 transition-transform duration-500 cursor-pointer drop-shadow-2xl"
                  >
                    <PhoneCaseMockup
                      product={featuredProd}
                      className="w-full h-full"
                    />
                    
                    {/* Floating Price Pill */}
                    <div className="absolute -bottom-2 right-2 bg-white px-4 py-1.5 rounded-full shadow-lg border border-[#F3E8E2] flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#FF2E93] tabular-nums">
                        ₹{featuredProd.price}
                      </span>
                      <span className="text-xs text-stone-400 line-through tabular-nums">
                        ₹{featuredProd.mrp}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

          </div>

          {/* Hero Floating 5 Value Pillars */}
          <div className="relative z-10 pt-4 border-t border-[#F3E8E2] mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
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
                className="bg-white/90 hover:bg-white backdrop-blur-md px-3 py-2 rounded-2xl border border-[#F3E8E2] shadow-2xs hover:shadow-xs transition-all flex items-center gap-2.5 text-left cursor-pointer group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">{pillar.icon}</span>
                <div className="min-w-0">
                  <div className="text-[11px] font-extrabold text-[#211D1C] group-hover:text-[#FF2E93] transition-colors truncate">
                    {pillar.label}
                  </div>
                  <div className="text-[9px] text-stone-500 font-medium truncate">
                    {pillar.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom Bar: Dynamic Slide Indicator Dots */}
          {activeSlides.length > 1 && (
            <div className="relative z-10 flex items-center justify-end pt-2">
              <div className="bg-[#211D1C]/80 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 shadow-xs">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`rounded-full transition-all cursor-pointer ${
                      currentSlide === idx
                        ? 'w-5 h-2 bg-[#FF2E93]'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
