export type GiftCategory =
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
    | 'scented_candle_hamper';
  supportedBrands?: PhoneBrand[];
  variantsStock?: { [key in CaseType]?: boolean };
  allowsPersonalization: boolean;
  personalizationConfig?: PersonalizationConfig;
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
