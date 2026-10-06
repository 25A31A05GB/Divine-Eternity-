import React, { useState } from 'react';
import { Heart, Star, Eye, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useReviews } from '../../context/ReviewsContext';
import { PhoneCaseMockup } from '../../utils/productVisuals';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onOpenDetail }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getProductRatingStats } = useReviews();

  const wishlisted = isInWishlist(product.id);
  const { averageRating, totalReviews } = getProductRatingStats(
    product.id,
    product.rating,
    product.reviewCount
  );

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div
      className="group relative bg-white dark:bg-[#181519] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#C5A059]/40 transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Media Area with Product Mockup & Editorial Badges */}
      <div className="relative aspect-[4/5] w-full bg-[#FAF7F2] dark:bg-black/30 overflow-hidden cursor-pointer">
        {/* Visual Mockup */}
        <div
          onClick={() => (onOpenDetail ? onOpenDetail(product) : onQuickView(product))}
          className="w-full h-full"
        >
          <PhoneCaseMockup
            product={product}
            isHovered={isHovered}
            className="w-full h-full transform transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Editorial Text Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-20 pointer-events-none">
          {product.badge && (
            <span className="bg-[#881337] dark:bg-[#BE123C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wider uppercase shadow-xs">
              {product.badge}
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#C5A059] text-stone-950 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider w-fit">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm ${
            wishlisted
              ? 'bg-[#881337] text-white'
              : 'bg-white/85 dark:bg-stone-900/80 text-stone-700 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-900 hover:text-[#881337]'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Floating Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hidden sm:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-[#1C1917]/95 dark:bg-white/95 hover:bg-[#881337] dark:hover:bg-[#BE123C] text-white dark:text-[#1C1917] hover:text-white dark:hover:text-white py-2.5 px-3 rounded-xl text-xs font-bold tracking-wider uppercase backdrop-blur-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View & Engrave</span>
          </button>
        </div>
      </div>

      {/* Card Info Area */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#881337] dark:text-[#FB7185] truncate max-w-[65%]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-medium text-stone-700 dark:text-stone-300">
              <Star className="w-3 h-3 text-[#C5A059] fill-[#C5A059]" />
              <span className="tabular-nums font-bold">{averageRating}</span>
              <span className="text-stone-400">({totalReviews})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => (onOpenDetail ? onOpenDetail(product) : onQuickView(product))}
            className="font-serif text-sm sm:text-base font-bold text-[#1C1917] dark:text-[#F5F0EB] line-clamp-1 hover:text-[#881337] dark:hover:text-[#FB7185] cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Subtitle / Features */}
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
            <span>Bespoke Handcrafted Finish</span>
            <span className="text-[#C5A059] text-[10px]">✦</span>
          </p>
        </div>

        {/* Pricing & Mobile Quick View */}
        <div className="pt-3 mt-3 border-t border-[#EFE7DE] dark:border-[#282127] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-white tabular-nums font-serif">
              ₹{product.price}
            </span>
            <span className="text-xs text-stone-400 line-through tabular-nums">
              ₹{product.mrp}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {discountPercent}% OFF
            </span>
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="sm:hidden bg-[#881337] text-white p-2 rounded-xl shadow-xs"
            aria-label="Customize"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
