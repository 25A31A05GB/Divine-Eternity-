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
  const { averageRating, totalReviews } = getProductRatingStats(product.id);

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div
      className="group relative bg-white rounded-2xl border border-[#F3E8E2] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#FF2E93]/50 transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Media Area with Product Mockup & Editorial Badges */}
      <div className="relative aspect-[4/5] w-full bg-[#FFFDF8] overflow-hidden cursor-pointer border-b border-[#F8ECE5]">
        {/* Visual Media */}
        <div
          onClick={() => (onOpenDetail ? onOpenDetail(product) : onQuickView(product))}
          className="w-full h-full flex items-center justify-center overflow-hidden"
        >
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-108"
            />
          ) : (
            <div className="p-2 w-full h-full">
              <PhoneCaseMockup
                product={product}
                isHovered={isHovered}
                className="w-full h-full transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
        </div>

        {/* Editorial Text Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-20 pointer-events-none">
          {product.inStock === false || product.stockQuantity === 0 ? (
            <span className="bg-stone-900/90 text-stone-200 text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
              Sold Out
            </span>
          ) : product.stockQuantity && product.stockQuantity <= 5 ? (
            <span className="bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider w-fit shadow-xs">
              Only {product.stockQuantity} Left
            </span>
          ) : null}

          {product.badge && (
            <span className="bg-[#FF2E93] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
              {product.badge}
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#FFD94A] text-[#211D1C] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider w-fit shadow-xs">
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
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm border ${
            wishlisted
              ? 'bg-[#FF2E93] border-[#FF2E93] text-white'
              : 'bg-white/90 border-[#F3E8E2] text-stone-400 hover:text-[#FF2E93] hover:border-[#FF2E93]'
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
            className="w-full bg-[#211D1C] hover:bg-[#FF2E93] text-white py-2.5 px-3 rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View & Customize</span>
          </button>
        </div>
      </div>

      {/* Card Info Area */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF2E93] truncate max-w-[65%]">
              {product.category}
            </span>
            {totalReviews > 0 ? (
              <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600">
                <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="tabular-nums font-bold text-[#211D1C]">{averageRating}</span>
                <span className="text-stone-400">({totalReviews})</span>
              </div>
            ) : (
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                New
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => (onOpenDetail ? onOpenDetail(product) : onQuickView(product))}
            className="font-serif text-sm sm:text-base font-bold text-[#211D1C] line-clamp-1 hover:text-[#FF2E93] cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Subtitle / Features */}
          <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <span>Cute & Protective</span>
            <Sparkles className="w-2.5 h-2.5 text-[#FF2E93]" />
          </p>
        </div>

        {/* Pricing & Mobile Quick View */}
        <div className="pt-3 mt-3 border-t border-[#F3E8E2] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#211D1C] tabular-nums font-serif">
              ₹{product.price}
            </span>
            <span className="text-xs text-stone-400 line-through tabular-nums">
              ₹{product.mrp}
            </span>
            <span className="text-[10px] font-bold text-[#E05A47] bg-[#FFF0F3] px-1.5 py-0.5 rounded-md">
              {discountPercent}% OFF
            </span>
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="sm:hidden bg-[#211D1C] hover:bg-[#FF2E93] text-white p-2 rounded-full shadow-xs cursor-pointer"
            aria-label="Customize"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
