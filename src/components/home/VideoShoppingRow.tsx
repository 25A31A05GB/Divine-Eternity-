import React, { useState } from 'react';
import { ShoppingBag, Play, Pause, Sparkles, Heart, Eye } from 'lucide-react';
import { Product } from '../../types';
import { PhoneCaseMockup } from '../../utils/productVisuals';
import { useMediaCMS } from '../../context/MediaCMSContext';

interface VideoShoppingRowProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const VideoShoppingRow: React.FC<VideoShoppingRowProps> = ({
  products,
  onQuickView,
}) => {
  const { videoReels } = useMediaCMS();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const activeReels = videoReels.filter((r) => r.isActive);

  return (
    <section className="py-14 bg-[#FAF7F2] dark:bg-[#120F12] border-b border-[#EFE7DE] dark:border-[#282127]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#881337] dark:text-[#FB7185] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Interactive Video Stories</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1917] dark:text-[#F5F0EB]">
              Watch Atelier Craft <span className="italic text-[#881337] dark:text-[#FB7185]">& Shop Direct</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Real micro-engravings, glow tests, and unwrapping reviews from our studio artisans.
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Reel Cards */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1">
          {activeReels.map((reel, idx) => {
            const linkedProduct = products.find((p) => p.id === reel.linkedProductId) || products[idx % products.length];
            if (!linkedProduct) return null;
            const isPlaying = playingIndex === idx;

            return (
              <div
                key={reel.id}
                className="w-[260px] sm:w-[280px] shrink-0 bg-white dark:bg-[#1A161A] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Vertical Reel Video Poster / Video Player Container */}
                <div
                  onClick={() => setPlayingIndex(isPlaying ? null : idx)}
                  className="relative aspect-[9/14] bg-stone-900 overflow-hidden cursor-pointer flex items-center justify-center group"
                >
                  {/* Real HTML5 Video Player if available */}
                  {reel.videoUrl && isPlaying ? (
                    <video
                      src={reel.videoUrl}
                      autoPlay
                      loop
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : reel.posterImage ? (
                    <img
                      src={reel.posterImage}
                      alt={reel.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      {/* Visual Poster Mockup or Image */}
                      <div className="w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                        <PhoneCaseMockup
                          product={linkedProduct}
                          className="w-[180px] h-[280px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Play / Pause Overlay Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-stone-900/90 text-[#881337] dark:text-[#FB7185] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 z-20">
                    <span className="w-2 h-2 rounded-full bg-[#881337] animate-pulse" />
                    <span>Reel {reel.durationSeconds}s</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-[#E5C378] px-2 py-0.5 rounded-md text-[10px] font-mono z-20">
                    {reel.viewsCount} views
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white z-20">
                    <p className="text-xs font-semibold line-clamp-2 leading-snug">
                      {reel.title}
                    </p>
                    <p className="text-[10px] text-stone-300 mt-0.5 truncate">
                      {reel.tagline}
                    </p>
                  </div>
                </div>

                {/* Bottom Product Action Bar */}
                <div className="p-3.5 bg-white dark:bg-[#1A161A] flex items-center justify-between gap-3 border-t border-[#EFE7DE] dark:border-[#282127]">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate font-serif">
                      {linkedProduct.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-bold text-[#881337] dark:text-[#FB7185] tabular-nums">
                        ₹{linkedProduct.price}
                      </span>
                      <span className="text-[10px] text-stone-400 line-through tabular-nums">
                        ₹{linkedProduct.mrp}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onQuickView(linkedProduct)}
                    className="bg-[#1C1917] hover:bg-[#881337] dark:bg-white dark:hover:bg-[#BE123C] text-white dark:text-[#1C1917] hover:text-white dark:hover:text-white px-3 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
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
