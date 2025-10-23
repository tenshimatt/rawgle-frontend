'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  productId: string;
  variant?: 'default' | 'icon';
}

export function FavoriteButton({ productId, variant = 'default' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [productId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch('/api/favorites', {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setIsFavorite(data.data?.includes(productId) || false);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        await fetch(`/api/favorites?productId=${productId}`, {
          method: 'DELETE',
          headers: { 'x-user-id': 'demo-user' },
        });
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'demo-user',
          },
          body: JSON.stringify({ productId }),
        });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFavorite}
        disabled={loading}
        className="hover:bg-gray-100"
      >
        <Heart
          className={`h-5 w-5 ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
          }`}
        />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={toggleFavorite}
      disabled={loading}
      className={isFavorite ? 'border-red-500 text-red-500' : ''}
    >
      <Heart
        className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500' : ''}`}
      />
      {isFavorite ? 'Saved' : 'Save'}
    </Button>
  );
}
