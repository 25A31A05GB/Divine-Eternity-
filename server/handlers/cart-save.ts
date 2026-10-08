import type { Request, Response } from 'express';
import crypto from 'crypto';
import { supabaseAdmin } from '../lib/supabaseAdmin';

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

    // Check if an existing abandoned cart exists for this email/phone within the last 48 hours
    const query = supabaseAdmin.from('abandoned_carts').select('*').eq('recovered', false);
    if (cleanEmail) {
      query.eq('email', cleanEmail);
    } else {
      query.eq('phone', cleanPhone);
    }

    const { data: existingCart } = await query.order('last_activity', { ascending: false }).limit(1).maybeSingle();

    if (existingCart) {
      // Update cart contents and last_activity
      await supabaseAdmin
        .from('abandoned_carts')
        .update({
          cart,
          subtotal: Number(subtotal) || existingCart.subtotal,
          last_activity: new Date().toISOString(),
        })
        .eq('id', existingCart.id);

      return res.json({ success: true, recoveryToken: existingCart.recovery_token });
    }

    // Insert new abandoned cart record
    const recoveryToken = crypto.randomBytes(16).toString('hex');
    const { data: newRecord, error } = await supabaseAdmin
      .from('abandoned_carts')
      .insert({
        email: cleanEmail || null,
        phone: cleanPhone || null,
        cart,
        subtotal: Number(subtotal) || 0,
        recovery_token: recoveryToken,
        has_consented: true,
        last_activity: new Date().toISOString(),
      })
      .select('recovery_token')
      .maybeSingle();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true, recoveryToken: newRecord?.recovery_token || recoveryToken });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
