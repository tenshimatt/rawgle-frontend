export const FOOD_TYPES = [
  'Beef',
  'Chicken',
  'Turkey',
  'Duck',
  'Lamb',
  'Pork',
  'Venison',
  'White Fish',
  'Salmon',
  'Sardines',
  'Rabbit',
  'Organ Mix',
  'Bone Mix',
  'Vegetable Mix',
  'Egg',
] as const;

export type FoodType = typeof FOOD_TYPES[number];
