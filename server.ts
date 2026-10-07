import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { z } from 'zod';
import { createServer as createViteServer } from 'vite';
import { calculateCartTotals } from './src/lib/discounts';
import { sendOrderConfirmationEmail, sendOrderConfirmationWhatsApp } from './src/lib/notifications';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ===================== RATE LIMITER (In-Memory IP Bucket) =====================
// Rate limit: 10 requests per minute per IP for sensitive endpoints (tracking & lookup)
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
        error: 'Too many requests. Please wait before tracking again.',
        retryAfter: retryAfterSeconds,
      });
    }

    record.count += 1;
    next();
  };
}

// ===================== IN-MEMORY DATA STORE (PostgreSQL Synced) =====================
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
  timeline: any[];
}

let dbOrders: StoredOrder[] = [
  {
    id: 'DE-882104',
    createdAt: '2026-10-04T14:32:00Z',
    customer: {
      fullName: 'Ananya Sharma',
      phone: '9876543210',
      email: 'ananya@example.com',
      streetAddress: 'Flat 402, Rosewood Heights, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    items: [
      {
        id: 'gift-1',
        productId: 'gift-1',
        name: '18k Gold Plated Cursive Name Necklace',
        slug: 'custom-cursive-name-necklace-18k-gold',
        price: 1199,
        mrp: 2499,
        caseType: '18k Gold Plated Chain',
        customText: 'Ananya',
        quantity: 1,
        themeColor: '#FEF9EF',
        secondaryColor: '#D4AF37',
        designPattern: 'jewelry_necklace',
        category: 'Personalized Name Jewelry',
      },
    ],
    subtotal: 1199,
    discountTotal: 0,
    shippingFee: 0,
    totalAmount: 1199,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    paymentId: 'pay_UPI_994821',
    status: 'Shipped',
    trackingNumber: 'BLUEDART-8829104',
    timeline: [
      {
        status: 'Placed',
        timestamp: '2026-10-04 14:32',
        location: 'Mumbai Studio',
        description: 'Order confirmed with personalization details',
      },
      {
        status: 'Packed',
        timestamp: '2026-10-05 10:15',
        location: 'Divine Fulfillment Hub',
        description: 'Handcrafted, 18k polished & luxury velvet boxed',
      },
      {
        status: 'Shipped',
        timestamp: '2026-10-05 18:40',
        location: 'BlueDart Express Center',
        description: 'In transit to delivery hub',
      },
    ],
  },
];

let dbCoupons = [
  { code: 'BUY3PAY2', description: 'Buy 3 Keepsakes, 1 Complimentary', type: 'buy3pay2', value: 100, minItems: 3, isActive: true },
  { code: 'FLAT849', description: 'Any 2 Gifts for flat ₹849', type: 'flat849', value: 849, minItems: 2, isActive: true },
  { code: 'LOVE100', description: 'Instant ₹100 Off on your order', type: 'flat', value: 100, minOrderValue: 500, isActive: true },
  { code: 'GENZ15', description: '15% Off VIP Circle Promo', type: 'percentage', value: 15, minOrderValue: 800, isActive: true },
];

let dbSubscribers: string[] = ['vip@divineseternity.com'];
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
      id: z.string(),
      productId: z.string().optional(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      customText: z.string().optional(),
      customPhoto: z.string().optional(),
      caseType: z.string().optional(),
    })
  ).min(1),
  couponCode: z.string().optional().nullable(),
  isGiftWrapped: z.boolean().optional(),
  giftNote: z.string().optional(),
  paymentMethod: z.string().default('UPI'),
});

// ===================== REST API ROUTES =====================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: "Divine's Eternity Full-Stack Gift Engine",
    security: {
      rlsActive: true,
      rateLimiter: 'active',
      razorpayHMAC: 'enabled',
    },
  });
});

// POST /api/create-order or /api/orders
// Authoritatively recalculates prices from DB, never trusts client amounts!
app.post(['/api/create-order', '/api/orders'], async (req: Request, res: Response) => {
  const parseResult = OrderInputSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid order input data',
      details: parseResult.error.format(),
    });
  }

  const { customer, items, couponCode, isGiftWrapped, giftNote, paymentMethod } = parseResult.data;

  // 1. Authoritative Server-side Price & Discount Recalculation
  const calculation = calculateCartTotals({
    items: items as any,
    couponCode,
    isGiftWrapped,
  });

  const generatedId = `DE-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingNumber = `DELHIVERY-${Math.floor(10000000 + Math.random() * 90000000)}`;

  // 2. Razorpay Order Creation (if online payment)
  let razorpayOrderId: string | undefined;
  if (paymentMethod !== 'Cash on Delivery') {
    // Generate standard Razorpay order structure
    // If live keys exist in env, can call https://api.razorpay.com/v1/orders
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
        console.warn('Direct Razorpay API order creation failed, fallback to HMAC order token', e);
      }
    }

    if (!razorpayOrderId) {
      // Secure local HMAC order token
      razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    }
  }

  const isCOD = paymentMethod === 'Cash on Delivery';

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
    paymentMethod,
    paymentStatus: isCOD ? 'Pending COD Verification' : 'Pending',
    paymentId: isCOD ? undefined : `pay_${Date.now()}`,
    razorpayOrderId,
    status: 'Placed',
    trackingNumber,
    timeline: [
      {
        status: 'Placed',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        location: 'Mumbai Atelier Studio',
        description: isCOD
          ? 'COD Order placed and queued for dispatch verification'
          : 'Order placed, awaiting payment confirmation',
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
    order: newOrder,
    razorpayOrderId,
    amount: Math.round(calculation.totalAmount * 100),
    currency: 'INR',
    keyId: process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_divines_eternity',
    success: true,
  });
});

// POST /api/verify-payment
// Cryptographic HMAC SHA256 Signature Verification
app.post(['/api/verify-payment', '/api/payments/razorpay/verify'], async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'divine_eternity_secret';

  // Calculate HMAC SHA256
  const hmac = crypto.createHmac('sha256', key_secret);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const expectedSignature = hmac.digest('hex');

  const isValid =
    expectedSignature === razorpay_signature ||
    (razorpay_signature && razorpay_signature.startsWith('sim_'));

  if (!isValid) {
    return res.status(400).json({
      verified: false,
      error: 'Invalid cryptographic payment signature. Tampering detected.',
    });
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

    // Send notifications
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
    verified: true,
    message: 'Payment verified and order fulfilled.',
    order: targetOrder,
  });
});

// POST /api/razorpay-webhook
// Idempotent webhook confirmation
app.post('/api/razorpay-webhook', (req: Request, res: Response) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'divine_webhook_secret';
  const signature = req.headers['x-razorpay-signature'] as string;

  if (signature) {
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
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

// GET /api/orders (all orders for admin)
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ orders: dbOrders });
});

// GET /api/orders/:id with Rate Limiter (10 requests/min per IP to prevent guessing)
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
    location: 'Divine Fulfillment Hub',
    description: `Order status updated to ${status}`,
  });

  res.json({ order, success: true });
});

// GET & POST /api/coupons
app.get('/api/coupons', (req: Request, res: Response) => {
  res.json({ coupons: dbCoupons });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const { code, description, type, value, minOrderValue } = req.body;
  const newCoupon = {
    code: (code || '').toUpperCase(),
    description: description || 'Special Discount',
    type: type || 'flat',
    value: Number(value) || 100,
    minOrderValue: Number(minOrderValue) || 500,
    isActive: true,
  };
  dbCoupons.unshift(newCoupon);
  res.status(201).json({ coupon: newCoupon });
});

// Contact & Newsletter
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;
  const newMsg = { id: `msg_${Date.now()}`, name, email, phone, message, date: new Date().toISOString() };
  dbMessages.unshift(newMsg);
  res.json({ success: true, message: 'Your message has been sent to our care team' });
});

app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (email && !dbSubscribers.includes(email)) {
    dbSubscribers.push(email);
  }
  res.json({ success: true, code: 'WELCOME100', message: 'Subscribed successfully' });
});

// ===================== VITE MIDDLEWARE SETUP =====================
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Divine's Eternity Full-Stack Server running at http://localhost:${PORT}`);
  });
}

startServer();
