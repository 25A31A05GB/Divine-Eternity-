import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';
import { useMediaCMS } from '../context/MediaCMSContext';
import { Product, Order, Coupon, OrderStatus, PhoneBrand, CreatorApplication, Campaign, HeroSlideCMS, VideoReelCMS, AdminRole } from '../types';
import { AVAILABLE_COUPONS } from '../context/CartContext';
import { INITIAL_CREATOR_APPLICATIONS, INITIAL_CAMPAIGNS } from '../data/campaigns';
import { SEO } from '../components/common/SEO';
import { MediaStudioCMS } from '../components/admin/MediaStudioCMS';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  Sparkles,
  Download,
  Search,
  Check,
  Star,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Eye,
  Edit3,
  Printer,
  Copy,
  Tag,
  AlertCircle,
  ChevronRight,
  X,
  ExternalLink,
  Layers,
  Settings,
  Store,
  RefreshCw,
  Hash,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  Send,
  Calendar,
  Layers2,
  Table as TableIcon,
  LayoutGrid,
  CheckSquare,
  XCircle,
  Activity,
  Zap,
  Video,
  Instagram,
  Briefcase,
  Play,
  Film,
  Image as ImageIcon,
  Sliders,
  Menu,
  Upload,
  FolderPlus,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onReturnToStore: () => void;
  initialRole?: AdminRole;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onReturnToStore,
  initialRole = 'director',
}) => {
  const { user, isAdmin, orders, updateOrderStatus } = useAuth();
  const { reviews, toggleVerifiedBadge, deleteReview } = useReviews();
  const {
    heroSlides,
    videoReels,
    updateHeroSlide,
    addHeroSlide,
    deleteHeroSlide,
    updateVideoReel,
    addVideoReel,
    deleteVideoReel,
    resetToDefaults,
  } = useMediaCMS();

  const [currentRole, setCurrentRole] = useState<AdminRole>(initialRole);
  const [isAdminMobileMenuOpen, setIsAdminMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'media-cms' | 'coupons' | 'reviews' | 'customers' | 'affiliates'
  >(() => (initialRole === 'director' ? 'media-cms' : 'overview'));
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [productViewMode, setProductViewMode] = useState<'table' | 'grid'>('table');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Media CMS Modals State
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [isAddReelOpen, setIsAddReelOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideCMS | null>(null);
  const [editingReel, setEditingReel] = useState<VideoReelCMS | null>(null);

  // New Slide Form State
  const [slideTitle, setSlideTitle] = useState('');
  const [slideEyebrow, setSlideEyebrow] = useState('Atelier Spotlight');
  const [slideTagline, setSlideTagline] = useState('');
  const [slideImageUrl, setSlideImageUrl] = useState('');
  const [slideVideoUrl, setSlideVideoUrl] = useState('');
  const [slideCoupon, setSlideCoupon] = useState('LOVE100');
  const [slideCtaText, setSlideCtaText] = useState('Personalize Yours');
  const [slideCtaCategory, setSlideCtaCategory] = useState('Personalized Name Jewelry');

  // New Reel Form State
  const [reelTitle, setReelTitle] = useState('');
  const [reelTagline, setReelTagline] = useState('');
  const [reelVideoUrl, setReelVideoUrl] = useState('');
  const [reelPosterImage, setReelPosterImage] = useState('');
  const [reelLinkedProduct, setReelLinkedProduct] = useState(products[0]?.id || 'gift-1');
  const [reelDuration, setReelDuration] = useState(15);

  // Creator & Affiliate applications state
  const [creatorApplications, setCreatorApplications] = useState<CreatorApplication[]>(() => {
    try {
      const stored = localStorage.getItem('de_creator_applications');
      if (stored) {
        const parsed = JSON.parse(stored);
        return [...parsed, ...INITIAL_CREATOR_APPLICATIONS.filter((a) => !parsed.some((p: any) => p.id === a.id))];
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CREATOR_APPLICATIONS;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);

  const handleApproveApplication = (appId: string) => {
    setCreatorApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const newAffiliateCoupon: Coupon = {
            code: app.proposedCode,
            type: 'percentage',
            value: 15,
            minOrderValue: 499,
            description: `Exclusive 15% Creator Discount (${app.fullName})`,
            isActive: true,
          };
          setCoupons((cPrev) => [newAffiliateCoupon, ...cPrev.filter((c) => c.code !== app.proposedCode)]);
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
          return { ...app, status: 'Approved' };
        }
        return app;
      })
    );
  };

  const handleDeclineApplication = (appId: string) => {
    setCreatorApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'Declined' } : app))
    );
  };

  // Product modal state & rich editing
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formProductName, setFormProductName] = useState('');
  const [formProductCategory, setFormProductCategory] = useState<string>('Customize Your Gift');
  const [formProductCustomCategory, setFormProductCustomCategory] = useState('');
  const [formProductPrice, setFormProductPrice] = useState<number>(849);
  const [formProductMrp, setFormProductMrp] = useState<number>(1899);
  const [formProductDesc, setFormProductDesc] = useState('');
  const [formProductBadge, setFormProductBadge] = useState('Purely Gold Plated ✨💖');
  const [formProductImages, setFormProductImages] = useState<string[]>([]);
  const [formImageUrlInput, setFormImageUrlInput] = useState('');
  const [formFeatures, setFormFeatures] = useState<string[]>([
    '18k Anti-tarnish Gold Plating',
    'Water & Sweat Resistant',
    'Hypoallergenic & Nickel-Free',
    'Luxury Suede Gifting Box',
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [formAllowsText, setFormAllowsText] = useState(true);
  const [formTextLabel, setFormTextLabel] = useState('Custom Name / Monogram');
  const [formTextPlaceholder, setFormTextPlaceholder] = useState('e.g. Aurelia, Sophia, 14.02');
  const [formAllowsGiftMessage, setFormAllowsGiftMessage] = useState(true);
  const [formAllowsPhotoUpload, setFormAllowsPhotoUpload] = useState(false);

  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productSuccessToast, setProductSuccessToast] = useState<string | null>(null);

  // Coupon state with persistent store synchronization
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('de_coupons_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return AVAILABLE_COUPONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('de_coupons_v1', JSON.stringify(coupons));
    } catch (e) {
      console.error('Failed to save coupons', e);
    }
  }, [coupons]);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState(150);
  const [newCouponType, setNewCouponType] = useState<'flat' | 'percentage'>('flat');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(800);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const pendingOrders = orders.filter((o) => o.status === 'Placed' || o.status === 'Packed').length;

  const allReviewsList = useMemo(() => {
    return Object.entries(reviews).flatMap(([prodId, revList]) => {
      const prod = products.find((p) => p.id === prodId);
      return revList.map((r) => ({
        ...r,
        productId: prodId,
        productName: prod?.name || 'Custom Keepsake',
      }));
    });
  }, [reviews, products]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderFilter !== 'All' && o.status !== orderFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [orders, orderFilter, searchQuery]);

  const customersList = useMemo(() => {
    const map = new Map<
      string,
      { name: string; email: string; phone: string; totalSpent: number; ordersCount: number; lastOrderDate: string }
    >();
    orders.forEach((o) => {
      const key = o.customer.email || o.customer.phone;
      const existing = map.get(key);
      if (existing) {
        existing.totalSpent += o.totalAmount;
        existing.ordersCount += 1;
        existing.lastOrderDate = o.createdAt;
      } else {
        map.set(key, {
          name: o.customer.fullName,
          email: o.customer.email,
          phone: o.customer.phone,
          totalSpent: o.totalAmount,
          ordersCount: 1,
          lastOrderDate: o.createdAt,
        });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setFormProductName('');
    setFormProductCategory('Customize Your Gift');
    setFormProductCustomCategory('');
    setFormProductPrice(849);
    setFormProductMrp(1899);
    setFormProductDesc('Jewellery made personal, for moments that mean everything.\nPurely gold plated.✨💖');
    setFormProductBadge('Purely Gold Plated ✨💖');
    setFormProductImages([]);
    setFormImageUrlInput('');
    setFormFeatures([
      '18k Anti-tarnish Gold Plating',
      'Water & Sweat Resistant',
      'Hypoallergenic & Nickel-Free',
      'Luxury Suede Gifting Box',
    ]);
    setNewFeatureInput('');
    setFormAllowsText(true);
    setFormTextLabel('Custom Name / Monogram');
    setFormTextPlaceholder('e.g. Aurelia, Sophia, 14.02');
    setFormAllowsGiftMessage(true);
    setFormAllowsPhotoUpload(false);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormProductName(prod.name);
    setFormProductCategory(prod.category);
    setFormProductCustomCategory('');
    setFormProductPrice(prod.price);
    setFormProductMrp(prod.mrp);
    setFormProductDesc(prod.description || '');
    setFormProductBadge(prod.badge || '');
    setFormProductImages(prod.images && prod.images.length > 0 ? [...prod.images] : []);
    setFormImageUrlInput('');
    setFormFeatures(
      prod.features && prod.features.length > 0
        ? [...prod.features]
        : [
            '18k Anti-tarnish Gold Plating',
            'Water & Sweat Resistant',
            'Hypoallergenic & Nickel-Free',
            'Luxury Suede Gifting Box',
          ]
    );
    setNewFeatureInput('');
    setFormAllowsText(prod.personalizationConfig?.allowsText ?? true);
    setFormTextLabel(prod.personalizationConfig?.textLabel || 'Custom Name / Monogram');
    setFormTextPlaceholder(prod.personalizationConfig?.textPlaceholder || 'e.g. Aurelia, Sophia, 14.02');
    setFormAllowsGiftMessage(prod.personalizationConfig?.allowsGiftMessage ?? true);
    setFormAllowsPhotoUpload(prod.personalizationConfig?.allowsPhoto ?? false);
    setIsProductModalOpen(true);
  };

  const handleDuplicateProduct = (prod: Product) => {
    const duplicated: Product = {
      ...prod,
      id: `jewel-copy-${Date.now()}`,
      slug: `${prod.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      name: `${prod.name} (Copy)`,
      badge: 'New Arrival',
    };
    onAddProduct(duplicated);
    setProductSuccessToast(`✓ Created duplicate of "${prod.name}"`);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setProductSuccessToast(null), 4000);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result && typeof evt.target.result === 'string') {
          const resultStr = evt.target.result;
          setFormProductImages((prev) => [...prev, resultStr]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!formImageUrlInput.trim()) return;
    setFormProductImages((prev) => [...prev, formImageUrlInput.trim()]);
    setFormImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormProductImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMakePrimaryImage = (indexToPrimary: number) => {
    setFormProductImages((prev) => {
      const item = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      return [item, ...rest];
    });
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormFeatures((prev) => [...prev, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (idxToRemove: number) => {
    setFormFeatures((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProductName.trim()) return;

    const finalCategory =
      formProductCategory === '__custom__' && formProductCustomCategory.trim()
        ? formProductCustomCategory.trim()
        : formProductCategory;

    const finalImages =
      formProductImages.length > 0
        ? formProductImages
        : ['/src/assets/images/jewel_evil_eye_1791316200000.jpg'];

    if (editingProduct) {
      const updatedProd: Product = {
        ...editingProduct,
        name: formProductName.trim(),
        slug: formProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: finalCategory,
        price: Number(formProductPrice),
        mrp: Number(formProductMrp),
        description: formProductDesc.trim(),
        badge: formProductBadge.trim() || undefined,
        images: finalImages,
        features: formFeatures.filter((f) => f.trim().length > 0),
        allowsPersonalization: formAllowsText || formAllowsGiftMessage || formAllowsPhotoUpload,
        personalizationConfig: {
          allowsText: formAllowsText,
          textLabel: formTextLabel,
          textPlaceholder: formTextPlaceholder,
          textMaxLength: 20,
          allowsGiftMessage: formAllowsGiftMessage,
          allowsPhoto: formAllowsPhotoUpload,
        },
      };
      onUpdateProduct(updatedProd);
      setProductSuccessToast(`✓ Updated "${updatedProd.name}". Changes are live on the main page!`);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formProductName.trim(),
        slug:
          formProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
          `-${Math.floor(Math.random() * 1000)}`,
        category: finalCategory,
        price: Number(formProductPrice),
        mrp: Number(formProductMrp),
        rating: 5.0,
        reviewCount: 1,
        description:
          formProductDesc.trim() ||
          'Jewellery made personal, for moments that mean everything.\nPurely gold plated.✨💖',
        badge: formProductBadge.trim() || 'New Arrival',
        isBestSeller: true,
        isNew: true,
        themeColor: '#FFFDF8',
        secondaryColor: '#D4AF37',
        designPattern: 'jewelry_necklace',
        images: finalImages,
        features: formFeatures.filter((f) => f.trim().length > 0),
        allowsPersonalization: formAllowsText || formAllowsGiftMessage || formAllowsPhotoUpload,
        personalizationConfig: {
          allowsText: formAllowsText,
          textLabel: formTextLabel,
          textPlaceholder: formTextPlaceholder,
          textMaxLength: 20,
          allowsGiftMessage: formAllowsGiftMessage,
          allowsPhoto: formAllowsPhotoUpload,
        },
      };
      onAddProduct(newProd);
      setProductSuccessToast(`✓ Added "${newProd.name}". Now live on the main page!`);
    }

    setIsProductModalOpen(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setProductSuccessToast(null), 5000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newC: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      value: Number(newCouponVal),
      minOrderValue: Number(newCouponMinOrder),
      description: newCouponDesc || `Get ₹${newCouponVal} off on orders over ₹${newCouponMinOrder}`,
      isActive: true,
    };

    setCoupons((prev) => [newC, ...prev]);
    setIsAddCouponOpen(false);
    setNewCouponCode('');
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

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
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
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
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
  };

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Delivered</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <Truck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>In Transit</span>
          </span>
        );
      case 'Packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <Package className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Packed & Ready</span>
          </span>
        );
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Order Placed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-xs">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0F0D10] text-[#1C1917] dark:text-[#F5F0EB]">
      <SEO
        title="Admin Suite & Media CMS — Gadgets Destiny"
        description="Store control panel for live catalog, order operations, and hero video management."
        noindex={true}
      />

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#211D1C] border-b border-stone-800 px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#FF2E93] flex items-center justify-center text-white shadow-md font-sans text-lg font-extrabold shrink-0">
              GD
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white truncate">
                  Gadgets <span className="text-[#FF2E93]">Destiny</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/40 flex items-center gap-1 shrink-0">
                  <Activity className="w-3 h-3 animate-pulse" /> Studio Panel
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 truncate">
                Active Session · <strong className="text-white">{user?.name || 'Store Manager'}</strong>
              </p>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Active Role Switcher */}
            <div className="flex items-center p-1 bg-[#171413] rounded-xl border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('director');
                  setActiveTab('media-cms');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentRole === 'director'
                    ? 'bg-[#FF2E93] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Media CMS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentRole('superadmin');
                  setActiveTab('overview');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentRole === 'superadmin'
                    ? 'bg-[#FF2E93] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentRole('orders');
                  setActiveTab('orders');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentRole === 'orders'
                    ? 'bg-[#FF2E93] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Fulfillment</span>
              </button>
            </div>

            <button
              onClick={onReturnToStore}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#171413] hover:bg-[#211D1C] border border-stone-800 text-white hover:text-[#FF2E93] hover:border-[#FF2E93] transition-colors shadow-xs cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-[#FFD94A]" />
              Return to Store
            </button>
          </div>

          {/* Mobile Navigation Controls: Hamburger "Three Lines" Button */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              onClick={onReturnToStore}
              className="px-2.5 py-2 rounded-xl bg-[#171413] border border-stone-800 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span className="hidden xs:inline">Store</span>
            </button>

            <button
              onClick={() => setIsAdminMobileMenuOpen(true)}
              aria-label="Toggle Dashboard Menu"
              className="p-2.5 rounded-xl bg-[#171413] border border-[#FF2E93] text-white hover:bg-[#211D1C] active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Menu className="w-5 h-5 text-[#FF2E93]" />
              <span className="text-xs font-bold text-white">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Admin Navigation Drawer Portal */}
      {isAdminMobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="md:hidden fixed inset-0 z-[9999] w-full h-full h-[100dvh] bg-[#211D1C] text-white flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 p-5 shadow-2xl">
            <div>
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF2E93] text-white font-bold text-sm flex items-center justify-center">
                    GD
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Gadgets Destiny Control</div>
                    <div className="text-[10px] text-[#FFD94A]">Mobile Command Center</div>
                  </div>
                </div>

                <button
                  onClick={() => setIsAdminMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-[#171413] border border-stone-800 text-white shadow-md hover:bg-stone-800"
                  aria-label="Close admin menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role Selection inside Drawer */}
              <div className="my-4 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5B8CFF] font-mono">
                  Access Role
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setCurrentRole('director');
                      setActiveTab('media-cms');
                      setIsAdminMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      currentRole === 'director'
                        ? 'bg-[#5B8CFF] border-[#5B8CFF] text-white shadow-xs'
                        : 'bg-[#151A24] border-[#242C3D] text-[#A7AFBD]'
                    }`}
                  >
                    <Film className="w-4 h-4 mx-auto mb-1 text-[#22D3EE]" />
                    <span className="text-[11px] font-bold block">Media Director</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('superadmin');
                      setActiveTab('overview');
                      setIsAdminMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      currentRole === 'superadmin'
                        ? 'bg-[#5B8CFF] border-[#5B8CFF] text-white shadow-xs'
                        : 'bg-[#151A24] border-[#242C3D] text-[#A7AFBD]'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mx-auto mb-1 text-[#D6B36A]" />
                    <span className="text-[11px] font-bold block">Super Admin</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('orders');
                      setActiveTab('orders');
                      setIsAdminMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      currentRole === 'orders'
                        ? 'bg-[#5B8CFF] border-[#5B8CFF] text-white shadow-xs'
                        : 'bg-[#151A24] border-[#242C3D] text-[#A7AFBD]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-[#8B5CF6]" />
                    <span className="text-[11px] font-bold block">Fulfillment</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs List */}
              <div className="my-5 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5B8CFF] font-mono">
                  Dashboard Modules
                </div>
                {[
                  { id: 'overview', label: 'Executive Overview', icon: BarChart3, count: null },
                  { id: 'orders', label: 'Orders & Pipeline', icon: ShoppingBag, count: orders.length },
                  { id: 'products', label: 'Catalog Studio', icon: Package, count: products.length },
                  { id: 'media-cms', label: 'Media & Video CMS', icon: Film, count: heroSlides.length + videoReels.length },
                  { id: 'coupons', label: 'Offers & Coupons', icon: Tag, count: coupons.length },
                  { id: 'reviews', label: 'Reviews & Proof', icon: Star, count: allReviewsList.length },
                  { id: 'customers', label: 'Client Directory', icon: Users, count: customersList.length },
                  { id: 'affiliates', label: 'Creator Ambassadors', icon: Video, count: creatorApplications.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setIsAdminMobileMenuOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group shadow-xs ${
                        isActive
                          ? 'bg-[#1B2230] border-[#5B8CFF] text-[#F7F4EC]'
                          : 'bg-[#151A24] border-[#242C3D] text-[#A7AFBD] hover:border-[#5B8CFF]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#22D3EE]' : 'text-[#737C8C]'}`} />
                        <span className="text-xs font-semibold text-[#F7F4EC]">{tab.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {tab.count !== null && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#0C1220] text-[#22D3EE]">
                            {tab.count}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-[#737C8C]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-4 mt-6 border-t border-[#242C3D] space-y-2">
              <button
                onClick={() => {
                  setIsAdminMobileMenuOpen(false);
                  onReturnToStore();
                }}
                className="w-full p-3 rounded-2xl bg-[#5B8CFF] hover:bg-[#4b7beb] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Store className="w-4 h-4" />
                <span>Return to Public Storefront</span>
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#F3E8E2] no-scrollbar">
          {[
            { id: 'overview', label: 'Store Overview', icon: BarChart3, count: null },
            { id: 'orders', label: 'Orders & Pipeline', icon: ShoppingBag, count: orders.length },
            { id: 'products', label: 'Catalog Studio', icon: Package, count: products.length },
            { id: 'media-cms', label: 'Media & Video CMS', icon: Film, count: heroSlides.length + videoReels.length },
            { id: 'coupons', label: 'Offers & Coupons', icon: Tag, count: coupons.length },
            { id: 'reviews', label: 'Reviews & Proof', icon: Star, count: allReviewsList.length },
            { id: 'customers', label: 'Client Directory', icon: Users, count: customersList.length },
            { id: 'affiliates', label: 'Creator Ambassadors', icon: Video, count: creatorApplications.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#211D1C] text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:text-[#FF2E93] hover:bg-[#FFF0F3] border border-[#F3E8E2]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFD94A]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive
                        ? 'bg-[#FF2E93] text-white'
                        : 'bg-[#FFF0F3] text-[#FF2E93]'
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
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white dark:bg-[#181418] p-6 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Gross Revenue
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#881337]/10 text-[#881337] dark:text-[#FB7185] flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#1C1917] dark:text-white tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +28.4% this month
                </p>
              </div>

              <div className="bg-white dark:bg-[#181418] p-6 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Total Orders
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#1C1917] dark:text-white tabular-nums">
                  {totalOrdersCount}
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  {pendingOrders} awaiting dispatch
                </p>
              </div>

              <div className="bg-white dark:bg-[#181418] p-6 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Average Order Value
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#C5A059] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#1C1917] dark:text-white tabular-nums">
                  ₹{averageOrderValue}
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Multi-item gifting carts
                </p>
              </div>

              <div className="bg-white dark:bg-[#181418] p-6 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Active Catalog
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#1C1917] dark:text-white tabular-nums">
                  {products.length} Items
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Across 7 gift categories
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ORDERS & PIPELINE */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, or phone..."
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {['All', 'Placed', 'Packed', 'Shipped', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        orderFilter === st
                          ? 'bg-[#881337] text-white shadow-xs'
                          : 'bg-[#FAF7F2] dark:bg-stone-900 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-stone-500">
                Showing <strong className="text-stone-900 dark:text-white">{filteredOrders.length}</strong> orders
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] dark:bg-[#1C181C] text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-[#EFE7DE] dark:border-[#2C242A]">
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer & Address</th>
                      <th className="py-3.5 px-4">Purchased Keepsakes</th>
                      <th className="py-3.5 px-4">Amount & Payment</th>
                      <th className="py-3.5 px-4">Fulfillment Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DE] dark:divide-[#282127]">
                    {filteredOrders.map((ord, idx) => (
                      <tr
                        key={ord.id}
                        className={`hover:bg-[#FAF7F2] dark:hover:bg-stone-900/60 transition-colors ${
                          idx % 2 === 0 ? 'bg-white dark:bg-[#181418]' : 'bg-[#FAF7F2]/40 dark:bg-stone-950/30'
                        }`}
                      >
                        <td className="py-4 px-4 align-top">
                          <div className="font-mono font-bold text-sm text-[#881337] dark:text-[#FB7185]">
                            #{ord.id}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-1">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-stone-900 dark:text-white">
                            {ord.customer.fullName}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {ord.customer.phone}
                          </div>
                          <div className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                            {ord.customer.streetAddress}, {ord.customer.city}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="space-y-1">
                            {ord.items.map((item, i) => (
                              <div key={i} className="text-[11px] text-stone-700 dark:text-stone-300">
                                <span className="font-semibold">{item.quantity}x {item.name}</span>
                                {item.customText && (
                                  <span className="block text-[10px] text-[#881337] dark:text-[#FB7185]">
                                    Engraving: "{item.customText}"
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-sm text-stone-900 dark:text-white tabular-nums">
                            ₹{ord.totalAmount}
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5">
                            {ord.paymentMethod}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          {renderStatusBadge(ord.status)}
                        </td>

                        <td className="py-4 px-4 align-top text-right space-y-1.5">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-stone-800 dark:text-stone-200"
                          >
                            <option value="Placed">Mark Placed</option>
                            <option value="Packed">Mark Packed</option>
                            <option value="Shipped">Mark Shipped</option>
                            <option value="Delivered">Mark Delivered</option>
                            <option value="Cancelled">Mark Cancelled</option>
                          </select>

                          <div>
                            <button
                              onClick={() => setSelectedOrderForInvoice(ord)}
                              className="inline-flex items-center gap-1 text-[11px] text-[#881337] dark:text-[#FB7185] hover:underline font-semibold"
                            >
                              <Printer className="w-3 h-3" /> Invoice
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: CATALOG STUDIO */}
        {/* ============================================================ */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Live feedback toast */}
            {productSuccessToast && (
              <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-xl animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
                  <span>{productSuccessToast}</span>
                </div>
                <button
                  onClick={() => setProductSuccessToast(null)}
                  className="text-white/80 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181418] p-5 sm:p-6 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" /> Product Catalog Studio
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Upload custom product photos, edit live selling prices & MRP, update titles & descriptions. Changes update the main page in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openAddProductModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-[#181418] p-4 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Search products by title, description, or category..."
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 outline-none focus:border-[#881337]"
                  />
                  {productSearchQuery && (
                    <button
                      onClick={() => setProductSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs font-medium text-stone-500 shrink-0">
                  Total Products:{' '}
                  <strong className="text-stone-900 dark:text-white font-mono font-bold">
                    {products.length}
                  </strong>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                {[
                  'All',
                  'Customize Your Gift',
                  'Personalized Jewellery',
                  'Names on Gifts',
                  'Customize Your Caricature or Miniature',
                  'Personalize Your Bouquets',
                  'Special Hampers',
                  'Hair Accessories',
                  'Paradise of Jewels',
                ].map((cat) => {
                  const isSelected = productCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-colors ${
                        isSelected
                          ? 'bg-[#881337] text-white'
                          : 'bg-[#FAF7F2] dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-[#F3ECE4]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] dark:bg-[#1C181C] text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-[#EFE7DE] dark:border-[#2C242A]">
                      <th className="py-3.5 px-4">Product & Image</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price & MRP</th>
                      <th className="py-3.5 px-4">Rating</th>
                      <th className="py-3.5 px-4">Personalization</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DE] dark:divide-[#282127]">
                    {products
                      .filter((p) => {
                        if (
                          productCategoryFilter !== 'All' &&
                          p.category.toLowerCase() !== productCategoryFilter.toLowerCase()
                        ) {
                          return false;
                        }
                        if (productSearchQuery.trim()) {
                          const q = productSearchQuery.toLowerCase();
                          return (
                            p.name.toLowerCase().includes(q) ||
                            (p.description && p.description.toLowerCase().includes(q)) ||
                            p.category.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((p, idx) => {
                        const coverImg = p.images && p.images.length > 0 ? p.images[0] : null;
                        const discountPct = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
                        return (
                          <tr
                            key={p.id}
                            className={`hover:bg-[#FAF7F2] dark:hover:bg-stone-900/60 transition-colors ${
                              idx % 2 === 0 ? 'bg-white dark:bg-[#181418]' : 'bg-[#FAF7F2]/40 dark:bg-stone-950/30'
                            }`}
                          >
                            <td className="py-3.5 px-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-[#EFE7DE] dark:border-stone-700 shrink-0 relative group">
                                  {coverImg ? (
                                    <img
                                      src={coverImg}
                                      alt={p.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                                      <ImageIcon className="w-5 h-5" />
                                    </div>
                                  )}
                                  {p.images && p.images.length > 1 && (
                                    <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-[9px] font-bold text-white px-1 rounded">
                                      +{p.images.length - 1}
                                    </span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-sm text-stone-900 dark:text-white truncate max-w-xs">
                                    {p.name}
                                  </div>
                                  {p.badge && (
                                    <span className="inline-block mt-0.5 px-2 py-0.5 text-[9px] font-bold uppercase rounded-md bg-[#881337]/10 text-[#881337] dark:text-[#FB7185]">
                                      {p.badge}
                                    </span>
                                  )}
                                  {p.description && (
                                    <p className="text-[11px] text-stone-500 truncate max-w-sm mt-0.5">
                                      {p.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 align-middle">
                              <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 text-stone-700 dark:text-stone-300">
                                {p.category}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 align-middle">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-bold text-sm text-stone-900 dark:text-white tabular-nums">
                                  ₹{p.price}
                                </span>
                                {p.mrp > p.price && (
                                  <span className="text-[10px] text-stone-400 line-through tabular-nums">
                                    ₹{p.mrp}
                                  </span>
                                )}
                              </div>
                              {discountPct > 0 && (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                  {discountPct}% OFF
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 align-middle">
                              <div className="flex items-center gap-1 font-bold text-stone-800 dark:text-stone-200">
                                <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                                <span>{p.rating}</span>
                                <span className="text-stone-400 font-normal">({p.reviewCount})</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 align-middle">
                              <div className="flex flex-col gap-1">
                                {p.personalizationConfig?.allowsText !== false && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                    <Check className="w-3 h-3" /> Laser Engraving
                                  </span>
                                )}
                                {p.personalizationConfig?.allowsGiftMessage && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300">
                                    <Check className="w-3 h-3" /> Gift Card
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 align-middle text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openEditProductModal(p)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-[#881337] hover:text-white text-stone-700 dark:text-stone-300 font-bold transition-all shadow-2xs"
                                  title="Edit Product Details & Images"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDuplicateProduct(p)}
                                  className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                                  title="Duplicate / Copy Product"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                      onDeleteProduct(p.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: MEDIA & VIDEO STUDIO CMS (DIRECTOR & VISUAL PLACEMENT) */}
        {/* ============================================================ */}
        {activeTab === 'media-cms' && (
          <MediaStudioCMS products={products} />
        )}

        {/* ============================================================ */}
        {/* TAB 5: OFFERS & COUPONS */}
        {/* ============================================================ */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" /> Discount Codes & Offer Engine
                </h3>
                <p className="text-xs text-stone-500">
                  Automate cart promotions, tiered discounts, and creator partner discount codes
                </p>
              </div>

              <button
                onClick={() => setIsAddCouponOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create Coupon Code
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] p-5 relative space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-[#881337] dark:text-[#FB7185] px-2.5 py-1 bg-[#881337]/10 rounded-lg">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleDeleteCoupon(c.code)}
                      className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                      title="Remove Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    {c.description}
                  </p>

                  <div className="text-[11px] text-stone-500 space-y-1 pt-2 border-t border-[#EFE7DE] dark:border-[#282127]">
                    <div>
                      Discount:{' '}
                      <strong className="text-stone-900 dark:text-white">
                        {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}
                      </strong>
                    </div>
                    <div>
                      Minimum Order:{' '}
                      <strong className="text-stone-900 dark:text-white">₹{c.minOrderValue || 0}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: REVIEWS & SOCIAL PROOF */}
        {/* ============================================================ */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#C5A059]" /> Client Reviews & Verified Buyer Badges
                </h3>
                <p className="text-xs text-stone-500">
                  Moderate customer feedback, award Verified Buyer badges, or delete spam
                </p>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-bold text-stone-900 dark:text-white tabular-nums">
                  {allReviewsList.length}
                </span>
                <p className="text-xs text-stone-500">Total Reviews</p>
              </div>
            </div>

            <div className="space-y-4">
              {allReviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-[#C5A059]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-[#C5A059]' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-xs text-stone-900 dark:text-white">
                        {rev.title}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-stone-500">
                      <span className="font-bold text-stone-900 dark:text-white">{rev.author}</span>
                      <span>·</span>
                      <span>Item: <strong className="text-[#881337] dark:text-[#FB7185]">{rev.productName}</strong></span>
                      <span>·</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVerifiedBadge(rev.productId, rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        rev.verified
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {rev.verified ? 'Verified Buyer' : 'Mark Verified'}
                    </button>

                    <button
                      onClick={() => deleteReview(rev.productId, rev.id)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 7: CLIENT DIRECTORY */}
        {/* ============================================================ */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" /> Client Directory & Lifetime Value
                </h3>
                <p className="text-xs text-stone-500">
                  Client profiles, repeat gift purchases, and verified delivery contacts
                </p>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-bold text-stone-900 dark:text-white tabular-nums">
                  {customersList.length}
                </span>
                <p className="text-xs text-stone-500">Profiles</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] dark:bg-[#1C181C] text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-[#EFE7DE] dark:border-[#2C242A]">
                      <th className="py-3.5 px-4">Client Name</th>
                      <th className="py-3.5 px-4">Contact Details</th>
                      <th className="py-3.5 px-4">Orders Placed</th>
                      <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DE] dark:divide-[#282127]">
                    {customersList.map((c, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-[#FAF7F2] dark:hover:bg-stone-900/60 transition-colors ${
                          idx % 2 === 0 ? 'bg-white dark:bg-[#181418]' : 'bg-[#FAF7F2]/40 dark:bg-stone-950/30'
                        }`}
                      >
                        <td className="py-4 px-4 font-bold text-stone-900 dark:text-white">
                          {c.name}
                        </td>
                        <td className="py-4 px-4 text-stone-600 dark:text-stone-300">
                          <div>{c.email}</div>
                          <div className="text-[10px] text-stone-400">{c.phone}</div>
                        </td>
                        <td className="py-4 px-4 font-bold text-stone-900 dark:text-white tabular-nums">
                          {c.ordersCount} orders
                        </td>
                        <td className="py-4 px-4 font-bold text-stone-900 dark:text-white text-right tabular-nums">
                          ₹{c.totalSpent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 8: CREATOR AMBASSADORS */}
        {/* ============================================================ */}
        {activeTab === 'affiliates' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" /> Creator Applications & Ambassador Portal
                </h3>
                <p className="text-xs text-stone-500">
                  Review influencer registrations, approve 15% promo codes, and dispatch PR hampers
                </p>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-bold text-stone-900 dark:text-white tabular-nums">
                  {creatorApplications.length}
                </span>
                <p className="text-xs text-stone-500">Applicants</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] dark:bg-[#1C181C] text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-[#EFE7DE] dark:border-[#2C242A]">
                      <th className="py-3.5 px-4">Creator / Handles</th>
                      <th className="py-3.5 px-4">Audience & Niche</th>
                      <th className="py-3.5 px-4">Proposed Code</th>
                      <th className="py-3.5 px-4">PR Address</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DE] dark:divide-[#282127]">
                    {creatorApplications.map((app, idx) => (
                      <tr
                        key={app.id}
                        className={`hover:bg-[#FAF7F2] dark:hover:bg-stone-900/60 transition-colors ${
                          idx % 2 === 0 ? 'bg-white dark:bg-[#181418]' : 'bg-[#FAF7F2]/40 dark:bg-stone-950/30'
                        }`}
                      >
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-stone-900 dark:text-white">
                            {app.fullName}
                          </div>
                          <div className="text-[#881337] dark:text-[#FB7185] font-semibold text-[11px] flex items-center gap-1 mt-0.5">
                            <Instagram className="w-3 h-3" /> {app.instagramHandle || 'Creator'}
                          </div>
                          <div className="text-[10px] text-stone-400">{app.email}</div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                            {app.followerCount}
                          </span>
                          <div className="text-stone-500 text-[11px] mt-1">
                            {app.primaryNiche}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top font-mono font-bold text-[#881337] dark:text-[#FB7185]">
                          {app.proposedCode}
                        </td>

                        <td className="py-4 px-4 align-top text-stone-600 dark:text-stone-300 text-[11px]">
                          {app.prShippingAddress}, {app.city}
                        </td>

                        <td className="py-4 px-4 align-top">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                              app.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : app.status === 'Declined'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {app.status !== 'Approved' && (
                              <button
                                onClick={() => handleApproveApplication(app.id)}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {app.status !== 'Declined' && (
                              <button
                                onClick={() => handleDeclineApplication(app.id)}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-700 dark:bg-stone-800 dark:text-stone-300 transition-colors"
                              >
                                Decline
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: EDIT / ADD HERO SLIDE */}
      {/* ============================================================ */}
      {(isAddSlideOpen || editingSlide) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181418] w-full max-w-xl rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DE] dark:border-[#282127]">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                {editingSlide ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
              </h3>
              <button
                onClick={() => {
                  setIsAddSlideOpen(false);
                  setEditingSlide(null);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Eyebrow Tag *</label>
                  <input
                    type="text"
                    required
                    value={slideEyebrow}
                    onChange={(e) => setSlideEyebrow(e.target.value)}
                    placeholder="e.g. Bespoke Haute Jewelry"
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Promo Code</label>
                  <input
                    type="text"
                    value={slideCoupon}
                    onChange={(e) => setSlideCoupon(e.target.value.toUpperCase())}
                    placeholder="e.g. LOVE100"
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono uppercase text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">Main Headline *</label>
                <input
                  type="text"
                  required
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  placeholder="e.g. 18k Gold Plated Custom Name Necklaces"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white font-serif font-bold text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">Tagline / Subtext *</label>
                <textarea
                  rows={2}
                  required
                  value={slideTagline}
                  onChange={(e) => setSlideTagline(e.target.value)}
                  placeholder="e.g. Handcrafted luxury handwriting pendants in 18k thick gold vermeil."
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Custom Image URL (optional)</label>
                  <input
                    type="url"
                    value={slideImageUrl}
                    onChange={(e) => setSlideImageUrl(e.target.value)}
                    placeholder="https://... (PNG/JPG)"
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono text-stone-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Background Video MP4 URL (optional)</label>
                  <input
                    type="url"
                    value={slideVideoUrl}
                    onChange={(e) => setSlideVideoUrl(e.target.value)}
                    placeholder="https://... (MP4)"
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFE7DE] dark:border-[#282127]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddSlideOpen(false);
                    setEditingSlide(null);
                  }}
                  className="px-4 py-2 rounded-xl font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-colors shadow-sm"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT / ADD VIDEO REEL */}
      {/* ============================================================ */}
      {(isAddReelOpen || editingReel) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181418] w-full max-w-xl rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DE] dark:border-[#282127]">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                {editingReel ? 'Edit Video Shopping Reel' : 'Add New Video Shopping Reel'}
              </h3>
              <button
                onClick={() => {
                  setIsAddReelOpen(false);
                  setEditingReel(null);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReel} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">Reel Caption / Title *</label>
                <input
                  type="text"
                  required
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  placeholder="e.g. Watch Unboxing: 18k Gold Cursive Name Pendant"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">Tagline / Highlight</label>
                <input
                  type="text"
                  value={reelTagline}
                  onChange={(e) => setReelTagline(e.target.value)}
                  placeholder="e.g. See the micro-engraving shine under velvet studio lights"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">Direct Video URL (MP4) *</label>
                <input
                  type="url"
                  required
                  value={reelVideoUrl}
                  onChange={(e) => setReelVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/.../video.mp4"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Linked Shop Product</label>
                  <select
                    value={reelLinkedProduct}
                    onChange={(e) => setReelLinkedProduct(e.target.value)}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white font-semibold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Duration (Seconds)</label>
                  <input
                    type="number"
                    value={reelDuration}
                    onChange={(e) => setReelDuration(Number(e.target.value))}
                    min={5}
                    max={60}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFE7DE] dark:border-[#282127]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddReelOpen(false);
                    setEditingReel(null);
                  }}
                  className="px-4 py-2 rounded-xl font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-colors shadow-sm"
                >
                  Save Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ============================================================ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181418] w-full max-w-2xl rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-5 sm:p-7 space-y-5 animate-in fade-in duration-150 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DE] dark:border-[#282127] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#881337]/10 text-[#881337] dark:text-[#FB7185] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white">
                    {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Personalized Keepsake'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {editingProduct
                      ? 'Update pricing, upload new photos, and edit description.'
                      : 'Create a new product listing. Changes are live on the main page immediately.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                  <span>Product Title / Name *</span>
                  <span className="text-[10px] text-stone-400 font-normal">Displayed prominently across store</span>
                </label>
                <input
                  type="text"
                  required
                  value={formProductName}
                  onChange={(e) => setFormProductName(e.target.value)}
                  placeholder="e.g. 18k Gold Plated Personalized Evil Eye Initial Pendant Necklace"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-900 dark:text-white font-semibold text-sm outline-none focus:border-[#881337]"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Category *</label>
                  <select
                    value={formProductCategory}
                    onChange={(e) => setFormProductCategory(e.target.value)}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white font-semibold outline-none focus:border-[#881337]"
                  >
                    <option value="Customize Your Gift">Customize Your Gift</option>
                    <option value="Personalized Jewellery">Personalized Jewellery</option>
                    <option value="Names on Gifts">Names on Gifts</option>
                    <option value="Customize Your Caricature or Miniature">Customize Your Caricature or Miniature</option>
                    <option value="Personalize Your Bouquets">Personalize Your Bouquets</option>
                    <option value="Special Hampers">Special Hampers</option>
                    <option value="Hair Accessories">Hair Accessories</option>
                    <option value="Paradise of Jewels">Paradise of Jewels</option>
                    <option value="__custom__">+ Add Custom Category...</option>
                  </select>
                  {formProductCategory === '__custom__' && (
                    <input
                      type="text"
                      required
                      value={formProductCustomCategory}
                      onChange={(e) => setFormProductCustomCategory(e.target.value)}
                      placeholder="Type new category name..."
                      className="w-full mt-1.5 bg-[#FAF7F2] dark:bg-stone-900 border border-[#881337] rounded-xl px-3 py-2 text-stone-900 dark:text-white text-xs font-semibold"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Promotional Badge</label>
                  <input
                    type="text"
                    value={formProductBadge}
                    onChange={(e) => setFormProductBadge(e.target.value)}
                    placeholder="e.g. Purely Gold Plated ✨💖, Best Seller, New Arrival"
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white outline-none focus:border-[#881337]"
                  />
                </div>
              </div>

              {/* Price & MRP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF7F2] dark:bg-stone-900/50 p-3.5 rounded-2xl border border-[#EFE7DE] dark:border-stone-800">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                    <span>Selling Price (₹) *</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Customer pays this</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formProductPrice}
                    onChange={(e) => setFormProductPrice(Number(e.target.value))}
                    className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono font-bold text-stone-900 dark:text-white text-sm outline-none focus:border-[#881337]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                    <span>Original MRP (₹) *</span>
                    {formProductMrp > formProductPrice && (
                      <span className="text-[10px] font-bold text-[#881337] dark:text-[#FB7185]">
                        {Math.round(((formProductMrp - formProductPrice) / formProductMrp) * 100)}% Discount
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formProductMrp}
                    onChange={(e) => setFormProductMrp(Number(e.target.value))}
                    className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono text-stone-900 dark:text-white text-sm outline-none focus:border-[#881337]"
                  />
                </div>
              </div>

              {/* Product Images Upload & Management */}
              <div className="space-y-2 bg-[#FFFDF8] dark:bg-[#1E191E] p-4 rounded-2xl border-2 border-dashed border-[#E8DDD5] dark:border-[#382E36]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#881337] dark:text-[#FB7185]" />
                    <span>Product Images & Photos</span>
                  </label>
                  <span className="text-[10px] text-stone-500">
                    {formProductImages.length} image{formProductImages.length === 1 ? '' : 's'} attached
                  </span>
                </div>

                {/* Upload Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <label className="px-4 py-2.5 rounded-xl bg-[#881337] hover:bg-[#700f2d] text-white text-xs font-bold cursor-pointer text-center flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>📁 Upload from Computer / Phone</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileUpload}
                    />
                  </label>

                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={formImageUrlInput}
                      onChange={(e) => setFormImageUrlInput(e.target.value)}
                      placeholder="Or paste web image link (URL / path)..."
                      className="flex-1 bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold shrink-0 text-xs"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Attached Images Grid */}
                {formProductImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    {formProductImages.map((imgSrc, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="relative group rounded-xl overflow-hidden border border-[#EFE7DE] dark:border-stone-700 bg-stone-100 dark:bg-stone-900 aspect-square"
                      >
                        <img
                          src={imgSrc}
                          alt={`Product photo ${imgIdx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {imgIdx === 0 ? (
                          <span className="absolute top-1.5 left-1.5 bg-[#881337] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                            ★ Cover Photo
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMakePrimaryImage(imgIdx)}
                            className="absolute top-1.5 left-1.5 bg-black/70 hover:bg-[#881337] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(imgIdx)}
                          className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full opacity-90 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Remove Photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-stone-400 text-xs bg-[#FAF7F2] dark:bg-stone-900/40 rounded-xl border border-dashed border-[#EFE7DE] dark:border-stone-800">
                    No custom images added yet. Click &ldquo;Upload from Computer / Phone&rdquo; above to add your photos.
                  </div>
                )}
              </div>

              {/* Description & Story */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Product Description & Note *
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setFormProductDesc(
                          'Jewellery made personal, for moments that mean everything.\nPurely gold plated.✨💖'
                        )
                      }
                      className="text-[10px] text-[#881337] dark:text-[#FB7185] hover:underline font-semibold"
                    >
                      Use Standard Signature Note
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  required
                  value={formProductDesc}
                  onChange={(e) => setFormProductDesc(e.target.value)}
                  placeholder="Enter detailed description, styling ideas, materials, and occasion suggestions..."
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white outline-none focus:border-[#881337]"
                />
              </div>

              {/* Specifications / Highlights */}
              <div className="space-y-2">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Key Specifications & Features
                </label>
                <div className="space-y-1.5">
                  {formFeatures.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <span className="text-stone-400 text-xs">✦</span>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormFeatures((prev) =>
                            prev.map((item, idx) => (idx === fIdx ? val : item))
                          );
                        }}
                        className="flex-1 bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(fIdx)}
                        className="text-stone-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="Add another highlight (e.g. Hypoallergenic, Water Resistant)..."
                      className="flex-1 bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-300"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Personalization Options */}
              <div className="space-y-2 pt-2 border-t border-[#EFE7DE] dark:border-[#282127]">
                <label className="font-bold text-stone-700 dark:text-stone-300 block">
                  Customer Personalization Controls
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#EFE7DE] dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-900/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formAllowsText}
                      onChange={(e) => setFormAllowsText(e.target.checked)}
                      className="rounded text-[#881337] focus:ring-[#881337]"
                    />
                    <div>
                      <span className="font-bold text-stone-800 dark:text-stone-200 block">
                        Custom Text / Laser Engraving
                      </span>
                      <span className="text-[10px] text-stone-500">Allows name/initials input</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#EFE7DE] dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-900/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formAllowsGiftMessage}
                      onChange={(e) => setFormAllowsGiftMessage(e.target.checked)}
                      className="rounded text-[#881337] focus:ring-[#881337]"
                    />
                    <div>
                      <span className="font-bold text-stone-800 dark:text-stone-200 block">
                        Complimentary Gift Card Message
                      </span>
                      <span className="text-[10px] text-stone-500">Include wax-sealed note</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFE7DE] dark:border-[#282127] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{editingProduct ? 'Save & Publish Changes' : 'Create Product & Publish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD NEW COUPON */}
      {/* ============================================================ */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181418] w-full max-w-md rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DE] dark:border-[#282127]">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                Create Offer Coupon
              </h3>
              <button
                onClick={() => setIsAddCouponOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">Promo Code *</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE20"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono uppercase text-stone-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white font-semibold"
                  >
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono text-stone-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFE7DE] dark:border-[#282127]">
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-colors shadow-sm"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: INVOICE PRINT VIEW */}
      {/* ============================================================ */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181418] w-full max-w-xl rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DE] dark:border-[#282127]">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-stone-900 dark:text-white">
                <Printer className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" />
                <span>Tax Invoice #{selectedOrderForInvoice.id}</span>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-800 dark:text-stone-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-sans text-xl font-extrabold text-[#FF2E93]">Gadgets Destiny</h4>
                  <p className="text-stone-500 font-bold text-[10px] uppercase tracking-wider">Cute Covers Club</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-stone-500">{new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}</p>
                  <p className="font-bold text-emerald-600">{selectedOrderForInvoice.paymentStatus}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800">
                <p className="font-bold uppercase tracking-wider text-[10px] text-[#881337] dark:text-[#FB7185] mb-1">
                  Billed To
                </p>
                <p className="font-bold">{selectedOrderForInvoice.customer.fullName}</p>
                <p className="text-stone-500">{selectedOrderForInvoice.customer.streetAddress}, {selectedOrderForInvoice.customer.city}</p>
                <p className="text-stone-500">Phone: {selectedOrderForInvoice.customer.phone}</p>
              </div>

              <div className="space-y-2 border-t border-[#EFE7DE] dark:border-stone-800 pt-3">
                {selectedOrderForInvoice.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-mono font-bold tabular-nums">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#EFE7DE] dark:border-stone-800 pt-3 flex justify-between font-serif font-bold text-sm text-stone-900 dark:text-white">
                <span>Total Amount Paid</span>
                <span className="tabular-nums">₹{selectedOrderForInvoice.totalAmount}</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-colors"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
