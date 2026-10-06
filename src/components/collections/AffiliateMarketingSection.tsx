import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Copy,
  Check,
  Share2,
  Percent,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AffiliateMarketingSection: React.FC = () => {
  const [monthlyOrders, setMonthlyOrders] = useState(25);
  const [customCodeInput, setCustomCodeInput] = useState('YOURNAME');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [upiOrBank, setUpiOrBank] = useState('');
  const [phone, setPhone] = useState('');
  const [isActivated, setIsActivated] = useState(false);

  // Commission math
  const avgOrderValue = 1299;
  const commissionRate = 0.15; // 15%
  const monthlyEarnings = Math.round(monthlyOrders * avgOrderValue * commissionRate);
  const generatedCode = `DIVINE-${(customCodeInput || 'CREATOR').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')}10`;
  const affiliateUrl = `https://divineseternity.com/?ref=${generatedCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF2E93', '#FFD94A', '#211D1C'],
    });
    setIsActivated(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Header Hero */}
      <div className="bg-gradient-to-br from-[#FFF9EB] via-[#FFFDF8] to-[#FFF0F5] border border-[#F3E8E2] rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F3E8E2] text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] shadow-2xs">
            <span>✦</span>
            <span>DIVINE’S ETERNITY AFFILIATE PROGRAM</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            Turn Your Content into an <span className="font-serif italic text-[#FF2E93]">Earning Opportunity</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Turn your content into an earning opportunity with Divine’s Eternity Affiliate Marketing. Share our products with your audience, promote them through your unique affiliate link or code, and earn commissions from successful sales.
          </p>
        </div>
      </div>

      {/* 2. Interactive Commission Calculator & Code Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Earnings Calculator */}
        <div className="lg:col-span-6 bg-white border border-[#E7E2DA] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D97706]">
              INTERACTIVE EARNING ESTIMATOR
            </span>
            <h3 className="font-serif-heading text-2xl font-bold text-[#211D1C] mt-0.5">
              Estimate Your Monthly Commission
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Based on standard 15% recurring affiliate revenue on an average order value of ₹1,299.
            </p>
          </div>

          <div className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-2xl p-6 text-center space-y-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
              Estimated Monthly Payout
            </span>
            <div className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#211D1C]">
              ₹{monthlyEarnings.toLocaleString()}
            </div>
            <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
              Paid directly to your bank account / UPI
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-[#211D1C]">
              <span>Referred Orders per Month:</span>
              <span className="text-[#FF2E93] text-sm">{monthlyOrders} Orders</span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={monthlyOrders}
              onChange={(e) => setMonthlyOrders(Number(e.target.value))}
              className="w-full accent-[#FF2E93] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>5 orders (₹975)</span>
              <span>50 orders (₹9,740)</span>
              <span>150 orders (₹29,220)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-stone-100 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50">
              <span className="text-stone-400 block text-[10px]">Commission</span>
              <span className="font-bold text-[#211D1C]">15% – 20%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50">
              <span className="text-stone-400 block text-[10px]">Cookie Window</span>
              <span className="font-bold text-[#211D1C]">30 Days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50">
              <span className="text-stone-400 block text-[10px]">Payouts</span>
              <span className="font-bold text-[#211D1C]">Weekly</span>
            </div>
          </div>
        </div>

        {/* Right: Unique Link & Code Generator */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-[#211D1C] to-[#2E2826] text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl border border-stone-700">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD94A]">
                YOUR UNIQUE AFFILIATE ASSETS
              </span>
              <h3 className="font-serif-heading text-xl font-bold text-white mt-0.5">
                Generate Your Promo Code & Link
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Your audience gets 10% OFF their gift purchase, and you automatically earn 15% commission.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-300 block">
                Customize Code Prefix:
              </label>
              <input
                type="text"
                value={customCodeInput}
                onChange={(e) => setCustomCodeInput(e.target.value)}
                placeholder="e.g. PRIYA, RHEA, ROHAN"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-600 bg-stone-900 text-white font-mono text-xs uppercase focus:outline-none focus:border-[#FF2E93]"
              />
            </div>

            {/* Generated Code Box */}
            <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                Your Promo Code (10% Off for Followers):
              </span>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-base sm:text-lg font-bold text-[#FFD94A] tracking-wider">
                  {generatedCode}
                </span>
                <button
                  onClick={copyCode}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Generated Link Box */}
            <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                Your Trackable Referral Link:
              </span>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-stone-300 truncate max-w-[240px]">
                  {affiliateUrl}
                </span>
                <button
                  onClick={copyLink}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Step Breakdown */}
          <div className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-3xl p-6 text-xs text-stone-700 space-y-3">
            <h5 className="font-bold text-sm text-[#211D1C]">
              How Divine’s Eternity Affiliate Works
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-1">
              <div className="p-3 bg-white rounded-2xl border border-[#E7E2DA]">
                <span className="w-6 h-6 rounded-full bg-[#FFF0F5] text-[#FF2E93] font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                  1
                </span>
                <strong className="block text-[#211D1C] text-xs">Share Code / Link</strong>
                <span className="text-[11px] text-stone-500">Post on IG bio, reels, stories, or YouTube.</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#E7E2DA]">
                <span className="w-6 h-6 rounded-full bg-[#FFF0F5] text-[#FF2E93] font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                  2
                </span>
                <strong className="block text-[#211D1C] text-xs">Audience Shops</strong>
                <span className="text-[11px] text-stone-500">Your followers get 10% off custom gifts.</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#E7E2DA]">
                <span className="w-6 h-6 rounded-full bg-[#FFF0F5] text-[#FF2E93] font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                  3
                </span>
                <strong className="block text-[#211D1C] text-xs">Earn Commissions</strong>
                <span className="text-[11px] text-stone-500">15% commission transferred directly.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
