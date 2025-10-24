export type SupplementCategory = 'vitamins' | 'minerals' | 'digestive' | 'joint' | 'omega' | 'probiotics' | 'specialty';
export type PetSpecies = 'dog' | 'cat' | 'both';

export interface Supplement {
  id: string;
  name: string;
  brand: string;
  category: SupplementCategory;
  price: number;
  size: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  dosage: {
    dogs: string;
    cats: string;
  };
  forSpecies: PetSpecies[];
  inStock: boolean;
  rating: number;
  reviews: number;
  imageUrl?: string;
  featured: boolean;
}

export const supplements: Supplement[] = [
  // Omega-3 Supplements
  {
    id: 'omega3-fish-oil-1',
    name: 'Wild Alaskan Salmon Oil',
    brand: 'PawPurity',
    category: 'omega',
    price: 24.99,
    size: '16 oz',
    description: 'Premium wild-caught Alaskan salmon oil rich in Omega-3 fatty acids (EPA & DHA). Supports skin, coat, joint, and heart health.',
    benefits: [
      'Promotes healthy skin and shiny coat',
      'Supports joint mobility and flexibility',
      'Boosts immune system function',
      'Supports cardiovascular health',
      'Anti-inflammatory properties',
      'Supports brain development in puppies/kittens'
    ],
    ingredients: ['100% Wild Alaskan Salmon Oil', 'Natural Vitamin E (preservative)'],
    dosage: {
      dogs: '1 tsp per 20 lbs body weight daily',
      cats: '1/2 tsp daily'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.8,
    reviews: 342,
    featured: true
  },
  {
    id: 'omega3-krill-oil-1',
    name: 'Antarctic Krill Oil',
    brand: 'VitalPet',
    category: 'omega',
    price: 32.99,
    size: '8 oz',
    description: 'Sustainably sourced Antarctic krill oil with superior absorption. Contains astaxanthin for additional antioxidant support.',
    benefits: [
      'Higher bioavailability than fish oil',
      'Natural astaxanthin antioxidant',
      'Supports cognitive function',
      'Promotes healthy inflammatory response',
      'Supports skin and coat health'
    ],
    ingredients: ['Antarctic Krill Oil', 'Mixed Tocopherols (Vitamin E)'],
    dosage: {
      dogs: '1/2 tsp per 25 lbs body weight daily',
      cats: '1/4 tsp daily'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.7,
    reviews: 189,
    featured: false
  },

  // Probiotics
  {
    id: 'probiotic-1',
    name: 'Advanced Probiotic Powder',
    brand: 'RawLife',
    category: 'probiotics',
    price: 28.99,
    size: '4 oz (60 servings)',
    description: 'Multi-strain probiotic blend with 5 billion CFU per serving. Supports digestive health and immune function.',
    benefits: [
      'Supports healthy gut flora',
      'Aids digestion and nutrient absorption',
      'Strengthens immune system',
      'Reduces digestive upset',
      'Supports transition to raw diet',
      'Helps with food sensitivities'
    ],
    ingredients: [
      'Lactobacillus acidophilus',
      'Bifidobacterium animalis',
      'Lactobacillus casei',
      'Lactobacillus plantarum',
      'Bacillus coagulans',
      'Inulin (prebiotic fiber)'
    ],
    dosage: {
      dogs: '1/2 tsp daily, mixed with food',
      cats: '1/4 tsp daily, mixed with food'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.9,
    reviews: 521,
    featured: true
  },

  // Digestive Enzymes
  {
    id: 'digestive-enzyme-1',
    name: 'Raw Digestive Enzyme Complex',
    brand: 'EnzymeBoost',
    category: 'digestive',
    price: 26.99,
    size: '120 capsules',
    description: 'Plant-based digestive enzyme blend to support raw food digestion and nutrient absorption.',
    benefits: [
      'Supports protein, fat, and carb digestion',
      'Reduces digestive discomfort',
      'Enhances nutrient bioavailability',
      'Supports pancreatic health',
      'Ideal for senior pets'
    ],
    ingredients: [
      'Protease',
      'Amylase',
      'Lipase',
      'Cellulase',
      'Bromelain',
      'Papain'
    ],
    dosage: {
      dogs: '1 capsule per 25 lbs with each meal',
      cats: '1/2 capsule with each meal'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.6,
    reviews: 267,
    featured: false
  },

  // Joint Support
  {
    id: 'joint-support-1',
    name: 'Joint Support Plus',
    brand: 'FlexiPaws',
    category: 'joint',
    price: 34.99,
    size: '90 chewable tablets',
    description: 'Comprehensive joint support formula with glucosamine, chondroitin, MSM, and turmeric.',
    benefits: [
      'Supports joint health and mobility',
      'Reduces inflammation',
      'Promotes cartilage repair',
      'Improves flexibility',
      'Ideal for active and senior pets'
    ],
    ingredients: [
      'Glucosamine HCl (1000mg)',
      'Chondroitin Sulfate (800mg)',
      'MSM (500mg)',
      'Turmeric Extract (200mg)',
      'Boswellia Extract (100mg)',
      'Hyaluronic Acid (50mg)'
    ],
    dosage: {
      dogs: '1 tablet per 25 lbs daily',
      cats: '1/2 tablet daily'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.8,
    reviews: 412,
    featured: true
  },

  // Vitamins
  {
    id: 'vitamin-e-1',
    name: 'Natural Vitamin E',
    brand: 'PureVit',
    category: 'vitamins',
    price: 18.99,
    size: '100 softgels',
    description: 'Natural mixed tocopherols vitamin E. Essential antioxidant for raw-fed pets consuming fresh fats.',
    benefits: [
      'Protects fatty acids from oxidation',
      'Supports immune system',
      'Promotes healthy skin',
      'Essential for raw diet feeding',
      'Cardiovascular support'
    ],
    ingredients: ['Mixed Tocopherols (400 IU)', 'Organic Sunflower Oil'],
    dosage: {
      dogs: '1 softgel per 40 lbs daily',
      cats: '1 softgel every other day'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.7,
    reviews: 298,
    featured: false
  },
  {
    id: 'b-complex-1',
    name: 'B-Complex Vitamins',
    brand: 'VitaPaws',
    category: 'vitamins',
    price: 21.99,
    size: '60 tablets',
    description: 'Complete B-vitamin complex for energy metabolism and nervous system support.',
    benefits: [
      'Supports energy production',
      'Nervous system health',
      'Healthy skin and coat',
      'Stress support',
      'Appetite stimulation'
    ],
    ingredients: [
      'Thiamine (B1)',
      'Riboflavin (B2)',
      'Niacin (B3)',
      'Pantothenic Acid (B5)',
      'Pyridoxine (B6)',
      'Biotin (B7)',
      'Folate (B9)',
      'Cobalamin (B12)'
    ],
    dosage: {
      dogs: '1 tablet daily',
      cats: '1/2 tablet daily'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.5,
    reviews: 156,
    featured: false
  },

  // Minerals
  {
    id: 'calcium-supplement-1',
    name: 'Bone Meal Calcium',
    brand: 'NatureBalance',
    category: 'minerals',
    price: 16.99,
    size: '12 oz',
    description: 'Food-grade bone meal powder for boneless raw diets. Perfect calcium-to-phosphorus ratio.',
    benefits: [
      'Essential for boneless raw feeding',
      'Supports bone and teeth health',
      'Proper Ca:P ratio (2:1)',
      'Highly bioavailable',
      'Critical for growing puppies/kittens'
    ],
    ingredients: ['Food-Grade Bone Meal Powder (Bovine)'],
    dosage: {
      dogs: '1/2 tsp per pound of boneless meat',
      cats: '1/2 tsp per pound of boneless meat'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.9,
    reviews: 445,
    featured: false
  },
  {
    id: 'trace-minerals-1',
    name: 'Trace Mineral Drops',
    brand: 'MineralMax',
    category: 'minerals',
    price: 19.99,
    size: '4 oz liquid',
    description: 'Ionic trace mineral supplement with over 72 trace minerals from ancient sea beds.',
    benefits: [
      'Provides essential trace minerals',
      'Supports electrolyte balance',
      'Enhances hydration',
      'Supports enzyme function',
      'Promotes overall health'
    ],
    ingredients: ['Ionic Trace Minerals (Magnesium, Potassium, Zinc, Iron, Selenium, and 67+ others)'],
    dosage: {
      dogs: '5 drops per 10 lbs in water daily',
      cats: '3 drops in water daily'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.6,
    reviews: 234,
    featured: false
  },

  // Specialty Supplements
  {
    id: 'taurine-cats-1',
    name: 'Taurine for Cats',
    brand: 'FelineHealth',
    category: 'specialty',
    price: 22.99,
    size: '100g powder',
    description: 'Pure taurine powder essential for cats. Critical amino acid for heart, vision, and immune health.',
    benefits: [
      'Essential for feline heart health',
      'Supports vision and retinal function',
      'Critical for reproduction',
      'Immune system support',
      'Required for boneless raw diets'
    ],
    ingredients: ['100% Pure Taurine (Pharmaceutical Grade)'],
    dosage: {
      dogs: 'Not typically required for dogs',
      cats: '250-500mg daily (1/4 - 1/2 tsp)'
    },
    forSpecies: ['cat'],
    inStock: true,
    rating: 5.0,
    reviews: 387,
    featured: true
  },
  {
    id: 'kelp-powder-1',
    name: 'Organic Kelp Powder',
    brand: 'SeaVit',
    category: 'specialty',
    price: 14.99,
    size: '8 oz',
    description: 'Organic kelp powder rich in iodine and trace minerals. Supports thyroid function.',
    benefits: [
      'Natural source of iodine',
      'Supports thyroid health',
      'Provides trace minerals',
      'Promotes healthy skin and coat',
      'Supports metabolism'
    ],
    ingredients: ['100% Organic Kelp (Ascophyllum nodosum)'],
    dosage: {
      dogs: '1/4 tsp per 25 lbs daily',
      cats: '1/8 tsp daily'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.7,
    reviews: 201,
    featured: false
  },
  {
    id: 'green-lipped-mussel-1',
    name: 'Green Lipped Mussel Extract',
    brand: 'JointCare',
    category: 'specialty',
    price: 29.99,
    size: '60 capsules',
    description: 'New Zealand green lipped mussel for joint and inflammation support. Natural source of glucosamine and omega-3s.',
    benefits: [
      'Natural joint support',
      'Anti-inflammatory properties',
      'Contains natural glucosamine',
      'Omega-3 fatty acids',
      'Supports mobility'
    ],
    ingredients: ['Green Lipped Mussel Extract (500mg)', 'Organic Rice Flour (capsule)'],
    dosage: {
      dogs: '1 capsule per 30 lbs daily',
      cats: '1 capsule every other day'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.8,
    reviews: 167,
    featured: false
  },
  {
    id: 'milk-thistle-1',
    name: 'Milk Thistle for Pets',
    brand: 'LiverSupport',
    category: 'specialty',
    price: 23.99,
    size: '90 capsules',
    description: 'Milk thistle extract standardized to 80% silymarin. Supports liver health and detoxification.',
    benefits: [
      'Supports liver function',
      'Natural detoxification',
      'Antioxidant properties',
      'Protects liver cells',
      'Supports healthy digestion'
    ],
    ingredients: ['Milk Thistle Extract (300mg, 80% Silymarin)', 'Organic Rice Flour'],
    dosage: {
      dogs: '1 capsule per 25 lbs daily',
      cats: '1/2 capsule daily'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.6,
    reviews: 143,
    featured: false
  },
  {
    id: 'colostrum-powder-1',
    name: 'Bovine Colostrum Powder',
    brand: 'ImmuneBoost',
    category: 'specialty',
    price: 31.99,
    size: '6 oz',
    description: 'Pure bovine colostrum from grass-fed cows. Rich in immunoglobulins and growth factors.',
    benefits: [
      'Immune system support',
      'Gut health promotion',
      'Natural antibodies',
      'Supports healing',
      'Ideal during illness or stress'
    ],
    ingredients: ['100% Bovine Colostrum (Grass-Fed)', 'Minimum 25% IgG'],
    dosage: {
      dogs: '1 tsp per 25 lbs daily',
      cats: '1/2 tsp daily'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.7,
    reviews: 209,
    featured: false
  },

  // Additional essential supplements
  {
    id: 'vitamin-d3-1',
    name: 'Vitamin D3 Drops',
    brand: 'SunVit',
    category: 'vitamins',
    price: 17.99,
    size: '1 oz liquid',
    description: 'Vitamin D3 for pets not consuming oily fish regularly. Essential for calcium absorption.',
    benefits: [
      'Supports calcium absorption',
      'Bone health',
      'Immune function',
      'Essential for cats (cannot synthesize from sunlight)',
      'Supports muscle function'
    ],
    ingredients: ['Vitamin D3 (Cholecalciferol) 400 IU per drop', 'MCT Oil'],
    dosage: {
      dogs: '1 drop per 10 lbs weekly',
      cats: '1 drop 2x weekly'
    },
    forSpecies: ['dog', 'cat', 'both'],
    inStock: true,
    rating: 4.5,
    reviews: 178,
    featured: false
  }
];

export const supplementCategories = [
  {
    id: 'omega',
    name: 'Omega-3 Fatty Acids',
    description: 'Fish oil, krill oil, and other omega-3 supplements for skin, coat, joint, and heart health',
    icon: '🐟'
  },
  {
    id: 'probiotics',
    name: 'Probiotics & Prebiotics',
    description: 'Support digestive health and immune function with beneficial bacteria',
    icon: '🦠'
  },
  {
    id: 'digestive',
    name: 'Digestive Enzymes',
    description: 'Enhance nutrient absorption and support healthy digestion',
    icon: '⚡'
  },
  {
    id: 'joint',
    name: 'Joint Support',
    description: 'Glucosamine, chondroitin, and MSM for mobility and joint health',
    icon: '🦴'
  },
  {
    id: 'vitamins',
    name: 'Vitamins',
    description: 'Essential vitamins including A, B-complex, D, E, and K',
    icon: '💊'
  },
  {
    id: 'minerals',
    name: 'Minerals',
    description: 'Calcium, trace minerals, and other essential minerals',
    icon: '⚗️'
  },
  {
    id: 'specialty',
    name: 'Specialty Supplements',
    description: 'Taurine for cats, kelp, colostrum, and targeted health supplements',
    icon: '⭐'
  }
];

// Helper function to get all unique categories
export function getAllCategories(): SupplementCategory[] {
  return Array.from(new Set(supplements.map(s => s.category)));
}

// Helper function to get a product by ID
export function getProductById(id: string): Supplement | undefined {
  return supplements.find(s => s.id === id);
}
