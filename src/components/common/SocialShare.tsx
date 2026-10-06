import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle } from 'lucide-react';
import { Product } from '../../types';

interface SocialShareProps {
  product: Product;
  size?: 'sm' | 'md';
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  product,
  size = 'md',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  // Generate share URL and descriptions
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://divineseternity.com';
  const shareTitle = encodeURIComponent(`Check out the ${product.name} on Divine's Eternity! ✨`);
  const shareUrl = encodeURIComponent(currentUrl);
  const shareText = encodeURIComponent(
    `I'm obsessed with this ${product.name} from Divine's Eternity! Handcrafted luxury phone case with custom calligraphy engraving. ₹${product.price} (Buy 3 Pay 2 available)`
  );

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'facebook' | 'pinterest') => {
    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}&hashtags=PhoneAesthetic,Gifts,DivinesEternity`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'pinterest':
        url = `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTitle}`;
        break;
    }
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
    }
  };

  const isSmall = size === 'sm';

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5 text-[#F0508C]" />
          <span>Share With Friends</span>
        </span>
        {copied && (
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
            <Check className="w-3 h-3" /> Link Copied to Clipboard!
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* WhatsApp Button */}
        <button
          onClick={() => handleShare('whatsapp')}
          aria-label="Share on WhatsApp"
          className={`flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 rounded-xl transition-all transform active:scale-95 ${
            isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs font-semibold'
          }`}
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp</span>
        </button>

        {/* Pinterest Button */}
        <button
          onClick={() => handleShare('pinterest')}
          aria-label="Share on Pinterest"
          className={`flex items-center gap-1.5 bg-[#E60023]/10 hover:bg-[#E60023] text-[#E60023] hover:text-white border border-[#E60023]/30 rounded-xl transition-all transform active:scale-95 ${
            isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs font-semibold'
          }`}
          title="Save to Pinterest board"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.536.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
          </svg>
          <span>Pinterest</span>
        </button>

        {/* Twitter / X Button */}
        <button
          onClick={() => handleShare('twitter')}
          aria-label="Share on X (Twitter)"
          className={`flex items-center gap-1.5 bg-slate-900/10 hover:bg-slate-900 dark:bg-white/10 dark:hover:bg-white text-slate-800 hover:text-white dark:text-white dark:hover:text-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl transition-all transform active:scale-95 ${
            isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs font-semibold'
          }`}
          title="Post to X / Twitter"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X / Tweet</span>
        </button>

        {/* Facebook Button */}
        <button
          onClick={() => handleShare('facebook')}
          aria-label="Share on Facebook"
          className={`flex items-center gap-1.5 bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 rounded-xl transition-all transform active:scale-95 ${
            isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs font-semibold'
          }`}
          title="Share on Facebook"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </button>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          aria-label="Copy direct product link"
          className={`flex items-center gap-1.5 bg-pink-50 dark:bg-slate-800 hover:bg-[#F0508C] text-[#F0508C] hover:text-white border border-pink-200 dark:border-slate-700 rounded-xl transition-all transform active:scale-95 ${
            isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs font-semibold'
          }`}
          title="Copy direct product link"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
};
