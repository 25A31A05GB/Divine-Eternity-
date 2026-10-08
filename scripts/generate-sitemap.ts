import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS } from '../src/data/products';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const DOMAIN = 'https://divineseternity.com';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/collections', priority: '0.9', changefreq: 'weekly' },
  { path: '/collections/personalized-name-jewelry', priority: '0.8', changefreq: 'weekly' },
  { path: '/collections/preserved-eternal-roses', priority: '0.8', changefreq: 'weekly' },
  { path: '/collections/custom-acrylic-song-plaques', priority: '0.8', changefreq: 'weekly' },
  { path: '/collections/memory-photo-lamps-crystal-cubes', priority: '0.8', changefreq: 'weekly' },
  { path: '/collections/engraved-wooden-gift-boxes', priority: '0.8', changefreq: 'weekly' },
  { path: '/collections/romantic-couple-hampers', priority: '0.8', changefreq: 'weekly' },
  { path: '/personalization', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/creator-club', priority: '0.7', changefreq: 'weekly' },
  { path: '/track-order', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  { path: '/refund-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/shipping-policy', priority: '0.5', changefreq: 'yearly' },
];

async function generateSitemap() {
  console.log('[sitemap] Generating sitemap...');
  const today = new Date().toISOString().split('T')[0];
  let productUrls: string[] = [];

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_active', true);

      if (error) {
        console.error('[sitemap] Supabase products query error:', error.message || error);
      } else if (data && data.length > 0) {
        productUrls = data
          .filter((p) => p.slug)
          .map((p) => `  <url>
    <loc>${DOMAIN}/product/${encodeURIComponent(p.slug)}</loc>
    <lastmod>${(p.updated_at || today).split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
        console.log(`[sitemap] Found ${data.length} active products from Supabase.`);
      } else {
        console.warn('[sitemap] Supabase returned 0 active products.');
      }
    } catch (e: any) {
      console.warn('[sitemap] Supabase connection failed:', e?.message || e);
    }
  } else {
    console.log('[sitemap] Supabase credentials not set or incomplete.');
  }

  // Fallback to static catalog products if Supabase returns 0 rows or query errors
  if (productUrls.length === 0) {
    console.log(`[sitemap] Falling back to ${INITIAL_PRODUCTS.length} static products from src/data/products.ts...`);
    productUrls = INITIAL_PRODUCTS
      .filter((p) => p.slug)
      .map((p) => `  <url>
    <loc>${DOMAIN}/product/${encodeURIComponent(p.slug)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    console.log(`[sitemap] Successfully added ${productUrls.length} fallback product URLs.`);
  }

  const staticXml = STATIC_ROUTES.map(
    (r) => `  <url>
    <loc>${DOMAIN}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  ).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${productUrls.join('\n')}
</urlset>
`;

  try {
    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
    console.log(`[sitemap] Successfully written to ${sitemapPath}`);
  } catch (fsErr: any) {
    console.error('[sitemap] Non-fatal file write error:', fsErr?.message || fsErr);
  }
}

generateSitemap().catch((err) => {
  console.error('[sitemap] Non-fatal sitemap generation error:', err);
});
