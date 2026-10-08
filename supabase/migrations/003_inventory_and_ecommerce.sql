-- ==============================================================================
-- 003_ecommerce_features.sql
-- Enterprise E-Commerce Capabilities for Divine's Eternity
-- ==============================================================================

-- 1. ADD MISSING COLUMNS TO PRODUCTS
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 50;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS hsn_code TEXT DEFAULT '7117';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gst_rate NUMERIC DEFAULT 18;

-- 2. STOCK CONTROL FUNCTIONS
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
    RAISE EXCEPTION 'Insufficient stock for product %. Requested: %, Available: %', p_product_id, p_qty, v_current_stock;
  END IF;

  UPDATE public.products
  SET 
    stock_quantity = v_current_stock - p_qty,
    in_stock = (v_current_stock - p_qty) > 0,
    updated_at = NOW()
  WHERE id = p_product_id;
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

-- 3. NOTIFICATION LOG TABLE
CREATE TABLE IF NOT EXISTS public.notification_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'email' | 'whatsapp'
  event_type TEXT NOT NULL, -- 'order_confirmed' | 'shipped' | 'delivered' | 'return_update' | 'proof_sent' | etc.
  recipient TEXT NOT NULL,
  status TEXT NOT NULL, -- 'sent' | 'failed' | 'simulated'
  error TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMER ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RETURN & CANCELLATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.return_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  user_id UUID,
  phone TEXT NOT NULL,
  type TEXT NOT NULL, -- 'cancel' | 'replace' | 'refund'
  reason TEXT NOT NULL,
  details TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'requested', -- 'requested' | 'approved' | 'rejected' | 'received' | 'completed'
  admin_note TEXT,
  refund_amount NUMERIC,
  refund_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INVOICE COUNTER TABLE & SEQUENTIAL GENERATOR
CREATE TABLE IF NOT EXISTS public.invoice_counter (
  id INT PRIMARY KEY DEFAULT 1,
  year_prefix TEXT NOT NULL DEFAULT '2026-27',
  last_number INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.invoice_counter (id, year_prefix, last_number)
VALUES (1, '2026-27', 0)
ON CONFLICT (id) DO NOTHING;

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

-- 7. ABANDONED CARTS TABLE
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

-- 8. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. '18K Rose Gold' or 'iPhone 15 Pro'
  material TEXT,
  extra_price NUMERIC DEFAULT 0,
  stock_quantity INT DEFAULT 20,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STOCK ALERTS (NOTIFY ME) TABLE
CREATE TABLE IF NOT EXISTS public.stock_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REVIEWS TABLE & RATING AGGREGATE VIEW
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id TEXT,
  user_id UUID,
  customer_name TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  is_verified_buyer BOOLEAN DEFAULT false,
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE VIEW public.product_ratings AS
SELECT 
  product_id,
  ROUND(AVG(rating)::numeric, 1) AS average_rating,
  COUNT(*)::integer AS total_reviews
FROM public.reviews
WHERE status = 'approved'
GROUP BY product_id;

-- 11. REFERRALS & AFFILIATES TABLES
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  commission_percent NUMERIC DEFAULT 10,
  status TEXT DEFAULT 'active', -- 'pending' | 'active' | 'suspended'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliate_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  commission NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'paid'
  payout_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ADMIN AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  user_email TEXT,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ADDITIONAL ORDER & ITEM COLUMNS
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoice_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoice_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS awb_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS courier_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS production_status TEXT DEFAULT 'in_production';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS affiliate_code TEXT;

-- Enable RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
