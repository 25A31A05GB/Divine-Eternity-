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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#1E1A1D] shadow-2xl flex flex-col justify-between border-l border-[#F3E8E2] dark:border-[#2D252A] animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-[#FFF8F4] dark:bg-black/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F0508C]" />
              <h2 className="font-serif-heading text-lg sm:text-xl font-bold text-[#231F20] dark:text-white">
                Your Shopping Bag
              </h2>
              <span className="bg-[#F0508C] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {totalItemsCount}
              </span>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="p-1.5 rounded-full text-slate-500 hover:text-[#F0508C] hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-pink-50/70 dark:bg-pink-950/20 border-b border-pink-100 dark:border-pink-950/40">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              {amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#F0508C]">₹{amountNeededForFreeShipping}</strong> more for{' '}
                  <strong className="text-emerald-600">FREE Shipping</strong>!
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> You unlocked FREE Express Shipping!
                </span>
              )}
              <span className="text-[10px] text-slate-500">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-pink-200/60 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#F0508C] to-[#FFD94A] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center text-[#881337] dark:text-[#FB7185]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-lg font-bold text-slate-800 dark:text-slate-200">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Treat your phone to a dreamy aesthetic makeover with custom engraved cases & pearl wristlets.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    onExploreMore();
                  }}
                  className="bg-[#F0508C] text-white px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase shadow-md hover:bg-[#d63b74] transition-colors"
                >
                  Shop Best Sellers
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-[#FFF8F4] dark:bg-slate-900/40 p-3 rounded-2xl border border-[#F3E8E2] dark:border-slate-800 relative group"
                >
                  {/* Thumbnail Mockup */}
                  <div className="w-20 h-24 rounded-xl bg-white dark:bg-black/30 overflow-hidden flex items-center justify-center border border-pink-100 shrink-0">
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
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                        {item.brand} · {item.model}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        Type: {item.caseType}
                      </p>

                      {item.customText && (
                        <p className="text-[10px] text-[#F0508C] font-semibold mt-0.5">
                          ✦ Name: <span className="font-script text-xs">{item.customText}</span>
                        </p>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-pink-200/60 dark:border-slate-800">
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800 px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:text-[#F0508C]"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:text-[#F0508C]"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white tabular-nums">
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
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-[#FFF8F4] dark:bg-black/40 space-y-3">
              
              {/* Luxury Gift Wrapping Toggle Card */}
              <div className="p-3 rounded-2xl bg-white dark:bg-[#1A1619] border border-pink-200/80 dark:border-pink-950/50 shadow-xs space-y-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F0508C]/15 text-[#F0508C] flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Luxury Gift Packaging & Note
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FFD94A] text-[#231F20]">
                          +₹99
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        Blush velvet box, gold ribbon & custom card
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
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F0508C]" />
                  </label>
                </div>

                {/* Expandable Gift Note Input */}
                {isGiftWrapped && (
                  <div className="pt-2 border-t border-dashed border-pink-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                    <label className="text-[10px] font-bold text-[#F0508C] uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Personalized Gift Note Card:
                    </label>
                    <textarea
                      rows={2}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Write your heartfelt note here (e.g., Happy Birthday Anya! Love you always, Rohan)..."
                      className="w-full text-xs p-2 rounded-xl bg-[#FFF9F5] dark:bg-slate-900 border border-pink-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#F0508C] resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Coupon Input & Preset Pills */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter promo coupon code"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono uppercase text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#F0508C] focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="bg-[#231F20] dark:bg-white text-white dark:text-[#231F20] hover:bg-[#F0508C] text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Quick Coupon Suggestions */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">Try:</span>
                  {availableCoupons.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border shrink-0 transition-all ${
                        appliedOffer?.code === c.code
                          ? 'bg-[#F0508C] text-white border-[#F0508C]'
                          : 'bg-white dark:bg-slate-800 border-pink-200 dark:border-slate-700 text-[#F0508C] hover:border-[#F0508C]'
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
              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    ₹{subtotal}
                  </span>
                </div>

                {appliedOffer && (
                  <div className="flex justify-between items-center text-emerald-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FFD94A]" />
                      <span>{appliedOffer.name}</span>
                    </span>
                    <span className="tabular-nums font-bold">
                      -₹{discountTotal}
                    </span>
                  </div>
                )}

                {isGiftWrapped && (
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3 h-3 text-[#F0508C]" />
                      <span>Luxury Gift Packaging & Note</span>
                    </span>
                    <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                      +₹{giftWrappingFee}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Express Shipping</span>
                  <span className="font-semibold tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-lg text-[#F0508C] tabular-nums font-serif-heading">
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
                className="w-full bg-[#F0508C] hover:bg-[#d63b74] text-white py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <span>Proceed To Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>UPI · Cards · COD Guaranteed Safe Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
