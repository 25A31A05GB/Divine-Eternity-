import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { MediaCMSProvider } from './context/MediaCMSContext';
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
import { INITIAL_PRODUCTS } from './data/products';
import { Product, Order } from './types';

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
  if (view === 'admin') view = 'secret-admin-portal';

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
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('divines_eternity_products_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load products from storage', e);
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('divines_eternity_products_v1', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to persist products to storage', e);
    }
  }, [products]);

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

    // Sync state on initial load if hash is present
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

  const handleNavigate = (view: string, params?: Record<string, string>) => {
    setCurrentView(view);
    setViewParams(params || {});

    // Sync URL hash for browser history & back button support
    if (typeof window !== 'undefined') {
      const targetHash = formatHash(view, params);
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate('product-detail', { slug: product.slug });
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const isSecretAdminView = currentView === 'secret-admin-portal' || currentView === 'admin';

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

        {isSecretAdminView && (
          <SecretAdminPortal
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onReturnToStore={() => handleNavigate('home')}
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
  );
}
