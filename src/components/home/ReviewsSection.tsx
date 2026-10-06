import React, { useState } from 'react';
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { INITIAL_REVIEWS } from '../../data/products';

export const ReviewsSection: React.FC = () => {
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  const REVIEWS_DATA = [
    {
      id: 'rev-1',
      rating: 5,
      comment: 'Build quality is solid. The volume buttons are clicky and not hard to press like other cheap covers I bought earlier.',
      productName: 'Gadget Destiny Cover',
      verified: true,
    },
    {
      id: 'rev-2',
      rating: 5,
      comment: 'Good case. The bumper corners give decent drop protection. Color matches the product pictures properly.',
      productName: 'Gadget Destiny Cover',
      verified: true,
    },
    {
      id: 'rev-3',
      rating: 5,
      comment: 'Got my parcel today in Mumbai. Case fits my phone snugly and the edges around the screen are raised enough for safety.',
      productName: 'Gadget Destiny Cover',
      verified: true,
    },
    {
      id: 'rev-4',
      rating: 5,
      comment: 'The wristlet charm is so sturdy! I carry my phone everywhere by the bracelet and get compliments every single day.',
      productName: 'Gadget Destiny Cover',
      verified: true,
    },
  ];

  const handlePrev = () => {
    setCurrentReviewIdx((prev) => (prev - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length);
  };

  const handleNext = () => {
    setCurrentReviewIdx((prev) => (prev + 1) % REVIEWS_DATA.length);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Summary Card matching Screenshot 7 */}
        <div className="bg-white rounded-3xl border border-[#F3E8E2] p-6 sm:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left: Tag, Heading, and 3 Stats */}
          <div className="space-y-6 flex-1">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#E05A47] mb-1">
                THE CUTE COVERS CLUB HAS SPOKEN
              </div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#211D1C]">
                Happy phones. <br />
                <span className="font-serif italic text-[#FF2E93] font-normal">Happier people.</span>
              </h2>
            </div>

            {/* 3 Stats Bar matching Screenshot 7 */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#211D1C] font-serif">
                  5 Lakh+
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  orders delivered
                </div>
              </div>
              <div className="border-l border-stone-200 pl-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#211D1C] font-serif">
                  98%
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  would recommend us
                </div>
              </div>
              <div className="border-l border-stone-200 pl-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#211D1C] font-serif">
                  7 days
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  easy replacement help
                </div>
              </div>
            </div>
          </div>

          {/* Right: Butter Yellow Rating Card matching Screenshot 7 */}
          <div className="bg-[#FFF9DE] border border-[#F7E7A9] rounded-2xl p-6 sm:p-8 text-center shrink-0 w-full sm:w-64">
            <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#211D1C]">
              4.98
            </div>
            <div className="flex items-center justify-center gap-1 text-[#F59E0B] my-2 text-sm">
              {'★★★★★'}
            </div>
            <div className="text-[11px] text-stone-600 font-medium">
              Based on 1,248 verified reviews
            </div>
          </div>

        </div>

        {/* Reviews Carousel Section matching Screenshot 7 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
              Latest love notes
            </h3>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS_DATA.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-[#F3E8E2] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-[#F59E0B] text-xs">
                      {'★★★★★'}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      VERIFIED BUYER
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Bottom Product Chip in Yellow matching Screenshot 7 */}
                <div className="bg-[#FFF9DE] border border-[#F7E7A9] p-3 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#EFE7DE] flex items-center justify-center text-xs">
                    📱
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#211D1C]">
                      {rev.productName}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Verified purchase
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
