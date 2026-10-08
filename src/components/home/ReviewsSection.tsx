import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { useReviews } from '../../context/ReviewsContext';

export const ReviewsSection: React.FC = () => {
  const { reviews } = useReviews();
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  // Flatten all real approved reviews across all products
  const allReviewsList = Object.entries(reviews).flatMap(([prodId, list]) =>
    list.map((r) => ({
      ...r,
      productId: prodId,
    }))
  );

  const totalReviewsCount = allReviewsList.length;

  // If no real approved reviews exist in the reviews table, provide clean empty state or hide
  if (totalReviewsCount === 0) {
    return (
      <section className="py-14 sm:py-20 bg-[#FFFDF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#F3E8E2] p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FFF9EB] border border-[#F5E6CE] flex items-center justify-center text-[#FF2E93] mx-auto">
              <Sparkles className="w-6 h-6 text-[#FFD94A]" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93]">
                DIVINE’S ETERNITY CUSTOMER LOVE
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#211D1C]">
                Special moments. Cherished forever.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Real stories from verified patrons celebrating weddings, anniversaries, and personal milestones will appear here as they are reviewed and approved.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const averageRating = (
    allReviewsList.reduce((acc, cur) => acc + (cur.rating || 5), 0) / totalReviewsCount
  ).toFixed(2);

  const handlePrev = () => {
    setCurrentReviewIdx((prev) => (prev - 1 + allReviewsList.length) % allReviewsList.length);
  };

  const handleNext = () => {
    setCurrentReviewIdx((prev) => (prev + 1) % allReviewsList.length);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Summary Card */}
        <div className="bg-white rounded-3xl border border-[#F3E8E2] p-6 sm:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Tag, Heading */}
          <div className="space-y-4 flex-1">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] mb-1">
                DIVINE’S ETERNITY CUSTOMER LOVE
              </div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#211D1C]">
                Special moments. <br />
                <span className="font-serif italic text-[#FF2E93] font-normal">Cherished forever.</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600">
              Verified patron impressions celebrating cherished keepsakes and personal milestones.
            </p>
          </div>

          {/* Right: Authoritative Rating Card based exclusively on reviews table */}
          <div className="bg-[#FFF9DE] border border-[#F7E7A9] rounded-2xl p-6 sm:p-8 text-center shrink-0 w-full sm:w-64">
            <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#211D1C]">
              {averageRating}
            </div>
            <div className="flex items-center justify-center gap-1 text-[#F59E0B] my-2 text-sm">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(Number(averageRating))
                      ? 'text-[#F59E0B] fill-[#F59E0B]'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-[11px] text-stone-600 font-medium">
              Based on {totalReviewsCount} verified {totalReviewsCount === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>

        {/* Reviews Carousel Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
              Latest love notes
            </h3>

            {allReviewsList.length > 4 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous review"
                  className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-[#211D1C] hover:border-[#FF2E93] hover:text-[#FF2E93] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next review"
                  className="w-9 h-9 rounded-full bg-[#FFD94A] border border-[#F5C71A] flex items-center justify-center text-[#211D1C] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {allReviewsList.slice(currentReviewIdx, currentReviewIdx + 4).map((rev, idx) => (
              <div
                key={`${rev.productId || 'item'}-${rev.id}-${currentReviewIdx + idx}`}
                className="bg-white p-6 rounded-2xl border border-[#F3E8E2] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-[#F59E0B] text-xs">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'text-[#F59E0B] fill-[#F59E0B]'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.verified && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        VERIFIED BUYER
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="bg-[#FFF9DE] border border-[#F7E7A9] p-3 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#EFE7DE] flex items-center justify-center text-xs">
                    ✦
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#211D1C] line-clamp-1">
                      {rev.author}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {rev.title || 'Verified Keepsake'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
