import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useMediaCMS } from '../../context/MediaCMSContext';

interface CuratedCollectionRowProps {
  title?: string;
  subtitle?: string;
  category?: string;
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
  const { curatedSpotlight } = useMediaCMS();

  if (curatedSpotlight.isActive === false) return null;

  const activeCategory = category || curatedSpotlight.category || 'Personalized Jewellery';
  const activeTitle = title || curatedSpotlight.title || 'Personalized Name Jewellery';
  const activeSubtitle = subtitle || curatedSpotlight.subtitle || '18k thick gold vermeil handwriting pendants & Roman numeral engraved bar bracelets.';
  const activeEyebrow = curatedSpotlight.eyebrow || 'SIGNATURE ATELIER CRAFT';

  const filtered = products.filter(
    (p) => p.category === activeCategory || p.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0])
  );
  const itemsToShow = filtered.length > 0 ? filtered.slice(0, 4) : products.slice(0, 4);

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span>{activeEyebrow}</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
              {activeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">{activeSubtitle}</p>
          </div>

          <button
            onClick={() => onViewAll(activeCategory)}
            className="text-xs sm:text-sm font-bold text-[#FF2E93] hover:text-[#d62075] flex items-center gap-1 group self-start sm:self-auto cursor-pointer"
          >
            <span>{curatedSpotlight.ctaText || 'Explore All'} ({filtered.length || itemsToShow.length})</span>
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
