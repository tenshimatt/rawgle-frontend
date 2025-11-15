/**
 * Rawgle Production API Client
 *
 * Connects to Cloudflare Workers API with 9,190+ real suppliers
 * Production endpoint: https://rawgle.com/api/*
 */

const RAWGLE_API = process.env.NEXT_PUBLIC_RAWGLE_API_URL || 'https://rawgle.com/api';

export interface CloudflareSupplier {
  id: string;
  place_id?: string;
  name: string;
  business_name?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  species?: 'dogs' | 'cats' | 'both';
  delivery?: boolean;
  pickup?: boolean;
  description?: string;
  distance_miles?: number;
  distance_km?: number;
  created_at?: string;
}

export interface SearchResponse {
  success: boolean;
  results: CloudflareSupplier[];
  total: number;
  query?: string;
}

export interface NearbyResponse {
  success: boolean;
  results: CloudflareSupplier[];
  total: number;
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

export interface StatsResponse {
  success: boolean;
  stats: {
    total_suppliers: number;
    total_users: number;
    total_reviews: number;
    total_searches: number;
  };
}

/**
 * Rawgle Production API Client
 */
export const rawgleApi = {
  /**
   * Search suppliers by query
   * @param query - Search term (name, city, state, products)
   * @param limit - Maximum results (default: 50)
   * @param offset - Pagination offset (default: 0)
   */
  searchSuppliers: async (
    query: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<SearchResponse> => {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const res = await fetch(`${RAWGLE_API}/search?${params}`);

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('[Rawgle API] Search error:', error);
      throw error;
    }
  },

  /**
   * Get nearby suppliers by geolocation
   * @param lat - Latitude
   * @param lng - Longitude
   * @param radius - Search radius in miles (default: 50)
   */
  getNearbySuppliers: async (
    lat: number,
    lng: number,
    radius: number = 50
  ): Promise<NearbyResponse> => {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radius: radius.toString(),
      });

      const res = await fetch(`${RAWGLE_API}/nearby?${params}`);

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('[Rawgle API] Nearby search error:', error);
      throw error;
    }
  },

  /**
   * Get individual supplier details
   * @param id - Supplier ID
   */
  getSupplier: async (id: string): Promise<CloudflareSupplier | null> => {
    try {
      const params = new URLSearchParams({ id });
      const res = await fetch(`${RAWGLE_API}/supplier?${params}`);

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data.result || null;
    } catch (error) {
      console.error('[Rawgle API] Get supplier error:', error);
      throw error;
    }
  },

  /**
   * Get database statistics
   */
  getStats: async (): Promise<StatsResponse> => {
    try {
      const res = await fetch(`${RAWGLE_API}/stats`);

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('[Rawgle API] Stats error:', error);
      throw error;
    }
  },

  /**
   * Detect user location via IP
   */
  detectLocation: async (): Promise<{ country?: string; lat?: number; lng?: number }> => {
    try {
      const res = await fetch(`${RAWGLE_API}/location`);

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('[Rawgle API] Location detection error:', error);
      // Return empty object on error
      return {};
    }
  },
};

/**
 * Check if Rawgle API is available
 */
export async function checkRawgleApiHealth(): Promise<boolean> {
  try {
    const stats = await rawgleApi.getStats();
    return stats.success === true;
  } catch (error) {
    console.error('[Rawgle API] Health check failed:', error);
    return false;
  }
}
