import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';
import { Product, Order, Coupon, OrderStatus, PhoneBrand, CreatorApplication, Campaign } from '../types';
import { AVAILABLE_COUPONS } from '../context/CartContext';
import { INITIAL_CREATOR_APPLICATIONS, INITIAL_CAMPAIGNS } from '../data/campaigns';
import { SEO } from '../components/common/SEO';
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
} from 'lucide-react';
import { PhoneCaseMockup } from '../utils/productVisuals';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onReturnToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onReturnToStore,
}) => {
  const { user, isAdmin, orders, updateOrderStatus } = useAuth();
  const { reviews, toggleVerifiedBadge, deleteReview } = useReviews();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'reviews' | 'customers' | 'affiliates'>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [productViewMode, setProductViewMode] = useState<'table' | 'grid'>('table');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

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
  const [selectedAppForPrModal, setSelectedAppForPrModal] = useState<CreatorApplication | null>(null);

  const handleApproveApplication = (appId: string) => {
    setCreatorApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          // Auto-generate affiliate coupon in coupon engine
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
  const [newProductCategory, setNewProductCategory] = useState<Product['category']>('Bracelet Phone Case');
  const [newProductPrice, setNewProductPrice] = useState(649);
  const [newProductMrp, setNewProductMrp] = useState(1499);
  const [newProductPattern, setNewProductPattern] = useState<Product['designPattern']>('pearl_bracelet');
  const [newProductTheme, setNewProductTheme] = useState('#FFE5EC');
  const [newProductSecondary, setNewProductSecondary] = useState('#F0508C');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductBadge, setNewProductBadge] = useState('Best Seller');

  // Coupon state
  const [coupons, setCoupons] = useState<Coupon[]>(AVAILABLE_COUPONS);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState(150);
  const [newCouponType, setNewCouponType] = useState<'flat' | 'percentage'>('flat');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(800);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Selected time period
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'all'>('7days');

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const pendingOrders = orders.filter((o) => o.status === 'Placed' || o.status === 'Packed').length;

  // Flatten all reviews for moderation
  const allReviewsList = useMemo(() => {
    return Object.entries(reviews).flatMap(([prodId, revList]) => {
      const prod = products.find((p) => p.id === prodId);
      return revList.map((r) => ({
        ...r,
        productId: prodId,
        productName: prod?.name || 'Custom Case / Keepsake',
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

  // Unique customers list
  const customersList = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; totalSpent: number; ordersCount: number; lastOrderDate: string }>();
    orders.forEach((o) => {
      const key = o.customer.email || o.customer.phone;
      const existing = map.get(key);
      if (existing) {
        existing.totalSpent += o.totalAmount;
        existing.ordersCount += 1;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
        }
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
      id: `prod-${Date.now()}`,
      slug: newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newProductName,
      category: newProductCategory,
      price: Number(newProductPrice),
      mrp: Number(newProductMrp),
      rating: 5.0,
      reviewCount: 1,
      description: newProductDesc || 'Handcrafted luxury case designed with premium materials, shock-absorbing perimeter, and elegant accents.',
      features: [
        'Premium impact resistance with scratch-proof back',
        'Precision camera bumper & raised screen lip',
        'Wireless charging compatible & soft velvet interior',
        'Complimentary luxury gift box packaging',
      ],
      images: ['case_front', 'case_angle', 'case_flat'],
      badge: newProductBadge || 'New Arrival',
      isBestSeller: true,
      isNew: true,
      themeColor: newProductTheme,
      secondaryColor: newProductSecondary,
      designPattern: newProductPattern,
      allowsPersonalization: true,
      supportedBrands: ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Vivo', 'Oppo', 'Realme'],
      personalizationConfig: {
        allowsText: true,
        textLabel: 'Custom Name / Monogram',
        textPlaceholder: 'e.g. Divine, Olivia, Love',
        textMaxLength: 14,
        allowsGiftMessage: true,
      },
      variantsStock: {
        'Soft Silicone & TPU': true,
        'Impact Hard Glossy': true,
        'Luxury Leather Wallet': true,
        'Metallic Chrome Mirror': true,
        '18k Gold Plated Chain': true,
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
    setNewCouponDesc('');
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  // Helper for Status Badges with real-time pulsing beacon
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
            <span>In Transit / Shipped</span>
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
    <div className="min-h-screen bg-[#FDF8F5] dark:bg-[#0D0B0D] text-[#231F20] dark:text-[#F8F5F2]">
      <SEO
        title="Store Operations & Analytics Suite"
        description="Divine's Eternity Executive Admin Control Panel for live inventory, orders, discount coupons, and influencer partner management."
        noindex={true}
      />
      {/* Top Luxury Executive Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#151215]/95 backdrop-blur-md border-b border-[#F0E5DF] dark:border-[#262024] px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F0508C] to-[#FFD94A] flex items-center justify-center text-white shadow-md shadow-[#F0508C]/20 font-serif text-lg font-bold">
              DE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-tight text-[#231F20] dark:text-white">
                  Divine's Eternity
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#F0508C]/10 text-[#F0508C] border border-[#F0508C]/20 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" /> Executive Suite
                </span>
              </div>
              <p className="text-xs text-[#7A7276] dark:text-[#A39CA0]">
                Logged in as <strong className="text-[#231F20] dark:text-white">{user?.name || 'Store Director'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToStore}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#FFF8F4] dark:bg-[#1E191C] hover:bg-[#FCECEF] dark:hover:bg-[#2A2327] text-[#231F20] dark:text-[#F8F5F2] border border-[#E8D8D0] dark:border-[#382F34] transition-all shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-[#F0508C]" />
              Return to Storefront
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live & Synced
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#EEDFD8] dark:border-[#262024] scrollbar-none">
          {[
            { id: 'overview', label: 'Executive Overview', icon: BarChart3, count: null },
            { id: 'orders', label: 'Orders & Dispatch Pipeline', icon: ShoppingBag, count: orders.length },
            { id: 'products', label: 'Catalog Studio', icon: Package, count: products.length },
            { id: 'coupons', label: 'Offers & Coupons', icon: Tag, count: coupons.length },
            { id: 'reviews', label: 'Reviews & Social Proof', icon: Star, count: allReviewsList.length },
            { id: 'customers', label: 'Customer Directory', icon: Users, count: customersList.length },
            { id: 'affiliates', label: 'Affiliates & Creator Collabs', icon: Video, count: creatorApplications.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#231F20] text-white dark:bg-white dark:text-[#231F20] shadow-md'
                    : 'bg-white dark:bg-[#181417] text-[#6E646A] dark:text-[#9F969C] hover:bg-[#FBECEF] dark:hover:bg-[#241E22] border border-[#EFE4DE] dark:border-[#2D252A]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? (activeTab === tab.id ? 'text-[#FFD94A] dark:text-[#F0508C]' : '') : 'text-[#7A7276]'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-black/10 dark:text-black'
                        : 'bg-[#F2E6E0] dark:bg-[#2A2328] text-[#554C52] dark:text-[#C7BDC2]'
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
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Revenue */}
              <div className="bg-white dark:bg-[#161215] p-6 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm relative overflow-hidden group hover:border-[#F0508C]/40 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F0508C]/10 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A7276] dark:text-[#A8A0A5] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#F0508C]" /> Total Gross Revenue
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#F0508C]/10 flex items-center justify-center text-[#F0508C]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif text-3xl font-black text-[#231F20] dark:text-white">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +28.4%
                  </span>
                </div>
                <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                  Across {totalOrdersCount} lifetime fulfilled orders
                </p>
              </div>

              {/* Orders */}
              <div className="bg-white dark:bg-[#161215] p-6 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm relative overflow-hidden group hover:border-[#FFD94A]/60 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFD94A]/15 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A7276] dark:text-[#A8A0A5] flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#FFD94A]" /> Total Orders
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FFD94A]/20 flex items-center justify-center text-[#996500] dark:text-[#FFD94A]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif text-3xl font-black text-[#231F20] dark:text-white">
                    {totalOrdersCount}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
                  </span>
                </div>
                <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                  {pendingOrders} awaiting fulfillment / dispatch
                </p>
              </div>

              {/* AOV */}
              <div className="bg-white dark:bg-[#161215] p-6 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A7276] dark:text-[#A8A0A5] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-500" /> Avg Order Value
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif text-3xl font-black text-[#231F20] dark:text-white">
                    ₹{averageOrderValue.toLocaleString('en-IN')}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +8.1%
                  </span>
                </div>
                <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                  Lifted by "Buy 3 Pay 2" & bundle deals
                </p>
              </div>

              {/* CSAT */}
              <div className="bg-white dark:bg-[#161215] p-6 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A7276] dark:text-[#A8A0A5] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Rating
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Star className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif text-3xl font-black text-[#231F20] dark:text-white">
                    4.94 ★
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    99.4% CSAT
                  </span>
                </div>
                <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                  Based on {allReviewsList.length} verified buyer testimonials
                </p>
              </div>
            </div>

            {/* Sales Chart & Category Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Graph */}
              <div className="lg:col-span-2 bg-white dark:bg-[#161215] p-6 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#F0508C]" /> Sales & Revenue Trajectory
                    </h3>
                    <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                      Real-time revenue performance across peak gift campaigns
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#F5ECE6] dark:bg-[#201A1E] p-1 rounded-lg text-xs font-bold">
                    {(['7days', '30days', 'all'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setTimeRange(r)}
                        className={`px-3 py-1 rounded-md transition-all ${
                          timeRange === r
                            ? 'bg-white dark:bg-[#2E252B] text-[#231F20] dark:text-white shadow-xs'
                            : 'text-[#7A7276] dark:text-[#A8A0A5]'
                        }`}
                      >
                        {r === '7days' ? '7 Days' : r === '30days' ? '30 Days' : 'All-time'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Visual Chart */}
                <div className="h-60 w-full pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F0508C" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#F0508C" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="0" y1="40" x2="700" y2="40" stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeDasharray="4" />
                    <line x1="0" y1="90" x2="700" y2="90" stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeDasharray="4" />
                    <line x1="0" y1="140" x2="700" y2="140" stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeDasharray="4" />

                    {/* Area under curve */}
                    <path
                      d="M 0 170 Q 100 120, 200 135 T 400 70 T 550 90 T 700 30 L 700 190 L 0 190 Z"
                      fill="url(#revenueGrad)"
                    />

                    {/* Stroke line */}
                    <path
                      d="M 0 170 Q 100 120, 200 135 T 400 70 T 550 90 T 700 30"
                      fill="none"
                      stroke="#F0508C"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    {[
                      { x: 0, y: 170, val: '₹4.2k' },
                      { x: 100, y: 120, val: '₹8.9k' },
                      { x: 200, y: 135, val: '₹12.4k' },
                      { x: 400, y: 70, val: '₹28.5k' },
                      { x: 550, y: 90, val: '₹22.1k' },
                      { x: 700, y: 30, val: '₹46.8k' },
                    ].map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="#F0508C" strokeWidth="3" />
                        <text
                          x={pt.x}
                          y={pt.y - 12}
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="fill-[#231F20] dark:fill-white font-mono"
                        >
                          {pt.val}
                        </text>
                      </g>
                    ))}
                  </svg>
                  <div className="flex justify-between text-[11px] text-[#7A7276] dark:text-[#A8A0A5] pt-2 font-mono">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun (Today)</span>
                  </div>
                </div>
              </div>

              {/* Category Share Breakdown */}
              <div className="bg-white dark:bg-[#161215] p-6 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white mb-1 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#FFD94A]" /> Category Mix
                  </h3>
                  <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5] mb-6">
                    Contribution to aggregate order volume
                  </p>

                  <div className="space-y-4">
                    {[
                      { name: 'Bracelet Phone Cases', pct: 38, color: 'bg-[#F0508C]', count: '₹48,200' },
                      { name: 'Personalized Name Jewelry', pct: 26, color: 'bg-[#FFD94A]', count: '₹33,600' },
                      { name: 'Mirror & Chrome Cases', pct: 18, color: 'bg-purple-500', count: '₹22,900' },
                      { name: 'Preserved Roses & Domes', pct: 12, color: 'bg-rose-500', count: '₹15,400' },
                      { name: 'Zipper Wallet & Hampers', pct: 6, color: 'bg-sky-500', count: '₹7,800' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#231F20] dark:text-white">{item.name}</span>
                          <span className="text-[#7A7276] dark:text-[#A8A0A5]">{item.pct}% ({item.count})</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#F5ECE6] dark:bg-[#261E23] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EDE2DB] dark:border-[#2A2328] flex items-center justify-between text-xs">
                  <span className="text-[#7A7276] dark:text-[#A8A0A5]">Top Performer</span>
                  <span className="font-bold text-[#F0508C]">Pearl Bliss Bracelet Case ✦</span>
                </div>
              </div>
            </div>

            {/* Recent Orders Zebra-Striped Table */}
            <div className="bg-white dark:bg-[#161215] rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#EDE2DB] dark:border-[#2A2328] flex items-center justify-between bg-gradient-to-r from-white to-[#FFF8F4] dark:from-[#161215] dark:to-[#1B1519]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F0508C]/10 flex items-center justify-center text-[#F0508C]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white">
                      Live Dispatch & Order Telemetry
                    </h3>
                    <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                      Real-time zebra-striped transaction log with status beacons
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#F0508C] hover:underline flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F0508C]/10 hover:bg-[#F0508C]/20 transition-all"
                >
                  View All Orders <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF2EE] dark:bg-[#1C171A] text-[#7A7276] dark:text-[#A8A0A5] font-bold uppercase tracking-wider border-b border-[#EDE2DB] dark:border-[#2A2328]">
                      <th className="py-3.5 px-4 font-semibold">
                        <span className="inline-flex items-center gap-1.5"><Hash className="w-3.5 h-3.5 text-[#F0508C]" /> Order ID</span>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">
                        <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-purple-500" /> Customer</span>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">
                        <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" /> Customization</span>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">
                        <span className="inline-flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Gross</span>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">
                        <span className="inline-flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-sky-500" /> Real-time Status</span>
                      </th>
                      <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE2DB] dark:divide-[#2A2328]">
                    {orders.slice(0, 6).map((ord, idx) => (
                      <tr
                        key={ord.id}
                        className={`transition-colors hover:bg-[#FDF0F4] dark:hover:bg-[#221A20] ${
                          idx % 2 === 0
                            ? 'bg-white dark:bg-[#161215]'
                            : 'bg-[#FAF5F2]/80 dark:bg-[#1A1519]/70'
                        }`}
                      >
                        <td className="py-4 px-4 font-mono font-bold text-[#231F20] dark:text-white">
                          #{ord.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#231F20] dark:text-white flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400" /> {ord.customer.fullName}
                          </div>
                          <div className="text-[11px] text-[#7A7276] dark:text-[#A8A0A5] pl-5">{ord.customer.phone}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-[#231F20] dark:text-white line-clamp-1">
                            {ord.items.map((i) => i.name).join(', ')}
                          </div>
                          {ord.items.some((i) => i.customText) && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#F0508C] font-semibold bg-[#F0508C]/10 px-2 py-0.5 rounded-full mt-1">
                              <Sparkles className="w-3 h-3" /> Engraved: "{ord.items.find((i) => i.customText)?.customText}"
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-bold text-[#231F20] dark:text-white">
                          ₹{ord.totalAmount}
                        </td>
                        <td className="py-4 px-4">
                          {renderStatusBadge(ord.status)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#241E22] hover:bg-[#FCECEF] dark:hover:bg-[#32282F] text-[#231F20] dark:text-white font-bold border border-[#E8D8D0] dark:border-[#382F34] transition-all shadow-2xs"
                            title="Generate Invoice"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#F0508C]" />
                            Invoice
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
        {/* TAB 2: ORDERS & FULFILLMENT WITH ZEBRA STRIPING */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#161215] p-5 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-[#7A7276] mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#F0508C]" /> Filter:
                </span>
                {['All', 'Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      orderFilter === st
                        ? 'bg-[#F0508C] text-white shadow-xs'
                        : 'bg-[#FAF2EE] dark:bg-[#201A1E] text-[#6E646A] dark:text-[#9F969C] hover:bg-[#FCECEF]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7276]" />
                <input
                  type="text"
                  placeholder="Search by ID, customer name, phone, tracking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#FAF2EE] dark:bg-[#201A1E] border border-transparent focus:border-[#F0508C] focus:bg-white dark:focus:bg-black outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Orders Table with Professional Zebra Striping & Lucide Icons */}
            <div className="bg-white dark:bg-[#161215] rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF2EE] dark:bg-[#1C171A] text-[#7A7276] dark:text-[#A8A0A5] font-bold uppercase tracking-wider border-b border-[#EDE2DB] dark:border-[#2A2328]">
                      <th className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5"><Hash className="w-3.5 h-3.5 text-[#F0508C]" /> Order ID</span>
                      </th>
                      <th className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-purple-500" /> Customer & Address</span>
                      </th>
                      <th className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-[#FFD94A]" /> Custom Specs</span>
                      </th>
                      <th className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Payment & Total</span>
                      </th>
                      <th className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-sky-500" /> Courier AWB</span>
                      </th>
                      <th className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-pink-500" /> Live Status</span>
                      </th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE2DB] dark:divide-[#2A2328]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-[#7A7276]">
                          <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-2" />
                          <p className="font-bold text-sm">No matching orders found</p>
                          <p className="text-xs text-gray-400">Try changing your search keywords or filter status.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord, idx) => (
                        <tr
                          key={ord.id}
                          className={`transition-colors hover:bg-[#FDF0F4] dark:hover:bg-[#221A20] ${
                            idx % 2 === 0
                              ? 'bg-white dark:bg-[#161215]'
                              : 'bg-[#FAF5F2]/80 dark:bg-[#1A1519]/70'
                          }`}
                        >
                          <td className="py-4 px-4 align-top">
                            <div className="font-mono font-bold text-[#231F20] dark:text-white text-sm">
                              #{ord.id}
                            </div>
                            <div className="text-[11px] text-[#7A7276] mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                            <div className="mt-2.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Items: </span>
                              <span className="font-bold text-[#231F20] dark:text-white">{ord.items.reduce((sum, i) => sum + i.quantity, 0)} units</span>
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="font-bold text-[#231F20] dark:text-white text-sm flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-purple-500" />
                              {ord.customer.fullName}
                            </div>
                            <div className="text-[11px] text-[#7A7276] flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" /> {ord.customer.phone}
                            </div>
                            <div className="text-[11px] text-[#7A7276] flex items-start gap-1 line-clamp-2 mt-1.5">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#F0508C] mt-0.5" />
                              <span>{ord.customer.streetAddress}, {ord.customer.city} ({ord.customer.pincode})</span>
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="space-y-2">
                              {ord.items.map((item, i) => (
                                <div key={i} className="p-2 rounded-xl bg-white dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2C242A] text-[11px]">
                                  <div className="font-bold text-[#231F20] dark:text-white flex items-center justify-between">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span className="font-mono text-[#F0508C]">₹{item.price * item.quantity}</span>
                                  </div>
                                  {item.model && (
                                    <div className="text-[#7A7276] text-[10px] mt-0.5">📱 Model: {item.brand} {item.model}</div>
                                  )}
                                  {item.customText && (
                                    <div className="text-[#F0508C] font-semibold text-[10px] mt-0.5 flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-[#FFD94A]" /> Custom Name: "{item.customText}"
                                    </div>
                                  )}
                                  {item.giftMessage && (
                                    <div className="italic text-[#7A7276] text-[10px] mt-0.5">
                                      💌 "{item.giftMessage}"
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="font-black text-sm text-[#231F20] dark:text-white">
                              ₹{ord.totalAmount}
                            </div>
                            <div className="text-[11px] text-[#7A7276] flex items-center gap-1 mt-1">
                              {ord.paymentMethod.includes('UPI') ? (
                                <QrCode className="w-3.5 h-3.5 text-emerald-500" />
                              ) : ord.paymentMethod.includes('Card') ? (
                                <CreditCard className="w-3.5 h-3.5 text-purple-500" />
                              ) : (
                                <Banknote className="w-3.5 h-3.5 text-amber-500" />
                              )}
                              <span>{ord.paymentMethod}</span>
                            </div>
                            <div className="mt-2">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  ord.paymentStatus === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {ord.paymentStatus === 'Paid' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {ord.paymentStatus}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            {ord.trackingNumber ? (
                              <div className="space-y-1">
                                <div className="font-mono text-xs font-bold text-[#F0508C] flex items-center gap-1 bg-[#F0508C]/10 px-2 py-1 rounded-lg w-fit">
                                  <Truck className="w-3.5 h-3.5" /> {ord.trackingNumber}
                                </div>
                                <div className="text-[10px] text-gray-400">BlueDart / Delhivery</div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-[11px] italic flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Awaiting courier tag
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="space-y-2">
                              {renderStatusBadge(ord.status)}
                              <div>
                                <select
                                  value={ord.status}
                                  onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                                  className="w-full text-[11px] font-bold bg-white dark:bg-[#201A1E] border border-[#E8D8D0] dark:border-[#382F34] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#F0508C] text-[#231F20] dark:text-white shadow-2xs"
                                >
                                  <option value="Placed">Placed</option>
                                  <option value="Packed">Packed</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top text-right">
                            <button
                              onClick={() => setSelectedOrderForInvoice(ord)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#241E22] hover:bg-[#FCECEF] dark:hover:bg-[#32282F] text-[#231F20] dark:text-white font-bold border border-[#E8D8D0] dark:border-[#382F34] transition-all shadow-2xs"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#F0508C]" />
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: CATALOG STUDIO WITH TABLE & GRID VIEW TOGGLE */}
        {/* ============================================================ */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#161215] p-5 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#F0508C]" /> Product Inventory & Customizer Catalog
                </h3>
                <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                  Manage live prices, stock levels, variants, and launch new collections
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View Switcher */}
                <div className="flex items-center bg-[#FAF2EE] dark:bg-[#201A1E] p-1 rounded-xl border border-[#EDE2DB] dark:border-[#2A2328]">
                  <button
                    onClick={() => setProductViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      productViewMode === 'table'
                        ? 'bg-white dark:bg-[#2D252A] text-[#231F20] dark:text-white shadow-xs'
                        : 'text-[#7A7276] hover:text-[#231F20]'
                    }`}
                    title="Data Table View"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                  <button
                    onClick={() => setProductViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      productViewMode === 'grid'
                        ? 'bg-white dark:bg-[#2D252A] text-[#231F20] dark:text-white shadow-xs'
                        : 'text-[#7A7276] hover:text-[#231F20]'
                    }`}
                    title="Luxury Cards View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#F0508C] text-white hover:bg-[#D93D78] transition-all shadow-md shadow-[#F0508C]/20"
                >
                  <Plus className="w-4 h-4" />
                  Launch New Product
                </button>
              </div>
            </div>

            {/* Products Data Table View with Zebra Striping */}
            {productViewMode === 'table' ? (
              <div className="bg-white dark:bg-[#161215] rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF2EE] dark:bg-[#1C171A] text-[#7A7276] dark:text-[#A8A0A5] font-bold uppercase tracking-wider border-b border-[#EDE2DB] dark:border-[#2A2328]">
                        <th className="py-3.5 px-4 font-semibold">Product & Design Preview</th>
                        <th className="py-3.5 px-4 font-semibold">Category</th>
                        <th className="py-3.5 px-4 font-semibold">Selling Price & MRP</th>
                        <th className="py-3.5 px-4 font-semibold">Rating & Feedback</th>
                        <th className="py-3.5 px-4 font-semibold">Stock Status</th>
                        <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE2DB] dark:divide-[#2A2328]">
                      {products.map((p, idx) => (
                        <tr
                          key={p.id}
                          className={`transition-colors hover:bg-[#FDF0F4] dark:hover:bg-[#221A20] ${
                            idx % 2 === 0
                              ? 'bg-white dark:bg-[#161215]'
                              : 'bg-[#FAF5F2]/80 dark:bg-[#1A1519]/70'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-14 bg-[#FFF8F4] dark:bg-[#201A1E] rounded-xl flex items-center justify-center p-1 border border-[#EDE2DB] dark:border-[#2C242A] shrink-0">
                                <PhoneCaseMockup
                                  product={p}
                                  customText="DE"
                                  className="h-full w-auto drop-shadow-xs"
                                />
                              </div>
                              <div>
                                <div className="font-serif font-bold text-sm text-[#231F20] dark:text-white">
                                  {p.name}
                                </div>
                                <div className="text-[11px] text-[#7A7276] flex items-center gap-2 mt-0.5">
                                  <span className="font-mono">SKU: {p.slug}</span>
                                  {p.badge && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#F0508C]/15 text-[#F0508C]">
                                      {p.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#E8D8D0] dark:border-[#382F34] text-[#231F20] dark:text-white">
                              {p.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-baseline gap-2">
                              <span className="font-black text-sm text-[#231F20] dark:text-white">
                                ₹{p.price}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                ₹{p.mrp}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                                {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 text-xs font-bold text-[#231F20] dark:text-white">
                              <Star className="w-3.5 h-3.5 fill-[#FFD94A] text-[#FFD94A]" />
                              <span>{p.rating}</span>
                              <span className="text-gray-400 font-normal">({p.reviewCount} reviews)</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active in Stock
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white dark:bg-[#161215] rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] p-4 flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden"
                  >
                    <div>
                      {/* Mockup Preview */}
                      <div className="h-48 w-full bg-[#FFF8F4] dark:bg-[#201A1E] rounded-xl flex items-center justify-center p-3 relative overflow-hidden mb-3">
                        <PhoneCaseMockup
                          product={p}
                          customText="Eternity"
                          className="h-full w-auto drop-shadow-md"
                        />
                        {p.badge && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#231F20] text-white">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-bold text-[#F0508C] uppercase tracking-wider">
                        {p.category}
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#231F20] dark:text-white line-clamp-1 mt-0.5">
                        {p.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-base text-[#231F20] dark:text-white">
                          ₹{p.price}
                        </span>
                        <span className="text-xs text-[#7A7276] line-through">
                          ₹{p.mrp}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EDE2DB] dark:border-[#2A2328] flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 font-bold text-[#7A7276]">
                        <Star className="w-3.5 h-3.5 fill-[#FFD94A] text-[#FFD94A]" /> {p.rating} ({p.reviewCount})
                      </span>

                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: OFFERS & COUPONS */}
        {/* ============================================================ */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#161215] p-5 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#F0508C]" /> Discount Codes & Offer Engine
                </h3>
                <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                  Automate cart promotions, tiered discounts, and influencer coupon vouchers
                </p>
              </div>

              <button
                onClick={() => setIsAddCouponOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#F0508C] text-white hover:bg-[#D93D78] transition-all shadow-md shadow-[#F0508C]/20"
              >
                <Plus className="w-4 h-4" />
                Create Coupon Code
              </button>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="bg-white dark:bg-[#161215] rounded-2xl border-2 border-dashed border-[#F0508C]/40 p-5 relative overflow-hidden group hover:border-[#F0508C] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-black text-lg text-[#F0508C] tracking-wider px-3 py-1 bg-[#F0508C]/10 rounded-lg">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleDeleteCoupon(c.code)}
                      className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                      title="Remove Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs font-medium text-[#231F20] dark:text-white mb-2">
                    {c.description}
                  </p>

                  <div className="text-[11px] text-[#7A7276] space-y-1">
                    <div>
                      Discount:{' '}
                      <strong className="text-[#231F20] dark:text-white">
                        {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}
                      </strong>
                    </div>
                    {c.minOrderValue && (
                      <div>
                        Min Cart Value:{' '}
                        <strong className="text-[#231F20] dark:text-white">₹{c.minOrderValue}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: REVIEWS MODERATION */}
        {/* ============================================================ */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-[#161215] p-5 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FFD94A] fill-[#FFD94A]" /> Social Proof & Review Moderation
                </h3>
                <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                  Audit customer reviews, toggle Verified Buyer trust seals, and reply
                </p>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-black text-[#231F20] dark:text-white">
                  {allReviewsList.length}
                </span>
                <p className="text-xs text-[#7A7276]">Total Reviews</p>
              </div>
            </div>

            <div className="space-y-4">
              {allReviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-[#161215] rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-[#FFD94A]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-[#FFD94A]' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-xs text-[#231F20] dark:text-white">
                        {rev.title}
                      </span>
                    </div>

                    <p className="text-xs text-[#554C52] dark:text-[#D1C7CD] italic">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#7A7276]">
                      <span className="font-bold text-[#231F20] dark:text-white">{rev.author}</span>
                      <span>•</span>
                      <span>Product: <strong className="text-[#F0508C]">{rev.productName}</strong></span>
                      <span>•</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVerifiedBadge(rev.productId, rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        rev.verified
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {rev.verified ? 'Verified Buyer ✓' : 'Mark Verified'}
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
        {/* TAB 6: CUSTOMER DIRECTORY WITH ZEBRA STRIPING */}
        {/* ============================================================ */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-[#161215] p-5 rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" /> Customer Accounts & Lifetime Spend
                </h3>
                <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5]">
                  High-value buyers, repeated gift orders, and verified shipping contacts
                </p>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-black text-[#231F20] dark:text-white">
                  {customersList.length}
                </span>
                <p className="text-xs text-[#7A7276]">Active Profiles</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#161215] rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF2EE] dark:bg-[#1C171A] text-[#7A7276] dark:text-[#A8A0A5] font-bold uppercase tracking-wider border-b border-[#EDE2DB] dark:border-[#2A2328]">
                      <th className="py-3.5 px-4 font-semibold">
                        <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-purple-500" /> Customer Name</span>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">
                        <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-sky-500" /> Contact Details</span>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">
                        <span className="inline-flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5 text-[#FFD94A]" /> Orders Placed</span>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">
                        <span className="inline-flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Lifetime Gross Spend</span>
                      </th>
                      <th className="py-3.5 px-4 font-semibold">
                        <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Latest Activity</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE2DB] dark:divide-[#2A2328]">
                    {customersList.map((cust, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors hover:bg-[#FDF0F4] dark:hover:bg-[#221A20] ${
                          idx % 2 === 0
                            ? 'bg-white dark:bg-[#161215]'
                            : 'bg-[#FAF5F2]/80 dark:bg-[#1A1519]/70'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold text-[#231F20] dark:text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#F0508C]/15 text-[#F0508C] font-bold flex items-center justify-center text-[10px]">
                              {cust.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span>{cust.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-gray-600 dark:text-gray-300">{cust.email || 'No email provided'}</div>
                          <div className="text-[#7A7276] text-[11px]">{cust.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          <span className="px-2.5 py-1 rounded-full bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2C242A]">
                            {cust.ordersCount} {cust.ordersCount === 1 ? 'order' : 'orders'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#F0508C]">
                          ₹{cust.totalSpent.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-[#7A7276]">
                          {new Date(cust.lastOrderDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
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
        {/* TAB 7: AFFILIATES & CREATOR COLLABORATIONS */}
        {/* ============================================================ */}
        {activeTab === 'affiliates' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header & Stats */}
            <div className="bg-white dark:bg-[#161215] p-6 rounded-3xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#231F20] dark:text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#F0508C]" /> Influencer & Affiliate Partner Collective
                </h3>
                <p className="text-xs text-[#7A7276] dark:text-[#A8A0A5] mt-0.5">
                  Audit registration applications, issue follower promo codes, and manage brand campaigns
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right px-4 py-1.5 rounded-2xl bg-[#FFF8F4] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2C242A]">
                  <div className="text-[10px] uppercase font-bold text-[#7A7276]">Pending Review</div>
                  <div className="font-serif text-lg font-bold text-[#F0508C]">
                    {creatorApplications.filter((a) => a.status === 'Pending').length} Creators
                  </div>
                </div>
              </div>
            </div>

            {/* Applications Table with Zebra Striping & Badges */}
            <div className="bg-white dark:bg-[#161215] rounded-3xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#EDE2DB] dark:border-[#2A2328] flex items-center justify-between bg-gradient-to-r from-white to-[#FFF8F4] dark:from-[#161215] dark:to-[#1B1519]">
                <h4 className="font-serif font-bold text-base text-[#231F20] dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#F0508C]" /> Creator Club Registration Applications
                </h4>
                <span className="text-xs font-mono text-gray-400">
                  {creatorApplications.length} total submissions
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF2EE] dark:bg-[#1C171A] text-[#7A7276] dark:text-[#A8A0A5] font-bold uppercase tracking-wider border-b border-[#EDE2DB] dark:border-[#2A2328]">
                      <th className="py-3.5 px-4">Creator / Handles</th>
                      <th className="py-3.5 px-4">Audience & Niche</th>
                      <th className="py-3.5 px-4">Follower Promo Code</th>
                      <th className="py-3.5 px-4">PR Package Address</th>
                      <th className="py-3.5 px-4">Application Status</th>
                      <th className="py-3.5 px-4 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE2DB] dark:divide-[#2A2328]">
                    {creatorApplications.map((app, idx) => (
                      <tr
                        key={app.id}
                        className={`transition-colors hover:bg-[#FDF0F4] dark:hover:bg-[#221A20] ${
                          idx % 2 === 0
                            ? 'bg-white dark:bg-[#161215]'
                            : 'bg-[#FAF5F2]/80 dark:bg-[#1A1519]/70'
                        }`}
                      >
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-sm text-[#231F20] dark:text-white">
                            {app.fullName}
                          </div>
                          <div className="text-[#F0508C] font-semibold text-[11px] flex items-center gap-1 mt-0.5">
                            <Instagram className="w-3 h-3" /> {app.instagramHandle || app.tiktokHandle || 'Creator'}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{app.email}</div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            {app.followerCount}
                          </span>
                          <div className="text-[#7A7276] text-[11px] mt-1 line-clamp-1">
                            {app.primaryNiche}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="font-mono font-black text-xs text-[#F0508C] bg-[#F0508C]/10 px-2.5 py-1 rounded-lg w-fit">
                            {app.proposedCode}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">15% commission tier</div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="text-[11px] text-[#231F20] dark:text-white line-clamp-2">
                            {app.prShippingAddress}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {app.city}, {app.pincode}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              app.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : app.status === 'Declined'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                app.status === 'Approved'
                                  ? 'bg-emerald-500 animate-pulse'
                                  : app.status === 'Declined'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500 animate-pulse'
                              }`}
                            />
                            {app.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {app.status !== 'Approved' && (
                              <button
                                onClick={() => handleApproveApplication(app.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
                                title="Approve & Generate Code"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                            )}
                            {app.status !== 'Declined' && (
                              <button
                                onClick={() => handleDeclineApplication(app.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-rose-700 dark:bg-gray-800 dark:text-gray-300 transition-all"
                                title="Decline Application"
                              >
                                <X className="w-3.5 h-3.5" /> Decline
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

            {/* Active Campaigns Management */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-lg text-[#231F20] dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#FFD94A]" /> Active Creator Campaigns & Briefs
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="bg-white dark:bg-[#161215] rounded-3xl border border-[#EDE2DB] dark:border-[#2A2328] p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase text-[#F0508C] bg-[#F0508C]/10 px-2 py-0.5 rounded-md">
                          {camp.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          ₹{camp.payoutPerReel} / Reel
                        </span>
                      </div>

                      <h5 className="font-serif font-bold text-sm text-[#231F20] dark:text-white mb-1">
                        {camp.title}
                      </h5>

                      <p className="text-xs text-[#7A7276] line-clamp-2 mb-3">
                        {camp.description}
                      </p>

                      <div className="text-[11px] text-[#7A7276] space-y-1 mb-4">
                        <div>Period: <strong>{camp.startDate} - {camp.endDate}</strong></div>
                        <div>Slots Filled: <strong>{camp.slotsFilled} / {camp.slotsAvailable}</strong></div>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F0508C] rounded-full"
                        style={{ width: `${(camp.slotsFilled / camp.slotsAvailable) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: TAX INVOICE GENERATOR */}
      {/* ============================================================ */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151215] w-full max-w-2xl rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-[#EDE2DB] dark:border-[#2A2328] flex items-center justify-between bg-[#FAF2EE] dark:bg-[#1E191D]">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#F0508C]" />
                <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white">
                  Tax Invoice #{selectedOrderForInvoice.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 text-xs text-[#231F20] dark:text-white">
              {/* Invoice Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#F0508C]">Divine's Eternity</h2>
                  <p className="text-gray-500">Luxury Phone Cases & Keepsakes</p>
                  <p className="text-gray-500">GSTIN: 27AABCB2207Q1Z8</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Invoice Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-500">Payment: {selectedOrderForInvoice.paymentMethod} ({selectedOrderForInvoice.paymentStatus})</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="p-4 rounded-xl bg-[#FFF8F4] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328]">
                <p className="font-bold text-[#F0508C] uppercase tracking-wider text-[10px] mb-1">Billed & Shipped To</p>
                <p className="font-bold text-sm">{selectedOrderForInvoice.customer.fullName}</p>
                <p className="text-gray-600 dark:text-gray-300">{selectedOrderForInvoice.customer.streetAddress}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedOrderForInvoice.customer.city}, {selectedOrderForInvoice.customer.state} - {selectedOrderForInvoice.customer.pincode}
                </p>
                <p className="text-gray-600 dark:text-gray-300">Phone: {selectedOrderForInvoice.customer.phone}</p>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#EDE2DB] dark:border-[#2A2328] text-gray-500 text-[11px] font-bold">
                    <th className="py-2 text-left">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE2DB] dark:divide-[#2A2328]">
                  {selectedOrderForInvoice.items.map((item, idx) => (
                    <tr key={idx} className="py-2">
                      <td className="py-2.5">
                        <p className="font-bold">{item.name}</p>
                        {item.customText && <p className="text-[10px] text-[#F0508C]">Engraving: "{item.customText}"</p>}
                        {item.model && <p className="text-[10px] text-gray-500">Model: {item.brand} {item.model}</p>}
                      </td>
                      <td className="py-2.5 text-center">{item.quantity}</td>
                      <td className="py-2.5 text-right">₹{item.price}</td>
                      <td className="py-2.5 text-right font-bold">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="border-t border-[#EDE2DB] dark:border-[#2A2328] pt-4 flex justify-end">
                <div className="w-48 space-y-1.5 text-right">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrderForInvoice.subtotal}</span>
                  </div>
                  {selectedOrderForInvoice.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount:</span>
                      <span>-₹{selectedOrderForInvoice.discountTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg font-bold border-t border-[#EDE2DB] dark:border-[#2A2328] pt-2 text-[#231F20] dark:text-white">
                    <span>Total:</span>
                    <span className="text-[#F0508C]">₹{selectedOrderForInvoice.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF2EE] dark:bg-[#1E191D] border-t border-[#EDE2DB] dark:border-[#2A2328] flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-[#F0508C] text-white hover:bg-[#D93D78] transition-all"
              >
                <Printer className="w-4 h-4" /> Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD NEW PRODUCT */}
      {/* ============================================================ */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#151215] w-full max-w-xl rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-2xl p-6 animate-scaleIn my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE2DB] dark:border-[#2A2328] mb-5">
              <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white">
                Launch New Product / Case
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celestial Pearl Mirror Case"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                    Category *
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                  >
                    <option value="Bracelet Phone Case">Bracelet Phone Case</option>
                    <option value="Zipper Wallet Case">Zipper Wallet Case</option>
                    <option value="Mirror Phone Case">Mirror Phone Case</option>
                    <option value="Clear Designer Case">Clear Designer Case</option>
                    <option value="Toy Cases">Toy Cases</option>
                    <option value="Personalized Name Jewelry">Personalized Name Jewelry</option>
                    <option value="Preserved Eternal Roses & Dome Displays">Preserved Eternal Roses</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller, Trending"
                    value={newProductBadge}
                    onChange={(e) => setNewProductBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                    MRP Strikethrough (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductMrp}
                    onChange={(e) => setNewProductMrp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the luxury details, materials, and gift packaging..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                />
              </div>

              <div className="pt-4 border-t border-[#EDE2DB] dark:border-[#2A2328] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-5 py-2.5 rounded-full font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full font-bold bg-[#F0508C] text-white hover:bg-[#D93D78] shadow-md"
                >
                  Publish Product
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
          <div className="bg-white dark:bg-[#151215] w-full max-w-md rounded-2xl border border-[#EDE2DB] dark:border-[#2A2328] shadow-2xl p-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE2DB] dark:border-[#2A2328] mb-5">
              <h3 className="font-serif font-bold text-lg text-[#231F20] dark:text-white">
                Create Promo Voucher
              </h3>
              <button
                onClick={() => setIsAddCouponOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE200"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl font-mono uppercase bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                  >
                    <option value="flat">Flat Cash Discount (₹)</option>
                    <option value="percentage">Percentage Off (%)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#231F20] dark:text-white block mb-1">
                  Minimum Cart Value (₹)
                </label>
                <input
                  type="number"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF2EE] dark:bg-[#201A1E] border border-[#EDE2DB] dark:border-[#2A2328] outline-none focus:border-[#F0508C]"
                />
              </div>

              <div className="pt-4 border-t border-[#EDE2DB] dark:border-[#2A2328] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(false)}
                  className="px-5 py-2.5 rounded-full font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full font-bold bg-[#F0508C] text-white hover:bg-[#D93D78] shadow-md"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
