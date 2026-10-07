import React from 'react';
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
import { STRICT_COLLECTIONS } from '../../data/collectionsData';

interface CategoryCirclesProps {
  onSelectCategory: (categoryName: string) => void;
  activeCategory: string;
}

const COLLECTION_VISUALS = [
  {
    id: 'products',
    name: 'Products',
    subtitle: '7 Gift Categories',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
    icon: Gift,
    badge: 'Explore All',
  },
  {
    id: 'personalization',
    name: 'Personalization',
    subtitle: 'WhatsApp Confirmed',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    icon: Palette,
    badge: 'WhatsApp Verified',
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    subtitle: 'UGC & Creators',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    icon: Users,
    badge: 'Open for Creators',
  },
  {
    id: 'upcoming-campaigns',
    name: 'Upcoming Campaigns',
    subtitle: '@divineseternity',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    icon: Calendar,
    badge: 'Follow & Win',
  },
  {
    id: 'creator-club',
    name: 'Creator Club',
    subtitle: 'Earn up to ₹7k',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    icon: Award,
    badge: 'Earn up to ₹7k',
  },
  {
    id: 'affiliate-marketing',
    name: 'Affiliate Marketing',
    subtitle: '15-20% Comm.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80',
    icon: TrendingUp,
    badge: 'Share & Earn',
  },
  {
    id: 'podcast',
    name: 'Podcast',
    subtitle: 'Inspiring Stories',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80',
    icon: Headphones,
    badge: 'Listen Now',
  },
];

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <section className="py-10 sm:py-14 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-8">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>DIVINE’S ETERNITY COLLECTIONS</span>
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            Explore Our <span className="font-serif italic text-[#FF2E93] font-normal">7 Collections</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Products, personalization, creator opportunities, podcasts, and meaningful collaborations.
          </p>
        </div>

        {/* Collections Row */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-3 pt-2 justify-start lg:justify-between px-1">
          {COLLECTION_VISUALS.map((col, index) => {
            const isSelected = activeCategory.toLowerCase() === col.id.toLowerCase();
            const Icon = col.icon;

            return (
              <button
                key={col.id}
                onClick={() => onSelectCategory(col.id)}
                className="group flex flex-col items-center shrink-0 text-center focus:outline-none cursor-pointer"
              >
                {/* Circular Image Container with Pink Ring & Gold Badge */}
                <div className="relative mb-3">
                  <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full p-1 border-2 border-[#FF2E93] transition-transform duration-300 group-hover:scale-105 shadow-xs">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#FFF0F5] relative flex items-center justify-center">
                      <img
                        src={col.image}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    </div>
                  </div>

                  {/* Number Badge on bottom-right */}
                  <div className="w-5 h-5 bg-[#FFD94A] rounded-full flex items-center justify-center text-[10px] text-[#211D1C] font-extrabold border border-white shadow-xs absolute bottom-0 right-1">
                    {index + 1}
                  </div>
                </div>

                {/* Pill Button underneath */}
                <div
                  className={`bg-white border rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap transition-all shadow-2xs ${
                    isSelected
                      ? 'border-[#FF2E93] text-[#FF2E93] ring-1 ring-[#FF2E93]/30'
                      : 'border-[#E7E2DA] text-[#211D1C] group-hover:border-[#FF2E93] group-hover:text-[#FF2E93]'
                  }`}
                >
                  {col.name}
                </div>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  {col.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
