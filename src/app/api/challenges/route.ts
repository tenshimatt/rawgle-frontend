import { NextResponse } from 'next/server';

// Challenge categories
export type ChallengeCategory = 'feeding' | 'community' | 'education' | 'health';

// Challenge difficulty
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';

// Challenge interface
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  points: number;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  icon: string;
  reward?: string;
  expiresAt?: string;
}

// Leaderboard user interface
export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  points: number;
  badges: number;
  level: number;
  trend: 'up' | 'down' | 'same';
  isCurrentUser?: boolean;
}

// In-memory storage
const challengesData: Map<string, Challenge> = new Map([
  // FEEDING CHALLENGES (10)
  [
    'feed-1',
    {
      id: 'feed-1',
      title: 'Raw Feeding Starter',
      description: 'Complete your first week of raw feeding',
      category: 'feeding',
      difficulty: 'beginner',
      points: 100,
      progress: 5,
      maxProgress: 7,
      isCompleted: false,
      icon: 'drumstick',
      reward: 'Beginner Badge',
    },
  ],
  [
    'feed-2',
    {
      id: 'feed-2',
      title: 'Variety Master',
      description: 'Feed 10 different protein sources',
      category: 'feeding',
      difficulty: 'intermediate',
      points: 250,
      progress: 6,
      maxProgress: 10,
      isCompleted: false,
      icon: 'chef-hat',
      reward: 'Variety Badge',
    },
  ],
  [
    'feed-3',
    {
      id: 'feed-3',
      title: 'Consistent Feeder',
      description: 'Log meals for 30 consecutive days',
      category: 'feeding',
      difficulty: 'intermediate',
      points: 300,
      progress: 18,
      maxProgress: 30,
      isCompleted: false,
      icon: 'calendar-check',
      reward: 'Dedication Badge',
    },
  ],
  [
    'feed-4',
    {
      id: 'feed-4',
      title: 'Perfect Balance',
      description: 'Maintain 80/10/10 ratio for a week',
      category: 'feeding',
      difficulty: 'advanced',
      points: 400,
      progress: 3,
      maxProgress: 7,
      isCompleted: false,
      icon: 'scales',
      reward: 'Balance Master Badge',
    },
  ],
  [
    'feed-5',
    {
      id: 'feed-5',
      title: 'Organ Master',
      description: 'Successfully feed 5 different organ types',
      category: 'feeding',
      difficulty: 'intermediate',
      points: 200,
      progress: 3,
      maxProgress: 5,
      isCompleted: false,
      icon: 'heart-pulse',
    },
  ],
  [
    'feed-6',
    {
      id: 'feed-6',
      title: 'Bone Broth Expert',
      description: 'Make and serve bone broth 3 times',
      category: 'feeding',
      difficulty: 'beginner',
      points: 150,
      progress: 1,
      maxProgress: 3,
      isCompleted: false,
      icon: 'soup',
    },
  ],
  [
    'feed-7',
    {
      id: 'feed-7',
      title: 'Meal Prep Pro',
      description: 'Prepare and freeze 20 meals in advance',
      category: 'feeding',
      difficulty: 'intermediate',
      points: 250,
      progress: 8,
      maxProgress: 20,
      isCompleted: false,
      icon: 'package',
    },
  ],
  [
    'feed-8',
    {
      id: 'feed-8',
      title: 'Wild Game Hunter',
      description: 'Feed exotic proteins (venison, rabbit, duck)',
      category: 'feeding',
      difficulty: 'advanced',
      points: 350,
      progress: 1,
      maxProgress: 3,
      isCompleted: false,
      icon: 'mountain',
    },
  ],
  [
    'feed-9',
    {
      id: 'feed-9',
      title: 'Seafood Specialist',
      description: 'Introduce 5 different fish or seafood proteins',
      category: 'feeding',
      difficulty: 'intermediate',
      points: 200,
      progress: 2,
      maxProgress: 5,
      isCompleted: false,
      icon: 'fish',
    },
  ],
  [
    'feed-10',
    {
      id: 'feed-10',
      title: 'Zero Waste Warrior',
      description: 'Use all parts of the animal for 10 meals',
      category: 'feeding',
      difficulty: 'advanced',
      points: 400,
      progress: 4,
      maxProgress: 10,
      isCompleted: false,
      icon: 'recycle',
    },
  ],

  // COMMUNITY CHALLENGES (8)
  [
    'comm-1',
    {
      id: 'comm-1',
      title: 'Helpful Hand',
      description: 'Answer 5 community questions',
      category: 'community',
      difficulty: 'beginner',
      points: 150,
      progress: 2,
      maxProgress: 5,
      isCompleted: false,
      icon: 'helping-hand',
      reward: 'Helper Badge',
    },
  ],
  [
    'comm-2',
    {
      id: 'comm-2',
      title: 'Social Butterfly',
      description: 'Make 10 new connections',
      category: 'community',
      difficulty: 'beginner',
      points: 100,
      progress: 7,
      maxProgress: 10,
      isCompleted: false,
      icon: 'users',
    },
  ],
  [
    'comm-3',
    {
      id: 'comm-3',
      title: 'Recipe Creator',
      description: 'Share 5 raw feeding recipes',
      category: 'community',
      difficulty: 'intermediate',
      points: 250,
      progress: 2,
      maxProgress: 5,
      isCompleted: false,
      icon: 'book-open',
      reward: 'Chef Badge',
    },
  ],
  [
    'comm-4',
    {
      id: 'comm-4',
      title: 'Photo Pro',
      description: 'Share 20 meal photos',
      category: 'community',
      difficulty: 'intermediate',
      points: 200,
      progress: 12,
      maxProgress: 20,
      isCompleted: false,
      icon: 'camera',
    },
  ],
  [
    'comm-5',
    {
      id: 'comm-5',
      title: 'Mentor',
      description: 'Help 3 new raw feeders get started',
      category: 'community',
      difficulty: 'advanced',
      points: 500,
      progress: 1,
      maxProgress: 3,
      isCompleted: false,
      icon: 'award',
      reward: 'Mentor Badge',
    },
  ],
  [
    'comm-6',
    {
      id: 'comm-6',
      title: 'Event Organizer',
      description: 'Host or attend 3 raw feeding meetups',
      category: 'community',
      difficulty: 'advanced',
      points: 400,
      progress: 0,
      maxProgress: 3,
      isCompleted: false,
      icon: 'calendar',
    },
  ],
  [
    'comm-7',
    {
      id: 'comm-7',
      title: 'Success Story',
      description: 'Share your raw feeding transformation story',
      category: 'community',
      difficulty: 'beginner',
      points: 150,
      progress: 0,
      maxProgress: 1,
      isCompleted: false,
      icon: 'star',
    },
  ],
  [
    'comm-8',
    {
      id: 'comm-8',
      title: 'Engagement Champion',
      description: 'Like and comment on 50 posts',
      category: 'community',
      difficulty: 'intermediate',
      points: 200,
      progress: 28,
      maxProgress: 50,
      isCompleted: false,
      icon: 'message-circle',
    },
  ],

  // EDUCATION CHALLENGES (7)
  [
    'edu-1',
    {
      id: 'edu-1',
      title: 'Knowledge Seeker',
      description: 'Complete 5 educational courses',
      category: 'education',
      difficulty: 'beginner',
      points: 300,
      progress: 2,
      maxProgress: 5,
      isCompleted: false,
      icon: 'graduation-cap',
      reward: 'Scholar Badge',
    },
  ],
  [
    'edu-2',
    {
      id: 'edu-2',
      title: 'Quiz Master',
      description: 'Score 100% on 10 quizzes',
      category: 'education',
      difficulty: 'intermediate',
      points: 250,
      progress: 6,
      maxProgress: 10,
      isCompleted: false,
      icon: 'brain',
    },
  ],
  [
    'edu-3',
    {
      id: 'edu-3',
      title: 'Nutrition Expert',
      description: 'Complete advanced nutrition course',
      category: 'education',
      difficulty: 'advanced',
      points: 500,
      progress: 0,
      maxProgress: 1,
      isCompleted: false,
      icon: 'microscope',
      reward: 'Nutrition Expert Badge',
    },
  ],
  [
    'edu-4',
    {
      id: 'edu-4',
      title: 'Research Reader',
      description: 'Read and share 10 scientific articles',
      category: 'education',
      difficulty: 'intermediate',
      points: 300,
      progress: 4,
      maxProgress: 10,
      isCompleted: false,
      icon: 'file-text',
    },
  ],
  [
    'edu-5',
    {
      id: 'edu-5',
      title: 'Workshop Warrior',
      description: 'Attend 5 live workshops or webinars',
      category: 'education',
      difficulty: 'intermediate',
      points: 350,
      progress: 2,
      maxProgress: 5,
      isCompleted: false,
      icon: 'video',
    },
  ],
  [
    'edu-6',
    {
      id: 'edu-6',
      title: 'Certification Candidate',
      description: 'Complete raw feeding certification program',
      category: 'education',
      difficulty: 'advanced',
      points: 1000,
      progress: 0,
      maxProgress: 1,
      isCompleted: false,
      icon: 'badge-check',
      reward: 'Certified Raw Feeder Badge',
    },
  ],
  [
    'edu-7',
    {
      id: 'edu-7',
      title: 'Daily Learner',
      description: 'Complete educational content for 30 days straight',
      category: 'education',
      difficulty: 'intermediate',
      points: 400,
      progress: 14,
      maxProgress: 30,
      isCompleted: false,
      icon: 'book',
    },
  ],

  // HEALTH CHALLENGES (7)
  [
    'health-1',
    {
      id: 'health-1',
      title: 'Health Tracker',
      description: 'Log pet health metrics for 14 days',
      category: 'health',
      difficulty: 'beginner',
      points: 200,
      progress: 8,
      maxProgress: 14,
      isCompleted: false,
      icon: 'heart',
    },
  ],
  [
    'health-2',
    {
      id: 'health-2',
      title: 'Weight Watcher',
      description: 'Track weight weekly for 8 weeks',
      category: 'health',
      difficulty: 'intermediate',
      points: 250,
      progress: 4,
      maxProgress: 8,
      isCompleted: false,
      icon: 'activity',
    },
  ],
  [
    'health-3',
    {
      id: 'health-3',
      title: 'Vet Partnership',
      description: 'Have 3 vet checkups with raw feeding discussion',
      category: 'health',
      difficulty: 'intermediate',
      points: 300,
      progress: 1,
      maxProgress: 3,
      isCompleted: false,
      icon: 'stethoscope',
    },
  ],
  [
    'health-4',
    {
      id: 'health-4',
      title: 'Symptom Tracker',
      description: 'Document health improvements for 30 days',
      category: 'health',
      difficulty: 'intermediate',
      points: 350,
      progress: 15,
      maxProgress: 30,
      isCompleted: false,
      icon: 'clipboard',
    },
  ],
  [
    'health-5',
    {
      id: 'health-5',
      title: 'Allergy Detective',
      description: 'Successfully identify and eliminate food allergens',
      category: 'health',
      difficulty: 'advanced',
      points: 400,
      progress: 0,
      maxProgress: 1,
      isCompleted: false,
      icon: 'search',
    },
  ],
  [
    'health-6',
    {
      id: 'health-6',
      title: 'Dental Health Champion',
      description: 'Track dental health improvements over 12 weeks',
      category: 'health',
      difficulty: 'intermediate',
      points: 300,
      progress: 5,
      maxProgress: 12,
      isCompleted: false,
      icon: 'smile',
    },
  ],
  [
    'health-7',
    {
      id: 'health-7',
      title: 'Transformation Story',
      description: 'Document before/after health transformation',
      category: 'health',
      difficulty: 'advanced',
      points: 500,
      progress: 0,
      maxProgress: 1,
      isCompleted: false,
      icon: 'trending-up',
      reward: 'Transformation Badge',
    },
  ],
]);

// Leaderboard data
const leaderboardData: Map<string, LeaderboardUser[]> = new Map([
  [
    'weekly',
    [
      {
        id: '1',
        rank: 1,
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        points: 2850,
        badges: 24,
        level: 12,
        trend: 'up',
      },
      {
        id: '2',
        rank: 2,
        name: 'Mike Thompson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        points: 2640,
        badges: 21,
        level: 11,
        trend: 'up',
      },
      {
        id: '3',
        rank: 3,
        name: 'Emily Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        points: 2420,
        badges: 19,
        level: 10,
        trend: 'same',
      },
      {
        id: '4',
        rank: 4,
        name: 'David Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        points: 2180,
        badges: 18,
        level: 10,
        trend: 'down',
        isCurrentUser: true,
      },
      {
        id: '5',
        rank: 5,
        name: 'Lisa Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        points: 2050,
        badges: 17,
        level: 9,
        trend: 'up',
      },
      {
        id: '6',
        rank: 6,
        name: 'James Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        points: 1920,
        badges: 15,
        level: 9,
        trend: 'up',
      },
      {
        id: '7',
        rank: 7,
        name: 'Rachel Green',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
        points: 1780,
        badges: 14,
        level: 8,
        trend: 'same',
      },
      {
        id: '8',
        rank: 8,
        name: 'Tom Brown',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
        points: 1650,
        badges: 13,
        level: 8,
        trend: 'down',
      },
      {
        id: '9',
        rank: 9,
        name: 'Amy Taylor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amy',
        points: 1520,
        badges: 12,
        level: 7,
        trend: 'up',
      },
      {
        id: '10',
        rank: 10,
        name: 'Chris Lee',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
        points: 1400,
        badges: 11,
        level: 7,
        trend: 'same',
      },
    ],
  ],
  [
    'monthly',
    [
      {
        id: '1',
        rank: 1,
        name: 'Emily Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        points: 8450,
        badges: 32,
        level: 15,
        trend: 'up',
      },
      {
        id: '2',
        rank: 2,
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        points: 8120,
        badges: 28,
        level: 14,
        trend: 'same',
      },
      {
        id: '3',
        rank: 3,
        name: 'Mike Thompson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        points: 7890,
        badges: 26,
        level: 14,
        trend: 'up',
      },
      {
        id: '4',
        rank: 4,
        name: 'David Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        points: 7230,
        badges: 24,
        level: 13,
        trend: 'up',
        isCurrentUser: true,
      },
      {
        id: '5',
        rank: 5,
        name: 'Lisa Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        points: 6980,
        badges: 22,
        level: 12,
        trend: 'down',
      },
    ],
  ],
  [
    'all-time',
    [
      {
        id: '1',
        rank: 1,
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        points: 28500,
        badges: 48,
        level: 25,
        trend: 'up',
      },
      {
        id: '2',
        rank: 2,
        name: 'Emily Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        points: 26400,
        badges: 45,
        level: 24,
        trend: 'up',
      },
      {
        id: '3',
        rank: 3,
        name: 'Mike Thompson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        points: 24200,
        badges: 42,
        level: 22,
        trend: 'same',
      },
      {
        id: '4',
        rank: 4,
        name: 'David Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        points: 21800,
        badges: 38,
        level: 20,
        trend: 'up',
        isCurrentUser: true,
      },
      {
        id: '5',
        rank: 5,
        name: 'Lisa Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        points: 20500,
        badges: 36,
        level: 19,
        trend: 'down',
      },
    ],
  ],
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const timeframe = searchParams.get('timeframe') || 'weekly';

  // Return leaderboard data
  if (type === 'leaderboard') {
    const data = leaderboardData.get(timeframe) || leaderboardData.get('weekly');
    return NextResponse.json({
      leaderboard: data,
      timeframe,
    });
  }

  // Return all challenges
  const challenges = Array.from(challengesData.values());
  return NextResponse.json({
    challenges,
    stats: {
      total: challenges.length,
      completed: challenges.filter((c) => c.isCompleted).length,
      inProgress: challenges.filter((c) => c.progress > 0 && !c.isCompleted).length,
      totalPoints: challenges.reduce((sum, c) => sum + (c.isCompleted ? c.points : 0), 0),
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { challengeId, action } = body;

  if (!challengeId) {
    return NextResponse.json({ error: 'Challenge ID required' }, { status: 400 });
  }

  const challenge = challengesData.get(challengeId);
  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  // Start challenge
  if (action === 'start') {
    challenge.progress = 1;
    challengesData.set(challengeId, challenge);
    return NextResponse.json({ success: true, challenge });
  }

  // Update progress
  if (action === 'progress') {
    const { increment = 1 } = body;
    challenge.progress = Math.min(challenge.progress + increment, challenge.maxProgress);
    challenge.isCompleted = challenge.progress >= challenge.maxProgress;
    challengesData.set(challengeId, challenge);
    return NextResponse.json({ success: true, challenge });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
