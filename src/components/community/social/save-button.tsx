'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SaveButtonProps {
  itemId: string;
  itemType: 'post' | 'recipe';
  initialSaved?: boolean;
  onSave?: (saved: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function SaveButton({
  itemId,
  itemType,
  initialSaved = false,
  onSave,
  size = 'md',
  showText = false,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSave = async () => {
    const newSaved = !saved;

    // Optimistic UI update
    setSaved(newSaved);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Call parent callback
    onSave?.(newSaved);

    // API call
    try {
      await fetch(`/api/community/${itemType}s/${itemId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({ saved: newSaved }),
      });
    } catch (error) {
      // Revert on error
      setSaved(!newSaved);
      console.error('Error toggling save:', error);
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
      onClick={handleSave}
      className={`flex items-center gap-2 transition-all hover:bg-transparent ${
        saved ? 'text-maize' : 'text-muted hover:text-maize'
      }`}
    >
      <Bookmark
        className={`${sizeClasses[size]} transition-all ${
          isAnimating ? 'scale-125' : 'scale-100'
        } ${saved ? 'fill-maize' : ''}`}
      />
      {showText && <span className={textSize[size]}>{saved ? 'Saved' : 'Save'}</span>}
    </Button>
  );
}
