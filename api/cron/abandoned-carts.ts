import type { Request, Response } from 'express';
import { supabaseAdmin } from '../_lib/supabaseAdmin';
import { BUSINESS_CONFIG } from '../../src/config/business';

export default async function handler(req: Request, res: Response) {
  // Verify Cron Secret
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return res.status(500).json({ success: false, error: 'CRON_SECRET is not set on the server.' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized cron request' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ success: false, error: 'Database unconfigured' });
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const now = Date.now();
    const oneHourAgo = new Date(now - 3600 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(now - 24 * 3600 * 1000).toISOString();

    // Fetch unrecovered carts where reminders < 2 and last activity > 1 hr
    const { data: carts, error } = await supabaseAdmin
      .from('abandoned_carts')
      .select('*')
      .eq('recovered', false)
      .eq('has_consented', true)
      .lt('reminders_sent', 2)
      .lt('last_activity', oneHourAgo);

    if (error || !carts || carts.length === 0) {
      return res.json({ success: true, processed: 0, message: 'No idle abandoned carts to remind.' });
    }

    let sentCount = 0;

    for (const cartRecord of carts) {
      const { id, email, reminders_sent, last_activity, recovery_token, subtotal } = cartRecord;
      if (!email || !email.includes('@')) continue;

      const lastActivityTime = new Date(last_activity).getTime();
      const isSecondReminder = reminders_sent === 1 && lastActivityTime < new Date(twentyFourHoursAgo).getTime();
      const isFirstReminder = reminders_sent === 0;

      if (!isFirstReminder && !isSecondReminder) continue;

      const recoverUrl = `${BUSINESS_CONFIG.domain}/checkout?recover=${recovery_token}`;
      const subject = isSecondReminder
        ? `Special Flat ₹100 OFF: Complete Your Saved Gifts! 🎁 — ${BUSINESS_CONFIG.brandName}`
        : `Your Saved Keepsakes Are Waiting For You! ✨ — ${BUSINESS_CONFIG.brandName}`;

      const emailHtml = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #211D1C; border: 1px solid #F3E8E2; padding: 24px; background: #FFFDF8;">
          <h1 style="color: #FF2E93; font-size: 24px; text-align: center;">${BUSINESS_CONFIG.brandName}</h1>
          <h2 style="font-size: 18px; color: #211D1C;">Did you forget something special? 🌸</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #444;">
            Your handcrafted luxury items (Total: ₹${subtotal}) are reserved in your bag. Complete your order now before stock is re-allocated!
          </p>
          ${isSecondReminder ? `
          <div style="background: #FFF9EB; border: 1px border: #F5E6CE; padding: 14px; border-radius: 8px; text-align: center; margin: 16px 0;">
            <strong style="color: #FF2E93; font-size: 14px;">Use Code LOVE100 at checkout for FLAT ₹100 OFF!</strong>
          </div>
          ` : ''}
          <div style="text-align: center; margin: 24px 0;">
            <a href="${recoverUrl}" style="background-color: #FF2E93; color: white; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 30px; display: inline-block;">
              Restore My Bag & Complete Order
            </a>
          </div>
          <p style="font-size: 11px; color: #888; text-align: center; margin-top: 24px;">
            You are receiving this because you initiated checkout at ${BUSINESS_CONFIG.domain}. <a href="${BUSINESS_CONFIG.domain}/unsubscribe" style="color: #888;">Unsubscribe</a>
          </p>
        </div>
      `;

      if (resendApiKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: "Divine's Eternity <orders@divineseternity.com>",
              to: [email],
              subject,
              html: emailHtml,
            }),
          });
        } catch {
          // continue
        }
      } else {
        console.log(`[Cron Abandoned Cart] Simulated email to ${email}: "${subject}"`);
      }

      // Increment reminders_sent
      await supabaseAdmin
        .from('abandoned_carts')
        .update({ reminders_sent: reminders_sent + 1 })
        .eq('id', id);

      sentCount++;
    }

    return res.json({ success: true, processed: sentCount });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
