'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LikeButtonProps {
  itemId: string;
  itemType: 'post' | 'recipe' | 'comment';
  initialLikes: number;
  initialLiked?: boolean;
  onLike?: (liked: boolean, newCount: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function LikeButton({
  itemId,
  itemType,
  initialLikes,
  initialLiked = false,
  onLike,
  size = 'md',
  showCount = true,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;

    // Optimistic UI update
    setLiked(newLiked);
    setLikes(newLikes);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Call parent callback
    onLike?.(newLiked, newLikes);

    // API call
    try {
      await fetch(`/api/community/${itemType}s/${itemId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({ liked: newLiked }),
      });
    } catch (error) {
      // Revert on error
      setLiked(!newLiked);
      setLikes(newLikes === likes + 1 ? likes : likes + 1);
      console.error('Error toggling like:', error);
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={`flex items-center gap-2 transition-all hover:bg-transparent ${
        liked ? 'text-orange-500' : 'text-muted hover:text-orange-500'
      }`}
    >
      <Heart
        className={`${sizeClasses[size]} transition-all ${
          isAnimating ? 'scale-125' : 'scale-100'
        } ${liked ? 'fill-orange-500' : ''}`}
      />
      {showCount && <span className={textSize[size]}>{likes}</span>}
    </Button>
  );
}
