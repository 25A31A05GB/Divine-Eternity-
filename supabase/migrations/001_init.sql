-- ==============================================================================
-- DIVINE'S ETERNITY — IDEMPOTENT CONSOLIDATED DATABASE SCHEMA & POLICIES
-- File: supabase/migrations/001_init.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTION: is_admin()
-- Evaluates whether the currently authenticated user has 'admin' or 'staff' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  addresses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Trigger: Automatically create customer profile upon new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  badge TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  mrp NUMERIC(10, 2) NOT NULL CHECK (mrp >= price),
  category TEXT NOT NULL,
  badge TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INTEGER NOT NULL DEFAULT 50 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  rating NUMERIC(2, 1) DEFAULT 4.9,
  review_count INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  customizable BOOLEAN DEFAULT true,
  theme_colors JSONB DEFAULT '[]'::jsonb,
  hsn_code TEXT DEFAULT '7117',
  gst_rate NUMERIC DEFAULT 18,
  product_occasions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- 6. HERO SLIDES TABLE
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY DEFAULT concat('slide_', floor(extract(epoch from now()))::text),
  title TEXT NOT NULL,
  eyebrow TEXT,
  tagline TEXT,
  custom_image_url TEXT,
  custom_video_url TEXT,
  coupon TEXT,
  highlight_badge TEXT,
  cta_text TEXT DEFAULT 'Explore Collection',
  cta_category TEXT DEFAULT 'products',
  bg_gradient TEXT DEFAULT 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  value NUMERIC(10, 2) NOT NULL CHECK (value >= 0),
  min_order_value NUMERIC(10, 2) DEFAULT 0,
  min_items INTEGER DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer JSONB NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount_total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
  coupon_code TEXT,
  is_gift_wrapped BOOLEAN DEFAULT false,
  gift_wrapping_fee NUMERIC(10, 2) DEFAULT 0,
  gift_note TEXT,
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  payment_id TEXT,
  razorpay_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'Placed',
  tracking_number TEXT,
  courier_partner TEXT DEFAULT 'BlueDart / Delhivery Express',
  invoice_number TEXT,
  invoice_url TEXT,
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 9. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  custom_text TEXT,
  custom_photo TEXT,
  case_type TEXT,
  theme_color TEXT,
  secondary_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 10. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL DEFAULT 'Razorpay',
  transaction_id TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);

-- 11. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT,
  user_id UUID,
  customer_name TEXT,
  author TEXT,
  rating NUMERIC CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  is_verified_buyer BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- 12. RETURN REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.return_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  user_id UUID,
  phone TEXT NOT NULL,
  type TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'requested',
  admin_note TEXT,
  refund_amount NUMERIC(10, 2),
  refund_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_return_requests_order_id ON public.return_requests(order_id);

-- 13. OCCASION SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.occasion_settings (
  slug TEXT PRIMARY KEY,
  headline TEXT NOT NULL,
  intro TEXT NOT NULL,
  cutoff_date TEXT NOT NULL,
  banner_text TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CUSTOMER LEADS & INTERACTIONS
CREATE TABLE IF NOT EXISTS public.personalization_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  product_id TEXT,
  category TEXT,
  product_name TEXT,
  preferred_color TEXT,
  preferred_design TEXT,
  custom_text TEXT,
  custom_requirements TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.creator_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  instagram_handle TEXT,
  portfolio_url TEXT,
  follower_count TEXT,
  primary_niche TEXT,
  proposed_code TEXT,
  commission_rate_pct NUMERIC DEFAULT 15,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  coupon_granted TEXT DEFAULT 'WELCOME100',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  phone TEXT,
  cart JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  reminders_sent INT DEFAULT 0,
  recovered BOOLEAN DEFAULT false,
  recovery_token TEXT UNIQUE NOT NULL,
  has_consented BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoice_counter (
  id INT PRIMARY KEY DEFAULT 1,
  year_prefix TEXT NOT NULL DEFAULT '2026-27',
  last_number INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.invoice_counter (id, year_prefix, last_number)
VALUES (1, '2026-27', 0)
ON CONFLICT (id) DO NOTHING;

-- 15. STORE FUNCTIONS
CREATE OR REPLACE FUNCTION public.get_next_invoice_number()
RETURNS TEXT AS $$
DECLARE
  v_prefix TEXT;
  v_next INT;
BEGIN
  SELECT year_prefix, last_number + 1 INTO v_prefix, v_next
  FROM public.invoice_counter
  WHERE id = 1
  FOR UPDATE;

  UPDATE public.invoice_counter
  SET last_number = v_next, updated_at = NOW()
  WHERE id = 1;

  RETURN 'DE/' || v_prefix || '/' || LPAD(v_next::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.restore_stock(p_product_id TEXT, p_qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET 
    stock_quantity = COALESCE(stock_quantity, 0) + p_qty,
    in_stock = true,
    updated_at = NOW()
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.decrement_stock(p_product_id TEXT, p_qty INT)
RETURNS VOID AS $$
DECLARE
  v_current_stock INT;
BEGIN
  SELECT stock_quantity INTO v_current_stock
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product % not found', p_product_id;
  END IF;

  IF v_current_stock < p_qty THEN
    RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Requested: %', p_product_id, v_current_stock, p_qty;
  END IF;

  UPDATE public.products
  SET 
    stock_quantity = v_current_stock - p_qty,
    in_stock = (v_current_stock - p_qty) > 0,
    updated_at = NOW()
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. SECURE ORDER TRACKING RPC (SECURITY DEFINER)
-- Allows patrons to track orders using order ID & phone number WITHOUT public SELECT on orders
CREATE OR REPLACE FUNCTION public.track_order(order_number TEXT, phone TEXT)
RETURNS TABLE (
  id TEXT,
  status TEXT,
  payment_status TEXT,
  tracking_number TEXT,
  courier_partner TEXT,
  total_amount NUMERIC,
  created_at TIMESTAMPTZ,
  timeline JSONB,
  items JSONB
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  clean_phone TEXT;
BEGIN
  clean_phone := RIGHT(REGEXP_REPLACE(phone, '\D', '', 'g'), 10);
  
  RETURN QUERY
  SELECT 
    o.id,
    o.status,
    o.payment_status,
    o.tracking_number,
    o.courier_partner,
    o.total_amount,
    o.created_at,
    o.timeline,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'name', it.value->>'name',
          'quantity', it.value->>'quantity'
        )
      )
      FROM jsonb_array_elements(o.items) AS it
    ) AS items
  FROM public.orders o
  WHERE UPPER(TRIM(o.id)) = UPPER(TRIM(order_number))
    AND RIGHT(REGEXP_REPLACE(o.customer->>'phone', '\D', '', 'g'), 10) = clean_phone
  LIMIT 1;
END;
$$;

-- ==============================================================================
-- 17. ROW LEVEL SECURITY (RLS) HARDENING
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasion_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Clean existing policies (idempotency)
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public read active products" ON public.products;
DROP POLICY IF EXISTS "Admin All Products" ON public.products;
DROP POLICY IF EXISTS "Admin write products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

DROP POLICY IF EXISTS "Public Read Hero Slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Public read active slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Admin All Slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Admin write slides" ON public.hero_slides;

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin write categories" ON public.categories;

DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Read Orders by ID" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers read own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin All Orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admin update orders" ON public.orders;

DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers read own order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Admin update order_items" ON public.order_items;

DROP POLICY IF EXISTS "Admin read payments" ON public.payments;
DROP POLICY IF EXISTS "Customers select own payments" ON public.payments;
DROP POLICY IF EXISTS "Admin manage payments" ON public.payments;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin manage profiles" ON public.profiles;

DROP POLICY IF EXISTS "Public Read Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can write reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users submit reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin All Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin manage reviews" ON public.reviews;

DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admin manage coupons" ON public.coupons;

DROP POLICY IF EXISTS "Allow public read access on occasion_settings" ON public.occasion_settings;
DROP POLICY IF EXISTS "Allow authenticated full access on occasion_settings" ON public.occasion_settings;
DROP POLICY IF EXISTS "Public select occasion settings" ON public.occasion_settings;
DROP POLICY IF EXISTS "Admin write occasion settings" ON public.occasion_settings;

-- ------------------------------------------------------------------------------
-- A. PRODUCTS, CATEGORIES, HERO_SLIDES: Public SELECT only (active), Admin writes
-- ------------------------------------------------------------------------------
CREATE POLICY "Public read active products" ON public.products
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin write products" ON public.products
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read active categories" ON public.categories
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin write categories" ON public.categories
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read active hero_slides" ON public.hero_slides
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin write hero_slides" ON public.hero_slides
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- B. ORDERS, ORDER_ITEMS, PAYMENTS:
-- NO public SELECT or INSERT. Server inserts with service role.
-- Customers can SELECT only their own rows (user_id = auth.uid()).
-- Admin/staff can read and update.
-- ------------------------------------------------------------------------------
CREATE POLICY "Customers select own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin update orders" ON public.orders
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Customers select own order_items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Admin update order_items" ON public.order_items
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Customers select own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payments.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Admin manage payments" ON public.payments
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- C. PROFILES: Self read/update, Admin manage
-- ------------------------------------------------------------------------------
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin manage profiles" ON public.profiles
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- D. COUPONS: Admin only (Server validates coupons via service role)
-- ------------------------------------------------------------------------------
CREATE POLICY "Admin manage coupons" ON public.coupons
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- E. REVIEWS: Public reads approved, Authenticated patrons insert, Admin manage
-- ------------------------------------------------------------------------------
CREATE POLICY "Public read approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved' OR public.is_admin());

CREATE POLICY "Authenticated users submit reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin manage reviews" ON public.reviews
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- F. OCCASION SETTINGS: Public read, Admin write
-- ------------------------------------------------------------------------------
CREATE POLICY "Public read occasion settings" ON public.occasion_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin write occasion settings" ON public.occasion_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- G. RETURN REQUESTS: Users read own, Admin manages
-- ------------------------------------------------------------------------------
CREATE POLICY "Users select own return requests" ON public.return_requests
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin manage return requests" ON public.return_requests
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- H. LEADS & MESSAGES: Public INSERT with length limits, Admin read/manage
-- ------------------------------------------------------------------------------
CREATE POLICY "Public insert personalization requests" ON public.personalization_requests
  FOR INSERT WITH CHECK (length(customer_name) <= 100 AND length(customer_phone) <= 20);

CREATE POLICY "Admin read personalization requests" ON public.personalization_requests
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public insert creator applications" ON public.creator_applications
  FOR INSERT WITH CHECK (length(full_name) <= 100 AND length(email) <= 120);

CREATE POLICY "Admin read creator applications" ON public.creator_applications
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public insert newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (length(email) <= 120);

CREATE POLICY "Admin read newsletter" ON public.newsletter_subscribers
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (length(name) <= 100);

CREATE POLICY "Admin read contact messages" ON public.contact_messages
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin manage abandoned carts" ON public.abandoned_carts
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
