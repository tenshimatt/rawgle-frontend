'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Users, TrendingUp, Clock, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  threadCount: number;
  postCount: number;
  color: string;
}

interface ForumThread {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  replyCount: number;
  viewCount: number;
  lastActivity: string;
  isPinned: boolean;
  isLocked: boolean;
}

const categories: ForumCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'New to raw feeding? Start here for basics and beginner tips',
    icon: '🌱',
    threadCount: 156,
    postCount: 2341,
    color: 'bg-green-100 text-green-800',
  },
  {
    id: 'recipes-nutrition',
    name: 'Recipes & Nutrition',
    description: 'Share recipes, meal plans, and nutritional advice',
    icon: '🍖',
    threadCount: 423,
    postCount: 5892,
    color: 'bg-orange-100 text-orange-800',
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    description: 'Discuss health concerns, vet visits, and wellness tips',
    icon: '💊',
    threadCount: 298,
    postCount: 4102,
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'success-stories',
    name: 'Success Stories',
    description: 'Share your raw feeding success stories and transformations',
    icon: '⭐',
    threadCount: 189,
    postCount: 1567,
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    id: 'suppliers-products',
    name: 'Suppliers & Products',
    description: 'Recommend suppliers, products, and equipment',
    icon: '🛒',
    threadCount: 234,
    postCount: 3201,
    color: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'off-topic',
    name: 'Off-Topic',
    description: 'General pet discussions not related to raw feeding',
    icon: '💬',
    threadCount: 112,
    postCount: 1823,
    color: 'bg-gray-100 text-gray-800',
  },
];

const sampleThreads: ForumThread[] = [
  {
    id: '1',
    categoryId: 'getting-started',
    title: 'Complete Beginner\'s Guide to Raw Feeding - Start Here!',
    content: 'Everything you need to know to get started with raw feeding...',
    author: 'Sarah M.',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: '2025-10-15T10:00:00Z',
    replyCount: 127,
    viewCount: 3421,
    lastActivity: '2 hours ago',
    isPinned: true,
    isLocked: false,
  },
  {
    id: '2',
    categoryId: 'recipes-nutrition',
    title: 'Best chicken-based raw recipes for dogs?',
    content: 'Looking for some tried and tested chicken recipes for my golden retriever...',
    author: 'Mike Chen',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    createdAt: '2025-10-21T14:30:00Z',
    replyCount: 23,
    viewCount: 456,
    lastActivity: '15 minutes ago',
    isPinned: false,
    isLocked: false,
  },
  {
    id: '3',
    categoryId: 'health-wellness',
    title: 'My dog\'s coat improved dramatically after switching to raw!',
    content: 'I wanted to share my experience after 3 months of raw feeding...',
    author: 'Jennifer L.',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    createdAt: '2025-10-22T09:00:00Z',
    replyCount: 45,
    viewCount: 892,
    lastActivity: '1 hour ago',
    isPinned: false,
    isLocked: false,
  },
];

export default function ForumsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('activity');

  const filteredThreads = sampleThreads
    .filter((thread) => {
      const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || thread.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'activity') return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      if (sortBy === 'replies') return b.replyCount - a.replyCount;
      if (sortBy === 'views') return b.viewCount - a.viewCount;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Community Forums</h1>
              <p className="text-sea-salt text-lg">Connect, learn, and share with fellow raw feeding enthusiasts</p>
            </div>
            <Button className="bg-white text-teal-600 hover:bg-sea-salt">
              <Plus className="h-4 w-4 mr-2" />
              New Thread
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/community/forums?category=${category.id}`}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-900/10"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-900/70 mb-3">{category.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-900/60">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{category.threadCount} threads</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{category.postCount} posts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-900/40" />
              <Input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">Recent Activity</SelectItem>
                <SelectItem value="replies">Most Replies</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Threads List */}
        <div className="space-y-4">
          {filteredThreads.map((thread) => (
            <Link
              key={thread.id}
              href={`/community/forums/${thread.id}`}
              className="block bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-900/10"
            >
              <div className="flex gap-4">
                <img
                  src={thread.authorAvatar}
                  alt={thread.author}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {thread.isPinned && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-teal-600 text-white rounded mr-2">
                          PINNED
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-gray-900 hover:text-teal-600 inline">
                        {thread.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-900/70 text-sm mb-3 line-clamp-2">{thread.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-900/60">
                    <span className="font-medium">by {thread.author}</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{thread.replyCount} replies</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{thread.viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Last activity: {thread.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filteredThreads.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <MessageSquare className="h-16 w-16 text-gray-900/20 mx-auto mb-4" />
              <p className="text-gray-900/60 text-lg">No threads found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
