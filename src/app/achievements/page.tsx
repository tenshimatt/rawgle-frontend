'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Lock,
  Trophy,
  Star,
  ChefHat,
  Users,
  GraduationCap,
  Heart,
  Target,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'feeding' | 'community' | 'education' | 'health' | 'milestone';
  icon: string;
  isEarned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementStats {
  total: number;
  earned: number;
  locked: number;
  inProgress: number;
  percentComplete: number;
  byCategory: {
    feeding: number;
    community: number;
    education: number;
    health: number;
    milestone: number;
  };
  byRarity: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

// Category configuration
const categoryConfig = {
  feeding: { icon: ChefHat, color: 'bg-teal-500', label: 'Feeding' },
  community: { icon: Users, color: 'bg-blue-500', label: 'Community' },
  education: { icon: GraduationCap, color: 'bg-purple-500', label: 'Education' },
  health: { icon: Heart, color: 'bg-red-500', label: 'Health' },
  milestone: { icon: Target, color: 'bg-yellow-500', label: 'Milestones' },
};

// Rarity configuration
const rarityConfig = {
  common: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Common' },
  rare: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Rare' },
  epic: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'Epic' },
  legendary: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Legendary' },
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'earned' | 'locked'>('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/v2/api/achievements');
      const data = await response.json();
      setAchievements(data.achievements);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = achievements.filter((achievement) => {
    const categoryMatch = activeCategory === 'all' || achievement.category === activeCategory;
    const filterMatch =
      activeFilter === 'all' ||
      (activeFilter === 'earned' && achievement.isEarned) ||
      (activeFilter === 'locked' && !achievement.isEarned);
    return categoryMatch && filterMatch;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Achievements</h1>
            <p className="text-gray-600">
              Unlock badges by completing challenges and milestones
            </p>
          </div>
          <Link href="/challenges">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Trophy className="w-4 h-4 mr-2" />
              View Challenges
            </Button>
          </Link>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
                <p className="text-sm text-gray-600">
                  {stats.earned} of {stats.total} achievements unlocked
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-teal-600">{stats.percentComplete}%</p>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
            <Progress value={stats.percentComplete} className="h-3" />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.earned}</p>
                <p className="text-sm text-gray-600">Earned</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.locked}</p>
                <p className="text-sm text-gray-600">Locked</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.byRarity.legendary}</p>
                <p className="text-sm text-gray-600">Legendary</p>
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
            All ({stats.total})
          </Button>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = stats.byCategory[key as keyof typeof stats.byCategory];
            return (
              <Button
                key={key}
                variant={activeCategory === key ? 'default' : 'outline'}
                onClick={() => setActiveCategory(key)}
                className={activeCategory === key ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                <Icon className="w-4 h-4 mr-2" />
                {config.label} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="earned">Earned</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AchievementGrid achievements={filteredAchievements} />
        </TabsContent>

        <TabsContent value="earned">
          <AchievementGrid achievements={filteredAchievements.filter((a) => a.isEarned)} />
        </TabsContent>

        <TabsContent value="locked">
          <AchievementGrid achievements={filteredAchievements.filter((a) => !a.isEarned)} />
        </TabsContent>
      </Tabs>

      {/* Rarity Breakdown */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Rarity Breakdown</CardTitle>
          <CardDescription>Your collection by rarity level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(rarityConfig).map(([key, config]) => {
              const count = stats.byRarity[key as keyof typeof stats.byRarity];
              const earned = achievements.filter(
                (a) => a.rarity === key && a.isEarned
              ).length;
              return (
                <div key={key} className={`p-4 rounded-lg ${config.bg}`}>
                  <div className="text-center">
                    <Star className={`w-6 h-6 mx-auto mb-2 ${config.color}`} />
                    <p className={`font-bold ${config.color}`}>{config.label}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {earned} / {count}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Achievement Grid Component
function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  if (achievements.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No achievements found in this category</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}

// Achievement Card Component
function AchievementCard({ achievement }: { achievement: Achievement }) {
  const categoryInfo = categoryConfig[achievement.category];
  const rarityInfo = rarityConfig[achievement.rarity];
  const CategoryIcon = categoryInfo.icon;

  const hasProgress = achievement.progress !== undefined && achievement.maxProgress !== undefined;
  const progressPercentage = hasProgress
    ? (achievement.progress! / achievement.maxProgress!) * 100
    : 0;

  return (
    <Card
      className={`relative overflow-hidden ${
        achievement.isEarned
          ? 'bg-gradient-to-br from-white to-teal-50 border-teal-200'
          : 'bg-gray-50 opacity-75'
      }`}
    >
      {/* Rarity indicator */}
      <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg ${rarityInfo.bg}`}>
        <p className={`text-xs font-semibold ${rarityInfo.color}`}>{rarityInfo.label}</p>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <div
            className={`p-3 rounded-lg ${
              achievement.isEarned ? categoryInfo.color : 'bg-gray-300'
            } ${!achievement.isEarned && 'opacity-50'}`}
          >
            {achievement.isEarned ? (
              <CategoryIcon className="w-6 h-6 text-white" />
            ) : (
              <Lock className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{achievement.title}</CardTitle>
            <CardDescription className="mt-1">{achievement.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {achievement.isEarned && achievement.earnedDate && (
          <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Unlocked!</span>
            </div>
            <span className="text-xs text-gray-600">{achievement.earnedDate}</span>
          </div>
        )}

        {!achievement.isEarned && hasProgress && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {achievement.progress} / {achievement.maxProgress}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {!achievement.isEarned && !hasProgress && (
          <div className="flex items-center justify-center py-2 bg-gray-100 rounded-lg">
            <Lock className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-700">Locked</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            <CategoryIcon className="w-3 h-3 mr-1" />
            {categoryInfo.label}
          </Badge>
          {achievement.isEarned && (
            <Star className={`w-5 h-5 ${rarityInfo.color} fill-current`} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
