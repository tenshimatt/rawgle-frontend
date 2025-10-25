'use client';

import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart/cart-provider';
import { toast } from 'sonner';
import Link from 'next/link';
import { supplementCategories } from '@/data/products/supplements';

// Wishlist item interface
interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    size: string;
    category: string;
    description: string;
    imageUrl?: string;
    inStock: boolean;
    rating: number;
    reviews: number;
    featured: boolean;
    forSpecies: string[];
  };
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Fetch wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/wishlist', {
        headers: {
          'x-user-id': 'demo-user',
        },
      });

      const result = await response.json();

      if (result.success) {
        setWishlistItems(result.data || []);
      } else {
        toast.error('Failed to load wishlist');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingId(productId);

    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'demo-user',
        },
      });

      const result = await response.json();

      if (result.success) {
        setWishlistItems(result.data || []);
        toast.success('Removed from wishlist');
      } else {
        toast.error(result.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setRemovingId(null);
    }
  };

  // Add item to cart
  const handleAddToCart = async (item: WishlistItem) => {
    setAddingToCartId(item.productId);

    try {
      const success = await addToCart(item.productId, 1, item.product.size);

      if (success) {
        // Optionally remove from wishlist after adding to cart
        // await handleRemoveFromWishlist(item.productId);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCartId(null);
    }
  };

  // Add all items to cart sequentially to avoid race conditions
  const handleAddAllToCart = async () => {
    const inStockItems = wishlistItems.filter(item => item.product.inStock);

    for (const item of inStockItems) {
      try {
        await addToCart(item.productId, 1, item.product.size);
      } catch (error) {
        console.error('Error adding item to cart:', error);
        toast.error(`Failed to add ${item.product.name}`);
      }
    }

    toast.success(`Added ${inStockItems.length} items to cart`);
  };

  // Share wishlist
  const handleShareWishlist = async () => {
    const wishlistUrl = `${window.location.origin}/wishlist`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My RAWGLE Wishlist',
          text: 'Check out my pet supplement wishlist!',
          url: wishlistUrl,
        });
        toast.success('Wishlist shared');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(wishlistUrl);
        toast.success('Wishlist link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing wishlist:', error);
      toast.error('Failed to share wishlist');
    }
  };

  // Get category info for a product
  const getCategoryInfo = (categoryId: string) => {
    return supplementCategories.find(c => c.id === categoryId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-teal-600 border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/shop">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                <p className="text-gray-600">Save your favorite supplements for later</p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <Heart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Browse our supplements and save your favorites for later
            </p>
            <Link href="/shop">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Browse Supplements
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate wishlist total
  const wishlistTotal = wishlistItems.reduce((sum, item) => sum + item.product.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <Button
              onClick={handleShareWishlist}
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Wishlist
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="mb-8 bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Wishlist Total</p>
                <p className="text-3xl font-bold text-teal-700">${wishlistTotal.toFixed(2)}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAddAllToCart}
                  disabled={wishlistItems.every(item => !item.product.inStock)}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const categoryInfo = getCategoryInfo(item.product.category);

            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow relative">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 text-teal-800"
                    >
                      {categoryInfo?.icon} {categoryInfo?.name}
                    </Badge>
                    {item.product.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{item.product.name}</CardTitle>
                  <p className="text-sm text-gray-600">{item.product.brand}</p>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {item.product.description}
                  </p>

                  {/* Size */}
                  <p className="text-sm text-gray-600 mb-3">Size: {item.product.size}</p>

                  {/* Stock Status */}
                  {item.product.inStock ? (
                    <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="mb-4 bg-red-100 text-red-800">
                      Out of Stock
                    </Badge>
                  )}

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-teal-600">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.product.inStock || addingToCartId === item.productId}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      {addingToCartId === item.productId ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      disabled={removingId === item.productId}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                      {removingId === item.productId ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full mr-2" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
