import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Truck, FileText, Sparkles, MessageCircle, UserCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { BUSINESS_CONFIG } from '../config/business';

interface PolicyPageProps {
  initialTab?: 'refund' | 'privacy' | 'shipping' | 'terms' | 'grievance';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'refund' }) => {
  const [activeTab, setActiveTab] = useState<'refund' | 'privacy' | 'shipping' | 'terms' | 'grievance'>(initialTab);

  const titlesMap = {
    refund: `7-Day Replacement Policy — ${BUSINESS_CONFIG.brandName}`,
    shipping: `Shipping & Delivery Policy — ${BUSINESS_CONFIG.brandName}`,
    privacy: `Privacy Policy — ${BUSINESS_CONFIG.brandName}`,
    terms: `Terms of Service — ${BUSINESS_CONFIG.brandName}`,
    grievance: `Grievance Redressal Officer — ${BUSINESS_CONFIG.brandName}`,
  };

  const pathMap = {
    refund: '/refund-policy',
    shipping: '/shipping-policy',
    privacy: '/privacy-policy',
    terms: '/terms',
    grievance: '/grievance-officer',
  };

  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${pathMap[activeTab] || '/refund-policy'}`
    : `${BUSINESS_CONFIG.domain}${pathMap[activeTab] || '/refund-policy'}`;

  const descriptionsMap = {
    refund: `At ${BUSINESS_CONFIG.brandName}, every order is carefully packed to ensure it reaches you safely. Learn about our 7-Day Replacement Policy and eligibility criteria. [REVIEW WITH LAWYER]`,
    shipping: `${BUSINESS_CONFIG.brandName} 5–7 day dispatch and insured delivery timelines for prepaid personalized gifts and hampers. [REVIEW WITH LAWYER]`,
    privacy: `${BUSINESS_CONFIG.brandName} official privacy policy outlining customer data protection under Digital Personal Data Protection Act. [REVIEW WITH LAWYER]`,
    terms: `Official Terms of Service for ${BUSINESS_CONFIG.brandName} regarding prepaid orders, handmade variations, personalization and delivery. [REVIEW WITH LAWYER]`,
    grievance: `Designated Grievance Redressal Officer under Information Technology Act & Consumer Protection E-Commerce Rules. [REVIEW WITH LAWYER]`,
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FFFDF8] min-h-screen">
      <SEO
        title={titlesMap[activeTab]}
        description={descriptionsMap[activeTab]}
        keywords="divines eternity policies, 7-day replacement policy, shipping policy, privacy policy, terms of service, grievance officer"
        url={currentUrl}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>Divine’s Eternity Legal & Patron Protection</span>
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#211D1C]">
            Customer <span className="italic text-[#FF2E93]">Protection & Policies</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {BUSINESS_CONFIG.legalName} • GSTIN: {BUSINESS_CONFIG.gstin}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#FF2E93] text-white shadow-md'
                : 'bg-white text-stone-700 hover:text-[#FF2E93] border border-[#F3E8E2]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('grievance')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'grievance'
                ? 'bg-[#FF2E93] text-white shadow-md'
                : 'bg-white text-stone-700 hover:text-[#FF2E93] border border-[#F3E8E2]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Grievance Officer</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#F3E8E2] shadow-xs text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
          {activeTab === 'refund' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                  Refund & 7-Day Replacement Policy
                </h2>
                <span className="text-[10px] text-stone-400 font-mono">[REVIEW WITH LAWYER]</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                At <strong>{BUSINESS_CONFIG.brandName}</strong> ({BUSINESS_CONFIG.legalName}), we take utmost pride in crafting each bespoke order with supreme attention to detail. In the rare circumstance that you receive a damaged, defective, incorrect, or incomplete item, you are entitled to a replacement within <strong>{BUSINESS_CONFIG.returnWindowDays} days of verified delivery</strong>.
              </p>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ Replacement Eligibility Criteria [REVIEW WITH LAWYER]
                </h3>
                <ul className="space-y-2 list-disc list-inside text-stone-600">
                  <li>Replacement requests must be initiated within {BUSINESS_CONFIG.returnWindowDays} calendar days of parcel delivery confirmation.</li>
                  <li>The keepsake must remain unused, unworn, and preserved in its original luxury atelier packaging with accompanying certificates.</li>
                  <li>Clear unboxing photos or uncut video footage may be requested to facilitate insured courier claims.</li>
                  <li>Replacement is fulfilled with identical specifications or an equivalent piece subject to raw material availability.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ Non-Eligible Cases
                </h3>
                <ul className="space-y-2 list-disc list-inside text-stone-600">
                  <li>Damage incurred after delivery due to customer mishandling, chemical exposure, or improper storage.</li>
                  <li>Used, cleaned, or altered personalized items.</li>
                  <li>Subtle natural variances in handmade finishes, calligraphy strokes, or preserved botanical textures characteristic of authentic artisan work.</li>
                </ul>
              </div>

              <div className="bg-[#FFF9EB] border border-[#F5E6CE] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
                <div>
                  <span className="font-bold text-[#211D1C] block text-xs">Need Replacement Assistance?</span>
                  <p className="text-[11px] text-stone-600">
                    Reach out directly to our dedicated customer support team.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsappNumber.replace(/\D/g, '')}?text=Hello%20Divine%E2%80%99s%20Eternity!%20I%20need%20assistance%20with%20a%20replacement.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp {BUSINESS_CONFIG.whatsappDisplay}</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                  Shipping & Delivery Policy
                </h2>
                <span className="text-[10px] text-stone-400 font-mono">[REVIEW WITH LAWYER]</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Every bespoke creation at <strong>{BUSINESS_CONFIG.brandName}</strong> follows a <strong>5–7 business days dispatch & delivery timeline</strong>. Handcrafted jewellery, engraved wooden trunks, and preserved floral arrangements undergo rigorous quality inspections before packaging.
              </p>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ Courier & Tracking Logistics
                </h3>
                <ul className="space-y-2 list-disc list-inside text-stone-600">
                  <li>Orders are handed over to premium insured logistics partners (BlueDart, Delhivery, DTDC).</li>
                  <li>Real-time AWB tracking numbers are assigned upon courier pickup and viewable on our website’s <strong>“Track Order”</strong> page.</li>
                  <li>Complimentary insured shipping applies automatically to all orders with cart value of ₹{BUSINESS_CONFIG.freeShippingThreshold} or above.</li>
                  <li>Standard shipping of ₹70 applies on orders below ₹{BUSINESS_CONFIG.freeShippingThreshold}.</li>
                </ul>
              </div>

              <div className="bg-[#FFF0F5] border border-pink-200 p-4 rounded-2xl space-y-1">
                <h3 className="font-bold text-[#FF2E93] text-xs uppercase tracking-wider">
                  Payment Modes & COD Policy
                </h3>
                <p className="text-stone-700 text-xs sm:text-sm">
                  We accept secure online payments via UPI, Credit/Debit Cards, Net Banking, and verified Cash on Delivery (COD) with telephonic verification.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                  Privacy & Data Protection Policy
                </h2>
                <span className="text-[10px] text-stone-400 font-mono">[REVIEW WITH LAWYER]</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {BUSINESS_CONFIG.legalName} is committed to safeguarding your privacy in compliance with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.
              </p>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ Information We Collect [REVIEW WITH LAWYER]
                </h3>
                <ul className="space-y-1 list-disc list-inside text-stone-600">
                  <li>Identity data: Full name, delivery address, registered email address, phone number.</li>
                  <li>Customization assets: Uploaded portrait photos, laser engraving text, handwritten messages.</li>
                  <li>Transaction records: Order identifiers, item totals, and payment status (card/banking data is handled entirely by PCI-DSS certified gateway Razorpay and never stored on our servers).</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ Data Retention & Sharing [REVIEW WITH LAWYER]
                </h3>
                <p className="text-stone-600">
                  We <strong>never sell, lease, or monetize your personal information</strong>. Data is shared exclusively with necessary service providers: logistics delivery partners for parcel transit and secure transactional messaging gateways. Custom photos uploaded for lockets or caricatures are encrypted and retained solely for production and order fulfillment.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                  Terms of Service & Usage
                </h2>
                <span className="text-[10px] text-stone-400 font-mono">[REVIEW WITH LAWYER]</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                By browsing, accessing, or placing an order on {BUSINESS_CONFIG.domain}, you enter into a legally binding contract governed by the laws of India and agree to the following terms.
              </p>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  1. Product Descriptions & Artisan Craftsmanship [REVIEW WITH LAWYER]
                </h3>
                <p className="text-stone-600">
                  Because our creations are handcrafted, individual pieces may feature slight nuances in gold plating sheen, gemstone hues, or wooden grain textures that attest to genuine artisan work rather than machine mass-production.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  2. Intellectual Property [REVIEW WITH LAWYER]
                </h3>
                <p className="text-stone-600">
                  All trademarks, branding marks, photography, videos, and UI elements on this platform belong exclusively to {BUSINESS_CONFIG.legalName}. Any unauthorized reproduction is strictly prohibited.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  3. Jurisdiction & Dispute Resolution [REVIEW WITH LAWYER]
                </h3>
                <p className="text-stone-600">
                  Any legal claims or disputes arising out of the use of this website or orders fulfilled shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'grievance' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                  Statutory Grievance Redressal Officer
                </h2>
                <span className="text-[10px] text-stone-400 font-mono">[REVIEW WITH LAWYER]</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, the contact details of the designated Grievance Officer are set forth below:
              </p>

              <div className="bg-[#FFFDF8] border border-[#F3E8E2] rounded-2xl p-5 sm:p-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 block uppercase font-bold text-[10px]">Officer Name</span>
                    <span className="font-bold text-stone-800 text-sm">{BUSINESS_CONFIG.grievanceOfficer.name}</span>
                    <span className="text-stone-500 block text-[11px]">{BUSINESS_CONFIG.grievanceOfficer.designation}</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block uppercase font-bold text-[10px]">Email Redressal</span>
                    <a href={`mailto:${BUSINESS_CONFIG.grievanceOfficer.email}`} className="font-bold text-[#FF2E93] hover:underline">
                      {BUSINESS_CONFIG.grievanceOfficer.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-stone-400 block uppercase font-bold text-[10px]">Direct Phone</span>
                    <span className="font-bold text-stone-800">{BUSINESS_CONFIG.grievanceOfficer.phone}</span>
                    <span className="text-stone-500 block text-[11px]">{BUSINESS_CONFIG.grievanceOfficer.workingHours}</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block uppercase font-bold text-[10px]">Postal Address</span>
                    <span className="text-stone-700 text-xs">{BUSINESS_CONFIG.grievanceOfficer.address}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 text-xs text-stone-600">
                  <strong>Statutory Resolution Timeline:</strong> {BUSINESS_CONFIG.grievanceOfficer.redressalTimeline}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
