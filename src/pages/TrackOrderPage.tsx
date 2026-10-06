import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';
import { Truck, Search, CheckCircle2, Clock, PackageCheck, MapPin, Sparkles } from 'lucide-react';
import { PhoneCaseMockup } from '../utils/productVisuals';
import { SEO } from '../components/common/SEO';

const TIMELINE_STEPS: OrderStatus[] = [
  'Placed',
  'Packed',
  'Shipped',
  'Out for delivery',
  'Delivered',
];

interface TrackOrderPageProps {
  initialOrderId?: string;
  onExploreProducts: () => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ initialOrderId = '', onExploreProducts }) => {
  const { orders } = useAuth();
  const [orderInput, setOrderInput] = useState(initialOrderId || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialOrderId) {
      return orders.find((o) => o.id.toLowerCase() === initialOrderId.toLowerCase()) || null;
    }
    return orders[0] || null;
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanId = orderInput.trim().toUpperCase();

    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === cleanId ||
        (phoneInput && o.customer.phone.includes(phoneInput.replace(/\D/g, '')))
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setErrorMessage(`No active shipment found for ID "${cleanId}". Check the ID or enter demo order "DE-882104".`);
    }
  };

  const currentStatus = searchedOrder?.status || 'Placed';
  const currentStepIndex = TIMELINE_STEPS.indexOf(currentStatus);

  const trackUrl = typeof window !== 'undefined' ? window.location.href : 'https://gadgetsdestiny.com/#track-order';

  return (
    <div className="py-10 sm:py-16">
      <SEO
        title={searchedOrder ? `Tracking Order #${searchedOrder.id} (${searchedOrder.status}) — Gadgets Destiny` : 'Track Your Order & Live Delivery Status — Gadgets Destiny'}
        description={searchedOrder ? `Order #${searchedOrder.id} status: ${searchedOrder.status}. Courier tracking: ${searchedOrder.trackingNumber}. Estimated delivery in 3-5 business days.` : "Check real-time live shipping updates, dispatch status, courier partner details, and expected delivery timeline for your Gadgets Destiny cute phone case order."}
        keywords="track order, shipment status, courier tracking, phone cover dispatch, gadgets destiny"
        url={trackUrl}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>Real-time Dispatch Tracking</span>
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#211D1C]">
            Track Your <span className="italic text-[#FF2E93]">Order</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Enter your order reference ID (format DE-XXXXXX) or registered phone number.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Order ID
              </label>
              <input
                type="text"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value.toUpperCase())}
                placeholder="e.g. DE-882104"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full bg-[#FF2E93] hover:bg-[#e02680] text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Track</span>
              </button>
            </div>
          </form>

          {errorMessage && (
            <p className="text-xs text-rose-600 font-medium mt-3">{errorMessage}</p>
          )}

          {/* Quick Demo Order button if orders exist */}
          <div className="mt-4 pt-3 border-t border-[#F3E8E2] flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span>Recent Demo Orders:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setOrderInput(o.id);
                  setSearchedOrder(o);
                }}
                className="font-mono text-[11px] bg-[#FFF0F3] text-[#FF2E93] border border-[#FFD2DF] font-bold px-2.5 py-1 rounded-lg hover:bg-[#ffe3eb] transition-colors cursor-pointer"
              >
                {o.id} ({o.status})
              </button>
            ))}
          </div>
        </div>

        {/* Live Timeline Display */}
        {searchedOrder && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-8 animate-in fade-in duration-300">
            
            {/* Top Order Overview Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F3E8E2]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-xl sm:text-2xl font-extrabold text-[#211D1C]">
                    {searchedOrder.id}
                  </h2>
                  <span className="bg-[#FFD94A] text-[#211D1C] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {searchedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Placed on {new Date(searchedOrder.createdAt).toLocaleDateString()} · Tracking: <strong className="font-mono text-stone-700">{searchedOrder.trackingNumber}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-400 block">Recipient</span>
                <span className="text-xs font-bold text-[#211D1C]">
                  {searchedOrder.customer.fullName}
                </span>
                <p className="text-[11px] text-stone-500">{searchedOrder.customer.city}, {searchedOrder.customer.state}</p>
              </div>
            </div>

            {/* 5-Stage Status Timeline Indicator */}
            <div className="py-4">
              <div className="relative flex items-center justify-between">
                {/* Horizontal Progress Bar */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 bg-stone-100 z-0">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF2E93] to-[#FFD94A] transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentStepIndex) / (TIMELINE_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Nodes */}
                {TIMELINE_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                          isCurrent
                            ? 'bg-[#FF2E93] text-white ring-4 ring-[#FFD2DF] scale-110 shadow-md'
                            : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white border-2 border-stone-200 text-stone-400'
                        }`}
                      >
                        {isCompleted && !isCurrent ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isCurrent ? (
                          <Truck className="w-5 h-5 animate-pulse" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-bold mt-2 text-center whitespace-nowrap ${
                          isCurrent
                            ? 'text-[#FF2E93]'
                            : isCompleted
                            ? 'text-[#211D1C]'
                            : 'text-stone-400'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checkpoint Logs */}
            <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#F3E8E2] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#211D1C] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF2E93]" />
                <span>Tracking Milestones</span>
              </h3>
              <div className="space-y-2.5">
                {searchedOrder.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF2E93] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-[#211D1C]">
                          {event.status} · {event.location}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipped Products in this order */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#211D1C] mb-3">
                Items in this package ({searchedOrder.items.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#F3E8E2]"
                  >
                    <div className="w-12 h-14 rounded-xl bg-[#FFF0F3] overflow-hidden flex items-center justify-center shrink-0 border border-[#FFD2DF]">
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
                    <div className="min-w-0 text-xs">
                      <p className="font-bold text-[#211D1C] truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-stone-500">{item.brand} {item.model}</p>
                      {item.customText && (
                        <p className="text-[9px] text-[#FF2E93] font-script">
                          Custom Name: {item.customText}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
