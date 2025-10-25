/**
 * PAWS Loyalty Program - Rewards Catalog
 */

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  category: 'Discounts' | 'Products' | 'Services' | 'Exclusive';
  icon: string;
  available: boolean;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export interface LoyaltyTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  minPoints: number;
  benefits: string[];
  color: string;
  icon: string;
}

export const loyaltyTiers: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    benefits: [
      '1 point per $ spent',
      'Birthday bonus: 50 points',
      'Access to member-only content'
    ],
    color: 'bg-amber-600',
    icon: '🥉'
  },
  {
    name: 'Silver',
    minPoints: 500,
    benefits: [
      '1.25 points per $ spent',
      'Birthday bonus: 100 points',
      'Free shipping on orders $50+',
      'Early access to sales'
    ],
    color: 'bg-gray-400',
    icon: '🥈'
  },
  {
    name: 'Gold',
    minPoints: 2000,
    benefits: [
      '1.5 points per $ spent',
      'Birthday bonus: 200 points',
      'Free shipping on all orders',
      'Exclusive rewards access',
      'Priority customer support'
    ],
    color: 'bg-yellow-500',
    icon: '🥇'
  },
  {
    name: 'Platinum',
    minPoints: 5000,
    benefits: [
      '2 points per $ spent',
      'Birthday bonus: 500 points',
      'Free shipping + 10% off all orders',
      'VIP exclusive rewards',
      'Dedicated account manager',
      'Invitation to exclusive events'
    ],
    color: 'bg-purple-600',
    icon: '💎'
  }
];

export const rewards: Reward[] = [
  {
    id: 'r1',
    name: '$5 Off Next Order',
    description: 'Get $5 off your next purchase',
    points: 100,
    category: 'Discounts',
    icon: '💵',
    available: true
  },
  {
    id: 'r2',
    name: '$10 Off Next Order',
    description: 'Get $10 off your next purchase',
    points: 200,
    category: 'Discounts',
    icon: '💰',
    available: true
  },
  {
    id: 'r3',
    name: '$25 Off Next Order',
    description: 'Get $25 off your next purchase',
    points: 450,
    category: 'Discounts',
    icon: '💸',
    available: true
  },
  {
    id: 'r4',
    name: '$50 Off Next Order',
    description: 'Get $50 off your next purchase',
    points: 850,
    category: 'Discounts',
    icon: '🎁',
    available: true,
    tier: 'Silver'
  },
  {
    id: 'r5',
    name: 'Free Shipping',
    description: 'Free shipping on your next order (any amount)',
    points: 75,
    category: 'Discounts',
    icon: '📦',
    available: true
  },
  {
    id: 'r6',
    name: 'Premium Beef Blend (2 lbs)',
    description: 'High-quality beef blend for dogs',
    points: 300,
    category: 'Products',
    icon: '🥩',
    available: true
  },
  {
    id: 'r7',
    name: 'Chicken & Turkey Mix (3 lbs)',
    description: 'Lean poultry blend for all pets',
    points: 250,
    category: 'Products',
    icon: '🍗',
    available: true
  },
  {
    id: 'r8',
    name: 'Salmon Delight (1.5 lbs)',
    description: 'Omega-3 rich salmon for skin & coat',
    points: 350,
    category: 'Products',
    icon: '🐟',
    available: true
  },
  {
    id: 'r9',
    name: 'Organ Meat Variety Pack',
    description: 'Liver, kidney, heart - nutrient powerhouses',
    points: 400,
    category: 'Products',
    icon: '🫀',
    available: true,
    tier: 'Silver'
  },
  {
    id: 'r10',
    name: 'Raw Bone Bundle',
    description: 'Assorted raw bones for dental health',
    points: 200,
    category: 'Products',
    icon: '🦴',
    available: true
  },
  {
    id: 'r11',
    name: 'Freeze-Dried Treats (8 oz)',
    description: 'Premium freeze-dried raw treats',
    points: 150,
    category: 'Products',
    icon: '🍖',
    available: true
  },
  {
    id: 'r12',
    name: 'Green Tripe (2 lbs)',
    description: 'Superfood green tripe for digestion',
    points: 280,
    category: 'Products',
    icon: '🟢',
    available: true
  },
  {
    id: 'r13',
    name: 'Complete Meal Plan (1 week)',
    description: 'Fully balanced meals for one week',
    points: 600,
    category: 'Products',
    icon: '📅',
    available: true,
    tier: 'Gold'
  },
  {
    id: 'r14',
    name: 'Free Nutrition Consultation',
    description: '30-minute consultation with nutrition expert',
    points: 500,
    category: 'Services',
    icon: '👨‍⚕️',
    available: true,
    tier: 'Silver'
  },
  {
    id: 'r15',
    name: 'Custom Meal Plan',
    description: 'Personalized meal plan for your pet',
    points: 750,
    category: 'Services',
    icon: '📋',
    available: true,
    tier: 'Gold'
  },
  {
    id: 'r16',
    name: 'Home Delivery Setup',
    description: 'Free home delivery setup & orientation',
    points: 300,
    category: 'Services',
    icon: '🚚',
    available: true
  },
  {
    id: 'r17',
    name: 'Raw Feeding Starter Kit',
    description: 'Everything you need to start raw feeding',
    points: 800,
    category: 'Exclusive',
    icon: '🎒',
    available: true,
    tier: 'Gold'
  },
  {
    id: 'r18',
    name: 'Premium Freezer Container Set',
    description: 'Food-grade containers for storage',
    points: 400,
    category: 'Exclusive',
    icon: '🧊',
    available: true,
    tier: 'Silver'
  },
  {
    id: 'r19',
    name: 'RAWGLE Branded Merchandise',
    description: 'T-shirt, water bottle, and tote bag',
    points: 350,
    category: 'Exclusive',
    icon: '👕',
    available: true
  },
  {
    id: 'r20',
    name: 'VIP Event Access',
    description: 'Exclusive invitation to RAWGLE events',
    points: 1000,
    category: 'Exclusive',
    icon: '🎟️',
    available: true,
    tier: 'Platinum'
  },
  {
    id: 'r21',
    name: 'Monthly Surprise Box',
    description: 'Curated selection of premium raw foods',
    points: 900,
    category: 'Exclusive',
    icon: '🎁',
    available: true,
    tier: 'Platinum'
  },
  {
    id: 'r22',
    name: 'Lifetime 15% Discount',
    description: 'Permanent 15% off all future purchases',
    points: 10000,
    category: 'Exclusive',
    icon: '⭐',
    available: true,
    tier: 'Platinum'
  },
  {
    id: 'r23',
    name: 'Pet Portrait Session',
    description: 'Professional photo session for your pet',
    points: 1200,
    category: 'Services',
    icon: '📸',
    available: true,
    tier: 'Gold'
  },
  {
    id: 'r24',
    name: 'Annual Health Check',
    description: 'Free annual health & nutrition check-up',
    points: 1500,
    category: 'Services',
    icon: '🏥',
    available: true,
    tier: 'Platinum'
  }
];

export const pointsEarningMethods = [
  {
    action: 'Purchase',
    points: '1-2 per $1',
    description: 'Earn points on every dollar spent (tier-based)',
    icon: '🛒'
  },
  {
    action: 'Sign Up',
    points: '100',
    description: 'Welcome bonus for new members',
    icon: '✍️'
  },
  {
    action: 'Product Review',
    points: '25',
    description: 'Share your experience with products',
    icon: '⭐'
  },
  {
    action: 'Referral',
    points: '200',
    description: 'Refer a friend who makes a purchase',
    icon: '👥'
  },
  {
    action: 'Social Share',
    points: '10',
    description: 'Share on social media (max 50/month)',
    icon: '📱'
  },
  {
    action: 'Birthday',
    points: '50-500',
    description: 'Birthday bonus (tier-based)',
    icon: '🎂'
  },
  {
    action: 'Complete Profile',
    points: '50',
    description: 'Fill out your complete profile',
    icon: '📝'
  },
  {
    action: 'Educational Quiz',
    points: '30',
    description: 'Complete raw feeding knowledge quizzes',
    icon: '📚'
  }
];

// Helper functions
export function getTierByPoints(points: number): LoyaltyTier {
  const sortedTiers = [...loyaltyTiers].sort((a, b) => b.minPoints - a.minPoints);
  return sortedTiers.find(tier => points >= tier.minPoints) || loyaltyTiers[0];
}

export function getNextTier(currentPoints: number): LoyaltyTier | null {
  const currentTier = getTierByPoints(currentPoints);
  const currentIndex = loyaltyTiers.findIndex(t => t.name === currentTier.name);
  return currentIndex < loyaltyTiers.length - 1 ? loyaltyTiers[currentIndex + 1] : null;
}

export function getRewardsByCategory(category: string): Reward[] {
  return rewards.filter(reward => reward.category === category);
}

export function getRewardsByTier(tierName: string): Reward[] {
  return rewards.filter(reward => !reward.tier || reward.tier === tierName);
}

export function canAffordReward(userPoints: number, rewardPoints: number): boolean {
  return userPoints >= rewardPoints;
}
