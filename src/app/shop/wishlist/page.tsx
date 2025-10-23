'use client';

import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Heart className="h-16 w-16 text-gray-900/20 mx-auto mb-4" />
          <p className="text-gray-900/60 text-lg mb-4">Your wishlist is empty</p>
          <Button>Browse Products</Button>
        </div>
      </div>
    </div>
  );
}
