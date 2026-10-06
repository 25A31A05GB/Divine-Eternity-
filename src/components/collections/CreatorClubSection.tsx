import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  TrendingUp,
  BookOpen,
  Users,
  Gift,
  DollarSign,
  CheckCircle2,
  Send,
  Download,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const EARNING_TIERS = [
  {
    tier: 'Starter Creator',
    followers: '1k – 5k followers',
    monthlyEarning: 'Up to ₹2,500/mo',
    hamperBenefit: 'Complimentary Starter Jewelry Box',
    perks: ['1 PR Kit / Quarter', '10% Affiliate Commission', 'Creator Discord Access'],
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
  },
  {
    tier: 'Rising Creator',
    followers: '5k – 25k followers',
    monthlyEarning: 'Up to ₹4,500/mo',
    hamperBenefit: 'Monthly Curated PR Hamper',
    perks: ['1 Monthly PR Hamper', '15% Affiliate Commission', 'Campaign Priority Roster', '1-on-1 Reel Guidance'],
    badgeColor: 'bg-[#FFF9EB] text-[#D97706] border-[#F5E6CE]',
  },
  {
    tier: 'Elite Creator Club',
    followers: '25k+ followers',
    monthlyEarning: 'Up to ₹7,000/mo + Bonuses',
    hamperBenefit: 'Luxury Bespoke Trunk + Co-Branded Drop',
    perks: ['Fixed Retainer Sponsorships', '20% Top-tier Commission', 'Featured on Divine’s Eternity Website', 'VIP Creator Community Lounge'],
    badgeColor: 'bg-[#FFF0F5] text-[#FF2E93] border-pink-200 ring-1 ring-[#FF2E93]/20',
  },
];

const CLUB_PILLARS = [
  {
    title: 'Brand Opportunities',
    desc: 'Get exclusive access to brand campaigns, new collection drops, festive gifting events, and paid video briefs.',
    icon: Gift,
  },
  {
    title: 'Creative Guidance',
    desc: 'Receive personalized feedback on lighting, aesthetics, audio selection, and reel pacing from our creative directors.',
    icon: Sparkles,
  },
  {
    title: 'Creator Resources',
    desc: 'Access our private library of proven viral hook formulas, royalty-free audio ideas, and flat-lay composition guides.',
    icon: BookOpen,
  },
  {
    title: 'Supportive Community',
    desc: 'Connect with a thriving network of passionate creators who cross-promote, share tips, and celebrate each other’s wins.',
    icon: Users,
  },
];

export const CreatorClubSection: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [primaryNiche, setPrimaryNiche] = useState('Lifestyle & Aesthetic Gifting');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF2E93', '#FFD94A', '#211D1C', '#E0A899'],
    });
    setIsJoined(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Header Hero */}
      <div className="bg-gradient-to-br from-[#FFF9EB] via-[#FFFDF8] to-[#FFF0F5] border border-[#F3E8E2] rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F3E8E2] text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] shadow-2xs">
            <span>✦</span>
            <span>DIVINE’S ETERNITY CREATOR CLUB</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            Create, Learn, Collaborate & <span className="font-serif italic text-[#FF2E93]">Earn up to ₹7k</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Welcome to the Divine’s Eternity Creator Club — a space created for aspiring and growing creators to create, learn, collaborate, and earn upto 7k. Get access to exciting brand opportunities, campaigns, guidance, creator resources, and a supportive creator community.
          </p>
        </div>
      </div>

      {/* 2. Earning Tiers Breakdown (Earn Up to 7k) */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D97706]">
            TRANSPARENT CREATOR MILESTONES
          </span>
          <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#211D1C]">
            How You Earn with Divine’s Eternity
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EARNING_TIERS.map((tier, idx) => (
            <div
              key={tier.tier}
              className={`bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between space-y-5 relative ${
                idx === 2 ? 'border-[#FF2E93] shadow-md' : 'border-[#E7E2DA]'
              }`}
            >
              {idx === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF2E93] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Most Popular Milestone
                </div>
              )}

              <div className="space-y-3">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${tier.badgeColor}`}>
                  {tier.tier}
                </div>
                <div className="text-xs text-stone-500 font-medium">
                  {tier.followers}
                </div>
                <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#211D1C]">
                  {tier.monthlyEarning}
                </div>
                <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  🎁 {tier.hamperBenefit}
                </p>

                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
                  {tier.perks.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The 4 Club Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CLUB_PILLARS.map((col, idx) => {
          const Icon = col.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#E7E2DA] rounded-2xl p-5 space-y-2.5 shadow-2xs hover:border-[#FF2E93] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFF9EB] text-[#D97706] flex items-center justify-center mb-2">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#211D1C]">
                {col.title}
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                {col.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* 4. Creator Club Application Form & Digital Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-[#E7E2DA] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif-heading text-2xl font-bold text-[#211D1C] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF2E93]" />
              Apply to Divine’s Creator Club
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Joining is free. Aspiring & growing creators are approved within 48 hours.
            </p>
          </div>

          {isJoined ? (
            <div className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif-heading text-xl font-bold text-[#211D1C]">
                Welcome to the Creator Club!
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Congratulations, {fullName}! You’ve been inducted into the Divine’s Eternity Creator Roster. Look out for our welcome message on WhatsApp with your creator welcome toolkit.
              </p>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Creator Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Instagram Handle *
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Primary Content Niche
                </label>
                <select
                  value={primaryNiche}
                  onChange={(e) => setPrimaryNiche(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                >
                  <option>Lifestyle & Aesthetic Gifting</option>
                  <option>Fashion & Daily GRWM</option>
                  <option>Couples, Dating & Romance Vlogs</option>
                  <option>College Life & Studygram</option>
                  <option>Art, Calligraphy & Handmade Crafts</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#FF2E93] hover:bg-[#E01E7E] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Join Creator Club (Free)</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Member Pass Mockup */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#211D1C] to-[#3B2830] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-pink-900/40 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-extrabold tracking-widest text-[#FFD94A] uppercase">
                DIGITAL CREATOR PASS
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                VIP Access
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-stone-400">Creator Member</span>
              <h4 className="font-serif-heading text-xl font-bold text-white">
                {fullName || 'Aspiring Creator'}
              </h4>
              <p className="text-xs text-[#FF2E93] font-mono">
                {handle || '@yourhandle'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block">Earning Potential</span>
                <span className="font-bold text-[#FFD94A]">Up to ₹7,000 / mo</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block">PR Tier</span>
                <span className="font-bold text-white">Verified Creator Hamper</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 italic pt-1">
              “Divine’s Eternity Creator Club helped me turn my smartphone videos into monthly brand checks and aesthetic gifts.” — Diya V.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
