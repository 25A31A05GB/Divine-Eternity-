import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { MediaCMSProvider } from './context/MediaCMSContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AdminRouteGuard } from './components/admin/AdminRouteGuard';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { NewsletterModal } from './components/common/NewsletterModal';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { PersonalizationPage } from './pages/PersonalizationPage';
import { ContactPage } from './pages/ContactPage';
import { CreatorCollabPage } from './pages/CreatorCollabPage';
import { PolicyPage } from './pages/PolicyPage';
import { SecretAdminPortal } from './pages/SecretAdminPortal';
import { NotFoundPage } from './pages/NotFoundPage';
import { INITIAL_PRODUCTS } from './data/products';
import { Product, Order } from './types';
import { db, getStoredProducts } from './lib/db';

const VALID_VIEWS = new Set([
  'home',
  'collections',
  'product-detail',
  'checkout',
  'order-confirmation',
  'track-order',
  'wishlist',
  'personalization',
  'bespoke',
  'hamper-builder',
  'contact',
  'creator-club',
  'policy',
  'admin',
  'secret-admin-portal',
]);

// Universal URL parser to support hashes (#collections), pathnames (/collections), and search params (?view=collections&category=jewellery)
function parseURL(productsList: Product[]) {
  if (typeof window === 'undefined') {
    return { view: 'home', params: {} as Record<string, string>, product: null as Product | null };
  }

  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
  const rawPathname = window.location.pathname.replace(/^\//, '').trim();
  const rawSearch = window.location.search.replace(/^\?/, '').trim();

  const params: Record<string, string> = {};

  // 1. Parse standard URL search parameters (?view=collections&category=jewellery)
  if (rawSearch) {
    const searchParams = new URLSearchParams(rawSearch);
    searchParams.forEach((val, key) => {
      params[key] = val;
    });
  }

  // 2. Parse hash query parameters (#collections?category=jewellery)
  let rawRoute = '';
  if (rawHash) {
    const [hashRoute, hashQuery] = rawHash.split('?');
    if (hashRoute) rawRoute = hashRoute;
    if (hashQuery) {
      const hashSearchParams = new URLSearchParams(hashQuery);
      hashSearchParams.forEach((val, key) => {
        params[key] = val;
      });
    }
  }

  // 3. Fallback to pathname if hash is empty (/collections, /secret-admin-portal, /checkout)
  if (!rawRoute && rawPathname) {
    const cleanPath = rawPathname.replace(/\/$/, '').replace(/^index\.html$/, '');
    if (cleanPath) {
      rawRoute = cleanPath;
    }
  }

  // Override view if explicitly provided in query params (?view=collections or ?page=collections)
  if (params.view) {
    rawRoute = params.view;
  } else if (params.page) {
    rawRoute = params.page;
  }

  let view = (rawRoute || 'home').toLowerCase();

  // Admin aliases
  if (view === 'admin' || view === 'secret-admin-portal' || params.admin === 'true') {
    view = 'secret-admin-portal';
  }

  // Legal policy direct aliases
  if (view === 'privacy-policy' || view === 'privacy') {
    view = 'policy';
    params.tab = 'privacy';
  } else if (view === 'terms-and-conditions' || view === 'terms') {
    view = 'policy';
    params.tab = 'terms';
  } else if (view === 'refund-and-cancellation' || view === 'refund-policy' || view === 'refund') {
    view = 'policy';
    params.tab = 'refund';
  } else if (view === 'shipping-and-delivery' || view === 'shipping-policy' || view === 'shipping') {
    view = 'policy';
    params.tab = 'shipping';
  }

  // Fallback for unknown routes
  if (!VALID_VIEWS.has(view)) {
    // Check if view matches a product slug directly (/gift-hamper-1 or /#gift-hamper-1)
    const foundBySlug = productsList.find((p) => p.slug === view || p.id === view);
    if (foundBySlug) {
      view = 'product-detail';
      params.slug = foundBySlug.slug;
    } else {
      view = 'home';
    }
  }

  // Locate selected product if in product-detail view or if slug/product is in params
  let foundProduct: Product | null = null;
  const targetSlug = params.slug || params.product;
  if (targetSlug) {
    foundProduct = productsList.find((p) => p.slug === targetSlug || p.id === targetSlug) || null;
    if (foundProduct && view === 'home') {
      view = 'product-detail';
    }
  }

  return { view, params, product: foundProduct };
}

// Helper to format view and params into a hash string
function formatHash(view: string, params?: Record<string, string>) {
  if (view === 'home' && (!params || Object.keys(params).length === 0)) {
    return '#home';
  }
  let hashStr = `#${view}`;
  if (params && Object.keys(params).length > 0) {
    const q = new URLSearchParams(params).toString();
    if (q) hashStr += `?${q}`;
  }
  return hashStr;
}

export function AppContent() {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = getStoredProducts();
        if (stored && stored.length > 0) return stored;
      } catch {
        // ignore
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const { view } = parseURL(INITIAL_PRODUCTS);
      return view;
    }
    return 'home';
  });

  const [viewParams, setViewParams] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const { params } = parseURL(INITIAL_PRODUCTS);
      return params;
    }
    return {};
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    if (typeof window !== 'undefined') {
      const { product } = parseURL(INITIAL_PRODUCTS);
      return product;
    }
    return null;
  });

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Load products via Database Access Layer and re-evaluate URL targeting
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await db.getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (e) {
        console.warn('Failed to load products from db layer', e);
      }
    };
    loadProducts();
  }, []);

  // Sync route and selected product whenever products change or URL updates
  useEffect(() => {
    const handleLocationChange = () => {
      const { view, params, product } = parseURL(products);
      setCurrentView(view);
      setViewParams(params);
      if (product) {
        setSelectedProduct(product);
      }
    };

    handleLocationChange();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleNavigate('secret-admin-portal');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [products]);

  // Navigate handler that updates both URL hash and state
  const handleNavigate = (view: string, params?: Record<string, string>) => {
    const targetHash = formatHash(view, params);
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    setCurrentView(view);
    setViewParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate('product-detail', { slug: product.slug });
  };

  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  // Admin Catalog Update Handlers (saved to Database layer)
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    db.saveProduct(newProduct);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    db.saveProduct(updatedProduct);
  };

  const handleBulkUpdateProducts = (updatedProducts: Product[]) => {
    setProducts((prev) => {
      const updateMap = new Map(updatedProducts.map((p) => [p.id, p]));
      return prev.map((p) => updateMap.get(p.id) || p);
    });
    db.saveProducts(updatedProducts);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    db.deleteProduct(productId);
  };

  const isSecretAdminView = currentView === 'secret-admin-portal' || currentView === 'admin';
  const isKnownView = VALID_VIEWS.has(currentView);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col justify-between bg-[#FFFDF8] text-[#211D1C] selection:bg-[#FF2E93] selection:text-white transition-colors duration-300">
      
      {/* 1. Global Announcement Bar (hidden in secret admin view) */}
      {!isSecretAdminView && <AnnouncementBar />}

      {/* 2. Global Sticky Header (hidden in secret admin view for clean isolation) */}
      {!isSecretAdminView && (
        <Header
          currentView={currentView}
          setCurrentView={handleNavigate}
          openSearch={() => setIsSearchOpen(true)}
          onQuickView={handleOpenQuickView}
        />
      )}

      {/* Main View Router */}
      <main key={currentView} className="flex-1 w-full animate-in fade-in duration-300 relative z-0">
        {currentView === 'home' && (
          <HomePage
            products={products}
            onQuickView={handleOpenQuickView}
            onOpenDetail={handleOpenDetail}
            onNavigateToCollection={(cat) => handleNavigate('collections', { category: cat })}
          />
        )}

        {currentView === 'collections' && (
          <CollectionsPage
            initialCategory={viewParams.category || 'all'}
            products={products}
            onQuickView={handleOpenQuickView}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => handleNavigate('collections', { category: 'all' })}
            onQuickView={handleOpenQuickView}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => handleNavigate('home')}
            onOrderSuccess={(order) => {
              setCompletedOrder(order);
              handleNavigate('order-confirmation');
            }}
          />
        )}

        {currentView === 'order-confirmation' && completedOrder && (
          <OrderConfirmationPage
            order={completedOrder}
            onTrackOrder={(orderId) => handleNavigate('track-order', { orderId })}
            onContinueShopping={() => handleNavigate('home')}
          />
        )}

        {currentView === 'track-order' && (
          <TrackOrderPage
            initialOrderId={viewParams.orderId || ''}
            onExploreProducts={() => handleNavigate('collections', { category: 'all' })}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            products={products}
            onQuickView={handleOpenQuickView}
            onOpenDetail={handleOpenDetail}
            onExploreProducts={() => handleNavigate('collections', { category: 'all' })}
          />
        )}

        {(currentView === 'personalization' || currentView === 'bespoke' || currentView === 'hamper-builder') && (
          <PersonalizationPage
            onExploreProducts={(cat) => handleNavigate('collections', { category: cat || 'all' })}
            initialTab={currentView === 'hamper-builder' ? 'hamper' : (viewParams.tab as any) || 'hamper'}
          />
        )}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'creator-club' && (
          <CreatorCollabPage
            onExploreProducts={() => handleNavigate('collections', { category: 'all' })}
          />
        )}

        {currentView === 'policy' && (
          <PolicyPage initialTab={(viewParams.tab as any) || 'refund'} />
        )}

        {/* Protected Admin Route with Supabase Auth & RLS Guard */}
        {isSecretAdminView && (
          <AdminRouteGuard onReturnToStore={() => handleNavigate('home')}>
            <SecretAdminPortal
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onBulkUpdateProducts={handleBulkUpdateProducts}
              onDeleteProduct={handleDeleteProduct}
              onReturnToStore={() => handleNavigate('home')}
            />
          </AdminRouteGuard>
        )}

        {/* 404 Fallback for Unrecognized Routes */}
        {!isKnownView && (
          <NotFoundPage
            onReturnHome={() => handleNavigate('home')}
            onExploreCollections={() => handleNavigate('collections', { category: 'all' })}
          />
        )}
      </main>

      {/* 3. Global Luxury Footer (hidden in secret admin view) */}
      {!isSecretAdminView && <Footer setCurrentView={handleNavigate} />}

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      {/* Global Cart Slide-in Drawer */}
      <CartDrawer
        onProceedToCheckout={() => handleNavigate('checkout')}
        onExploreMore={() => handleNavigate('collections', { category: 'all' })}
      />

      {/* Global Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          handleNavigate('product-detail', { slug: p.slug });
        }}
        onSelectCategory={(cat) => handleNavigate('collections', { category: cat })}
      />

      {/* Non-intrusive Welcome Newsletter Offer Popup on Homepage */}
      {currentView === 'home' && !isSecretAdminView && (
        <NewsletterModal delayMs={10000} />
      )}

      {/* Luxury WhatsApp Concierge with Audio Ping Feedback & Dynamic Context Intelligence */}
      {!isSecretAdminView && (
        <FloatingWhatsApp
          currentView={currentView}
          viewParams={viewParams}
          activeProduct={selectedProduct}
          products={products}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <ReviewsProvider>
              <MediaCMSProvider>
                <CartProvider>
                  <AppContent />
                </CartProvider>
              </MediaCMSProvider>
            </ReviewsProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
