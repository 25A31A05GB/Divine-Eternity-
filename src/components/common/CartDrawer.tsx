import React, { useState } from 'react';
import { X, Trash2, Sparkles, Tag, ArrowRight, ShoppingBag, ShieldCheck, Check, Gift, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { PhoneCaseMockup } from '../../utils/productVisuals';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreMore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout, onExploreMore }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountTotal,
    appliedOffer,
    shippingFee,
    totalAmount,
    totalItemsCount,
    couponCode,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    availableCoupons,
    isGiftWrapped,
    giftWrappingFee,
    giftNote,
    toggleGiftWrapping,
    setGiftNote,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || inputCoupon;
    if (!code) return;
    const res = applyCoupon(code);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setInputCoupon('');
    }
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round(((freeShippingThreshold - amountNeededForFreeShipping) / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF8] text-[#211D1C] shadow-2xl flex flex-col justify-between border-l border-[#F3E8E2] animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#FFE0E6] flex items-center justify-between bg-[#FFF0F3]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF2E93]" />
              <h2 className="font-serif-heading text-lg sm:text-xl font-bold text-[#211D1C]">
                Your Shopping Bag
              </h2>
              <span className="bg-[#FF2E93] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {totalItemsCount}
              </span>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="p-1.5 rounded-full text-stone-500 hover:text-[#FF2E93] hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-[#FFF9DE] border-b border-[#F5E6B8]">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
              {amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#FF2E93]">₹{amountNeededForFreeShipping}</strong> more for{' '}
                  <strong className="text-emerald-700">FREE Shipping</strong>!
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> You unlocked FREE Express Shipping!
                </span>
              )}
              <span className="text-[10px] text-stone-500">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#FF2E93] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF0F3] border border-[#FFE0E6] flex items-center justify-center text-[#FF2E93]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-lg font-bold text-[#211D1C]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Treat your phone to a cute aesthetic case from the Cute Covers Club.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    onExploreMore();
                  }}
                  className="bg-[#211D1C] hover:bg-[#FF2E93] text-white px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase shadow-md transition-colors cursor-pointer"
                >
                  Shop Best Sellers
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white p-3 rounded-2xl border border-[#F3E8E2] shadow-2xs relative group"
                >
                  {/* Thumbnail Mockup */}
                  <div className="w-20 h-24 rounded-xl bg-[#FFFDF8] overflow-hidden flex items-center justify-center border border-[#F3E8E2] shrink-0">
                    <PhoneCaseMockup
                      product={{
                        designPattern: item.designPattern,
                        themeColor: item.themeColor,
                        secondaryColor: item.secondaryColor,
                        name: item.name,
                        category: item.category,
                      }}
                      customText={item.customText}
                      className="w-full h-full scale-75"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-[#211D1C] truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          className="text-stone-400 hover:text-rose-500 p-0.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-stone-600 font-medium mt-0.5">
                        {item.brand} · {item.model}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        Type: {item.caseType}
                      </p>

                      {item.customText && (
                        <p className="text-[10px] text-[#FF2E93] font-semibold mt-0.5 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#FF2E93]" />
                          <span>Custom Tag: {item.customText}</span>
                        </p>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-stone-100">
                      <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:text-[#FF2E93] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums text-[#211D1C]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:text-[#FF2E93] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#211D1C] tabular-nums font-serif">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Engine */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
              
              {/* Luxury Gift Wrapping Toggle Card */}
              <div className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#F3E8E2] shadow-xs space-y-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF0F3] text-[#FF2E93] flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#211D1C]">
                          Cute Gift Packaging & Note
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FFD94A] text-[#211D1C]">
                          +₹99
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 line-clamp-1">
                        Signature box, pink bow & handwritten card
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isGiftWrapped}
                      onChange={() => toggleGiftWrapping()}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF2E93]" />
                  </label>
                </div>

                {/* Expandable Gift Note Input */}
                {isGiftWrapped && (
                  <div className="pt-2 border-t border-dashed border-stone-200 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                    <label className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Personalized Gift Note Card:
                    </label>
                    <textarea
                      rows={2}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Write your heartfelt note here..."
                      className="w-full text-xs p-2 rounded-xl bg-white border border-stone-200 text-[#211D1C] placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#FF2E93] resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Coupon Input & Preset Pills */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Enter promo coupon code"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono uppercase text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="bg-[#211D1C] text-white hover:bg-[#FF2E93] text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {/* Quick Coupon Suggestions */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <span className="text-[10px] text-stone-500 font-semibold shrink-0">Try:</span>
                  {availableCoupons.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border shrink-0 transition-all cursor-pointer ${
                        appliedOffer?.code === c.code
                          ? 'bg-[#FF2E93] text-white border-[#FF2E93]'
                          : 'bg-white border-stone-200 text-[#FF2E93] hover:border-[#FF2E93]'
                      }`}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>

                {couponMessage && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponMessage.isError ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-stone-200">
                <div className="flex justify-between text-stone-600">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold tabular-nums text-[#211D1C]">
                    ₹{subtotal}
                  </span>
                </div>

                {appliedOffer && (
                  <div className="flex justify-between items-center text-emerald-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF2E93]" />
                      <span>{appliedOffer.name}</span>
                    </span>
                    <span className="tabular-nums font-bold">
                      -₹{discountTotal}
                    </span>
                  </div>
                )}

                {isGiftWrapped && (
                  <div className="flex justify-between items-center text-stone-600">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3 h-3 text-[#FF2E93]" />
                      <span>Cute Gift Packaging & Note</span>
                    </span>
                    <span className="font-semibold tabular-nums text-[#211D1C]">
                      +₹{giftWrappingFee}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Express Shipping</span>
                  <span className="font-semibold tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-sm font-extrabold text-[#211D1C] pt-2 border-t border-dashed border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#211D1C] tabular-nums font-serif font-bold">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#211D1C] hover:bg-[#FF2E93] text-white py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
              >
                <span>Proceed To Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>UPI · Cards · COD Guaranteed Safe Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
