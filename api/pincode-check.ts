import type { Request, Response } from 'express';
import { checkPincodeServiceability } from './_lib/shiprocket';
import { rateLimit } from './_lib/rateLimiter';

const limiter = rateLimit(30, 60000);

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  limiter(req, res, async () => {
    const { pincode } = req.body || {};
    const cleanPincode = String(pincode || '').replace(/\D/g, '');

    if (!cleanPincode || cleanPincode.length !== 6) {
      return res.status(400).json({
        success: false,
        serviceable: false,
        error: 'Please enter a valid 6-digit Indian postal code.',
      });
    }

    const result = await checkPincodeServiceability(cleanPincode);
    return res.json({
      success: result.serviceable,
      serviceable: result.serviceable,
      courierName: result.courierName,
      estimatedDays: result.estimatedDays,
      error: result.error,
    });
  });
}
