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
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { ContactPage } from './pages/ContactPage';
import { CreatorCollabPage } from './pages/CreatorCollabPage';
import { PolicyPage } from './pages/PolicyPage';
import { SecretAdminPortal } from './pages/SecretAdminPortal';
import { NotFoundPage } from './pages/NotFoundPage';
import { INITIAL_PRODUCTS } from './data/products';
import { Product, Order } from './types';
import { db } from './lib/db';

const VALID_VIEWS = new Set([
  'home',
  'collections',
  'product-detail',
  'checkout',
  'order-confirmation',
  'track-order',
  'wishlist',
  'contact',
  'creator-club',
  'policy',
  'admin',
  'secret-admin-portal',
]);

// Helper to parse current hash into view, params, and target product
function parseHash(hash: string, productsList: Product[]) {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean) return { view: 'home', params: {}, product: null };

  const [routePart, queryPart] = clean.split('?');
  const params: Record<string, string> = {};

  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    searchParams.forEach((val, key) => {
      params[key] = val;
    });
  }

  let view = routePart || 'home';

  // Admin aliases
  if (view === 'admin' || view === 'secret-admin-portal') {
    view = 'secret-admin-portal';
  }

  // Legal policy direct aliases
  if (view === 'privacy-policy') {
    view = 'policy';
    params.tab = 'privacy';
  } else if (view === 'terms-and-conditions' || view === 'terms') {
    view = 'policy';
    params.tab = 'terms';
  } else if (view === 'refund-and-cancellation' || view === 'refund-policy') {
    view = 'policy';
    params.tab = 'refund';
  } else if (view === 'shipping-and-delivery' || view === 'shipping-policy') {
    view = 'policy';
    params.tab = 'shipping';
  }

  let foundProduct: Product | null = null;
  if (view === 'product-detail' && params.slug) {
    foundProduct = productsList.find((p) => p.slug === params.slug || p.id === params.slug) || null;
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
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Initialize and load products via Database Access Layer
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

  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const { view } = parseHash(window.location.hash, INITIAL_PRODUCTS);
      return view;
    }
    return 'home';
  });

  const [viewParams, setViewParams] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const { params } = parseHash(window.location.hash, INITIAL_PRODUCTS);
      return params;
    }
    return {};
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const { product } = parseHash(window.location.hash, INITIAL_PRODUCTS);
      return product;
    }
    return null;
  });

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Hash & Browser Back/Forward navigation listener
  useEffect(() => {
    const handleHashChange = () => {
      const { view, params, product } = parseHash(window.location.hash, products);
      setCurrentView(view);
      setViewParams(params);
      if (product) {
        setSelectedProduct(product);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleNavigate('secret-admin-portal');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
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
    setProducts(updatedProducts);
    updatedProducts.forEach((p) => db.saveProduct(p));
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
