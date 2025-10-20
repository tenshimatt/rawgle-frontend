'use client';

import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, MessageSquare, ThumbsUp, Users } from 'lucide-react';
import { mockCommunityPosts } from '@/lib/mock-data';

export default function CommunityPage() {
  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="hero-title">Community & Social</h1>
              <p className="hero-description">Connect with other raw feeders</p>
            </div>
            <Button className="btn-secondary">
              <Plus className="h-5 w-5 mr-2" />
              New Post
            </Button>
          </div>

          <div className="space-y-4">
            {mockCommunityPosts.map((post) => (
              <Card key={post.id} className="card-feature-dark">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-sandy-brown rounded-full flex items-center justify-center text-white font-bold">
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal">{post.author}</p>
                      <p className="text-sm text-muted">{post.timestamp}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-bold text-lg mb-2 text-charcoal">{post.title}</h3>
                  <p className="text-charcoal mb-4">{post.content}</p>

                  <div className="flex items-center gap-6 text-muted">
                    <button className="flex items-center gap-2 hover:text-persian-green transition-colors">
                      <ThumbsUp className="h-5 w-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-persian-green transition-colors">
                      <MessageSquare className="h-5 w-5" />
                      <span>{post.replies} replies</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
