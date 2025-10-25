'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Target,
  Trophy,
  TrendingUp,
  ChefHat,
  Users,
  GraduationCap,
  Heart,
  Award,
  Clock,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'feeding' | 'community' | 'education' | 'health';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  icon: string;
  reward?: string;
}

interface ChallengeStats {
  total: number;
  completed: number;
  inProgress: number;
  totalPoints: number;
}

// Category icons and colors
const categoryConfig = {
  feeding: { icon: ChefHat, color: 'bg-teal-500', label: 'Feeding' },
  community: { icon: Users, color: 'bg-blue-500', label: 'Community' },
  education: { icon: GraduationCap, color: 'bg-purple-500', label: 'Education' },
  health: { icon: Heart, color: 'bg-red-500', label: 'Health' },
};

// Difficulty badges
const difficultyConfig = {
  beginner: { color: 'bg-green-100 text-green-800', label: 'Beginner' },
  intermediate: { color: 'bg-yellow-100 text-yellow-800', label: 'Intermediate' },
  advanced: { color: 'bg-red-100 text-red-800', label: 'Advanced' },
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<ChallengeStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges');
      const data = await response.json();
      setChallenges(data.challenges);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async (challengeId: string) => {
    try {
      await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, action: 'start' }),
      });
      fetchChallenges();
    } catch (error) {
      console.error('Failed to start challenge:', error);
    }
  };

  const filteredChallenges = challenges.filter(
    (c) => activeCategory === 'all' || c.category === activeCategory
  );

  const activeChallenges = filteredChallenges.filter((c) => !c.isCompleted && c.progress > 0);
  const availableChallenges = filteredChallenges.filter((c) => !c.isCompleted && c.progress === 0);
  const completedChallenges = filteredChallenges.filter((c) => c.isCompleted);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Challenges</h1>
            <p className="text-gray-600">
              Complete challenges to earn points, badges, and level up your raw feeding journey
            </p>
          </div>
          <Link href="/challenges/leaderboard">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Challenges</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Target className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Points Earned</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalPoints}</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('all')}
            className={activeCategory === 'all' ? 'bg-teal-600 hover:bg-teal-700' : ''}
          >
            All Challenges
          </Button>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={key}
                variant={activeCategory === key ? 'default' : 'outline'}
                onClick={() => setActiveCategory(key)}
                className={activeCategory === key ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                <Icon className="w-4 h-4 mr-2" />
                {config.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Challenges Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active">Active ({activeChallenges.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableChallenges.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedChallenges.length})</TabsTrigger>
        </TabsList>

        {/* Active Challenges */}
        <TabsContent value="active" className="space-y-4">
          {activeChallenges.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active challenges. Start one to begin!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} isActive />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Available Challenges */}
        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onStart={() => handleStartChallenge(challenge.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Completed Challenges */}
        <TabsContent value="completed" className="space-y-4">
          {completedChallenges.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No completed challenges yet. Keep going!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} isCompleted />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Achievements CTA */}
      <Card className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <CardContent className="py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Award className="w-12 h-12 text-teal-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Unlock Achievements</h3>
                <p className="text-gray-600">
                  Complete challenges to earn exclusive badges and rewards
                </p>
              </div>
            </div>
            <Link href="/achievements">
              <Button className="bg-teal-600 hover:bg-teal-700">View Achievements</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Challenge Card Component
function ChallengeCard({
  challenge,
  isActive = false,
  isCompleted = false,
  onStart,
}: {
  challenge: Challenge;
  isActive?: boolean;
  isCompleted?: boolean;
  onStart?: () => void;
}) {
  const categoryInfo = categoryConfig[challenge.category];
  const CategoryIcon = categoryInfo.icon;
  const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;

  return (
    <Card className={isCompleted ? 'bg-green-50 border-green-200' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
              <CategoryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <Badge className={difficultyConfig[challenge.difficulty].color}>
            {difficultyConfig[challenge.difficulty].label}
          </Badge>
          <Badge variant="outline" className="border-teal-600 text-teal-600">
            <Star className="w-3 h-3 mr-1" />
            {challenge.points} pts
          </Badge>
          {challenge.reward && (
            <Badge variant="outline" className="border-purple-600 text-purple-600">
              <Trophy className="w-3 h-3 mr-1" />
              {challenge.reward}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!isCompleted && (
          <>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">
                  {challenge.progress} / {challenge.maxProgress}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {!isActive && onStart && (
              <Button onClick={onStart} className="w-full bg-teal-600 hover:bg-teal-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Start Challenge
              </Button>
            )}

            {isActive && (
              <div className="flex items-center justify-center py-2 bg-blue-50 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-600">In Progress</span>
              </div>
            )}
          </>
        )}

        {isCompleted && (
          <div className="flex items-center justify-center py-3 bg-green-100 rounded-lg">
            <Trophy className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-600">Completed!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
