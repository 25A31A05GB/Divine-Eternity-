import React from 'react';
import { Order } from '../types';
import { CheckCircle2, PackageCheck, Truck, Sparkles, ArrowRight, Home, Gift } from 'lucide-react';
import { PhoneCaseMockup } from '../utils/productVisuals';
import { SEO } from '../components/common/SEO';

interface OrderConfirmationPageProps {
  order: Order;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onTrackOrder,
  onContinueShopping,
}) => {
  const confirmationUrl = typeof window !== 'undefined' ? window.location.href : 'https://divineseternity.com/#order-confirmation';

  return (
    <div className="py-12 sm:py-16">
      <SEO
        title={`Order Confirmed #${order.id} — Gadgets Destiny`}
        description={`Your Gadgets Destiny cute phone cover order #${order.id} for ₹${order.totalAmount} has been confirmed and is being prepared.`}
        url={confirmationUrl}
        noindex={true}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Celebration Header */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#F3E8E2] shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs border border-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#FFD94A] text-[#211D1C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2E93]" />
            <span>Order Placed Successfully!</span>
          </div>

          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#211D1C]">
            Thank you, <span className="font-serif italic text-[#FF2E93]">{order.customer.fullName}</span>!
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Your cute phone covers are now being carefully packed and prepared with love.
          </p>

          {/* Order ID Badge */}
          <div className="bg-[#FFFDF8] p-4 rounded-2xl border border-[#F3E8E2] inline-block space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block">
              Your Order Reference ID
            </span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#FF2E93]">
              {order.id}
            </span>
            <p className="text-[10px] text-stone-400">
              Tracking code: <span className="font-mono text-stone-700">{order.trackingNumber}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onTrackOrder(order.id)}
              className="bg-[#211D1C] hover:bg-[#FF2E93] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery</span>
            </button>

            <button
              onClick={onContinueShopping}
              className="bg-white text-[#211D1C] border border-stone-200 hover:border-[#FF2E93] hover:text-[#FF2E93] px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back To Home</span>
            </button>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-6">
          <h2 className="font-serif-heading text-lg font-bold text-[#211D1C] pb-3 border-b border-[#F3E8E2]">
            Items in this Shipment
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFDF8] border border-[#F3E8E2]"
              >
                <div className="w-14 h-16 rounded-xl bg-white overflow-hidden flex items-center justify-center shrink-0 border border-[#F3E8E2]">
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
                <div className="flex-1 min-w-0 text-xs">
                  <h4 className="font-bold text-[#211D1C] truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    {item.brand} {item.model} · {item.caseType}
                  </p>
                  {item.customText && (
                    <p className="text-[10px] text-[#FF2E93] font-script text-xs font-semibold">
                      Engraved Name: "{item.customText}"
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#211D1C] tabular-nums">
                    ₹{item.price * item.quantity}
                  </span>
                  <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gift Packaging & Note Card if selected */}
          {order.isGiftWrapped && (
            <div className="p-4 rounded-2xl bg-[#FFF0F3] border border-[#FFD2DF] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#FF2E93]">
                <Gift className="w-4 h-4 text-[#FF2E93]" />
                <span>Cute Gift Packaging & Card Included (+₹99)</span>
              </div>
              {order.giftNote && (
                <div className="text-stone-700 italic pl-6">
                  "{order.giftNote}"
                </div>
              )}
            </div>
          )}

          {/* Delivery Address & Receipt Recap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#F3E8E2] text-xs">
            <div>
              <h4 className="font-bold text-[#211D1C] uppercase tracking-wider mb-1">
                Delivering To:
              </h4>
              <p className="text-[#211D1C] font-semibold">{order.customer.fullName}</p>
              <p className="text-stone-600">{order.customer.streetAddress}</p>
              <p className="text-stone-600">{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
              <p className="text-stone-500 font-mono mt-1">Phone: +91 {order.customer.phone}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <h4 className="font-bold text-[#211D1C] uppercase tracking-wider mb-1">
                Payment Summary:
              </h4>
              <p className="text-stone-600">Method: <strong className="text-[#211D1C]">{order.paymentMethod}</strong></p>
              <p className="text-stone-600">Payment Status: <span className="text-emerald-600 font-bold">{order.paymentStatus}</span></p>
              <p className="text-sm font-extrabold text-[#FF2E93] pt-1">
                Total Paid: ₹{order.totalAmount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
