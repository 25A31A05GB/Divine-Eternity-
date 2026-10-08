import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProductReview } from '../types';
import { INITIAL_REVIEWS } from '../data/products';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ReviewsContextType {
  reviews: Record<string, ProductReview[]>; // productId -> reviews array
  addReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'likesCount'>) => Promise<{ success: boolean; message: string }>;
  likeReview: (productId: string, reviewId: string) => void;
  deleteReview: (productId: string, reviewId: string) => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  toggleVerifiedBadge: (productId: string, reviewId: string) => void;
  getProductReviews: (productId: string) => ProductReview[];
  getProductRatingStats: (productId: string, defaultRating?: number, defaultCount?: number) => {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: Record<number, number>;
  };
  error: string | null;
  clearError: () => void;
  successMessage: string | null;
  clearSuccess: () => void;
  refreshReviews: () => Promise<void>;
}

// Initial catalog fallback seeds
const SEED_PRODUCT_REVIEWS: Record<string, ProductReview[]> = {
  'jewel-1': [
    {
      id: 'rev-j1-1',
      author: 'Arvind Sharma',
      rating: 5,
      date: '2 days ago',
      verified: true,
      title: 'Heavy matte black finish, looks super premium',
      comment: 'The laser engraving of my anniversary date is so crisp. The box chain feels solid and heavy. Worn it every day since receiving it.',
      giftTypeUsed: "Custom Men's Matte Black Tag Necklace",
      likesCount: 18,
    },
    INITIAL_REVIEWS[0],
  ],
  'jewel-2': [
    INITIAL_REVIEWS[0],
    {
      id: 'rev-j2-1',
      author: 'Ananya Roy',
      rating: 5,
      date: '3 days ago',
      verified: true,
      title: 'The cursive calligraphy is like poetry in gold!',
      comment: 'The nameplate is delicate yet strong, and the 18k gold shine is radiant without looking tacky. Best gift my partner ever gave me.',
      giftTypeUsed: 'Dainty Cursive Name Chain Bracelet',
      likesCount: 24,
    },
  ],
  'jewel-3': [
    INITIAL_REVIEWS[1],
    {
      id: 'rev-j3-1',
      author: 'Karan Mehra',
      rating: 5,
      date: '1 week ago',
      verified: true,
      title: 'Solid Figaro links with beautiful shine',
      comment: 'Very comfortable contour curve on the ID bar. Packaging was immaculate with a personalized note and certificate.',
      giftTypeUsed: 'Gold Figaro Chain ID Nameplate Bracelet',
      likesCount: 14,
    },
  ],
  'jewel-16': [
    INITIAL_REVIEWS[2],
    {
      id: 'rev-j16-1',
      author: 'Pooja Varma',
      rating: 5,
      date: '4 days ago',
      verified: true,
      title: 'A true heirloom memory',
      comment: 'The locket opens smoothly and the miniature photos of my late grandmother look so clear and heartwarming. Thank you Sonu for creating this!',
      giftTypeUsed: 'Vintage Memoir Photo Book Locket Pendant',
      likesCount: 32,
    },
  ],
};

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState<Record<string, ProductReview[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccessMessage(null), []);

  // Fetch approved reviews from Supabase reviews table
  const refreshReviews = useCallback(async () => {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const { data, error: fetchErr } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (fetchErr) {
        console.error('Supabase reviews load error', fetchErr);
        return;
      }

      if (data && data.length > 0) {
        const grouped: Record<string, ProductReview[]> = {};
        data.forEach((r: any) => {
          const item: ProductReview = {
            id: r.id,
            author: r.author || 'Patron',
            rating: Number(r.rating) || 5,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently',
            verified: r.verified ?? true,
            title: r.title || 'Verified Keepsake Experience',
            comment: r.comment || '',
            likesCount: 0,
            giftTypeUsed: 'Personalized Keepsake',
          };
          const prodId = r.product_id;
          if (!grouped[prodId]) grouped[prodId] = [];
          if (!grouped[prodId].some((ex) => ex.id === item.id)) {
            grouped[prodId] = [item, ...grouped[prodId]];
          }
        });
        setReviews(grouped);
      } else {
        setReviews({});
      }
    } catch (e: any) {
      console.warn('Reviews fetch fallback warning', e);
    }
  }, []);

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  // Logged-in users submit with status 'pending' to Supabase reviews table
  const addReview = async (
    productId: string,
    reviewData: Omit<ProductReview, 'id' | 'date' | 'likesCount'>
  ): Promise<{ success: boolean; message: string }> => {
    if (!isAuthenticated || !user?.id) {
      setError('Please log in with your email or phone to submit an authentic product review.');
      openAuthModal('login');
      return {
        success: false,
        message: 'Authentication required. Please sign in to submit a review.',
      };
    }

    if (!isSupabaseConfigured() || !supabase) {
      setError('Database is not configured. Review could not be submitted.');
      return { success: false, message: 'Database not configured' };
    }

    try {
      const { data, error: insertErr } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          author: reviewData.author || user.name || 'Patron',
          rating: reviewData.rating,
          title: reviewData.title || null,
          comment: reviewData.comment,
          verified: true,
          status: 'pending', // Logged-in users submit with status 'pending'
        })
        .select();

      if (insertErr) {
        console.error('Supabase review insert failed', insertErr);
        setError(`Failed to submit review to Supabase: ${insertErr.message}`);
        return { success: false, message: insertErr.message };
      }

      setSuccessMessage('Thank you! Your review has been submitted for moderation and will appear once verified by our team.');
      return {
        success: true,
        message: 'Review submitted for moderation! It will appear once approved by our atelier.',
      };
    } catch (e: any) {
      setError(`Failed to submit review: ${e.message}`);
      return { success: false, message: e.message };
    }
  };

  const likeReview = (productId: string, reviewId: string) => {
    setReviews((prev) => {
      const existing = prev[productId] || [];
      return {
        ...prev,
        [productId]: existing.map((r) =>
          r.id === reviewId ? { ...r, likesCount: r.likesCount + 1 } : r
        ),
      };
    });
  };

  const deleteReview = async (productId: string, reviewId: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error: delErr } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (delErr) {
        setError(`Failed to delete review from Supabase: ${delErr.message}`);
        return;
      }
    }
    setReviews((prev) => {
      const existing = prev[productId] || [];
      return {
        ...prev,
        [productId]: existing.filter((r) => r.id !== reviewId),
      };
    });
  };

  const approveReview = async (reviewId: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error: appErr } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', reviewId);

      if (appErr) {
        setError(`Failed to approve review in Supabase: ${appErr.message}`);
        return;
      }
      await refreshReviews();
    }
  };

  const toggleVerifiedBadge = (productId: string, reviewId: string) => {
    setReviews((prev) => {
      const existing = prev[productId] || [];
      return {
        ...prev,
        [productId]: existing.map((r) =>
          r.id === reviewId ? { ...r, verified: !r.verified } : r
        ),
      };
    });
  };

  const getProductReviews = (productId: string): ProductReview[] => {
    return reviews[productId] || [];
  };

  const getProductRatingStats = (productId: string) => {
    const prodReviews = getProductReviews(productId);
    if (prodReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const total = prodReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = Number((total / prodReviews.length).toFixed(1));

    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    prodReviews.forEach((r) => {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
    });

    return {
      averageRating: avg,
      totalReviews: prodReviews.length,
      ratingBreakdown: breakdown,
    };
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        addReview,
        likeReview,
        deleteReview,
        approveReview,
        toggleVerifiedBadge,
        getProductReviews,
        getProductRatingStats,
        error,
        clearError,
        successMessage,
        clearSuccess,
        refreshReviews,
      }}
    >
      {/* Visible Error Notification */}
      {error && (
        <div className="fixed bottom-4 left-4 z-[9999] max-w-md bg-rose-900/95 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-rose-500/50 flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-2">
          <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-rose-100">Review Database Error</p>
            <p className="text-rose-200 mt-0.5 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-rose-300 hover:text-white p-1 rounded transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Visible Success Notification */}
      {successMessage && (
        <div className="fixed bottom-4 left-4 z-[9999] max-w-md bg-emerald-900/95 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-emerald-100">Review Moderation Notice</p>
            <p className="text-emerald-200 mt-0.5 leading-relaxed">{successMessage}</p>
          </div>
          <button
            onClick={clearSuccess}
            className="text-emerald-300 hover:text-white p-1 rounded transition-colors"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
