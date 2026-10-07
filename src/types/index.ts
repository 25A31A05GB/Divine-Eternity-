export type GiftCategory =
  | 'Names on Gifts'
  | 'Personalized Jewellery'
  | 'Customize Your Caricature or Miniature'
  | 'Personalize Your Bouquets'
  | 'Special Hampers'
  | 'Hair Accessories'
  | 'Paradise of Jewels'
  // Backward compatibility aliases
  | 'Personalized Name Jewelry'
  | 'Preserved Eternal Roses & Dome Displays'
  | 'Custom Acrylic Song Plaques & Photo Frames'
  | 'Memory Photo Lamps & Crystal Cubes'
  | 'Engraved Wooden Gift Boxes & Keepsakes'
  | 'Romantic Couple Hampers & Scented Candle Sets'
  | 'Personalized Phone Cases & Pocket Accessories'
  | 'Zipper Wallet Case'
  | 'Bracelet Phone Case'
  | 'Gripper Phone Case'
  | 'Mirror Phone Case'
  | 'Toy Cases'
  | 'Clear Designer Case'
  | 'Designer Case';

export type PhoneBrand = 
  | 'Apple'
  | 'Samsung'
  | 'OnePlus'
  | 'Google'
  | 'Xiaomi'
  | 'Vivo'
  | 'Oppo'
  | 'Realme';

export type CaseType =
  | 'Soft Silicone & TPU'
  | 'Impact Hard Glossy'
  | 'Luxury Leather Wallet'
  | 'Metallic Chrome Mirror'
  | '18k Gold Plated Chain'
  | '925 Sterling Silver'
  | 'Rose Gold Velvet'
  | 'Walnut Hardwood'
  | 'Illuminated Acrylic';

export interface ProductVariant {
  id: string;
  name: string;
  material: string;
  inStock: boolean;
  additionalPrice?: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  phoneModelUsed?: string;
  giftTypeUsed?: string;
  likesCount: number;
}

export interface PersonalizationConfig {
  allowsText?: boolean;
  textLabel?: string;
  textPlaceholder?: string;
  textMaxLength?: number;
  allowsPhoto?: boolean;
  photoLabel?: string;
  allowsSong?: boolean;
  songPlaceholder?: string;
  artistPlaceholder?: string;
  allowsGiftMessage?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: GiftCategory;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  images: string[];
  badge?: string; // e.g. "Buy 3 Pay For 2", "Best Seller", "Most Gifted", "Valentine Special"
  isBestSeller: boolean;
  isNew?: boolean;
  themeColor: string; // Hex for visual preview
  secondaryColor: string;
  designPattern: 
    | 'pearl_bracelet'
    | 'zipper_wallet'
    | 'chrome_mirror'
    | 'clear_floral'
    | 'bow_ribbon'
    | 'squishy_toy'
    | 'vintage_cherries'
    | 'aesthetic_clouds'
    | 'golden_butterflies'
    | 'rose_quartz'
    | 'starry_night'
    | 'checkerboard_pink'
    | 'jewelry_necklace'
    | 'eternal_rose_dome'
    | 'acrylic_song_plaque'
    | 'crystal_photo_cube'
    | 'wooden_keepsake_box'
    | 'scented_candle_hamper'
    | 'names_on_gifts'
    | 'caricature_miniature'
    | 'custom_bouquet'
    | 'hair_accessories'
    | 'paradise_jewels';
  supportedBrands?: PhoneBrand[];
  variantsStock?: { [key: string]: boolean | undefined };
  allowsPersonalization: boolean;
  personalizationConfig?: PersonalizationConfig;
  inStock?: boolean;
  stockStatus?: 'in_stock' | 'out_of_stock' | 'low_stock';
}

export interface CartItem {
  id: string; // unique item id (productId + customizations)
  productId: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  brand?: PhoneBrand;
  model?: string;
  caseType: CaseType;
  customText?: string;
  customPhoto?: string; // base64 or object URL
  customSong?: string;
  customArtist?: string;
  giftMessage?: string;
  quantity: number;
  themeColor: string;
  secondaryColor: string;
  designPattern: Product['designPattern'];
  category: Product['category'];
}

export interface AppliedOffer {
  code: string;
  name: string;
  discountAmount: number;
  description: string;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Out for delivery' | 'Delivered' | 'Cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  location: string;
  description: string;
}

export interface Order {
  id: string; // e.g. DE-839201
  createdAt: string;
  customer: CustomerAddress;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  appliedOffer?: AppliedOffer;
  isGiftWrapped?: boolean;
  giftWrappingFee?: number;
  giftNote?: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'Cash on Delivery' | 'Razorpay Simulated';
  paymentStatus: 'Paid' | 'Pending COD Verification' | 'Failed';
  paymentId?: string;
  status: OrderStatus;
  trackingNumber: string;
  timeline: OrderTimelineEvent[];
}

export interface Coupon {
  code: string;
  description: string;
  type: 'percentage' | 'flat' | 'buy3pay2' | 'flat849';
  value: number; // percentage value or flat amount
  minOrderValue?: number;
  minItems?: number;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  addresses: CustomerAddress[];
  wishlistProductIds: string[];
}

export interface CreatorApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeHandle?: string;
  followerCount: string;
  primaryNiche: string;
  proposedCode: string;
  prShippingAddress: string;
  city: string;
  pincode: string;
  appliedCampaignId?: string;
  portfolioUrl?: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Declined';
  createdAt: string;
  commissionRatePct: number;
}

export interface Campaign {
  id: string;
  title: string;
  tagline: string;
  category: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  startDate: string;
  endDate: string;
  payoutPerReel: number;
  freePrProducts: string[];
  deliverables: string[];
  slotsAvailable: number;
  slotsFilled: number;
  coverGradient: string;
  description: string;
  requirements: string[];
}

export interface HeroSlideCMS {
  id: string;
  eyebrow: string;
  title: string;
  tagline: string;
  coupon: string;
  highlightBadge: string;
  ctaText: string;
  ctaCategory: string;
  bgGradient: string;
  featuredProductId?: string;
  secondaryProductId?: string;
  customImageUrl?: string;
  customVideoUrl?: string;
  isActive: boolean;
}

export interface VideoReelCMS {
  id: string;
  title: string;
  tagline: string;
  videoUrl: string;
  posterImage: string;
  linkedProductId: string;
  viewsCount: string;
  durationSeconds: number;
  isActive: boolean;
}

export interface CategoryCMS {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  bannerImage?: string;
  iconName: string;
  featuredProductId?: string;
}

export interface AnnouncementCMS {
  id: string;
  text: string;
  code: string;
  highlight: string;
  isActive: boolean;
}

export interface BrandStoryCMS {
  title: string;
  subtitle: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  posterUrl: string;
}

export type AdminRole = 'director' | 'superadmin' | 'orders' | 'catalog';

export interface PodcastEpisode {
  id: string;
  title: string;
  episodeNumber: number;
  duration: string;
  guest: string;
  guestRole: string;
  category: 'Creativity' | 'Entrepreneurship' | 'Content Creation' | 'Real-Life Journeys';
  summary: string;
  keyTakeaways: string[];
  audioUrl: string;
  coverImage: string;
  publishedDate: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
}

export interface PersonalizationRequest {
  id?: string;
  category: string;
  productName?: string;
  preferredColor: string;
  preferredDesign: string;
  preferredTheme: string;
  customText?: string;
  customRequirements?: string;
  customerName: string;
  customerPhone: string;
  createdAt?: string;
}

export interface CollaborationProposal {
  id?: string;
  fullName: string;
  brandOrHandle: string;
  email: string;
  phone: string;
  collaborationType: 'Product Promotions' | 'UGC Content' | 'Paid Collaboration' | 'Creative Campaign';
  platform: 'Instagram' | 'YouTube' | 'TikTok' | 'Brand Partnership';
  followerCount: string;
  pitch: string;
  portfolioUrl?: string;
  createdAt?: string;
}

export interface CategoryCircleCMS {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  badge: string;
  route: string;
  isActive: boolean;
}

export interface BestsellerSectionCMS {
  eyebrow: string;
  title: string;
  accentWord: string;
  subtitle: string;
  promoTag: string;
  isActive: boolean;
}

export interface FounderNoteCMS {
  title: string;
  accentTitle: string;
  subtitle: string;
  badge: string;
  quote: string;
  paragraphs: string[];
  founderName: string;
  founderRole: string;
  photoUrl: string;
  signature: string;
  stats: { label: string; value: string }[];
  instagramHandle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  isActive: boolean;
}

export interface CuratedSpotlightCMS {
  eyebrow: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  ctaText: string;
  isActive: boolean;
}

export interface ChoiceSectionCMS {
  eyebrow: string;
  title: string;
  subtitle: string;
  tabs: { id: string; label: string; category: string }[];
  isActive: boolean;
}

export interface ValuePropCMS {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  badge: string;
  isActive: boolean;
}

export interface NewsletterCMS {
  title: string;
  subtitle: string;
  discountCode: string;
  discountBadge: string;
  buttonText: string;
  isActive: boolean;
}

export type MainCollectionId =
  | 'products'
  | 'personalization'
  | 'collaboration'
  | 'upcoming-campaigns'
  | 'creator-club'
  | 'affiliate-marketing'
  | 'podcast';


