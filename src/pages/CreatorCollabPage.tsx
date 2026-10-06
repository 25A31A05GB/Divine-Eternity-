import React, { useState } from 'react';
import { Campaign, CreatorApplication } from '../types';
import { INITIAL_CAMPAIGNS } from '../data/campaigns';
import {
  Sparkles,
  Gift,
  DollarSign,
  TrendingUp,
  Instagram,
  Youtube,
  Send,
  CheckCircle2,
  Users,
  Award,
  Video,
  Zap,
  ArrowRight,
  ShieldCheck,
  Tag,
  Copy,
  Check,
  Calendar,
  Layers,
  Heart,
  ExternalLink,
  ChevronRight,
  Star,
  Package,
  Clock,
  Briefcase,
} from 'lucide-react';
import { CreatorPortal } from '../components/creator/CreatorPortal';
import { SEO } from '../components/common/SEO';
import confetti from 'canvas-confetti';

interface CreatorCollabPageProps {
  onRegisterSubmit?: (application: CreatorApplication) => void;
  onExploreProducts?: () => void;
}

export const CreatorCollabPage: React.FC<CreatorCollabPageProps> = ({
  onRegisterSubmit,
  onExploreProducts,
}) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'register' | 'calculator' | 'portal'>('campaigns');
  const [selectedCampaignForApply, setSelectedCampaignForApply] = useState<Campaign | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [youtube, setYoutube] = useState('');
  const [followerCount, setFollowerCount] = useState('10k - 50k');
  const [niche, setNiche] = useState('Fashion & Aesthetic Lifestyle');
  const [proposedCode, setProposedCode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculator State
  const [monthlyReferrals, setMonthlyReferrals] = useState(40);
  const averageOrderVal = 1299;
  const commissionRate = 0.15;
  const estimatedEarnings = Math.round(monthlyReferrals * averageOrderVal * commissionRate);
  const freeGiftsVal = monthlyReferrals > 25 ? 4000 : 2000;

  // Portal State
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleApplyClick = (camp: Campaign) => {
    setSelectedCampaignForApply(camp);
    setActiveTab('register');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !proposedCode) return;

    const newApp: CreatorApplication = {
      id: `app-${Date.now()}`,
      fullName,
      email,
      phone,
      instagramHandle: instagram || undefined,
      tiktokHandle: tiktok || undefined,
      youtubeHandle: youtube || undefined,
      followerCount,
      primaryNiche: niche,
      proposedCode: proposedCode.toUpperCase().replace(/\s+/g, ''),
      prShippingAddress: address,
      city,
      pincode,
      appliedCampaignId: selectedCampaignForApply?.id,
      portfolioUrl: portfolioUrl || undefined,
      message: message || undefined,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      commissionRatePct: 15,
    };

    if (onRegisterSubmit) {
      onRegisterSubmit(newApp);
    }

    // Save to localStorage for demo persistence
    try {
      const stored = localStorage.getItem('de_creator_applications');
      const currentList: CreatorApplication[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('de_creator_applications', JSON.stringify([newApp, ...currentList]));
    } catch (err) {
      console.error(err);
    }

    setIsSubmitted(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const handleCopy = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const creatorUrl = typeof window !== 'undefined' ? window.location.href : 'https://gadgetsdestiny.com/#creator-club';

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#211D1C] py-8 lg:py-12 transition-colors">
      <SEO
        title="Creator Club & Influencer Affiliate Collective — Gadgets Destiny"
        description="Join the Gadgets Destiny Creator Club. Earn 15% lifetime commissions, receive cute PR phone case packages, and collaborate on viral TikTok & Instagram drops."
        keywords="creator club, affiliate marketing, influencer collaboration, PR packages, brand ambassador, gadgets destiny affiliate"
        url={creatorUrl}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: "Creator Club & Influencer Affiliate Hub | Gadgets Destiny",
          description:
            'Join our exclusive affiliate marketing and content creator program. Earn 15% recurring commissions and receive curated PR gift boxes.',
          url: creatorUrl,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF0F3] via-[#FFF9DE]/40 to-[#FFFDF8] border border-[#F3E8E2] p-8 sm:p-12 mb-10 shadow-xs">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-gradient-to-br from-[#FF2E93]/15 to-[#FFD94A]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0F3] text-[#FF2E93] font-bold text-xs uppercase tracking-widest mb-4 border border-[#FFD2DF]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" /> Creator & Affiliate Collective
            </div>

            <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#211D1C] leading-tight mb-4">
              Create, Collaborate & Earn <span className="text-[#FF2E93] italic">15% Lifetime</span> Commissions
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-8">
              Join the <strong>Gadgets Destiny Cute Covers Creator Club</strong>. Unbox seasonal PR phone cases, get paid for viral aesthetic reels, and gift your community a custom 15% discount code.
            </p>

            {/* Quick KPI stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F3E8E2]">
              <div>
                <div className="font-serif-heading text-2xl sm:text-3xl font-black text-[#FF2E93]">
                  ₹4.8 Lakh+
                </div>
                <div className="text-xs text-stone-500">
                  Paid to Creator Partners
                </div>
              </div>

              <div>
                <div className="font-serif-heading text-2xl sm:text-3xl font-black text-[#211D1C]">
                  250+
                </div>
                <div className="text-xs text-stone-500">
                  Active Ambassadors
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="font-serif-heading text-2xl sm:text-3xl font-black text-emerald-600">
                  48 Hours
                </div>
                <div className="text-xs text-stone-500">
                  Fast PR Box Dispatch
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB CONTROLS */}
        {/* ============================================================ */}
        <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#F3E8E2] scrollbar-none">
          {[
            { id: 'campaigns', label: 'Upcoming Brand Campaigns', icon: Video },
            { id: 'register', label: 'Creator Club Registration', icon: Users },
            { id: 'calculator', label: 'Commission Calculator', icon: DollarSign },
            { id: 'portal', label: 'Affiliate Dashboard Preview', icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#211D1C] text-white shadow-md'
                    : 'bg-white text-stone-700 hover:text-[#FF2E93] hover:bg-[#FFF0F3] border border-[#F3E8E2]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFD94A]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: UPCOMING CAMPAIGNS */}
        {/* ============================================================ */}
        {activeTab === 'campaigns' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#231F20] dark:text-white">
                  Active & Upcoming Brand Campaigns
                </h2>
                <p className="text-xs sm:text-sm text-[#7A7276] dark:text-[#A8A0A5]">
                  Select a live campaign to receive complimentary personalized PR products and guaranteed sponsorship payouts.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('register')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#F0508C] text-white hover:bg-[#D93D78] shadow-md transition-all shrink-0"
              >
                Apply as General Creator <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {INITIAL_CAMPAIGNS.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-white dark:bg-[#161215] rounded-3xl border border-[#EDE2DB] dark:border-[#2A2328] p-6 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group"
                >
                  {/* Top gradient strip */}
                  <div className={`h-2.5 w-full bg-gradient-to-r ${camp.coverGradient} absolute top-0 left-0 right-0`} />

                  <div>
                    <div className="flex items-center justify-between mt-1 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0508C]/10 text-[#F0508C]">
                        {camp.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          camp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${camp.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        {camp.status}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white group-hover:text-[#F0508C] transition-colors mb-2">
                      {camp.title}
                    </h3>

                    <p className="text-xs text-[#5E555B] dark:text-[#B5ABB1] mb-4 line-clamp-2">
                      {camp.tagline}
                    </p>

                    {/* Sponsorship details */}
                    <div className="p-3.5 rounded-2xl bg-[#FFF9F5] dark:bg-[#201A1E] border border-[#F3E5DD] dark:border-[#2D242B] space-y-2 mb-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#7A7276] flex items-center gap-1.5 font-medium">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Payout / Reel:
                        </span>
                        <span className="font-black text-[#231F20] dark:text-white">
                          ₹{camp.payoutPerReel.toLocaleString('en-IN')} + 15% Comm.
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#7A7276] flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-purple-500" /> Campaign Period:
                        </span>
                        <span className="font-bold text-[#231F20] dark:text-white">
                          {camp.startDate} - {camp.endDate}
                        </span>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="space-y-1.5 mb-5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A7276] dark:text-[#A8A0A5]">
                        Required Deliverables:
                      </div>
                      {camp.deliverables.map((del, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#3B3439] dark:text-[#D1C7CD]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F0508C] shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>

                    {/* Free PR Items */}
                    <div className="mb-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A7276] dark:text-[#A8A0A5] mb-1.5 flex items-center gap-1">
                        <Gift className="w-3 h-3 text-[#F0508C]" /> Free PR Package Includes:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {camp.freePrProducts.map((prod, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#FAF2EE] dark:bg-[#201A1E] text-[#231F20] dark:text-white border border-[#EDE2DB] dark:border-[#2C242A] flex items-center gap-1"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-[#F0508C]" /> {prod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EDE2DB] dark:border-[#2A2328] flex items-center justify-between">
                    <div className="text-[11px] text-[#7A7276]">
                      <span className="font-bold text-[#F0508C]">{camp.slotsAvailable - camp.slotsFilled}</span> slots left
                    </div>

                    <button
                      onClick={() => handleApplyClick(camp)}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-[#231F20] text-white dark:bg-white dark:text-[#231F20] hover:bg-[#F0508C] dark:hover:bg-[#F0508C] dark:hover:text-white transition-all shadow-xs"
                    >
                      Apply for Campaign →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: REGISTRATION FORM */}
        {/* ============================================================ */}
        {activeTab === 'register' && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <div className="bg-white dark:bg-[#161215] rounded-3xl border border-[#EDE2DB] dark:border-[#2A2328] p-6 sm:p-10 shadow-md">
              
              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#231F20] dark:text-white">
                    Application Received
                  </h3>
                  <p className="text-sm text-[#7A7276] dark:text-[#A8A0A5] max-w-md mx-auto">
                    Welcome to the <strong>Divine’s Eternity Creator Family</strong>, {fullName}! Our influencer relations team will review your channels and email you within <strong>24 to 48 hours</strong> with your PR shipment tracking and custom follower promo code: <strong className="text-[#F0508C]">{proposedCode}</strong>.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setActiveTab('portal');
                      }}
                      className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#F0508C] text-white hover:bg-[#D93D78] shadow-md transition-all"
                    >
                      View Creator Portal Preview
                    </button>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setActiveTab('campaigns');
                      }}
                      className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#FAF2EE] dark:bg-[#201A1E] text-[#231F20] dark:text-white"
                    >
                      Explore More Campaigns
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8 pb-6 border-b border-[#EDE2DB] dark:border-[#2A2328]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#F0508C] uppercase tracking-wider mb-1">
                      <Sparkles className="w-4 h-4 text-[#FFD94A]" /> Creator & Affiliate Application
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231F20] dark:text-white">
                      Join Divine’s Eternity Club
                    </h2>
                    <p className="text-xs sm:text-sm text-[#7A7276] dark:text-[#A8A0A5] mt-1">
                      {selectedCampaignForApply
                        ? `Applying specifically for: "${selectedCampaignForApply.title}"`
                        : 'Receive PR packages, earn 15% recurring commissions, and collaborate on viral gift drops.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmitApplication} className="space-y-6 text-xs sm:text-sm">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-[#231F20] dark:text-white block mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Natasha Singhania"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#231F20] dark:text-white block mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="natasha@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Social Handles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-[#231F20] dark:text-white block mb-1.5">
                          Instagram Handle *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="@yourhandle"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#231F20] dark:text-white block mb-1.5">
                          TikTok / YouTube
                        </label>
                        <input
                          type="text"
                          placeholder="@handle or Channel URL"
                          value={tiktok}
                          onChange={(e) => setTiktok(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#231F20] dark:text-white block mb-1.5">
                          Follower Size
                        </label>
                        <select
                          value={followerCount}
                          onChange={(e) => setFollowerCount(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs"
                        >
                          <option value="1k - 5k (Nano Creator)">1k - 5k (Nano Creator)</option>
                          <option value="5k - 20k (Micro Creator)">5k - 20k (Micro Creator)</option>
                          <option value="20k - 100k (Mid-Tier)">20k - 100k (Mid-Tier)</option>
                          <option value="100k+ (Macro / Icon)">100k+ (Macro / Icon)</option>
                        </select>
                      </div>
                    </div>

                    {/* Niche & Desired Promo Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-[#231F20] dark:text-white block mb-1.5">
                          Primary Content Niche
                        </label>
                        <select
                          value={niche}
                          onChange={(e) => setNiche(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs"
                        >
                          <option value="Fashion & Aesthetic Lifestyle">Fashion & Aesthetic Lifestyle</option>
                          <option value="Beauty, Makeup & GRWM">Beauty, Makeup & GRWM</option>
                          <option value="Couples, Romance & Gifting">Couples, Romance & Gifting</option>
                          <option value="College, Vlogs & Unboxing">College, Vlogs & Unboxing</option>
                          <option value="Luxury Accessories & Tech">Luxury Accessories & Tech</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-[#231F20] dark:text-white block mb-1.5">
                          Desired 15% Follower Discount Code *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. NATASHA15"
                          value={proposedCode}
                          onChange={(e) => setProposedCode(e.target.value.toUpperCase())}
                          className="w-full px-4 py-2.5 rounded-xl font-mono uppercase bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* PR Shipping Address */}
                    <div>
                      <label className="font-bold text-[#231F20] dark:text-white block mb-1.5">
                        PR Package Delivery Address (Street & House / Apt) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Where should we ship your complimentary personalized phone cases & gift sets?"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs mb-3"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="City (e.g. Mumbai, Delhi, Bengaluru)"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Pincode (e.g. 400050)"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-[#231F20] dark:text-white block mb-1.5">
                        Tell us why you'd love to collaborate (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Share your ideas, video concepts, or favorite Divine's Eternity product..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white text-xs"
                      />
                    </div>

                    <div className="pt-4 border-t border-[#EDE2DB] dark:border-[#2A2328] flex items-center justify-between">
                      <div className="text-xs text-[#7A7276] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Your contact & shipping details are 100% private.</span>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#F0508C] text-white hover:bg-[#D93D78] shadow-lg shadow-[#F0508C]/25 transition-all transform active:scale-95"
                      >
                        Submit Application <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: COMMISSION CALCULATOR */}
        {/* ============================================================ */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-white dark:bg-[#161215] rounded-3xl border border-[#EDE2DB] dark:border-[#2A2328] p-8 sm:p-12 shadow-sm">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2 border border-emerald-200 dark:border-emerald-800">
                  <DollarSign className="w-3.5 h-3.5" /> Passive Affiliate Income Engine
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231F20] dark:text-white">
                  Estimate Your Monthly Earnings
                </h2>
                <p className="text-xs sm:text-sm text-[#7A7276] dark:text-[#A8A0A5] mt-1">
                  See how much you can earn every month simply by sharing your unique discount code with your followers.
                </p>
              </div>

              {/* Slider Controls */}
              <div className="space-y-6 max-w-2xl mx-auto mb-10">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-[#231F20] dark:text-white">Monthly Orders Referred by Your Followers:</span>
                  <span className="font-mono text-lg text-[#F0508C] px-3 py-1 bg-[#F0508C]/10 rounded-xl">
                    {monthlyReferrals} Orders
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={monthlyReferrals}
                  onChange={(e) => setMonthlyReferrals(Number(e.target.value))}
                  className="w-full accent-[#F0508C] cursor-pointer h-2 bg-[#F3E2DA] dark:bg-[#2C2329] rounded-lg"
                />

                <div className="flex justify-between text-xs text-[#7A7276] font-mono">
                  <span>5 orders (Casual)</span>
                  <span>50 orders (Active)</span>
                  <span>200 orders (Viral Star)</span>
                </div>
              </div>

              {/* Earnings Result Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 border-t border-[#EDE2DB] dark:border-[#2A2328]">
                <div className="p-5 rounded-2xl bg-[#FFF8F4] dark:bg-[#201A1E] border border-[#F3E2DA] dark:border-[#2D2329] text-center">
                  <div className="text-xs text-[#7A7276] dark:text-[#A8A0A5] font-semibold mb-1">
                    Monthly Cash Payout
                  </div>
                  <div className="font-serif text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{estimatedEarnings.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    Direct bank / UPI transfer on the 1st of every month
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFF8F4] dark:bg-[#201A1E] border border-[#F3E2DA] dark:border-[#2D2329] text-center">
                  <div className="text-xs text-[#7A7276] dark:text-[#A8A0A5] font-semibold mb-1">
                    Complimentary PR Gifts
                  </div>
                  <div className="font-serif text-3xl font-black text-[#F0508C]">
                    ₹{freeGiftsVal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    Free cases, jewelry & rose domes each drop
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFF8F4] dark:bg-[#201A1E] border border-[#F3E2DA] dark:border-[#2D2329] text-center">
                  <div className="text-xs text-[#7A7276] dark:text-[#A8A0A5] font-semibold mb-1">
                    Annual Potential
                  </div>
                  <div className="font-serif text-3xl font-black text-[#231F20] dark:text-white">
                    ₹{(estimatedEarnings * 12).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    Plus exclusive VIP holiday bonuses
                  </div>
                </div>
              </div>
            </div>

            {/* Collab Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  tier: 'Seed Creator',
                  req: '1k - 10k Followers',
                  perks: ['1 Free PR Case per Season', '15% Commission on all sales', '15% follower discount code', 'Access to UGC campaign briefs'],
                  badgeColor: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
                },
                {
                  tier: 'Gold Ambassador',
                  req: '10k - 50k Followers',
                  perks: ['2 Free PR Items (Case + Jewelry)', '18% Commission rate', 'Guaranteed sponsorship fees per reel', 'Featured on our Instagram & Website'],
                  badgeColor: 'bg-[#FFD94A]/20 text-[#855800] dark:text-[#FFD94A] border border-[#FFD94A]/40',
                },
                {
                  tier: 'VIP Icon Partner',
                  req: '50k+ Followers',
                  perks: ['Co-branded Product Capsule Drop', '20% Lifetime Commission', 'Dedicated Influencer Manager', 'Quarterly luxury gift hamper boxes'],
                  badgeColor: 'bg-[#F0508C]/15 text-[#F0508C] border border-[#F0508C]/30',
                },
              ].map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#161215] rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.badgeColor}`}>
                      {t.tier}
                    </span>
                    <span className="text-xs text-[#7A7276] font-medium">{t.req}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#554C52] dark:text-[#D1C7CD]">
                    {t.perks.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F0508C] shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: CREATOR PORTAL & AFFILIATE HUB */}
        {/* ============================================================ */}
        {activeTab === 'portal' && (
          <div className="animate-fadeIn">
            <CreatorPortal onExploreProducts={onExploreProducts} />
          </div>
        )}

      </div>
    </div>
  );
};
