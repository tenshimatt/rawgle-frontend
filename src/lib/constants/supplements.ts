export const SUPPLEMENTS = [
  'Omega-3 Fish Oil',
  'Glucosamine',
  'Probiotics',
  'Multivitamin',
  'Joint Support',
  'Digestive Enzymes',
  'Green Lipped Mussel',
  'Turmeric/Curcumin',
  'Vitamin E',
  'Calcium',
  'Vitamin D3',
  'CoQ10',
  'Milk Thistle',
  'Cranberry Extract',
  'Kelp',
] as const;

export type Supplement = typeof SUPPLEMENTS[number];
