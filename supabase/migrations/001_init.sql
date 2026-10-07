-- ====================================================================
-- Divine's Eternity - Complete Clean Database Schema Migration
-- File: supabase/migrations/001_init.sql
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Helper Function: is_admin() - checks role in profiles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profiles Table (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: Insert profile on new Supabase auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
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

-- 3. Customer Saved Addresses
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    street_address TEXT NOT NULL,
    landmark TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    badge TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Products Catalog Table
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Product Variants (Optional)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    material TEXT NOT NULL,
    additional_price NUMERIC(10, 2) DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    code TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'flat', 'buy3pay2', 'flat849')),
    value NUMERIC(10, 2) NOT NULL CHECK (value >= 0),
    min_order_value NUMERIC(10, 2) DEFAULT 0,
    min_items INTEGER DEFAULT 1,
    max_discount NUMERIC(10, 2),
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    usage_limit INTEGER,
    per_user_limit INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Coupon Redemptions
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_code TEXT NOT NULL REFERENCES public.coupons(code) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    order_id TEXT,
    discount_amount NUMERIC(10, 2) NOT NULL,
    redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order sequence for human-readable numbers like DE-000101
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1001;

-- 9. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. DE-001001
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_street TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_pincode TEXT NOT NULL,
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
    fulfillment_status TEXT NOT NULL DEFAULT 'Placed' CHECK (fulfillment_status IN ('Placed', 'In Production', 'Quality Check', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled')),
    payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    tracking_number TEXT,
    courier_partner TEXT DEFAULT 'BlueDart Express',
    customer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id),
    name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    custom_text TEXT,
    case_type TEXT,
    design_pattern TEXT,
    theme_color TEXT,
    secondary_color TEXT,
    customization_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Order Events / Timeline
CREATE TABLE IF NOT EXISTS public.order_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Payments Table
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

-- 13. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    photos JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Hero Slides CMS
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    eyebrow TEXT,
    tagline TEXT,
    image_url TEXT NOT NULL,
    video_url TEXT,
    coupon_code TEXT,
    cta_text TEXT DEFAULT 'Personalize Yours',
    cta_category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Personalization Requests
CREATE TABLE IF NOT EXISTS public.personalization_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    product_id TEXT REFERENCES public.products(id),
    engraving_text TEXT,
    special_notes TEXT,
    reference_image_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Creator Applications
CREATE TABLE IF NOT EXISTS public.creator_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    instagram_handle TEXT,
    portfolio_url TEXT,
    follower_count TEXT,
    niche TEXT,
    proposed_code TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    coupon_granted TEXT DEFAULT 'WELCOME100',
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Audit Log
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES: Users read/update own profile; admin reads all
CREATE POLICY "Users read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admin manage profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

-- 2. ADDRESSES: Users manage own addresses
CREATE POLICY "Users read own addresses" ON public.addresses
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users insert own addresses" ON public.addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own addresses" ON public.addresses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own addresses" ON public.addresses
    FOR DELETE USING (auth.uid() = user_id);

-- 3. PRODUCTS & CATEGORIES: Public can read active; Admins can edit
CREATE POLICY "Public read active products" ON public.products
    FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin write products" ON public.products
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public read categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Admin write categories" ON public.categories
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public read variants" ON public.product_variants
    FOR SELECT USING (true);

CREATE POLICY "Admin write variants" ON public.product_variants
    FOR ALL USING (public.is_admin());

-- 4. HERO SLIDES: Public read active; Admin write
CREATE POLICY "Public read active slides" ON public.hero_slides
    FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin write slides" ON public.hero_slides
    FOR ALL USING (public.is_admin());

-- 5. REVIEWS: Public reads approved; Authenticated inserts; Admin manages
CREATE POLICY "Public read approved reviews" ON public.reviews
    FOR SELECT USING (status = 'approved' OR public.is_admin());

CREATE POLICY "Authenticated users submit reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin manage reviews" ON public.reviews
    FOR ALL USING (public.is_admin());

-- 6. ORDERS & ORDER ITEMS: Customers read own; Server/Admin writes
CREATE POLICY "Customers read own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin update orders" ON public.orders
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Customers read own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Customers read own order events" ON public.order_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_events.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Admin read payments" ON public.payments
    FOR SELECT USING (public.is_admin());

-- 7. COUPONS: No public select (server validates via service key); Admin write
CREATE POLICY "Admin manage coupons" ON public.coupons
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage redemptions" ON public.coupon_redemptions
    FOR ALL USING (public.is_admin());

-- 8. PUBLIC INSERT TABLES (with validation)
CREATE POLICY "Public insert personalization requests" ON public.personalization_requests
    FOR INSERT WITH CHECK (length(customer_name) <= 100 AND length(customer_phone) <= 20);

CREATE POLICY "Admin read personalization requests" ON public.personalization_requests
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Public insert creator applications" ON public.creator_applications
    FOR INSERT WITH CHECK (length(full_name) <= 100 AND length(email) <= 120);

CREATE POLICY "Admin read creator applications" ON public.creator_applications
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Public insert newsletter" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (length(email) <= 120);

CREATE POLICY "Admin read newsletter" ON public.newsletter_subscribers
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Public insert contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (length(name) <= 100 AND length(email) <= 120);

CREATE POLICY "Admin read contact messages" ON public.contact_messages
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin read audit log" ON public.audit_log
    FOR ALL USING (public.is_admin());

-- ====================================================================
-- SECURE TRACK ORDER RPC (Returns safe fields only)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.track_order(p_order_number TEXT, p_phone TEXT)
RETURNS TABLE (
    id TEXT,
    fulfillment_status TEXT,
    payment_status TEXT,
    tracking_number TEXT,
    courier_partner TEXT,
    created_at TIMESTAMPTZ,
    timeline JSONB
)
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.fulfillment_status,
        o.payment_status,
        o.tracking_number,
        o.courier_partner,
        o.created_at,
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'status', oe.status,
                        'location', oe.location,
                        'description', oe.description,
                        'created_at', oe.created_at
                    ) ORDER BY oe.created_at ASC
                )
                FROM public.order_events oe
                WHERE oe.order_id = o.id
            ),
            '[]'::jsonb
        ) AS timeline
    FROM public.orders o
    WHERE LOWER(TRIM(o.id)) = LOWER(TRIM(p_order_number))
      AND (
          RIGHT(REGEXP_REPLACE(o.customer_phone, '\D', '', 'g'), 10) = RIGHT(REGEXP_REPLACE(p_phone, '\D', '', 'g'), 10)
      )
    LIMIT 1;
END;
$$;
