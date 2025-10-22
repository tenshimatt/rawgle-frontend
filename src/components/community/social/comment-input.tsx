'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  likes: number;
  liked?: boolean;
  createdAt: string;
}

interface CommentInputProps {
  itemId: string;
  itemType: 'post' | 'recipe';
  parentCommentId?: string;
  onCommentAdded?: (comment: Comment) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentInput({
  itemId,
  itemType,
  parentCommentId,
  onCommentAdded,
  placeholder = 'Add a comment...',
  autoFocus = false,
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/community/${itemType}s/${itemId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          content: content.trim(),
          parentCommentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add comment');
      }

      if (data.success && data.data) {
        onCommentAdded?.(data.data);
        setContent('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(error instanceof Error ? error.message : 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="input-base min-h-[80px] resize-none"
        autoFocus={autoFocus}
        disabled={loading}
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted">
          Cmd/Ctrl + Enter to submit
        </p>
        <Button
          type="submit"
          size="sm"
          className="btn-secondary"
          disabled={!content.trim() || loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
