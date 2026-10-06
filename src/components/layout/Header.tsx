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
    <header className="sticky top-0 z-40 bg-[#FFF9F5]/95 dark:bg-[#141113]/95 backdrop-blur-md border-b border-[#F5E6E8] dark:border-[#2D252A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('home')}
            className="flex flex-col text-left group focus:outline-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-serif-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#231F20] dark:text-[#FDF9F7] group-hover:text-[#E11D48] transition-colors whitespace-nowrap">
                Divine's Eternity
              </span>
              <span className="text-[#E11D48] text-sm animate-pulse-glow">✦</span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[#E11D48] font-semibold -mt-1 font-sans">
              Gifts that stay in hearts
            </span>
          </button>
        </div>

        {/* Live Search Input Bar */}
        <div ref={searchContainerRef} className="hidden lg:block relative flex-1 max-w-xs xl:max-w-sm mx-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={headerSearchQuery}
              onChange={(e) => {
                setHeaderSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              placeholder="Live search necklaces, roses, plaques..."
              className="w-full bg-white dark:bg-[#1E1A1D] border border-slate-200 dark:border-slate-800 rounded-full pl-9 pr-8 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#E11D48] focus:outline-none shadow-xs transition-all"
            />
            {headerSearchQuery && (
              <button
                onClick={() => setHeaderSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Real-time Predictive Search Results Dropdown */}
          {isSearchDropdownOpen && headerSearchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1E1A1D] rounded-2xl shadow-2xl border border-[#F5E6E8] dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1 text-[10px] font-bold tracking-widest text-[#E11D48] uppercase flex items-center justify-between border-b border-pink-100 dark:border-slate-800 pb-1.5 mb-1.5">
                <span>Real-time Suggestions</span>
                <span className="font-mono text-slate-400">{liveSuggestions.length} found</span>
              </div>

              {liveSuggestions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
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
                      className="p-2 rounded-xl hover:bg-[#FFF9F5] dark:hover:bg-slate-800 flex items-center gap-3 cursor-pointer transition-colors group"
                    >
                      <div className="w-10 h-12 rounded-lg bg-pink-50 dark:bg-black/40 overflow-hidden flex items-center justify-center shrink-0 border border-pink-100">
                        <PhoneCaseMockup
                          product={item}
                          className="w-full h-full scale-75"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#E11D48]">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <span className="truncate max-w-[120px]">{item.category.split('&')[0]}</span>
                          <span>·</span>
                          <span className="font-bold text-[#E11D48]">₹{item.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-[10px] text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-bold ml-0.5">{item.rating}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => navigateTo('collections', { category: 'all' })}
                      className="text-[11px] font-bold text-[#E11D48] hover:underline"
                    >
                      View all gifts in catalog →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 dark:bg-[#1E1A1D]/80 px-3 py-1.5 rounded-full border border-[#F5E6E8] dark:border-[#2D252A] shadow-xs shrink-0">
          <button
            onClick={() => navigateTo('home')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
              currentView === 'home'
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'text-[#231F20] dark:text-[#FDF9F7] hover:text-[#E11D48]'
            }`}
          >
            Home
          </button>

          {/* Collections Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => navigateTo('collections', { category: 'all' })}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 transition-all ${
                currentView === 'collections'
                  ? 'bg-[#E11D48] text-white shadow-xs'
                  : 'text-[#231F20] dark:text-[#FDF9F7] hover:text-[#E11D48]'
              }`}
            >
              Gift Collections
              <ChevronDown className={`w-3 h-3 transition-transform ${isCollectionsHovered ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isCollectionsHovered && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white dark:bg-[#1E1A1D] rounded-2xl shadow-xl border border-[#F5E6E8] dark:border-[#2D252A] p-2 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1 text-[10px] font-bold tracking-widest text-[#E11D48] uppercase flex items-center justify-between border-b border-pink-100 dark:border-pink-950/40 pb-2 mb-1">
                  <span>Personalized Categories</span>
                  <Sparkles className="w-3 h-3 text-[#FFD94A]" />
                </div>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => navigateTo('collections', { category: cat.name })}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-[#FFF9F5] dark:hover:bg-black/30 hover:text-[#E11D48] transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="truncate max-w-[200px]">{cat.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-[#E11D48]">
                      ✦
                    </span>
                  </button>
                ))}
                <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => navigateTo('collections', { category: 'all' })}
                    className="w-full text-center py-1.5 text-[11px] font-bold text-[#E11D48] hover:underline"
                  >
                    View All Personalized Gifts →
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigateTo('track-order')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
              currentView === 'track-order'
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'text-[#231F20] dark:text-[#FDF9F7] hover:text-[#E11D48]'
            }`}
          >
            Track Order
          </button>

          <button
            onClick={() => navigateTo('contact')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
              currentView === 'contact'
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'text-[#231F20] dark:text-[#FDF9F7] hover:text-[#E11D48]'
            }`}
          >
            Contact
          </button>

          <button
            onClick={() => navigateTo('admin')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all flex items-center gap-1 ${
              currentView === 'admin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'
            }`}
            title="Admin Dashboard"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Zone 3: Interactive Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-[#E11D48] rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFD94A]" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={openSearch}
            aria-label="Search gifts and keepsakes"
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-[#E11D48] rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => navigateTo('wishlist')}
            aria-label="Wishlist"
            className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-[#E11D48] rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#E11D48] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={openCart}
            aria-label="Open Shopping Bag"
            className="flex items-center gap-2 bg-[#231F20] dark:bg-white text-white dark:text-[#231F20] hover:bg-[#E11D48] dark:hover:bg-[#E11D48] dark:hover:text-white px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all transform active:scale-95 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            <span className="bg-[#E11D48] text-white text-xs px-1.5 py-0.2 rounded-full font-extrabold min-w-[18px] text-center">
              {totalItemsCount}
            </span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-pink-50 dark:hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#141113] border-b border-[#F5E6E8] dark:border-[#2D252A] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              placeholder="Search gifts, jewelry, roses..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateTo('home')}
              className="text-left px-3 py-2 rounded-xl bg-pink-50/60 dark:bg-slate-800/50 text-xs font-semibold text-[#231F20] dark:text-white"
            >
              🏠 Home
            </button>
            <button
              onClick={() => navigateTo('collections', { category: 'all' })}
              className="text-left px-3 py-2 rounded-xl bg-pink-50/60 dark:bg-slate-800/50 text-xs font-semibold text-[#231F20] dark:text-white"
            >
              🎁 All Gifts
            </button>
            <button
              onClick={() => navigateTo('track-order')}
              className="text-left px-3 py-2 rounded-xl bg-pink-50/60 dark:bg-slate-800/50 text-xs font-semibold text-[#231F20] dark:text-white"
            >
              🚚 Track Order
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="text-left px-3 py-2 rounded-xl bg-pink-50/60 dark:bg-slate-800/50 text-xs font-semibold text-[#231F20] dark:text-white"
            >
              💬 Contact Us
            </button>
            <button
              onClick={() => navigateTo('wishlist')}
              className="text-left px-3 py-2 rounded-xl bg-pink-50/60 dark:bg-slate-800/50 text-xs font-semibold text-[#231F20] dark:text-white"
            >
              💖 Wishlist ({wishlistCount})
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className="text-left px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-xs font-bold text-purple-700 dark:text-purple-300"
            >
              ⚙️ Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
