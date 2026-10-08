import type { Request, Response } from 'express';

// Handlers located in server/handlers
import healthHandler from '../server/handlers/health';
import trackHandler from '../server/handlers/track';
import trackOrderHandler from '../server/handlers/track-order';
import createOrderHandler from '../server/handlers/create-order';
import verifyPaymentHandler from '../server/handlers/verify-payment';
import razorpayWebhookHandler from '../server/handlers/razorpay-webhook';
import validateCouponHandler from '../server/handlers/validate-coupon';
import couponsHandler from '../server/handlers/coupons';
import adminOrderStatusHandler from '../server/handlers/admin-order-status';
import invoiceHandler from '../server/handlers/invoice';
import returnRequestHandler from '../server/handlers/return-request';
import contactHandler from '../server/handlers/contact';
import newsletterHandler from '../server/handlers/newsletter';
import cartSaveHandler from '../server/handlers/cart-save';
import pincodeCheckHandler from '../server/handlers/pincode-check';
import reviewHandler from '../server/handlers/review';

export function resolveApiPath(req: Request): { routeName: string; subRoute?: string } {
  let pathStr = '';

  if (req.query?.route) {
    if (Array.isArray(req.query.route)) {
      pathStr = req.query.route.join('/');
    } else {
      pathStr = String(req.query.route);
    }
  }

  if (!pathStr) {
    const rawUrl = req.originalUrl || req.url || '';
    const cleanUrl = rawUrl.split('?')[0];
    pathStr = cleanUrl.replace(/^\/?api\/?/, '');
  }

  pathStr = pathStr.replace(/^\/+|\/+$/g, '');
  const parts = pathStr.split('/');
  return {
    routeName: (parts[0] || '').toLowerCase(),
    subRoute: parts.slice(1).join('/') || undefined,
  };
}

export default async function handler(req: Request, res: Response) {
  const { routeName, subRoute } = resolveApiPath(req);

  switch (routeName) {
    case 'health':
      return healthHandler(req, res);

    case 'track':
      return trackHandler(req, res);

    case 'track-order':
      return trackOrderHandler(req, res);

    case 'create-order':
    case 'orders':
      return createOrderHandler(req, res);

    case 'verify-payment':
      return verifyPaymentHandler(req, res);

    case 'payments':
      if (subRoute === 'razorpay/verify') {
        return verifyPaymentHandler(req, res);
      }
      return res.status(404).json({ success: false, error: 'Endpoint not found' });

    case 'razorpay-webhook':
      return razorpayWebhookHandler(req, res);

    case 'validate-coupon':
      return validateCouponHandler(req, res);

    case 'coupons':
      if (subRoute === 'validate') {
        return validateCouponHandler(req, res);
      }
      if (subRoute) {
        (req as any).params = { ...((req as any).params || {}), code: subRoute };
      }
      return couponsHandler(req, res);

    case 'admin-order-status':
      return adminOrderStatusHandler(req, res);

    case 'invoice':
      return invoiceHandler(req, res);

    case 'return-request':
      return returnRequestHandler(req, res);

    case 'contact':
      return contactHandler(req, res);

    case 'newsletter':
      return newsletterHandler(req, res);

    case 'cart-save':
      return cartSaveHandler(req, res);

    case 'pincode-check':
      return pincodeCheckHandler(req, res);

    case 'review':
      return reviewHandler(req, res);

    default:
      return res.status(404).json({
        success: false,
        error: `Endpoint not found: /api/${routeName}${subRoute ? `/${subRoute}` : ''}`,
      });
  }
}
