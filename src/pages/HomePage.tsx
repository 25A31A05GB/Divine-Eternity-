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
import { SEO } from '../components/common/SEO';
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
  const homeStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: "Gadgets Destiny - Cute Covers Club | Trendy Designer Phone Cases",
    description:
      'Explore cute phone covers, bracelet phone cases, zipper wallet cases, and makeup mirror covers at Gadgets Destiny.',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://gadgetsdestiny.com',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.slice(0, 8).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: p.name,
        image: p.images[0] || '',
        url: `${typeof window !== 'undefined' ? window.location.origin : 'https://gadgetsdestiny.com'}#product-${p.id}`,
      })),
    },
  };

  const homeUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gadgetsdestiny.com';
  const heroImage = products[0]?.images[0] || undefined;

  return (
    <div className="space-y-0">
      <SEO
        title="Cute Covers Club — Trendy Designer Phone Cases"
        description="Phone covers for people who refuse to carry boring things. Designed with personality, built for everyday life. Buy 3 Pay For 2 at Gadgets Destiny."
        keywords="cute phone cases, bracelet cases, mirror cases, zipper wallet cases, trendy phone covers, gadgets destiny"
        url={homeUrl}
        image={heroImage}
        structuredData={homeStructuredData}
      />

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

      {/* 5. Spotlight: Bracelet Phone Cases */}
      <CuratedCollectionRow
        title="Check the Bracelet Phone Cases"
        subtitle="Cute pearl charms and aesthetic beaded wristlets crafted for everyday cute style."
        category="Bracelet Phone Case"
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
