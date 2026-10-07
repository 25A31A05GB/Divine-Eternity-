import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { STRICT_COLLECTIONS, MainCollection } from '../data/collectionsData';
import { ProductsSection } from '../components/collections/ProductsSection';
import { PersonalizationSection } from '../components/collections/PersonalizationSection';
import { CollaborationSection } from '../components/collections/CollaborationSection';
import { UpcomingCampaignsSection } from '../components/collections/UpcomingCampaignsSection';
import { CreatorClubSection } from '../components/collections/CreatorClubSection';
import { AffiliateMarketingSection } from '../components/collections/AffiliateMarketingSection';
import { PodcastSection } from '../components/collections/PodcastSection';
import { SEO } from '../components/common/SEO';
import {
  Gift,
  Palette,
  Users,
  Calendar,
  Award,
  TrendingUp,
  Headphones,
  Sparkles,
} from 'lucide-react';

interface CollectionsPageProps {
  initialCategory?: string;
  products: Product[];
  onQuickView: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
}

const COLLECTION_ICONS: Record<string, React.ElementType> = {
  products: Gift,
  personalization: Palette,
  collaboration: Users,
  'upcoming-campaigns': Calendar,
  'creator-club': Award,
  'affiliate-marketing': TrendingUp,
  podcast: Headphones,
};

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  initialCategory = 'products',
  products,
  onQuickView,
  onOpenDetail,
}) => {
  // Determine initial active collection tab based on input prop
  const getInitialTab = (): string => {
    const raw = (initialCategory || '').toLowerCase().trim();

    if (raw === 'personalization') return 'personalization';
    if (raw === 'collaboration') return 'collaboration';
    if (raw === 'upcoming-campaigns' || raw === 'campaigns' || raw === 'upcoming campaign') return 'upcoming-campaigns';
    if (raw === 'creator-club' || raw === 'creator club') return 'creator-club';
    if (raw === 'affiliate-marketing' || raw === 'affiliate' || raw === 'affiliate marketing') return 'affiliate-marketing';
    if (raw === 'podcast') return 'podcast';

    // Default to products
    return 'products';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>(() => {
    const raw = (initialCategory || '').trim();
    // Check if it matches any of the product categories
    const validProductCats = [
      'Customize Your Gift',
      'Names on Gifts',
      'Personalized Jewellery',
      'Customize Your Caricature or Miniature',
      'Personalize Your Bouquets',
      'Special Hampers',
      'Hair Accessories',
      'Paradise of Jewels',
    ];
    const match = validProductCats.find((c) => c.toLowerCase() === raw.toLowerCase());
    return match || 'All';
  });

  // Keep in sync if initialCategory prop changes
  useEffect(() => {
    const tab = getInitialTab();
    setActiveTab(tab);

    const validProductCats = [
      'Customize Your Gift',
      'Names on Gifts',
      'Personalized Jewellery',
      'Customize Your Caricature or Miniature',
      'Personalize Your Bouquets',
      'Special Hampers',
      'Hair Accessories',
      'Paradise of Jewels',
    ];
    const match = validProductCats.find((c) => c.toLowerCase() === (initialCategory || '').toLowerCase().trim());
    if (match) {
      setActiveTab('products');
      setSelectedProductCategory(match);
    }
  }, [initialCategory]);

  const activeCollection = STRICT_COLLECTIONS.find((c) => c.id === activeTab) || STRICT_COLLECTIONS[0];

  return (
    <div className="py-8 sm:py-12 min-h-screen bg-[#FFFDF8]">
      <SEO
        title={`${activeCollection.name} Collection — Divine’s Eternity`}
        description={activeCollection.description}
        keywords="divines eternity collections, products, personalization, collaboration, upcoming campaigns, creator club, affiliate marketing, podcast"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Strictly Defined 7 Collections Navigation Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span>COLLECTIONS DIRECTORY</span>
            </span>
            <span className="text-xs text-stone-500 hidden sm:inline">
              7 Dedicated Creator & Gifting Collections
            </span>
          </div>

          <div className="bg-[#FFF9EB] border border-[#F5E6CE] p-1.5 sm:p-2 rounded-2xl sm:rounded-full shadow-2xs overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-2 min-w-max">
              {STRICT_COLLECTIONS.map((col, index) => {
                const Icon = COLLECTION_ICONS[col.id] || Gift;
                const isActive = activeTab === col.id;

                return (
                  <button
                    key={col.id}
                    onClick={() => {
                      setActiveTab(col.id);
                      window.scrollTo({ top: 100, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FF2E93] text-white shadow-xs scale-102 ring-2 ring-[#FF2E93]/20'
                        : 'text-[#211D1C] hover:bg-white hover:text-[#FF2E93]'
                    }`}
                  >
                    <span className="opacity-70 text-[10px] font-mono">
                      {index + 1}.
                    </span>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{col.name}</span>
                    {col.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#FFF0F5] text-[#FF2E93]'
                      }`}>
                        {col.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Collection Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'products' && (
            <ProductsSection
              products={products}
              selectedCategory={selectedProductCategory}
              onSelectCategory={setSelectedProductCategory}
              onQuickView={onQuickView}
              onOpenDetail={onOpenDetail}
            />
          )}

          {activeTab === 'personalization' && (
            <PersonalizationSection
              products={products}
              onOpenDetail={onOpenDetail}
              onQuickView={onQuickView}
            />
          )}

          {activeTab === 'collaboration' && <CollaborationSection />}

          {activeTab === 'upcoming-campaigns' && <UpcomingCampaignsSection />}

          {activeTab === 'creator-club' && <CreatorClubSection />}

          {activeTab === 'affiliate-marketing' && <AffiliateMarketingSection />}

          {activeTab === 'podcast' && <PodcastSection />}
        </div>
      </div>
    </div>
  );
};
