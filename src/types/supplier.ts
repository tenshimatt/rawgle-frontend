// TypeScript interfaces for supplier and location data

export interface Supplier {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  distance?: number; // in km from user
  speciesServed: ('dog' | 'cat' | 'both')[];
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
