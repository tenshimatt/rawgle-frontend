/**
 * Mock Data for Rawgle Frontend
 * Used for UI development before backend integration
 */

export interface MockSupplier {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  distance: number;
  lat: number;
  lng: number;
  description?: string;
}

export interface MockPet {
  id: string;
  name: string;
  species: 'Dog' | 'Cat';
  breed: string;
  age: number;
  weight: number;
  photo: string;
  healthStatus: string;
  feedingSchedule: string[];
}

export interface MockFeedingLog {
  id: string;
  petId: string;
  date: string;
  time: string;
  foodType: string;
  proteinSource: string;
  amount: string;
  appetiteRating: number;
  energyLevel: number;
  stoolQuality: string;
  digestionNotes: string;
}

// Top 5 closest suppliers (based on screenshots)
export const mockSuppliers: MockSupplier[] = [
  {
    id: '1',
    name: 'Pet Station - Raw Pet Food Supplier',
    rating: 4.9,
    reviews: 104,
    address: 'unit 1, Dominion Business Centre',
    city: 'Cardiff',
    state: 'Wales',
    zip: 'CF24 1PT',
    phone: '029 2049 0249',
    website: 'https://petstationcardiff.com',
    distance: 160.3,
    lat: 51.4816,
    lng: -3.1791,
    description: 'Premium raw pet food supplier in Cardiff. We offer a wide range of BARF diets, raw meaty bones, and natural supplements for dogs and cats.'
  },
  {
    id: '2',
    name: 'Raw Pet Foods',
    rating: 5.0,
    reviews: 55,
    address: 'Jesses Farm, Wanden Ln, Egerton Forstal',
    city: 'Ashford',
    state: 'Kent',
    zip: 'TN27 9DB',
    phone: '01233 756406',
    website: 'https://rawpetfoods.co.uk',
    distance: 186.2,
    lat: 51.1789,
    lng: 0.7644,
    description: 'Family-run raw pet food business. Locally sourced, ethically raised meat. Delivery available across the UK.'
  },
  {
    id: '3',
    name: 'Natural Pet Food Company',
    rating: 4.8,
    reviews: 89,
    address: '45 High Street',
    city: 'Bristol',
    state: 'England',
    zip: 'BS1 2LR',
    phone: '0117 925 8000',
    website: 'https://naturalpetfood.co.uk',
    distance: 195.7,
    lat: 51.4545,
    lng: -2.5879,
    description: 'Specializing in organic, raw pet nutrition. Wide selection of proteins including venison, rabbit, and fish.'
  },
  {
    id: '4',
    name: 'Bella & Duke',
    rating: 4.7,
    reviews: 212,
    address: '12 Industrial Estate',
    city: 'Birmingham',
    state: 'England',
    zip: 'B12 0AJ',
    phone: '0121 456 7890',
    website: 'https://bellaandduke.com',
    distance: 210.5,
    lat: 52.4862,
    lng: -1.8904,
    description: 'One of the UK\'s leading raw pet food providers. Subscription service available with personalized meal plans.'
  },
  {
    id: '5',
    name: 'Paleo Ridge',
    rating: 4.9,
    reviews: 156,
    address: '3 The Meadows, Waterberry Drive',
    city: 'Waterlooville',
    state: 'Hampshire',
    zip: 'PO7 7XX',
    phone: '023 9226 3800',
    website: 'https://paleoridge.co.uk',
    distance: 225.0,
    lat: 50.8805,
    lng: -1.0301,
    description: 'Premium raw dog food manufacturer. All meat is human-grade and sourced from trusted British farms.'
  }
];

// Mock pets
export const mockPets: MockPet[] = [
  {
    id: '1',
    name: 'Max',
    species: 'Dog',
    breed: 'Labrador Retriever',
    age: 3,
    weight: 30,
    photo: '/images/pets/max.jpg',
    healthStatus: 'Healthy',
    feedingSchedule: ['08:00 AM', '06:00 PM']
  },
  {
    id: '2',
    name: 'Luna',
    species: 'Cat',
    breed: 'British Shorthair',
    age: 2,
    weight: 4.5,
    photo: '/images/pets/luna.jpg',
    healthStatus: 'Healthy',
    feedingSchedule: ['07:00 AM', '07:00 PM']
  }
];

// Mock feeding logs
export const mockFeedingLogs: MockFeedingLog[] = [
  {
    id: '1',
    petId: '1',
    date: '2025-10-20',
    time: '08:00 AM',
    foodType: 'Raw chicken',
    proteinSource: 'Chicken',
    amount: '500g',
    appetiteRating: 5,
    energyLevel: 4,
    stoolQuality: 'Normal',
    digestionNotes: 'No issues observed'
  },
  {
    id: '2',
    petId: '1',
    date: '2025-10-19',
    time: '06:00 PM',
    foodType: 'Raw beef',
    proteinSource: 'Beef',
    amount: '450g',
    appetiteRating: 4,
    energyLevel: 5,
    stoolQuality: 'Firm',
    digestionNotes: 'Excellent'
  }
];

// Mock AI responses for chat
export const mockAIResponses = {
  'calculate portions': 'Based on your pet\'s weight and activity level, I recommend feeding 500-600g of raw food per day, split into two meals. This should be approximately 2-3% of their body weight.',
  'food safety': 'Always handle raw pet food with care. Wash hands thoroughly, clean surfaces, and store food at -18°C or below. Thaw in the refrigerator, never at room temperature.',
  'nutrition balance': 'A balanced raw diet should include 80% muscle meat, 10% bone, 5% liver, and 5% other organs. Add vegetables and supplements as needed for complete nutrition.',
  'transition': 'Transition to raw feeding gradually over 7-10 days. Start with 25% raw food mixed with current food, increasing by 25% every 2-3 days while monitoring digestion.',
  default: 'I\'m here to help with raw pet nutrition! Ask me about portion sizes, food safety, ingredient analysis, or meal planning.'
};

// Mock community posts
export const mockCommunityPosts = [
  {
    id: '1',
    author: 'SarahM',
    avatar: '/images/avatars/sarah.jpg',
    title: 'Best way to transition puppies to raw food?',
    content: 'I have a 3-month-old Labrador puppy. What\'s the safest way to start raw feeding?',
    replies: 12,
    likes: 34,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    author: 'JohnD',
    avatar: '/images/avatars/john.jpg',
    title: 'Amazing results after 6 months on raw!',
    content: 'My dog\'s coat is shinier, energy levels are up, and digestion is perfect. Raw feeding really works!',
    replies: 28,
    likes: 156,
    timestamp: '1 day ago'
  }
];

// Mock shop products
export const mockProducts = [
  {
    id: '1',
    name: 'Omega-3 Fish Oil Supplement',
    price: 24.99,
    image: '/images/products/fish-oil.jpg',
    rating: 4.8,
    reviews: 245,
    description: 'Premium fish oil supplement for dogs and cats'
  },
  {
    id: '2',
    name: 'Probiotic Powder',
    price: 19.99,
    image: '/images/products/probiotic.jpg',
    rating: 4.9,
    reviews: 189,
    description: 'Digestive health support for raw fed pets'
  }
];
