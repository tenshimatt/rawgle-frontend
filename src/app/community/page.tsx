'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/navigation/main-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MessageSquare, ThumbsUp, Loader2 } from 'lucide-react';
import { CreatePostDialog } from '@/components/community/create-post-dialog';

interface Post {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community/posts', {
        headers: { 'x-user-id': 'demo-user' },
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
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-persian-green rounded-full flex items-center justify-center text-charcoal font-bold">
                        {post.userName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">{post.userName}</p>
                        <p className="text-sm text-muted">{formatTimestamp(post.createdAt)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-bold text-lg mb-2 text-charcoal">{post.title}</h3>
                    <p className="text-charcoal mb-4">{post.content}</p>

                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full rounded-lg mb-4 max-h-96 object-cover"
                      />
                    )}

                    <div className="flex items-center gap-6 text-muted">
                      <button className="flex items-center gap-2 hover:text-persian-green transition-colors">
                        <ThumbsUp className="h-5 w-5" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-persian-green transition-colors">
                        <MessageSquare className="h-5 w-5" />
                        <span>{post.comments} comments</span>
                      </button>
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
