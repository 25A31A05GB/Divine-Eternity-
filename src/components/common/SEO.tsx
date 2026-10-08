import React, { useEffect } from 'react';
import { BUSINESS_CONFIG } from '../../config/business';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  productData?: {
    name: string;
    description?: string;
    image?: string;
    price: number;
    inStock?: boolean;
    rating?: number;
    reviewCount?: number;
    slug?: string;
  };
}

const DEFAULT_TITLE = `${BUSINESS_CONFIG.brandName} — ${BUSINESS_CONFIG.subTagline}`;
const DEFAULT_DESCRIPTION =
  `Discover the world of ${BUSINESS_CONFIG.brandName}, where every gift is created to make your special moments more memorable. Personalized jewellery, hampers, bouquets, and bespoke creations.`;
const DEFAULT_IMAGE =
  '/images/founder/founder_sonu_real_1791375717528.jpg';
const SITE_NAME = BUSINESS_CONFIG.brandName;

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'divines eternity, personalized gifts, names on gifts, personalized jewellery, caricature miniature, personalized bouquets, special hampers, hair accessories, paradise of jewels',
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noindex = false,
  structuredData,
  productData,
}) => {
  const fullTitle = title
    ? (title.includes(BUSINESS_CONFIG.brandName) ? title : `${title} | ${BUSINESS_CONFIG.brandName}`)
    : DEFAULT_TITLE;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // 2. Primary Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 3. Canonical Link
    const currentUrl = url || (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '');
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    if (currentUrl) {
      canonicalLink.setAttribute('href', currentUrl);
    }

    // 4. OpenGraph Meta Tags
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', productData ? 'product' : type);
    if (image) setMetaTag('property', 'og:image', image);
    if (currentUrl) setMetaTag('property', 'og:url', currentUrl);

    // 5. Twitter Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    if (image) setMetaTag('name', 'twitter:image', image);

    // 6. JSON-LD Structured Data
    const scriptId = 'page-schema-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    let finalSchema: any = structuredData;

    // Build Product Schema if productData is provided
    if (productData) {
      const productSchema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productData.name,
        description: productData.description || description,
        image: productData.image || image,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: productData.price,
          availability: productData.inStock !== false
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: currentUrl,
          seller: {
            '@type': 'Organization',
            name: BUSINESS_CONFIG.brandName,
          },
        },
      };

      // aggregateRating ONLY if real reviews exist
      if (productData.rating && productData.reviewCount && productData.reviewCount > 0) {
        productSchema.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: Number(productData.rating.toFixed(1)),
          reviewCount: productData.reviewCount,
          bestRating: 5,
          worstRating: 1,
        };
      }

      finalSchema = productSchema;
    }

    if (finalSchema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(finalSchema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Keep head tidy
    };
  }, [fullTitle, description, keywords, image, url, type, noindex, structuredData, productData]);

  return null;
};
