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
      num: '01',
      title: '18k Gold Cursive Name Necklace',
      category: 'Personalized Name Jewelry',
      desc: 'Handcrafted luxury handwriting pendant on an adjustable gold chain. Tarnish-free & velvet boxed.',
      product: products.find((p) => p.category === 'Personalized Name Jewelry') || products[0],
    },
    {
      num: '02',
      title: 'Enchanted Preserved Rose Dome',
      category: 'Preserved Eternal Roses & Dome Displays',
      desc: '100% real preserved rose that stays vibrant for 3-5 years with warm glowing fairy LED lights.',
      product: products.find((p) => p.category === 'Preserved Eternal Roses & Dome Displays') || products[1],
    },
    {
      num: '03',
      title: 'Scannable Spotify Song Plaque',
      category: 'Custom Acrylic Song Plaques & Photo Frames',
      desc: 'High-clarity acrylic with your couple photo, scannable music code, and illuminated wooden base.',
      product: products.find((p) => p.category === 'Custom Acrylic Song Plaques & Photo Frames') || products[2],
    },
    {
      num: '04',
      title: 'Pearl Bracelet Phone Case',
      category: 'Personalized Phone Cases & Pocket Accessories',
      desc: 'Freshwater pearl wristlet chain with drop-proof shock armor and free name calligraphy engraving.',
      product: products.find((p) => p.category === 'Personalized Phone Cases & Pocket Accessories') || products[6] || products[0],
    },
  ];

  const currentChoice = CHOICES[activeIndex] || CHOICES[0];

  return (
    <section className="py-16 bg-[#FFF9F5] dark:bg-[#141113] border-b border-[#F5E6E8] dark:border-[#2D252A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E11D48] flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Curated Gift Guide</span>
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#231F20] dark:text-[#FDF9F7]">
            Shop By <span className="italic text-[#E11D48]">Occasion & Style</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Hover over any curated keepsake to preview the handcrafted bespoke design.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Large Product Visual Display */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white dark:bg-[#1E1A1D] rounded-3xl p-8 border border-[#F5E6E8] dark:border-[#2D252A] shadow-lg relative min-h-[420px]">
            <div className="absolute top-4 left-4 bg-pink-50 dark:bg-pink-950/40 text-[#E11D48] px-3 py-1 rounded-full text-xs font-bold font-mono">
              {currentChoice.num} · {currentChoice.category.split('&')[0]}
            </div>

            {currentChoice.product && (
              <div className="my-auto transform hover:scale-105 transition-all duration-300">
                <PhoneCaseMockup
                  product={currentChoice.product}
                  customText="Divine"
                  className="w-[220px] h-[360px] sm:w-[240px] sm:h-[390px]"
                />
              </div>
            )}

            <div className="w-full pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {currentChoice.product?.name}
                </p>
                <p className="text-xs font-extrabold text-[#E11D48]">
                  ₹{currentChoice.product?.price}
                </p>
              </div>

              {currentChoice.product && (
                <button
                  onClick={() => onQuickView(currentChoice.product!)}
                  className="bg-[#231F20] hover:bg-[#E11D48] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Numbered List */}
          <div className="lg:col-span-7 space-y-4">
            {CHOICES.map((choice, idx) => {
              const isSelected = activeIndex === idx;

              return (
                <div
                  key={choice.num}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => onSelectCategory(choice.category)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                    isSelected
                      ? 'bg-white dark:bg-[#1E1A1D] border-[#E11D48] shadow-lg translate-x-2'
                      : 'bg-white/60 dark:bg-slate-900/30 border-[#F5E6E8] dark:border-slate-800 hover:bg-white dark:hover:bg-[#1E1A1D]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`font-serif-heading text-xl sm:text-2xl font-bold transition-colors ${
                        isSelected ? 'text-[#E11D48]' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      {choice.num}
                    </span>
                    <div>
                      <h3 className="font-serif-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#E11D48] transition-colors">
                        {choice.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-md">
                        {choice.desc}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-[#E11D48] text-white rotate-45 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-[#E11D48] group-hover:text-white'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
