import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { contactSchema } from '../lib/schemas';
import { rateLimit } from '../lib/rateLimiter';
import { verifyTurnstileToken } from '../lib/turnstile';

const limiter = rateLimit(5, 60000);

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const runHandler = async () => {
    try {
      const turnstileToken = req.body.turnstileToken;
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
      const isTurnstileValid = await verifyTurnstileToken(turnstileToken, clientIp);

      if (!isTurnstileValid) {
        return res.status(403).json({
          success: false,
          error: 'Bot verification failed. Please complete the Cloudflare Turnstile challenge.',
        });
      }

      const parseResult = contactSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid contact input', details: parseResult.error.format() });
      }

      const { name, email, phone, subject, message } = parseResult.data;

      if (supabaseAdmin) {
        try {
          await supabaseAdmin.from('contact_messages').insert({
            name,
            email: email || null,
            phone: phone || null,
            subject,
            message,
            created_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('DB contact message fallback', e);
        }
      }

      return res.json({
        success: true,
        message: 'Message sent successfully. Our atelier concierge will contact you within 24 hours.',
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Internal server error' });
    }
  };

  limiter(req, res, runHandler);
}
