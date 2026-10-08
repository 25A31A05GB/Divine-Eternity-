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
import { useMediaCMS } from '../../context/MediaCMSContext';

interface CategoryCirclesProps {
  onSelectCategory: (categoryName: string) => void;
  activeCategory: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  products: Gift,
  personalization: Palette,
  collaboration: Users,
  'upcoming-campaigns': Calendar,
  'creator-club': Award,
  'affiliate-marketing': TrendingUp,
  podcast: Headphones,
};

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  const { categoryCircles } = useMediaCMS();
  const activeList = categoryCircles.filter((c) => c.isActive !== false);

  if (activeList.length === 0) return null;

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
          {activeList.map((col, index) => {
            const isSelected = activeCategory.toLowerCase() === col.route.toLowerCase();
            const Icon = ICON_MAP[col.route] || Gift;

            return (
              <button
                key={col.id}
                onClick={() => onSelectCategory(col.route)}
                className="group flex flex-col items-center shrink-0 text-center focus:outline-none cursor-pointer"
              >
                {/* Circular Image Container with Pink Ring & Gold Badge */}
                <div className="relative mb-3">
                  <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full p-1 border-2 border-[#FF2E93] transition-transform duration-300 group-hover:scale-105 shadow-xs">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#FFF0F5] relative flex items-center justify-center">
                      <img
                        src={col.image}
                        alt={col.name}
                        loading="lazy"
                        decoding="async"
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
                <span className="text-[10px] text-stone-500 mt-0.5 max-w-[110px] truncate">
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
