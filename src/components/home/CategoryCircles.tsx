import React from 'react';
import { CATEGORIES } from '../../data/products';
import { Sparkles, Gem, Heart, Music, Gift, Flame, Smartphone } from 'lucide-react';

interface CategoryCirclesProps {
  onSelectCategory: (categoryName: string) => void;
  activeCategory: string;
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  const CATEGORY_VISUALS: Record<string, { bg: string; icon: React.ReactNode; subtitle: string }> = {
    'Personalized Name Jewelry': {
      bg: 'from-amber-100 to-amber-200 dark:from-amber-950/60 dark:to-amber-900/40 text-amber-800 dark:text-amber-300',
      icon: <Sparkles className="w-7 h-7" />,
      subtitle: '18k Vermeil',
    },
    'Preserved Eternal Roses & Dome Displays': {
      bg: 'from-rose-100 to-rose-200 dark:from-rose-950/60 dark:to-rose-900/40 text-rose-800 dark:text-rose-300',
      icon: <Heart className="w-7 h-7" />,
      subtitle: '3-Year Cloche',
    },
    'Custom Acrylic Song Plaques & Photo Frames': {
      bg: 'from-slate-100 to-indigo-100 dark:from-slate-900/60 dark:to-indigo-950/40 text-indigo-800 dark:text-indigo-300',
      icon: <Music className="w-7 h-7" />,
      subtitle: 'LED Acrylic',
    },
    'Memory Photo Lamps & Crystal Cubes': {
      bg: 'from-sky-100 to-sky-200 dark:from-sky-950/60 dark:to-sky-900/40 text-sky-800 dark:text-sky-300',
      icon: <Gem className="w-7 h-7" />,
      subtitle: '3D Crystal',
    },
    'Engraved Wooden Gift Boxes & Keepsakes': {
      bg: 'from-amber-100 to-stone-200 dark:from-stone-900/60 dark:to-amber-950/40 text-amber-900 dark:text-amber-400',
      icon: <Gift className="w-7 h-7" />,
      subtitle: 'Walnut Casket',
    },
    'Romantic Couple Hampers & Scented Candle Sets': {
      bg: 'from-pink-100 to-rose-100 dark:from-pink-950/60 dark:to-rose-950/40 text-rose-900 dark:text-rose-300',
      icon: <Flame className="w-7 h-7" />,
      subtitle: 'Soy Wax & Flora',
    },
    'Personalized Phone Cases & Pocket Accessories': {
      bg: 'from-stone-100 to-stone-200 dark:from-stone-900/60 dark:to-stone-800/40 text-stone-800 dark:text-stone-300',
      icon: <Smartphone className="w-7 h-7" />,
      subtitle: 'Pearl & Leather',
    },
  };

  return (
    <section className="py-10 sm:py-14 border-b border-[#EFE7DE] dark:border-[#282127]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-2 mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#881337] dark:text-[#FB7185] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Curated Gifting Collections</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1917] dark:text-[#F5F0EB]">
            Explore by <span className="italic text-[#881337] dark:text-[#FB7185]">Atelier Category</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Bespoke gifts handcrafted to preserve cherished moments and stay in hearts forever.
          </p>
        </div>

        {/* Categories Row - Mobile Touch Scroll Optimized */}
        <div className="flex items-center gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar pb-3 pt-2 justify-start md:justify-center px-1">
          {CATEGORIES.map((cat) => {
            const visual = CATEGORY_VISUALS[cat.name] || {
              bg: 'from-stone-100 to-stone-200 text-stone-800',
              icon: <Gift className="w-7 h-7" />,
              subtitle: 'Custom Gift',
            };
            const isSelected = activeCategory === cat.name;

            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.name)}
                className="group flex flex-col items-center shrink-0 text-center focus:outline-none rounded-2xl p-1 transition-all"
              >
                {/* Showcase Ring with Gold/Burgundy Border */}
                <div className="relative">
                  <div
                    className={`w-18 h-18 sm:w-22 sm:h-22 rounded-2xl p-1 transition-all duration-300 border ${
                      isSelected
                        ? 'border-[#881337] dark:border-[#FB7185] ring-2 ring-[#881337]/30 shadow-md scale-105'
                        : 'border-[#EFE7DE] dark:border-[#2F262D] group-hover:border-[#C5A059] group-hover:scale-105 shadow-xs'
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-xl bg-gradient-to-br ${visual.bg} flex flex-col items-center justify-center shadow-inner relative overflow-hidden transition-transform duration-300 group-hover:scale-105`}
                    >
                      {visual.icon}
                    </div>
                  </div>
                </div>

                {/* Clean Name & Subtitle Below */}
                <div className="mt-2.5 max-w-[110px] sm:max-w-[130px] text-center">
                  <span
                    className={`block text-xs font-semibold transition-colors truncate max-w-full ${
                      isSelected
                        ? 'text-[#881337] dark:text-[#FB7185] font-bold'
                        : 'text-[#1C1917] dark:text-[#F5F0EB] group-hover:text-[#881337]'
                    }`}
                    title={cat.name}
                  >
                    {cat.name.split(' ')[0]} {cat.name.split(' ')[1] || ''}
                  </span>
                  <span className="text-[10px] text-stone-400 block truncate">
                    {visual.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
