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
    eyebrow: 'Bespoke Haute Jewelry',
    title: '18k Gold Plated Custom Name Necklaces',
    tagline: 'Handcrafted luxury handwriting pendants in 18k thick gold vermeil. Presented in an archival velvet jewel casket.',
    coupon: 'LOVE100',
    highlightBadge: 'Atelier Edition',
    ctaText: 'Personalize Yours',
    ctaCategory: 'Personalized Name Jewelry',
    bgGradient: 'from-[#FAF8F5] via-[#FFFFFF] to-[#F1EDE6] dark:from-[#17191F] dark:via-[#111318] dark:to-[#08090B]',
    featuredProductId: 'gift-1',
    secondaryProductId: 'gift-2',
    isActive: true,
  },
  {
    id: 'hero-slide-2',
    eyebrow: 'Everlasting Romance',
    title: 'Enchanted Preserved Rose in Glass Cloche',
    tagline: '100% natural eternal rose that retains softness for years with warm fairy LED ambient illumination.',
    coupon: 'BUY3PAY2',
    highlightBadge: 'Artisanal Keepsake',
    ctaText: 'Explore Rose Domes',
    ctaCategory: 'Preserved Eternal Roses & Dome Displays',
    bgGradient: 'from-[#FAF8F5] via-[#FFFFFF] to-[#F1EDE6] dark:from-[#17191F] dark:via-[#111318] dark:to-[#08090B]',
    featuredProductId: 'gift-2',
    secondaryProductId: 'gift-3',
    isActive: true,
  },
  {
    id: 'hero-slide-3',
    eyebrow: 'Viral Song Plaques',
    title: 'Scannable Acrylic Song Album Plaques',
    tagline: 'Your memorable photo and favorite anthem on crystal-clarity optical acrylic with an illuminated hardwood stand.',
    coupon: 'FLAT849',
    highlightBadge: 'Couple Selection',
    ctaText: 'Design Song Plaque',
    ctaCategory: 'Custom Acrylic Song Plaques & Photo Frames',
    bgGradient: 'from-[#FAF8F5] via-[#FFFFFF] to-[#F1EDE6] dark:from-[#17191F] dark:via-[#111318] dark:to-[#08090B]',
    featuredProductId: 'gift-3',
    secondaryProductId: 'gift-4',
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
  title: 'Handcrafted with Heart & Precious Metals',
  subtitle: 'The Divine Atelier Studio',
  description: 'Every piece in the Divine Atelier is customized by hand. From high-grade 18k thick gold plating to vacuum-preserved botanical roses and precision acoustic code engraving, our mission is simple: to make gifts that never lose their magic.',
  mediaType: 'video',
  mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-opening-a-jewelry-box-43306-large.mp4',
  posterUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
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

const STORAGE_KEY_HERO = 'divines_hero_slides_cms_v2';
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
