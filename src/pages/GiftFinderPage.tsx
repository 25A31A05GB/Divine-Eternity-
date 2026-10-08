import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';
import { Sparkles, Gift, Users, Calendar, IndianRupee, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

interface GiftFinderPageProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

const RECIPIENTS = [
  { id: 'her', label: 'For Her', icon: '💖', subtitle: 'Wife, Girlfriend, Sister, Mom' },
  { id: 'him', label: 'For Him', icon: '🎁', subtitle: 'Husband, Boyfriend, Brother, Dad' },
  { id: 'couple', label: 'For Couples', icon: '💑', subtitle: 'Anniversary, Wedding, Engagement' },
  { id: 'friends', label: 'Friends & Colleagues', icon: '✨', subtitle: 'Besties, Teammates, Housewarming' },
];

const OCCASIONS = [
  { id: 'rakhi', label: 'Raksha Bandhan', icon: '🪡' },
  { id: 'diwali', label: 'Diwali', icon: '🪔' },
  { id: 'valentines', label: "Valentine's Day", icon: '🌹' },
  { id: 'birthday', label: 'Birthday', icon: '🎂' },
  { id: 'anniversary', label: 'Anniversary', icon: '💍' },
  { id: 'just_because', label: 'Just Because / General', icon: '🌸' },
];

const BUDGETS = [
  { id: 'under_500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500_1500', label: '₹500 - ₹1,500', min: 500, max: 1500 },
  { id: '1500_3000', label: '₹1,500 - ₹3,000', min: 1500, max: 3000 },
  { id: 'above_3000', label: 'Above ₹3,000', min: 3000, max: 99999 },
];

export const GiftFinderPage: React.FC<GiftFinderPageProps> = ({
  products,
  onProductClick,
  onQuickView,
  onNavigate,
}) => {
  const [step, setStep] = useState<number>(1);
  const [recipient, setRecipient] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('');
  const [budget, setBudget] = useState<string>('');

  const handleReset = () => {
    setStep(1);
    setRecipient('');
    setOccasion('');
    setBudget('');
  };

  // Compute matches
  const matchedProducts = products.filter((p) => {
    // 1. Budget filter
    if (budget) {
      const bObj = BUDGETS.find((b) => b.id === budget);
      if (bObj) {
        if (p.price < bObj.min || p.price > bObj.max) return false;
      }
    }

    // 2. Occasion filter
    if (occasion && occasion !== 'just_because') {
      const occList = p.occasions || p.product_occasions || [];
      const hasMatch = occList.some(
        (o) => o.toLowerCase() === occasion || o.toLowerCase().includes(occasion)
      );
      if (!hasMatch) {
        const nameDesc = (p.name + ' ' + p.description).toLowerCase();
        if (!nameDesc.includes(occasion)) {
          // Allow fallback to best sellers or customizable items if pool is small
          if (!p.isBestSeller && !p.allowsPersonalization) return false;
        }
      }
    }

    // 3. Recipient filter
    if (recipient === 'him' && p.category === 'Hair Accessories') return false;

    return true;
  });

  return (
    <div className="py-8 sm:py-16 bg-[#FFFDF8] min-h-screen text-[#211D1C]">
      <SEO
        title="3-Step Smart Gift Finder Quiz — Divine’s Eternity"
        description="Find the perfect handcrafted personalized keepsake in 3 easy steps by recipient, occasion, and budget."
      />

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#FF2E93] text-[10px] font-extrabold uppercase tracking-widest border border-[#F3E8E2]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
            <span>Smart Gift Assistant</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211D1C]">
            Find the Perfect Gift in 3 Steps
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Answer 3 quick questions and let our studio curation engine discover bespoke handcrafted gifts matching your loved one.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`h-2 rounded-full w-full transition-all duration-500 ${
                  step >= s ? 'bg-[#FF2E93]' : 'bg-stone-200'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Quiz Steps Container */}
        {step <= 3 && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#F3E8E2] shadow-sm space-y-8">
            {/* Step 1: Recipient */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF2E93]">Step 1 of 3</span>
                  <h2 className="font-serif text-2xl font-bold text-[#211D1C]">Who are you shopping for?</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {RECIPIENTS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setRecipient(item.id);
                        setStep(2);
                      }}
                      className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all cursor-pointer ${
                        recipient === item.id
                          ? 'border-[#FF2E93] bg-[#FFF0F5] shadow-xs'
                          : 'border-[#E7E2DA] hover:border-[#FF2E93] hover:bg-[#FFFDF8]'
                      }`}
                    >
                      <span className="text-3xl">{item.icon}</span>
                      <div className="space-y-0.5">
                        <div className="font-serif font-bold text-base text-[#211D1C]">{item.label}</div>
                        <div className="text-xs text-stone-500">{item.subtitle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Occasion */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF2E93]">Step 2 of 3</span>
                  <h2 className="font-serif text-2xl font-bold text-[#211D1C]">What is the occasion?</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {OCCASIONS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setOccasion(item.id);
                        setStep(3);
                      }}
                      className={`p-4 rounded-2xl border text-center space-y-2 transition-all cursor-pointer ${
                        occasion === item.id
                          ? 'border-[#FF2E93] bg-[#FFF0F5] shadow-xs'
                          : 'border-[#E7E2DA] hover:border-[#FF2E93] hover:bg-[#FFFDF8]'
                      }`}
                    >
                      <span className="text-2xl block">{item.icon}</span>
                      <div className="font-serif font-bold text-xs text-[#211D1C]">{item.label}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-[#F3E8E2]">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-stone-500 hover:text-[#211D1C]"
                  >
                    ← Back to Recipient
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Budget */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF2E93]">Step 3 of 3</span>
                  <h2 className="font-serif text-2xl font-bold text-[#211D1C]">Select your budget range</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BUDGETS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setBudget(item.id);
                        setStep(4); // Show results
                      }}
                      className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        budget === item.id
                          ? 'border-[#FF2E93] bg-[#FFF0F5] shadow-xs'
                          : 'border-[#E7E2DA] hover:border-[#FF2E93] hover:bg-[#FFFDF8]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-serif font-bold text-base text-[#211D1C]">{item.label}</div>
                        <div className="text-xs text-stone-500">GST Inclusive Pricing</div>
                      </div>
                      <IndianRupee className="w-5 h-5 text-[#FF2E93]" />
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-[#F3E8E2]">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-stone-500 hover:text-[#211D1C]"
                  >
                    ← Back to Occasion
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results View */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#F3E8E2] shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#211D1C]">
                  Found {matchedProducts.length} Matching Keepsakes
                </h2>
                <div className="flex flex-wrap gap-2 text-xs text-stone-600 mt-1">
                  <span className="bg-[#FFF0F5] text-[#FF2E93] px-2.5 py-0.5 rounded-full font-bold">
                    Recipient: {RECIPIENTS.find((r) => r.id === recipient)?.label}
                  </span>
                  <span className="bg-[#FFF0F5] text-[#FF2E93] px-2.5 py-0.5 rounded-full font-bold">
                    Occasion: {OCCASIONS.find((o) => o.id === occasion)?.label}
                  </span>
                  <span className="bg-[#FFF0F5] text-[#FF2E93] px-2.5 py-0.5 rounded-full font-bold">
                    Budget: {BUDGETS.find((b) => b.id === budget)?.label}
                  </span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="text-xs font-bold text-[#FF2E93] hover:bg-[#FFF0F5] px-4 py-2 rounded-full border border-[#FF2E93] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Quiz</span>
              </button>
            </div>

            {matchedProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-[#F3E8E2] text-center space-y-4">
                <Gift className="w-12 h-12 text-[#FF2E93] mx-auto opacity-50" />
                <h3 className="font-serif text-lg font-bold text-[#211D1C]">No direct matches for this combination</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try widening your budget range or exploring our full artisanal collection.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-[#211D1C] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer"
                >
                  Restart Quiz
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {matchedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={onProductClick}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
