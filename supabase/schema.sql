-- ==============================================================================
-- DIVINE’S ETERNITY — SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- ==============================================================================
-- Execute this script in your Supabase Project -> SQL Editor to initialize all tables,
-- Row Level Security (RLS) policies, and performance indexes.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  mrp NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 4.9,
  review_count INTEGER DEFAULT 0,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  badge TEXT,
  is_best_seller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  theme_color TEXT DEFAULT '#FFF9EB',
  secondary_color TEXT DEFAULT '#FF2E93',
  design_pattern TEXT DEFAULT 'jewelry_necklace',
  allows_personalization BOOLEAN DEFAULT true,
  stock_status TEXT DEFAULT 'in_stock',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount_total NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'Placed',
  tracking_number TEXT,
  timeline JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HERO BANNER SLIDES TABLE
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY,
  eyebrow TEXT,
  title TEXT NOT NULL,
  tagline TEXT,
  coupon TEXT,
  highlight_badge TEXT,
  cta_text TEXT DEFAULT 'Explore Collection',
  cta_category TEXT DEFAULT 'products',
  custom_image_url TEXT,
  custom_video_url TEXT,
  bg_gradient TEXT DEFAULT 'from-[#FFF9EB] via-[#FFF0F5] to-[#FFF9EB]',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PERSONALIZATION LEADS / REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.personalization_requests (
  id TEXT PRIMARY KEY DEFAULT concat('req_', floor(extract(epoch from now()))),
  category TEXT NOT NULL,
  product_name TEXT,
  preferred_color TEXT,
  preferred_design TEXT,
  preferred_theme TEXT,
  custom_text TEXT,
  custom_requirements TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT DEFAULT 'Pending WhatsApp Confirmation',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATOR CLUB & AFFILIATE APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.creator_applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  instagram_handle TEXT,
  follower_count TEXT,
  primary_niche TEXT,
  proposed_code TEXT,
  commission_rate_pct NUMERIC DEFAULT 15,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REVIEWS & TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  author TEXT NOT NULL,
  rating NUMERIC DEFAULT 5,
  date TEXT,
  verified BOOLEAN DEFAULT true,
  title TEXT,
  comment TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog, slides, and reviews
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Hero Slides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);

-- Allow public checkout order insertion
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders by ID" ON public.orders FOR SELECT USING (true);

-- Allow public personalization and creator applications submission
CREATE POLICY "Public Insert Personalization" ON public.personalization_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Creator Apps" ON public.creator_applications FOR INSERT WITH CHECK (true);

-- Admin full access with Service Role Key or Authenticated Users
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Slides" ON public.hero_slides FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Personalizations" ON public.personalization_requests FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Creator Apps" ON public.creator_applications FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Reviews" ON public.reviews FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON public.products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
