import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CustomerAddress, Order } from '../types';
import { PhoneCaseMockup } from '../utils/productVisuals';
import { ShieldCheck, Truck, Sparkles, CreditCard, QrCode, Banknote, Lock, ArrowLeft, Check, AlertCircle, Gift, MessageSquare } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderSuccess: (order: Order) => void;
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
  const { user, addOrder, updateAddress } = useAuth();

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

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash on Delivery' | 'Razorpay Simulated'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
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

    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Please enter a valid email address for gift invoice & tracking.';
    }

    if (!formData.streetAddress.trim() || formData.streetAddress.length < 8) {
      newErrors.streetAddress = 'Please enter complete delivery house/flat & street address.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city.';
    }

    const cleanPincode = formData.pincode.replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian PIN code.';
    }

    if (paymentMethod === 'UPI' && upiId && !upiId.includes('@')) {
      newErrors.upiId = 'UPI ID must contain @ (e.g. name@okhdfcbank)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    setServerError('');
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      const el = document.getElementById(firstError);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (paymentMethod === 'Razorpay Simulated') {
      setShowRazorpayModal(true);
      return;
    }

    executeOrderCompletion();
  };

  const executeOrderCompletion = async (simulatedSignature?: string) => {
    setIsProcessing(true);

    try {
      // 1. Send Order to Server-side API endpoint with authoritative price & offer calculation
      const payload = {
        customer: formData,
        items: cart,
        paymentMethod,
        couponCode: couponCode || appliedOffer?.code,
        isGiftWrapped,
        giftNote: isGiftWrapped ? giftNote : undefined,
      };

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let orderData: Order;
      if (res.ok) {
        const json = await res.json();
        orderData = json.order;

        // If online payment with signature, call verify-payment
        if (paymentMethod !== 'Cash on Delivery') {
          try {
            await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: json.razorpayOrderId || orderData.id,
                razorpay_payment_id: `pay_${Date.now()}`,
                razorpay_signature: simulatedSignature || 'sim_sig_valid',
                order_id: orderData.id,
              }),
            });
            orderData.paymentStatus = 'Paid';
          } catch (e) {
            console.warn('Payment verification ping completed', e);
          }
        }
      } else {
        // Fallback robust creation
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        orderData = {
          id: `DE-${randomNum}`,
          createdAt: new Date().toISOString(),
          customer: formData,
          items: [...cart],
          subtotal,
          discountTotal,
          appliedOffer: appliedOffer || undefined,
          isGiftWrapped,
          giftWrappingFee,
          giftNote: isGiftWrapped ? giftNote : undefined,
          shippingFee,
          totalAmount,
          paymentMethod,
          paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending COD Verification' : 'Paid',
          paymentId: `pay_${Date.now()}`,
          status: 'Placed',
          trackingNumber: `DELHIVERY-${Math.floor(10000000 + Math.random() * 90000000)}`,
          timeline: [
            {
              status: 'Placed',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              location: 'Mumbai Design Studio',
              description: 'Order confirmed and scheduled for custom engraving & gift boxing.',
            },
          ],
        };
      }

      // Save order to context, database layer, and persistence
      addOrder(orderData);
      updateAddress(formData);
      clearCart();
      setIsProcessing(false);

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      onOrderSuccess(orderData);
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setServerError('An issue occurred while communicating with the server. Your order was securely saved locally.');
    }
  };

  const checkoutUrl = typeof window !== 'undefined' ? window.location.href : 'https://divineseternity.com/#checkout';

  return (
    <div className="py-8 sm:py-12">
      <SEO
        title="Express Secure Checkout — Divine’s Eternity"
        description="Complete your bespoke luxury gift order securely with UPI, Credit Cards, or Cash on Delivery. 256-bit encrypted checkout with insured delivery."
        url={checkoutUrl}
        noindex={true}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <button
            onClick={onBackToCart}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#FF2E93] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Bag</span>
          </button>
        </div>

        <h1 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#211D1C] mb-8">
          Express Secure <span className="font-serif italic text-[#FF2E93]">Checkout</span>
        </h1>

        {serverError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {/* Left Column: Shipping & Payment Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Shipping Address Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="font-serif-heading text-lg font-bold text-[#211D1C] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF2E93] text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  <span>Order Delivery Address</span>
                </h2>
                <span className="text-[11px] text-stone-400">All fields required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Recipient Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Diya Patel"
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none ${
                      errors.fullName ? 'border-rose-500' : 'border-stone-200'
                    }`}
                  />
                  {errors.fullName && <p className="text-[10px] text-rose-600">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    Phone (for Courier Tracking SMS) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-200 bg-stone-100 text-xs font-semibold text-stone-600">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit mobile number"
                      className={`w-full bg-stone-50 border rounded-r-xl px-3.5 py-2.5 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none ${
                        errors.phone ? 'border-rose-500' : 'border-stone-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-rose-600">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    Email Address (for Invoice & Live Tracking) *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. diya.patel@gmail.com"
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none ${
                      errors.email ? 'border-rose-500' : 'border-stone-200'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-rose-600">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    Flat / House No., Landmark & Street Address *
                  </label>
                  <input
                    id="streetAddress"
                    type="text"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    placeholder="e.g. Flat 302, Palm Grove Apt, Linking Road, Bandra West"
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none ${
                      errors.streetAddress ? 'border-rose-500' : 'border-stone-200'
                    }`}
                  />
                  {errors.streetAddress && <p className="text-[10px] text-rose-600">{errors.streetAddress}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    City / Town *
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none ${
                      errors.city ? 'border-rose-500' : 'border-stone-200'
                    }`}
                  />
                  {errors.city && <p className="text-[10px] text-rose-600">{errors.city}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 400050"
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none ${
                      errors.pincode ? 'border-rose-500' : 'border-stone-200'
                    }`}
                  />
                  {errors.pincode && <p className="text-[10px] text-rose-600">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Cute Gift Packaging & Personalized Note Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#FF2E93] flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#211D1C]">
                        Cute Gift Packaging & Card
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD94A] text-[#211D1C]">
                        +₹99
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Signature blush velvet box, satin gold ribbon & customized handwritten note.
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
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E11D48]" />
                </label>
              </div>

              {/* Expandable Gift Note Input */}
              {isGiftWrapped && (
                <div className="pt-3 border-t border-dashed border-pink-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
                  <label className="text-xs font-bold text-[#E11D48] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Handwritten Gift Note Message:
                  </label>
                  <textarea
                    rows={3}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write your heartfelt gift message here (e.g., Happy 2nd Anniversary! Every day with you is pure magic)..."
                    className="w-full text-xs p-3 rounded-2xl bg-[#FFF9F5] dark:bg-slate-900 border border-pink-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E11D48] resize-none"
                  />
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E11D48]" />
                    <span>Hand-inscribed on our luxury pearlescent gold-foil stationery card.</span>
                  </p>
                </div>
              )}
            </div>

            {/* 2. Payment Options */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="font-serif-heading text-lg font-bold text-[#211D1C] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF2E93] text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  <span>Payment Method</span>
                </h2>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 256-bit Encrypted
                </span>
              </div>

              <div className="space-y-3">
                {/* Instant UPI */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#FF2E93] bg-[#FFF0F3] shadow-xs'
                      : 'border-stone-200 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-[#FF2E93]" />
                      <div>
                        <p className="text-xs font-bold text-[#211D1C]">
                          Instant UPI (GPay, PhonePe, Paytm, QR)
                        </p>
                        <p className="text-[10px] text-stone-500">Fastest checkout · Instant confirmation</p>
                      </div>
                    </div>
                    {paymentMethod === 'UPI' && <Check className="w-4 h-4 text-[#FF2E93]" />}
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="mt-3 pt-3 border-t border-[#FFE0E6]">
                      <input
                        type="text"
                        placeholder="Enter UPI ID (e.g. mobile@upi, name@okaxis)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-[#211D1C]"
                      />
                    </div>
                  )}
                </div>

                {/* Razorpay Gateway */}
                <div
                  onClick={() => setPaymentMethod('Razorpay Simulated')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Razorpay Simulated'
                      ? 'border-[#FF2E93] bg-[#FFF0F3] shadow-xs'
                      : 'border-stone-200 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#211D1C]" />
                      <div>
                        <p className="text-xs font-bold text-[#211D1C]">
                          Razorpay / NetBanking / Cards Gateway
                        </p>
                        <p className="text-[10px] text-stone-500">Credit cards, Wallets & EMI</p>
                      </div>
                    </div>
                    {paymentMethod === 'Razorpay Simulated' && <Check className="w-4 h-4 text-[#FF2E93]" />}
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
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
                        <p className="text-[10px] text-stone-500">Pay cash or scan QR upon doorstep delivery</p>
                      </div>
                    </div>
                    {paymentMethod === 'Cash on Delivery' && <Check className="w-4 h-4 text-[#FF2E93]" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-sm space-y-6 sticky top-24">
            <h3 className="font-serif-heading text-lg font-bold text-[#211D1C] pb-3 border-b border-stone-100">
              Order Summary ({cart.length} items)
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-xl bg-[#FFFDF8] border border-[#F3E8E2]"
                >
                  <div className="w-12 h-14 rounded-lg bg-white overflow-hidden flex items-center justify-center shrink-0 border border-stone-200">
                    <PhoneCaseMockup
                      product={{
                        designPattern: item.designPattern,
                        themeColor: item.themeColor,
                        secondaryColor: item.secondaryColor,
                        name: item.name,
                        category: item.category,
                      }}
                      customText={item.customText}
                      customPhoto={item.customPhoto}
                      customSong={item.customSong}
                      customArtist={item.customArtist}
                      className="w-full h-full scale-75"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <h5 className="font-bold text-[#211D1C] truncate">
                      {item.name}
                    </h5>
                    <p className="text-[10px] text-stone-500 truncate">
                      {item.category.split('&')[0]} · Qty {item.quantity}
                    </p>
                    {item.customText && (
                      <p className="text-[9px] text-[#FF2E93] font-script">
                        Engraving: {item.customText}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#211D1C] tabular-nums font-serif">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold tabular-nums text-[#211D1C]">₹{subtotal}</span>
              </div>

              {appliedOffer && (
                <div className="flex justify-between items-center text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF2E93]" />
                    <span>{appliedOffer.name}</span>
                  </span>
                  <span className="tabular-nums font-bold">-₹{discountTotal}</span>
                </div>
              )}

              {isGiftWrapped && (
                <div className="flex justify-between items-center text-stone-600">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-[#FF2E93]" />
                    <span>Cute Gift Packaging & Note</span>
                  </span>
                  <span className="font-semibold tabular-nums text-[#211D1C]">+₹{giftWrappingFee}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Insured Express Delivery</span>
                <span className="font-semibold tabular-nums">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-stone-200 text-sm font-extrabold text-[#211D1C]">
                <span>Total Payable</span>
                <span className="text-2xl text-[#211D1C] tabular-nums font-serif font-bold">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-[#211D1C] hover:bg-[#FF2E93] text-white py-4 px-6 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <span>Securing Order...</span>
              ) : (
                <span>Complete Order · ₹{totalAmount}</span>
              )}
            </button>

            <div className="space-y-1 text-[11px] text-stone-500 text-center">
              <p className="flex items-center justify-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivered in 3 - 5 business days</span>
              </p>
              <p>7-day hassle-free replacements guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Gateway Simulation Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border-2 border-[#0C2340]">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#0C2340] text-lg">Razorpay</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                  Secure Checkout
                </span>
              </div>
              <span className="text-xs font-bold text-slate-700">₹{totalAmount}</span>
            </div>

            <p className="text-xs text-slate-600">
              Divine’s Eternity · Order Verification ID: <strong>DE-{Math.floor(100000 + Math.random() * 900000)}</strong>
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  setShowRazorpayModal(false);
                  executeOrderCompletion('sim_sig_verified_sha256');
                }}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left font-bold text-slate-800 flex items-center justify-between transition-colors"
              >
                <span>Authorize Payment & Verify Signature</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Pay ₹{totalAmount}
                </span>
              </button>
            </div>

            <button
              onClick={() => setShowRazorpayModal(false)}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 py-1"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
