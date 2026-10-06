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

  return (
    <div className="py-10 sm:py-16">
      <SEO
        title={`Your Wishlist (${wishlistCount})`}
        description="View your saved luxury phone cases, personalized necklaces, and custom gifts ready to order at Divine's Eternity."
        noindex={true}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F0508C] flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-[#F0508C]" />
            <span>Saved Favorites</span>
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#231F20] dark:text-[#FDF9F7]">
            Your <span className="italic text-[#F0508C]">Wishlist</span> ({wishlistCount})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep track of the cases and pearl wristlets you love.
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white dark:bg-[#1E1A1D] rounded-3xl p-12 text-center border border-[#F3E8E2] dark:border-[#2D252A] shadow-xs max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-950/40 text-3xl flex items-center justify-center mx-auto text-[#F0508C]">
              💖
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-slate-900 dark:text-white">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Tap the heart icon on any case to save your favorites here for later.
            </p>
            <button
              onClick={onExploreProducts}
              className="bg-[#F0508C] hover:bg-[#d63b74] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
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
