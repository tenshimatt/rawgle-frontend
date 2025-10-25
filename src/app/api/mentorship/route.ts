import { NextRequest, NextResponse } from 'next/server';

export interface Session {
  id: string;
  mentorId: string;
  userId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  meetingLink?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TimeSlot {
  day: string; // 'monday', 'tuesday', etc.
  times: string[]; // ['09:00', '10:00', '14:00']
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  bio: string;
  credentials: string[];
  experience: string;
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  image: string;
  availability: TimeSlot[];
  reviews: Review[];
  languages: string[];
  responseTime: string;
  totalSessions: number;
}

// In-memory storage
const mentors = new Map<string, Mentor>();
const sessions = new Map<string, Session>();

// Initialize comprehensive mentor data
const initMockData = () => {
  if (mentors.size === 0) {
    const mockMentors: Mentor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Mitchell',
        title: 'Veterinary Nutritionist, DVM, PhD',
        specialty: ['nutrition', 'health'],
        bio: 'Veterinarian with 15+ years of experience specializing in canine nutrition and raw feeding. I help pet owners transition to raw diets safely and create balanced meal plans for dogs of all life stages.',
        credentials: [
          'Doctor of Veterinary Medicine (DVM)',
          'PhD in Animal Nutrition',
          'Board Certified Veterinary Nutritionist',
          'Raw Feeding Veterinary Society Member'
        ],
        experience: '15+ years in veterinary medicine, 10+ years specializing in raw nutrition',
        rating: 4.9,
        totalReviews: 127,
        hourlyRate: 95,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
        availability: [
          { day: 'monday', times: ['09:00', '10:00', '14:00', '15:00'] },
          { day: 'wednesday', times: ['09:00', '10:00', '11:00', '14:00'] },
          { day: 'friday', times: ['10:00', '11:00', '14:00', '15:00', '16:00'] }
        ],
        reviews: [
          {
            id: 'r1',
            userId: 'u1',
            userName: 'Jennifer K.',
            rating: 5,
            comment: 'Dr. Mitchell helped me create a balanced raw diet for my senior dog. Her expertise and patience were invaluable!',
            date: '2025-10-15'
          },
          {
            id: 'r2',
            userId: 'u2',
            userName: 'Mark T.',
            rating: 5,
            comment: 'Professional, knowledgeable, and caring. Highly recommend for anyone starting raw feeding.',
            date: '2025-10-10'
          }
        ],
        languages: ['English', 'Spanish'],
        responseTime: '< 2 hours',
        totalSessions: 450
      },
      {
        id: '2',
        name: 'Jennifer Adams',
        title: 'Certified Canine Nutritionist',
        specialty: ['nutrition', 'training'],
        bio: 'Certified Canine Nutritionist specializing in raw food diets for performance and sporting dogs. I work with competitive handlers to optimize nutrition for peak performance.',
        credentials: [
          'Certified Canine Nutritionist (CN)',
          'Raw Feeding Specialist Certification',
          'Sports Dog Nutrition Expert',
          'Member, International Association of Canine Nutritionists'
        ],
        experience: '12 years in canine nutrition, specializing in performance dogs',
        rating: 4.8,
        totalReviews: 98,
        hourlyRate: 75,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        availability: [
          { day: 'tuesday', times: ['08:00', '09:00', '13:00', '14:00', '15:00'] },
          { day: 'thursday', times: ['08:00', '09:00', '10:00', '13:00', '14:00'] },
          { day: 'saturday', times: ['09:00', '10:00', '11:00'] }
        ],
        reviews: [
          {
            id: 'r3',
            userId: 'u3',
            userName: 'Robert S.',
            rating: 5,
            comment: 'Jennifer transformed my agility dog\'s performance through nutrition. Amazing results!',
            date: '2025-10-12'
          }
        ],
        languages: ['English'],
        responseTime: '< 3 hours',
        totalSessions: 320
      },
      {
        id: '3',
        name: 'Dr. Michael Chen',
        title: 'Veterinarian & Breeder',
        specialty: ['health', 'nutrition'],
        bio: 'Veterinarian and professional breeder with expertise in puppy development and raw feeding. I help breeders and puppy owners establish healthy raw feeding practices from the start.',
        credentials: [
          'Doctor of Veterinary Medicine (DVM)',
          'Certified Professional Breeder',
          'Puppy Development Specialist',
          'American Kennel Club Breeder of Merit'
        ],
        experience: '18 years veterinary practice, 20+ years breeding experience',
        rating: 4.9,
        totalReviews: 156,
        hourlyRate: 85,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        availability: [
          { day: 'monday', times: ['16:00', '17:00', '18:00'] },
          { day: 'wednesday', times: ['16:00', '17:00', '18:00', '19:00'] },
          { day: 'thursday', times: ['16:00', '17:00'] }
        ],
        reviews: [
          {
            id: 'r4',
            userId: 'u4',
            userName: 'Lisa M.',
            rating: 5,
            comment: 'Dr. Chen guided me through raw feeding my litter. All puppies are thriving!',
            date: '2025-10-08'
          }
        ],
        languages: ['English', 'Mandarin'],
        responseTime: '< 4 hours',
        totalSessions: 380
      },
      {
        id: '4',
        name: 'Maria Garcia',
        title: 'Budget Raw Feeding Expert',
        specialty: ['nutrition', 'suppliers'],
        bio: 'Helping families feed raw on a budget for over 10 years. I specialize in finding affordable protein sources, bulk buying strategies, and money-saving tips without compromising nutrition.',
        credentials: [
          'Raw Feeding Advocate Certification',
          'Budget Meal Planning Specialist',
          'Bulk Purchasing Consultant',
          'Community Raw Feeding Educator'
        ],
        experience: '10+ years helping families feed raw affordably',
        rating: 4.7,
        totalReviews: 203,
        hourlyRate: 45,
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
        availability: [
          { day: 'monday', times: ['10:00', '11:00', '14:00', '15:00'] },
          { day: 'tuesday', times: ['10:00', '11:00', '14:00'] },
          { day: 'thursday', times: ['10:00', '11:00', '14:00', '15:00', '16:00'] },
          { day: 'saturday', times: ['10:00', '11:00', '12:00', '13:00'] }
        ],
        reviews: [
          {
            id: 'r5',
            userId: 'u5',
            userName: 'David P.',
            rating: 5,
            comment: 'Maria showed me how to cut my raw feeding costs in half. Game changer!',
            date: '2025-10-14'
          }
        ],
        languages: ['English', 'Spanish'],
        responseTime: '< 6 hours',
        totalSessions: 520
      },
      {
        id: '5',
        name: 'Robert Martinez',
        title: 'Performance Dog Nutrition Specialist',
        specialty: ['nutrition', 'training'],
        bio: 'Working with professional dog sports athletes and competitive handlers to optimize nutrition for peak performance. Specialized in working dogs, sporting dogs, and competition nutrition.',
        credentials: [
          'Certified Canine Nutritionist',
          'Sports Dog Nutrition Specialist',
          'Professional Dog Sports Consultant',
          'Working Dog Performance Expert'
        ],
        experience: '14 years working with professional handlers and sporting dogs',
        rating: 4.9,
        totalReviews: 89,
        hourlyRate: 90,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        availability: [
          { day: 'tuesday', times: ['07:00', '08:00', '17:00', '18:00'] },
          { day: 'thursday', times: ['07:00', '08:00', '17:00', '18:00'] },
          { day: 'saturday', times: ['08:00', '09:00', '10:00'] }
        ],
        reviews: [
          {
            id: 'r6',
            userId: 'u6',
            userName: 'Amanda R.',
            rating: 5,
            comment: 'Robert helped optimize my detection dog\'s nutrition. Incredible knowledge!',
            date: '2025-10-11'
          }
        ],
        languages: ['English', 'Spanish'],
        responseTime: '< 3 hours',
        totalSessions: 290
      },
      {
        id: '6',
        name: 'Emily Thompson',
        title: 'Raw Feeding Veterinary Technician',
        specialty: ['health', 'nutrition'],
        bio: 'Licensed Veterinary Technician with specialized training in raw feeding and preventive health care. I help pet owners understand the health benefits of raw feeding and monitor their dog\'s wellness.',
        credentials: [
          'Licensed Veterinary Technician (LVT)',
          'Certified Raw Feeding Specialist',
          'Preventive Care Coordinator',
          'Holistic Pet Care Certification'
        ],
        experience: '8 years as LVT, 5 years specializing in raw nutrition',
        rating: 4.8,
        totalReviews: 142,
        hourlyRate: 60,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        availability: [
          { day: 'monday', times: ['12:00', '13:00', '14:00'] },
          { day: 'wednesday', times: ['12:00', '13:00', '14:00', '15:00'] },
          { day: 'friday', times: ['12:00', '13:00', '14:00', '15:00'] }
        ],
        reviews: [
          {
            id: 'r7',
            userId: 'u7',
            userName: 'James L.',
            rating: 5,
            comment: 'Emily is incredibly knowledgeable and patient. Great for beginners!',
            date: '2025-10-13'
          }
        ],
        languages: ['English'],
        responseTime: '< 4 hours',
        totalSessions: 280
      },
      {
        id: '7',
        name: 'David Kim',
        title: 'Raw Food Supplier Consultant',
        specialty: ['suppliers', 'nutrition'],
        bio: 'Raw food supplier and consultant helping pet owners find reliable, affordable sources for raw ingredients. I have partnerships with farms, butchers, and distributors nationwide.',
        credentials: [
          'Raw Pet Food Industry Consultant',
          'Supplier Network Coordinator',
          'Quality Sourcing Specialist',
          'Food Safety Certification'
        ],
        experience: '12 years in raw pet food supply chain',
        rating: 4.6,
        totalReviews: 76,
        hourlyRate: 55,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        availability: [
          { day: 'monday', times: ['09:00', '10:00', '11:00', '15:00'] },
          { day: 'wednesday', times: ['09:00', '10:00', '11:00'] },
          { day: 'friday', times: ['09:00', '10:00', '11:00', '15:00', '16:00'] }
        ],
        reviews: [
          {
            id: 'r8',
            userId: 'u8',
            userName: 'Sarah B.',
            rating: 5,
            comment: 'David connected me with amazing local suppliers. Saved me so much money!',
            date: '2025-10-09'
          }
        ],
        languages: ['English', 'Korean'],
        responseTime: '< 5 hours',
        totalSessions: 195
      },
      {
        id: '8',
        name: 'Dr. Rachel Foster',
        title: 'Holistic Veterinarian',
        specialty: ['health', 'nutrition'],
        bio: 'Holistic veterinarian integrating raw nutrition with natural health practices. I help pet owners address health conditions through diet and natural remedies.',
        credentials: [
          'Doctor of Veterinary Medicine (DVM)',
          'Certified Veterinary Acupuncturist',
          'Holistic Health Practitioner',
          'Raw Nutrition Specialist'
        ],
        experience: '11 years holistic veterinary practice',
        rating: 4.9,
        totalReviews: 134,
        hourlyRate: 100,
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
        availability: [
          { day: 'tuesday', times: ['13:00', '14:00', '15:00'] },
          { day: 'thursday', times: ['13:00', '14:00', '15:00', '16:00'] },
          { day: 'friday', times: ['09:00', '10:00'] }
        ],
        reviews: [
          {
            id: 'r9',
            userId: 'u9',
            userName: 'Michael D.',
            rating: 5,
            comment: 'Dr. Foster helped heal my dog\'s allergies through diet. Miraculous results!',
            date: '2025-10-07'
          }
        ],
        languages: ['English', 'French'],
        responseTime: '< 3 hours',
        totalSessions: 340
      },
      {
        id: '9',
        name: 'Alexandra Santos',
        title: 'Senior Dog Care Specialist',
        specialty: ['nutrition', 'health'],
        bio: 'Specializing in raw nutrition for senior dogs. I help owners adjust diets for aging dogs with special health considerations and mobility issues.',
        credentials: [
          'Certified Senior Dog Care Specialist',
          'Canine Nutrition Consultant',
          'Geriatric Dog Health Advocate',
          'Raw Feeding Educator'
        ],
        experience: '9 years specializing in senior dog care and nutrition',
        rating: 4.8,
        totalReviews: 167,
        hourlyRate: 65,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        availability: [
          { day: 'monday', times: ['11:00', '12:00', '13:00', '16:00'] },
          { day: 'wednesday', times: ['11:00', '12:00', '13:00'] },
          { day: 'friday', times: ['11:00', '12:00', '13:00', '16:00'] }
        ],
        reviews: [
          {
            id: 'r10',
            userId: 'u10',
            userName: 'Patricia W.',
            rating: 5,
            comment: 'Alexandra gave my 13-year-old dog a new lease on life. So grateful!',
            date: '2025-10-06'
          }
        ],
        languages: ['English', 'Portuguese'],
        responseTime: '< 4 hours',
        totalSessions: 310
      },
      {
        id: '10',
        name: 'Thomas Wright',
        title: 'Multi-Dog Household Expert',
        specialty: ['nutrition', 'training'],
        bio: 'Helping families with multiple dogs establish efficient raw feeding routines. I specialize in meal prep, storage solutions, and managing different dietary needs.',
        credentials: [
          'Certified Canine Nutritionist',
          'Multi-Dog Management Specialist',
          'Meal Prep Efficiency Expert',
          'Raw Feeding Coordinator'
        ],
        experience: '10 years helping multi-dog households',
        rating: 4.7,
        totalReviews: 92,
        hourlyRate: 50,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        availability: [
          { day: 'tuesday', times: ['10:00', '11:00', '15:00', '16:00'] },
          { day: 'thursday', times: ['10:00', '11:00', '15:00'] },
          { day: 'saturday', times: ['11:00', '12:00', '13:00', '14:00'] }
        ],
        reviews: [
          {
            id: 'r11',
            userId: 'u11',
            userName: 'Karen H.',
            rating: 5,
            comment: 'Thomas streamlined feeding my 5 dogs. Made it so much easier!',
            date: '2025-10-05'
          }
        ],
        languages: ['English'],
        responseTime: '< 5 hours',
        totalSessions: 245
      },
      {
        id: '11',
        name: 'Dr. Lisa Reynolds',
        title: 'Small Breed Nutrition Specialist',
        specialty: ['nutrition', 'health'],
        bio: 'Veterinarian specializing in small breed nutrition and raw feeding. I help owners of toy and small breeds create appropriate portion sizes and balanced meals.',
        credentials: [
          'Doctor of Veterinary Medicine (DVM)',
          'Small Breed Health Specialist',
          'Toy Breed Nutrition Expert',
          'Raw Feeding Veterinary Consultant'
        ],
        experience: '13 years specializing in small breed care',
        rating: 4.9,
        totalReviews: 118,
        hourlyRate: 80,
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
        availability: [
          { day: 'monday', times: ['08:00', '09:00', '13:00'] },
          { day: 'wednesday', times: ['08:00', '09:00', '13:00', '14:00'] },
          { day: 'friday', times: ['08:00', '09:00'] }
        ],
        reviews: [
          {
            id: 'r12',
            userId: 'u12',
            userName: 'Emma S.',
            rating: 5,
            comment: 'Dr. Reynolds helped me feed my Chihuahua raw safely. Perfect portions!',
            date: '2025-10-04'
          }
        ],
        languages: ['English'],
        responseTime: '< 2 hours',
        totalSessions: 285
      },
      {
        id: '12',
        name: 'Carlos Rodriguez',
        title: 'Farm-to-Bowl Consultant',
        specialty: ['suppliers', 'nutrition'],
        bio: 'Connecting raw feeders with local farms and ethical suppliers. I help you source pasture-raised, organic proteins directly from farmers.',
        credentials: [
          'Sustainable Agriculture Consultant',
          'Local Food Systems Coordinator',
          'Ethical Sourcing Specialist',
          'Raw Pet Food Network Member'
        ],
        experience: '8 years connecting feeders with ethical suppliers',
        rating: 4.8,
        totalReviews: 84,
        hourlyRate: 55,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        availability: [
          { day: 'tuesday', times: ['14:00', '15:00', '16:00'] },
          { day: 'thursday', times: ['14:00', '15:00', '16:00', '17:00'] },
          { day: 'saturday', times: ['09:00', '10:00', '11:00'] }
        ],
        reviews: [
          {
            id: 'r13',
            userId: 'u13',
            userName: 'Rebecca F.',
            rating: 5,
            comment: 'Carlos found me amazing local farms. My dogs love the quality!',
            date: '2025-10-03'
          }
        ],
        languages: ['English', 'Spanish'],
        responseTime: '< 6 hours',
        totalSessions: 178
      },
      {
        id: '13',
        name: 'Dr. Angela Moore',
        title: 'Allergy & Elimination Diet Specialist',
        specialty: ['health', 'nutrition'],
        bio: 'Veterinarian specializing in food allergies and elimination diets. I help identify food sensitivities and create hypoallergenic raw feeding plans.',
        credentials: [
          'Doctor of Veterinary Medicine (DVM)',
          'Veterinary Dermatology Certification',
          'Food Allergy Specialist',
          'Elimination Diet Protocol Expert'
        ],
        experience: '12 years treating food allergies and sensitivities',
        rating: 4.9,
        totalReviews: 145,
        hourlyRate: 90,
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
        availability: [
          { day: 'monday', times: ['14:00', '15:00', '16:00'] },
          { day: 'wednesday', times: ['14:00', '15:00'] },
          { day: 'friday', times: ['14:00', '15:00', '16:00', '17:00'] }
        ],
        reviews: [
          {
            id: 'r14',
            userId: 'u14',
            userName: 'Brian K.',
            rating: 5,
            comment: 'Dr. Moore identified my dog\'s allergies and created a perfect diet plan!',
            date: '2025-10-02'
          }
        ],
        languages: ['English'],
        responseTime: '< 3 hours',
        totalSessions: 325
      },
      {
        id: '14',
        name: 'Nina Patel',
        title: 'Large Breed Nutrition Expert',
        specialty: ['nutrition', 'health'],
        bio: 'Specializing in raw nutrition for large and giant breeds. I help owners manage the unique nutritional needs and growth requirements of big dogs.',
        credentials: [
          'Certified Canine Nutritionist',
          'Large Breed Development Specialist',
          'Giant Breed Health Consultant',
          'Raw Feeding Educator'
        ],
        experience: '11 years specializing in large breed nutrition',
        rating: 4.8,
        totalReviews: 103,
        hourlyRate: 70,
        image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400',
        availability: [
          { day: 'tuesday', times: ['09:00', '10:00', '14:00'] },
          { day: 'thursday', times: ['09:00', '10:00', '14:00', '15:00'] },
          { day: 'saturday', times: ['10:00', '11:00'] }
        ],
        reviews: [
          {
            id: 'r15',
            userId: 'u15',
            userName: 'Steven M.',
            rating: 5,
            comment: 'Nina helped me feed my Great Dane properly. He\'s thriving!',
            date: '2025-10-01'
          }
        ],
        languages: ['English', 'Hindi'],
        responseTime: '< 4 hours',
        totalSessions: 268
      },
      {
        id: '15',
        name: 'Jessica Hamilton',
        title: 'Transition & Detox Specialist',
        specialty: ['nutrition', 'health'],
        bio: 'Helping dogs transition from processed food to raw diets. I specialize in managing detox symptoms and making the switch as smooth as possible.',
        credentials: [
          'Certified Raw Feeding Specialist',
          'Transition Protocol Expert',
          'Detox Management Consultant',
          'Digestive Health Specialist'
        ],
        experience: '7 years helping dogs transition to raw',
        rating: 4.7,
        totalReviews: 129,
        hourlyRate: 60,
        image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400',
        availability: [
          { day: 'monday', times: ['10:00', '11:00', '15:00', '16:00'] },
          { day: 'wednesday', times: ['10:00', '11:00', '15:00'] },
          { day: 'friday', times: ['10:00', '11:00', '15:00', '16:00'] }
        ],
        reviews: [
          {
            id: 'r16',
            userId: 'u16',
            userName: 'Christine L.',
            rating: 5,
            comment: 'Jessica made the transition so easy! No digestive issues at all.',
            date: '2025-09-30'
          }
        ],
        languages: ['English'],
        responseTime: '< 5 hours',
        totalSessions: 295
      },
      {
        id: '16',
        name: 'Marcus Johnson',
        title: 'Meal Prep & Batch Cooking Expert',
        specialty: ['nutrition', 'training'],
        bio: 'Teaching efficient meal prep and batch cooking techniques for raw feeders. I help busy pet owners save time while maintaining nutritional quality.',
        credentials: [
          'Certified Meal Prep Specialist',
          'Batch Cooking Instructor',
          'Time Management Consultant',
          'Raw Feeding Efficiency Expert'
        ],
        experience: '6 years teaching meal prep efficiency',
        rating: 4.6,
        totalReviews: 71,
        hourlyRate: 45,
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        availability: [
          { day: 'monday', times: ['18:00', '19:00', '20:00'] },
          { day: 'wednesday', times: ['18:00', '19:00', '20:00'] },
          { day: 'friday', times: ['18:00', '19:00'] }
        ],
        reviews: [
          {
            id: 'r17',
            userId: 'u17',
            userName: 'Diana R.',
            rating: 5,
            comment: 'Marcus taught me to meal prep for the whole month in 2 hours. Amazing!',
            date: '2025-09-29'
          }
        ],
        languages: ['English'],
        responseTime: '< 6 hours',
        totalSessions: 165
      }
    ];

    mockMentors.forEach(mentor => mentors.set(mentor.id, mentor));
  }
};

// GET: Fetch mentors or mentor details
export async function GET(req: NextRequest) {
  try {
    initMockData();

    const { searchParams } = new URL(req.url);
    const mentorId = searchParams.get('mentorId');
    const specialty = searchParams.get('specialty');
    const search = searchParams.get('search');

    if (mentorId) {
      const mentor = mentors.get(mentorId);
      if (!mentor) {
        return NextResponse.json(
          { success: false, error: 'Mentor not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, mentor });
    }

    let filteredMentors = Array.from(mentors.values());

    // Filter by specialty
    if (specialty && specialty !== 'all') {
      filteredMentors = filteredMentors.filter(m =>
        m.specialty.includes(specialty)
      );
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMentors = filteredMentors.filter(m =>
        m.name.toLowerCase().includes(searchLower) ||
        m.bio.toLowerCase().includes(searchLower) ||
        m.specialty.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({
      success: true,
      mentors: filteredMentors
    });

  } catch (error) {
    console.error('Mentorship fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mentors' },
      { status: 500 }
    );
  }
}

// POST: Book a session
export async function POST(req: NextRequest) {
  try {
    initMockData();

    const body = await req.json();
    const { mentorId, userId, date, time, duration, notes } = body;

    if (!mentorId || !userId || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mentor = mentors.get(mentorId);
    if (!mentor) {
      return NextResponse.json(
        { success: false, error: 'Mentor not found' },
        { status: 404 }
      );
    }

    const sessionId = `session-${Date.now()}`;
    const session: Session = {
      id: sessionId,
      mentorId,
      userId,
      date,
      time,
      duration: duration || 60,
      status: 'upcoming',
      notes,
      meetingLink: `https://meet.rawgle.com/${sessionId}`,
      createdAt: new Date().toISOString()
    };

    sessions.set(sessionId, session);

    return NextResponse.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Session booking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to book session' },
      { status: 500 }
    );
  }
}

// PUT: Update session (cancel, reschedule)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, status, date, time } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      );
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    if (status) session.status = status;
    if (date) session.date = date;
    if (time) session.time = time;

    sessions.set(sessionId, session);

    return NextResponse.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
