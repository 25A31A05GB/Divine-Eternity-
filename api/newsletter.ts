import type { Request, Response } from 'express';
import { supabaseAdmin } from './_lib/supabaseAdmin';
import { newsletterSchema } from './_lib/schemas';
import { rateLimit } from './_lib/rateLimiter';

const limiter = rateLimit(5, 60000);

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  limiter(req, res, async () => {
    try {
      const parseResult = newsletterSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Valid email address is required.' });
      }

      const { email } = parseResult.data;

      try {
        await supabaseAdmin.from('newsletter_subscribers').upsert({
          email: email.toLowerCase().trim(),
          is_active: true,
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('DB newsletter fallback', e);
      }

      return res.json({
        success: true,
        code: 'LOVE100',
        message: 'Welcome to Divine’s Atelier Privilege Club! Use code LOVE100 for ₹100 off.',
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Internal server error' });
    }
  });
}
