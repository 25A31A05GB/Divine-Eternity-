import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { PhoneCaseMockup } from '../utils/productVisuals';
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

  // Product modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Product['category']>('Personalized Name Jewelry');
  const [newProductPrice, setNewProductPrice] = useState(849);
  const [newProductMrp, setNewProductMrp] = useState(1899);
  const [newProductPattern, setNewProductPattern] = useState<Product['designPattern']>('jewelry_necklace');
  const [newProductTheme, setNewProductTheme] = useState('#FAF4EC');
  const [newProductSecondary, setNewProductSecondary] = useState('#881337');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductBadge, setNewProductBadge] = useState('Atelier Special');

  // Coupon state
  const [coupons, setCoupons] = useState<Coupon[]>(AVAILABLE_COUPONS);
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

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd: Product = {
      id: `custom-prod-${Date.now()}`,
      slug: newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newProductName.trim(),
      category: newProductCategory,
      price: Number(newProductPrice),
      mrp: Number(newProductMrp),
      rating: 5.0,
      reviewCount: 1,
      description: newProductDesc || 'Handcrafted bespoke gift made with fine craftsmanship and custom engraving.',
      features: ['18k Vermeil Laser Plating', 'Custom Engraving Included', 'Archival Box Packaging'],
      images: ['case_front', 'case_angle'],
      badge: newProductBadge || 'New Arrival',
      isBestSeller: true,
      isNew: true,
      themeColor: newProductTheme,
      secondaryColor: newProductSecondary,
      designPattern: newProductPattern,
      allowsPersonalization: true,
      supportedBrands: ['Apple', 'Samsung', 'OnePlus', 'Google'],
      personalizationConfig: {
        allowsText: true,
        textLabel: 'Custom Name / Monogram',
        textPlaceholder: 'e.g. Aurelia, Sophia, 14.02',
        textMaxLength: 16,
        allowsGiftMessage: true,
      },
    };

    onAddProduct(newProd);
    setIsAddProductOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
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
        title="Secret Executive Admin Suite & Media CMS"
        description="Confidential store control panel for live catalog, order operations, and hero video management."
        noindex={true}
      />

      {/* Top Luxury Executive Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#151215]/95 backdrop-blur-md border-b border-[#EFE7DE] dark:border-[#282127] px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#881337] flex items-center justify-center text-white shadow-md font-serif text-lg font-bold shrink-0">
              DE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-tight text-[#1C1917] dark:text-white">
                  Divine's Eternity
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#881337]/10 text-[#881337] dark:text-[#FB7185] border border-[#881337]/20 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" /> Secret Executive Suite
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Authorized Session · Director: <strong className="text-stone-900 dark:text-white">{user?.name || 'Master Admin'}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Active Role Switcher */}
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('director');
                  setActiveTab('media-cms');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  currentRole === 'director'
                    ? 'bg-[#881337] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Media Director</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentRole('superadmin');
                  setActiveTab('overview');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  currentRole === 'superadmin'
                    ? 'bg-[#881337] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentRole('orders');
                  setActiveTab('orders');
                }}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  currentRole === 'orders'
                    ? 'bg-[#881337] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Fulfillment</span>
              </button>
            </div>

            <button
              onClick={onReturnToStore}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-[#881337] dark:text-[#FB7185]" />
              Return to Store
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#EFE7DE] dark:border-[#282127] no-scrollbar">
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
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917] shadow-sm'
                    : 'bg-white dark:bg-[#181417] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 border border-[#EFE7DE] dark:border-[#2D252A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A059]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-black/10 dark:text-black'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" /> Product Catalog Studio
                </h3>
                <p className="text-xs text-stone-500">
                  Manage live prices, custom engraving fields, stock status, and product listings
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add New Keepsake
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] dark:bg-[#1C181C] text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-[#EFE7DE] dark:border-[#2C242A]">
                      <th className="py-3.5 px-4">Item & Category</th>
                      <th className="py-3.5 px-4">Price & MRP</th>
                      <th className="py-3.5 px-4">Rating & Proof</th>
                      <th className="py-3.5 px-4">Custom Engraving</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DE] dark:divide-[#282127]">
                    {products.map((p, idx) => (
                      <tr
                        key={p.id}
                        className={`hover:bg-[#FAF7F2] dark:hover:bg-stone-900/60 transition-colors ${
                          idx % 2 === 0 ? 'bg-white dark:bg-[#181418]' : 'bg-[#FAF7F2]/40 dark:bg-stone-950/30'
                        }`}
                      >
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-sm text-stone-900 dark:text-white">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-[#881337] dark:text-[#FB7185] font-semibold mt-0.5">
                            {p.category}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-sm text-stone-900 dark:text-white tabular-nums">
                            ₹{p.price}
                          </div>
                          <div className="text-[10px] text-stone-400 line-through tabular-nums">
                            ₹{p.mrp}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="flex items-center gap-1 font-bold text-stone-800 dark:text-stone-200">
                            <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                            <span>{p.rating}</span>
                            <span className="text-stone-400 font-normal">({p.reviewCount} reviews)</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
                            <Check className="w-3 h-3" /> Laser Enabled
                          </span>
                        </td>

                        <td className="py-4 px-4 align-top text-right">
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
      {/* MODAL: ADD NEW PRODUCT */}
      {/* ============================================================ */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181418] w-full max-w-xl rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DE] dark:border-[#282127]">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                Add New Personalized Keepsake
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. 18k Rose Gold Handwriting Script Locket"
                  className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Category *</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white font-semibold"
                  >
                    <option value="Personalized Name Jewelry">Personalized Name Jewelry</option>
                    <option value="Preserved Eternal Roses & Dome Displays">Preserved Eternal Roses & Dome Displays</option>
                    <option value="Custom Acrylic Song Plaques & Photo Frames">Custom Acrylic Song Plaques & Photo Frames</option>
                    <option value="Memory Photo Lamps & Crystal Cubes">Memory Photo Lamps & Crystal Cubes</option>
                    <option value="Engraved Wooden Gift Boxes & Keepsakes">Engraved Wooden Gift Boxes & Keepsakes</option>
                    <option value="Romantic Couple Hampers & Scented Candle Sets">Romantic Couple Hampers & Scented Candle Sets</option>
                    <option value="Personalized Phone Cases & Pocket Accessories">Personalized Phone Cases & Pocket Accessories</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Promotional Badge</label>
                  <input
                    type="text"
                    value={newProductBadge}
                    onChange={(e) => setNewProductBadge(e.target.value)}
                    placeholder="e.g. Atelier Edition, Best Seller"
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono text-stone-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">MRP / List Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductMrp}
                    onChange={(e) => setNewProductMrp(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFE7DE] dark:border-[#282127]">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-[#881337] text-white hover:bg-[#700f2d] transition-colors shadow-sm"
                >
                  Create Product
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
                  <h4 className="font-serif text-xl font-bold text-[#881337] dark:text-[#FB7185]">Divine's Eternity</h4>
                  <p className="text-stone-500">Luxury Personalized Keepsakes</p>
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
