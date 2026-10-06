import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = "Divine's Eternity - Luxury Phone Cases & Personalized Gifts";
const DEFAULT_DESCRIPTION =
  'Gifts that stay in hearts. Handcrafted luxury phone cases, bracelet cases, mirror cases, and custom personalized accessories.';
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=1200&q=80';
const SITE_NAME = "Divine's Eternity";

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'luxury phone cases, personalized jewelry, custom acrylic song plaques, preserved eternal roses, memory photo lamps, divine eternity gifts',
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noindex = false,
  structuredData,
}) => {
  const fullTitle = title
    ? `${title} | Divine's Eternity`
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
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
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
    setMetaTag('property', 'og:type', type);
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

    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(structuredData);
    } else if (scriptTag) {
      // Remove specific page schema if none provided for this page
      scriptTag.remove();
    }

    return () => {
      // Cleanup dynamically injected schema on unmount if needed
    };
  }, [fullTitle, description, keywords, image, url, type, noindex, structuredData]);

  return null;
};
