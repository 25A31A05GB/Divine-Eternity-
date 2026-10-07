import { z } from 'zod';

export const customerAddressSchema = z.object({
  fullName: z.string().min(2, 'Name is required').max(100),
  phone: z.string().min(10, 'Valid 10-digit phone number is required').max(15),
  email: z.string().email('Valid email is required').max(120),
  streetAddress: z.string().min(5, 'Street address is required').max(250),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit Indian PIN code required'),
});

export const cartItemInputSchema = z.object({
  productId: z.string(),
  name: z.string(),
  quantity: z.number().int().positive().max(50),
  customText: z.string().max(100).optional(),
  caseType: z.string().max(100).optional(),
  designPattern: z.string().max(100).optional(),
  themeColor: z.string().max(50).optional(),
  secondaryColor: z.string().max(50).optional(),
});

export const createOrderSchema = z.object({
  items: z.array(cartItemInputSchema).min(1, 'Cart cannot be empty'),
  customer: customerAddressSchema,
  couponCode: z.string().max(30).optional().nullable(),
  isGiftWrapped: z.boolean().optional(),
  giftNote: z.string().max(300).optional(),
  paymentMethod: z.enum(['UPI', 'Card', 'NetBanking', 'Wallet', 'COD']),
  idempotencyKey: z.string().max(100).optional(),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export const trackOrderSchema = z.object({
  orderId: z.string().min(3),
  phone: z.string().min(10),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(120),
  phone: z.string().max(20).optional(),
  subject: z.string().min(2).max(150),
  message: z.string().min(5).max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email().max(120),
});
