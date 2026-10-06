import React, { useState } from 'react';
import {
  Calendar,
  Instagram,
  Sparkles,
  Award,
  DollarSign,
  Gift,
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  Send,
  X,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CampaignCard {
  id: string;
  title: string;
  tagline: string;
  category: string;
  status: 'Active' | 'Upcoming' | 'Filling Fast';
  rewards: string;
  cashPrize: string;
  prHamperValue: string;
  timeline: string;
  slots: string;
  deliverables: string[];
  eligibility: string;
}

const CAMPAIGNS_LIST: CampaignCard[] = [
  {
    id: 'camp-1',
    title: 'Season of Love UGC Festival',
    tagline: 'Showcase how eternal roses, engraved names, and custom Spotify plaques celebrate authentic love stories.',
    category: 'Valentine & Romantic Keepsakes',
    status: 'Active',
    rewards: '₹15,000 Cash Pool + 2 Free Bespoke Hampers',
    cashPrize: '₹3,500 – ₹5,000 per approved reel',
    prHamperValue: '₹3,299 Complimentary PR Box',
    timeline: 'Feb 01 – Mar 15, 2026',
    slots: '12 / 25 Slots Remaining',
    deliverables: [
      '1x 4K Aesthetic Unboxing Reel with trending audio',
      '2x Instagram Stories with link sticker to Divine’s Eternity',
      'High-res photo for Divine’s website and social feature',
    ],
    eligibility: 'Min 2,000+ followers on Instagram or YouTube Shorts with clean, warm aesthetic lighting.',
  },
  {
    id: 'camp-2',
    title: 'Gifts That Speak — Festive & Family Moments',
    tagline: 'Heartwarming reactions and emotional gifting unboxings for parents, partners, and lifelong friends.',
    category: 'Caricatures, Hampers & Jewelry',
    status: 'Filling Fast',
    rewards: '₹10,000 Cash Pool + Royal Keepsake Hamper',
    cashPrize: '₹2,500 – ₹4,000 per video',
    prHamperValue: '₹4,499 Royal Trunk Hamper',
    timeline: 'Mar 10 – Apr 20, 2026',
    slots: '5 / 30 Slots Remaining',
    deliverables: [
      '1x Wholesome reaction unboxing video',
      '1x Carousel post featuring personalized details',
    ],
    eligibility: 'Open to lifestyle, family, couple, and story-driven creators with engaged Indian audiences.',
  },
  {
    id: 'camp-3',
    title: 'Campus Ambassador & Miniatures Spark',
    tagline: 'Discover and showcase adorable 3D custom caricatures and pastel hair accessories among college besties.',
    category: 'College & Besties Gifting',
    status: 'Upcoming',
    rewards: '₹7,000 Monthly Stipend + Unlimited Accessories',
    cashPrize: '₹7,000 stipend + 20% sales cut',
    prHamperValue: 'Complete Accessories Wardrobe',
    timeline: 'Apr 01 – Jun 30, 2026',
    slots: '40 Slots Opening Soon',
    deliverables: [
      'Weekly aesthetic outfit / dorm styling snippets',
      'Exclusive campus referral code distribution',
    ],
    eligibility: 'College students, youth creators, and fashion enthusiasts passionate about aesthetic gifting.',
  },
];

export const UpcomingCampaignsSection: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignCard | null>(null);
  const [creatorName, setCreatorName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF2E93', '#FFD94A', '#E0A899'],
    });
    setIsJoined(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Instagram Callout Banner */}
      <div className="bg-gradient-to-r from-[#211D1C] via-[#331C28] to-[#211D1C] text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-pink-900/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF2E93]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2E93]/20 border border-[#FF2E93]/40 text-[#FFD94A] text-[11px] font-extrabold uppercase tracking-widest">
              <Instagram className="w-3.5 h-3.5 text-[#FF2E93]" />
              <span>FOLLOW US ON INSTAGRAM</span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Stay in the Loop with <span className="text-[#FF2E93]">@divineseternity</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Stay updated with the latest campaigns and exciting opportunities from Divine’s Eternity. Explore upcoming campaigns, participation details, creator opportunities, rewards, and everything you need to know to be a part of them.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-7 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#E05A47] hover:from-[#E01E7E] hover:to-[#C94735] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @divineseternity</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Active & Upcoming Campaigns Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#F3E8E2] pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LIVE & UPCOMING OPPORTUNITIES</span>
          </span>
          <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#211D1C]">
            Creator Campaigns & Rewards
          </h3>
        </div>
        <span className="text-xs text-stone-500">
          Showing 3 curated campaign opportunities
        </span>
      </div>

      {/* 3. Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CAMPAIGNS_LIST.map((camp) => (
          <div
            key={camp.id}
            className="bg-white border border-[#E7E2DA] rounded-3xl p-6 shadow-xs hover:border-[#FF2E93] transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  camp.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : camp.status === 'Filling Fast'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {camp.status}
                </span>
                <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {camp.timeline}
                </span>
              </div>

              <div>
                <h4 className="font-serif-heading text-xl font-bold text-[#211D1C]">
                  {camp.title}
                </h4>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                  {camp.tagline}
                </p>
              </div>

              {/* Rewards Box */}
              <div className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-2xl p-3.5 space-y-1.5">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>CAMPAIGN REWARDS</span>
                </div>
                <div className="text-sm font-bold text-[#211D1C]">
                  {camp.rewards}
                </div>
                <div className="text-[11px] text-stone-600 flex justify-between pt-1 border-t border-amber-200/50">
                  <span>Cash Rate: {camp.cashPrize}</span>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <span className="font-bold text-[#211D1C] block text-[11px] uppercase tracking-wider">
                  Deliverables:
                </span>
                <ul className="space-y-1">
                  {camp.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {camp.slots}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedCampaign(camp);
                  setIsJoined(false);
                }}
                className="w-full py-2.5 px-4 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>View Details & Participate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Campaign Registration Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setSelectedCampaign(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E93]">
                CAMPAIGN PARTICIPATION
              </span>
              <h3 className="font-serif-heading text-2xl font-bold text-[#211D1C] mt-1">
                {selectedCampaign.title}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                {selectedCampaign.tagline}
              </p>
            </div>

            <div className="bg-[#FFF0F5] border border-pink-200 rounded-2xl p-3.5 text-xs text-[#211D1C] space-y-1">
              <strong className="block text-[#FF2E93] uppercase text-[10px] tracking-wider">
                Eligibility Requirement:
              </strong>
              <p>{selectedCampaign.eligibility}</p>
            </div>

            {isJoined ? (
              <div className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-[#211D1C]">
                  Participation Application Sent!
                </h4>
                <p className="text-xs text-stone-600">
                  Our campaign coordinator will review your profile and send the campaign brief and gifting shipment details via WhatsApp.
                </p>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="mt-3 px-5 py-2 rounded-full bg-[#211D1C] text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Creator Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
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
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                    />
                  </div>
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
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#FF2E93] hover:bg-[#E01E7E] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Campaign Application</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
