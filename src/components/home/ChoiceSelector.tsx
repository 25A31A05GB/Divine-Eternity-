import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Eye } from 'lucide-react';
import { Product } from '../../types';
import { PhoneCaseMockup } from '../../utils/productVisuals';

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
      title: 'Designer Phone case',
      category: 'Designer Case',
      product: products.find((p) => p.category === 'Designer Case') || products[0],
    },
    {
      num: '02.',
      title: 'Zipper Wallet Case',
      category: 'Zipper Wallet Case',
      product: products.find((p) => p.category === 'Zipper Wallet Case') || products[1],
    },
    {
      num: '03.',
      title: 'Makeup Mirror Phone case',
      category: 'Mirror Phone Case',
      product: products.find((p) => p.category === 'Mirror Phone Case') || products[2],
    },
  ];

  const currentChoice = CHOICES[activeIndex] || CHOICES[0];

  return (
    <section className="py-16 sm:py-24 bg-[#FFFDF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Layout matching Screenshot 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Big Phone Case Visual */}
          <div className="flex items-center justify-center">
            {currentChoice.product && (
              <div
                onClick={() => onQuickView(currentChoice.product!)}
                className="w-64 sm:w-80 h-96 sm:h-[480px] cursor-pointer transform hover:scale-102 transition-transform duration-300 drop-shadow-xl"
              >
                <PhoneCaseMockup
                  product={currentChoice.product}
                  customText="Shyla"
                  className="w-full h-full"
                />
              </div>
            )}
          </div>

          {/* Right Column: Title and Numbered Options matching Screenshot 6 */}
          <div className="space-y-8">
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-[#211D1C]">
              Shop By Your Choice
            </h2>

            <div className="space-y-4 pt-4">
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

            {/* Progress line indicator at bottom matching Screenshot 6 */}
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
