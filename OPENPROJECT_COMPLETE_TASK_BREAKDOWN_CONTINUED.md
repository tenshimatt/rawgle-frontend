# Rawgle Platform - Complete OpenProject Task Breakdown (CONTINUATION)

**This document continues from TASK-010 in the main breakdown file.**

---

## 🛒 Shop Module (Continued)

### TASK-011: Product Detail Page
**Subject:** `[AUTO] Shop - Product Detail View`

**Description:**
```markdown
## Feature Requirements
Display complete product information with images, pricing, size options, quantity selection, and add-to-cart functionality. Show reviews, benefits, ingredients, and dosage instructions.

## Current Implementation
- Product detail page at /shop/[id]
- Fetches product by ID from shop-products data
- Size selection dropdown
- Quantity increment/decrement buttons
- Add to cart with POST /api/cart
- Displays: breadcrumbs, badges, pricing, description, benefits, ingredients, dosage
- Responsive image gallery with featured/discount badges
- Stock status indicators

## Technical Requirements
- Dynamic route: /shop/[id]
- Product lookup from getProductById()
- Calculate price with size modifiers
- Calculate discount percentage
- Validate stock quantity
- POST /api/cart with productId, quantity, sizeOption
- Show loading states during add to cart
- Breadcrumb navigation
- Sticky product image on scroll

## Acceptance Criteria
- [ ] Page loads product data by ID from URL
- [ ] 404 page shown if product not found
- [ ] Breadcrumb navigation displays correctly
- [ ] Product image shows category-appropriate emoji
- [ ] Featured badge shown if product.featured === true
- [ ] Discount badge shows percentage if compareAtPrice exists
- [ ] Price updates when size selection changes
- [ ] Size dropdown shows all sizeOptions with modifiers
- [ ] Quantity can be increased/decreased within stock limits
- [ ] Quantity buttons disabled at min (1) and max (stockQuantity)
- [ ] Add to Cart button shows total price
- [ ] Add to Cart disabled if out of stock
- [ ] Add to Cart shows loading state during API call
- [ ] Success alert shown after adding to cart
- [ ] Error alert shown if add to cart fails
- [ ] Benefits section displays all product.benefits
- [ ] Ingredients section displays all product.ingredients
- [ ] Dosage instructions displayed with warning note
- [ ] Star rating displayed based on product.reviews.rating
- [ ] Review count shown with rating
- [ ] Low stock warning shown if < 20 items
- [ ] Tags displayed as badges
- [ ] Responsive layout works on mobile
- [ ] Category and species badges shown

## API Contract

### GET Product Data
```javascript
// Client-side import
import { getProductById } from '@/data/products/shop-products';
const product = getProductById(productId);
```

### POST /api/cart (Add to Cart)
**Request:**
```json
{
  "productId": "prod_123",
  "quantity": 2,
  "sizeOption": "1lb"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "cartItemId": "cart_item_456",
    "productId": "prod_123",
    "quantity": 2,
    "sizeOption": "1lb",
    "price": 29.99
  },
  "message": "Added to cart"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Out of stock"
}
```

---

SPEC_FILE: /specs/features/shop-product-detail.yml
GOOD_EXAMPLES: /src/app/shop/page.tsx, /src/app/supplements/[slug]/page.tsx, /src/components/ui/badge.tsx, /src/components/ui/select.tsx
TARGET_FILES: /src/app/shop/[id]/page.tsx, /src/app/api/cart/route.ts, /src/data/products/shop-products.ts

---

## Testing Instructions
1. Navigate to /shop and click any product
2. Verify URL is /shop/{productId}
3. Verify all product details load correctly
4. Change size dropdown and verify price updates
5. Increase quantity to max stock limit
6. Decrease quantity to 1 (min)
7. Verify buttons disable at limits
8. Click "Add to Cart"
9. Verify success alert appears
10. Verify cart badge in header updates
11. Test with out-of-stock product
12. Test with featured product (badge visible)
13. Test with discounted product (% badge visible)
14. Test on mobile viewport
15. Test breadcrumb navigation back to shop
```

**Priority:** High
**Status:** Ready for Review (Implemented)
**Category:** Shop

---

### TASK-012: Wishlist Management
**Subject:** `[AUTO] Shop - Wishlist Full CRUD`

**Description:**
```markdown
## Feature Requirements
Allow users to save products for later. Display wishlist with product cards, add to cart, remove items, share wishlist, and add all to cart functionality.

## Current Implementation
- Wishlist page at /wishlist
- GET /api/wishlist (fetch items)
- POST /api/wishlist (add item)
- DELETE /api/wishlist?productId=xxx (remove item)
- In-memory storage with demo data
- Add to cart from wishlist
- Share wishlist via navigator.share or clipboard
- "Add All to Cart" bulk operation
- Loading states for each operation
- Empty state with CTA to shop

## Technical Requirements
- Fetch wishlist on mount
- Display items in grid layout (3 columns on desktop)
- Show product: image, name, brand, price, category, stock status
- Remove button per item with loading state
- Add to cart button per item with loading state
- Add all in-stock items to cart sequentially
- Share via Web Share API with clipboard fallback
- Calculate wishlist total
- Handle empty state
- Toast notifications for all actions

## Acceptance Criteria
- [ ] Page loads wishlist from GET /api/wishlist
- [ ] Loading spinner shown during initial fetch
- [ ] Empty state shown if no items
- [ ] Empty state has "Browse Supplements" button
- [ ] "Back to Shop" button navigates to /shop
- [ ] Wishlist total calculated correctly
- [ ] Item count displayed in header
- [ ] Share button copies URL to clipboard
- [ ] Share button uses navigator.share if available
- [ ] Each item shows: image, name, brand, description, price, size
- [ ] Category badge shown with emoji
- [ ] Featured badge shown if applicable
- [ ] Stock status badge (green "In Stock" or red "Out of Stock")
- [ ] "Add to Cart" button works for each item
- [ ] "Add to Cart" disabled if out of stock
- [ ] "Add to Cart" shows loading spinner during operation
- [ ] "Remove" button deletes item from wishlist
- [ ] "Remove" shows loading spinner during operation
- [ ] "Add All to Cart" button at top
- [ ] "Add All to Cart" disabled if all items out of stock
- [ ] "Add All to Cart" adds items sequentially
- [ ] Success toast after each operation
- [ ] Error toast on failure
- [ ] Wishlist updates after add/remove
- [ ] Grid is responsive (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] Works without authentication (uses demo-user)

## API Contract

### GET /api/wishlist
**Request Headers:**
```
x-user-id: demo-user
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "omega3-fish-oil-1",
      "productId": "omega3-fish-oil-1",
      "addedAt": "2025-10-26T10:00:00Z",
      "product": {
        "id": "omega3-fish-oil-1",
        "name": "Omega-3 Fish Oil",
        "brand": "PetVitality",
        "price": 24.99,
        "size": "8oz",
        "category": "skin-coat",
        "description": "Premium fish oil...",
        "inStock": true,
        "rating": 4.8,
        "reviews": 1247,
        "featured": true,
        "forSpecies": ["dog", "cat"]
      }
    }
  ],
  "count": 7
}
```

### POST /api/wishlist
**Request:**
```json
{
  "productId": "omega3-fish-oil-1"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": { /* wishlist item */ },
  "message": "Added to wishlist"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Product already in wishlist"
}
```

### DELETE /api/wishlist?productId=xxx
**Success Response (200):**
```json
{
  "success": true,
  "data": [ /* updated wishlist array */ ],
  "count": 6,
  "message": "Removed from wishlist"
}
```

---

SPEC_FILE: /specs/features/shop-wishlist.yml
GOOD_EXAMPLES: /src/app/shop/page.tsx, /src/app/cart/page.tsx, /src/components/cart/cart-provider.tsx, /src/components/ui/card.tsx
TARGET_FILES: /src/app/wishlist/page.tsx, /src/app/api/wishlist/route.ts

---

## Testing Instructions
1. Navigate to /wishlist
2. Verify demo items load
3. Click "Add to Cart" on one item
4. Verify success toast and cart badge updates
5. Click "Remove" on one item
6. Verify item disappears and toast shown
7. Click "Add All to Cart"
8. Verify all in-stock items added
9. Click "Share Wishlist"
10. Verify share dialog or clipboard copy
11. Remove all items to test empty state
12. Click "Browse Supplements" from empty state
13. Verify navigation to /shop
14. Test responsive grid on mobile
15. Test with out-of-stock items (button disabled)
```

**Priority:** High
**Status:** Ready for Review (Implemented)
**Category:** Shop

---

### TASK-013: Add All to Cart (Wishlist)
**Subject:** `[AUTO] Shop - Wishlist Bulk Add to Cart`

**Description:**
```markdown
## Feature Requirements
Allow users to add all wishlist items to cart with a single click. Only add in-stock items, show progress, handle errors gracefully.

## Current Implementation
- "Add All to Cart" button in wishlist summary card
- Sequential addition using for loop
- Filters out-of-stock items before processing
- Uses cart context addToCart() method
- Shows success toast with count
- Individual error toasts for failed items
- Button disabled if all items out of stock

## Technical Requirements
- Filter wishlistItems by product.inStock === true
- Loop through in-stock items sequentially (avoid race conditions)
- Call addToCart(productId, 1, size) for each item
- Catch and log errors per item
- Show final success toast with total count
- Disable button during operation
- Show loading state on button

## Acceptance Criteria
- [ ] Button visible in wishlist summary card
- [ ] Button shows "Add All to Cart" text
- [ ] Button disabled if all items are out of stock
- [ ] Button shows loading state when clicked
- [ ] Only in-stock items processed
- [ ] Items added sequentially (not parallel)
- [ ] Each item added with quantity 1
- [ ] Cart context updated for each addition
- [ ] Individual errors caught and logged
- [ ] Failed items show error toast
- [ ] Success toast shows total items added
- [ ] Cart badge updates after all additions
- [ ] Button re-enabled after completion
- [ ] Works with 20+ items without timeout
- [ ] No duplicate cart items created

---

SPEC_FILE: /specs/features/wishlist-bulk-add.yml
GOOD_EXAMPLES: /src/app/wishlist/page.tsx, /src/components/cart/cart-provider.tsx
TARGET_FILES: /src/app/wishlist/page.tsx, /src/contexts/cart-context.tsx

---

## Testing Instructions
1. Navigate to /wishlist
2. Ensure at least 5 items in wishlist
3. Include mix of in-stock and out-of-stock items
4. Click "Add All to Cart" button
5. Verify button shows loading state
6. Wait for completion
7. Verify success toast shows correct count
8. Verify cart badge shows updated count
9. Navigate to /cart
10. Verify all in-stock items present
11. Verify out-of-stock items NOT added
```

**Priority:** Medium
**Status:** Ready for Review (Implemented)
**Category:** Shop

---

### TASK-014: Checkout Success Page
**Subject:** `[AUTO] Shop - Order Confirmation Page`

**Description:**
```markdown
## Feature Requirements
Show order confirmation after successful checkout. Display order number, items purchased, total paid, delivery estimate, and next steps.

## Current Implementation
- Success page at /checkout/success
- Simple placeholder with checkmark icon
- No order details shown
- Basic "Continue Shopping" button

## Technical Requirements
- Fetch order details from query params or session
- Display order number, date, status
- Show all purchased items with quantities
- Display payment method, shipping address
- Calculate and show subtotal, tax, shipping, total
- Show estimated delivery date
- Email confirmation indicator
- Track order button
- Continue shopping CTA
- Print receipt button

## Acceptance Criteria
- [ ] Page accessible at /checkout/success
- [ ] Order number displayed prominently
- [ ] Order date shown
- [ ] Success checkmark icon shown
- [ ] "Thank you" message personalized with user name
- [ ] All purchased items listed with: image, name, quantity, price
- [ ] Subtotal calculated correctly
- [ ] Tax amount shown
- [ ] Shipping cost shown
- [ ] Total amount shown in large text
- [ ] Payment method displayed (e.g., "Visa ****1234")
- [ ] Shipping address displayed
- [ ] Estimated delivery date shown
- [ ] "Email confirmation sent" message
- [ ] "Track Order" button navigates to /shop/orders
- [ ] "Continue Shopping" button navigates to /shop
- [ ] "Print Receipt" button opens print dialog
- [ ] Responsive layout on mobile
- [ ] Confetti animation on page load (optional)
- [ ] Social share buttons to share purchase (optional)

## API Contract

### GET /api/orders/[orderId]
**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-20251026-12345",
    "status": "confirmed",
    "createdAt": "2025-10-26T14:30:00Z",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "items": [
      {
        "productId": "prod_123",
        "name": "Omega-3 Fish Oil",
        "quantity": 2,
        "price": 24.99,
        "size": "8oz"
      }
    ],
    "subtotal": 49.98,
    "tax": 4.50,
    "shipping": 5.99,
    "total": 60.47,
    "paymentMethod": "Visa ****1234",
    "shippingAddress": {
      "line1": "123 Main St",
      "city": "Portland",
      "state": "OR",
      "zip": "97201"
    },
    "estimatedDelivery": "2025-10-30"
  }
}
```

---

SPEC_FILE: /specs/features/checkout-success.yml
GOOD_EXAMPLES: /src/app/cart/page.tsx, /src/app/shop/orders/page.tsx, /src/components/ui/card.tsx
TARGET_FILES: /src/app/checkout/success/page.tsx, /src/app/api/orders/[orderId]/route.ts

---

## Testing Instructions
1. Complete a test checkout
2. Get redirected to /checkout/success?orderId=xxx
3. Verify order number displays
4. Verify all purchased items listed
5. Verify pricing breakdown correct
6. Verify shipping address shown
7. Verify payment method shown (masked)
8. Click "Track Order"
9. Verify navigation to /shop/orders
10. Click "Continue Shopping"
11. Verify navigation to /shop
12. Click "Print Receipt"
13. Verify print dialog opens
14. Test on mobile viewport
```

**Priority:** High
**Status:** Not Started
**Category:** Shop

---

### TASK-015: Order History
**Subject:** `[AUTO] Shop - Order History & Tracking`

**Description:**
```markdown
## Feature Requirements
Display user's past orders with status tracking. Show order details, reorder functionality, download invoices, and filter/search orders.

## Current Implementation
- Orders page at /shop/orders
- Empty state with package icon
- No data fetching
- No order display logic

## Technical Requirements
- GET /api/orders with user authentication
- Display orders in reverse chronological order
- Show: order number, date, status, items, total
- Status badges: Processing, Shipped, Delivered, Cancelled
- Expandable order details
- "Reorder" button (add all items to cart)
- "Download Invoice" button (PDF generation)
- "Track Shipment" button with tracking number
- Filter by status, date range
- Search by order number or product name
- Pagination for 10+ orders

## Acceptance Criteria
- [ ] Page loads orders from GET /api/orders
- [ ] Orders sorted by date (newest first)
- [ ] Empty state shown if no orders
- [ ] Each order card shows: order #, date, status, item count, total
- [ ] Status badge color-coded (green=delivered, blue=shipped, yellow=processing, red=cancelled)
- [ ] Click order to expand and show full details
- [ ] Expanded view shows all items with images, names, quantities
- [ ] "Reorder" button adds all items to cart
- [ ] "Download Invoice" generates PDF
- [ ] "Track Shipment" opens tracking URL
- [ ] Tracking number displayed if available
- [ ] Filter dropdown by status works
- [ ] Date range picker filters orders
- [ ] Search input filters by order # or product name
- [ ] Pagination shown if > 10 orders
- [ ] Loading state during fetch
- [ ] Error state if fetch fails
- [ ] Responsive grid layout
- [ ] Each order shows delivery address

## API Contract

### GET /api/orders
**Request Headers:**
```
x-user-id: demo-user
```

**Query Params:**
```
?status=shipped&startDate=2025-01-01&endDate=2025-12-31&page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "ORD-20251026-12345",
        "orderNumber": "12345",
        "status": "delivered",
        "createdAt": "2025-10-15T10:00:00Z",
        "deliveredAt": "2025-10-20T15:30:00Z",
        "itemCount": 3,
        "total": 89.97,
        "items": [
          {
            "productId": "prod_123",
            "name": "Omega-3 Fish Oil",
            "quantity": 2,
            "price": 24.99,
            "imageUrl": "/products/omega3.jpg"
          }
        ],
        "shippingAddress": {
          "line1": "123 Main St",
          "city": "Portland",
          "state": "OR",
          "zip": "97201"
        },
        "trackingNumber": "1Z999AA10123456784",
        "trackingUrl": "https://tracking.example.com/1Z999AA10123456784"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

SPEC_FILE: /specs/features/shop-order-history.yml
GOOD_EXAMPLES: /src/app/dashboard/page.tsx, /src/app/cart/page.tsx, /src/components/ui/badge.tsx
TARGET_FILES: /src/app/shop/orders/page.tsx, /src/app/api/orders/route.ts, /src/components/orders/order-card.tsx

---

## Testing Instructions
1. Navigate to /shop/orders
2. Verify orders load
3. Verify newest order at top
4. Click an order to expand
5. Verify all items shown in expanded view
6. Click "Reorder" button
7. Verify items added to cart
8. Click "Download Invoice"
9. Verify PDF downloads
10. Click "Track Shipment"
11. Verify tracking page opens
12. Filter by "Delivered" status
13. Verify only delivered orders shown
14. Search for order number
15. Verify search results correct
16. Test pagination if 10+ orders
17. Test empty state with new user
18. Test on mobile viewport
```

**Priority:** High
**Status:** Not Started
**Category:** Shop

---

### TASK-016: Subscriptions Management
**Subject:** `[AUTO] Shop - Recurring Order Subscriptions`

**Description:**
```markdown
## Feature Requirements
Allow users to set up recurring orders for regular deliveries. Manage active subscriptions, pause/resume, change frequency, skip deliveries, and cancel.

## Current Implementation
- Subscriptions page at /shop/subscriptions
- Empty placeholder page
- No subscription logic implemented

## Technical Requirements
- GET /api/subscriptions (list user subscriptions)
- POST /api/subscriptions (create subscription)
- PATCH /api/subscriptions/[id] (update subscription)
- DELETE /api/subscriptions/[id] (cancel subscription)
- Display active, paused, cancelled subscriptions
- Show next delivery date
- Allow frequency change: weekly, bi-weekly, monthly
- Pause/resume functionality
- Skip next delivery button
- Subscription pricing with discount badge
- Payment method management
- Delivery address management

## Acceptance Criteria
- [ ] Page loads subscriptions from GET /api/subscriptions
- [ ] Active subscriptions shown first
- [ ] Each subscription card shows: product, frequency, next delivery, price
- [ ] Discount badge shown (e.g., "Save 15%")
- [ ] Status badge (Active, Paused, Cancelled)
- [ ] "Pause" button pauses subscription
- [ ] "Resume" button resumes paused subscription
- [ ] "Skip Next Delivery" button pushes next date
- [ ] Frequency dropdown changes delivery schedule
- [ ] "Cancel Subscription" button with confirmation
- [ ] Confirmation modal before cancellation
- [ ] Payment method displayed
- [ ] "Change Payment Method" link works
- [ ] Delivery address displayed
- [ ] "Change Address" link works
- [ ] Upcoming delivery countdown shown
- [ ] Order history per subscription
- [ ] Empty state if no subscriptions
- [ ] "Create Subscription" CTA in empty state
- [ ] Loading states for all operations
- [ ] Success toasts after updates
- [ ] Error handling with toasts

## API Contract

### GET /api/subscriptions
**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub_123",
      "productId": "prod_456",
      "productName": "Omega-3 Fish Oil",
      "productImage": "/products/omega3.jpg",
      "quantity": 2,
      "size": "8oz",
      "frequency": "monthly",
      "status": "active",
      "nextDelivery": "2025-11-15T00:00:00Z",
      "pricePerDelivery": 42.48,
      "discountPercent": 15,
      "createdAt": "2025-09-15T10:00:00Z",
      "paymentMethod": "Visa ****1234",
      "shippingAddress": {
        "line1": "123 Main St",
        "city": "Portland",
        "state": "OR",
        "zip": "97201"
      }
    }
  ]
}
```

### PATCH /api/subscriptions/[id]
**Request:**
```json
{
  "frequency": "bi-weekly",
  "status": "paused"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { /* updated subscription */ },
  "message": "Subscription updated"
}
```

### DELETE /api/subscriptions/[id]
**Success Response (200):**
```json
{
  "success": true,
  "message": "Subscription cancelled"
}
```

---

SPEC_FILE: /specs/features/shop-subscriptions.yml
GOOD_EXAMPLES: /src/app/shop/orders/page.tsx, /src/app/dashboard/page.tsx
TARGET_FILES: /src/app/shop/subscriptions/page.tsx, /src/app/api/subscriptions/route.ts, /src/app/api/subscriptions/[id]/route.ts

---

## Testing Instructions
1. Navigate to /shop/subscriptions
2. Verify active subscriptions load
3. Check next delivery date shown
4. Click "Pause" on one subscription
5. Verify status changes to "Paused"
6. Click "Resume"
7. Verify status changes to "Active"
8. Click "Skip Next Delivery"
9. Verify next delivery date moves forward
10. Change frequency dropdown
11. Verify next delivery date recalculated
12. Click "Cancel Subscription"
13. Verify confirmation modal appears
14. Confirm cancellation
15. Verify subscription status updates
16. Test empty state with no subscriptions
17. Test on mobile viewport
```

**Priority:** Medium
**Status:** Not Started
**Category:** Shop

---

### TASK-017: Product Search & Filters
**Subject:** `[AUTO] Shop - Search and Filter Products`

**Description:**
```markdown
## Feature Requirements
Allow users to search products by name, filter by category, species, price range, brand, rating, and sort results.

## Current Implementation
- Shop page at /shop with grid of all products
- No search functionality
- No filter UI
- No sort options
- All products displayed at once

## Technical Requirements
- Search input with debounce (300ms)
- Filter by: category, species, price range, brand, in-stock only, rating
- Sort by: featured, price (low-high), price (high-low), rating, newest
- Client-side filtering (fast response)
- URL query params for shareable filtered views
- Clear all filters button
- Active filter badges
- Result count display
- Maintain filters on page navigation

## Acceptance Criteria
- [ ] Search input at top of shop page
- [ ] Search filters products by name/description
- [ ] Search debounced (no lag with fast typing)
- [ ] Category filter dropdown with all categories
- [ ] Species filter: All, Dogs, Cats, Both
- [ ] Price range slider (min/max)
- [ ] Brand multi-select checkboxes
- [ ] "In Stock Only" toggle switch
- [ ] Rating filter (4+ stars, 3+ stars, etc.)
- [ ] Sort dropdown with 6 options
- [ ] Active filters shown as removable badges
- [ ] "Clear All Filters" button
- [ ] Result count shown: "Showing 24 of 150 products"
- [ ] No results state if filters too restrictive
- [ ] Filters preserved in URL params
- [ ] Back button respects filter state
- [ ] Share filtered URL works
- [ ] Mobile: Filters in drawer/modal
- [ ] Desktop: Filters in sidebar
- [ ] Loading state during search/filter
- [ ] Smooth transitions when results update

## API Contract

### GET /api/shop/products
**Query Params:**
```
?search=omega&category=skin-coat&species=dog&minPrice=10&maxPrice=50&brands=PetVitality,NutriPaws&inStockOnly=true&minRating=4&sort=price-asc&page=1&limit=24
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "omega3-fish-oil-1",
        "name": "Omega-3 Fish Oil",
        "brand": "PetVitality",
        "price": 24.99,
        "category": "skin-coat",
        "rating": 4.8,
        "inStock": true,
        "featured": true,
        "forSpecies": ["dog", "cat"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 24,
      "total": 48,
      "totalPages": 2
    },
    "filters": {
      "categories": ["skin-coat", "joint-mobility", "..."],
      "brands": ["PetVitality", "NutriPaws", "..."],
      "priceRange": { "min": 9.99, "max": 89.99 }
    }
  }
}
```

---

SPEC_FILE: /specs/features/shop-search-filters.yml
GOOD_EXAMPLES: /src/app/shop/page.tsx, /src/app/suppliers/page.tsx, /src/components/ui/input.tsx
TARGET_FILES: /src/app/shop/page.tsx, /src/app/api/shop/products/route.ts, /src/components/shop/product-filters.tsx

---

## Testing Instructions
1. Navigate to /shop
2. Type "omega" in search box
3. Verify results filter immediately
4. Select "Skin & Coat" category
5. Verify results update
6. Select "Dogs Only" species filter
7. Verify cat-only products removed
8. Adjust price range slider
9. Verify products outside range hidden
10. Select multiple brands
11. Verify only selected brands shown
12. Toggle "In Stock Only"
13. Verify out-of-stock products hidden
14. Change sort to "Price: Low to High"
15. Verify products reorder
16. Click active filter badge X
17. Verify filter removed
18. Click "Clear All Filters"
19. Verify all filters reset
20. Check URL contains filter params
21. Copy URL and open in new tab
22. Verify filters preserved
23. Test mobile filter drawer
```

**Priority:** High
**Status:** Not Started
**Category:** Shop

---

### TASK-018: Related Products
**Subject:** `[AUTO] Shop - Product Recommendations`

**Description:**
```markdown
## Feature Requirements
Show related products on product detail pages and checkout. Recommend based on category, species compatibility, purchase history, and popularity.

## Current Implementation
- No related products shown
- Product detail page shows only current product
- No recommendation algorithm

## Technical Requirements
- GET /api/shop/products/[id]/related
- Algorithm: same category, same species, high rating
- Limit to 4 products on detail page
- Carousel with navigation arrows
- "Customers also bought" section
- "Add to Cart" quick action on related products
- Track clicks for recommendation improvement

## Acceptance Criteria
- [ ] "Related Products" section on product detail page
- [ ] Shows 4 products in horizontal carousel
- [ ] Products match category of current product
- [ ] Products compatible with same species
- [ ] Products sorted by rating/popularity
- [ ] Each product card shows: image, name, price, rating
- [ ] Quick "Add to Cart" button on each card
- [ ] Click product navigates to that product's page
- [ ] Arrow navigation for carousel
- [ ] Dots/indicators for carousel position
- [ ] Swipe gesture support on mobile
- [ ] No related products shown if < 3 available
- [ ] Loading state while fetching
- [ ] Current product excluded from results
- [ ] Recently viewed products (separate section)
- [ ] "Customers also bought" on checkout page

## API Contract

### GET /api/shop/products/[id]/related
**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "joint-support-1",
      "name": "Joint Support Formula",
      "price": 29.99,
      "rating": 4.7,
      "reviews": 892,
      "imageUrl": "/products/joint.jpg",
      "category": "joint-mobility",
      "inStock": true
    }
  ]
}
```

---

SPEC_FILE: /specs/features/shop-related-products.yml
GOOD_EXAMPLES: /src/app/shop/[id]/page.tsx, /src/app/shop/page.tsx
TARGET_FILES: /src/app/shop/[id]/page.tsx, /src/app/api/shop/products/[id]/related/route.ts, /src/components/shop/related-products-carousel.tsx

---

## Testing Instructions
1. Navigate to any product detail page
2. Scroll to "Related Products" section
3. Verify 4 products shown
4. Verify all related to same category
5. Click left/right arrows
6. Verify carousel navigation works
7. Click a related product
8. Verify navigation to new product
9. Click "Add to Cart" on related product
10. Verify item added without page navigation
11. Test swipe gesture on mobile
12. Test with product that has < 3 related
13. Verify section hidden if insufficient products
```

**Priority:** Medium
**Status:** Not Started
**Category:** Shop

---

## 🐾 Pets Module

### TASK-019: Pet Profile Management (CRUD)
**Subject:** `[AUTO] Pets - Create, Edit, Delete Pet Profiles`

**Description:**
```markdown
## Feature Requirements
Allow users to manage multiple pet profiles with full CRUD operations. Create new pets, edit details, delete pets, and view all pets in a grid.

## Current Implementation
- Pets listing page at /pets
- GET /api/pets (fetch user's pets)
- POST /api/pets (create pet)
- PUT /api/pets (update pet)
- DELETE /api/pets?id=xxx (delete pet)
- AddPetDialog component
- EditPetDialog component
- Vercel KV storage with in-memory fallback
- Demo data: Max (Golden Retriever), Luna (Labrador)

## Technical Requirements
- Fetch pets on mount with x-user-id header
- Display in grid (2 columns on desktop)
- Pet fields: name, species, breed, birthdate, weight, gender, image
- Validation: required fields, species (dog/cat), gender (male/female)
- Dialog modals for add/edit forms
- Confirmation modal for delete
- Image upload support (optional)
- Calculate age from birthdate
- Loading states for all operations
- Error handling with toasts
- Empty state with "Add Pet" CTA

## Acceptance Criteria
- [ ] Page loads pets from GET /api/pets
- [ ] Loading spinner shown during fetch
- [ ] Empty state if no pets
- [ ] Empty state shows "Add your first pet" message
- [ ] "Add Pet" button opens dialog
- [ ] Add form has fields: name, species, breed, birthdate, weight, gender, image
- [ ] Species dropdown: Dog, Cat
- [ ] Gender dropdown: Male, Female
- [ ] Birthdate is date picker
- [ ] Weight is number input (kg)
- [ ] Image upload optional (file picker or URL)
- [ ] Form validation prevents submission if required fields missing
- [ ] POST /api/pets creates new pet
- [ ] New pet appears in grid immediately
- [ ] Success toast after creation
- [ ] Each pet card shows: image/icon, name, breed, gender, age, weight
- [ ] Dog icon if species=dog, cat icon if species=cat
- [ ] Age calculated from birthdate
- [ ] "Edit" button opens EditPetDialog
- [ ] Edit form pre-fills with current pet data
- [ ] PUT /api/pets updates pet
- [ ] Updated pet refreshes in grid
- [ ] "Delete" button in edit dialog
- [ ] Delete confirmation modal before deletion
- [ ] DELETE /api/pets removes pet
- [ ] Pet removed from grid after delete
- [ ] "View Feeding" button links to /feeding?pet={id}
- [ ] "Health Records" button links to /health?pet={id}
- [ ] Grid responsive (1 col mobile, 2 col desktop)
- [ ] Works with Vercel KV or in-memory fallback

## API Contract

### GET /api/pets
**Request Headers:**
```
x-user-id: demo-user
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "userId": "demo-user",
      "name": "Max",
      "species": "dog",
      "breed": "Golden Retriever",
      "birthdate": "2021-03-15",
      "weight": 65,
      "gender": "male",
      "image": "https://...",
      "active": true,
      "createdAt": "2025-10-26T10:00:00Z"
    }
  ]
}
```

### POST /api/pets
**Request:**
```json
{
  "name": "Bella",
  "species": "cat",
  "breed": "Siamese",
  "birthdate": "2020-08-10",
  "weight": 10,
  "gender": "female",
  "image": "https://..."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "3",
    "userId": "demo-user",
    "name": "Bella",
    "species": "cat",
    "breed": "Siamese",
    "birthdate": "2020-08-10",
    "weight": 10,
    "gender": "female",
    "image": "https://...",
    "active": true,
    "createdAt": "2025-10-26T14:00:00Z"
  }
}
```

### PUT /api/pets
**Request:**
```json
{
  "id": "3",
  "name": "Bella",
  "weight": 11
}
```

### DELETE /api/pets?id=3
**Success Response (200):**
```json
{
  "success": true,
  "message": "Pet deleted successfully"
}
```

---

SPEC_FILE: /specs/features/pets-crud.yml
GOOD_EXAMPLES: /src/app/pets/page.tsx, /src/components/pets/add-pet-dialog.tsx, /src/components/pets/edit-pet-dialog.tsx, /src/app/api/pets/route.ts
TARGET_FILES: /src/app/pets/page.tsx, /src/app/api/pets/route.ts, /src/components/pets/add-pet-dialog.tsx, /src/components/pets/edit-pet-dialog.tsx

---

## Testing Instructions
1. Navigate to /pets
2. Verify demo pets (Max, Luna) load
3. Click "Add Pet" button
4. Fill form: name=Buddy, species=dog, breed=Beagle, birthdate=2023-01-01, weight=25, gender=male
5. Submit form
6. Verify Buddy appears in grid
7. Verify success toast shown
8. Click "Edit" button on Buddy's card
9. Change weight to 26
10. Submit update
11. Verify weight updates in grid
12. Click "Delete" in edit dialog
13. Verify confirmation modal appears
14. Confirm deletion
15. Verify Buddy removed from grid
16. Test form validation (submit empty form)
17. Verify validation errors shown
18. Test with no pets (delete all)
19. Verify empty state appears
20. Test on mobile viewport
```

**Priority:** High
**Status:** Ready for Review (Implemented)
**Category:** Pets

---

### TASK-020: Pet Detail View
**Subject:** `[AUTO] Pets - Individual Pet Profile Page`

**Description:**
```markdown
## Feature Requirements
Display comprehensive pet profile with health stats, activity timeline, weight chart, and quick actions.

## Current Implementation
- Pet detail page at /pets/[id]
- Basic implementation exists
- Shows pet info with edit/delete options

## Technical Requirements
- GET /api/pets/[id] for pet details
- GET /api/health/records?petId=[id] for health data
- GET /api/activity?petId=[id] for activity timeline
- Display: photo, name, breed, age, weight, gender
- Health overview: vaccinations, medications, vet visits
- Activity timeline (recent 10 activities)
- Weight tracking chart
- Quick actions: Add Health Record, Log Activity, Schedule Vet Visit
- Edit profile button
- Share profile button

## Acceptance Criteria
- [ ] Page loads pet by ID from URL
- [ ] 404 if pet not found
- [ ] Pet photo displayed (or species icon)
- [ ] Name, breed, age, weight, gender shown
- [ ] "Edit Profile" button opens edit dialog
- [ ] Health overview section shows vaccine count, medication count
- [ ] Recent activities timeline (last 10)
- [ ] Weight chart with historical data
- [ ] "Add Health Record" button navigates to /health?pet={id}
- [ ] "Log Activity" button opens activity form
- [ ] "Schedule Vet Visit" button opens calendar
- [ ] Share profile copies URL to clipboard
- [ ] Breadcrumb navigation to /pets
- [ ] Loading state during fetch
- [ ] Error state if fetch fails
- [ ] Responsive layout on mobile

## API Contract

### GET /api/pets/[id]
**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Max",
    "species": "dog",
    "breed": "Golden Retriever",
    "birthdate": "2021-03-15",
    "weight": 65,
    "gender": "male",
    "image": "https://...",
    "healthSummary": {
      "vaccinations": 8,
      "medications": 1,
      "vetVisits": 5
    },
    "recentActivities": [
      {
        "type": "walk",
        "duration": 30,
        "date": "2025-10-25T10:00:00Z"
      }
    ],
    "weightHistory": [
      { "date": "2025-09-01", "weight": 63 },
      { "date": "2025-10-01", "weight": 65 }
    ]
  }
}
```

---

SPEC_FILE: /specs/features/pets-detail-view.yml
GOOD_EXAMPLES: /src/app/pets/[id]/page.tsx, /src/app/dashboard/page.tsx
TARGET_FILES: /src/app/pets/[id]/page.tsx, /src/app/api/pets/[id]/route.ts

---

## Testing Instructions
1. Navigate to /pets
2. Click on a pet card
3. Verify URL is /pets/{id}
4. Verify pet details load
5. Verify health summary shown
6. Verify activity timeline displays
7. Verify weight chart renders
8. Click "Edit Profile"
9. Verify edit dialog opens
10. Click "Add Health Record"
11. Verify navigation to /health
12. Test breadcrumb back to /pets
13. Test 404 with invalid ID
```

**Priority:** Medium
**Status:** In Progress
**Category:** Pets

---

### TASK-021: Pet Photo Upload
**Subject:** `[AUTO] Pets - Upload and Manage Pet Photos`

**Description:**
```markdown
## Feature Requirements
Allow users to upload, crop, and delete pet photos. Support drag-and-drop, file picker, and URL input.

## Current Implementation
- Image field in add/edit pet dialogs
- No upload functionality
- Image stored as URL string
- No file upload or storage

## Technical Requirements
- File upload via drag-and-drop or file picker
- Accept: jpg, png, webp, gif
- Max file size: 5MB
- Image preview before upload
- Crop/resize functionality
- POST /api/upload/pet-photo with FormData
- Store in Vercel Blob or Cloudinary
- Return URL to save in pet record
- Delete old photo when replacing
- Fallback to URL input if upload fails

## Acceptance Criteria
- [ ] "Upload Photo" section in add/edit pet dialog
- [ ] Drag-and-drop area with visual feedback
- [ ] File picker button as alternative
- [ ] File type validation (jpg, png, webp, gif only)
- [ ] File size validation (max 5MB)
- [ ] Error toast if invalid file
- [ ] Image preview shown after selection
- [ ] Crop/resize modal opens after preview
- [ ] Crop modal has aspect ratio 1:1 (square)
- [ ] "Save" button uploads cropped image
- [ ] Loading spinner during upload
- [ ] POST /api/upload/pet-photo with file
- [ ] Image URL returned from API
- [ ] URL saved to pet record
- [ ] Uploaded photo displayed in pet card
- [ ] "Remove Photo" button deletes image
- [ ] Fallback to species icon if no photo
- [ ] URL input field for external images
- [ ] Paste image from clipboard support
- [ ] Works on mobile devices

## API Contract

### POST /api/upload/pet-photo
**Request:**
```
Content-Type: multipart/form-data
FormData: { file: <binary> }
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "url": "https://blob.vercel-storage.com/pets/abc123.jpg",
    "size": 245632,
    "contentType": "image/jpeg"
  }
}
```

**Error Response (413):**
```json
{
  "success": false,
  "error": "File too large. Maximum size is 5MB"
}
```

---

SPEC_FILE: /specs/features/pets-photo-upload.yml
GOOD_EXAMPLES: /src/components/pets/add-pet-dialog.tsx, /src/components/ui/input.tsx
TARGET_FILES: /src/components/pets/add-pet-dialog.tsx, /src/components/pets/pet-photo-upload.tsx, /src/app/api/upload/pet-photo/route.ts

---

## Testing Instructions
1. Open "Add Pet" dialog
2. Drag image file into drop zone
3. Verify preview shown
4. Verify crop modal opens
5. Adjust crop area
6. Click "Save"
7. Verify upload progress shown
8. Verify photo URL populated
9. Submit pet form
10. Verify photo shown in pet card
11. Edit pet
12. Upload new photo
13. Verify old photo replaced
14. Test file picker button
15. Test with invalid file type (PDF)
16. Verify error toast
17. Test with 10MB file
18. Verify size error
19. Test URL input field
20. Test on mobile device
```

**Priority:** Medium
**Status:** Not Started
**Category:** Pets

---

### TASK-022: Multiple Pets Support
**Subject:** `[AUTO] Pets - Switch Between Multiple Pet Profiles`

**Description:**
```markdown
## Feature Requirements
Allow users to seamlessly switch between pet profiles throughout the app. Pet selector in header, contextual filtering, and pet-specific data views.

## Current Implementation
- Multiple pets supported in /pets page
- Each page hardcodes demo-user
- No global pet selector
- Query params used for pet filtering (?pet={id})

## Technical Requirements
- Global PetContext to track selected pet
- Pet selector dropdown in header
- Persist selected pet in localStorage
- Filter health records, feeding plans, activities by selected pet
- "All Pets" option to view aggregated data
- Update selected pet across navigation
- Show pet name in page titles
- Pet avatar in selector dropdown

## Acceptance Criteria
- [ ] PetContext created with: selectedPet, setSelectedPet, pets
- [ ] PetContext fetches all user pets on mount
- [ ] Pet selector dropdown in header (next to notifications)
- [ ] Dropdown shows all pets with: avatar, name, species
- [ ] "All Pets" option at top of dropdown
- [ ] Clicking pet in dropdown updates selectedPet
- [ ] Selected pet persists in localStorage
- [ ] On app load, restore selectedPet from localStorage
- [ ] Dashboard filters by selectedPet
- [ ] Health page filters by selectedPet
- [ ] Feeding page filters by selectedPet
- [ ] Activity page filters by selectedPet
- [ ] Page titles show pet name: "Max's Health Records"
- [ ] "All Pets" shows aggregated data
- [ ] No pet selected shows onboarding to add pet
- [ ] Dropdown closes after selection
- [ ] Mobile: Pet selector in drawer menu
- [ ] Desktop: Pet selector in top-right header

---

SPEC_FILE: /specs/features/pets-multi-pet-support.yml
GOOD_EXAMPLES: /src/contexts/auth-context.tsx, /src/contexts/cart-context.tsx
TARGET_FILES: /src/contexts/pet-context.tsx, /src/components/layout/header.tsx, /src/components/pets/pet-selector.tsx

---

## Testing Instructions
1. Add 3+ pets to account
2. Navigate to /dashboard
3. Click pet selector in header
4. Verify dropdown shows all pets
5. Select "Luna"
6. Verify dashboard filters to Luna's data
7. Navigate to /health
8. Verify health records show Luna's records
9. Select "All Pets" from dropdown
10. Verify aggregated view shown
11. Refresh page
12. Verify last selected pet remembered
13. Test on mobile drawer menu
```

**Priority:** High
**Status:** Not Started
**Category:** Pets

---

### TASK-023: Pet Health Dashboard
**Subject:** `[AUTO] Pets - Health Overview & Insights`

**Description:**
```markdown
## Feature Requirements
Provide at-a-glance health overview for each pet. Show vaccination status, medication reminders, upcoming vet visits, weight trends, and health alerts.

## Current Implementation
- Dashboard page shows basic pet stats
- Health data scattered across multiple pages
- No centralized health overview

## Technical Requirements
- Aggregate health data from multiple sources
- Display: vaccination status, active medications, upcoming appointments
- Weight trend chart with healthy range indicator
- Health alerts (overdue vaccines, low medication stock)
- Recent health records timeline
- Export health report button
- Schedule vet visit CTA

## Acceptance Criteria
- [ ] Health dashboard accessible from pet detail page
- [ ] Vaccination status: up-to-date count / total required
- [ ] Overdue vaccinations shown with alert badge
- [ ] Active medications list with dosage and schedule
- [ ] Medication refill reminders
- [ ] Upcoming vet visits with countdown
- [ ] Weight trend chart (last 6 months)
- [ ] Healthy weight range highlighted on chart
- [ ] Health alerts section with action items
- [ ] Recent health records (last 5)
- [ ] "Export Health Report" button generates PDF
- [ ] "Schedule Vet Visit" opens calendar modal
- [ ] "Add Health Record" quick action button
- [ ] Responsive layout on mobile
- [ ] Loading state while aggregating data

---

SPEC_FILE: /specs/features/pets-health-dashboard.yml
GOOD_EXAMPLES: /src/app/dashboard/page.tsx, /src/app/health/page.tsx
TARGET_FILES: /src/app/pets/[id]/health/page.tsx, /src/components/pets/health-dashboard.tsx

---

## Testing Instructions
1. Navigate to pet detail page
2. Click "Health Dashboard" tab
3. Verify vaccination status displays
4. Verify active medications listed
5. Verify upcoming vet visits shown
6. Verify weight chart renders
7. Add overdue vaccination
8. Verify alert badge appears
9. Click "Export Health Report"
10. Verify PDF downloads
11. Click "Schedule Vet Visit"
12. Verify calendar modal opens
```

**Priority:** Medium
**Status:** Not Started
**Category:** Pets

---

## 📊 Dashboard Module

### TASK-024: User Dashboard Overview
**Subject:** `[AUTO] Dashboard - User Home & Activity Overview`

**Description:**
```markdown
## Feature Requirements
Central hub showing user's pet health, activities, orders, and community engagement. Personalized welcome, quick stats, recent activity feed, and quick action buttons.

## Current Implementation
- Dashboard page at /dashboard
- GET /api/dashboard?petId={id} for pet-specific data
- Stats cards: activities, activity time, health records, feeding streak
- Weight chart and recent activities display
- Pet selector to switch between pets
- Order history component
- Loading states

## Technical Requirements
- Fetch dashboard data per selected pet
- Display 4 stat cards with trend indicators
- Weight history chart (bar chart)
- Recent activities list (last 5)
- Upcoming vaccinations alert
- Order history section
- Quick action buttons: Add Health Record, Log Activity, Shop Now
- Personalized greeting with pet name
- Responsive grid layout

## Acceptance Criteria
- [ ] Page loads dashboard data from GET /api/dashboard
- [ ] Pet selector shown if user has multiple pets
- [ ] Personalized title: "Pet Health Dashboard"
- [ ] Subtitle shows selected pet name
- [ ] 4 stat cards displayed in grid
- [ ] Total Activities card with count and trend
- [ ] Activity Time card with minutes this week
- [ ] Health Records card with total count
- [ ] Feeding Streak card with days in a row
- [ ] Trend indicators: up arrow +12% in green
- [ ] Weight History chart displays correctly
- [ ] Chart shows last 6 data points
- [ ] Current weight highlighted
- [ ] Recent Activities list shows last 5 activities
- [ ] Activity items show: type, duration, date
- [ ] Empty state if no activities
- [ ] Upcoming Vaccinations alert if any due
- [ ] Alert shows count and "View Details" button
- [ ] Order History section with recent orders
- [ ] Loading spinner during fetch
- [ ] Error state if fetch fails
- [ ] Responsive layout (1 col mobile, 2 col tablet, 4 col desktop for stats)
- [ ] Works with demo-user header

## API Contract

### GET /api/dashboard?petId={id}
**Request Headers:**
```
x-user-id: demo-user
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalActivities": 24,
    "totalActivityMinutes": 180,
    "averageActivityPerWeek": 5,
    "activityTrend": "up",
    "healthRecords": 12,
    "upcomingVaccinations": 2,
    "weightHistory": [
      { "date": "2025-05-01", "weight": 60 },
      { "date": "2025-06-01", "weight": 62 },
      { "date": "2025-07-01", "weight": 63 },
      { "date": "2025-08-01", "weight": 64 },
      { "date": "2025-09-01", "weight": 65 },
      { "date": "2025-10-01", "weight": 65 }
    ],
    "recentActivities": [
      {
        "type": "walk",
        "duration": 30,
        "date": "2025-10-25T10:00:00Z"
      },
      {
        "type": "play",
        "duration": 15,
        "date": "2025-10-24T15:30:00Z"
      }
    ],
    "feedingStreak": 14
  }
}
```

---

SPEC_FILE: /specs/features/dashboard-overview.yml
GOOD_EXAMPLES: /src/app/dashboard/page.tsx, /src/components/orders/order-history.tsx, /src/app/api/dashboard/route.ts
TARGET_FILES: /src/app/dashboard/page.tsx, /src/app/api/dashboard/route.ts

---

## Testing Instructions
1. Navigate to /dashboard
2. Verify page loads with demo pet data
3. Verify 4 stat cards display
4. Verify weight chart renders
5. Verify recent activities list shown
6. Hover over stat card with trend
7. Verify tooltip shows percentage
8. Click pet selector (if multiple pets)
9. Verify dashboard data updates
10. Test with pet that has no activities
11. Verify empty state shown
12. Test upcoming vaccinations alert
13. Verify "View Details" button works
14. Test responsive layout on mobile
15. Test loading state (throttle network)
```

**Priority:** High
**Status:** Ready for Review (Implemented)
**Category:** Dashboard

---

### TASK-025: Activity Feed
**Subject:** `[AUTO] Dashboard - Real-time Activity Timeline`

**Description:**
```markdown
## Feature Requirements
Display chronological feed of user and pet activities. Show health records added, orders placed, community posts, achievements unlocked, and feeding confirmations.

## Current Implementation
- GET /api/activity endpoint exists
- Returns demo activity data
- No UI implementation
- No real-time updates

## Technical Requirements
- GET /api/activity with pagination
- Activity types: health_record, order, community_post, achievement, feeding
- Each activity has: type, title, description, timestamp, icon
- Infinite scroll or "Load More" pagination
- Filter by activity type
- Date grouping (Today, Yesterday, This Week, Earlier)
- Activity icons based on type
- Click activity to view details
- Real-time updates with polling or WebSocket

## Acceptance Criteria
- [ ] Activity feed page at /activity
- [ ] Loads activities from GET /api/activity
- [ ] Activities grouped by date
- [ ] Date headers: Today, Yesterday, This Week, Earlier
- [ ] Each activity shows: icon, title, description, timestamp
- [ ] Health record activities link to /health
- [ ] Order activities link to /shop/orders
- [ ] Community activities link to post detail
- [ ] Achievement activities show badge earned
- [ ] Feeding activities show meal confirmed
- [ ] Filter dropdown: All, Health, Orders, Community, Achievements
- [ ] Filter updates feed instantly
- [ ] "Load More" button if > 20 activities
- [ ] Pagination loads next 20 activities
- [ ] Loading spinner during fetch
- [ ] Empty state if no activities
- [ ] Timestamps relative: "2 hours ago", "3 days ago"
- [ ] Responsive layout on mobile
- [ ] Pull-to-refresh on mobile

## API Contract

### GET /api/activity
**Query Params:**
```
?type=health_record&page=1&limit=20
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "act_123",
        "type": "health_record",
        "title": "Added health record for Max",
        "description": "Vaccination: Rabies booster",
        "timestamp": "2025-10-26T10:00:00Z",
        "icon": "💉",
        "link": "/health/record_456"
      },
      {
        "id": "act_124",
        "type": "order",
        "title": "Order placed",
        "description": "Omega-3 Fish Oil (2x)",
        "timestamp": "2025-10-25T14:30:00Z",
        "icon": "📦",
        "link": "/shop/orders/ORD-12345"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 48,
      "hasMore": true
    }
  }
}
```

---

SPEC_FILE: /specs/features/dashboard-activity-feed.yml
GOOD_EXAMPLES: /src/app/dashboard/page.tsx, /src/app/activity/page.tsx
TARGET_FILES: /src/app/activity/page.tsx, /src/app/api/activity/route.ts, /src/components/dashboard/activity-feed.tsx

---

## Testing Instructions
1. Navigate to /activity
2. Verify activities load grouped by date
3. Verify "Today" header shows today's activities
4. Click a health record activity
5. Verify navigation to health record
6. Click filter dropdown
7. Select "Orders"
8. Verify only order activities shown
9. Scroll to bottom
10. Click "Load More"
11. Verify next 20 activities load
12. Test pull-to-refresh on mobile
13. Test empty state with new account
```

**Priority:** Medium
**Status:** In Progress
**Category:** Dashboard

---

### TASK-026: Quick Actions
**Subject:** `[AUTO] Dashboard - Shortcut Action Buttons`

**Description:**
```markdown
## Feature Requirements
Provide quick access to common actions from dashboard. Floating action button or prominent CTA buttons for: Add Health Record, Log Feeding, Shop Now, Schedule Vet Visit, Ask Dr. Raw.

## Current Implementation
- No quick actions on dashboard
- Users must navigate to each page separately

## Technical Requirements
- Quick action buttons in prominent card
- Icons for each action
- Navigate to relevant pages
- Pre-fill forms with selected pet
- Keyboard shortcuts (optional)
- Mobile: Floating action button (FAB) with menu

## Acceptance Criteria
- [ ] "Quick Actions" card on dashboard
- [ ] 5 action buttons in grid
- [ ] "Add Health Record" button with heart icon
- [ ] Navigates to /health with add form open
- [ ] "Log Feeding" button with fork icon
- [ ] Navigates to /feeding with log modal open
- [ ] "Shop Now" button with shopping cart icon
- [ ] Navigates to /shop
- [ ] "Schedule Vet Visit" button with calendar icon
- [ ] Opens vet appointment modal
- [ ] "Ask Dr. Raw" button with chat icon
- [ ] Navigates to /ai-assistant
- [ ] Buttons have hover effects
- [ ] Buttons disabled if no pets added
- [ ] Mobile: FAB in bottom-right corner
- [ ] FAB opens radial menu with 5 actions
- [ ] Keyboard shortcuts: Ctrl+H (health), Ctrl+F (feeding), etc.

---

SPEC_FILE: /specs/features/dashboard-quick-actions.yml
GOOD_EXAMPLES: /src/app/dashboard/page.tsx, /src/components/ui/button.tsx
TARGET_FILES: /src/components/dashboard/quick-actions.tsx, /src/app/dashboard/page.tsx

---

## Testing Instructions
1. Navigate to /dashboard
2. Locate "Quick Actions" card
3. Click "Add Health Record"
4. Verify navigation to /health with form open
5. Go back to dashboard
6. Click "Log Feeding"
7. Verify feeding modal opens
8. Go back to dashboard
9. Click "Shop Now"
10. Verify navigation to /shop
11. Test on mobile device
12. Verify FAB appears in corner
13. Click FAB
14. Verify radial menu opens
```

**Priority:** Medium
**Status:** Not Started
**Category:** Dashboard

---

### TASK-027: Stats Cards
**Subject:** `[AUTO] Dashboard - Key Metrics Display`

**Description:**
```markdown
## Feature Requirements
Display important metrics in visually appealing cards. Show total activities, health records, feeding streak, and paw points with trend indicators.

## Current Implementation
- Dashboard has 4 stat cards
- Cards show: Total Activities, Activity Time, Health Records, Feeding Streak
- Trend indicators with up/down arrows
- Color-coded cards

## Technical Requirements
- Fetch stats from GET /api/dashboard
- Calculate trends (week-over-week or month-over-month)
- Display with large numbers and icons
- Trend percentages with colored arrows
- Click card to drill down to detail page
- Responsive grid layout
- Skeleton loading states

## Acceptance Criteria
- [ ] 4 stat cards in grid
- [ ] Card 1: Total Activities with Activity icon
- [ ] Card 2: Activity Time (minutes) with Clock icon
- [ ] Card 3: Health Records with Heart icon
- [ ] Card 4: Feeding Streak with Calendar icon
- [ ] Each card has: icon, title, large number, subtitle
- [ ] Trend indicator shows +/- percentage
- [ ] Up arrow green for positive trends
- [ ] Down arrow red for negative trends
- [ ] Click card navigates to detail page
- [ ] Activities card -> /activity
- [ ] Health card -> /health
- [ ] Feeding card -> /feeding
- [ ] Skeleton placeholders during loading
- [ ] Grid responsive: 1 col mobile, 2 col tablet, 4 col desktop
- [ ] Cards have subtle hover effect

---

SPEC_FILE: /specs/features/dashboard-stats-cards.yml
GOOD_EXAMPLES: /src/app/dashboard/page.tsx, /src/components/ui/card.tsx
TARGET_FILES: /src/app/dashboard/page.tsx, /src/components/dashboard/stats-card.tsx

---

## Testing Instructions
1. Navigate to /dashboard
2. Verify 4 stat cards display
3. Verify each has icon, title, number
4. Verify trends show percentages
5. Click "Total Activities" card
6. Verify navigation to /activity
7. Go back to dashboard
8. Click "Health Records" card
9. Verify navigation to /health
10. Test skeleton loading (throttle network)
11. Test responsive grid on mobile
12. Hover over cards
13. Verify hover effect appears
```

**Priority:** High
**Status:** Ready for Review (Implemented)
**Category:** Dashboard

---

## 👥 Community Module

### TASK-028: Forums Listing
**Subject:** `[AUTO] Community - Forums Browse & Categories`

**Description:**
```markdown
## Feature Requirements
Display forum categories and recent threads. Allow browsing by category, searching threads, and sorting by activity/popularity.

## Current Implementation
- Forums page at /community/forums
- Static category list with thread/post counts
- Sample threads displayed
- Search input and category filter
- Sort dropdown (activity, replies, views)
- No real API integration

## Technical Requirements
- GET /api/forums for categories and threads
- Categories: Getting Started, Recipes & Nutrition, Health & Wellness, Success Stories, Suppliers & Products, Off-Topic
- Each category shows: icon, name, description, thread count, post count
- Recent threads list with: title, author, replies, views, last activity
- Pinned threads at top
- Search by thread title
- Filter by category
- Sort by: Recent Activity, Most Replies, Most Views
- Pagination for threads
- Locked thread indicator

## Acceptance Criteria
- [ ] Page loads categories from GET /api/forums
- [ ] 6 categories displayed in grid (2 cols desktop)
- [ ] Each category card shows: emoji icon, name, description
- [ ] Category card shows thread count and post count
- [ ] Click category navigates to category-filtered view
- [ ] Threads list shown below categories
- [ ] Pinned threads marked with "PINNED" badge at top
- [ ] Each thread shows: author avatar, title, author name, reply count, view count, last activity time
- [ ] Click thread navigates to /community/forums/[id]
- [ ] Search input filters threads by title
- [ ] Category dropdown filters threads
- [ ] Sort dropdown reorders threads
- [ ] "New Thread" button in header
- [ ] Empty state if no threads found
- [ ] Pagination if > 20 threads
- [ ] Loading state during fetch
- [ ] Locked threads show lock icon
- [ ] Responsive grid layout

## API Contract

### GET /api/forums
**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "getting-started",
        "name": "Getting Started",
        "description": "New to raw feeding? Start here...",
        "icon": "🌱",
        "threadCount": 156,
        "postCount": 2341,
        "color": "bg-green-100 text-green-800"
      }
    ],
    "threads": [
      {
        "id": "1",
        "categoryId": "getting-started",
        "title": "Complete Beginner's Guide...",
        "author": "Sarah M.",
        "authorAvatar": "https://...",
        "createdAt": "2025-10-15T10:00:00Z",
        "replyCount": 127,
        "viewCount": 3421,
        "lastActivity": "2025-10-26T14:00:00Z",
        "isPinned": true,
        "isLocked": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 48
    }
  }
}
```

---

SPEC_FILE: /specs/features/community-forums-listing.yml
GOOD_EXAMPLES: /src/app/community/forums/page.tsx, /src/app/community/page.tsx
TARGET_FILES: /src/app/community/forums/page.tsx, /src/app/api/forums/route.ts

---

## Testing Instructions
1. Navigate to /community/forums
2. Verify 6 categories display
3. Verify thread counts shown
4. Click "Getting Started" category
5. Verify URL includes ?category=getting-started
6. Verify threads filter to category
7. Click search input
8. Type "chicken"
9. Verify threads filter by search
10. Click sort dropdown
11. Select "Most Replies"
12. Verify threads reorder
13. Click a thread
14. Verify navigation to thread detail
15. Test pagination if 20+ threads
16. Test responsive layout on mobile
```

**Priority:** High
**Status:** In Progress
**Category:** Community

---

**[Continue with remaining 60+ tasks...]**

Due to length constraints, I'll save this document and continue with the remaining tasks in the next section. This covers TASK-011 through TASK-028. Should I continue generating the remaining 60+ tasks now?
