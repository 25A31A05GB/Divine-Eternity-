import React, { useState, useMemo } from 'react';
import { Search, X, Star, ArrowRight, Sparkles } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { PhoneCaseMockup } from '../../utils/productVisuals';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: string) => void;
  products?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory,
  products = INITIAL_PRODUCTS,
}) => {
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFDF8] rounded-3xl shadow-2xl border border-[#F3E8E2] overflow-hidden text-[#211D1C]">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#FF2E93]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pearl cases, wallet cases, mirror cases, or designs..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#211D1C] placeholder-stone-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-full text-stone-500 hover:text-[#FF2E93] hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Suggestions Area */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {query.trim() === '' ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold tracking-widest text-[#FF2E93] uppercase mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Popular Trending Searches</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Pearl Bracelet', 'Zipper Wallet', 'Makeup Mirror', 'Bow Case', 'Aesthetic Floral', 'Leather Pouch'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="text-xs bg-[#FFF0F3] hover:bg-[#ffe0e6] text-[#211D1C] px-3 py-1.5 rounded-full border border-[#FFE0E6] transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <p className="text-xs font-bold tracking-widest text-stone-500 uppercase mb-2">
                  Browse by Case Style
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Bracelet Phone Case',
                    'Zipper Wallet Case',
                    'Mirror Phone Case',
                    'Clear Designer Case',
                    'Gripper Phone Case',
                    'Designer Case',
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        onClose();
                      }}
                      className="text-left text-xs p-2.5 rounded-xl bg-white hover:bg-[#FFF0F3] hover:text-[#FF2E93] border border-stone-200 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{cat}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-semibold text-[#211D1C]">
                No designs found for "{query}"
              </p>
              <p className="text-xs text-stone-500">
                Try searching for "Pearl", "Mirror", "Wallet", or browse our collections.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-stone-500">
                Found {filteredProducts.length} matching phone cases:
              </p>
              <div className="space-y-2">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white hover:bg-[#FFF0F3] border border-[#F3E8E2] cursor-pointer transition-colors shadow-2xs"
                  >
                    <div className="w-14 h-16 rounded-xl bg-[#FFFDF8] overflow-hidden flex items-center justify-center shrink-0 border border-stone-200">
                      <PhoneCaseMockup
                        product={prod}
                        className="w-full h-full scale-75"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E93]">
                          {prod.category}
                        </span>
                        <span>·</span>
                        <div className="flex items-center text-[10px] text-amber-500">
                          <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                          <span className="font-bold ml-0.5 text-stone-700">{prod.rating}</span>
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#211D1C] truncate">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-extrabold text-[#211D1C] font-serif">
                          ₹{prod.price}
                        </span>
                        <span className="text-[11px] text-stone-400 line-through">
                          ₹{prod.mrp}
                        </span>
                      </div>
                    </div>
                    <button className="bg-[#211D1C] hover:bg-[#FF2E93] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer">
                      Customize
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
