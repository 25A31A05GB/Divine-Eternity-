import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  MessageCircle,
  Heart,
  Check,
  Palette,
  Wand2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Send,
  Gift,
  Package,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Building2,
  Users,
  Award,
  Flame,
  Star,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { CATEGORIES } from '../data/products';
import { useCart } from '../context/CartContext';
import { soundFeedback } from '../lib/soundFeedback';
import { Product } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AlertCircle } from 'lucide-react';

interface PersonalizationPageProps {
  onExploreProducts: (cat?: string) => void;
  initialTab?: 'hamper' | 'bespoke' | 'corporate';
}

/* -------------------------------------------------------------
 * Hamper Studio Options & Delicacies
 * ------------------------------------------------------------- */
interface HamperBox {
  id: string;
  name: string;
  subtitle: string;
  capacity: number;
  basePrice: number;
  image: string;
  badge?: string;
  color: string;
}

interface HamperItem {
  id: string;
  name: string;
  category: 'sweet' | 'delicacy' | 'keepsake';
  weightOrSize: string;
  price: number;
  image: string;
  dietary?: string;
  popular?: boolean;
}

const HAMPER_BOXES: HamperBox[] = [
  {
    id: 'emerald-trunk',
    name: 'Royal Emerald Velvet Trunk',
    subtitle: 'Deep forest green velvet with brushed brass antique clasps',
    capacity: 6,
    basePrice: 1499,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    badge: 'Bestseller',
    color: '#064E3B',
  },
  {
    id: 'gold-heritage-chest',
    name: 'Champagne Gold Heritage Chest',
    subtitle: '24K gold foil embossed lid with dual satin pull ribbons',
    capacity: 8,
    basePrice: 1899,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
    badge: 'Ultra-Luxe',
    color: '#D4AF37',
  },
  {
    id: 'rose-silk-keepsake',
    name: 'Blush Rose Silk Keepsake',
    subtitle: 'Woven raw silk exterior with delicate gold foil framing',
    capacity: 4,
    basePrice: 1199,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    badge: 'Romantic',
    color: '#FF2E93',
  },
  {
    id: 'walnut-artisan-wood',
    name: 'Handcrafted Walnut Royale',
    subtitle: 'Solid seasoned walnut wood with carved jali lattice lid',
    capacity: 8,
    basePrice: 2299,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
    badge: 'Heirloom',
    color: '#451A03',
  },
];

const HAMPER_SWEETS: HamperItem[] = [
  {
    id: 'gold-kaju-katli',
    name: '24K Edible Gold Leaf Kaju Katli',
    category: 'sweet',
    weightOrSize: '250g (12 pcs)',
    price: 650,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80',
    dietary: 'Pure Veg · Desi Ghee',
    popular: true,
  },
  {
    id: 'saffron-pistachio-peda',
    name: 'Royal Kashmiri Saffron Peda',
    category: 'sweet',
    weightOrSize: '250g (10 pcs)',
    price: 580,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
    dietary: 'Pure Veg',
  },
  {
    id: 'turkish-rose-baklava',
    name: 'Gourmet Turkish Rose Pistachio Baklava',
    category: 'sweet',
    weightOrSize: '200g (8 diamond cuts)',
    price: 720,
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
    dietary: 'Artisanal Flaky Pastry',
    popular: true,
  },
  {
    id: 'belgian-dates',
    name: 'Belgian Truffle Stuffed Medjool Dates',
    category: 'delicacy',
    weightOrSize: '200g (8 jumbo dates)',
    price: 690,
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=600&auto=format&fit=crop&q=80',
    dietary: 'No Refined Sugar',
  },
  {
    id: 'mango-mawa-barfi',
    name: 'Ratnagiri Alphonso Mango Barfi',
    category: 'sweet',
    weightOrSize: '250g (12 pcs)',
    price: 520,
    image: 'https://images.unsplash.com/photo-1599599810674-b5b9448c292c?w=600&auto=format&fit=crop&q=80',
    dietary: 'Pure Veg',
  },
  {
    id: 'dryfruit-diamond',
    name: 'Sugar-Free Anjeer & Dryfruit Bites',
    category: 'delicacy',
    weightOrSize: '200g (10 pcs)',
    price: 590,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    dietary: '100% Sugar-Free & Vegan',
  },
  {
    id: 'roasted-cashew-almond',
    name: 'Slow-Roasted Saffron Cashews & Almonds',
    category: 'delicacy',
    weightOrSize: '200g Jar',
    price: 480,
    image: 'https://images.unsplash.com/photo-1508736793122-f516e3ba5569?w=600&auto=format&fit=crop&q=80',
    dietary: 'Kashmiri Grade AAA',
  },
];

const HAMPER_KEEPSAKES: HamperItem[] = [
  {
    id: 'brass-lotus-diya',
    name: 'Artisan Solid Brass Lotus Diya',
    category: 'keepsake',
    weightOrSize: '1 Handcrafted Piece',
    price: 399,
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=600&auto=format&fit=crop&q=80',
    popular: true,
  },
  {
    id: 'oud-jasmine-candle',
    name: 'Smoked Oud & Jasmine Soy Wax Candle',
    category: 'keepsake',
    weightOrSize: '150g (40hr Burn)',
    price: 449,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'wax-seal-card',
    name: 'Gold Foil Calligraphy Card with Wax Seal',
    category: 'keepsake',
    weightOrSize: 'Custom Monogram Inscribed',
    price: 199,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    popular: true,
  },
  {
    id: 'zari-brocade-potli',
    name: 'Heritage Zari Gold Brocade Potli',
    category: 'keepsake',
    weightOrSize: 'Banarasi Silk Keepsake',
    price: 349,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
  },
];

/* -------------------------------------------------------------
 * Bespoke Inscription Colors & Fonts
 * ------------------------------------------------------------- */
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
  { id: 'cursive', title: 'Cursive Royal Calligraphy', desc: 'Flowing handwriting with gilded heart accents' },
  { id: 'roman', title: 'Carved Roman Numerals', desc: 'Timeless engraved dates & milestones' },
  { id: 'wax_seal', title: 'Embossed Wax Seal Stamp', desc: 'Hand-stamped crimson wax with gold shimmer' },
  { id: 'silk_ribbon', title: 'Custom Printed Silk Ribbon', desc: 'Continuous foil lettering across satin sash' },
  { id: 'laser_engrave', title: 'Metallic Gold Plate Engraving', desc: 'Permanent diamond-cut brass plaque' },
  { id: 'polki', title: 'Polki & Pearl Clusters', desc: 'Traditional royal filigree setting' },
];

const THEME_OPTIONS = [
  { id: 'anniversary', title: 'Romantic Anniversary', icon: '❤️' },
  { id: 'birthday', title: 'Birthday Celebration', icon: '🎂' },
  { id: 'wedding', title: 'Wedding & Bridesmaids', icon: '💍' },
  { id: 'festive', title: 'Diwali & Royale Festive', icon: '✨' },
  { id: 'corporate', title: 'Corporate Milestone', icon: '🏢' },
  { id: 'custom', title: 'Bespoke Keepsake', icon: '🎁' },
];

export const PersonalizationPage: React.FC<PersonalizationPageProps> = ({
  onExploreProducts,
  initialTab = 'hamper',
}) => {
  const [activeTab, setActiveTab] = useState<'hamper' | 'bespoke' | 'corporate'>(initialTab);

  /* --- Hamper Studio State --- */
  const [selectedBox, setSelectedBox] = useState<HamperBox>(HAMPER_BOXES[0]);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({
    'gold-kaju-katli': 1,
    'turkish-rose-baklava': 1,
    'wax-seal-card': 1,
  });
  const [hamperInscription, setHamperInscription] = useState('');
  const [hamperOccasion, setHamperOccasion] = useState('Festive & Royale');
  const [hamperSuccessMessage, setHamperSuccessMessage] = useState(false);

  /* --- Bespoke Studio State --- */
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* --- Corporate Bulk State --- */
  const [bulkQuantity, setBulkQuantity] = useState(50);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [targetBudget, setTargetBudget] = useState('₹1,500 - ₹2,500 per box');
  const [bulkLogoFile, setBulkLogoFile] = useState<string | null>(null);
  const [bulkCopied, setBulkCopied] = useState(false);

  const { addToCart, openCart } = useCart();

  /* --- Hamper Calculations --- */
  const totalItemCount = useMemo(() => {
    return Object.values(selectedItems).reduce((sum, count) => sum + count, 0);
  }, [selectedItems]);

  const allAvailableItems = useMemo(() => {
    return [...HAMPER_SWEETS, ...HAMPER_KEEPSAKES];
  }, []);

  const hamperPrice = useMemo(() => {
    let total = selectedBox.basePrice;
    Object.entries(selectedItems).forEach(([id, count]) => {
      const item = allAvailableItems.find((i) => i.id === id);
      if (item) {
        total += item.price * count;
      }
    });
    return total;
  }, [selectedBox, selectedItems, allAvailableItems]);

  const handleToggleItem = (item: HamperItem, delta: number) => {
    const current = selectedItems[item.id] || 0;
    const next = current + delta;
    if (next <= 0) {
      const copy = { ...selectedItems };
      delete copy[item.id];
      setSelectedItems(copy);
      soundFeedback.playConciergePop(0.08);
    } else {
      if (delta > 0 && totalItemCount >= selectedBox.capacity) {
        soundFeedback.playSoftPing(0.1);
        return;
      }
      setSelectedItems({ ...selectedItems, [item.id]: next });
      soundFeedback.playAddToCartChime(0.09);
    }
  };

  const handleAddHamperToCart = () => {
    const itemsDescription = Object.entries(selectedItems)
      .map(([id, count]) => {
        const item = allAvailableItems.find((i) => i.id === id);
        return item ? `${count}x ${item.name} (${item.weightOrSize})` : null;
      })
      .filter(Boolean)
      .join(', ');

    addToCart({
      productId: `custom-hamper-${Date.now()}`,
      name: `Bespoke Hamper: ${selectedBox.name}`,
      slug: `custom-hamper-${Date.now()}`,
      price: hamperPrice,
      mrp: Math.round(hamperPrice * 1.25),
      caseType: 'Walnut Hardwood',
      customText: hamperInscription ? `"${hamperInscription}" [${hamperOccasion}]` : `[${hamperOccasion}]`,
      giftMessage: itemsDescription,
      quantity: 1,
      themeColor: selectedBox.color,
      secondaryColor: '#D4AF37',
      designPattern: 'wooden_keepsake_box',
      category: 'Special Hampers',
    });

    soundFeedback.playSuccessChime(0.14);
    setHamperSuccessMessage(true);
    setTimeout(() => {
      setHamperSuccessMessage(false);
      openCart();
    }, 1000);
  };

  /* --- WhatsApp Generation for Hamper --- */
  const generateHamperWhatsApp = () => {
    const itemsList = Object.entries(selectedItems)
      .map(([id, count]) => {
        const item = allAvailableItems.find((i) => i.id === id);
        return item ? `  • ${count}x ${item.name} (₹${item.price * count})` : null;
      })
      .filter(Boolean)
      .join('\n');

    const msg = `✦ *DIVINE’S ETERNITY BESPOKE HAMPER INQUIRY* ✦

Hello Concierge! I have customized a luxury gift hamper online:

📦 *Luxury Box:* ${selectedBox.name} (₹${selectedBox.basePrice})
✨ *Occasion Theme:* ${hamperOccasion}
✍️ *Custom Inscription / Tag:* ${hamperInscription || 'To be decided with artisan'}

🎁 *Included Delicacies & Keepsakes:*
${itemsList}

💰 *Estimated Hamper Total:* ₹${hamperPrice}

Kindly verify delivery timeline and guide me through the next steps! Thank you.`;

    return encodeURIComponent(msg);
  };

  /* --- WhatsApp Generation for Bespoke Inquiry --- */
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

  const handleSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    soundFeedback.playConciergePop(0.1);

    const requestData = {
      category: selectedCategory,
      color: selectedColor,
      design: selectedDesign,
      theme: selectedTheme,
      customText: customText || 'To be decided',
      customRequirements: customRequirements || 'Standard handcrafted edition',
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
          return; // Never silently fall back on database error!
        }
      } catch (err: any) {
        setSubmitError(`Database error: ${err.message}`);
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    const encoded = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/919353652043?text=${encoded}`;
    setIsSent(true);
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  /* --- Corporate Bulk Calculation --- */
  const bulkTierDiscount = useMemo(() => {
    if (bulkQuantity >= 200) return { percent: 25, label: '25% Platinum Corporate Savings' };
    if (bulkQuantity >= 100) return { percent: 20, label: '20% Gold Corporate Savings' };
    if (bulkQuantity >= 50) return { percent: 15, label: '15% Silver Corporate Savings' };
    if (bulkQuantity >= 20) return { percent: 10, label: '10% Tier-1 Savings' };
    return { percent: 5, label: '5% Introductory Corporate Savings' };
  }, [bulkQuantity]);

  const handleSendCorporateWhatsApp = () => {
    soundFeedback.playConciergePop(0.1);
    const text = `✦ *DIVINE’S ETERNITY CORPORATE / BULK GIFTING INQUIRY* ✦

Hello B2B Concierge! We are planning corporate / wedding gifting hampers:

🏢 *Company / Organization:* ${companyName || 'Corporate Client'}
👤 *Contact Name:* ${contactPerson || 'Gifting Lead'}
📧 *Work Email:* ${companyEmail || 'Provided upon inquiry'}
📦 *Quantity Required:* ${bulkQuantity} luxury hampers
🏷️ *Applicable Tier Discount:* ${bulkTierDiscount.label}
🎯 *Target Budget:* ${targetBudget}

Please share your latest B2B luxury catalogue, custom branding options, and official GST quote!`;

    const url = `https://wa.me/919353652043?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="py-8 sm:py-14 bg-[#FFFDF8] text-[#211D1C]">
      <SEO
        title="Bespoke Personalization & Custom Hamper Studio — Divine’s Eternity"
        description="Craft your custom luxury gift hampers and personalized Indian sweets. Select bespoke keepsake boxes, 24K gold foil delicacies, engraved inscriptions, and direct WhatsApp ordering."
        keywords="custom gift hamper, bespoke sweets, personalized mithai, diwali corporate gifting, luxury wedding hampers, 24k gold kaju katli, divine eternity"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Tag */}
        <div className="mb-4 flex items-center gap-2 text-xs text-stone-500">
          <button
            onClick={() => onExploreProducts('all')}
            className="hover:text-[#FF2E93] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#FF2E93] font-bold">Personalization Studio</span>
        </div>

        {/* Hero Section Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF5F8] via-[#FFF9EB] to-[#FAF7F2] border border-[#F3E8E2] p-6 sm:p-10 mb-8 shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#FF2E93] border border-[#F3E8E2] shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>DIVINE’S ETERNITY ATELIER</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#211D1C] tracking-tight leading-[1.15]">
              Artisanal Hampers & <span className="italic text-[#FF2E93] font-normal">Bespoke Gifting</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
              From hand-picking your velvet keepsake trunk to filling it with 24K gold leaf mithai, brass lotus diyas, and personalized wax seal letters — design an unforgettable luxury experience.
            </p>

            {/* Value Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-stone-700">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Real-Time Pricing & Instant Cart Addition</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Direct WhatsApp 1-on-1 Artisan Confirmation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF2E93]" />
                <span>100% Desi Ghee & Handcrafted Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Master Navigation Studio Tabs */}
        <div className="flex items-center justify-start sm:justify-center border-b border-[#F3E8E2] mb-8 overflow-x-auto pb-1 gap-2">
          <button
            onClick={() => {
              setActiveTab('hamper');
              soundFeedback.playConciergePop(0.08);
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'hamper'
                ? 'bg-[#FF2E93] text-white shadow-md shadow-[#FF2E93]/20'
                : 'bg-white text-stone-600 border border-[#F3E8E2] hover:bg-[#FFF5F8] hover:text-[#FF2E93]'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>1. Custom Hamper Builder</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
              Interactive
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bespoke');
              soundFeedback.playConciergePop(0.08);
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'bespoke'
                ? 'bg-[#FF2E93] text-white shadow-md shadow-[#FF2E93]/20'
                : 'bg-white text-stone-600 border border-[#F3E8E2] hover:bg-[#FFF5F8] hover:text-[#FF2E93]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>2. Inscription & Wax Seal Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('corporate');
              soundFeedback.playConciergePop(0.08);
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'corporate'
                ? 'bg-[#FF2E93] text-white shadow-md shadow-[#FF2E93]/20'
                : 'bg-white text-stone-600 border border-[#F3E8E2] hover:bg-[#FFF5F8] hover:text-[#FF2E93]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>3. Corporate & Bulk Concierge</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
              Up to 25% Off
            </span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: CUSTOM HAMPER BUILDER
           ========================================================================= */}
        {activeTab === 'hamper' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Configuration: 7 cols */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8E2] shadow-sm space-y-8">
              
              {/* Step 1: Pick Luxury Box */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E93] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FF2E93] text-white flex items-center justify-center text-[10px]">
                      1
                    </span>
                    Select Keepsake Box & Trunk Style
                  </label>
                  <span className="text-[11px] text-stone-400 font-medium">Step 1 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {HAMPER_BOXES.map((box) => {
                    const isSelected = selectedBox.id === box.id;
                    return (
                      <div
                        key={box.id}
                        onClick={() => {
                          setSelectedBox(box);
                          soundFeedback.playConciergePop(0.08);
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                          isSelected
                            ? 'border-[#FF2E93] bg-[#FFF5F8] ring-2 ring-[#FF2E93]/20 shadow-xs'
                            : 'border-[#F3E8E2] hover:border-stone-400 bg-[#FFFDF8]'
                        }`}
                      >
                        {box.badge && (
                          <span className="absolute top-2.5 right-2.5 text-[9px] font-black px-2 py-0.5 rounded-full bg-[#FF2E93] text-white uppercase tracking-wider">
                            {box.badge}
                          </span>
                        )}

                        <div className="flex items-center gap-3">
                          <img
                            src={box.image}
                            alt={box.name}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0 pr-8">
                            <h4 className="text-xs font-bold text-[#211D1C] truncate">{box.name}</h4>
                            <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5">
                              {box.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="text-stone-500 font-medium text-[11px]">
                            Capacity: <strong className="text-stone-800">{box.capacity} slots</strong>
                          </span>
                          <span className="font-extrabold text-[#FF2E93]">₹{box.basePrice}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Pick Gourmet Sweets */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E93] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FF2E93] text-white flex items-center justify-center text-[10px]">
                      2
                    </span>
                    Choose Gourmet Mithai & Artisanal Sweets
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Slot Fill: <strong className="text-[#FF2E93]">{totalItemCount}</strong> / {selectedBox.capacity}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {HAMPER_SWEETS.map((item) => {
                    const count = selectedItems[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                          count > 0
                            ? 'border-rose-300 bg-rose-50/40'
                            : 'border-[#F3E8E2] bg-[#FFFDF8]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-[#211D1C] line-clamp-1">{item.name}</h4>
                            </div>
                            <p className="text-[10px] text-stone-500">{item.weightOrSize}</p>
                            {item.dietary && (
                              <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                                {item.dietary}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-800">₹{item.price}</span>

                          <div className="flex items-center gap-2 bg-white rounded-full border border-stone-200 px-2 py-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleToggleItem(item, -1)}
                              disabled={count === 0}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold min-w-[14px] text-center text-[#211D1C]">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleItem(item, 1)}
                              disabled={totalItemCount >= selectedBox.capacity}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[#FF2E93] hover:text-rose-700 disabled:opacity-30 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Pick Keepsakes & Royal Accessories */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E93] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FF2E93] text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    Add Keepsakes & Keepsake Accessories
                  </label>
                  <span className="text-[11px] text-stone-400">Brass Diyas, Candles, Cards</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {HAMPER_KEEPSAKES.map((item) => {
                    const count = selectedItems[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                          count > 0
                            ? 'border-amber-300 bg-amber-50/40'
                            : 'border-[#F3E8E2] bg-[#FFFDF8]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-[#211D1C] line-clamp-1">{item.name}</h4>
                            <p className="text-[10px] text-stone-500">{item.weightOrSize}</p>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-800">₹{item.price}</span>

                          <div className="flex items-center gap-2 bg-white rounded-full border border-stone-200 px-2 py-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleToggleItem(item, -1)}
                              disabled={count === 0}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold min-w-[14px] text-center text-[#211D1C]">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleItem(item, 1)}
                              disabled={totalItemCount >= selectedBox.capacity}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[#FF2E93] hover:text-rose-700 disabled:opacity-30 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Hamper Inscription & Theme */}
              <div className="pt-4 border-t border-stone-100 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E93] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FF2E93] text-white flex items-center justify-center text-[10px]">
                      4
                    </span>
                    Personalized Hamper Inscription & Note
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Occasion Theme
                    </label>
                    <select
                      value={hamperOccasion}
                      onChange={(e) => setHamperOccasion(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#E7E2DA] text-xs text-[#211D1C] focus:outline-none focus:border-[#FF2E93]"
                    >
                      <option value="Festive & Royale">Diwali & Festive Royale ✨</option>
                      <option value="Wedding & Anniversary">Royal Wedding & Anniversary 💍</option>
                      <option value="Birthday Luxury">Birthday Keepsake Celebration 🎂</option>
                      <option value="Corporate Milestone">Corporate Partnership Milestone 🏢</option>
                      <option value="Just Because / Family">Family Blessing & Love ❤️</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Box Plaque / Letter Inscription
                    </label>
                    <input
                      type="text"
                      value={hamperInscription}
                      onChange={(e) => setHamperInscription(e.target.value)}
                      placeholder="e.g. With Love, The Sharmas"
                      maxLength={45}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#E7E2DA] text-xs text-[#211D1C] focus:outline-none focus:border-[#FF2E93]"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Live Hamper Preview & Action Card: 5 cols */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F3E8E2] shadow-md space-y-6">
                
                <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                      Live Hamper Builder Summary
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#FF2E93] bg-[#FFF0F5] px-2.5 py-0.5 rounded-full">
                    {totalItemCount}/{selectedBox.capacity} Slots
                  </span>
                </div>

                {/* Visual Hamper Card Mockup */}
                <div className="relative rounded-2xl overflow-hidden border border-[#F3E8E2] bg-gradient-to-br from-[#FFF5F8] to-[#FAF7F2] p-4 space-y-3">
                  <div className="aspect-[16/9] w-full rounded-xl overflow-hidden relative shadow-inner">
                    <img
                      src={selectedBox.image}
                      alt={selectedBox.name}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                        {hamperOccasion}
                      </span>
                      <h3 className="font-serif text-base font-bold drop-shadow-sm">
                        {selectedBox.name}
                      </h3>
                      {hamperInscription && (
                        <p className="text-xs font-serif italic text-white/90 truncate">
                          "{hamperInscription}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar of Capacity */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-stone-600">Hamper Box Capacity</span>
                      <span className={totalItemCount >= selectedBox.capacity ? 'text-emerald-600 font-black' : 'text-stone-700'}>
                        {totalItemCount} of {selectedBox.capacity} items selected
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-[#FF2E93] transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (totalItemCount / selectedBox.capacity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Itemized Breakdown List */}
                <div className="space-y-2 bg-[#FFFDF8] p-4 rounded-2xl border border-[#F3E8E2] text-xs">
                  <div className="flex justify-between font-bold text-stone-800 pb-1.5 border-b border-stone-200">
                    <span>{selectedBox.name} (Base Trunk)</span>
                    <span>₹{selectedBox.basePrice}</span>
                  </div>

                  {Object.entries(selectedItems).length === 0 ? (
                    <p className="text-[11px] text-stone-400 italic py-2 text-center">
                      No sweets or keepsakes added yet. Select from the left!
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {Object.entries(selectedItems).map(([id, count]) => {
                        const item = allAvailableItems.find((i) => i.id === id);
                        if (!item) return null;
                        return (
                          <div key={id} className="flex justify-between items-center text-stone-600">
                            <span className="truncate pr-2">
                              {count}x {item.name}
                            </span>
                            <span className="font-bold text-stone-900 shrink-0">
                              ₹{item.price * count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-extrabold text-stone-900 text-sm">
                    <span>Hamper Total</span>
                    <span className="text-lg text-[#FF2E93]">₹{hamperPrice}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleAddHamperToCart}
                    className="w-full py-3.5 px-6 rounded-full bg-[#FF2E93] hover:bg-[#e02080] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Bespoke Hamper to Bag (₹{hamperPrice})</span>
                  </button>

                  <a
                    href={`https://wa.me/919353652043?text=${generateHamperWhatsApp()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFeedback.playConciergePop(0.1)}
                    className="w-full py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Hamper Configuration via WhatsApp</span>
                  </a>
                </div>

                {hamperSuccessMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bespoke Hamper added to your shopping bag with full customizations!</span>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: BESPOKE INSCRIPTION & WAX SEAL STUDIO
           ========================================================================= */}
        {activeTab === 'bespoke' && (
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
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        soundFeedback.playConciergePop(0.08);
                      }}
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
                      onClick={() => {
                        setSelectedColor(col.name);
                        soundFeedback.playConciergePop(0.08);
                      }}
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
                    Choose Inscription & Style Execution
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DESIGN_STYLES.map((des) => (
                    <button
                      key={des.id}
                      type="button"
                      onClick={() => {
                        setSelectedDesign(des.title);
                        soundFeedback.playConciergePop(0.08);
                      }}
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
                      onClick={() => {
                        setSelectedTheme(thm.title);
                        soundFeedback.playConciergePop(0.08);
                      }}
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

              {submitError && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSendWhatsApp}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isSubmitting ? 'Recording Request...' : 'Check Availability & Confirm via WhatsApp'}</span>
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
                    <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                      Live Inscription Mockup
                    </span>
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
                    <p className="font-serif text-3xl sm:text-4xl text-[#881337] font-bold drop-shadow-xs">
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
        )}

        {/* =========================================================================
            TAB 3: CORPORATE & WEDDING BULK CONCIERGE
           ========================================================================= */}
        {activeTab === 'corporate' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form: B2B Calculator (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8E2] shadow-sm space-y-8">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-base font-bold text-[#211D1C]">Corporate Gifting & Bulk Order Planner</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Custom logo embossing, bulk tiered discounts, and GST invoice billing.
                  </p>
                </div>
                <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                  {bulkTierDiscount.label}
                </span>
              </div>

              {/* Quantity Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                    Hamper Quantity Required
                  </label>
                  <span className="text-lg font-black text-[#FF2E93]">{bulkQuantity} Hampers</span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={bulkQuantity}
                  onChange={(e) => setBulkQuantity(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#FF2E93]"
                />

                <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                  <span>10 (Tier-1)</span>
                  <span>50 (Silver 15%)</span>
                  <span>100 (Gold 20%)</span>
                  <span>200+ (Platinum 25%)</span>
                  <span>500+ Hampers</span>
                </div>
              </div>

              {/* Target Budget & Company Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Company / Couple Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp / Verma Family"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#E7E2DA] text-xs text-[#211D1C] focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Target Budget per Box</label>
                  <select
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#E7E2DA] text-xs text-[#211D1C] focus:outline-none focus:border-[#FF2E93]"
                  >
                    <option value="₹999 - ₹1,499 per box">Silver Edition (₹999 - ₹1,499)</option>
                    <option value="₹1,500 - ₹2,500 per box">Gold Edition (₹1,500 - ₹2,500)</option>
                    <option value="₹2,500 - ₹4,500 per box">Platinum Royale (₹2,500 - ₹4,500)</option>
                    <option value="₹5,000+ Bespoke VIP">Bespoke VIP Heritage (₹5,000+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. HR / Procurement Lead"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#E7E2DA] text-xs text-[#211D1C] focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="e.g. gifting@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#E7E2DA] text-xs text-[#211D1C] focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleSendCorporateWhatsApp}
                  className="w-full py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Request Instant Official Quotation & Sample Kit</span>
                </button>
              </div>

            </div>

            {/* Right B2B Perks (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold tracking-widest uppercase text-amber-400">
                    Corporate Privilege
                  </span>
                  <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded-full font-mono">
                    GST Ready
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Custom Laser Brand Embossing</h4>
                      <p className="text-stone-300 text-[11px] mt-0.5">
                        Your company logo in 24K gold foil on trunk lids and greeting cards.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Multi-City Direct Dispatch</h4>
                      <p className="text-stone-300 text-[11px] mt-0.5">
                        We deliver individually to 500+ client addresses across PAN-India with tracking.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-400/20 text-rose-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Guaranteed Freshness & Seal</h4>
                      <p className="text-stone-300 text-[11px] mt-0.5">
                        Nitrogen flush sealed artisanal sweets with 45-day ambient shelf life.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[11px] text-stone-300 space-y-1">
                  <p className="font-bold text-white">Need a custom sample box?</p>
                  <p>Our corporate gifting desk dispatches physical tasting samples within 24 hours.</p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
