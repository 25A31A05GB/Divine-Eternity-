import React from 'react';
import { CATEGORIES } from '../../data/products';
import { Sparkles } from 'lucide-react';

interface CategoryCirclesProps {
  onSelectCategory: (categoryName: string) => void;
  activeCategory: string;
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  // Category visual styles & icons
  const CATEGORY_VISUALS: Record<string, { bg: string; icon: string; subtitle: string }> = {
    'Personalized Name Jewelry': { bg: 'from-amber-100 to-yellow-200', icon: '✨', subtitle: '18k Gold Necklaces' },
    'Preserved Eternal Roses & Dome Displays': { bg: 'from-rose-200 to-red-300', icon: '🌹', subtitle: '3-Year Roses' },
    'Custom Acrylic Song Plaques & Photo Frames': { bg: 'from-emerald-100 to-teal-200', icon: '🎵', subtitle: 'Spotify LED Plaques' },
    'Memory Photo Lamps & Crystal Cubes': { bg: 'from-sky-100 to-blue-200', icon: '💎', subtitle: '3D Laser Crystals' },
    'Engraved Wooden Gift Boxes & Keepsakes': { bg: 'from-amber-200 to-amber-400', icon: '🎁', subtitle: 'Walnut Keepsakes' },
    'Romantic Couple Hampers & Scented Candle Sets': { bg: 'from-pink-200 to-rose-300', icon: '🕯️', subtitle: 'Soy Wax Hampers' },
    'Personalized Phone Cases & Pocket Accessories': { bg: 'from-fuchsia-100 to-pink-200', icon: '📱', subtitle: 'Pearl & Wallet Cases' },
  };

  return (
    <section className="py-12 border-b border-[#F5E6E8] dark:border-[#2D252A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E11D48] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Romantic Keepsakes & Custom Gifts</span>
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#231F20] dark:text-[#FDF9F7]">
            Shop by <span className="italic text-[#E11D48]">Category</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Gifts handcrafted to evoke unforgettable emotions and stay in hearts forever.
          </p>
        </div>

        {/* Circular Categories Row */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-2 justify-start md:justify-center">
          {CATEGORIES.map((cat) => {
            const visual = CATEGORY_VISUALS[cat.name] || {
              bg: 'from-pink-100 to-pink-200',
              icon: '🎁',
              subtitle: 'Custom Gift',
            };
            const isSelected = activeCategory === cat.name;

            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.name)}
                className="group flex flex-col items-center shrink-0 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] rounded-2xl p-1"
              >
                {/* Circular Showcase with Deep Rose Ring & Gold Sparkle Badge */}
                <div className="relative">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all duration-300 ${
                      isSelected
                        ? 'ring-4 ring-[#E11D48] ring-offset-2 dark:ring-offset-[#141113] scale-105 shadow-lg'
                        : 'ring-2 ring-[#E11D48]/40 group-hover:ring-[#E11D48] group-hover:scale-105 shadow-md'
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full bg-gradient-to-tr ${visual.bg} flex flex-col items-center justify-center text-2xl sm:text-3xl shadow-inner relative overflow-hidden`}
                    >
                      <span className="transform group-hover:scale-110 transition-transform duration-300">
                        {visual.icon}
                      </span>
                    </div>
                  </div>

                  {/* Gold Sparkle Badge on top right */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FFD94A] text-[#231F20] border-2 border-white dark:border-[#141113] flex items-center justify-center shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#E11D48]" />
                  </div>
                </div>

                {/* Name Pill Below */}
                <div className="mt-2.5 max-w-[120px]">
                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full transition-all truncate max-w-full ${
                      isSelected
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'bg-white dark:bg-[#1E1A1D] text-[#231F20] dark:text-[#FDF9F7] border border-[#F5E6E8] dark:border-[#2D252A] group-hover:border-[#E11D48]'
                    }`}
                    title={cat.name}
                  >
                    {cat.name.split(' ')[0]} {cat.name.split(' ')[1]}
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
