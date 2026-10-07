import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, HeroSlideCMS, ProductReview, PersonalizationRequest, CreatorApplication } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key'
  );
};

// Gracefully instantiate client or a dummy client to avoid crashes if keys not yet supplied in .env
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// ==========================================
// 1. PRODUCTS DB SERVICE
// ==========================================

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch products:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug || row.id,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      mrp: Number(row.mrp || row.price * 1.5),
      rating: Number(row.rating || 4.9),
      reviewCount: Number(row.review_count || 120),
      description: row.description || '',
      features: row.features || [],
      images: row.images || [],
      badge: row.badge,
      isBestSeller: Boolean(row.is_best_seller),
      isNew: Boolean(row.is_new),
      themeColor: row.theme_color || '#FFF9EB',
      secondaryColor: row.secondary_color || '#FF2E93',
      designPattern: row.design_pattern || 'jewelry_necklace',
      allowsPersonalization: row.allows_personalization ?? true,
      stockStatus: row.stock_status || 'in_stock',
      inStock: row.stock_status !== 'out_of_stock',
    }));
  } catch (err) {
    console.error('[Supabase] Error fetching products:', err);
    return null;
  }
}

export async function upsertProductToSupabase(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('products').upsert({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      rating: product.rating,
      review_count: product.reviewCount,
      description: product.description,
      features: product.features,
      images: product.images,
      badge: product.badge,
      is_best_seller: product.isBestSeller,
      is_new: product.isNew,
      theme_color: product.themeColor,
      secondary_color: product.secondaryColor,
      design_pattern: product.designPattern,
      allows_personalization: product.allowsPersonalization,
      stock_status: product.stockStatus || 'in_stock',
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[Supabase] Error saving product:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Product save exception:', err);
    return false;
  }
}

export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('[Supabase] Error deleting product:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Product delete exception:', err);
    return false;
  }
}

export async function bulkSyncProductsToSupabase(products: Product[]): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, count: 0, error: 'Supabase credentials not configured in environment.' };
  }

  try {
    const payload = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      mrp: p.mrp,
      rating: p.rating,
      review_count: p.reviewCount,
      description: p.description,
      features: p.features,
      images: p.images,
      badge: p.badge,
      is_best_seller: p.isBestSeller,
      is_new: p.isNew,
      theme_color: p.themeColor,
      secondary_color: p.secondaryColor,
      design_pattern: p.designPattern,
      allows_personalization: p.allowsPersonalization,
      stock_status: p.stockStatus || 'in_stock',
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
    if (error) throw error;

    return { success: true, count: payload.length };
  } catch (err: any) {
    console.error('[Supabase] Bulk sync error:', err);
    return { success: false, count: 0, error: err.message || 'Unknown database error' };
  }
}

// ==========================================
// 2. ORDERS DB SERVICE
// ==========================================

export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      createdAt: row.created_at,
      customer: row.customer,
      items: row.items,
      subtotal: Number(row.subtotal),
      discountTotal: Number(row.discount_total || 0),
      shippingFee: Number(row.shipping_fee || 0),
      totalAmount: Number(row.total_amount),
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      paymentId: row.payment_id,
      status: row.status,
      trackingNumber: row.tracking_number,
      timeline: row.timeline || [],
    }));
  } catch (err) {
    console.error('[Supabase] Fetch orders error:', err);
    return null;
  }
}

export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      created_at: order.createdAt,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      discount_total: order.discountTotal,
      shipping_fee: order.shippingFee,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      payment_id: order.paymentId,
      status: order.status,
      tracking_number: order.trackingNumber,
      timeline: order.timeline,
    });

    if (error) {
      console.error('[Supabase] Order save error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Order save exception:', err);
    return false;
  }
}

// ==========================================
// 3. PERSONALIZATION & CREATOR LEADS
// ==========================================

export async function savePersonalizationLeadToSupabase(req: PersonalizationRequest): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('personalization_requests').insert({
      id: req.id || `req-${Date.now()}`,
      category: req.category,
      product_name: req.productName,
      preferred_color: req.preferredColor,
      preferred_design: req.preferredDesign,
      preferred_theme: req.preferredTheme,
      custom_text: req.customText,
      custom_requirements: req.customRequirements,
      customer_name: req.customerName,
      customer_phone: req.customerPhone,
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch (err) {
    console.error('[Supabase] Personalization save exception:', err);
    return false;
  }
}

export async function saveCreatorApplicationToSupabase(app: CreatorApplication): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('creator_applications').insert({
      id: app.id,
      full_name: app.fullName,
      email: app.email,
      phone: app.phone,
      instagram_handle: app.instagramHandle,
      follower_count: app.followerCount,
      primary_niche: app.primaryNiche,
      proposed_code: app.proposedCode,
      status: app.status,
      commission_rate_pct: app.commissionRatePct,
      created_at: app.createdAt,
    });
    return !error;
  } catch (err) {
    console.error('[Supabase] Creator app save exception:', err);
    return false;
  }
}
