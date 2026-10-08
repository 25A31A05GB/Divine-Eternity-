import type { Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin, verifyUserToken, isSupabaseAdminConfigured } from './_lib/supabaseAdmin';

const updateStatusSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  status: z.string().min(1, 'Status is required'),
  trackingNumber: z.string().optional().nullable(),
});

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'PATCH' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    const { role } = await verifyUserToken(authHeader);

    // Confirm profiles.role is admin or staff. Reject others with 403.
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Admin or staff access required to modify order status.',
      });
    }

    const parseResult = updateStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status update payload',
        details: parseResult.error.format(),
      });
    }

    const { orderId, status, trackingNumber } = parseResult.data;
    const cleanId = orderId.trim().toUpperCase();

    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return res.status(500).json({
        success: false,
        error: 'Database admin connection not configured on server.',
      });
    }

    // Retrieve existing order timeline
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('id, timeline, status, tracking_number')
      .eq('id', cleanId)
      .maybeSingle();

    if (fetchErr || !existing) {
      return res.status(404).json({ success: false, error: `Order ${cleanId} not found.` });
    }

    const currentTimeline = Array.isArray(existing.timeline) ? existing.timeline : [];
    const newTimelineEntry = {
      status,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      location: 'Divine Fulfillment Hub',
      description: trackingNumber
        ? `Order marked ${status}. AWB Tracking Number: ${trackingNumber}`
        : `Order status updated to ${status}`,
    };

    const updatedTimeline = [...currentTimeline, newTimelineEntry];

    const updatePayload: Record<string, any> = {
      status,
      timeline: updatedTimeline,
      updated_at: new Date().toISOString(),
    };
    if (trackingNumber !== undefined) {
      updatePayload.tracking_number = trackingNumber;
    }

    const { data: updatedOrder, error: updateErr } = await supabaseAdmin
      .from('orders')
      .update(updatePayload)
      .eq('id', cleanId)
      .select()
      .maybeSingle();

    if (updateErr) {
      return res.status(500).json({ success: false, error: updateErr.message });
    }

    return res.json({
      success: true,
      message: `Order ${cleanId} updated to ${status}.`,
      order: updatedOrder,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}
