import type { Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin, verifyUserToken } from './_lib/supabaseAdmin';

const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  orderId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(3, 'Review comment must be at least 3 characters'),
  photoUrls: z.array(z.string()).optional(),
});

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // GET: Fetch approved reviews for a product or all pending reviews for admin
  if (req.method === 'GET') {
    const productId = (req.query.productId || '').toString().trim();
    const isAdminQuery = req.query.admin === 'true';

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Database unconfigured' });
    }

    if (isAdminQuery) {
      const authHeader = req.headers.authorization;
      const { role } = await verifyUserToken(authHeader);
      if (role !== 'admin' && role !== 'staff') {
        return res.status(403).json({ success: false, error: 'Admin authorization required' });
      }

      const { data: reviews, error } = await supabaseAdmin
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ success: false, error: error.message });
      return res.json({ success: true, reviews });
    }

    if (!productId) {
      return res.status(400).json({ success: false, error: 'productId query param is required' });
    }

    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, error: error.message });
    return res.json({ success: true, reviews });
  }

  // POST: Submit a new review
  try {
    const parseResult = reviewSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid review payload',
        details: parseResult.error.format(),
      });
    }

    const { productId, orderId, rating, title, comment, photoUrls } = parseResult.data;
    const authHeader = req.headers.authorization;
    const { user } = await verifyUserToken(authHeader);

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Database unconfigured' });
    }

    let isVerifiedBuyer = false;
    let verifiedOrderId = orderId || null;

    // Check if user has a delivered order containing this product
    if (user || orderId) {
      let query = supabaseAdmin.from('orders').select('id, items, status');
      if (user) {
        query = query.eq('user_id', user.id);
      } else if (orderId) {
        query = query.eq('id', orderId);
      }

      const { data: orders } = await query;
      if (orders && orders.length > 0) {
        for (const ord of orders) {
          if (ord.status === 'Delivered') {
            const items = Array.isArray(ord.items) ? ord.items : [];
            const hasProduct = items.some((it: any) => it.productId === productId || it.slug === productId);
            if (hasProduct) {
              isVerifiedBuyer = true;
              verifiedOrderId = ord.id;
              break;
            }
          }
        }
      }
    }

    const customerName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Valued Patron';

    const { data: newReview, error: insErr } = await supabaseAdmin.from('reviews').insert({
      product_id: productId,
      order_id: verifiedOrderId,
      user_id: user?.id || null,
      customer_name: customerName,
      rating,
      title: title || `${rating}-Star Review`,
      comment,
      photo_urls: photoUrls || [],
      status: 'pending', // Requires admin approval
      is_verified_buyer: isVerifiedBuyer,
    }).select().maybeSingle();

    if (insErr) {
      return res.status(500).json({ success: false, error: insErr.message });
    }

    return res.json({
      success: true,
      message: 'Thank you! Your review has been submitted and is awaiting artisan moderation.',
      review: newReview,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
