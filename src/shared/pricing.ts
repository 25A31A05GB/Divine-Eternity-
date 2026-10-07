import { CartItem, AppliedOffer, Product } from '../types';

export interface PricingCalculationInput {
  items: CartItem[];
  couponCode?: string | null;
  isGiftWrapped?: boolean;
  state?: string;
  catalogProducts?: Product[];
}

export interface PricingBreakdown {
  subtotal: number;
  discountTotal: number;
  appliedOffer?: AppliedOffer;
  isGiftWrapped: boolean;
  giftWrappingFee: number;
  shippingFee: number;
  totalAmount: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  gstIncluded: {
    totalGst: number;
    cgst: number;
    sgst: number;
    igst: number;
    ratePct: number;
  };
}

export const FREE_SHIPPING_THRESHOLD = 499;
export const STANDARD_SHIPPING_FEE = 49;
export const GIFT_WRAPPING_FEE = 99;
export const GST_RATE = 0.03; // 3% GST standard on precious/fashion jewelry in India

export function computeAuthoritativePricing(input: PricingCalculationInput): PricingBreakdown {
  const { items, couponCode, isGiftWrapped = false, state = 'Maharashtra', catalogProducts } = input;

  if (!items || items.length === 0) {
    return {
      subtotal: 0,
      discountTotal: 0,
      isGiftWrapped,
      giftWrappingFee: 0,
      shippingFee: 0,
      totalAmount: 0,
      isFreeShipping: false,
      amountNeededForFreeShipping: FREE_SHIPPING_THRESHOLD,
      gstIncluded: { totalGst: 0, cgst: 0, sgst: 0, igst: 0, ratePct: 3 },
    };
  }

  // 1. Authoritative Subtotal Calculation (prefer catalog prices if available)
  let subtotal = 0;
  for (const item of items) {
    let unitPrice = item.price;
    if (catalogProducts && catalogProducts.length > 0) {
      const match = catalogProducts.find((p) => p.id === item.productId || p.slug === item.slug);
      if (match) {
        unitPrice = match.price;
      }
    }
    subtotal += Math.round(unitPrice * item.quantity);
  }

  let discountTotal = 0;
  let appliedOffer: AppliedOffer | undefined = undefined;
  const totalItemCount = items.reduce((acc, it) => acc + it.quantity, 0);

  const cleanCode = couponCode ? couponCode.trim().toUpperCase() : '';

  // 2. Authoritative Coupon Evaluation
  if (cleanCode === 'BUY3PAY2') {
    if (totalItemCount >= 3) {
      // Find cheapest single unit across items
      const unitPrices: number[] = [];
      for (const it of items) {
        let p = it.price;
        if (catalogProducts) {
          const match = catalogProducts.find((cp) => cp.id === it.productId || cp.slug === it.slug);
          if (match) p = match.price;
        }
        for (let i = 0; i < it.quantity; i++) {
          unitPrices.push(p);
        }
      }
      unitPrices.sort((a, b) => a - b);
      const cheapestUnitPrice = unitPrices[0] || 0;
      discountTotal = cheapestUnitPrice;
      appliedOffer = {
        code: 'BUY3PAY2',
        name: 'Buy 3, Pay for 2 Offer',
        title: 'Buy 3, Pay for 2 Offer',
        description: 'Cheapest gift item 100% free',
        discountAmount: discountTotal,
      };
    }
  } else if (cleanCode === 'FLAT849') {
    if (totalItemCount >= 2 && subtotal >= 849) {
      const targetPromoAmount = 849;
      if (subtotal > targetPromoAmount) {
        discountTotal = Math.min(subtotal - targetPromoAmount, 300);
        appliedOffer = {
          code: 'FLAT849',
          name: 'Special 2-Piece Atelier Combo',
          title: 'Special 2-Piece Atelier Combo',
          description: 'Any 2 curated pieces for flat ₹849 total',
          discountAmount: discountTotal,
        };
      }
    }
  } else if (cleanCode === 'LOVE100') {
    if (subtotal >= 799) {
      discountTotal = 100;
      appliedOffer = {
        code: 'LOVE100',
        name: 'Love & Eternity Privilege',
        title: 'Love & Eternity Privilege',
        description: 'Flat ₹100 instant discount',
        discountAmount: 100,
      };
    }
  } else if (cleanCode === 'WELCOME100') {
    if (subtotal >= 599) {
      discountTotal = 100;
      appliedOffer = {
        code: 'WELCOME100',
        name: 'Welcome VIP Privilege',
        title: 'Welcome VIP Privilege',
        description: 'Flat ₹100 instant discount on first purchase',
        discountAmount: 100,
      };
    }
  } else if (cleanCode === 'GENZ15') {
    if (subtotal >= 499) {
      discountTotal = Math.round(subtotal * 0.15);
      appliedOffer = {
        code: 'GENZ15',
        name: 'Gen-Z Creator 15% Privilege',
        title: 'Gen-Z Creator 15% Privilege',
        description: '15% instant reduction on handcrafted pieces',
        discountAmount: discountTotal,
      };
    }
  }

  // Cap discount total
  discountTotal = Math.min(discountTotal, subtotal);

  // 3. Shipping & Add-ons
  const netBeforeShipping = Math.max(0, subtotal - discountTotal);
  const isFreeShipping = netBeforeShipping >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const giftFee = isGiftWrapped ? GIFT_WRAPPING_FEE : 0;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - netBeforeShipping);

  const totalAmount = Math.max(0, netBeforeShipping + shippingFee + giftFee);

  // 4. GST Breakdown (GST is inclusive in retail price per Indian regulations)
  // Base price = Total / (1 + GST_RATE)
  const basePrice = Math.round((totalAmount / (1 + GST_RATE)) * 100) / 100;
  const totalGst = Math.round((totalAmount - basePrice) * 100) / 100;

  const isIntraState = state.toLowerCase().includes('maharashtra') || state.toLowerCase() === 'mh';
  const cgst = isIntraState ? Math.round((totalGst / 2) * 100) / 100 : 0;
  const sgst = isIntraState ? Math.round((totalGst / 2) * 100) / 100 : 0;
  const igst = !isIntraState ? totalGst : 0;

  return {
    subtotal,
    discountTotal,
    appliedOffer,
    isGiftWrapped,
    giftWrappingFee: giftFee,
    shippingFee,
    totalAmount,
    isFreeShipping,
    amountNeededForFreeShipping,
    gstIncluded: {
      totalGst,
      cgst,
      sgst,
      igst,
      ratePct: 3,
    },
  };
}
