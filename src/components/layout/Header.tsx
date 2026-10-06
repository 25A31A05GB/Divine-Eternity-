import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Sun, Moon, ChevronDown, Sparkles, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
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
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

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
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#0F0D10]/95 backdrop-blur-md border-b border-[#EFE7DE] dark:border-[#282127] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single Element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('home')}
            className="flex flex-col text-left group focus:outline-none"
          >
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F0EB] group-hover:text-[#881337] dark:group-hover:text-[#FB7185] transition-colors whitespace-nowrap">
              Divine's Eternity
            </span>
          </button>
        </div>

        {/* Live Search Input Bar */}
        <div ref={searchContainerRef} className="hidden lg:block relative flex-1 max-w-xs xl:max-w-sm mx-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={headerSearchQuery}
              onChange={(e) => {
                setHeaderSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              placeholder="Search jewelry, roses, plaques..."
              className="w-full bg-white dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-full pl-9 pr-8 py-1.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:ring-2 focus:ring-[#881337] focus:outline-none shadow-xs transition-all"
            />
            {headerSearchQuery && (
              <button
                onClick={() => setHeaderSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 text-stone-400 hover:text-stone-600 p-0.5"
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

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
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

          {/* Collections Dropdown Trigger */}
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

            {/* Dropdown Menu */}
            {isCollectionsHovered && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white dark:bg-[#1A161A] rounded-2xl shadow-xl border border-[#EFE7DE] dark:border-[#2C242A] p-2 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
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
                    <span className="text-[10px] text-stone-400 group-hover:text-[#881337]">
                      ✦
                    </span>
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
            className={`text-xs font-medium transition-colors hover:text-[#881337] dark:hover:text-[#FB7185] ${
              currentView === 'contact'
                ? 'text-[#881337] dark:text-[#FB7185] font-bold border-b-2 border-[#881337] pb-0.5'
                : 'text-stone-700 dark:text-stone-300'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Primary Interactive Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 text-stone-700 dark:text-stone-300 hover:text-[#881337] rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E5C378]" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>

          <button
            onClick={openSearch}
            aria-label="Search gifts and keepsakes"
            className="p-2 text-stone-700 dark:text-stone-300 hover:text-[#881337] rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => navigateTo('wishlist')}
            aria-label="Wishlist"
            className="relative p-2 text-stone-700 dark:text-stone-300 hover:text-[#881337] rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#881337] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={openCart}
            aria-label="Open Shopping Bag"
            className="flex items-center gap-2 bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] hover:bg-[#881337] dark:hover:bg-[#BE123C] dark:hover:text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all transform active:scale-95 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            <span className="bg-[#C5A059] text-stone-950 text-xs px-1.5 py-0.2 rounded-md font-extrabold min-w-[18px] text-center">
              {totalItemsCount}
            </span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 text-stone-800 dark:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0F0D10] border-b border-[#EFE7DE] dark:border-[#282127] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              placeholder="Search gifts, jewelry, roses..."
              className="w-full bg-[#FAF7F2] dark:bg-stone-900 border border-[#EFE7DE] dark:border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateTo('home')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-stone-800/50 text-xs font-semibold text-stone-900 dark:text-white"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('collections', { category: 'all' })}
              className="text-left px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-stone-800/50 text-xs font-semibold text-stone-900 dark:text-white"
            >
              All Collections
            </button>
            <button
              onClick={() => navigateTo('track-order')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-stone-800/50 text-xs font-semibold text-stone-900 dark:text-white"
            >
              Track Shipment
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-stone-800/50 text-xs font-semibold text-stone-900 dark:text-white"
            >
              Client Care
            </button>
            <button
              onClick={() => navigateTo('wishlist')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-stone-800/50 text-xs font-semibold text-stone-900 dark:text-white"
            >
              Wishlist ({wishlistCount})
            </button>
            <button
              onClick={() => navigateTo('creator-club')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-[#881337]/10 dark:bg-stone-800/50 text-xs font-semibold text-[#881337] dark:text-[#FB7185] flex items-center gap-1.5"
            >
              Creator Club
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
