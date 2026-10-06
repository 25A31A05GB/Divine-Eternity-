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

export function AppContent() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#secret-admin-portal') {
      return 'secret-admin-portal';
    }
    return 'home';
  });
  const [viewParams, setViewParams] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Stealth hash and keyboard shortcut listener (Ctrl + Shift + A)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#secret-admin-portal' || window.location.hash === '#admin') {
        setCurrentView('secret-admin-portal');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentView('secret-admin-portal');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (view: string, params?: Record<string, string>) => {
    setCurrentView(view);
    if (params) setViewParams(params);
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
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF7F2] dark:bg-[#0F0D10] text-[#1C1917] dark:text-[#F5F0EB] transition-colors duration-300">
      
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
      <main className="flex-1">
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
