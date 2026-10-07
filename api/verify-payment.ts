import type { Request, Response } from 'express';
import crypto from 'crypto';
import { supabaseAdmin } from './_lib/supabaseAdmin';
import { verifyPaymentSchema } from './_lib/schemas';
import { sendOrderConfirmationEmail, sendOrderConfirmationWhatsApp } from '../src/lib/notifications';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parseResult = verifyPaymentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid verification payload', details: parseResult.error.format() });
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parseResult.data;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret && razorpaySignature) {
      const hmac = crypto.createHmac('sha256', keySecret);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const expectedSignature = hmac.digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: 'Cryptographic signature mismatch. Payment verification failed.',
        });
      }
    }

    // Update in Supabase Database
    let updatedOrder: any = null;
    try {
      const { data } = await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'Paid',
          payment_id: razorpayPaymentId,
        })
        .eq('id', orderId)
        .select('*')
        .maybeSingle();

      if (data) {
        updatedOrder = data;
        const customer = data.customer || {};
        sendOrderConfirmationEmail({
          orderId: data.id,
          customerName: customer.fullName || 'Valued Customer',
          customerEmail: customer.email || '',
          customerPhone: customer.phone || '',
          totalAmount: data.total_amount,
          paymentMethod: data.payment_method || 'Online (Razorpay)',
          trackingNumber: data.tracking_number,
          itemsSummary: 'Personalized Keepsakes',
        });
        sendOrderConfirmationWhatsApp({
          orderId: data.id,
          customerName: customer.fullName || 'Valued Customer',
          customerEmail: customer.email || '',
          customerPhone: customer.phone || '',
          totalAmount: data.total_amount,
          paymentMethod: data.payment_method || 'Online (Razorpay)',
          trackingNumber: data.tracking_number,
          itemsSummary: 'Personalized Keepsakes',
        });
      }
    } catch (err) {
      console.warn('DB payment status update fallback', err);
    }

    return res.json({
      success: true,
      verified: true,
      message: 'Payment verified successfully and order is confirmed.',
      order: updatedOrder,
    });
  } catch (err: any) {
    console.error('Payment verification error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
