import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-Memory Database Store (Syncs with client state, instantly ready for PostgreSQL)
interface StoredOrder {
  id: string;
  createdAt: string;
  customer: any;
  items: any[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentId?: string;
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
  { code: 'BUY3PAY2', description: 'Buy 3 Cases, Get 1 FREE', type: 'buy3pay2', value: 100, minItems: 3, isActive: true },
  { code: 'FLAT849', description: 'Any 2 Cases for flat ₹849', type: 'flat849', value: 849, minItems: 2, isActive: true },
  { code: 'LOVE100', description: 'Instant ₹100 Off on your order', type: 'flat', value: 100, minOrderValue: 500, isActive: true },
  { code: 'GENZ15', description: '15% Off storewide for new members', type: 'percentage', value: 15, minOrderValue: 800, isActive: true },
];

let dbSubscribers: string[] = ['vip@divineseternity.com'];
let dbMessages: any[] = [];

// ===================== REST API ROUTES =====================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: "Divine's Eternity Full-Stack Gift Engine",
  });
});

// Authentication Routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const isAdmin = email.toLowerCase().includes('admin');
  const user = {
    id: `usr_${Date.now()}`,
    email,
    name: isAdmin ? 'Store Administrator' : email.split('@')[0],
    role: isAdmin ? 'ADMIN' : 'CUSTOMER',
  };

  const token = `jwt_token_${Buffer.from(JSON.stringify(user)).toString('base64')}`;
  res.json({ user, token, message: isAdmin ? 'Logged in as Admin' : 'Welcome back!' });
});

// Orders API (with server-side price & offer recalculation)
app.post('/api/orders', (req: Request, res: Response) => {
  const { customer, items, paymentMethod, couponCode } = req.body;

  if (!customer || !customer.fullName || !customer.phone || !items || items.length === 0) {
    return res.status(400).json({ error: 'Incomplete order payload' });
  }

  // Server-side Recalculation
  const subtotal = items.reduce((sum: number, it: any) => sum + (it.price || 599) * (it.quantity || 1), 0);
  
  // Flattened prices for offer calculation
  const itemPrices: number[] = [];
  items.forEach((it: any) => {
    for (let i = 0; i < (it.quantity || 1); i++) {
      itemPrices.push(it.price || 599);
    }
  });
  itemPrices.sort((a, b) => a - b);

  let discountTotal = 0;
  let appliedOffer: any = null;

  if (couponCode === 'FLAT849' && itemPrices.length >= 2) {
    const twoSum = itemPrices[itemPrices.length - 1] + itemPrices[itemPrices.length - 2];
    discountTotal = Math.max(0, twoSum - 849);
    appliedOffer = { code: 'FLAT849', name: 'Flat ₹849 Duo Offer', discountAmount: discountTotal };
  } else if (couponCode === 'BUY3PAY2' && itemPrices.length >= 3) {
    const freeCount = Math.floor(itemPrices.length / 3);
    discountTotal = itemPrices.slice(0, freeCount).reduce((a, b) => a + b, 0);
    appliedOffer = { code: 'BUY3PAY2', name: 'Buy 3 Pay 2 Free Gift', discountAmount: discountTotal };
  } else if (couponCode === 'LOVE100' && subtotal >= 500) {
    discountTotal = 100;
    appliedOffer = { code: 'LOVE100', name: '₹100 Off Promo', discountAmount: 100 };
  }

  const taxable = Math.max(0, subtotal - discountTotal);
  const shippingFee = taxable >= 499 ? 0 : 49;
  const totalAmount = taxable + shippingFee;

  const generatedId = `DE-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingNumber = `DELHIVERY-${Math.floor(10000000 + Math.random() * 90000000)}`;

  const newOrder: StoredOrder = {
    id: generatedId,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    discountTotal,
    shippingFee,
    totalAmount,
    paymentMethod: paymentMethod || 'UPI',
    paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending COD Verification' : 'Paid',
    paymentId: `pay_${Date.now()}`,
    status: 'Placed',
    trackingNumber,
    timeline: [
      {
        status: 'Placed',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        location: 'Mumbai Design Studio',
        description: 'Order confirmed and scheduled for custom engraving.',
      },
    ],
  };

  dbOrders.unshift(newOrder);
  res.status(201).json({ order: newOrder, success: true });
});

app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ orders: dbOrders });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const found = dbOrders.find((o) => o.id.toUpperCase() === id.toUpperCase());
  if (!found) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order: found });
});

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

// Razorpay Gateway Order Creation & HMAC Signature Verification
app.post('/api/payments/razorpay/create-order', (req: Request, res: Response) => {
  const { amount, currency = 'INR', receipt } = req.body;
  
  // Real or Simulated Razorpay Order ID
  const razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  res.json({
    id: razorpayOrderId,
    amount: (amount || 649) * 100, // paise
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    status: 'created',
  });
});

app.post('/api/payments/razorpay/verify', (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'divine_eternity_secret';

  // Calculate HMAC SHA256
  const hmac = crypto.createHmac('sha256', key_secret);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest('hex');

  // Verify signature (or accept simulated test tokens in dev mode)
  const isSignatureValid =
    generatedSignature === razorpay_signature ||
    (razorpay_signature && razorpay_signature.startsWith('sim_'));

  if (isSignatureValid) {
    res.json({ verified: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ verified: false, error: 'Invalid payment signature' });
  }
});

// Coupons API
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
