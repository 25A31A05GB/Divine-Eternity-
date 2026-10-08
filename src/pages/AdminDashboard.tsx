import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';
import { useMediaCMS } from '../context/MediaCMSContext';
import { Product, Order, Coupon, OrderStatus, PhoneBrand, CreatorApplication, Campaign, HeroSlideCMS, VideoReelCMS, AdminRole, GiftCategory } from '../types';
import { AVAILABLE_COUPONS } from '../context/CartContext';
import { INITIAL_CREATOR_APPLICATIONS, INITIAL_CAMPAIGNS } from '../data/campaigns';
import { db } from '../lib/db';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SEO } from '../components/common/SEO';
import { MediaStudioCMS } from '../components/admin/MediaStudioCMS';
import { ProductionQueue } from '../components/admin/ProductionQueue';
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
  Square,
  CheckCheck,
  SlidersHorizontal,
  XCircle,
  Activity,
  Zap,
  Video,
  Instagram,
  Briefcase,
  Play,
  Film,
  Image as ImageIcon,
  ImagePlus,
  Clipboard,
  Sliders,
  Menu,
} from 'lucide-react';
import { PhoneCaseMockup } from '../utils/productVisuals';
import { exportOrdersToCSV, exportProductsToCSV, exportCustomersToCSV } from '../utils/exportUtils';
import { InvoiceModal } from '../components/common/InvoiceModal';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onBulkUpdateProducts?: (products: Product[]) => void;
  onDeleteProduct: (productId: string) => void;
  onReturnToStore: () => void;
  initialRole?: AdminRole;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onBulkUpdateProducts,
  onDeleteProduct,
  onReturnToStore,
  initialRole = 'director',
}) => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    setIsLoadingOrders(true);
    db.getOrders().then(({ data }) => {
      if (data) setOrders(data);
      setIsLoadingOrders(false);
    });
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    const res = await db.updateOrderStatus(orderId, status, trackingNumber);
    if (!res.success) {
      setDbActionError(res.error || 'Failed to update order status');
      return;
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              trackingNumber: trackingNumber || o.trackingNumber,
            }
          : o
      )
    );
  };

  const { reviews, toggleVerifiedBadge, deleteReview, approveReview, refreshReviews } = useReviews();
  const {
    heroSlides,
    videoReels,
    categoryCircles,
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
    'overview' | 'orders' | 'products' | 'media-cms' | 'coupons' | 'reviews' | 'customers' | 'affiliates' | 'personalization' | 'production'
  >(() => (initialRole === 'director' ? 'media-cms' : 'overview'));
  const [dbActionError, setDbActionError] = useState<string | null>(null);
  const [personalizationRequests, setPersonalizationRequests] = useState<any[]>([]);
  const [allReviewsFromDb, setAllReviewsFromDb] = useState<any[]>([]);
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

  // Creator & Affiliate applications state (loaded from Supabase creator_applications)
  const [creatorApplications, setCreatorApplications] = useState<CreatorApplication[]>(INITIAL_CREATOR_APPLICATIONS);

  // Load creator applications from Supabase
  const loadCreatorApplications = async () => {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('creator_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching creator applications', error);
        return;
      }
      if (data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          ...d.data,
          id: d.id,
          status: d.status || d.data?.status || 'Pending',
          createdAt: d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : d.data?.createdAt,
        }));
        setCreatorApplications([
          ...mapped,
          ...INITIAL_CREATOR_APPLICATIONS.filter((a) => !mapped.some((m: any) => m.id === a.id)),
        ]);
      }
    } catch (e: any) {
      console.warn(e);
    }
  };

  // Load personalization requests from Supabase
  const loadPersonalizationRequests = async () => {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('personalization_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching personalization requests', error);
        return;
      }
      if (data) {
        setPersonalizationRequests(data);
      }
    } catch (e: any) {
      console.warn(e);
    }
  };

  // Load all reviews for moderation from Supabase
  const loadAllReviews = async () => {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error loading reviews from Supabase', error);
        return;
      }
      if (data) {
        setAllReviewsFromDb(data);
      }
    } catch (e: any) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadCreatorApplications();
    loadPersonalizationRequests();
    loadAllReviews();
  }, []);

  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);

  const handleApproveApplication = async (appId: string) => {
    const app = creatorApplications.find((a) => a.id === appId);
    if (!app) return;

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('creator_applications')
        .update({ status: 'Approved' })
        .eq('id', appId);

      if (error) {
        setDbActionError(`Failed to update application status in Supabase: ${error.message}`);
        return; // Never silently fall back on database failure!
      }

      // Upsert affiliate coupon into Supabase coupons table
      const newAffiliateCoupon: Coupon = {
        code: app.proposedCode,
        type: 'percentage',
        value: 15,
        minOrderValue: 499,
        description: `Exclusive 15% Creator Discount (${app.fullName})`,
        isActive: true,
      };

      const { error: couponErr } = await supabase.from('coupons').upsert({
        code: app.proposedCode,
        type: 'percentage',
        value: 15,
        min_order_value: 499,
        description: `Exclusive 15% Creator Discount (${app.fullName})`,
        is_active: true,
      });

      if (couponErr) {
        setDbActionError(`Creator approved, but failed to save coupon to Supabase: ${couponErr.message}`);
      }

      setCoupons((cPrev) => [newAffiliateCoupon, ...cPrev.filter((c) => c.code !== app.proposedCode)]);
    }

    setCreatorApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Approved' } : a))
    );
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  const handleDeclineApplication = async (appId: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('creator_applications')
        .update({ status: 'Declined' })
        .eq('id', appId);

      if (error) {
        setDbActionError(`Failed to decline creator in Supabase: ${error.message}`);
        return;
      }
    }

    setCreatorApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'Declined' } : app))
    );
  };

  const handleUpdatePersonalizationStatus = async (id: string, newStatus: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('personalization_requests')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) {
        setDbActionError(`Failed to update personalization request in Supabase: ${error.message}`);
        return;
      }
    }
    setPersonalizationRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleApproveReview = async (reviewId: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', reviewId);
      if (error) {
        setDbActionError(`Failed to approve review in Supabase: ${error.message}`);
        return;
      }
    }
    await loadAllReviews();
    await refreshReviews();
  };

  const handleDeleteReviewRow = async (reviewId: string, productId?: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      if (error) {
        setDbActionError(`Failed to delete review in Supabase: ${error.message}`);
        return;
      }
    }
    if (productId) {
      await deleteReview(productId, reviewId);
    }
    await loadAllReviews();
    await refreshReviews();
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
  const [newProductCustomImage, setNewProductCustomImage] = useState<string>('');

  // Bulk Product Image Importer State
  const [isBulkImageImporterOpen, setIsBulkImageImporterOpen] = useState(false);
  const [bulkImageItems, setBulkImageItems] = useState<
    Array<{
      id: string;
      imageUrl: string;
      name: string;
      price: number;
      mrp: number;
      category: Product['category'];
      badge: string;
      description: string;
    }>
  >([]);
  const [batchCategory, setBatchCategory] = useState<Product['category']>('Personalized Name Jewelry');
  const [batchPrice, setBatchPrice] = useState<number>(849);
  const [batchMrp, setBatchMrp] = useState<number>(1899);
  const [batchBadge, setBatchBadge] = useState<string>('New Arrival');
  const [pastedImageUrlsText, setPastedImageUrlsText] = useState('');
  const [isDragOverBulk, setIsDragOverBulk] = useState(false);

  // Helper: Process multiple selected or dropped files into bulk items
  const handleProcessFilesToBulkItems = (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    fileList.forEach((file, index) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const rawFileName = file.name.replace(/\.[^/.]+$/, '');
          const formattedName = rawFileName
            .replace(/[-_]+/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .trim();

          setBulkImageItems((prev) => [
            ...prev,
            {
              id: `bulk-img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${index}`,
              imageUrl: e.target?.result as string,
              name: formattedName || `Atelier Keepsake #${prev.length + 1}`,
              price: batchPrice,
              mrp: batchMrp,
              category: batchCategory,
              badge: batchBadge,
              description: 'Handcrafted bespoke gift created with fine laser engraving and premium luxury finish.',
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    setBulkFeedbackToast(`📸 Loaded ${fileList.length} image(s)! Customize details below or click Publish.`);
    setTimeout(() => setBulkFeedbackToast(null), 3500);
  };

  // Helper: Parse pasted image URLs text into bulk items
  const handleParseImageUrlsTextToBulk = () => {
    if (!pastedImageUrlsText.trim()) {
      setBulkFeedbackToast('⚠️ Paste some image URLs or links first.');
      setTimeout(() => setBulkFeedbackToast(null), 3000);
      return;
    }

    const lines = pastedImageUrlsText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('http') || l.startsWith('data:image') || l.startsWith('/'));

    if (lines.length === 0) {
      setBulkFeedbackToast('⚠️ No valid image URLs found in pasted text.');
      setTimeout(() => setBulkFeedbackToast(null), 3000);
      return;
    }

    lines.forEach((url, idx) => {
      setBulkImageItems((prev) => [
        ...prev,
        {
          id: `bulk-url-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          imageUrl: url,
          name: `Custom Bespoke Keepsake #${prev.length + 1}`,
          price: batchPrice,
          mrp: batchMrp,
          category: batchCategory,
          badge: batchBadge,
          description: 'Handcrafted bespoke gift created with fine laser engraving and premium luxury finish.',
        },
      ]);
    });

    setPastedImageUrlsText('');
    setBulkFeedbackToast(`✨ Added ${lines.length} image link(s) to queue!`);
    setTimeout(() => setBulkFeedbackToast(null), 3500);
  };

  // Helper: Paste images directly from Clipboard into Bulk
  const handlePasteFromClipboardToBulk = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        let addedCount = 0;
        for (const item of items) {
          const imageType = item.types.find((t) => t.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                setBulkImageItems((prev) => [
                  ...prev,
                  {
                    id: `bulk-clip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    imageUrl: e.target?.result as string,
                    name: `Clipboard Keepsake #${prev.length + 1}`,
                    price: batchPrice,
                    mrp: batchMrp,
                    category: batchCategory,
                    badge: batchBadge,
                    description: 'Handcrafted bespoke gift created with fine laser engraving and premium luxury finish.',
                  },
                ]);
              }
            };
            reader.readAsDataURL(blob);
            addedCount++;
          }
        }
        if (addedCount > 0) {
          setBulkFeedbackToast(`📋 Pasted ${addedCount} image(s) from clipboard!`);
          setTimeout(() => setBulkFeedbackToast(null), 3500);
          return;
        }
      }

      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && (text.startsWith('http') || text.startsWith('data:') || text.startsWith('/'))) {
          setPastedImageUrlsText(text);
          setBulkFeedbackToast('📋 Pasted image link into input box below.');
          setTimeout(() => setBulkFeedbackToast(null), 3000);
          return;
        }
      }
      setBulkFeedbackToast('ℹ️ Copy an image or image links to clipboard first, then click Paste.');
      setTimeout(() => setBulkFeedbackToast(null), 3500);
    } catch {
      setBulkFeedbackToast('ℹ️ Use the Drag & Drop area or file chooser to select bulk images.');
      setTimeout(() => setBulkFeedbackToast(null), 3500);
    }
  };

  // Helper: Apply batch settings to all currently queued bulk items
  const handleApplyBatchSettingsToAll = () => {
    if (bulkImageItems.length === 0) return;
    setBulkImageItems((prev) =>
      prev.map((item) => ({
        ...item,
        category: batchCategory,
        price: batchPrice,
        mrp: batchMrp,
        badge: batchBadge,
      }))
    );
    setBulkFeedbackToast('⚡ Updated category, price, and badge across all queued items!');
    setTimeout(() => setBulkFeedbackToast(null), 3000);
  };

  // Helper: Mass publish all queued bulk image items as live store products
  const handlePublishBulkProducts = () => {
    if (bulkImageItems.length === 0) {
      setBulkFeedbackToast('⚠️ Add at least 1 image before publishing.');
      setTimeout(() => setBulkFeedbackToast(null), 3000);
      return;
    }

    const createdProducts: Product[] = bulkImageItems.map((item, idx) => ({
      id: `bulk-prod-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      slug: (item.name || 'custom-keepsake').toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Date.now()}-${idx}`,
      name: item.name.trim() || `Atelier Keepsake #${idx + 1}`,
      category: item.category || 'Personalized Name Jewelry',
      price: Number(item.price) || 849,
      mrp: Number(item.mrp) || 1899,
      rating: 5.0,
      reviewCount: Math.floor(Math.random() * 15) + 5,
      description: item.description || 'Handcrafted bespoke gift created with fine laser engraving and premium luxury finish.',
      features: ['18k Vermeil Laser Plating', 'Custom Engraving Included', 'Archival Gift Box Packaging'],
      images: [item.imageUrl, 'case_front'],
      badge: item.badge || 'New Arrival',
      isBestSeller: idx === 0,
      isNew: true,
      themeColor: '#FAF4EC',
      secondaryColor: '#881337',
      designPattern: 'jewelry_necklace',
      allowsPersonalization: true,
      supportedBrands: ['Apple', 'Samsung', 'OnePlus', 'Google'],
      personalizationConfig: {
        allowsText: true,
        textLabel: 'Custom Name / Monogram',
        textPlaceholder: 'e.g. Aurelia, Sophia, 14.02',
        textMaxLength: 16,
        allowsGiftMessage: true,
      },
    }));

    createdProducts.forEach((p) => onAddProduct(p));

    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
    setIsBulkImageImporterOpen(false);
    setBulkImageItems([]);
    setBulkFeedbackToast(`🎉 Success! Published ${createdProducts.length} new product(s) to your live storefront!`);
    setTimeout(() => setBulkFeedbackToast(null), 4000);
  };

  // Quick Paste Raw Text / JSON Auto-Filler State
  const [quickPasteText, setQuickPasteText] = useState('');
  const [showQuickPasteBox, setShowQuickPasteBox] = useState(false);

  // Smart Parser for Pasted Product Text (JSON, WhatsApp, Key-Value, Supplier List)
  const handleApplyQuickPasteText = (rawInput?: string) => {
    const textToParse = (rawInput !== undefined ? rawInput : quickPasteText).trim();
    if (!textToParse) {
      setBulkFeedbackToast('⚠️ Paste some text or product details first.');
      setTimeout(() => setBulkFeedbackToast(null), 3000);
      return;
    }

    try {
      // 1. Try parsing JSON format
      if (textToParse.startsWith('{') && textToParse.endsWith('}')) {
        const json = JSON.parse(textToParse);
        if (json.name || json.title) setNewProductName(json.name || json.title);
        if (json.price) setNewProductPrice(Number(json.price));
        if (json.mrp) setNewProductMrp(Number(json.mrp || json.price * 2));
        if (json.category) setNewProductCategory(json.category);
        if (json.description || json.desc) setNewProductDesc(json.description || json.desc);
        if (json.badge) setNewProductBadge(json.badge);
        if (json.image || json.imageUrl || (Array.isArray(json.images) && json.images[0])) {
          setNewProductCustomImage(json.image || json.imageUrl || json.images[0]);
        }
        setBulkFeedbackToast('✨ Auto-filled product details from JSON data!');
        setTimeout(() => setBulkFeedbackToast(null), 3000);
        return;
      }

      // 2. Parse Key-Value or Multi-Line Text
      const lines = textToParse.split('\n').map((l) => l.trim()).filter(Boolean);
      let parsedName = '';
      let parsedPrice = 0;
      let parsedMrp = 0;
      let parsedCategory: Product['category'] | '' = '';
      let parsedBadge = '';
      let parsedDesc = '';
      let parsedImage = '';

      lines.forEach((line) => {
        const lower = line.toLowerCase();

        // Image link detection
        if ((lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('data:image')) && !parsedImage) {
          parsedImage = line.trim();
          return;
        }

        // Key: Value matching
        if (lower.startsWith('name:') || lower.startsWith('title:') || lower.startsWith('product:')) {
          parsedName = line.replace(/^(name|title|product)\s*:\s*/i, '').trim();
        } else if (lower.startsWith('price:') || lower.startsWith('selling price:') || lower.startsWith('offer price:')) {
          const numMatch = line.match(/\d+[\d,]*/);
          if (numMatch) parsedPrice = Number(numMatch[0].replace(/,/g, ''));
        } else if (lower.startsWith('mrp:') || lower.startsWith('original price:') || lower.startsWith('list price:')) {
          const numMatch = line.match(/\d+[\d,]*/);
          if (numMatch) parsedMrp = Number(numMatch[0].replace(/,/g, ''));
        } else if (lower.startsWith('category:') || lower.startsWith('collection:')) {
          const rawCat = line.replace(/^(category|collection)\s*:\s*/i, '').trim();
          const match = SEVEN_COLLECTIONS.find((c) => c.toLowerCase().includes(rawCat.toLowerCase()) || rawCat.toLowerCase().includes(c.toLowerCase()));
          if (match) parsedCategory = match;
          else parsedCategory = rawCat as any;
        } else if (lower.startsWith('badge:') || lower.startsWith('tag:')) {
          parsedBadge = line.replace(/^(badge|tag)\s*:\s*/i, '').trim();
        } else if (lower.startsWith('desc:') || lower.startsWith('description:')) {
          parsedDesc = line.replace(/^(desc|description)\s*:\s*/i, '').trim();
        } else if (lower.startsWith('image:') || lower.startsWith('photo:')) {
          parsedImage = line.replace(/^(image|photo)\s*:\s*/i, '').trim();
        } else {
          // If no prefix, inspect line contents
          if (!parsedName && line.length > 3 && !line.match(/^₹?\s*\d+$/)) {
            parsedName = line;
          } else if (!parsedPrice && line.match(/^₹?\s*\d+/)) {
            const numMatch = line.match(/\d+/);
            if (numMatch) parsedPrice = Number(numMatch[0]);
          } else if (!parsedDesc && line.length > 15) {
            parsedDesc = line;
          }
        }
      });

      if (parsedName) setNewProductName(parsedName);
      if (parsedPrice > 0) {
        setNewProductPrice(parsedPrice);
        if (!parsedMrp) setNewProductMrp(Math.round(parsedPrice * 1.8));
      }
      if (parsedMrp > 0) setNewProductMrp(parsedMrp);
      if (parsedCategory) setNewProductCategory(parsedCategory);
      if (parsedBadge) setNewProductBadge(parsedBadge);
      if (parsedDesc) setNewProductDesc(parsedDesc);
      if (parsedImage) setNewProductCustomImage(parsedImage);

      setBulkFeedbackToast('✨ Product fields auto-filled from pasted details!');
      setTimeout(() => setBulkFeedbackToast(null), 3500);
    } catch (err) {
      console.error('Quick paste parsing error', err);
      setBulkFeedbackToast('⚠️ Could not parse text automatically. Please check values.');
      setTimeout(() => setBulkFeedbackToast(null), 3000);
    }
  };

  // Direct 1-Click Clipboard Text Auto-Fill Helper
  const handlePasteDetailsFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setQuickPasteText(text);
          handleApplyQuickPasteText(text);
          return;
        }
      }
      setBulkFeedbackToast('ℹ️ Copy product text or JSON first, then click Paste.');
      setTimeout(() => setBulkFeedbackToast(null), 3000);
    } catch {
      setBulkFeedbackToast('ℹ️ Paste your text directly into the Quick Paste box below.');
      setTimeout(() => setBulkFeedbackToast(null), 3000);
    }
  };

  // Duplicate / Clone Existing Product Helper
  const handleDuplicateProduct = (p: Product) => {
    setNewProductName(`${p.name} (Copy)`);
    setNewProductCategory(p.category);
    setNewProductPrice(p.price);
    setNewProductMrp(p.mrp);
    setNewProductDesc(p.description || '');
    setNewProductBadge(p.badge || 'Atelier Special');
    setNewProductCustomImage(p.images?.[0] || '');
    setNewProductPattern(p.designPattern || 'jewelry_necklace');
    setNewProductTheme(p.themeColor || '#FAF4EC');
    setNewProductSecondary(p.secondaryColor || '#881337');
    setIsAddProductOpen(true);
    setBulkFeedbackToast(`📋 Cloned "${p.name}". Edit details & click Create to publish!`);
    setTimeout(() => setBulkFeedbackToast(null), 3500);
  };

  // Single Product Edit State
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductCategory, setEditProductCategory] = useState<Product['category']>('Personalized Jewellery');
  const [editProductPrice, setEditProductPrice] = useState(849);
  const [editProductMrp, setEditProductMrp] = useState(1899);
  const [editProductDesc, setEditProductDesc] = useState('');
  const [editProductBadge, setEditProductBadge] = useState('');
  const [editProductImage, setEditProductImage] = useState<string>('');
  const [editProductStock, setEditProductStock] = useState<'in_stock' | 'out_of_stock' | 'low_stock'>('in_stock');

  // Clipboard Image Paste Helper
  const handlePasteImageFromClipboard = async (setter: (url: string) => void) => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find((t) => t.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                setter(e.target.result as string);
                setBulkFeedbackToast('📋 Image pasted from clipboard!');
                setTimeout(() => setBulkFeedbackToast(null), 3000);
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && (text.startsWith('http') || text.startsWith('data:') || text.startsWith('/'))) {
          setter(text.trim());
          setBulkFeedbackToast('📋 Image URL pasted from clipboard!');
          setTimeout(() => setBulkFeedbackToast(null), 3000);
          return;
        }
      }
      setBulkFeedbackToast('ℹ️ Copy an image first, then click Paste (or press Ctrl+V).');
      setTimeout(() => setBulkFeedbackToast(null), 3500);
    } catch (err) {
      console.warn('Clipboard read failed:', err);
      setBulkFeedbackToast('ℹ️ Press Ctrl+V inside the input or click Upload Image.');
      setTimeout(() => setBulkFeedbackToast(null), 3500);
    }
  };

  const handleContainerPaste = (e: React.ClipboardEvent, setter: (url: string) => void) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              if (evt.target?.result) {
                setter(evt.target.result as string);
                setBulkFeedbackToast('📋 Image pasted from clipboard!');
                setTimeout(() => setBulkFeedbackToast(null), 3000);
              }
            };
            reader.readAsDataURL(file);
            e.preventDefault();
            return;
          }
        }
      }
    }
    const text = e.clipboardData?.getData('text');
    if (text && (text.startsWith('http') || text.startsWith('data:') || text.startsWith('/'))) {
      setter(text.trim());
      setBulkFeedbackToast('📋 Image URL pasted!');
      setTimeout(() => setBulkFeedbackToast(null), 3000);
    }
  };

  // Bulk Editing Mode State
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');
  const [productStockFilter, setProductStockFilter] = useState<'All' | 'in_stock' | 'out_of_stock' | 'low_stock'>('All');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkFeedbackToast, setBulkFeedbackToast] = useState<string | null>(null);

  // Bulk Edit Modal Inputs State
  const [bulkPriceAction, setBulkPriceAction] = useState<'keep' | 'fixed' | 'percent_discount' | 'percent_increase' | 'flat_discount' | 'flat_increase'>('keep');
  const [bulkPriceValue, setBulkPriceValue] = useState<number>(0);
  const [bulkUpdateMrp, setBulkUpdateMrp] = useState<boolean>(false);
  const [bulkMrpValue, setBulkMrpValue] = useState<number>(0);

  const [bulkCategoryAction, setBulkCategoryAction] = useState<'keep' | 'set'>('keep');
  const [bulkTargetCategory, setBulkTargetCategory] = useState<GiftCategory>('Names on Gifts');

  const [bulkStockAction, setBulkStockAction] = useState<'keep' | 'in_stock' | 'out_of_stock' | 'low_stock'>('keep');

  // Coupon state with Supabase coupons table synchronization
  const [coupons, setCoupons] = useState<Coupon[]>(AVAILABLE_COUPONS);

  // Load coupons from Supabase
  const loadCoupons = async () => {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setCoupons(data.map((c: any) => ({
          code: c.code,
          description: c.description || `${c.code} Privilege`,
          type: c.type || 'flat',
          value: Number(c.value) || 0,
          minOrderValue: Number(c.min_order_value || 0),
          minItems: Number(c.min_items || 1),
          isActive: c.is_active ?? true,
        })));
      } else {
        // Fallback check server api
        const res = await fetch('/api/coupons');
        const json = await res.json();
        if (json.coupons && json.coupons.length > 0) {
          setCoupons(json.coupons.map((c: any) => ({
            code: c.code,
            description: c.description || `${c.code} Privilege`,
            type: c.type || 'flat',
            value: Number(c.value) || 0,
            minOrderValue: Number(c.min_order_value || 0),
            minItems: Number(c.min_items || 1),
            isActive: c.is_active ?? true,
          })));
        }
      }
    } catch (e: any) {
      console.warn('Coupon load error:', e);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);
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
      images: newProductCustomImage ? [newProductCustomImage, 'case_front'] : ['case_front', 'case_angle'],
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
    setBulkFeedbackToast(`✓ New product "${newProd.name}" added & synced to Home page!`);
    setTimeout(() => setBulkFeedbackToast(null), 3000);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditProductName(p.name);
    setEditProductCategory(p.category);
    setEditProductPrice(p.price);
    setEditProductMrp(p.mrp);
    setEditProductDesc(p.description || '');
    setEditProductBadge(p.badge || '');
    setEditProductImage(p.images?.[0] || '');
    setEditProductStock(p.stockStatus || (p.inStock === false ? 'out_of_stock' : 'in_stock'));
    setIsEditProductOpen(true);
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProductName.trim()) return;

    const updated: Product = {
      ...editingProduct,
      name: editProductName.trim(),
      category: editProductCategory,
      price: Number(editProductPrice),
      mrp: Number(editProductMrp),
      description: editProductDesc.trim(),
      badge: editProductBadge.trim() || undefined,
      images: editProductImage
        ? [editProductImage, ...(editingProduct.images?.slice(1) || ['case_front'])]
        : (editingProduct.images || ['case_front']),
      inStock: editProductStock === 'in_stock' || editProductStock === 'low_stock',
      stockStatus: editProductStock,
    };

    onUpdateProduct(updated);
    if (onBulkUpdateProducts) {
      onBulkUpdateProducts([updated]);
    }
    setIsEditProductOpen(false);
    setEditingProduct(null);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setBulkFeedbackToast(`✓ Product "${updated.name}" updated & synced to Home page!`);
    setTimeout(() => setBulkFeedbackToast(null), 3500);
  };

  const SEVEN_COLLECTIONS: GiftCategory[] = [
    'Names on Gifts',
    'Personalized Jewellery',
    'Customize Your Caricature or Miniature',
    'Personalize Your Bouquets',
    'Special Hampers',
    'Hair Accessories',
    'Paradise of Jewels',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (productCategoryFilter !== 'All' && p.category !== productCategoryFilter) {
        return false;
      }
      // Stock status filter
      if (productStockFilter !== 'All') {
        const isInStock = p.inStock !== false && p.stockStatus !== 'out_of_stock';
        if (productStockFilter === 'in_stock' && !isInStock) return false;
        if (productStockFilter === 'out_of_stock' && isInStock) return false;
        if (productStockFilter === 'low_stock' && p.stockStatus !== 'low_stock') return false;
      }
      // Search query
      if (productSearchQuery.trim()) {
        const q = productSearchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesSlug = p.slug.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesSlug) return false;
      }
      return true;
    });
  }, [products, productCategoryFilter, productStockFilter, productSearchQuery]);

  const allFilteredSelected =
    filteredProducts.length > 0 && filteredProducts.every((p) => selectedProductIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredProducts.map((p) => p.id));
      setSelectedProductIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const newSelected = new Set([...selectedProductIds, ...filteredProducts.map((p) => p.id)]);
      setSelectedProductIds(Array.from(newSelected));
    }
  };

  const handleToggleSelectProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSingleStockToggle = (product: Product) => {
    const isCurrentlyInStock = product.inStock !== false && product.stockStatus !== 'out_of_stock';
    const nextStatus = isCurrentlyInStock ? 'out_of_stock' : 'in_stock';
    const updated: Product = {
      ...product,
      inStock: !isCurrentlyInStock,
      stockStatus: nextStatus,
    };
    onUpdateProduct(updated);
    if (onBulkUpdateProducts) {
      onBulkUpdateProducts([updated]);
    }
    setBulkFeedbackToast(`Updated "${product.name}" to ${nextStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}`);
    setTimeout(() => setBulkFeedbackToast(null), 3000);
  };

  const handleQuickStockUpdate = (status: 'in_stock' | 'out_of_stock' | 'low_stock') => {
    if (selectedProductIds.length === 0) return;

    const updatedList: Product[] = [];
    products.forEach((p) => {
      if (selectedProductIds.includes(p.id)) {
        const updated: Product = {
          ...p,
          inStock: status === 'in_stock' || status === 'low_stock',
          stockStatus: status,
        };
        updatedList.push(updated);
        onUpdateProduct(updated);
      }
    });

    if (onBulkUpdateProducts && updatedList.length > 0) {
      onBulkUpdateProducts(updatedList);
    }

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    const label = status === 'in_stock' ? 'In Stock' : status === 'out_of_stock' ? 'Out of Stock' : 'Low Stock';
    setBulkFeedbackToast(`Updated ${selectedProductIds.length} products to "${label}"`);
    setTimeout(() => setBulkFeedbackToast(null), 4000);
  };

  const handleApplyBulkUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductIds.length === 0) return;

    const updatedList: Product[] = [];
    products.forEach((p) => {
      if (selectedProductIds.includes(p.id)) {
        let newPrice = p.price;
        let newMrp = p.mrp;
        let newCategory = p.category;
        let newInStock = p.inStock;
        let newStockStatus = p.stockStatus;

        // Apply Price
        if (bulkPriceAction === 'fixed') {
          if (bulkPriceValue > 0) newPrice = Math.round(bulkPriceValue);
        } else if (bulkPriceAction === 'percent_discount') {
          if (bulkPriceValue > 0) newPrice = Math.max(1, Math.round(p.price * (1 - bulkPriceValue / 100)));
        } else if (bulkPriceAction === 'percent_increase') {
          if (bulkPriceValue > 0) newPrice = Math.round(p.price * (1 + bulkPriceValue / 100));
        } else if (bulkPriceAction === 'flat_discount') {
          if (bulkPriceValue > 0) newPrice = Math.max(1, Math.round(p.price - bulkPriceValue));
        } else if (bulkPriceAction === 'flat_increase') {
          if (bulkPriceValue > 0) newPrice = Math.round(p.price + bulkPriceValue);
        }

        if (bulkUpdateMrp && bulkMrpValue > 0) {
          newMrp = Math.round(bulkMrpValue);
        } else if (newPrice > newMrp) {
          newMrp = Math.round(newPrice * 1.5);
        }

        // Apply Category
        if (bulkCategoryAction === 'set') {
          newCategory = bulkTargetCategory;
        }

        // Apply Stock
        if (bulkStockAction === 'in_stock') {
          newInStock = true;
          newStockStatus = 'in_stock';
        } else if (bulkStockAction === 'out_of_stock') {
          newInStock = false;
          newStockStatus = 'out_of_stock';
        } else if (bulkStockAction === 'low_stock') {
          newInStock = true;
          newStockStatus = 'low_stock';
        }

        const updatedProduct: Product = {
          ...p,
          price: newPrice,
          mrp: newMrp,
          category: newCategory,
          inStock: newInStock,
          stockStatus: newStockStatus,
        };

        updatedList.push(updatedProduct);
        onUpdateProduct(updatedProduct);
      }
    });

    if (onBulkUpdateProducts && updatedList.length > 0) {
      onBulkUpdateProducts(updatedList);
    }

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    setBulkFeedbackToast(`Successfully bulk updated ${updatedList.length} products!`);
    setTimeout(() => setBulkFeedbackToast(null), 4500);

    setIsBulkEditModalOpen(false);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
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

    const row = {
      code: newC.code,
      description: newC.description,
      type: newC.type,
      value: newC.value,
      min_order_value: newC.minOrderValue,
      min_items: 1,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error: dbErr } = await supabase.from('coupons').upsert(row);
      if (dbErr) {
        // Fallback to server API
        try {
          const res = await fetch('/api/coupons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-password': 'admin' },
            body: JSON.stringify(row),
          });
          const j = await res.json();
          if (!j.success) {
            setDbActionError(`Failed to save coupon to Supabase: ${dbErr.message}`);
            return; // Never silently fall back on database failure!
          }
        } catch {
          setDbActionError(`Failed to save coupon to Supabase: ${dbErr.message}`);
          return;
        }
      }
    }

    setCoupons((prev) => [newC, ...prev.filter((c) => c.code !== newC.code)]);
    setIsAddCouponOpen(false);
    setNewCouponCode('');
  };

  const handleDeleteCoupon = async (code: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { error: dbErr } = await supabase.from('coupons').delete().eq('code', code.toUpperCase().trim());
      if (dbErr) {
        try {
          const res = await fetch(`/api/coupons/${code}`, { method: 'DELETE' });
          const j = await res.json();
          if (!j.success) {
            setDbActionError(`Failed to delete coupon from Supabase: ${dbErr.message}`);
            return;
          }
        } catch {
          setDbActionError(`Failed to delete coupon from Supabase: ${dbErr.message}`);
          return;
        }
      }
    }
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
    <div className="min-h-screen bg-[#FFFDF8] text-[#211D1C]">
      <SEO
        title="Admin Studio & Control Panel — Divine’s Eternity"
        description="Divine’s Eternity store control panel for live catalog, order operations, and hero media management."
        noindex={true}
      />

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#211D1C] border-b border-stone-800 px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#FF2E93] flex items-center justify-center text-white shadow-md font-serif-heading text-lg font-black shrink-0">
              DE
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white truncate">
                  Divine’s <span className="text-[#FF2E93]">Eternity</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/40 flex items-center gap-1 shrink-0">
                  <Activity className="w-3 h-3 animate-pulse" /> Atelier Studio
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 truncate">
                Active Session · <strong className="text-[#FFD94A]">{user?.name || 'Store Manager'}</strong>
              </p>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
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

          {/* Mobile Navigation Controls: Highly Visible Hamburger 3-Lines Button */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={onReturnToStore}
              className="px-2.5 py-2 rounded-xl bg-[#171413] border border-stone-800 text-white text-xs font-semibold flex items-center gap-1 hover:border-stone-600 transition-colors cursor-pointer"
              title="Return to Store"
            >
              <Store className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span className="hidden xs:inline">Store</span>
            </button>

            <button
              onClick={() => setIsAdminMobileMenuOpen(true)}
              aria-label="Toggle Dashboard Menu"
              className="px-3 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white border-2 border-pink-300 active:scale-95 transition-all shadow-lg flex items-center gap-1.5 cursor-pointer font-bold shrink-0"
            >
              <Menu className="w-5 h-5 text-white stroke-[2.5]" />
              <span className="text-xs font-extrabold text-white">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Admin Navigation Drawer Portal */}
      {isAdminMobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="lg:hidden fixed inset-0 z-[9999] w-full h-full h-[100dvh] bg-[#171413] text-white flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 p-5 shadow-2xl">
            <div>
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FF2E93] text-white font-black text-sm flex items-center justify-center shadow-md font-serif-heading">
                    DE
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Divine’s Eternity Control</div>
                    <div className="text-[10px] text-[#FFD94A] font-medium">Atelier Command Center</div>
                  </div>
                </div>

                <button
                  onClick={() => setIsAdminMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-[#211D1C] border border-stone-700 text-white shadow-md hover:bg-stone-800 cursor-pointer"
                  aria-label="Close admin menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role Selection inside Drawer */}
              <div className="my-4 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD94A] font-mono">
                  Access Role
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setCurrentRole('director');
                      setActiveTab('media-cms');
                      setIsAdminMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      currentRole === 'director'
                        ? 'bg-[#FF2E93] border-[#FF2E93] text-white shadow-md'
                        : 'bg-[#211D1C] border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <Film className="w-4 h-4 mx-auto mb-1 text-white" />
                    <span className="text-[10px] font-bold block">Media Director</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('superadmin');
                      setActiveTab('overview');
                      setIsAdminMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      currentRole === 'superadmin'
                        ? 'bg-[#FF2E93] border-[#FF2E93] text-white shadow-md'
                        : 'bg-[#211D1C] border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mx-auto mb-1 text-white" />
                    <span className="text-[10px] font-bold block">Super Admin</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('orders');
                      setActiveTab('orders');
                      setIsAdminMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      currentRole === 'orders'
                        ? 'bg-[#FF2E93] border-[#FF2E93] text-white shadow-md'
                        : 'bg-[#211D1C] border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-white" />
                    <span className="text-[10px] font-bold block">Fulfillment</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs List */}
              <div className="my-5 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD94A] font-mono">
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
                  { id: 'personalization', label: 'Bespoke Requests', icon: Sparkles, count: personalizationRequests.length },
                  { id: 'production', label: 'Production Queue', icon: Clock, count: null },
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
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group shadow-xs cursor-pointer ${
                        isActive
                          ? 'bg-[#FF2E93] border-pink-400 text-white font-bold'
                          : 'bg-[#211D1C] border-stone-800 text-stone-300 hover:border-[#FF2E93]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FFD94A]'}`} />
                        <span className="text-xs font-bold text-white">{tab.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {tab.count !== null && (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                            isActive ? 'bg-white text-[#FF2E93]' : 'bg-[#171413] text-[#FFD94A]'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-4 mt-6 border-t border-stone-800 space-y-2">
              <button
                onClick={() => {
                  setIsAdminMobileMenuOpen(false);
                  onReturnToStore();
                }}
                className="w-full p-3.5 rounded-2xl bg-white hover:bg-stone-100 text-[#211D1C] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#FF2E93]" />
                <span>Return to Public Storefront</span>
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 sm:py-8 pb-28 lg:pb-12">
        
        {/* Visible Supabase Action Error Notification */}
        {dbActionError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-900/95 text-white border border-rose-500/50 flex items-start justify-between gap-3 shadow-xl backdrop-blur-md animate-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-rose-100">Supabase Operation Error</p>
                <p className="text-xs text-rose-200 mt-0.5 leading-relaxed">{dbActionError}</p>
              </div>
            </div>
            <button
              onClick={() => setDbActionError(null)}
              className="text-rose-300 hover:text-white p-1 rounded transition-colors cursor-pointer"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#F3E8E2] no-scrollbar">
          {[
            { id: 'overview', label: 'Store Overview', icon: BarChart3, count: null },
            { id: 'orders', label: 'Orders & Pipeline', icon: ShoppingBag, count: orders.length },
            { id: 'products', label: 'Catalog Studio', icon: Package, count: products.length },
            { id: 'media-cms', label: 'Homepage Sections & CMS', icon: Film, count: heroSlides.length + categoryCircles.length + videoReels.length },
            { id: 'coupons', label: 'Offers & Coupons', icon: Tag, count: coupons.length },
            { id: 'reviews', label: 'Reviews & Proof', icon: Star, count: allReviewsList.length },
            { id: 'customers', label: 'Client Directory', icon: Users, count: customersList.length },
            { id: 'affiliates', label: 'Creator Ambassadors', icon: Video, count: creatorApplications.length },
            { id: 'personalization', label: 'Bespoke Requests', icon: Sparkles, count: personalizationRequests.length },
            { id: 'production', label: 'Production Queue', icon: Clock, count: null },
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

              <div className="flex items-center gap-3">
                <div className="text-xs text-stone-500">
                  Showing <strong className="text-stone-900 dark:text-white">{filteredOrders.length}</strong> orders
                </div>

                <button
                  onClick={() => {
                    exportOrdersToCSV(orders);
                    setBulkFeedbackToast('📥 Orders exported to CSV successfully!');
                    setTimeout(() => setBulkFeedbackToast(null), 3500);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 hover:border-[#FF2E93] text-stone-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Export all orders to CSV formatted for courier logistics"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF2E93]" />
                  <span>Export CSV</span>
                </button>
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
        {/* TAB 3: CATALOG STUDIO & BULK EDITING MODE */}
        {/* ============================================================ */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-150 relative pb-16">
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#181418] p-5 sm:p-6 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#881337]/10 dark:bg-[#FF2E93]/15 text-[#881337] dark:text-[#FF2E93] flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-white flex items-center gap-2">
                      <span>Product Catalog Studio</span>
                      {isBulkEditMode && (
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FF2E93] text-white shadow-xs tracking-wider animate-pulse">
                          ⚡ Bulk Mode ON
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Manage live prices, collections, inventory status, and execute simultaneous bulk updates
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Bulk Editing Mode Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isBulkEditMode;
                    setIsBulkEditMode(nextMode);
                    if (!nextMode) {
                      setSelectedProductIds([]);
                    }
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border ${
                    isBulkEditMode
                      ? 'bg-[#FF2E93] text-white border-[#FF2E93] ring-2 ring-[#FF2E93]/30 shadow-md'
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 border-[#EFE7DE] dark:border-stone-800 hover:border-[#FF2E93] hover:text-[#FF2E93]'
                  }`}
                >
                  <Zap className={`w-4 h-4 ${isBulkEditMode ? 'text-[#FFD94A]' : 'text-stone-400'}`} />
                  <span>{isBulkEditMode ? 'Exit Bulk Edit Mode' : '⚡ Enable Bulk Edit Mode'}</span>
                  {selectedProductIds.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-[#FF2E93] text-[10px] font-mono font-bold">
                      {selectedProductIds.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsBulkImageImporterOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white transition-all shadow-md cursor-pointer animate-pulse-subtle"
                  title="Upload or paste multiple product photos to batch-create store catalog items"
                >
                  <ImageIcon className="w-4 h-4 text-[#FFD94A]" />
                  <span>📸 Bulk Images Importer</span>
                  {bulkImageItems.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-white text-[#FF2E93] text-[10px] font-mono font-bold">
                      {bulkImageItems.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    exportProductsToCSV(products);
                    setBulkFeedbackToast('📥 Product catalog exported to CSV successfully!');
                    setTimeout(() => setBulkFeedbackToast(null), 3500);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 hover:border-[#FF2E93] text-stone-800 dark:text-white transition-all shadow-2xs cursor-pointer"
                  title="Export full product catalog inventory to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF2E93]" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => {
                    setShowQuickPasteBox(true);
                    setIsAddProductOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#FFF0F5] hover:bg-[#ffe4ee] text-[#FF2E93] border border-[#FF2E93]/40 transition-all shadow-2xs cursor-pointer"
                  title="Quickly Paste Product text or JSON to auto-fill all fields"
                >
                  <Sparkles className="w-4 h-4 text-[#FF2E93]" />
                  <span>✨ Quick Paste & Add</span>
                </button>

                <button
                  onClick={() => {
                    setShowQuickPasteBox(false);
                    setIsAddProductOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#881337] dark:bg-[#FF2E93] text-white hover:bg-[#700f2d] dark:hover:bg-[#e02680] transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Keepsake</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-[#181418] p-4 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                {/* Search */}
                <div className="lg:col-span-5 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Search by product name, slug, or category..."
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white placeholder-stone-500 focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
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

                {/* Category Filter Dropdown */}
                <div className="lg:col-span-4">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
                  >
                    <option value="All">All 7 Collections & Gifts ({products.length})</option>
                    {SEVEN_COLLECTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Status Filter */}
                <div className="lg:col-span-3">
                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
                  >
                    <option value="All">All Stock Levels</option>
                    <option value="in_stock">🟢 In Stock Only</option>
                    <option value="low_stock">🟡 Low Stock Only</option>
                    <option value="out_of_stock">🔴 Out of Stock Only</option>
                  </select>
                </div>
              </div>

              {/* Sub-bar with selection counter and quick select-all button */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F3E8E2] dark:border-stone-800/80 text-xs">
                <div className="flex items-center gap-2 text-stone-500">
                  <span>
                    Showing <strong className="text-stone-900 dark:text-white font-bold">{filteredProducts.length}</strong> of{' '}
                    <strong className="text-stone-900 dark:text-white font-bold">{products.length}</strong> items
                  </span>
                  {selectedProductIds.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#FF2E93] font-bold text-[11px] border border-[#FF2E93]/30">
                      {selectedProductIds.length} Selected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-[#FF2E93] transition-colors cursor-pointer flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-[#FF2E93]" />
                    <span>{allFilteredSelected ? 'Deselect All Filtered' : `Select All Filtered (${filteredProducts.length})`}</span>
                  </button>

                  {selectedProductIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedProductIds([])}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bulk Mode Active Guide Banner */}
            {isBulkEditMode && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF0F5] via-[#FFF9EB] to-[#FFF0F5] border border-[#FF2E93]/30 text-xs text-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FF2E93] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Zap className="w-4 h-4 text-[#FFD94A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 flex items-center gap-2">
                      Bulk Editing Mode Active
                    </h4>
                    <p className="text-stone-600 text-[11px]">
                      Check the boxes beside the products you want to modify, then click <strong>Bulk Edit</strong> or the quick stock buttons to apply simultaneous updates to price, category, or inventory.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#FF2E93]/40 text-stone-800 hover:text-[#FF2E93] font-bold text-xs shadow-xs cursor-pointer"
                  >
                    {allFilteredSelected ? 'Deselect All' : `Select All (${filteredProducts.length})`}
                  </button>
                  {selectedProductIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsBulkEditModalOpen(true)}
                      className="px-4 py-1.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Edit {selectedProductIds.length} Items</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Products Catalog Table with Checkboxes */}
            <div className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] dark:bg-[#1C181C] text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-[#EFE7DE] dark:border-[#2C242A]">
                      <th className="py-3.5 px-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={allFilteredSelected && filteredProducts.length > 0}
                          onChange={handleToggleSelectAll}
                          aria-label="Select all products"
                          className="w-4 h-4 rounded text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-4">Item & Category</th>
                      <th className="py-3.5 px-4">Price & MRP</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4">Rating & Proof</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DE] dark:divide-[#282127]">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                          <p className="font-bold text-sm">No products matched your filters</p>
                          <p className="text-xs mt-1">Try resetting the category or search query.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p, idx) => {
                        const isSelected = selectedProductIds.includes(p.id);
                        const isInStock = p.inStock !== false && p.stockStatus !== 'out_of_stock';
                        const isLowStock = p.stockStatus === 'low_stock';

                        return (
                          <tr
                            key={p.id}
                            className={`transition-colors ${
                              isSelected
                                ? 'bg-[#FFF0F5] dark:bg-[#321323]/50 border-l-4 border-l-[#FF2E93]'
                                : idx % 2 === 0
                                ? 'bg-white dark:bg-[#181418] hover:bg-[#FAF7F2] dark:hover:bg-stone-900/60'
                                : 'bg-[#FAF7F2]/40 dark:bg-stone-950/30 hover:bg-[#FAF7F2] dark:hover:bg-stone-900/60'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-4 px-4 text-center align-middle">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectProduct(p.id)}
                                aria-label={`Select ${p.name}`}
                                className="w-4 h-4 rounded text-[#FF2E93] focus:ring-[#FF2E93] cursor-pointer"
                              />
                            </td>

                            {/* Item & Category */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-stone-100 border border-[#EFE7DE] overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                                  {p.images && p.images[0] && (p.images[0].startsWith('http') || p.images[0].startsWith('data:') || p.images[0].startsWith('/') || p.images[0].startsWith('blob:')) ? (
                                    <img
                                      src={p.images[0]}
                                      alt={p.name}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/images/founder/founder_sonu_real_1791375717528.jpg';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center p-0.5 bg-[#FFFDF8]">
                                      <PhoneCaseMockup product={p} className="w-full h-full scale-90" />
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <div className="font-bold text-sm text-stone-900 dark:text-white leading-tight">
                                    {p.name}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF2E93]/10 text-[#FF2E93] border border-[#FF2E93]/20">
                                      {p.category}
                                    </span>
                                    {p.badge && (
                                      <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-[#FFD94A]/20 text-stone-800 dark:text-[#FFD94A]">
                                        {p.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Price & MRP */}
                            <td className="py-4 px-4 align-top">
                              <div className="font-mono font-bold text-sm text-stone-900 dark:text-white tabular-nums">
                                ₹{p.price.toLocaleString('en-IN')}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-stone-400 line-through font-mono tabular-nums">
                                  ₹{p.mrp.toLocaleString('en-IN')}
                                </span>
                                {p.mrp > p.price && (
                                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                    {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Stock Status with 1-Click Toggle */}
                            <td className="py-4 px-4 align-top">
                              <button
                                type="button"
                                onClick={() => handleSingleStockToggle(p)}
                                title="Click to toggle stock status"
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                                  !isInStock
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60'
                                    : isLowStock
                                    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                <span>
                                  {!isInStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                                </span>
                                <span className="text-[9px] opacity-70 underline ml-0.5">toggle</span>
                              </button>
                            </td>

                            {/* Rating & Proof */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-center gap-1 font-bold text-stone-800 dark:text-stone-200">
                                <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                                <span>{p.rating}</span>
                                <span className="text-stone-400 font-normal">({p.reviewCount})</span>
                              </div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 mt-1">
                                <Check className="w-2.5 h-2.5 text-emerald-600" /> Bespoke
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 align-top text-right space-x-1">
                              <button
                                onClick={() => handleDuplicateProduct(p)}
                                className="p-1.5 rounded-lg text-stone-600 hover:text-[#FF2E93] hover:bg-[#FFF0F5] transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-xs"
                                title="Duplicate / Copy Product to create new variant"
                              >
                                <Copy className="w-3.5 h-3.5 text-[#D97706]" />
                                <span className="hidden sm:inline text-[11px]">Copy</span>
                              </button>
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 rounded-lg text-stone-700 hover:text-[#FF2E93] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-xs"
                                title="Edit Product & Photos"
                              >
                                <Edit3 className="w-4 h-4 text-[#FF2E93]" />
                                <span className="hidden sm:inline text-[11px]">Edit</span>
                              </button>
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* STICKY FLOATING BULK ACTIONS BAR (When products are selected) */}
            {selectedProductIds.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl bg-[#171413]/95 backdrop-blur-xl border border-stone-700/80 text-white p-3.5 sm:px-6 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#FF2E93] text-white font-bold text-xs flex items-center justify-center font-mono">
                    {selectedProductIds.length}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {selectedProductIds.length} Keepsakes Selected
                    </div>
                    <div className="text-[10px] text-[#FFD94A]">Ready for simultaneous update</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Quick Stock Status Buttons */}
                  <div className="hidden sm:flex items-center gap-1 bg-stone-900/90 border border-stone-800 rounded-xl p-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleQuickStockUpdate('in_stock')}
                      className="px-2.5 py-1 rounded-lg hover:bg-emerald-950 text-emerald-400 font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Set all selected to In Stock"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>In Stock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStockUpdate('out_of_stock')}
                      className="px-2.5 py-1 rounded-lg hover:bg-rose-950 text-rose-400 font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Set all selected to Out of Stock"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>Out of Stock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStockUpdate('low_stock')}
                      className="px-2.5 py-1 rounded-lg hover:bg-amber-950 text-amber-400 font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Set all selected to Low Stock"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Low Stock</span>
                    </button>
                  </div>

                  {/* Primary Comprehensive Bulk Edit Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsBulkEditModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>⚡ Bulk Edit Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProductIds([])}
                    className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                    title="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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
        {activeTab === 'reviews' && (() => {
          const pendingReviews = allReviewsFromDb.filter((r) => r.status === 'pending');
          const approvedDbReviews = allReviewsFromDb.filter((r) => r.status === 'approved');

          return (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#C5A059]" /> Client Reviews Moderation & Social Proof
                  </h3>
                  <p className="text-xs text-stone-500">
                    Moderate incoming patron testimonials from Supabase, approve to publish, or reject spam
                  </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  {pendingReviews.length > 0 && (
                    <div className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-xl">
                      <span className="font-serif text-lg font-bold text-amber-900 dark:text-amber-200 tabular-nums">
                        {pendingReviews.length}
                      </span>
                      <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Awaiting Approval</p>
                    </div>
                  )}
                  <div>
                    <span className="font-serif text-2xl font-bold text-stone-900 dark:text-white tabular-nums">
                      {allReviewsList.length + approvedDbReviews.length}
                    </span>
                    <p className="text-xs text-stone-500">Live Approved</p>
                  </div>
                  <button
                    onClick={() => {
                      loadAllReviews();
                      refreshReviews();
                    }}
                    className="p-2 border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    title="Refresh Reviews"
                  >
                    <RefreshCw className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                  </button>
                </div>
              </div>

              {/* PENDING REVIEWS QUEUE */}
              {pendingReviews.length > 0 && (
                <div className="bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800/60 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <h4 className="font-serif font-bold text-base">Reviews Awaiting Atelier Moderation ({pendingReviews.length})</h4>
                    </div>
                    <span className="text-xs text-amber-700 dark:text-amber-400">
                      Submitted by logged-in users; requires admin approval before public display
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingReviews.map((rev) => {
                      const prod = products.find((p) => p.id === rev.product_id);
                      return (
                        <div
                          key={rev.id}
                          className="bg-white dark:bg-[#181418] rounded-2xl border border-amber-200 dark:border-amber-900 p-4 shadow-sm flex flex-col justify-between gap-3"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-[#C5A059]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < (Number(rev.rating) || 5) ? 'fill-[#C5A059]' : 'text-stone-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                Pending
                              </span>
                            </div>

                            {rev.title && (
                              <h5 className="font-bold text-xs text-stone-900 dark:text-white">
                                {rev.title}
                              </h5>
                            )}

                            <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                              "{rev.comment}"
                            </p>

                            <div className="text-[11px] text-stone-500 pt-1">
                              <strong>{rev.author || 'Patron'}</strong> · Item: <span className="text-[#881337] dark:text-[#FB7185] font-semibold">{prod?.name || rev.product_id}</span>
                              {rev.created_at && <span className="text-[10px] text-stone-400 block mt-0.5">{new Date(rev.created_at).toLocaleString()}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                            <button
                              onClick={() => handleApproveReview(rev.id)}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                            </button>
                            <button
                              onClick={() => handleDeleteReviewRow(rev.id, rev.product_id)}
                              className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-bold text-xs transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LIVE APPROVED REVIEWS */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-stone-700 dark:text-stone-300">
                  Published & Live Testimonials
                </h4>
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
                        onClick={() => handleDeleteReviewRow(rev.id, rev.productId)}
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
          );
        })()}

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

        {/* ============================================================ */}
        {/* TAB 9: BESPOKE PERSONALIZATION REQUESTS */}
        {/* ============================================================ */}
        {activeTab === 'personalization' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#181418] p-5 rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#881337] dark:text-[#FB7185]" /> Bespoke Personalization Pipeline
                </h3>
                <p className="text-xs text-stone-500">
                  Custom name engravings, anniversary dates, and bespoke jewelry inquiries stored in Supabase
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-bold text-stone-700 dark:text-stone-300">
                  {personalizationRequests.length} Custom Orders
                </span>
                <button
                  onClick={loadPersonalizationRequests}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#181418] rounded-2xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] dark:bg-[#201A20] text-stone-500 border-b border-[#EFE7DE] dark:border-[#2C242A]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Request ID & Date</th>
                      <th className="py-3 px-4 font-bold">Patron / Contact</th>
                      <th className="py-3 px-4 font-bold">Category & Style</th>
                      <th className="py-3 px-4 font-bold">Engraving / Custom Text</th>
                      <th className="py-3 px-4 font-bold">Special Notes</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DE] dark:divide-[#2C242A]">
                    {personalizationRequests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          <Sparkles className="w-8 h-8 mx-auto mb-2 text-stone-300 stroke-1" />
                          No bespoke personalization requests logged yet.
                        </td>
                      </tr>
                    ) : (
                      personalizationRequests.map((req: any) => {
                        const data = req.data || {};
                        const dateStr = req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Recent';
                        const customer = data.customerName || data.name || 'Valued Patron';
                        const phone = data.customerPhone || data.phone || '';
                        const category = data.category || data.preferredCategory || 'Bespoke Jewelry';
                        const theme = data.theme || data.preferredTheme || '';
                        const text = data.customText || data.customNames || 'No text specified';
                        const notes = data.customRequirements || data.specialRequirements || 'Standard crafting';

                        return (
                          <tr key={req.id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#201A20]/60 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-mono text-[11px] font-bold text-stone-900 dark:text-stone-200 block">
                                #{String(req.id).slice(0, 8)}
                              </span>
                              <span className="text-[10px] text-stone-400">{dateStr}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-stone-900 dark:text-stone-200 block">{customer}</span>
                              {phone && (
                                <a
                                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                  <span>📞 {phone}</span>
                                </a>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-stone-800 dark:text-stone-200 block">{category}</span>
                              {theme && <span className="text-[10px] text-stone-400">Style: {theme}</span>}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 bg-[#FFF9EB] dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-lg font-mono text-[11px] font-bold border border-amber-200 dark:border-amber-900 inline-block">
                                "{text}"
                              </span>
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate text-stone-600 dark:text-stone-400">
                              {notes}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  req.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : req.status === 'Reviewing' || req.status === 'Crafting'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                                }`}
                              >
                                {req.status || 'Pending'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {req.status !== 'Completed' && (
                                  <button
                                    onClick={() => handleUpdatePersonalizationStatus(req.id, 'Completed')}
                                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                                  >
                                    Mark Done
                                  </button>
                                )}
                                {req.status === 'Pending' && (
                                  <button
                                    onClick={() => handleUpdatePersonalizationStatus(req.id, 'Crafting')}
                                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer"
                                  >
                                    In Crafting
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
      {/* MODAL: ADD NEW PRODUCT (WITH SMART QUICK-PASTE & CLIPBOARD AUTO-FILL) */}
      {/* ============================================================ */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-xl rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 space-y-4 animate-in fade-in duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF2E93] text-white flex items-center justify-center shadow-xs font-serif-heading font-black text-sm">
                  DE
                </div>
                <div>
                  <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                    Add New Product
                  </h3>
                  <p className="text-[11px] text-[#FF2E93] font-semibold">
                    Instant Real-Time Sync to Storefront & Home Page
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Smart Quick Paste & Auto-Fill Accelerator */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE] space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#211D1C]">
                  <Sparkles className="w-4 h-4 text-[#FF2E93]" />
                  <span>✨ Quick Paste Product Data & Auto-Fill</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickPasteBox(!showQuickPasteBox)}
                  className="text-[11px] font-bold text-[#FF2E93] hover:underline cursor-pointer"
                >
                  {showQuickPasteBox ? 'Hide Box ▲' : 'Open Paste Box ▼'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteDetailsFromClipboard}
                  className="px-3 py-1.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                  title="Reads text or JSON from your clipboard and fills all fields automatically"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>📋 Paste & Auto-Fill from Clipboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const sample = `Name: 18k Rose Gold Micro-Engraved Name Pendant\nPrice: 1299\nMRP: 2499\nCategory: Personalized Name Jewelry\nBadge: Best Seller\nDescription: Handcrafted 18k gold vermeil necklace with micro-laser precision engraving.\nImage: https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80`;
                    setQuickPasteText(sample);
                    setShowQuickPasteBox(true);
                    handleApplyQuickPasteText(sample);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-[#F5E6CE] text-[#211D1C] hover:border-[#FF2E93] font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                >
                  Insert Sample Template
                </button>
              </div>

              {showQuickPasteBox && (
                <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                  <textarea
                    rows={4}
                    value={quickPasteText}
                    onChange={(e) => setQuickPasteText(e.target.value)}
                    placeholder="Paste product info from WhatsApp, Excel, supplier sheets, or JSON here...&#10;e.g.&#10;Name: Preserved Rose Dome&#10;Price: 1499&#10;MRP: 2999&#10;Category: Preserved Eternal Roses & Dome Displays&#10;Badge: Trending&#10;Description: Real preserved rose in ambient glass bell jar.&#10;Image: https://images.unsplash.com/..."
                    className="w-full bg-white border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl p-2.5 text-xs text-[#211D1C] placeholder:text-stone-400 font-mono outline-none shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyQuickPasteText()}
                    className="w-full py-2 rounded-xl bg-[#211D1C] hover:bg-black text-[#FFD94A] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-[#FFD94A]" />
                    <span>Apply & Auto-Fill Fields</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. 18k Rose Gold Handwriting Script Locket"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Collection / Category *</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                  >
                    <optgroup label="🌟 7 Official Store Collections">
                      {SEVEN_COLLECTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
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
                      <option value="Personalized Phone Cases & Pocket Accessories">Personalized Phone Cases & Pocket Accessories</option>
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Promotional Badge</label>
                  <input
                    type="text"
                    value={newProductBadge}
                    onChange={(e) => setNewProductBadge(e.target.value)}
                    placeholder="e.g. Best Seller, Atelier Special, Limited"
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 font-mono text-[#211D1C] font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">MRP / List Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductMrp}
                    onChange={(e) => setNewProductMrp(Number(e.target.value))}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 font-mono text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              {/* Product Image Paste & Upload Suite */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#211D1C] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#FF2E93]" />
                    <span>Product Image (Paste or Upload)</span>
                  </label>
                  <span className="text-[10px] text-[#FF2E93] font-medium">Auto-syncs to Home Page</span>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePasteImageFromClipboard(setNewProductCustomImage)}
                    className="px-3 py-1.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>📋 Paste from Clipboard</span>
                  </button>

                  <label className="px-3 py-1.5 rounded-xl bg-[#211D1C] hover:bg-black text-white text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors">
                    <ImagePlus className="w-3.5 h-3.5 text-[#FFD94A]" />
                    <span>📁 Upload from Device</span>
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
                              setNewProductCustomImage(evt.target.result as string);
                              setBulkFeedbackToast('📁 Image file uploaded!');
                              setTimeout(() => setBulkFeedbackToast(null), 3000);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {newProductCustomImage && (
                    <button
                      type="button"
                      onClick={() => setNewProductCustomImage('')}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* Direct Image URL or Ctrl+V Paste Drop Box */}
                <div
                  onPaste={(e) => handleContainerPaste(e, setNewProductCustomImage)}
                  className="relative"
                >
                  <input
                    type="text"
                    value={newProductCustomImage}
                    onChange={(e) => setNewProductCustomImage(e.target.value)}
                    onPaste={(e) => handleContainerPaste(e, setNewProductCustomImage)}
                    placeholder="Click here & press Ctrl+V to paste image, or enter image link..."
                    className="w-full bg-white border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] text-xs placeholder:text-stone-400 outline-none"
                  />
                </div>

                {/* Live Preview Card */}
                {newProductCustomImage ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-emerald-300">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#F3E8E2] bg-stone-100 shrink-0 shadow-xs flex items-center justify-center p-0.5">
                      <img
                        src={newProductCustomImage}
                        alt="Product Preview"
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full object-contain rounded-lg"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/founder/founder_sonu_real_1791375717528.jpg';
                        }}
                      />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Image Attached Successfully</span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        This photo will render across all Home Page grids, category sliders, and product details.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-stone-500 italic">
                    💡 Tip: You can copy any photo in your browser or screenshot, click "Paste from Clipboard" or press Ctrl+V to attach it.
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Description</label>
                <textarea
                  rows={2}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Handcrafted luxury keepsake customized with laser precision..."
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-white border border-[#F3E8E2] text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Create & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT SINGLE PRODUCT (NAME, PRICE, CATEGORY, IMAGE PASTE/UPLOAD) */}
      {/* ============================================================ */}
      {isEditProductOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#FFFDF8] w-full max-w-lg rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8E2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF2E93] text-white flex items-center justify-center shadow-xs">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                    Edit Product & Photos
                  </h3>
                  <p className="text-[11px] text-[#FF2E93] font-mono font-bold">ID: {editingProduct.id}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditProductOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editProductName}
                  onChange={(e) => setEditProductName(e.target.value)}
                  placeholder="Product name"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Collection / Category *</label>
                  <select
                    value={editProductCategory}
                    onChange={(e) => setEditProductCategory(e.target.value as any)}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                  >
                    <optgroup label="🌟 7 Official Store Collections">
                      {SEVEN_COLLECTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
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
                      <option value="Personalized Phone Cases & Pocket Accessories">Personalized Phone Cases & Pocket Accessories</option>
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Stock Status</label>
                  <select
                    value={editProductStock}
                    onChange={(e) => setEditProductStock(e.target.value as any)}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] font-semibold outline-none"
                  >
                    <option value="in_stock">🟢 In Stock</option>
                    <option value="low_stock">🟡 Low Stock</option>
                    <option value="out_of_stock">🔴 Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editProductPrice}
                    onChange={(e) => setEditProductPrice(Number(e.target.value))}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 font-mono text-[#211D1C] font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#211D1C]">MRP / List Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editProductMrp}
                    onChange={(e) => setEditProductMrp(Number(e.target.value))}
                    className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 font-mono text-[#211D1C] outline-none"
                  />
                </div>
              </div>

              {/* Edit Image Upload & Paste Block */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#211D1C] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#FF2E93]" />
                    <span>Product Image (Paste or Upload)</span>
                  </label>
                  <span className="text-[10px] text-[#FF2E93] font-medium">Real-Time Sync</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePasteImageFromClipboard(setEditProductImage)}
                    className="px-3 py-1.5 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>📋 Paste from Clipboard</span>
                  </button>

                  <label className="px-3 py-1.5 rounded-xl bg-[#211D1C] hover:bg-black text-white text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors">
                    <ImagePlus className="w-3.5 h-3.5 text-[#FFD94A]" />
                    <span>📁 Upload Image</span>
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
                              setEditProductImage(evt.target.result as string);
                              setBulkFeedbackToast('📁 New photo attached!');
                              setTimeout(() => setBulkFeedbackToast(null), 3000);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {editProductImage && (
                    <button
                      type="button"
                      onClick={() => setEditProductImage('')}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div
                  onPaste={(e) => handleContainerPaste(e, setEditProductImage)}
                  className="relative"
                >
                  <input
                    type="text"
                    value={editProductImage}
                    onChange={(e) => setEditProductImage(e.target.value)}
                    onPaste={(e) => handleContainerPaste(e, setEditProductImage)}
                    placeholder="Click & press Ctrl+V to paste image, or enter image link..."
                    className="w-full bg-white border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] text-xs placeholder:text-stone-400 outline-none"
                  />
                </div>

                {editProductImage && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-emerald-300">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#F3E8E2] bg-stone-100 shrink-0 shadow-xs flex items-center justify-center p-0.5">
                      <img
                        src={editProductImage}
                        alt="Preview"
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full object-contain rounded-lg"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/founder/founder_sonu_real_1791375717528.jpg';
                        }}
                      />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Image Attached</span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Updates in real-time across Home Page and catalog.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Promotional Badge</label>
                <input
                  type="text"
                  value={editProductBadge}
                  onChange={(e) => setEditProductBadge(e.target.value)}
                  placeholder="e.g. Best Seller, Limited"
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#211D1C]">Description</label>
                <textarea
                  rows={2}
                  value={editProductDesc}
                  onChange={(e) => setEditProductDesc(e.target.value)}
                  placeholder="Product description..."
                  className="w-full bg-[#FFF9EB] border border-[#F5E6CE] focus:border-[#FF2E93] rounded-xl px-3 py-2 text-[#211D1C] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F3E8E2]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditProductOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-xl font-bold bg-white border border-[#F3E8E2] text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Save & Update Storefront
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

        {/* ============================================================ */}
        {/* TAB: PRODUCTION KANBAN QUEUE */}
        {/* ============================================================ */}
        {activeTab === 'production' && (
          <div className="animate-in fade-in duration-150">
            <ProductionQueue />
          </div>
        )}

      {/* ============================================================ */}
      {/* MODAL: BULK EDITING SUITE (PRICE, CATEGORY, STOCK) */}
      {/* ============================================================ */}
      {isBulkEditModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-[#181418] w-full max-w-2xl rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#EFE7DE] dark:border-[#282127]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF2E93] text-white flex items-center justify-center shadow-xs">
                  <SlidersHorizontal className="w-5 h-5 text-[#FFD94A]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white">
                    Bulk Edit Products
                  </h3>
                  <p className="text-xs text-stone-500">
                    Updating <strong className="text-[#FF2E93]">{selectedProductIds.length}</strong> selected products simultaneously
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkEditModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Products Preview Chips */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-stone-900/60 border border-[#EFE7DE] dark:border-stone-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                Target Keepsakes:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {selectedProductIds.map((id) => {
                  const p = products.find((prod) => prod.id === id);
                  if (!p) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 shadow-2xs"
                    >
                      <span className="truncate max-w-[150px]">{p.name}</span>
                      <span className="text-stone-400 font-mono text-[10px]">₹{p.price}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleApplyBulkUpdate} className="space-y-6 text-xs">
              {/* SECTION 1: PRICE & MRP UPDATE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] dark:bg-stone-900/40 border border-[#F3E8E2] dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#FF2E93]" />
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                    1. Price & MRP Modification
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300 block">
                      Price Action
                    </label>
                    <select
                      value={bulkPriceAction}
                      onChange={(e) => setBulkPriceAction(e.target.value as any)}
                      className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-semibold text-stone-900 dark:text-white"
                    >
                      <option value="keep">Keep Current Selling Prices</option>
                      <option value="fixed">Set Exact Selling Price (₹)</option>
                      <option value="percent_discount">Apply Percentage Discount (-%)</option>
                      <option value="percent_increase">Apply Percentage Increase (+%)</option>
                      <option value="flat_discount">Apply Flat Discount (-₹)</option>
                      <option value="flat_increase">Apply Flat Increase (+₹)</option>
                    </select>
                  </div>

                  {bulkPriceAction !== 'keep' && (
                    <div className="space-y-1 animate-in fade-in">
                      <label className="font-bold text-stone-700 dark:text-stone-300 block">
                        {bulkPriceAction === 'fixed'
                          ? 'New Selling Price (₹) *'
                          : bulkPriceAction.startsWith('percent')
                          ? 'Percentage (%) *'
                          : 'Flat Amount (₹) *'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={bulkPriceValue || ''}
                        onChange={(e) => setBulkPriceValue(Number(e.target.value))}
                        placeholder={bulkPriceAction === 'fixed' ? 'e.g. 799' : 'e.g. 15'}
                        className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-mono text-stone-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>

                {/* Optional MRP override */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bulkUpdateMrp}
                      onChange={(e) => setBulkUpdateMrp(e.target.checked)}
                      className="w-4 h-4 rounded text-[#FF2E93] focus:ring-[#FF2E93]"
                    />
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      Also set new MRP / List Price
                    </span>
                  </label>

                  {bulkUpdateMrp && (
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">₹</span>
                      <input
                        type="number"
                        min="1"
                        value={bulkMrpValue || ''}
                        onChange={(e) => setBulkMrpValue(Number(e.target.value))}
                        placeholder="e.g. 1599"
                        className="w-32 bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-1 font-mono text-stone-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: CATEGORY / COLLECTION REASSIGNMENT */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] dark:bg-stone-900/40 border border-[#F3E8E2] dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF2E93]" />
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                    2. Category & Collection Reassignment
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300 block">
                      Category Action
                    </label>
                    <select
                      value={bulkCategoryAction}
                      onChange={(e) => setBulkCategoryAction(e.target.value as any)}
                      className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-semibold text-stone-900 dark:text-white"
                    >
                      <option value="keep">Keep Current Categories</option>
                      <option value="set">Reassign to Official Collection</option>
                    </select>
                  </div>

                  {bulkCategoryAction === 'set' && (
                    <div className="space-y-1 animate-in fade-in">
                      <label className="font-bold text-stone-700 dark:text-stone-300 block">
                        Select Collection Target *
                      </label>
                      <select
                        value={bulkTargetCategory}
                        onChange={(e) => setBulkTargetCategory(e.target.value as any)}
                        className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-2 font-semibold text-stone-900 dark:text-white text-xs"
                      >
                        {SEVEN_COLLECTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: INVENTORY / STOCK STATUS UPDATE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] dark:bg-stone-900/40 border border-[#F3E8E2] dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#FF2E93]" />
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                    3. Inventory & Stock Status
                  </h4>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300 block">
                    Stock Action
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'keep', label: 'Keep Current' },
                      { id: 'in_stock', label: '🟢 In Stock' },
                      { id: 'low_stock', label: '🟡 Low Stock' },
                      { id: 'out_of_stock', label: '🔴 Out of Stock' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setBulkStockAction(st.id as any)}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                          bulkStockAction === st.id
                            ? 'bg-[#211D1C] dark:bg-white text-white dark:text-stone-900 border-[#211D1C] dark:border-white shadow-xs'
                            : 'bg-white dark:bg-stone-900 border-[#EFE7DE] dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-[#FF2E93]'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LIVE ACTION SUMMARY BOX */}
              <div className="p-4 rounded-2xl bg-[#FFF9EB] dark:bg-stone-900 border border-[#FFD94A]/40 text-xs text-stone-800 dark:text-stone-200 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF2E93]" />
                  <span>Update Summary for {selectedProductIds.length} Items:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-stone-600 dark:text-stone-300">
                  <li>
                    <strong>Price:</strong>{' '}
                    {bulkPriceAction === 'keep'
                      ? 'No change to price'
                      : bulkPriceAction === 'fixed'
                      ? `Set selling price to ₹${bulkPriceValue}`
                      : bulkPriceAction === 'percent_discount'
                      ? `Apply ${bulkPriceValue}% discount`
                      : bulkPriceAction === 'percent_increase'
                      ? `Increase price by ${bulkPriceValue}%`
                      : bulkPriceAction === 'flat_discount'
                      ? `Discount flat ₹${bulkPriceValue}`
                      : `Increase price by flat ₹${bulkPriceValue}`}
                    {bulkUpdateMrp && ` (MRP: ₹${bulkMrpValue})`}
                  </li>
                  <li>
                    <strong>Category:</strong>{' '}
                    {bulkCategoryAction === 'keep'
                      ? 'No change to categories'
                      : `Reassign to "${bulkTargetCategory}"`}
                  </li>
                  <li>
                    <strong>Stock:</strong>{' '}
                    {bulkStockAction === 'keep'
                      ? 'No change to inventory status'
                      : bulkStockAction === 'in_stock'
                      ? 'Mark as Available / In Stock'
                      : bulkStockAction === 'low_stock'
                      ? 'Mark as Low Stock'
                      : 'Mark as Sold Out / Out of Stock'}
                  </li>
                </ul>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EFE7DE] dark:border-[#282127]">
                <button
                  type="button"
                  onClick={() => setIsBulkEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#FF2E93] hover:bg-[#e02680] text-white shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-[#FFD94A]" />
                  <span>Apply Bulk Update ({selectedProductIds.length})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating feedback notification toast */}
      {bulkFeedbackToast && (
        <div className="fixed top-20 right-6 z-[70] bg-[#171413] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#FF2E93] flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-[#FFD94A] shrink-0" />
          <span className="text-xs font-bold">{bulkFeedbackToast}</span>
          <button
            onClick={() => setBulkFeedbackToast(null)}
            className="text-stone-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mobile Sticky Quick Navigation Dock */}
      <nav aria-label="Mobile Dashboard Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#171413]/95 backdrop-blur-md border-t border-stone-800 px-2 py-2 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'text-[#FF2E93] bg-[#FF2E93]/10'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`relative flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'text-[#FF2E93] bg-[#FF2E93]/10'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders</span>
          {orders.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#FF2E93]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'text-[#FF2E93] bg-[#FF2E93]/10'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('media-cms')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'media-cms'
              ? 'text-[#FF2E93] bg-[#FF2E93]/10'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Media</span>
        </button>

        <button
          onClick={() => setIsAdminMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-extrabold py-1 px-2 text-[#FFD94A] hover:text-amber-300 rounded-xl bg-[#211D1C] border border-[#FFD94A]/30 transition-all cursor-pointer shadow-xs"
        >
          <Menu className="w-4 h-4 stroke-[2.5]" />
          <span>Menu</span>
        </button>
      </nav>

      {/* ============================================================ */}
      {/* MODAL: BULK PRODUCT IMAGE IMPORTER */}
      {/* ============================================================ */}
      {isBulkImageImporterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#181418] w-full max-w-5xl rounded-3xl border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in duration-200">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#EFE7DE] dark:border-[#282127] flex items-center justify-between bg-[#FAF7F2] dark:bg-[#1C181C]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF2E93] text-white flex items-center justify-center shadow-md">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-white flex items-center gap-2">
                    <span>Bulk Image to Product Importer</span>
                    {bulkImageItems.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF2E93] text-white font-mono">
                        {bulkImageItems.length} Ready
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Upload multiple product photos or paste image links to batch-create catalog items in seconds.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBulkImageImporterOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar text-xs">
              {/* Drag & Drop Upload Zone + Paste Buttons */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Drag and Drop File Input Area */}
                <div className="lg:col-span-7">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOverBulk(true);
                    }}
                    onDragLeave={() => setIsDragOverBulk(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOverBulk(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleProcessFilesToBulkItems(e.dataTransfer.files);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[160px] ${
                      isDragOverBulk
                        ? 'border-[#FF2E93] bg-[#FFF0F5] dark:bg-[#321323]/50 scale-[1.01]'
                        : 'border-[#EFE7DE] dark:border-stone-800 bg-[#FAF7F2]/60 dark:bg-stone-900/40 hover:border-[#FF2E93] hover:bg-[#FFF0F5]/50'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleProcessFilesToBulkItems(e.target.files);
                        }
                      }}
                    />
                    <div className="w-12 h-12 rounded-2xl bg-[#FF2E93]/10 text-[#FF2E93] flex items-center justify-center mb-2 shadow-xs">
                      <ImagePlus className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-stone-900 dark:text-white text-sm">
                      Drop Bulk Product Photos Here
                    </h4>
                    <p className="text-stone-500 text-[11px] mt-1 max-w-xs">
                      Select multiple JPG, PNG, or WebP files at once from your computer or phone.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-[#FF2E93] font-bold text-xs border border-[#FF2E93]/30 shadow-2xs">
                      <ImagePlus className="w-3.5 h-3.5" />
                      Browse Files
                    </span>
                  </div>
                </div>

                {/* Quick Paste & Clipboard Tools */}
                <div className="lg:col-span-5 bg-[#FAF7F2] dark:bg-stone-900/60 p-4 rounded-2xl border border-[#EFE7DE] dark:border-stone-800 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <Clipboard className="w-4 h-4 text-[#FF2E93]" />
                      <span>Paste Image Links or Clipboard</span>
                    </h4>
                    <p className="text-stone-500 text-[11px]">
                      Paste multiple image URLs (one per line) or directly paste image files copied to your clipboard.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={pastedImageUrlsText}
                      onChange={(e) => setPastedImageUrlsText(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                      className="w-full bg-white dark:bg-stone-950 border border-[#EFE7DE] dark:border-stone-800 rounded-xl p-2.5 text-[11px] font-mono text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#FF2E93]"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleParseImageUrlsTextToBulk}
                        className="flex-1 py-2 px-3 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
                        <span>Add Links</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePasteFromClipboardToBulk}
                        className="py-2 px-3 rounded-xl bg-[#FFF0F5] text-[#FF2E93] border border-[#FF2E93]/40 font-bold text-xs hover:bg-[#ffe4ee] transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Clipboard className="w-3.5 h-3.5" />
                        <span>Clipboard</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Batch Settings Bar */}
              <div className="bg-gradient-to-r from-[#FFF0F5] via-[#FFF9EB] to-[#FFF0F5] dark:from-[#2A1320] dark:via-[#261E1A] dark:to-[#2A1320] p-4 rounded-2xl border border-[#FF2E93]/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-2 text-xs">
                    <Zap className="w-4 h-4 text-[#FF2E93]" />
                    <span>Batch Product Controls (Apply Settings Across All Items)</span>
                  </h4>
                  {bulkImageItems.length > 0 && (
                    <button
                      type="button"
                      onClick={handleApplyBatchSettingsToAll}
                      className="px-3 py-1 rounded-xl bg-[#FF2E93] hover:bg-[#e02680] text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Apply to All {bulkImageItems.length} Items</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300 text-[11px]">Category</label>
                    <select
                      value={batchCategory}
                      onChange={(e) => setBatchCategory(e.target.value as any)}
                      className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-1.5 font-semibold text-stone-900 dark:text-white focus:outline-none"
                    >
                      {SEVEN_COLLECTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300 text-[11px]">Offer Price (₹)</label>
                    <input
                      type="number"
                      value={batchPrice}
                      onChange={(e) => setBatchPrice(Number(e.target.value))}
                      className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-1.5 font-mono font-bold text-stone-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300 text-[11px]">List MRP (₹)</label>
                    <input
                      type="number"
                      value={batchMrp}
                      onChange={(e) => setBatchMrp(Number(e.target.value))}
                      className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-1.5 font-mono font-bold text-stone-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300 text-[11px]">Promo Badge</label>
                    <input
                      type="text"
                      value={batchBadge}
                      onChange={(e) => setBatchBadge(e.target.value)}
                      placeholder="e.g. New Arrival, Best Seller"
                      className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl px-3 py-1.5 font-bold text-stone-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Items Preview & Individual Customization Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#FF2E93]" />
                    <span>Queued Products ({bulkImageItems.length})</span>
                  </h4>

                  {bulkImageItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setBulkImageItems([])}
                      className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Queued</span>
                    </button>
                  )}
                </div>

                {bulkImageItems.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-[#EFE7DE] dark:border-stone-800 bg-[#FAF7F2]/40 dark:bg-stone-900/20 text-stone-400 space-y-2">
                    <ImageIcon className="w-10 h-10 mx-auto opacity-40 text-[#FF2E93]" />
                    <p className="font-bold text-sm text-stone-700 dark:text-stone-300">
                      No bulk image items queued yet
                    </p>
                    <p className="text-xs max-w-sm mx-auto text-stone-500">
                      Use the drop zone above to select multiple photos or paste image links to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                    {bulkImageItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-[#1C181C] border border-[#EFE7DE] dark:border-[#2C242A] shadow-2xs hover:border-[#FF2E93]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        {/* Image Thumbnail & Counter */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 font-mono text-[10px] font-bold text-stone-600 dark:text-stone-300 flex items-center justify-center shrink-0">
                            #{index + 1}
                          </span>
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#EFE7DE] bg-stone-100 shrink-0 relative group">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/images/founder/founder_sonu_real_1791375717528.jpg';
                              }}
                            />
                          </div>
                        </div>

                        {/* Editable Product Name & Category */}
                        <div className="flex-1 space-y-1.5 w-full">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                            <div className="sm:col-span-7">
                              <label className="text-[10px] text-stone-400 font-bold block mb-0.5">Title / Name</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setBulkImageItems((prev) =>
                                    prev.map((i) => (i.id === item.id ? { ...i, name: val } : i))
                                  );
                                }}
                                className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-lg px-2.5 py-1 text-xs font-bold text-stone-900 dark:text-white focus:outline-none focus:border-[#FF2E93]"
                              />
                            </div>

                            <div className="sm:col-span-5">
                              <label className="text-[10px] text-stone-400 font-bold block mb-0.5">Category</label>
                              <select
                                value={item.category}
                                onChange={(e) => {
                                  const val = e.target.value as any;
                                  setBulkImageItems((prev) =>
                                    prev.map((i) => (i.id === item.id ? { ...i, category: val } : i))
                                  );
                                }}
                                className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-lg px-2 py-1 text-xs font-semibold text-stone-900 dark:text-white focus:outline-none"
                              >
                                {SEVEN_COLLECTIONS.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Editable Price & MRP */}
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="w-20">
                            <label className="text-[10px] text-stone-400 font-bold block mb-0.5">Price (₹)</label>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setBulkImageItems((prev) =>
                                  prev.map((i) => (i.id === item.id ? { ...i, price: val } : i))
                                );
                              }}
                              className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-lg px-2 py-1 text-xs font-mono font-bold text-stone-900 dark:text-white focus:outline-none"
                            />
                          </div>

                          <div className="w-20">
                            <label className="text-[10px] text-stone-400 font-bold block mb-0.5">MRP (₹)</label>
                            <input
                              type="number"
                              value={item.mrp}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setBulkImageItems((prev) =>
                                  prev.map((i) => (i.id === item.id ? { ...i, mrp: val } : i))
                                );
                              }}
                              className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-lg px-2 py-1 text-xs font-mono font-bold text-stone-900 dark:text-white focus:outline-none"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setBulkImageItems((prev) => prev.filter((i) => i.id !== item.id));
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer mt-3"
                            title="Remove from batch"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#EFE7DE] dark:border-[#282127] bg-[#FAF7F2] dark:bg-[#1C181C] flex items-center justify-between gap-3">
              <div className="text-xs text-stone-500 hidden sm:block">
                Ready to publish <strong className="text-stone-900 dark:text-white">{bulkImageItems.length}</strong> items to catalog studio.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsBulkImageImporterOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-white dark:bg-stone-800 border border-[#EFE7DE] dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handlePublishBulkProducts}
                  disabled={bulkImageItems.length === 0}
                  className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                    bulkImageItems.length > 0
                      ? 'bg-[#FF2E93] hover:bg-[#e02680] active:scale-95'
                      : 'bg-stone-300 dark:bg-stone-800 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#FFD94A]" />
                  <span>Publish All {bulkImageItems.length} Products to Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedOrderForInvoice}
        isOpen={Boolean(selectedOrderForInvoice)}
        onClose={() => setSelectedOrderForInvoice(null)}
      />
    </div>
  );
};
