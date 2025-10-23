/**
 * Advanced Geocoding Service
 *
 * Port of the Cloudflare Workers AdvancedGeocodingService
 * Adapted for Next.js environment with Google Places API integration
 */

interface GeocodingResult {
  success: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracy?: string;
  formattedAddress?: string;
  addressComponents?: any[];
  placeId?: string;
  source?: string;
  error?: string;
  originalStrategy?: string;
  fallbackLevel?: number;
}

interface PlaceSearchResult {
  success: boolean;
  results: any[];
  total?: number;
  error?: string;
}

interface PlaceDetails {
  place_id?: string;
  business_name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: string;
  price_level?: number;
  types?: string;
  reviews_summary?: any[];
  error?: string;
}

export class AdvancedGeocodingService {
  private apiKeys: string[];
  private currentKeyIndex: number;
  private rateLimitDelay: number;
  private maxRetries: number;

  constructor(apiKey: string, backupApiKey?: string) {
    this.apiKeys = [apiKey, backupApiKey].filter(Boolean) as string[];
    this.currentKeyIndex = 0;
    this.rateLimitDelay = 100; // ms between requests
    this.maxRetries = 3;
  }

  /**
   * Rotate API keys for rate limit management
   */
  private getCurrentApiKey(): string {
    const key = this.apiKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    return key;
  }

  /**
   * Enhanced geocoding with fallback strategies
   */
  async geocodeAddress(
    address: string,
    city: string,
    state: string,
    existingLat: number | null = null,
    existingLng: number | null = null
  ): Promise<GeocodingResult> {
    // Skip if we already have high-quality coordinates
    if (
      existingLat &&
      existingLng &&
      Math.abs(existingLat) > 0.01 &&
      Math.abs(existingLng) > 0.01
    ) {
      return {
        success: true,
        latitude: existingLat,
        longitude: existingLng,
        accuracy: 'existing',
        source: 'database',
      };
    }

    const geocodeStrategies = [
      `${address}, ${city}, ${state}`, // Full address
      `${city}, ${state}`, // City + State only
      address, // Address only
      city, // City only
    ];

    for (const searchAddress of geocodeStrategies) {
      if (!searchAddress || searchAddress.trim().length < 3) continue;

      const result = await this.geocodeWithRetry(searchAddress);
      if (result.success) {
        return {
          ...result,
          originalStrategy: searchAddress,
          fallbackLevel: geocodeStrategies.indexOf(searchAddress),
        };
      }

      // Rate limiting delay
      await this.delay(this.rateLimitDelay);
    }

    return {
      success: false,
      error: 'All geocoding strategies failed',
      latitude: null,
      longitude: null,
    };
  }

  /**
   * Retry logic with exponential backoff
   */
  private async geocodeWithRetry(
    address: string,
    retryCount: number = 0
  ): Promise<GeocodingResult> {
    try {
      const apiKey = this.getCurrentApiKey();
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;

        return {
          success: true,
          latitude: location.lat,
          longitude: location.lng,
          accuracy: result.geometry.location_type,
          formattedAddress: result.formatted_address,
          addressComponents: result.address_components,
          placeId: result.place_id,
          source: 'google_geocoding',
        };
      } else if (data.status === 'OVER_QUERY_LIMIT' && retryCount < this.maxRetries) {
        // Exponential backoff for rate limits
        const backoffDelay = Math.pow(2, retryCount) * 1000;
        await this.delay(backoffDelay);
        return this.geocodeWithRetry(address, retryCount + 1);
      } else {
        return {
          success: false,
          error: data.status,
          latitude: null,
          longitude: null,
        };
      }
    } catch (error) {
      if (retryCount < this.maxRetries) {
        await this.delay(Math.pow(2, retryCount) * 1000);
        return this.geocodeWithRetry(address, retryCount + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        latitude: null,
        longitude: null,
      };
    }
  }

  /**
   * Enhanced Places API search with business details
   */
  async searchPlaces(
    query: string,
    location: { lat: number; lng: number } | null = null,
    radius: number = 25000
  ): Promise<PlaceSearchResult> {
    try {
      const apiKey = this.getCurrentApiKey();
      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${apiKey}`;

      if (location && location.lat && location.lng) {
        url += `&location=${location.lat},${location.lng}&radius=${radius}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const enhancedResults = await Promise.all(
          data.results.slice(0, 20).map(async (place: any) => {
            const details = await this.getPlaceDetails(place.place_id);
            return {
              ...place,
              ...details,
              source: 'google_places',
            };
          })
        );

        return {
          success: true,
          results: enhancedResults,
          total: data.results.length,
        };
      } else {
        return {
          success: false,
          error: data.status,
          results: [],
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        results: [],
      };
    }
  }

  /**
   * Get detailed place information
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    try {
      const apiKey = this.getCurrentApiKey();
      const fields = [
        'name',
        'formatted_address',
        'geometry',
        'place_id',
        'formatted_phone_number',
        'website',
        'rating',
        'user_ratings_total',
        'opening_hours',
        'price_level',
        'reviews',
        'photos',
        'types',
      ].join(',');

      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const place = data.result;
        return {
          place_id: place.place_id,
          business_name: place.name,
          address: place.formatted_address,
          latitude: place.geometry?.location?.lat,
          longitude: place.geometry?.location?.lng,
          phone: place.formatted_phone_number,
          website: place.website,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          opening_hours: place.opening_hours?.weekday_text?.join('; '),
          price_level: place.price_level,
          types: place.types?.join(', '),
          reviews_summary: place.reviews?.slice(0, 3).map((r: any) => ({
            author: r.author_name,
            rating: r.rating,
            text: r.text?.substring(0, 200) + '...',
          })),
        };
      } else {
        return {
          error: data.status,
        };
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Batch geocoding for existing database
   */
  async batchGeocodeSuppliers(
    suppliers: Array<{
      id: string;
      name: string;
      address: string;
      city: string;
      state: string;
      latitude?: number | null;
      longitude?: number | null;
      place_id?: string;
    }>,
    batchSize: number = 10
  ): Promise<{
    success: boolean;
    processed: number;
    errors: number;
    results: any[];
    errorDetails: any[];
  }> {
    const results: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < suppliers.length; i += batchSize) {
      const batch = suppliers.slice(i, i + batchSize);

      console.log(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          suppliers.length / batchSize
        )}...`
      );

      const batchPromises = batch.map(async supplier => {
        try {
          const geocodeResult = await this.geocodeAddress(
            supplier.address,
            supplier.city,
            supplier.state,
            supplier.latitude || null,
            supplier.longitude || null
          );

          if (geocodeResult.success) {
            results.push({
              id: supplier.id,
              place_id: supplier.place_id,
              originalName: supplier.name,
              ...geocodeResult,
            });
          } else {
            errors.push({
              id: supplier.id,
              name: supplier.name,
              error: geocodeResult.error,
            });
          }
        } catch (error) {
          errors.push({
            id: supplier.id,
            name: supplier.name,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      await Promise.all(batchPromises);

      // Rate limiting between batches
      if (i + batchSize < suppliers.length) {
        await this.delay(1000);
      }
    }

    return {
      success: true,
      processed: results.length,
      errors: errors.length,
      results: results,
      errorDetails: errors,
    };
  }

  /**
   * Utility: Delay function for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate geocoding report
   */
  generateReport(results: any[]): {
    summary: {
      total: number;
      successful: number;
      failed: number;
      successRate: string;
      highAccuracy: number;
      mediumAccuracy: number;
    };
    recommendations: string[];
  } {
    const total = results.length;
    const successful = results.filter((r: any) => r.success).length;
    const highAccuracy = results.filter((r: any) => r.accuracy === 'ROOFTOP').length;
    const mediumAccuracy = results.filter((r: any) => r.accuracy === 'RANGE_INTERPOLATED')
      .length;

    return {
      summary: {
        total: total,
        successful: successful,
        failed: total - successful,
        successRate: `${((successful / total) * 100).toFixed(1)}%`,
        highAccuracy: highAccuracy,
        mediumAccuracy: mediumAccuracy,
      },
      recommendations: [
        successful < total * 0.9 ? 'Consider manual review of failed addresses' : null,
        highAccuracy < successful * 0.7
          ? 'Many addresses have low precision - consider address standardization'
          : null,
      ].filter(Boolean) as string[],
    };
  }
}

/**
 * Singleton instance for use across the application
 */
let geocodingServiceInstance: AdvancedGeocodingService | null = null;

export function getGeocodingService(): AdvancedGeocodingService {
  if (!geocodingServiceInstance) {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    const backupApiKey = process.env.GOOGLE_PLACES_API_KEY_BACKUP;

    if (!apiKey) {
      console.warn('GOOGLE_PLACES_API_KEY not configured - geocoding will not work');
    }

    geocodingServiceInstance = new AdvancedGeocodingService(apiKey, backupApiKey);
  }

  return geocodingServiceInstance;
}
