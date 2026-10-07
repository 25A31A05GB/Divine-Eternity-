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
      return products;
    }
    const target = selectedFilter.toLowerCase().trim();
    return products.filter((p) => {
      const cat = (p.category || '').toLowerCase().trim();
      return cat === target || cat.includes(target) || target.includes(cat);
    });
  }, [products, selectedFilter]);

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Screenshot 2 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#E05A47] flex items-center gap-1.5 mb-1">
              <span>✦</span>
              <span>THE ONES EVERYONE IS ASKING ABOUT</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
              Meet the <span className="font-serif italic text-[#FF2E93] font-normal">Best sellers</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Over 40,000+ cherished memories handcrafted. Buy 3 Pay For 2 on all bestsellers!
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.slice(0, 24).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
