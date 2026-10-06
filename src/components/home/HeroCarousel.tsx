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
    <section aria-label="Cinematic Tech Hero" className="relative overflow-hidden py-4 sm:py-6 border-b border-[#242C3D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 16:9 Aspect Ratio Hero Container */}
        <div className="relative w-full rounded-3xl border border-[#242C3D] overflow-hidden bg-[#151A24] shadow-2xl min-h-[500px] lg:aspect-[16/9] flex flex-col justify-between p-6 sm:p-10 lg:p-12 transition-all duration-700 group">
          
          {/* Layer 1: Admin-Controlled Dynamic Background Asset */}
          {slide.customVideoUrl ? (
            <video
              ref={videoRef}
              src={slide.customVideoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
            />
          ) : slide.customImageUrl ? (
            <img
              src={slide.customImageUrl}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 scale-102 group-hover:scale-100 transition-transform duration-1000"
            />
          ) : (
            /* Futuristic Tech Mesh Gradient Fallback */
            <div className={`absolute inset-0 z-0 bg-gradient-to-br ${slide.bgGradient || 'from-[#0C1220] via-[#151A24] to-[#08090B]'}`}>
              {/* Subtle Grid Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#5B8CFF 1px, transparent 1px), radial-gradient(#22D3EE 1px, #08090B 1px)`,
                  backgroundSize: '40px 40px',
                  backgroundPosition: '0 0, 20px 20px'
                }}
              />
            </div>
          )}

          {/* Layer 2: Measured Scrim Gradient for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-[#08090B]/70 to-[#08090B]/30 z-1 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090B] via-[#08090B]/85 to-transparent z-1 pointer-events-none" />

          {/* Layer 3: Ambient Glow Accents */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#5B8CFF]/20 rounded-full blur-3xl z-1 pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl z-1 pointer-events-none" />

          {/* Top Bar: Eyebrow Badge & Video Controls */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 bg-[#0C1220]/80 backdrop-blur-md border border-[#242C3D] text-[#5B8CFF] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span className="text-[#F7F4EC]">{slide.eyebrow}</span>
              <span className="text-[#737C8C]">•</span>
              <span className="text-[#22D3EE] font-mono text-[11px] uppercase tracking-wider">{slide.highlightBadge}</span>
            </div>

            {/* Video Controls if background video is active */}
            {slide.customVideoUrl && (
              <div className="flex items-center gap-2 bg-[#0C1220]/80 backdrop-blur-md border border-[#242C3D] p-1.5 rounded-full z-20">
                <button
                  onClick={toggleVideoPlay}
                  className="p-1.5 rounded-full text-[#A7AFBD] hover:text-white hover:bg-[#1B2230] transition-colors"
                  aria-label={isPlayingVideo ? 'Pause background video' : 'Play background video'}
                  title={isPlayingVideo ? 'Pause Video' : 'Play Video'}
                >
                  {isPlayingVideo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={toggleVideoMute}
                  className="p-1.5 rounded-full text-[#A7AFBD] hover:text-white hover:bg-[#1B2230] transition-colors"
                  aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#22D3EE]" />}
                </button>
              </div>
            )}
          </div>

          {/* Main Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-auto py-6">
            
            {/* Left Column: Headline, Copy & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-left">
              
              {/* Dynamic Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F7F4EC] leading-[1.1] text-balance">
                {slide.title.split(' ')[0]}{' '}
                <span className="text-gradient-cyan-blue">
                  {slide.title.split(' ').slice(1, 4).join(' ')}
                </span>{' '}
                {slide.title.split(' ').slice(4).join(' ')}
              </h1>

              {/* Tagline */}
              <p className="text-sm sm:text-base text-[#A7AFBD] max-w-xl leading-relaxed font-normal">
                {slide.tagline}
              </p>

              {/* Coupon Badge Bar */}
              {slide.coupon && (
                <div className="bg-[#0C1220]/90 backdrop-blur-md p-2.5 px-4 rounded-xl border border-[#242C3D] inline-flex flex-wrap items-center gap-3 shadow-md">
                  <span className="text-xs font-medium text-[#A7AFBD]">
                    Exclusive Code:
                  </span>
                  <button
                    onClick={() => handleApplyCoupon(slide.coupon)}
                    className="bg-[#151A24] hover:bg-[#1B2230] text-[#22D3EE] border border-[#22D3EE]/30 px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5"
                  >
                    {couponApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#2DD4BF]" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <>
                        <span>{slide.coupon}</span>
                      </>
                    )}
                  </button>
                  <span className="text-[11px] text-[#2DD4BF] font-medium">
                    (Tap to Apply Code)
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onShopNow(slide.ctaCategory || 'all')}
                  className="gradient-blue-violet hover:opacity-95 text-white px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg flex items-center gap-2 transition-all transform active:scale-98 cursor-pointer"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {featuredProd && (
                  <button
                    onClick={() => onQuickView(featuredProd)}
                    className="bg-[#151A24]/90 hover:bg-[#1B2230] text-[#F7F4EC] px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm tracking-wide border border-[#242C3D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#5B8CFF]" />
                    <span>Quick Customize</span>
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#737C8C] pt-2 font-medium">
                <span className="flex items-center gap-1.5 text-[#2DD4BF]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Precision Guarantee</span>
                </span>
                <span>·</span>
                <span>Archival Packaging</span>
                <span>·</span>
                <span>Express Worldwide Shipping</span>
              </div>
            </div>

            {/* Right Column: Visual Showcase Card / Product Showcase */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-sm aspect-[4/5] sm:aspect-square flex items-center justify-center">
                
                {slide.customImageUrl ? (
                  <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-[#242C3D] shadow-2xl group-hover:border-[#5B8CFF]/50 transition-colors">
                    <img
                      src={slide.customImageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-transparent to-transparent opacity-60" />
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    
                    {/* Secondary Product Backdrop Glow */}
                    {secondaryProd && (
                      <div className="absolute -left-4 bottom-2 w-40 h-60 opacity-40 blur-[1px] transform -rotate-12 scale-90 transition-all duration-500 hidden sm:block pointer-events-none">
                        <PhoneCaseMockup
                          product={secondaryProd}
                          className="w-full h-full"
                        />
                      </div>
                    )}

                    {/* Primary Slide Product Mockup */}
                    {featuredProd && (
                      <div
                        onClick={() => onQuickView(featuredProd)}
                        className="relative z-10 w-52 sm:w-60 h-72 sm:h-88 transform hover:scale-105 transition-transform duration-500 cursor-pointer drop-shadow-2xl"
                      >
                        <PhoneCaseMockup
                          product={featuredProd}
                          className="w-full h-full"
                        />
                        
                        {/* Floating Price Pill */}
                        <div className="absolute -bottom-2 right-2 bg-[#0C1220]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#242C3D] shadow-lg flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#F7F4EC] tabular-nums">
                            ₹{featuredProd.price}
                          </span>
                          <span className="text-xs text-[#737C8C] line-through tabular-nums">
                            ₹{featuredProd.mrp}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Bar: Slide Progress Line & Navigation Controls */}
          {activeSlides.length > 1 && (
            <div className="relative z-10 flex items-center justify-between gap-4 pt-4 border-t border-[#242C3D]">
              
              {/* Counter & Progress */}
              <div className="flex items-center gap-4 flex-1 max-w-xs">
                <span className="text-xs font-mono font-semibold text-[#5B8CFF]">
                  0{currentSlide + 1} <span className="text-[#737C8C]">/ 0{activeSlides.length}</span>
                </span>

                {/* Progress Bar Line */}
                <div className="flex-1 h-1 bg-[#1B2230] rounded-full overflow-hidden">
                  <div 
                    className="h-full gradient-blue-violet transition-all duration-300"
                    style={{ width: `${((currentSlide + 1) / activeSlides.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Prev / Next Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                  className="w-9 h-9 rounded-xl bg-[#0C1220]/80 border border-[#242C3D] flex items-center justify-center text-[#A7AFBD] hover:text-[#F7F4EC] hover:bg-[#1B2230] transition-colors cursor-pointer"
                  aria-label="Previous slide"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
                  className="w-9 h-9 rounded-xl bg-[#0C1220]/80 border border-[#242C3D] flex items-center justify-center text-[#A7AFBD] hover:text-[#F7F4EC] hover:bg-[#1B2230] transition-colors cursor-pointer"
                  aria-label="Next slide"
                  title="Next Slide"
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

