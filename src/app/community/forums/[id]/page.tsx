import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Eye, Clock, Lock, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SocialActions } from '@/components/community/social/social-actions';
import { CommentSection } from '@/components/community/social/comment-section';
import { CommentInput } from '@/components/community/social/comment-input';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Sample thread data
const getThread = async (id: string) => {
  const threads: Record<string, any> = {
    '1': {
      id: '1',
      title: 'Complete Beginner\'s Guide to Raw Feeding - Start Here!',
      content: `# Welcome to Raw Feeding!

This comprehensive guide will help you understand the basics of raw feeding and get started safely.

## What is Raw Feeding?

Raw feeding is a diet consisting of uncooked meats, bones, organs, and sometimes vegetables that mimics what animals would eat in nature. It's based on the BARF (Biologically Appropriate Raw Food) diet principles.

## Getting Started

1. **Do Your Research** - Read books, join communities, and consult with a raw-feeding knowledgeable vet
2. **Start Slow** - Transition gradually over 7-14 days
3. **Balance is Key** - Aim for 80% meat, 10% bone, 10% organ
4. **Quality Matters** - Source high-quality, human-grade ingredients

## Safety Tips

- Handle raw meat safely (separate cutting boards, wash hands)
- Source from reputable suppliers
- Monitor your pet's health during transition
- Keep accurate feeding records

Feel free to ask questions below!`,
      author: 'Sarah M.',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      createdAt: '2025-10-15T10:00:00Z',
      category: 'Getting Started',
      replyCount: 127,
      viewCount: 3421,
      isPinned: true,
      isLocked: false,
      likes: 89,
      saved: 156,
    },
  };

  return threads[id] || null;
};

export default async function ForumThreadPage({ params }: PageProps) {
  const { id } = await params;
  const thread = await getThread(id);

  if (!thread) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/community/forums"
          className="inline-flex items-center gap-2 text-persian-green hover:text-moss-green mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Forums
        </Link>

        {/* Thread Header */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={thread.authorAvatar}
              alt={thread.author}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {thread.isPinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-persian-green text-white rounded">
                    <Pin className="h-3 w-3" />
                    PINNED
                  </span>
                )}
                {thread.isLocked && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-charcoal text-white rounded">
                    <Lock className="h-3 w-3" />
                    LOCKED
                  </span>
                )}
                <span className="px-2 py-1 text-xs font-semibold bg-moss-green/10 text-moss-green rounded">
                  {thread.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-charcoal mb-2">{thread.title}</h1>
              <div className="flex items-center gap-4 text-sm text-charcoal/60">
                <span className="font-medium">by {thread.author}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{thread.replyCount} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{thread.viewCount} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thread Content */}
          <div className="prose prose-charcoal max-w-none mb-6">
            <div dangerouslySetInnerHTML={{ __html: thread.content.replace(/\n/g, '<br/>') }} />
          </div>

          {/* Social Actions */}
          <div className="border-t border-charcoal/10 pt-4">
            <SocialActions
              itemId={thread.id}
              itemType="post"
              title={thread.title}
              description={thread.content.substring(0, 200)}
              initialLikes={thread.likes}
              initialSaved={thread.saved}
              initialComments={thread.replyCount}
              showComments={false}
            />
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-charcoal mb-6">
            Replies ({thread.replyCount})
          </h2>

          {/* Comment Input */}
          {!thread.isLocked && (
            <div className="mb-6">
              <CommentInput
                itemId={thread.id}
                itemType="post"
                placeholder="Share your thoughts..."
                onCommentAdded={(comment) => console.log('Comment added:', comment)}
              />
            </div>
          )}

          {thread.isLocked && (
            <div className="bg-charcoal/5 border border-charcoal/10 rounded-lg p-4 mb-6 text-center">
              <Lock className="h-8 w-8 text-charcoal/40 mx-auto mb-2" />
              <p className="text-charcoal/60">This thread has been locked by moderators</p>
            </div>
          )}

          {/* Comments */}
          <CommentSection
            itemId={thread.id}
            itemType="post"
            initialCommentCount={thread.replyCount}
          />
        </div>
      </div>
    </div>
  );
}
