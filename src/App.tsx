import React, { useState, useEffect, Suspense } from 'react';
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
import { HomePage } from './pages/HomePage';
import { INITIAL_PRODUCTS } from './data/products';
import { Product, Order } from './types';
import { db, getStoredProducts } from './lib/db';
import { parseCurrentLocation, formatPath } from './lib/router';
import { X, AlertCircle } from 'lucide-react';

const CollectionsPage = React.lazy(() => import('./pages/CollectionsPage').then((m) => ({ default: m.CollectionsPage })));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = React.lazy(() => import('./pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })));
const TrackOrderPage = React.lazy(() => import('./pages/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const WishlistPage = React.lazy(() => import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const PersonalizationPage = React.lazy(() => import('./pages/PersonalizationPage').then((m) => ({ default: m.PersonalizationPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const CreatorCollabPage = React.lazy(() => import('./pages/CreatorCollabPage').then((m) => ({ default: m.CreatorCollabPage })));
const PolicyPage = React.lazy(() => import('./pages/PolicyPage').then((m) => ({ default: m.PolicyPage })));
const AccountPage = React.lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const ProofApprovalPage = React.lazy(() => import('./pages/ProofApprovalPage').then((m) => ({ default: m.ProofApprovalPage })));
const OccasionLandingPage = React.lazy(() => import('./pages/OccasionLandingPage').then((m) => ({ default: m.OccasionLandingPage })));
const GiftFinderPage = React.lazy(() => import('./pages/GiftFinderPage').then((m) => ({ default: m.GiftFinderPage })));
const FAQPage = React.lazy(() => import('./pages/FAQPage').then((m) => ({ default: m.FAQPage })));
const SecretAdminPortal = React.lazy(() => import('./pages/SecretAdminPortal').then((m) => ({ default: m.SecretAdminPortal })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const FloatingWhatsApp = React.lazy(() => import('./components/common/FloatingWhatsApp').then((m) => ({ default: m.FloatingWhatsApp })));

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
  'account',
  'proof-approval',
  'gifts',
  'gift-finder',
  'faq',
  'admin',
  'secret-admin-portal',
]);

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
      const match = parseCurrentLocation(INITIAL_PRODUCTS);
      return match.view;
    }
    return 'home';
  });

  const [viewParams, setViewParams] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const match = parseCurrentLocation(INITIAL_PRODUCTS);
      return match.params;
    }
    return {};
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    if (typeof window !== 'undefined') {
      const match = parseCurrentLocation(INITIAL_PRODUCTS);
      return match.product;
    }
    return null;
  });

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [cloudError, setCloudError] = useState<string | null>(null);

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

  // Re-fetch products on window focus, tab visibility, and every 2 minutes (NOT while admin is open)
  const isSecretAdminView = currentView === 'secret-admin-portal' || currentView === 'admin';

  useEffect(() => {
    if (isSecretAdminView) return;

    let isMounted = true;
    const fetchLatestProducts = async () => {
      try {
        const { data } = await db.getProducts();
        if (data && data.length > 0 && isMounted) {
          setProducts((current) => {
            if (JSON.stringify(current) !== JSON.stringify(data)) {
              return data;
            }
            return current;
          });
        }
      } catch (err) {
        console.warn('Re-fetch products error:', err);
      }
    };

    const handleFocus = () => fetchLatestProducts();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchLatestProducts();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    const interval = setInterval(fetchLatestProducts, 2 * 60 * 1000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [isSecretAdminView]);

  // Sync route and selected product whenever products change or URL updates
  useEffect(() => {
    const handleLocationChange = () => {
      const match = parseCurrentLocation(products);
      setCurrentView(match.view);
      setViewParams(match.params);
      if (match.product) {
        setSelectedProduct(match.product);
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

  // Navigate handler that updates History API path and state
  const handleNavigate = (view: string, params?: Record<string, string>) => {
    const targetPath = formatPath(view, params);
    if (typeof window !== 'undefined') {
      const currentFull = window.location.pathname + window.location.search;
      if (currentFull !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
    const match = parseCurrentLocation(products);
    setCurrentView(match.view);
    setViewParams(match.params);
    if (match.product) {
      setSelectedProduct(match.product);
    }
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
  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    const res = await db.saveProduct(newProduct);
    if (!res.success) {
      setCloudError(res.error || 'Failed to save product to cloud');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    const res = await db.saveProduct(updatedProduct);
    if (!res.success) {
      setCloudError(res.error || 'Failed to update product in cloud');
    }
  };

  const handleBulkUpdateProducts = async (updatedProducts: Product[]) => {
    setProducts((prev) => {
      const updateMap = new Map(updatedProducts.map((p) => [p.id, p]));
      return prev.map((p) => updateMap.get(p.id) || p);
    });
    const res = await db.saveProducts(updatedProducts);
    if (!res.success) {
      setCloudError(res.error || 'Failed to save products to cloud');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    const res = await db.deleteProduct(productId);
    if (!res.success) {
      setCloudError(res.error || 'Failed to delete product from cloud');
    }
  };

  const isKnownView = VALID_VIEWS.has(currentView);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col justify-between bg-[#FFFDF8] text-[#211D1C] selection:bg-[#FF2E93] selection:text-white transition-colors duration-300">
      
      {/* Cloud save failure banner */}
      {cloudError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-xl w-[90%] bg-red-600 text-white px-4 py-3 rounded-2xl shadow-2xl border border-red-400 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-white" />
            <span>Saved on this device only — cloud save failed: {cloudError}</span>
          </div>
          <button
            onClick={() => setCloudError(null)}
            className="p-1 hover:bg-red-700 rounded-lg transition-colors cursor-pointer text-white"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Global Announcement Bar (hidden in secret admin view) */}
      {!isSecretAdminView && <AnnouncementBar />}

      {/* 2. Global Sticky Header (hidden in secret admin view for clean isolation) */}
      {!isSecretAdminView && (
        <Header
          currentView={currentView}
          setCurrentView={handleNavigate}
          openSearch={() => setIsSearchOpen(true)}
          onQuickView={handleOpenQuickView}
          products={products}
        />
      )}

      {/* Main View Router */}
      <main key={currentView} className="flex-1 w-full animate-in fade-in duration-300 relative z-0">
        <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-xs font-serif text-stone-500 py-12">Loading…</div>}>
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

          {currentView === 'account' && (
            <AccountPage
              products={products}
              onQuickView={handleOpenQuickView}
              onOpenDetail={handleOpenDetail}
              onNavigateToCollection={(cat) => handleNavigate('collections', { category: cat || 'all' })}
            />
          )}

          {currentView === 'proof-approval' && (
            <ProofApprovalPage token={viewParams.token || ''} />
          )}

          {currentView === 'gifts' && (
            <OccasionLandingPage
              occasionSlug={viewParams.occasion || 'rakhi'}
              products={products}
              onProductClick={handleOpenDetail}
              onQuickView={handleOpenQuickView}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'gift-finder' && (
            <GiftFinderPage
              products={products}
              onProductClick={handleOpenDetail}
              onQuickView={handleOpenQuickView}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'faq' && <FAQPage />}

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
        </Suspense>
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
        products={products}
      />

      {/* Non-intrusive Welcome Newsletter Offer Popup on Homepage */}
      {currentView === 'home' && !isSecretAdminView && (
        <NewsletterModal delayMs={10000} />
      )}

      {/* Luxury WhatsApp Concierge with Audio Ping Feedback & Dynamic Context Intelligence */}
      {!isSecretAdminView && (
        <Suspense fallback={null}>
          <FloatingWhatsApp
            currentView={currentView}
            viewParams={viewParams}
            activeProduct={selectedProduct}
            products={products}
          />
        </Suspense>
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
