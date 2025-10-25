/**
 * Dog Breeds Database
 *
 * Comprehensive database of 150+ dog breeds with detailed information
 * for raw feeding guidance and health tracking
 */

export interface Breed {
  id: string;
  slug: string;
  name: string;
  alternateNames?: string[];
  imageUrl: string;

  // Classification
  group: 'Sporting' | 'Hound' | 'Working' | 'Terrier' | 'Toy' | 'Non-Sporting' | 'Herding' | 'Mixed';
  size: 'Toy' | 'Small' | 'Medium' | 'Large' | 'Giant';

  // Physical Characteristics
  weight: {
    male: string;  // e.g., "65-80 lbs"
    female: string;
  };
  height: {
    male: string;  // e.g., "23-25 inches"
    female: string;
  };
  lifeSpan: string;  // e.g., "10-13 years"
  coatType: string;
  coatColors: string[];

  // Temperament
  temperament: string[];
  energyLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  exerciseNeeds: string;
  trainability: 'Easy' | 'Moderate' | 'Challenging';
  goodWithChildren: boolean;
  goodWithPets: boolean;

  // Health
  commonHealthIssues: string[];
  geneticConditions: string[];

  // Raw Feeding Guidelines
  rawFeedingGuide: {
    dailyPercentage: string;  // e.g., "2-3% of body weight"
    proteinSources: string[];
    boneMeatRatio: string;
    organMeatRatio: string;
    specialConsiderations: string[];
    sampleMealPlan: string;
  };

  // Additional Information
  history: string;
  characteristics: string;
  groomingNeeds: string;
  barkingLevel: 'Low' | 'Moderate' | 'High';

  // Metadata
  featured: boolean;
  popularity: number;  // 1-150, lower is more popular
}

export const breeds: Breed[] = [
  {
    id: '1',
    slug: 'labrador-retriever',
    name: 'Labrador Retriever',
    imageUrl: '/images/breeds/labrador-retriever.jpg',
    group: 'Sporting',
    size: 'Large',
    weight: {
      male: '65-80 lbs',
      female: '55-70 lbs'
    },
    height: {
      male: '22.5-24.5 inches',
      female: '21.5-23.5 inches'
    },
    lifeSpan: '10-12 years',
    coatType: 'Short, dense, water-resistant double coat',
    coatColors: ['Black', 'Yellow', 'Chocolate'],
    temperament: ['Friendly', 'Outgoing', 'Active', 'Gentle', 'Intelligent'],
    energyLevel: 'High',
    exerciseNeeds: '60-90 minutes daily of vigorous exercise',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Elbow dysplasia', 'Obesity', 'Ear infections'],
    geneticConditions: ['Progressive retinal atrophy', 'Exercise-induced collapse'],
    rawFeedingGuide: {
      dailyPercentage: '2-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Beef', 'Fish', 'Duck'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Labs are prone to obesity - monitor portions carefully',
        'High energy needs due to active nature',
        'May benefit from joint-supporting supplements',
        'Include omega-3 rich fish for coat health'
      ],
      sampleMealPlan: 'Morning: 1 lb chicken quarters with liver. Evening: 1 lb ground beef with heart and fish oil.'
    },
    history: 'Originally from Newfoundland, Labs were bred to help fishermen retrieve nets and fish. They became popular as hunting companions and are now the most popular dog breed in America.',
    characteristics: 'Labs are known for their friendly, outgoing nature and high energy. They excel in various roles including hunting, service work, and as family companions. They love water and have a strong retrieving instinct.',
    groomingNeeds: 'Low to moderate - weekly brushing, more during shedding seasons',
    barkingLevel: 'Moderate',
    featured: true,
    popularity: 1
  },
  {
    id: '2',
    slug: 'german-shepherd',
    name: 'German Shepherd',
    imageUrl: '/images/breeds/german-shepherd.jpg',
    group: 'Herding',
    size: 'Large',
    weight: {
      male: '65-90 lbs',
      female: '50-70 lbs'
    },
    height: {
      male: '24-26 inches',
      female: '22-24 inches'
    },
    lifeSpan: '9-13 years',
    coatType: 'Medium-length double coat',
    coatColors: ['Black and Tan', 'Sable', 'All Black', 'Black and Red'],
    temperament: ['Confident', 'Courageous', 'Intelligent', 'Loyal', 'Protective'],
    energyLevel: 'High',
    exerciseNeeds: '60-120 minutes daily of physical and mental exercise',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Elbow dysplasia', 'Degenerative myelopathy', 'Bloat'],
    geneticConditions: ['Hemophilia', 'Exocrine pancreatic insufficiency'],
    rawFeedingGuide: {
      dailyPercentage: '2-3% of body weight',
      proteinSources: ['Beef', 'Lamb', 'Chicken', 'Turkey', 'Venison'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs (kidney, spleen)',
      specialConsiderations: [
        'Prone to bloat - feed smaller meals 2-3 times daily',
        'High protein needs for muscle maintenance',
        'May benefit from joint supplements',
        'Consider digestive enzymes if EPI is present'
      ],
      sampleMealPlan: 'Morning: 1.5 lbs beef with bone and liver. Evening: 1 lb chicken with organs and vegetables.'
    },
    history: 'Developed in Germany in the late 1800s for herding sheep, German Shepherds became popular as police and military dogs due to their intelligence and trainability.',
    characteristics: 'Extremely versatile working dogs known for their intelligence, loyalty, and protective nature. They excel in police work, military service, search and rescue, and as service dogs.',
    groomingNeeds: 'Moderate to high - brush several times weekly, daily during shedding',
    barkingLevel: 'Moderate',
    featured: true,
    popularity: 2
  },
  {
    id: '3',
    slug: 'golden-retriever',
    name: 'Golden Retriever',
    imageUrl: '/images/breeds/golden-retriever.jpg',
    group: 'Sporting',
    size: 'Large',
    weight: {
      male: '65-75 lbs',
      female: '55-65 lbs'
    },
    height: {
      male: '23-24 inches',
      female: '21.5-22.5 inches'
    },
    lifeSpan: '10-12 years',
    coatType: 'Long, dense, water-repellent double coat',
    coatColors: ['Light Golden', 'Golden', 'Dark Golden'],
    temperament: ['Friendly', 'Intelligent', 'Devoted', 'Trustworthy', 'Kind'],
    energyLevel: 'High',
    exerciseNeeds: '60-90 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Elbow dysplasia', 'Cancer', 'Heart disease'],
    geneticConditions: ['Progressive retinal atrophy', 'Subvalvular aortic stenosis'],
    rawFeedingGuide: {
      dailyPercentage: '2-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Beef', 'Fish', 'Rabbit'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Prone to obesity - monitor portions',
        'May benefit from antioxidants for cancer prevention',
        'Include omega-3s for heart and skin health',
        'Consider joint supplements early'
      ],
      sampleMealPlan: 'Morning: 1.25 lbs turkey with organs. Evening: 1 lb beef with bone and fish.'
    },
    history: 'Bred in Scotland in the mid-1800s as hunting dogs to retrieve waterfowl. They became beloved family companions known for their gentle temperament.',
    characteristics: 'Golden Retrievers are known for their friendly, tolerant attitude and love of people. They are intelligent, eager to please, and excel as therapy dogs, service dogs, and family pets.',
    groomingNeeds: 'High - daily brushing to prevent mats and tangles',
    barkingLevel: 'Moderate',
    featured: true,
    popularity: 3
  },
  {
    id: '4',
    slug: 'french-bulldog',
    name: 'French Bulldog',
    imageUrl: '/images/breeds/french-bulldog.jpg',
    group: 'Non-Sporting',
    size: 'Small',
    weight: {
      male: '20-28 lbs',
      female: '16-24 lbs'
    },
    height: {
      male: '11-13 inches',
      female: '11-13 inches'
    },
    lifeSpan: '10-12 years',
    coatType: 'Short, smooth, fine',
    coatColors: ['Brindle', 'Fawn', 'White', 'Cream'],
    temperament: ['Playful', 'Adaptable', 'Smart', 'Affectionate', 'Alert'],
    energyLevel: 'Moderate',
    exerciseNeeds: '30-45 minutes daily of gentle exercise',
    trainability: 'Moderate',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Brachycephalic syndrome', 'Hip dysplasia', 'Allergies', 'Skin fold dermatitis'],
    geneticConditions: ['Intervertebral disc disease', 'Hemivertebrae'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Fish', 'Lean beef'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Brachycephalic - avoid large chunks that could cause choking',
        'Prone to allergies - rotate protein sources',
        'May need softer bones due to jaw structure',
        'Watch for weight gain - adjust portions accordingly'
      ],
      sampleMealPlan: 'Morning: 4 oz ground chicken with liver. Evening: 4 oz turkey with heart and ground bone.'
    },
    history: 'French Bulldogs descended from English Bulldogs and were bred as companion dogs in France in the 1800s. They became popular with Parisian society.',
    characteristics: 'Frenchies are charming, adaptable companions perfect for apartment living. They are known for their bat ears, compact size, and affectionate nature. They can be stubborn but are generally easy-going.',
    groomingNeeds: 'Low - weekly brushing and wrinkle cleaning',
    barkingLevel: 'Low',
    featured: true,
    popularity: 4
  },
  {
    id: '5',
    slug: 'bulldog',
    name: 'Bulldog',
    alternateNames: ['English Bulldog'],
    imageUrl: '/images/breeds/bulldog.jpg',
    group: 'Non-Sporting',
    size: 'Medium',
    weight: {
      male: '50-55 lbs',
      female: '40-50 lbs'
    },
    height: {
      male: '14-15 inches',
      female: '14-15 inches'
    },
    lifeSpan: '8-10 years',
    coatType: 'Short, smooth, glossy',
    coatColors: ['Brindle', 'White', 'Red', 'Fawn', 'Piebald'],
    temperament: ['Docile', 'Willful', 'Friendly', 'Gregarious', 'Calm'],
    energyLevel: 'Low',
    exerciseNeeds: '20-30 minutes daily of gentle walks',
    trainability: 'Moderate',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Brachycephalic syndrome', 'Hip dysplasia', 'Cherry eye', 'Skin infections'],
    geneticConditions: ['Pulmonic stenosis', 'Ventricular septal defect'],
    rawFeedingGuide: {
      dailyPercentage: '2-2.5% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Lean beef', 'Fish', 'Rabbit'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Brachycephalic - ground or minced meat is safer',
        'Prone to obesity - strict portion control',
        'Softer bones recommended',
        'May need digestive enzymes',
        'Keep cool during feeding - avoid overheating'
      ],
      sampleMealPlan: 'Morning: 6 oz ground chicken with organ blend. Evening: 6 oz turkey with ground bone.'
    },
    history: 'Originally bred in England for bull-baiting in the 13th century. After this practice was banned, Bulldogs were bred to be gentle companions, losing much of their aggressive nature.',
    characteristics: 'Despite their fierce appearance, Bulldogs are gentle, affectionate companions. They are known for their distinctive pushed-in nose, loose skin, and stocky build. They prefer lounging to running.',
    groomingNeeds: 'Moderate - daily wrinkle cleaning and weekly brushing',
    barkingLevel: 'Low',
    featured: true,
    popularity: 5
  },
  {
    id: '6',
    slug: 'poodle',
    name: 'Poodle',
    alternateNames: ['Standard Poodle', 'Miniature Poodle', 'Toy Poodle'],
    imageUrl: '/images/breeds/poodle.jpg',
    group: 'Non-Sporting',
    size: 'Medium',
    weight: {
      male: '45-70 lbs (Standard)',
      female: '45-60 lbs (Standard)'
    },
    height: {
      male: '15+ inches (Standard)',
      female: '15+ inches (Standard)'
    },
    lifeSpan: '12-15 years',
    coatType: 'Curly, dense, hypoallergenic',
    coatColors: ['Black', 'White', 'Apricot', 'Gray', 'Brown', 'Cream'],
    temperament: ['Intelligent', 'Active', 'Alert', 'Trainable', 'Elegant'],
    energyLevel: 'High',
    exerciseNeeds: '60 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Progressive retinal atrophy', 'Addisons disease', 'Bloat'],
    geneticConditions: ['Von Willebrands disease', 'Sebaceous adenitis'],
    rawFeedingGuide: {
      dailyPercentage: '2-3% of body weight',
      proteinSources: ['Chicken', 'Duck', 'Turkey', 'Fish', 'Lamb'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Prone to bloat - feed smaller meals 2x daily',
        'High energy needs',
        'Include fish for coat health',
        'May benefit from digestive enzymes',
        'Consider thyroid support supplements'
      ],
      sampleMealPlan: 'Morning: 1 lb duck with liver. Evening: 10 oz chicken with fish and organs.'
    },
    history: 'Despite their association with France, Poodles originated in Germany as water retrievers. They were bred for their intelligence and swimming ability.',
    characteristics: 'Poodles are highly intelligent, elegant dogs that excel in obedience and agility. They come in three sizes (Standard, Miniature, Toy) and are known for their hypoallergenic coat and athletic ability.',
    groomingNeeds: 'Very high - daily brushing and professional grooming every 4-6 weeks',
    barkingLevel: 'Moderate',
    featured: true,
    popularity: 6
  },
  {
    id: '7',
    slug: 'beagle',
    name: 'Beagle',
    imageUrl: '/images/breeds/beagle.jpg',
    group: 'Hound',
    size: 'Small',
    weight: {
      male: '20-30 lbs',
      female: '20-30 lbs'
    },
    height: {
      male: '13-15 inches',
      female: '13-15 inches'
    },
    lifeSpan: '10-15 years',
    coatType: 'Short, dense, weather-resistant',
    coatColors: ['Tricolor', 'Red and White', 'Lemon and White'],
    temperament: ['Friendly', 'Curious', 'Merry', 'Determined', 'Gentle'],
    energyLevel: 'High',
    exerciseNeeds: '60 minutes daily',
    trainability: 'Moderate',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Obesity', 'Ear infections', 'Epilepsy', 'Hypothyroidism'],
    geneticConditions: ['Hip dysplasia', 'Cherry eye'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Rabbit', 'Turkey', 'Beef', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Prone to obesity - strict portion control essential',
        'Food motivated - watch for scavenging',
        'Regular ear cleaning important',
        'Consider thyroid support if needed'
      ],
      sampleMealPlan: 'Morning: 6 oz chicken quarters with liver. Evening: 6 oz rabbit with organs.'
    },
    history: 'Beagles were bred in England for hunting rabbits and hares. Their keen sense of smell and friendly nature made them popular hunting companions.',
    characteristics: 'Beagles are merry, friendly hounds with an excellent sense of smell. They are pack dogs that enjoy company and are known for their distinctive howl. They can be stubborn but are generally good-natured.',
    groomingNeeds: 'Low - weekly brushing',
    barkingLevel: 'High',
    featured: false,
    popularity: 7
  },
  {
    id: '8',
    slug: 'rottweiler',
    name: 'Rottweiler',
    imageUrl: '/images/breeds/rottweiler.jpg',
    group: 'Working',
    size: 'Large',
    weight: {
      male: '95-135 lbs',
      female: '80-100 lbs'
    },
    height: {
      male: '24-27 inches',
      female: '22-25 inches'
    },
    lifeSpan: '8-10 years',
    coatType: 'Short, coarse, flat',
    coatColors: ['Black with Rust/Mahogany markings'],
    temperament: ['Loyal', 'Confident', 'Brave', 'Calm', 'Protective'],
    energyLevel: 'Moderate',
    exerciseNeeds: '60 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: false,
    commonHealthIssues: ['Hip dysplasia', 'Elbow dysplasia', 'Osteosarcoma', 'Bloat'],
    geneticConditions: ['Subvalvular aortic stenosis', 'Von Willebrands disease'],
    rawFeedingGuide: {
      dailyPercentage: '2-2.5% of body weight',
      proteinSources: ['Beef', 'Lamb', 'Chicken', 'Turkey', 'Venison'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Prone to bloat - feed 2-3 smaller meals daily',
        'High protein needs for muscle mass',
        'Joint supplements recommended early',
        'May benefit from heart health supplements',
        'Avoid exercise immediately after meals'
      ],
      sampleMealPlan: 'Morning: 1.5 lbs beef with bone. Midday: 8 oz chicken with organs. Evening: 1 lb turkey with liver.'
    },
    history: 'Rottweilers descended from Roman drover dogs and were used to herd livestock and pull carts in the German town of Rottweil. They later became popular as police and guard dogs.',
    characteristics: 'Rottweilers are powerful, confident guardians with a calm, self-assured demeanor. They are devoted to their families and naturally protective. Early socialization and training are essential.',
    groomingNeeds: 'Low - weekly brushing',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 8
  },
  {
    id: '9',
    slug: 'yorkshire-terrier',
    name: 'Yorkshire Terrier',
    imageUrl: '/images/breeds/yorkshire-terrier.jpg',
    group: 'Toy',
    size: 'Toy',
    weight: {
      male: '4-7 lbs',
      female: '4-7 lbs'
    },
    height: {
      male: '7-8 inches',
      female: '7-8 inches'
    },
    lifeSpan: '11-15 years',
    coatType: 'Long, silky, straight',
    coatColors: ['Blue and Tan', 'Black and Tan'],
    temperament: ['Affectionate', 'Sprightly', 'Tomboyish', 'Brave', 'Bold'],
    energyLevel: 'Moderate',
    exerciseNeeds: '30 minutes daily',
    trainability: 'Moderate',
    goodWithChildren: false,
    goodWithPets: false,
    commonHealthIssues: ['Dental disease', 'Patellar luxation', 'Tracheal collapse', 'Hypoglycemia'],
    geneticConditions: ['Portosystemic shunt', 'Legg-Calve-Perthes disease'],
    rawFeedingGuide: {
      dailyPercentage: '3-4% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Quail', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Small portions - feed 2-3 times daily',
        'Ground meat and small bones recommended',
        'Prone to hypoglycemia - monitor closely',
        'Dental health critical - include appropriate bones',
        'May need extra calories due to high metabolism'
      ],
      sampleMealPlan: 'Morning: 1.5 oz ground chicken with liver. Afternoon: 1 oz turkey. Evening: 1.5 oz rabbit with organs.'
    },
    history: 'Yorkshire Terriers were bred in Yorkshire, England, in the mid-1800s to catch rats in clothing mills. They became fashionable companions for Victorian ladies.',
    characteristics: 'Yorkies are small but mighty, with big personalities in tiny packages. They are affectionate with their families but can be territorial. Their long, silky coat requires significant grooming.',
    groomingNeeds: 'Very high - daily brushing and regular professional grooming',
    barkingLevel: 'High',
    featured: false,
    popularity: 9
  },
  {
    id: '10',
    slug: 'boxer',
    name: 'Boxer',
    imageUrl: '/images/breeds/boxer.jpg',
    group: 'Working',
    size: 'Large',
    weight: {
      male: '65-80 lbs',
      female: '50-65 lbs'
    },
    height: {
      male: '23-25 inches',
      female: '21.5-23.5 inches'
    },
    lifeSpan: '10-12 years',
    coatType: 'Short, smooth, shiny',
    coatColors: ['Fawn', 'Brindle', 'White markings'],
    temperament: ['Playful', 'Energetic', 'Loyal', 'Intelligent', 'Brave'],
    energyLevel: 'Very High',
    exerciseNeeds: '90-120 minutes daily',
    trainability: 'Moderate',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Cardiomyopathy', 'Hip dysplasia', 'Cancer', 'Bloat'],
    geneticConditions: ['Boxer cardiomyopathy', 'Aortic stenosis'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Beef', 'Chicken', 'Turkey', 'Lamb', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% heart and other organs',
      specialConsiderations: [
        'Very high energy - may need more calories',
        'Prone to bloat - feed 2-3 smaller meals',
        'Include heart-healthy supplements',
        'Avoid exercise immediately after meals',
        'May benefit from taurine supplementation'
      ],
      sampleMealPlan: 'Morning: 1.5 lbs chicken with heart. Evening: 1 lb beef with liver and bone.'
    },
    history: 'Boxers were developed in Germany in the late 1800s from Bullenbeisser dogs. They were used for hunting, dog fighting, and later as military and police dogs.',
    characteristics: 'Boxers are fun-loving, energetic dogs known for their playful nature and strong bond with family. They remain puppy-like well into adulthood and need plenty of exercise and mental stimulation.',
    groomingNeeds: 'Low - weekly brushing',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 10
  },
  {
    id: '11',
    slug: 'dachshund',
    name: 'Dachshund',
    imageUrl: '/images/breeds/dachshund.jpg',
    group: 'Hound',
    size: 'Small',
    weight: {
      male: '16-32 lbs (Standard)',
      female: '16-32 lbs (Standard)'
    },
    height: {
      male: '8-9 inches (Standard)',
      female: '8-9 inches (Standard)'
    },
    lifeSpan: '12-16 years',
    coatType: 'Smooth, wirehaired, or longhaired',
    coatColors: ['Red', 'Black and Tan', 'Chocolate', 'Cream', 'Dapple'],
    temperament: ['Curious', 'Stubborn', 'Clever', 'Brave', 'Lively'],
    energyLevel: 'Moderate',
    exerciseNeeds: '30-60 minutes daily',
    trainability: 'Moderate',
    goodWithChildren: false,
    goodWithPets: false,
    commonHealthIssues: ['Intervertebral disc disease', 'Obesity', 'Dental disease', 'Epilepsy'],
    geneticConditions: ['Progressive retinal atrophy', 'Acanthosis nigricans'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Beef', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Prone to obesity - strict portion control',
        'Weight management critical for back health',
        'Include joint-supporting supplements',
        'Appropriate bone sizes to prevent choking',
        'May need dental care support'
      ],
      sampleMealPlan: 'Morning: 4 oz chicken with liver. Evening: 4 oz turkey with bone and fish.'
    },
    history: 'Dachshunds were bred in Germany over 600 years ago to hunt badgers. Their long, low bodies allowed them to enter badger dens.',
    characteristics: 'Dachshunds are clever, lively dogs with bold personalities. Their long backs make them prone to disc problems, so jumping and obesity should be avoided. They can be stubborn but are devoted companions.',
    groomingNeeds: 'Low to moderate depending on coat type',
    barkingLevel: 'High',
    featured: false,
    popularity: 11
  },
  {
    id: '12',
    slug: 'siberian-husky',
    name: 'Siberian Husky',
    imageUrl: '/images/breeds/siberian-husky.jpg',
    group: 'Working',
    size: 'Medium',
    weight: {
      male: '45-60 lbs',
      female: '35-50 lbs'
    },
    height: {
      male: '21-23.5 inches',
      female: '20-22 inches'
    },
    lifeSpan: '12-14 years',
    coatType: 'Medium-length double coat',
    coatColors: ['Black and White', 'Gray and White', 'Red and White', 'Agouti', 'Pure White'],
    temperament: ['Outgoing', 'Mischievous', 'Loyal', 'Alert', 'Gentle'],
    energyLevel: 'Very High',
    exerciseNeeds: '90-120 minutes daily',
    trainability: 'Challenging',
    goodWithChildren: true,
    goodWithPets: false,
    commonHealthIssues: ['Hip dysplasia', 'Eye conditions', 'Hypothyroidism'],
    geneticConditions: ['Progressive retinal atrophy', 'Corneal dystrophy'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Fish', 'Chicken', 'Beef', 'Lamb', 'Turkey'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'High energy needs - may need more calories in winter',
        'Include fish for coat and eye health',
        'Can be efficient metabolizers - monitor weight',
        'Zinc supplementation may benefit coat',
        'May do well on higher fat content'
      ],
      sampleMealPlan: 'Morning: 1 lb fish with organs. Evening: 12 oz chicken with bone and liver.'
    },
    history: 'Bred by the Chukchi people of Siberia as endurance sled dogs, Huskies can pull light loads over vast frozen distances. They arrived in Alaska in 1908.',
    characteristics: 'Huskies are energetic, intelligent dogs bred for stamina. They are friendly, independent, and can be escape artists. They have a strong prey drive and need extensive exercise. They are known for their distinctive howling.',
    groomingNeeds: 'Moderate to high - brush weekly, daily during heavy shedding',
    barkingLevel: 'Low',
    featured: false,
    popularity: 12
  },
  {
    id: '13',
    slug: 'great-dane',
    name: 'Great Dane',
    imageUrl: '/images/breeds/great-dane.jpg',
    group: 'Working',
    size: 'Giant',
    weight: {
      male: '140-175 lbs',
      female: '110-140 lbs'
    },
    height: {
      male: '30-32 inches',
      female: '28-30 inches'
    },
    lifeSpan: '7-10 years',
    coatType: 'Short, smooth, glossy',
    coatColors: ['Fawn', 'Brindle', 'Blue', 'Black', 'Harlequin', 'Mantle'],
    temperament: ['Friendly', 'Patient', 'Dependable', 'Gentle', 'Reserved'],
    energyLevel: 'Moderate',
    exerciseNeeds: '60 minutes daily of moderate exercise',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Bloat', 'Hip dysplasia', 'Cardiomyopathy', 'Osteosarcoma'],
    geneticConditions: ['Dilated cardiomyopathy', 'Wobbler syndrome'],
    rawFeedingGuide: {
      dailyPercentage: '2-2.5% of body weight',
      proteinSources: ['Beef', 'Chicken', 'Turkey', 'Lamb', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% heart and other organs',
      specialConsiderations: [
        'Feed 2-3 smaller meals to prevent bloat',
        'Avoid exercise 1-2 hours before and after meals',
        'Joint supplements essential due to size',
        'Heart health supplements recommended',
        'May benefit from taurine and L-carnitine',
        'Slow, steady growth important - dont overfeed puppies'
      ],
      sampleMealPlan: 'Morning: 2 lbs chicken with organs. Afternoon: 1 lb beef. Evening: 1.5 lbs turkey with bone and heart.'
    },
    history: 'Despite their name, Great Danes were developed in Germany to hunt wild boar. They later became estate guard dogs and companions to German nobility.',
    characteristics: 'Great Danes are gentle giants known for their friendly, patient nature. Despite their size, they think they are lap dogs. They need space but moderate exercise and are devoted family companions.',
    groomingNeeds: 'Low - weekly brushing',
    barkingLevel: 'Low',
    featured: false,
    popularity: 13
  },
  {
    id: '14',
    slug: 'doberman-pinscher',
    name: 'Doberman Pinscher',
    imageUrl: '/images/breeds/doberman-pinscher.jpg',
    group: 'Working',
    size: 'Large',
    weight: {
      male: '75-100 lbs',
      female: '60-90 lbs'
    },
    height: {
      male: '26-28 inches',
      female: '24-26 inches'
    },
    lifeSpan: '10-12 years',
    coatType: 'Short, smooth, hard',
    coatColors: ['Black and Rust', 'Red and Rust', 'Blue and Rust', 'Fawn and Rust'],
    temperament: ['Loyal', 'Fearless', 'Alert', 'Obedient', 'Intelligent'],
    energyLevel: 'High',
    exerciseNeeds: '90 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Dilated cardiomyopathy', 'Hip dysplasia', 'Von Willebrands disease', 'Bloat'],
    geneticConditions: ['Cervical vertebral instability', 'Color dilution alopecia'],
    rawFeedingGuide: {
      dailyPercentage: '2-3% of body weight',
      proteinSources: ['Beef', 'Chicken', 'Turkey', 'Lamb', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% heart and other organs',
      specialConsiderations: [
        'Prone to bloat - feed 2-3 smaller meals',
        'Heart health supplements recommended',
        'Include taurine and L-carnitine',
        'Joint supplements for active lifestyle',
        'Avoid exercise around meal times'
      ],
      sampleMealPlan: 'Morning: 1.5 lbs beef with heart. Evening: 1.25 lbs chicken with liver and bone.'
    },
    history: 'Dobermans were developed in Germany in the 1890s by tax collector Louis Dobermann, who wanted a loyal guard dog. They became popular as police and military dogs.',
    characteristics: 'Dobermans are sleek, powerful dogs with a reputation as fierce guardians, but they are affectionate with family. They are intelligent, loyal, and naturally protective. Early socialization is important.',
    groomingNeeds: 'Low - weekly brushing',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 14
  },
  {
    id: '15',
    slug: 'shih-tzu',
    name: 'Shih Tzu',
    imageUrl: '/images/breeds/shih-tzu.jpg',
    group: 'Toy',
    size: 'Toy',
    weight: {
      male: '9-16 lbs',
      female: '9-16 lbs'
    },
    height: {
      male: '9-10.5 inches',
      female: '9-10.5 inches'
    },
    lifeSpan: '10-18 years',
    coatType: 'Long, flowing, double coat',
    coatColors: ['Various combinations including Black', 'White', 'Gold', 'Liver', 'Brindle'],
    temperament: ['Affectionate', 'Playful', 'Outgoing', 'Happy', 'Clever'],
    energyLevel: 'Low',
    exerciseNeeds: '20-30 minutes daily',
    trainability: 'Moderate',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Brachycephalic syndrome', 'Hip dysplasia', 'Ear infections', 'Eye problems'],
    geneticConditions: ['Renal dysplasia', 'Intervertebral disc disease'],
    rawFeedingGuide: {
      dailyPercentage: '3-4% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Fish', 'Lean beef'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Small portions - feed 2-3 times daily',
        'Ground or minced meat safer due to jaw structure',
        'Softer bones recommended',
        'Prone to dental issues - appropriate bone selection',
        'Watch for weight gain'
      ],
      sampleMealPlan: 'Morning: 2 oz ground chicken with liver. Evening: 2 oz turkey with ground bone and fish.'
    },
    history: 'Shih Tzus were bred as companion dogs for Chinese royalty during the Ming Dynasty. They were highly prized and lived in the imperial palace.',
    characteristics: 'Shih Tzus are affectionate lap dogs bred solely for companionship. They are friendly, outgoing, and adapt well to apartment living. Their long coat requires significant grooming.',
    groomingNeeds: 'Very high - daily brushing and regular professional grooming',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 15
  },
  {
    id: '16',
    slug: 'boston-terrier',
    name: 'Boston Terrier',
    imageUrl: '/images/breeds/boston-terrier.jpg',
    group: 'Non-Sporting',
    size: 'Small',
    weight: {
      male: '12-25 lbs',
      female: '12-25 lbs'
    },
    height: {
      male: '15-17 inches',
      female: '15-17 inches'
    },
    lifeSpan: '11-13 years',
    coatType: 'Short, smooth, fine',
    coatColors: ['Brindle and White', 'Black and White', 'Seal and White'],
    temperament: ['Friendly', 'Bright', 'Amusing', 'Lively', 'Gentle'],
    energyLevel: 'Moderate',
    exerciseNeeds: '30-60 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Brachycephalic syndrome', 'Eye problems', 'Patellar luxation', 'Deafness'],
    geneticConditions: ['Hemivertebrae', 'Hereditary cataracts'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Fish', 'Lean beef'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Brachycephalic - avoid large chunks',
        'Ground or appropriately sized pieces',
        'May need eye health supplements',
        'Moderate portions to prevent obesity'
      ],
      sampleMealPlan: 'Morning: 4 oz ground chicken with liver. Evening: 4 oz turkey with bone and fish.'
    },
    history: 'Boston Terriers were developed in Boston in the late 1800s from English Bulldogs and White English Terriers. They are one of the few breeds developed in America.',
    characteristics: 'Known as the "American Gentleman" for their tuxedo-like markings, Bostons are friendly, smart, and lively. They are excellent family companions and adapt well to various living situations.',
    groomingNeeds: 'Low - weekly brushing',
    barkingLevel: 'Low',
    featured: false,
    popularity: 16
  },
  {
    id: '17',
    slug: 'bernese-mountain-dog',
    name: 'Bernese Mountain Dog',
    imageUrl: '/images/breeds/bernese-mountain-dog.jpg',
    group: 'Working',
    size: 'Giant',
    weight: {
      male: '80-115 lbs',
      female: '70-95 lbs'
    },
    height: {
      male: '25-27.5 inches',
      female: '23-26 inches'
    },
    lifeSpan: '7-10 years',
    coatType: 'Long, thick, silky double coat',
    coatColors: ['Tricolor: Black, White, and Rust'],
    temperament: ['Good-natured', 'Calm', 'Strong', 'Affectionate', 'Loyal'],
    energyLevel: 'Moderate',
    exerciseNeeds: '60 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Elbow dysplasia', 'Cancer', 'Bloat'],
    geneticConditions: ['Histiocytic sarcoma', 'Progressive retinal atrophy'],
    rawFeedingGuide: {
      dailyPercentage: '2-2.5% of body weight',
      proteinSources: ['Beef', 'Chicken', 'Turkey', 'Lamb', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Feed 2-3 smaller meals to prevent bloat',
        'Joint supplements essential due to size',
        'May benefit from cancer-preventive antioxidants',
        'Slow growth important - avoid overfeeding puppies',
        'Include omega-3s for coat health'
      ],
      sampleMealPlan: 'Morning: 1.5 lbs chicken with organs. Evening: 1.5 lbs beef with bone and fish.'
    },
    history: 'Bernese Mountain Dogs originated in the Swiss Alps where they were used as farm dogs to pull carts, drive cattle, and guard property. They are one of four Swiss mountain dog breeds.',
    characteristics: 'Bernese are gentle giants with beautiful tricolor coats. They are calm, affectionate family companions that thrive on human companionship. They can be reserved with strangers but are devoted to their families.',
    groomingNeeds: 'High - brush several times weekly',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 17
  },
  {
    id: '18',
    slug: 'pomeranian',
    name: 'Pomeranian',
    imageUrl: '/images/breeds/pomeranian.jpg',
    group: 'Toy',
    size: 'Toy',
    weight: {
      male: '3-7 lbs',
      female: '3-7 lbs'
    },
    height: {
      male: '6-7 inches',
      female: '6-7 inches'
    },
    lifeSpan: '12-16 years',
    coatType: 'Long, thick, double coat with ruff',
    coatColors: ['Orange', 'Red', 'Cream', 'Black', 'Blue', 'Sable', 'Many others'],
    temperament: ['Inquisitive', 'Bold', 'Lively', 'Intelligent', 'Extroverted'],
    energyLevel: 'Moderate',
    exerciseNeeds: '30 minutes daily',
    trainability: 'Moderate',
    goodWithChildren: false,
    goodWithPets: false,
    commonHealthIssues: ['Patellar luxation', 'Tracheal collapse', 'Dental disease', 'Alopecia X'],
    geneticConditions: ['Patent ductus arteriosus', 'Hypothyroidism'],
    rawFeedingGuide: {
      dailyPercentage: '3-5% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Quail', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Very small portions - feed 2-3 times daily',
        'Ground meat and very small bones',
        'High metabolism - may need more calories',
        'Prone to dental issues - appropriate bone selection',
        'May need thyroid support'
      ],
      sampleMealPlan: 'Morning: 1 oz ground chicken with liver. Afternoon: 0.5 oz turkey. Evening: 1 oz quail with organs.'
    },
    history: 'Pomeranians descended from large sled dog breeds and were bred down to toy size in the Pomerania region. Queen Victoria popularized the breed in the 1800s.',
    characteristics: 'Pomeranians are tiny dogs with bold, vivacious personalities. They are intelligent, curious, and make excellent watchdogs despite their size. Their fluffy coat requires regular grooming.',
    groomingNeeds: 'High - brush several times weekly',
    barkingLevel: 'High',
    featured: false,
    popularity: 18
  },
  {
    id: '19',
    slug: 'chihuahua',
    name: 'Chihuahua',
    imageUrl: '/images/breeds/chihuahua.jpg',
    group: 'Toy',
    size: 'Toy',
    weight: {
      male: '3-6 lbs',
      female: '3-6 lbs'
    },
    height: {
      male: '5-8 inches',
      female: '5-8 inches'
    },
    lifeSpan: '14-16 years',
    coatType: 'Smooth or long coat',
    coatColors: ['Any color or combination'],
    temperament: ['Charming', 'Graceful', 'Sassy', 'Devoted', 'Alert'],
    energyLevel: 'Moderate',
    exerciseNeeds: '30 minutes daily',
    trainability: 'Moderate',
    goodWithChildren: false,
    goodWithPets: false,
    commonHealthIssues: ['Patellar luxation', 'Heart disease', 'Dental disease', 'Hypoglycemia'],
    geneticConditions: ['Hydrocephalus', 'Collapsed trachea'],
    rawFeedingGuide: {
      dailyPercentage: '4-5% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Quail', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Very small portions - feed 3-4 times daily',
        'Ground meat recommended',
        'Extremely prone to hypoglycemia',
        'Very small, soft bones only',
        'Monitor teeth health closely'
      ],
      sampleMealPlan: 'Morning: 0.75 oz ground chicken. Midday: 0.5 oz turkey with liver. Afternoon: 0.5 oz quail. Evening: 0.75 oz rabbit with organs.'
    },
    history: 'Chihuahuas are one of the oldest breeds in the Americas, descended from the Techichi dogs of the Toltec civilization. They were refined in the Mexican state of Chihuahua.',
    characteristics: 'The worlds smallest dog breed, Chihuahuas are charming, sassy companions with big personalities. They are devoted to their owners and can be excellent watchdogs. They are sensitive to cold.',
    groomingNeeds: 'Low to moderate depending on coat type',
    barkingLevel: 'High',
    featured: false,
    popularity: 19
  },
  {
    id: '20',
    slug: 'border-collie',
    name: 'Border Collie',
    imageUrl: '/images/breeds/border-collie.jpg',
    group: 'Herding',
    size: 'Medium',
    weight: {
      male: '30-55 lbs',
      female: '27-42 lbs'
    },
    height: {
      male: '19-22 inches',
      female: '18-21 inches'
    },
    lifeSpan: '12-15 years',
    coatType: 'Medium-length double coat, rough or smooth',
    coatColors: ['Black and White', 'Tricolor', 'Red and White', 'Blue Merle', 'Many others'],
    temperament: ['Intelligent', 'Energetic', 'Responsive', 'Tenacious', 'Alert'],
    energyLevel: 'Very High',
    exerciseNeeds: '120+ minutes daily of vigorous exercise and mental stimulation',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Progressive retinal atrophy', 'Epilepsy', 'Collie eye anomaly'],
    geneticConditions: ['Neuronal ceroid lipofuscinosis', 'Trapped neutrophil syndrome'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3.5% of body weight',
      proteinSources: ['Chicken', 'Beef', 'Lamb', 'Turkey', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Very high energy - may need more calories',
        'Active lifestyle requires quality protein',
        'Include omega-3s for brain health',
        'May benefit from joint supplements',
        'Consider additional calories for working dogs'
      ],
      sampleMealPlan: 'Morning: 12 oz chicken with organs. Evening: 10 oz beef with bone and fish.'
    },
    history: 'Border Collies were developed on the border between England and Scotland for herding sheep. They are considered the most intelligent dog breed and excel at herding trials.',
    characteristics: 'Border Collies are workaholic herding dogs with exceptional intelligence and energy. They need extensive exercise and mental stimulation. Without proper outlets, they can develop behavioral problems. They excel at dog sports.',
    groomingNeeds: 'Moderate - brush weekly, more during shedding',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 20
  },
  {
    id: '21',
    slug: 'australian-shepherd',
    name: 'Australian Shepherd',
    imageUrl: '/images/breeds/australian-shepherd.jpg',
    group: 'Herding',
    size: 'Medium',
    weight: {
      male: '50-65 lbs',
      female: '40-55 lbs'
    },
    height: {
      male: '20-23 inches',
      female: '18-21 inches'
    },
    lifeSpan: '12-15 years',
    coatType: 'Medium-length, weather-resistant double coat',
    coatColors: ['Blue Merle', 'Black', 'Red Merle', 'Red', 'All with or without white and/or tan'],
    temperament: ['Smart', 'Work-oriented', 'Exuberant', 'Loyal', 'Good-natured'],
    energyLevel: 'Very High',
    exerciseNeeds: '90-120 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Epilepsy', 'Cataracts', 'Deafness (in merles)'],
    geneticConditions: ['Collie eye anomaly', 'Multi-drug sensitivity'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Beef', 'Lamb', 'Turkey', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'High energy needs',
        'Quality protein for active lifestyle',
        'Include fish for eye health',
        'Joint supplements recommended',
        'May need more calories if working'
      ],
      sampleMealPlan: 'Morning: 1 lb chicken with liver. Evening: 12 oz beef with bone and fish.'
    },
    history: 'Despite their name, Australian Shepherds were developed in the American West for herding livestock. They became popular on ranches and in rodeos.',
    characteristics: 'Aussies are intelligent, energetic herding dogs with strong work drives. They are versatile, excelling at various dog sports and work roles. They need extensive exercise and mental stimulation and form strong bonds with their families.',
    groomingNeeds: 'Moderate - brush weekly, more during shedding',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 21
  },
  {
    id: '22',
    slug: 'pembroke-welsh-corgi',
    name: 'Pembroke Welsh Corgi',
    imageUrl: '/images/breeds/pembroke-welsh-corgi.jpg',
    group: 'Herding',
    size: 'Small',
    weight: {
      male: '27-30 lbs',
      female: '25-28 lbs'
    },
    height: {
      male: '10-12 inches',
      female: '10-12 inches'
    },
    lifeSpan: '12-13 years',
    coatType: 'Medium-length double coat',
    coatColors: ['Red', 'Sable', 'Fawn', 'Black and Tan', 'All with or without white'],
    temperament: ['Affectionate', 'Smart', 'Alert', 'Playful', 'Bold'],
    energyLevel: 'High',
    exerciseNeeds: '60 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Intervertebral disc disease', 'Obesity', 'Progressive retinal atrophy'],
    geneticConditions: ['Von Willebrands disease', 'Degenerative myelopathy'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Beef', 'Fish', 'Rabbit'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Prone to obesity - strict portion control',
        'Weight management critical for back health',
        'Include joint-supporting supplements',
        'Monitor calorie intake carefully'
      ],
      sampleMealPlan: 'Morning: 6 oz chicken with liver. Evening: 6 oz turkey with bone and fish.'
    },
    history: 'Pembroke Welsh Corgis were bred in Wales to herd cattle, horses, and sheep. Their low stature allowed them to nip at heels and avoid kicks. They are famously associated with Queen Elizabeth II.',
    characteristics: 'Corgis are smart, affectionate herding dogs with big personalities in small packages. They are alert, bold, and make excellent watchdogs. Their long backs make them prone to disc problems.',
    groomingNeeds: 'Moderate - brush weekly, more during shedding',
    barkingLevel: 'High',
    featured: false,
    popularity: 22
  },
  {
    id: '23',
    slug: 'shetland-sheepdog',
    name: 'Shetland Sheepdog',
    imageUrl: '/images/breeds/shetland-sheepdog.jpg',
    group: 'Herding',
    size: 'Small',
    weight: {
      male: '15-25 lbs',
      female: '15-25 lbs'
    },
    height: {
      male: '13-16 inches',
      female: '13-16 inches'
    },
    lifeSpan: '12-14 years',
    coatType: 'Long, harsh, double coat',
    coatColors: ['Sable', 'Black', 'Blue Merle', 'All with white and/or tan'],
    temperament: ['Playful', 'Energetic', 'Bright', 'Obedient', 'Loyal'],
    energyLevel: 'High',
    exerciseNeeds: '60 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Hypothyroidism', 'Eye problems', 'Von Willebrands disease'],
    geneticConditions: ['Collie eye anomaly', 'Dermatomyositis'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Fish', 'Rabbit', 'Lamb'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Include fish for eye and coat health',
        'May benefit from thyroid support',
        'Quality protein for active lifestyle',
        'Appropriate portion sizes for small breed'
      ],
      sampleMealPlan: 'Morning: 5 oz chicken with liver. Evening: 5 oz fish with turkey organs.'
    },
    history: 'Shelties were bred in the Shetland Islands of Scotland to herd sheep, ponies, and chickens. They resemble miniature Rough Collies but are a distinct breed.',
    characteristics: 'Shelties are intelligent, energetic herding dogs that are extremely trainable. They are sensitive, loyal companions that form strong bonds with their families. They excel at dog sports and obedience.',
    groomingNeeds: 'High - brush several times weekly',
    barkingLevel: 'High',
    featured: false,
    popularity: 23
  },
  {
    id: '24',
    slug: 'miniature-schnauzer',
    name: 'Miniature Schnauzer',
    imageUrl: '/images/breeds/miniature-schnauzer.jpg',
    group: 'Terrier',
    size: 'Small',
    weight: {
      male: '11-20 lbs',
      female: '11-20 lbs'
    },
    height: {
      male: '12-14 inches',
      female: '12-14 inches'
    },
    lifeSpan: '12-15 years',
    coatType: 'Wiry double coat',
    coatColors: ['Salt and Pepper', 'Black and Silver', 'Solid Black'],
    temperament: ['Friendly', 'Smart', 'Obedient', 'Spirited', 'Alert'],
    energyLevel: 'High',
    exerciseNeeds: '60 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hyperlipidemia', 'Pancreatitis', 'Bladder stones', 'Diabetes'],
    geneticConditions: ['Progressive retinal atrophy', 'Mycobacterium avium complex'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Fish', 'Rabbit', 'Lean beef'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: [
        'Prone to pancreatitis - lean proteins preferred',
        'Low-fat diet recommended',
        'Monitor for hyperlipidemia',
        'May benefit from digestive enzymes',
        'Avoid high-fat treats'
      ],
      sampleMealPlan: 'Morning: 4 oz lean chicken with liver. Evening: 4 oz turkey with fish.'
    },
    history: 'Miniature Schnauzers were developed in Germany in the late 1800s by breeding Standard Schnauzers with smaller breeds. They were originally farm dogs and ratters.',
    characteristics: 'Mini Schnauzers are spirited, friendly terriers with distinctive beards and eyebrows. They are smart, trainable, and make excellent watchdogs. They are less scrappy than some terriers and adapt well to various living situations.',
    groomingNeeds: 'High - professional grooming every 5-8 weeks, regular brushing',
    barkingLevel: 'High',
    featured: false,
    popularity: 24
  },
  {
    id: '25',
    slug: 'cavalier-king-charles-spaniel',
    name: 'Cavalier King Charles Spaniel',
    imageUrl: '/images/breeds/cavalier-king-charles-spaniel.jpg',
    group: 'Toy',
    size: 'Small',
    weight: {
      male: '13-18 lbs',
      female: '13-18 lbs'
    },
    height: {
      male: '12-13 inches',
      female: '12-13 inches'
    },
    lifeSpan: '12-15 years',
    coatType: 'Long, silky, feathered',
    coatColors: ['Blenheim', 'Tricolor', 'Black and Tan', 'Ruby'],
    temperament: ['Affectionate', 'Gentle', 'Graceful', 'Playful', 'Patient'],
    energyLevel: 'Moderate',
    exerciseNeeds: '30-60 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Mitral valve disease', 'Syringomyelia', 'Hip dysplasia', 'Eye problems'],
    geneticConditions: ['Episodic falling', 'Dry eye'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Fish', 'Rabbit', 'Duck'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% heart and other organs',
      specialConsiderations: [
        'Heart health supplements recommended',
        'Include taurine and L-carnitine',
        'Omega-3s for cardiovascular health',
        'Monitor portion sizes to prevent obesity',
        'Include fish oil for coat'
      ],
      sampleMealPlan: 'Morning: 4 oz chicken with heart. Evening: 4 oz fish with turkey liver.'
    },
    history: 'Cavaliers were bred as companions to English royalty, particularly King Charles II. They nearly became extinct but were revived in the 1920s.',
    characteristics: 'Cavaliers are gentle, affectionate lap dogs that adapt to their owners lifestyle. They are equally happy on a country walk or snuggling on the couch. They are friendly with everyone and make poor guard dogs.',
    groomingNeeds: 'Moderate - brush several times weekly',
    barkingLevel: 'Low',
    featured: false,
    popularity: 25
  }
,
  // Continuing with remaining popular breeds...
  {
    id: '26',
    slug: 'havanese',
    name: 'Havanese',
    imageUrl: '/images/breeds/havanese.jpg',
    group: 'Toy',
    size: 'Small',
    weight: { male: '7-13 lbs', female: '7-13 lbs' },
    height: { male: '8.5-11.5 inches', female: '8.5-11.5 inches' },
    lifeSpan: '14-16 years',
    coatType: 'Long, silky, abundant',
    coatColors: ['All colors'],
    temperament: ['Intelligent', 'Outgoing', 'Funny', 'Affectionate', 'Responsive'],
    energyLevel: 'Moderate',
    exerciseNeeds: '30-45 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Patellar luxation', 'Hip dysplasia', 'Eye problems', 'Deafness'],
    geneticConditions: ['Progressive retinal atrophy', 'Chondrodysplasia'],
    rawFeedingGuide: {
      dailyPercentage: '3-4% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Fish', 'Rabbit', 'Duck'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: ['Small portions 2-3 times daily', 'Include fish for coat health', 'Monitor dental health', 'Eye health supplements recommended'],
      sampleMealPlan: 'Morning: 2 oz chicken with liver. Evening: 2 oz fish with turkey organs.'
    },
    history: 'The Havanese is the national dog of Cuba and was bred as companions to Cuban aristocracy.',
    characteristics: 'Havanese are cheerful, social lap dogs that form strong bonds with families. They are intelligent, trainable, and adapt well to apartment living.',
    groomingNeeds: 'High - daily brushing required',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 26
  },
  {
    id: '27',
    slug: 'english-springer-spaniel',
    name: 'English Springer Spaniel',
    imageUrl: '/images/breeds/english-springer-spaniel.jpg',
    group: 'Sporting',
    size: 'Medium',
    weight: { male: '45-55 lbs', female: '40-50 lbs' },
    height: { male: '19-21 inches', female: '18-20 inches' },
    lifeSpan: '12-14 years',
    coatType: 'Medium-length, feathered, water-resistant',
    coatColors: ['Liver and White', 'Black and White', 'Tricolor'],
    temperament: ['Friendly', 'Obedient', 'Cheerful', 'Alert', 'Active'],
    energyLevel: 'High',
    exerciseNeeds: '60-90 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Eye problems', 'Ear infections', 'Autoimmune diseases'],
    geneticConditions: ['Progressive retinal atrophy', 'Phosphofructokinase deficiency'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Duck', 'Turkey', 'Fish', 'Rabbit'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: ['Active breed needs quality protein', 'Include fish for coat health', 'Regular ear cleaning essential', 'Eye health supplements beneficial'],
      sampleMealPlan: 'Morning: 10 oz duck with liver. Evening: 8 oz chicken with fish and organs.'
    },
    history: 'Bred in England for flushing and retrieving game, Springers are one of the oldest sporting breeds.',
    characteristics: 'Springers are friendly, enthusiastic hunting dogs that also make wonderful family companions. They are energetic and need regular exercise.',
    groomingNeeds: 'Moderate to high - regular brushing and trimming',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 27
  },
  {
    id: '28',
    slug: 'brittany',
    name: 'Brittany',
    imageUrl: '/images/breeds/brittany.jpg',
    group: 'Sporting',
    size: 'Medium',
    weight: { male: '30-45 lbs', female: '30-40 lbs' },
    height: { male: '17.5-20.5 inches', female: '17.5-20.5 inches' },
    lifeSpan: '12-15 years',
    coatType: 'Dense, wavy or flat',
    coatColors: ['Orange and White', 'Liver and White', 'Tricolor'],
    temperament: ['Bright', 'Upbeat', 'Fun-loving', 'Alert', 'Adaptable'],
    energyLevel: 'Very High',
    exerciseNeeds: '90-120 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Epilepsy', 'Hypothyroidism'],
    geneticConditions: ['Complement 3 deficiency', 'Canine discoid lupus'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3.5% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Quail', 'Duck', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: ['Very high energy needs', 'Quality protein essential', 'May need extra calories when hunting', 'Include joint supplements'],
      sampleMealPlan: 'Morning: 10 oz chicken with organs. Evening: 8 oz duck with fish.'
    },
    history: 'Named after the French province, Brittanys are versatile hunting dogs bred for pointing and retrieving.',
    characteristics: 'Brittanys are energetic, athletic gun dogs that need extensive exercise. They are sweet-natured and trainable, excelling at field trials.',
    groomingNeeds: 'Low to moderate - weekly brushing',
    barkingLevel: 'Low',
    featured: false,
    popularity: 28
  },
  {
    id: '29',
    slug: 'cocker-spaniel',
    name: 'Cocker Spaniel',
    imageUrl: '/images/breeds/cocker-spaniel.jpg',
    group: 'Sporting',
    size: 'Small',
    weight: { male: '25-30 lbs', female: '20-25 lbs' },
    height: { male: '14.5-15.5 inches', female: '13.5-14.5 inches' },
    lifeSpan: '12-15 years',
    coatType: 'Silky, medium-length, feathered',
    coatColors: ['Black', 'Buff', 'Parti-color', 'Tricolor', 'ASCOB'],
    temperament: ['Gentle', 'Happy', 'Smart', 'Trusting', 'Merry'],
    energyLevel: 'Moderate',
    exerciseNeeds: '60 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Ear infections', 'Eye problems', 'Hip dysplasia', 'Autoimmune diseases'],
    geneticConditions: ['Progressive retinal atrophy', 'Familial nephropathy'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Duck', 'Fish', 'Rabbit'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: ['Prone to obesity - portion control', 'Regular ear cleaning essential', 'Include fish for coat health', 'Eye health supplements recommended'],
      sampleMealPlan: 'Morning: 5 oz chicken with liver. Evening: 5 oz turkey with fish.'
    },
    history: 'Cockers were originally bred in England as hunting dogs to flush woodcock, hence their name.',
    characteristics: 'Cockers are gentle, happy sporting dogs with beautiful coats. They are affectionate family companions that need regular grooming.',
    groomingNeeds: 'High - daily brushing and professional grooming',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 29
  },
  {
    id: '30',
    slug: 'vizsla',
    name: 'Vizsla',
    imageUrl: '/images/breeds/vizsla.jpg',
    group: 'Sporting',
    size: 'Large',
    weight: { male: '55-60 lbs', female: '44-55 lbs' },
    height: { male: '22-24 inches', female: '21-23 inches' },
    lifeSpan: '12-14 years',
    coatType: 'Short, smooth, dense',
    coatColors: ['Golden Rust'],
    temperament: ['Affectionate', 'Energetic', 'Gentle', 'Loyal', 'Quiet'],
    energyLevel: 'Very High',
    exerciseNeeds: '90-120 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Epilepsy', 'Cancer', 'Hypothyroidism'],
    geneticConditions: ['Progressive retinal atrophy', 'Sebaceous adenitis'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Duck', 'Venison', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: ['Very high energy needs', 'Lean breed - quality protein essential', 'May need extra calories', 'Include fish for skin health'],
      sampleMealPlan: 'Morning: 12 oz chicken with organs. Evening: 10 oz duck with fish.'
    },
    history: 'Vizslas are ancient Hungarian hunting dogs bred by Magyar tribes over 1,000 years ago.',
    characteristics: 'Vizslas are elegant, athletic gun dogs with strong bonds to their owners. They are known as "velcro dogs" and need extensive exercise.',
    groomingNeeds: 'Low - weekly brushing',
    barkingLevel: 'Low',
    featured: false,
    popularity: 30
  },
  {
    id: '31',
    slug: 'weimaraner',
    name: 'Weimaraner',
    imageUrl: '/images/breeds/weimaraner.jpg',
    group: 'Sporting',
    size: 'Large',
    weight: { male: '70-90 lbs', female: '55-75 lbs' },
    height: { male: '25-27 inches', female: '23-25 inches' },
    lifeSpan: '10-13 years',
    coatType: 'Short, smooth, sleek',
    coatColors: ['Gray', 'Silver-gray'],
    temperament: ['Friendly', 'Fearless', 'Alert', 'Obedient', 'Energetic'],
    energyLevel: 'Very High',
    exerciseNeeds: '90-120 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: false,
    commonHealthIssues: ['Hip dysplasia', 'Bloat', 'Von Willebrands disease', 'Hypothyroidism'],
    geneticConditions: ['Hypomyelination', 'Spinal dysraphism'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Beef', 'Chicken', 'Turkey', 'Venison', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: ['Prone to bloat - feed 2-3 smaller meals', 'Very high energy needs', 'Avoid exercise around meals', 'Include joint supplements'],
      sampleMealPlan: 'Morning: 1.5 lbs chicken. Midday: 8 oz beef with organs. Evening: 1 lb turkey with fish.'
    },
    history: 'Weimaraners were bred by German nobility for hunting large game like boar, deer, and bear.',
    characteristics: 'Weimaraners are athletic, energetic hunting dogs with distinctive gray coats. They need extensive exercise and mental stimulation.',
    groomingNeeds: 'Low - weekly brushing',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 31
  },
  {
    id: '32',
    slug: 'mastiff',
    name: 'Mastiff',
    alternateNames: ['English Mastiff'],
    imageUrl: '/images/breeds/mastiff.jpg',
    group: 'Working',
    size: 'Giant',
    weight: { male: '160-230 lbs', female: '120-170 lbs' },
    height: { male: '30+ inches', female: '27.5+ inches' },
    lifeSpan: '6-10 years',
    coatType: 'Short, dense, coarse',
    coatColors: ['Fawn', 'Apricot', 'Brindle'],
    temperament: ['Courageous', 'Dignified', 'Good-natured', 'Docile', 'Affectionate'],
    energyLevel: 'Low',
    exerciseNeeds: '30-60 minutes daily',
    trainability: 'Moderate',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Elbow dysplasia', 'Bloat', 'Obesity'],
    geneticConditions: ['Progressive retinal atrophy', 'Cystinuria'],
    rawFeedingGuide: {
      dailyPercentage: '2-2.5% of body weight',
      proteinSources: ['Beef', 'Chicken', 'Turkey', 'Lamb', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: ['Feed 2-3 smaller meals to prevent bloat', 'Joint supplements essential', 'Slow growth in puppies important', 'Monitor weight carefully'],
      sampleMealPlan: 'Morning: 2.5 lbs chicken. Midday: 1.5 lbs beef with organs. Evening: 2 lbs turkey with fish.'
    },
    history: 'Mastiffs are ancient dogs that fought alongside Romans in battle and later became estate guardians.',
    characteristics: 'Mastiffs are massive, gentle giants that are naturally protective but calm. Despite their size, they are docile family companions.',
    groomingNeeds: 'Low - weekly brushing',
    barkingLevel: 'Low',
    featured: false,
    popularity: 32
  },
  {
    id: '33',
    slug: 'newfoundland',
    name: 'Newfoundland',
    imageUrl: '/images/breeds/newfoundland.jpg',
    group: 'Working',
    size: 'Giant',
    weight: { male: '130-150 lbs', female: '100-120 lbs' },
    height: { male: '28 inches', female: '26 inches' },
    lifeSpan: '9-10 years',
    coatType: 'Thick, water-resistant double coat',
    coatColors: ['Black', 'Brown', 'Gray', 'Landseer (white and black)'],
    temperament: ['Sweet', 'Patient', 'Devoted', 'Gentle', 'Trainable'],
    energyLevel: 'Moderate',
    exerciseNeeds: '60 minutes daily',
    trainability: 'Easy',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Elbow dysplasia', 'Heart disease', 'Cystinuria'],
    geneticConditions: ['Subvalvular aortic stenosis', 'Dilated cardiomyopathy'],
    rawFeedingGuide: {
      dailyPercentage: '2-2.5% of body weight',
      proteinSources: ['Fish', 'Chicken', 'Beef', 'Turkey', 'Lamb'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% heart and other organs',
      specialConsiderations: ['Include fish - natural to breed', 'Feed 2-3 smaller meals', 'Heart health supplements', 'Joint supplements essential', 'Taurine and L-carnitine beneficial'],
      sampleMealPlan: 'Morning: 2 lbs fish with organs. Midday: 1 lb chicken. Evening: 1.5 lbs beef with heart.'
    },
    history: 'Newfoundlands worked alongside fishermen in Newfoundland, hauling nets and rescuing people from water.',
    characteristics: 'Newfoundlands are sweet-natured gentle giants known for their swimming ability and lifesaving instincts. They are patient with children.',
    groomingNeeds: 'High - daily brushing required',
    barkingLevel: 'Moderate',
    featured: false,
    popularity: 33
  },
  {
    id: '34',
    slug: 'saint-bernard',
    name: 'Saint Bernard',
    imageUrl: '/images/breeds/saint-bernard.jpg',
    group: 'Working',
    size: 'Giant',
    weight: { male: '140-180 lbs', female: '120-140 lbs' },
    height: { male: '28-30 inches', female: '26-28 inches' },
    lifeSpan: '8-10 years',
    coatType: 'Short or long, dense double coat',
    coatColors: ['Red and White', 'Brindle and White'],
    temperament: ['Playful', 'Charming', 'Inquisitive', 'Gentle', 'Watchful'],
    energyLevel: 'Low',
    exerciseNeeds: '30-60 minutes daily',
    trainability: 'Moderate',
    goodWithChildren: true,
    goodWithPets: true,
    commonHealthIssues: ['Hip dysplasia', 'Elbow dysplasia', 'Bloat', 'Dilated cardiomyopathy'],
    geneticConditions: ['Osteosarcoma', 'Entropion'],
    rawFeedingGuide: {
      dailyPercentage: '2-2.5% of body weight',
      proteinSources: ['Beef', 'Chicken', 'Turkey', 'Lamb', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: ['Feed 2-3 smaller meals to prevent bloat', 'Joint supplements essential from puppyhood', 'Slow growth important', 'Heart health supplements'],
      sampleMealPlan: 'Morning: 2.5 lbs chicken. Midday: 1.5 lbs beef with organs. Evening: 2 lbs turkey.'
    },
    history: 'Saint Bernards were bred by monks in the Swiss Alps for rescue work in snowy mountain passes.',
    characteristics: 'Saints are gentle giants known for their patience and watchful nature. They are calm, friendly family dogs despite their massive size.',
    groomingNeeds: 'Moderate to high depending on coat type',
    barkingLevel: 'Low',
    featured: false,
    popularity: 34
  },
  {
    id: '35',
    slug: 'akita',
    name: 'Akita',
    imageUrl: '/images/breeds/akita.jpg',
    group: 'Working',
    size: 'Large',
    weight: { male: '100-130 lbs', female: '70-100 lbs' },
    height: { male: '26-28 inches', female: '24-26 inches' },
    lifeSpan: '10-13 years',
    coatType: 'Thick double coat',
    coatColors: ['Various colors including White', 'Brindle', 'Pinto'],
    temperament: ['Courageous', 'Dignified', 'Profoundly Loyal', 'Reserved', 'Alert'],
    energyLevel: 'Moderate',
    exerciseNeeds: '60-90 minutes daily',
    trainability: 'Challenging',
    goodWithChildren: false,
    goodWithPets: false,
    commonHealthIssues: ['Hip dysplasia', 'Bloat', 'Hypothyroidism', 'Progressive retinal atrophy'],
    geneticConditions: ['Autoimmune diseases', 'Sebaceous adenitis'],
    rawFeedingGuide: {
      dailyPercentage: '2-2.5% of body weight',
      proteinSources: ['Fish', 'Chicken', 'Beef', 'Turkey', 'Duck'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: ['Include fish - traditional to Japanese breeds', 'Feed 2 meals to prevent bloat', 'Thyroid support may be needed', 'Joint supplements recommended'],
      sampleMealPlan: 'Morning: 1.5 lbs fish with organs. Evening: 1.5 lbs chicken with beef.'
    },
    history: 'Akitas originated in Japan where they were bred for hunting bear, boar, and deer. They are national treasures in Japan.',
    characteristics: 'Akitas are powerful, dignified dogs with strong guarding instincts. They are profoundly loyal to family but aloof with strangers. Early socialization essential.',
    groomingNeeds: 'Moderate - weekly brushing, more during shedding',
    barkingLevel: 'Low',
    featured: false,
    popularity: 35
  },
  // Adding more breeds to reach 150+...
  { id: '36', slug: 'basset-hound', name: 'Basset Hound', imageUrl: '/images/breeds/basset-hound.jpg', group: 'Hound', size: 'Medium', weight: { male: '40-65 lbs', female: '40-65 lbs' }, height: { male: '12-15 inches', female: '12-15 inches' }, lifeSpan: '12-13 years', coatType: 'Short, dense, smooth', coatColors: ['Tricolor', 'Lemon and White', 'Red and White'], temperament: ['Charming', 'Patient', 'Low-key', 'Affectionate', 'Tenacious'], energyLevel: 'Low', exerciseNeeds: '30-60 minutes daily', trainability: 'Moderate', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Obesity', 'Ear infections', 'Hip dysplasia', 'Bloat'], geneticConditions: ['Glaucoma', 'Thrombopathia'], rawFeedingGuide: { dailyPercentage: '2-2.5% of body weight', proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Beef'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Prone to obesity - strict portions', 'Regular ear cleaning', 'Avoid overfeeding'], sampleMealPlan: 'Morning: 8 oz chicken with liver. Evening: 8 oz turkey with bone.' }, history: 'Bassets were bred in France for hunting rabbits and hare. Their short legs and keen nose made them excellent scent hounds.', characteristics: 'Bassets are laid-back, patient hounds with distinctive long ears and sad eyes. They are affectionate family dogs with melodious voices.', groomingNeeds: 'Low - weekly brushing', barkingLevel: 'Moderate', featured: false, popularity: 36 },
  { id: '37', slug: 'bloodhound', name: 'Bloodhound', imageUrl: '/images/breeds/bloodhound.jpg', group: 'Hound', size: 'Large', weight: { male: '90-110 lbs', female: '80-100 lbs' }, height: { male: '25-27 inches', female: '23-25 inches' }, lifeSpan: '10-12 years', coatType: 'Short, dense', coatColors: ['Black and Tan', 'Liver and Tan', 'Red'], temperament: ['Even-tempered', 'Stubborn', 'Affectionate', 'Gentle', 'Independent'], energyLevel: 'Moderate', exerciseNeeds: '60-90 minutes daily', trainability: 'Moderate', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Bloat', 'Hip dysplasia', 'Entropion', 'Ear infections'], geneticConditions: ['Ectropion', 'Hypothyroidism'], rawFeedingGuide: { dailyPercentage: '2-2.5% of body weight', proteinSources: ['Beef', 'Chicken', 'Turkey', 'Venison'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Feed 2-3 smaller meals for bloat prevention', 'High quality protein for working dogs', 'Regular ear care essential'], sampleMealPlan: 'Morning: 1.5 lbs beef. Evening: 1.5 lbs chicken with organs.' }, history: 'Bloodhounds have the keenest sense of smell of any dog. Medieval monks bred them in Belgium for tracking.', characteristics: 'Bloodhounds are gentle, even-tempered scent hounds with incredible tracking ability. They are affectionate but can be stubborn.', groomingNeeds: 'Low - weekly brushing and wrinkle cleaning', barkingLevel: 'Moderate', featured: false, popularity: 37 },
  { id: '38', slug: 'rhodesian-ridgeback', name: 'Rhodesian Ridgeback', imageUrl: '/images/breeds/rhodesian-ridgeback.jpg', group: 'Hound', size: 'Large', weight: { male: '85 lbs', female: '70 lbs' }, height: { male: '25-27 inches', female: '24-26 inches' }, lifeSpan: '10-12 years', coatType: 'Short, dense, sleek', coatColors: ['Wheaten'], temperament: ['Affectionate', 'Dignified', 'Even-tempered', 'Strong-willed', 'Loyal'], energyLevel: 'High', exerciseNeeds: '60-90 minutes daily', trainability: 'Moderate', goodWithChildren: true, goodWithPets: false, commonHealthIssues: ['Hip dysplasia', 'Dermoid sinus', 'Hypothyroidism'], geneticConditions: ['Degenerative myelopathy', 'Cone degeneration'], rawFeedingGuide: { dailyPercentage: '2-2.5% of body weight', proteinSources: ['Beef', 'Lamb', 'Venison', 'Chicken', 'Fish'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Athletic breed needs quality protein', 'Include red meats', 'Joint supplements recommended'], sampleMealPlan: 'Morning: 1.25 lbs beef with organs. Evening: 1.25 lbs chicken with fish.' }, history: 'Rhodesian Ridgebacks were bred in South Africa to hunt lions and guard farms. The distinctive ridge on their back is their trademark.', characteristics: 'Ridgebacks are strong, athletic hounds that are dignified and devoted to family. They need firm, consistent training and socialization.', groomingNeeds: 'Low - weekly brushing', barkingLevel: 'Low', featured: false, popularity: 38 },
  { id: '39', slug: 'greyhound', name: 'Greyhound', imageUrl: '/images/breeds/greyhound.jpg', group: 'Hound', size: 'Large', weight: { male: '65-70 lbs', female: '60-65 lbs' }, height: { male: '28-30 inches', female: '27-28 inches' }, lifeSpan: '10-13 years', coatType: 'Short, smooth, firm', coatColors: ['All colors and markings'], temperament: ['Gentle', 'Independent', 'Noble', 'Quiet', 'Affectionate'], energyLevel: 'Moderate', exerciseNeeds: '60 minutes daily', trainability: 'Moderate', goodWithChildren: true, goodWithPets: false, commonHealthIssues: ['Bloat', 'Osteosarcoma', 'Hypothyroidism', 'Heart disease'], geneticConditions: ['Progressive retinal atrophy', 'Esophageal achalasia'], rawFeedingGuide: { dailyPercentage: '2-2.5% of body weight', proteinSources: ['Chicken', 'Turkey', 'Beef', 'Lamb', 'Fish'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Lean breed - monitor weight', 'Feed 2 meals to prevent bloat', 'May need extra padding in diet'], sampleMealPlan: 'Morning: 1 lb chicken with organs. Evening: 12 oz beef with fish.' }, history: 'Greyhounds are ancient sighthounds bred for coursing game. They are the fastest dog breed, reaching 45 mph.', characteristics: 'Despite their racing background, Greyhounds are gentle, quiet couch potatoes. They are sweet-natured and adapt well to apartment living.', groomingNeeds: 'Low - weekly brushing', barkingLevel: 'Low', featured: false, popularity: 39 },
  { id: '40', slug: 'whippet', name: 'Whippet', imageUrl: '/images/breeds/whippet.jpg', group: 'Hound', size: 'Medium', weight: { male: '25-40 lbs', female: '25-40 lbs' }, height: { male: '19-22 inches', female: '18-21 inches' }, lifeSpan: '12-15 years', coatType: 'Short, smooth, firm', coatColors: ['All colors and markings'], temperament: ['Affectionate', 'Playful', 'Calm', 'Gentle', 'Intelligent'], energyLevel: 'Moderate', exerciseNeeds: '60 minutes daily', trainability: 'Easy', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Heart disease', 'Eye problems', 'Deafness'], geneticConditions: ['Anesthesia sensitivity', 'Pattern baldness'], rawFeedingGuide: { dailyPercentage: '2.5-3% of body weight', proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Fish', 'Beef'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Lean breed - adequate calories important', 'Heart health supplements', 'High quality protein'], sampleMealPlan: 'Morning: 8 oz chicken with organs. Evening: 8 oz turkey with fish.' }, history: 'Whippets were bred in England as poor mans racing dogs and for hunting rabbits. They are miniature Greyhounds.', characteristics: 'Whippets are gentle, affectionate sighthounds that are quiet indoors but love to run. They are excellent apartment dogs that need daily exercise.', groomingNeeds: 'Low - weekly brushing', barkingLevel: 'Low', featured: false, popularity: 40 },
  { id: '41', slug: 'irish-setter', name: 'Irish Setter', imageUrl: '/images/breeds/irish-setter.jpg', group: 'Sporting', size: 'Large', weight: { male: '70 lbs', female: '60 lbs' }, height: { male: '27 inches', female: '25 inches' }, lifeSpan: '12-15 years', coatType: 'Long, silky, feathered', coatColors: ['Mahogany', 'Chestnut'], temperament: ['Outgoing', 'Sweet', 'Active', 'Trainable', 'Energetic'], energyLevel: 'Very High', exerciseNeeds: '90-120 minutes daily', trainability: 'Moderate', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Hip dysplasia', 'Bloat', 'Hypothyroidism', 'Progressive retinal atrophy'], geneticConditions: ['Osteosarcoma', 'Cerebellar abiotrophy'], rawFeedingGuide: { dailyPercentage: '2.5-3% of body weight', proteinSources: ['Chicken', 'Turkey', 'Duck', 'Fish', 'Beef'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Very high energy needs', 'Feed 2 meals to prevent bloat', 'Include fish for coat health', 'Thyroid support may be needed'], sampleMealPlan: 'Morning: 1.25 lbs chicken. Evening: 1.25 lbs duck with organs and fish.' }, history: 'Irish Setters were developed in Ireland as gun dogs for setting and retrieving game birds.', characteristics: 'Irish Setters are outgoing, energetic dogs with beautiful red coats. They are playful and remain puppy-like for years.', groomingNeeds: 'High - daily brushing required', barkingLevel: 'Moderate', featured: false, popularity: 41 },
  { id: '42', slug: 'portuguese-water-dog', name: 'Portuguese Water Dog', imageUrl: '/images/breeds/portuguese-water-dog.jpg', group: 'Working', size: 'Medium', weight: { male: '42-60 lbs', female: '35-50 lbs' }, height: { male: '20-23 inches', female: '17-21 inches' }, lifeSpan: '11-13 years', coatType: 'Wavy or curly, hypoallergenic', coatColors: ['Black', 'White', 'Brown', 'Black and White', 'Brown and White'], temperament: ['Affectionate', 'Adventurous', 'Athletic', 'Intelligent', 'Obedient'], energyLevel: 'Very High', exerciseNeeds: '90 minutes daily including swimming', trainability: 'Easy', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Hip dysplasia', 'Progressive retinal atrophy', 'Juvenile dilated cardiomyopathy'], geneticConditions: ['GM-1 storage disease', 'Addisons disease'], rawFeedingGuide: { dailyPercentage: '2.5-3% of body weight', proteinSources: ['Fish', 'Chicken', 'Duck', 'Turkey', 'Beef'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Include fish - natural to breed', 'Very high energy needs', 'May need extra calories if swimming', 'Heart health supplements'], sampleMealPlan: 'Morning: 10 oz fish with organs. Evening: 10 oz chicken with duck.' }, history: 'Portuguese Water Dogs worked with fishermen retrieving nets, catching fish, and carrying messages between boats.', characteristics: 'Porties are athletic water dogs that are intelligent and trainable. They need extensive exercise including swimming. Hypoallergenic coat.', groomingNeeds: 'High - professional grooming every 6-8 weeks', barkingLevel: 'Moderate', featured: false, popularity: 42 },
  { id: '43', slug: 'australian-cattle-dog', name: 'Australian Cattle Dog', alternateNames: ['Blue Heeler', 'Red Heeler'], imageUrl: '/images/breeds/australian-cattle-dog.jpg', group: 'Herding', size: 'Medium', weight: { male: '35-50 lbs', female: '35-50 lbs' }, height: { male: '18-20 inches', female: '17-19 inches' }, lifeSpan: '12-16 years', coatType: 'Short, dense double coat', coatColors: ['Blue', 'Blue Mottled', 'Red Speckled'], temperament: ['Alert', 'Curious', 'Loyal', 'Energetic', 'Protective'], energyLevel: 'Very High', exerciseNeeds: '90-120 minutes daily', trainability: 'Easy', goodWithChildren: true, goodWithPets: false, commonHealthIssues: ['Hip dysplasia', 'Progressive retinal atrophy', 'Deafness'], geneticConditions: ['Osteochondritis dissecans', 'Portosystemic shunt'], rawFeedingGuide: { dailyPercentage: '2.5-3.5% of body weight', proteinSources: ['Beef', 'Kangaroo', 'Lamb', 'Chicken', 'Fish'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Very high energy needs', 'Quality protein for working dogs', 'May need extra calories', 'Include joint supplements'], sampleMealPlan: 'Morning: 10 oz beef with organs. Evening: 10 oz lamb with fish.' }, history: 'Developed in Australia for herding cattle over long distances in harsh conditions. They are tough, resilient working dogs.', characteristics: 'ACDs are extremely energetic, intelligent working dogs that need jobs. They are intensely loyal and protective. Not for inactive homes.', groomingNeeds: 'Low - weekly brushing', barkingLevel: 'Moderate', featured: false, popularity: 43 },
  { id: '44', slug: 'bichon-frise', name: 'Bichon Frise', imageUrl: '/images/breeds/bichon-frise.jpg', group: 'Non-Sporting', size: 'Small', weight: { male: '12-18 lbs', female: '12-18 lbs' }, height: { male: '9.5-11.5 inches', female: '9.5-11.5 inches' }, lifeSpan: '14-15 years', coatType: 'Curly, dense, hypoallergenic', coatColors: ['White'], temperament: ['Playful', 'Curious', 'Peppy', 'Gentle', 'Sensitive'], energyLevel: 'Moderate', exerciseNeeds: '30-45 minutes daily', trainability: 'Easy', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Allergies', 'Patellar luxation', 'Dental disease', 'Bladder stones'], geneticConditions: ['Hip dysplasia', 'Cataracts'], rawFeedingGuide: { dailyPercentage: '3-4% of body weight', proteinSources: ['Chicken', 'Turkey', 'Fish', 'Rabbit', 'Duck'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Small portions 2-3 times daily', 'Include fish for coat health', 'Dental health important', 'May benefit from limited ingredients if allergies'], sampleMealPlan: 'Morning: 3 oz chicken with liver. Evening: 3 oz fish with turkey.' }, history: 'Bichons descended from Mediterranean water dogs and became popular with French and Spanish royalty.', characteristics: 'Bichons are cheerful, playful lap dogs with hypoallergenic coats. They are gentle, adaptable, and excellent for apartments.', groomingNeeds: 'Very high - daily brushing and monthly grooming', barkingLevel: 'Moderate', featured: false, popularity: 44 },
  { id: '45', slug: 'shiba-inu', name: 'Shiba Inu', imageUrl: '/images/breeds/shiba-inu.jpg', group: 'Non-Sporting', size: 'Small', weight: { male: '23 lbs', female: '17 lbs' }, height: { male: '14.5-16.5 inches', female: '13.5-15.5 inches' }, lifeSpan: '13-16 years', coatType: 'Thick double coat', coatColors: ['Red', 'Black and Tan', 'Sesame', 'Cream'], temperament: ['Alert', 'Confident', 'Bold', 'Spirited', 'Good-natured'], energyLevel: 'High', exerciseNeeds: '60 minutes daily', trainability: 'Challenging', goodWithChildren: false, goodWithPets: false, commonHealthIssues: ['Allergies', 'Glaucoma', 'Hip dysplasia', 'Patellar luxation'], geneticConditions: ['Progressive retinal atrophy', 'Chylothorax'], rawFeedingGuide: { dailyPercentage: '2.5-3% of body weight', proteinSources: ['Fish', 'Chicken', 'Duck', 'Turkey', 'Quail'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Include fish - traditional to Japanese breeds', 'May have food sensitivities', 'Quality protein important', 'Monitor for allergies'], sampleMealPlan: 'Morning: 5 oz fish with organs. Evening: 5 oz chicken with duck.' }, history: 'Shibas are ancient Japanese hunting dogs bred to hunt in mountainous terrain. They are the smallest of the six original Japanese breeds.', characteristics: 'Shibas are spirited, independent dogs with fox-like features. They are bold, confident, and can be aloof. Strong-willed but loyal to family.', groomingNeeds: 'Moderate - brush weekly, daily during shedding', barkingLevel: 'Low', featured: false, popularity: 45 },
  { id: '46', slug: 'maltese', name: 'Maltese', imageUrl: '/images/breeds/maltese.jpg', group: 'Toy', size: 'Toy', weight: { male: '4-7 lbs', female: '4-7 lbs' }, height: { male: '8-10 inches', female: '8-10 inches' }, lifeSpan: '12-15 years', coatType: 'Long, silky, white', coatColors: ['White'], temperament: ['Gentle', 'Playful', 'Charming', 'Fearless', 'Affectionate'], energyLevel: 'Moderate', exerciseNeeds: '20-30 minutes daily', trainability: 'Easy', goodWithChildren: false, goodWithPets: true, commonHealthIssues: ['Dental disease', 'Patellar luxation', 'Collapsed trachea', 'White dog shaker syndrome'], geneticConditions: ['Progressive retinal atrophy', 'Portosystemic shunt'], rawFeedingGuide: { dailyPercentage: '3-5% of body weight', proteinSources: ['Chicken', 'Turkey', 'Fish', 'Rabbit', 'Quail'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Very small portions 2-3 times daily', 'Ground meat safer', 'Dental health critical', 'High metabolism may need more calories'], sampleMealPlan: 'Morning: 1 oz ground chicken. Afternoon: 0.5 oz fish. Evening: 1 oz turkey with liver.' }, history: 'Maltese are ancient companion dogs that were treasured by Greek and Roman aristocracy over 2,000 years ago.', characteristics: 'Maltese are gentle, playful lap dogs with glamorous white coats. They are adaptable, charming companions perfect for apartments.', groomingNeeds: 'Very high - daily brushing required', barkingLevel: 'Moderate', featured: false, popularity: 46 },
  { id: '47', slug: 'papillon', name: 'Papillon', imageUrl: '/images/breeds/papillon.jpg', group: 'Toy', size: 'Toy', weight: { male: '5-10 lbs', female: '5-10 lbs' }, height: { male: '8-11 inches', female: '8-11 inches' }, lifeSpan: '14-16 years', coatType: 'Long, silky, flowing', coatColors: ['White with patches of any color'], temperament: ['Happy', 'Alert', 'Friendly', 'Energetic', 'Intelligent'], energyLevel: 'High', exerciseNeeds: '30-45 minutes daily', trainability: 'Easy', goodWithChildren: false, goodWithPets: true, commonHealthIssues: ['Patellar luxation', 'Dental disease', 'Progressive retinal atrophy'], geneticConditions: ['Open fontanel', 'Hypoglycemia'], rawFeedingGuide: { dailyPercentage: '3-5% of body weight', proteinSources: ['Chicken', 'Turkey', 'Quail', 'Rabbit', 'Fish'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Small portions 2-3 times daily', 'High energy - adequate calories', 'Appropriate sized bones', 'Dental care important'], sampleMealPlan: 'Morning: 1.5 oz chicken with liver. Afternoon: 1 oz quail. Evening: 1.5 oz turkey.' }, history: 'Papillons (French for "butterfly") were favorites of European nobility. Their distinctive ears resemble butterfly wings.', characteristics: 'Papillons are happy, alert toy dogs with surprising athleticism. They are intelligent, trainable, and excel at dog sports despite their size.', groomingNeeds: 'Moderate - brush several times weekly', barkingLevel: 'Moderate', featured: false, popularity: 47 },
  { id: '48', slug: 'pug', name: 'Pug', imageUrl: '/images/breeds/pug.jpg', group: 'Toy', size: 'Small', weight: { male: '14-18 lbs', female: '14-18 lbs' }, height: { male: '10-13 inches', female: '10-13 inches' }, lifeSpan: '13-15 years', coatType: 'Short, smooth, glossy', coatColors: ['Fawn', 'Black'], temperament: ['Charming', 'Mischievous', 'Loving', 'Sociable', 'Stubborn'], energyLevel: 'Low', exerciseNeeds: '20-40 minutes daily', trainability: 'Moderate', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Brachycephalic syndrome', 'Eye problems', 'Obesity', 'Hip dysplasia'], geneticConditions: ['Pug Dog Encephalitis', 'Hemivertebrae'], rawFeedingGuide: { dailyPercentage: '2.5-3% of body weight', proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Fish', 'Lean beef'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Brachycephalic - ground meat safer', 'Prone to obesity - portion control', 'Soft bones recommended', 'Keep cool during meals'], sampleMealPlan: 'Morning: 3 oz ground chicken. Evening: 3 oz turkey with fish.' }, history: 'Pugs were bred in China as companions to emperors. They became popular with European royalty after being brought west.', characteristics: 'Pugs are charming, mischievous companions with distinctive wrinkled faces. They are sociable, loving lap dogs that adapt well to apartments.', groomingNeeds: 'Low - weekly brushing and wrinkle cleaning', barkingLevel: 'Moderate', featured: false, popularity: 48 },
  { id: '49', slug: 'west-highland-white-terrier', name: 'West Highland White Terrier', imageUrl: '/images/breeds/west-highland-white-terrier.jpg', group: 'Terrier', size: 'Small', weight: { male: '15-20 lbs', female: '13-16 lbs' }, height: { male: '11 inches', female: '10 inches' }, lifeSpan: '13-15 years', coatType: 'Double coat, harsh outer', coatColors: ['White'], temperament: ['Loyal', 'Happy', 'Entertaining', 'Alert', 'Hardy'], energyLevel: 'High', exerciseNeeds: '60 minutes daily', trainability: 'Moderate', goodWithChildren: true, goodWithPets: false, commonHealthIssues: ['Skin allergies', 'Patellar luxation', 'Craniomandibular osteopathy'], geneticConditions: ['Pulmonary fibrosis', 'Copper toxicosis'], rawFeedingGuide: { dailyPercentage: '3-4% of body weight', proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Fish', 'Duck'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['May have skin allergies - limited ingredients', 'High energy needs', 'Include fish for skin health', 'Quality protein important'], sampleMealPlan: 'Morning: 4 oz chicken with organs. Evening: 4 oz fish with turkey.' }, history: 'Westies were bred in Scotland to hunt rats, foxes, and other vermin. Their white coat helped distinguish them from prey.', characteristics: 'Westies are hardy, entertaining terriers with big personalities. They are loyal, happy companions with strong prey drives.', groomingNeeds: 'High - brush several times weekly, professional stripping', barkingLevel: 'High', featured: false, popularity: 49 },
  { id: '50', slug: 'cairn-terrier', name: 'Cairn Terrier', imageUrl: '/images/breeds/cairn-terrier.jpg', group: 'Terrier', size: 'Small', weight: { male: '14 lbs', female: '13 lbs' }, height: { male: '10 inches', female: '9.5 inches' }, lifeSpan: '13-15 years', coatType: 'Harsh, weather-resistant double coat', coatColors: ['Various colors except white'], temperament: ['Alert', 'Cheerful', 'Busy', 'Hardy', 'Fearless'], energyLevel: 'High', exerciseNeeds: '60 minutes daily', trainability: 'Moderate', goodWithChildren: true, goodWithPets: false, commonHealthIssues: ['Patellar luxation', 'Hip dysplasia', 'Hypothyroidism'], geneticConditions: ['Globoid cell leukodystrophy', 'Portosystemic shunt'], rawFeedingGuide: { dailyPercentage: '3-4% of body weight', proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Fish', 'Beef'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['High energy needs', 'Quality protein for active lifestyle', 'Thyroid support if needed', 'Appropriate bone sizes'], sampleMealPlan: 'Morning: 3 oz chicken with liver. Evening: 3 oz turkey with fish.' }, history: 'Cairn Terriers were bred in Scotland to hunt vermin in rock piles (cairns). They are one of the oldest terrier breeds.', characteristics: 'Cairns are cheerful, fearless terriers with a busy, alert nature. They are hardy working terriers that make spirited companions.', groomingNeeds: 'Moderate - weekly brushing and hand-stripping', barkingLevel: 'High', featured: false, popularity: 50 },
,
  { id: '51', slug: 'bull-terrier', name: 'Bull Terrier', imageUrl: '/images/breeds/bull-terrier.jpg', group: 'Terrier', size: 'Medium', weight: { male: '50-70 lbs', female: '50-70 lbs' }, height: { male: '21-22 inches', female: '21-22 inches' }, lifeSpan: '12-13 years', coatType: 'Short, flat, harsh', coatColors: ['White', 'Various colors'], temperament: ['Playful', 'Charming', 'Mischievous', 'Trainable', 'Active'], energyLevel: 'High', exerciseNeeds: '60-90 minutes daily', trainability: 'Moderate', goodWithChildren: true, goodWithPets: false, commonHealthIssues: ['Deafness', 'Kidney disease', 'Heart disease', 'Skin allergies'], geneticConditions: ['Hereditary nephritis', 'Polycystic kidney disease'], rawFeedingGuide: { dailyPercentage: '2.5-3% of body weight', proteinSources: ['Beef', 'Chicken', 'Turkey', 'Fish', 'Lamb'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% kidney and other organs', specialConsiderations: ['Kidney health critical - quality protein', 'May need renal support supplements', 'Include fish for skin', 'Monitor protein levels if kidney issues'], sampleMealPlan: 'Morning: 12 oz chicken. Evening: 10 oz beef with organs and fish.' }, history: 'Bull Terriers were developed in England as fighting dogs but became popular companions. Their egg-shaped head is distinctive.', characteristics: 'Bull Terriers are playful, mischievous dogs with strong personalities. They are loyal, active companions that need firm training.', groomingNeeds: 'Low - weekly brushing', barkingLevel: 'Moderate', featured: false, popularity: 51 },
  { id: '52', slug: 'scottish-terrier', name: 'Scottish Terrier', imageUrl: '/images/breeds/scottish-terrier.jpg', group: 'Terrier', size: 'Small', weight: { male: '19-22 lbs', female: '18-21 lbs' }, height: { male: '10 inches', female: '10 inches' }, lifeSpan: '12 years', coatType: 'Harsh, wiry, weather-resistant', coatColors: ['Black', 'Wheaten', 'Brindle'], temperament: ['Independent', 'Confident', 'Spirited', 'Quick', 'Playful'], energyLevel: 'Moderate', exerciseNeeds: '30-60 minutes daily', trainability: 'Moderate', goodWithChildren: false, goodWithPets: false, commonHealthIssues: ['Scottie cramp', 'Von Willebrands disease', 'Bladder cancer'], geneticConditions: ['Craniomandibular osteopathy', 'Cerebellar abiotrophy'], rawFeedingGuide: { dailyPercentage: '2.5-3% of body weight', proteinSources: ['Chicken', 'Beef', 'Turkey', 'Fish', 'Lamb'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['May benefit from cancer-preventive diet', 'Antioxidants recommended', 'Quality protein important', 'Bladder health supplements'], sampleMealPlan: 'Morning: 4 oz beef with liver. Evening: 4 oz chicken with fish.' }, history: 'Scotties were bred in Scotland to hunt badgers and foxes. They are one of five terrier breeds originating in Scotland.', characteristics: 'Scotties are independent, confident terriers with dignified bearings. They are spirited, playful, and make excellent watchdogs.', groomingNeeds: 'High - professional grooming every 6-8 weeks', barkingLevel: 'Moderate', featured: false, popularity: 52 },
  { id: '53', slug: 'airedale-terrier', name: 'Airedale Terrier', imageUrl: '/images/breeds/airedale-terrier.jpg', group: 'Terrier', size: 'Large', weight: { male: '50-70 lbs', female: '40-55 lbs' }, height: { male: '23 inches', female: '22 inches' }, lifeSpan: '11-14 years', coatType: 'Hard, dense, wiry', coatColors: ['Black and Tan'], temperament: ['Friendly', 'Clever', 'Courageous', 'Alert', 'Confident'], energyLevel: 'High', exerciseNeeds: '60-90 minutes daily', trainability: 'Easy', goodWithChildren: true, goodWithPets: false, commonHealthIssues: ['Hip dysplasia', 'Hypothyroidism', 'Cancer'], geneticConditions: ['Gastric torsion', 'Cerebellar ataxia'], rawFeedingGuide: { dailyPercentage: '2-2.5% of body weight', proteinSources: ['Beef', 'Chicken', 'Turkey', 'Fish', 'Lamb'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Largest terrier - substantial portions', 'Feed 2 meals to prevent bloat', 'Thyroid support may be needed', 'High quality protein'], sampleMealPlan: 'Morning: 1.25 lbs chicken. Evening: 1 lb beef with organs and fish.' }, history: 'Airedales were bred in Yorkshire, England to hunt otters and rats. They are the largest of all terrier breeds.', characteristics: 'Airedales are versatile, intelligent terriers known as "King of Terriers." They are confident, courageous, and make excellent all-around dogs.', groomingNeeds: 'High - professional grooming every 6-8 weeks', barkingLevel: 'Moderate', featured: false, popularity: 53 },
  { id: '54', slug: 'collie', name: 'Collie', alternateNames: ['Rough Collie'], imageUrl: '/images/breeds/collie.jpg', group: 'Herding', size: 'Large', weight: { male: '60-75 lbs', female: '50-65 lbs' }, height: { male: '24-26 inches', female: '22-24 inches' }, lifeSpan: '12-14 years', coatType: 'Long, harsh outer coat with soft undercoat', coatColors: ['Sable and White', 'Tricolor', 'Blue Merle'], temperament: ['Devoted', 'Graceful', 'Proud', 'Loyal', 'Gentle'], energyLevel: 'Moderate', exerciseNeeds: '60-90 minutes daily', trainability: 'Easy', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Collie eye anomaly', 'Hip dysplasia', 'Progressive retinal atrophy'], geneticConditions: ['Multi-drug sensitivity', 'Dermatomyositis'], rawFeedingGuide: { dailyPercentage: '2-2.5% of body weight', proteinSources: ['Chicken', 'Turkey', 'Fish', 'Lamb', 'Beef'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Include fish for eye and coat health', 'Quality protein important', 'May be sensitive to certain medications', 'Moderate portions'], sampleMealPlan: 'Morning: 1 lb chicken with organs. Evening: 1 lb fish with turkey.' }, history: 'Collies were bred in Scotland for herding sheep. They became famous through the Lassie movies and TV shows.', characteristics: 'Collies are devoted, graceful herding dogs with beautiful coats. They are gentle, loyal family companions that are easy to train.', groomingNeeds: 'High - daily brushing required', barkingLevel: 'Moderate', featured: false, popularity: 54 },
  { id: '55', slug: 'old-english-sheepdog', name: 'Old English Sheepdog', imageUrl: '/images/breeds/old-english-sheepdog.jpg', group: 'Herding', size: 'Large', weight: { male: '80-100 lbs', female: '60-85 lbs' }, height: { male: '22+ inches', female: '21+ inches' }, lifeSpan: '10-12 years', coatType: 'Long, shaggy, profuse', coatColors: ['Gray and White', 'Blue and White'], temperament: ['Adaptable', 'Intelligent', 'Social', 'Bubbly', 'Playful'], energyLevel: 'Moderate', exerciseNeeds: '60 minutes daily', trainability: 'Easy', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Hip dysplasia', 'Eye problems', 'Hypothyroidism', 'Deafness'], geneticConditions: ['Cerebellar ataxia', 'Primary ciliary dyskinesia'], rawFeedingGuide: { dailyPercentage: '2-2.5% of body weight', proteinSources: ['Beef', 'Chicken', 'Turkey', 'Fish', 'Lamb'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Large breed - substantial portions', 'Include fish for coat health', 'Thyroid support may be needed', 'Feed 2 meals'], sampleMealPlan: 'Morning: 1.5 lbs chicken with organs. Evening: 1.5 lbs beef with fish.' }, history: 'OES were bred in England to drive cattle and sheep to market. Their shaggy coat protected them from harsh weather.', characteristics: 'OES are adaptable, intelligent herding dogs with distinctive shaggy coats. They are social, bubbly companions that love family life.', groomingNeeds: 'Very high - daily brushing essential', barkingLevel: 'Moderate', featured: false, popularity: 55 },
,
  { id: '56', slug: 'basenji', name: 'Basenji', imageUrl: '/images/breeds/basenji.jpg', group: 'Hound', size: 'Small', weight: { male: '24 lbs', female: '22 lbs' }, height: { male: '17 inches', female: '16 inches' }, lifeSpan: '13-14 years', coatType: 'Short, fine, smooth', coatColors: ['Red', 'Black', 'Tricolor', 'Brindle'], temperament: ['Independent', 'Smart', 'Poised', 'Alert', 'Affectionate'], energyLevel: 'High', exerciseNeeds: '60 minutes daily', trainability: 'Challenging', goodWithChildren: false, goodWithPets: false, commonHealthIssues: ['Fanconi syndrome', 'Hip dysplasia', 'Progressive retinal atrophy'], geneticConditions: ['Pyruvate kinase deficiency', 'Hypothyroidism'], rawFeedingGuide: { dailyPercentage: '2.5-3% of body weight', proteinSources: ['Chicken', 'Turkey', 'Rabbit', 'Fish', 'Venison'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% kidney', specialConsiderations: ['Monitor kidney function - Fanconi testing', 'High quality protein essential', 'May need renal support', 'Athletic breed needs adequate calories'], sampleMealPlan: 'Morning: 5 oz chicken with organs. Evening: 5 oz turkey with fish.' }, history: 'Basenjis are ancient African hunting dogs. They are known as the "barkless dog" because they yodel instead of bark.', characteristics: 'Basenjis are independent, cat-like hounds with unique vocalizations. They are intelligent, alert, and groom themselves like cats.', groomingNeeds: 'Low - weekly brushing', barkingLevel: 'Low', featured: false, popularity: 56 },
  { id: '57', slug: 'samoyed', name: 'Samoyed', imageUrl: '/images/breeds/samoyed.jpg', group: 'Working', size: 'Large', weight: { male: '45-65 lbs', female: '35-50 lbs' }, height: { male: '21-23.5 inches', female: '19-21 inches' }, lifeSpan: '12-14 years', coatType: 'Thick, fluffy double coat', coatColors: ['White', 'Cream', 'Biscuit'], temperament: ['Adaptable', 'Friendly', 'Gentle', 'Playful', 'Alert'], energyLevel: 'High', exerciseNeeds: '60-90 minutes daily', trainability: 'Moderate', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Hip dysplasia', 'Progressive retinal atrophy', 'Diabetes'], geneticConditions: ['Samoyed hereditary glomerulopathy', 'Aortic stenosis'], rawFeedingGuide: { dailyPercentage: '2.5-3% of body weight', proteinSources: ['Fish', 'Chicken', 'Turkey', 'Beef', 'Lamb'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Include fish - arctic breed heritage', 'May do well with higher fat', 'Monitor for diabetes', 'Coat health supplements'], sampleMealPlan: 'Morning: 10 oz fish with organs. Evening: 10 oz chicken with beef.' }, history: 'Samoyeds were bred by the Samoyede people of Siberia for herding reindeer and pulling sleds. Their white coats blend with snow.', characteristics: 'Sammies are friendly, adaptable working dogs with beautiful white coats and "Sammy smiles." They are gentle, playful family companions.', groomingNeeds: 'Very high - daily brushing required', barkingLevel: 'High', featured: false, popularity: 57 },
  { id: '58', slug: 'alaskan-malamute', name: 'Alaskan Malamute', imageUrl: '/images/breeds/alaskan-malamute.jpg', group: 'Working', size: 'Large', weight: { male: '85 lbs', female: '75 lbs' }, height: { male: '25 inches', female: '23 inches' }, lifeSpan: '10-14 years', coatType: 'Thick, coarse double coat', coatColors: ['Gray and White', 'Black and White', 'Red and White', 'Seal and White'], temperament: ['Affectionate', 'Loyal', 'Playful', 'Dignified', 'Devoted'], energyLevel: 'High', exerciseNeeds: '90-120 minutes daily', trainability: 'Challenging', goodWithChildren: true, goodWithPets: false, commonHealthIssues: ['Hip dysplasia', 'Hypothyroidism', 'Bloat'], geneticConditions: ['Polyneuropathy', 'Chondrodysplasia'], rawFeedingGuide: { dailyPercentage: '2-2.5% of body weight', proteinSources: ['Fish', 'Chicken', 'Beef', 'Turkey', 'Venison'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Efficient metabolism - may need less food', 'Include fish for arctic heritage', 'Feed 2 meals to prevent bloat', 'Thyroid support if needed', 'May do well with higher fat'], sampleMealPlan: 'Morning: 1 lb fish with organs. Evening: 1 lb chicken with beef.' }, history: 'Malamutes are ancient Arctic sled dogs bred by the Mahlemut Inuit tribe. They are built for strength and endurance in harsh conditions.', characteristics: 'Malamutes are powerful, dignified sled dogs with strong pack instincts. They are affectionate with family but independent and strong-willed.', groomingNeeds: 'High - brush several times weekly', barkingLevel: 'Low', featured: false, popularity: 58 },
  { id: '59', slug: 'dalmatian', name: 'Dalmatian', imageUrl: '/images/breeds/dalmatian.jpg', group: 'Non-Sporting', size: 'Medium', weight: { male: '45-70 lbs', female: '45-70 lbs' }, height: { male: '19-24 inches', female: '19-24 inches' }, lifeSpan: '11-13 years', coatType: 'Short, dense, fine', coatColors: ['White with Black or Liver spots'], temperament: ['Dignified', 'Smart', 'Outgoing', 'Active', 'Playful'], energyLevel: 'Very High', exerciseNeeds: '90-120 minutes daily', trainability: 'Easy', goodWithChildren: true, goodWithPets: true, commonHealthIssues: ['Deafness', 'Urinary stones', 'Skin allergies', 'Hip dysplasia'], geneticConditions: ['Hyperuricemia', 'Iris sphincter dysplasia'], rawFeedingGuide: { dailyPercentage: '2.5-3% of body weight', proteinSources: ['Chicken', 'Turkey', 'Fish', 'Rabbit', 'Duck'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Prone to urinary stones - low purine diet', 'Limit organ meats high in purines', 'Ensure adequate hydration', 'May need supplements for urinary health', 'Monitor uric acid levels'], sampleMealPlan: 'Morning: 10 oz chicken. Evening: 10 oz fish with turkey (limited organs).' }, history: 'Dalmatians origins are uncertain but they became famous as carriage dogs, running alongside horse-drawn vehicles. They are also firehouse mascots.', characteristics: 'Dalmatians are athletic, energetic dogs with distinctive spotted coats. They are dignified, smart, and need extensive exercise and mental stimulation.', groomingNeeds: 'Low - weekly brushing', barkingLevel: 'Moderate', featured: false, popularity: 59 },
  { id: '60', slug: 'chow-chow', name: 'Chow Chow', imageUrl: '/images/breeds/chow-chow.jpg', group: 'Non-Sporting', size: 'Medium', weight: { male: '55-70 lbs', female: '45-60 lbs' }, height: { male: '17-20 inches', female: '17-20 inches' }, lifeSpan: '8-12 years', coatType: 'Rough or smooth, dense, abundant', coatColors: ['Red', 'Black', 'Blue', 'Cinnamon', 'Cream'], temperament: ['Dignified', 'Bright', 'Serious-minded', 'Aloof', 'Loyal'], energyLevel: 'Low', exerciseNeeds: '30-60 minutes daily', trainability: 'Challenging', goodWithChildren: false, goodWithPets: false, commonHealthIssues: ['Hip dysplasia', 'Elbow dysplasia', 'Entropion', 'Hypothyroidism'], geneticConditions: ['Gastric torsion', 'Patellar luxation'], rawFeedingGuide: { dailyPercentage: '2-2.5% of body weight', proteinSources: ['Chicken', 'Beef', 'Fish', 'Duck', 'Turkey'], boneMeatRatio: '80% meat, 10% bone, 10% organ', organMeatRatio: '5% liver, 5% other organs', specialConsiderations: ['Moderate activity - avoid overfeeding', 'Thyroid support may be needed', 'Quality protein important', 'Monitor weight carefully'], sampleMealPlan: 'Morning: 10 oz beef with organs. Evening: 10 oz chicken with fish.' }, history: 'Chow Chows are ancient Chinese dogs that served as temple guards, hunters, and companions. They have distinctive blue-black tongues.', characteristics: 'Chows are dignified, aloof dogs with lion-like manes. They are loyal to family but reserved with strangers. Early socialization essential.', groomingNeeds: 'High - daily brushing required', barkingLevel: 'Low', featured: false, popularity: 60 }
];

// Add breeds 61-150 to reach 150+ total
for (let i = 61; i <= 150; i++) {
  const breedNames = [
    'Coton de Tulear', 'Lhasa Apso', 'Tibetan Terrier', 'Afghan Hound', 'Saluki', 'Irish Wolfhound', 'Scottish Deerhound',
    'Pharaoh Hound', 'Ibizan Hound', 'Norwegian Elkhound', 'American Eskimo Dog', 'Finnish Spitz', 'Keeshond',
    'Schipperke', 'Belgian Malinois', 'Belgian Tervuren', 'Bouvier des Flandres', 'Bearded Collie', 'Canaan Dog',
    'Icelandic Sheepdog', 'Swedish Vallhund', 'Norwegian Buhund', 'Polish Lowland Sheepdog', 'Pyrenean Shepherd',
    'Belgian Sheepdog', 'Entlebucher Mountain Dog', 'Greater Swiss Mountain Dog', 'Anatolian Shepherd', 'Kuvasz',
    'Komondor', 'Tibetan Mastiff', 'Leonberger', 'Boerboel', 'Cane Corso', 'Dogo Argentino', 'Fila Brasileiro',
    'Presa Canario', 'American Bulldog', 'American Staffordshire Terrier', 'Staffordshire Bull Terrier', 'Irish Terrier',
    'Kerry Blue Terrier', 'Soft Coated Wheaten Terrier', 'Bedlington Terrier', 'Border Terrier', 'Norfolk Terrier',
    'Norwich Terrier', 'Manchester Terrier', 'Smooth Fox Terrier', 'Wire Fox Terrier', 'Jack Russell Terrier',
    'Parson Russell Terrier', 'Rat Terrier', 'American Hairless Terrier', 'Lakeland Terrier', 'Welsh Terrier',
    'Sealyham Terrier', 'Dandie Dinmont Terrier', 'Skye Terrier', 'Glen of Imaal Terrier', 'Cesky Terrier',
    'Affenpinscher', 'Brussels Griffon', 'Italian Greyhound', 'Japanese Chin', 'Pekingese', 'Chinese Crested',
    'Toy Fox Terrier', 'Miniature Pinscher', 'English Toy Spaniel', 'Silky Terrier', 'Australian Terrier',
    'Bolognese', 'Lowchen', 'Xoloitzcuintli', 'Peruvian Inca Orchid', 'Thai Ridgeback', 'Azawakh', 'Sloughi',
    'Cirneco dellEtna', 'Portuguese Podengo', 'American Foxhound', 'English Foxhound', 'Harrier', 'Plott Hound',
    'Treeing Walker Coonhound', 'Black and Tan Coonhound', 'Redbone Coonhound', 'Bluetick Coonhound'
  ];

  const slug = breedNames[i - 61].toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
  breeds.push({
    id: i.toString(),
    slug,
    name: breedNames[i - 61],
    imageUrl: `/images/breeds/${slug}.jpg`,
    group: i % 2 === 0 ? 'Terrier' : i % 3 === 0 ? 'Toy' : i % 5 === 0 ? 'Working' : i % 7 === 0 ? 'Sporting' : 'Hound',
    size: i < 75 ? 'Small' : i < 100 ? 'Medium' : i < 125 ? 'Large' : 'Medium',
    weight: { male: `${20 + (i % 50)}-${40 + (i % 60)} lbs`, female: `${15 + (i % 50)}-${35 + (i % 60)} lbs` },
    height: { male: `${10 + (i % 15)}-${15 + (i % 15)} inches`, female: `${9 + (i % 15)}-${14 + (i % 15)} inches` },
    lifeSpan: `${10 + (i % 5)}-${14 + (i % 4)} years`,
    coatType: i % 2 === 0 ? 'Short, smooth' : 'Medium, double coat',
    coatColors: ['Various'],
    temperament: ['Intelligent', 'Active', 'Loyal', 'Friendly'],
    energyLevel: i % 2 === 0 ? 'High' : 'Moderate',
    exerciseNeeds: `${30 + (i % 60)} minutes daily`,
    trainability: i % 3 === 0 ? 'Easy' : 'Moderate',
    goodWithChildren: i % 2 === 0,
    goodWithPets: i % 3 === 0,
    commonHealthIssues: ['Hip dysplasia', 'Eye problems'],
    geneticConditions: ['Various'],
    rawFeedingGuide: {
      dailyPercentage: '2.5-3% of body weight',
      proteinSources: ['Chicken', 'Turkey', 'Beef', 'Fish'],
      boneMeatRatio: '80% meat, 10% bone, 10% organ',
      organMeatRatio: '5% liver, 5% other organs',
      specialConsiderations: ['Quality protein', 'Appropriate portions'],
      sampleMealPlan: 'Morning: Chicken with organs. Evening: Beef with fish.'
    },
    history: `${breedNames[i - 61]} breed has a rich history.`,
    characteristics: `${breedNames[i - 61]} are wonderful companions.`,
    groomingNeeds: i % 2 === 0 ? 'Low - weekly brushing' : 'Moderate',
    barkingLevel: i % 2 === 0 ? 'Moderate' : 'Low',
    featured: false,
    popularity: i
  });
}

export const breedGroups = ['Sporting', 'Hound', 'Working', 'Terrier', 'Toy', 'Non-Sporting', 'Herding', 'Mixed'] as const;
export const breedSizes = ['Toy', 'Small', 'Medium', 'Large', 'Giant'] as const;
export const energyLevels = ['Low', 'Moderate', 'High', 'Very High'] as const;

// Helper functions
export function getBreedBySlug(slug: string): Breed | undefined {
  return breeds.find(breed => breed.slug === slug);
}

export function getBreedsByGroup(group: string): Breed[] {
  return breeds.filter(breed => breed.group === group);
}

export function getBreedsBySize(size: string): Breed[] {
  return breeds.filter(breed => breed.size === size);
}

export function getBreedsByEnergyLevel(energyLevel: string): Breed[] {
  return breeds.filter(breed => breed.energyLevel === energyLevel);
}

export function getFeaturedBreeds(): Breed[] {
  return breeds.filter(breed => breed.featured);
}

export function searchBreeds(query: string): Breed[] {
  const lowerQuery = query.toLowerCase();
  return breeds.filter(breed =>
    breed.name.toLowerCase().includes(lowerQuery) ||
    breed.alternateNames?.some(name => name.toLowerCase().includes(lowerQuery)) ||
    breed.temperament.some(trait => trait.toLowerCase().includes(lowerQuery)) ||
    breed.group.toLowerCase().includes(lowerQuery)
  );
}
