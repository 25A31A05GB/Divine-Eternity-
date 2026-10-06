import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface WishlistPageProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  onExploreProducts: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  products,
  onQuickView,
  onOpenDetail,
  onExploreProducts,
}) => {
  const { wishlist, wishlistCount } = useWishlist();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const wishlistUrl = typeof window !== 'undefined' ? window.location.href : 'https://gadgetsdestiny.com/#wishlist';

  return (
    <div className="py-10 sm:py-16">
      <SEO
        title={`Your Wishlist Favorites (${wishlistCount}) — Gadgets Destiny`}
        description="View your saved cute phone cases and designer covers ready to order at Gadgets Destiny."
        url={wishlistUrl}
        noindex={true}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-[#FF2E93] text-[#FF2E93]" />
            <span>Saved Favorites</span>
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#211D1C]">
            Your <span className="italic text-[#FF2E93]">Wishlist</span> ({wishlistCount})
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Keep track of the cute phone covers and accessories you love.
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#F3E8E2] shadow-xs max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FFF0F3] border border-[#FFD2DF] flex items-center justify-center mx-auto text-[#FF2E93]">
              <Heart className="w-7 h-7 fill-[#FF2E93]" />
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-[#211D1C]">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Tap the heart icon on any case to save your favorites here for later.
            </p>
            <button
              onClick={onExploreProducts}
              className="bg-[#FF2E93] hover:bg-[#e02680] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
            >
              Explore Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={onQuickView}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
