import type { Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin, isSupabaseAdminConfigured } from './_lib/supabaseAdmin';
import { rateLimit } from './_lib/rateLimiter';

const limiter = rateLimit(10, 60000);

const trackOrderSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
});

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const runHandler = async () => {
    try {
      const parseResult = trackOrderSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(404).json({ success: false, error: 'Order not found or verification failed.' });
      }

      const { orderId, phone } = parseResult.data;
      const cleanId = orderId.trim().toUpperCase();
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);

      if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
        return res.status(404).json({ success: false, error: 'Order not found or verification failed.' });
      }

      // Look up order with the service role
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('id, status, tracking_number, timeline, created_at, total_amount, customer')
        .eq('id', cleanId)
        .maybeSingle();

      if (error || !data || !data.customer) {
        return res.status(404).json({ success: false, error: 'Order not found or verification failed.' });
      }

      const orderPhone = String(data.customer?.phone || '').replace(/\D/g, '').slice(-10);
      if (orderPhone !== cleanPhone) {
        // Return identical generic 404 for wrong id or wrong phone
        return res.status(404).json({ success: false, error: 'Order not found or verification failed.' });
      }

      // Fetch items with only name and quantity (never address, email, payment secrets)
      let items: Array<{ name: string; quantity: number }> = [];
      try {
        const { data: itemRows } = await supabaseAdmin
          .from('order_items')
          .select('name, quantity')
          .eq('order_id', cleanId);

        if (itemRows && itemRows.length > 0) {
          items = itemRows.map((it: any) => ({
            name: it.name,
            quantity: Number(it.quantity) || 1,
          }));
        }
      } catch {
        // continue
      }

      // Return ONLY safe fields: id, status, trackingNumber, timeline, items, createdAt, totalAmount
      return res.json({
        success: true,
        order: {
          id: data.id,
          status: data.status,
          trackingNumber: data.tracking_number || null,
          timeline: data.timeline || [],
          items,
          createdAt: data.created_at,
          totalAmount: data.total_amount,
        },
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: 'Order not found or verification failed.' });
    }
  };

  limiter(req, res, runHandler);
}
