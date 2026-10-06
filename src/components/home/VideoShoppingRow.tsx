import React, { useState } from 'react';
import { ShoppingBag, ChevronDown, Play, Sparkles, Heart } from 'lucide-react';
import { Product } from '../../types';
import { PhoneCaseMockup } from '../../utils/productVisuals';

interface VideoShoppingRowProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const VideoShoppingRow: React.FC<VideoShoppingRowProps> = ({
  products,
  onQuickView,
}) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(0);

  const VIDEO_REELS = [
    {
      title: 'Styling the Pearl Bracelet Case with Gold Jewelry ✨',
      product: products[0],
      duration: '0:15',
      likes: '12.4k',
      gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    },
    {
      title: 'How much actually fits in the Blush Zipper Wallet Case? 👝',
      product: products[1],
      duration: '0:18',
      likes: '9.8k',
      gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    },
    {
      title: 'Real HD Mirror Selfie Test in direct sunlight 🪞',
      product: products[2],
      duration: '0:12',
      likes: '24.1k',
      gradient: 'from-amber-500/20 via-pink-500/10 to-transparent',
    },
    {
      title: 'Coquette Velvet Bow Case Unboxing & Custom Name reveal 🎀',
      product: products[4] || products[0],
      duration: '0:22',
      likes: '15.6k',
      gradient: 'from-sky-500/20 via-pink-500/10 to-transparent',
    },
  ];

  return (
    <section className="py-14 bg-[#FFF8F4] dark:bg-[#141113]/60 border-b border-[#F3E8E2] dark:border-[#2D252A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F0508C] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span>Interactive Reels</span>
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#231F20] dark:text-[#FDF9F7]">
              Watch It <span className="italic text-[#F0508C]">And Buy It</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real aesthetics, drop tests, and styling inspiration from our creators.
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Reel Cards */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1">
          {VIDEO_REELS.map((reel, idx) => {
            if (!reel.product) return null;
            const isPlaying = playingIndex === idx;

            return (
              <div
                key={idx}
                className="w-[260px] sm:w-[280px] shrink-0 bg-white dark:bg-[#1E1A1D] rounded-3xl border border-[#F3E8E2] dark:border-[#2D252A] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Vertical Reel Video Poster / Visual Container (9:16 ratio style) */}
                <div
                  onClick={() => setPlayingIndex(isPlaying ? null : idx)}
                  className="relative aspect-[9/14] bg-[#FFF0F5] dark:bg-black/40 overflow-hidden cursor-pointer flex items-center justify-center group"
                >
                  {/* Subtle video background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${reel.gradient}`} />

                  {/* Visual Case Mockup */}
                  <div className={`transform transition-transform duration-500 ${isPlaying ? 'scale-105 rotate-1 animate-pulse' : 'group-hover:scale-105'}`}>
                    <PhoneCaseMockup
                      product={reel.product}
                      customText={idx === 3 ? 'Aesthetic' : undefined}
                      className="w-[180px] h-[280px]"
                    />
                  </div>

                  {/* Play / Reel Badge Overlay */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 z-20">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>Reel {reel.duration}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 z-20">
                    <Heart className="w-3 h-3 text-pink-400 fill-current" />
                    <span>{reel.likes}</span>
                  </div>

                  {/* Center Play Button if paused */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors z-20">
                      <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-black/80 text-[#F0508C] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Video Title Gradient Scrim */}
                  <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white z-20">
                    <p className="text-xs font-semibold line-clamp-2 leading-snug">
                      {reel.title}
                    </p>
                  </div>
                </div>

                {/* Bottom Product Info & Direct Add To Cart Dropdown Button */}
                <div className="p-3.5 bg-white dark:bg-[#1E1A1D] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#231F20] dark:text-white truncate">
                        {reel.product.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-extrabold text-[#F0508C]">
                          ₹{reel.product.price}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{reel.product.mrp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add To Cart with Dropdown Arrow button as requested */}
                  <button
                    onClick={() => onQuickView(reel.product)}
                    className="w-full bg-[#231F20] hover:bg-[#F0508C] text-white py-2 px-3 rounded-full text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-between shadow-xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add To Cart</span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
