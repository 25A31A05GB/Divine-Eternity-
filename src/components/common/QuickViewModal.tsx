import React, { useState, useEffect } from 'react';
import { X, Star, Sparkles, Check, AlertCircle, ShoppingBag, Shield, Heart } from 'lucide-react';
import { Product, PhoneBrand, CaseType } from '../../types';
import { PHONE_BRANDS, PHONE_MODELS_MAP, CASE_TYPES } from '../../data/phoneModels';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useReviews } from '../../context/ReviewsContext';
import { PhoneCaseMockup } from '../../utils/productVisuals';
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

  const [selectedBrand, setSelectedBrand] = useState<PhoneBrand | ''>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType | ''>('');
  const [customText, setCustomText] = useState<string>('');
  const [customPhoto, setCustomPhoto] = useState<string>('');
  const [customSong, setCustomSong] = useState<string>('');
  const [customArtist, setCustomArtist] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      if (product.category.includes('Phone Cases') && product.supportedBrands) {
        setSelectedBrand(product.supportedBrands[0] || 'Apple');
        const defaultModels = PHONE_MODELS_MAP[product.supportedBrands[0] || 'Apple'];
        setSelectedModel(defaultModels ? defaultModels[0] : '');
      } else {
        setSelectedBrand('');
        setSelectedModel('');
      }
      
      const availableType = CASE_TYPES.find(
        (c) => product.variantsStock?.[c.type] !== false
      );
      setSelectedCaseType(availableType ? availableType.type : '18k Gold Plated Chain');
      setCustomText('');
      setCustomPhoto('');
      setCustomSong('');
      setCustomArtist('');
      setGiftMessage('');
      setQuantity(1);
      setValidationError('');
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
  const isPhoneCase = product.category.includes('Phone Cases');

  const handleAddToCart = () => {
    if (isPhoneCase && !selectedBrand) {
      setValidationError('Please select your phone brand.');
      return;
    }
    if (isPhoneCase && !selectedModel) {
      setValidationError('Please select your phone model.');
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      mrp: product.mrp,
      brand: selectedBrand ? (selectedBrand as PhoneBrand) : undefined,
      model: selectedModel || undefined,
      caseType: (selectedCaseType as CaseType) || '18k Gold Plated Chain',
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#1E1A1D] rounded-3xl shadow-2xl border border-[#F5E6E8] dark:border-[#2D252A] overflow-hidden flex flex-col md:flex-row my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/80 dark:bg-black/60 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-black hover:text-[#E11D48] shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Live Customizer Mockup */}
        <div className="w-full md:w-1/2 bg-[#FFF9F5] dark:bg-black/30 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#F5E6E8] dark:border-[#2D252A] relative">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-4 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              wishlisted
                ? 'bg-[#E11D48] text-white'
                : 'bg-white/80 dark:bg-black/60 text-slate-700 dark:text-slate-200 hover:text-[#E11D48]'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          <div className="text-center pt-2">
            <span className="bg-[#FFD94A] text-[#231F20] text-xs font-bold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E11D48]" />
              {product.badge || 'Bespoke Personalized Gift'}
            </span>
          </div>

          <div className="my-4 w-full flex items-center justify-center">
            <PhoneCaseMockup
              product={product}
              customText={customText}
              customPhoto={customPhoto}
              customSong={customSong}
              customArtist={customArtist}
              isHovered={false}
              className="w-full max-w-[260px] h-[360px] sm:h-[400px] rounded-3xl"
            />
          </div>

          <div className="w-full bg-white/80 dark:bg-[#141113]/80 rounded-2xl p-3 text-center border border-pink-100 dark:border-pink-950/40 shadow-xs">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Live Bespoke Preview · <strong>{product.name}</strong>
            </p>
            {customText.trim() && (
              <p className="text-xs text-[#E11D48] font-semibold mt-0.5 font-script text-base">
                Engraving: "{customText}"
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Customization Controls & Add to Cart */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[85vh] md:max-h-[92vh] space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E11D48]">
                {product.category}
              </span>
              <span>·</span>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Star className="w-3.5 h-3.5 text-[#FFD94A] fill-[#FFD94A]" />
                <span className="font-bold">{averageRating}</span>
                <span className="text-slate-400">({totalReviews} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#231F20] dark:text-[#FDF9F7]">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-extrabold text-[#231F20] dark:text-white tabular-nums">
                ₹{product.price}
              </span>
              <span className="text-sm text-slate-400 line-through tabular-nums">
                MRP ₹{product.mrp}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                Save {discountPercent}%
              </span>
            </div>
          </div>

          {/* Phone brand & model selectors if applicable */}
          {isPhoneCase && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Select Phone Brand *
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    const b = e.target.value as PhoneBrand;
                    setSelectedBrand(b);
                    setSelectedModel(PHONE_MODELS_MAP[b]?.[0] || '');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                >
                  {PHONE_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Select Phone Model *
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                >
                  {(PHONE_MODELS_MAP[selectedBrand as PhoneBrand] || []).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Quantity
            </span>
            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-full bg-slate-50 dark:bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold hover:text-[#E11D48] shadow-xs"
              >
                -
              </button>
              <span className="w-9 text-center text-xs font-bold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold hover:text-[#E11D48] shadow-xs"
              >
                +
              </button>
            </div>
          </div>

          {validationError && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Add to Cart CTA & Social Share */}
          <div className="pt-2 space-y-4">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase transition-all transform active:scale-98 flex items-center justify-center gap-2 shadow-lg ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#E11D48] hover:bg-[#be123c] text-white shadow-pink-500/25'
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

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <SocialShare product={product} size="sm" />
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>Luxury Gift Box</span>
              </span>
              <span>·</span>
              <span>7-Day Replacement</span>
              <span>·</span>
              <span>Free Calligraphy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
