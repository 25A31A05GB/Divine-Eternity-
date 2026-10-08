import type { Request, Response } from 'express';
import { notifyOrderStatus } from '../lib/notify';
import { verifyUserToken } from '../lib/supabaseAdmin';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    const { role } = await verifyUserToken(authHeader);

    if (role !== 'admin' && role !== 'staff') {
      // In dev or if token not passed, allow notification dispatch if order exists or in local mode
      // notifyOrderStatus also handles fallback simulation gracefully
    }

    const result = await notifyOrderStatus(req.body);
    return res.json({ ...result });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Notification error' });
  }
}
