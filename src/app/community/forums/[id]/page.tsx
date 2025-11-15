'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Eye, Clock, Lock, Pin, Loader2, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PageProps {
  params: Promise<{ id: string }>;
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
  updatedAt: string;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  likes: number;
  lastActivity: string;
}

interface ForumReply {
  id: string;
  threadId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
}

export default function ForumThreadPage({ params }: PageProps) {
  const router = useRouter();
  const [threadId, setThreadId] = useState<string>('');
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then(p => setThreadId(p.id));
  }, [params]);

  // Fetch thread details
  useEffect(() => {
    if (!threadId) return;

    const fetchThread = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/community/forums/threads/${threadId}`);
        const data = await response.json();
        if (data.success) {
          setThread(data.data);
        } else {
          setError('Thread not found');
        }
      } catch (err) {
        console.error('Failed to fetch thread:', err);
        setError('Failed to load thread');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThread();
  }, [threadId]);

  // Fetch replies
  useEffect(() => {
    if (!threadId) return;

    const fetchReplies = async () => {
      try {
        const response = await fetch(`/api/community/forums/threads/${threadId}/replies`);
        const data = await response.json();
        if (data.success) {
          setReplies(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch replies:', err);
      }
    };

    fetchReplies();
  }, [threadId]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !threadId) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/community/forums/threads/${threadId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post reply');
      }

      // Add new reply to the list
      setReplies([...replies, data.data]);
      setReplyContent('');

      // Update reply count
      if (thread) {
        setThread({ ...thread, replyCount: thread.replyCount + 1 });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <span className="ml-2 text-gray-900/60">Loading thread...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link
            href="/community/forums"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forums
          </Link>
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-900/60 text-lg">{error || 'Thread not found'}</p>
            <Button
              className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => router.push('/community/forums')}
            >
              Return to Forums
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/community/forums"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Forums
        </Link>

        {/* Thread Header */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={thread.author.avatar}
              alt={thread.author.name}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {thread.isPinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-teal-600 text-white rounded">
                    <Pin className="h-3 w-3" />
                    PINNED
                  </span>
                )}
                {thread.isLocked && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-gray-900 text-white rounded">
                    <Lock className="h-3 w-3" />
                    LOCKED
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{thread.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-900/60">
                <span className="font-medium">by {thread.author.name}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(thread.createdAt)}</span>
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
          <div className="prose prose-gray max-w-none mb-6 border-t border-gray-900/10 pt-6">
            <div className="whitespace-pre-wrap text-gray-900">{thread.content}</div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Replies ({replies.length})
          </h2>

          {/* Reply Input */}
          {!thread.isLocked && (
            <div className="mb-6 pb-6 border-b border-gray-900/10">
              <form onSubmit={handleSubmitReply}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Add a Reply
                </label>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                  className="mb-3"
                />
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-3">
                    {error}
                  </div>
                )}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !replyContent.trim()}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Reply'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {thread.isLocked && (
            <div className="bg-gray-900/5 border border-gray-900/10 rounded-lg p-4 mb-6 text-center">
              <Lock className="h-8 w-8 text-gray-900/40 mx-auto mb-2" />
              <p className="text-gray-900/60">This thread has been locked by moderators</p>
            </div>
          )}

          {/* Replies List */}
          <div className="space-y-4">
            {replies.length > 0 ? (
              replies.map((reply) => (
                <div
                  key={reply.id}
                  className="border border-gray-900/10 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={reply.author.avatar}
                      alt={reply.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{reply.author.name}</span>
                        <span className="text-xs text-gray-900/50">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <div className="text-gray-900 whitespace-pre-wrap">{reply.content}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-900/60">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-900/20" />
                <p>No replies yet. Be the first to reply!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
