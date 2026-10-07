import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  HeroSlideCMS,
  VideoReelCMS,
  AnnouncementCMS,
  BrandStoryCMS,
  CategoryCircleCMS,
  BestsellerSectionCMS,
  FounderNoteCMS,
  CuratedSpotlightCMS,
  ChoiceSectionCMS,
  ValuePropCMS,
  NewsletterCMS,
} from '../types';

export const INITIAL_ANNOUNCEMENTS: AnnouncementCMS[] = [
  { id: 'ann-1', text: 'SPECIAL PAIRING: ANY 2 CASES FOR ₹849 – CODE: ', code: 'FLAT849', highlight: 'FLAT849', isActive: true },
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
    customImageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
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
    customImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
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
    customImageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1200&q=80',
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
    customImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
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
    customImageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB]',
    featuredProductId: 'gift-jewel-1',
    isActive: true,
  },
];

export const INITIAL_CATEGORY_CIRCLES: CategoryCircleCMS[] = [
  {
    id: 'products',
    name: 'Products',
    subtitle: '7 Gift Categories',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
    badge: 'Explore All',
    route: 'products',
    isActive: true,
  },
  {
    id: 'personalization',
    name: 'Personalization',
    subtitle: 'WhatsApp Confirmed',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    badge: 'WhatsApp Verified',
    route: 'personalization',
    isActive: true,
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    subtitle: 'UGC & Creators',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    badge: 'Open for Creators',
    route: 'collaboration',
    isActive: true,
  },
  {
    id: 'upcoming-campaigns',
    name: 'Upcoming Campaigns',
    subtitle: '@divineseternity',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    badge: 'Follow & Win',
    route: 'upcoming-campaigns',
    isActive: true,
  },
  {
    id: 'creator-club',
    name: 'Creator Club',
    subtitle: 'Earn up to ₹7k',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    badge: 'Earn up to ₹7k',
    route: 'creator-club',
    isActive: true,
  },
  {
    id: 'affiliate-marketing',
    name: 'Affiliate Marketing',
    subtitle: '15-20% Comm.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80',
    badge: 'Share & Earn',
    route: 'affiliate-marketing',
    isActive: true,
  },
  {
    id: 'podcast',
    name: 'Podcast',
    subtitle: 'Inspiring Stories',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80',
    badge: 'Listen Now',
    route: 'podcast',
    isActive: true,
  },
];

export const INITIAL_BESTSELLER_SECTION: BestsellerSectionCMS = {
  eyebrow: 'THE ONES EVERYONE IS ASKING ABOUT',
  title: 'Meet the',
  accentWord: 'Best sellers',
  subtitle: 'Over 40,000+ cherished memories handcrafted. Buy 3 Pay For 2 on all bestsellers!',
  promoTag: 'BUY 3 PAY FOR 2 APPLIED AT CHECKOUT',
  isActive: true,
};

export const INITIAL_VIDEO_REELS: VideoReelCMS[] = [
  {
    id: 'reel-1',
    title: 'Watch Unboxing: 18k Gold Cursive Name Pendant',
    tagline: 'See the micro-engraving shine under velvet studio lights',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-opening-a-jewelry-box-43306-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    linkedProductId: 'gift-1',
    viewsCount: '48.2k',
    durationSeconds: 15,
    isActive: true,
  },
  {
    id: 'reel-2',
    title: '3-Year Preserved Rose Bell Jar in Night Glow',
    tagline: 'Real rose preserved at peak bloom with ambient fairy lights',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-red-rose-in-a-glass-jar-with-lights-42907-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    linkedProductId: 'gift-2',
    viewsCount: '92.4k',
    durationSeconds: 18,
    isActive: true,
  },
  {
    id: 'reel-3',
    title: 'Custom Spotify Acrylic Plaque Scan Test',
    tagline: 'Scans instantly on the Spotify App to play your song',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-playing-music-42999-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    linkedProductId: 'gift-3',
    viewsCount: '120.5k',
    durationSeconds: 12,
    isActive: true,
  },
  {
    id: 'reel-4',
    title: '3D Laser Memory Crystal Lamp Unboxing',
    tagline: 'Watch how memories glow inside multi-faceted K9 crystal',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-crystal-glass-reflecting-colored-light-43224-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    linkedProductId: 'gift-4',
    viewsCount: '64.1k',
    durationSeconds: 14,
    isActive: true,
  },
];

export const INITIAL_FOUNDER_NOTE: FounderNoteCMS = {
  title: 'A Note From',
  accentTitle: 'Founder',
  subtitle: 'What started as a dream at 16 is now a reality lived every single day.',
  badge: 'FOUNDER’S STORY • EST. AUG 31',
  quote: 'Every piece created at Divine’s Eternity holds a piece of someone’s story. Thank you for letting us be part of your happiest memories.',
  paragraphs: [
    'I started Divine’s Eternity with a single table, a laser engraver, and a dream: that a gift shouldn’t just be an object, but a memory sealed forever.',
    'Over the years, we have hand-poured thousands of candles, preserved timeless roses, and etched the names of loved ones across India. Our artisans inspect every order by hand before it leaves our studio.',
    'From heartfelt birthdays to 50th anniversaries, we consider it our greatest honor to make someone smile across the distance.',
  ],
  founderName: 'Sonu',
  founderRole: 'Founder & Creative Director',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  signature: 'Sonu',
  stats: [
    { label: 'Happy Memories Created', value: '45,000+' },
    { label: 'Customer Rating', value: '4.95 / 5' },
    { label: 'Artisan Crafted Orders', value: '100% Inspected' },
  ],
  instagramHandle: '@divineseternity',
  primaryCtaText: 'Explore Handcrafted Gifts',
  secondaryCtaText: 'Join Creator Club',
  isActive: true,
};

export const INITIAL_CURATED_SPOTLIGHT: CuratedSpotlightCMS = {
  eyebrow: 'SIGNATURE ATELIER CRAFT',
  title: 'Personalized Name Jewellery',
  subtitle: '18k thick gold vermeil handwriting pendants & Roman numeral engraved bar bracelets.',
  category: 'Personalized Jewellery',
  badge: 'Micro-Laser Engraved',
  ctaText: 'View All Jewellery',
  isActive: true,
};

export const INITIAL_CHOICE_SECTION: ChoiceSectionCMS = {
  eyebrow: 'DISCOVER BY OCCASION & STYLE',
  title: 'Shop By Your',
  subtitle: 'Hand-picked keepsakes categorized for your exact gifting moment.',
  tabs: [
    { id: 'tab-1', label: 'For Couples & Anniversaries', category: 'Romantic Couple Hampers & Scented Candle Sets' },
    { id: 'tab-2', label: 'Preserved Eternal Flowers', category: 'Preserved Eternal Roses & Dome Displays' },
    { id: 'tab-3', label: 'Engraved Keepsakes & Boxes', category: 'Engraved Wooden Gift Boxes & Keepsakes' },
    { id: 'tab-4', label: 'Memory Lamps & Acrylics', category: 'Memory Photo Lamps & Crystal Cubes' },
  ],
  isActive: true,
};

export const INITIAL_VALUE_PROPS: ValuePropCMS[] = [
  {
    id: 'prop-1',
    title: '100% Handcrafted',
    subtitle: 'Each bespoke piece laser engraved & assembled with love.',
    iconName: 'Sparkles',
    badge: 'Artisan Quality',
    isActive: true,
  },
  {
    id: 'prop-2',
    title: 'Insured Express Dispatch',
    subtitle: 'Safe shockproof packaging with Pan-India tracking.',
    iconName: 'Truck',
    badge: 'Express Delivery',
    isActive: true,
  },
  {
    id: 'prop-3',
    title: 'WhatsApp Preview & Proof',
    subtitle: 'We share digital mockups before final laser production.',
    iconName: 'MessageSquare',
    badge: '100% Verified',
    isActive: true,
  },
  {
    id: 'prop-4',
    title: 'Luxury Gift Box Included',
    subtitle: 'Signature velvet cases with personalized handwritten note.',
    iconName: 'Gift',
    badge: 'Ready to Gift',
    isActive: true,
  },
];

export const INITIAL_NEWSLETTER: NewsletterCMS = {
  title: 'Join the Divine’s Eternity Club',
  subtitle: 'Receive exclusive early access to limited edition creations, special holiday discounts, and engraving inspiration.',
  discountCode: 'LOVE100',
  discountBadge: 'Flat ₹100 Off',
  buttonText: 'Claim My Gift Privilege',
  isActive: true,
};

export const INITIAL_BRAND_STORY: BrandStoryCMS = {
  title: 'Designed with Personality. Built for Everyday Life.',
  subtitle: 'Divine’s Eternity Atelier',
  description: 'Every gift in the Divine’s Eternity lineup is handcrafted with care. From 3D laser crystal lamps to preserved eternal rose domes and custom handwriting lockets, our mission is simple: to turn your cherished moments into forever keepsakes.',
  mediaType: 'video',
  mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-opening-a-jewelry-box-43306-large.mp4',
  posterUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80',
};

interface MediaCMSContextType {
  // Hero Slides
  heroSlides: HeroSlideCMS[];
  updateHeroSlide: (id: string, slide: Partial<HeroSlideCMS>) => void;
  addHeroSlide: (slide: Omit<HeroSlideCMS, 'id'>) => void;
  deleteHeroSlide: (id: string) => void;

  // Category Circles (7 Collections)
  categoryCircles: CategoryCircleCMS[];
  updateCategoryCircle: (id: string, circle: Partial<CategoryCircleCMS>) => void;
  addCategoryCircle: (circle: Omit<CategoryCircleCMS, 'id'>) => void;
  deleteCategoryCircle: (id: string) => void;

  // Best Sellers Section
  bestsellerSection: BestsellerSectionCMS;
  updateBestsellerSection: (data: Partial<BestsellerSectionCMS>) => void;

  // Video Reels
  videoReels: VideoReelCMS[];
  updateVideoReel: (id: string, reel: Partial<VideoReelCMS>) => void;
  addVideoReel: (reel: Omit<VideoReelCMS, 'id'>) => void;
  deleteVideoReel: (id: string) => void;

  // Founder Note
  founderNote: FounderNoteCMS;
  updateFounderNote: (data: Partial<FounderNoteCMS>) => void;

  // Curated Spotlight
  curatedSpotlight: CuratedSpotlightCMS;
  updateCuratedSpotlight: (data: Partial<CuratedSpotlightCMS>) => void;

  // Choice Selector
  choiceSection: ChoiceSectionCMS;
  updateChoiceSection: (data: Partial<ChoiceSectionCMS>) => void;

  // Value Props
  valueProps: ValuePropCMS[];
  updateValueProp: (id: string, prop: Partial<ValuePropCMS>) => void;
  addValueProp: (prop: Omit<ValuePropCMS, 'id'>) => void;
  deleteValueProp: (id: string) => void;

  // Announcements & Marquee
  announcements: AnnouncementCMS[];
  updateAnnouncement: (id: string, ann: Partial<AnnouncementCMS>) => void;
  addAnnouncement: (ann: Omit<AnnouncementCMS, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Newsletter
  newsletter: NewsletterCMS;
  updateNewsletter: (data: Partial<NewsletterCMS>) => void;

  // Brand Story
  brandStory: BrandStoryCMS;
  updateBrandStory: (story: Partial<BrandStoryCMS>) => void;

  // Reset all
  resetToDefaults: () => void;
}

const MediaCMSContext = createContext<MediaCMSContextType | undefined>(undefined);

const STORAGE_KEY_HERO = 'de_hero_slides_cms_v5';
const STORAGE_KEY_CIRCLES = 'de_category_circles_cms_v1';
const STORAGE_KEY_BESTSELLER = 'de_bestseller_section_cms_v1';
const STORAGE_KEY_REELS = 'de_video_reels_cms_v3';
const STORAGE_KEY_FOUNDER = 'de_founder_note_cms_v1';
const STORAGE_KEY_SPOTLIGHT = 'de_curated_spotlight_cms_v1';
const STORAGE_KEY_CHOICE = 'de_choice_section_cms_v1';
const STORAGE_KEY_PROPS = 'de_value_props_cms_v1';
const STORAGE_KEY_ANN = 'de_announcements_cms_v3';
const STORAGE_KEY_NEWSLETTER = 'de_newsletter_cms_v1';
const STORAGE_KEY_STORY = 'de_brand_story_cms_v3';

export const MediaCMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroSlides, setHeroSlides] = useState<HeroSlideCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HERO);
      return saved ? JSON.parse(saved) : INITIAL_HERO_SLIDES;
    } catch {
      return INITIAL_HERO_SLIDES;
    }
  });

  const [categoryCircles, setCategoryCircles] = useState<CategoryCircleCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CIRCLES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORY_CIRCLES;
    } catch {
      return INITIAL_CATEGORY_CIRCLES;
    }
  });

  const [bestsellerSection, setBestsellerSection] = useState<BestsellerSectionCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BESTSELLER);
      return saved ? JSON.parse(saved) : INITIAL_BESTSELLER_SECTION;
    } catch {
      return INITIAL_BESTSELLER_SECTION;
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

  const [founderNote, setFounderNote] = useState<FounderNoteCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FOUNDER);
      return saved ? JSON.parse(saved) : INITIAL_FOUNDER_NOTE;
    } catch {
      return INITIAL_FOUNDER_NOTE;
    }
  });

  const [curatedSpotlight, setCuratedSpotlight] = useState<CuratedSpotlightCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SPOTLIGHT);
      return saved ? JSON.parse(saved) : INITIAL_CURATED_SPOTLIGHT;
    } catch {
      return INITIAL_CURATED_SPOTLIGHT;
    }
  });

  const [choiceSection, setChoiceSection] = useState<ChoiceSectionCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHOICE);
      return saved ? JSON.parse(saved) : INITIAL_CHOICE_SECTION;
    } catch {
      return INITIAL_CHOICE_SECTION;
    }
  });

  const [valueProps, setValueProps] = useState<ValuePropCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROPS);
      return saved ? JSON.parse(saved) : INITIAL_VALUE_PROPS;
    } catch {
      return INITIAL_VALUE_PROPS;
    }
  });

  const [announcements, setAnnouncements] = useState<AnnouncementCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANN);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [newsletter, setNewsletter] = useState<NewsletterCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NEWSLETTER);
      return saved ? JSON.parse(saved) : INITIAL_NEWSLETTER;
    } catch {
      return INITIAL_NEWSLETTER;
    }
  });

  const [brandStory, setBrandStory] = useState<BrandStoryCMS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORY);
      return saved ? JSON.parse(saved) : INITIAL_BRAND_STORY;
    } catch {
      return INITIAL_BRAND_STORY;
    }
  });

  // Storage Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(heroSlides));
    } catch (e) {
      console.error(e);
    }
  }, [heroSlides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CIRCLES, JSON.stringify(categoryCircles));
    } catch (e) {
      console.error(e);
    }
  }, [categoryCircles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BESTSELLER, JSON.stringify(bestsellerSection));
    } catch (e) {
      console.error(e);
    }
  }, [bestsellerSection]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REELS, JSON.stringify(videoReels));
    } catch (e) {
      console.error(e);
    }
  }, [videoReels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FOUNDER, JSON.stringify(founderNote));
    } catch (e) {
      console.error(e);
    }
  }, [founderNote]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SPOTLIGHT, JSON.stringify(curatedSpotlight));
    } catch (e) {
      console.error(e);
    }
  }, [curatedSpotlight]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHOICE, JSON.stringify(choiceSection));
    } catch (e) {
      console.error(e);
    }
  }, [choiceSection]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROPS, JSON.stringify(valueProps));
    } catch (e) {
      console.error(e);
    }
  }, [valueProps]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANN, JSON.stringify(announcements));
    } catch (e) {
      console.error(e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NEWSLETTER, JSON.stringify(newsletter));
    } catch (e) {
      console.error(e);
    }
  }, [newsletter]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STORY, JSON.stringify(brandStory));
    } catch (e) {
      console.error(e);
    }
  }, [brandStory]);

  // Handlers
  const updateHeroSlide = (id: string, updated: Partial<HeroSlideCMS>) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const addHeroSlide = (slideData: Omit<HeroSlideCMS, 'id'>) => {
    const newSlide: HeroSlideCMS = { ...slideData, id: `hero-slide-${Date.now()}` };
    setHeroSlides((prev) => [...prev, newSlide]);
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const updateCategoryCircle = (id: string, updated: Partial<CategoryCircleCMS>) => {
    setCategoryCircles((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const addCategoryCircle = (circleData: Omit<CategoryCircleCMS, 'id'>) => {
    const newCircle: CategoryCircleCMS = { ...circleData, id: `circle-${Date.now()}` };
    setCategoryCircles((prev) => [...prev, newCircle]);
  };

  const deleteCategoryCircle = (id: string) => {
    setCategoryCircles((prev) => prev.filter((c) => c.id !== id));
  };

  const updateBestsellerSection = (data: Partial<BestsellerSectionCMS>) => {
    setBestsellerSection((prev) => ({ ...prev, ...data }));
  };

  const updateVideoReel = (id: string, updated: Partial<VideoReelCMS>) => {
    setVideoReels((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
  };

  const addVideoReel = (reelData: Omit<VideoReelCMS, 'id'>) => {
    const newReel: VideoReelCMS = { ...reelData, id: `reel-${Date.now()}` };
    setVideoReels((prev) => [...prev, newReel]);
  };

  const deleteVideoReel = (id: string) => {
    setVideoReels((prev) => prev.filter((r) => r.id !== id));
  };

  const updateFounderNote = (data: Partial<FounderNoteCMS>) => {
    setFounderNote((prev) => ({ ...prev, ...data }));
  };

  const updateCuratedSpotlight = (data: Partial<CuratedSpotlightCMS>) => {
    setCuratedSpotlight((prev) => ({ ...prev, ...data }));
  };

  const updateChoiceSection = (data: Partial<ChoiceSectionCMS>) => {
    setChoiceSection((prev) => ({ ...prev, ...data }));
  };

  const updateValueProp = (id: string, updated: Partial<ValuePropCMS>) => {
    setValueProps((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const addValueProp = (propData: Omit<ValuePropCMS, 'id'>) => {
    const newProp: ValuePropCMS = { ...propData, id: `prop-${Date.now()}` };
    setValueProps((prev) => [...prev, newProp]);
  };

  const deleteValueProp = (id: string) => {
    setValueProps((prev) => prev.filter((p) => p.id !== id));
  };

  const updateAnnouncement = (id: string, ann: Partial<AnnouncementCMS>) => {
    setAnnouncements((prev) => prev.map((item) => (item.id === id ? { ...item, ...ann } : item)));
  };

  const addAnnouncement = (ann: Omit<AnnouncementCMS, 'id'>) => {
    const newItem: AnnouncementCMS = { ...ann, id: `ann-${Date.now()}` };
    setAnnouncements((prev) => [...prev, newItem]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((item) => item.id !== id));
  };

  const updateNewsletter = (data: Partial<NewsletterCMS>) => {
    setNewsletter((prev) => ({ ...prev, ...data }));
  };

  const updateBrandStory = (story: Partial<BrandStoryCMS>) => {
    setBrandStory((prev) => ({ ...prev, ...story }));
  };

  const resetToDefaults = () => {
    setHeroSlides(INITIAL_HERO_SLIDES);
    setCategoryCircles(INITIAL_CATEGORY_CIRCLES);
    setBestsellerSection(INITIAL_BESTSELLER_SECTION);
    setVideoReels(INITIAL_VIDEO_REELS);
    setFounderNote(INITIAL_FOUNDER_NOTE);
    setCuratedSpotlight(INITIAL_CURATED_SPOTLIGHT);
    setChoiceSection(INITIAL_CHOICE_SECTION);
    setValueProps(INITIAL_VALUE_PROPS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNewsletter(INITIAL_NEWSLETTER);
    setBrandStory(INITIAL_BRAND_STORY);
    localStorage.removeItem(STORAGE_KEY_HERO);
    localStorage.removeItem(STORAGE_KEY_CIRCLES);
    localStorage.removeItem(STORAGE_KEY_BESTSELLER);
    localStorage.removeItem(STORAGE_KEY_REELS);
    localStorage.removeItem(STORAGE_KEY_FOUNDER);
    localStorage.removeItem(STORAGE_KEY_SPOTLIGHT);
    localStorage.removeItem(STORAGE_KEY_CHOICE);
    localStorage.removeItem(STORAGE_KEY_PROPS);
    localStorage.removeItem(STORAGE_KEY_ANN);
    localStorage.removeItem(STORAGE_KEY_NEWSLETTER);
    localStorage.removeItem(STORAGE_KEY_STORY);
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
        videoReels,
        updateVideoReel,
        addVideoReel,
        deleteVideoReel,
        founderNote,
        updateFounderNote,
        curatedSpotlight,
        updateCuratedSpotlight,
        choiceSection,
        updateChoiceSection,
        valueProps,
        updateValueProp,
        addValueProp,
        deleteValueProp,
        announcements,
        updateAnnouncement,
        addAnnouncement,
        deleteAnnouncement,
        newsletter,
        updateNewsletter,
        brandStory,
        updateBrandStory,
        resetToDefaults,
      }}
    >
      {children}
    </MediaCMSContext.Provider>
  );
};

export const useMediaCMS = () => {
  const context = useContext(MediaCMSContext);
  if (!context) {
    throw new Error('useMediaCMS must be used within a MediaCMSProvider');
  }
  return context;
};
