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

  const STRICT_HEADER_COLLECTIONS = [
    {
      id: 'products',
      name: 'Products',
      tagline: 'Discover the world of Divine’s Eternity',
      badge: 'All Gifts',
      subcategories: [
        'Names on Gifts',
        'Personalized Jewellery',
        'Customize Your Caricature or Miniature',
        'Personalize Your Bouquets',
        'Special Hampers',
        'Hair Accessories',
        'Paradise of Jewels',
      ],
    },
    {
      id: 'personalization',
      name: 'Personalization',
      tagline: 'WhatsApp confirmed bespoke gifts',
      badge: 'WhatsApp Verified',
    },
    {
      id: 'collaboration',
      name: 'Collaboration',
      tagline: 'UGC, paid collabs & brand deals',
      badge: 'Creators & Brands',
    },
    {
      id: 'upcoming-campaigns',
      name: 'Upcoming Campaigns',
      tagline: 'Follow @divineseternity & join rewards',
      badge: '@divineseternity',
    },
    {
      id: 'creator-club',
      name: 'Creator Club',
      tagline: 'Learn, collaborate & earn up to 7k',
      badge: 'Earn up to ₹7k',
    },
    {
      id: 'affiliate-marketing',
      name: 'Affiliate Marketing',
      tagline: 'Share products & earn 15-20% commission',
      badge: '15-20% Comm.',
    },
    {
      id: 'podcast',
      name: 'Podcast',
      tagline: 'Creativity, entrepreneurship & journeys',
      badge: 'Episodes',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#F3E8E2] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Zone 1: Divine's Eternity Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigateTo('home')}
            className="flex flex-col text-left group focus:outline-none cursor-pointer"
          >
            <div className="flex items-baseline">
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#FF2E93]">
                Divine’s
              </span>
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#211D1C]">
                Eternity
              </span>
              <span className="text-[#FBBF24] text-lg sm:text-xl font-bold ml-0.5">✦</span>
            </div>
            <span className="text-[9px] font-extrabold tracking-widest text-[#FF2E93] uppercase -mt-0.5">
              GIFTS THAT STAY IN HEARTS
            </span>
          </button>
        </div>

        {/* Zone 2: Cream Pill Navigation Container (Desktop) */}
        <nav className="hidden lg:flex items-center bg-[#FFF9EB] border border-[#F5E6CE] rounded-full px-8 py-2.5 shadow-xs">
          <div className="flex items-center gap-8 text-xs font-bold text-[#211D1C]">
            <button
              onClick={() => navigateTo('home')}
              className={`transition-colors hover:text-[#FF2E93] cursor-pointer ${
                currentView === 'home' ? 'text-[#FF2E93]' : 'text-[#211D1C]'
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
                onClick={() => navigateTo('collections', { category: 'products' })}
                className={`flex items-center gap-1 transition-colors hover:text-[#FF2E93] cursor-pointer ${
                  currentView === 'collections' ? 'text-[#FF2E93]' : 'text-[#211D1C]'
                }`}
              >
                <span>Collections</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FFF0F5] text-[#FF2E93] border border-[#FF2E93]/20">
                  7
                </span>
              </button>

              {/* Exact Floating Dropdown Menu: Strictly the 7 Collections */}
              {isCollectionsHovered && (
                <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-3xl shadow-xl border border-[#F3E8E2] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <div className="px-3 py-1.5 border-b border-stone-100 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E93]">
                      7 STRICT COLLECTIONS
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Divine’s Eternity
                    </span>
                  </div>

                  {STRICT_HEADER_COLLECTIONS.map((col, idx) => (
                    <button
                      key={col.id}
                      onClick={() => navigateTo('collections', { category: col.id })}
                      className="w-full text-left p-2.5 rounded-2xl hover:bg-[#FFF0F5] group transition-all cursor-pointer flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-stone-400 font-mono">
                            {idx + 1}.
                          </span>
                          <span className="text-xs font-bold text-[#211D1C] group-hover:text-[#FF2E93] transition-colors">
                            {col.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-0.5 truncate pl-4">
                          {col.tagline}
                        </p>
                      </div>

                      {col.badge && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFF9EB] text-[#211D1C] border border-[#F5E6CE] group-hover:border-[#FF2E93]/30 shrink-0">
                          {col.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('collections', { category: 'personalization' })}
              className="transition-colors hover:text-[#FF2E93] cursor-pointer"
            >
              Personalization
            </button>

            <button
              onClick={() => navigateTo('collections', { category: 'creator-club' })}
              className="transition-colors hover:text-[#FF2E93] cursor-pointer flex items-center gap-1"
            >
              <span>Creator Club</span>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-[#FF2E93] text-white">₹7k</span>
            </button>

            <button
              onClick={() => navigateTo('track-order')}
              className={`transition-colors hover:text-[#FF2E93] cursor-pointer ${
                currentView === 'track-order' ? 'text-[#FF2E93]' : 'text-[#211D1C]'
              }`}
            >
              Track Your Order
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className={`transition-colors hover:text-[#FF2E93] cursor-pointer ${
                currentView === 'contact' ? 'text-[#FF2E93]' : 'text-[#211D1C]'
              }`}
            >
              Contact
            </button>
          </div>
        </nav>

        {/* Zone 3: Exact Round Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Round Search Button */}
          <button
            onClick={openSearch}
            aria-label="Search cases"
            className="w-9 h-9 rounded-full bg-white border border-[#E7E2DA] flex items-center justify-center text-[#211D1C] hover:border-[#FF2E93] hover:text-[#FF2E93] shadow-xs transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Round Wishlist Button */}
          <button
            onClick={() => navigateTo('wishlist')}
            aria-label="Wishlist"
            className="relative w-9 h-9 rounded-full bg-white border border-[#E7E2DA] flex items-center justify-center text-[#211D1C] hover:border-[#FF2E93] hover:text-[#FF2E93] shadow-xs transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF2E93] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Pill Bag Button with Pink Badge */}
          <button
            onClick={openCart}
            aria-label="Open Shopping Bag"
            className="bg-white border border-[#E7E2DA] rounded-full px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-bold text-[#211D1C] hover:border-[#FF2E93] shadow-xs transition-colors cursor-pointer"
          >
            <span>Bag</span>
            <span className="bg-[#FF2E93] text-white rounded-full min-w-[18px] h-4.5 px-1 flex items-center justify-center text-[10px] font-extrabold">
              {totalItemsCount}
            </span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 text-[#211D1C] rounded-full bg-white border border-[#E7E2DA] hover:border-[#FF2E93]"
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
                  className="flex items-baseline text-left group focus:outline-none"
                >
                  <span className="font-extrabold text-xl tracking-tight text-[#FF2E93]">
                    Gadgets
                  </span>
                  <span className="font-extrabold text-xl tracking-tight text-[#F7F4EC]">
                    Destiny
                  </span>
                  <span className="text-[#FFD94A] text-sm font-bold ml-1">✦</span>
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
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#FF2E93] mb-2 font-mono">
                  7 Collections
                </div>

                {[
                  { label: 'Home Page', view: 'home' },
                  { label: '1. Products (All Gift Categories)', view: 'collections', params: { category: 'products' } },
                  { label: '2. Personalization (WhatsApp Confirmed)', view: 'collections', params: { category: 'personalization' } },
                  { label: '3. Collaboration (UGC & Creators)', view: 'collections', params: { category: 'collaboration' } },
                  { label: '4. Upcoming Campaigns (@divineseternity)', view: 'collections', params: { category: 'upcoming-campaigns' } },
                  { label: '5. Creator Club (Earn up to ₹7k)', view: 'collections', params: { category: 'creator-club' } },
                  { label: '6. Affiliate Marketing (15-20% Comm.)', view: 'collections', params: { category: 'affiliate-marketing' } },
                  { label: '7. Podcast (Inspiring Stories)', view: 'collections', params: { category: 'podcast' } },
                  { label: 'Track Order', view: 'track-order' },
                  { label: 'Contact & Concierge', view: 'contact' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateTo(item.view, item.params)}
                    className="w-full text-left p-3 rounded-2xl bg-[#151A24] border border-[#242C3D] hover:border-[#FF2E93] hover:bg-[#1B2230] transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-[#F7F4EC] group-hover:text-[#FF2E93] transition-colors">
                      {item.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#737C8C] group-hover:text-[#FF2E93] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

          </div>,
          document.body
        )}
    </header>
  );
};

