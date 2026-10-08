import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Send,
  CheckCircle2,
  Gift,
  Video,
  DollarSign,
  Briefcase,
  Instagram,
  Youtube,
  MessageCircle,
  ExternalLink,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BUSINESS_CONFIG } from '../../config/business';

const COLLAB_TYPES = [
  {
    id: 'ugc',
    title: 'Product Promotions & UGC',
    desc: 'Receive complimentary customized hampers & jewels to create aesthetic unboxings and authentic reviews.',
    icon: Video,
    tag: 'Free Gifting',
  },
  {
    id: 'paid',
    title: 'Paid Collaborations',
    desc: 'Contracted commercial creator campaigns with guaranteed fixed reel budgets and recurring bonuses.',
    icon: DollarSign,
    tag: 'Fixed Payout',
  },
  {
    id: 'brand',
    title: 'Brand & Business Partnerships',
    desc: 'Co-branded limited editions, event gift suites, corporate bulk personalized hampers, and agency collaborations.',
    icon: Briefcase,
    tag: 'B2B & Co-Branded',
  },
  {
    id: 'campaign',
    title: 'Creative Campaigns',
    desc: 'Multi-creator festive rollouts, Valentine/Diwali gifting challenges, and viral social trends.',
    icon: Sparkles,
    tag: 'High Visibility',
  },
];

export const CollaborationSection: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [brandOrHandle, setBrandOrHandle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [collabType, setCollabType] = useState('Product Promotions & UGC');
  const [platform, setPlatform] = useState('Instagram');
  const [followerCount, setFollowerCount] = useState('5k - 25k');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [pitch, setPitch] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#FF2E93', '#FFD94A', '#211D1C'],
    });
    setIsSubmitted(true);
  };

  const handleWhatsAppCollab = () => {
    const text = `*Collaboration Inquiry — Divine’s Eternity* ✦
Name: ${fullName || 'Creator'}
Handle: ${brandOrHandle || '@creator'}
Collab Type: ${collabType}
Platform: ${platform} (${followerCount})
Pitch: ${pitch || 'Looking forward to collaborating!'}
Portfolio: ${portfolioUrl || 'N/A'}`;

    const cleanNumber = BUSINESS_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Header Hero */}
      <div className="bg-gradient-to-br from-[#FFF9EB] via-[#FFFDF8] to-[#FFF0F5] border border-[#F3E8E2] rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F3E8E2] text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] shadow-2xs">
            <span>✦</span>
            <span>CREATIVE PARTNERSHIPS</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            Let’s Create Content <span className="font-serif italic text-[#FF2E93]">That Connects</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            We love creating meaningful collaborations with creators, influencers, brands, and businesses. From product promotions and UGC to paid collaborations and creative campaigns, let’s work together to create content that connects.
          </p>
        </div>
      </div>

      {/* 2. Collaboration Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLLAB_TYPES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white border border-[#E7E2DA] rounded-2xl p-5 space-y-3 shadow-2xs hover:border-[#FF2E93] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#FF2E93] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF9EB] text-[#211D1C] border border-[#F5E6CE]">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#211D1C] leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Collaboration Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-[#E7E2DA] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif-heading text-2xl font-bold text-[#211D1C] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF2E93]" />
              Start a Collaboration
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Tell us about your audience and idea. Our brand partnerships team replies within 24 hours.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif-heading text-xl font-bold text-[#211D1C]">
                Proposal Received with Love!
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Thank you, {fullName}! Our collaboration curators will review your handle ({brandOrHandle}) and reach out to discuss gifting or commercial campaign terms.
              </p>
              <button
                onClick={handleWhatsAppCollab}
                className="mt-3 px-6 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs flex items-center gap-2 mx-auto cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Fast-track via WhatsApp Now</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Natasha Singhania"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Social Handle / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandOrHandle}
                    onChange={(e) => setBrandOrHandle(e.target.value)}
                    placeholder="@natashastyles_"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="natasha@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
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
                    placeholder="+91 98201 44521"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Collaboration Type
                  </label>
                  <select
                    value={collabType}
                    onChange={(e) => setCollabType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7E2DA] text-xs bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                  >
                    <option>Product Promotions & UGC</option>
                    <option>Paid Collaborations</option>
                    <option>Brand & Business Partnerships</option>
                    <option>Creative Campaigns</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Primary Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7E2DA] text-xs bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                  >
                    <option>Instagram</option>
                    <option>YouTube</option>
                    <option>LinkedIn / Business</option>
                    <option>Agency / Brand</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Followers / Reach
                  </label>
                  <select
                    value={followerCount}
                    onChange={(e) => setFollowerCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7E2DA] text-xs bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                  >
                    <option>1k - 5k (Emerging)</option>
                    <option>5k - 25k (Growing)</option>
                    <option>25k - 100k (Pro)</option>
                    <option>100k+ (Macro / Celebrity)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Portfolio / Instagram Reel Link
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://instagram.com/reel/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Brief Pitch / Creative Idea
                </label>
                <textarea
                  rows={3}
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="How would you like to showcase Divine’s Eternity gifts? (e.g. Anniversary surprise reel, bridal hamper unboxing, GRWM styling...)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8] focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Collaboration Proposal</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppCollab}
                  className="py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Direct</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Why Collaborate with Divine’s Eternity */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-b from-[#211D1C] to-[#2E2826] text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 border border-stone-700">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD94A]">
              WHY CREATORS LOVE US
            </span>
            <h4 className="font-serif-heading text-xl font-bold text-white">
              Gifts with Genuine Emotional Value
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Unlike generic fast-fashion items, personalized keepsakes generate high organic engagement, heartwarming comment sections, and genuine audience trust.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
                <Gift className="w-5 h-5 text-[#FF2E93] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white">Complimentary Bespoke PR Kits</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Your name engraved in 18k gold or custom portrait miniatures delivered to your doorstep.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
                <DollarSign className="w-5 h-5 text-[#FFD94A] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white">Competitive Creator Rates</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Fixed commercial fees + 15% recurring affiliate revenue on every order generated.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
                <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white">Long-term Brand Ambassador Roles</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Top-performing creators transition into salaried year-round creative ambassadors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
