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

const STORAGE_KEY = 'divines_product_reviews_v1';

// Seed initial reviews for our top products
const SEED_PRODUCT_REVIEWS: Record<string, ProductReview[]> = {
  'prod-1': [
    INITIAL_REVIEWS[0],
    INITIAL_REVIEWS[3],
    {
      id: 'rev-p1-1',
      author: 'Sneha Roy',
      rating: 5,
      date: '3 days ago',
      verified: true,
      title: 'Stunning pearl finish and sturdy grip',
      comment: 'I was worried the bracelet might break, but the string is reinforced steel wire coated in nylon! Very strong and looks so luxurious.',
      phoneModelUsed: 'iPhone 16 Pro',
      likesCount: 15,
    },
  ],
  'prod-2': [
    INITIAL_REVIEWS[2],
    {
      id: 'rev-p2-1',
      author: 'Kavya Nair',
      rating: 5,
      date: '5 days ago',
      verified: true,
      title: 'Fits my cards and lip gloss perfectly',
      comment: 'The zipper glide is so smooth and the vegan leather doesn’t peel. Perfect for clubbing and quick grocery runs!',
      phoneModelUsed: 'Galaxy S24+',
      likesCount: 11,
    },
  ],
  'prod-3': [
    INITIAL_REVIEWS[1],
    {
      id: 'rev-p3-1',
      author: 'Zoya Khan',
      rating: 5,
      date: '1 week ago',
      verified: true,
      title: 'Mirror selfies look 10x cuter',
      comment: 'Zero fish-eye distortion, real glass-like reflection. Every girl needs this in her bag!',
      phoneModelUsed: 'iPhone 15 Pro',
      likesCount: 22,
    },
  ],
  'prod-4': [
    {
      id: 'rev-p4-1',
      author: 'Ishita Sen',
      rating: 5,
      date: '4 days ago',
      verified: true,
      title: 'Real pressed flowers look magical',
      comment: 'The 24k gold flakes catch the sunlight in the dreamiest way. The case is crystal clear with no yellowing.',
      phoneModelUsed: 'Pixel 9 Pro',
      likesCount: 8,
    },
  ],
  'prod-5': [
    {
      id: 'rev-p5-1',
      author: 'Meera Deshmukh',
      rating: 5,
      date: '2 days ago',
      verified: true,
      title: 'The coquette bow is so tactile and soft',
      comment: 'Got my name engraved on the bottom and it looks straight out of a Paris boutique!',
      phoneModelUsed: 'iPhone 16',
      likesCount: 14,
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
