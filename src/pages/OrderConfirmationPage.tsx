import React from 'react';
import { Order } from '../types';
import { CheckCircle2, PackageCheck, Truck, Sparkles, ArrowRight, Home } from 'lucide-react';
import { PhoneCaseMockup } from '../utils/productVisuals';

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
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Celebration Header */}
        <div className="bg-white dark:bg-[#1E1A1D] p-8 sm:p-10 rounded-3xl border border-[#F3E8E2] dark:border-[#2D252A] shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#FFD94A] text-[#231F20] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F0508C]" />
            <span>Order Placed Successfully!</span>
          </div>

          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#231F20] dark:text-white">
            Thank you, <span className="italic text-[#F0508C]">{order.customer.fullName}</span>!
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Your handcrafted cases are now being prepared and gift-boxed with love.
          </p>

          {/* Order ID Badge */}
          <div className="bg-[#FFF8F4] dark:bg-slate-900/60 p-4 rounded-2xl border border-pink-200 dark:border-slate-800 inline-block space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
              Your Order Reference ID
            </span>
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#F0508C]">
              {order.id}
            </span>
            <p className="text-[10px] text-slate-400">
              Tracking code: <span className="font-mono text-slate-600 dark:text-slate-300">{order.trackingNumber}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onTrackOrder(order.id)}
              className="bg-[#231F20] hover:bg-[#F0508C] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery</span>
            </button>

            <button
              onClick={onContinueShopping}
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#F0508C] px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 shadow-xs"
            >
              <Home className="w-4 h-4" />
              <span>Back To Home</span>
            </button>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white dark:bg-[#1E1A1D] p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] dark:border-[#2D252A] shadow-xs space-y-6">
          <h2 className="font-serif-heading text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Items in this Shipment
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF8F4] dark:bg-slate-900/40 border border-pink-100 dark:border-slate-800"
              >
                <div className="w-14 h-16 rounded-xl bg-white dark:bg-black/30 overflow-hidden flex items-center justify-center shrink-0 border border-pink-100">
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
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {item.brand} {item.model} · {item.caseType}
                  </p>
                  {item.customText && (
                    <p className="text-[10px] text-[#F0508C] font-script text-xs font-semibold">
                      Engraved Name: "{item.customText}"
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    ₹{item.price * item.quantity}
                  </span>
                  <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address & Receipt Recap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                Delivering To:
              </h4>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">{order.customer.fullName}</p>
              <p className="text-slate-500">{order.customer.streetAddress}</p>
              <p className="text-slate-500">{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
              <p className="text-slate-500 font-mono mt-1">Phone: +91 {order.customer.phone}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                Payment Summary:
              </h4>
              <p className="text-slate-500">Method: <strong className="text-slate-800 dark:text-slate-200">{order.paymentMethod}</strong></p>
              <p className="text-slate-500">Payment Status: <span className="text-emerald-600 font-bold">{order.paymentStatus}</span></p>
              <p className="text-sm font-extrabold text-[#F0508C] pt-1">
                Total Paid: ₹{order.totalAmount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
