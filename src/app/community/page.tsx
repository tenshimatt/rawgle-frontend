'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/navigation/main-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { CreatePostDialog } from '@/components/community/create-post-dialog';
import { EditPostDialog } from '@/components/community/edit-post-dialog';
import { SocialActions } from '@/components/community/social/social-actions';

interface Post {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  category?: 'general' | 'health' | 'nutrition' | 'success' | 'question';
  tags?: string[];
  photos?: string[];
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt?: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = 'demo-user'; // In production, get from auth context

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community/posts', {
        headers: { 'x-user-id': currentUserId },
      });
      const data = await response.json();
      setPosts(data.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="hero-title">Community & Social</h1>
              <p className="hero-description">Connect with other pet owners</p>
            </div>
            <CreatePostDialog onPostCreated={fetchPosts} />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin icon-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="card-feature-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-teal-600 rounded-full flex items-center justify-center text-gray-900 font-bold">
                          {post.userName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{post.userName}</p>
                          <p className="text-sm text-muted">{formatTimestamp(post.createdAt)}</p>
                        </div>
                      </div>
                      <EditPostDialog
                        post={post}
                        currentUserId={currentUserId}
                        onPostUpdated={fetchPosts}
                        onPostDeleted={fetchPosts}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{post.title}</h3>
                    <p className="text-gray-900 mb-4 whitespace-pre-wrap">{post.content}</p>

                    {/* Category Badge */}
                    {post.category && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-teal-600/10 text-teal-600 rounded-full">
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-sea-salt text-gray-900 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Photos - support both new photos array and legacy image field */}
                    {((post.photos && post.photos.length > 0) || post.image) && (
                      <div className="mb-4">
                        {post.photos && post.photos.length > 1 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {post.photos.map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`${post.title} - Photo ${index + 1}`}
                                className="w-full rounded-lg max-h-64 object-cover"
                              />
                            ))}
                          </div>
                        ) : (
                          <img
                            src={post.photos?.[0] || post.image}
                            alt={post.title}
                            className="w-full rounded-lg max-h-96 object-cover"
                          />
                        )}
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-900/10">
                      <SocialActions
                        itemId={post.id}
                        itemType="post"
                        title={post.title}
                        description={post.content}
                        initialLikes={post.likes}
                        initialComments={post.comments}
                        showComments={true}
                      />
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
