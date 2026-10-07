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
  X,
  Clipboard,
  ImagePlus,
  Award,
  Palette,
  Users,
  Calendar,
  TrendingUp,
  Headphones,
  Truck,
  MessageSquare,
  Gift,
  Heart,
  CheckCircle2,
  Sliders,
  Type,
  Mail,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
} from 'lucide-react';
import {
  Product,
  HeroSlideCMS,
  VideoReelCMS,
  AnnouncementCMS,
  CategoryCircleCMS,
  ValuePropCMS,
  ChoiceTabCMS,
} from '../../types';
import { useMediaCMS } from '../../context/MediaCMSContext';
import { SEVEN_COLLECTIONS } from '../../data/collectionsData';
import confetti from 'canvas-confetti';

interface MediaStudioCMSProps {
  products: Product[];
}

export const MediaStudioCMS: React.FC<MediaStudioCMSProps> = ({ products }) => {
  const {
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

    resetToDefaults,
  } = useMediaCMS();

  // Active section tab
  const [activeTab, setActiveTab] = useState<
    | 'hero'
    | 'circles'
    | 'bestsellers'
    | 'video'
    | 'founder'
    | 'spotlight'
    | 'choice'
    | 'valueprops'
    | 'announcements'
    | 'newsletter'
  >('hero');

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Helper for clipboard image paste
  const handlePasteImageFromClipboard = async (setter: (url: string) => void) => {
    try {
      if (!navigator.clipboard?.read) {
        const text = await navigator.clipboard.readText();
        if (text && (text.startsWith('http') || text.startsWith('data:image'))) {
          setter(text);
          showToast('📋 Image URL pasted from clipboard!');
          return;
        }
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setter(e.target.result as string);
              showToast('✨ Screenshot / Photo pasted from clipboard!');
            }
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http') || text.startsWith('data:image'))) {
        setter(text);
        showToast('📋 Image link pasted!');
      } else {
        showToast('⚠️ No image or image link found in clipboard.');
      }
    } catch {
      showToast('⚠️ Clipboard access error. Please use manual link or file upload.');
    }
  };

  // Section 1: Hero Modals & Form
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideCMS | null>(null);
  const [slideImageUrl, setSlideImageUrl] = useState('');
  const [slideTitle, setSlideTitle] = useState('');
  const [slideEyebrow, setSlideEyebrow] = useState('');
  const [slideTagline, setSlideTagline] = useState('');
  const [slideCtaCategory, setSlideCtaCategory] = useState('products');
  const [slideCoupon, setSlideCoupon] = useState('');

  const handleOpenSlideModal = (slide?: HeroSlideCMS) => {
    if (slide) {
      setEditingSlide(slide);
      setSlideImageUrl(slide.customImageUrl || '');
      setSlideTitle(slide.title);
      setSlideEyebrow(slide.eyebrow);
      setSlideTagline(slide.tagline);
      setSlideCtaCategory(slide.ctaCategory || 'products');
      setSlideCoupon(slide.coupon || '');
    } else {
      setEditingSlide(null);
      setSlideImageUrl('');
      setSlideTitle('NEW LUXURY COLLECTION');
      setSlideEyebrow('Cute Things Inside ♡');
      setSlideTagline('Thoughtful gifts for every special moment.');
      setSlideCtaCategory('products');
      setSlideCoupon('LOVE100');
    }
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlide) {
      updateHeroSlide(editingSlide.id, {
        customImageUrl: slideImageUrl,
        title: slideTitle,
        eyebrow: slideEyebrow,
        tagline: slideTagline,
        ctaCategory: slideCtaCategory,
        coupon: slideCoupon,
      });
      showToast('✅ Hero Slide updated in real time!');
    } else {
      addHeroSlide({
        title: slideTitle,
        eyebrow: slideEyebrow,
        tagline: slideTagline,
        coupon: slideCoupon,
        highlightBadge: 'Special Collection',
        ctaText: 'Explore Collection',
        ctaCategory: slideCtaCategory,
        customImageUrl: slideImageUrl,
        bgGradient: 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB]',
        isActive: true,
      });
      showToast('🎉 New Hero Slide published to Home page!');
    }
    setIsSlideModalOpen(false);
  };

  // Section 2: Circle Modals & Form
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);
  const [editingCircle, setEditingCircle] = useState<CategoryCircleCMS | null>(null);
  const [circleName, setCircleName] = useState('');
  const [circleSubtitle, setCircleSubtitle] = useState('');
  const [circleImage, setCircleImage] = useState('');
  const [circleBadge, setCircleBadge] = useState('');
  const [circleRoute, setCircleRoute] = useState('products');

  const handleOpenCircleModal = (circle?: CategoryCircleCMS) => {
    if (circle) {
      setEditingCircle(circle);
      setCircleName(circle.name);
      setCircleSubtitle(circle.subtitle);
      setCircleImage(circle.image);
      setCircleBadge(circle.badge);
      setCircleRoute(circle.route);
    } else {
      setEditingCircle(null);
      setCircleName('');
      setCircleSubtitle('');
      setCircleImage('');
      setCircleBadge('Explore');
      setCircleRoute('products');
    }
    setIsCircleModalOpen(true);
  };

  const handleSaveCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCircle) {
      updateCategoryCircle(editingCircle.id, {
        name: circleName,
        subtitle: circleSubtitle,
        image: circleImage,
        badge: circleBadge,
        route: circleRoute,
      });
      showToast('✅ Collection Circle updated!');
    } else {
      addCategoryCircle({
        name: circleName,
        subtitle: circleSubtitle,
        image: circleImage || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
        badge: circleBadge,
        route: circleRoute,
        isActive: true,
      });
      showToast('🎉 New Collection Circle added!');
    }
    setIsCircleModalOpen(false);
  };

  // Section 4: Video Reel Modal & Form
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<VideoReelCMS | null>(null);
  const [reelTitle, setReelTitle] = useState('');
  const [reelVideoUrl, setReelVideoUrl] = useState('');
  const [reelPosterImage, setReelPosterImage] = useState('');
  const [reelLinkedProduct, setReelLinkedProduct] = useState(products[0]?.id || 'gift-1');
  const [reelViewsCount, setReelViewsCount] = useState('48.2k');

  const handleOpenReelModal = (reel?: VideoReelCMS) => {
    if (reel) {
      setEditingReel(reel);
      setReelTitle(reel.title);
      setReelVideoUrl(reel.videoUrl);
      setReelPosterImage(reel.posterImage);
      setReelLinkedProduct(reel.linkedProductId);
      setReelViewsCount(reel.viewsCount || '50k');
    } else {
      setEditingReel(null);
      setReelTitle('');
      setReelVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-opening-a-jewelry-box-43306-large.mp4');
      setReelPosterImage('');
      setReelLinkedProduct(products[0]?.id || 'gift-1');
      setReelViewsCount('45.5k');
    }
    setIsReelModalOpen(true);
  };

  const handleSaveReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReel) {
      updateVideoReel(editingReel.id, {
        title: reelTitle,
        videoUrl: reelVideoUrl,
        posterImage: reelPosterImage,
        linkedProductId: reelLinkedProduct,
        viewsCount: reelViewsCount,
      });
      showToast('✅ Video Reel updated!');
    } else {
      addVideoReel({
        title: reelTitle,
        tagline: 'Live customer unboxing',
        videoUrl: reelVideoUrl,
        posterImage: reelPosterImage,
        linkedProductId: reelLinkedProduct,
        viewsCount: reelViewsCount,
        durationSeconds: 15,
        isActive: true,
      });
      showToast('🎉 New Video Reel published!');
    }
    setIsReelModalOpen(false);
  };

  // Section 8: Value Prop Modal
  const [isValuePropModalOpen, setIsValuePropModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<ValuePropCMS | null>(null);
  const [propTitle, setPropTitle] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propIcon, setPropIcon] = useState<ValuePropCMS['icon']>('Sparkles');
  const [propBadge, setPropBadge] = useState('');

  const handleOpenPropModal = (prop?: ValuePropCMS) => {
    if (prop) {
      setEditingProp(prop);
      setPropTitle(prop.title);
      setPropDesc(prop.description);
      setPropIcon(prop.icon);
      setPropBadge(prop.highlightBadge);
    } else {
      setEditingProp(null);
      setPropTitle('');
      setPropDesc('');
      setPropIcon('Sparkles');
      setPropBadge('Guaranteed');
    }
    setIsValuePropModalOpen(true);
  };

  const handleSaveProp = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProp) {
      updateValueProp(editingProp.id, {
        title: propTitle,
        description: propDesc,
        icon: propIcon,
        highlightBadge: propBadge,
      });
      showToast('✅ Value Pillar updated!');
    } else {
      addValueProp({
        title: propTitle,
        description: propDesc,
        icon: propIcon,
        highlightBadge: propBadge,
        isActive: true,
      });
      showToast('🎉 New Value Pillar added!');
    }
    setIsValuePropModalOpen(false);
  };

  // Section 9: Announcement Modal
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<AnnouncementCMS | null>(null);
  const [annText, setAnnText] = useState('');
  const [annCode, setAnnCode] = useState('');
  const [annHighlight, setAnnHighlight] = useState('');

  const handleOpenAnnModal = (ann?: AnnouncementCMS) => {
    if (ann) {
      setEditingAnn(ann);
      setAnnText(ann.text);
      setAnnCode(ann.code);
      setAnnHighlight(ann.highlight);
    } else {
      setEditingAnn(null);
      setAnnText('');
      setAnnCode('');
      setAnnHighlight('');
    }
    setIsAnnModalOpen(true);
  };

  const handleSaveAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnn) {
      updateAnnouncement(editingAnn.id, {
        text: annText,
        code: annCode,
        highlight: annHighlight,
      });
      showToast('✅ Announcement banner updated!');
    } else {
      addAnnouncement({
        text: annText,
        code: annCode,
        highlight: annHighlight,
        isActive: true,
      });
      showToast('🎉 New Announcement added!');
    }
    setIsAnnModalOpen(false);
  };

  const SECTIONS_NAV = [
    { id: 'hero', label: '1. Hero Carousel', count: `${heroSlides.length} Slides` },
    { id: 'circles', label: '2. 7 Collections Circles', count: `${categoryCircles.length} Circles` },
    { id: 'bestsellers', label: '3. Best Sellers Section', count: bestsellerSection.isVisible ? 'Visible' : 'Hidden' },
    { id: 'video', label: '4. Video Shopping Reels', count: `${videoReels.length} Reels` },
    { id: 'founder', label: '5. Founder’s Story & Column', count: founderData.isVisible !== false ? 'Active' : 'Hidden' },
    { id: 'spotlight', label: '6. Curated Spotlight Row', count: spotlightSection.selectedCategory },
    { id: 'choice', label: '7. Shop By Your Choice', count: `${choiceSection.tabs?.length || 0} Tabs` },
    { id: 'valueprops', label: '8. 4 Value Props & Trust Badges', count: `${valueProps.length} Pillars` },
    { id: 'announcements', label: '9. Top Bar & Marquee Ticker', count: `${announcements.length} Offers` },
    { id: 'newsletter', label: '10. VIP Newsletter Banner', count: newsletterData.couponCode },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-[#211D1C] text-[#FFD94A] px-5 py-3 rounded-2xl shadow-2xl border border-[#FF2E93] text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-[#FF2E93]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FFF0F5] via-[#FFF9EB] to-[#FFFDF8] border border-[#F3E8E2] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E93] text-white text-[10px] font-extrabold uppercase tracking-widest">
              Full Storefront CMS
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Sync Active
            </span>
          </div>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#211D1C]">
            Homepage Sections & Visual CMS
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Live customize banners, collection circles, headers, video reels, founder notes, spotlight rows, value pillars, and marquee announcements.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              if (window.confirm('Restore all 10 Homepage sections to default curated state?')) {
                resetToDefaults();
                showToast('✨ All sections restored to atelier defaults!');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#F3E8E2] hover:border-[#FF2E93] text-[#211D1C] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
            <span>Reset All Defaults</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs for All 10 Sections */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1 border-b border-[#F3E8E2]">
        {SECTIONS_NAV.map((sec) => {
          const isSelected = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#211D1C] text-white shadow-md'
                  : 'bg-white border border-[#F3E8E2] text-stone-700 hover:border-[#FF2E93] hover:text-[#FF2E93]'
              }`}
            >
              <span>{sec.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-[#FF2E93] text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {sec.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: HERO FULL-BLEED BANNER CAROUSEL */}
      {/* ============================================================ */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Section 1: Hero Full-Bleed Banner Carousel
              </h3>
              <p className="text-xs text-stone-500">
                100% viewport width edge-to-edge images with zero overlay text.
              </p>
            </div>
            <button
              onClick={() => handleOpenSlideModal()}
              className="px-4 py-2.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hero Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="bg-white rounded-3xl border border-[#F3E8E2] overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-stone-900 overflow-hidden flex items-center justify-center">
                    {slide.customImageUrl ? (
                      <img
                        src={slide.customImageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-stone-400 text-xs font-mono">No Image Attached</div>
                    )}
                    <div className="absolute top-3 left-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                      Slide #{idx + 1}
                    </div>
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => updateHeroSlide(slide.id, { isActive: !slide.isActive })}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                          slide.isActive !== false
                            ? 'bg-emerald-500 text-white'
                            : 'bg-stone-500 text-white'
                        }`}
                      >
                        {slide.isActive !== false ? '🟢 Active' : '⚪ Hidden'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#211D1C] truncate">{slide.title}</span>
                      {slide.coupon && (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFF0F5] text-[#FF2E93]">
                          {slide.coupon}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      Target Route: <strong className="text-[#211D1C]">{slide.ctaCategory || 'products'}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#FFFDF8] border-t border-[#F3E8E2] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenSlideModal(slide)}
                    className="flex-1 py-1.5 rounded-xl bg-white border border-[#F3E8E2] hover:border-[#FF2E93] text-[#211D1C] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#FF2E93]" />
                    <span>Edit Photo & Link</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this hero slide?')) {
                        deleteHeroSlide(slide.id);
                        showToast('Slide deleted.');
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: 7 COLLECTIONS CIRCLES */}
      {/* ============================================================ */}
      {activeTab === 'circles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Section 2: Explore Our 7 Collections Circles
              </h3>
              <p className="text-xs text-stone-500">
                Manage circular visual categories, photos, subtitles, and destination collection routes.
              </p>
            </div>
            <button
              onClick={() => handleOpenCircleModal()}
              className="px-4 py-2.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Collection Circle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryCircles.map((col, index) => (
              <div
                key={col.id}
                className="bg-white p-4 rounded-3xl border border-[#F3E8E2] shadow-sm flex flex-col items-center text-center justify-between space-y-3 relative group"
              >
                <div className="flex flex-col items-center space-y-2 w-full">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full p-1 border-2 border-[#FF2E93] overflow-hidden shadow-xs">
                      <img
                        src={col.image}
                        alt={col.name}
                        className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#FFD94A] rounded-full text-[10px] font-extrabold flex items-center justify-center border border-white">
                      {index + 1}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#211D1C]">{col.name}</h4>
                    <p className="text-[11px] text-stone-500">{col.subtitle}</p>
                    <span className="inline-block mt-1 bg-[#FFF0F5] text-[#FF2E93] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Route: #{col.route}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full pt-2 border-t border-[#F3E8E2]">
                  <button
                    onClick={() => handleOpenCircleModal(col)}
                    className="flex-1 py-1.5 rounded-xl bg-white border border-[#F3E8E2] hover:border-[#FF2E93] text-xs font-bold text-[#211D1C] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-[#FF2E93]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => updateCategoryCircle(col.id, { isActive: !col.isActive })}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      col.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {col.isActive !== false ? 'Active' : 'Off'}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this collection circle?')) {
                        deleteCategoryCircle(col.id);
                        showToast('Circle removed.');
                      }
                    }}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 3: MEET THE BEST SELLERS */}
      {/* ============================================================ */}
      {activeTab === 'bestsellers' && (
        <div className="p-6 rounded-3xl bg-white border border-[#F3E8E2] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Section 3: Meet the Best Sellers Header & Settings
              </h3>
              <p className="text-xs text-stone-500">
                Configure eyebrow tags, title, italic accent word, subtitle, and section visibility.
              </p>
            </div>
            <button
              onClick={() => {
                updateBestsellerSection({ isVisible: !bestsellerSection.isVisible });
                showToast(bestsellerSection.isVisible ? 'Bestseller section hidden' : 'Bestseller section visible');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                bestsellerSection.isVisible
                  ? 'bg-emerald-500 text-white'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              <span>{bestsellerSection.isVisible ? '🟢 Section Visible' : '⚪ Section Hidden'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Eyebrow Tag Badge</label>
              <input
                type="text"
                value={bestsellerSection.eyebrow}
                onChange={(e) => updateBestsellerSection({ eyebrow: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Discount Promo Pill</label>
              <input
                type="text"
                value={bestsellerSection.discountText || ''}
                onChange={(e) => updateBestsellerSection({ discountText: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Main Title Prefix</label>
              <input
                type="text"
                value={bestsellerSection.titlePrefix}
                onChange={(e) => updateBestsellerSection({ titlePrefix: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Italic Accent Word</label>
              <input
                type="text"
                value={bestsellerSection.titleHighlight}
                onChange={(e) => updateBestsellerSection({ titleHighlight: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#FF2E93] font-serif italic font-bold outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#211D1C]">Subtitle / Tagline Description</label>
              <textarea
                rows={2}
                value={bestsellerSection.subtitle}
                onChange={(e) => updateBestsellerSection({ subtitle: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4: WATCH IT & BUY IT (VIDEO REELS) */}
      {/* ============================================================ */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#F3E8E2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <div>
                <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                  Section 4: Watch It And Buy It (Video Reels)
                </h3>
                <p className="text-xs text-stone-500">
                  Manage MP4 links, custom unboxing posters, duration, views tag, and 1-click product purchase links.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateVideoSection({ isVisible: !videoSection.isVisible })}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    videoSection.isVisible ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {videoSection.isVisible ? '🟢 Section Visible' : '⚪ Hidden'}
                </button>
                <button
                  onClick={() => handleOpenReelModal()}
                  className="px-4 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Video Reel</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Eyebrow Badge</label>
                <input
                  type="text"
                  value={videoSection.eyebrow}
                  onChange={(e) => updateVideoSection({ eyebrow: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Title Prefix</label>
                <input
                  type="text"
                  value={videoSection.titlePrefix}
                  onChange={(e) => updateVideoSection({ titlePrefix: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Title Highlight</label>
                <input
                  type="text"
                  value={videoSection.titleHighlight}
                  onChange={(e) => updateVideoSection({ titleHighlight: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#FF2E93] font-serif italic outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoReels.map((reel) => {
              const linkedProd = products.find((p) => p.id === reel.linkedProductId) || products[0];
              return (
                <div
                  key={reel.id}
                  className="bg-white rounded-3xl border border-[#F3E8E2] overflow-hidden shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[9/14] bg-stone-900 overflow-hidden flex items-center justify-center">
                      {reel.posterImage ? (
                        <img
                          src={reel.posterImage}
                          alt={reel.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4 text-white text-xs">
                          <Play className="w-8 h-8 mx-auto mb-2 text-[#FF2E93]" />
                          <span>MP4 Video Active</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        {reel.viewsCount || '48k views'}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1 text-xs">
                      <h4 className="font-bold text-[#211D1C] line-clamp-1">{reel.title}</h4>
                      <p className="text-[10px] text-stone-500">
                        Linked: <strong className="text-[#FF2E93]">{linkedProd?.name || reel.linkedProductId}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FFFDF8] border-t border-[#F3E8E2] flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => handleOpenReelModal(reel)}
                      className="flex-1 py-1.5 rounded-xl bg-white border border-[#F3E8E2] hover:border-[#FF2E93] text-xs font-bold text-[#211D1C] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-[#FF2E93]" />
                      <span>Edit Reel</span>
                    </button>
                    <button
                      onClick={() => updateVideoReel(reel.id, { isActive: !reel.isActive })}
                      className={`px-2 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer ${
                        reel.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {reel.isActive ? 'Live' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this reel?')) {
                          deleteVideoReel(reel.id);
                          showToast('Reel deleted.');
                        }
                      }}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 5: FOUNDER’S STORY & COLUMN */}
      {/* ============================================================ */}
      {activeTab === 'founder' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F3E8E2] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Section 5: Founder’s Story (Sonu Personal Letter & Column)
              </h3>
              <p className="text-xs text-stone-500">
                Change founder name, photo (paste/upload), badges, personal letter, quote, and CTA labels.
              </p>
            </div>
            <button
              onClick={() => {
                updateFounderData({ isVisible: founderData.isVisible === false ? true : false });
                showToast(founderData.isVisible === false ? 'Founder section enabled' : 'Founder section hidden');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                founderData.isVisible !== false ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {founderData.isVisible !== false ? '🟢 Section Visible' : '⚪ Hidden'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Founder Photo */}
            <div className="space-y-3">
              <label className="font-bold text-xs text-[#211D1C] block">Founder Portrait Photo</label>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#F3E8E2] bg-stone-100 flex items-center justify-center">
                {founderData.imageUrl ? (
                  <img
                    src={founderData.imageUrl}
                    alt={founderData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-stone-400">No Photo</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePasteImageFromClipboard((url) => updateFounderData({ imageUrl: url }))}
                  className="flex-1 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Paste Photo</span>
                </button>
                <label className="px-3 py-2 rounded-xl bg-[#211D1C] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs">
                  <ImagePlus className="w-3.5 h-3.5 text-[#FFD94A]" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (evt.target?.result) {
                            updateFounderData({ imageUrl: evt.target.result as string });
                            showToast('Founder portrait updated!');
                          }
                        };
                        reader.readAsDataURL(f);
                      }
                    }}
                  />
                </label>
              </div>

              <input
                type="text"
                value={founderData.imageUrl}
                onChange={(e) => updateFounderData({ imageUrl: e.target.value })}
                placeholder="Or paste image URL directly..."
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-xs text-[#211D1C] outline-none"
              />
            </div>

            {/* Profile Fields */}
            <div className="md:col-span-2 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Founder Name</label>
                  <input
                    type="text"
                    value={founderData.name}
                    onChange={(e) => updateFounderData({ name: e.target.value })}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-bold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Role Title</label>
                  <input
                    type="text"
                    value={founderData.role}
                    onChange={(e) => updateFounderData({ role: e.target.value })}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Milestone Badge 1</label>
                  <input
                    type="text"
                    value={founderData.badge1}
                    onChange={(e) => updateFounderData({ badge1: e.target.value })}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Milestone Badge 2</label>
                  <input
                    type="text"
                    value={founderData.badge2}
                    onChange={(e) => updateFounderData({ badge2: e.target.value })}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Primary CTA Button</label>
                  <input
                    type="text"
                    value={founderData.ctaPrimaryText || ''}
                    onChange={(e) => updateFounderData({ ctaPrimaryText: e.target.value })}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Secondary CTA Button</label>
                  <input
                    type="text"
                    value={founderData.ctaSecondaryText || ''}
                    onChange={(e) => updateFounderData({ ctaSecondaryText: e.target.value })}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Featured Highlight Quote</label>
                <input
                  type="text"
                  value={founderData.highlightQuote || ''}
                  onChange={(e) => updateFounderData({ highlightQuote: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Personal Story Letter (Markdown / Paragraphs)</label>
                <textarea
                  rows={6}
                  value={founderData.storyNote}
                  onChange={(e) => updateFounderData({ storyNote: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 6: CURATED COLLECTION SPOTLIGHT ROW */}
      {/* ============================================================ */}
      {activeTab === 'spotlight' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F3E8E2] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Section 6: Curated Collection Spotlight Row
              </h3>
              <p className="text-xs text-stone-500">
                Choose which collection category to feature on the homepage, along with custom titles and buttons.
              </p>
            </div>
            <button
              onClick={() => {
                updateSpotlightSection({ isVisible: !spotlightSection.isVisible });
                showToast(spotlightSection.isVisible ? 'Spotlight section hidden' : 'Spotlight section visible');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                spotlightSection.isVisible ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {spotlightSection.isVisible ? '🟢 Section Visible' : '⚪ Hidden'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Featured Catalog Category *</label>
              <select
                value={spotlightSection.selectedCategory}
                onChange={(e) => updateSpotlightSection({ selectedCategory: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-bold outline-none"
              >
                <optgroup label="🌟 7 Official Store Collections">
                  {SEVEN_COLLECTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Bespoke Specialties">
                  <option value="Personalized Name Jewelry">Personalized Name Jewelry</option>
                  <option value="Preserved Eternal Roses & Dome Displays">Preserved Eternal Roses & Dome Displays</option>
                  <option value="Custom Acrylic Song Plaques & Photo Frames">Custom Acrylic Song Plaques & Photo Frames</option>
                  <option value="Memory Photo Lamps & Crystal Cubes">Memory Photo Lamps & Crystal Cubes</option>
                  <option value="Engraved Wooden Gift Boxes & Keepsakes">Engraved Wooden Gift Boxes & Keepsakes</option>
                  <option value="Romantic Couple Hampers & Scented Candle Sets">Romantic Couple Hampers & Scented Candle Sets</option>
                </optgroup>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Eyebrow Tag</label>
              <input
                type="text"
                value={spotlightSection.eyebrow}
                onChange={(e) => updateSpotlightSection({ eyebrow: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Section Title</label>
              <input
                type="text"
                value={spotlightSection.title}
                onChange={(e) => updateSpotlightSection({ title: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">View All Button Text</label>
              <input
                type="text"
                value={spotlightSection.viewAllText}
                onChange={(e) => updateSpotlightSection({ viewAllText: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#211D1C]">Subtitle Description</label>
              <textarea
                rows={2}
                value={spotlightSection.subtitle}
                onChange={(e) => updateSpotlightSection({ subtitle: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: SHOP BY YOUR CHOICE */}
      {/* ============================================================ */}
      {activeTab === 'choice' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F3E8E2] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Section 7: Shop By Your Choice (Occasion Tabs)
              </h3>
              <p className="text-xs text-stone-500">
                Edit eyebrow, titles, and manage occasion navigation tabs.
              </p>
            </div>
            <button
              onClick={() => {
                updateChoiceSection({ isVisible: !choiceSection.isVisible });
                showToast(choiceSection.isVisible ? 'Choice section hidden' : 'Choice section visible');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                choiceSection.isVisible ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {choiceSection.isVisible ? '🟢 Section Visible' : '⚪ Hidden'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Eyebrow Tag</label>
              <input
                type="text"
                value={choiceSection.eyebrow}
                onChange={(e) => updateChoiceSection({ eyebrow: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Title Prefix</label>
              <input
                type="text"
                value={choiceSection.titlePrefix}
                onChange={(e) => updateChoiceSection({ titlePrefix: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Title Highlight</label>
              <input
                type="text"
                value={choiceSection.titleHighlight}
                onChange={(e) => updateChoiceSection({ titleHighlight: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#FF2E93] font-serif italic outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-[#211D1C]">Occasion Category Tabs</h4>
              <button
                type="button"
                onClick={() => {
                  addChoiceTab({
                    label: 'New Occasion Tab',
                    categoryName: 'Personalized Name Jewelry',
                    isActive: true,
                  });
                  showToast('New occasion tab added.');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#211D1C] hover:bg-black text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#FFD94A]" />
                <span>Add Tab</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {choiceSection.tabs?.map((tab, idx) => (
                <div
                  key={tab.id}
                  className="p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 flex-1 w-full">
                    <span className="font-mono font-bold text-stone-400">{idx + 1}.</span>
                    <input
                      type="text"
                      value={tab.label}
                      onChange={(e) => updateChoiceTab(tab.id, { label: e.target.value })}
                      placeholder="Tab label"
                      className="w-full sm:w-1/2 bg-white border border-[#F5E6CE] rounded-xl px-3 py-1.5 font-semibold text-[#211D1C] outline-none"
                    />
                    <select
                      value={tab.categoryName}
                      onChange={(e) => updateChoiceTab(tab.id, { categoryName: e.target.value })}
                      className="w-full sm:w-1/2 bg-white border border-[#F5E6CE] rounded-xl px-3 py-1.5 text-[#211D1C] outline-none"
                    >
                      {SEVEN_COLLECTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="Personalized Name Jewelry">Personalized Name Jewelry</option>
                      <option value="Preserved Eternal Roses & Dome Displays">Preserved Eternal Roses & Dome Displays</option>
                      <option value="Custom Acrylic Song Plaques & Photo Frames">Custom Acrylic Song Plaques & Photo Frames</option>
                      <option value="Romantic Couple Hampers & Scented Candle Sets">Romantic Couple Hampers & Scented Candle Sets</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateChoiceTab(tab.id, { isActive: !tab.isActive })}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer ${
                        tab.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {tab.isActive ? 'Active' : 'Off'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteChoiceTab(tab.id);
                        showToast('Tab removed.');
                      }}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 8: 4 VALUE PROPS & TRUST BADGES */}
      {/* ============================================================ */}
      {activeTab === 'valueprops' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Section 8: 4 Value Props & Trust Badges
              </h3>
              <p className="text-xs text-stone-500">
                Customize 100% Handcrafted, Insured Dispatch, WhatsApp Proof, and Gift Box Included pillars.
              </p>
            </div>
            <button
              onClick={() => handleOpenPropModal()}
              className="px-4 py-2.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Value Pillar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {valueProps.map((prop) => (
              <div
                key={prop.id}
                className="bg-white p-5 rounded-3xl border border-[#F3E8E2] shadow-sm flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF9DE] border border-[#F5E6B8] flex items-center justify-center text-[#FF2E93]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    {prop.highlightBadge && (
                      <span className="bg-[#FFF0F5] text-[#FF2E93] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {prop.highlightBadge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#211D1C]">{prop.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{prop.description}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#F3E8E2]">
                  <button
                    onClick={() => handleOpenPropModal(prop)}
                    className="flex-1 py-1.5 rounded-xl bg-white border border-[#F3E8E2] hover:border-[#FF2E93] text-xs font-bold text-[#211D1C] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-[#FF2E93]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => updateValueProp(prop.id, { isActive: !prop.isActive })}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      prop.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {prop.isActive ? 'Active' : 'Off'}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this pillar?')) {
                        deleteValueProp(prop.id);
                        showToast('Pillar removed.');
                      }
                    }}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 9: TOP ANNOUNCEMENT BAR & MARQUEE TICKER */}
      {/* ============================================================ */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {/* Top Bar Messages */}
          <div className="p-6 rounded-3xl bg-white border border-[#F3E8E2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <div>
                <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                  Top Announcement Strip Offers
                </h3>
                <p className="text-xs text-stone-500">
                  Rotating messages at the very top of the storefront with 1-click copy coupon codes.
                </p>
              </div>
              <button
                onClick={() => handleOpenAnnModal()}
                className="px-4 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Offer</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {announcements.map((ann, idx) => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#F3E8E2] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-mono font-bold text-stone-400">#{idx + 1}</span>
                    <span className="font-bold text-[#211D1C]">{ann.text}</span>
                    {ann.code && (
                      <span className="font-mono bg-[#FF2E93] text-white font-bold px-2 py-0.5 rounded text-[10px]">
                        {ann.code}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenAnnModal(ann)}
                      className="px-2.5 py-1 rounded-xl bg-white border border-[#F3E8E2] text-[#211D1C] font-bold text-xs hover:border-[#FF2E93] cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => updateAnnouncement(ann.id, { isActive: !ann.isActive })}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                        ann.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {ann.isActive ? 'Active' : 'Off'}
                    </button>
                    <button
                      onClick={() => {
                        deleteAnnouncement(ann.id);
                        showToast('Offer removed.');
                      }}
                      className="p-1 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Ticker */}
          <div className="p-6 rounded-3xl bg-white border border-[#F3E8E2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <div>
                <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                  Marquee Scrolling Ticker Strip
                </h3>
                <p className="text-xs text-stone-500">
                  Yellow animated scrolling strip located above the footer.
                </p>
              </div>
              <button
                onClick={() => {
                  updateMarqueeData({ isVisible: !marqueeData.isVisible });
                  showToast(marqueeData.isVisible ? 'Marquee strip hidden' : 'Marquee strip visible');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  marqueeData.isVisible ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {marqueeData.isVisible ? '🟢 Strip Visible' : '⚪ Hidden'}
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#211D1C]">Ticker Messages (One per line)</label>
              <textarea
                rows={5}
                value={marqueeData.messages?.join('\n') || ''}
                onChange={(e) =>
                  updateMarqueeData({
                    messages: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                  })
                }
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-mono outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 10: VIP NEWSLETTER PRIVILEGE BANNER */}
      {/* ============================================================ */}
      {activeTab === 'newsletter' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F3E8E2] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Section 10: VIP Newsletter Privilege Banner
              </h3>
              <p className="text-xs text-stone-500">
                Configure discount headline, offer badge (e.g. Flat ₹100 Off), promo code, and CTA text.
              </p>
            </div>
            <button
              onClick={() => {
                updateNewsletterData({ isVisible: !newsletterData.isVisible });
                showToast(newsletterData.isVisible ? 'Newsletter banner hidden' : 'Newsletter banner visible');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                newsletterData.isVisible ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {newsletterData.isVisible ? '🟢 Section Visible' : '⚪ Hidden'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Eyebrow Tag</label>
              <input
                type="text"
                value={newsletterData.eyebrow}
                onChange={(e) => updateNewsletterData({ eyebrow: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Discount Offer Badge</label>
              <input
                type="text"
                value={newsletterData.discountBadge}
                onChange={(e) => updateNewsletterData({ discountBadge: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Main Headline Title</label>
              <input
                type="text"
                value={newsletterData.title}
                onChange={(e) => updateNewsletterData({ title: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Promo Coupon Code</label>
              <input
                type="text"
                value={newsletterData.couponCode}
                onChange={(e) => updateNewsletterData({ couponCode: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 font-mono text-[#FF2E93] font-bold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Button CTA Label</label>
              <input
                type="text"
                value={newsletterData.buttonText}
                onChange={(e) => updateNewsletterData({ buttonText: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#211D1C]">Subtitle Description</label>
              <textarea
                rows={2}
                value={newsletterData.subtitle}
                onChange={(e) => updateNewsletterData({ subtitle: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: HERO SLIDE EDIT/ADD */}
      {/* ============================================================ */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-lg rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 space-y-4 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                {editingSlide ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
              </h3>
              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
              {/* Photo Upload & Paste Box */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE]">
                <label className="font-bold text-[#211D1C] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#FF2E93]" />
                  <span>Full-Bleed Slide Photo *</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePasteImageFromClipboard(setSlideImageUrl)}
                    className="flex-1 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Paste from Clipboard</span>
                  </button>

                  <label className="px-3.5 py-2 rounded-xl bg-[#211D1C] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs">
                    <ImagePlus className="w-3.5 h-3.5 text-[#FFD94A]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) setSlideImageUrl(evt.target.result as string);
                          };
                          reader.readAsDataURL(f);
                        }
                      }}
                    />
                  </label>
                </div>

                <input
                  type="text"
                  required
                  value={slideImageUrl}
                  onChange={(e) => setSlideImageUrl(e.target.value)}
                  placeholder="Or enter image URL here..."
                  className="w-full bg-white border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />

                {slideImageUrl && (
                  <div className="aspect-[21/9] rounded-xl overflow-hidden border border-[#F3E8E2] bg-stone-900 flex items-center justify-center">
                    <img
                      src={slideImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Target Store Route</label>
                  <select
                    value={slideCtaCategory}
                    onChange={(e) => setSlideCtaCategory(e.target.value)}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                  >
                    <option value="products">All Products & Collections</option>
                    <option value="personalization">Personalization Studio</option>
                    <option value="creator-club">Creator Club (₹7k/mo)</option>
                    <option value="collaboration">Collaboration & UGC</option>
                    <option value="affiliate-marketing">Affiliate Marketing</option>
                    <option value="podcast">Podcast & Stories</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Promo Coupon Code</label>
                  <input
                    type="text"
                    value={slideCoupon}
                    onChange={(e) => setSlideCoupon(e.target.value)}
                    placeholder="e.g. LOVE100, DS1102"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 font-mono text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs shadow-md"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CIRCLE EDIT/ADD */}
      {/* ============================================================ */}
      {isCircleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                {editingCircle ? 'Edit Collection Circle' : 'Add Collection Circle'}
              </h3>
              <button
                onClick={() => setIsCircleModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCircle} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Collection Title *</label>
                <input
                  type="text"
                  required
                  value={circleName}
                  onChange={(e) => setCircleName(e.target.value)}
                  placeholder="e.g. Personalization"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-bold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Subtitle Tagline</label>
                <input
                  type="text"
                  value={circleSubtitle}
                  onChange={(e) => setCircleSubtitle(e.target.value)}
                  placeholder="e.g. WhatsApp Confirmed"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="space-y-2 p-3 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE]">
                <label className="font-bold text-[#211D1C]">Circle Photo *</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePasteImageFromClipboard(setCircleImage)}
                    className="flex-1 py-1.5 rounded-xl bg-[#FF2E93] text-white font-bold text-xs"
                  >
                    Paste Photo
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={circleImage}
                  onChange={(e) => setCircleImage(e.target.value)}
                  placeholder="Image URL..."
                  className="w-full bg-white border border-[#F5E6CE] rounded-xl px-3 py-1.5 text-[#211D1C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Badge Tag</label>
                  <input
                    type="text"
                    value={circleBadge}
                    onChange={(e) => setCircleBadge(e.target.value)}
                    placeholder="e.g. Verified"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Target Route</label>
                  <input
                    type="text"
                    value={circleRoute}
                    onChange={(e) => setCircleRoute(e.target.value)}
                    placeholder="e.g. personalization"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 font-mono text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsCircleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs shadow-md"
                >
                  Save Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: VIDEO REEL EDIT/ADD */}
      {/* ============================================================ */}
      {isReelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                {editingReel ? 'Edit Video Reel' : 'Add New Video Reel'}
              </h3>
              <button
                onClick={() => setIsReelModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReel} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Reel Title *</label>
                <input
                  type="text"
                  required
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  placeholder="e.g. Watch Unboxing: 18k Gold Cursive Name Pendant"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">MP4 Video Link</label>
                <input
                  type="text"
                  value={reelVideoUrl}
                  onChange={(e) => setReelVideoUrl(e.target.value)}
                  placeholder="https://...mp4"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 font-mono text-[#211D1C] outline-none"
                />
              </div>

              <div className="space-y-2 p-3 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE]">
                <label className="font-bold text-[#211D1C]">Poster Thumbnail Image</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePasteImageFromClipboard(setReelPosterImage)}
                    className="flex-1 py-1.5 rounded-xl bg-[#FF2E93] text-white font-bold text-xs"
                  >
                    Paste Thumbnail
                  </button>
                </div>
                <input
                  type="text"
                  value={reelPosterImage}
                  onChange={(e) => setReelPosterImage(e.target.value)}
                  placeholder="Poster image link..."
                  className="w-full bg-white border border-[#F5E6CE] rounded-xl px-3 py-1.5 text-[#211D1C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Link Catalog Product</label>
                  <select
                    value={reelLinkedProduct}
                    onChange={(e) => setReelLinkedProduct(e.target.value)}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  >
                    {products.slice(0, 30).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name.slice(0, 25)}... (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Views Count Tag</label>
                  <input
                    type="text"
                    value={reelViewsCount}
                    onChange={(e) => setReelViewsCount(e.target.value)}
                    placeholder="e.g. 94.2k"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsReelModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs shadow-md"
                >
                  Save Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: VALUE PROP EDIT/ADD */}
      {/* ============================================================ */}
      {isValuePropModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                {editingProp ? 'Edit Value Pillar' : 'Add Value Pillar'}
              </h3>
              <button
                onClick={() => setIsValuePropModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProp} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Pillar Title *</label>
                <input
                  type="text"
                  required
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="e.g. 100% Handcrafted Luxury"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Icon Style</label>
                  <select
                    value={propIcon}
                    onChange={(e) => setPropIcon(e.target.value as any)}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  >
                    <option value="Sparkles">✨ Sparkles</option>
                    <option value="Truck">🚚 Express Truck</option>
                    <option value="MessageSquare">💬 WhatsApp Chat</option>
                    <option value="Gift">🎁 Luxury Gift Box</option>
                    <option value="ShieldCheck">🛡️ Shield Guarantee</option>
                    <option value="Heart">💖 Heart</option>
                    <option value="Award">🏆 Award</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Highlight Badge</label>
                  <input
                    type="text"
                    value={propBadge}
                    onChange={(e) => setPropBadge(e.target.value)}
                    placeholder="e.g. Artisan Crafted"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Description Note</label>
                <textarea
                  rows={3}
                  required
                  value={propDesc}
                  onChange={(e) => setPropDesc(e.target.value)}
                  placeholder="Details regarding crafting, guarantee, or packaging..."
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsValuePropModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs shadow-md"
                >
                  Save Pillar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ANNOUNCEMENT EDIT/ADD */}
      {/* ============================================================ */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                {editingAnn ? 'Edit Offer Banner' : 'Add Offer Banner'}
              </h3>
              <button
                onClick={() => setIsAnnModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnn} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Banner Text *</label>
                <input
                  type="text"
                  required
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  placeholder="e.g. SPECIAL PAIRING: ANY 2 GIFTS FOR ₹849 – CODE: "
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Promo Code</label>
                  <input
                    type="text"
                    value={annCode}
                    onChange={(e) => setAnnCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FLAT849"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 font-mono text-[#FF2E93] font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Highlight Text (if no code)</label>
                  <input
                    type="text"
                    value={annHighlight}
                    onChange={(e) => setAnnHighlight(e.target.value)}
                    placeholder="e.g. Auto-Applied"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs shadow-md"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
