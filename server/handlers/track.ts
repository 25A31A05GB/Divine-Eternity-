import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { trackOrderSchema } from '../lib/schemas';
import { rateLimit } from '../lib/rateLimiter';

const limiter = rateLimit(10, 60000);

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  limiter(req, res, async () => {
    try {
      const parseResult = trackOrderSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Order ID and valid phone number are required.' });
      }

      const { orderId, phone } = parseResult.data;
      const cleanId = orderId.trim().toUpperCase();
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);

      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('id, status, payment_status, tracking_number, created_at, timeline, customer')
        .eq('id', cleanId)
        .maybeSingle();

      if (error || !data) {
        return res.status(404).json({ success: false, error: `No order found with ID "${cleanId}".` });
      }

      const orderPhone = String(data.customer?.phone || '').replace(/\D/g, '').slice(-10);
      if (orderPhone !== cleanPhone) {
        return res.status(404).json({ success: false, error: 'Mobile number does not match order records.' });
      }

      return res.json({
        success: true,
        order: {
          id: data.id,
          fulfillmentStatus: data.status,
          paymentStatus: data.payment_status,
          trackingNumber: data.tracking_number,
          courierPartner: 'Delhivery / BlueDart Express',
          createdAt: data.created_at,
          timeline: data.timeline || [],
        },
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Internal server error' });
    }
  });
}
