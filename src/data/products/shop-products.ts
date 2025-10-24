export type ProductCategory =
  | 'joint-mobility'
  | 'digestive-health'
  | 'skin-coat'
  | 'immune-support'
  | 'calming-anxiety'
  | 'multivitamin'
  | 'specialty';

export type Species = 'dog' | 'cat' | 'both';

export interface SizeOption {
  size: string;
  servings: number;
  priceModifier?: number;
}

export interface SupplementProduct {
  id: string;
  name: string;
  category: ProductCategory;
  species: Species;
  price: number;
  compareAtPrice?: number;
  description: string;
  benefits: string[];
  ingredients: string[];
  dosageInstructions: string;
  sizeOptions: SizeOption[];
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  tags: string[];
  reviews: {
    rating: number;
    count: number;
  };
}

export const shopProducts: SupplementProduct[] = [
  {
    id: 'omega3-fish-oil-1',
    name: 'Wild Alaskan Salmon Oil',
    category: 'skin-coat',
    species: 'both',
    price: 29.99,
    compareAtPrice: 39.99,
    description: 'Premium omega-3 fatty acids from wild-caught Alaskan salmon to support healthy skin, shiny coat, and overall wellness for dogs and cats.',
    benefits: [
      'Promotes healthy skin and shiny coat',
      'Supports joint mobility and flexibility',
      'Boosts immune system function',
      'Supports heart and brain health',
      'Rich in EPA and DHA omega-3s'
    ],
    ingredients: [
      'Wild Alaskan Salmon Oil',
      'Natural Vitamin E (preservative)',
      'Rosemary Extract'
    ],
    dosageInstructions: 'For dogs: 1 pump per 20 lbs of body weight daily. For cats: 1 pump daily. Mix with food or administer directly.',
    sizeOptions: [
      { size: '8 oz', servings: 48, priceModifier: 0 },
      { size: '16 oz', servings: 96, priceModifier: 10 },
      { size: '32 oz', servings: 192, priceModifier: 18 }
    ],
    stockQuantity: 45,
    inStock: true,
    featured: true,
    tags: ['omega-3', 'fish-oil', 'wild-caught', 'skin-health', 'coat-health'],
    reviews: {
      rating: 4.8,
      count: 234
    }
  },
  {
    id: 'probiotic-1',
    name: 'Advanced Probiotic Powder',
    category: 'digestive-health',
    species: 'both',
    price: 34.99,
    compareAtPrice: 44.99,
    description: 'Multi-strain probiotic formula with 5 billion CFUs to support digestive health and immune function in dogs and cats.',
    benefits: [
      'Supports healthy digestion',
      'Reduces gas and bloating',
      'Strengthens immune system',
      'Improves nutrient absorption',
      'Helps maintain healthy gut flora'
    ],
    ingredients: [
      'Lactobacillus acidophilus',
      'Bifidobacterium animalis',
      'Lactobacillus casei',
      'Enterococcus faecium',
      'Prebiotic Fiber (Inulin)'
    ],
    dosageInstructions: 'Small pets (under 20 lbs): 1/4 scoop daily. Medium pets (20-50 lbs): 1/2 scoop daily. Large pets (over 50 lbs): 1 scoop daily. Mix with food.',
    sizeOptions: [
      { size: '4 oz', servings: 60, priceModifier: 0 },
      { size: '8 oz', servings: 120, priceModifier: 12 }
    ],
    stockQuantity: 32,
    inStock: true,
    featured: false,
    tags: ['probiotics', 'digestive', 'gut-health', '5-billion-cfu'],
    reviews: {
      rating: 4.6,
      count: 178
    }
  },
  {
    id: 'glucosamine-1',
    name: 'Glucosamine & Chondroitin Complex',
    category: 'joint-mobility',
    species: 'dog',
    price: 39.99,
    description: 'Advanced joint support formula with glucosamine, chondroitin, and MSM to promote healthy joints, mobility, and flexibility in dogs.',
    benefits: [
      'Supports joint health and mobility',
      'Reduces inflammation and discomfort',
      'Promotes cartilage repair',
      'Improves flexibility and range of motion',
      'Contains MSM for additional joint support'
    ],
    ingredients: [
      'Glucosamine HCl (1500mg)',
      'Chondroitin Sulfate (1200mg)',
      'MSM (Methylsulfonylmethane)',
      'Hyaluronic Acid',
      'Turmeric Extract'
    ],
    dosageInstructions: 'Small dogs (under 25 lbs): 1 tablet daily. Medium dogs (25-75 lbs): 2 tablets daily. Large dogs (over 75 lbs): 3 tablets daily. Can be given with food.',
    sizeOptions: [
      { size: '60 tablets', servings: 60, priceModifier: 0 },
      { size: '120 tablets', servings: 120, priceModifier: 15 },
      { size: '240 tablets', servings: 240, priceModifier: 25 }
    ],
    stockQuantity: 18,
    inStock: true,
    featured: true,
    tags: ['joint-support', 'glucosamine', 'chondroitin', 'msm', 'mobility'],
    reviews: {
      rating: 4.7,
      count: 312
    }
  }
];

export function getProductById(id: string): SupplementProduct | undefined {
  return shopProducts.find(p => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): SupplementProduct[] {
  return shopProducts.filter(p => p.category === category);
}

export function getAllProducts(): SupplementProduct[] {
  return shopProducts;
}
