import React, { useState } from 'react';
import { Product, PhoneBrand, CaseType } from '../types';
import { PHONE_BRANDS, PHONE_MODELS_MAP, CASE_TYPES } from '../data/phoneModels';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReviews } from '../context/ReviewsContext';
import { PhoneCaseMockup } from '../utils/productVisuals';
import { ProductCard } from '../components/common/ProductCard';
import { SocialShare } from '../components/common/SocialShare';
import { GiftPersonalizer } from '../components/personalization/GiftPersonalizer';
import { ProductReviews } from '../components/common/ProductReviews';
import { SEO } from '../components/common/SEO';
import {
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Sparkles,
  Heart,
  Check,
  ArrowLeft,
  Send,
  ThumbsUp,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onQuickView,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const {
    getProductReviews,
    getProductRatingStats,
    addReview,
    likeReview,
  } = useReviews();

  const isPhoneCase = product.category.includes('Phone Cases');
  const [selectedBrand, setSelectedBrand] = useState<PhoneBrand>(
    isPhoneCase && product.supportedBrands ? product.supportedBrands[0] || 'Apple' : 'Apple'
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    isPhoneCase && product.supportedBrands
      ? PHONE_MODELS_MAP[product.supportedBrands[0] || 'Apple']?.[0] || 'iPhone 15 Pro Max'
      : ''
  );
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType>('18k Gold Plated Chain');
  const [customText, setCustomText] = useState<string>('');
  const [customPhoto, setCustomPhoto] = useState<string>('');
  const [customSong, setCustomSong] = useState<string>('');
  const [customArtist, setCustomArtist] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const wishlisted = isInWishlist(product.id);
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const { averageRating, totalReviews } = getProductRatingStats(
    product.id,
    product.rating,
    product.reviewCount
  );
  const productReviews = getProductReviews(product.id);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      mrp: product.mrp,
      brand: isPhoneCase ? selectedBrand : undefined,
      model: isPhoneCase ? selectedModel : undefined,
      caseType: selectedCaseType,
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
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isBestSeller))
    .slice(0, 4);

  const productUrl = typeof window !== 'undefined' ? window.location.href : `https://divineseternity.com/#product-${product.id}`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.slug || product.id,
    brand: {
      '@type': 'Brand',
      name: "Divine’s Eternity",
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: "Gadgets Destiny",
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating || product.rating || 5.0,
      reviewCount: totalReviews || product.reviewCount || 1,
      bestRating: '5',
      worstRating: '1',
    },
    review: productReviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: r.author || 'Verified Customer',
      },
      datePublished: r.date || '2026-01-01',
      reviewBody: r.comment,
    })),
  };

  return (
    <div className="py-8 sm:py-12">
      <SEO
        title={`${product.name} — Divine’s Eternity`}
        description={
          product.description
            ? `${product.name}: ${product.description.slice(0, 140)}`
            : `Buy ${product.name} for ₹${product.price} at Divine’s Eternity. Jewellery made personal, for moments that mean everything. Purely gold plated.✨💖`
        }
        image={product.images[0]}
        url={productUrl}
        type="product"
        keywords={`${product.name}, ${product.category}, personalized jewellery, divines eternity`}
        structuredData={productSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-[#FF2E93] bg-white border border-stone-200 px-3.5 py-1.5 rounded-full shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </button>
          <div className="text-xs text-stone-500 truncate hidden sm:block">
            Home / {product.category} / <span className="text-[#211D1C] font-semibold">{product.name}</span>
          </div>
        </div>

        {/* 2-Column Main PDP View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {/* Left Column: Gallery & Interactive Visual Customizer */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-10 rounded-3xl border border-[#F3E8E2] shadow-sm flex flex-col items-center justify-center relative lg:sticky lg:top-24 lg:z-10 z-0">
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Wishlist"
              className={`absolute top-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all ${
                wishlisted ? 'bg-[#FF2E93] text-white' : 'bg-white/90 border border-stone-200 text-stone-500 hover:text-[#FF2E93]'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>

            <div className="w-full flex items-center justify-center py-6">
              {product.images && product.images.length > 0 ? (
                <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {customText && (
                    <div className="absolute bottom-4 inset-x-4 bg-black/60 backdrop-blur-md rounded-2xl p-2.5 text-center text-white text-sm font-bold border border-white/20">
                      Engraved: &ldquo;{customText}&rdquo;
                    </div>
                  )}
                </div>
              ) : (
                <PhoneCaseMockup
                  product={product}
                  customText={customText}
                  customPhoto={customPhoto}
                  customSong={customSong}
                  customArtist={customArtist}
                  className="w-[240px] h-[390px] sm:w-[280px] sm:h-[440px] drop-shadow-xl"
                />
              )}
            </div>

            <div className="w-full bg-[#FFF9DE] rounded-2xl p-4 text-center border border-[#F5E6B8] mt-4">
              <p className="text-xs font-semibold text-stone-700">
                Live Preview: <strong className="text-[#211D1C]">{product.name}</strong>
              </p>
              {customText && (
                <p className="font-script text-xl text-[#FF2E93] mt-1">
                  "{customText}"
                </p>
              )}
            </div>

            <div className="w-full mt-6 pt-4 border-t border-stone-100">
              <SocialShare product={product} />
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF2E93]">
                  {product.category}
                </span>
                <span>·</span>
                <div className="flex items-center gap-1 text-xs text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="font-bold text-[#211D1C]">{averageRating}</span>
                  <span className="text-stone-400">({totalReviews} verified reviews)</span>
                </div>
              </div>

              <h1 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#211D1C]">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-extrabold text-[#211D1C] tabular-nums font-serif">
                  ₹{product.price}
                </span>
                <span className="text-base text-stone-400 line-through tabular-nums">
                  MRP ₹{product.mrp}
                </span>
                <span className="text-xs font-bold text-[#E05A47] bg-[#FFF0F3] px-2.5 py-1 rounded-md border border-[#FFE0E6]">
                  {discountPercent}% OFF
                </span>
              </div>

              <div className="bg-[#FFF9DE] p-3 rounded-2xl border border-[#F5E6B8] mt-3 inline-flex items-center gap-2 text-xs text-[#211D1C] font-semibold">
                <Sparkles className="w-4 h-4 text-[#FF2E93]" />
                <span>Buy 2 Cases for ₹849 with code <strong className="text-[#FF2E93]">FLAT849</strong>!</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Phone brand & model selectors if applicable */}
            {isPhoneCase && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    1. Select Phone Brand *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {PHONE_BRANDS.slice(0, 8).map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setSelectedBrand(brand);
                          setSelectedModel(PHONE_MODELS_MAP[brand]?.[0] || '');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedBrand === brand
                            ? 'bg-[#211D1C] text-white border-[#211D1C]'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-[#FF2E93]'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    2. Select Phone Model *
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-medium text-[#211D1C] focus:ring-2 focus:ring-[#FF2E93] focus:outline-none"
                  >
                    {(PHONE_MODELS_MAP[selectedBrand] || []).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Comprehensive Personalization Module */}
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

            {/* Quantity & Buy CTA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs font-bold hover:text-[#FF2E93] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold tabular-nums font-mono text-[#211D1C]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xs font-bold hover:text-[#FF2E93] cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-6 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#211D1C] hover:bg-[#FF2E93] text-white active:scale-98'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <span>Add To Bag · ₹{product.price * quantity}</span>
                  )}
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-200 text-center text-[11px] text-stone-600 font-medium">
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <RefreshCw className="w-4 h-4 text-[#FF2E93] mb-1" />
                  <span>7-Day Replacement</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-amber-500 mb-1" />
                  <span>Cute Gift Packaging</span>
                </div>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="p-5 rounded-2xl bg-white border border-[#F3E8E2] space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#211D1C]">
                Handcrafted Specifications
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF2E93] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Feedback Component */}
        <div className="pt-8 border-t border-[#F5E6E8] dark:border-[#2D252A]">
          <ProductReviews product={product} />
        </div>

        {/* You May Also Like Row */}
        <div className="pt-12 border-t border-[#EFE7DE] dark:border-[#282127] space-y-6">
          <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
            You May Also Like
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={onQuickView}
                onOpenDetail={(prod) => {
                  onSelectProduct(prod);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Floating Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#141113]/95 backdrop-blur-md border-t border-[#EFE7DE] dark:border-[#282127] p-3.5 px-4 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
        <div className="min-w-0">
          <div className="text-[10px] text-stone-400 font-medium truncate">
            {product.category}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-bold text-base text-[#1C1917] dark:text-white tabular-nums">
              ₹{product.price}
            </span>
            <span className="text-xs text-stone-400 line-through tabular-nums">
              ₹{product.mrp}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
            addedSuccess
              ? 'bg-emerald-700 text-white'
              : 'bg-[#881337] hover:bg-[#700f2d] text-white'
          }`}
        >
          {addedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Bag</span>
            </>
          ) : (
            <span>Personalize & Add</span>
          )}
        </button>
      </div>
    </div>
  );
};
