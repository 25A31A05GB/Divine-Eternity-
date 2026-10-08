import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, Check, ChevronDown, ChevronUp, Sparkles, Clock, HelpCircle, Package, RefreshCw, Heart } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order Enquiry');
  const [message, setMessage] = useState('');
  const [hasAgreedConsent, setHasAgreedConsent] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'What is the shipping and dispatch timeline?',
      a: 'Divine’s Eternity follows a 5–7 day dispatch/delivery timeline for all orders. We recommend placing your order at least 5–7 days in advance for birthdays, anniversaries, and special occasions.',
    },
    {
      q: 'How can I track my order status?',
      a: 'Once your order is dispatched, a Tracking ID will be shared with you via SMS/Email/WhatsApp. Simply enter your Tracking ID in the “Track Order” section on our website to check your delivery status anytime.',
    },
    {
      q: 'How does the 7-Day Replacement Policy work?',
      a: 'If you receive a damaged, defective, incorrect, or incomplete product, request a replacement within 7 days of delivery by contacting our support team on WhatsApp at 9353652043 with clear photos/videos.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'All orders at Divine’s Eternity are prepaid. We currently do not offer Cash on Delivery (COD) to ensure smooth custom handcrafting and insured express dispatch.',
    },
    {
      q: 'How do I request order customization or color changes?',
      a: 'Mention your preferred colour, design, or theme while placing your order in the personalization box. Our team will check availability and confirm your request through WhatsApp before proceeding.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsentError('');
    if (!name || !phone || !message) return;

    if (!hasAgreedConsent) {
      setConsentError('Please check the consent box to send your inquiry.');
      return;
    }

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          subject,
          message: message.trim(),
        }),
      });
    } catch {
      // ignore
    }

    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setHasAgreedConsent(false);
    }, 1500);
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const contactUrl = typeof window !== 'undefined' ? `${window.location.origin}/contact` : 'https://divineseternity.com/contact';

  return (
    <div className="py-10 sm:py-16 bg-[#FFFDF8] min-h-screen">
      <SEO
        title="Contact & Concierge Support — Divine’s Eternity"
        description="Need help choosing a gift, tracking an order, or personalizing a hamper? Contact Divine’s Eternity support team on WhatsApp at 9353652043."
        keywords="contact divines eternity, whatsapp support 9353652043, track order, replacement request, personalization support"
        url={contactUrl}
        structuredData={faqStructuredData}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>Contact & Concierge Support</span>
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#211D1C]">
            We’re Here To <span className="italic text-[#FF2E93]">Help You</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Need help choosing a gift, tracking an order, understanding a product, or planning something special?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Direct Card */}
            <div className="bg-[#E8F5E9] p-6 rounded-3xl border border-emerald-200 space-y-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-base font-bold text-[#211D1C]">
                    WhatsApp Concierge Support
                  </h3>
                  <p className="text-xs text-emerald-800 font-medium">
                    Fastest responses during support hours
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-stone-700 leading-relaxed">
                Connect with our team for order assistance, product enquiries, personalization requests, replacement assistance, or collaboration opportunities.
              </p>

              <div className="pt-2">
                <a
                  href="https://wa.me/919353652043?text=Hello%20Divine%E2%80%99s%20Eternity!%20I%20have%20an%20enquiry%20regarding%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message Us on WhatsApp: 9353652043</span>
                </a>
              </div>
            </div>

            {/* Support Topics */}
            <div className="bg-white p-6 rounded-3xl border border-[#F3E8E2] space-y-4 shadow-xs">
              <h3 className="font-serif-heading text-base font-bold text-[#211D1C] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#FF2E93]" />
                You Can Contact Us For:
              </h3>

              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E93]" />
                  Order assistance & tracking updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E93]" />
                  Product enquiries & recommendations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E93]" />
                  Personalization & customization availability checks
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E93]" />
                  Gift hamper & bouquet planning
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E93]" />
                  7-Day Replacement assistance
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E93]" />
                  Creator collaboration & affiliate enquiries
                </li>
              </ul>
            </div>

            {/* Brand Signature */}
            <div className="bg-[#FFF9EB] p-5 rounded-3xl border border-[#F5E6CE] text-center space-y-1">
              <h4 className="font-serif-heading font-bold text-sm text-[#211D1C]">
                Divine’s Eternity
              </h4>
              <p className="text-xs text-[#FF2E93] italic font-medium">
                Thoughtful gifts. Beautiful moments. Made with love.
              </p>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif-heading text-2xl font-bold text-[#211D1C]">
                Send Us a Message
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Fill in your details below and our concierge team will respond promptly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#FFF9EB] border border-[#F5E6CE] p-6 rounded-2xl text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-base text-[#211D1C]">Message Received!</h3>
                <p className="text-xs text-stone-600">
                  Thank you, {name}! Our Divine’s Eternity team will get back to you shortly over WhatsApp/Email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Diya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 93536 52043"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="diya@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Enquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  >
                    <option>Order Assistance & Tracking</option>
                    <option>Personalization & Customization Request</option>
                    <option>7-Day Replacement Request</option>
                    <option>Gift & Hamper Recommendation</option>
                    <option>Collaboration & Creator Enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can our Divine’s Eternity team assist you today?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>

                {consentError && (
                  <div className="text-xs text-rose-600 font-medium">
                    {consentError}
                  </div>
                )}

                <label className="flex items-start gap-2 text-[11px] text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAgreedConsent}
                    onChange={(e) => setHasAgreedConsent(e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-[#FF2E93] focus:ring-[#FF2E93]"
                  />
                  <span>
                    I consent to Divine’s Eternity contacting me via WhatsApp/Email in accordance with the{' '}
                    <a href="/privacy-policy" target="_blank" className="text-[#FF2E93] font-bold hover:underline">
                      Privacy Policy
                    </a>{' '}
                    [REVIEW WITH LAWYER].
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Concierge Enquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#211D1C]">
              Quick Answers & Support
            </h2>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#E7E2DA] rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#211D1C] flex items-center justify-between gap-3 bg-[#FFFDF8] hover:bg-[#FFF9EB] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#FF2E93] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-stone-600 border-t border-stone-100 bg-white leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
