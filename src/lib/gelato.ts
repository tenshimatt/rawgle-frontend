/**
 * Gelato API Client
 *
 * Gelato is a global print-on-demand platform that enables businesses to print and deliver
 * products locally around the world. This client provides typed access to the Gelato API.
 *
 * @see https://dashboard.gelato.com/docs/
 * @see https://github.com/ekkolon/gelato-admin-node
 */

export type GelatoEnvironment = 'sandbox' | 'production';

interface GelatoConfig {
  apiKey: string;
  apiUrl: string;
  environment?: GelatoEnvironment;
}

interface GelatoAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postCode: string;
  state?: string;
  country: string;
  email: string;
  phone?: string;
}

interface GelatoOrderItem {
  productUid: string;
  quantity: number;
  files?: {
    url: string;
    type: string;
  }[];
  options?: Record<string, any>;
}

interface GelatoOrderRequest {
  orderReferenceId: string;
  customerReferenceId?: string;
  shippingAddress: GelatoAddress;
  items: GelatoOrderItem[];
  returnAddress?: GelatoAddress;
  metadata?: Record<string, any>;
}

interface GelatoOrderResponse {
  id: string;
  orderReferenceId: string;
  status: string;
  items: any[];
  createdAt: string;
  updatedAt: string;
}

interface GelatoOrderStatus {
  orderId: string;
  status: 'draft' | 'pending' | 'approved' | 'production' | 'shipped' | 'delivered' | 'cancelled' | 'failed';
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
}

export interface GelatoShippingQuoteRequest {
  destinationCountry: string; // ISO 3166-1 alpha-2 country code (e.g., "US", "GB")
  destinationPostCode?: string;
  items: Array<{
    productUid: string;
    variantUid?: string;
    quantity: number;
  }>;
}

export interface GelatoShippingQuote {
  shipmentMethods: Array<{
    uid: string;
    name: string;
    description?: string;
    price: {
      amount: number;
      currency: string;
    };
    estimatedDeliveryDays: {
      min: number;
      max: number;
    };
  }>;
  totalProductPrice: {
    amount: number;
    currency: string;
  };
}

class GelatoClient {
  private config: GelatoConfig;
  private static readonly BASE_URLS = {
    production: 'https://order.gelatoapis.com/v4',
    sandbox: 'https://order-sandbox.gelatoapis.com/v4',
  } as const;
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY_MS = 1000;

  constructor(config?: Partial<GelatoConfig>) {
    const environment = (config?.environment ||
      process.env.GELATO_ENVIRONMENT ||
      'sandbox') as GelatoEnvironment;

    const apiKey = config?.apiKey ||
      (environment === 'production'
        ? process.env.GELATO_API_KEY
        : process.env.GELATO_SANDBOX_API_KEY) ||
      '';

    const apiUrl = config?.apiUrl || GelatoClient.BASE_URLS[environment];

    if (!apiKey) {
      console.warn(
        `[Gelato] API key not configured (${
          environment === 'production'
            ? 'GELATO_API_KEY'
            : 'GELATO_SANDBOX_API_KEY'
        }), order fulfillment disabled`
      );
    }

    this.config = {
      apiKey,
      apiUrl,
      environment,
    };
  }

  /**
   * Check if Gelato is properly configured
   */
  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  /**
   * Make API request to Gelato with retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error('Gelato API key not configured');
    }

    const url = `${this.config.apiUrl}${endpoint}`;
    const headers = {
      'X-API-KEY': this.config.apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle rate limiting with exponential backoff
      if (response.status === 429 && retryCount < GelatoClient.MAX_RETRIES) {
        const delay = GelatoClient.RETRY_DELAY_MS * Math.pow(2, retryCount);
        console.warn(`[Gelato] Rate limited. Retrying in ${delay}ms... (attempt ${retryCount + 1}/${GelatoClient.MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      // Handle server errors with retry
      if (response.status >= 500 && retryCount < GelatoClient.MAX_RETRIES) {
        const delay = GelatoClient.RETRY_DELAY_MS * Math.pow(2, retryCount);
        console.warn(`[Gelato] Server error (${response.status}). Retrying in ${delay}ms... (attempt ${retryCount + 1}/${GelatoClient.MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = data.message || response.statusText;
        console.error(`[Gelato] API error: ${response.status} - ${errorMessage}`, data);
        throw new Error(`Gelato API error: ${response.status} - ${errorMessage}`);
      }

      return data as T;
    } catch (error) {
      // Network errors - retry
      if (error instanceof TypeError && retryCount < GelatoClient.MAX_RETRIES) {
        const delay = GelatoClient.RETRY_DELAY_MS * Math.pow(2, retryCount);
        console.warn(`[Gelato] Network error. Retrying in ${delay}ms... (attempt ${retryCount + 1}/${GelatoClient.MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      // Re-throw if max retries exceeded or other error
      console.error('[Gelato] Request failed:', {
        endpoint,
        error: error instanceof Error ? error.message : error,
        retries: retryCount,
      });
      throw error;
    }
  }

  /**
   * Create a new order in Gelato
   */
  async createOrder(orderData: GelatoOrderRequest): Promise<GelatoOrderResponse> {
    try {
      const response = await this.request<GelatoOrderResponse>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      console.log('[Gelato] Order created:', response.id);
      return response;
    } catch (error) {
      console.error('[Gelato] Failed to create order:', error);
      throw error;
    }
  }

  /**
   * Get order status from Gelato
   */
  async getOrderStatus(orderId: string): Promise<GelatoOrderStatus> {
    try {
      const response = await this.request<GelatoOrderStatus>(`/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('[Gelato] Failed to get order status:', error);
      throw error;
    }
  }

  /**
   * Cancel an order in Gelato
   */
  async cancelOrder(orderId: string): Promise<void> {
    try {
      await this.request(`/orders/${orderId}/cancel`, {
        method: 'POST',
      });
      console.log('[Gelato] Order cancelled:', orderId);
    } catch (error) {
      console.error('[Gelato] Failed to cancel order:', error);
      throw error;
    }
  }

  /**
   * Get available products from Gelato catalog
   */
  async getProducts(): Promise<any[]> {
    try {
      if (!this.isConfigured()) {
        console.warn('[Gelato] API not configured, returning mock products');
        return this.getMockProducts();
      }
      const response = await this.request<{ products: any[] }>('/products');
      return response.products;
    } catch (error) {
      console.error('[Gelato] Failed to get products:', error);
      return this.getMockProducts();
    }
  }

  /**
   * Get a specific product from Gelato catalog
   */
  async getProduct(productUid: string): Promise<any | null> {
    try {
      if (!this.isConfigured()) {
        console.warn('[Gelato] API not configured, returning mock product');
        const mockProducts = this.getMockProducts();
        return mockProducts.find(p => p.uid === productUid) || null;
      }
      const response = await this.request<any>(`/products/${productUid}`);
      return response;
    } catch (error) {
      console.error('[Gelato] Failed to get product:', error);
      return null;
    }
  }

  /**
   * Validate if a Gelato product UID exists
   */
  async validateProductUid(productUid: string): Promise<boolean> {
    const product = await this.getProduct(productUid);
    return product !== null;
  }

  /**
   * Mock products for development/demo
   */
  private getMockProducts(): any[] {
    return [
      {
        uid: 'gelato_mug_001',
        title: 'Custom Pet Photo Mug - 11oz',
        description: 'High-quality ceramic mug with custom pet photo printing',
        productType: 'mug',
        images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400'],
        variants: [
          {
            uid: 'gelato_mug_001_white',
            sku: 'MUG-11OZ-WHT',
            title: '11oz White Mug',
            attributes: { size: '11oz', color: 'white', material: 'ceramic' },
            pricing: { currency: 'USD', amount: 8.99 },
            availability: { available: true, inStock: true, estimatedShipping: '3-5 business days' },
          },
          {
            uid: 'gelato_mug_001_black',
            sku: 'MUG-11OZ-BLK',
            title: '11oz Black Mug',
            attributes: { size: '11oz', color: 'black', material: 'ceramic' },
            pricing: { currency: 'USD', amount: 9.99 },
            availability: { available: true, inStock: true, estimatedShipping: '3-5 business days' },
          },
        ],
        attributes: { category: 'drinkware', tags: ['mug', 'custom', 'pet'] },
      },
      {
        uid: 'gelato_tshirt_001',
        title: 'Custom Pet T-Shirt',
        description: 'Premium cotton t-shirt with custom pet design',
        productType: 'apparel',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
        variants: [
          {
            uid: 'gelato_tshirt_001_s_white',
            sku: 'TSH-S-WHT',
            title: 'Small White T-Shirt',
            attributes: { size: 'S', color: 'white', material: '100% cotton' },
            pricing: { currency: 'USD', amount: 15.99 },
            availability: { available: true, inStock: true, estimatedShipping: '5-7 business days' },
          },
          {
            uid: 'gelato_tshirt_001_m_white',
            sku: 'TSH-M-WHT',
            title: 'Medium White T-Shirt',
            attributes: { size: 'M', color: 'white', material: '100% cotton' },
            pricing: { currency: 'USD', amount: 15.99 },
            availability: { available: true, inStock: true, estimatedShipping: '5-7 business days' },
          },
          {
            uid: 'gelato_tshirt_001_l_white',
            sku: 'TSH-L-WHT',
            title: 'Large White T-Shirt',
            attributes: { size: 'L', color: 'white', material: '100% cotton' },
            pricing: { currency: 'USD', amount: 15.99 },
            availability: { available: true, inStock: true, estimatedShipping: '5-7 business days' },
          },
        ],
        attributes: { category: 'apparel', tags: ['tshirt', 'custom', 'pet'] },
      },
      {
        uid: 'gelato_poster_001',
        title: 'Custom Pet Poster',
        description: 'High-quality photo poster of your beloved pet',
        productType: 'poster',
        images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400'],
        variants: [
          {
            uid: 'gelato_poster_001_a4',
            sku: 'POST-A4',
            title: 'A4 Poster',
            attributes: { size: 'A4', material: 'premium paper' },
            pricing: { currency: 'USD', amount: 12.99 },
            availability: { available: true, inStock: true, estimatedShipping: '3-5 business days' },
          },
          {
            uid: 'gelato_poster_001_a3',
            sku: 'POST-A3',
            title: 'A3 Poster',
            attributes: { size: 'A3', material: 'premium paper' },
            pricing: { currency: 'USD', amount: 18.99 },
            availability: { available: true, inStock: true, estimatedShipping: '3-5 business days' },
          },
        ],
        attributes: { category: 'wall-art', tags: ['poster', 'custom', 'pet'] },
      },
      {
        uid: 'gelato_canvas_001',
        title: 'Custom Pet Canvas Print',
        description: 'Museum-quality canvas print of your pet',
        productType: 'canvas',
        images: ['https://images.unsplash.com/photo-1578926078804-b75a422a7c46?w=400'],
        variants: [
          {
            uid: 'gelato_canvas_001_12x16',
            sku: 'CAN-12X16',
            title: '12x16 Canvas',
            attributes: { size: '12x16', material: 'canvas' },
            pricing: { currency: 'USD', amount: 34.99 },
            availability: { available: true, inStock: true, estimatedShipping: '5-7 business days' },
          },
          {
            uid: 'gelato_canvas_001_16x20',
            sku: 'CAN-16X20',
            title: '16x20 Canvas',
            attributes: { size: '16x20', material: 'canvas' },
            pricing: { currency: 'USD', amount: 44.99 },
            availability: { available: true, inStock: true, estimatedShipping: '5-7 business days' },
          },
        ],
        attributes: { category: 'wall-art', tags: ['canvas', 'custom', 'pet'] },
      },
      {
        uid: 'gelato_phonecase_001',
        title: 'Custom Pet Phone Case',
        description: 'Durable phone case with your pet\'s photo',
        productType: 'phone-case',
        images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400'],
        variants: [
          {
            uid: 'gelato_phonecase_001_iphone_13',
            sku: 'CASE-IP13',
            title: 'iPhone 13 Case',
            attributes: { size: 'iPhone 13', material: 'polycarbonate' },
            pricing: { currency: 'USD', amount: 19.99 },
            availability: { available: true, inStock: true, estimatedShipping: '3-5 business days' },
          },
          {
            uid: 'gelato_phonecase_001_iphone_14',
            sku: 'CASE-IP14',
            title: 'iPhone 14 Case',
            attributes: { size: 'iPhone 14', material: 'polycarbonate' },
            pricing: { currency: 'USD', amount: 19.99 },
            availability: { available: true, inStock: true, estimatedShipping: '3-5 business days' },
          },
        ],
        attributes: { category: 'accessories', tags: ['phone-case', 'custom', 'pet'] },
      },
    ];
  }

  /**
   * Map Rawgle product to Gelato product UID
   * This mapping should be customized based on your product catalog
   */
  mapProductToGelatoUid(productType: string, size?: string): string {
    // Example mapping - customize based on your products
    const productMap: Record<string, string> = {
      'poster_8x10': 'gelato_poster_8x10',
      'poster_11x14': 'gelato_poster_11x14',
      'poster_16x20': 'gelato_poster_16x20',
      'canvas_8x10': 'gelato_canvas_8x10',
      'canvas_11x14': 'gelato_canvas_11x14',
      'tshirt_s': 'gelato_tshirt_small',
      'tshirt_m': 'gelato_tshirt_medium',
      'tshirt_l': 'gelato_tshirt_large',
      'mug': 'gelato_mug_11oz',
    };

    const key = size ? `${productType}_${size.toLowerCase()}` : productType;
    return productMap[key] || productType;
  }

  /**
   * Verify webhook signature from Gelato
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('[Gelato] Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Get shipping quote for products
   *
   * @param quote Shipping quote request
   * @returns Available shipping methods and prices
   */
  async getShippingQuote(quote: GelatoShippingQuoteRequest): Promise<GelatoShippingQuote> {
    try {
      if (!this.isConfigured()) {
        console.warn('[Gelato] API not configured, returning mock shipping quote');
        return this.getMockShippingQuote(quote);
      }

      const response = await this.request<GelatoShippingQuote>('/shipping/quote', {
        method: 'POST',
        body: JSON.stringify(quote),
      });

      console.log('[Gelato] Shipping quote retrieved successfully');
      return response;
    } catch (error) {
      console.error('[Gelato] Failed to get shipping quote:', error);
      return this.getMockShippingQuote(quote);
    }
  }

  /**
   * Mock shipping quote for development/demo
   */
  private getMockShippingQuote(quote: GelatoShippingQuoteRequest): GelatoShippingQuote {
    const baseProductPrice = quote.items.reduce((total, item) => {
      return total + (item.quantity * 15.0); // Mock price per item
    }, 0);

    return {
      totalProductPrice: {
        amount: baseProductPrice,
        currency: 'USD',
      },
      shipmentMethods: [
        {
          uid: 'standard',
          name: 'Standard Shipping',
          description: 'Regular delivery',
          price: {
            amount: 5.99,
            currency: 'USD',
          },
          estimatedDeliveryDays: {
            min: 5,
            max: 7,
          },
        },
        {
          uid: 'express',
          name: 'Express Shipping',
          description: 'Fast delivery',
          price: {
            amount: 12.99,
            currency: 'USD',
          },
          estimatedDeliveryDays: {
            min: 2,
            max: 3,
          },
        },
        {
          uid: 'priority',
          name: 'Priority Shipping',
          description: 'Fastest delivery',
          price: {
            amount: 24.99,
            currency: 'USD',
          },
          estimatedDeliveryDays: {
            min: 1,
            max: 2,
          },
        },
      ],
    };
  }

  /**
   * Generate SKU from product name and variant attributes
   */
  generateSKU(productName: string, variant?: { size?: string; color?: string }): string {
    const base = productName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 6);

    const size = variant?.size?.toUpperCase().replace(/[^A-Z0-9]/g, '') || '';
    const color = variant?.color?.toUpperCase().substring(0, 3) || '';

    const timestamp = Date.now().toString().slice(-4);

    return `${base}-${size}${color}-${timestamp}`;
  }
}

// Export singleton instance
export const gelato = new GelatoClient();

// Export client class for custom configurations
export { GelatoClient };

// Export types
export type {
  GelatoAddress,
  GelatoOrderItem,
  GelatoOrderRequest,
  GelatoOrderResponse,
  GelatoOrderStatus,
};
