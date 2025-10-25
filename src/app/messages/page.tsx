'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquarePlus, Loader2 } from 'lucide-react';

// Conversation interface
interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch conversations
  const fetchConversations = async (search?: string) => {
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`/api/messages${query}`, {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setConversations(data.data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (searchQuery === '') {
      fetchConversations();
      return;
    }

    setSearchLoading(true);
    const timeoutId = setTimeout(() => {
      fetchConversations(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Format timestamp for display
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    // Format as date if older than a week
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Navigate to conversation
  const openConversation = (userId: string) => {
    router.push(`/messages/${userId}`);
  };

  return (
    <div className="min-h-screen page-gradient">
      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="hero-title">Messages</h1>
              <p className="hero-description">Connect with the RAWGLE community</p>
            </div>
            <Button className="gap-2">
              <MessageSquarePlus className="h-5 w-5" />
              New Message
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white border-gray-900/10"
              />
              {searchLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-teal-600" />
              )}
            </div>
          </div>

          {/* Conversations List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin icon-primary" />
            </div>
          ) : conversations.length === 0 ? (
            <Card className="card-feature-primary">
              <CardContent className="pt-6 text-center py-12">
                <MessageSquarePlus className="h-16 w-16 mx-auto mb-4 text-muted" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {searchQuery ? 'No conversations found' : 'No messages yet'}
                </h3>
                <p className="text-muted mb-6">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Start a conversation with other raw feeding enthusiasts'}
                </p>
                {!searchQuery && (
                  <Button className="gap-2">
                    <MessageSquarePlus className="h-5 w-5" />
                    Start New Conversation
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className="card-feature-primary hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-teal-600/20"
                  onClick={() => openConversation(conversation.userId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="h-14 w-14 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {conversation.userAvatar || conversation.userName[0]}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1">
                            <Badge className="bg-burnt-sienna text-white h-6 min-w-[24px] flex items-center justify-center px-1.5">
                              {conversation.unreadCount}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.userName}
                          </h3>
                          <span className="text-sm text-muted flex-shrink-0 ml-2">
                            {formatTimestamp(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate ${
                            conversation.unreadCount > 0
                              ? 'text-gray-900 font-medium'
                              : 'text-muted'
                          }`}
                        >
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
