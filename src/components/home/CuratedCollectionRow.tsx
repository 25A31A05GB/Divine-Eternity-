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

  return (
    <section className="py-14 border-b border-[#F3E8E2] dark:border-[#2D252A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F0508C] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Category Spotlight</span>
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#231F20] dark:text-[#FDF9F7] mt-1">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>
          </div>

          <button
            onClick={() => onViewAll(category)}
            className="text-xs sm:text-sm font-bold text-[#F0508C] hover:text-[#d63b74] flex items-center gap-1 group self-start sm:self-auto"
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
