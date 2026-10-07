import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductReview } from '../types';
import { INITIAL_REVIEWS } from '../data/products';

interface ReviewsContextType {
  reviews: Record<string, ProductReview[]>; // productId -> reviews array
  addReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'likesCount'>) => void;
  likeReview: (productId: string, reviewId: string) => void;
  deleteReview: (productId: string, reviewId: string) => void;
  toggleVerifiedBadge: (productId: string, reviewId: string) => void;
  getProductReviews: (productId: string) => ProductReview[];
  getProductRatingStats: (productId: string, defaultRating?: number, defaultCount?: number) => {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: Record<number, number>;
  };
}

const STORAGE_KEY = 'divines_product_reviews_v2';

// Seed initial reviews for our top personalized jewellery products
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
  const [reviews, setReviews] = useState<Record<string, ProductReview[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : SEED_PRODUCT_REVIEWS;
    } catch {
      return SEED_PRODUCT_REVIEWS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews to localStorage', e);
    }
  }, [reviews]);

  const addReview = (
    productId: string,
    reviewData: Omit<ProductReview, 'id' | 'date' | 'likesCount'>
  ) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      likesCount: 0,
    };

    setReviews((prev) => {
      const existing = prev[productId] || [];
      return {
        ...prev,
        [productId]: [newReview, ...existing],
      };
    });
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

  const deleteReview = (productId: string, reviewId: string) => {
    setReviews((prev) => {
      const existing = prev[productId] || [];
      return {
        ...prev,
        [productId]: existing.filter((r) => r.id !== reviewId),
      };
    });
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
    return reviews[productId] || SEED_PRODUCT_REVIEWS[productId] || INITIAL_REVIEWS.slice(0, 2);
  };

  const getProductRatingStats = (productId: string, defaultRating = 4.9, defaultCount = 12) => {
    const prodReviews = getProductReviews(productId);
    if (prodReviews.length === 0) {
      return {
        averageRating: defaultRating,
        totalReviews: defaultCount,
        ratingBreakdown: { 5: 80, 4: 15, 3: 5, 2: 0, 1: 0 },
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
        toggleVerifiedBadge,
        getProductReviews,
        getProductRatingStats,
      }}
    >
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
