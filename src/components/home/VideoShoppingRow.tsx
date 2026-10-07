import React, { useState } from 'react';
import { ShoppingBag, Play, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useMediaCMS } from '../../context/MediaCMSContext';

interface VideoShoppingRowProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const VideoShoppingRow: React.FC<VideoShoppingRowProps> = ({
  products,
  onQuickView,
}) => {
  const { videoReels, videoSection } = useMediaCMS();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  if (videoSection?.isVisible === false) {
    return null;
  }

  const activeReels = videoReels.filter((r) => r.isActive !== false);
  if (activeReels.length === 0) return null;

  const eyebrow = videoSection?.eyebrow || '✦ LIVE ATELIER SHOWCASE & UNBOXING';
  const titlePrefix = videoSection?.titlePrefix || 'Watch It';
  const titleHighlight = videoSection?.titleHighlight || 'And Buy It';
  const subtitle = videoSection?.subtitle || 'Real customer unboxings, custom handwriting engraving tests, and eternal rose dome night glows.';

  return (
    <section className="py-14 sm:py-20 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Heading */}
        <div className="text-center mb-10">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center justify-center gap-1.5 mb-1">
            <span>{eyebrow}</span>
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            {titlePrefix} <span className="font-serif italic text-[#FF2E93]">{titleHighlight}</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Shoppable Video Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeReels.map((reel, idx) => {
            const linkedProduct = products.find((p) => p.id === reel.linkedProductId) || products[idx % products.length];
            if (!linkedProduct) return null;
            const isPlaying = playingIndex === idx;

            return (
              <div
                key={reel.id}
                className="relative rounded-2xl overflow-hidden bg-white border border-[#F3E8E2] shadow-sm flex flex-col justify-between group"
              >
                {/* Vertical Video Area */}
                <div
                  onClick={() => setPlayingIndex(isPlaying ? null : idx)}
                  className="relative aspect-[9/15] bg-stone-100 overflow-hidden cursor-pointer flex items-center justify-center"
                >
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={linkedProduct.images[0]}
                      alt={linkedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Shopping Bag Badge on top-right */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center shadow-md z-20">
                    <ShoppingBag className="w-4 h-4" />
                  </div>

                  {/* Play icon overlay if paused */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-[#211D1C] flex items-center justify-center shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* View count & duration badge */}
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-bold z-20 flex items-center gap-1">
                    <span>{reel.viewsCount || '48k'} views</span>
                  </div>

                  {/* Bottom title preview on poster */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white z-20">
                    <p className="text-xs font-bold line-clamp-1">
                      {reel.title}
                    </p>
                  </div>
                </div>

                {/* Bottom Add To Cart Black Bar */}
                <button
                  onClick={() => onQuickView(linkedProduct)}
                  className="w-full bg-[#211D1C] hover:bg-[#FF2E93] text-white py-3 px-4 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="mx-auto">Add To Cart (₹{linkedProduct.price})</span>
                  <span className="text-[10px]">▼</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
