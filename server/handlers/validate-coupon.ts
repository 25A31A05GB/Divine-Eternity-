import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabaseAdmin';

export async function validateCouponLogic(payload: {
  code: string;
  subtotal: number;
  itemsCount?: number;
  itemPrices?: number[];
}) {
  const cleanCode = (payload.code || '').trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, message: 'Please enter a coupon code.' };
  }

  const { data: coupon, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .ilike('code', cleanCode)
    .maybeSingle();

  if (error || !coupon) {
    return { valid: false, message: `Coupon code "${cleanCode}" is invalid.` };
  }

  if (coupon.is_active === false) {
    return { valid: false, message: `Coupon "${coupon.code}" is no longer active.` };
  }

  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { valid: false, message: `Coupon "${coupon.code}" has expired.` };
  }

  const subtotal = Number(payload.subtotal) || 0;
  const itemsCount = Number(payload.itemsCount) || (payload.itemPrices?.length || 1);

  if (coupon.min_order_value && subtotal < Number(coupon.min_order_value)) {
    return {
      valid: false,
      message: `Minimum order value of ₹${coupon.min_order_value} required for ${coupon.code}.`,
    };
  }

  if (coupon.min_items && itemsCount < Number(coupon.min_items)) {
    return {
      valid: false,
      message: `Add at least ${coupon.min_items} items to apply ${coupon.code}.`,
    };
  }

  let discountAmount = 0;
  const val = Number(coupon.value) || 0;

  if (coupon.type === 'percentage') {
    discountAmount = Math.round((subtotal * val) / 100);
  } else if (coupon.type === 'flat') {
    discountAmount = Math.min(val, subtotal);
  } else if (coupon.type === 'buy3pay2') {
    if (itemsCount >= 3 && Array.isArray(payload.itemPrices) && payload.itemPrices.length >= 3) {
      const sorted = [...payload.itemPrices].sort((a, b) => a - b);
      discountAmount = sorted[0] || 0;
    } else {
      discountAmount = 200; // estimated fallback
    }
  } else if (coupon.type === 'flat849') {
    if (subtotal > 849) {
      discountAmount = subtotal - 849;
    }
  }

  return {
    valid: true,
    discountAmount,
    message: `Coupon "${coupon.code}" applied successfully!`,
    coupon: {
      code: coupon.code,
      description: coupon.description || `${coupon.code} Privilege`,
      type: coupon.type,
      value: val,
      discountAmount,
      minOrderValue: Number(coupon.min_order_value || 0),
      minItems: Number(coupon.min_items || 1),
    },
  };
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await validateCouponLogic(req.body);
    if (!result.valid) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ valid: false, message: err.message || 'Coupon validation failed' });
  }
}
