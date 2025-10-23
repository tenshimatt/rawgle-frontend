'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
import { CommentInput } from './comment-input';
import { LikeButton } from './like-button';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  likes: number;
  liked?: boolean;
  createdAt: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  itemId: string;
  itemType: 'post' | 'recipe';
  initialCommentCount?: number;
}

export function CommentSection({ itemId, itemType, initialCommentCount = 0 }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  const fetchComments = async () => {
    if (comments.length > 0) return; // Already loaded

    setLoading(true);
    try {
      const response = await fetch(`/api/community/${itemType}s/${itemId}/comments`, {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      if (data.success) {
        setComments(data.data || []);
        setCommentCount(data.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments([newComment, ...comments]);
    setCommentCount(commentCount + 1);
  };

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
    <div className="space-y-4">
      {/* Comment Toggle Button */}
      <button
        onClick={handleToggleComments}
        className="flex items-center gap-2 text-muted hover:text-teal-600 transition-colors"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm">
          {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
        </span>
      </button>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4 pl-4 border-l-2 border-gray-900/10">
          {/* Comment Input */}
          <CommentInput
            itemId={itemId}
            itemType={itemType}
            onCommentAdded={handleCommentAdded}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin icon-primary" />
            </div>
          )}

          {/* Comments List */}
          {!loading && comments.length === 0 && (
            <p className="text-sm text-muted text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}

          {!loading && comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start gap-3">
                {/* User Avatar */}
                <div className="h-8 w-8 bg-teal-600 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm flex-shrink-0">
                  {comment.userName[0]}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-seasalt rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {comment.userName}
                      </p>
                      <span className="text-xs text-muted">
                        {formatTimestamp(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">{comment.content}</p>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-2 mt-1 ml-2">
                    <LikeButton
                      itemId={comment.id}
                      itemType="comment"
                      initialLikes={comment.likes}
                      initialLiked={comment.liked}
                      size="sm"
                      showCount={true}
                    />
                  </div>
                </div>
              </div>

              {/* Nested Replies (if any) */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-2">
                      <div className="h-6 w-6 bg-teal-700 rounded-full flex items-center justify-center text-gray-900 font-bold text-xs flex-shrink-0">
                        {reply.userName[0]}
                      </div>
                      <div className="flex-1 bg-seasalt/60 rounded-lg p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 text-xs">
                            {reply.userName}
                          </p>
                          <span className="text-xs text-muted">
                            {formatTimestamp(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-900">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
