import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CustomerAddress, Order } from '../types';
import { PhoneCaseMockup } from '../utils/productVisuals';
import { ShieldCheck, Truck, Sparkles, CreditCard, QrCode, Banknote, Lock, ArrowLeft, Check, AlertCircle, Gift, MessageSquare, Loader2 } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { BRAND_CONFIG } from '../config/brand';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToCart, onOrderSuccess }) => {
  const {
    cart,
    subtotal,
    discountTotal,
    appliedOffer,
    shippingFee,
    totalAmount,
    couponCode,
    clearCart,
    isGiftWrapped,
    giftWrappingFee,
    giftNote,
    toggleGiftWrapping,
    setGiftNote,
  } = useCart();
  const { user, updateAddress } = useAuth();

  const [formData, setFormData] = useState<CustomerAddress>({
    fullName: user?.addresses[0]?.fullName || user?.name || '',
    phone: user?.addresses[0]?.phone || user?.phone || '',
    email: user?.email || '',
    streetAddress: user?.addresses[0]?.streetAddress || '',
    apartment: user?.addresses[0]?.apartment || '',
    city: user?.addresses[0]?.city || '',
    state: user?.addresses[0]?.state || 'Maharashtra',
    pincode: user?.addresses[0]?.pincode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'Online' | 'COD'>('Online');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState('');

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.length < 3) {
      newErrors.fullName = 'Please enter your full name.';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.streetAddress.trim() || formData.streetAddress.length < 5) {
      newErrors.streetAddress = 'Please enter your delivery street address.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city.';
    }

    const cleanPincode = formData.pincode.replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian PIN code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setServerError('');
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      const el = document.getElementById(firstError);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Submit order payload to authoritative server route
      const payload = {
        customer: formData,
        items: cart,
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'UPI',
        couponCode: couponCode || appliedOffer?.code,
        isGiftWrapped,
        giftNote: isGiftWrapped ? giftNote : undefined,
      };

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setIsProcessing(false);
        setServerError(json.error || 'Failed to initialize order on server. Please try again.');
        return;
      }

      const { order, razorpayOrderId, razorpayKeyId } = json;

      // Handle COD Flow
      if (paymentMethod === 'COD') {
        finishOrder(order);
        return;
      }

      // Handle Real Razorpay Flow
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        setIsProcessing(false);
        setServerError('Razorpay secure gateway failed to load. Please check your connection.');
        return;
      }

      const options = {
        key: razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: Math.round(order.totalAmount * 100),
        currency: 'INR',
        name: BRAND_CONFIG.name,
        description: 'Bespoke Handcrafted Keepsake Order',
        order_id: razorpayOrderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#FF2E93',
        },
        handler: async (response: any) => {
          // Cryptographic signature verification on server
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyJson = await verifyRes.json();
            if (verifyJson.success) {
              order.paymentStatus = 'Paid';
              order.paymentId = response.razorpay_payment_id;
              finishOrder(order);
            } else {
              setIsProcessing(false);
              setServerError('Payment verification signature failed. If your money was deducted, our team will assist promptly.');
            }
          } catch (e) {
            setIsProcessing(false);
            setServerError('Network error while verifying payment.');
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setServerError('Payment was cancelled. You can retry with another method.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setIsProcessing(false);
        setServerError(`Payment failed: ${resp.error?.description || 'Declined by bank'}`);
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setServerError('An unexpected error occurred during checkout. Please try again.');
    }
  };

  const finishOrder = (confirmedOrder: Order) => {
    updateAddress(formData);
    clearCart();
    setIsProcessing(false);

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    onOrderSuccess(confirmedOrder);
  };

  const checkoutUrl = typeof window !== 'undefined' ? window.location.href : 'https://divineseternity.com/#checkout';

  return (
    <div className="py-8 sm:py-12 bg-[#FFFDF8]">
      <SEO
        title="Express Secure Checkout — Divine’s Eternity"
        description="Complete your bespoke luxury gift order securely with UPI, Credit Cards, NetBanking, or Cash on Delivery. 256-bit encrypted checkout with insured delivery."
        url={checkoutUrl}
        noindex={true}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <button
            onClick={onBackToCart}
            className="text-xs font-bold text-stone-500 hover:text-[#FF2E93] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Bag</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Checkout Form Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {serverError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 shadow-xs">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{serverError}</span>
              </div>
            )}

            {/* 1. Customer Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="font-serif-heading text-lg font-bold text-[#211D1C] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF2E93] text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  <span>Insured Shipping & Delivery</span>
                </h2>
                <span className="text-[11px] font-bold text-stone-400">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#211D1C]">Recipient Full Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className={`w-full bg-[#FFF9EB] border rounded-xl px-4 py-2.5 text-xs text-[#211D1C] outline-none transition-colors ${
                      errors.fullName ? 'border-rose-400' : 'border-[#F5E6CE] focus:border-[#FF2E93]'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-600">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#211D1C]">10-Digit Mobile (For Tracking SMS) *</label>
                  <input
                    id="phone"
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="9876543210"
                    className={`w-full bg-[#FFF9EB] border rounded-xl px-4 py-2.5 text-xs text-[#211D1C] outline-none transition-colors ${
                      errors.phone ? 'border-rose-400' : 'border-[#F5E6CE] focus:border-[#FF2E93]'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#211D1C]">Email Address (For Tax Invoice) *</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ananya@example.com"
                    className={`w-full bg-[#FFF9EB] border rounded-xl px-4 py-2.5 text-xs text-[#211D1C] outline-none transition-colors ${
                      errors.email ? 'border-rose-400' : 'border-[#F5E6CE] focus:border-[#FF2E93]'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#211D1C]">Street Address, House/Flat No, Landmark *</label>
                  <input
                    id="streetAddress"
                    type="text"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    placeholder="Flat 402, Rosewood Heights, Linking Road"
                    className={`w-full bg-[#FFF9EB] border rounded-xl px-4 py-2.5 text-xs text-[#211D1C] outline-none transition-colors ${
                      errors.streetAddress ? 'border-rose-400' : 'border-[#F5E6CE] focus:border-[#FF2E93]'
                    }`}
                  />
                  {errors.streetAddress && <p className="text-[11px] text-rose-600">{errors.streetAddress}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#211D1C]">City *</label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mumbai"
                    className={`w-full bg-[#FFF9EB] border rounded-xl px-4 py-2.5 text-xs text-[#211D1C] outline-none transition-colors ${
                      errors.city ? 'border-rose-400' : 'border-[#F5E6CE] focus:border-[#FF2E93]'
                    }`}
                  />
                  {errors.city && <p className="text-[11px] text-rose-600">{errors.city}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#211D1C]">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-4 py-2.5 text-xs text-[#211D1C] outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#211D1C]">6-Digit Postal PIN Code *</label>
                  <input
                    id="pincode"
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="400050"
                    className={`w-full bg-[#FFF9EB] border rounded-xl px-4 py-2.5 text-xs text-[#211D1C] outline-none transition-colors ${
                      errors.pincode ? 'border-rose-400' : 'border-[#F5E6CE] focus:border-[#FF2E93]'
                    }`}
                  />
                  {errors.pincode && <p className="text-[11px] text-rose-600">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Gift Wrapping & Handwritten Letter Option */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#FF2E93] flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#211D1C]">
                        Luxury Gift Box & Handwritten Calligraphy Note
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD94A] text-[#211D1C]">
                        +₹{BRAND_CONFIG.giftWrappingFee}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Signature blush velvet box, satin gold ribbon & customized handwritten note.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isGiftWrapped}
                    onChange={() => toggleGiftWrapping()}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF2E93]" />
                </label>
              </div>

              {isGiftWrapped && (
                <div className="pt-3 border-t border-dashed border-[#F3E8E2] space-y-2">
                  <label className="text-xs font-bold text-[#FF2E93] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Handwritten Note Message:
                  </label>
                  <textarea
                    rows={3}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write your heartfelt message here (e.g., Happy Anniversary! Every day with you is pure magic)..."
                    className="w-full text-xs p-3 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE] text-[#211D1C] placeholder-stone-400 focus:outline-none focus:border-[#FF2E93] resize-none"
                  />
                </div>
              )}
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="font-serif-heading text-lg font-bold text-[#211D1C] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF2E93] text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  <span>Payment Gateway</span>
                </h2>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Razorpay 256-bit Encrypted
                </span>
              </div>

              <div className="space-y-3">
                {/* Real Razorpay Online Payment */}
                <div
                  onClick={() => setPaymentMethod('Online')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Online'
                      ? 'border-[#FF2E93] bg-[#FFF0F3] shadow-xs'
                      : 'border-stone-200 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#FF2E93]" />
                      <div>
                        <p className="text-xs font-bold text-[#211D1C]">
                          Razorpay (UPI, GPay, PhonePe, Cards, NetBanking)
                        </p>
                        <p className="text-[10px] text-stone-500">Official Razorpay checkout with instant verification</p>
                      </div>
                    </div>
                    {paymentMethod === 'Online' && <Check className="w-4 h-4 text-[#FF2E93]" />}
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#FF2E93] bg-[#FFF0F3] shadow-xs'
                      : 'border-stone-200 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-[#211D1C]">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-[10px] text-stone-500">Pay cash or scan courier QR upon doorstep delivery</p>
                      </div>
                    </div>
                    {paymentMethod === 'COD' && <Check className="w-4 h-4 text-[#FF2E93]" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Right Column (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-5 sticky top-28">
            <h3 className="font-serif-heading text-lg font-bold text-[#211D1C] pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Order Summary ({cart.length})</span>
              <span className="text-xs font-mono font-bold text-[#FF2E93]">Divine’s Atelier</span>
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF9EB] border border-[#F5E6CE] p-1 shrink-0 flex items-center justify-center">
                    <PhoneCaseMockup product={item as any} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#211D1C] truncate">{item.name}</p>
                    <p className="text-[11px] text-stone-500">Qty: {item.quantity} · {item.caseType || 'Keepsake'}</p>
                    {item.customText && (
                      <p className="text-[10px] text-[#FF2E93] font-bold">“{item.customText}”</p>
                    )}
                  </div>
                  <span className="font-mono font-bold text-[#211D1C]">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-stone-100 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal (Catalog Authoritative)</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({appliedOffer?.code || 'Privilege'})</span>
                  <span className="font-mono">-₹{discountTotal}</span>
                </div>
              )}

              {isGiftWrapped && (
                <div className="flex justify-between text-stone-600">
                  <span>Luxury Gift Box</span>
                  <span className="font-mono">+₹{giftWrappingFee}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Shipping Express</span>
                <span className="font-mono">{shippingFee === 0 ? 'FREE' : `+₹${shippingFee}`}</span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-stone-200 text-base font-bold text-[#211D1C]">
                <span>Total Amount (All GST Included)</span>
                <span className="font-serif-heading text-xl text-[#FF2E93]">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Checkout...</span>
                </>
              ) : (
                <span>Complete Order · ₹{totalAmount}</span>
              )}
            </button>

            <div className="space-y-1 text-[11px] text-stone-500 text-center">
              <p className="flex items-center justify-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Insured Express Delivery (3 - 5 Days)</span>
              </p>
              <p>Handcrafted in Mumbai Atelier · Verified GST Invoice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
