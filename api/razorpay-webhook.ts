import type { Request, Response } from 'express';
import crypto from 'crypto';
import { supabaseAdmin, isSupabaseAdminConfigured } from './_lib/supabaseAdmin';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (webhookSecret && signature) {
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    const digestBuf = Buffer.from(digest, 'utf8');
    const sigBuf = Buffer.from(signature, 'utf8');
    if (digestBuf.length !== sigBuf.length || !crypto.timingSafeEqual(digestBuf, sigBuf)) {
      return res.status(400).json({ status: 'invalid_signature' });
    }
  }

  const event = req.body.event;
  const paymentEntity = req.body.payload?.payment?.entity;

  if (event === 'payment.captured' && paymentEntity && isSupabaseAdminConfigured() && supabaseAdmin) {
    const rzpOrderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    try {
      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'Paid',
          payment_id: paymentId,
        })
        .eq('razorpay_order_id', rzpOrderId);
    } catch (err) {
      console.warn('Webhook DB update error', err);
    }
  }

  return res.json({ status: 'ok', eventReceived: event });
}
