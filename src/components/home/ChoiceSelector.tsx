import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useMediaCMS } from '../../context/MediaCMSContext';

interface ChoiceSelectorProps {
  products: Product[];
  onSelectCategory: (categoryName: string) => void;
  onQuickView: (product: Product) => void;
}

export const ChoiceSelector: React.FC<ChoiceSelectorProps> = ({
  products,
  onSelectCategory,
  onQuickView,
}) => {
  const { choiceSection } = useMediaCMS();
  const [activeIndex, setActiveIndex] = useState(0);

  if (choiceSection?.isVisible === false) {
    return null;
  }

  const activeTabs = choiceSection?.tabs?.filter((t) => t.isActive !== false) || [];
  if (activeTabs.length === 0 || !products || products.length === 0) {
    return null;
  }

  const eyebrow = choiceSection?.eyebrow || '✦ HANDPICKED FOR EVERY OCCASION';
  const titlePrefix = choiceSection?.titlePrefix || 'Shop By';
  const titleHighlight = choiceSection?.titleHighlight || 'Your Choice';

  const currentTab = activeTabs[activeIndex] || activeTabs[0];

  // Find a product that best matches the category
  const targetCategory = currentTab.categoryName.toLowerCase();
  const matchingProduct =
    products.find((p) => {
      const c = (p.category || '').toLowerCase();
      return c === targetCategory || c.includes(targetCategory.split(' ')[0]) || targetCategory.includes(c);
    }) || products[activeIndex % products.length] || products[0];

  return (
    <section className="py-16 sm:py-24 bg-[#FFFDF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Product Visual */}
          <div className="flex items-center justify-center">
            {matchingProduct && (
              <div
                onClick={() => onQuickView(matchingProduct)}
                className="relative w-72 sm:w-84 aspect-square rounded-3xl overflow-hidden cursor-pointer transform hover:scale-102 transition-all duration-300 shadow-2xl border-4 border-[#FFFDF8] group"
              >
                <img
                  src={matchingProduct.images[0]}
                  alt={matchingProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD94A]">Purely Handcrafted ✨💖</span>
                  <p className="font-serif-heading text-lg font-bold text-white line-clamp-1">{matchingProduct.name}</p>
                  <p className="text-xs text-white/90">₹{matchingProduct.price} <span className="line-through text-white/60">₹{matchingProduct.mrp}</span></p>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#211D1C] rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4 text-[#FF2E93]" />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title and Numbered Options */}
          <div className="space-y-8">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
                <span>{eyebrow}</span>
              </div>
              <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-[#211D1C]">
                {titlePrefix} <span className="font-serif italic text-[#FF2E93] font-bold">{titleHighlight}</span>
              </h2>
            </div>

            <div className="space-y-3 pt-2">
              {activeTabs.map((tab, idx) => {
                const isSelected = activeIndex === idx;

                return (
                  <div
                    key={tab.id}
                    onClick={() => {
                      setActiveIndex(idx);
                      onSelectCategory(tab.categoryName);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#FFF9EB] border-[#FF2E93] shadow-sm'
                        : 'bg-white border-[#E7E2DA] hover:border-[#FF2E93]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs font-bold ${isSelected ? 'text-[#FF2E93]' : 'text-stone-400'}`}>
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <div>
                        <h4 className={`text-sm font-bold ${isSelected ? 'text-[#211D1C]' : 'text-stone-700'}`}>
                          {tab.label}
                        </h4>
                        <span className="text-[10px] text-stone-500 font-medium">
                          {tab.categoryName}
                        </span>
                      </div>
                    </div>

                    <ArrowUpRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        isSelected ? 'text-[#FF2E93]' : 'text-stone-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
