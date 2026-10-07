-- ====================================================================
-- Divine's Eternity - Seed Data
-- supabase/seed.sql
-- ====================================================================

-- Insert Initial Strict Categories
INSERT INTO public.categories (id, name, tagline, badge, sort_order)
VALUES 
  ('products', 'Products', 'Discover the world of Divine’s Eternity', 'All Gifts', 1),
  ('personalization', 'Personalization', 'WhatsApp confirmed bespoke gifts', 'WhatsApp Verified', 2),
  ('collaboration', 'Collaboration', 'UGC, paid collabs & brand deals', 'Creators & Brands', 3),
  ('upcoming-campaigns', 'Upcoming Campaigns', 'Follow @divineseternity & join rewards', '@divineseternity', 4),
  ('creator-club', 'Creator Club', 'Learn, collaborate & earn up to 7k', 'Earn up to ₹7k', 5),
  ('affiliate-marketing', 'Affiliate Marketing', 'Share products & earn 15-20% commission', '15-20% Comm.', 6),
  ('podcast', 'Podcast', 'Creativity, entrepreneurship & journeys', 'Episodes', 7)
ON CONFLICT (id) DO NOTHING;

-- Insert Official Verified Coupons
INSERT INTO public.coupons (code, description, type, value, min_order_value, min_items, is_active)
VALUES 
  ('BUY3PAY2', 'Buy 3 Gifts, Pay for 2 (Cheapest Item 100% Free)', 'buy3pay2', 100, 0, 3, true),
  ('FLAT849', 'Get any 2 items under ₹999 for Flat ₹849 total', 'flat849', 849, 0, 2, true),
  ('LOVE100', 'Flat ₹100 Off on orders above ₹799', 'flat', 100, 799, 1, true),
  ('GENZ15', 'Exclusive 15% Off across all curated gifts', 'percentage', 15, 499, 1, true),
  ('WELCOME100', 'Welcome VIP Gift: Flat ₹100 off your first purchase', 'flat', 100, 599, 1, true)
ON CONFLICT (code) DO NOTHING;
