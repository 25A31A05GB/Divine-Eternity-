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
      className="group relative bg-white dark:bg-[#1E1A1D] rounded-[14px] border border-[#F3E8E2] dark:border-[#2D252A] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Media Area with Product Mockup & Badges */}
      <div className="relative aspect-[4/5] w-full bg-[#FFF8F4] dark:bg-black/20 overflow-hidden cursor-pointer">
        {/* Visual Mockup */}
        <div
          onClick={() => onOpenDetail ? onOpenDetail(product) : onQuickView(product)}
          className="w-full h-full"
        >
          <PhoneCaseMockup
            product={product}
            isHovered={isHovered}
            className="w-full h-full transform transition-transform duration-500"
          />
        </div>

        {/* Promo Badge: Buy 3 Pay For 2 */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20 pointer-events-none">
          {product.badge && (
            <span className="bg-[#F0508C] text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md tracking-wider uppercase inline-flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {product.badge}
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#FFD94A] text-[#231F20] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider w-fit">
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
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm ${
            wishlisted
              ? 'bg-[#F0508C] text-white'
              : 'bg-white/80 dark:bg-black/60 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-black hover:text-[#F0508C]'
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
            className="w-full bg-[#231F20]/90 hover:bg-[#F0508C] text-white py-2.5 px-3 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Customize</span>
          </button>
        </div>
      </div>

      {/* Card Info Area */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Eyebrow Category & Dynamic Star Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F0508C] truncate max-w-[65%]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <Star className="w-3 h-3 text-[#FFD94A] fill-[#FFD94A]" />
              <span className="tabular-nums font-bold">{averageRating}</span>
              <span className="text-slate-400">({totalReviews})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetail ? onOpenDetail(product) : onQuickView(product)}
            className="font-serif-heading text-sm sm:text-base font-bold text-[#231F20] dark:text-[#FDF9F7] line-clamp-1 hover:text-[#F0508C] cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Choose Variant Label */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>Choose Phone Model & Variant</span>
            <span className="text-[#F0508C] text-[10px]">✦</span>
          </p>
        </div>

        {/* Pricing & Mobile Quick View */}
        <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-extrabold text-[#231F20] dark:text-white tabular-nums">
              ₹{product.price}
            </span>
            <span className="text-xs text-slate-400 line-through tabular-nums">
              ₹{product.mrp}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {discountPercent}% OFF
            </span>
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="sm:hidden bg-[#F0508C] text-white p-2 rounded-full shadow-xs"
            aria-label="Customize"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
