/**
 * Safe, production-grade Client-Side E-Commerce Tracking Utility for Mirrorwala.
 * Maps high-fidelity analytics to Google Analytics (gtag) and Meta Pixel (fbq).
 */

export interface AnalyticsProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  sku?: string;
}

export interface AnalyticsCart {
  items: Array<{
    product: AnalyticsProduct;
    quantity: number;
  }>;
  total: number;
}

export interface AnalyticsOrder {
  id: string;
  total: number;
  currency: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export const Analytics = {
  /**
   * Tracks dynamic client route switches.
   */
  pageView: (url: string) => {
    if (typeof window === 'undefined') return;
    
    // Google Analytics PageView event
    if ((window as any).gtag && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }

    // Meta Pixel PageView event
    if ((window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  },

  /**
   * Tracks clicks on individual products or dynamic showroom details views.
   */
  trackProductClick: (product: AnalyticsProduct) => {
    if (typeof window === 'undefined') return;
    
    // Google Analytics - select_item standard schema
    if ((window as any).gtag) {
      (window as any).gtag('event', 'select_item', {
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_category: product.category,
          item_code: product.sku,
        }]
      });
    }

    // Meta Pixel - ViewContent standard schema
    if ((window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'INR',
      });
    }
  },

  /**
   * Tracks additions to shopping carts.
   */
  trackAddToCart: (product: AnalyticsProduct, quantity: number) => {
    if (typeof window === 'undefined') return;

    // Google Analytics - add_to_cart schema
    if ((window as any).gtag) {
      (window as any).gtag('event', 'add_to_cart', {
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: quantity,
          item_category: product.category,
        }]
      });
    }

    // Meta Pixel - AddToCart schema
    if ((window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price * quantity,
        currency: 'INR',
      });
    }
  },

  /**
   * Tracks progression to checkouts.
   */
  trackCheckoutStarted: (cart: AnalyticsCart) => {
    if (typeof window === 'undefined') return;

    // Google Analytics - begin_checkout schema
    if ((window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        value: cart.total,
        currency: 'INR',
        items: cart.items.map(item => ({
          item_id: item.product.id,
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        }))
      });
    }

    // Meta Pixel - InitiateCheckout schema
    if ((window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: cart.total,
        currency: 'INR',
        content_ids: cart.items.map(item => item.product.id),
        num_items: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      });
    }
  },

  /**
   * Tracks purchase conversion and order completion events.
   */
  trackPurchase: (order: AnalyticsOrder) => {
    if (typeof window === 'undefined') return;

    // Google Analytics - purchase schema
    if ((window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: order.id,
        value: order.total,
        currency: order.currency || 'INR',
        items: order.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        }))
      });
    }

    // Meta Pixel - Purchase schema
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: order.total,
        currency: order.currency || 'INR',
        content_ids: order.items.map(item => item.id),
        content_type: 'product',
      });
    }
  },

  /**
   * Tracks customer clicks on WhatsApp Floating Chat triggers and direct links.
   */
  trackWhatsAppClick: (label: string) => {
    if (typeof window === 'undefined') return;

    // Google Analytics custom conversion
    if ((window as any).gtag) {
      (window as any).gtag('event', 'contact', {
        method: 'WhatsApp',
        event_label: label,
      });
    }

    // Meta Pixel custom conversion
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'WhatsAppClick', {
        location: label,
      });
    }
  },

  /**
   * Tracks successful form submissions (general enquiries or bespoke mirror quotes).
   */
  trackFormSubmission: (formType: string) => {
    if (typeof window === 'undefined') return;

    // Google Analytics lead generation tag
    if ((window as any).gtag) {
      (window as any).gtag('event', 'generate_lead', {
        event_category: 'Form',
        event_label: formType,
      });
    }

    // Meta Pixel Lead tag
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_category: 'Form',
        content_name: formType,
      });
    }
  }
};
