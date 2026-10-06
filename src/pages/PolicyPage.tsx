import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Truck, FileText, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface PolicyPageProps {
  initialTab?: 'refund' | 'privacy' | 'shipping' | 'terms';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'refund' }) => {
  const [activeTab, setActiveTab] = useState<'refund' | 'privacy' | 'shipping' | 'terms'>(initialTab);

  const titlesMap = {
    refund: '7-Day Replacement Policy — Divine’s Eternity',
    shipping: 'Shipping & Dispatch Timelines — Divine’s Eternity',
    privacy: 'Privacy Policy — Divine’s Eternity',
    terms: 'Terms of Service — Divine’s Eternity',
  };

  const policyUrl = typeof window !== 'undefined' ? window.location.href : 'https://divineseternity.com/#policy';

  const descriptionsMap = {
    refund: 'At Divine’s Eternity, every order is carefully packed to ensure it reaches you safely. Learn about our 7-Day Replacement Policy and eligibility criteria.',
    shipping: 'Divine’s Eternity 5–7 day dispatch and delivery timelines for prepaid gifts, hampers, bouquets, and custom keepsakes.',
    privacy: 'Divine’s Eternity official privacy policy outlining how customer information is protected and processed.',
    terms: 'Official Terms of Service for Divine’s Eternity regarding prepaid payments, handmade products, personalization, and shipping.',
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FFFDF8] min-h-screen">
      <SEO
        title={titlesMap[activeTab]}
        description={descriptionsMap[activeTab]}
        keywords="divines eternity policies, 7-day replacement policy, shipping timelines, privacy policy, terms of service, track order"
        url={policyUrl}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>Divine’s Eternity Policies</span>
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#211D1C]">
            Customer <span className="italic text-[#FF2E93]">Protection & Terms</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Thoughtful gifts. Beautiful moments. Made with love.
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
            <span>Shipping & Timelines</span>
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
        </div>

        {/* Content Body */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#F3E8E2] shadow-xs text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
          {activeTab === 'refund' && (
            <div className="space-y-5">
              <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                7-Day Replacement Policy
              </h2>
              <p className="text-stone-600 leading-relaxed">
                At <strong>Divine’s Eternity</strong>, we carefully pack every order to ensure it reaches you safely. If you receive a damaged, defective, incorrect, or incomplete product, you may request a replacement within <strong>7 days of delivery</strong>.
              </p>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ Eligibility Criteria
                </h3>
                <ul className="space-y-2 list-disc list-inside text-stone-600">
                  <li>Replacement requests must be raised within 7 days of receiving the order.</li>
                  <li>The product must be unused and returned in its original condition and packaging.</li>
                  <li>Clear photos/videos of the received product may be requested for verification.</li>
                  <li>Replacement is subject to product availability.</li>
                  <li>If the same product is unavailable, an appropriate alternative or suitable resolution may be offered.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ Non-Eligible Cases
                </h3>
                <p className="text-stone-600">Replacement may not be accepted for:</p>
                <ul className="space-y-2 list-disc list-inside text-stone-600">
                  <li>Products damaged after delivery due to customer handling.</li>
                  <li>Used or altered products.</li>
                  <li>Products without the original packaging where packaging is required for verification.</li>
                  <li>Minor variations in colour, texture, handmade finishing, or appearance that are normal for handmade/custom products.</li>
                </ul>
              </div>

              <div className="bg-[#FFF9EB] border border-[#F5E6CE] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
                <div>
                  <span className="font-bold text-[#211D1C] block text-xs">Need Replacement Assistance?</span>
                  <p className="text-[11px] text-stone-600">
                    Contact our support team through WhatsApp as soon as possible after delivery.
                  </p>
                </div>
                <a
                  href="https://wa.me/919353652043?text=Hello%20Divine%E2%80%99s%20Eternity!%20I%20need%20assistance%20with%20a%20replacement."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp 9353652043</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-5">
              <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                Shipping & Dispatch Timelines
              </h2>
              <p className="text-stone-600 leading-relaxed">
                Divine’s Eternity follows a <strong>5–7 day dispatch/delivery timeline</strong> for all orders. We recommend placing your order at least 5–7 days before the date you need it, especially for gifts, hampers, bouquets, and special occasions.
              </p>

              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ Important Information
                </h3>
                <ul className="space-y-2 list-disc list-inside text-stone-600">
                  <li>Orders are processed after payment confirmation.</li>
                  <li>All orders require 5–7 days for dispatch/delivery.</li>
                  <li>Once your order has been dispatched, a Tracking ID will be shared with you.</li>
                  <li>You can use your Tracking ID in the <strong>“Track Order”</strong> section of our website to check your order status yourself.</li>
                  <li>Divine’s Eternity is not responsible for delays caused by courier partners, weather conditions, natural events, incorrect address details, or circumstances beyond our control.</li>
                </ul>
              </div>

              <div className="bg-[#FFF0F5] border border-pink-200 p-4 rounded-2xl space-y-1">
                <h3 className="font-bold text-[#FF2E93] text-xs uppercase tracking-wider">
                  Payment Mode
                </h3>
                <p className="text-stone-700 text-xs sm:text-sm">
                  All orders are <strong>prepaid</strong>. We currently do not offer Cash on Delivery (COD).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                Privacy Policy
              </h2>
              <p className="text-stone-600 leading-relaxed">
                At Divine’s Eternity, we respect your privacy and are committed to protecting the information you share with us.
              </p>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ Information We Collect
                </h3>
                <p className="text-stone-600">
                  When you place an order or contact us, we may collect information such as:
                </p>
                <ul className="space-y-1 list-disc list-inside text-stone-600">
                  <li>Name</li>
                  <li>Phone number</li>
                  <li>Email address</li>
                  <li>Delivery address</li>
                  <li>Order details</li>
                  <li>Payment-related information required to process your order</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ How We Use Your Information
                </h3>
                <ul className="space-y-1 list-disc list-inside text-stone-600">
                  <li>Process and deliver your orders</li>
                  <li>Provide customer support</li>
                  <li>Send order and delivery updates</li>
                  <li>Handle replacement or service requests</li>
                  <li>Process personalization or customization requests</li>
                  <li>Improve our products and customer experience</li>
                  <li>Communicate important information regarding your orders</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  ✦ Information Protection & Third Parties
                </h3>
                <p className="text-stone-600">
                  We take reasonable steps to protect your personal information and <strong>do not sell your personal information to third parties</strong>. Payment information is processed through relevant payment service providers according to their security practices. We may work with trusted third-party services such as delivery partners to complete your order.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-5">
              <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                Terms of Service
              </h2>
              <p className="text-stone-600 leading-relaxed">
                By accessing or purchasing from the Divine’s Eternity website, you agree to the following terms.
              </p>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  1. Orders & Payments
                </h3>
                <ul className="space-y-1 list-disc list-inside text-stone-600">
                  <li>All orders are subject to product availability.</li>
                  <li>Orders are confirmed only after successful payment.</li>
                  <li>All orders are prepaid. COD is currently unavailable.</li>
                  <li>Prices and offers may change without prior notice.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  2. Handmade & Custom Products
                </h3>
                <p className="text-stone-600">
                  Many Divine’s Eternity products may be handmade, customized, or individually assembled. Therefore, slight differences in colour, finishing, arrangement, or appearance may occur. Product images represent the item and may have minor variations depending on lighting, display settings, and handmade finishing.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  3. Personalization & Customization
                </h3>
                <p className="text-stone-600">
                  If you would like any changes to your order (such as a specific colour, design, or other preference), you can mention your requirements in the personalization/customization column while placing your order. Our team will check availability and confirm the request with you through WhatsApp before proceeding. Personalization requests are subject to availability.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  4. Shipping, Cancellations & Replacements
                </h3>
                <p className="text-stone-600">
                  All orders require 5–7 days for dispatch/delivery. Customers are advised to place orders at least 5–7 days in advance. Tracking IDs monitor delivery status in “Track Order”. Once processing has begun, cancellation may not be possible. Replacements are governed by our 7-Day Replacement Policy.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#211D1C] text-sm uppercase tracking-wider text-[#FF2E93]">
                  5. Intellectual Property
                </h3>
                <p className="text-stone-600">
                  All website content, including the brand name, photographs, graphics, designs, written content, logos, and other creative material belonging to Divine’s Eternity may not be copied, reproduced, or used commercially without permission.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
