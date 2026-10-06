import React, { useState, useMemo } from 'react';
import { Product, PhoneBrand } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { CATEGORIES } from '../data/products';
import { PHONE_BRANDS } from '../data/phoneModels';
import { SEO } from '../components/common/SEO';
import { Filter, SlidersHorizontal, Sparkles, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';

interface CollectionsPageProps {
  initialCategory?: string;
  products: Product[];
  onQuickView: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  initialCategory = 'all',
  products,
  onQuickView,
  onOpenDetail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory === 'all' ? 'All' : initialCategory
  );
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest'>('popularity');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const ITEMS_PER_PAGE = 8;

  // Filter & Sort computation
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'All' && selectedCategory !== 'all') {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      list = list.filter((p) =>
        p.supportedBrands?.includes(selectedBrand as PhoneBrand)
      );
    }

    // Price filter
    list = list.filter((p) => p.price <= maxPrice);

    // Sorting
    if (sortBy === 'popularity') {
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount);
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, selectedBrand, maxPrice, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMaxPrice(1000);
    setSortBy('popularity');
    setCurrentPage(1);
  };

  const collectionStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: selectedCategory === 'All' ? 'All Luxury Phone Cases & Personalized Gifts' : `${selectedCategory} Collection`,
    description: `Shop our exclusive ${selectedCategory} collection. Handcrafted luxury items, custom engravings, and timeless keepsakes.`,
    url: typeof window !== 'undefined' ? window.location.href : 'https://divineseternity.com/collections',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: filteredProducts.length,
      itemListElement: filteredProducts.slice(0, 12).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: p.name,
        image: p.images[0] || '',
        url: `${typeof window !== 'undefined' ? window.location.origin : 'https://divineseternity.com'}#product-${p.id}`,
      })),
    },
  };

  return (
    <div className="py-8 sm:py-12">
      <SEO
        title={selectedCategory === 'All' ? 'Curated Gift Collections & Phone Cases' : `${selectedCategory} — Curated Gifts`}
        description={`Explore handcrafted ${selectedCategory} at Divine's Eternity. High quality personalization, secure checkout, and express insured delivery across India.`}
        keywords={`${selectedCategory}, phone cases, luxury gift hampers, divine eternity, custom jewelry, romantic gifts`}
        structuredData={collectionStructuredData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Home</span>
            <span>/</span>
            <span>Collections</span>
            <span>/</span>
            <span className="text-[#F0508C] font-semibold">{selectedCategory}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#231F20] dark:text-[#FDF9F7]">
                {selectedCategory === 'All' ? 'All Luxury Phone Cases' : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {filteredProducts.length} aesthetic designs · Buy 3 Pay For 2 Eligible
              </p>
            </div>

            {/* Mobile filter toggle & Sort Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 bg-white dark:bg-[#1E1A1D] border border-[#F3E8E2] dark:border-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs"
              >
                <Filter className="w-3.5 h-3.5 text-[#F0508C]" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 bg-white dark:bg-[#1E1A1D] border border-[#F3E8E2] dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="popularity">Sort: Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated Reviews</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#F0508C] text-white shadow-xs'
                : 'bg-white dark:bg-[#1E1A1D] text-slate-700 dark:text-slate-300 border border-[#F3E8E2] dark:border-[#2D252A] hover:border-[#F0508C]'
            }`}
          >
            All Cases ({products.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                setSelectedCategory(cat.name);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? 'bg-[#F0508C] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1E1A1D] text-slate-700 dark:text-slate-300 border border-[#F3E8E2] dark:border-[#2D252A] hover:border-[#F0508C]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Main 2-Column Layout (Sidebar Filter + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-[#1E1A1D] p-6 rounded-3xl border border-[#F3E8E2] dark:border-[#2D252A] shadow-xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-serif-heading text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#F0508C]" />
                <span>Filter By</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-[#F0508C] hover:underline font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Phone Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Phone Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#F0508C] focus:outline-none"
              >
                <option value="All">All Brands (Apple, Samsung, OnePlus...)</option>
                {PHONE_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Max Price</span>
                <span className="text-[#F0508C] font-mono font-extrabold tabular-nums">
                  ₹{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={1000}
                step={50}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-[#F0508C] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹500</span>
                <span>₹1,000</span>
              </div>
            </div>

            {/* Promo Banner in Sidebar */}
            <div className="p-4 rounded-2xl bg-[#FFF8F4] dark:bg-slate-900/40 border border-pink-200/80 dark:border-pink-950/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F0508C]">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
                <span>Buy 3 Pay 2 Deal</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                Mix and match any 3 phone cases across all collections; the lowest price unit is automatically free!
              </p>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9 space-y-8">
            {paginatedProducts.length === 0 ? (
              <div className="bg-white dark:bg-[#1E1A1D] rounded-3xl p-12 text-center border border-[#F3E8E2] dark:border-[#2D252A] space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center mx-auto text-[#BE123C]">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-slate-900 dark:text-white">
                  No cases match your filters
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the price slider or resetting your phone brand filter to see all designs.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#F0508C] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#d63b74]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onOpenDetail={onOpenDetail}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-pink-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPage(idx + 1);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                      currentPage === idx + 1
                        ? 'bg-[#F0508C] text-white shadow-xs'
                        : 'bg-white dark:bg-[#1E1A1D] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#F0508C]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-pink-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
