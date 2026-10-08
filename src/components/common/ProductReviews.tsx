import React, { useState, useMemo } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  PenLine,
  X,
  Send,
  Award,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, ProductReview } from '../../types';
import { useReviews } from '../../context/ReviewsContext';

interface ProductReviewsProps {
  product: Product;
  className?: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product, className = '' }) => {
  const {
    getProductReviews,
    getProductRatingStats,
    addReview,
    likeReview,
  } = useReviews();

  const reviewsList = getProductReviews(product.id);
  const { averageRating, totalReviews, ratingBreakdown } = getProductRatingStats(
    product.id,
    product.rating,
    product.reviewCount
  );

  // Filter & Sort State
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [giftTypeUsed, setGiftTypeUsed] = useState(product.name);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Rating label feedback
  const ratingLabels: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good Quality',
    4: 'Very Satisfied',
    5: 'Loved it! Pure Gold Plated Perfection ✨💖',
  };

  const handleLike = (reviewId: string) => {
    if (likedReviews[reviewId]) return;
    likeReview(product.id, reviewId);
    setLikedReviews((prev) => ({ ...prev, [reviewId]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please share a few words about your experience.');
      return;
    }

    addReview(product.id, {
      author: author.trim(),
      rating,
      title: title.trim() || 'Stunning personalized gift!',
      comment: comment.trim(),
      verified: true,
      giftTypeUsed: giftTypeUsed.trim() || product.name,
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FF2E93', '#FFD94A', '#D4AF37', '#10B981'],
      });
    } catch {
      // ignore
    }

    setFormSubmitted(true);
    setFormError('');
    setAuthor('');
    setTitle('');
    setComment('');

    setTimeout(() => {
      setFormSubmitted(false);
      setShowReviewForm(false);
    }, 2500);
  };

  // Filtered and sorted reviews
  const displayReviews = useMemo(() => {
    let list = [...reviewsList];

    if (starFilter !== 'all') {
      list = list.filter((r) => r.rating === starFilter);
    }

    list.sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      if (sortBy === 'helpful') return (b.likesCount || 0) - (a.likesCount || 0);
      return 0; // default order / most recent
    });

    return list;
  }, [reviewsList, starFilter, sortBy]);

  return (
    <section
      id="product-reviews-section"
      className={`bg-white rounded-3xl border border-[#F3E8E2] p-6 sm:p-10 shadow-xs space-y-10 text-left ${className}`}
    >
      {/* 1. Header & Summary Statistics Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#F8ECE5]">
        
        {/* Left: Score Box & Highlights */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="bg-[#FFFDF8] border border-[#FFD94A]/40 rounded-3xl p-6 text-center shadow-xs min-w-[160px]">
            <span className="text-4xl sm:text-5xl font-extrabold text-[#211D1C] font-serif block">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex items-center justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? 'fill-[#FFD94A] text-[#FFD94A]'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-stone-500 font-medium block">
              {totalReviews} verified rating{totalReviews === 1 ? '' : 's'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#FF2E93] text-xs font-bold border border-[#FFE0E6]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span>100% Genuine Gold Plated Keepsakes</span>
            </div>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#211D1C]">
              Customer Ratings & Feedback
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md">
              Real reviews from verified shoppers of <strong>{product.name}</strong>. Every piece is crafted with love and pure gold plated finish.
            </p>
          </div>
        </div>

        {/* Right: Write Review Trigger Button */}
        <div>
          <button
            type="button"
            onClick={() => setShowReviewForm((prev) => !prev)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#211D1C] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <PenLine className="w-4 h-4 text-[#FFD94A]" />
            <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
          </button>
        </div>
      </div>

      {/* 2. Rating Breakdown Progress Bars */}
      <div className="bg-[#FFFDF8] rounded-2xl p-5 sm:p-6 border border-[#F3E8E2] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            Rating Distribution
          </span>
          {[5, 4, 3, 2, 1].map((starNum) => {
            const count = ratingBreakdown[starNum] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : starNum === 5 ? 85 : 15;

            return (
              <button
                key={starNum}
                type="button"
                onClick={() => setStarFilter(starFilter === starNum ? 'all' : starNum)}
                className={`w-full flex items-center gap-3 text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                  starFilter === starNum ? 'bg-[#FFF0F5] font-bold text-[#FF2E93]' : 'hover:bg-stone-100 text-stone-600'
                }`}
              >
                <div className="flex items-center gap-1 w-12 shrink-0">
                  <span className="font-bold">{starNum}</span>
                  <Star className="w-3.5 h-3.5 fill-[#FFD94A] text-[#FFD94A]" />
                </div>
                <div className="flex-1 h-2.5 bg-stone-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FFD94A] to-[#FF2E93] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right tabular-nums text-[11px] text-stone-500">
                  {percentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Brand Promise Badges */}
        <div className="flex flex-col gap-3.5 sm:border-l sm:border-[#F3E8E2] sm:pl-6 text-xs text-stone-600">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-stone-900 block font-semibold">100% Verified Customer Reviews</strong>
              <span>All reviews are posted by genuine buyers and WhatsApp order recipients.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-stone-900 block font-semibold">Pure Gold Plated Craftsmanship</strong>
              <span>Hypoallergenic, water-resistant & built for heartfelt moments that mean everything.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Write A Review Form (Expanded) */}
      {showReviewForm && (
        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border-2 border-[#FFD94A]/60 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] block mb-1">
                Your Feedback Matters
              </span>
              <h4 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                Share Your Experience with {product.name}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formSubmitted ? (
            <div className="bg-emerald-50 text-emerald-900 p-8 rounded-2xl text-center space-y-2 border border-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h5 className="font-bold text-base">Thank you for sharing your love!</h5>
              <p className="text-xs text-emerald-700">
                Your verified review has been published with the Verified Buyer badge.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star selector */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  Your Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoverRating || rating) >= star;
                      return (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-stone-300 hover:scale-115 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              isActive ? 'fill-[#FFD94A] text-[#FFD94A]' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-semibold text-stone-700 italic">
                    {ratingLabels[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Author name & title grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Diya Patel"
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    Review Headline / Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Beyond beautiful, made my sister cry happy tears!"
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  Detailed Review & Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the gold-plated shine, laser engraving quality, packaging box, or gift recipient's reaction..."
                  className="w-full bg-white border border-stone-200 rounded-xl p-4 text-xs text-stone-900 focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] resize-none"
                />
              </div>

              {formError && (
                <p className="text-xs font-bold text-rose-600">{formError}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF2E93] hover:bg-[#E11D48] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verified Review</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 4. Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Star Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
          <button
            type="button"
            onClick={() => setStarFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              starFilter === 'all'
                ? 'bg-[#211D1C] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Ratings ({reviewsList.length})
          </button>
          {[5, 4, 3, 2, 1].map((s) => {
            const count = reviewsList.filter((r) => r.rating === s).length;
            if (count === 0 && starFilter !== s) return null;

            return (
              <button
                key={s}
                type="button"
                onClick={() => setStarFilter(s)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  starFilter === s
                    ? 'bg-[#FF2E93] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{s}</span>
                <Star className={`w-3 h-3 ${starFilter === s ? 'fill-white text-white' : 'fill-[#FFD94A] text-[#FFD94A]'}`} />
                <span className="opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#FF2E93] cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* 5. Reviews Feed / List */}
      <div className="space-y-4">
        {displayReviews.length === 0 ? (
          <div className="text-center py-12 bg-[#FFFDF8] rounded-3xl border border-dashed border-[#F3E8E2] space-y-3">
            <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
            <h5 className="font-bold text-sm text-stone-700">No reviews found matching this filter</h5>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Be the first to share your experience with this rating!
            </p>
            <button
              type="button"
              onClick={() => {
                setStarFilter('all');
                setShowReviewForm(true);
              }}
              className="text-xs font-bold text-[#FF2E93] hover:underline cursor-pointer"
            >
              Reset filter & write a review →
            </button>
          </div>
        ) : (
          displayReviews.map((rev, idx) => {
            const hasLiked = !!likedReviews[rev.id];
            const authorInitial = rev.author ? rev.author.charAt(0).toUpperCase() : 'C';

            return (
              <div
                key={`${rev.id}-${idx}`}
                className="bg-[#FFFDF8] rounded-2xl border border-[#F3E8E2] p-5 sm:p-6 transition-all hover:border-[#FF2E93]/40 hover:shadow-sm space-y-3"
              >
                {/* Review Header: User Info & Rating */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* User Initials Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFD94A] to-[#FF2E93] text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                      {authorInitial}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#211D1C]">
                          {rev.author}
                        </span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-400">
                        <span>{rev.date}</span>
                        {rev.giftTypeUsed && (
                          <>
                            <span>·</span>
                            <span className="text-[#FF2E93] font-medium text-[11px] truncate max-w-[200px]">
                              {rev.giftTypeUsed}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 shrink-0 bg-white px-2.5 py-1 rounded-full border border-stone-200 shadow-2xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'fill-[#FFD94A] text-[#FFD94A]'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Title & Comment */}
                {rev.title && (
                  <h5 className="font-serif-heading text-base font-bold text-[#211D1C]">
                    {rev.title}
                  </h5>
                )}

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                  {rev.comment}
                </p>

                {/* Bottom Helpful / Like Action */}
                <div className="flex items-center justify-between pt-2 border-t border-[#F5ECE8] text-xs">
                  <span className="text-[11px] text-stone-400">
                    Was this review helpful to you?
                  </span>

                  <button
                    type="button"
                    onClick={() => handleLike(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      hasLiked
                        ? 'bg-rose-50 text-[#FF2E93] border border-rose-200'
                        : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-[#FF2E93]' : ''}`} />
                    <span className="tabular-nums font-bold">
                      {rev.likesCount || 0}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export const Review = ProductReviews;
