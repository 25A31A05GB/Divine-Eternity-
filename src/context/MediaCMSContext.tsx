import React, { createContext, useContext, useState, useEffect } from 'react';
import { HeroSlideCMS, VideoReelCMS, CategoryCMS, AnnouncementCMS, BrandStoryCMS } from '../types';

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
    bgGradient: 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB] dark:from-[#17191F] dark:via-[#111318] dark:to-[#08090B]',
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
    bgGradient: 'from-[#FFF0F5] via-[#FFF9EB] to-[#FFF0F5] dark:from-[#17191F] dark:via-[#111318] dark:to-[#08090B]',
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
    bgGradient: 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB] dark:from-[#17191F] dark:via-[#111318] dark:to-[#08090B]',
    featuredProductId: 'gift-[#jewel-1]',
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
    bgGradient: 'from-[#FFF0F5] via-[#FFFDF8] to-[#FFF0F5] dark:from-[#17191F] dark:via-[#111318] dark:to-[#08090B]',
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
    bgGradient: 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB] dark:from-[#17191F] dark:via-[#111318] dark:to-[#08090B]',
    featuredProductId: 'gift-jewel-1',
    isActive: true,
  },
];

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

export const INITIAL_BRAND_STORY: BrandStoryCMS = {
  title: 'Designed with Personality. Built for Everyday Life.',
  subtitle: 'The Cute Covers Club Studio',
  description: 'Every phone case in the Gadgets Destiny lineup is crafted with care. From shockproof drop-cushion bumpers to pearl wristlet charms, zipper wallet pouches, and vanity mirrors, our mission is simple: to make sure you never carry a boring phone case again.',
  mediaType: 'video',
  mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-opening-a-jewelry-box-43306-large.mp4',
  posterUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80',
};

interface MediaCMSContextType {
  heroSlides: HeroSlideCMS[];
  videoReels: VideoReelCMS[];
  announcements: AnnouncementCMS[];
  brandStory: BrandStoryCMS;
  updateHeroSlide: (id: string, slide: Partial<HeroSlideCMS>) => void;
  addHeroSlide: (slide: Omit<HeroSlideCMS, 'id'>) => void;
  deleteHeroSlide: (id: string) => void;
  updateVideoReel: (id: string, reel: Partial<VideoReelCMS>) => void;
  addVideoReel: (reel: Omit<VideoReelCMS, 'id'>) => void;
  deleteVideoReel: (id: string) => void;
  updateAnnouncement: (id: string, ann: Partial<AnnouncementCMS>) => void;
  addAnnouncement: (ann: Omit<AnnouncementCMS, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  updateBrandStory: (story: Partial<BrandStoryCMS>) => void;
  resetToDefaults: () => void;
}

const MediaCMSContext = createContext<MediaCMSContextType | undefined>(undefined);

const STORAGE_KEY_HERO = 'divines_hero_slides_cms_v4';
const STORAGE_KEY_REELS = 'divines_video_reels_cms_v2';
const STORAGE_KEY_ANN = 'divines_announcements_cms_v2';
const STORAGE_KEY_STORY = 'divines_brand_story_cms_v2';

export const MediaCMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroSlides, setHeroSlides] = useState<HeroSlideCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HERO);
      return saved ? JSON.parse(saved) : INITIAL_HERO_SLIDES;
    } catch {
      return INITIAL_HERO_SLIDES;
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

  const [announcements, setAnnouncements] = useState<AnnouncementCMS[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANN);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(heroSlides));
    } catch (e) {
      console.error('Failed to save hero slides CMS', e);
    }
  }, [heroSlides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REELS, JSON.stringify(videoReels));
    } catch (e) {
      console.error('Failed to save video reels CMS', e);
    }
  }, [videoReels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANN, JSON.stringify(announcements));
    } catch (e) {
      console.error('Failed to save announcements CMS', e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STORY, JSON.stringify(brandStory));
    } catch (e) {
      console.error('Failed to save brand story CMS', e);
    }
  }, [brandStory]);

  const updateHeroSlide = (id: string, updated: Partial<HeroSlideCMS>) => {
    setHeroSlides((prev) =>
      prev.map((slide) => (slide.id === id ? { ...slide, ...updated } : slide))
    );
  };

  const addHeroSlide = (slideData: Omit<HeroSlideCMS, 'id'>) => {
    const newSlide: HeroSlideCMS = {
      ...slideData,
      id: `hero-slide-${Date.now()}`,
    };
    setHeroSlides((prev) => [...prev, newSlide]);
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((slide) => slide.id !== id));
  };

  const updateVideoReel = (id: string, updated: Partial<VideoReelCMS>) => {
    setVideoReels((prev) =>
      prev.map((reel) => (reel.id === id ? { ...reel, ...updated } : reel))
    );
  };

  const addVideoReel = (reelData: Omit<VideoReelCMS, 'id'>) => {
    const newReel: VideoReelCMS = {
      ...reelData,
      id: `reel-${Date.now()}`,
    };
    setVideoReels((prev) => [...prev, newReel]);
  };

  const deleteVideoReel = (id: string) => {
    setVideoReels((prev) => prev.filter((reel) => reel.id !== id));
  };

  const updateAnnouncement = (id: string, ann: Partial<AnnouncementCMS>) => {
    setAnnouncements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...ann } : item))
    );
  };

  const addAnnouncement = (ann: Omit<AnnouncementCMS, 'id'>) => {
    const newItem: AnnouncementCMS = {
      ...ann,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements((prev) => [...prev, newItem]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((item) => item.id !== id));
  };

  const updateBrandStory = (story: Partial<BrandStoryCMS>) => {
    setBrandStory((prev) => ({ ...prev, ...story }));
  };

  const resetToDefaults = () => {
    setHeroSlides(INITIAL_HERO_SLIDES);
    setVideoReels(INITIAL_VIDEO_REELS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setBrandStory(INITIAL_BRAND_STORY);
    localStorage.removeItem(STORAGE_KEY_HERO);
    localStorage.removeItem(STORAGE_KEY_REELS);
    localStorage.removeItem(STORAGE_KEY_ANN);
    localStorage.removeItem(STORAGE_KEY_STORY);
  };

  return (
    <MediaCMSContext.Provider
      value={{
        heroSlides,
        videoReels,
        announcements,
        brandStory,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        updateVideoReel,
        addVideoReel,
        deleteVideoReel,
        updateAnnouncement,
        addAnnouncement,
        deleteAnnouncement,
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
