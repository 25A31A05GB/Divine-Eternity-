import React, { useState } from 'react';
import { Truck, Search, CheckCircle2, Clock, PackageCheck, MapPin, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { BRAND_CONFIG } from '../config/brand';

const TIMELINE_STEPS = [
  'Placed',
  'In Production',
  'Quality Check',
  'Packed',
  'Shipped',
  'Out for delivery',
  'Delivered',
];

interface TrackedOrderResult {
  id: string;
  fulfillmentStatus?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  courierPartner?: string;
  createdAt?: string;
  timeline?: Array<{
    status: string;
    location?: string;
    description: string;
    timestamp?: string;
    createdAt?: string;
  }>;
}

interface TrackOrderPageProps {
  initialOrderId?: string;
  onExploreProducts: () => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ initialOrderId = '', onExploreProducts }) => {
  const [orderInput, setOrderInput] = useState(initialOrderId || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<TrackedOrderResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanId = orderInput.trim().toUpperCase();
    const cleanPhone = phoneInput.trim().replace(/\D/g, '');

    if (!cleanId) {
      setErrorMessage('Please enter your Order Reference ID (e.g. DE-839201)');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter your registered 10-digit mobile phone number for secure lookup.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: cleanId,
          phone: cleanPhone,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success && json.order) {
        setSearchedOrder(json.order);
      } else {
        setSearchedOrder(null);
        setErrorMessage(json.error || `No verified order found for ID "${cleanId}" matching phone ${cleanPhone}.`);
      }
    } catch (err) {
      setErrorMessage('Unable to reach order tracking servers. Please try again shortly.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatus = searchedOrder?.fulfillmentStatus || 'Placed';
  const currentStepIndex = TIMELINE_STEPS.indexOf(currentStatus);

  const trackUrl = typeof window !== 'undefined' ? window.location.href : `${BRAND_CONFIG.domain}/#track-order`;

  return (
    <div className="py-10 sm:py-16 bg-[#FFFDF8]">
      <SEO
        title={searchedOrder ? `Tracking Order #${searchedOrder.id} — Divine’s Eternity` : 'Track Your Order — Divine’s Eternity'}
        description={searchedOrder ? `Order #${searchedOrder.id} status: ${searchedOrder.fulfillmentStatus}. Tracking ID: ${searchedOrder.trackingNumber || searchedOrder.id}.` : "Track your Divine’s Eternity order status. Enter your Order ID and phone number to view real-time live shipping updates."}
        keywords="track order, shipment status, courier tracking, divines eternity dispatch, tracking id"
        url={trackUrl}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>Real-time Atelier Dispatch Tracking</span>
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#211D1C]">
            Track Your <span className="italic text-[#FF2E93]">Order</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            For security, please enter both your Order Reference ID and your 10-digit registered phone number.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-sm max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#211D1C] block">
                  Order ID (e.g. DE-839201) *
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value.toUpperCase())}
                    placeholder="DE-XXXXXX"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] text-[#211D1C] rounded-xl pl-10 pr-3.5 py-2.5 text-xs outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#211D1C] block">
                  Registered 10-Digit Mobile *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] text-[#211D1C] rounded-xl px-3.5 py-2.5 text-xs outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching Order Records...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Live Status</span>
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Display Tracked Order Card */}
        {searchedOrder && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF2E93]">
                  SHIPMENT VERIFIED
                </span>
                <h3 className="font-serif-heading font-bold text-xl text-[#211D1C] mt-0.5">
                  Order Reference: {searchedOrder.id}
                </h3>
                <p className="text-xs text-stone-500">
                  Courier Partner: {searchedOrder.courierPartner || 'BlueDart Express'} · AWB: {searchedOrder.trackingNumber || 'Pending Dispatch'}
                </p>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {searchedOrder.fulfillmentStatus || 'Placed'}
                </span>
                <p className="text-[11px] text-stone-500 mt-1 font-mono">
                  Payment: {searchedOrder.paymentStatus || 'Paid'}
                </p>
              </div>
            </div>

            {/* Visual Step Progress */}
            <div className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                {TIMELINE_STEPS.slice(0, 5).map((step, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;
                  return (
                    <div
                      key={step}
                      className={`p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'border-[#FF2E93] bg-[#FFF0F5] font-bold text-[#FF2E93]'
                          : isDone
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-stone-100 bg-stone-50 text-stone-400'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">Step {idx + 1}</div>
                      <div>{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event Timeline */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold text-[#211D1C] uppercase tracking-wider">
                Detailed Timeline
              </h4>
              <div className="space-y-3">
                {(searchedOrder.timeline && searchedOrder.timeline.length > 0) ? (
                  searchedOrder.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#FF2E93] mt-1.5 shrink-0" />
                      <div>
                        <div className="font-bold text-[#211D1C]">{event.status}</div>
                        <div className="text-stone-600">{event.description}</div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                          {event.location ? `${event.location} · ` : ''}{event.timestamp || event.createdAt || ''}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-500">
                    Order received in atelier and currently queued for personalization & craftsmanship.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
