import type { Request, Response } from 'express';
import crypto from 'crypto';
import { supabaseAdmin, verifyUserToken } from './_lib/supabaseAdmin';
import { createOrderSchema } from './_lib/schemas';
import { rateLimit } from './_lib/rateLimiter';
import { computeAuthoritativePricing } from '../src/shared/pricing';
import { sendOrderConfirmationEmail, sendOrderConfirmationWhatsApp } from '../src/lib/notifications';

const limiter = rateLimit(20, 60000);

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  limiter(req, res, async () => {
    try {
      const parseResult = createOrderSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: parseResult.error.format(),
        });
      }

      const { items, customer, couponCode, isGiftWrapped, giftNote, paymentMethod } = parseResult.data;

      // Extract user if logged in
      const authHeader = req.headers.authorization;
      const { user } = await verifyUserToken(authHeader);

      // Fetch official products from DB to prevent client price tampering
      let catalogProducts: any[] = [];
      if (supabaseAdmin) {
        try {
          const { data } = await supabaseAdmin.from('products').select('*');
          if (data) catalogProducts = data;
        } catch (e) {
          console.warn('DB catalog fetch fallback', e);
        }
      }

      // Fetch coupon directly from Supabase coupons table (server-side validation)
      let dbCoupon = null;
      if (couponCode && couponCode.trim() && supabaseAdmin) {
        try {
          const { data } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .ilike('code', couponCode.trim())
            .maybeSingle();
          if (data && data.is_active !== false) {
            dbCoupon = {
              code: data.code,
              description: data.description,
              type: data.type,
              value: Number(data.value),
              minOrderValue: Number(data.min_order_value || 0),
              minItems: Number(data.min_items || 1),
              isActive: data.is_active,
              expiresAt: data.expires_at,
            };
          }
        } catch (e) {
          console.warn('DB coupon fetch error', e);
        }
      }

      // Authoritative pricing calculation on the server
      const pricing = computeAuthoritativePricing({
        items: items as any,
        couponCode,
        isGiftWrapped,
        state: customer.state,
        catalogProducts,
        dbCoupon,
      });

      const orderId = `DE-${Math.floor(100000 + Math.random() * 900000)}`;
      // Set trackingNumber to null and status 'Placed'. Admin enters the real AWB later.
      const trackingNumber: string | null = null;
      const isCOD = paymentMethod === 'COD';

      let razorpayOrderId: string | undefined;

      if (!isCOD) {
        const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (keyId && keySecret) {
          try {
            const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
            const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${auth}`,
              },
              body: JSON.stringify({
                amount: Math.round(pricing.totalAmount * 100),
                currency: 'INR',
                receipt: orderId,
                notes: { customerName: customer.fullName, orderId },
              }),
            });
            if (rzpRes.ok) {
              const rzpData = await rzpRes.json();
              razorpayOrderId = rzpData.id;
            }
          } catch (err) {
            console.warn('Razorpay order creation fallback', err);
          }
        }

        if (!razorpayOrderId) {
          razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
        }
      }

      const orderRow = {
        id: orderId,
        user_id: user?.id || null,
        customer,
        subtotal: pricing.subtotal,
        discount_total: pricing.discountTotal,
        shipping_fee: pricing.shippingFee,
        gift_wrapping_fee: pricing.giftWrappingFee,
        is_gift_wrapped: !!isGiftWrapped,
        gift_note: giftNote || null,
        total_amount: pricing.totalAmount,
        payment_method: isCOD ? 'COD' : 'Online',
        payment_status: isCOD ? 'Pending COD Verification' : 'Pending',
        razorpay_order_id: razorpayOrderId || null,
        status: 'Placed',
        tracking_number: trackingNumber,
        timeline: [
          {
            status: 'Placed',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            location: 'Divine Atelier',
            description: isCOD ? 'Order placed' : 'Order placed, awaiting payment confirmation',
          },
        ],
      };

      if (supabaseAdmin) {
        try {
          await supabaseAdmin.from('orders').insert(orderRow);
        } catch (err) {
          console.warn('DB order insert fallback', err);
        }
      }

      if (isCOD) {
        const itemsSummary = items.map((it) => `${it.name} (x${it.quantity})`).join(', ');
        sendOrderConfirmationEmail({
          orderId,
          customerName: customer.fullName,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          totalAmount: pricing.totalAmount,
          paymentMethod: 'Cash on Delivery',
          trackingNumber: trackingNumber || undefined,
          itemsSummary,
        });
        sendOrderConfirmationWhatsApp({
          orderId,
          customerName: customer.fullName,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          totalAmount: pricing.totalAmount,
          paymentMethod: 'Cash on Delivery',
          trackingNumber: trackingNumber || undefined,
          itemsSummary,
        });
      }

      return res.status(201).json({
        success: true,
        orderId,
        razorpayOrderId,
        amount: Math.round(pricing.totalAmount * 100),
        currency: 'INR',
        pricing,
        order: {
          ...orderRow,
          items,
        },
      });
    } catch (err: any) {
      console.error('Order creation error', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });
}
