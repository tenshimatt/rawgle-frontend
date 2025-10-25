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
  },
  {
    id: 'calming-soft-chews',
    name: 'Calming Soft Chews for Dogs',
    category: 'calming-anxiety',
    species: 'dog',
    price: 26.99,
    compareAtPrice: 34.99,
    description: 'Natural calming supplement with chamomile, valerian root, and L-tryptophan to help reduce anxiety, stress, and hyperactivity in dogs.',
    benefits: [
      'Reduces anxiety and stress naturally',
      'Helps with separation anxiety',
      'Calms hyperactive behavior',
      'Supports relaxation during storms and fireworks',
      'Non-drowsy formula'
    ],
    ingredients: [
      'Chamomile Flower Extract',
      'Valerian Root Powder',
      'L-Tryptophan',
      'Passionflower Extract',
      'Organic Hemp Seed Powder',
      'Thiamine (Vitamin B1)'
    ],
    dosageInstructions: 'Small dogs (under 25 lbs): 1 chew daily. Medium dogs (25-75 lbs): 2 chews daily. Large dogs (over 75 lbs): 3 chews daily. Can be given 30 minutes before stressful event.',
    sizeOptions: [
      { size: '60 chews', servings: 60, priceModifier: 0 },
      { size: '120 chews', servings: 120, priceModifier: 12 }
    ],
    stockQuantity: 38,
    inStock: true,
    featured: false,
    tags: ['calming', 'anxiety', 'stress-relief', 'natural', 'soft-chews'],
    reviews: {
      rating: 4.5,
      count: 189
    }
  },
  {
    id: 'multivitamin-powder',
    name: 'Complete Daily Multivitamin Powder',
    category: 'multivitamin',
    species: 'both',
    price: 32.99,
    description: 'Comprehensive multivitamin and mineral supplement designed for dogs and cats on raw diets, ensuring balanced nutrition every day.',
    benefits: [
      'Fills nutritional gaps in raw diets',
      'Supports overall health and vitality',
      'Boosts immune system function',
      'Promotes healthy metabolism',
      '25+ essential vitamins and minerals'
    ],
    ingredients: [
      'Vitamin A, C, D3, E, K',
      'B-Complex Vitamins',
      'Calcium Citrate',
      'Zinc Gluconate',
      'Selenium',
      'Manganese',
      'Taurine (for cats)',
      'Spirulina'
    ],
    dosageInstructions: 'Small pets (under 20 lbs): 1/2 scoop daily. Medium pets (20-50 lbs): 1 scoop daily. Large pets (over 50 lbs): 2 scoops daily. Mix with food.',
    sizeOptions: [
      { size: '6 oz', servings: 90, priceModifier: 0 },
      { size: '12 oz', servings: 180, priceModifier: 14 }
    ],
    stockQuantity: 42,
    inStock: true,
    featured: true,
    tags: ['multivitamin', 'complete-nutrition', 'raw-diet', 'vitamins', 'minerals'],
    reviews: {
      rating: 4.8,
      count: 267
    }
  },
  {
    id: 'immune-support-chews',
    name: 'Immune Support Chews',
    category: 'immune-support',
    species: 'both',
    price: 28.99,
    compareAtPrice: 36.99,
    description: 'Powerful immune-boosting supplement with mushroom blend, colostrum, and antioxidants to support your pet\'s natural defenses.',
    benefits: [
      'Strengthens immune system',
      'Rich in antioxidants',
      'Supports seasonal allergies',
      'Promotes healthy gut flora',
      'Contains medicinal mushrooms'
    ],
    ingredients: [
      'Turkey Tail Mushroom',
      'Reishi Mushroom',
      'Shiitake Mushroom',
      'Bovine Colostrum',
      'Vitamin C (from Acerola Cherry)',
      'Astragalus Root',
      'Turmeric Extract'
    ],
    dosageInstructions: 'Small pets (under 25 lbs): 1 chew daily. Medium pets (25-60 lbs): 2 chews daily. Large pets (over 60 lbs): 3 chews daily. Give with food.',
    sizeOptions: [
      { size: '60 chews', servings: 60, priceModifier: 0 },
      { size: '120 chews', servings: 120, priceModifier: 13 }
    ],
    stockQuantity: 29,
    inStock: true,
    featured: false,
    tags: ['immune-support', 'mushrooms', 'antioxidants', 'colostrum', 'wellness'],
    reviews: {
      rating: 4.6,
      count: 142
    }
  },
  {
    id: 'digestive-enzymes',
    name: 'Digestive Enzyme Complex',
    category: 'digestive-health',
    species: 'both',
    price: 29.99,
    description: 'Comprehensive digestive enzyme blend to support optimal digestion and nutrient absorption for pets transitioning to or maintaining raw diets.',
    benefits: [
      'Improves nutrient absorption',
      'Reduces digestive upset',
      'Supports pancreatic health',
      'Helps break down proteins and fats',
      'Reduces gas and bloating'
    ],
    ingredients: [
      'Protease (protein digestion)',
      'Lipase (fat digestion)',
      'Amylase (carbohydrate digestion)',
      'Cellulase',
      'Papain (from papaya)',
      'Bromelain (from pineapple)',
      'Ox Bile Extract'
    ],
    dosageInstructions: 'Small pets (under 20 lbs): 1/4 scoop per meal. Medium pets (20-50 lbs): 1/2 scoop per meal. Large pets (over 50 lbs): 1 scoop per meal. Sprinkle on food.',
    sizeOptions: [
      { size: '4 oz', servings: 64, priceModifier: 0 },
      { size: '8 oz', servings: 128, priceModifier: 11 }
    ],
    stockQuantity: 35,
    inStock: true,
    featured: false,
    tags: ['digestive-enzymes', 'digestion', 'enzyme-blend', 'raw-feeding'],
    reviews: {
      rating: 4.7,
      count: 198
    }
  },
  {
    id: 'hip-joint-mobility',
    name: 'Hip & Joint Mobility Formula',
    category: 'joint-mobility',
    species: 'dog',
    price: 44.99,
    compareAtPrice: 54.99,
    description: 'Advanced hip and joint support formula with green-lipped mussel, glucosamine, and organic turmeric for senior dogs and active breeds.',
    benefits: [
      'Supports hip and joint health',
      'Reduces inflammation naturally',
      'Improves mobility and flexibility',
      'Contains green-lipped mussel (natural source of omega-3s)',
      'Ideal for senior dogs and large breeds'
    ],
    ingredients: [
      'Green-Lipped Mussel Powder',
      'Glucosamine Sulfate',
      'Chondroitin Sulfate',
      'Organic Turmeric Root',
      'Boswellia Serrata Extract',
      'Hyaluronic Acid',
      'MSM',
      'Vitamin C'
    ],
    dosageInstructions: 'Small dogs (under 30 lbs): 1 scoop daily. Medium dogs (30-60 lbs): 2 scoops daily. Large dogs (60-100 lbs): 3 scoops daily. Giant breeds (over 100 lbs): 4 scoops daily. Mix with food.',
    sizeOptions: [
      { size: '8 oz', servings: 60, priceModifier: 0 },
      { size: '16 oz', servings: 120, priceModifier: 18 },
      { size: '32 oz', servings: 240, priceModifier: 30 }
    ],
    stockQuantity: 22,
    inStock: true,
    featured: true,
    tags: ['hip-joint', 'mobility', 'senior-dogs', 'green-lipped-mussel', 'turmeric'],
    reviews: {
      rating: 4.9,
      count: 421
    }
  },
  {
    id: 'dental-care-powder',
    name: 'Dental Care Powder',
    category: 'specialty',
    species: 'both',
    price: 23.99,
    description: 'Natural dental care powder with kelp, probiotics, and enzymes to support fresh breath, healthy gums, and reduce plaque buildup.',
    benefits: [
      'Freshens breath naturally',
      'Reduces plaque and tartar',
      'Supports healthy gums',
      'Contains beneficial probiotics',
      'Easy to add to meals'
    ],
    ingredients: [
      'Ascophyllum Nodosum (Kelp)',
      'Probiotics (Lactobacillus)',
      'Enzymes (Amylase, Protease)',
      'Parsley Leaf',
      'Peppermint Leaf',
      'Cinnamon Powder'
    ],
    dosageInstructions: 'Cats and small dogs (under 15 lbs): 1/4 teaspoon daily. Medium dogs (15-50 lbs): 1/2 teaspoon daily. Large dogs (over 50 lbs): 1 teaspoon daily. Sprinkle on food.',
    sizeOptions: [
      { size: '3 oz', servings: 90, priceModifier: 0 },
      { size: '6 oz', servings: 180, priceModifier: 8 }
    ],
    stockQuantity: 51,
    inStock: true,
    featured: false,
    tags: ['dental-care', 'fresh-breath', 'plaque', 'kelp', 'oral-health'],
    reviews: {
      rating: 4.4,
      count: 156
    }
  },
  {
    id: 'biotin-skin-coat',
    name: 'Biotin Skin & Coat Supplement',
    category: 'skin-coat',
    species: 'both',
    price: 27.99,
    description: 'High-potency biotin supplement with zinc and omega fatty acids to promote healthy skin, shiny coat, and strong nails.',
    benefits: [
      'Promotes healthy, shiny coat',
      'Reduces excessive shedding',
      'Supports skin health',
      'Strengthens nails and paw pads',
      'Contains high-dose biotin'
    ],
    ingredients: [
      'Biotin (10mg per serving)',
      'Zinc Amino Acid Chelate',
      'Omega-3 Fatty Acids',
      'Omega-6 Fatty Acids',
      'Vitamin E',
      'Flaxseed Powder',
      'Brewer\'s Yeast'
    ],
    dosageInstructions: 'Small pets (under 20 lbs): 1/2 tablet daily. Medium pets (20-50 lbs): 1 tablet daily. Large pets (over 50 lbs): 2 tablets daily. Can be given with food.',
    sizeOptions: [
      { size: '90 tablets', servings: 90, priceModifier: 0 },
      { size: '180 tablets', servings: 180, priceModifier: 12 }
    ],
    stockQuantity: 44,
    inStock: true,
    featured: false,
    tags: ['biotin', 'skin-health', 'coat-health', 'shedding', 'omega-fatty-acids'],
    reviews: {
      rating: 4.6,
      count: 203
    }
  },
  {
    id: 'liver-detox-support',
    name: 'Liver Detox Support',
    category: 'specialty',
    species: 'both',
    price: 36.99,
    description: 'Advanced liver support formula with milk thistle, SAMe, and antioxidants to promote healthy liver function and detoxification.',
    benefits: [
      'Supports healthy liver function',
      'Aids in detoxification',
      'Protects liver cells',
      'Supports dogs on medications',
      'Contains milk thistle (silymarin)'
    ],
    ingredients: [
      'Milk Thistle Extract (80% Silymarin)',
      'SAMe (S-Adenosyl Methionine)',
      'N-Acetyl Cysteine',
      'Alpha Lipoic Acid',
      'Dandelion Root',
      'Burdock Root',
      'Vitamin E'
    ],
    dosageInstructions: 'Small pets (under 25 lbs): 1 capsule daily. Medium pets (25-60 lbs): 2 capsules daily. Large pets (over 60 lbs): 3 capsules daily. Give with food.',
    sizeOptions: [
      { size: '60 capsules', servings: 60, priceModifier: 0 },
      { size: '120 capsules', servings: 120, priceModifier: 16 }
    ],
    stockQuantity: 18,
    inStock: true,
    featured: false,
    tags: ['liver-support', 'detox', 'milk-thistle', 'SAMe', 'organ-health'],
    reviews: {
      rating: 4.8,
      count: 178
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
