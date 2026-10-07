import type { Request, Response } from 'express';
import { BRAND_CONFIG } from '../src/config/brand';

export default function handler(req: Request, res: Response) {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    brand: BRAND_CONFIG.name,
    gstin: BRAND_CONFIG.gstin,
    environment: process.env.NODE_ENV || 'production',
  });
}
