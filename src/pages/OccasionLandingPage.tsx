import React, { useState, useEffect } from 'react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Sparkles, Calendar, Clock, Gift, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

interface OccasionLandingPageProps {
  occasionSlug: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

interface OccasionConfig {
  slug: string;
  headline: string;
  intro: string;
  cutoff_date: string;
  banner_text: string;
}

const DEFAULT_OCCASIONS: Record<string, OccasionConfig> = {
  rakhi: {
    slug: 'rakhi',
    headline: 'Raksha Bandhan Luxury Keepsakes & Hampers',
    intro: 'Celebrate the sacred bond of sibling love with handcrafted personalized silver charms, photo frames, and customized hampers.',
    cutoff_date: 'August 15, 2026',
    banner_text: 'Order by August 15 for guaranteed delivery before Raksha Bandhan!',
  },
  diwali: {
    slug: 'diwali',
    headline: 'Diwali Festive Elegance & Artisanal Gifts',
    intro: 'Illuminate your celebrations with brass diyas, gold-foiled photo keepsakes, and heirloom-quality festive gift hampers.',
    cutoff_date: 'November 1, 2026',
    banner_text: 'Order by November 1 for guaranteed delivery before Diwali festivities!',
  },
  valentines: {
    slug: 'valentines',
    headline: 'Valentine’s Day Romantic Keepsakes & Custom Jewelry',
    intro: 'Express your deepest affection with customized Spotify audio frames, engraved initials, and personalized couple caricatures.',
    cutoff_date: 'February 10, 2026',
    banner_text: 'Order by February 10 for express delivery before Valentine’s Day!',
  },
  birthday: {
    slug: 'birthday',
    headline: 'Personalized Birthday Keepsakes & Custom Gifts',
    intro: 'Make their special day truly unforgettable with tailored memory boxes, custom Spotify plaques, and bespoke jewelry.',
    cutoff_date: '5 Days Before Event',
    banner_text: 'Order at least 5 days in advance for timely personalized birthday crafting!',
  },
  anniversary: {
    slug: 'anniversary',
    headline: 'Milestone Anniversary Artisanal Keepsakes',
    intro: 'Honor years of togetherness with customized romantic photo frames, solid brass engraved plaques, and luxury hampers.',
    cutoff_date: '5 Days Before Event',
    banner_text: 'Order at least 5 days in advance for guaranteed handcrafted perfection!',
  },
};

export const OccasionLandingPage: React.FC<OccasionLandingPageProps> = ({
  occasionSlug,
  products,
  onProductClick,
  onQuickView,
  onNavigate,
}) => {
  const normalizedSlug = (occasionSlug || 'rakhi').toLowerCase();
  const [config, setConfig] = useState<OccasionConfig>(
    DEFAULT_OCCASIONS[normalizedSlug] || {
      slug: normalizedSlug,
      headline: `${normalizedSlug.toUpperCase()} Artisanal Gift Keepsakes`,
      intro: `Handcrafted personalized gifts and luxury hampers tailored for ${normalizedSlug}.`,
      cutoff_date: '5 Days Before Event',
      banner_text: `Order 5 days in advance for guaranteed ${normalizedSlug} delivery!`,
    }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      const client = supabase;
      const fetchOccasionSetting = async () => {
        try {
          const { data } = await client
            .from('occasion_settings')
            .select('*')
            .eq('slug', normalizedSlug)
            .maybeSingle();

          if (data) {
            setConfig(data);
          }
        } catch {
          // fallback to default config
        }
      };
      fetchOccasionSetting();
    }
  }, [normalizedSlug]);

  // Filter products matching this occasion
  const matchingProducts = products.filter((p) => {
    const list = p.occasions || p.product_occasions || [];
    if (list.length > 0) {
      return list.some(
        (occ) =>
          occ.toLowerCase() === normalizedSlug ||
          occ.toLowerCase().includes(normalizedSlug)
      );
    }
    // Fallback heuristic if not explicitly tagged
    const nameDesc = (p.name + ' ' + p.description + ' ' + (p.badge || '')).toLowerCase();
    if (normalizedSlug === 'valentines' && (nameDesc.includes('valentine') || nameDesc.includes('love') || nameDesc.includes('couple') || nameDesc.includes('rose'))) return true;
    if (normalizedSlug === 'rakhi' && (nameDesc.includes('rakhi') || nameDesc.includes('brother') || nameDesc.includes('sister'))) return true;
    if (normalizedSlug === 'diwali' && (nameDesc.includes('diwali') || nameDesc.includes('candle') || nameDesc.includes('festive') || nameDesc.includes('hamper'))) return true;
    if (normalizedSlug === 'birthday' && (nameDesc.includes('birthday') || nameDesc.includes('custom') || nameDesc.includes('caricature'))) return true;
    if (normalizedSlug === 'anniversary' && (nameDesc.includes('anniversary') || nameDesc.includes('couple') || nameDesc.includes('frame'))) return true;
    
    // Return all or best sellers as baseline if no explicit tag matches
    return p.isBestSeller || p.allowsPersonalization;
  });

  const pageTitle = `${config.headline} — Divine’s Eternity`;
  const pageDescription = config.intro;

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: config.headline,
    description: config.intro,
    numberOfItems: matchingProducts.length,
    itemListElement: matchingProducts.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.description,
        image: p.images[0],
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: p.price,
          availability: p.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      },
    })),
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFFDF8] min-h-screen text-[#211D1C]">
      <SEO title={pageTitle} description={pageDescription} />

      {/* Insert JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-[#FFF0F5] via-[#FFF9F3] to-[#FFF0F5] border border-[#F3E8E2] rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xs">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#FF2E93]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E93] text-white text-[10px] font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span>Artisanal Festival Curation</span>
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C] leading-tight">
              {config.headline}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              {config.intro}
            </p>

            {/* Delivery Cutoff Callout */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="bg-white/90 backdrop-blur-sm border border-[#E7E2DA] px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-2xs">
                <Clock className="w-4 h-4 text-[#FF2E93] shrink-0 animate-pulse" />
                <span className="text-xs font-bold text-[#211D1C]">
                  {config.banner_text}
                </span>
              </div>

              <button
                onClick={() => onNavigate('gift-finder')}
                className="bg-[#211D1C] hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Gift className="w-4 h-4 text-[#FFD94A]" />
                <span>Launch 3-Step Gift Finder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid Header */}
        <div className="flex items-center justify-between border-b border-[#F3E8E2] pb-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211D1C]">
              Curated Gift Catalog
            </h2>
            <p className="text-xs text-stone-500">
              Showing {matchingProducts.length} handcrafted keepsakes for {config.slug}
            </p>
          </div>

          <div className="flex gap-2">
            {Object.keys(DEFAULT_OCCASIONS).map((slugKey) => (
              <button
                key={slugKey}
                onClick={() => onNavigate('gifts', { occasion: slugKey })}
                className={`text-xs px-3 py-1.5 rounded-full font-bold capitalize transition-all cursor-pointer ${
                  slugKey === normalizedSlug
                    ? 'bg-[#FF2E93] text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {slugKey}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {matchingProducts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#F3E8E2] text-center space-y-4">
            <Gift className="w-12 h-12 text-[#FF2E93] mx-auto opacity-50" />
            <h3 className="font-serif text-lg font-bold text-[#211D1C]">No items tagged yet for {normalizedSlug}</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Our atelier is actively preparing bespoke handcrafted creations for this occasion.
            </p>
            <button
              onClick={() => onNavigate('collections')}
              className="bg-[#211D1C] text-white text-xs font-bold px-6 py-2.5 rounded-full"
            >
              Explore Full Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {matchingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onProductClick}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
