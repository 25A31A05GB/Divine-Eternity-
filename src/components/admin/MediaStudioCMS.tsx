import React, { useState } from 'react';
import {
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Smartphone,
  Monitor,
  Eye,
  Check,
  Tag,
  Video,
  Play,
  Volume2,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Product, HeroSlideCMS, VideoReelCMS, AnnouncementCMS, BrandStoryCMS } from '../../types';
import { useMediaCMS } from '../../context/MediaCMSContext';
import { PhoneCaseMockup } from '../../utils/productVisuals';
import confetti from 'canvas-confetti';

interface MediaStudioCMSProps {
  products: Product[];
}

export const MediaStudioCMS: React.FC<MediaStudioCMSProps> = ({ products }) => {
  const {
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
  } = useMediaCMS();

  // Active sub-section within media CMS
  const [activeMediaSection, setActiveMediaSection] = useState<'slots' | 'hero' | 'reels' | 'announcements' | 'story'>('slots');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedPreviewSlide, setSelectedPreviewSlide] = useState(0);

  // Modals & Forms State
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [isAddReelOpen, setIsAddReelOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideCMS | null>(null);
  const [editingReel, setEditingReel] = useState<VideoReelCMS | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementCMS | null>(null);

  // Hero Slide Form Fields
  const [slideTitle, setSlideTitle] = useState('');
  const [slideEyebrow, setSlideEyebrow] = useState('Atelier Spotlight');
  const [slideTagline, setSlideTagline] = useState('');
  const [slideImageUrl, setSlideImageUrl] = useState('');
  const [slideVideoUrl, setSlideVideoUrl] = useState('');
  const [slideCoupon, setSlideCoupon] = useState('LOVE100');
  const [slideCtaText, setSlideCtaText] = useState('Personalize Yours');
  const [slideCtaCategory, setSlideCtaCategory] = useState('Personalized Name Jewelry');

  // Video Reel Form Fields
  const [reelTitle, setReelTitle] = useState('');
  const [reelTagline, setReelTagline] = useState('');
  const [reelVideoUrl, setReelVideoUrl] = useState('');
  const [reelPosterImage, setReelPosterImage] = useState('');
  const [reelLinkedProduct, setReelLinkedProduct] = useState(products[0]?.id || 'gift-1');
  const [reelDuration, setReelDuration] = useState(15);

  // Announcement Form Fields
  const [annText, setAnnText] = useState('');
  const [annCode, setAnnCode] = useState('');
  const [annHighlight, setAnnHighlight] = useState('');

  // Brand Story Form Fields
  const [storyTitle, setStoryTitle] = useState(brandStory.title);
  const [storySubtitle, setStorySubtitle] = useState(brandStory.subtitle);
  const [storyDesc, setStoryDesc] = useState(brandStory.description);
  const [storyMediaUrl, setStoryMediaUrl] = useState(brandStory.mediaUrl);
  const [storyPosterUrl, setStoryPosterUrl] = useState(brandStory.posterUrl);

  // Curated Royalty-Free Luxury Media Presets
  const PRESET_MEDIA = [
    {
      title: '18k Gold Casket Unboxing (Video)',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-opening-a-jewelry-box-43306-large.mp4',
      poster: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Preserved Rose Fairy Lights (Video)',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-red-rose-in-a-glass-jar-with-lights-42907-large.mp4',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Crystal Laser Prism Reflection (Video)',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-crystal-glass-reflecting-colored-light-43224-large.mp4',
      poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Gold Vermeil Atelier Showcase (Image)',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
      poster: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim()) return;

    if (editingSlide) {
      updateHeroSlide(editingSlide.id, {
        title: slideTitle.trim(),
        eyebrow: slideEyebrow.trim(),
        tagline: slideTagline.trim(),
        customImageUrl: slideImageUrl.trim() || undefined,
        customVideoUrl: slideVideoUrl.trim() || undefined,
        coupon: slideCoupon.trim().toUpperCase(),
        ctaText: slideCtaText.trim(),
        ctaCategory: slideCtaCategory,
      });
      setEditingSlide(null);
    } else {
      addHeroSlide({
        title: slideTitle.trim(),
        eyebrow: slideEyebrow.trim(),
        tagline: slideTagline.trim(),
        customImageUrl: slideImageUrl.trim() || undefined,
        customVideoUrl: slideVideoUrl.trim() || undefined,
        coupon: slideCoupon.trim().toUpperCase(),
        ctaText: slideCtaText.trim(),
        ctaCategory: slideCtaCategory,
        highlightBadge: 'Special Edition',
        bgGradient: 'from-[#FAF4EC] via-[#FFFDF9] to-[#F7EFE5] dark:from-[#1A1417] dark:via-[#0F0D10] dark:to-[#171115]',
        isActive: true,
      });
      setIsAddSlideOpen(false);
    }
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
  };

  const handleSaveReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelTitle.trim() || !reelVideoUrl.trim()) return;

    if (editingReel) {
      updateVideoReel(editingReel.id, {
        title: reelTitle.trim(),
        tagline: reelTagline.trim(),
        videoUrl: reelVideoUrl.trim(),
        posterImage: reelPosterImage.trim(),
        linkedProductId: reelLinkedProduct,
        durationSeconds: Number(reelDuration),
      });
      setEditingReel(null);
    } else {
      addVideoReel({
        title: reelTitle.trim(),
        tagline: reelTagline.trim(),
        videoUrl: reelVideoUrl.trim(),
        posterImage: reelPosterImage.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        linkedProductId: reelLinkedProduct,
        viewsCount: '1.2k',
        durationSeconds: Number(reelDuration) || 15,
        isActive: true,
      });
      setIsAddReelOpen(false);
    }
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annText.trim()) return;

    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement.id, {
        text: annText.trim(),
        code: annCode.trim().toUpperCase(),
        highlight: annHighlight.trim(),
      });
      setEditingAnnouncement(null);
    } else {
      addAnnouncement({
        text: annText.trim(),
        code: annCode.trim().toUpperCase(),
        highlight: annHighlight.trim() || 'Exclusive',
        isActive: true,
      });
      setIsAddAnnouncementOpen(false);
    }
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandStory({
      title: storyTitle,
      subtitle: storySubtitle,
      description: storyDesc,
      mediaUrl: storyMediaUrl,
      posterUrl: storyPosterUrl,
    });
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
  };

  const activeSlide = heroSlides[selectedPreviewSlide] || heroSlides[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* Top Media Director Dashboard Banner */}
      <div className="bg-gradient-to-r from-[#1C1917] via-[#2A1E24] to-[#1C1917] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#3E2D38] shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#C5A059] text-stone-950 flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3 h-3" /> Creative & Media Control
            </span>
            <span className="text-xs text-stone-400 font-mono">Live Visual Master</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Storefront Media & Visual Placement Studio
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            You hold complete directorial control over every hero banner, video reel URL, background visual, announcement offer, and brand editorial shown across the website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={() => {
              setSlideTitle('');
              setSlideTagline('');
              setSlideImageUrl('');
              setSlideVideoUrl('');
              setIsAddSlideOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#881337] hover:bg-[#700f2d] text-white transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Hero Slide
          </button>
          <button
            onClick={() => {
              setReelTitle('');
              setReelTagline('');
              setReelVideoUrl('');
              setReelPosterImage('');
              setIsAddReelOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#b08c45] text-stone-950 transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Video Reel
          </button>
        </div>
      </div>

      {/* Sub Navigation for Media Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EFE7DE] dark:border-[#282127] no-scrollbar">
        {[
          { id: 'slots', label: 'Visual Layout Map & Live Simulator', icon: Layers },
          { id: 'hero', label: `Hero Carousel Slides (${heroSlides.length})`, icon: ImageIcon },
          { id: 'reels', label: `Shoppable Video Reels (${videoReels.length})`, icon: Video },
          { id: 'announcements', label: `Announcement Bar Offers (${announcements.length})`, icon: Tag },
          { id: 'story', label: 'Brand Atelier Story & Video', icon: Film },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeMediaSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveMediaSection(sec.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#881337] text-white shadow-sm'
                  : 'bg-white dark:bg-[#181418] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 border border-[#EFE7DE] dark:border-[#2D252A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: VISUAL LAYOUT MAP & REAL-TIME VIEWPORT SIMULATOR */}
      {/* ============================================================ */}
      {activeMediaSection === 'slots' && (
        <div className="space-y-8">
          
          {/* Viewport Mode Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181418] p-4 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Live Storefront Simulator Viewport:
              </span>
              <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setPreviewViewport('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewViewport === 'desktop'
                      ? 'bg-white dark:bg-stone-800 text-[#881337] dark:text-[#FB7185] shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop (1280px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewViewport === 'mobile'
                      ? 'bg-white dark:bg-stone-800 text-[#881337] dark:text-[#FB7185] shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile (375px)</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Previewing Hero Slide:</span>
              <select
                value={selectedPreviewSlide}
                onChange={(e) => setSelectedPreviewSlide(Number(e.target.value))}
                className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-bold rounded-xl px-3 py-1.5 text-stone-800 dark:text-stone-200"
              >
                {heroSlides.map((s, idx) => (
                  <option key={s.id} value={idx}>
                    Slide #{idx + 1}: {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Simulated Container */}
          <div className="flex justify-center p-4 sm:p-8 bg-stone-900/10 dark:bg-black/30 rounded-3xl border border-stone-200 dark:border-stone-800">
            <div
              className={`transition-all duration-300 bg-white dark:bg-[#0F0D10] rounded-3xl shadow-2xl overflow-hidden border border-stone-300 dark:border-stone-800 ${
                previewViewport === 'mobile' ? 'w-[375px] min-h-[640px]' : 'w-full max-w-5xl'
              }`}
            >
              {/* Simulated Top Announcement Bar */}
              {announcements.length > 0 && announcements[0].isActive && (
                <div className="bg-[#1C1917] text-[#FAF7F2] text-[10px] py-1.5 px-3 text-center flex items-center justify-center gap-1 border-b border-stone-800">
                  <Sparkles className="w-2.5 h-2.5 text-[#E5C378]" />
                  <span>{announcements[0].text}</span>
                  {announcements[0].code && (
                    <span className="bg-[#881337] text-white px-1.5 py-0.2 rounded font-mono font-bold">
                      {announcements[0].code}
                    </span>
                  )}
                </div>
              )}

              {/* Simulated Hero Section */}
              {activeSlide && (
                <div className={`p-6 bg-gradient-to-br ${activeSlide.bgGradient} relative overflow-hidden`}>
                  {activeSlide.customVideoUrl && (
                    <video
                      src={activeSlide.customVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                    />
                  )}

                  <div className="relative z-10 space-y-3">
                    <span className="bg-[#881337] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#E5C378]" />
                      {activeSlide.eyebrow}
                    </span>

                    <h3 className="font-serif text-xl sm:text-3xl font-bold text-stone-900 dark:text-white leading-tight">
                      {activeSlide.title}
                    </h3>

                    <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md">
                      {activeSlide.tagline}
                    </p>

                    {activeSlide.coupon && (
                      <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-stone-900/90 px-3 py-1 rounded-lg text-[10px] border border-stone-200 dark:border-stone-800">
                        <span>Code:</span>
                        <strong className="font-mono text-[#881337] dark:text-[#FB7185]">{activeSlide.coupon}</strong>
                      </div>
                    )}

                    <div className="pt-2">
                      <button className="bg-[#881337] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span>{activeSlide.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Simulated Video Reels Strip in Miniature */}
              <div className="p-4 bg-stone-50 dark:bg-[#141014] border-t border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-stone-900 dark:text-white">
                    Watch Atelier Craft & Reels
                  </span>
                  <span className="text-[10px] text-stone-500">{videoReels.length} Active Video Slots</span>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {videoReels.slice(0, 4).map((reel) => (
                    <div
                      key={reel.id}
                      className="w-24 shrink-0 rounded-xl bg-stone-900 aspect-[9/14] relative overflow-hidden shadow-xs"
                    >
                      {reel.videoUrl ? (
                        <video
                          src={reel.videoUrl}
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={reel.posterImage}
                          alt={reel.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 flex flex-col justify-end text-[8px] text-white">
                        <p className="line-clamp-1 font-bold">{reel.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preset Library Bar */}
          <div className="bg-white dark:bg-[#181418] p-6 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] space-y-4">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Directorial Quick Media Presets (1-Click Paste)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRESET_MEDIA.map((preset, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#881337] dark:text-[#FB7185] bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                      {preset.type.toUpperCase()}
                    </span>
                    <h5 className="font-bold text-xs text-stone-900 dark:text-white">{preset.title}</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSlide) {
                        if (preset.type === 'video') {
                          updateHeroSlide(activeSlide.id, { customVideoUrl: preset.url });
                        } else {
                          updateHeroSlide(activeSlide.id, { customImageUrl: preset.url });
                        }
                        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                      }
                    }}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold bg-[#1C1917] hover:bg-[#881337] text-white transition-colors text-center"
                  >
                    Apply to Slide #{selectedPreviewSlide + 1}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: HERO CAROUSEL SLIDES CMS */}
      {/* ============================================================ */}
      {activeMediaSection === 'hero' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" />
                <span>Hero Banner Carousel Slots ({heroSlides.length})</span>
              </h3>
              <p className="text-xs text-stone-500">
                Directly configure desktop/mobile image links, background video MP4s, headlines, and discount codes.
              </p>
            </div>
            <button
              onClick={() => {
                setSlideTitle('');
                setSlideTagline('');
                setSlideImageUrl('');
                setSlideVideoUrl('');
                setIsAddSlideOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Hero Slide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#881337] dark:text-[#FB7185] bg-[#881337]/10 px-2.5 py-1 rounded-lg">
                      Slide #{idx + 1} · {slide.eyebrow}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slide.isActive}
                        onChange={(e) => updateHeroSlide(slide.id, { isActive: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600" />
                    </label>
                  </div>

                  <h5 className="font-serif font-bold text-base text-stone-900 dark:text-white line-clamp-1 mb-1">
                    {slide.title}
                  </h5>
                  <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                    {slide.tagline}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-300 p-3 rounded-xl bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800">
                    <div className="truncate">
                      Custom Image: <span className="font-mono text-stone-400">{slide.customImageUrl || 'Default 3D Model'}</span>
                    </div>
                    <div className="truncate">
                      Video MP4: <span className="font-mono text-stone-400">{slide.customVideoUrl || 'None'}</span>
                    </div>
                    <div>
                      Discount Promo: <strong className="font-mono text-[#881337] dark:text-[#FB7185]">{slide.coupon || 'None'}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EFE7DE] dark:border-[#282127]">
                  <button
                    onClick={() => {
                      setEditingSlide(slide);
                      setSlideTitle(slide.title);
                      setSlideEyebrow(slide.eyebrow);
                      setSlideTagline(slide.tagline);
                      setSlideImageUrl(slide.customImageUrl || '');
                      setSlideVideoUrl(slide.customVideoUrl || '');
                      setSlideCoupon(slide.coupon || '');
                      setSlideCtaText(slide.ctaText || 'Personalize Yours');
                      setSlideCtaCategory(slide.ctaCategory || 'Personalized Name Jewelry');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#881337] dark:text-[#FB7185] hover:underline"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Slide Content
                  </button>

                  {heroSlides.length > 1 && (
                    <button
                      onClick={() => deleteHeroSlide(slide.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 3: SHOPPABLE VIDEO REELS CMS */}
      {/* ============================================================ */}
      {activeMediaSection === 'reels' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-[#C5A059]" />
                <span>Interactive Shoppable Video Reels ({videoReels.length})</span>
              </h3>
              <p className="text-xs text-stone-500">
                Manage vertical video links, preview thumbnails, and product checkout links.
              </p>
            </div>
            <button
              onClick={() => {
                setReelTitle('');
                setReelTagline('');
                setReelVideoUrl('');
                setReelPosterImage('');
                setIsAddReelOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-stone-950 hover:bg-[#b08c45] transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Video Reel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {videoReels.map((reel) => {
              const linkedProd = products.find((p) => p.id === reel.linkedProductId);
              return (
                <div
                  key={reel.id}
                  className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-[9/14] bg-stone-900 overflow-hidden group">
                    {reel.videoUrl ? (
                      <video
                        src={reel.videoUrl}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={reel.posterImage}
                        alt={reel.title}
                        className="w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute top-2.5 left-2.5 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                      {reel.durationSeconds}s
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reel.isActive}
                          onChange={(e) => updateVideoReel(reel.id, { isActive: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-3.5 bg-stone-700 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent text-white text-xs">
                      <p className="font-semibold line-clamp-2">{reel.title}</p>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2.5">
                    <div className="text-[11px] text-stone-500 truncate">
                      Linked: <strong className="text-stone-900 dark:text-white">{linkedProd?.name || 'Custom Keepsake'}</strong>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EFE7DE] dark:border-[#282127]">
                      <button
                        onClick={() => {
                          setEditingReel(reel);
                          setReelTitle(reel.title);
                          setReelTagline(reel.tagline);
                          setReelVideoUrl(reel.videoUrl);
                          setReelPosterImage(reel.posterImage);
                          setReelLinkedProduct(reel.linkedProductId);
                          setReelDuration(reel.durationSeconds);
                        }}
                        className="text-xs font-semibold text-[#881337] dark:text-[#FB7185] hover:underline"
                      >
                        Edit Reel
                      </button>

                      <button
                        onClick={() => deleteVideoReel(reel.id)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                        title="Delete Reel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4: ANNOUNCEMENT OFFERS CMS */}
      {/* ============================================================ */}
      {activeMediaSection === 'announcements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" />
                <span>Global Top Announcement Bar Marquee ({announcements.length})</span>
              </h3>
              <p className="text-xs text-stone-500">
                Rotate promo offers, free shipping banners, and one-click discount codes.
              </p>
            </div>
            <button
              onClick={() => {
                setAnnText('');
                setAnnCode('');
                setAnnHighlight('Special');
                setIsAddAnnouncementOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Announcement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann, idx) => (
              <div
                key={ann.id}
                className="bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-[#881337] bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                      Offer #{idx + 1}
                    </span>
                    {ann.code && (
                      <span className="font-mono text-xs font-bold bg-stone-900 text-white dark:bg-white dark:text-stone-950 px-2 py-0.5 rounded">
                        {ann.code}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-stone-900 dark:text-white">{ann.text}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingAnnouncement(ann);
                      setAnnText(ann.text);
                      setAnnCode(ann.code);
                      setAnnHighlight(ann.highlight);
                    }}
                    className="p-2 text-stone-600 hover:text-[#881337] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {announcements.length > 1 && (
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 5: BRAND ATELIER STORY & VIDEO */}
      {/* ============================================================ */}
      {activeMediaSection === 'story' && (
        <div className="bg-white dark:bg-[#181418] p-6 sm:p-8 rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs space-y-6 max-w-3xl">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" />
              <span>Brand Atelier Story & Craft Media</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Configure the studio craft narrative and embedded video reel on the storefront.
            </p>
          </div>

          <form onSubmit={handleSaveStory} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                Story Eyebrow / Subtitle
              </label>
              <input
                type="text"
                value={storySubtitle}
                onChange={(e) => setStorySubtitle(e.target.value)}
                className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881337]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                Main Story Headline
              </label>
              <input
                type="text"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881337]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                Studio Narrative Description
              </label>
              <textarea
                rows={3}
                value={storyDesc}
                onChange={(e) => setStoryDesc(e.target.value)}
                className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881337] resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                Atelier Craft Video URL (MP4)
              </label>
              <input
                type="url"
                value={storyMediaUrl}
                onChange={(e) => setStoryMediaUrl(e.target.value)}
                className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881337]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-xs bg-[#881337] hover:bg-[#700f2d] text-white transition-colors shadow-md"
            >
              Save Story Media
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: HERO SLIDE FORM */}
      {/* ============================================================ */}
      {(isAddSlideOpen || editingSlide) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181418] w-full max-w-xl rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DE] dark:border-[#282127]">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-stone-900 dark:text-white">
                <ImageIcon className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" />
                <span>{editingSlide ? 'Edit Hero Slide Content' : 'Create New Hero Slide'}</span>
              </div>
              <button
                onClick={() => {
                  setIsAddSlideOpen(false);
                  setEditingSlide(null);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={slideEyebrow}
                    onChange={(e) => setSlideEyebrow(e.target.value)}
                    placeholder="e.g. Bespoke Haute Jewelry"
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                    Promo Coupon Code
                  </label>
                  <input
                    type="text"
                    value={slideCoupon}
                    onChange={(e) => setSlideCoupon(e.target.value.toUpperCase())}
                    placeholder="e.g. LOVE100"
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-xs font-mono uppercase text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  required
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  placeholder="e.g. 18k Gold Plated Custom Name Necklaces"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white font-serif font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Tagline Subheading
                </label>
                <textarea
                  rows={2}
                  value={slideTagline}
                  onChange={(e) => setSlideTagline(e.target.value)}
                  placeholder="e.g. Handcrafted luxury handwriting pendants in 18k thick gold vermeil..."
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Custom Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={slideImageUrl}
                  onChange={(e) => setSlideImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Background Video MP4 URL (Optional)
                </label>
                <input
                  type="url"
                  value={slideVideoUrl}
                  onChange={(e) => setSlideVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/videos/preview/..."
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddSlideOpen(false);
                    setEditingSlide(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#881337] text-white hover:bg-[#700f2d] shadow-sm"
                >
                  Save Hero Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: VIDEO REEL FORM */}
      {/* ============================================================ */}
      {(isAddReelOpen || editingReel) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181418] w-full max-w-xl rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DE] dark:border-[#282127]">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-stone-900 dark:text-white">
                <Video className="w-5 h-5 text-[#C5A059]" />
                <span>{editingReel ? 'Edit Video Reel Slot' : 'Create New Video Reel Slot'}</span>
              </div>
              <button
                onClick={() => {
                  setIsAddReelOpen(false);
                  setEditingReel(null);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReel} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Reel Title
                </label>
                <input
                  type="text"
                  required
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  placeholder="e.g. Watch Unboxing: 18k Gold Cursive Name Pendant"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={reelTagline}
                  onChange={(e) => setReelTagline(e.target.value)}
                  placeholder="e.g. See the micro-engraving shine under studio lights"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Video MP4 Link
                </label>
                <input
                  type="url"
                  required
                  value={reelVideoUrl}
                  onChange={(e) => setReelVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/videos/preview/..."
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Video Poster Image Thumbnail
                </label>
                <input
                  type="url"
                  value={reelPosterImage}
                  onChange={(e) => setReelPosterImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                    Linked Product Link
                  </label>
                  <select
                    value={reelLinkedProduct}
                    onChange={(e) => setReelLinkedProduct(e.target.value)}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                    Duration (Seconds)
                  </label>
                  <input
                    type="number"
                    value={reelDuration}
                    onChange={(e) => setReelDuration(Number(e.target.value))}
                    min={5}
                    max={60}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddReelOpen(false);
                    setEditingReel(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-stone-950 hover:bg-[#b08c45] shadow-sm"
                >
                  Save Video Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ANNOUNCEMENT FORM */}
      {/* ============================================================ */}
      {(isAddAnnouncementOpen || editingAnnouncement) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181418] w-full max-w-lg rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DE] dark:border-[#282127]">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-stone-900 dark:text-white">
                <Tag className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" />
                <span>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement Offer'}</span>
              </div>
              <button
                onClick={() => {
                  setIsAddAnnouncementOpen(false);
                  setEditingAnnouncement(null);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Announcement Text
                </label>
                <input
                  type="text"
                  required
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  placeholder="e.g. SPECIAL PAIRING: ANY 2 CASES FOR ₹849 – CODE: "
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                    Promo Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={annCode}
                    onChange={(e) => setAnnCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FLAT849"
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-xs font-mono uppercase text-stone-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                    Highlight Pill Text
                  </label>
                  <input
                    type="text"
                    value={annHighlight}
                    onChange={(e) => setAnnHighlight(e.target.value)}
                    placeholder="e.g. Pan-India"
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddAnnouncementOpen(false);
                    setEditingAnnouncement(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#881337] text-white hover:bg-[#700f2d] shadow-sm"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
