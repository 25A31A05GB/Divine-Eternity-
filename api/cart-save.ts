import type { Request, Response } from 'express';
import crypto from 'crypto';
import { supabaseAdmin } from './_lib/supabaseAdmin';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, phone, cart, subtotal, hasConsented } = req.body || {};

    if (!hasConsented) {
      return res.json({ success: true, saved: false, message: 'No consent provided' });
    }

    if ((!email || !email.includes('@')) && (!phone || phone.length < 10)) {
      return res.status(400).json({ success: false, error: 'Valid email or phone required' });
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.json({ success: true, saved: false });
    }

    if (!supabaseAdmin) {
      return res.json({ success: true, saved: false, warning: 'Database unconfigured' });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const recoveryToken = crypto.randomBytes(16).toString('hex');

    // Check if unrecovered abandoned cart exists for this email/phone
    let existingQuery = supabaseAdmin.from('abandoned_carts').select('id, recovery_token').eq('recovered', false);
    if (cleanEmail) {
      existingQuery = existingQuery.eq('email', cleanEmail);
    } else {
      existingQuery = existingQuery.eq('phone', cleanPhone);
    }

    const { data: existing } = await existingQuery.maybeSingle();

    if (existing) {
      await supabaseAdmin.from('abandoned_carts').update({
        cart,
        subtotal: Number(subtotal) || 0,
        last_activity: new Date().toISOString(),
        has_consented: true,
      }).eq('id', existing.id);

      return res.json({
        success: true,
        saved: true,
        recoveryToken: existing.recovery_token,
      });
    }

    const { data: created } = await supabaseAdmin.from('abandoned_carts').insert({
      email: cleanEmail || null,
      phone: cleanPhone || null,
      cart,
      subtotal: Number(subtotal) || 0,
      recovery_token: recoveryToken,
      has_consented: true,
    }).select('recovery_token').maybeSingle();

    return res.json({
      success: true,
      saved: true,
      recoveryToken: created?.recovery_token || recoveryToken,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
