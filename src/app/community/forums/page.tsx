'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Users, TrendingUp, Clock, Search, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateThreadModal } from '@/components/community/forums/create-thread-modal';

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
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  replyCount: number;
  viewCount: number;
  lastActivity: string;
  isPinned: boolean;
  isLocked: boolean;
}

export default function ForumsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('activity');
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/v2/api/community/forums');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch threads
  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoading(true);
      try {
        const categoryParam = selectedCategory === 'all' ? 'all' : selectedCategory;
        const response = await fetch(
          `/api/community/forums/${categoryParam}/threads?sort=${sortBy}&limit=50`
        );
        const data = await response.json();
        if (data.success) {
          setThreads(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch threads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [selectedCategory, sortBy]);

  const handleThreadCreated = () => {
    // Refresh threads after creating a new one
    const fetchThreads = async () => {
      try {
        const categoryParam = selectedCategory === 'all' ? 'all' : selectedCategory;
        const response = await fetch(
          `/api/community/forums/${categoryParam}/threads?sort=${sortBy}&limit=50`
        );
        const data = await response.json();
        if (data.success) {
          setThreads(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch threads:', error);
      }
    };

    fetchThreads();
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'just now';
    if (diffInMins < 60) return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Filter threads by search query
  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Button
              className="bg-white text-teal-600 hover:bg-sea-salt"
              onClick={() => setIsCreateModalOpen(true)}
            >
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
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-900/10 text-left"
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
              </button>
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
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="replies">Most Replies</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Threads List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-md">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              <span className="ml-2 text-gray-900/60">Loading threads...</span>
            </div>
          ) : filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <Link
                key={thread.id}
                href={`/community/forums/${thread.id}`}
                className="block bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-900/10"
              >
                <div className="flex gap-4">
                  <img
                    src={thread.author.avatar}
                    alt={thread.author.name}
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
                      <span className="font-medium">by {thread.author.name}</span>
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
                        <span>Last activity: {formatTimeAgo(thread.lastActivity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <MessageSquare className="h-16 w-16 text-gray-900/20 mx-auto mb-4" />
              <p className="text-gray-900/60 text-lg">No threads found</p>
              <p className="text-gray-900/50 text-sm mt-2">
                {searchQuery ? 'Try a different search term' : 'Be the first to start a discussion!'}
              </p>
              <Button
                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Thread
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Thread Modal */}
      <CreateThreadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories.map(c => ({ id: c.id, name: c.name, icon: c.icon }))}
        selectedCategoryId={selectedCategory !== 'all' ? selectedCategory : undefined}
        onThreadCreated={handleThreadCreated}
      />
    </div>
  );
}
