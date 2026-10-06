import React from 'react';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryCircles } from '../components/home/CategoryCircles';
import { BestsellerGrid } from '../components/home/BestsellerGrid';
import { VideoShoppingRow } from '../components/home/VideoShoppingRow';
import { CuratedCollectionRow } from '../components/home/CuratedCollectionRow';
import { ChoiceSelector } from '../components/home/ChoiceSelector';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { MarqueeStrip } from '../components/layout/MarqueeStrip';
import { ValueProps } from '../components/home/ValueProps';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { ScrollToTop } from '../components/common/ScrollToTop';
import { Product } from '../types';

interface HomePageProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  onNavigateToCollection: (categoryName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onQuickView,
  onOpenDetail,
  onNavigateToCollection,
}) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Banner Carousel */}
      <HeroCarousel
        featuredProducts={products}
        onShopNow={(cat) => onNavigateToCollection(cat || 'all')}
        onQuickView={onQuickView}
      />

      {/* 2. Shop by Collection (7 Gift Categories) */}
      <CategoryCircles
        activeCategory="all"
        onSelectCategory={(cat) => onNavigateToCollection(cat)}
      />

      {/* 3. Meet the Best Sellers Grid */}
      <BestsellerGrid
        products={products}
        onQuickView={onQuickView}
        onOpenDetail={onOpenDetail}
        onViewAll={() => onNavigateToCollection('all')}
      />

      {/* 4. Watch It And Buy It (Reel Cards) */}
      <VideoShoppingRow
        products={products}
        onQuickView={onQuickView}
      />

      {/* 5. Spotlight: Personalized Name Jewelry */}
      <CuratedCollectionRow
        title="Check the Personalized Name Jewelry"
        subtitle="18k gold plated handwriting necklaces and freshwater pearl bracelets crafted with timeless elegance."
        category="Personalized Name Jewelry"
        products={products}
        onQuickView={onQuickView}
        onOpenDetail={onOpenDetail}
        onViewAll={onNavigateToCollection}
      />

      {/* 6. Shop By Your Choice (01-04 Numbered Showcase) */}
      <ChoiceSelector
        products={products}
        onSelectCategory={onNavigateToCollection}
        onQuickView={onQuickView}
      />

      {/* 7. Reviews: Happy phones. Happier people. */}
      <ReviewsSection />

      {/* 8. Yellow Marquee Strip */}
      <MarqueeStrip />

      {/* 9. Four Feature Blocks */}
      <ValueProps />

      {/* 10. Newsletter Signup Section */}
      <NewsletterSection />

      {/* 11. Scroll to top button */}
      <ScrollToTop />
    </div>
  );
};
