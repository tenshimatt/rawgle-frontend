'use client';

import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, MessageSquare, ThumbsUp, Users } from 'lucide-react';
import { mockCommunityPosts } from '@/lib/mock-data';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Community & Social</h1>
              <p className="text-gray-600">Connect with other raw feeders</p>
            </div>
            <Button className="bg-purple-500 hover:bg-purple-600">
              <Plus className="h-5 w-5 mr-2" />
              New Post
            </Button>
          </div>

          <div className="space-y-4">
            {mockCommunityPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{post.author}</p>
                      <p className="text-sm text-gray-600">{post.timestamp}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-4">{post.content}</p>

                  <div className="flex items-center gap-6 text-gray-600">
                    <button className="flex items-center gap-2 hover:text-blue-500">
                      <ThumbsUp className="h-5 w-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-green-500">
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
