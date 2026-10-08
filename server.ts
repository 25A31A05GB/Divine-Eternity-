import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

// Handlers imported from /api to ensure local dev and Vercel serverless behave identically
import healthHandler from './api/health';
import trackHandler from './api/track';
import trackOrderHandler from './api/track-order';
import createOrderHandler from './api/create-order';
import verifyPaymentHandler from './api/verify-payment';
import razorpayWebhookHandler from './api/razorpay-webhook';
import validateCouponHandler from './api/validate-coupon';
import couponsHandler from './api/coupons';
import adminOrderStatusHandler from './api/admin-order-status';
import invoiceHandler from './api/invoice';
import returnRequestHandler from './api/return-request';
import contactHandler from './api/contact';
import newsletterHandler from './api/newsletter';
import cartSaveHandler from './api/cart-save';
import pincodeCheckHandler from './api/pincode-check';
import reviewHandler from './api/review';
import abandonedCartsCronHandler from './api/cron/abandoned-carts';
import dailySummaryCronHandler from './api/cron/daily-summary';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// CORS configuration
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

// ===================== MOUNT SERVERLESS API HANDLERS =====================
app.all('/api/health', healthHandler);
app.all('/api/track-order', trackOrderHandler);
app.all('/api/track', trackHandler);
app.all(['/api/create-order', '/api/orders'], createOrderHandler);
app.all(['/api/verify-payment', '/api/payments/razorpay/verify'], verifyPaymentHandler);
app.all('/api/razorpay-webhook', razorpayWebhookHandler);
app.all(['/api/validate-coupon', '/api/coupons/validate'], validateCouponHandler);
app.all('/api/coupons', couponsHandler);
app.all('/api/coupons/:code', couponsHandler);
app.all('/api/admin-order-status', adminOrderStatusHandler);
app.all('/api/invoice', invoiceHandler);
app.all('/api/return-request', returnRequestHandler);
app.all('/api/contact', contactHandler);
app.all('/api/newsletter', newsletterHandler);
app.all('/api/cart-save', cartSaveHandler);
app.all('/api/pincode-check', pincodeCheckHandler);
app.all('/api/review', reviewHandler);
app.all('/api/cron/abandoned-carts', abandonedCartsCronHandler);
app.all('/api/cron/daily-summary', dailySummaryCronHandler);

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
