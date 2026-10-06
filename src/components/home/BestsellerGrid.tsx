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
  'All Cases',
  'Bracelet Phone Case',
  'Zipper Wallet Case',
  'Mirror Phone Case',
  'Clear Designer Case',
  'Designer Case',
];

export const BestsellerGrid: React.FC<BestsellerGridProps> = ({
  products,
  onQuickView,
  onOpenDetail,
  onViewAll,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All Cases');

  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'All Cases') {
      return products.filter((p) => p.isBestSeller || p.rating >= 4.8);
    }
    return products.filter((p) => p.category === selectedFilter);
  }, [products, selectedFilter]);

  return (
    <section className="py-14 sm:py-20 border-b border-[#F3E8E2] dark:border-[#2D252A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F0508C] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending & Most Loved</span>
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#231F20] dark:text-[#FDF9F7] mt-1">
              Meet the <span className="italic text-[#F0508C]">Best sellers</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Over 40,000+ happy phones styled this month. Buy 3 Pay For 2 on all bestsellers!
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-[#F0508C] hover:text-[#d63b74] flex items-center gap-1 group self-start md:self-auto"
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
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#231F20] dark:bg-white text-white dark:text-[#231F20] shadow-sm'
                    : 'bg-white dark:bg-[#1E1A1D] text-slate-700 dark:text-slate-300 border border-[#F3E8E2] dark:border-[#2D252A] hover:border-[#F0508C]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Grid (4 columns desktop, 2 mobile) */}
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
      </div>
    </section>
  );
};
