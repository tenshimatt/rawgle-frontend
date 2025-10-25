# Wishlist Integration Guide

How to add wishlist functionality to product cards in the shop.

## Quick Integration

### Option 1: Replace FavoriteButton with WishlistButton

In `/src/app/shop/page.tsx`, replace the `FavoriteButton` component with `WishlistButton`:

```tsx
// Before
import { FavoriteButton } from '@/components/favorites/favorite-button';

// After
import { WishlistButton } from '@/components/wishlist/wishlist-button';

// In the product card, replace:
<FavoriteButton productId={product.id} variant="icon" />

// With:
<WishlistButton productId={product.id} variant="icon" />
```

### Option 2: Use Both Favorites and Wishlist

Keep both buttons side-by-side:

```tsx
import { FavoriteButton } from '@/components/favorites/favorite-button';
import { WishlistButton } from '@/components/wishlist/wishlist-button';

// In the product card:
<div className="flex items-center justify-between mb-3">
  <span className="text-2xl font-bold text-green-600">
    ${product.price.toFixed(2)}
  </span>
  <div className="flex gap-1">
    <FavoriteButton productId={product.id} variant="icon" />
    <WishlistButton productId={product.id} variant="icon" />
  </div>
</div>
```

## Full Example: Product Card with Wishlist

```tsx
import { WishlistButton } from '@/components/wishlist/wishlist-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';

function ProductCard({ product }: { product: Supplement }) {
  const handleAddToCart = async () => {
    // Cart logic
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="bg-teal-100 text-teal-800">
            {product.category}
          </Badge>
          {product.featured && (
            <Badge className="bg-yellow-100 text-yellow-800">
              Featured
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <p className="text-sm text-gray-600">{product.brand}</p>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>

        {/* Price and Wishlist */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-teal-600">
            ${product.price.toFixed(2)}
          </span>
          <WishlistButton productId={product.id} variant="icon" />
        </div>

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Product Detail Page Integration

For a detailed product page:

```tsx
import { WishlistButton } from '@/components/wishlist/wishlist-button';

function ProductDetailPage({ product }: { product: Supplement }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-lg" />

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.brand}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-teal-600">
              ${product.price.toFixed(2)}
            </span>
            <WishlistButton productId={product.id} variant="default" />
          </div>

          <Button className="w-full bg-teal-600 hover:bg-teal-700 mb-4">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>

          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
```

## Navigation Integration (Already Done)

The wishlist link has been added to the main navigation:

```tsx
// In /src/components/navigation/main-nav.tsx
<Link href="/wishlist">
  <Button variant="ghost" size="sm">
    <Heart className="h-4 w-4 mr-2" />
    Wishlist
  </Button>
</Link>
```

## API Usage Examples

### Check if Product is in Wishlist

```tsx
const checkWishlistStatus = async (productId: string) => {
  const response = await fetch('/api/wishlist', {
    headers: { 'x-user-id': 'demo-user' },
  });
  const result = await response.json();

  return result.data?.some((item: any) => item.productId === productId);
};
```

### Add to Wishlist

```tsx
const addToWishlist = async (productId: string) => {
  const response = await fetch('/api/wishlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': 'demo-user',
    },
    body: JSON.stringify({ productId }),
  });

  const result = await response.json();
  return result.success;
};
```

### Remove from Wishlist

```tsx
const removeFromWishlist = async (productId: string) => {
  const response = await fetch(`/api/wishlist?productId=${productId}`, {
    method: 'DELETE',
    headers: { 'x-user-id': 'demo-user' },
  });

  const result = await response.json();
  return result.success;
};
```

### Get Full Wishlist

```tsx
const getWishlist = async () => {
  const response = await fetch('/api/wishlist', {
    headers: { 'x-user-id': 'demo-user' },
  });

  const result = await response.json();
  return result.data; // Array of WishlistItem
};
```

## Custom Hook for Wishlist

Create a custom hook for wishlist operations:

```tsx
// /src/hooks/use-wishlist.ts
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: any;
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/wishlist', {
        headers: { 'x-user-id': 'demo-user' },
      });
      const result = await response.json();

      if (result.success) {
        setWishlistItems(result.data || []);
      }
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToWishlist = useCallback(async (productId: string) => {
    try {
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
        toast.success('Added to wishlist');
        await fetchWishlist();
        return true;
      }

      return false;
    } catch (error) {
      toast.error('Failed to add to wishlist');
      return false;
    }
  }, [fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'demo-user' },
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Removed from wishlist');
        setWishlistItems(result.data || []);
        return true;
      }

      return false;
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      return false;
    }
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  }, [wishlistItems]);

  return {
    wishlistItems,
    isLoading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}
```

## Testing the Integration

1. **Navigate to Shop Page**: `/shop`
2. **Click Heart Icon**: On any product card
3. **Check Wishlist**: Click "Wishlist" in navigation
4. **Verify Product**: Product should appear in wishlist
5. **Add to Cart**: Click "Add to Cart" on wishlist item
6. **Remove Item**: Click "Remove" button
7. **Share Wishlist**: Click "Share Wishlist" button

## Styling Customization

### Change Theme Color

Replace `teal-600` with your preferred color:

```tsx
// From:
className="bg-teal-600 hover:bg-teal-700"

// To:
className="bg-blue-600 hover:bg-blue-700"
```

### Custom Wishlist Button Styles

```tsx
<WishlistButton
  productId={product.id}
  variant="icon"
  className="hover:bg-purple-50"
/>
```

### Custom Heart Icon Color

Edit `/src/components/wishlist/wishlist-button.tsx`:

```tsx
// Change from:
className="fill-teal-600 text-teal-600"

// To:
className="fill-pink-600 text-pink-600"
```

## Mobile Optimization

The wishlist is already mobile-responsive:

- **Desktop**: 3-column grid
- **Tablet**: 2-column grid
- **Mobile**: 1-column grid with full-width buttons

To customize mobile behavior:

```tsx
// Adjust grid columns
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// Stack buttons on mobile
<div className="flex flex-col sm:flex-row gap-2">
  <Button className="w-full sm:w-auto">Add to Cart</Button>
  <Button className="w-full sm:w-auto">Remove</Button>
</div>
```

## Future Enhancements

1. **Wishlist Count Badge**: Show count in navigation
2. **Quick View**: Preview wishlist in dropdown
3. **Sort/Filter**: Add sorting options to wishlist page
4. **Comparison**: Compare multiple wishlisted products
5. **Email Reminders**: Send wishlist reminders
6. **Price Alerts**: Notify when prices drop

## Troubleshooting

### Heart Icon Not Filling
- Check API response format
- Verify productId matches
- Check browser console for errors

### Products Not Appearing
- Verify API route is accessible
- Check userId header is correct
- Confirm product IDs exist in supplements data

### Share Not Working
- Web Share API requires HTTPS
- Fallback to clipboard should work
- Check browser console for errors

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check file paths and imports
4. Review component props
