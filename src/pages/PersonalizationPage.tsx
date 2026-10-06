import React, { useState } from 'react';
import { Sparkles, MessageCircle, Heart, Check, Palette, Wand2, ArrowRight, ShieldCheck, Clock, Send, Gift } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { CATEGORIES } from '../data/products';
import { useCart } from '../context/CartContext';

interface PersonalizationPageProps {
  onExploreProducts: (cat?: string) => void;
}

const COLOR_OPTIONS = [
  { name: 'Champagne Gold', hex: '#D4AF37', ring: 'ring-amber-400' },
  { name: 'Rose Petal Pink', hex: '#FF2E93', ring: 'ring-pink-400' },
  { name: 'Crimson Velvet', hex: '#881337', ring: 'ring-rose-800' },
  { name: 'Royal Emerald', hex: '#064E3B', ring: 'ring-emerald-700' },
  { name: 'Midnight Obsidian', hex: '#1C1917', ring: 'ring-stone-800' },
  { name: 'Pure Pearl Ivory', hex: '#FFFDF8', ring: 'ring-stone-300' },
  { name: 'Lavender Mist', hex: '#C084FC', ring: 'ring-purple-400' },
];

const DESIGN_STYLES = [
  { id: 'cursive', title: 'Cursive Calligraphy', desc: 'Flowing handwriting with heart accents' },
  { id: 'roman', title: 'Roman Numerals', desc: 'Timeless carved anniversary date numbers' },
  { id: 'caricature', title: 'Custom 3D Caricature', desc: 'Whimsical illustrated couple cutout' },
  { id: 'wax_seal', title: 'Vintage Wax Seal', desc: 'Embossed wax emblem with gold dust' },
  { id: 'silk_ribbon', title: 'Hand-Tied Silk Ribbon', desc: 'Foil printed continuous satin ribbon' },
  { id: 'polki', title: 'Polki & Pearl Clusters', desc: 'Royal traditional gemstone filigree' },
];

const THEME_OPTIONS = [
  { id: 'anniversary', title: 'Romantic Anniversary', icon: '❤️' },
  { id: 'birthday', title: 'Birthday Celebration', icon: '🎂' },
  { id: 'wedding', title: 'Wedding & Bridesmaids', icon: '💍' },
  { id: 'festive', title: 'Festive & Royale', icon: '✨' },
  { id: 'self_care', title: 'Self-Love Luxe', icon: '🌸' },
  { id: 'custom', title: 'Other Special Occasion', icon: '🎁' },
];

export const PersonalizationPage: React.FC<PersonalizationPageProps> = ({ onExploreProducts }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].name);
  const [selectedDesign, setSelectedDesign] = useState(DESIGN_STYLES[0].title);
  const [selectedTheme, setSelectedTheme] = useState(THEME_OPTIONS[0].title);
  const [customText, setCustomText] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { addToCart, openCart } = useCart();

  const generateWhatsAppMessage = () => {
    const text = `✦ *DIVINE’S ETERNITY PERSONALIZATION INQUIRY* ✦
    
Hello Divine's Eternity! I would like to check availability and confirm my custom personalization request:

• *Category:* ${selectedCategory}
• *Preferred Colour:* ${selectedColor}
• *Preferred Design:* ${selectedDesign}
• *Preferred Theme:* ${selectedTheme}
• *Custom Inscription / Names:* ${customText || 'To be decided'}
• *Special Requirements:* ${customRequirements || 'Standard handcrafted edition'}

• *My Name:* ${customerName || 'Customer'}
• *My Phone:* ${customerPhone || 'Shared via chat'}

Kindly verify availability and guide me through the next steps! Thank you.`;

    return encodeURIComponent(text);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/919876543210?text=${encoded}`;
    
    setIsSent(true);
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="py-8 sm:py-14 bg-[#FFFDF8] text-[#211D1C]">
      <SEO
        title="Bespoke Personalization Studio — Divine’s Eternity"
        description="Make your gift truly yours. Choose your preferred colour, design, theme, or other requirements. We’ll check availability and confirm your request through WhatsApp."
        keywords="personalization, custom gifts, whatsapp gift order, personalized jewellery, custom bouquets, divine eternity"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Tag */}
        <div className="mb-4 flex items-center gap-2 text-xs text-stone-500">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#FF2E93] font-bold">Personalization Studio</span>
        </div>

        {/* Hero Section Banner matching Brand Copy */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF5F8] via-[#FFF9EB] to-[#FAF7F2] border border-[#F3E8E2] p-6 sm:p-12 mb-12 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#FF2E93] border border-[#F3E8E2] shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#FFD94A]" />
              <span>DIVINE’S ETERNITY PERSONALIZATION</span>
            </div>

            <h1 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#211D1C] tracking-tight leading-[1.1]">
              Make Your Gift <span className="font-serif italic text-[#FF2E93] font-normal">Truly Yours</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
              Choose your preferred colour, design, theme, or other requirements while placing your order through our personalization option. We’ll check the availability and confirm your request with you through WhatsApp.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-stone-700">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Zero Obligation Availability Check</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Instant WhatsApp 1-on-1 Assistance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF2E93]" />
                <span>100% Handcrafted Artisanal Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Studio Grid: Left Configuration, Right Real-time Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Customizer Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8E2] shadow-sm space-y-8">
            
            {/* Step 1: Category Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E93] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF2E93] text-white flex items-center justify-center text-[10px]">1</span>
                  Select Product Category
                </label>
                <span className="text-[11px] text-stone-400">7 Collections Available</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                      selectedCategory === cat.name
                        ? 'border-[#FF2E93] bg-[#FFF5F8] text-[#FF2E93] ring-2 ring-[#FF2E93]/20 shadow-xs'
                        : 'border-[#F3E8E2] hover:border-stone-400 text-[#211D1C] bg-[#FFFDF8]'
                    }`}
                  >
                    <span className="text-xs font-bold">{cat.name}</span>
                    <span className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{cat.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Preferred Colour */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E93] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF2E93] text-white flex items-center justify-center text-[10px]">2</span>
                  Choose Preferred Colour
                </label>
                <span className="text-xs font-bold text-stone-700">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                      selectedColor === col.name
                        ? 'border-[#FF2E93] bg-white ring-2 ring-[#FF2E93]/30 text-[#FF2E93]'
                        : 'border-stone-200 bg-[#FFFDF8] hover:border-stone-400 text-stone-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Preferred Design */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E93] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF2E93] text-white flex items-center justify-center text-[10px]">3</span>
                  Choose Preferred Design / Style
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DESIGN_STYLES.map((des) => (
                  <button
                    key={des.id}
                    type="button"
                    onClick={() => setSelectedDesign(des.title)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedDesign === des.title
                        ? 'border-[#FF2E93] bg-[#FFF5F8] text-[#FF2E93] ring-2 ring-[#FF2E93]/20 shadow-xs'
                        : 'border-[#F3E8E2] hover:border-stone-400 text-[#211D1C] bg-[#FFFDF8]'
                    }`}
                  >
                    <p className="text-xs font-bold">{des.title}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">{des.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Preferred Theme */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E93] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF2E93] text-white flex items-center justify-center text-[10px]">4</span>
                  Choose Preferred Theme
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {THEME_OPTIONS.map((thm) => (
                  <button
                    key={thm.id}
                    type="button"
                    onClick={() => setSelectedTheme(thm.title)}
                    className={`p-2.5 rounded-2xl text-left border transition-all flex items-center gap-2 cursor-pointer ${
                      selectedTheme === thm.title
                        ? 'border-[#FF2E93] bg-[#FFF5F8] text-[#FF2E93] ring-2 ring-[#FF2E93]/20 shadow-xs'
                        : 'border-[#F3E8E2] hover:border-stone-400 text-[#211D1C] bg-[#FFFDF8]'
                    }`}
                  >
                    <span className="text-base">{thm.icon}</span>
                    <span className="text-xs font-bold leading-tight">{thm.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Custom Text & Requirements */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                  Names, Initials, or Custom Message
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. Diya & Aryan · Forever & Always"
                  maxLength={40}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border border-[#E7E2DA] text-xs sm:text-sm text-[#211D1C] focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                  Other Specific Requirements & Notes
                </label>
                <textarea
                  rows={3}
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  placeholder="Tell us any special requests: specific flower colors, anniversary date font, photo attachments, or fast dispatch deadline..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF8] border border-[#E7E2DA] text-xs text-[#211D1C] focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#E7E2DA] text-xs text-[#211D1C] focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#E7E2DA] text-xs text-[#211D1C] focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Check Availability & Confirm via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => onExploreProducts(selectedCategory)}
                className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-[#211D1C] hover:bg-black text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {isSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Opening WhatsApp chat with your complete personalized brief. Our artisan team will reply within minutes!</span>
              </div>
            )}

          </div>

          {/* Right Live Preview Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8E2] shadow-md space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#F3E8E2]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E93] animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700">Live Personalization Preview</span>
                </div>
                <span className="text-[10px] bg-[#FFF0F3] text-[#FF2E93] px-2.5 py-0.5 rounded-full font-bold">
                  Bespoke Atelier
                </span>
              </div>

              {/* Dynamic Mockup Card */}
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#FFF5F8] via-[#FAF7F2] to-[#FFF9EB] border border-[#F3E8E2] p-6 flex flex-col justify-between relative overflow-hidden shadow-inner">
                <div className="flex justify-between items-start">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E93]">
                    {selectedCategory}
                  </div>
                  <div className="text-xs text-amber-500 font-bold">✦</div>
                </div>

                {/* Center Inscription Preview */}
                <div className="text-center my-auto space-y-1">
                  <p className="font-script text-3xl sm:text-4xl text-[#881337] font-bold drop-shadow-xs">
                    {customText && customText.trim() ? customText : 'Divine Inscription'}
                  </p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-stone-500">
                    Theme: {selectedTheme}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 border-t border-stone-200/50 pt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E93]" />
                    {selectedColor}
                  </span>
                  <span className="text-stone-500 text-[10px]">{selectedDesign}</span>
                </div>
              </div>

              {/* Summary Checklist */}
              <div className="space-y-2 text-xs text-stone-600 bg-[#FFFDF8] p-4 rounded-2xl border border-[#F3E8E2]">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="font-medium text-stone-500">Collection:</span>
                  <span className="font-bold text-[#211D1C]">{selectedCategory}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="font-medium text-stone-500">Colour Palette:</span>
                  <span className="font-bold text-[#211D1C]">{selectedColor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="font-medium text-stone-500">Style Execution:</span>
                  <span className="font-bold text-[#211D1C]">{selectedDesign}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-stone-500">Occasion Theme:</span>
                  <span className="font-bold text-[#FF2E93]">{selectedTheme}</span>
                </div>
              </div>

              {/* How it works 3-step banner */}
              <div className="bg-[#FFF9EB] p-4 rounded-2xl border border-[#F5E6CE] space-y-2 text-xs">
                <p className="font-bold text-[#211D1C] flex items-center gap-1.5">
                  <span>✦</span>
                  <span>How Our Personalization Works</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 text-[11px]">
                  <li>Choose your preferred colors, designs, and inscriptions above.</li>
                  <li>Click to connect directly on WhatsApp with your exact brief.</li>
                  <li>Our artisans verify stock, share digital proofs, and ship with luxury packaging!</li>
                </ol>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
