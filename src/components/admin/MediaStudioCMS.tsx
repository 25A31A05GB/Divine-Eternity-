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
  Upload,
  Clipboard,
  Heart,
  Users,
  Grid,
  Settings,
  MessageSquare,
  Gift,
  Truck,
  Mail,
  Award,
} from 'lucide-react';
import {
  Product,
  HeroSlideCMS,
  VideoReelCMS,
  AnnouncementCMS,
  CategoryCircleCMS,
  ValuePropCMS,
} from '../../types';
import { useMediaCMS } from '../../context/MediaCMSContext';
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
    resetToDefaults,
  } = useMediaCMS();

  // Active sub-section within media CMS
  const [activeSection, setActiveSection] = useState<
    'slots' | 'hero' | 'collections' | 'bestsellers' | 'reels' | 'founder' | 'spotlight' | 'choice' | 'props' | 'announcements' | 'newsletter'
  >('slots');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedPreviewSlide, setSelectedPreviewSlide] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals & Form States
  // 1. Hero Slide Modal
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideCMS | null>(null);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideEyebrow, setSlideEyebrow] = useState('Cute Things Inside ♡');
  const [slideTagline, setSlideTagline] = useState('');
  const [slideImageUrl, setSlideImageUrl] = useState('');
  const [slideCoupon, setSlideCoupon] = useState('LOVE100');
  const [slideBadge, setSlideBadge] = useState('Best Seller');
  const [slideCtaText, setSlideCtaText] = useState('Explore Collection');
  const [slideCtaCategory, setSlideCtaCategory] = useState('products');

  // 2. Collection Circle Modal
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);
  const [editingCircle, setEditingCircle] = useState<CategoryCircleCMS | null>(null);
  const [circleName, setCircleName] = useState('');
  const [circleSubtitle, setCircleSubtitle] = useState('');
  const [circleImage, setCircleImage] = useState('');
  const [circleBadge, setCircleBadge] = useState('');
  const [circleRoute, setCircleRoute] = useState('');

  // 3. Video Reel Modal
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<VideoReelCMS | null>(null);
  const [reelTitle, setReelTitle] = useState('');
  const [reelTagline, setReelTagline] = useState('');
  const [reelVideoUrl, setReelVideoUrl] = useState('');
  const [reelPosterImage, setReelPosterImage] = useState('');
  const [reelLinkedProduct, setReelLinkedProduct] = useState(products[0]?.id || 'gift-1');
  const [reelDuration, setReelDuration] = useState(15);
  const [reelViews, setReelViews] = useState('50k');

  // 4. Announcement Modal
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<AnnouncementCMS | null>(null);
  const [annText, setAnnText] = useState('');
  const [annCode, setAnnCode] = useState('');
  const [annHighlight, setAnnHighlight] = useState('');

  // 5. Value Prop Modal
  const [isPropModalOpen, setIsPropModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<ValuePropCMS | null>(null);
  const [propTitle, setPropTitle] = useState('');
  const [propSubtitle, setPropSubtitle] = useState('');
  const [propIcon, setPropIcon] = useState('Sparkles');
  const [propBadge, setPropBadge] = useState('');

  // Helper for Clipboard Image Paste
  const handlePasteClipboardImage = async (setter: (val: string) => void) => {
    try {
      if (!navigator.clipboard?.read) {
        showToast('Clipboard image access is not supported in this browser. Please paste URL or upload.');
        return;
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
              showToast('✨ Clipboard image attached successfully!');
            }
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http') || text.startsWith('data:image'))) {
        setter(text.trim());
        showToast('✨ Image URL pasted from clipboard!');
      } else {
        showToast('No image or valid link found in clipboard.');
      }
    } catch (e) {
      console.error(e);
      showToast('Could not read clipboard. Please paste URL directly.');
    }
  };

  // Hero Slide Handlers
  const handleOpenSlideModal = (slide?: HeroSlideCMS) => {
    if (slide) {
      setEditingSlide(slide);
      setSlideTitle(slide.title);
      setSlideEyebrow(slide.eyebrow);
      setSlideTagline(slide.tagline);
      setSlideImageUrl(slide.customImageUrl || '');
      setSlideCoupon(slide.coupon);
      setSlideBadge(slide.highlightBadge);
      setSlideCtaText(slide.ctaText);
      setSlideCtaCategory(slide.ctaCategory);
    } else {
      setEditingSlide(null);
      setSlideTitle('');
      setSlideEyebrow('Cute Things Inside ♡');
      setSlideTagline('');
      setSlideImageUrl('');
      setSlideCoupon('LOVE100');
      setSlideBadge('Atelier Special');
      setSlideCtaText('Explore Collection');
      setSlideCtaCategory('products');
    }
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlide) {
      updateHeroSlide(editingSlide.id, {
        title: slideTitle,
        eyebrow: slideEyebrow,
        tagline: slideTagline,
        customImageUrl: slideImageUrl,
        coupon: slideCoupon,
        highlightBadge: slideBadge,
        ctaText: slideCtaText,
        ctaCategory: slideCtaCategory,
      });
      showToast('✨ Hero slide updated & synced to Home page!');
    } else {
      addHeroSlide({
        title: slideTitle,
        eyebrow: slideEyebrow,
        tagline: slideTagline,
        customImageUrl: slideImageUrl,
        coupon: slideCoupon,
        highlightBadge: slideBadge,
        ctaText: slideCtaText,
        ctaCategory: slideCtaCategory,
        bgGradient: 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB]',
        isActive: true,
      });
      showToast('🎉 New Hero slide published to Home page!');
    }
    setIsSlideModalOpen(false);
  };

  // Collection Circle Handlers
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
      setCircleBadge('');
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
      showToast('✨ Collection circle updated!');
    } else {
      addCategoryCircle({
        name: circleName,
        subtitle: circleSubtitle,
        image: circleImage,
        badge: circleBadge,
        route: circleRoute,
        isActive: true,
      });
      showToast('🎉 New Collection circle added!');
    }
    setIsCircleModalOpen(false);
  };

  // Video Reel Handlers
  const handleOpenReelModal = (reel?: VideoReelCMS) => {
    if (reel) {
      setEditingReel(reel);
      setReelTitle(reel.title);
      setReelTagline(reel.tagline);
      setReelVideoUrl(reel.videoUrl);
      setReelPosterImage(reel.posterImage);
      setReelLinkedProduct(reel.linkedProductId);
      setReelDuration(reel.durationSeconds);
      setReelViews(reel.viewsCount);
    } else {
      setEditingReel(null);
      setReelTitle('');
      setReelTagline('');
      setReelVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-opening-a-jewelry-box-43306-large.mp4');
      setReelPosterImage('');
      setReelLinkedProduct(products[0]?.id || 'gift-1');
      setReelDuration(15);
      setReelViews('40k');
    }
    setIsReelModalOpen(true);
  };

  const handleSaveReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReel) {
      updateVideoReel(editingReel.id, {
        title: reelTitle,
        tagline: reelTagline,
        videoUrl: reelVideoUrl,
        posterImage: reelPosterImage,
        linkedProductId: reelLinkedProduct,
        durationSeconds: reelDuration,
        viewsCount: reelViews,
      });
      showToast('✨ Video reel updated!');
    } else {
      addVideoReel({
        title: reelTitle,
        tagline: reelTagline,
        videoUrl: reelVideoUrl,
        posterImage: reelPosterImage,
        linkedProductId: reelLinkedProduct,
        durationSeconds: reelDuration,
        viewsCount: reelViews,
        isActive: true,
      });
      showToast('🎉 New Video Reel published!');
    }
    setIsReelModalOpen(false);
  };

  // Value Prop Handlers
  const handleOpenPropModal = (prop?: ValuePropCMS) => {
    if (prop) {
      setEditingProp(prop);
      setPropTitle(prop.title);
      setPropSubtitle(prop.subtitle);
      setPropIcon(prop.iconName);
      setPropBadge(prop.badge);
    } else {
      setEditingProp(null);
      setPropTitle('');
      setPropSubtitle('');
      setPropIcon('Sparkles');
      setPropBadge('');
    }
    setIsPropModalOpen(true);
  };

  const handleSaveProp = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProp) {
      updateValueProp(editingProp.id, {
        title: propTitle,
        subtitle: propSubtitle,
        iconName: propIcon,
        badge: propBadge,
      });
      showToast('✨ Value pillar updated!');
    } else {
      addValueProp({
        title: propTitle,
        subtitle: propSubtitle,
        iconName: propIcon,
        badge: propBadge,
        isActive: true,
      });
      showToast('🎉 New Value pillar added!');
    }
    setIsPropModalOpen(false);
  };

  // Announcement Handlers
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
      showToast('✨ Announcement updated!');
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

  const activeSlide = heroSlides[selectedPreviewSlide] || heroSlides[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211D1C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#FF2E93] flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-[#FFD94A]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-[#FFFDF8] border border-[#F3E8E2] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#FF2E93] text-[10px] font-extrabold uppercase tracking-wider">
              Real-Time Homepage Editor
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Instant Live Sync Active
            </span>
          </div>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#211D1C]">
            Homepage Sections & Visual CMS
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Edit, reorder, add, or toggle all 10 sections of the public storefront with zero coding.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              resetToDefaults();
              showToast('🔄 Reset all homepage sections to defaults!');
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#F3E8E2] hover:border-rose-300 text-stone-700 hover:text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Defaults</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-[#F3E8E2]">
        {[
          { id: 'slots', label: 'All Sections Overview', icon: Layers },
          { id: 'hero', label: 'Hero Carousel', icon: Film, count: heroSlides.length },
          { id: 'collections', label: '7 Collections Circles', icon: Grid, count: categoryCircles.length },
          { id: 'bestsellers', label: 'Meet the Bestsellers', icon: Sparkles },
          { id: 'reels', label: 'Video Shopping Reels', icon: Video, count: videoReels.length },
          { id: 'founder', label: 'Founder’s Story (Sonu)', icon: Heart },
          { id: 'spotlight', label: 'Curated Spotlight', icon: Award },
          { id: 'choice', label: 'Shop By Choice', icon: Settings },
          { id: 'props', label: '4 Value Guarantees', icon: ShieldCheck, count: valueProps.length },
          { id: 'announcements', label: 'Marquee & Top Bar', icon: Tag, count: announcements.length },
          { id: 'newsletter', label: 'Newsletter VIP', icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#211D1C] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:text-[#FF2E93] hover:bg-[#FFF0F5] border border-[#F3E8E2]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFD94A]' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    isActive ? 'bg-[#FF2E93] text-white' : 'bg-[#FFF0F5] text-[#FF2E93]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: ALL SECTIONS OVERVIEW (SLOTS GRID) */}
      {/* ============================================================ */}
      {activeSection === 'slots' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Slot 1: Hero Carousel */}
            <div className="bg-white rounded-2xl border border-[#F3E8E2] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                    Section 1
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">🟢 Active</span>
                </div>
                <h3 className="font-serif-heading font-bold text-base text-[#211D1C] mt-2">
                  Hero Full-Bleed Carousel
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {heroSlides.length} edge-to-edge full-bleed luxury banner slides.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('hero')}
                className="w-full py-2 rounded-xl bg-[#FFF9EB] hover:bg-[#FF2E93] hover:text-white text-[#211D1C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F5E6CE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Manage Hero Slides</span>
              </button>
            </div>

            {/* Slot 2: 7 Collections Circles */}
            <div className="bg-white rounded-2xl border border-[#F3E8E2] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                    Section 2
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">🟢 Active</span>
                </div>
                <h3 className="font-serif-heading font-bold text-base text-[#211D1C] mt-2">
                  7 Collections Circles
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {categoryCircles.length} quick circular navigation categories & creator links.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('collections')}
                className="w-full py-2 rounded-xl bg-[#FFF9EB] hover:bg-[#FF2E93] hover:text-white text-[#211D1C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F5E6CE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit 7 Collections</span>
              </button>
            </div>

            {/* Slot 3: Meet the Best Sellers */}
            <div className="bg-white rounded-2xl border border-[#F3E8E2] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                    Section 3
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">
                    {bestsellerSection.isActive ? '🟢 Active' : '⚪ Hidden'}
                  </span>
                </div>
                <h3 className="font-serif-heading font-bold text-base text-[#211D1C] mt-2">
                  Meet the Best Sellers
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 truncate">
                  "{bestsellerSection.title} {bestsellerSection.accentWord}"
                </p>
              </div>
              <button
                onClick={() => setActiveSection('bestsellers')}
                className="w-full py-2 rounded-xl bg-[#FFF9EB] hover:bg-[#FF2E93] hover:text-white text-[#211D1C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F5E6CE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Bestseller Header</span>
              </button>
            </div>

            {/* Slot 4: Video Shopping Row */}
            <div className="bg-white rounded-2xl border border-[#F3E8E2] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                    Section 4
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">🟢 Active</span>
                </div>
                <h3 className="font-serif-heading font-bold text-base text-[#211D1C] mt-2">
                  Watch It & Buy It (Reels)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {videoReels.length} playable video cards with one-click purchase tags.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('reels')}
                className="w-full py-2 rounded-xl bg-[#FFF9EB] hover:bg-[#FF2E93] hover:text-white text-[#211D1C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F5E6CE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Manage Video Reels</span>
              </button>
            </div>

            {/* Slot 5: Founder's Story */}
            <div className="bg-white rounded-2xl border border-[#F3E8E2] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                    Section 5
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">
                    {founderNote.isActive ? '🟢 Active' : '⚪ Hidden'}
                  </span>
                </div>
                <h3 className="font-serif-heading font-bold text-base text-[#211D1C] mt-2">
                  Founder’s Note ({founderNote.founderName})
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Story, personal letter, milestone badges & founder photo.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('founder')}
                className="w-full py-2 rounded-xl bg-[#FFF9EB] hover:bg-[#FF2E93] hover:text-white text-[#211D1C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F5E6CE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Founder Story</span>
              </button>
            </div>

            {/* Slot 6: Curated Spotlight */}
            <div className="bg-white rounded-2xl border border-[#F3E8E2] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                    Section 6
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">
                    {curatedSpotlight.isActive ? '🟢 Active' : '⚪ Hidden'}
                  </span>
                </div>
                <h3 className="font-serif-heading font-bold text-base text-[#211D1C] mt-2">
                  Curated Collection Spotlight
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 truncate">
                  Category: {curatedSpotlight.category}
                </p>
              </div>
              <button
                onClick={() => setActiveSection('spotlight')}
                className="w-full py-2 rounded-xl bg-[#FFF9EB] hover:bg-[#FF2E93] hover:text-white text-[#211D1C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F5E6CE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Spotlight</span>
              </button>
            </div>

            {/* Slot 7: Shop By Choice */}
            <div className="bg-white rounded-2xl border border-[#F3E8E2] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                    Section 7
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">🟢 Active</span>
                </div>
                <h3 className="font-serif-heading font-bold text-base text-[#211D1C] mt-2">
                  Shop By Your Choice
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Interactive multi-tab occasion showcase.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('choice')}
                className="w-full py-2 rounded-xl bg-[#FFF9EB] hover:bg-[#FF2E93] hover:text-white text-[#211D1C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F5E6CE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Choice Tabs</span>
              </button>
            </div>

            {/* Slot 8: Value Props */}
            <div className="bg-white rounded-2xl border border-[#F3E8E2] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                    Section 8
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">🟢 Active</span>
                </div>
                <h3 className="font-serif-heading font-bold text-base text-[#211D1C] mt-2">
                  4 Value Props & Trust Badges
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Handcrafted, Express Delivery, WhatsApp Proof, Luxury Box.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('props')}
                className="w-full py-2 rounded-xl bg-[#FFF9EB] hover:bg-[#FF2E93] hover:text-white text-[#211D1C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F5E6CE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Value Badges</span>
              </button>
            </div>

            {/* Slot 9: Top Bar & Marquee */}
            <div className="bg-white rounded-2xl border border-[#F3E8E2] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                    Section 9
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">🟢 Active</span>
                </div>
                <h3 className="font-serif-heading font-bold text-base text-[#211D1C] mt-2">
                  Announcements & Marquee
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {announcements.length} ticker promo offers & discount codes.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('announcements')}
                className="w-full py-2 rounded-xl bg-[#FFF9EB] hover:bg-[#FF2E93] hover:text-white text-[#211D1C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#F5E6CE]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Manage Announcements</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: HERO BANNER CAROUSEL MANAGER */}
      {/* ============================================================ */}
      {activeSection === 'hero' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Hero Banner Carousel Slides ({heroSlides.length})
              </h3>
              <p className="text-xs text-stone-500">
                Full-bleed high-definition luxury banner images rendered across 100% of the screen width.
              </p>
            </div>
            <button
              onClick={() => handleOpenSlideModal()}
              className="px-4 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hero Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="bg-white rounded-2xl border border-[#F3E8E2] overflow-hidden shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] bg-stone-900 overflow-hidden">
                  <img
                    src={slide.customImageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white font-mono text-[10px] font-bold">
                    Slide #{idx + 1}
                  </div>
                  {slide.highlightBadge && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#FFD94A] text-[#211D1C] font-bold text-[10px]">
                      {slide.highlightBadge}
                    </div>
                  )}
                </div>

                <div className="p-4 pt-0 space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wider">
                      {slide.eyebrow}
                    </span>
                    <button
                      onClick={() => {
                        updateHeroSlide(slide.id, { isActive: !slide.isActive });
                        showToast(slide.isActive ? 'Slide disabled' : 'Slide enabled');
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                        slide.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {slide.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <h4 className="font-bold text-xs text-[#211D1C] line-clamp-1">
                    {slide.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2">
                    {slide.tagline}
                  </p>
                  <div className="text-[10px] text-stone-600 font-mono bg-[#FFF9EB] p-2 rounded-lg border border-[#F5E6CE]">
                    Link: <strong>{slide.ctaCategory}</strong> · Promo: <strong>{slide.coupon}</strong>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end gap-2 border-t border-stone-100 pt-3">
                  <button
                    onClick={() => handleOpenSlideModal(slide)}
                    className="p-1.5 rounded-lg bg-[#FFF0F5] text-[#FF2E93] hover:bg-[#FFE0E6] text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this hero slide?')) {
                        deleteHeroSlide(slide.id);
                        showToast('Slide deleted');
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold cursor-pointer transition-colors"
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
      {/* SECTION 3: 7 COLLECTIONS CIRCLES */}
      {/* ============================================================ */}
      {activeSection === 'collections' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Explore Our 7 Collections ({categoryCircles.length})
              </h3>
              <p className="text-xs text-stone-500">
                Manage titles, subtitles, circular icons/photos, and navigation routes.
              </p>
            </div>
            <button
              onClick={() => handleOpenCircleModal()}
              className="px-4 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Collection Circle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryCircles.map((circle, idx) => (
              <div
                key={circle.id}
                className="bg-white rounded-2xl border border-[#F3E8E2] p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#FF2E93] bg-[#FFF0F5] shrink-0 p-0.5">
                    <img
                      src={circle.image}
                      alt={circle.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-stone-400 font-bold">
                        #{idx + 1}
                      </span>
                      {circle.badge && (
                        <span className="text-[9px] font-bold text-[#FF2E93] bg-[#FFF0F5] px-1.5 py-0.2 rounded-full truncate">
                          {circle.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-[#211D1C] truncate">
                      {circle.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">
                      {circle.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-stone-500 font-mono bg-stone-50 p-1.5 rounded-lg truncate">
                  Route: <strong>{circle.route}</strong>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => handleOpenCircleModal(circle)}
                    className="p-1.5 rounded-lg bg-[#FFF0F5] text-[#FF2E93] hover:bg-[#FFE0E6] text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${circle.name}?`)) {
                        deleteCategoryCircle(circle.id);
                        showToast('Collection circle deleted');
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold cursor-pointer"
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
      {/* SECTION 4: MEET THE BESTSELLERS SECTION SETTINGS */}
      {/* ============================================================ */}
      {activeSection === 'bestsellers' && (
        <div className="bg-white rounded-3xl border border-[#F3E8E2] p-6 sm:p-8 shadow-xs max-w-2xl space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
              Meet the Best Sellers Section Settings
            </h3>
            <p className="text-xs text-stone-500">
              Customize section headings, subtitles, and promotional callouts on the Home page.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              showToast('✨ Bestsellers section updated & synced to Home page!');
            }}
            className="space-y-4 text-xs"
          >
            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Top Eyebrow Tag</label>
              <input
                type="text"
                value={bestsellerSection.eyebrow}
                onChange={(e) => updateBestsellerSection({ eyebrow: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Main Title</label>
                <input
                  type="text"
                  value={bestsellerSection.title}
                  onChange={(e) => updateBestsellerSection({ title: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Italic Accent Word</label>
                <input
                  type="text"
                  value={bestsellerSection.accentWord}
                  onChange={(e) => updateBestsellerSection({ accentWord: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#FF2E93] font-serif italic outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Subtitle / Description</label>
              <textarea
                rows={2}
                value={bestsellerSection.subtitle}
                onChange={(e) => updateBestsellerSection({ subtitle: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="bestActive"
                checked={bestsellerSection.isActive !== false}
                onChange={(e) => updateBestsellerSection({ isActive: e.target.checked })}
                className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
              />
              <label htmlFor="bestActive" className="text-xs font-bold text-[#211D1C] cursor-pointer">
                Show Bestsellers Section on Home Page
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Save Bestsellers Header
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 5: VIDEO SHOPPING REELS MANAGER */}
      {/* ============================================================ */}
      {activeSection === 'reels' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Watch It & Buy It (Reels & Stories) ({videoReels.length})
              </h3>
              <p className="text-xs text-stone-500">
                Short videos demonstrating personalized jewelry, eternal roses, and crystal lamps.
              </p>
            </div>
            <button
              onClick={() => handleOpenReelModal()}
              className="px-4 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Video Reel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoReels.map((reel) => (
              <div
                key={reel.id}
                className="bg-white rounded-2xl border border-[#F3E8E2] overflow-hidden shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="relative aspect-[9/16] bg-black max-h-64 overflow-hidden group flex items-center justify-center">
                  {reel.posterImage ? (
                    <img
                      src={reel.posterImage}
                      alt={reel.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-xs flex flex-col items-center gap-1">
                      <Play className="w-8 h-8 text-[#FFD94A]" />
                      <span>Video Preview</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white font-mono text-[10px]">
                    {reel.durationSeconds}s · {reel.viewsCount}
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-1.5 flex-1">
                  <h4 className="font-bold text-xs text-[#211D1C] line-clamp-1">
                    {reel.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2">
                    {reel.tagline}
                  </p>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end gap-2 border-t border-stone-100 pt-2">
                  <button
                    onClick={() => handleOpenReelModal(reel)}
                    className="p-1.5 rounded-lg bg-[#FFF0F5] text-[#FF2E93] hover:bg-[#FFE0E6] text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this video reel?')) {
                        deleteVideoReel(reel.id);
                        showToast('Video reel deleted');
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold cursor-pointer"
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
      {/* SECTION 6: FOUNDER'S NOTE (SONU STORY) */}
      {/* ============================================================ */}
      {activeSection === 'founder' && (
        <div className="bg-white rounded-3xl border border-[#F3E8E2] p-6 sm:p-8 shadow-xs max-w-3xl space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
              Founder’s Story & Personal Letter Settings
            </h3>
            <p className="text-xs text-stone-500">
              Edit Sonu’s founder letter, quote, photos, milestone badges, and buttons.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              showToast('✨ Founder’s Story updated & synced to Home page!');
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Founder Name</label>
                <input
                  type="text"
                  value={founderNote.founderName}
                  onChange={(e) => updateFounderNote({ founderName: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Founder Role</label>
                <input
                  type="text"
                  value={founderNote.founderRole}
                  onChange={(e) => updateFounderNote({ founderRole: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>
            </div>

            {/* Founder Photo */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE]">
              <label className="font-bold text-[#211D1C] flex items-center justify-between">
                <span>Founder Photo (Paste or Upload)</span>
                <button
                  type="button"
                  onClick={() => handlePasteClipboardImage((url) => updateFounderNote({ photoUrl: url }))}
                  className="text-[11px] font-bold text-[#FF2E93] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Clipboard className="w-3 h-3" />
                  <span>Paste from Clipboard</span>
                </button>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={founderNote.photoUrl}
                  onChange={(e) => updateFounderNote({ photoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-white border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none font-mono text-[11px]"
                />
                <label className="px-3 py-2 rounded-xl bg-[#211D1C] hover:bg-black text-white text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1 shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-[#FFD94A]" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (evt.target?.result) {
                            updateFounderNote({ photoUrl: evt.target.result as string });
                            showToast('Photo uploaded!');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Featured Highlight Quote</label>
              <textarea
                rows={2}
                value={founderNote.quote}
                onChange={(e) => updateFounderNote({ quote: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Primary Button Text</label>
                <input
                  type="text"
                  value={founderNote.primaryCtaText}
                  onChange={(e) => updateFounderNote({ primaryCtaText: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Secondary Button Text</label>
                <input
                  type="text"
                  value={founderNote.secondaryCtaText}
                  onChange={(e) => updateFounderNote({ secondaryCtaText: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="founderActive"
                checked={founderNote.isActive !== false}
                onChange={(e) => updateFounderNote({ isActive: e.target.checked })}
                className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
              />
              <label htmlFor="founderActive" className="text-xs font-bold text-[#211D1C] cursor-pointer">
                Show Founder’s Story Section on Home Page
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Save Founder’s Note
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: CURATED SPOTLIGHT ROW */}
      {/* ============================================================ */}
      {activeSection === 'spotlight' && (
        <div className="bg-white rounded-3xl border border-[#F3E8E2] p-6 sm:p-8 shadow-xs max-w-2xl space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
              Curated Collection Spotlight Row
            </h3>
            <p className="text-xs text-stone-500">
              Spotlight any specific collection on the home page with live products.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              showToast('✨ Spotlight row updated & synced!');
            }}
            className="space-y-4 text-xs"
          >
            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Eyebrow Badge</label>
              <input
                type="text"
                value={curatedSpotlight.eyebrow}
                onChange={(e) => updateCuratedSpotlight({ eyebrow: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Section Heading</label>
              <input
                type="text"
                value={curatedSpotlight.title}
                onChange={(e) => updateCuratedSpotlight({ title: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Subtitle</label>
              <textarea
                rows={2}
                value={curatedSpotlight.subtitle}
                onChange={(e) => updateCuratedSpotlight({ subtitle: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Target Gift Collection</label>
              <select
                value={curatedSpotlight.category}
                onChange={(e) => updateCuratedSpotlight({ category: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
              >
                <option value="Personalized Jewellery">Personalized Jewellery</option>
                <option value="Names on Gifts">Names on Gifts</option>
                <option value="Customize Your Caricature or Miniature">Customize Your Caricature or Miniature</option>
                <option value="Personalize Your Bouquets">Personalize Your Bouquets</option>
                <option value="Special Hampers">Special Hampers</option>
                <option value="Hair Accessories">Hair Accessories</option>
                <option value="Paradise of Jewels">Paradise of Jewels</option>
                <option value="Preserved Eternal Roses & Dome Displays">Preserved Eternal Roses & Dome Displays</option>
                <option value="Custom Acrylic Song Plaques & Photo Frames">Custom Acrylic Song Plaques & Photo Frames</option>
                <option value="Memory Photo Lamps & Crystal Cubes">Memory Photo Lamps & Crystal Cubes</option>
                <option value="Engraved Wooden Gift Boxes & Keepsakes">Engraved Wooden Gift Boxes & Keepsakes</option>
                <option value="Romantic Couple Hampers & Scented Candle Sets">Romantic Couple Hampers & Scented Candle Sets</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="spotActive"
                checked={curatedSpotlight.isActive !== false}
                onChange={(e) => updateCuratedSpotlight({ isActive: e.target.checked })}
                className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
              />
              <label htmlFor="spotActive" className="text-xs font-bold text-[#211D1C] cursor-pointer">
                Show Spotlight Row on Home Page
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Save Spotlight Settings
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 8: 4 VALUE PROPS / GUARANTEES */}
      {/* ============================================================ */}
      {activeSection === 'props' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                4 Value Props & Trust Badges ({valueProps.length})
              </h3>
              <p className="text-xs text-stone-500">
                Craftsmanship guarantees displayed on the Home Page and product cards.
              </p>
            </div>
            <button
              onClick={() => handleOpenPropModal()}
              className="px-4 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Value Prop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {valueProps.map((prop, idx) => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-[#F3E8E2] p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400 font-bold">
                      #{idx + 1}
                    </span>
                    {prop.badge && (
                      <span className="text-[9px] font-bold text-[#FF2E93] bg-[#FFF0F5] px-1.5 py-0.2 rounded-full">
                        {prop.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-[#211D1C] mt-2">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {prop.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => handleOpenPropModal(prop)}
                    className="p-1.5 rounded-lg bg-[#FFF0F5] text-[#FF2E93] hover:bg-[#FFE0E6] text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${prop.title}?`)) {
                        deleteValueProp(prop.id);
                        showToast('Value prop deleted');
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold cursor-pointer"
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
      {/* SECTION 9: ANNOUNCEMENTS & MARQUEE TICKER */}
      {/* ============================================================ */}
      {activeSection === 'announcements' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                Announcement Ticker Messages ({announcements.length})
              </h3>
              <p className="text-xs text-stone-500">
                Top announcement bar and marquee strip messages with promo codes.
              </p>
            </div>
            <button
              onClick={() => handleOpenAnnModal()}
              className="px-4 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Announcement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann, idx) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-[#F3E8E2] p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400 font-bold">
                      Message #{idx + 1}
                    </span>
                    <button
                      onClick={() => {
                        updateAnnouncement(ann.id, { isActive: !ann.isActive });
                        showToast(ann.isActive ? 'Message hidden' : 'Message active');
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                        ann.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {ann.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="font-semibold text-xs text-[#211D1C] mt-2">
                    {ann.text}
                  </p>
                  {ann.code && (
                    <div className="text-[10px] text-[#FF2E93] font-mono font-bold mt-1 bg-[#FFF0F5] px-2 py-1 rounded-md inline-block">
                      Coupon: {ann.code}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => handleOpenAnnModal(ann)}
                    className="p-1.5 rounded-lg bg-[#FFF0F5] text-[#FF2E93] hover:bg-[#FFE0E6] text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this announcement?')) {
                        deleteAnnouncement(ann.id);
                        showToast('Announcement deleted');
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold cursor-pointer"
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
      {/* SECTION 10: VIP NEWSLETTER SECTION */}
      {/* ============================================================ */}
      {activeSection === 'newsletter' && (
        <div className="bg-white rounded-3xl border border-[#F3E8E2] p-6 sm:p-8 shadow-xs max-w-2xl space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
              VIP Newsletter Privilege Banner Settings
            </h3>
            <p className="text-xs text-stone-500">
              Customize the newsletter discount code, title, and subscription button.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              showToast('✨ Newsletter settings updated!');
            }}
            className="space-y-4 text-xs"
          >
            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Newsletter Title</label>
              <input
                type="text"
                value={newsletter.title}
                onChange={(e) => updateNewsletter({ title: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#211D1C]">Subtitle</label>
              <textarea
                rows={2}
                value={newsletter.subtitle}
                onChange={(e) => updateNewsletter({ subtitle: e.target.value })}
                className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Discount Coupon Code</label>
                <input
                  type="text"
                  value={newsletter.discountCode}
                  onChange={(e) => updateNewsletter({ discountCode: e.target.value.toUpperCase() })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#FF2E93] font-mono font-bold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Badge Text</label>
                <input
                  type="text"
                  value={newsletter.discountBadge}
                  onChange={(e) => updateNewsletter({ discountBadge: e.target.value })}
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="newsActive"
                checked={newsletter.isActive !== false}
                onChange={(e) => updateNewsletter({ isActive: e.target.checked })}
                className="w-4 h-4 accent-[#FF2E93] cursor-pointer"
              />
              <label htmlFor="newsActive" className="text-xs font-bold text-[#211D1C] cursor-pointer">
                Show Newsletter Section on Home Page
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Save Newsletter Settings
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: ADD / EDIT HERO SLIDE */}
      {/* ============================================================ */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-lg rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
              </h3>
              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Slide Eyebrow</label>
                <input
                  type="text"
                  required
                  value={slideEyebrow}
                  onChange={(e) => setSlideEyebrow(e.target.value)}
                  placeholder="Cute Things Inside ♡"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Main Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  placeholder="YOUR GO-TO-GO PLATFORM"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Tagline / Subtext</label>
                <textarea
                  rows={2}
                  value={slideTagline}
                  onChange={(e) => setSlideTagline(e.target.value)}
                  placeholder="Hampers ♡ Bouquets ♡ Jewellery ♡ & More..."
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              {/* Banner Image URL / Paste / Upload */}
              <div className="space-y-2 p-3 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#211D1C]">Banner Image (Full-Bleed)</label>
                  <button
                    type="button"
                    onClick={() => handlePasteClipboardImage(setSlideImageUrl)}
                    className="text-[11px] font-bold text-[#FF2E93] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Clipboard className="w-3 h-3" />
                    <span>Paste Clipboard Image</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={slideImageUrl}
                    onChange={(e) => setSlideImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-white border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none text-xs font-mono"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#211D1C] hover:bg-black text-white text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1 shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-[#FFD94A]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setSlideImageUrl(evt.target.result as string);
                              showToast('Banner photo uploaded!');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Promo Code</label>
                  <input
                    type="text"
                    value={slideCoupon}
                    onChange={(e) => setSlideCoupon(e.target.value.toUpperCase())}
                    placeholder="LOVE100"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-mono outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Badge Tag</label>
                  <input
                    type="text"
                    value={slideBadge}
                    onChange={(e) => setSlideBadge(e.target.value)}
                    placeholder="FLAT 60% OFF"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">CTA Button Text</label>
                  <input
                    type="text"
                    value={slideCtaText}
                    onChange={(e) => setSlideCtaText(e.target.value)}
                    placeholder="Explore Collection"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">CTA Target Route</label>
                  <input
                    type="text"
                    value={slideCtaCategory}
                    onChange={(e) => setSlideCtaCategory(e.target.value)}
                    placeholder="products"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-white border border-[#F3E8E2] text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Save Hero Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT COLLECTION CIRCLE */}
      {isCircleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                {editingCircle ? 'Edit Collection Circle' : 'Add Collection Circle'}
              </h3>
              <button
                onClick={() => setIsCircleModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCircle} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={circleName}
                  onChange={(e) => setCircleName(e.target.value)}
                  placeholder="e.g. Personalization"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Subtitle</label>
                <input
                  type="text"
                  value={circleSubtitle}
                  onChange={(e) => setCircleSubtitle(e.target.value)}
                  placeholder="e.g. WhatsApp Confirmed"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Badge Tag</label>
                <input
                  type="text"
                  value={circleBadge}
                  onChange={(e) => setCircleBadge(e.target.value)}
                  placeholder="e.g. WhatsApp Verified"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Image URL</label>
                <input
                  type="text"
                  required
                  value={circleImage}
                  onChange={(e) => setCircleImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Navigation Route / Category</label>
                <input
                  type="text"
                  required
                  value={circleRoute}
                  onChange={(e) => setCircleRoute(e.target.value)}
                  placeholder="e.g. personalization"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-mono outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsCircleModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-white border border-[#F3E8E2] text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT VIDEO REEL */}
      {isReelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-lg rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                {editingReel ? 'Edit Video Reel' : 'Add New Video Reel'}
              </h3>
              <button
                onClick={() => setIsReelModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReel} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Reel Title *</label>
                <input
                  type="text"
                  required
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  placeholder="Watch Unboxing: 18k Gold Cursive Name Pendant"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Tagline / Subtext</label>
                <input
                  type="text"
                  value={reelTagline}
                  onChange={(e) => setReelTagline(e.target.value)}
                  placeholder="See the micro-engraving shine under velvet studio lights"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Direct MP4 Video URL *</label>
                <input
                  type="text"
                  required
                  value={reelVideoUrl}
                  onChange={(e) => setReelVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/videos/..."
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-mono outline-none text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Poster Image URL</label>
                <input
                  type="text"
                  value={reelPosterImage}
                  onChange={(e) => setReelPosterImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-mono outline-none text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Duration (seconds)</label>
                  <input
                    type="number"
                    value={reelDuration}
                    onChange={(e) => setReelDuration(Number(e.target.value))}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Views Count Tag</label>
                  <input
                    type="text"
                    value={reelViews}
                    onChange={(e) => setReelViews(e.target.value)}
                    placeholder="48.2k"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsReelModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-white border border-[#F3E8E2] text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Save Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT ANNOUNCEMENT */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                {editingAnn ? 'Edit Announcement' : 'Add Announcement'}
              </h3>
              <button
                onClick={() => setIsAnnModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnn} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Announcement Message *</label>
                <textarea
                  rows={2}
                  required
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  placeholder="e.g. WELCOME PRIVILEGE: BUY 1 GIFT, GET ₹100 OFF"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Promo Code (optional)</label>
                <input
                  type="text"
                  value={annCode}
                  onChange={(e) => setAnnCode(e.target.value.toUpperCase())}
                  placeholder="LOVE100"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#FF2E93] font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Highlight Tag (optional)</label>
                <input
                  type="text"
                  value={annHighlight}
                  onChange={(e) => setAnnHighlight(e.target.value)}
                  placeholder="Pan-India / Limited Time"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-white border border-[#F3E8E2] text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD / EDIT VALUE PROP */}
      {isPropModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                {editingProp ? 'Edit Value Pillar' : 'Add Value Pillar'}
              </h3>
              <button
                onClick={() => setIsPropModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProp} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Pillar Title *</label>
                <input
                  type="text"
                  required
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="e.g. 100% Handcrafted"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Description / Subtitle</label>
                <textarea
                  rows={2}
                  value={propSubtitle}
                  onChange={(e) => setPropSubtitle(e.target.value)}
                  placeholder="Each bespoke piece laser engraved & assembled with love."
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Icon</label>
                  <select
                    value={propIcon}
                    onChange={(e) => setPropIcon(e.target.value)}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  >
                    <option value="Sparkles">Sparkles ✨</option>
                    <option value="Truck">Truck 🚚</option>
                    <option value="MessageSquare">MessageSquare 💬</option>
                    <option value="Gift">Gift 🎁</option>
                    <option value="ShieldCheck">ShieldCheck 🛡️</option>
                    <option value="Heart">Heart 💖</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Badge Tag</label>
                  <input
                    type="text"
                    value={propBadge}
                    onChange={(e) => setPropBadge(e.target.value)}
                    placeholder="Artisan Quality"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsPropModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-white border border-[#F3E8E2] text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Save Value Pillar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
