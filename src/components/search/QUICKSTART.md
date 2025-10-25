# Global Search - Quick Start Guide

## Try It Now!

1. **Start the dev server:**
   ```bash
   cd /Users/mattwright/pandora/rawgle-frontend
   npm run dev
   ```

2. **Open your browser:**
   ```
   http://localhost:3005
   ```

3. **Open the search:**
   - Press **Cmd+K** (Mac) or **Ctrl+K** (Windows)
   - Or click the "Search" button in the navbar

4. **Try these searches:**
   - `chicken` - See product results
   - `feeding` - See course results
   - `shepherd` - See breed guide results
   - `omega` - See supplement results
   - `guide` - See learning guides
   - `raw` - See results across all categories

## Integration Checklist

### Already Done ✅
- [x] Command component installed (`/src/components/ui/command.tsx`)
- [x] GlobalSearch component created
- [x] SearchProvider wrapper added to layout
- [x] Search button added to navbar
- [x] Mobile search support added
- [x] API endpoint created with mock data
- [x] Keyboard shortcuts working (Cmd+K / Ctrl+K)

### To Customize

#### 1. Change Search Categories
Edit `/src/components/search/global-search.tsx`:

```typescript
// Add/remove categories
const categoryLabels = {
  products: 'Products',
  courses: 'Courses',
  breeds: 'Breed Guides',
  supplements: 'Supplements',
  posts: 'Community Posts',
  guides: 'Learning Guides',
  // Add your own:
  recipes: 'Recipes',
  videos: 'Videos',
};
```

#### 2. Add Real Database Integration
Edit `/src/app/api/search/route.ts`:

```typescript
// Replace mock data with real queries
const products = await db.product.findMany({
  where: {
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ],
  },
  take: 5,
  select: {
    id: true,
    title: true,
    category: true,
    description: true,
  },
});

// Format for frontend
const results = {
  products: products.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    url: `/shop/${p.id}`,
    description: p.description,
  })),
  // ... other categories
};
```

#### 3. Customize Styling
Edit colors in `/src/components/search/global-search.tsx`:

```typescript
// Change highlight color from teal to blue
<CommandItem
  className="... aria-selected:bg-blue-50 aria-selected:text-blue-600"
>
  <Icon className="h-4 w-4 text-blue-600" />
  ...
</CommandItem>
```

#### 4. Add Analytics Tracking

```typescript
// In handleSelect function
const handleSelect = (url: string) => {
  // Track search click
  analytics.track('search_result_clicked', {
    query,
    url,
    category: item.category,
  });

  onOpenChange(false);
  setQuery('');
  router.push(url);
};
```

## Common Use Cases

### Use Case 1: Open Search Programmatically
```typescript
import { useGlobalSearch } from '@/components/search';

function MyComponent() {
  const { setOpen } = useGlobalSearch();

  return (
    <button onClick={() => setOpen(true)}>
      Search our products
    </button>
  );
}
```

### Use Case 2: Custom Search Trigger
```typescript
import { SearchButton } from '@/components/search';

// Floating action button
<SearchButton
  onClick={openSearch}
  className="fixed bottom-4 right-4 shadow-lg"
  size="lg"
/>

// Inline fake input
<SearchInput onClick={openSearch} />
```

### Use Case 3: Search with Pre-filled Query
```typescript
// Current implementation doesn't support this,
// but you could add it:

function SearchWithQuery({ initialQuery }: { initialQuery?: string }) {
  const { open, setOpen } = useGlobalSearch();

  useEffect(() => {
    if (initialQuery) {
      setOpen(true);
      // Set query in GlobalSearch via context or prop
    }
  }, [initialQuery]);
}
```

## Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Toggle search modal |
| `Esc` | Close search |
| `↑` | Move selection up |
| `↓` | Move selection down |
| `Enter` | Navigate to selected result |
| `Tab` | Focus next element |

## API Response Format

Your API should return this structure:

```typescript
interface SearchResponse {
  results: {
    products: SearchResult[];
    courses: SearchResult[];
    breeds: SearchResult[];
    supplements: SearchResult[];
    posts: SearchResult[];
    guides: SearchResult[];
  }
}

interface SearchResult {
  id: string;
  title: string;
  category: string;
  url: string;
  description?: string;
}
```

## Troubleshooting

### Search modal doesn't open with Cmd+K
**Solution:** Check that SearchProvider wraps your entire app in layout.tsx

```tsx
// Correct ✅
<SearchProvider>
  <MainNav />
  {children}
</SearchProvider>

// Incorrect ❌
<MainNav />
<SearchProvider>
  {children}
</SearchProvider>
```

### No search results showing
**Check:**
1. API is responding: `curl http://localhost:3005/api/search?q=test`
2. Browser console for errors
3. Network tab in DevTools
4. Query length is >= 2 characters

### TypeScript errors
**Solution:** Make sure all types are properly defined:

```typescript
// Add to your types if needed
interface SearchResult {
  id: string;
  title: string;
  category: string;
  url: string;
  description?: string;
}
```

### Search button not showing
**Check:**
1. MainNav is using `useGlobalSearch` hook
2. SearchButton import is correct
3. No CSS hiding the button

## Performance Tips

### 1. Add Result Limits
```typescript
// In API route
.slice(0, 5)  // Max 5 results per category
```

### 2. Add Caching
```typescript
// Use Redis or similar
const cached = await redis.get(`search:${query}`);
if (cached) return JSON.parse(cached);

// ... perform search ...

await redis.set(`search:${query}`, JSON.stringify(results), 'EX', 300);
```

### 3. Optimize Database Queries
```sql
-- Add indexes on searchable columns
CREATE INDEX idx_product_title ON products(title);
CREATE INDEX idx_product_description ON products(description);

-- Use full-text search (PostgreSQL)
CREATE INDEX idx_product_search ON products
  USING GIN(to_tsvector('english', title || ' ' || description));
```

### 4. Debounce is Already Implemented
The search has a 300ms debounce, so typing quickly won't spam the API.

## Accessibility Checklist

- [x] Keyboard navigation works
- [x] Screen reader announces results
- [x] Focus management is correct
- [x] Color contrast meets WCAG AA
- [x] Keyboard shortcuts don't conflict
- [x] Escape key closes modal
- [x] Tab order is logical

## Next Steps

1. **Test in production:** Deploy and test with real users
2. **Add analytics:** Track what users search for
3. **Optimize performance:** Add caching, database indexes
4. **Enhance results:** Add thumbnails, prices, ratings
5. **Add filters:** Allow filtering by category, date, price
6. **Implement history:** Show recent searches
7. **Add suggestions:** Auto-complete or suggested searches

## Support

- **Documentation:** `/src/components/search/README.md`
- **Architecture:** `/src/components/search/ARCHITECTURE.md`
- **Implementation:** `/SEARCH_FEATURE.md`

## Example Searches (with mock data)

Try these to see different result types:
- `chicken` → Products
- `feeding` → Courses
- `shepherd` → Breed Guides
- `omega` → Supplements
- `journey` → Community Posts
- `barf` → Learning Guides
- `raw` → Multiple categories

Happy searching! 🔍
