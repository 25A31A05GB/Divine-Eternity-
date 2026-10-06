import React from 'react';
import { Smartphone } from 'lucide-react';

interface CategoryCirclesProps {
  onSelectCategory: (categoryName: string) => void;
  activeCategory: string;
}

const GADGETS_CATEGORIES = [
  {
    name: 'Zipper Wallet Case',
    slug: 'zipper-wallet-case',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=400&q=80',
    color: '#FFB5D5',
  },
  {
    name: 'Bracelet Phone Case',
    slug: 'bracelet-phone-case',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=400&q=80',
    color: '#D8B4F8',
  },
  {
    name: 'Gripper Phone Case',
    slug: 'gripper-phone-case',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=400&q=80',
    color: '#FF9EAA',
  },
  {
    name: 'Mirror Phone Case',
    slug: 'mirror-phone-case',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=400&q=80',
    color: '#FFEAA7',
  },
  {
    name: 'Toy Cases',
    slug: 'toy-cases',
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=400&q=80',
    color: '#A8E6CF',
  },
  {
    name: 'Clear Designer Case',
    slug: 'clear-designer-case',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=400&q=80',
    color: '#FFD3B6',
  },
  {
    name: 'Designer Case',
    slug: 'designer-case',
    image: 'https://images.unsplash.com/photo-1533228896861-735eea76a755?auto=format&fit=crop&w=400&q=80',
    color: '#FFAAA5',
  },
];

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <section className="py-10 sm:py-14 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching Screenshot 2 */}
        <div className="mb-8">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#E05A47] flex items-center gap-1.5 mb-1">
            <span className="text-[#E05A47]">✦</span>
            <span>PICK YOUR VIBE</span>
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            Shop by <span className="font-serif italic text-[#FF2E93] font-normal">collection</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Find the style that matches your mood.
          </p>
        </div>

        {/* Categories Row matching Screenshot 2 */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-3 pt-2 justify-start lg:justify-between px-1">
          {GADGETS_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.name;

            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.name)}
                className="group flex flex-col items-center shrink-0 text-center focus:outline-none cursor-pointer"
              >
                {/* Circular Image Container with Pink Ring & Gold Badge */}
                <div className="relative mb-3">
                  <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full p-1 border-2 border-[#FF2E93] transition-transform duration-300 group-hover:scale-105 shadow-xs">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#FFF0F3] flex items-center justify-center">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback icon if image fails
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                      <Smartphone className="w-8 h-8 text-[#FF2E93] opacity-60" />
                    </div>
                  </div>

                  {/* Gold Star Badge on bottom-right */}
                  <div className="w-5 h-5 bg-[#FFD94A] rounded-full flex items-center justify-center text-[10px] text-[#211D1C] border border-white shadow-xs absolute bottom-0 right-1">
                    ✦
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
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
