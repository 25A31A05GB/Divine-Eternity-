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

        {/* Left Column: Live Customizer Mockup Preview */}
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
              <span>{product.badge || 'Cute Covers Club'}</span>
            </span>
          </div>

          <div className="my-3 sm:my-4 w-full flex items-center justify-center">
            <PhoneCaseMockup
              product={product}
              customText={customText}
              customPhoto={customPhoto}
              customSong={customSong}
              customArtist={customArtist}
              isHovered={false}
              className="w-full max-w-[200px] sm:max-w-[250px] h-[220px] sm:h-[320px] md:h-[380px] drop-shadow-xl"
            />
          </div>

          <div className="w-full bg-[#FFF9DE] rounded-2xl p-2.5 text-center border border-[#F5E6B8] shadow-xs">
            <p className="text-xs text-stone-600">
              Live Preview · <strong className="text-[#211D1C]">{product.name}</strong>
            </p>
            {customText.trim() && (
              <p className="text-xs text-[#FF2E93] font-semibold mt-0.5 font-script text-base">
                Engraving: "{customText}"
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
              <span className="text-xs font-bold text-[#E05A47] bg-[#FFF0F3] px-2 py-0.5 rounded-md border border-[#FFE0E6]">
                Save {discountPercent}%
              </span>
            </div>
          </div>

          {/* Phone brand & model selectors if applicable */}
          {isPhoneCase && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Select Phone Brand *
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    const b = e.target.value as PhoneBrand;
                    setSelectedBrand(b);
                    setSelectedModel(PHONE_MODELS_MAP[b]?.[0] || '');
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
                >
                  {PHONE_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Select Phone Model *
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
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

          {validationError && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

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
                <Shield className="w-3 h-3" />
                <span>Cute Gift Packaging</span>
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
