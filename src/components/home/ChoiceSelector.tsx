import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Eye } from 'lucide-react';
import { Product } from '../../types';

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
  const [activeIndex, setActiveIndex] = useState(0);

  const CHOICES = [
    {
      num: '01.',
      title: 'Customized Initial & Name Necklaces',
      category: 'Customize Your Gift',
      product: products[1] || products[0],
    },
    {
      num: '02.',
      title: 'Solid Gold Plated Figaro & ID Bracelets',
      category: 'Customize Your Gift',
      product: products[2] || products[0],
    },
    {
      num: '03.',
      title: 'Vintage Keepsake Photo Book Lockets',
      category: 'Customize Your Gift',
      product: products[15] || products[0],
    },
  ];

  const currentChoice = CHOICES[activeIndex] || CHOICES[0];

  if (!products || products.length === 0 || !currentChoice?.product) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FFFDF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Real Jewellery Image Visual */}
          <div className="flex items-center justify-center">
            {currentChoice.product && (
              <div
                onClick={() => onQuickView(currentChoice.product!)}
                className="relative w-72 sm:w-84 aspect-square rounded-3xl overflow-hidden cursor-pointer transform hover:scale-102 transition-all duration-300 shadow-2xl border-4 border-[#FFFDF8] group"
              >
                <img
                  src={currentChoice.product.images[0]}
                  alt={currentChoice.product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD94A]">Purely Gold Plated ✨💖</span>
                  <p className="font-serif-heading text-lg font-bold text-white line-clamp-1">{currentChoice.product.name}</p>
                  <p className="text-xs text-white/90">₹{currentChoice.product.price} <span className="line-through text-white/60">₹{currentChoice.product.mrp}</span></p>
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
                <span>PERSONALIZED KEEPSAKES</span>
              </div>
              <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-[#211D1C]">
                Shop By Your Choice
              </h2>
            </div>

            <div className="space-y-4 pt-2">
              {CHOICES.map((choice, idx) => {
                const isSelected = activeIndex === idx;

                return (
                  <div
                    key={choice.num}
                    onClick={() => {
                      setActiveIndex(idx);
                      onSelectCategory(choice.category);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className="py-4 border-b border-stone-200 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-sm font-normal text-stone-500">
                        {choice.num}
                      </span>
                      <span
                        className={`text-base sm:text-lg font-normal transition-colors ${
                          isSelected ? 'text-[#FF2E93] font-semibold' : 'text-[#211D1C] group-hover:text-[#FF2E93]'
                        }`}
                      >
                        {choice.title}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:border-[#FF2E93] group-hover:text-[#FF2E93] transition-colors">
                      <span className="text-xs">→</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress line indicator at bottom */}
            <div className="w-full h-0.5 bg-stone-200 mt-6 relative">
              <div
                className="h-full bg-[#211D1C] transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / CHOICES.length) * 100}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
