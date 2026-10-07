import React from 'react';
import { ProductReviews } from './ProductReviews';
import { Product } from '../../types';

export interface ReviewProps {
  product: Product;
  className?: string;
}

/**
 * Review Component
 * Displays user ratings, distribution breakdown, verified customer feedback,
 * filtering/sorting controls, and an interactive review submission form for products.
 * Seamlessly integrates with ReviewsProvider and useReviews context.
 */
export const Review: React.FC<ReviewProps> = (props) => {
  return <ProductReviews {...props} />;
};

export default Review;
