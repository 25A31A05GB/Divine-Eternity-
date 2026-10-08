import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Order, Coupon, ProductReview, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const PRODUCTS_STORAGE_KEY = 'divines_eternity_products_v1';
const ORDERS_STORAGE_KEY = 'divines_orders_v1';
const COUPONS_STORAGE_KEY = 'divines_coupons_v1';

// In-memory / localStorage fallback helpers
export const getStoredProducts = (): Product[] => {
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

export const setStoredProducts = (products: Product[]) => {
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

// Exported helper to convert Product to Supabase row format
export const toRow = (product: Product) => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  tagline: product.tagline || '',
  description: product.description || '',
  price: product.price,
  mrp: product.mrp,
  category: product.category,
  badge: product.badge || null,
  images: Array.isArray(product.images) ? product.images : [product.images],
  is_active: product.inStock !== false,
  in_stock: product.inStock ?? true,
  stock_quantity: product.stockQuantity ?? 50,
  rating: product.rating ?? 4.9,
  review_count: product.reviewCount ?? 0,
  features: product.features || [],
  customizable: product.customizable ?? true,
  theme_colors: product.themeColors || ['#FEF9EF', '#FF2E93', '#211D1C'],
  is_bestseller: product.isBestSeller ?? false,
  theme_color: product.themeColor || '#FEF9EF',
  secondary_color: product.secondaryColor || '#D4AF37',
  design_pattern: product.designPattern || 'jewelry_necklace',
  allows_personalization: product.allowsPersonalization ?? true,
  hsn_code: product.hsnCode || '7117',
  gst_rate: product.gstRate ?? 18,
  updated_at: new Date().toISOString(),
});

export const seedCatalogIfEmpty = async (): Promise<void> => {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    if (!error && (count === 0 || count === null)) {
      const rows = INITIAL_PRODUCTS.map(toRow);
      await supabase.from('products').upsert(rows);
    }
  } catch (err) {
    console.warn('seedCatalogIfEmpty error:', err);
  }
};

/**
 * Data Access Layer for Divine's Eternity
 * Connects directly to Supabase PostgreSQL when credentials exist,
 * with resilient offline/local caching so the app remains 100% operational.
 */
export const db = {
  /**
   * Diagnostic helper to verify Supabase Cloud Connection & Table readiness
   */
  async checkSupabaseStatus(): Promise<{
    configured: boolean;
    connected: boolean;
    hasProductsTable: boolean;
    error: string | null;
  }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { configured: false, connected: false, hasProductsTable: false, error: 'Supabase credentials missing' };
    }
    try {
      const { error } = await supabase.from('products').select('id').limit(1);
      if (error) {
        return {
          configured: true,
          connected: true,
          hasProductsTable: false,
          error: error.message,
        };
      }
      return {
        configured: true,
        connected: true,
        hasProductsTable: true,
        error: null,
      };
    } catch (err: any) {
      return {
        configured: true,
        connected: false,
        hasProductsTable: false,
        error: err.message,
      };
    }
  },

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

        if (error) {
          console.warn('Supabase products fetch failed:', error.message);
          return { data: getStoredProducts(), error: error.message };
        }

        if (data && data.length > 0) {
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
            reviewCount: Number(d.review_count) || 0,
            features: d.features || [],
            customizable: d.customizable ?? true,
            themeColors: d.theme_colors || ['#FEF9EF', '#FF2E93', '#211D1C'],
            designPattern: d.design_pattern || 'jewelry_necklace',
            inStock: d.in_stock ?? true,
            stockQuantity: d.stock_quantity ?? 50,
            isBestSeller: d.is_bestseller ?? false,
            themeColor: d.theme_color || '#FEF9EF',
            secondaryColor: d.secondary_color || '#D4AF37',
            allowsPersonalization: d.allows_personalization ?? true,
            hsnCode: d.hsn_code || '7117',
            gstRate: Number(d.gst_rate) || 18,
          }));
          setStoredProducts(mapped);
          return { data: mapped, error: null };
        } else {
          // If 0 rows in Supabase products table, seed initial catalog
          await seedCatalogIfEmpty();
          return { data: INITIAL_PRODUCTS, error: null };
        }
      } catch (err: any) {
        return { data: getStoredProducts(), error: err.message };
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

    // 2. Sync to Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        await seedCatalogIfEmpty();
        const row = toRow(product);
        const { error } = await supabase.from('products').upsert(row);
        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    } else {
      return { success: false, error: 'Database service is not configured.' };
    }

    return { success: true, error: null };
  },

  async saveProducts(productsToSave: Product[]): Promise<{ success: boolean; error: string | null }> {
    const current = getStoredProducts();
    const updatedMap = new Map(current.map((p) => [p.id, p]));
    productsToSave.forEach((p) => updatedMap.set(p.id, p));
    const merged = Array.from(updatedMap.values());
    setStoredProducts(merged);

    if (isSupabaseConfigured() && supabase) {
      try {
        await seedCatalogIfEmpty();
        const rows = productsToSave.map(toRow);
        const { error } = await supabase.from('products').upsert(rows);
        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    } else {
      return { success: false, error: 'Database service is not configured.' };
    }

    return { success: true, error: null };
  },

  async deleteProduct(id: string): Promise<{ success: boolean; error: string | null }> {
    const current = getStoredProducts().filter((p) => p.id !== id);
    setStoredProducts(current);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    } else {
      return { success: false, error: 'Database service is not configured.' };
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

  async getOrderById(orderId: string, phone?: string): Promise<{ data: any | null; error: string | null }> {
    const cleanId = orderId.trim().toUpperCase();
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);

    if (!cleanPhone || cleanPhone.length < 10) {
      return { data: null, error: 'Registered 10-digit mobile phone number is required.' };
    }

    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: cleanId, phone: cleanPhone }),
      });
      const json = await res.json();
      if (res.ok && json.success && json.order) {
        return { data: json.order, error: null };
      }
      return { data: null, error: json.error || 'Order not found or verification failed.' };
    } catch (err: any) {
      return { data: null, error: err.message || 'Unable to connect to order tracking service' };
    }
  },

  async createOrder(order: Order, userId?: string): Promise<{ data: Order; error: string | null }> {
    // Save to Supabase if available
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
          tracking_number: order.trackingNumber || null,
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
    let authToken = '';
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        authToken = sessionData?.session?.access_token || '';
      } catch {
        // ignore
      }
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/admin-order-status', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ orderId, status, trackingNumber }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || `Failed to update status to ${status}` };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error updating order status' };
    }
  },
};
