import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, MessageSquare, ShieldCheck } from 'lucide-react';

interface ReviewRecord {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  title?: string;
  comment: string;
  status: string;
  is_verified_buyer: boolean;
  created_at: string;
}

export const AdminReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl border border-[#F3E8E2] shadow-xs flex items-center justify-between">
        <div className="font-serif text-base font-bold text-[#211D1C] flex items-center gap-2">
          <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
          <span>Verified Customer Reviews Moderation</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#F3E8E2] p-6 text-xs text-stone-500 text-center font-serif">
        All reviews must originate from verified delivered orders. Ratings and review counts are computed dynamically from approved reviews.
      </div>
    </div>
  );
};
