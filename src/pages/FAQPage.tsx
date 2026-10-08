import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { ChevronDown, HelpCircle, Truck, Sparkles, RefreshCw, CreditCard, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: 'Shipping & Delivery',
    icon: <Truck className="w-5 h-5 text-[#FF2E93]" />,
    items: [
      {
        id: 's1',
        question: 'How long does delivery take across India?',
        answer: 'Standard shipping takes 3-5 business days across major metro cities, and 4-7 days for tier-2/3 pincodes. For urgent orders, express shipping is available at checkout.',
      },
      {
        id: 's2',
        question: 'Do you provide live tracking for orders?',
        answer: 'Yes! Once your order is dispatched, you receive a courier tracking AWB link via email and WhatsApp. You can also enter your Order ID on our Track Order page at any time.',
      },
      {
        id: 's3',
        question: 'Is cash on delivery (COD) supported?',
        answer: 'Yes, Cash on Delivery is available for order values up to ₹3,000. For custom personalized items, a nominal pre-production confirmation fee or online payment may be required.',
      },
    ],
  },
  {
    title: 'Personalisation & Design Proofs',
    icon: <Sparkles className="w-5 h-5 text-[#FF2E93]" />,
    items: [
      {
        id: 'p1',
        question: 'Will I see a proof before my personalized item is handcrafted?',
        answer: 'Absolutely. For items requiring custom photos or engraved artwork, our studio artists send a digital proof link via WhatsApp and email. We start handcrafting only after your explicit approval!',
      },
      {
        id: 'p2',
        question: 'What image quality works best for custom photo keepsakes?',
        answer: 'High-resolution, well-lit photos work best. Avoid heavily compressed or blurry screenshots. Our studio team automatically adjusts brightness and contrast for optimal engraving or printing.',
      },
    ],
  },
  {
    title: 'Returns & Cancellations',
    icon: <RefreshCw className="w-5 h-5 text-[#FF2E93]" />,
    items: [
      {
        id: 'r1',
        question: 'What is your return policy for personalized gifts?',
        answer: 'Because personalized gifts are uniquely handcrafted for you, returns are accepted within 7 days of delivery if the item arrives damaged, defective, or incorrect. Non-customized items can be returned or exchanged within 7 days.',
      },
      {
        id: 'r2',
        question: 'How can I cancel or modify my order?',
        answer: 'Orders in "Placed" or "Packed" status can be cancelled directly from your My Account page or by contacting support on WhatsApp before dispatch.',
      },
    ],
  },
  {
    title: 'Payments & GST Invoices',
    icon: <CreditCard className="w-5 h-5 text-[#FF2E93]" />,
    items: [
      {
        id: 'pm1',
        question: 'Which payment methods do you accept?',
        answer: 'We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, Razorpay Wallet, and Cash on Delivery (COD).',
      },
      {
        id: 'pm2',
        question: 'Can I get a tax invoice with GSTIN for business purchase?',
        answer: `Yes! Every order generates a GST-compliant tax invoice. All prices displayed on Divine’s Eternity are GST-inclusive (${BUSINESS_CONFIG.legalName}, GSTIN: ${BUSINESS_CONFIG.gstin}).`,
      },
    ],
  },
];

export const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ s1: true, p1: true });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Construct FAQPage JSON-LD
  const allFaqs = FAQ_DATA.flatMap((cat) => cat.items);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hi Divine’s Eternity! I have a question regarding your handcrafted gifts.'
  )}`;

  return (
    <div className="py-8 sm:py-16 bg-[#FFFDF8] min-h-screen text-[#211D1C]">
      <SEO
        title="Frequently Asked Questions (FAQ) — Divine’s Eternity"
        description="Find answers to common questions about shipping, personalization proofs, return policies, payments, and GST tax invoices."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#FF2E93] text-[10px] font-extrabold uppercase tracking-widest border border-[#F3E8E2]">
            <HelpCircle className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>Support & Guidance</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211D1C]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Everything you need to know about ordering, design proofs, shipping, and returns at Divine’s Eternity.
          </p>
        </div>

        {/* Categories & Accordions */}
        <div className="space-y-8">
          {FAQ_DATA.map((category) => (
            <div key={category.title} className="space-y-3">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#211D1C]">
                {category.icon}
                <span>{category.title}</span>
              </div>

              <div className="space-y-3">
                {category.items.map((item) => {
                  const isOpen = !!openItems[item.id];
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#F3E8E2] overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#211D1C] cursor-pointer hover:bg-[#FFFDF8]"
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#FF2E93] shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-stone-600 border-t border-[#FAF7F2] pt-3 leading-relaxed">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
          <MessageCircle className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-emerald-950">Still have a question?</h3>
            <p className="text-xs text-emerald-800 max-w-sm mx-auto">
              Our studio concierge team is available on WhatsApp from 9 AM to 8 PM IST every day.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Concierge on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
