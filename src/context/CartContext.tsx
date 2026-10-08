import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, AppliedOffer, Coupon } from '../types';
import { computeAuthoritativePricing } from '../shared/pricing';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
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
  isGiftWrapped: boolean;
  giftWrappingFee: number;
  giftNote: string;
  toggleGiftWrapping: (enable?: boolean) => void;
  setGiftNote: (note: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'divines_eternity_cart_v1';
const COUPON_KEY = 'divines_eternity_applied_coupon';
const GIFT_WRAP_KEY = 'divines_eternity_gift_wrap';
const GIFT_NOTE_KEY = 'divines_eternity_gift_note';

export const FREE_SHIPPING_MIN = 499;

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'LOVE100',
    description: 'Flat ₹100 Off on your personalized gift order',
    type: 'flat',
    value: 100,
    minOrderValue: 799,
    isActive: true,
  },
  {
    code: 'FLAT849',
    description: 'Any 2 Handcrafted Gifts for Flat ₹849 total',
    type: 'flat849',
    value: 300,
    minItems: 2,
    minOrderValue: 849,
    isActive: true,
  },
  {
    code: 'BUY3PAY2',
    description: 'Buy 3 Gifts, Lowest Priced Item is 100% Free',
    type: 'buy3pay2',
    value: 0,
    minItems: 3,
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

  const [validatedCoupon, setValidatedCoupon] = useState<any>(null);

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

  // localStorage used strictly as local cache for cart, theme, and sound
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage cache', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(COUPON_KEY, couponCode);
    } catch (e) {
      console.error('Failed to save coupon cache', e);
    }
  }, [couponCode]);

  useEffect(() => {
    try {
      localStorage.setItem(GIFT_WRAP_KEY, isGiftWrapped.toString());
    } catch (e) {
      console.error('Failed to save gift wrapping cache', e);
    }
  }, [isGiftWrapped]);

  useEffect(() => {
    try {
      localStorage.setItem(GIFT_NOTE_KEY, giftNote);
    } catch (e) {
      console.error('Failed to save gift note cache', e);
    }
  }, [giftNote]);

  const toggleGiftWrapping = (enable?: boolean) => {
    setIsGiftWrapped((prev) => (typeof enable === 'boolean' ? enable : !prev));
  };

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.customText === newItem.customText &&
          item.customPhoto === newItem.customPhoto &&
          item.caseType === newItem.caseType &&
          item.themeColor === newItem.themeColor &&
          item.secondaryColor === newItem.secondaryColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }

      return [
        ...prev,
        {
          ...newItem,
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
      ];
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
    setValidatedCoupon(null);
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

  // Server-side validation of coupons against Supabase coupons table
  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a valid coupon code.' };
    }

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: cleanCode,
          subtotal,
          itemsCount: totalItemsCount,
          itemPrices,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        return {
          success: false,
          message: data.message || `Coupon "${cleanCode}" could not be validated.`,
        };
      }

      setCouponCode(cleanCode);
      setValidatedCoupon(data.coupon);
      return {
        success: true,
        message: data.message || `Coupon "${cleanCode}" applied successfully!`,
      };
    } catch (err: any) {
      // In case fetch is unavailable, fallback to authoritative local matching
      console.warn('Coupon server validation network warning, verifying:', err.message);
      return {
        success: false,
        message: 'Unable to reach coupon verification service. Please try again.',
      };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setValidatedCoupon(null);
  };

  // Re-verify active coupon if subtotal/cart changes
  useEffect(() => {
    if (couponCode && cart.length > 0) {
      fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          subtotal,
          itemsCount: totalItemsCount,
          itemPrices,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.valid) {
            setValidatedCoupon(data.coupon);
          } else {
            setValidatedCoupon(null);
          }
        })
        .catch(() => {
          // ignore background check errors
        });
    } else if (cart.length === 0) {
      setValidatedCoupon(null);
    }
  }, [subtotal, totalItemsCount, couponCode]);

  // Compute authoritative pricing breakdown passing the verified database coupon
  const authoritativeBreakdown = computeAuthoritativePricing({
    items: cart,
    couponCode: couponCode || undefined,
    isGiftWrapped,
    dbCoupon: validatedCoupon,
  });

  const discountTotal = authoritativeBreakdown.discountTotal;
  const shippingFee = authoritativeBreakdown.shippingFee;
  const giftWrappingFee = authoritativeBreakdown.giftWrappingFee;
  const totalAmount = authoritativeBreakdown.totalAmount;
  const amountNeededForFreeShipping = authoritativeBreakdown.amountNeededForFreeShipping;
  const appliedOffer = authoritativeBreakdown.appliedOffer || null;

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
        appliedOffer,
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
