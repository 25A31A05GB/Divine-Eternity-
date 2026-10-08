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
  Filter,
  Check,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, ProductReview } from '../../types';
import { useReviews } from '../../context/ReviewsContext';
import { soundFeedback } from '../../lib/soundFeedback';

export interface CustomerReviewsProps {
  product: Product;
  className?: string;
  onExploreMore?: () => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  product,
  className = '',
  onExploreMore,
}) => {
  const {
    getProductReviews,
    getProductRatingStats,
    addReview,
    likeReview,
  } = useReviews();

  const reviewsList = getProductReviews(product.id);
  const { averageRating, totalReviews, ratingBreakdown } = getProductRatingStats(product.id);

  // Filter & Sort State
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
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
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Rating label feedback
  const ratingLabels: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good Quality & Service',
    4: 'Very Satisfied ✨',
    5: 'Loved it! Pure Handcrafted Perfection ✨💖',
  };

  const handleLike = (reviewId: string) => {
    if (likedReviews[reviewId]) return;
    likeReview(product.id, reviewId);
    soundFeedback.playSoftPing();
    setLikedReviews((prev) => ({ ...prev, [reviewId]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setFormError('Please provide your full name.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setFormError('Please share a few words about your experience (at least 5 characters).');
      return;
    }

    addReview(product.id, {
      author: author.trim(),
      rating,
      title: title.trim() || 'Exquisite bespoke gift!',
      comment: comment.trim(),
      verified: true,
      giftTypeUsed: giftTypeUsed.trim() || product.name,
    });

    soundFeedback.playSuccessChime();

    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#FF2E93', '#FFD94A', '#D4AF37', '#10B981'],
      });
    } catch {
      // ignore
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowReviewForm(false);
      setAuthor('');
      setTitle('');
      setComment('');
      setReviewPhotoUrl('');
      setFormError('');
    }, 2000);
  };

  // Filter and Sort Process
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviewsList];

    // Star rating filter
    if (starFilter !== 'all') {
      result = result.filter((r) => r.rating === starFilter);
    }

    // Verified only filter
    if (onlyVerified) {
      result = result.filter((r) => r.verified);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      if (sortBy === 'helpful') return (b.likesCount || 0) - (a.likesCount || 0);
      return 0; // default recent/original
    });

    return result;
  }, [reviewsList, starFilter, onlyVerified, sortBy]);

  // Recommended % calculation (4 & 5 stars / total)
  const fiveStarsCount = ratingBreakdown[5] || 0;
  const fourStarsCount = ratingBreakdown[4] || 0;
  const recommendedPercent = Math.min(
    100,
    Math.round(((fiveStarsCount + fourStarsCount) / Math.max(1, totalReviews)) * 100)
  );

  return (
    <section className={`py-12 sm:py-16 border-t border-[#F3E8E2] ${className}`} id="customer-reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF2E93] tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Authentic Client Impressions</span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#211D1C] tracking-tight">
              Customer Reviews & Verified Stories
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              Discover real experiences from verified patrons celebrating weddings, anniversaries, and personal milestones with Divine’s Eternity.
            </p>
          </div>

          <button
            onClick={() => {
              setShowReviewForm(true);
              soundFeedback.playSoftPing();
            }}
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#E02680] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:brightness-105 active:scale-98 transition-all cursor-pointer"
          >
            <PenLine className="w-4 h-4" />
            <span>Write an Authentic Review</span>
          </button>
        </div>

        {/* Rating Overview Grid or Empty State */}
        {totalReviews > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FFF9EB] border border-[#F5E6CE] rounded-3xl p-6 sm:p-8 shadow-xs">
            {/* Main Average Score */}
            <div className="md:col-span-4 flex flex-col justify-center items-center text-center md:border-r border-[#F3E8E2] md:pr-6 space-y-3">
              <div className="font-serif-heading text-5xl sm:text-6xl font-extrabold text-[#211D1C]">
                {averageRating.toFixed(1)}
              </div>
              
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(averageRating)
                        ? 'text-[#FFD94A] fill-[#FFD94A]'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs font-bold text-stone-700">
                Based on {totalReviews} verified patron reviews
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{recommendedPercent}% would recommend this keepsake</span>
              </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingBreakdown[stars] || 0;
                const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                const isSelected = starFilter === stars;

                return (
                  <button
                    key={stars}
                    onClick={() => setStarFilter(isSelected ? 'all' : stars)}
                    className={`w-full flex items-center gap-3 group text-left p-1.5 rounded-xl transition-colors cursor-pointer ${
                      isSelected ? 'bg-white shadow-xs' : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-1 w-14 shrink-0 text-xs font-bold text-stone-700">
                      <span>{stars}</span>
                      <Star className="w-3.5 h-3.5 text-[#FFD94A] fill-[#FFD94A]" />
                    </div>

                    <div className="flex-1 h-2.5 bg-stone-200/80 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-[#FFD94A] to-[#FF2E93] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="w-16 text-right shrink-0 text-xs font-semibold text-stone-500 group-hover:text-[#211D1C]">
                      {count} ({percent}%)
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-3xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#F5E6CE] flex items-center justify-center text-[#FF2E93] mx-auto shadow-xs">
              <Sparkles className="w-6 h-6 text-[#FFD94A]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#211D1C]">
                Be the First to Review This Keepsake
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                No customer reviews have been published yet for this piece. Have you received yours? Share your experience with fellow patrons!
              </p>
            </div>
            <button
              onClick={() => {
                setShowReviewForm(true);
                soundFeedback.playSoftPing();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Write the First Review</span>
            </button>
          </div>
        )}

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          
          {/* Star Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStarFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                starFilter === 'all'
                  ? 'bg-[#211D1C] text-white shadow-xs'
                  : 'bg-white border border-[#E7E2DA] text-stone-700 hover:border-[#FF2E93]'
              }`}
            >
              All Reviews ({totalReviews})
            </button>

            {[5, 4, 3].map((s) => (
              <button
                key={s}
                onClick={() => setStarFilter(starFilter === s ? 'all' : s)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  starFilter === s
                    ? 'bg-[#FF2E93] text-white shadow-xs'
                    : 'bg-white border border-[#E7E2DA] text-stone-700 hover:border-[#FF2E93]'
                }`}
              >
                <span>{s}★</span>
                <span className="text-[10px] opacity-80">({ratingBreakdown[s] || 0})</span>
              </button>
            ))}

            {/* Verified Buyers Only Filter */}
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                onlyVerified
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-[#E7E2DA] text-stone-700 hover:border-emerald-600'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Buyers</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E7E2DA] rounded-full px-3.5 py-1.5 text-xs font-bold text-[#211D1C] outline-none cursor-pointer focus:border-[#FF2E93]"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {filteredAndSortedReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#F3E8E2] p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#FF2E93] mx-auto flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
              No reviews match this filter
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Be the first to share your thoughts or clear your filters to view all feedback.
            </p>
            <button
              onClick={() => {
                setStarFilter('all');
                setOnlyVerified(false);
              }}
              className="px-5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredAndSortedReviews.map((rev, idx) => (
              <div
                key={`${rev.id}-${idx}`}
                className="bg-white rounded-3xl border border-[#F3E8E2] p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Top Bar: Author, Avatar, Rating & Date */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#211D1C] to-[#FF2E93] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        {rev.author ? rev.author[0].toUpperCase() : 'P'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-[#211D1C]">
                            {rev.author}
                          </span>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified Buyer</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {rev.date || 'Verified Purchase'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 bg-[#FFF9EB] px-2.5 py-1 rounded-full border border-[#F5E6CE]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'text-[#FFD94A] fill-[#FFD94A]'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title & Comment */}
                  <div className="space-y-1.5">
                    {rev.title && (
                      <h4 className="font-bold text-sm text-[#211D1C]">
                        {rev.title}
                      </h4>
                    )}
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Purchase Item Tag */}
                  {rev.giftTypeUsed && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF0F5] text-[#FF2E93] text-[11px] font-semibold border border-[#FFE0EB]">
                      <Award className="w-3 h-3" />
                      <span className="truncate max-w-[280px]">Purchased: {rev.giftTypeUsed}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Like / Helpful Button */}
                <div className="pt-3 border-t border-[#F3E8E2] flex items-center justify-between text-xs text-stone-500">
                  <span className="text-[11px]">Was this review helpful?</span>

                  <button
                    onClick={() => handleLike(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      likedReviews[rev.id]
                        ? 'bg-[#FFF0F5] text-[#FF2E93] font-bold border border-[#FFE0EB]'
                        : 'hover:bg-stone-100 text-stone-600'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${
                        likedReviews[rev.id] ? 'fill-[#FF2E93] text-[#FF2E93]' : ''
                      }`}
                    />
                    <span>{likedReviews[rev.id] ? 'Helpful' : 'Helpful'}</span>
                    <span className="text-[11px] font-bold">
                      ({(rev.likesCount || 0) + (likedReviews[rev.id] ? 1 : 0)})
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Review Submission Modal Form */}
      {showReviewForm && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-lg rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in duration-200 text-[#211D1C] max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E93] block">
                  DIVINE’S ETERNITY · VERIFIED PATRON
                </span>
                <h3 className="font-serif-heading font-bold text-xl text-[#211D1C] mt-0.5">
                  Share Your Experience
                </h3>
              </div>
              <button
                onClick={() => setShowReviewForm(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-serif-heading font-bold text-xl text-[#211D1C]">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Your review has been verified and published to the Divine’s Eternity customer showcase.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {formError}
                  </div>
                )}

                {/* Interactive Star Rating Selector */}
                <div className="space-y-1.5 text-center bg-[#FFF9EB] border border-[#F5E6CE] rounded-2xl p-4">
                  <label className="text-xs font-bold text-[#211D1C] block">
                    Your Overall Rating
                  </label>
                  
                  <div className="flex items-center justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => {
                          setRating(s);
                          soundFeedback.playSoftPing();
                        }}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            s <= (hoverRating || rating)
                              ? 'text-[#FFD94A] fill-[#FFD94A]'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <p className="text-xs font-bold text-[#FF2E93]">
                    {ratingLabels[hoverRating || rating]}
                  </p>
                </div>

                {/* Author Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#211D1C] block">
                    Your Name (as displayed on review) *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Radhika Agarwal"
                    className="w-full bg-white border border-[#E7E2DA] focus:border-[#FF2E93] rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] outline-none"
                  />
                </div>

                {/* Review Headline */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#211D1C] block">
                    Headline / Summary Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Surpassed expectations! Stunning finish."
                    className="w-full bg-white border border-[#E7E2DA] focus:border-[#FF2E93] rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] outline-none"
                  />
                </div>

                {/* Review Comment */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#211D1C] block">
                    Your Detailed Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the packaging, engraving quality, delivery speed, and reaction from the recipient..."
                    className="w-full bg-white border border-[#E7E2DA] focus:border-[#FF2E93] rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] outline-none resize-none"
                  />
                </div>

                {/* Item Purchased Tag */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#211D1C] block">
                    Product / Keepsake Purchased
                  </label>
                  <input
                    type="text"
                    value={giftTypeUsed}
                    onChange={(e) => setGiftTypeUsed(e.target.value)}
                    placeholder={product.name}
                    className="w-full bg-white border border-[#E7E2DA] focus:border-[#FF2E93] rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF2E93] to-[#E02680] hover:brightness-105 text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  Submit Verified Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
