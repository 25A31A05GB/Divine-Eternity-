import { CartItem, AppliedOffer, Product } from '../types';

export interface CalculationInput {
  items: CartItem[];
  couponCode?: string | null;
  isGiftWrapped?: boolean;
  catalogProducts?: Product[];
}

export interface CalculationResult {
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  giftWrappingFee: number;
  totalAmount: number;
  appliedOffer: AppliedOffer | null;
  itemCount: number;
}

/**
 * Authoritative discount calculation engine.
 * Used on both client for instant preview and on serverless API to enforce real pricing.
 */
export function calculateCartTotals({
  items,
  couponCode,
  isGiftWrapped = false,
  catalogProducts,
}: CalculationInput): CalculationResult {
  if (!items || items.length === 0) {
    return {
      subtotal: 0,
      discountTotal: 0,
      shippingFee: 0,
      giftWrappingFee: 0,
      totalAmount: 0,
      appliedOffer: null,
      itemCount: 0,
    };
  }

  // 1. Authoritative Price Resolution
  // If catalog is passed (e.g. on server from DB), override any client prices with true DB price
  const validatedItems = items.map((item) => {
    if (catalogProducts) {
      const match = catalogProducts.find((p) => p.id === item.productId || p.id === item.id);
      if (match) {
        return { ...item, price: match.price };
      }
    }
    return item;
  });

  const subtotal = validatedItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const itemCount = validatedItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  // 2. Flatten individual item unit prices for quantity-sensitive offers (BUY3PAY2, FLAT849)
  const flattenedPrices: number[] = [];
  validatedItems.forEach((item) => {
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    for (let i = 0; i < qty; i++) {
      flattenedPrices.push(Number(item.price) || 0);
    }
  });
  flattenedPrices.sort((a, b) => a - b); // Ascending order

  let discountTotal = 0;
  let appliedOffer: AppliedOffer | null = null;
  const normalizedCoupon = (couponCode || '').trim().toUpperCase();

  // 3. Discount Rules Evaluation
  if (normalizedCoupon === 'BUY3PAY2') {
    if (flattenedPrices.length >= 3) {
      // 1 free item per 3 purchased (cheapest item free)
      const freeItemsCount = Math.floor(flattenedPrices.length / 3);
      const freeAmount = flattenedPrices
        .slice(0, freeItemsCount)
        .reduce((sum, price) => sum + price, 0);

      discountTotal = freeAmount;
      appliedOffer = {
        code: 'BUY3PAY2',
        name: 'Buy 3 Pay For 2 Offer',
        discountAmount: freeAmount,
        description: `${freeItemsCount} complimentary keepsake${freeItemsCount > 1 ? 's' : ''} applied!`,
      };
    }
  } else if (normalizedCoupon === 'FLAT849') {
    if (flattenedPrices.length >= 2) {
      // Pair of highest items discounted to flat ₹849 total
      const topTwoSum =
        flattenedPrices[flattenedPrices.length - 1] +
        flattenedPrices[flattenedPrices.length - 2];
      const savings = Math.max(0, topTwoSum - 849);
      discountTotal = savings;
      appliedOffer = {
        code: 'FLAT849',
        name: 'Flat ₹849 Duo Privilege',
        discountAmount: savings,
        description: 'Any 2 luxury keepsakes capped at flat ₹849',
      };
    }
  } else if (normalizedCoupon === 'LOVE100') {
    if (subtotal >= 500) {
      discountTotal = 100;
      appliedOffer = {
        code: 'LOVE100',
        name: 'Flat ₹100 Welcome Privilege',
        discountAmount: 100,
        description: 'Instant ₹100 off on order above ₹500',
      };
    }
  } else if (normalizedCoupon === 'GENZ15') {
    if (subtotal >= 800) {
      discountTotal = Math.round(subtotal * 0.15);
      appliedOffer = {
        code: 'GENZ15',
        name: '15% Off VIP Circle Promo',
        discountAmount: discountTotal,
        description: '15% discount across your bespoke gifts',
      };
    }
  }

  // Cap discount so it cannot exceed subtotal
  discountTotal = Math.min(discountTotal, subtotal);

  // 4. Shipping Calculation: Free delivery on ₹499+ after discount, else ₹49
  const taxableSubtotal = Math.max(0, subtotal - discountTotal);
  const shippingFee = taxableSubtotal >= 499 || taxableSubtotal === 0 ? 0 : 49;

  // 5. Luxury Gift Packaging & Handwritten Letter Note
  const giftWrappingFee = isGiftWrapped ? 99 : 0;

  // 6. Net Total
  const totalAmount = taxableSubtotal + shippingFee + giftWrappingFee;

  return {
    subtotal,
    discountTotal,
    shippingFee,
    giftWrappingFee,
    totalAmount,
    appliedOffer,
    itemCount,
  };
}
