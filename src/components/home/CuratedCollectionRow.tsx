import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CuratedCollectionRowProps {
  title: string;
  subtitle: string;
  category: string;
  products: Product[];
  onQuickView: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
  onViewAll: (category: string) => void;
}

export const CuratedCollectionRow: React.FC<CuratedCollectionRowProps> = ({
  title,
  subtitle,
  category,
  products,
  onQuickView,
  onOpenDetail,
  onViewAll,
}) => {
  const filtered = products.filter((p) => p.category === category || p.category.includes(category.split(' ')[0]));
  const itemsToShow = filtered.length > 0 ? filtered.slice(0, 4) : products.slice(0, 4);

  if (!itemsToShow || itemsToShow.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Screenshot 4 & 5 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center gap-1.5 mb-1">
              <span>✦</span>
              <span>DIVINE’S ETERNITY COLLECTIONS</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">{subtitle}</p>
          </div>

          <button
            onClick={() => onViewAll(category)}
            className="text-xs sm:text-sm font-bold text-[#FF2E93] hover:text-[#d62075] flex items-center gap-1 group self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All ({filtered.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4-Card Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {itemsToShow.map((product) => (
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
