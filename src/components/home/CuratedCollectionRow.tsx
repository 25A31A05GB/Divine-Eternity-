import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight } from 'lucide-react';
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
  title: propTitle,
  subtitle: propSubtitle,
  category: propCategory,
  products,
  onQuickView,
  onOpenDetail,
  onViewAll,
}) => {
  const { spotlightSection } = useMediaCMS();

  if (spotlightSection?.isVisible === false) {
    return null;
  }

  const category = spotlightSection?.selectedCategory || propCategory || 'Personalized Name Jewelry';
  const title = spotlightSection?.title || propTitle || 'Personalized Name Jewellery';
  const subtitle = spotlightSection?.subtitle || propSubtitle || '18k thick gold vermeil handwriting pendants & Roman numeral engraved bar bracelets.';
  const eyebrow = spotlightSection?.eyebrow || '✦ SPOTLIGHT SHOWCASE';
  const viewAllText = spotlightSection?.viewAllText || 'Explore All';

  const filtered = products.filter((p) => {
    const pCat = (p.category || '').toLowerCase();
    const target = category.toLowerCase();
    return pCat === target || pCat.includes(target) || target.includes(pCat);
  });
  const itemsToShow = filtered.length > 0 ? filtered.slice(0, 4) : products.slice(0, 4);

  if (!itemsToShow || itemsToShow.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center gap-1.5 mb-1">
              <span>{eyebrow}</span>
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
            <span>{viewAllText} ({filtered.length})</span>
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
