import type { Request, Response } from 'express';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../lib/supabaseAdmin';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return res.status(503).json({ success: false, error: 'Database unconfigured' });
    }
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.json({ success: true, products: data || [] });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return res.status(503).json({ success: false, error: 'Database unconfigured' });
    }
    try {
      const payload = req.body;
      const rows = Array.isArray(payload) ? payload : [payload];
      const { data, error } = await supabaseAdmin
        .from('products')
        .upsert(rows)
        .select();

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.json({ success: true, products: data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return res.status(503).json({ success: false, error: 'Database unconfigured' });
    }
    try {
      const id = (req.query.id || req.body?.id || '').toString().trim();
      if (!id) {
        return res.status(400).json({ success: false, error: 'Product ID is required' });
      }
      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.json({ success: true, message: `Product ${id} deleted` });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
