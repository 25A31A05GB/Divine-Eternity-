import type { Request, Response } from 'express';
import { supabaseAdmin } from '../_lib/supabaseAdmin';
import { BUSINESS_CONFIG } from '../../src/config/business';

export default async function handler(req: Request, res: Response) {
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
    const todayStart = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

    // 1. Today's orders
    const { data: todayOrders } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, payment_status, status')
      .gte('created_at', todayStart);

    const ordersCount = todayOrders?.length || 0;
    const totalSales = (todayOrders || []).reduce((sum: number, o: any) => sum + (Number(o.total_amount) || 0), 0);

    // 2. Low stock count (<= 5)
    const { count: lowStockCount } = await supabaseAdmin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .lte('stock_quantity', 5);

    // 3. Pending return requests
    const { count: pendingReturnsCount } = await supabaseAdmin
      .from('return_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'requested');

    const summaryHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #D4AF37; background: #FFFDF8;">
        <h1 style="color: #FF2E93; text-align: center;">${BUSINESS_CONFIG.brandName}</h1>
        <h2 style="font-size: 18px; text-align: center; color: #211D1C;">Daily Atelier Performance Summary 📊</h2>
        
        <div style="background: #FAF7F2; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #EFE7DE;">
          <p style="font-size: 15px; margin: 0 0 10px 0;"><strong>Today's Total Sales:</strong> <span style="color: #FF2E93; font-weight: bold;">₹${totalSales}</span></p>
          <p style="font-size: 14px; margin: 0 0 10px 0;"><strong>New Orders Received:</strong> ${ordersCount}</p>
          <p style="font-size: 14px; margin: 0 0 10px 0;"><strong>Low Stock Alerts (<=5 left):</strong> ${lowStockCount || 0} products</p>
          <p style="font-size: 14px; margin: 0;"><strong>Pending Return Requests:</strong> ${pendingReturnsCount || 0}</p>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${BUSINESS_CONFIG.domain}/admin" style="background-color: #211D1C; color: white; padding: 10px 24px; text-decoration: none; border-radius: 20px; font-weight: bold;">
            Open Secret Admin Studio
          </a>
        </div>
      </div>
    `;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Divine's Eternity <owner@divineseternity.com>",
            to: [BUSINESS_CONFIG.supportEmail],
            subject: `Daily Atelier Summary: ₹${totalSales} Sales (${ordersCount} Orders) — ${BUSINESS_CONFIG.brandName}`,
            html: summaryHtml,
          }),
        });
      } catch {
        // continue
      }
    } else {
      console.log(`[Daily Summary Cron] Simulated daily summary email to ${BUSINESS_CONFIG.supportEmail}: ₹${totalSales} total sales.`);
    }

    return res.json({ success: true, totalSales, ordersCount, lowStockCount, pendingReturnsCount });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
