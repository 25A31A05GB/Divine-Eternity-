import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Order, Coupon, ProductReview, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const PRODUCTS_STORAGE_KEY = 'divines_eternity_products_v1';
const ORDERS_STORAGE_KEY = 'divines_orders_v1';
const COUPONS_STORAGE_KEY = 'divines_coupons_v1';

// In-memory / localStorage fallback helpers
const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Storage read error', e);
  }
  return INITIAL_PRODUCTS;
};

const setStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Storage write error', e);
  }
};

const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Storage read error', e);
  }
  return [];
};

const setStoredOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Storage write error', e);
  }
};

/**
 * Data Access Layer for Divine's Eternity
 * Connects directly to Supabase PostgreSQL when credentials exist,
 * with resilient offline/local caching so the app remains 100% operational.
 */
export const db = {
  // ----------------------------------------------------
  // PRODUCTS
  // ----------------------------------------------------
  async getProducts(): Promise<{ data: Product[]; error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Product[] = data.map((d: any) => ({
            id: d.id,
            slug: d.slug,
            name: d.name,
            tagline: d.tagline || '',
            description: d.description || '',
            price: Number(d.price),
            mrp: Number(d.mrp),
            category: d.category,
            badge: d.badge || undefined,
            images: Array.isArray(d.images) ? d.images : [d.images],
            rating: Number(d.rating) || 4.9,
            reviewCount: Number(d.review_count) || 42,
            features: d.features || [],
            customizable: d.customizable ?? true,
            themeColors: d.theme_colors || ['#FEF9EF', '#FF2E93', '#211D1C'],
            designPattern: 'jewelry_necklace',
            inStock: d.in_stock ?? true,
            stockQuantity: d.stock_quantity ?? 50,
            isBestSeller: d.is_bestseller ?? true,
            themeColor: d.theme_color || '#FEF9EF',
            secondaryColor: d.secondary_color || '#D4AF37',
            allowsPersonalization: d.allows_personalization ?? true,
          }));
          setStoredProducts(mapped);
          return { data: mapped, error: null };
        }
      } catch (err: any) {
        console.warn('Supabase products fetch failed, using local fallback:', err.message);
      }
    }

    return { data: getStoredProducts(), error: null };
  },

  async saveProduct(product: Product): Promise<{ success: boolean; error: string | null }> {
    // 1. Update local cache
    const current = getStoredProducts();
    const existingIndex = current.findIndex((p) => p.id === product.id);
    let updated: Product[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = product;
    } else {
      updated = [product, ...current];
    }
    setStoredProducts(updated);

    // 2. Sync to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('products').upsert({
          id: product.id,
          slug: product.slug,
          name: product.name,
          tagline: product.tagline || '',
          description: product.description,
          price: product.price,
          mrp: product.mrp,
          category: product.category,
          badge: product.badge,
          images: product.images,
          is_active: true,
          in_stock: product.inStock ?? true,
          stock_quantity: product.stockQuantity ?? 50,
          rating: product.rating,
          review_count: product.reviewCount,
          features: product.features,
          customizable: product.customizable,
          theme_colors: product.themeColors,
          updated_at: new Date().toISOString(),
        });
        if (error) return { success: false, error: error.message };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return { success: true, error: null };
  },

  async deleteProduct(id: string): Promise<{ success: boolean; error: string | null }> {
    const current = getStoredProducts().filter((p) => p.id !== id);
    setStoredProducts(current);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) return { success: false, error: error.message };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return { success: true, error: null };
  },

  // ----------------------------------------------------
  // ORDERS
  // ----------------------------------------------------
  async getOrders(userId?: string): Promise<{ data: Order[]; error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;
        if (!error && data) {
          const mapped: Order[] = data.map((d: any) => ({
            id: d.id,
            createdAt: d.created_at,
            customer: d.customer,
            items: [],
            subtotal: Number(d.subtotal),
            discountTotal: Number(d.discount_total || 0),
            isGiftWrapped: d.is_gift_wrapped,
            giftWrappingFee: Number(d.gift_wrapping_fee || 0),
            giftNote: d.gift_note,
            shippingFee: Number(d.shipping_fee || 0),
            totalAmount: Number(d.total_amount),
            paymentMethod: d.payment_method,
            paymentStatus: d.payment_status,
            paymentId: d.payment_id,
            status: d.status,
            trackingNumber: d.tracking_number,
            timeline: d.timeline || [],
          }));
          return { data: mapped, error: null };
        }
      } catch (err: any) {
        console.warn('Supabase orders fetch error:', err.message);
      }
    }

    const localOrders = getStoredOrders();
    return { data: localOrders, error: null };
  },

  async getOrderById(orderId: string): Promise<{ data: Order | null; error: string | null }> {
    const cleanId = orderId.trim().toUpperCase();

    // 1. Try server endpoint first (which applies rate limiting and checks server DB)
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.order) {
          return { data: json.order, error: null };
        }
      }
    } catch {
      // Continue to Supabase / local
    }

    // 2. Try Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', cleanId)
          .maybeSingle();

        if (!error && data) {
          const mapped: Order = {
            id: data.id,
            createdAt: data.created_at,
            customer: data.customer,
            items: data.order_items || [],
            subtotal: Number(data.subtotal),
            discountTotal: Number(data.discount_total || 0),
            isGiftWrapped: data.is_gift_wrapped,
            giftWrappingFee: Number(data.gift_wrapping_fee || 0),
            giftNote: data.gift_note,
            shippingFee: Number(data.shipping_fee || 0),
            totalAmount: Number(data.total_amount),
            paymentMethod: data.payment_method,
            paymentStatus: data.payment_status,
            paymentId: data.payment_id,
            status: data.status,
            trackingNumber: data.tracking_number,
            timeline: data.timeline || [],
          };
          return { data: mapped, error: null };
        }
      } catch (err: any) {
        console.warn('Supabase order lookup error:', err.message);
      }
    }

    // 3. Try Local storage
    const local = getStoredOrders().find((o) => o.id.toUpperCase() === cleanId);
    return { data: local || null, error: local ? null : 'Order not found' };
  },

  async createOrder(order: Order, userId?: string): Promise<{ data: Order; error: string | null }> {
    // 1. Cache locally
    const current = getStoredOrders();
    setStoredOrders([order, ...current]);

    // 2. Save to Supabase if available
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: orderError } = await supabase.from('orders').insert({
          id: order.id,
          user_id: userId || null,
          customer: order.customer,
          subtotal: order.subtotal,
          discount_total: order.discountTotal || 0,
          coupon_code: order.appliedOffer?.code || null,
          is_gift_wrapped: order.isGiftWrapped || false,
          gift_wrapping_fee: order.giftWrappingFee || 0,
          gift_note: order.giftNote || null,
          shipping_fee: order.shippingFee,
          total_amount: order.totalAmount,
          payment_method: order.paymentMethod,
          payment_status: order.paymentStatus,
          payment_id: order.paymentId || null,
          status: order.status,
          tracking_number: order.trackingNumber,
          timeline: order.timeline,
        });

        if (!orderError && order.items.length > 0) {
          const itemRows = order.items.map((it) => ({
            order_id: order.id,
            product_id: it.productId || it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            custom_text: it.customText || null,
            custom_photo: it.customPhoto || null,
            case_type: it.caseType || null,
            theme_color: it.themeColor || null,
            secondary_color: it.secondaryColor || null,
          }));
          await supabase.from('order_items').insert(itemRows);
        }
      } catch (err: any) {
        console.warn('Supabase order write error:', err.message);
      }
    }

    return { data: order, error: null };
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ): Promise<{ success: boolean; error: string | null }> {
    // 1. Update locally
    const current = getStoredOrders();
    const updated = current.map((ord) => {
      if (ord.id.toUpperCase() !== orderId.toUpperCase()) return ord;
      const newTimeline = [
        ...ord.timeline,
        {
          status,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          location: 'Divine Fulfillment Hub',
          description: `Order milestone updated to ${status}.`,
        },
      ];
      return {
        ...ord,
        status,
        trackingNumber: trackingNumber || ord.trackingNumber,
        timeline: newTimeline,
      };
    });
    setStoredOrders(updated);

    // 2. Update via server API if possible
    try {
      await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber }),
      });
    } catch {
      // Continue
    }

    // 3. Update in Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const payload: any = {
          status,
          updated_at: new Date().toISOString(),
        };
        if (trackingNumber) payload.tracking_number = trackingNumber;

        await supabase.from('orders').update(payload).eq('id', orderId);
      } catch (err: any) {
        console.warn('Supabase status update error:', err.message);
      }
    }

    return { success: true, error: null };
  },
};
