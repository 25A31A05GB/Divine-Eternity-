import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Truck, FileText, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface PolicyPageProps {
  initialTab?: 'refund' | 'privacy' | 'shipping' | 'terms';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'refund' }) => {
  const [activeTab, setActiveTab] = useState<'refund' | 'privacy' | 'shipping' | 'terms'>(initialTab);

  const titlesMap = {
    refund: '7-Day Easy Replacement & Refund Policy',
    shipping: 'Shipping & Delivery Timelines',
    privacy: 'Privacy Policy & Data Security',
    terms: 'Terms of Service',
  };

  const policyUrl = typeof window !== 'undefined' ? window.location.href : 'https://gadgetsdestiny.com/#policy';

  const descriptionsMap = {
    refund: 'Read Gadgets Destiny 7-day easy replacement policy. Hassle-free exchanges for phone model changes or cosmetic flaws with zero questions asked.',
    shipping: 'Learn about Gadgets Destiny express shipping timelines. Free express shipping on orders over ₹499 with 2-4 day metro delivery.',
    privacy: 'Read Gadgets Destiny privacy policy and 256-bit SSL data encryption protocols protecting customer checkout information.',
    terms: 'Read the official Gadgets Destiny terms of service, coupon rules, and customer purchase policies.',
  };

  return (
    <div className="py-10 sm:py-16">
      <SEO
        title={`${titlesMap[activeTab]} — Gadgets Destiny`}
        description={descriptionsMap[activeTab]}
        keywords="store policies, refund policy, replacement warranty, shipping terms, privacy guarantee, gadgets destiny"
        url={policyUrl}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>Customer Protection & Trust</span>
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#211D1C]">
            Store <span className="italic text-[#FF2E93]">Policies</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Clear, customer-first terms built on trust, transparency, and cute aesthetics.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-[#FF2E93] text-white shadow-md'
                : 'bg-white text-stone-700 hover:text-[#FF2E93] border border-[#F3E8E2]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>7-Day Replacement Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'shipping'
                ? 'bg-[#FF2E93] text-white shadow-md'
                : 'bg-white text-stone-700 hover:text-[#FF2E93] border border-[#F3E8E2]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping & Delivery</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#FF2E93] text-white shadow-md'
                : 'bg-white text-stone-700 hover:text-[#FF2E93] border border-[#F3E8E2]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#FF2E93] text-white shadow-md'
                : 'bg-white text-stone-700 hover:text-[#FF2E93] border border-[#F3E8E2]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#F3E8E2] shadow-xs text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h2 className="font-serif-heading text-xl font-bold text-[#211D1C]">
                7-Day Hassle-Free Replacement & Refund Policy
              </h2>
              <p>
                At <strong>Gadgets Destiny</strong>, your satisfaction is our highest priority. We want you to love your cute phone case and designer accessories just as much as we loved making them.
              </p>
              <h3 className="font-bold text-[#211D1C] text-sm">1. Model or Fit Issues</h3>
              <p>
                Did you accidentally select the wrong phone model or variant during checkout? No worries! Within 7 days of delivery, contact our support team on WhatsApp or email, and we will arrange a free exchange for the correct phone model.
              </p>
              <h3 className="font-bold text-[#211D1C] text-sm">2. Cosmetic or Manufacturing Flaws</h3>
              <p>
                In the rare event that your product arrives damaged in transit or with an engraving typo caused by our team, we will immediately send a brand-new replacement at zero cost without demanding tedious returns.
              </p>
              <h3 className="font-bold text-[#211D1C] text-sm">3. Refund Processing</h3>
              <p>
                If a replacement is unavailable, refunds are initiated to your original payment method within 24 hours of approval and take 3-5 business days to reflect in your bank account.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="font-serif-heading text-xl font-bold text-[#211D1C]">
                Shipping & Express Delivery Policy
              </h2>
              <p>
                We deliver to all serviceable PIN codes across India via premium courier partners (BlueDart, Delhivery, Xpressbees).
              </p>
              <h3 className="font-bold text-[#211D1C] text-sm">1. Dispatch Timelines</h3>
              <p>
                - Standard cases: Dispatched within 24 hours.<br />
                - Custom laser-engraved cases: Handcrafted & engraved within 24-48 hours.
              </p>
              <h3 className="font-bold text-[#211D1C] text-sm">2. Shipping Charges</h3>
              <p>
                - Orders above ₹499: <strong>FREE Express Shipping</strong>.<br />
                - Orders under ₹499: Flat ₹49 standard courier fee.
              </p>
              <h3 className="font-bold text-[#211D1C] text-sm">3. Estimated Delivery Times</h3>
              <p>
                - Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata): 2 to 4 business days.<br />
                - Rest of India: 3 to 6 business days.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="font-serif-heading text-xl font-bold text-[#211D1C]">
                Privacy & Data Security Policy
              </h2>
              <p>
                Gadgets Destiny respects your privacy. We only collect details necessary to process your orders, ship your packages, and provide order tracking updates.
              </p>
              <h3 className="font-bold text-[#211D1C] text-sm">1. Information We Collect</h3>
              <p>
                Your name, phone number, shipping address, and email are strictly used for package delivery notifications and invoicing. We never sell, rent, or trade your personal information.
              </p>
              <h3 className="font-bold text-[#211D1C] text-sm">2. Payment Security</h3>
              <p>
                We do not store your credit card numbers or UPI PINs. All payment transactions are encrypted and processed through RBI-compliant payment gateways using industry-standard 256-bit SSL protocols.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="font-serif-heading text-xl font-bold text-[#211D1C]">
                Terms of Service
              </h2>
              <p>
                By placing an order on Gadgets Destiny, you agree to our standard terms of service. All phone cases, artwork, designs, and website content are intellectual property of Gadgets Destiny.
              </p>
              <h3 className="font-bold text-[#211D1C] text-sm">1. Promotional Codes</h3>
              <p>
                Coupon codes such as BUY3PAY2 and GADGET100 cannot be combined in duplicate beyond the maximum single offer rule calculated by our offer engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
