import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { fetchSiteContent, saveSiteContent } from '../lib/siteContent';
import {
  HeroSlideCMS,
  VideoReelCMS,
  AnnouncementCMS,
  BrandStoryCMS,
  FounderCMS,
  CategoryCircleCMS,
  BestsellerSectionCMS,
  VideoSectionCMS,
  SpotlightSectionCMS,
  ChoiceSectionCMS,
  ValuePropCMS,
  MarqueeCMS,
  NewsletterCMS,
} from '../types';

export const INITIAL_ANNOUNCEMENTS: AnnouncementCMS[] = [
  { id: 'ann-1', text: 'SPECIAL PAIRING: ANY 2 GIFTS FOR ₹849 – CODE: ', code: 'FLAT849', highlight: 'FLAT849', isActive: true },
  { id: 'ann-2', text: 'ATELIER CELEBRATION: BUY 3 PAY FOR 2 – LOWEST PRICED ITEM 100% FREE', code: 'BUY3PAY2', highlight: 'Auto-Applied', isActive: true },
  { id: 'ann-3', text: 'WELCOME PRIVILEGE: BUY 1 GIFT, GET ₹100 OFF – CODE: ', code: 'LOVE100', highlight: 'LOVE100', isActive: true },
  { id: 'ann-4', text: 'COMPLIMENTARY INSURED EXPRESS DISPATCH ON ORDERS ABOVE ₹499', code: '', highlight: 'Pan-India', isActive: true },
];

export const INITIAL_HERO_SLIDES: HeroSlideCMS[] = [
  {
    id: 'hero-slide-1',
    eyebrow: 'Cute Things Inside ♡',
    title: 'YOUR GO-TO-GO PLATFORM',
    tagline: 'Hampers ♡ Bouquets ♡ Jewellery ♡ & More... Thoughtful gifts for every special moment.',
    coupon: 'LOVE100',
    highlightBadge: 'Go-To Platform',
    ctaText: 'Explore Collection',
    ctaCategory: 'products',
    customImageUrl: '/images/hero/hero_platform_1791314686484.jpg',
    bgGradient: 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB]',
    featuredProductId: 'gift-hamper-1',
    isActive: true,
  },
  {
    id: 'hero-slide-2',
    eyebrow: 'Shoot • Create • Grow • Earn ♡',
    title: 'EARN 5-7K PER MONTH THROUGH CREATOR CLUB',
    tagline: 'Small Steps Big Dreams ♡ | Create Reels • Get Paid • Be Independent • Live Your Dream!',
    coupon: 'CREATOR7K',
    highlightBadge: 'Creator Opportunity',
    ctaText: 'Join Creator Club',
    ctaCategory: 'creator-club',
    customImageUrl: '/images/hero/hero_creator_club_1791314713473.jpg',
    bgGradient: 'from-[#FFF0F5] via-[#FFF9EB] to-[#FFF0F5]',
    featuredProductId: 'gift-name-1',
    isActive: true,
  },
  {
    id: 'hero-slide-3',
    eyebrow: 'Work Smart Not Hard ♡',
    title: 'LEARN AFFILIATE MARKETING WITH TOP BRANDS',
    tagline: 'Promote • Earn • Grow • Repeat ♡ | Partner with Meesho, Myntra, Amazon & Flipkart. One Time Investment, Work From Anywhere!',
    coupon: 'AFFILIATE15',
    highlightBadge: '15-20% Commission',
    ctaText: 'Start Affiliate Program',
    ctaCategory: 'affiliate-marketing',
    customImageUrl: '/images/hero/hero_affiliate_1791314731407.jpg',
    bgGradient: 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB]',
    featuredProductId: 'gift-jewel-1',
    isActive: true,
  },
  {
    id: 'hero-slide-4',
    eyebrow: 'Prettiest Surprises ♡',
    title: 'MAKE YOUR SPECIAL ONES DAY MEMORABLE',
    tagline: 'Because they deserve the prettiest surprises ♡ | Bouquets ♡ Hampers ♡ Gifts ♡ Frames ♡ Jewellery & More...',
    coupon: 'MEMORABLE',
    highlightBadge: 'Thoughtful Surprises',
    ctaText: 'Personalize A Gift',
    ctaCategory: 'personalization',
    customImageUrl: '/images/hero/hero_memorable_day_1791314745468.jpg',
    bgGradient: 'from-[#FFF0F5] via-[#FFFDF8] to-[#FFF0F5]',
    featuredProductId: 'gift-bouquet-1',
    isActive: true,
  },
  {
    id: 'hero-slide-5',
    eyebrow: 'Little Happiness in Every Order ♡',
    title: 'FIRST ORDER ?? Use DS1102 AND AVAIL FLAT 60% OFF',
    tagline: 'Special Welcome Offer! Beautiful Hampers ♡ Bouquets ♡ Jewellery & More... Fast Delivery • Safe Packaging • Premium Quality.',
    coupon: 'DS1102',
    highlightBadge: 'FLAT 60% OFF',
    ctaText: 'Apply Code DS1102',
    ctaCategory: 'products',
    customImageUrl: '/images/hero/hero_first_order_1791314758906.jpg',
    bgGradient: 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB]',
    featuredProductId: 'gift-jewel-1',
    isActive: true,
  },
];

export const INITIAL_CATEGORY_CIRCLES: CategoryCircleCMS[] = [
  {
    id: 'circle-1',
    name: 'Products',
    subtitle: '7 Gift Categories',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
    badge: 'Explore All',
    route: 'products',
    isActive: true,
  },
  {
    id: 'circle-2',
    name: 'Personalization',
    subtitle: 'WhatsApp Confirmed',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    badge: 'WhatsApp Verified',
    route: 'personalization',
    isActive: true,
  },
  {
    id: 'circle-3',
    name: 'Collaboration',
    subtitle: 'UGC & Creators',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    badge: 'Open for Creators',
    route: 'collaboration',
    isActive: true,
  },
  {
    id: 'circle-4',
    name: 'Upcoming Campaigns',
    subtitle: '@divineseternity',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    badge: 'Follow & Win',
    route: 'upcoming-campaigns',
    isActive: true,
  },
  {
    id: 'circle-5',
    name: 'Creator Club',
    subtitle: 'Earn up to ₹7k',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    badge: 'Earn up to ₹7k',
    route: 'creator-club',
    isActive: true,
  },
  {
    id: 'circle-6',
    name: 'Affiliate Marketing',
    subtitle: '15-20% Comm.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80',
    badge: 'Share & Earn',
    route: 'affiliate-marketing',
    isActive: true,
  },
  {
    id: 'circle-7',
    name: 'Podcast',
    subtitle: 'Inspiring Stories',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80',
    badge: 'Listen Now',
    route: 'podcast',
    isActive: true,
  },
];

export const INITIAL_BESTSELLER_SECTION: BestsellerSectionCMS = {
  eyebrow: '✦ THE ONES EVERYONE IS ASKING ABOUT',
  titlePrefix: 'Meet the',
  titleHighlight: 'Best sellers',
  subtitle: 'Over 40,000+ cherished memories handcrafted. Buy 3 Pay For 2 on all bestsellers!',
  discountText: 'Buy 3 Pay For 2',
  isVisible: true,
};

export const INITIAL_VIDEO_SECTION: VideoSectionCMS = {
  eyebrow: '✦ LIVE ATELIER SHOWCASE & UNBOXING',
  titlePrefix: 'Watch It',
  titleHighlight: 'And Buy It',
  subtitle: 'Real customer unboxings, custom handwriting engraving tests, and eternal rose dome night glows.',
  isVisible: true,
};

export const INITIAL_VIDEO_REELS: VideoReelCMS[] = [];

export const INITIAL_FOUNDER_DATA: FounderCMS = {
  name: 'Sonu',
  role: 'Founder — Divine’s Eternity',
  badge1: '20-Year-Old Founder',
  badge2: 'Educator & Creator',
  imageUrl: '/images/founder/founder_sonu_real_1791375717528.jpg',
  establishedDate: 'EST. AUG 31',
  dreamAge: 'Dreamed at Age 16',
  launchDate: 'August 31st',
  introText: 'Myself Sonu, a 20-year-old proud young founder, content creator, educator, and entrepreneur.',
  highlightQuote: 'What started as a dream at 16 is now a reality I get to live every single day with Divine’s Eternity.',
  signatureText: 'With gratitude & love, Sonu',
  ctaPrimaryText: 'Explore Handcrafted Gifts',
  ctaSecondaryText: 'Join Creator Club',
  isVisible: true,
  storyNote: `Divine’s Eternity is more than just a brand to me — it is a dream I carried with me since I was 16 years old. After completing my 12th, I finally decided to take that dream seriously and started working towards building something of my own.

On August 31st, I officially started Divine’s Eternity, and that day will always remain one of the best days of my life. Today, after building this journey with love, seeing how far we have come feels like a true dream come true.

The journey hasn't always been easy. I have faced failures, difficult phases, setbacks, and moments when giving up felt easier. But I never gave up on my passion or the vision I had for myself.

Today, I proudly stand as a full-time content creator, educator, and entrepreneur, while continuing to grow Divine’s Eternity with the same passion with which it began.

My vision goes beyond just building a successful brand. I want to create opportunities and encourage women and students to become financially independent, confident, and capable of building something of their own.

Divine’s Eternity is my little world of creativity, dreams, gifts, opportunities, and growth. Every order, every creator who joins us, every collaboration, and every person who supports us becomes a part of this journey.

What started as a dream at 16 is now a reality I get to live every day.`,
};

export const INITIAL_SPOTLIGHT_SECTION: SpotlightSectionCMS = {
  selectedCategory: 'Personalized Name Jewelry',
  eyebrow: '✦ SPOTLIGHT SHOWCASE',
  title: 'Personalized Name Jewellery',
  subtitle: '18k thick gold vermeil handwriting pendants & Roman numeral engraved bar bracelets.',
  viewAllText: 'View All Jewellery',
  isVisible: true,
};

export const INITIAL_CHOICE_SECTION: ChoiceSectionCMS = {
  eyebrow: '✦ HANDPICKED FOR EVERY OCCASION',
  titlePrefix: 'Shop By',
  titleHighlight: 'Your Choice',
  subtitle: 'Discover personalized keepsakes tailored for every celebration, relationship, and milestone.',
  tabs: [
    { id: 'tab-1', label: 'For Couples & Anniversaries', categoryName: 'Romantic Couple Hampers & Scented Candle Sets', isActive: true },
    { id: 'tab-2', label: 'Personalized Jewellery', categoryName: 'Personalized Name Jewelry', isActive: true },
    { id: 'tab-3', label: 'Eternal Roses & Domes', categoryName: 'Preserved Eternal Roses & Dome Displays', isActive: true },
    { id: 'tab-4', label: 'Song Plaques & Acrylics', categoryName: 'Custom Acrylic Song Plaques & Photo Frames', isActive: true },
    { id: 'tab-5', label: 'Memory Crystal Lamps', categoryName: 'Memory Photo Lamps & Crystal Cubes', isActive: true },
    { id: 'tab-6', label: 'Engraved Wooden Keepsakes', categoryName: 'Engraved Wooden Gift Boxes & Keepsakes', isActive: true },
  ],
  isVisible: true,
};

export const INITIAL_VALUE_PROPS: ValuePropCMS[] = [
  {
    id: 'prop-1',
    title: '100% Handcrafted Luxury',
    description: 'Each gift is laser engraved and hand-assembled with high precision jewelry-grade materials.',
    icon: 'Sparkles',
    highlightBadge: 'Artisan Crafted',
    isActive: true,
  },
  {
    id: 'prop-2',
    title: 'Insured Express Dispatch',
    description: 'Complimentary shipping over ₹499 with shockproof velvet gift packaging and tracking.',
    icon: 'Truck',
    highlightBadge: 'Fast & Safe',
    isActive: true,
  },
  {
    id: 'prop-3',
    title: 'WhatsApp Preview & Proof',
    description: 'We send you a live photo proof of your custom name & design on WhatsApp before dispatch.',
    icon: 'MessageSquare',
    highlightBadge: '100% Satisfaction',
    isActive: true,
  },
  {
    id: 'prop-4',
    title: 'Luxury Gift Box Included',
    description: 'Ready-to-gift aesthetic packaging with satin ribbon, velvet pouch & personalized greeting card.',
    icon: 'Gift',
    highlightBadge: 'Ready to Gift',
    isActive: true,
  },
];

export const INITIAL_MARQUEE: MarqueeCMS = {
  messages: [
    '✦ DIVINE’S ETERNITY — THE ATELIER OF CHERISHED MOMENTS',
    '✦ 40,000+ CUSTOM KEEPSAKES DELIVERED PAN-INDIA',
    '✦ FLAT ₹100 OFF FIRST ORDER CODE: LOVE100',
    '✦ BUY 3 PAY FOR 2 AUTOMATIC ATELIER OFFER',
    '✦ INSURED EXPRESS SHIPPING ON ORDERS OVER ₹499',
    '✦ WHATSAPP ARTWORK PROOF BEFORE DISPATCH',
  ],
  speedSeconds: 28,
  isVisible: true,
};

export const INITIAL_NEWSLETTER: NewsletterCMS = {
  eyebrow: '✦ JOIN THE ATELIER PRIVILEGE CLUB',
  title: 'Unlock ₹100 Off Your First Order',
  subtitle: 'Subscribe to get exclusive early access to secret launches, anniversary discounts & gifting guides.',
  discountBadge: 'Flat ₹100 Off',
  couponCode: 'LOVE100',
  buttonText: 'Claim ₹100 Privilege',
  isVisible: true,
};

export const INITIAL_BRAND_STORY: BrandStoryCMS = {
  title: 'Crafted with Love. Made for Moments That Mean Everything.',
  subtitle: 'The Divine’s Eternity Gift Atelier',
  description: 'Every creation in the Divine’s Eternity collection is crafted with love and devotion. From pure gold plated personalized jewellery to handcrafted hampers, fragrant bouquets, and bespoke keepsakes, our mission is to celebrate the people and memories you cherish most.',
  mediaType: 'image',
  mediaUrl: '',
  posterUrl: '',
};

interface MediaCMSContextType {
  // Section 1: Hero Carousel
  heroSlides: HeroSlideCMS[];
  updateHeroSlide: (id: string, slide: Partial<HeroSlideCMS>) => void;
  addHeroSlide: (slide: Omit<HeroSlideCMS, 'id'>) => void;
  deleteHeroSlide: (id: string) => void;

  // Section 2: 7 Collections Circles
  categoryCircles: CategoryCircleCMS[];
  updateCategoryCircle: (id: string, circle: Partial<CategoryCircleCMS>) => void;
  addCategoryCircle: (circle: Omit<CategoryCircleCMS, 'id'>) => void;
  deleteCategoryCircle: (id: string) => void;

  // Section 3: Meet the Best Sellers
  bestsellerSection: BestsellerSectionCMS;
  updateBestsellerSection: (data: Partial<BestsellerSectionCMS>) => void;

  // Section 4: Watch It & Buy It Video Reels
  videoSection: VideoSectionCMS;
  updateVideoSection: (data: Partial<VideoSectionCMS>) => void;
  videoReels: VideoReelCMS[];
  updateVideoReel: (id: string, reel: Partial<VideoReelCMS>) => void;
  addVideoReel: (reel: Omit<VideoReelCMS, 'id'>) => void;
  deleteVideoReel: (id: string) => void;

  // Section 5: Founder's Story & Column
  founderData: FounderCMS;
  updateFounderData: (data: Partial<FounderCMS>) => void;

  // Section 6: Curated Collection Spotlight Row
  spotlightSection: SpotlightSectionCMS;
  updateSpotlightSection: (data: Partial<SpotlightSectionCMS>) => void;

  // Section 7: Shop By Your Choice
  choiceSection: ChoiceSectionCMS;
  updateChoiceSection: (data: Partial<ChoiceSectionCMS>) => void;
  updateChoiceTab: (tabId: string, updated: Partial<ChoiceSectionCMS['tabs'][0]>) => void;
  addChoiceTab: (tab: Omit<ChoiceSectionCMS['tabs'][0], 'id'>) => void;
  deleteChoiceTab: (tabId: string) => void;

  // Section 8: 4 Value Props & Trust Badges
  valueProps: ValuePropCMS[];
  updateValueProp: (id: string, prop: Partial<ValuePropCMS>) => void;
  addValueProp: (prop: Omit<ValuePropCMS, 'id'>) => void;
  deleteValueProp: (id: string) => void;

  // Section 9: Announcements & Marquee Strip
  announcements: AnnouncementCMS[];
  updateAnnouncement: (id: string, ann: Partial<AnnouncementCMS>) => void;
  addAnnouncement: (ann: Omit<AnnouncementCMS, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  marqueeData: MarqueeCMS;
  updateMarqueeData: (data: Partial<MarqueeCMS>) => void;

  // Section 10: VIP Newsletter Privilege Banner
  newsletterData: NewsletterCMS;
  updateNewsletterData: (data: Partial<NewsletterCMS>) => void;

  // Brand Story
  brandStory: BrandStoryCMS;
  updateBrandStory: (story: Partial<BrandStoryCMS>) => void;

  // Global Reset
  resetToDefaults: () => void;
}

const MediaCMSContext = createContext<MediaCMSContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEY_HERO = 'divines_hero_slides_cms_v7';
const STORAGE_KEY_CIRCLES = 'divines_category_circles_cms_v1';
const STORAGE_KEY_BESTSELLER = 'divines_bestseller_section_cms_v1';
const STORAGE_KEY_VIDEO_SEC = 'divines_video_section_cms_v1';
const STORAGE_KEY_REELS = 'divines_video_reels_cms_v3';
const STORAGE_KEY_FOUNDER = 'divines_founder_data_cms_v3';
const STORAGE_KEY_SPOTLIGHT = 'divines_spotlight_section_cms_v1';
const STORAGE_KEY_CHOICE = 'divines_choice_section_cms_v1';
const STORAGE_KEY_VALUE_PROPS = 'divines_value_props_cms_v1';
const STORAGE_KEY_ANN = 'divines_announcements_cms_v3';
const STORAGE_KEY_MARQUEE = 'divines_marquee_cms_v1';
const STORAGE_KEY_NEWSLETTER = 'divines_newsletter_cms_v1';
const STORAGE_KEY_STORY = 'divines_brand_story_cms_v3';

export const MediaCMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Section 1: Hero Slides
  const [heroSlides, setHeroSlides] = useState<HeroSlideCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HERO);
      if (saved) {
        const parsed: HeroSlideCMS[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_HERO_SLIDES;
    } catch {
      return INITIAL_HERO_SLIDES;
    }
  });

  // Section 2: Category Circles
  const [categoryCircles, setCategoryCircles] = useState<CategoryCircleCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CIRCLES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CATEGORY_CIRCLES;
    } catch {
      return INITIAL_CATEGORY_CIRCLES;
    }
  });

  // Section 3: Bestseller Section
  const [bestsellerSection, setBestsellerSection] = useState<BestsellerSectionCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BESTSELLER);
      return saved ? JSON.parse(saved) : INITIAL_BESTSELLER_SECTION;
    } catch {
      return INITIAL_BESTSELLER_SECTION;
    }
  });

  // Section 4: Video Section & Reels
  const [videoSection, setVideoSection] = useState<VideoSectionCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VIDEO_SEC);
      return saved ? JSON.parse(saved) : INITIAL_VIDEO_SECTION;
    } catch {
      return INITIAL_VIDEO_SECTION;
    }
  });

  const [videoReels, setVideoReels] = useState<VideoReelCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REELS);
      return saved ? JSON.parse(saved) : INITIAL_VIDEO_REELS;
    } catch {
      return INITIAL_VIDEO_REELS;
    }
  });

  // Section 5: Founder Data
  const [founderData, setFounderData] = useState<FounderCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FOUNDER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.imageUrl && parsed.imageUrl.startsWith('/src/assets')) {
          parsed.imageUrl = '/images/founder/founder_sonu_real_1791375717528.jpg';
        }
        return parsed;
      }
      return INITIAL_FOUNDER_DATA;
    } catch {
      return INITIAL_FOUNDER_DATA;
    }
  });

  // Section 6: Spotlight Section
  const [spotlightSection, setSpotlightSection] = useState<SpotlightSectionCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SPOTLIGHT);
      return saved ? JSON.parse(saved) : INITIAL_SPOTLIGHT_SECTION;
    } catch {
      return INITIAL_SPOTLIGHT_SECTION;
    }
  });

  // Section 7: Choice Section
  const [choiceSection, setChoiceSection] = useState<ChoiceSectionCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHOICE);
      return saved ? JSON.parse(saved) : INITIAL_CHOICE_SECTION;
    } catch {
      return INITIAL_CHOICE_SECTION;
    }
  });

  // Section 8: Value Props
  const [valueProps, setValueProps] = useState<ValuePropCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VALUE_PROPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_VALUE_PROPS;
    } catch {
      return INITIAL_VALUE_PROPS;
    }
  });

  // Section 9: Announcements & Marquee
  const [announcements, setAnnouncements] = useState<AnnouncementCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANN);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [marqueeData, setMarqueeData] = useState<MarqueeCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MARQUEE);
      return saved ? JSON.parse(saved) : INITIAL_MARQUEE;
    } catch {
      return INITIAL_MARQUEE;
    }
  });

  // Section 10: Newsletter
  const [newsletterData, setNewsletterData] = useState<NewsletterCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NEWSLETTER);
      return saved ? JSON.parse(saved) : INITIAL_NEWSLETTER;
    } catch {
      return INITIAL_NEWSLETTER;
    }
  });

  // Brand Story
  const [brandStory, setBrandStory] = useState<BrandStoryCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORY);
      return saved ? JSON.parse(saved) : INITIAL_BRAND_STORY;
    } catch {
      return INITIAL_BRAND_STORY;
    }
  });

  // Cloud sync tracking refs
  const isCloudLoadedRef = useRef(false);
  const lastSyncedRef = useRef<Record<string, string>>({});
  const debounceTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Sync content across all visitors from Supabase site_content table
  const syncFromCloud = useCallback(async () => {
    try {
      const content = await fetchSiteContent();
      if (!content) {
        isCloudLoadedRef.current = true;
        return;
      }

      if (content[STORAGE_KEY_HERO]) {
        const val = content[STORAGE_KEY_HERO];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_HERO]) {
          lastSyncedRef.current[STORAGE_KEY_HERO] = json;
          try { localStorage.setItem(STORAGE_KEY_HERO, json); } catch {}
          if (Array.isArray(val) && val.length > 0) setHeroSlides(val);
        }
      }

      if (content[STORAGE_KEY_CIRCLES]) {
        const val = content[STORAGE_KEY_CIRCLES];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_CIRCLES]) {
          lastSyncedRef.current[STORAGE_KEY_CIRCLES] = json;
          try { localStorage.setItem(STORAGE_KEY_CIRCLES, json); } catch {}
          if (Array.isArray(val) && val.length > 0) setCategoryCircles(val);
        }
      }

      if (content[STORAGE_KEY_BESTSELLER]) {
        const val = content[STORAGE_KEY_BESTSELLER];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_BESTSELLER]) {
          lastSyncedRef.current[STORAGE_KEY_BESTSELLER] = json;
          try { localStorage.setItem(STORAGE_KEY_BESTSELLER, json); } catch {}
          setBestsellerSection(val);
        }
      }

      if (content[STORAGE_KEY_VIDEO_SEC]) {
        const val = content[STORAGE_KEY_VIDEO_SEC];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_VIDEO_SEC]) {
          lastSyncedRef.current[STORAGE_KEY_VIDEO_SEC] = json;
          try { localStorage.setItem(STORAGE_KEY_VIDEO_SEC, json); } catch {}
          setVideoSection(val);
        }
      }

      if (content[STORAGE_KEY_REELS]) {
        const val = content[STORAGE_KEY_REELS];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_REELS]) {
          lastSyncedRef.current[STORAGE_KEY_REELS] = json;
          try { localStorage.setItem(STORAGE_KEY_REELS, json); } catch {}
          if (Array.isArray(val) && val.length > 0) setVideoReels(val);
        }
      }

      if (content[STORAGE_KEY_FOUNDER]) {
        const val = content[STORAGE_KEY_FOUNDER];
        if (val?.imageUrl && val.imageUrl.startsWith('/src/assets')) {
          val.imageUrl = '/images/founder/founder_sonu_real_1791375717528.jpg';
        }
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_FOUNDER]) {
          lastSyncedRef.current[STORAGE_KEY_FOUNDER] = json;
          try { localStorage.setItem(STORAGE_KEY_FOUNDER, json); } catch {}
          setFounderData(val);
        }
      }

      if (content[STORAGE_KEY_SPOTLIGHT]) {
        const val = content[STORAGE_KEY_SPOTLIGHT];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_SPOTLIGHT]) {
          lastSyncedRef.current[STORAGE_KEY_SPOTLIGHT] = json;
          try { localStorage.setItem(STORAGE_KEY_SPOTLIGHT, json); } catch {}
          setSpotlightSection(val);
        }
      }

      if (content[STORAGE_KEY_CHOICE]) {
        const val = content[STORAGE_KEY_CHOICE];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_CHOICE]) {
          lastSyncedRef.current[STORAGE_KEY_CHOICE] = json;
          try { localStorage.setItem(STORAGE_KEY_CHOICE, json); } catch {}
          setChoiceSection(val);
        }
      }

      if (content[STORAGE_KEY_VALUE_PROPS]) {
        const val = content[STORAGE_KEY_VALUE_PROPS];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_VALUE_PROPS]) {
          lastSyncedRef.current[STORAGE_KEY_VALUE_PROPS] = json;
          try { localStorage.setItem(STORAGE_KEY_VALUE_PROPS, json); } catch {}
          if (Array.isArray(val) && val.length > 0) setValueProps(val);
        }
      }

      if (content[STORAGE_KEY_ANN]) {
        const val = content[STORAGE_KEY_ANN];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_ANN]) {
          lastSyncedRef.current[STORAGE_KEY_ANN] = json;
          try { localStorage.setItem(STORAGE_KEY_ANN, json); } catch {}
          if (Array.isArray(val) && val.length > 0) setAnnouncements(val);
        }
      }

      if (content[STORAGE_KEY_MARQUEE]) {
        const val = content[STORAGE_KEY_MARQUEE];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_MARQUEE]) {
          lastSyncedRef.current[STORAGE_KEY_MARQUEE] = json;
          try { localStorage.setItem(STORAGE_KEY_MARQUEE, json); } catch {}
          setMarqueeData(val);
        }
      }

      if (content[STORAGE_KEY_NEWSLETTER]) {
        const val = content[STORAGE_KEY_NEWSLETTER];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_NEWSLETTER]) {
          lastSyncedRef.current[STORAGE_KEY_NEWSLETTER] = json;
          try { localStorage.setItem(STORAGE_KEY_NEWSLETTER, json); } catch {}
          setNewsletterData(val);
        }
      }

      if (content[STORAGE_KEY_STORY]) {
        const val = content[STORAGE_KEY_STORY];
        const json = JSON.stringify(val);
        if (json !== lastSyncedRef.current[STORAGE_KEY_STORY]) {
          lastSyncedRef.current[STORAGE_KEY_STORY] = json;
          try { localStorage.setItem(STORAGE_KEY_STORY, json); } catch {}
          setBrandStory(val);
        }
      }
    } catch (e) {
      console.warn('syncFromCloud error:', e);
    } finally {
      isCloudLoadedRef.current = true;
    }
  }, []);

  // Sync on mount, on window focus/visibility, and every 2 minutes
  useEffect(() => {
    syncFromCloud();

    const handleFocus = () => syncFromCloud();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncFromCloud();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    const interval = setInterval(syncFromCloud, 2 * 60 * 1000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [syncFromCloud]);

  // Persist helper: writes localStorage, and after first cloud load debounces 800ms to saveSiteContent
  const persist = useCallback((key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage error:', e);
    }

    if (!isCloudLoadedRef.current) return;

    const currentJson = JSON.stringify(value);
    if (currentJson === lastSyncedRef.current[key]) return;

    if (debounceTimersRef.current[key]) {
      clearTimeout(debounceTimersRef.current[key]);
    }

    debounceTimersRef.current[key] = setTimeout(async () => {
      lastSyncedRef.current[key] = currentJson;
      await saveSiteContent(key, value);
    }, 800);
  }, []);

  // 13 auto-persist calls using persist(key, value)
  useEffect(() => { persist(STORAGE_KEY_HERO, heroSlides); }, [heroSlides, persist]);
  useEffect(() => { persist(STORAGE_KEY_CIRCLES, categoryCircles); }, [categoryCircles, persist]);
  useEffect(() => { persist(STORAGE_KEY_BESTSELLER, bestsellerSection); }, [bestsellerSection, persist]);
  useEffect(() => { persist(STORAGE_KEY_VIDEO_SEC, videoSection); }, [videoSection, persist]);
  useEffect(() => { persist(STORAGE_KEY_REELS, videoReels); }, [videoReels, persist]);
  useEffect(() => { persist(STORAGE_KEY_FOUNDER, founderData); }, [founderData, persist]);
  useEffect(() => { persist(STORAGE_KEY_SPOTLIGHT, spotlightSection); }, [spotlightSection, persist]);
  useEffect(() => { persist(STORAGE_KEY_CHOICE, choiceSection); }, [choiceSection, persist]);
  useEffect(() => { persist(STORAGE_KEY_VALUE_PROPS, valueProps); }, [valueProps, persist]);
  useEffect(() => { persist(STORAGE_KEY_ANN, announcements); }, [announcements, persist]);
  useEffect(() => { persist(STORAGE_KEY_MARQUEE, marqueeData); }, [marqueeData, persist]);
  useEffect(() => { persist(STORAGE_KEY_NEWSLETTER, newsletterData); }, [newsletterData, persist]);
  useEffect(() => { persist(STORAGE_KEY_STORY, brandStory); }, [brandStory, persist]);

  // Updaters for Section 1: Hero Slides
  const updateHeroSlide = (id: string, updated: Partial<HeroSlideCMS>) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };
  const addHeroSlide = (slideData: Omit<HeroSlideCMS, 'id'>) => {
    setHeroSlides((prev) => [...prev, { ...slideData, id: `hero-slide-${Date.now()}` }]);
  };
  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  // Updaters for Section 2: Category Circles
  const updateCategoryCircle = (id: string, updated: Partial<CategoryCircleCMS>) => {
    setCategoryCircles((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };
  const addCategoryCircle = (circleData: Omit<CategoryCircleCMS, 'id'>) => {
    setCategoryCircles((prev) => [...prev, { ...circleData, id: `circle-${Date.now()}` }]);
  };
  const deleteCategoryCircle = (id: string) => {
    setCategoryCircles((prev) => prev.filter((c) => c.id !== id));
  };

  // Updaters for Section 3: Bestseller Section
  const updateBestsellerSection = (data: Partial<BestsellerSectionCMS>) => {
    setBestsellerSection((prev) => ({ ...prev, ...data }));
  };

  // Updaters for Section 4: Video Section & Reels
  const updateVideoSection = (data: Partial<VideoSectionCMS>) => {
    setVideoSection((prev) => ({ ...prev, ...data }));
  };
  const updateVideoReel = (id: string, updated: Partial<VideoReelCMS>) => {
    setVideoReels((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
  };
  const addVideoReel = (reelData: Omit<VideoReelCMS, 'id'>) => {
    setVideoReels((prev) => [...prev, { ...reelData, id: `reel-${Date.now()}` }]);
  };
  const deleteVideoReel = (id: string) => {
    setVideoReels((prev) => prev.filter((r) => r.id !== id));
  };

  // Updaters for Section 5: Founder Data
  const updateFounderData = (data: Partial<FounderCMS>) => {
    setFounderData((prev) => ({ ...prev, ...data }));
  };

  // Updaters for Section 6: Spotlight Section
  const updateSpotlightSection = (data: Partial<SpotlightSectionCMS>) => {
    setSpotlightSection((prev) => ({ ...prev, ...data }));
  };

  // Updaters for Section 7: Choice Section
  const updateChoiceSection = (data: Partial<ChoiceSectionCMS>) => {
    setChoiceSection((prev) => ({ ...prev, ...data }));
  };
  const updateChoiceTab = (tabId: string, updated: Partial<ChoiceSectionCMS['tabs'][0]>) => {
    setChoiceSection((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) => (t.id === tabId ? { ...t, ...updated } : t)),
    }));
  };
  const addChoiceTab = (tabData: Omit<ChoiceSectionCMS['tabs'][0], 'id'>) => {
    setChoiceSection((prev) => ({
      ...prev,
      tabs: [...prev.tabs, { ...tabData, id: `tab-${Date.now()}` }],
    }));
  };
  const deleteChoiceTab = (tabId: string) => {
    setChoiceSection((prev) => ({
      ...prev,
      tabs: prev.tabs.filter((t) => t.id !== tabId),
    }));
  };

  // Updaters for Section 8: Value Props
  const updateValueProp = (id: string, updated: Partial<ValuePropCMS>) => {
    setValueProps((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };
  const addValueProp = (propData: Omit<ValuePropCMS, 'id'>) => {
    setValueProps((prev) => [...prev, { ...propData, id: `prop-${Date.now()}` }]);
  };
  const deleteValueProp = (id: string) => {
    setValueProps((prev) => prev.filter((p) => p.id !== id));
  };

  // Updaters for Section 9: Announcements & Marquee
  const updateAnnouncement = (id: string, updated: Partial<AnnouncementCMS>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };
  const addAnnouncement = (annData: Omit<AnnouncementCMS, 'id'>) => {
    setAnnouncements((prev) => [...prev, { ...annData, id: `ann-${Date.now()}` }]);
  };
  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };
  const updateMarqueeData = (data: Partial<MarqueeCMS>) => {
    setMarqueeData((prev) => ({ ...prev, ...data }));
  };

  // Updaters for Section 10: Newsletter
  const updateNewsletterData = (data: Partial<NewsletterCMS>) => {
    setNewsletterData((prev) => ({ ...prev, ...data }));
  };

  // Brand Story
  const updateBrandStory = (story: Partial<BrandStoryCMS>) => {
    setBrandStory((prev) => ({ ...prev, ...story }));
  };

  // Reset All
  const resetToDefaults = () => {
    setHeroSlides(INITIAL_HERO_SLIDES);
    setCategoryCircles(INITIAL_CATEGORY_CIRCLES);
    setBestsellerSection(INITIAL_BESTSELLER_SECTION);
    setVideoSection(INITIAL_VIDEO_SECTION);
    setVideoReels(INITIAL_VIDEO_REELS);
    setFounderData(INITIAL_FOUNDER_DATA);
    setSpotlightSection(INITIAL_SPOTLIGHT_SECTION);
    setChoiceSection(INITIAL_CHOICE_SECTION);
    setValueProps(INITIAL_VALUE_PROPS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setMarqueeData(INITIAL_MARQUEE);
    setNewsletterData(INITIAL_NEWSLETTER);
    setBrandStory(INITIAL_BRAND_STORY);
  };

  return (
    <MediaCMSContext.Provider
      value={{
        heroSlides,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,

        categoryCircles,
        updateCategoryCircle,
        addCategoryCircle,
        deleteCategoryCircle,

        bestsellerSection,
        updateBestsellerSection,

        videoSection,
        updateVideoSection,
        videoReels,
        updateVideoReel,
        addVideoReel,
        deleteVideoReel,

        founderData,
        updateFounderData,

        spotlightSection,
        updateSpotlightSection,

        choiceSection,
        updateChoiceSection,
        updateChoiceTab,
        addChoiceTab,
        deleteChoiceTab,

        valueProps,
        updateValueProp,
        addValueProp,
        deleteValueProp,

        announcements,
        updateAnnouncement,
        addAnnouncement,
        deleteAnnouncement,
        marqueeData,
        updateMarqueeData,

        newsletterData,
        updateNewsletterData,

        brandStory,
        updateBrandStory,

        resetToDefaults,
      }}
    >
      {children}
    </MediaCMSContext.Provider>
  );
};

export const useMediaCMS = (): MediaCMSContextType => {
  const context = useContext(MediaCMSContext);
  if (!context) {
    throw new Error('useMediaCMS must be used within a MediaCMSProvider');
  }
  return context;
};
