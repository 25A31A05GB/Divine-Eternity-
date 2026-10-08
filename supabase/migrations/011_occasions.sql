-- Migration 011: Occasion Landing Pages & Settings
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS product_occasions text[] DEFAULT '{}';

CREATE TABLE IF NOT EXISTS occasion_settings (
  slug text PRIMARY KEY,
  headline text NOT NULL,
  intro text NOT NULL,
  cutoff_date text NOT NULL,
  banner_text text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE occasion_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on occasion_settings" ON occasion_settings
  FOR SELECT USING (true);

-- Allow authenticated/admin write access
CREATE POLICY "Allow authenticated full access on occasion_settings" ON occasion_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed default occasion settings
INSERT INTO occasion_settings (slug, headline, intro, cutoff_date, banner_text)
VALUES
  (
    'rakhi',
    'Raksha Bandhan Luxury Keepsakes & Hampers',
    'Celebrate the sacred bond of sibling love with handcrafted personalized silver charms, photo frames, and customized hampers.',
    'August 15, 2026',
    'Order by August 15 for guaranteed delivery before Raksha Bandhan!'
  ),
  (
    'diwali',
    'Diwali Festive Elegance & Artisanal Gifts',
    'Illuminate your celebrations with brass diyas, gold-foiled photo keepsakes, and heirloom-quality festive gift hampers.',
    'November 1, 2026',
    'Order by November 1 for guaranteed delivery before Diwali festivities!'
  ),
  (
    'valentines',
    'Valentine’s Day Romantic Keepsakes & Custom Jewelry',
    'Express your deepest affection with customized Spotify audio frames, engraved initials, and personalized couple caricatures.',
    'February 10, 2026',
    'Order by February 10 for express delivery before Valentine’s Day!'
  ),
  (
    'birthday',
    'Personalized Birthday Keepsakes & Custom Gifts',
    'Make their special day truly unforgettable with tailored memory boxes, custom Spotify plaques, and bespoke jewelry.',
    '5 Days Before Event',
    'Order at least 5 days in advance for timely personalized birthday crafting!'
  ),
  (
    'anniversary',
    'Milestone Anniversary Artisanal Keepsakes',
    'Honor years of togetherness with customized romantic photo frames, solid brass engraved plaques, and luxury hampers.',
    '5 Days Before Event',
    'Order at least 5 days in advance for guaranteed handcrafted perfection!'
  )
ON CONFLICT (slug) DO UPDATE
SET
  headline = EXCLUDED.headline,
  intro = EXCLUDED.intro,
  cutoff_date = EXCLUDED.cutoff_date,
  banner_text = EXCLUDED.banner_text;
