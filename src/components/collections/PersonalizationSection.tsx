import React, { useState } from 'react';
import { Product } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { BUSINESS_CONFIG } from '../../config/business';
import {
  Sparkles,
  MessageCircle,
  Palette,
  Check,
  Send,
  ShieldCheck,
  Clock,
  ArrowRight,
  Heart,
  Gem,
  Smile,
  Package,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PersonalizationSectionProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const COLOR_OPTIONS = [
  { name: 'Rose Gold', hex: '#E0A899', bgClass: 'bg-[#E0A899]' },
  { name: 'Champagne Gold', hex: '#D4AF37', bgClass: 'bg-[#D4AF37]' },
  { name: 'Pastel Blush', hex: '#FFB5D5', bgClass: 'bg-[#FFB5D5]' },
  { name: 'Emerald Velvet', hex: '#0B6623', bgClass: 'bg-[#0B6623]' },
  { name: 'Royal Midnight', hex: '#1E293B', bgClass: 'bg-[#1E293B]' },
  { name: 'Lilac Dream', hex: '#D8B4F8', bgClass: 'bg-[#D8B4F8]' },
  { name: 'Burgundy Crimson', hex: '#881337', bgClass: 'bg-[#881337]' },
  { name: 'Ivory Cream', hex: '#FAF5EE', bgClass: 'bg-[#FAF5EE]' },
];

const DESIGN_OPTIONS = [
  { id: 'cursive', label: 'Cursive Calligraphy Script', desc: 'Handwritten flowing cursive signature lettering' },
  { id: 'minimalist', label: 'Minimalist Clean Serif', desc: 'Refined modern typography with architectural elegance' },
  { id: 'caricature', label: 'Custom Miniature / Caricature', desc: 'Hand-drawn portrait sculpture or acrylic caricature' },
  { id: 'floral', label: 'Everlasting Floral Accents', desc: 'Preserved real rosebuds & gold leaf foil embellishments' },
  { id: 'spotify', label: 'Spotify Soundwave & Plaque', desc: 'Scannable audio code + glowing wooden LED pedestal' },
];

const THEME_OPTIONS = [
  { id: 'anniversary', label: 'Anniversary Romance', desc: 'Milestone years, vows, and infinity bonds' },
  { id: 'birthday', label: 'Birthday Celebration', desc: 'Zodiac, birth flowers, and celebratory wishes' },
  { id: 'soulmate', label: 'Soulmate Keepsake', desc: 'Two hearts, coordinates of first date, initials' },
  { id: 'wedding', label: 'Wedding & Bridesmaid', desc: 'Royal crest, bridal party names, heirloom tags' },
  { id: 'custom', label: 'Custom Concept', desc: 'Completely bespoke design tailored to your vision' },
];

const CATEGORIES_LIST = [
  'Personalized Jewellery',
  'Names on Gifts',
  'Customize Your Caricature or Miniature',
  'Personalize Your Bouquets',
  'Special Hampers',
  'Hair Accessories',
  'Paradise of Jewels',
];

export const PersonalizationSection: React.FC<PersonalizationSectionProps> = ({
  products,
  onOpenDetail,
  onQuickView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES_LIST[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].name);
  const [selectedDesign, setSelectedDesign] = useState(DESIGN_OPTIONS[0].label);
  const [selectedTheme, setSelectedTheme] = useState(THEME_OPTIONS[0].label);
  const [customNames, setCustomNames] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // WhatsApp pre-filled link builder
  const buildWhatsAppMessage = () => {
    const text = `*New Personalization Request — Divine’s Eternity* ✦
Customer: ${customerName || 'Valued Guest'}
Phone: ${customerPhone || 'Not provided'}
---------------------------
• Category: ${selectedCategory}
• Preferred Colour: ${selectedColor}
• Preferred Design: ${selectedDesign}
• Preferred Theme: ${selectedTheme}
• Names/Text: ${customNames || 'None specified'}
• Special Requirements: ${specialRequirements || 'Please check availability & advise suggestions'}
---------------------------
Hello team Divine’s Eternity! I would like to check availability and confirm this personalization request with you.`;

    const cleanNumber = BUSINESS_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleConfirmWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const requestData = {
      category: selectedCategory,
      preferredColor: selectedColor,
      preferredDesign: selectedDesign,
      preferredTheme: selectedTheme,
      customNames: customNames || 'None specified',
      specialRequirements: specialRequirements || 'Please check availability',
      customerName: customerName || 'Valued Guest',
      customerPhone: customerPhone || 'WhatsApp Lead',
      submittedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: dbErr } = await supabase.from('personalization_requests').insert({
          status: 'Pending',
          data: requestData,
        });

        if (dbErr) {
          setSubmitError(`Database failed to record personalization request: ${dbErr.message}`);
          setIsSubmitting(false);
          return; // Never silently fall back on database failure!
        }
      } catch (err: any) {
        setSubmitError(`Database communication error: ${err.message}`);
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF2E93', '#FFD94A', '#E0A899'],
    });
    setIsConfirmed(true);

    const waUrl = buildWhatsAppMessage();
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }
  };

  // Customizable products from catalogue
  const customizableProducts = products
    .filter((p) => p.allowsPersonalization || p.category === selectedCategory)
    .slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Introduction Banner */}
      <div className="bg-gradient-to-br from-[#FFF9EB] via-[#FFFDF8] to-[#FFF0F5] border border-[#F3E8E2] rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F3E8E2] text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] shadow-2xs">
            <span>✦</span>
            <span>BESPOKE CREATION STUDIO</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            Make Your Gift <span className="font-serif italic text-[#FF2E93]">Truly Yours</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Choose your preferred colour, design, theme, or other requirements while placing your order through our personalization option. We’ll check the availability and confirm your request with you through WhatsApp.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-stone-600">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#E7E2DA]">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              Direct WhatsApp Confirmation
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#E7E2DA]">
              <Palette className="w-3.5 h-3.5 text-[#FF2E93]" />
              Endless Colour & Theme Customization
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#E7E2DA]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              100% Quality Assurance
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Personalization Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Configurator */}
        <div className="lg:col-span-7 bg-white border border-[#E7E2DA] rounded-3xl p-6 sm:p-8 space-y-7 shadow-xs">
          <div>
            <h3 className="font-serif-heading text-2xl font-bold text-[#211D1C] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF2E93]" />
              Personalization Studio
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Select your specifications below. We will personally verify availability with our master artisans.
            </p>
          </div>

          <form onSubmit={handleConfirmWhatsApp} className="space-y-6">
            {/* Step 1: Category */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                1. Select Product Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#FFF0F5] border-[#FF2E93] text-[#FF2E93] ring-1 ring-[#FF2E93]/20'
                        : 'bg-stone-50/60 border-stone-200 text-[#211D1C] hover:border-stone-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Preferred Colour */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                2. Choose Preferred Colour / Finish
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      selectedColor === col.name
                        ? 'border-[#FF2E93] bg-[#FFF0F5] text-[#211D1C] ring-1 ring-[#FF2E93]/20 font-bold'
                        : 'border-[#E7E2DA] bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border border-black/10 shrink-0 ${col.bgClass}`} />
                    <span className="truncate">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Preferred Design */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                3. Choose Preferred Design
              </label>
              <div className="space-y-2">
                {DESIGN_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDesign(d.label)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      selectedDesign === d.label
                        ? 'bg-[#FFF9EB] border-[#D97706] ring-1 ring-[#D97706]/20'
                        : 'bg-white border-[#E7E2DA] hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#211D1C]">{d.label}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{d.desc}</p>
                    </div>
                    {selectedDesign === d.label && (
                      <Check className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Preferred Theme */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                4. Choose Preferred Theme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {THEME_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTheme(t.label)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      selectedTheme === t.label
                        ? 'bg-[#FFF0F5] border-[#FF2E93] text-[#211D1C] font-bold ring-1 ring-[#FF2E93]/20'
                        : 'bg-white border-[#E7E2DA] text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span className="block font-bold">{t.label}</span>
                    <span className="text-[10px] text-stone-500 font-normal">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Names / Special Requirements */}
            <div className="space-y-4 pt-2 border-t border-stone-200">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Names, Initials or Meaningful Message
                </label>
                <input
                  type="text"
                  value={customNames}
                  onChange={(e) => setCustomNames(e.target.value)}
                  placeholder="e.g. Diya & Kabir · Forever Yours · 14.02.2025"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Upload Reference Photo (For Caricatures, Miniatures, Song Plaques & Photo Hampers)
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2.5 rounded-xl bg-[#211D1C] hover:bg-black text-white text-xs font-bold shrink-0 cursor-pointer flex items-center gap-2 shadow-xs transition-colors">
                    <span>📁 Upload Reference Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setUploadedPhoto(evt.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {uploadedPhoto && (
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E7E2DA] bg-stone-100 shrink-0">
                        <img src={uploadedPhoto} alt="Uploaded reference" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-emerald-600 font-bold">✓ Photo Attached</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Other Specific Requirements & Notes
                </label>
                <textarea
                  rows={3}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="Tell us about packaging preferences, reference photos, delivery timeline, or caricature pose requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Your WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>
              </div>
            </div>

            {submitError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{isSubmitting ? 'Submitting to Database...' : 'Check Availability & Confirm on WhatsApp'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Keepsake Preview & WhatsApp Confirmation Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Card */}
          <div className="bg-gradient-to-b from-[#211D1C] to-[#2E2826] text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 border border-stone-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2E93]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-stone-700 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD94A]">
                  LIVE MOCKUP SPECIFICATION
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  Your Bespoke Gift Draft
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                WhatsApp Ready
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-800">
                <span className="text-stone-400">Category:</span>
                <span className="font-bold text-stone-100">{selectedCategory}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-800">
                <span className="text-stone-400">Preferred Colour:</span>
                <span className="font-bold text-[#FFD94A]">{selectedColor}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-800">
                <span className="text-stone-400">Preferred Design:</span>
                <span className="font-bold text-stone-100">{selectedDesign}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-800">
                <span className="text-stone-400">Preferred Theme:</span>
                <span className="font-bold text-stone-100">{selectedTheme}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-800">
                <span className="text-stone-400">Names / Text:</span>
                <span className="font-bold text-[#FF2E93] italic truncate max-w-[200px]">
                  {customNames || '“Your Name / Message Here”'}
                </span>
              </div>
              {specialRequirements && (
                <div className="py-1.5 border-b border-stone-800">
                  <span className="text-stone-400 block mb-1">Special Requirements:</span>
                  <p className="text-[11px] text-stone-300 line-clamp-2 italic">
                    {specialRequirements}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 text-xs text-stone-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>Response Time: Under 15 Minutes</span>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-400">
                Our design coordinator will check current inventory and handcrafted workshop capacity to confirm your personalized piece over WhatsApp before payment.
              </p>
            </div>

            {isConfirmed && (
              <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 text-emerald-200 text-xs animate-in fade-in space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <Check className="w-4 h-4" />
                  WhatsApp Conversation Launched!
                </div>
                <p className="text-[11px]">
                  If your chat window did not open automatically, click the button below to message Divine’s Eternity directly.
                </p>
                <a
                  href={buildWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 font-bold text-white underline"
                >
                  Click here to re-open WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Quick FAQ Card */}
          <div className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-3xl p-6 text-xs text-stone-700 space-y-3">
            <h5 className="font-bold text-sm text-[#211D1C]">
              How WhatsApp Personalization Works
            </h5>
            <ol className="space-y-2 list-decimal list-inside text-stone-600 leading-relaxed">
              <li>
                <strong className="text-[#211D1C]">Submit Preferences:</strong> Choose color, design, and specific texts.
              </li>
              <li>
                <strong className="text-[#211D1C]">Live Availability Check:</strong> We verify material stock and handcrafting queue.
              </li>
              <li>
                <strong className="text-[#211D1C]">Digital Proof Review:</strong> We share high-res design previews with you before final production.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* 3. Customizable Products Catalog Row */}
      {customizableProducts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#F3E8E2]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
                Ready-To-Personalize Best Sellers
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Popular gifts crafted to be personalized instantly
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {customizableProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#E7E2DA] p-3 text-left space-y-2 hover:border-[#FF2E93] transition-all group"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-[#FFF0F5] relative">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-[#FF2E93] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                    Customizable
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#211D1C] line-clamp-1">{p.name}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#211D1C]">₹{p.price}</span>
                  <button
                    onClick={() => onOpenDetail(p)}
                    className="text-[11px] font-bold text-[#FF2E93] hover:underline"
                  >
                    Customize →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
