-- ====================================================================
-- Divine's Eternity - Production PostgreSQL Database Schema & RLS
-- Migration: 20261007_initial_schema.sql
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked with Supabase auth.users)
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

-- Index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. Products Catalog Table
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
    rating NUMERIC(2, 1) DEFAULT 4.9,
    review_count INTEGER DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb,
    customizable BOOLEAN DEFAULT true,
    theme_colors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- 4. Coupons & Discount Rules Table
CREATE TABLE IF NOT EXISTS public.coupons (
    code TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'flat', 'buy3pay2', 'flat849')),
    value NUMERIC(10, 2) NOT NULL CHECK (value >= 0),
    min_order_value NUMERIC(10, 2) DEFAULT 0,
    min_items INTEGER DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. DE-839201
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount_total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
    coupon_code TEXT REFERENCES public.coupons(code) ON DELETE SET NULL,
    is_gift_wrapped BOOLEAN DEFAULT false,
    gift_wrapping_fee NUMERIC(10, 2) DEFAULT 0,
    gift_note TEXT,
    shipping_fee NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Pending COD Verification', 'Failed', 'Refunded')),
    payment_id TEXT,
    razorpay_order_id TEXT,
    status TEXT NOT NULL DEFAULT 'Placed' CHECK (status IN ('Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled')),
    tracking_number TEXT,
    courier_partner TEXT DEFAULT 'BlueDart / Delhivery Express',
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    custom_text TEXT,
    custom_photo TEXT,
    case_type TEXT,
    theme_color TEXT,
    secondary_color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 7. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    verified_buyer BOOLEAN DEFAULT true,
    photo_urls JSONB DEFAULT '[]'::jsonb,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if caller has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------- Profiles Policies -----------------
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ----------------- Products Policies -----------------
-- Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

-- Only admins can insert, update, or delete products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.is_admin());

-- ----------------- Coupons Policies -----------------
-- Anyone can view active coupons
CREATE POLICY "Anyone can view active coupons"
  ON public.coupons FOR SELECT
  USING (is_active = true OR public.is_admin());

-- Only admins can manage coupons
CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL
  USING (public.is_admin());

-- ----------------- Orders Policies -----------------
-- Customers can view their own orders
CREATE POLICY "Customers can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Anyone (including guests) can insert orders during checkout
CREATE POLICY "Anyone can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Only admins can update orders (e.g. status, tracking)
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- ----------------- Order Items Policies -----------------
-- Customers can view items for their own orders
CREATE POLICY "Customers can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

-- Anyone can insert items for new orders
CREATE POLICY "Anyone can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- ----------------- Reviews Policies -----------------
-- Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
  ON public.reviews FOR SELECT
  USING (is_approved = true OR public.is_admin());

-- Authenticated patrons can write reviews
CREATE POLICY "Authenticated users can write reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can update/delete reviews
CREATE POLICY "Admins can manage reviews"
  ON public.reviews FOR ALL
  USING (public.is_admin());

-- ====================================================================
-- Automatic Profile Creation on User Signup Trigger
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN NEW.email ILIKE '%admin@divineseternity.com%' THEN 'admin'
      ELSE 'customer'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
