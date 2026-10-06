import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, Heart, ShoppingBag, Menu, X, Sun, Moon, ChevronDown, Sparkles, ShieldCheck, ArrowRight, Star, Lock, Package, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, INITIAL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { PhoneCaseMockup } from '../../utils/productVisuals';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string, params?: Record<string, string>) => void;
  openSearch: () => void;
  onQuickView?: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, openSearch, onQuickView }) => {
  const { totalItemsCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Prevent page scroll when full-screen mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const liveSuggestions = useMemo(() => {
    if (!headerSearchQuery.trim()) return [];
    const q = headerSearchQuery.toLowerCase();
    return INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.supportedBrands && p.supportedBrands.some((b) => b.toLowerCase().includes(q)))
    ).slice(0, 5);
  }, [headerSearchQuery]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsCollectionsHovered(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsCollectionsHovered(false);
    }, 200);
  };

  const navigateTo = (view: string, params?: Record<string, string>) => {
    setCurrentView(view, params);
    setIsMobileMenuOpen(false);
    setIsCollectionsHovered(false);
    setIsSearchDropdownOpen(false);
    setHeaderSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08090B]/90 backdrop-blur-xl border-b border-[#242C3D] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <button
            onClick={() => navigateTo('home')}
            className="flex flex-col text-left group focus:outline-none"
          >
            <span className="font-serif text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#F7F4EC] group-hover:text-[#22D3EE] transition-colors whitespace-nowrap">
              Divine's Eternity
            </span>
          </button>
        </div>

        {/* Live Search Input Bar (Desktop) */}
        <div ref={searchContainerRef} className="hidden lg:block relative flex-1 max-w-xs xl:max-w-sm mx-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#A7AFBD] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={headerSearchQuery}
              onChange={(e) => {
                setHeaderSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              placeholder="Search jewelry, roses, plaques..."
              className="w-full bg-[#151A24] border border-[#242C3D] rounded-full pl-9 pr-8 py-1.5 text-xs text-[#F7F4EC] placeholder-[#737C8C] focus:ring-2 focus:ring-[#5B8CFF] focus:border-transparent focus:outline-none shadow-xs transition-all"
            />
            {headerSearchQuery && (
              <button
                onClick={() => setHeaderSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 text-[#A7AFBD] hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Real-time Predictive Search Results Dropdown */}
          {isSearchDropdownOpen && headerSearchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A161A] rounded-2xl shadow-2xl border border-[#EFE7DE] dark:border-stone-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1 text-[10px] font-bold tracking-widest text-[#881337] dark:text-[#FB7185] uppercase flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-1.5 mb-1.5">
                <span>Atelier Suggestions</span>
                <span className="font-mono text-stone-400">{liveSuggestions.length} found</span>
              </div>

              {liveSuggestions.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-500">
                  No gifts matching "{headerSearchQuery}".
                </div>
              ) : (
                <div className="space-y-1.5">
                  {liveSuggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigateTo('product-detail', { slug: item.slug });
                      }}
                      className="p-2 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-stone-800 flex items-center gap-3 cursor-pointer transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-stone-50 dark:bg-stone-900 p-0.5 border border-stone-200 dark:border-stone-700 shrink-0 flex items-center justify-center">
                        <PhoneCaseMockup product={item} className="w-full h-full scale-90" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-stone-900 dark:text-white truncate group-hover:text-[#881337]">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate">
                          {item.category} · ₹{item.price}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#881337] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => navigateTo('home')}
            className={`text-xs font-medium transition-colors hover:text-[#881337] dark:hover:text-[#FB7185] ${
              currentView === 'home'
                ? 'text-[#881337] dark:text-[#FB7185] font-bold border-b-2 border-[#881337] pb-0.5'
                : 'text-stone-700 dark:text-stone-300'
            }`}
          >
            Home
          </button>

          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => navigateTo('collections', { category: 'all' })}
              className={`text-xs font-medium flex items-center gap-1 transition-colors hover:text-[#881337] dark:hover:text-[#FB7185] ${
                currentView === 'collections'
                  ? 'text-[#881337] dark:text-[#FB7185] font-bold border-b-2 border-[#881337] pb-0.5'
                  : 'text-stone-700 dark:text-stone-300'
              }`}
            >
              <span>Collections</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isCollectionsHovered ? 'rotate-180' : ''}`} />
            </button>

            {isCollectionsHovered && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white dark:bg-[#1A161A] rounded-2xl shadow-xl border border-[#EFE7DE] dark:border-[#2C242A] p-2 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold tracking-widest text-[#881337] dark:text-[#FB7185] uppercase flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2 mb-1">
                  <span>Atelier Categories</span>
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                </div>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => navigateTo('collections', { category: cat.name })}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-stone-800 dark:text-stone-200 hover:bg-[#FAF7F2] dark:hover:bg-black/30 hover:text-[#881337] transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#881337] dark:bg-[#FB7185] group-hover:scale-150 transition-transform" />
                      <span className="truncate max-w-[200px]">{cat.name}</span>
                    </span>
                    <Sparkles className="w-3 h-3 text-[#5B8CFF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
                <div className="pt-2 mt-1 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => navigateTo('collections', { category: 'all' })}
                    className="w-full text-center py-1.5 text-[11px] font-bold text-[#881337] dark:text-[#FB7185] hover:underline"
                  >
                    View All Personalized Keepsakes →
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigateTo('creator-club')}
            className={`text-xs font-medium flex items-center gap-1.5 transition-colors hover:text-[#881337] dark:hover:text-[#FB7185] ${
              currentView === 'creator-club'
                ? 'text-[#881337] dark:text-[#FB7185] font-bold border-b-2 border-[#881337] pb-0.5'
                : 'text-stone-700 dark:text-stone-300'
            }`}
          >
            <span>Creator Club</span>
          </button>

          <button
            onClick={() => navigateTo('track-order')}
            className={`text-xs font-medium transition-colors hover:text-[#881337] dark:hover:text-[#FB7185] ${
              currentView === 'track-order'
                ? 'text-[#881337] dark:text-[#FB7185] font-bold border-b-2 border-[#881337] pb-0.5'
                : 'text-stone-700 dark:text-stone-300'
            }`}
          >
            Track Order
          </button>

          <button
            onClick={() => navigateTo('contact')}
            className={`text-xs font-medium transition-colors hover:text-[#5B8CFF] ${
              currentView === 'contact'
                ? 'text-[#5B8CFF] font-bold border-b-2 border-[#5B8CFF] pb-0.5'
                : 'text-[#A7AFBD]'
            }`}
          >
            Contact
          </button>

          <button
            onClick={() => navigateTo('secret-admin-portal')}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors hover:text-[#22D3EE] ${
              currentView === 'secret-admin-portal' || currentView === 'admin'
                ? 'text-[#22D3EE] font-bold border-b-2 border-[#22D3EE] pb-0.5'
                : 'text-[#A7AFBD]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Dashboard</span>
          </button>
        </nav>

        {/* Zone 3: Slim Main Header Interactive Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="hidden sm:flex p-1.5 sm:p-2 text-[#A7AFBD] hover:text-[#F7F4EC] rounded-full hover:bg-[#1B2230] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#22D3EE]" /> : <Moon className="w-4 h-4 text-[#A7AFBD]" />}
          </button>

          <button
            onClick={openSearch}
            aria-label="Search gifts"
            className="p-1.5 sm:p-2 text-[#A7AFBD] hover:text-[#F7F4EC] rounded-full hover:bg-[#1B2230] transition-colors"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => navigateTo('wishlist')}
            aria-label="Wishlist"
            className="hidden sm:flex relative p-1.5 sm:p-2 text-[#A7AFBD] hover:text-[#F7F4EC] rounded-full hover:bg-[#1B2230] transition-colors"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#5B8CFF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Compact Bag button on Mobile, Expanded on Desktop */}
          <button
            onClick={openCart}
            aria-label="Open Shopping Bag"
            className="sm:hidden relative p-2 bg-[#151A24] border border-[#242C3D] text-[#F7F4EC] rounded-xl flex items-center justify-center active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-4 h-4 text-[#22D3EE]" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#5B8CFF] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Quick Dashboard Action Button */}
          <button
            onClick={() => navigateTo('secret-admin-portal')}
            title="Admin & Media Dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#151A24] border border-[#242C3D] hover:border-[#5B8CFF] text-xs font-semibold text-[#F7F4EC] transition-all hover:bg-[#1B2230] shadow-xs cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={openCart}
            aria-label="Open Shopping Bag"
            className="hidden sm:flex items-center gap-2 bg-[#151A24] border border-[#242C3D] text-[#F7F4EC] hover:bg-[#1B2230] hover:border-[#5B8CFF] px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all transform active:scale-95 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#22D3EE]" />
            <span>Bag</span>
            <span className="bg-[#5B8CFF] text-white text-xs px-1.5 py-0.2 rounded-md font-extrabold min-w-[18px] text-center">
              {totalItemsCount}
            </span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Toggle menu"
            className="md:hidden p-1.5 sm:p-2 text-[#F7F4EC] rounded-xl bg-[#151A24] border border-[#242C3D] hover:bg-[#1B2230]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Full-Screen Slide-in Mobile Navigation Drawer Portal */}
      {isMobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="md:hidden fixed inset-0 z-[9999] w-full h-full h-[100dvh] bg-[#08090B] text-[#F7F4EC] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 p-5 shadow-2xl">
            
            <div>
              {/* Drawer Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#242C3D]">
                <button
                  onClick={() => navigateTo('home')}
                  className="font-serif text-xl font-bold text-[#F7F4EC]"
                >
                  Divine's Eternity
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                    className="p-2 rounded-full bg-[#151A24] border border-[#242C3D] text-[#F7F4EC]"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-[#22D3EE]" /> : <Moon className="w-4 h-4 text-[#A7AFBD]" />}
                  </button>

                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-[#151A24] border border-[#242C3D] text-[#F7F4EC] shadow-md"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Executive Secret Admin Access Banner (Top of Drawer) */}
              <div className="my-4">
                <button
                  onClick={() => navigateTo('secret-admin-portal')}
                  className="w-full p-3.5 rounded-2xl bg-[#151A24] border border-[#5B8CFF]/50 text-left text-white flex items-center justify-between shadow-lg active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0C1220] border border-[#242C3D] text-[#22D3EE] flex items-center justify-center shrink-0">
                      <Lock className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F7F4EC]">Executive Admin Studio</div>
                      <div className="text-[10px] text-[#22D3EE]">Media & Slot Control Panel</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold gradient-blue-violet text-white px-2.5 py-1 rounded-md shadow-xs">
                    PIN: 7788
                  </span>
                </button>
              </div>

              {/* Search Input Box with Suggestions */}
              <div className="my-5">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#737C8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={headerSearchQuery}
                    onChange={(e) => setHeaderSearchQuery(e.target.value)}
                    placeholder="Search gifts, jewelry, roses..."
                    className="w-full bg-[#151A24] border border-[#242C3D] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#F7F4EC] placeholder-[#737C8C] focus:ring-2 focus:ring-[#5B8CFF] focus:outline-none shadow-xs"
                  />
                </div>

                {liveSuggestions.length > 0 && (
                  <div className="mt-2 bg-[#151A24] rounded-2xl border border-[#242C3D] p-2 space-y-1 shadow-md">
                    {liveSuggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigateTo('product-detail', { slug: item.slug })}
                        className="p-2 rounded-xl hover:bg-[#1B2230] flex items-center gap-2.5 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#0C1220] border border-[#242C3D] shrink-0 flex items-center justify-center p-0.5">
                          <PhoneCaseMockup product={item} className="w-full h-full" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-xs font-bold text-[#F7F4EC] truncate">{item.name}</div>
                          <div className="text-[10px] text-[#A7AFBD]">₹{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User Account & Quick Actions Card */}
              <div className="bg-[#151A24] border border-[#242C3D] rounded-2xl p-4 mb-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#242C3D] mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#5B8CFF] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user?.name ? user.name.charAt(0) : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F7F4EC]">
                        {user?.name || 'Atelier VIP Member'}
                      </div>
                      <div className="text-[10px] text-[#22D3EE] font-medium">
                        {user?.email || 'VIP Member Access'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      openCart();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl gradient-blue-violet text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Bag ({totalItemsCount})</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    onClick={() => navigateTo('track-order')}
                    className="p-2.5 rounded-xl bg-[#0C1220] border border-[#242C3D] text-[#F7F4EC] hover:bg-[#1B2230] flex items-center gap-2 transition-colors"
                  >
                    <Package className="w-4 h-4 text-[#22D3EE]" />
                    <span>Track Orders</span>
                  </button>

                  <button
                    onClick={() => navigateTo('wishlist')}
                    className="p-2.5 rounded-xl bg-[#0C1220] border border-[#242C3D] text-[#F7F4EC] hover:bg-[#1B2230] flex items-center gap-2 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-[#5B8CFF]" />
                    <span>Wishlist ({wishlistCount})</span>
                  </button>
                </div>
              </div>

              {/* Navigation Section */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5B8CFF] mb-2 font-mono">
                  Explore Atelier Collections
                </div>

                {[
                  { label: 'Home Page', view: 'home' },
                  { label: 'All Collections & Keepsakes', view: 'collections', params: { category: 'all' } },
                  { label: 'Personalized Name Jewelry', view: 'collections', params: { category: 'Personalized Name Jewelry' } },
                  { label: 'Preserved Eternal Roses', view: 'collections', params: { category: 'Preserved Eternal Roses & Dome Displays' } },
                  { label: 'Scannable Acrylic Song Plaques', view: 'collections', params: { category: 'Custom Acrylic Song Plaques & Photo Frames' } },
                  { label: 'Creator Ambassador Club', view: 'creator-club' },
                  { label: 'Concierge & Client Care', view: 'contact' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateTo(item.view, item.params)}
                    className="w-full text-left p-3 rounded-2xl bg-[#151A24] border border-[#242C3D] hover:border-[#5B8CFF] hover:bg-[#1B2230] transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span className="text-xs font-semibold text-[#F7F4EC] group-hover:text-[#22D3EE] transition-colors">
                      {item.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#737C8C] group-hover:text-[#5B8CFF] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Admin Link */}
            <div className="pt-4 mt-6 border-t border-[#242C3D]">
              <button
                onClick={() => navigateTo('secret-admin-portal')}
                className="w-full p-3 rounded-2xl bg-[#0C1220] border border-[#242C3D] text-left text-[#A7AFBD] hover:text-[#F7F4EC] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
                  <span>Switch to Executive Admin Dashboard</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>,
          document.body
        )}
    </header>
  );
};

