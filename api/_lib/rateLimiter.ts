import type { Request, Response } from 'express';

// In-memory sliding window rate limiter
const ipRequests = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: () => void) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const clientData = ipRequests.get(ip);

    if (!clientData || now > clientData.expiresAt) {
      ipRequests.set(ip, { count: 1, expiresAt: now + windowMs });
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
