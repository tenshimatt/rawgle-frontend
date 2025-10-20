/**
 * Rawgle API Client
 * Connects Next.js frontend to Cloudflare Workers production API
 * Database: 9,190 suppliers with geolocation
 */

const RAWGLE_API_BASE = process.env.NEXT_PUBLIC_RAWGLE_API_URL || 'https://rawgle.com/api';

export interface Supplier {
  id: string;
  name: string;
  business_name?: string;
  address?: string;
  city: string | null;
  state: string | null;
  zip?: string;
  country?: string | null;
  latitude: number;
  longitude: number;
  website?: string | null;
  phone?: string | null;
  phone_number?: string | null;
  email?: string;
  description?: string;
  categories?: string[];
  rating?: number;
  user_ratings_total?: number;
  place_id?: string;
  types?: string;
  created_at?: string;
  distance_miles?: number;
  distance_km?: number;
}

export interface SearchParams {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number; // miles
}

export interface ApiStats {
  total_suppliers: number;
  total_categories: number;
  total_reviews: number;
  database_size_mb: number;
}

export interface LocationResult {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  ip_detected?: boolean;
}

/**
 * Rawgle Production API Client
 */
export const rawgleApi = {
  /**
   * Search suppliers by query
   * @param params - Search parameters
   * @returns Array of suppliers matching query
   */
  searchSuppliers: async (params: SearchParams): Promise<Supplier[]> => {
    const query = new URLSearchParams({
      q: params.q || '',
      limit: String(params.limit || 20),
      offset: String(params.offset || 0),
    });

    const response = await fetch(`${RAWGLE_API_BASE}/search?${query}`);

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.suppliers || data.results || data;
  },

  /**
   * Get suppliers near a location
   * @param params - Geolocation parameters
   * @returns Array of suppliers sorted by distance
   */
  getNearbySuppliers: async (params: NearbyParams): Promise<Supplier[]> => {
    const query = new URLSearchParams({
      lat: String(params.lat),
      lng: String(params.lng),
      radius: String(params.radius || 50),
    });

    const response = await fetch(`${RAWGLE_API_BASE}/nearby?${query}`);

    if (!response.ok) {
      throw new Error(`Nearby search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.suppliers || data.results || data;
  },

  /**
   * Get detailed information about a specific supplier
   * @param id - Supplier ID
   * @returns Supplier details
   */
  getSupplier: async (id: string): Promise<Supplier> => {
    const response = await fetch(`${RAWGLE_API_BASE}/supplier?id=${id}`);

    if (!response.ok) {
      throw new Error(`Supplier fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.supplier || data;
  },

  /**
   * Get database and platform statistics
   * @returns Platform statistics
   */
  getStats: async (): Promise<ApiStats> => {
    const response = await fetch(`${RAWGLE_API_BASE}/stats`);

    if (!response.ok) {
      throw new Error(`Stats fetch failed: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Detect user's location (IP-based + browser geolocation fallback)
   * @returns User location
   */
  detectLocation: async (): Promise<LocationResult> => {
    try {
      // Try IP-based detection first (server-side)
      const response = await fetch(`${RAWGLE_API_BASE}/location`);

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.warn('IP-based location detection failed:', error);
    }

    // Fallback to browser geolocation
    if ('geolocation' in navigator) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              ip_detected: false,
            });
          },
          (error) => {
            console.error('Browser geolocation failed:', error);
            // Default to US center if all fails
            resolve({
              latitude: 39.8283,
              longitude: -98.5795,
              country: 'US',
              ip_detected: false,
            });
          }
        );
      });
    }

    // Ultimate fallback: US center
    return {
      latitude: 39.8283,
      longitude: -98.5795,
      country: 'US',
      ip_detected: false,
    };
  },
};

/**
 * React Query hooks for easier data fetching
 */
export const rawgleQueries = {
  search: (params: SearchParams) => ({
    queryKey: ['suppliers', 'search', params],
    queryFn: () => rawgleApi.searchSuppliers(params),
  }),

  nearby: (params: NearbyParams) => ({
    queryKey: ['suppliers', 'nearby', params],
    queryFn: () => rawgleApi.getNearbySuppliers(params),
  }),

  supplier: (id: string) => ({
    queryKey: ['supplier', id],
    queryFn: () => rawgleApi.getSupplier(id),
  }),

  stats: () => ({
    queryKey: ['stats'],
    queryFn: () => rawgleApi.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  location: () => ({
    queryKey: ['location'],
    queryFn: () => rawgleApi.detectLocation(),
    staleTime: 1000 * 60 * 60, // 1 hour
  }),
};
