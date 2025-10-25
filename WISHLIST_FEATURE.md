# Wishlist Feature Documentation

Complete wishlist functionality for RAWGLE supplement shop.

## Files Created

### 1. API Route: `/src/app/api/wishlist/route.ts`
**Purpose:** Backend API for wishlist operations

**Features:**
- In-memory Map storage keyed by userId
- Mock data with 7 products for demo-user
- GET: Fetch user's wishlist items with full product details
- POST: Add item to wishlist (with duplicate check)
- DELETE: Remove item from wishlist

**Endpoints:**
```typescript
GET /api/wishlist
Headers: { 'x-user-id': 'demo-user' }
Response: { success: true, data: WishlistItem[], count: number }

POST /api/wishlist
Headers: { 'x-user-id': 'demo-user', 'Content-Type': 'application/json' }
Body: { productId: string }
Response: { success: true, data: WishlistItem, message: string }

DELETE /api/wishlist?productId=xxx
Headers: { 'x-user-id': 'demo-user' }
Response: { success: true, data: WishlistItem[], count: number, message: string }
```

### 2. Wishlist Page: `/src/app/wishlist/page.tsx`
**Purpose:** Main wishlist view

**Features:**
- Product grid showing wishlisted items
- Product cards with:
  - Product image placeholder
  - Name, brand, category badge
  - Price display
  - Stock status badge
  - Description preview (3 lines max)
- "Add to Cart" button on each card
- "Remove from Wishlist" button on each card
- Empty state when no items
- Share wishlist button (uses Web Share API with clipboard fallback)
- Loading states for all operations
- Wishlist total calculation
- "Add All to Cart" bulk action
- Responsive grid layout (1/2/3 columns)
- Back to shop navigation

**Design:**
- Teal-600 theme color
- Sea-salt gradient background
- shadcn/ui components (Card, Button, Badge)
- lucide-react icons (Heart, ShoppingCart, Trash2, Share2, ArrowLeft)

### 3. Wishlist Button Component: `/src/components/wishlist/wishlist-button.tsx`
**Purpose:** Reusable wishlist toggle button

**Features:**
- Two variants: 'default' (with text) and 'icon' (icon only)
- Syncs with API to check if product is in wishlist
- Filled heart icon when product is wishlisted
- Loading state during operations
- Toast notifications for user feedback
- Prevents event bubbling (can be used inside clickable cards)

**Usage:**
```tsx
// Default variant with text
<WishlistButton productId="product-123" />

// Icon only variant
<WishlistButton productId="product-123" variant="icon" />
```

### 4. Navigation Update: `/src/components/navigation/main-nav.tsx`
**Added:** Wishlist link in desktop navigation header
- Heart icon + "Wishlist" text
- Positioned between Notifications and Profile

## Mock Data

Demo-user starts with 7 products in wishlist:
1. Wild Alaskan Salmon Oil (omega3-fish-oil-1)
2. Advanced Probiotic Powder (probiotic-1)
3. Joint Support Plus (joint-support-1)
4. Taurine for Cats (taurine-cats-1)
5. Natural Vitamin E (vitamin-e-1)
6. Bone Meal Calcium (bone-meal-calcium-1)
7. Green Lipped Mussel Extract (green-lipped-mussel-1)

## Integration Points

### Cart Integration
- Uses existing `useCart()` hook from `/src/components/cart/cart-provider.tsx`
- Calls `addToCart(productId, quantity, size)` method
- Maintains cart state automatically

### Product Data
- Imports from `/src/data/products/supplements.ts`
- Full product details included in wishlist response
- Category information from `supplementCategories`

### Toast Notifications
- Uses `sonner` library
- Success/error/info messages for all operations
- Consistent with existing cart notifications

## User Flow

1. **Browse Products** → Shop page with product cards
2. **Add to Wishlist** → Click heart icon or "Save to Wishlist" button
3. **View Wishlist** → Navigate to /wishlist from header
4. **Manage Items** → Remove items or add to cart
5. **Share Wishlist** → Click share button to share URL

## Accessibility

- Semantic HTML structure
- ARIA labels on icon buttons
- Keyboard navigation support
- Clear focus states
- Loading indicators for async operations
- Screen reader friendly status messages via toast

## Performance Optimizations

- Client-side state management for immediate UI updates
- Optimistic UI updates where appropriate
- Debounced API calls in shop search
- Lazy loading of wishlist data
- Minimal re-renders with React hooks

## Responsive Design

### Desktop (lg+)
- 3-column product grid
- Full navigation with wishlist link
- Side-by-side buttons

### Tablet (md)
- 2-column product grid
- Compact navigation

### Mobile (sm)
- 1-column product grid
- Stacked buttons
- Mobile menu with wishlist link

## Theme & Styling

**Colors:**
- Primary: teal-600, teal-700
- Accent: teal-50, teal-100
- Background: sea-salt gradient
- Success: green-100/green-800
- Error: red-100/red-800
- Warning: yellow-100/yellow-800

**Fonts:**
- Inter (body)
- Poppins (headings)

## Future Enhancements

1. **Persistence:** Replace in-memory storage with database
2. **Wishlist Notes:** Add notes/tags to saved items
3. **Price Tracking:** Alert when wishlisted items go on sale
4. **Multiple Lists:** Create themed wishlists (e.g., "For Max", "Winter Supplements")
5. **Sharing:** Share specific items or entire wishlist with others
6. **Email Notifications:** Notify when items are back in stock
7. **Wishlist Analytics:** Track popular items, save patterns
8. **Public Wishlists:** Make wishlists public for gift-giving

## Testing Checklist

- [ ] Add item to wishlist from shop page
- [ ] Remove item from wishlist page
- [ ] Add item to cart from wishlist
- [ ] Share wishlist URL
- [ ] Empty state displays correctly
- [ ] Loading states work properly
- [ ] Error handling for API failures
- [ ] Toast notifications appear
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Heart icon fills when item is wishlisted
- [ ] Duplicate prevention (can't add same item twice)
- [ ] "Add All to Cart" bulk action
- [ ] Navigation wishlist link works
- [ ] Back button returns to shop

## API Storage Structure

```typescript
// Map<userId, Set<productId>>
wishlistStore = {
  'demo-user': Set(['omega3-fish-oil-1', 'probiotic-1', ...]),
  'user-123': Set(['vitamin-e-1']),
  ...
}
```

## Component Props

### WishlistButton
```typescript
interface WishlistButtonProps {
  productId: string;        // Required: Product ID
  variant?: 'default' | 'icon';  // Optional: Button style
  className?: string;       // Optional: Additional CSS classes
}
```

### WishlistItem
```typescript
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
```

## Routes

- `/wishlist` - Main wishlist page
- `/api/wishlist` - API endpoints (GET, POST, DELETE)

## Dependencies

All dependencies already present in project:
- Next.js 15
- React
- TypeScript
- lucide-react
- sonner
- shadcn/ui components

## Notes

- Uses demo-user ID for testing (replace with auth system)
- In-memory storage resets on server restart
- Share feature uses Web Share API with clipboard fallback
- All prices in USD
- Mock data includes variety of supplement types
