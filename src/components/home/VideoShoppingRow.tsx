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
    <section className="py-14 bg-[#0A0D14] border-b border-[#232F42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#06B6D4] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Interactive Video Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F8FAFC] tracking-tight">
              Watch Atelier Craft <span className="text-gradient-cyan-blue">& Shop Direct</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
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
                className="w-[260px] sm:w-[280px] shrink-0 bg-[#151D2A] rounded-2xl border border-[#232F42] overflow-hidden shadow-md hover:shadow-2xl hover:border-[#3B82F6]/50 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Vertical Reel Video Poster / Video Player Container */}
                <div
                  onClick={() => setPlayingIndex(isPlaying ? null : idx)}
                  className="relative aspect-[9/14] bg-[#0F1420] overflow-hidden cursor-pointer flex items-center justify-center group"
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#151D2A]/90 border border-[#232F42] text-[#06B6D4] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-5 h-5 fill-current text-[#2DD4BF]" /> : <Play className="w-5 h-5 fill-current text-[#3B82F6] ml-0.5" />}
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 bg-[#0A0D14]/80 backdrop-blur-md text-[#F8FAFC] border border-[#232F42] px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 z-20">
                    <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
                    <span>Reel {reel.durationSeconds}s</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-[#0A0D14]/80 backdrop-blur-md text-[#FCD34D] border border-[#232F42] px-2 py-0.5 rounded-md text-[10px] font-mono z-20">
                    {reel.viewsCount} views
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/70 to-transparent text-[#F8FAFC] z-20">
                    <p className="text-xs font-semibold line-clamp-2 leading-snug">
                      {reel.title}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                      {reel.tagline}
                    </p>
                  </div>
                </div>

                {/* Bottom Product Action Bar */}
                <div className="p-3.5 bg-[#151D2A] flex items-center justify-between gap-3 border-t border-[#232F42]">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#F8FAFC] truncate">
                      {linkedProduct.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-bold text-[#2DD4BF] tabular-nums font-mono">
                        ₹{linkedProduct.price}
                      </span>
                      <span className="text-[10px] text-[#64748B] line-through tabular-nums font-mono">
                        ₹{linkedProduct.mrp}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onQuickView(linkedProduct)}
                    className="gradient-blue-violet hover:opacity-95 text-white px-3 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
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
