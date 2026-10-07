import React from 'react';
import { CustomerReviews, CustomerReviewsProps } from './CustomerReviews';
import { Product } from '../../types';

export interface ReviewProps extends CustomerReviewsProps {}

/**
 * Review Component
 * Displays user ratings, distribution breakdown, verified customer feedback,
 * filtering/sorting controls, and an interactive review submission form for products.
 * Seamlessly integrates with ReviewsProvider and useReviews context.
 */
export const Review: React.FC<ReviewProps> = (props) => {
  return <CustomerReviews {...props} />;
};

export { CustomerReviews };
export default Review;
