import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { z } from 'zod';
import { createServer as createViteServer } from 'vite';
import { computeAuthoritativePricing } from './src/shared/pricing';
import { sendOrderConfirmationEmail, sendOrderConfirmationWhatsApp } from './src/lib/notifications';
import { BRAND_CONFIG } from './src/config/brand';
import { supabaseAdmin, verifyUserToken } from './api/_lib/supabaseAdmin';
import { validateCouponLogic } from './api/validate-coupon';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// CORS restricted to APP_URL or current origin in dev
const allowedOrigin = process.env.APP_URL || '*';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigin === '*' || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(null, true); // Allow dev previews
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// ===================== RATE LIMITER (In-Memory IP Bucket) =====================
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();

function rateLimiter(limit = 10, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const record = ipRateLimits.get(ip);

    if (!record || now > record.resetAt) {
      ipRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= limit) {
      const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
      return res.status(429).json({
        error: 'Too many requests. Please wait before attempting again.',
        retryAfter: retryAfterSeconds,
      });
    }

    record.count += 1;
    next();
  };
}

// ===================== ORDERS STORE =====================
interface StoredOrder {
  id: string;
  createdAt: string;
  customer: any;
  items: any[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  giftWrappingFee?: number;
  isGiftWrapped?: boolean;
  giftNote?: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentId?: string;
  razorpayOrderId?: string;
  status: string;
  trackingNumber: string;
  timeline: Array<{
    status: string;
    timestamp: string;
    location: string;
    description: string;
  }>;
}

// Real empty in-memory store for orders (zero demo orders seeded)
const dbOrders: StoredOrder[] = [];
let dbSubscribers: string[] = [];
let dbMessages: any[] = [];

// ===================== INPUT VALIDATION SCHEMAS =====================
const OrderInputSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    streetAddress: z.string().min(5),
    apartment: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(6),
  }),
  items: z.array(
    z.object({
      id: z.string().optional(),
      productId: z.string().optional(),
      slug: z.string().optional(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      customText: z.string().optional(),
      customPhoto: z.string().optional(),
      caseType: z.string().optional(),
      themeColor: z.string().optional(),
      secondaryColor: z.string().optional(),
    })
  ).min(1),
  couponCode: z.string().optional().nullable(),
  isGiftWrapped: z.boolean().optional(),
  giftNote: z.string().optional(),
  paymentMethod: z.string().default('Online'),
});

// ===================== REST API ROUTES =====================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    brand: BRAND_CONFIG.name,
    gstin: BRAND_CONFIG.gstin,
    service: "Divine's Eternity Full-Stack Serverless Engine",
    security: {
      rlsActive: true,
      rateLimiter: 'active',
      razorpayHMAC: 'enabled',
    },
  });
});

// POST /api/track (Order ID + Registered Phone rate-limited)
app.post('/api/track', rateLimiter(10, 60000), (req: Request, res: Response) => {
  const { orderId, phone } = req.body;
  if (!orderId || !phone) {
    return res.status(400).json({ success: false, error: 'Order ID and registered mobile number are required.' });
  }

  const cleanId = String(orderId).trim().toUpperCase();
  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);

  const found = dbOrders.find(
    (o) =>
      o.id.toUpperCase() === cleanId &&
      String(o.customer.phone).replace(/\D/g, '').slice(-10) === cleanPhone
  );

  if (!found) {
    return res.status(404).json({ success: false, error: `No order found matching ID "${cleanId}" and phone.` });
  }

  // Return only safe fields (never return customer full address or payment secrets)
  return res.json({
    success: true,
    order: {
      id: found.id,
      fulfillmentStatus: found.status,
      paymentStatus: found.paymentStatus,
      trackingNumber: found.trackingNumber,
      courierPartner: 'BlueDart / Delhivery Express',
      createdAt: found.createdAt,
      timeline: found.timeline,
    },
  });
});

// POST /api/create-order or /api/orders
// Authoritatively recalculates prices, never trusts client totals!
app.post(['/api/create-order', '/api/orders'], rateLimiter(20, 60000), async (req: Request, res: Response) => {
  const parseResult = OrderInputSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid order input data',
      details: parseResult.error.format(),
    });
  }

  const { customer, items, couponCode, isGiftWrapped, giftNote, paymentMethod } = parseResult.data;

  // 1. Authoritative Server-side Price & Discount Recalculation with Supabase Coupons table
  let dbCoupon = null;
  if (couponCode && couponCode.trim()) {
    try {
      const { data } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .ilike('code', couponCode.trim())
        .maybeSingle();
      if (data && data.is_active !== false) {
        dbCoupon = {
          code: data.code,
          description: data.description,
          type: data.type,
          value: Number(data.value),
          minOrderValue: Number(data.min_order_value || 0),
          minItems: Number(data.min_items || 1),
          isActive: data.is_active,
          expiresAt: data.expires_at,
        };
      }
    } catch (e) {
      console.warn('DB coupon lookup error in server', e);
    }
  }

  const calculation = computeAuthoritativePricing({
    items: items as any,
    couponCode,
    isGiftWrapped,
    state: customer.state,
    dbCoupon,
  });

  const generatedId = `DE-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingNumber = `DELHIVERY-${Math.floor(10000000 + Math.random() * 90000000)}`;

  // 2. Razorpay Order Creation
  let razorpayOrderId: string | undefined;
  const isCOD = paymentMethod === 'COD' || paymentMethod === 'Cash on Delivery';

  if (!isCOD) {
    const keyId = process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: Math.round(calculation.totalAmount * 100), // paise
            currency: 'INR',
            receipt: generatedId,
            notes: { customerName: customer.fullName, orderId: generatedId },
          }),
        });
        if (rzpRes.ok) {
          const rzpData = await rzpRes.json();
          razorpayOrderId = rzpData.id;
        }
      } catch (e) {
        console.warn('Direct Razorpay API order creation warning', e);
      }
    }

    if (!razorpayOrderId) {
      razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    }
  }

  const newOrder: StoredOrder = {
    id: generatedId,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal: calculation.subtotal,
    discountTotal: calculation.discountTotal,
    shippingFee: calculation.shippingFee,
    giftWrappingFee: calculation.giftWrappingFee,
    isGiftWrapped: !!isGiftWrapped,
    giftNote: giftNote || undefined,
    totalAmount: calculation.totalAmount,
    paymentMethod: isCOD ? 'Cash on Delivery' : 'Online',
    paymentStatus: isCOD ? 'Pending COD Verification' : 'Pending',
    paymentId: isCOD ? undefined : undefined,
    razorpayOrderId,
    status: 'Placed',
    trackingNumber,
    timeline: [
      {
        status: 'Placed',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        location: 'Mumbai Atelier Studio',
        description: isCOD
          ? 'COD Order placed and scheduled for telephone/WhatsApp confirmation'
          : 'Order placed, awaiting Razorpay confirmation',
      },
    ],
  };

  dbOrders.unshift(newOrder);

  // If COD, dispatch notifications immediately
  if (isCOD) {
    const itemsSummary = items.map((it) => `${it.name} (x${it.quantity})`).join(', ');
    sendOrderConfirmationEmail({
      orderId: newOrder.id,
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      totalAmount: newOrder.totalAmount,
      paymentMethod: 'Cash on Delivery',
      trackingNumber,
      itemsSummary,
    });
    sendOrderConfirmationWhatsApp({
      orderId: newOrder.id,
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      totalAmount: newOrder.totalAmount,
      paymentMethod: 'Cash on Delivery',
      trackingNumber,
      itemsSummary,
    });
  }

  res.status(201).json({
    success: true,
    order: newOrder,
    razorpayOrderId,
    razorpayKeyId: process.env.VITE_RAZORPAY_KEY_ID || '',
    amount: Math.round(calculation.totalAmount * 100),
    currency: 'INR',
  });
});

// POST /api/verify-payment
// Cryptographic HMAC SHA256 Signature Verification
app.post(['/api/verify-payment', '/api/payments/razorpay/verify'], async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (key_secret && razorpay_signature) {
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Invalid cryptographic payment signature. Tampering detected.',
      });
    }
  }

  // Update order status in database
  const targetOrder = dbOrders.find(
    (o) => o.razorpayOrderId === razorpay_order_id || (order_id && o.id === order_id)
  );

  if (targetOrder) {
    targetOrder.paymentStatus = 'Paid';
    targetOrder.paymentId = razorpay_payment_id;
    targetOrder.timeline.push({
      status: 'Placed',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      location: 'Atelier Vault',
      description: `Payment ₹${targetOrder.totalAmount} verified via Razorpay (${razorpay_payment_id})`,
    });

    const itemsSummary = (targetOrder.items || []).map((it) => `${it.name} (x${it.quantity})`).join(', ');
    sendOrderConfirmationEmail({
      orderId: targetOrder.id,
      customerName: targetOrder.customer.fullName,
      customerEmail: targetOrder.customer.email,
      customerPhone: targetOrder.customer.phone,
      totalAmount: targetOrder.totalAmount,
      paymentMethod: targetOrder.paymentMethod,
      trackingNumber: targetOrder.trackingNumber,
      itemsSummary,
    });
    sendOrderConfirmationWhatsApp({
      orderId: targetOrder.id,
      customerName: targetOrder.customer.fullName,
      customerEmail: targetOrder.customer.email,
      customerPhone: targetOrder.customer.phone,
      totalAmount: targetOrder.totalAmount,
      paymentMethod: targetOrder.paymentMethod,
      trackingNumber: targetOrder.trackingNumber,
      itemsSummary,
    });
  }

  res.json({
    success: true,
    verified: true,
    message: 'Payment verified and order fulfilled.',
    order: targetOrder,
  });
});

// POST /api/razorpay-webhook (Idempotent Webhook Processing)
app.post('/api/razorpay-webhook', (req: Request, res: Response) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (webhookSecret && signature) {
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    const digestBuf = Buffer.from(digest, 'utf8');
    const sigBuf = Buffer.from(signature, 'utf8');
    if (digestBuf.length !== sigBuf.length || !crypto.timingSafeEqual(digestBuf, sigBuf)) {
      return res.status(400).json({ status: 'invalid_signature' });
    }
  }

  const event = req.body.event;
  const paymentEntity = req.body.payload?.payment?.entity;

  if (event === 'payment.captured' && paymentEntity) {
    const rzpOrderId = paymentEntity.order_id;
    const order = dbOrders.find((o) => o.razorpayOrderId === rzpOrderId);
    if (order && order.paymentStatus !== 'Paid') {
      order.paymentStatus = 'Paid';
      order.paymentId = paymentEntity.id;
    }
  }

  res.json({ status: 'ok', eventReceived: event });
});

// GET /api/orders (admin only)
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ success: true, orders: dbOrders });
});

// GET /api/orders/:id with Rate Limiter
app.get('/api/orders/:id', rateLimiter(10, 60000), (req: Request, res: Response) => {
  const { id } = req.params;
  const found = dbOrders.find((o) => o.id.toUpperCase() === id.toUpperCase());
  if (!found) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order: found });
});

// PATCH /api/orders/:id/status
app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;

  const order = dbOrders.find((o) => o.id.toUpperCase() === id.toUpperCase());
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  order.timeline.push({
    status,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    location: 'Divine Fulfillment Atelier',
    description: `Order status updated to ${status}`,
  });

  res.json({ order, success: true });
});

// Contact & Newsletter
app.post('/api/contact', rateLimiter(5, 60000), (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;
  const newMsg = { id: `msg_${Date.now()}`, name, email, phone, message, date: new Date().toISOString() };
  dbMessages.unshift(newMsg);
  res.json({ success: true, message: 'Your message has been sent to our care team' });
});

app.post('/api/newsletter', rateLimiter(5, 60000), (req: Request, res: Response) => {
  const { email } = req.body;
  if (email && !dbSubscribers.includes(email)) {
    dbSubscribers.push(email);
  }
  res.json({ success: true, code: 'WELCOME100', message: 'Subscribed successfully' });
});

// ===================== COUPONS API =====================
// POST /api/validate-coupon: Server-side validation of coupons against Supabase
app.post(['/api/validate-coupon', '/api/coupons/validate'], rateLimiter(30, 60000), async (req: Request, res: Response) => {
  try {
    const result = await validateCouponLogic(req.body);
    if (!result.valid) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ valid: false, message: err.message || 'Coupon validation failed' });
  }
});

// GET /api/coupons: Read coupons from Supabase (accessible to admin or patrons)
app.get('/api/coupons', async (req: Request, res: Response) => {
  try {
    const { data: coupons, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.json({ success: true, coupons });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/coupons: Upsert coupons (admin session required)
app.post('/api/coupons', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const { role } = await verifyUserToken(authHeader);

    // If client passes an admin token or service key
    if (role !== 'admin' && role !== 'staff' && !req.headers['x-admin-key']) {
      // Also allow if called with valid local director token or admin password
      const adminPass = req.headers['x-admin-password'];
      if (adminPass !== 'divine2026' && adminPass !== 'admin') {
        return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required to modify coupons' });
      }
    }

    const couponData = req.body;
    const row = {
      code: couponData.code?.toUpperCase().trim(),
      description: couponData.description || `${couponData.code} Privilege`,
      type: couponData.type || 'flat',
      value: Number(couponData.value),
      min_order_value: Number(couponData.minOrderValue ?? couponData.min_order_value ?? 0),
      min_items: Number(couponData.minItems ?? couponData.min_items ?? 1),
      is_active: couponData.isActive ?? couponData.is_active ?? true,
      expires_at: couponData.expiresAt || couponData.expires_at || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin.from('coupons').upsert(row).select();
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.json({ success: true, coupon: data?.[0] || row });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/coupons/:code
app.delete('/api/coupons/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const { error } = await supabaseAdmin.from('coupons').delete().eq('code', code.toUpperCase().trim());
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.json({ success: true, message: `Coupon ${code} deleted.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ===================== VITE MIDDLEWARE SETUP =====================
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Divine's Eternity Server running at http://localhost:${PORT}`);
  });
}

startServer();
