import type { Request, Response } from 'express';
import { Redis } from '@upstash/redis';

// Upstash Redis instance (initialized if environment variables exist)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let redisClient: Redis | null = null;
if (redisUrl && redisToken) {
  try {
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
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
    if (redisClient) {
      try {
        const key = `@upstash/ratelimit/de:${ip}`;
        const count = await redisClient.incr(key);
        if (count === 1) {
          await redisClient.expire(key, Math.ceil(windowMs / 1000));
        }
        if (count > limit) {
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
