import React from 'react';
import { Sparkles, Home, ShoppingBag, ArrowRight, Search } from 'lucide-react';
import { SEO } from '../components/common/SEO';

interface NotFoundPageProps {
  onReturnHome: () => void;
  onExploreCollections: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onReturnHome,
  onExploreCollections,
}) => {
  return (
    <div className="min-h-[80vh] bg-[#FFFDF8] flex items-center justify-center p-4 sm:p-6 text-[#211D1C]">
      <SEO
        title="404 — Page Not Found · Divine’s Eternity"
        description="The bespoke keepsake or boutique page you were looking for could not be found."
        noindex={true}
      />
      <div className="max-w-lg w-full bg-white rounded-3xl border border-[#F3E8E2] shadow-xl p-8 sm:p-12 text-center space-y-6 animate-in fade-in duration-200">
        
        {/* Crest */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-[#FFF0F5] border border-[#FFE0E6] flex items-center justify-center text-[#FF2E93]">
          <span className="font-serif-heading font-black text-3xl">404</span>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#211D1C] text-[#FFD94A] flex items-center justify-center text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E93] px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#FFE0E6] inline-block">
            Bespoke Milestone Not Found
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#211D1C]">
            Lost in the Atelier?
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
            This keepsake or address may have been moved, renamed, or retired from our curated collections.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onReturnHome}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#211D1C] hover:bg-[#FF2E93] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#FFD94A]" />
            <span>Return to Boutique Homepage</span>
          </button>

          <button
            onClick={onExploreCollections}
            className="w-full py-3 px-4 rounded-2xl bg-[#FFF0F3] hover:bg-[#FFE0E6] text-[#FF2E93] text-xs font-bold transition-all border border-[#FFE0E6] flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse All 7 Curated Collections</span>
          </button>
        </div>
      </div>
    </div>
  );
};
