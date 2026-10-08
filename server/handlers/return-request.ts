import type { Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin, verifyUserToken } from '../lib/supabaseAdmin';
import { notifyOrderStatus } from '../lib/notify';
import { rateLimit } from '../lib/rateLimiter';

const limiter = rateLimit(15, 60000);

const returnRequestSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  phone: z.string().min(10, 'Phone number is required'),
  type: z.enum(['cancel', 'replace', 'refund']),
  reason: z.string().min(3, 'Reason is required'),
  details: z.string().optional(),
  photoUrls: z.array(z.string()).optional(),
});

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const { role } = await verifyUserToken(authHeader);
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Database connection unconfigured' });
    }
    const { data: requests, error } = await supabaseAdmin
      .from('return_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.json({ success: true, requests });
  }

  if (req.method === 'PATCH') {
    const authHeader = req.headers.authorization;
    const { role } = await verifyUserToken(authHeader);
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Database connection unconfigured' });
    }
    const { id, status, admin_note, refund_amount, refund_reference } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Request ID is required' });
    }
    const updates: Record<string, any> = {};
    if (status !== undefined) updates.status = status;
    if (admin_note !== undefined) updates.admin_note = admin_note;
    if (refund_amount !== undefined) updates.refund_amount = refund_amount;
    if (refund_reference !== undefined) updates.refund_reference = refund_reference;

    const { data, error } = await supabaseAdmin
      .from('return_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.json({ success: true, request: data });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  limiter(req, res, async () => {
    try {
      const parseResult = returnRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid return payload',
          details: parseResult.error.format(),
        });
      }

      const { orderId, phone, type, reason, details, photoUrls } = parseResult.data;
      const cleanOrderId = orderId.trim().toUpperCase();
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);

      const authHeader = req.headers.authorization;
      const { user } = await verifyUserToken(authHeader);

      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, error: 'Database connection unconfigured' });
      }

      // 1. Fetch Order from Supabase
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', cleanOrderId)
        .maybeSingle();

      if (error || !order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      const customer = order.customer || {};
      const orderPhone = String(customer.phone || '').replace(/\D/g, '').slice(-10);

      // Verify ownership (phone match OR user_id match)
      if (orderPhone !== cleanPhone && (!user || user.id !== order.user_id)) {
        return res.status(403).json({ success: false, error: 'Order ID or phone number verification failed.' });
      }

      // 2. Cancellation handling
      if (type === 'cancel') {
        const cancellableStatuses = ['Placed', 'Packed', 'Processing'];
        if (!cancellableStatuses.includes(order.status)) {
          return res.status(400).json({
            success: false,
            error: `Order is currently in "${order.status}" status and cannot be cancelled directly. Please request a return instead.`,
          });
        }

        // Direct Cancellation: update order status & restore stock
        const newTimeline = Array.isArray(order.timeline) ? order.timeline : [];
        newTimeline.push({
          status: 'Cancelled',
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          description: `Order cancelled by customer. Reason: ${reason}`,
        });

        await supabaseAdmin.from('orders').update({
          status: 'Cancelled',
          timeline: newTimeline,
        }).eq('id', cleanOrderId);

        // Restore stock for all items
        const items = Array.isArray(order.items) ? order.items : [];
        for (const item of items) {
          if (item.productId) {
            try {
              await supabaseAdmin.rpc('restore_stock', {
                p_product_id: item.productId,
                p_qty: Number(item.quantity) || 1,
              });
            } catch (e) {
              console.warn('Stock restore exception:', e);
            }
          }
        }

        // Record in return_requests table
        await supabaseAdmin.from('return_requests').insert({
          order_id: cleanOrderId,
          user_id: user?.id || null,
          phone: cleanPhone,
          type: 'cancel',
          reason,
          details,
          photo_urls: photoUrls || [],
          status: 'completed',
          admin_note: 'Auto-approved order cancellation',
        });

        // Notify customer
        notifyOrderStatus({
          orderId: cleanOrderId,
          eventType: 'return_update',
          customerName: customer.fullName || 'Valued Client',
          customerEmail: customer.email,
          customerPhone: customer.phone,
          returnReason: `Cancellation: ${reason}`,
        });

        return res.json({
          success: true,
          message: `Order #${cleanOrderId} has been cancelled successfully and stock restored.`,
          status: 'Cancelled',
        });
      }

      // 3. Replacement / Refund Requests: Validate 7-day policy window from order creation
      const createdAt = new Date(order.created_at || Date.now()).getTime();
      const daysDiff = (Date.now() - createdAt) / (1000 * 3600 * 24);
      if (daysDiff > 7) {
        return res.status(400).json({
          success: false,
          error: 'This order exceeds the 7-day replacement/return policy window.',
        });
      }

      // Record request
      const { data: request, error: reqErr } = await supabaseAdmin.from('return_requests').insert({
        order_id: cleanOrderId,
        user_id: user?.id || null,
        phone: cleanPhone,
        type,
        reason,
        details,
        photo_urls: photoUrls || [],
        status: 'requested',
      }).select().maybeSingle();

      if (reqErr) {
        return res.status(500).json({ success: false, error: reqErr.message });
      }

      return res.json({
        success: true,
        message: `Your ${type} request for Order #${cleanOrderId} has been submitted. Our concierge team will review within 24 hours.`,
        request,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
}
