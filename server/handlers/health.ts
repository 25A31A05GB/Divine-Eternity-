import type { Request, Response } from 'express';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../lib/supabaseAdmin';
import { BUSINESS_CONFIG } from '../../src/config/business';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  let dbStatus = 'disconnected';
  let dbLatencyMs: number | null = null;
  let dbError: string | null = null;

  if (isSupabaseAdminConfigured() && supabaseAdmin) {
    const startTime = Date.now();
    try {
      const { data, error } = await supabaseAdmin.from('products').select('id').limit(1);
      dbLatencyMs = Date.now() - startTime;
      if (error) {
        dbStatus = 'degraded';
        dbError = error.message;
      } else {
        dbStatus = 'connected';
      }
    } catch (err: any) {
      dbStatus = 'error';
      dbError = err.message || 'Connection failed';
    }
  } else {
    dbStatus = 'unconfigured';
    dbError = 'Supabase environment variables not configured';
  }

  const isHealthy = dbStatus === 'connected';

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    brand: BUSINESS_CONFIG.brandName,
    database: {
      provider: 'Supabase PostgreSQL',
      status: dbStatus,
      latencyMs: dbLatencyMs,
      error: dbError,
    },
    services: {
      ratelimiter: process.env.UPSTASH_REDIS_REST_URL ? 'upstash-redis' : 'in-memory-fallback',
      turnstile: process.env.TURNSTILE_SECRET_KEY ? 'enabled' : 'development-bypass',
      razorpay: process.env.RAZORPAY_KEY_SECRET ? 'configured' : 'unconfigured',
    },
    version: '1.0.0',
  });
}
