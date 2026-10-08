/**
 * Optional Analytics & Telemetry (GA4, Meta Pixel)
 * Privacy-first: Loaded ONLY after patron consent.
 * No-ops when environment variables (VITE_GA_ID, VITE_META_PIXEL_ID) are unset.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const CONSENT_STORAGE_KEY = 'de_analytics_consent_v1';

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'granted';
  } catch {
    return false;
  }
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'granted' : 'denied');
    if (granted) {
      initAnalytics();
    }
  } catch {
    // ignore
  }
}

let isInitialized = false;

export function initAnalytics(): void {
  if (typeof window === 'undefined' || isInitialized) return;
  if (!hasAnalyticsConsent()) return;

  const gaId = import.meta.env.VITE_GA_ID;
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;

  // Initialize GA4 if ID present
  if (gaId && typeof gaId === 'string' && gaId.trim()) {
    try {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId.trim())}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId.trim(), { anonymize_ip: true });
    } catch (e) {
      console.warn('GA4 init warning', e);
    }
  }

  // Initialize Meta Pixel if ID present
  if (pixelId && typeof pixelId === 'string' && pixelId.trim()) {
    try {
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      window.fbq?.('init', pixelId.trim());
      window.fbq?.('track', 'PageView');
    } catch (e) {
      console.warn('Meta Pixel init warning', e);
    }
  }

  isInitialized = true;
}

export const analytics = {
  viewItem(item: { id: string; name: string; price: number; category?: string }) {
    if (!hasAnalyticsConsent()) return;
    try {
      window.gtag?.('event', 'view_item', {
        currency: 'INR',
        value: item.price,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            item_category: item.category,
          },
        ],
      });
      window.fbq?.('track', 'ViewContent', {
        content_ids: [item.id],
        content_name: item.name,
        content_type: 'product',
        value: item.price,
        currency: 'INR',
      });
    } catch {
      // ignore
    }
  },

  addToCart(item: { id: string; name: string; price: number; quantity: number }) {
    if (!hasAnalyticsConsent()) return;
    try {
      window.gtag?.('event', 'add_to_cart', {
        currency: 'INR',
        value: item.price * item.quantity,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
          },
        ],
      });
      window.fbq?.('track', 'AddToCart', {
        content_ids: [item.id],
        content_name: item.name,
        content_type: 'product',
        value: item.price * item.quantity,
        currency: 'INR',
      });
    } catch {
      // ignore
    }
  },

  beginCheckout(total: number, itemCount: number) {
    if (!hasAnalyticsConsent()) return;
    try {
      window.gtag?.('event', 'begin_checkout', {
        currency: 'INR',
        value: total,
        item_count: itemCount,
      });
      window.fbq?.('track', 'InitiateCheckout', {
        value: total,
        currency: 'INR',
        num_items: itemCount,
      });
    } catch {
      // ignore
    }
  },

  purchase(order: { id: string; totalAmount: number; items: Array<{ id: string; name: string; price: number; quantity: number }> }) {
    if (!hasAnalyticsConsent()) return;
    try {
      window.gtag?.('event', 'purchase', {
        transaction_id: order.id,
        value: order.totalAmount,
        currency: 'INR',
        items: order.items.map((it) => ({
          item_id: it.id,
          item_name: it.name,
          price: it.price,
          quantity: it.quantity,
        })),
      });
      window.fbq?.('track', 'Purchase', {
        content_type: 'product',
        value: order.totalAmount,
        currency: 'INR',
        order_id: order.id,
      });
    } catch {
      // ignore
    }
  },
};
