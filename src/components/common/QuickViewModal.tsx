import React, { useState, useEffect } from 'react';
import { X, Star, Sparkles, Check, ShoppingBag, Shield, Heart, Gift } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useReviews } from '../../context/ReviewsContext';
import { SocialShare } from './SocialShare';
import { GiftPersonalizer } from '../personalization/GiftPersonalizer';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getProductRatingStats } = useReviews();

  const [customText, setCustomText] = useState<string>('');
  const [customPhoto, setCustomPhoto] = useState<string>('');
  const [customSong, setCustomSong] = useState<string>('');
  const [customArtist, setCustomArtist] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setCustomText('');
      setCustomPhoto('');
      setCustomSong('');
      setCustomArtist('');
      setGiftMessage('');
      setQuantity(1);
      setAddedSuccess(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const wishlisted = isInWishlist(product.id);
  const { averageRating, totalReviews } = getProductRatingStats(
    product.id,
    product.rating,
    product.reviewCount
  );
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      mrp: product.mrp,
      caseType: '18k Gold Plated Chain',
      customText: customText.trim() || undefined,
      customPhoto: customPhoto || undefined,
      customSong: customSong.trim() || undefined,
      customArtist: customArtist.trim() || undefined,
      giftMessage: giftMessage.trim() || undefined,
      quantity,
      themeColor: product.themeColor,
      secondaryColor: product.secondaryColor,
      designPattern: product.designPattern,
      category: product.category,
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white text-[#211D1C] rounded-3xl shadow-2xl border border-[#F3E8E2] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row my-auto max-h-[92vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-white/90 border border-stone-200 text-stone-500 hover:text-[#211D1C] hover:bg-stone-100 shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Product Image Preview */}
        <div className="w-full md:w-1/2 bg-[#FFFDF8] p-4 sm:p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#F3E8E2] relative shrink-0">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-4 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              wishlisted
                ? 'bg-[#FF2E93] text-white shadow-sm'
                : 'bg-white/90 border border-stone-200 text-stone-400 hover:text-[#FF2E93]'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          <div className="text-center pt-1">
            <span className="bg-[#FFF0F3] border border-[#FFE0E6] text-[#FF2E93] text-[11px] font-black px-3 py-1 rounded-full shadow-xs uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span>{product.badge || 'Purely Gold Plated ✨💖'}</span>
            </span>
          </div>

          <div className="my-3 sm:my-4 w-full flex items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-[#F3E8E2]">
              <img
                src={product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {customText && (
                <div className="absolute bottom-3 inset-x-3 bg-black/60 backdrop-blur-md rounded-xl p-2 text-center text-white text-xs font-bold border border-white/20">
                  Engraving: &ldquo;{customText}&rdquo;
                </div>
              )}
            </div>
          </div>

          <div className="w-full bg-[#FFF9DE] rounded-2xl p-2.5 text-center border border-[#F5E6B8] shadow-xs">
            <p className="text-xs text-stone-600">
              Personalized Preview · <strong className="text-[#211D1C]">{product.name}</strong>
            </p>
            {customText.trim() && (
              <p className="text-xs text-[#FF2E93] font-semibold mt-0.5 font-script text-base">
                Engraving: &ldquo;{customText}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Customization Controls & Add to Cart */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 md:overflow-y-auto md:max-h-[92vh] space-y-5 bg-white text-[#211D1C]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF2E93]">
                {product.category}
              </span>
              <span className="text-stone-300">•</span>
              <div className="flex items-center gap-1 text-xs font-medium text-stone-600">
                <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="font-bold text-[#211D1C]">{averageRating}</span>
                <span className="text-stone-400">({totalReviews} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#211D1C]">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-bold text-[#211D1C] tabular-nums font-serif">
                ₹{product.price}
              </span>
              <span className="text-sm text-stone-400 line-through tabular-nums">
                MRP ₹{product.mrp}
              </span>
              <span className="text-xs font-bold text-[#FF2E93] bg-[#FFF0F3] px-2 py-0.5 rounded-md border border-[#FFE0E6]">
                Save {discountPercent}%
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-stone-600 whitespace-pre-line leading-relaxed italic bg-[#FFFDF8] p-3 rounded-xl border border-[#F3E8E2]">
            {product.description}
          </p>

          {/* Personalization Inputs */}
          <GiftPersonalizer
            product={product}
            customText={customText}
            setCustomText={setCustomText}
            customPhoto={customPhoto}
            setCustomPhoto={setCustomPhoto}
            customSong={customSong}
            setCustomSong={setCustomSong}
            customArtist={customArtist}
            setCustomArtist={setCustomArtist}
            giftMessage={giftMessage}
            setGiftMessage={setGiftMessage}
          />

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Quantity
            </span>
            <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs font-bold hover:text-[#FF2E93] shadow-xs cursor-pointer"
              >
                -
              </button>
              <span className="w-9 text-center text-xs font-bold tabular-nums font-mono text-[#211D1C]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs font-bold hover:text-[#FF2E93] shadow-xs cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart CTA & Social Share */}
          <div className="pt-2 space-y-4">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase transition-all transform active:scale-98 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#211D1C] hover:bg-[#FF2E93] text-white'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag · ₹{product.price * quantity}</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-stone-200">
              <SocialShare product={product} size="sm" />
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500">
              <span className="flex items-center gap-1 text-[#FF2E93] font-semibold">
                <Gift className="w-3.5 h-3.5" />
                <span>Velvet Keepsake Box</span>
              </span>
              <span>•</span>
              <span>7-Day Replacement</span>
              <span>•</span>
              <span>Free Personalization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
