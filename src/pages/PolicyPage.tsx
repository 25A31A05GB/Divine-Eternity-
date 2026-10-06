import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Truck, FileText, Sparkles } from 'lucide-react';

interface PolicyPageProps {
  initialTab?: 'refund' | 'privacy' | 'shipping' | 'terms';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'refund' }) => {
  const [activeTab, setActiveTab] = useState<'refund' | 'privacy' | 'shipping' | 'terms'>(initialTab);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F0508C] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>Customer Protection & Trust</span>
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#231F20] dark:text-[#FDF9F7]">
            Store <span className="italic text-[#F0508C]">Policies</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Clear, customer-first terms built on trust, transparency, and happiness.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'refund'
                ? 'bg-[#F0508C] text-white shadow-md'
                : 'bg-white dark:bg-[#1E1A1D] text-slate-700 dark:text-slate-300 border border-[#F3E8E2] dark:border-slate-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>7-Day Replacement Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'shipping'
                ? 'bg-[#F0508C] text-white shadow-md'
                : 'bg-white dark:bg-[#1E1A1D] text-slate-700 dark:text-slate-300 border border-[#F3E8E2] dark:border-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping & Delivery</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'privacy'
                ? 'bg-[#F0508C] text-white shadow-md'
                : 'bg-white dark:bg-[#1E1A1D] text-slate-700 dark:text-slate-300 border border-[#F3E8E2] dark:border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'terms'
                ? 'bg-[#F0508C] text-white shadow-md'
                : 'bg-white dark:bg-[#1E1A1D] text-slate-700 dark:text-slate-300 border border-[#F3E8E2] dark:border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-[#1E1A1D] p-6 sm:p-10 rounded-3xl border border-[#F3E8E2] dark:border-[#2D252A] shadow-xs text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h2 className="font-serif-heading text-xl font-bold text-slate-900 dark:text-white">
                7-Day Hassle-Free Replacement & Refund Policy
              </h2>
              <p>
                At <strong>Divine's Eternity</strong>, your satisfaction is our highest priority. We want you to love your phone case and custom jewelry wristlet just as much as we loved making it.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Model or Fit Issues</h3>
              <p>
                Did you accidentally select the wrong phone model or variant during checkout? No worries! Within 7 days of delivery, contact our support team on WhatsApp or email, and we will arrange a free exchange for the correct phone model.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Cosmetic or Manufacturing Flaws</h3>
              <p>
                In the rare event that your product arrives damaged in transit or with an engraving typo caused by our team, we will immediately send a brand-new replacement at zero cost without demanding tedious returns.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Refund Processing</h3>
              <p>
                If a replacement is unavailable, refunds are initiated to your original payment method within 24 hours of approval and take 3-5 business days to reflect in your bank account.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="font-serif-heading text-xl font-bold text-slate-900 dark:text-white">
                Shipping & Express Delivery Policy
              </h2>
              <p>
                We deliver to all serviceable PIN codes across India via premium courier partners (BlueDart, Delhivery, Xpressbees).
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Dispatch Timelines</h3>
              <p>
                - Standard cases: Dispatched within 24 hours.<br />
                - Custom laser-engraved cases: Handcrafted & engraved within 24-48 hours.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Shipping Charges</h3>
              <p>
                - Orders above ₹499: <strong>FREE Express Shipping</strong>.<br />
                - Orders under ₹499: Flat ₹49 standard courier fee.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Estimated Delivery Times</h3>
              <p>
                - Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata): 2 to 4 business days.<br />
                - Rest of India: 3 to 6 business days.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="font-serif-heading text-xl font-bold text-slate-900 dark:text-white">
                Privacy & Data Security Policy
              </h2>
              <p>
                Divine's Eternity respects your privacy. We only collect details necessary to process your orders, ship your packages, and provide order tracking updates.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Information We Collect</h3>
              <p>
                Your name, phone number, shipping address, and email are strictly used for package delivery notifications and invoicing. We never sell, rent, or trade your personal information.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Payment Security</h3>
              <p>
                We do not store your credit card numbers or UPI PINs. All payment transactions are encrypted and processed through RBI-compliant payment gateways using industry-standard 256-bit SSL protocols.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="font-serif-heading text-xl font-bold text-slate-900 dark:text-white">
                Terms of Service
              </h2>
              <p>
                By placing an order on Divine's Eternity, you agree to our standard terms of service. All phone cases, artwork, pearl wristlets, and website content are copyrighted intellectual property of Divine's Eternity.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Promotional Codes</h3>
              <p>
                Coupon codes such as FLAT849, BUY3PAY2, and LOVE100 cannot be combined in duplicate beyond the maximum single offer rule calculated by our offer engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
