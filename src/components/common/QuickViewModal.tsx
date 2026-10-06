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
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-[#08090B]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#151A24] text-[#F7F4EC] rounded-3xl shadow-2xl border border-[#242C3D] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row my-auto max-h-[92vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-[#0C1220]/90 border border-[#242C3D] text-[#A7AFBD] hover:text-[#F7F4EC] hover:bg-[#1B2230] shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Live Customizer Mockup Preview */}
        <div className="w-full md:w-1/2 bg-[#0C1220] p-4 sm:p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#242C3D] relative shrink-0">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-4 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              wishlisted
                ? 'bg-[#5B8CFF] text-white'
                : 'bg-[#151A24]/80 border border-[#242C3D] text-[#A7AFBD] hover:text-[#F7F4EC]'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          <div className="text-center pt-1">
            <span className="bg-[#151A24] border border-[#242C3D] text-[#5B8CFF] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>{product.badge || 'Bespoke Personalized Gift'}</span>
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
              className="w-full max-w-[200px] sm:max-w-[250px] h-[220px] sm:h-[320px] md:h-[380px] rounded-3xl"
            />
          </div>

          <div className="w-full bg-[#151A24] rounded-2xl p-2.5 text-center border border-[#242C3D] shadow-xs">
            <p className="text-xs text-[#A7AFBD]">
              Live Bespoke Preview · <strong className="text-[#F7F4EC]">{product.name}</strong>
            </p>
            {customText.trim() && (
              <p className="text-xs text-[#22D3EE] font-semibold mt-0.5 font-script text-base">
                Engraving: "{customText}"
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Customization Controls & Add to Cart */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 md:overflow-y-auto md:max-h-[92vh] space-y-5 bg-[#151A24] text-[#F7F4EC]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5B8CFF]">
                {product.category}
              </span>
              <span className="text-[#737C8C]">•</span>
              <div className="flex items-center gap-1 text-xs font-medium text-[#A7AFBD]">
                <Star className="w-3.5 h-3.5 text-[#22D3EE] fill-[#22D3EE]" />
                <span className="font-bold text-[#F7F4EC]">{averageRating}</span>
                <span className="text-[#737C8C]">({totalReviews} reviews)</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#F7F4EC]">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-extrabold text-[#F7F4EC] tabular-nums font-mono">
                ₹{product.price}
              </span>
              <span className="text-sm text-[#737C8C] line-through tabular-nums">
                MRP ₹{product.mrp}
              </span>
              <span className="text-xs font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded-md border border-[#2DD4BF]/30">
                Save {discountPercent}%
              </span>
            </div>
          </div>

          {/* Phone brand & model selectors if applicable */}
          {isPhoneCase && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A7AFBD] block">
                  Select Phone Brand *
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    const b = e.target.value as PhoneBrand;
                    setSelectedBrand(b);
                    setSelectedModel(PHONE_MODELS_MAP[b]?.[0] || '');
                  }}
                  className="w-full bg-[#0C1220] border border-[#242C3D] rounded-xl p-2.5 text-xs text-[#F7F4EC] focus:ring-2 focus:ring-[#5B8CFF] focus:outline-none"
                >
                  {PHONE_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A7AFBD] block">
                  Select Phone Model *
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#0C1220] border border-[#242C3D] rounded-xl p-2.5 text-xs text-[#F7F4EC] focus:ring-2 focus:ring-[#5B8CFF] focus:outline-none"
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#A7AFBD]">
              Quantity
            </span>
            <div className="flex items-center border border-[#242C3D] rounded-full bg-[#0C1220] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full bg-[#151A24] border border-[#242C3D] flex items-center justify-center text-xs font-bold hover:text-[#5B8CFF] shadow-xs cursor-pointer"
              >
                -
              </button>
              <span className="w-9 text-center text-xs font-bold tabular-nums font-mono text-[#F7F4EC]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full bg-[#151A24] border border-[#242C3D] flex items-center justify-center text-xs font-bold hover:text-[#5B8CFF] shadow-xs cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {validationError && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Add to Cart CTA & Social Share */}
          <div className="pt-2 space-y-4">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-widest uppercase transition-all transform active:scale-98 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                addedSuccess
                  ? 'bg-[#2DD4BF] text-[#08090B]'
                  : 'gradient-blue-violet text-white hover:opacity-95'
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

            <div className="pt-2 border-t border-[#242C3D]">
              <SocialShare product={product} size="sm" />
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#737C8C]">
              <span className="flex items-center gap-1 text-[#2DD4BF]">
                <Shield className="w-3 h-3" />
                <span>Luxury Gift Casket</span>
              </span>
              <span>•</span>
              <span>7-Day Replacement</span>
              <span>•</span>
              <span>Free Engraving</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
