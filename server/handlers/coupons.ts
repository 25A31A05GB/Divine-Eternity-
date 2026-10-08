import type { Request, Response } from 'express';
import { supabaseAdmin, verifyUserToken } from '../lib/supabaseAdmin';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const { role } = await verifyUserToken(authHeader);

    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const { data: coupons, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.json({ success: true, coupons });
  }

  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    const { role } = await verifyUserToken(authHeader);

    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const couponData = req.body;
    const { data, error } = await supabaseAdmin.from('coupons').upsert(couponData).select();
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.json({ success: true, coupon: data });
  }

  if (req.method === 'DELETE') {
    const authHeader = req.headers.authorization;
    const { role } = await verifyUserToken(authHeader);

    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const code = (req.query.code || req.body?.code || (req as any).params?.code || '').toString().trim().toUpperCase();
    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code is required.' });
    }

    const { error } = await supabaseAdmin.from('coupons').delete().eq('code', code);
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.json({ success: true, message: `Coupon ${code} deleted.` });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
