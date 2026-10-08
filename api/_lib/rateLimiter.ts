import type { Request, Response } from 'express';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Upstash Redis instance (initialized if environment variables exist)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let upstashRatelimit: Ratelimit | null = null;
if (redisUrl && redisToken) {
  try {
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '60 s'),
      analytics: true,
      prefix: '@upstash/ratelimit/de',
    });
  } catch (err) {
    console.warn('Upstash Redis initialization warning, using in-memory fallback:', err);
  }
}

// In-memory sliding window rate limiter fallback
const inMemoryRequests = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(limit: number, windowMs: number) {
  return async (req: Request, res: Response, next: () => void) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';

    // 1. Try Upstash Redis if configured
    if (upstashRatelimit) {
      try {
        const { success } = await upstashRatelimit.limit(ip);
        if (!success) {
          return res.status(429).json({
            success: false,
            error: 'Too many requests. Please try again after some time.',
          });
        }
        return next();
      } catch (e) {
        // Fall through to in-memory fallback
      }
    }

    // 2. In-memory fallback
    const now = Date.now();
    const clientData = inMemoryRequests.get(ip);

    if (!clientData || now > clientData.expiresAt) {
      inMemoryRequests.set(ip, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (clientData.count >= limit) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again after some time.',
      });
    }

    clientData.count++;
    next();
  };
}
