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
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E1A1D] rounded-3xl shadow-2xl border border-[#F3E8E2] dark:border-[#2D252A] overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#F0508C]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pearl cases, wallet cases, mirror cases, or bows..."
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-full text-slate-500 hover:text-[#F0508C] hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Suggestions Area */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {query.trim() === '' ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold tracking-widest text-[#F0508C] uppercase mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Popular Trending Searches</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Pearl Bracelet', 'Zipper Wallet', 'Makeup Mirror', 'Coquette Bow', 'Vintage Cherries', 'Squishy Bear'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="text-xs bg-[#FFF8F4] dark:bg-slate-800/60 hover:bg-pink-100 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-full border border-pink-100 dark:border-slate-700 transition-colors"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">
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
                      className="text-left text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 hover:bg-pink-50 hover:text-[#F0508C] transition-colors flex items-center justify-between"
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
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No designs found for "{query}"
              </p>
              <p className="text-xs text-slate-500">
                Try searching for "Pearl", "Mirror", "Wallet", or browse our collections.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500">
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
                    className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-[#FFF8F4] dark:bg-slate-900/50 hover:bg-pink-50 dark:hover:bg-slate-800 border border-[#F3E8E2] dark:border-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="w-14 h-16 rounded-xl bg-white dark:bg-black/40 overflow-hidden flex items-center justify-center shrink-0 border border-pink-100">
                      <PhoneCaseMockup
                        product={prod}
                        className="w-full h-full scale-75"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0508C]">
                          {prod.category}
                        </span>
                        <span>·</span>
                        <div className="flex items-center text-[10px] text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-bold ml-0.5">{prod.rating}</span>
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-extrabold text-[#F0508C]">
                          ₹{prod.price}
                        </span>
                        <span className="text-[11px] text-slate-400 line-through">
                          ₹{prod.mrp}
                        </span>
                      </div>
                    </div>
                    <button className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs hover:bg-[#F0508C] hover:text-white transition-colors shrink-0">
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
