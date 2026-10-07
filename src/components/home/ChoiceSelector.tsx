import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { PhoneCaseMockup } from '../../utils/productVisuals';
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

  if (choiceSection.isActive === false) return null;

  const tabs = choiceSection.tabs || [];
  const currentTab = tabs[activeIndex] || tabs[0];

  const currentProduct = currentTab
    ? products.find((p) => p.category === currentTab.category || p.category.toLowerCase().includes(currentTab.category.toLowerCase().split(' ')[0])) || products[0]
    : products[0];

  return (
    <section className="py-16 sm:py-24 bg-[#FFFDF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Big Product Visual */}
          <div className="flex items-center justify-center">
            {currentProduct && (
              <div
                onClick={() => onQuickView(currentProduct)}
                className="w-64 sm:w-80 h-96 sm:h-[460px] cursor-pointer transform hover:scale-102 transition-transform duration-300 drop-shadow-xl bg-white p-4 rounded-3xl border border-[#F3E8E2] flex flex-col items-center justify-between"
              >
                <div className="w-full flex-1 rounded-2xl overflow-hidden bg-[#FFFDF8] flex items-center justify-center p-2">
                  {currentProduct.images?.[0] ? (
                    <img
                      src={currentProduct.images[0]}
                      alt={currentProduct.name}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <PhoneCaseMockup
                      product={currentProduct}
                      customText="Atelier"
                      className="w-full h-full"
                    />
                  )}
                </div>

                <div className="w-full pt-3 flex items-center justify-between border-t border-[#F3E8E2] mt-2">
                  <div>
                    <h4 className="font-bold text-xs text-[#211D1C] truncate max-w-[170px]">
                      {currentProduct.name}
                    </h4>
                    <span className="text-xs font-serif font-bold text-[#FF2E93]">
                      ₹{currentProduct.price}
                    </span>
                  </div>
                  <button className="px-3 py-1.5 rounded-full bg-[#FF2E93] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <Eye className="w-3 h-3" /> Quick View
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Choices List */}
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
                <span>{choiceSection.eyebrow || 'DISCOVER BY OCCASION & STYLE'}</span>
              </div>
              <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
                {choiceSection.title || 'Shop By Your'}{' '}
                <span className="font-serif italic text-[#FF2E93] font-normal">Choice</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {choiceSection.subtitle || 'Hand-picked keepsakes categorized for your exact gifting moment.'}
              </p>
            </div>

            {/* List with selection indicator */}
            <div className="space-y-3">
              {tabs.map((tab, idx) => {
                const isSelected = activeIndex === idx;
                const numStr = String(idx + 1).padStart(2, '0') + '.';

                return (
                  <div
                    key={tab.id || idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#FFF9EB] border-[#FF2E93] shadow-xs'
                        : 'bg-white border-[#F3E8E2] hover:border-[#FF2E93]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold ${
                          isSelected ? 'text-[#FF2E93]' : 'text-stone-400'
                        }`}
                      >
                        {numStr}
                      </span>
                      <div>
                        <h3
                          className={`text-sm font-bold transition-colors ${
                            isSelected ? 'text-[#211D1C]' : 'text-stone-700 group-hover:text-[#211D1C]'
                          }`}
                        >
                          {tab.label}
                        </h3>
                        <p className="text-[11px] text-stone-500">
                          {tab.category}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCategory(tab.category);
                      }}
                      className="p-2 rounded-full bg-white border border-[#F3E8E2] text-stone-600 hover:text-[#FF2E93] hover:border-[#FF2E93] transition-colors"
                      title="Explore this category"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
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
