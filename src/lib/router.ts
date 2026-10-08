import { Product } from '../types';

export interface RouteMatch {
  view: string;
  params: Record<string, string>;
  product: Product | null;
  canonicalPath: string;
}

/**
 * Maps view + params to a real path
 */
export function formatPath(view: string, params?: Record<string, string>): string {
  if (view === 'home' || !view) {
    return '/';
  }

  if (view === 'collections') {
    if (params?.category && params.category !== 'all') {
      return `/collections/${encodeURIComponent(params.category)}`;
    }
    return '/collections';
  }

  if (view === 'product-detail') {
    const slug = params?.slug || params?.product || params?.id || '';
    return slug ? `/product/${encodeURIComponent(slug)}` : '/collections';
  }

  if (view === 'checkout') return '/checkout';
  if (view === 'order-confirmation') return '/order-confirmation';
  if (view === 'track-order') {
    if (params?.orderId) {
      return `/track-order?orderId=${encodeURIComponent(params.orderId)}`;
    }
    return '/track-order';
  }
  if (view === 'wishlist') return '/wishlist';
  if (view === 'personalization' || view === 'bespoke' || view === 'hamper-builder') {
    return '/personalization';
  }
  if (view === 'contact') return '/contact';
  if (view === 'creator-club') return '/creator-club';

  if (view === 'policy') {
    const tab = params?.tab;
    if (tab === 'privacy') return '/privacy-policy';
    if (tab === 'terms') return '/terms';
    if (tab === 'shipping') return '/shipping-policy';
    return '/refund-policy';
  }

  if (view === 'privacy-policy') return '/privacy-policy';
  if (view === 'terms') return '/terms';
  if (view === 'refund-policy') return '/refund-policy';
  if (view === 'shipping-policy') return '/shipping-policy';

  if (view === 'admin' || view === 'secret-admin-portal') {
    return '/admin';
  }

  return `/${encodeURIComponent(view)}`;
}

/**
 * Universal Route Resolver for History API & Real Paths
 * Supports redirecting old #hash links to new paths on load.
 */
export function parseCurrentLocation(productsList: Product[]): RouteMatch {
  if (typeof window === 'undefined') {
    return { view: 'home', params: {}, product: null, canonicalPath: '/' };
  }

  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
  const rawPathname = window.location.pathname;
  const rawSearch = window.location.search;

  // 1. Check for legacy #hash links and compute redirect
  if (rawHash) {
    const [hashPath, hashQuery] = rawHash.split('?');
    const hashParams: Record<string, string> = {};
    if (hashQuery) {
      new URLSearchParams(hashQuery).forEach((v, k) => {
        hashParams[k] = v;
      });
    }

    const cleanHash = hashPath.toLowerCase();
    let targetPath: string | null = null;

    if (cleanHash === 'home' || cleanHash === '') {
      targetPath = '/';
    } else if (cleanHash === 'collections') {
      targetPath = hashParams.category ? `/collections/${encodeURIComponent(hashParams.category)}` : '/collections';
    } else if (cleanHash.startsWith('product-') || cleanHash === 'product' || cleanHash === 'product-detail') {
      const slug = hashParams.slug || hashParams.product || cleanHash.replace(/^product-/, '');
      targetPath = slug ? `/product/${encodeURIComponent(slug)}` : '/collections';
    } else if (cleanHash === 'checkout') {
      targetPath = '/checkout';
    } else if (cleanHash === 'order-confirmation') {
      targetPath = '/order-confirmation';
    } else if (cleanHash === 'track-order' || cleanHash === 'track') {
      targetPath = hashParams.orderId ? `/track-order?orderId=${encodeURIComponent(hashParams.orderId)}` : '/track-order';
    } else if (cleanHash === 'wishlist') {
      targetPath = '/wishlist';
    } else if (cleanHash === 'personalization' || cleanHash === 'bespoke' || cleanHash === 'hamper-builder') {
      targetPath = '/personalization';
    } else if (cleanHash === 'contact') {
      targetPath = '/contact';
    } else if (cleanHash === 'creator-club') {
      targetPath = '/creator-club';
    } else if (cleanHash === 'privacy-policy' || cleanHash === 'privacy') {
      targetPath = '/privacy-policy';
    } else if (cleanHash === 'terms' || cleanHash === 'terms-and-conditions') {
      targetPath = '/terms';
    } else if (cleanHash === 'refund-policy' || cleanHash === 'refund' || cleanHash === 'refund-and-cancellation') {
      targetPath = '/refund-policy';
    } else if (cleanHash === 'shipping-policy' || cleanHash === 'shipping' || cleanHash === 'shipping-and-delivery') {
      targetPath = '/shipping-policy';
    } else if (cleanHash === 'admin' || cleanHash === 'secret-admin-portal') {
      targetPath = '/admin';
    } else {
      // Check if matches product slug directly
      const p = productsList.find((x) => x.slug === cleanHash || x.id === cleanHash);
      if (p) {
        targetPath = `/product/${encodeURIComponent(p.slug || p.id)}`;
      }
    }

    if (targetPath) {
      // Replace legacy hash URL with clean History API path without reload
      window.history.replaceState(null, '', targetPath);
    }
  }

  // 2. Parse current pathname & search from History API
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  searchParams.forEach((v, k) => {
    params[k] = v;
  });

  // Handle Root
  if (pathname === '/' || pathname === '/index.html') {
    return { view: 'home', params, product: null, canonicalPath: '/' };
  }

  // Collections Routes: /collections or /collections/:category
  if (pathname === '/collections') {
    return {
      view: 'collections',
      params: { ...params, category: params.category || 'all' },
      product: null,
      canonicalPath: '/collections',
    };
  }

  if (pathname.startsWith('/collections/')) {
    const category = decodeURIComponent(pathname.replace('/collections/', '')).trim();
    return {
      view: 'collections',
      params: { ...params, category: category || 'all' },
      product: null,
      canonicalPath: `/collections/${category}`,
    };
  }

  // Product Route: /product/:slug
  if (pathname.startsWith('/product/')) {
    const slug = decodeURIComponent(pathname.replace('/product/', '')).trim();
    const product = productsList.find((p) => p.slug === slug || p.id === slug) || null;
    return {
      view: 'product-detail',
      params: { ...params, slug },
      product,
      canonicalPath: `/product/${slug}`,
    };
  }

  // Core Pages
  if (pathname === '/checkout') {
    return { view: 'checkout', params, product: null, canonicalPath: '/checkout' };
  }

  if (pathname === '/order-confirmation') {
    return { view: 'order-confirmation', params, product: null, canonicalPath: '/order-confirmation' };
  }

  if (pathname === '/track-order') {
    return { view: 'track-order', params, product: null, canonicalPath: '/track-order' };
  }

  if (pathname === '/wishlist') {
    return { view: 'wishlist', params, product: null, canonicalPath: '/wishlist' };
  }

  if (pathname === '/personalization' || pathname === '/bespoke' || pathname === '/hamper-builder') {
    return { view: 'personalization', params, product: null, canonicalPath: '/personalization' };
  }

  if (pathname === '/contact') {
    return { view: 'contact', params, product: null, canonicalPath: '/contact' };
  }

  if (pathname === '/creator-club') {
    return { view: 'creator-club', params, product: null, canonicalPath: '/creator-club' };
  }

  // Legal Policy Routes
  if (pathname === '/privacy-policy') {
    return { view: 'policy', params: { ...params, tab: 'privacy' }, product: null, canonicalPath: '/privacy-policy' };
  }

  if (pathname === '/terms' || pathname === '/terms-and-conditions') {
    return { view: 'policy', params: { ...params, tab: 'terms' }, product: null, canonicalPath: '/terms' };
  }

  if (pathname === '/refund-policy' || pathname === '/refund-and-cancellation') {
    return { view: 'policy', params: { ...params, tab: 'refund' }, product: null, canonicalPath: '/refund-policy' };
  }

  if (pathname === '/shipping-policy' || pathname === '/shipping-and-delivery') {
    return { view: 'policy', params: { ...params, tab: 'shipping' }, product: null, canonicalPath: '/shipping-policy' };
  }

  if (pathname === '/grievance-officer') {
    return { view: 'policy', params: { ...params, tab: 'grievance' }, product: null, canonicalPath: '/grievance-officer' };
  }

  // Admin Route
  if (pathname === '/admin' || pathname === '/secret-admin-portal') {
    return { view: 'secret-admin-portal', params, product: null, canonicalPath: '/admin' };
  }

  // Check if root slug matches a product (e.g. /18k-gold-necklace)
  const candidateSlug = pathname.replace(/^\//, '');
  const productBySlug = productsList.find((p) => p.slug === candidateSlug || p.id === candidateSlug);
  if (productBySlug) {
    return {
      view: 'product-detail',
      params: { ...params, slug: productBySlug.slug || productBySlug.id },
      product: productBySlug,
      canonicalPath: `/product/${productBySlug.slug}`,
    };
  }

  // Unknown route -> 404
  return { view: '404', params, product: null, canonicalPath: pathname };
}
