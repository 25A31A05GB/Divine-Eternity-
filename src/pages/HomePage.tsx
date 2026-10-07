import React from 'react';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryCircles } from '../components/home/CategoryCircles';
import { BestsellerGrid } from '../components/home/BestsellerGrid';
import { VideoShoppingRow } from '../components/home/VideoShoppingRow';
import { CuratedCollectionRow } from '../components/home/CuratedCollectionRow';
import { ChoiceSelector } from '../components/home/ChoiceSelector';
import { FounderNoteSection } from '../components/home/FounderNoteSection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { MarqueeStrip } from '../components/layout/MarqueeStrip';
import { ValueProps } from '../components/home/ValueProps';
import { NewsletterSection } from '../components/home/NewsletterSection';
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
    name: "Divine’s Eternity - Luxury Gifts & Personalized Keepsakes",
    description:
      'Discover the world of Divine’s Eternity, where every gift is created to make your special moments more memorable.',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://divineseternity.com',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.slice(0, 8).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: p.name,
        image: p.images[0] || '',
        url: `${typeof window !== 'undefined' ? window.location.origin : 'https://divineseternity.com'}#product-${p.id}`,
      })),
    },
  };

  const homeUrl = typeof window !== 'undefined' ? window.location.origin : 'https://divineseternity.com';
  const heroImage = products[0]?.images[0] || undefined;

  return (
    <div className="space-y-0">
      <SEO
        title="Divine’s Eternity - Luxury Gifts & Personalized Keepsakes"
        description="Discover the world of Divine’s Eternity, where every gift is created to make your special moments more memorable. Personalized jewellery, hampers, bouquets, and bespoke creations."
        keywords="divines eternity, personalized gifts, names on gifts, personalized jewellery, caricature miniature, hampers"
        url={homeUrl}
        image={heroImage}
        structuredData={homeStructuredData}
      />

      {/* 1. Hero Banner Carousel */}
      <HeroCarousel
        featuredProducts={products}
        onShopNow={(cat) => onNavigateToCollection(cat || 'products')}
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
        onViewAll={() => onNavigateToCollection('products')}
      />

      {/* 4. Watch It And Buy It (Reel Cards) */}
      <VideoShoppingRow
        products={products}
        onQuickView={onQuickView}
      />

      {/* 5. A Note From Founder — Sonu Column */}
      <FounderNoteSection
        onExploreProducts={() => onNavigateToCollection('products')}
        onJoinCreatorClub={() => onNavigateToCollection('creator-club')}
      />

      {/* 6. Spotlight: Curated Gifts */}
      <CuratedCollectionRow
        title="Customize Your Gift — Personalized Jewellery"
        subtitle="Jewellery made personal, for moments that mean everything. Purely gold plated.✨💖"
        category="Customize Your Gift"
        products={products}
        onQuickView={onQuickView}
        onOpenDetail={onOpenDetail}
        onViewAll={onNavigateToCollection}
      />

      {/* 7. Shop By Your Choice */}
      <ChoiceSelector
        products={products}
        onSelectCategory={onNavigateToCollection}
        onQuickView={onQuickView}
      />

      {/* 8. Reviews */}
      <ReviewsSection />

      {/* 9. Marquee Strip */}
      <MarqueeStrip />

      {/* 10. Value Props */}
      <ValueProps />

      {/* 11. Newsletter */}
      <NewsletterSection />
    </div>
  );
};
