import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, AppliedOffer, Coupon } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discountTotal: number;
  appliedOffer: AppliedOffer | null;
  shippingFee: number;
  totalAmount: number;
  totalItemsCount: number;
  availableCoupons: Coupon[];
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  // Gift Wrapping
  isGiftWrapped: boolean;
  giftWrappingFee: number;
  giftNote: string;
  toggleGiftWrapping: (enable?: boolean) => void;
  setGiftNote: (note: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'divines_eternity_cart_v1';
const COUPON_KEY = 'divines_eternity_coupon_v1';
const GIFT_WRAP_KEY = 'divines_eternity_gift_wrap_v1';
const GIFT_NOTE_KEY = 'divines_eternity_gift_note_v1';
const FREE_SHIPPING_MIN = 499;
const STANDARD_SHIPPING = 49;
export const GIFT_WRAPPING_SURCHARGE = 99;

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'BUY3PAY2',
    description: 'Buy 3 Cases, Get 1 FREE (Cheapest unit is 100% free)',
    type: 'buy3pay2',
    value: 100,
    minItems: 3,
    isActive: true,
  },
  {
    code: 'FLAT849',
    description: 'Any 2 Luxury Cases for flat ₹849',
    type: 'flat849',
    value: 849,
    minItems: 2,
    isActive: true,
  },
  {
    code: 'LOVE100',
    description: 'Instant ₹100 Off on your order',
    type: 'flat',
    value: 100,
    minOrderValue: 500,
    isActive: true,
  },
  {
    code: 'GENZ15',
    description: '15% Off storewide for new members',
    type: 'percentage',
    value: 15,
    minOrderValue: 800,
    isActive: true,
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    try {
      return localStorage.getItem(COUPON_KEY) || '';
    } catch {
      return '';
    }
  });

  const [isGiftWrapped, setIsGiftWrapped] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GIFT_WRAP_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [giftNote, setGiftNote] = useState<string>(() => {
    try {
      return localStorage.getItem(GIFT_NOTE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(COUPON_KEY, couponCode);
    } catch (e) {
      console.error('Failed to save coupon', e);
    }
  }, [couponCode]);

  useEffect(() => {
    try {
      localStorage.setItem(GIFT_WRAP_KEY, isGiftWrapped.toString());
    } catch (e) {
      console.error('Failed to save gift wrapping option', e);
    }
  }, [isGiftWrapped]);

  useEffect(() => {
    try {
      localStorage.setItem(GIFT_NOTE_KEY, giftNote);
    } catch (e) {
      console.error('Failed to save gift note', e);
    }
  }, [giftNote]);

  const toggleGiftWrapping = (enable?: boolean) => {
    setIsGiftWrapped((prev) => (typeof enable === 'boolean' ? enable : !prev));
  };

  const addToCart = (itemData: Omit<CartItem, 'id'>) => {
    const customKey = (itemData.customText || '').trim().toLowerCase();
    const itemId = `${itemData.productId}_${itemData.brand}_${itemData.model}_${itemData.caseType}_${customKey}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + itemData.quantity,
        };
        return next;
      }
      return [...prev, { ...itemData, id: itemId }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Subtotal calculation
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Flattened array of individual item prices for offer computation
  const itemPrices: number[] = [];
  cart.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      itemPrices.push(item.price);
    }
  });
  itemPrices.sort((a, b) => a - b); // ascending

  // Calculate potential offers
  let bestOffer: AppliedOffer | null = null;

  // 1. Buy 3 Pay 2 rule: for every 3 items, the cheapest 1 item is free
  if (itemPrices.length >= 3) {
    const freeItemsCount = Math.floor(itemPrices.length / 3);
    const buy3Discount = itemPrices.slice(0, freeItemsCount).reduce((sum, p) => sum + p, 0);
    if (buy3Discount > 0) {
      bestOffer = {
        code: 'BUY3PAY2',
        name: 'Buy 3 Pay For 2 Offer',
        discountAmount: buy3Discount,
        description: `Cheapest ${freeItemsCount} item(s) are 100% free!`,
      };
    }
  }

  // 2. Custom manual coupon code evaluation
  const activeManualCoupon = AVAILABLE_COUPONS.find(
    (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
  );

  if (activeManualCoupon) {
    if (activeManualCoupon.code === 'FLAT849' && itemPrices.length >= 2) {
      // 2 cases for 849
      const twoCasesSum = itemPrices[itemPrices.length - 1] + itemPrices[itemPrices.length - 2];
      const flatDiscount = Math.max(0, twoCasesSum - 849);
      if (flatDiscount > (bestOffer?.discountAmount || 0)) {
        bestOffer = {
          code: 'FLAT849',
          name: 'Flat ₹849 for Any 2 Cases',
          discountAmount: flatDiscount,
          description: 'Special duo promo applied!',
        };
      }
    } else if (activeManualCoupon.type === 'flat') {
      if (subtotal >= (activeManualCoupon.minOrderValue || 0)) {
        if (activeManualCoupon.value > (bestOffer?.discountAmount || 0)) {
          bestOffer = {
            code: activeManualCoupon.code,
            name: activeManualCoupon.description,
            discountAmount: activeManualCoupon.value,
            description: `Flat ₹${activeManualCoupon.value} discount applied.`,
          };
        }
      }
    } else if (activeManualCoupon.type === 'percentage') {
      if (subtotal >= (activeManualCoupon.minOrderValue || 0)) {
        const percDiscount = Math.round((subtotal * activeManualCoupon.value) / 100);
        if (percDiscount > (bestOffer?.discountAmount || 0)) {
          bestOffer = {
            code: activeManualCoupon.code,
            name: `${activeManualCoupon.value}% Member Discount`,
            discountAmount: percDiscount,
            description: `${activeManualCoupon.value}% discount applied to your bag.`,
          };
        }
      }
    }
  }

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try FLAT849, LOVE100 or BUY3PAY2.' };
    }
    if (found.minItems && totalItemsCount < found.minItems) {
      return { success: false, message: `Add at least ${found.minItems} items to use ${cleanCode}.` };
    }
    if (found.minOrderValue && subtotal < found.minOrderValue) {
      return { success: false, message: `Minimum order value ₹${found.minOrderValue} required.` };
    }
    setCouponCode(cleanCode);
    return { success: true, message: `Coupon "${cleanCode}" applied successfully!` };
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  const discountTotal = bestOffer ? bestOffer.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const shippingFee = cart.length === 0 || taxableAmount >= FREE_SHIPPING_MIN ? 0 : STANDARD_SHIPPING;
  const giftWrappingFee = isGiftWrapped && cart.length > 0 ? GIFT_WRAPPING_SURCHARGE : 0;
  const totalAmount = cart.length === 0 ? 0 : taxableAmount + shippingFee + giftWrappingFee;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_MIN - taxableAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        couponCode,
        setCouponCode,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountTotal,
        appliedOffer: bestOffer,
        shippingFee,
        totalAmount,
        totalItemsCount,
        availableCoupons: AVAILABLE_COUPONS,
        freeShippingThreshold: FREE_SHIPPING_MIN,
        amountNeededForFreeShipping,
        isGiftWrapped,
        giftWrappingFee,
        giftNote,
        toggleGiftWrapping,
        setGiftNote,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
