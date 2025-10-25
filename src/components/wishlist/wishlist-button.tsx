'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WishlistButtonProps {
  productId: string;
  variant?: 'default' | 'icon';
  className?: string;
}

/**
 * WishlistButton component
 * Allows users to add/remove products from their wishlist
 * - Displays filled heart when product is in wishlist
 * - Syncs with wishlist API
 * - Shows loading state during operations
 *
 * Usage:
 * <WishlistButton productId="product-123" />
 * <WishlistButton productId="product-123" variant="icon" />
 */
export function WishlistButton({ productId, variant = 'default', className = '' }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check wishlist status on mount
  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  // Check if product is in wishlist
  const checkWishlistStatus = async () => {
    try {
      const response = await fetch('/api/wishlist', {
        headers: { 'x-user-id': 'demo-user' },
      });
      const result = await response.json();

      if (result.success) {
        const inWishlist = result.data?.some((item: any) => item.productId === productId) || false;
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  // Toggle wishlist status
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is in a link
    e.stopPropagation(); // Prevent event bubbling

    setIsLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${productId}`, {
          method: 'DELETE',
          headers: { 'x-user-id': 'demo-user' },
        });

        const result = await response.json();

        if (result.success) {
          setIsInWishlist(false);
          toast.success('Removed from wishlist', {
            description: 'Product removed from your wishlist',
          });
        } else {
          toast.error(result.message || 'Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'demo-user',
          },
          body: JSON.stringify({ productId }),
        });

        const result = await response.json();

        if (result.success) {
          setIsInWishlist(true);
          toast.success('Added to wishlist', {
            description: 'Product saved to your wishlist',
          });
        } else if (response.status === 409) {
          // Already in wishlist
          setIsInWishlist(true);
          toast.info('Already in wishlist');
        } else {
          toast.error(result.message || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleWishlist}
        disabled={isLoading}
        className={`hover:bg-teal-50 ${className}`}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isInWishlist
              ? 'fill-teal-600 text-teal-600'
              : 'text-gray-400 hover:text-teal-600'
          } ${isLoading ? 'opacity-50' : ''}`}
        />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`border-teal-600 ${
        isInWishlist
          ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
          : 'text-teal-600 hover:bg-teal-50'
      } ${className}`}
    >
      <Heart
        className={`h-4 w-4 mr-2 transition-all ${
          isInWishlist ? 'fill-teal-600' : ''
        }`}
      />
      {isLoading ? 'Saving...' : isInWishlist ? 'Saved' : 'Save to Wishlist'}
    </Button>
  );
}
