import { describe, it, expect } from 'vitest';
import { computeAuthoritativePricing, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, GIFT_WRAPPING_FEE } from '../../src/shared/pricing';
import { calculateCartTotals } from '../../src/lib/discounts';
import { CartItem } from '../../src/types';

const mockItem1: CartItem = {
  id: 'cart-1',
  productId: 'p1',
  slug: 'silver-pendant',
  name: '925 Silver Pendant',
  price: 400,
  mrp: 800,
  quantity: 1,
  caseType: '925 Sterling Silver',
  category: 'Personalized Jewellery',
  themeColor: '#FAF4EC',
  secondaryColor: '#881337',
  designPattern: 'jewelry_necklace',
};

const mockItem2: CartItem = {
  id: 'cart-2',
  productId: 'p2',
  slug: 'gold-charm',
  name: '18k Gold Charm',
  price: 600,
  mrp: 1200,
  quantity: 1,
  caseType: '18k Gold Plated Chain',
  category: 'Personalized Jewellery',
  themeColor: '#FAF4EC',
  secondaryColor: '#881337',
  designPattern: 'jewelry_necklace',
};

const mockItem3: CartItem = {
  id: 'cart-3',
  productId: 'p3',
  slug: 'velvet-pouch',
  name: 'Velvet Pouch',
  price: 200,
  mrp: 400,
  quantity: 1,
  caseType: 'Rose Gold Velvet',
  category: 'Special Hampers',
  themeColor: '#FAF4EC',
  secondaryColor: '#881337',
  designPattern: 'wooden_keepsake_box',
};

describe('Pricing Engine & Discount Calculation', () => {
  describe('Edge Cases', () => {
    it('returns zeroes for an empty cart', () => {
      const res = computeAuthoritativePricing({ items: [] });
      expect(res.subtotal).toBe(0);
      expect(res.totalAmount).toBe(0);
      expect(res.discountTotal).toBe(0);
      expect(res.shippingFee).toBe(0);
    });

    it('handles expired coupons gracefully by falling back to standard pricing', () => {
      const res = computeAuthoritativePricing({
        items: [mockItem1],
        couponCode: 'EXPIRED10',
        dbCoupon: {
          code: 'EXPIRED10',
          type: 'percentage',
          value: 10,
          isActive: true,
          expiresAt: '2020-01-01T00:00:00Z',
        },
      });
      expect(res.discountTotal).toBe(0);
      expect(res.subtotal).toBe(400);
    });
  });

  describe('Coupons Evaluation', () => {
    it('calculates BUY3PAY2 by discounting the cheapest item in cart of 3+', () => {
      const items = [mockItem1, mockItem2, mockItem3]; // prices: 400, 600, 200
      const res = computeAuthoritativePricing({ items, couponCode: 'BUY3PAY2' });

      expect(res.subtotal).toBe(1200);
      expect(res.discountTotal).toBe(200); // cheapest item (200) is free
      expect(res.appliedOffer?.code).toBe('BUY3PAY2');
    });

    it('calculates FLAT849 for 2+ items', () => {
      const items = [mockItem1, mockItem2]; // subtotal 1000
      const res = computeAuthoritativePricing({ items, couponCode: 'FLAT849' });

      expect(res.subtotal).toBe(1000);
      expect(res.discountTotal).toBe(151); // 1000 - 849 = 151
    });

    it('calculates LOVE100 flat discount when min order subtotal >= 799', () => {
      const items = [mockItem1, mockItem2]; // subtotal 1000
      const res = computeAuthoritativePricing({ items, couponCode: 'LOVE100' });

      expect(res.subtotal).toBe(1000);
      expect(res.discountTotal).toBe(100);
      expect(res.appliedOffer?.code).toBe('LOVE100');
    });
  });

  describe('Shipping & Add-ons', () => {
    it('applies standard shipping fee when subtotal is under threshold', () => {
      const res = computeAuthoritativePricing({ items: [mockItem1] }); // 400 < 499
      expect(res.shippingFee).toBe(STANDARD_SHIPPING_FEE);
      expect(res.isFreeShipping).toBe(false);
      expect(res.amountNeededForFreeShipping).toBe(99);
    });

    it('grants free shipping when net subtotal meets threshold', () => {
      const res = computeAuthoritativePricing({ items: [mockItem2] }); // 600 >= 499
      expect(res.shippingFee).toBe(0);
      expect(res.isFreeShipping).toBe(true);
      expect(res.amountNeededForFreeShipping).toBe(0);
    });

    it('adds gift wrapping fee when requested', () => {
      const res = computeAuthoritativePricing({
        items: [mockItem2],
        isGiftWrapped: true,
      });
      expect(res.giftWrappingFee).toBe(GIFT_WRAPPING_FEE);
      expect(res.totalAmount).toBe(600 + GIFT_WRAPPING_FEE);
    });
  });

  describe('GST Inclusive Tax Breakdown', () => {
    it('splits GST into CGST & SGST for intra-state (Maharashtra)', () => {
      const res = computeAuthoritativePricing({
        items: [mockItem2], // total 600
        state: 'Maharashtra',
      });
      expect(res.gstIncluded.totalGst).toBeGreaterThan(0);
      expect(res.gstIncluded.cgst).toBeGreaterThan(0);
      expect(res.gstIncluded.sgst).toBeGreaterThan(0);
      expect(res.gstIncluded.igst).toBe(0);
    });

    it('applies IGST for inter-state orders (e.g. Karnataka)', () => {
      const res = computeAuthoritativePricing({
        items: [mockItem2],
        state: 'Karnataka',
      });
      expect(res.gstIncluded.totalGst).toBeGreaterThan(0);
      expect(res.gstIncluded.cgst).toBe(0);
      expect(res.gstIncluded.sgst).toBe(0);
      expect(res.gstIncluded.igst).toBe(res.gstIncluded.totalGst);
    });
  });

  describe('calculateCartTotals (discounts.ts)', () => {
    it('correctly calculates totals for cart items', () => {
      const result = calculateCartTotals({
        items: [mockItem1, mockItem2],
        couponCode: 'LOVE100',
        isGiftWrapped: true,
      });

      expect(result.subtotal).toBe(1000);
      expect(result.discountTotal).toBe(100);
      expect(result.giftWrappingFee).toBe(99);
      expect(result.totalAmount).toBe(1000 - 100 + 99); // free shipping because 900 >= 499
    });
  });
});
