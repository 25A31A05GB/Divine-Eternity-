import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { Sparkles, Gift, SlidersHorizontal, ChevronRight, Search, Heart, Package, Smile, Crown } from 'lucide-react';

interface ProductsSectionProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onQuickView: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
}

const PRODUCT_CATEGORIES = [
  {
    name: 'All Gifts',
    id: 'All',
    tagline: 'Complete curated collection of personalized wonders',
    icon: Gift,
  },
  {
    name: 'Names on Gifts',
    id: 'Names on Gifts',
    tagline: 'Make your gifts extra special with personalized names, initials, or meaningful messages.',
    icon: Sparkles,
  },
  {
    name: 'Personalized Jewellery',
    id: 'Personalized Jewellery',
    tagline: 'Create jewellery that is uniquely yours with names, initials, dates, or special details.',
    icon: Sparkles,
  },
  {
    name: 'Customize Your Caricature or Miniature',
    id: 'Customize Your Caricature or Miniature',
    tagline: 'Turn your favourite memories and people into adorable customized caricatures or miniatures.',
    icon: Smile,
  },
  {
    name: 'Personalize Your Bouquets',
    id: 'Personalize Your Bouquets',
    tagline: 'Create beautiful bouquets with your preferred colours, pictures, names, messages, and special details.',
    icon: Heart,
  },
  {
    name: 'Special Hampers',
    id: 'Special Hampers',
    tagline: 'Thoughtfully curated hampers filled with beautiful gifts and personalized surprises for every occasion.',
    icon: Package,
  },
  {
    name: 'Hair Accessories',
    id: 'Hair Accessories',
    tagline: 'Discover cute, stylish, and elegant hair accessories perfect for everyday looks and special occasions.',
    icon: Heart,
  },
  {
    name: 'Paradise of Jewels',
    id: 'Paradise of Jewels',
    tagline: 'Explore our collection of elegant, trendy, traditional, and everyday jewellery pieces designed to add a little sparkle to every outfit.',
    icon: Crown,
  },
];

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onQuickView,
  onOpenDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest'>('popularity');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (selectedCategory !== 'All' && selectedCategory !== 'all') {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Filter by price
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
  }, [products, selectedCategory, searchQuery, maxPrice, sortBy]);

  const activeCategoryInfo = PRODUCT_CATEGORIES.find(
    (c) => c.id === selectedCategory || (selectedCategory === 'All' && c.id === 'All')
  ) || PRODUCT_CATEGORIES[0];

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-[#FFF9EB] via-[#FFFDF8] to-[#FFF0F5] border border-[#F3E8E2] rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-xs">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF2E93]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#FFD94A]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F3E8E2] text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] shadow-2xs">
            <span>✦</span>
            <span>DIVINE’S ETERNITY PRODUCTS</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            Gifts Made for <span className="font-serif italic text-[#FF2E93]">Cherished Moments</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Discover the world of Divine’s Eternity, where every gift is created to make your special moments more memorable.
          </p>
        </div>
      </div>

      {/* 2. Subcategory Quick Selector Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-500">
            Our Product Categories
          </h3>
          <span className="text-xs text-[#FF2E93] font-bold">
            {filteredProducts.length} items found
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {PRODUCT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FFF0F5] border-[#FF2E93] shadow-sm ring-1 ring-[#FF2E93]/30 scale-[1.02]'
                    : 'bg-white border-[#E7E2DA] hover:border-[#FF2E93]/50 hover:bg-[#FFFDF8]'
                }`}
              >
                <div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${
                    isSelected ? 'bg-[#FF2E93] text-white' : 'bg-[#FFF9EB] text-[#211D1C]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${
                    isSelected ? 'text-[#FF2E93]' : 'text-[#211D1C]'
                  }`}>
                    {cat.name}
                  </h4>
                </div>
                <p className="text-[11px] text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                  {cat.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filter Controls & Search */}
      <div className="bg-white border border-[#E7E2DA] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search within ${activeCategoryInfo.name}...`}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E7E2DA] focus:outline-none focus:border-[#FF2E93] bg-[#FFFDF8]"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Price Range */}
          <div className="flex items-center gap-2 text-xs text-stone-600 bg-[#FFF9EB] border border-[#F5E6CE] px-3 py-1.5 rounded-xl">
            <span>Under:</span>
            <span className="font-bold text-[#211D1C]">₹{maxPrice}</span>
            <input
              type="range"
              min="500"
              max="3500"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-20 accent-[#FF2E93] cursor-pointer"
            />
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E7E2DA] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#211D1C] focus:outline-none focus:border-[#FF2E93] cursor-pointer"
            >
              <option value="popularity">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Active Category Banner Note */}
      {selectedCategory !== 'All' && (
        <div className="bg-[#FFF9EB] border-l-4 border-[#FF2E93] p-4 rounded-r-2xl flex items-center justify-between gap-4">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#211D1C]">
              {activeCategoryInfo.name}
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              {activeCategoryInfo.tagline}
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs font-bold text-[#FF2E93] hover:underline shrink-0"
          >
            View All Categories
          </button>
        </div>
      )}

      {/* 5. Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={onQuickView}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-[#E7E2DA] rounded-3xl p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#FF2E93] flex items-center justify-center mx-auto">
            <Gift className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[#211D1C]">No items match your filters</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search keyword or increasing your maximum price filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setMaxPrice(3000);
              onSelectCategory('All');
            }}
            className="mt-2 px-5 py-2 rounded-full bg-[#211D1C] text-white text-xs font-bold hover:bg-[#FF2E93] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
