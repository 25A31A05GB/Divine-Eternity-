import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Volume2, VolumeX, Play, Pause, Check } from 'lucide-react';
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
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [couponApplied, setCouponApplied] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { setCouponCode, openCart } = useCart();

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[currentSlide] || activeSlides[0];

  useEffect(() => {
    setCouponApplied(false);
  }, [currentSlide]);

  if (!slide) return null;

  const featuredProd = featuredProducts.find((p) => p.id === slide.featuredProductId) || featuredProducts[0];
  const secondaryProd = featuredProducts.find((p) => p.id === slide.secondaryProductId) || featuredProducts[1];

  const handleApplyCoupon = (code: string) => {
    setCouponCode(code);
    setCouponApplied(true);
    setTimeout(() => {
      openCart();
    }, 600);
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlayingVideo) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlayingVideo(!isPlayingVideo);
    }
  };

  return (
    <section aria-label="Cute Covers Hero" className="relative overflow-hidden py-4 sm:py-6 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container matching Screenshot 1 */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl min-h-[440px] sm:min-h-[500px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 transition-all duration-700 bg-gradient-to-r from-[#A7E8FC] via-[#7AD6FB] to-[#99DEFC] border border-[#7AD6FB]/40">
          
          {/* Decorative Clouds & Dots matching Screenshot 1 */}
          <div className="absolute top-4 left-6 text-white/40 text-4xl select-none pointer-events-none">☁</div>
          <div className="absolute top-12 right-20 text-white/30 text-5xl select-none pointer-events-none">☁</div>
          <div className="absolute bottom-6 left-12 text-[#FFD94A] text-3xl select-none pointer-events-none">✦</div>
          <div className="absolute top-8 right-1/3 text-[#FF2E93] text-2xl select-none pointer-events-none">★</div>

          {/* Top Tag Bar */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#FF2E93] shadow-xs">
              <span className="text-[#FFD94A]">✦</span>
              <span>CUTE COVERS SPECIAL DEAL</span>
              <span className="text-stone-300">•</span>
              <span className="text-[#211D1C] font-mono uppercase">BUY 2 FOR ₹849</span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-auto py-4">
            
            {/* Left Column: Huge Headline & Offer Code */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-block bg-[#0284C7] text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-sm">
                LIMITED PERIOD OFFER
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0369A1] tracking-tight leading-[1.05] drop-shadow-xs">
                BUY ANY <br className="hidden sm:inline" />
                <span className="text-white drop-shadow-[0_4px_10px_rgba(3,105,161,0.5)]">
                  2 CASES
                </span>{' '}
                FOR <br className="hidden sm:inline" />
                <span className="text-[#FBBF24] drop-shadow-[0_4px_10px_rgba(180,83,9,0.3)]">
                  ₹849
                </span>
              </h1>

              {/* Offer Code Badge */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white flex items-center gap-2.5">
                  <span className="text-xs font-black uppercase text-[#0369A1]">
                    CODE:
                  </span>
                  <button
                    onClick={() => handleApplyCoupon('FLAT849')}
                    className="bg-[#FF2E93] hover:bg-[#e02680] text-white font-mono font-black text-sm px-3.5 py-1 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>FLAT849</span>
                    {couponApplied && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[11px] font-bold text-stone-600 hidden sm:inline">
                    (Click to Apply)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onShopNow('all')}
                  className="bg-[#211D1C] hover:bg-black text-white px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md flex items-center gap-2 transition-all transform active:scale-98 cursor-pointer"
                >
                  <span>Shop The Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {featuredProd && (
                  <button
                    onClick={() => onQuickView(featuredProd)}
                    className="bg-white hover:bg-stone-50 text-[#211D1C] px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm border border-stone-200 shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF2E93]" />
                    <span>Quick Preview</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Visual Case Mockup Showcase */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-sm flex items-center justify-center">
                {featuredProd && (
                  <div
                    onClick={() => onQuickView(featuredProd)}
                    className="relative z-10 w-52 sm:w-64 h-72 sm:h-92 transform hover:scale-105 transition-transform duration-500 cursor-pointer drop-shadow-2xl"
                  >
                    <PhoneCaseMockup
                      product={featuredProd}
                      className="w-full h-full"
                    />
                    
                    {/* Floating Price Pill */}
                    <div className="absolute -bottom-2 right-2 bg-white px-4 py-1.5 rounded-full shadow-lg border border-stone-100 flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#FF2E93] tabular-nums">
                        ₹{featuredProd.price}
                      </span>
                      <span className="text-xs text-stone-400 line-through tabular-nums">
                        ₹{featuredProd.mrp}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Bar: Slide Indicator Dots */}
          <div className="relative z-10 flex items-center justify-end pt-2">
            <div className="bg-[#211D1C]/70 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-white transition-all" />
              <span className="w-2 h-2 rounded-full bg-white/40" />
              <span className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

