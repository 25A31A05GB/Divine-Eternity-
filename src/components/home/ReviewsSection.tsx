import React, { useState } from 'react';
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { INITIAL_REVIEWS } from '../../data/products';

export const ReviewsSection: React.FC = () => {
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  const STATS = [
    { label: 'Orders Handcrafted & Delivered', value: '45,000+' },
    { label: 'Would Recommend to a Bestie', value: '99.4%' },
    { label: 'Hassle-Free Replacement Policy', value: '7 Days' },
    { label: 'Average Customer Rating', value: '4.9 ★' },
  ];

  const handlePrev = () => {
    setCurrentReviewIdx((prev) => (prev - 1 + INITIAL_REVIEWS.length) % INITIAL_REVIEWS.length);
  };

  const handleNext = () => {
    setCurrentReviewIdx((prev) => (prev + 1) % INITIAL_REVIEWS.length);
  };

  return (
    <section className="py-16 sm:py-24 border-b border-[#F5E6E8] dark:border-[#2D252A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Serif & Italic */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E11D48] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>Customer Love & Testimonials</span>
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#231F20] dark:text-[#FDF9F7]">
            Gifts that stay in <span className="italic text-[#E11D48]">hearts.</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Read real unfiltered reviews from gift and keepsake lovers all across India.
          </p>
        </div>

        {/* 4-Item Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1E1A1D] p-5 sm:p-6 rounded-2xl border border-[#F5E6E8] dark:border-[#2D252A] text-center shadow-xs flex flex-col justify-center"
            >
              <span className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#E11D48] tabular-nums">
                {stat.value}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* "Latest Love Notes" Review Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#231F20] dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#E11D48] fill-current" />
              <span>Latest Love Notes</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous review"
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#E11D48] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next review"
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#E11D48] hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {INITIAL_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-[#1E1A1D] p-5 rounded-2xl border border-[#F5E6E8] dark:border-[#2D252A] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Stars & Verified Buyer */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#FFD94A]">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    {rev.verified && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif-heading text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    "{rev.title}"
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {rev.author}
                    </p>
                    {rev.giftTypeUsed && (
                      <p className="text-[10px] text-[#E11D48] font-semibold">
                        {rev.giftTypeUsed}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {rev.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
