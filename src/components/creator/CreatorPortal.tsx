import React, { useState, useMemo } from 'react';
import { Campaign, CreatorApplication } from '../../types';
import { INITIAL_CAMPAIGNS, INITIAL_CREATOR_APPLICATIONS } from '../../data/campaigns';
import {
  Sparkles,
  DollarSign,
  TrendingUp,
  Instagram,
  Youtube,
  Send,
  CheckCircle2,
  Users,
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
  QrCode,
  Download,
  Share2,
  Wallet,
  ArrowUpRight,
  Filter,
  CheckSquare,
  AlertCircle,
  BarChart3,
  X,
  Plus,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreatorPortalProps {
  onExploreProducts?: () => void;
}

export const CreatorPortal: React.FC<CreatorPortalProps> = ({ onExploreProducts }) => {
  // Creator Applications / Registered Creators State
  const [creators, setCreators] = useState<CreatorApplication[]>(() => {
    try {
      const stored = localStorage.getItem('de_creator_applications');
      if (stored) {
        const parsed = JSON.parse(stored);
        return [...parsed, ...INITIAL_CREATOR_APPLICATIONS.filter((a) => !parsed.some((p: any) => p.id === a.id))];
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CREATOR_APPLICATIONS;
  });

  // Current Logged-in Creator (Default to first approved demo creator)
  const [currentCreatorId, setCurrentCreatorId] = useState<string>(
    INITIAL_CREATOR_APPLICATIONS[0]?.id || 'app-101'
  );

  const activeCreator = useMemo(() => {
    return creators.find((c) => c.id === currentCreatorId) || creators[0];
  }, [creators, currentCreatorId]);

  // Main portal view tabs
  const [portalTab, setPortalTab] = useState<'dashboard' | 'campaigns' | 'signup' | 'assets' | 'payouts'>('dashboard');
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [campaignFilter, setCampaignFilter] = useState<string>('All');
  const [appliedCampaignIds, setAppliedCampaignIds] = useState<string[]>(['camp-1']);

  // Copy feedback state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);

  // New Sign-up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpInstagram, setSignUpInstagram] = useState('');
  const [signUpTiktok, setSignUpTiktok] = useState('');
  const [signUpFollowers, setSignUpFollowers] = useState('10k - 50k');
  const [signUpNiche, setSignUpNiche] = useState('Fashion & Aesthetic Lifestyle');
  const [signUpCode, setSignUpCode] = useState('');
  const [signUpAddress, setSignUpAddress] = useState('');
  const [signUpCity, setSignUpCity] = useState('');
  const [signUpPincode, setSignUpPincode] = useState('');
  const [signUpUpi, setSignUpUpi] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Simulated referral conversions history
  const referralTransactions = [
    { id: 'REF-9921', date: 'Today, 2:15 PM', item: 'Pearl Bliss Beaded Bracelet Case', amount: 649, codeUsed: activeCreator?.proposedCode || 'NATASHA15', comm: 97.35, status: 'Credited' },
    { id: 'REF-9918', date: 'Yesterday, 8:40 PM', item: '18k Gold Cursive Name Necklace (2x)', amount: 2398, codeUsed: activeCreator?.proposedCode || 'NATASHA15', comm: 359.70, status: 'Credited' },
    { id: 'REF-9904', date: '2 days ago', item: 'Celestial Chrome Heart Mirror Case', amount: 699, codeUsed: activeCreator?.proposedCode || 'NATASHA15', comm: 104.85, status: 'Credited' },
    { id: 'REF-9882', date: '4 days ago', item: 'Preserved Rose Glass Dome + Music Plaque', amount: 2498, codeUsed: activeCreator?.proposedCode || 'NATASHA15', comm: 374.70, status: 'Credited' },
    { id: 'REF-9861', date: '6 days ago', item: 'Zipper Wallet Quilted Phone Case', amount: 749, codeUsed: activeCreator?.proposedCode || 'NATASHA15', comm: 112.35, status: 'Credited' },
  ];

  const totalReferralEarnings = referralTransactions.reduce((sum, r) => sum + r.comm, 16300);

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

  const handleApplyToCampaign = (campaignId: string) => {
    if (!appliedCampaignIds.includes(campaignId)) {
      setAppliedCampaignIds((prev) => [...prev, campaignId]);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, slotsFilled: Math.min(c.slotsAvailable, c.slotsFilled + 1) } : c))
      );
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpCode) return;

    const newCreator: CreatorApplication = {
      id: `app-${Date.now()}`,
      fullName: signUpName,
      email: signUpEmail,
      phone: signUpPhone,
      instagramHandle: signUpInstagram || undefined,
      tiktokHandle: signUpTiktok || undefined,
      followerCount: signUpFollowers,
      primaryNiche: signUpNiche,
      proposedCode: signUpCode.toUpperCase().replace(/\s+/g, ''),
      prShippingAddress: signUpAddress,
      city: signUpCity,
      pincode: signUpPincode,
      status: 'Approved',
      createdAt: new Date().toISOString().split('T')[0],
      commissionRatePct: 15,
    };

    setCreators((prev) => [newCreator, ...prev]);
    setCurrentCreatorId(newCreator.id);

    try {
      localStorage.setItem('de_creator_applications', JSON.stringify([newCreator, ...creators]));
    } catch (err) {
      console.error(err);
    }

    setSignUpSuccess(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });

    setTimeout(() => {
      setSignUpSuccess(false);
      setPortalTab('dashboard');
    }, 1800);
  };

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setPayoutRequested(false), 4000);
  };

  const filteredCampaigns = useMemo(() => {
    if (campaignFilter === 'All') return campaigns;
    return campaigns.filter((c) => c.status === campaignFilter);
  }, [campaigns, campaignFilter]);

  return (
    <div className="bg-white dark:bg-[#120F12] rounded-3xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm overflow-hidden text-[#231F20] dark:text-[#F8F5F2] transition-colors">
      
      {/* Top Banner & Account Bar */}
      <div className="bg-gradient-to-r from-[#FFF0F5] via-[#FFF9F5] to-[#F5F2FF] dark:from-[#1D141A] dark:via-[#161215] dark:to-[#1B1622] p-6 sm:p-8 border-b border-[#F0E5DF] dark:border-[#2A2328]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F0508C] to-[#FFD94A] flex items-center justify-center text-white font-serif font-bold text-2xl shadow-lg shadow-[#F0508C]/25 shrink-0">
              {activeCreator?.fullName?.slice(0, 2).toUpperCase() || 'DE'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#231F20] dark:text-white">
                  {activeCreator?.fullName || 'Creator Partner'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F0508C]/15 text-[#F0508C] border border-[#F0508C]/25 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#F0508C]" /> Verified Ambassador
                </span>
              </div>
              <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5] flex items-center gap-2 mt-0.5">
                <span>{activeCreator?.instagramHandle || '@creator'}</span>
                <span>•</span>
                <span>Niche: <strong>{activeCreator?.primaryNiche || 'Lifestyle'}</strong></span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">15% Lifetime Base Rate</span>
              </p>
            </div>
          </div>

          {/* Quick Account Switcher & Sign Up CTA */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-[#1E191D] p-1.5 rounded-2xl border border-[#E8D8D0] dark:border-[#382F34] text-xs">
              <span className="text-[11px] font-bold text-[#7A7276] px-2">Account:</span>
              <select
                value={currentCreatorId}
                onChange={(e) => {
                  setCurrentCreatorId(e.target.value);
                  setPortalTab('dashboard');
                }}
                className="bg-transparent text-xs font-bold text-[#231F20] dark:text-white outline-none cursor-pointer pr-2"
              >
                {creators.map((c) => (
                  <option key={c.id} value={c.id} className="text-black dark:text-white dark:bg-[#161215]">
                    {c.fullName} ({c.proposedCode})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setPortalTab('signup')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#F0508C] text-white hover:bg-[#D93D78] shadow-md shadow-[#F0508C]/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New Affiliate Sign-Up
            </button>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-[#F0E0E6] dark:border-[#2C2228] scrollbar-none">
          {[
            { id: 'dashboard', label: 'Commission Analytics', icon: BarChart3 },
            { id: 'campaigns', label: 'Brand Campaigns & Briefs', icon: Video },
            { id: 'signup', label: 'Program Registration', icon: Users },
            { id: 'assets', label: 'Promo Kit & Media Assets', icon: Download },
            { id: 'payouts', label: 'Payouts & Banking', icon: Wallet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = portalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPortalTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#231F20] text-white dark:bg-white dark:text-[#231F20] shadow-md'
                    : 'bg-white/80 dark:bg-[#1C171A] text-[#6E646A] dark:text-[#A8A0A5] hover:bg-white hover:text-[#F0508C] border border-[#EFE4DE] dark:border-[#2D252A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFD94A] dark:text-[#F0508C]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: COMMISSION ANALYTICS & REFERRAL TRACKER */}
      {/* ============================================================ */}
      {portalTab === 'dashboard' && (
        <div className="p-6 sm:p-8 space-y-8 animate-fadeIn">
          {/* Top Referral Code & Bio Link Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Custom Promo Code Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-white dark:from-[#1A1519] dark:to-[#161215] border border-[#EDE2DB] dark:border-[#2A2328] relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A7276] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#F0508C]" /> Your 15% Follower Promo Code
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active & Synced
                </span>
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-[#1E191D] p-3 rounded-xl border border-[#E8D8D0] dark:border-[#382F34] mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-lg sm:text-xl text-[#F0508C] tracking-wider">
                    {activeCreator?.proposedCode || 'NATASHA15'}
                  </span>
                  <span className="text-xs text-gray-400">(-15% Off storewide)</span>
                </div>
                <button
                  onClick={() => handleCopy(activeCreator?.proposedCode || 'NATASHA15', 'code')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#F0508C]/10 hover:bg-[#F0508C] text-[#F0508C] hover:text-white transition-all"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#7A7276] mt-2">
                Share this coupon in your Reel captions, TikTok bio, and YouTube descriptions.
              </p>
            </div>

            {/* Direct Bio Link Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-white dark:from-[#1A1519] dark:to-[#161215] border border-[#EDE2DB] dark:border-[#2A2328] relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A7276] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-purple-500" /> Auto-Discount Tracking Bio Link
                </span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                  Cookie 30 Days
                </span>
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-[#1E191D] p-3 rounded-xl border border-[#E8D8D0] dark:border-[#382F34] mt-2">
                <div className="font-mono text-xs text-[#231F20] dark:text-white truncate max-w-[240px]">
                  https://divineseternity.com/?ref={activeCreator?.proposedCode?.toLowerCase() || 'natasha15'}
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `https://divineseternity.com/?ref=${activeCreator?.proposedCode?.toLowerCase() || 'natasha15'}`,
                      'link'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-500/10 hover:bg-purple-600 text-purple-600 hover:text-white transition-all"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#7A7276] mt-2">
                Direct click applies the 15% discount automatically at checkout.
              </p>
            </div>
          </div>

          {/* Key Commission Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Earnings */}
            <div className="bg-white dark:bg-[#161215] p-5 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-xs">
              <div className="flex items-center justify-between text-[#7A7276] text-xs font-bold uppercase mb-2">
                <span>Total Commissions</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="font-serif text-3xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{totalReferralEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
                <ArrowUpRight className="w-3 h-3" /> +₹1,050 this week
              </div>
            </div>

            {/* Referred Orders */}
            <div className="bg-white dark:bg-[#161215] p-5 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-xs">
              <div className="flex items-center justify-between text-[#7A7276] text-xs font-bold uppercase mb-2">
                <span>Referred Orders</span>
                <Package className="w-4 h-4 text-[#F0508C]" />
              </div>
              <div className="font-serif text-3xl font-black text-[#231F20] dark:text-white">
                68 Orders
              </div>
              <div className="text-[11px] text-[#7A7276] mt-1">
                From 1,428 unique link clicks (4.7% CVR)
              </div>
            </div>

            {/* Next Payout Balance */}
            <div className="bg-white dark:bg-[#161215] p-5 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-xs">
              <div className="flex items-center justify-between text-[#7A7276] text-xs font-bold uppercase mb-2">
                <span>Available Balance</span>
                <Wallet className="w-4 h-4 text-purple-500" />
              </div>
              <div className="font-serif text-3xl font-black text-[#F0508C]">
                ₹4,850
              </div>
              <div className="text-[11px] text-[#7A7276] mt-1">
                Auto-releases on the 1st of every month
              </div>
            </div>

            {/* PR Shipment Status */}
            <div className="bg-white dark:bg-[#161215] p-5 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-xs">
              <div className="flex items-center justify-between text-[#7A7276] text-xs font-bold uppercase mb-2">
                <span>Next PR Box</span>
                <Sparkles className="w-4 h-4 text-[#FFD94A]" />
              </div>
              <div className="text-sm font-bold text-[#231F20] dark:text-white mt-1">
                Valentine Drops Box
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-full mt-2 border border-sky-200 dark:border-sky-800">
                <Clock className="w-3 h-3" /> Shipped via BlueDart
              </div>
            </div>
          </div>

          {/* Instant Payout Action Banner */}
          <div className="p-5 rounded-2xl bg-[#FFF8F4] dark:bg-[#1E191D] border border-[#F3E2DA] dark:border-[#2C2229] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#231F20] dark:text-white">
                  Available Payout: ₹4,850 (UPI ID: {activeCreator?.email ? `${activeCreator.email.split('@')[0]}@okaxis` : 'creator@upi'})
                </h4>
                <p className="text-xs text-[#7A7276]">
                  Instant withdrawals take less than 15 minutes to reflect in your bank.
                </p>
              </div>
            </div>

            <button
              onClick={handleRequestPayout}
              disabled={payoutRequested}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all shrink-0 disabled:opacity-50"
            >
              {payoutRequested ? (
                <>
                  <Check className="w-4 h-4" /> Payout Initiated!
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Request Instant Payout
                </>
              )}
            </button>
          </div>

          {/* Real-time Referral Orders Log Table with Zebra Striping */}
          <div className="bg-white dark:bg-[#161215] rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#EDE2DB] dark:border-[#2A2328] flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-[#231F20] dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#F0508C]" /> Recent Follower Conversions & Earnings Log
                </h4>
                <p className="text-xs text-[#7A7276]">
                  Real-time feed of purchases made using code {activeCreator?.proposedCode || 'NATASHA15'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                15% Commission
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF2EE] dark:bg-[#1C171A] text-[#7A7276] dark:text-[#A8A0A5] font-bold uppercase tracking-wider border-b border-[#EDE2DB] dark:border-[#2A2328]">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Time & Date</th>
                    <th className="py-3 px-4">Item Ordered</th>
                    <th className="py-3 px-4">Order Value</th>
                    <th className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-300">Your 15% Cut</th>
                    <th className="py-3 px-4 text-right">Payout Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE2DB] dark:divide-[#2A2328]">
                  {referralTransactions.map((tx, idx) => (
                    <tr
                      key={tx.id}
                      className={`transition-colors hover:bg-[#FDF0F4] dark:hover:bg-[#221A20] ${
                        idx % 2 === 0
                          ? 'bg-white dark:bg-[#161215]'
                          : 'bg-[#FAF5F2]/80 dark:bg-[#1A1519]/70'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#231F20] dark:text-white">
                        {tx.id}
                      </td>
                      <td className="py-3.5 px-4 text-[#7A7276]">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#231F20] dark:text-white">
                        {tx.item}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#231F20] dark:text-white">
                        ₹{tx.amount}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                        +₹{tx.comm.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <Check className="w-3 h-3" /> {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: BRAND CAMPAIGNS & COLLAB BRIEFS */}
      {/* ============================================================ */}
      {portalTab === 'campaigns' && (
        <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#231F20] dark:text-white">
                Upcoming Brand Campaigns & Gifting Drops
              </h3>
              <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                Apply with 1-click to receive free PR products and base sponsorship fees per video.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#7A7276]">Status:</span>
              {['All', 'Active', 'Upcoming'].map((st) => (
                <button
                  key={st}
                  onClick={() => setCampaignFilter(st)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    campaignFilter === st
                      ? 'bg-[#F0508C] text-white'
                      : 'bg-[#FAF2EE] dark:bg-[#201A1E] text-[#6E646A]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCampaigns.map((camp) => {
              const isApplied = appliedCampaignIds.includes(camp.id);
              return (
                <div
                  key={camp.id}
                  className="bg-white dark:bg-[#161215] rounded-3xl border border-[#EDE2DB] dark:border-[#2A2328] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#F0508C]/40 transition-all"
                >
                  <div className={`h-2.5 w-full bg-gradient-to-r ${camp.coverGradient} absolute top-0 left-0 right-0`} />

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#F0508C]/10 text-[#F0508C]">
                        {camp.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          camp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {camp.status}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#231F20] dark:text-white mb-1.5">
                      {camp.title}
                    </h4>

                    <p className="text-xs text-[#554C52] dark:text-[#B5ABB1] line-clamp-2 mb-4">
                      {camp.description}
                    </p>

                    <div className="p-3 rounded-xl bg-[#FFF9F5] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2C242A] text-xs space-y-1.5 mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#7A7276]">Base Compensation:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{camp.payoutPerReel} / Reel</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7A7276]">Free PR Gifts:</span>
                        <span className="font-bold text-[#231F20] dark:text-white">{camp.freePrProducts.length} Items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7A7276]">Campaign Dates:</span>
                        <span className="font-bold text-[#231F20] dark:text-white">{camp.startDate}</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Deliverables:
                      </div>
                      {camp.deliverables.map((del, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-[#231F20] dark:text-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F0508C] shrink-0" />
                          <span className="truncate">{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EDE2DB] dark:border-[#2A2328] flex items-center justify-between">
                    <span className="text-[11px] text-[#7A7276]">
                      <strong>{camp.slotsAvailable - camp.slotsFilled}</strong> slots open
                    </span>

                    {isApplied ? (
                      <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3.5 h-3.5" /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApplyToCampaign(camp.id)}
                        className="px-4 py-2 rounded-full text-xs font-bold bg-[#F0508C] hover:bg-[#D93D78] text-white shadow-xs transition-all"
                      >
                        Join Campaign →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: NEW AFFILIATE REGISTRATION FORM */}
      {/* ============================================================ */}
      {portalTab === 'signup' && (
        <div className="p-6 sm:p-10 max-w-2xl mx-auto animate-fadeIn">
          {signUpSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#231F20] dark:text-white">
                Welcome to Divine Creator Club
              </h3>
              <p className="text-xs text-[#7A7276] max-w-sm mx-auto">
                Your affiliate account is ready with promo code <strong className="text-[#F0508C]">{signUpCode}</strong>. Redirecting to your personal dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0508C]/10 text-[#F0508C] font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Instant Affiliate Onboarding
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#231F20] dark:text-white">
                  Register as an Ambassador
                </h3>
                <p className="text-xs text-[#7A7276] mt-1">
                  Get approved instantly to start earning 15% per sale and receive seasonal PR drops.
                </p>
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Verma"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maya@gmail.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                      Instagram Handle *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="@mayastyles"
                      value={signUpInstagram}
                      onChange={(e) => setSignUpInstagram(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                      Follower Count
                    </label>
                    <select
                      value={signUpFollowers}
                      onChange={(e) => setSignUpFollowers(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                    >
                      <option value="1k - 5k">1k - 5k (Nano)</option>
                      <option value="5k - 20k">5k - 20k (Micro)</option>
                      <option value="20k - 100k">20k - 100k (Mid)</option>
                      <option value="100k+">100k+ (Macro)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                      Desired Promo Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MAYA15"
                      value={signUpCode}
                      onChange={(e) => setSignUpCode(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl font-mono uppercase bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                    PR Package Delivery Address (Street & House Number) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Where should we ship your free custom cases & jewelry?"
                    value={signUpAddress}
                    onChange={(e) => setSignUpAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C] mb-2"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="City (e.g. Mumbai)"
                      value={signUpCity}
                      onChange={(e) => setSignUpCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Pincode (e.g. 400050)"
                      value={signUpPincode}
                      onChange={(e) => setSignUpPincode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EDE2DB] dark:border-[#2A2328] flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold bg-[#F0508C] text-white hover:bg-[#D93D78] shadow-md shadow-[#F0508C]/25 transition-all"
                  >
                    Complete Registration & Open Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: MEDIA ASSETS & PROMO KIT */}
      {/* ============================================================ */}
      {portalTab === 'assets' && (
        <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#231F20] dark:text-white">
              Creator Marketing Kit & High-Res Assets
            </h3>
            <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
              Download official brand assets, story templates, and promo badges to boost your conversion rates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                title: 'Story Sticker Templates (9:16)',
                desc: 'Ready-to-use aesthetic Canva frames with link placement stickers.',
                size: '14.2 MB',
              },
              {
                title: 'High-Res Phone Case PNGs',
                desc: 'Transparent cutout mockups of Pearl cases, Chrome mirrors & Rose Domes.',
                size: '28.5 MB',
              },
              {
                title: 'Official Vector Logos & Sparkles',
                desc: 'Divine’s Eternity golden emblems and sparkle micro-assets in SVG format.',
                size: '4.1 MB',
              },
            ].map((asset, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[#FFF9F5] dark:bg-[#1E191D] border border-[#EDE2DB] dark:border-[#2C242A] flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#F0508C]/10 text-[#F0508C] flex items-center justify-center mb-3">
                    <Download className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#231F20] dark:text-white mb-1">
                    {asset.title}
                  </h4>
                  <p className="text-xs text-[#7A7276] mb-3">{asset.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#EDE2DB] dark:border-[#2C242A] flex items-center justify-between text-xs">
                  <span className="text-[#7A7276] font-mono">{asset.size}</span>
                  <button
                    onClick={() => confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } })}
                    className="font-bold text-[#F0508C] hover:underline"
                  >
                    Download .ZIP ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: PAYOUTS & BANKING */}
      {/* ============================================================ */}
      {portalTab === 'payouts' && (
        <div className="p-6 sm:p-8 max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#231F20] dark:text-white">
              Payout Preferences & Bank Setup
            </h3>
            <p className="text-xs text-[#7A7276]">
              All commissions are paid directly via instant UPI or NEFT bank transfer with 0% gateway deductions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF9F5] dark:bg-[#1E191D] border border-[#EDE2DB] dark:border-[#2C242A] space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                UPI ID for Instant Daily/Monthly Payouts
              </label>
              <input
                type="text"
                defaultValue={activeCreator?.email ? `${activeCreator.email.split('@')[0]}@okaxis` : 'creator@upi'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#151215] border border-[#EDE2DB] dark:border-[#2A2328] font-mono font-bold text-[#F0508C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  defaultValue="•••• •••• 8829"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#151215] border border-[#EDE2DB] dark:border-[#2A2328] font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  defaultValue="HDFC0001248"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#151215] border border-[#EDE2DB] dark:border-[#2A2328] font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } })}
                className="px-6 py-2 rounded-full font-bold bg-[#231F20] text-white dark:bg-white dark:text-[#231F20] text-xs"
              >
                Save Payout Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
