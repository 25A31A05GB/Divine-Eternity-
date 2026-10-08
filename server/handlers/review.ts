import type { Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin, verifyUserToken } from '../lib/supabaseAdmin';

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
        return res.status(403).json({ success: false, error: 'Admin access required' });
      }

      const { data: reviews, error } = await supabaseAdmin
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.json({ success: true, reviews });
    }

    // Public query: Return only approved reviews for the product
    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

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

    // Customer Name resolution
    let customerName = 'Verified Patron';
    if (user?.id) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();
      if (profile?.full_name) {
        customerName = profile.full_name;
      }
    }

    // Verify buyer if orderId supplied
    let isVerifiedBuyer = false;
    if (orderId) {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id, payment_status')
        .eq('id', orderId.trim().toUpperCase())
        .maybeSingle();
      if (order && order.payment_status === 'Paid') {
        isVerifiedBuyer = true;
      }
    }

    const { data: review, error: insertErr } = await supabaseAdmin
      .from('reviews')
      .insert({
        product_id: productId,
        order_id: orderId || null,
        user_id: user?.id || null,
        customer_name: customerName,
        rating,
        title: title || null,
        comment,
        photo_urls: photoUrls || [],
        status: 'approved', // Auto-approved or moderation queue
        is_verified_buyer: isVerifiedBuyer,
      })
      .select()
      .maybeSingle();

    if (insertErr) {
      return res.status(500).json({ success: false, error: insertErr.message });
    }

    return res.json({
      success: true,
      message: 'Thank you for your feedback! Your review is published.',
      review,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
