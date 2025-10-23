'use client';

import { useState } from 'react';
import { Trophy, Users, Calendar, Target, Plus, Search, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  participants: number;
  goals: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'upcoming' | 'active' | 'completed';
  rewards: string;
  progress?: number;
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Raw Feeding Challenge',
    description: 'Commit to 30 days of raw feeding and document your pet\'s transformation',
    duration: '30 days',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    participants: 2341,
    goals: ['Feed raw daily', 'Track meals', 'Share progress weekly', 'Complete health check'],
    difficulty: 'beginner',
    status: 'upcoming',
    rewards: '500 PAWS tokens',
  },
  {
    id: '2',
    title: 'Recipe Master Challenge',
    description: 'Create and share 10 unique raw feeding recipes',
    duration: '60 days',
    startDate: '2025-10-15',
    endDate: '2025-12-15',
    participants: 892,
    goals: ['Create 10 recipes', 'Get 50+ likes', 'Help 3 beginners', 'Include nutritional info'],
    difficulty: 'intermediate',
    status: 'active',
    rewards: '1000 PAWS tokens + Recipe Master Badge',
    progress: 35,
  },
  {
    id: '3',
    title: 'DIY Supplements Challenge',
    description: 'Learn to make your own supplements from whole foods',
    duration: '45 days',
    startDate: '2025-10-01',
    endDate: '2025-11-15',
    participants: 567,
    goals: ['Make 5 supplements', 'Document process', 'Share results', 'Test with pets'],
    difficulty: 'advanced',
    status: 'active',
    rewards: '750 PAWS tokens',
    progress: 62,
  },
];

export default function ChallengesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || challenge.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'beginner') return 'bg-green-100 text-green-800';
    if (difficulty === 'intermediate') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string) => {
    if (status === 'upcoming') return 'bg-blue-100 text-blue-800';
    if (status === 'active') return 'bg-teal-600/10 text-teal-600';
    return 'bg-gray-900/10 text-gray-900';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Community Challenges</h1>
              <p className="text-sea-salt text-lg">Join challenges, earn rewards, and grow together</p>
            </div>
            <Button className="bg-white text-teal-600 hover:bg-sea-salt">
              <Plus className="h-4 w-4 mr-2" />
              Suggest Challenge
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-900/40" />
              <Input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'upcoming', 'active', 'completed'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <Trophy className="h-8 w-8 text-maize" />
                <div className="flex flex-col gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(challenge.status)}`}>
                    {challenge.status.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{challenge.title}</h3>
              <p className="text-gray-900/70 text-sm mb-4">{challenge.description}</p>

              {/* Progress (if active and joined) */}
              {challenge.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-900/60">Your Progress</span>
                    <span className="font-semibold text-teal-600">{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-900/10 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Goals */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Goals:</h4>
                <ul className="space-y-1">
                  {challenge.goals.slice(0, 3).map((goal, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-900/70">
                      <CheckCircle2 className="h-4 w-4 text-teal-700" />
                      <span>{goal}</span>
                    </li>
                  ))}
                  {challenge.goals.length > 3 && (
                    <li className="text-sm text-gray-900/50">+{challenge.goals.length - 3} more goals</li>
                  )}
                </ul>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-900/60">
                  <Calendar className="h-4 w-4" />
                  <span>{challenge.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-900/60">
                  <Users className="h-4 w-4" />
                  <span>{challenge.participants} joined</span>
                </div>
              </div>

              {/* Rewards */}
              <div className="bg-maize/10 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-maize" />
                  <span className="text-sm font-semibold text-gray-900">{challenge.rewards}</span>
                </div>
              </div>

              {/* CTA */}
              <Button className="w-full" variant={challenge.status === 'upcoming' ? 'outline' : 'default'}>
                {challenge.status === 'upcoming' && 'Register Interest'}
                {challenge.status === 'active' && (challenge.progress !== undefined ? 'Continue' : 'Join Challenge')}
                {challenge.status === 'completed' && 'View Results'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
