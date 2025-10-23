'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { supplements } from '@/data/products/supplements';
import { useCart } from '@/components/cart/cart-provider';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites', {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setFavoriteIds(data.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      await fetch(`/api/favorites?productId=${productId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'demo-user' },
      });
      setFavoriteIds(favoriteIds.filter((id) => id !== productId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  const handleAddToCart = async (product: any) => {
    await addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      sizeOption: product.sizeOptions[0],
      quantity: 1,
      image: product.image,
      description: product.description,
    });
    toast.success(`${product.name} added to cart`);
  };

  const favoriteProducts = supplements.filter((p) => favoriteIds.includes(p.id));

  if (loading) {
    return (
      <div className="min-h-screen page-gradient">
        <div className="container-page">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-900/60">Loading favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient">
      <div className="container-page">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="hero-title flex items-center gap-3">
              <Heart className="h-10 w-10 text-teal-600" />
              My Favorites
            </h1>
            <p className="hero-description">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {favoriteProducts.length === 0 ? (
            <Card className="card-feature-primary p-12 text-center">
              <Heart className="h-24 w-24 mx-auto mb-4 text-gray-900/20" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
              <p className="text-gray-900/70 mb-6">
                Start adding products to your favorites to see them here
              </p>
              <Button variant="default" asChild>
                <Link href="/shop">Browse Products</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map((product) => (
                <Card key={product.id} className="card-feature-secondary overflow-hidden hover:shadow-lg transition-shadow">
                  {product.image && (
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3">
                      <Link href={`/shop/${product.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-teal-600 transition-colors mb-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-900/70 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-teal-600">${product.price}</span>
                      {product.sizeOptions && product.sizeOptions.length > 0 && (
                        <span className="text-sm text-gray-900/60">{product.sizeOptions[0]}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFavorite(product.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
