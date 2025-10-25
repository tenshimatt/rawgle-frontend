'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Medal, TrendingUp, TrendingDown, Minus, Star, Award, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardUser {
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

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard(timeframe);
  }, [timeframe]);

  const fetchLeaderboard = async (period: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/challenges?type=leaderboard&timeframe=${period}`);
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'same':
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">1</div>;
      case 2:
        return <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">2</div>;
      case 3:
        return <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">3</div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">{rank}</div>;
    }
  };

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
        <Link href="/challenges">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Challenges
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
            <p className="text-gray-600">
              See how you rank against other raw feeding enthusiasts
            </p>
          </div>
          <Trophy className="w-12 h-12 text-teal-600" />
        </div>

        {/* Timeframe Tabs */}
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all-time">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Top 3 Podium */}
      {topThree.length === 3 && (
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-12">
              <Card className="w-full border-gray-300 bg-gradient-to-b from-gray-50 to-white">
                <CardContent className="pt-6 pb-4 text-center">
                  <div className="mb-3">
                    <Medal className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 overflow-hidden">
                      <Image
                        src={topThree[1].avatar}
                        alt={topThree[1].name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{topThree[1].name}</h3>
                    <p className="text-sm text-gray-600">Level {topThree[1].level}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-700">{topThree[1].points.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">points</p>
                    <Badge variant="outline" className="mt-2">
                      <Award className="w-3 h-3 mr-1" />
                      {topThree[1].badges} badges
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <div className="w-full h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <Card className="w-full border-yellow-400 bg-gradient-to-b from-yellow-50 to-white shadow-lg">
                <CardContent className="pt-6 pb-4 text-center">
                  <div className="mb-3">
                    <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                    <div className="w-20 h-20 rounded-full bg-yellow-200 mx-auto mb-3 overflow-hidden ring-4 ring-yellow-400">
                      <Image
                        src={topThree[0].avatar}
                        alt={topThree[0].name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">{topThree[0].name}</h3>
                    <p className="text-sm text-gray-600">Level {topThree[0].level}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-yellow-600">{topThree[0].points.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">points</p>
                    <Badge className="mt-2 bg-yellow-500 hover:bg-yellow-600">
                      <Award className="w-3 h-3 mr-1" />
                      {topThree[0].badges} badges
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <div className="w-full h-32 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-lg flex items-center justify-center">
                <span className="text-4xl font-bold text-white">1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-16">
              <Card className="w-full border-orange-300 bg-gradient-to-b from-orange-50 to-white">
                <CardContent className="pt-6 pb-4 text-center">
                  <div className="mb-3">
                    <Medal className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                    <div className="w-16 h-16 rounded-full bg-orange-200 mx-auto mb-3 overflow-hidden">
                      <Image
                        src={topThree[2].avatar}
                        alt={topThree[2].name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{topThree[2].name}</h3>
                    <p className="text-sm text-gray-600">Level {topThree[2].level}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-orange-600">{topThree[2].points.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">points</p>
                    <Badge variant="outline" className="mt-2 border-orange-400 text-orange-600">
                      <Award className="w-3 h-3 mr-1" />
                      {topThree[2].badges} badges
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <div className="w-full h-16 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {restOfLeaderboard.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  user.isCurrentUser
                    ? 'bg-teal-50 border-2 border-teal-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  {getRankBadge(user.rank)}

                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{user.name}</h4>
                      {user.isCurrentUser && (
                        <Badge variant="outline" className="border-teal-600 text-teal-600">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Level {user.level}</p>
                  </div>

                  <div className="hidden md:flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Points</p>
                      <p className="font-bold text-gray-900">{user.points.toLocaleString()}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">Badges</p>
                      <p className="font-bold text-gray-900">{user.badges}</p>
                    </div>

                    <div className="flex items-center justify-center w-12">
                      {getTrendIcon(user.trend)}
                    </div>
                  </div>
                </div>

                <div className="md:hidden flex flex-col items-end space-y-1">
                  <p className="font-bold text-gray-900">{user.points.toLocaleString()}</p>
                  <div className="flex items-center space-x-1">
                    <Award className="w-3 h-3 text-gray-600" />
                    <span className="text-sm text-gray-600">{user.badges}</span>
                    {getTrendIcon(user.trend)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Rank Up */}
      <Card className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <CardContent className="py-8">
          <div className="text-center">
            <Star className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Want to Rank Higher?</h3>
            <p className="text-gray-600 mb-4">
              Complete challenges, earn badges, and stay active to climb the leaderboard
            </p>
            <Link href="/challenges">
              <Button className="bg-teal-600 hover:bg-teal-700">
                View Challenges
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
