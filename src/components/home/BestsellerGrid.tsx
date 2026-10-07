import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface BestsellerGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
  onViewAll: () => void;
}

const FILTER_TABS = [
  'All Gifts',
  'Customize Your Gift',
  'Personalized Jewellery',
  'Names on Gifts',
  'Customize Your Caricature or Miniature',
  'Personalize Your Bouquets',
  'Special Hampers',
  'Hair Accessories',
  'Paradise of Jewels',
];

export const BestsellerGrid: React.FC<BestsellerGridProps> = ({
  products,
  onQuickView,
  onOpenDetail,
  onViewAll,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All Gifts');

  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'All Gifts') {
      return products.filter((p) => p.isBestSeller || p.rating >= 4.8);
    }
    return products.filter((p) => {
      const cat = p.category.toLowerCase();
      const sel = selectedFilter.toLowerCase();
      if (sel === 'customize your gift' || sel === 'personalized jewellery') {
        return cat.includes('customize') || cat.includes('jewel');
      }
      return cat === sel;
    });
  }, [products, selectedFilter]);

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center gap-1.5 mb-1">
              <span>✦</span>
              <span>THE ONES EVERYONE IS ASKING ABOUT</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
              Meet the <span className="font-serif italic text-[#FF2E93] font-normal">Best sellers</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Jewellery made personal, for moments that mean everything. Purely gold plated.✨💖
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-[#FF2E93] hover:text-[#d62075] flex items-center gap-1 group self-start md:self-auto cursor-pointer"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {FILTER_TABS.map((tab) => {
            const isSelected = selectedFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#211D1C] text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-[#FF2E93] hover:text-[#FF2E93]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Grid (4 columns desktop, 2 mobile) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/80 border border-[#F3E8E2] rounded-3xl p-8 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#FF2E93] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#211D1C]">Ready for Your Real Products</h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              All placeholder items have been cleared. As you add your genuine creations, hampers, and jewellery from the Admin Portal, they will appear here live.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
