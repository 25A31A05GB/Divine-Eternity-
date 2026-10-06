import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, Send, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'How does the Buy 3 Pay For 2 offer work?',
      a: 'Simply add any 3 or more phone cases to your shopping bag. Our intelligent offer engine will automatically make the lowest-priced case 100% FREE at checkout!',
    },
    {
      q: 'Are your cases MagSafe and wireless charging compatible?',
      a: 'Yes! All our Soft Silicone & Hard Armor variants are fully tested with Qi and MagSafe magnetic wireless chargers without having to remove the case.',
    },
    {
      q: 'How do I claim a 7-Day Replacement?',
      a: 'If you selected the wrong phone model or received a case with any cosmetic flaw, simply reach out to us on WhatsApp (+91 98765 43210) with your order ID within 7 days. We provide free doorstep reverse pickups!',
    },
    {
      q: 'How is the custom name engraved on the case?',
      a: 'Our artisans use high-precision micro-laser calligraphy foil engraving that never chips, peels, or fades over time.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F0508C] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>We’re Here For You</span>
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#231F20] dark:text-[#FDF9F7]">
            Get In <span className="italic text-[#F0508C]">Touch</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions about your phone model, bulk gifting, or tracking? Talk to our friendly team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Channels & Studio Address */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Direct Card */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-base font-bold text-slate-900 dark:text-white">
                    Chat on WhatsApp
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                    Fastest responses in &lt; 15 minutes
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Need urgent model verification or customization guidance? Send us a quick hello!
              </p>
              <a
                href="https://wa.me/919876543210?text=Hi%20Divine%27s%20Eternity!%20I%20have%20a%20query%20about%20a%20phone%20case."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Open WhatsApp Chat (+91 98765 43210)
              </a>
            </div>

            {/* Studio Info Card */}
            <div className="bg-white dark:bg-[#1E1A1D] p-6 rounded-3xl border border-[#F3E8E2] dark:border-[#2D252A] shadow-xs space-y-4">
              <h3 className="font-serif-heading text-base font-bold text-slate-900 dark:text-white">
                Divine Studio & Support
              </h3>
              
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#F0508C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Email Support</span>
                    <a href="mailto:support@divineseternity.com" className="hover:text-[#F0508C]">
                      support@divineseternity.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#FFD94A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Customer Helpline</span>
                    <span>+91 98765 43210 (Mon - Sat, 10 AM - 7 PM IST)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Studio Location</span>
                    <span>Divine Studio, 402 Linking Road, Bandra West, Mumbai, MH 400050</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white dark:bg-[#1E1A1D] p-6 rounded-3xl border border-[#F3E8E2] dark:border-[#2D252A] shadow-xs space-y-3">
              <h3 className="font-serif-heading text-base font-bold text-slate-900 dark:text-white mb-2">
                Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left p-3 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:text-[#F0508C]"
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? (
                        <ChevronUp className="w-3.5 h-3.5 text-[#F0508C]" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {openFaq === idx && (
                      <div className="px-3 pb-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Submission Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1E1A1D] p-6 sm:p-10 rounded-3xl border border-[#F3E8E2] dark:border-[#2D252A] shadow-md space-y-6">
            <div>
              <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Send Us a Note
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the form below and we’ll reply to your email within 2-4 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center space-y-3 border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-sm mx-auto">
                  Thank you! Our care team has received your message and will respond to your email promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sara Ali"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#F0508C] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sara@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#F0508C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#F0508C] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you need help with (Order ID, model sizing, custom designs)..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#F0508C] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#F0508C] hover:bg-[#d63b74] text-white py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
