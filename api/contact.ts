import type { Request, Response } from 'express';
import { supabaseAdmin } from './_lib/supabaseAdmin';
import { contactSchema } from './_lib/schemas';
import { rateLimit } from './_lib/rateLimiter';

const limiter = rateLimit(5, 60000);

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  limiter(req, res, async () => {
    try {
      const parseResult = contactSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid contact input', details: parseResult.error.format() });
      }

      const { name, email, phone, subject, message } = parseResult.data;

      try {
        await supabaseAdmin.from('contact_messages').insert({
          name,
          email,
          phone: phone || null,
          subject,
          message,
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('DB contact message fallback', e);
      }

      return res.json({ success: true, message: 'Message sent successfully. Our atelier concierge will contact you within 24 hours.' });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Internal server error' });
    }
  });
}
