/**
 * Mock Suppliers Database
 *
 * Sample raw food suppliers with realistic US locations for testing.
 * In production, this data would come from the D1 database.
 */

export interface Supplier {
  id: string;
  place_id?: string;
  business_name: string;
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
  created_at?: string;
}

export const suppliers: Supplier[] = [
  {
    id: '1',
    place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    business_name: 'Raw Feeding Miami',
    address: '1234 Biscayne Blvd',
    city: 'Miami',
    state: 'FL',
    country: 'USA',
    latitude: 25.7617,
    longitude: -80.1918,
    phone: '+1-305-555-0101',
    website: 'https://rawfeedingmiami.com',
    rating: 4.8,
    user_ratings_total: 127,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Premium raw food for dogs and cats. Family-owned business since 2015.',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    place_id: 'ChIJOwg_06VPwokRYv534QaPC8g',
    business_name: 'NYC Raw Pet Food Co',
    address: '567 Broadway',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.0060,
    phone: '+1-212-555-0202',
    website: 'https://nycrawpet.com',
    rating: 4.9,
    user_ratings_total: 342,
    species: 'dogs',
    delivery: true,
    pickup: true,
    description: 'Locally sourced raw dog food. Free delivery in NYC.',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: '3',
    place_id: 'ChIJ7cv00DwsDogRAMDACa2m4K8',
    business_name: 'Chicago Natural Pet Supply',
    address: '890 Michigan Ave',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    latitude: 41.8781,
    longitude: -87.6298,
    phone: '+1-312-555-0303',
    website: 'https://chicagonaturalpet.com',
    rating: 4.7,
    user_ratings_total: 215,
    species: 'both',
    delivery: false,
    pickup: true,
    description: 'BARF diet specialists. In-store pickup only.',
    created_at: '2024-02-01T10:00:00Z',
  },
  {
    id: '4',
    place_id: 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
    business_name: 'LA Raw & Natural',
    address: '2345 Sunset Blvd',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    latitude: 34.0522,
    longitude: -118.2437,
    phone: '+1-323-555-0404',
    website: 'https://larawnatural.com',
    rating: 4.6,
    user_ratings_total: 189,
    species: 'dogs',
    delivery: true,
    pickup: true,
    description: 'Organic raw food for dogs. Weekly delivery service available.',
    created_at: '2024-02-10T10:00:00Z',
  },
  {
    id: '5',
    place_id: 'ChIJVVVVVWIvkFQR5kHQsiHkDQ8',
    business_name: 'Seattle Premium Raw',
    address: '6789 Pike Street',
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    latitude: 47.6062,
    longitude: -122.3321,
    phone: '+1-206-555-0505',
    website: 'https://seattlepremiumraw.com',
    rating: 4.9,
    user_ratings_total: 278,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Pacific Northwest raw food specialists for dogs and cats.',
    created_at: '2024-02-15T10:00:00Z',
  },
  {
    id: '6',
    place_id: 'ChIJWQkz5Y5yGzQR1n5_LvKj5Gg',
    business_name: 'Austin Raw Pet Foods',
    address: '1122 Congress Ave',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    latitude: 30.2672,
    longitude: -97.7431,
    phone: '+1-512-555-0606',
    website: 'https://austinrawpet.com',
    rating: 4.5,
    user_ratings_total: 156,
    species: 'dogs',
    delivery: true,
    pickup: false,
    description: 'Texas-raised raw dog food. Delivery only.',
    created_at: '2024-03-01T10:00:00Z',
  },
  {
    id: '7',
    place_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
    business_name: 'San Francisco Raw Co',
    address: '3344 Market Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    latitude: 37.7749,
    longitude: -122.4194,
    phone: '+1-415-555-0707',
    website: 'https://sfrawco.com',
    rating: 4.8,
    user_ratings_total: 201,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Certified organic raw food for pets. Bay Area delivery.',
    created_at: '2024-03-05T10:00:00Z',
  },
  {
    id: '8',
    place_id: 'ChIJ-bDD5__lhVQRuvNfbGh4QpQ',
    business_name: 'Portland Raw Feeding',
    address: '5566 Burnside Street',
    city: 'Portland',
    state: 'OR',
    country: 'USA',
    latitude: 45.5152,
    longitude: -122.6784,
    phone: '+1-503-555-0808',
    website: 'https://portlandrawfeeding.com',
    rating: 4.7,
    user_ratings_total: 167,
    species: 'cats',
    delivery: true,
    pickup: true,
    description: 'Specialized raw cat food. Feline nutrition experts.',
    created_at: '2024-03-10T10:00:00Z',
  },
  {
    id: '9',
    place_id: 'ChIJFU0_tPnU54gRfWFp8VCwmFQ',
    business_name: 'Denver Mountain Raw',
    address: '7788 Colfax Ave',
    city: 'Denver',
    state: 'CO',
    country: 'USA',
    latitude: 39.7392,
    longitude: -104.9903,
    phone: '+1-303-555-0909',
    website: 'https://denvermountainraw.com',
    rating: 4.6,
    user_ratings_total: 143,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'High-altitude raw feeding specialists. Fresh Colorado ingredients.',
    created_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '10',
    place_id: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
    business_name: 'Boston Raw Nutrition',
    address: '9900 Boylston Street',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    latitude: 42.3601,
    longitude: -71.0589,
    phone: '+1-617-555-1010',
    website: 'https://bostonrawnutrition.com',
    rating: 4.9,
    user_ratings_total: 298,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'New England\'s premier raw pet food supplier. Est. 2010.',
    created_at: '2024-03-20T10:00:00Z',
  },
  {
    id: '11',
    place_id: 'ChIJgUbEo8cfqokR5lP9_Wh_DaM',
    business_name: 'Philadelphia Raw Pet',
    address: '1234 Market Street',
    city: 'Philadelphia',
    state: 'PA',
    country: 'USA',
    latitude: 39.9526,
    longitude: -75.1652,
    phone: '+1-215-555-1111',
    website: 'https://phillyrawpet.com',
    rating: 4.5,
    user_ratings_total: 134,
    species: 'dogs',
    delivery: false,
    pickup: true,
    description: 'Locally sourced raw dog food. Historic Philly location.',
    created_at: '2024-04-01T10:00:00Z',
  },
  {
    id: '12',
    place_id: 'ChIJVTPokywQkFQRmtVu6lwdJ00',
    business_name: 'Phoenix Desert Raw',
    address: '5678 Central Ave',
    city: 'Phoenix',
    state: 'AZ',
    country: 'USA',
    latitude: 33.4484,
    longitude: -112.0740,
    phone: '+1-602-555-1212',
    website: 'https://phoenixdesertraw.com',
    rating: 4.7,
    user_ratings_total: 178,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Arizona raw pet food specialists. Climate-controlled storage.',
    created_at: '2024-04-05T10:00:00Z',
  },
  {
    id: '13',
    place_id: 'ChIJE1pO76Bz54gRgexmAGKBQdM',
    business_name: 'Atlanta Fresh Raw',
    address: '2468 Peachtree St',
    city: 'Atlanta',
    state: 'GA',
    country: 'USA',
    latitude: 33.7490,
    longitude: -84.3880,
    phone: '+1-404-555-1313',
    website: 'https://atlantafreshraw.com',
    rating: 4.8,
    user_ratings_total: 223,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Southern raw food specialists. Same-day delivery available.',
    created_at: '2024-04-10T10:00:00Z',
  },
  {
    id: '14',
    place_id: 'ChIJLwPMoJm1RIYRetVp1EtGm10',
    business_name: 'Dallas Raw Provisions',
    address: '1357 Elm Street',
    city: 'Dallas',
    state: 'TX',
    country: 'USA',
    latitude: 32.7767,
    longitude: -96.7970,
    phone: '+1-214-555-1414',
    website: 'https://dallasrawprovisions.com',
    rating: 4.6,
    user_ratings_total: 165,
    species: 'dogs',
    delivery: true,
    pickup: true,
    description: 'Texas-sized portions of raw dog food. Bulk ordering available.',
    created_at: '2024-04-15T10:00:00Z',
  },
  {
    id: '15',
    place_id: 'ChIJdRkN4k5HT4YRaF9M8bJ_6nI',
    business_name: 'Houston Natural Raw',
    address: '9876 Westheimer Rd',
    city: 'Houston',
    state: 'TX',
    country: 'USA',
    latitude: 29.7604,
    longitude: -95.3698,
    phone: '+1-713-555-1515',
    website: 'https://houstonnaturalraw.com',
    rating: 4.7,
    user_ratings_total: 192,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Gulf Coast raw pet food supplier. Fresh seafood options.',
    created_at: '2024-04-20T10:00:00Z',
  },
  {
    id: '16',
    place_id: 'ChIJSTKnV2mAhYARb-jVfFXfvAw',
    business_name: 'San Diego Raw Meals',
    address: '4567 Pacific Highway',
    city: 'San Diego',
    state: 'CA',
    country: 'USA',
    latitude: 32.7157,
    longitude: -117.1611,
    phone: '+1-619-555-1616',
    website: 'https://sandiegorawmeals.com',
    rating: 4.8,
    user_ratings_total: 234,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Coastal California raw feeding experts. Ocean-fresh ingredients.',
    created_at: '2024-05-01T10:00:00Z',
  },
  {
    id: '17',
    place_id: 'ChIJrTLr-GyuEmsRBfy61i59si0',
    business_name: 'Nashville Raw & Natural',
    address: '8901 Music Valley Dr',
    city: 'Nashville',
    state: 'TN',
    country: 'USA',
    latitude: 36.1627,
    longitude: -86.7816,
    phone: '+1-615-555-1717',
    website: 'https://nashvillerawnatural.com',
    rating: 4.6,
    user_ratings_total: 145,
    species: 'dogs',
    delivery: true,
    pickup: false,
    description: 'Tennessee farm-sourced raw dog food. Locally raised meats.',
    created_at: '2024-05-05T10:00:00Z',
  },
  {
    id: '18',
    place_id: 'ChIJrRMTi0W2t4kRmC0fL7CPdP8',
    business_name: 'Detroit Raw Supply',
    address: '2345 Woodward Ave',
    city: 'Detroit',
    state: 'MI',
    country: 'USA',
    latitude: 42.3314,
    longitude: -83.0458,
    phone: '+1-313-555-1818',
    website: 'https://detroitrawsupply.com',
    rating: 4.5,
    user_ratings_total: 118,
    species: 'both',
    delivery: false,
    pickup: true,
    description: 'Michigan raw pet food specialists. Great Lakes region supplier.',
    created_at: '2024-05-10T10:00:00Z',
  },
  {
    id: '19',
    place_id: 'ChIJ5SZe5JpwK4cRYmwh8ZvT5B8',
    business_name: 'Minneapolis Raw Nutrition',
    address: '6789 Hennepin Ave',
    city: 'Minneapolis',
    state: 'MN',
    country: 'USA',
    latitude: 44.9778,
    longitude: -93.2650,
    phone: '+1-612-555-1919',
    website: 'https://minneapolisrawnutrition.com',
    rating: 4.9,
    user_ratings_total: 287,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Twin Cities raw feeding leaders. Free nutrition consultations.',
    created_at: '2024-05-15T10:00:00Z',
  },
  {
    id: '20',
    place_id: 'ChIJgdL4flSKrYcRnTpP0XQSojA',
    business_name: 'Las Vegas Raw Pet Co',
    address: '4321 Las Vegas Blvd',
    city: 'Las Vegas',
    state: 'NV',
    country: 'USA',
    latitude: 36.1699,
    longitude: -115.1398,
    phone: '+1-702-555-2020',
    website: 'https://lasvegasrawpet.com',
    rating: 4.7,
    user_ratings_total: 198,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Nevada desert raw feeding specialists. Climate-controlled facility.',
    created_at: '2024-05-20T10:00:00Z',
  },
  {
    id: '21',
    place_id: 'ChIJzxcfI6qAhYARcV_j3KSLxqk',
    business_name: 'Sacramento Valley Raw',
    address: '7890 Capitol Mall',
    city: 'Sacramento',
    state: 'CA',
    country: 'USA',
    latitude: 38.5816,
    longitude: -121.4944,
    phone: '+1-916-555-2121',
    website: 'https://sacramentovalleyraw.com',
    rating: 4.6,
    user_ratings_total: 172,
    species: 'cats',
    delivery: true,
    pickup: true,
    description: 'Central California feline raw food experts. Cat-only focus.',
    created_at: '2024-05-25T10:00:00Z',
  },
  {
    id: '22',
    place_id: 'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
    business_name: 'Salt Lake Raw Foods',
    address: '3456 State Street',
    city: 'Salt Lake City',
    state: 'UT',
    country: 'USA',
    latitude: 40.7608,
    longitude: -111.8910,
    phone: '+1-801-555-2222',
    website: 'https://saltlakerawfoods.com',
    rating: 4.8,
    user_ratings_total: 211,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Utah mountain region raw pet food. Grass-fed local meats.',
    created_at: '2024-06-01T10:00:00Z',
  },
  {
    id: '23',
    place_id: 'ChIJM2LN0jWnD4gR8ksqczqJqF4',
    business_name: 'Tampa Bay Raw',
    address: '8901 Dale Mabry Hwy',
    city: 'Tampa',
    state: 'FL',
    country: 'USA',
    latitude: 27.9506,
    longitude: -82.4572,
    phone: '+1-813-555-2323',
    website: 'https://tampabayraw.com',
    rating: 4.9,
    user_ratings_total: 305,
    species: 'both',
    delivery: true,
    pickup: true,
    description: 'Florida Gulf Coast raw feeding specialists. Same-day local delivery.',
    created_at: '2024-06-05T10:00:00Z',
  },
];

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Search suppliers by text query
 */
export function searchSuppliers(query: string): Supplier[] {
  if (!query || query.trim().length === 0) {
    return suppliers;
  }

  const searchTerm = query.toLowerCase().trim();

  return suppliers.filter(supplier => {
    return (
      supplier.business_name.toLowerCase().includes(searchTerm) ||
      supplier.address.toLowerCase().includes(searchTerm) ||
      supplier.city.toLowerCase().includes(searchTerm) ||
      supplier.state.toLowerCase().includes(searchTerm) ||
      supplier.description?.toLowerCase().includes(searchTerm)
    );
  });
}

/**
 * Find suppliers within a radius of a location
 */
export function findNearbySuppliers(
  latitude: number,
  longitude: number,
  radiusKm: number = 50,
  species?: 'dogs' | 'cats' | 'both'
): Array<Supplier & { distance: number }> {
  let results = suppliers.map(supplier => ({
    ...supplier,
    distance: calculateDistance(latitude, longitude, supplier.latitude, supplier.longitude),
  }));

  // Filter by radius
  results = results.filter(supplier => supplier.distance <= radiusKm);

  // Filter by species if specified
  if (species) {
    results = results.filter(
      supplier => supplier.species === species || supplier.species === 'both'
    );
  }

  // Sort by distance (nearest first)
  results.sort((a, b) => a.distance - b.distance);

  return results;
}
