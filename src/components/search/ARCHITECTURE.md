# Search Feature Architecture

## Component Hierarchy

```
RootLayout (app/layout.tsx)
└── SearchProvider
    ├── MainNav
    │   └── SearchButton ────┐
    │                        │
    └── GlobalSearch ◄───────┘
        ├── CommandDialog
        │   ├── CommandInput
        │   └── CommandList
        │       ├── CommandGroup (Products)
        │       │   └── CommandItem × N
        │       ├── CommandGroup (Courses)
        │       │   └── CommandItem × N
        │       ├── CommandGroup (Breed Guides)
        │       │   └── CommandItem × N
        │       ├── CommandGroup (Supplements)
        │       │   └── CommandItem × N
        │       ├── CommandGroup (Learning Guides)
        │       │   └── CommandItem × N
        │       └── CommandGroup (Community Posts)
        │           └── CommandItem × N
        └── [Keyboard Listener]
```

## Data Flow

```
User Action (Cmd+K or Click)
    │
    ├──► useGlobalSearch hook
    │        └──► setOpen(true)
    │                └──► GlobalSearch opens
    │
    ├──► User types in CommandInput
    │        │
    │        ├──► React state: setQuery(value)
    │        │
    │        └──► useEffect (300ms debounce)
    │                 └──► fetch('/api/search?q=...')
    │                         │
    │                         └──► API Route Handler
    │                                  ├──► searchItems(query, mockProducts)
    │                                  ├──► searchItems(query, mockCourses)
    │                                  ├──► searchItems(query, mockBreeds)
    │                                  ├──► searchItems(query, mockSupplements)
    │                                  ├──► searchItems(query, mockPosts)
    │                                  └──► searchItems(query, mockGuides)
    │                                           │
    │                                           └──► Response JSON
    │                                                    │
    │                                                    └──► setResults(data.results)
    │                                                             │
    │                                                             └──► UI renders results
    │
    └──► User selects result
             └──► handleSelect(url)
                     ├──► onOpenChange(false)
                     ├──► setQuery('')
                     └──► router.push(url)
```

## State Management

### Local State (useState)
```typescript
// In GlobalSearch component
const [query, setQuery] = useState('')          // Search input value
const [results, setResults] = useState({...})   // API response
const [isLoading, setIsLoading] = useState(false)

// In useGlobalSearch hook
const [open, setOpen] = useState(false)         // Modal open/closed
```

### No Global State Needed
- Search is ephemeral (resets on close)
- No persistence required
- Keyboard listener in hook, not Redux

## API Contract

### Request
```
GET /api/search?q={query}

Parameters:
- q: string (min length: 2)
```

### Response
```json
{
  "results": {
    "products": [
      {
        "id": "prod-1",
        "title": "Premium Raw Chicken Mix",
        "category": "Raw Meat",
        "url": "/shop/prod-1",
        "description": "High-quality chicken mix..."
      }
    ],
    "courses": [...],
    "breeds": [...],
    "supplements": [...],
    "posts": [...],
    "guides": [...]
  }
}
```

## Keyboard Event Flow

```
User presses key
    │
    └──► window.addEventListener('keydown')
             │
             └──► Check: e.key === 'k' && (e.metaKey || e.ctrlKey)
                     │
                     ├──► Yes: e.preventDefault()
                     │         setOpen(!open)
                     │
                     └──► No: event continues
```

## Component Communication

```
SearchProvider
    │
    ├──► useGlobalSearch() hook
    │        └──► Provides: { open, setOpen }
    │                └──► Used by: MainNav, mobile menu
    │
    └──► GlobalSearch component
             └──► Props: { open, onOpenChange }
                     └──► Parent controls open state
```

## Styling Architecture

### Tailwind Classes
```
Component Level:
├── GlobalSearch: No direct styles (uses Command)
├── CommandDialog: Provided by shadcn/ui
├── CommandInput: border, padding, focus states
├── CommandList: max-height, overflow
├── CommandGroup: spacing, heading styles
├── CommandItem: hover, selected, flex layout
└── SearchButton: button variants, kbd element

Theme Colors:
├── Selected: bg-teal-50, text-teal-600
├── Icons: text-teal-600
├── Hover: hover:bg-teal-50
├── Primary: orange-500 (buttons)
└── Neutral: gray-* palette
```

### Responsive Breakpoints
```
Mobile (< 1024px):
├── SearchButton in mobile menu
├── Full-width modal
└── Touch-optimized spacing

Desktop (≥ 1024px):
├── SearchButton in top nav
├── Fixed-width modal (600px)
├── Keyboard shortcut visible
└── Hover states
```

## Performance Optimizations

### Debouncing
```javascript
// 300ms debounce prevents excessive API calls
useEffect(() => {
  const timer = setTimeout(() => {
    // API call
  }, 300);

  return () => clearTimeout(timer);
}, [query]);
```

### Conditional Rendering
```javascript
// Only render results when they exist
{results.products.length > 0 && (
  <CommandGroup>...</CommandGroup>
)}
```

### Lazy Imports (Future)
```javascript
// Not currently implemented, but could be:
const GlobalSearch = lazy(() => import('./global-search'));
```

## Event Handlers

### Opening Search
```typescript
// Method 1: Keyboard shortcut
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen(true);
    }
  };
  document.addEventListener('keydown', down);
  return () => document.removeEventListener('keydown', down);
}, []);

// Method 2: Button click
<SearchButton onClick={() => setOpen(true)} />
```

### Selecting Result
```typescript
const handleSelect = (url: string) => {
  onOpenChange(false);  // Close modal
  setQuery('');         // Reset search
  router.push(url);     // Navigate
};
```

### Closing Search
```typescript
// Method 1: Escape key (handled by CommandDialog)
// Method 2: Click outside (handled by CommandDialog)
// Method 3: Select result (handled by handleSelect)
```

## Accessibility Tree

```
dialog [role="dialog"]
├── div [cmdk-input-wrapper]
│   ├── svg [Search icon]
│   └── input [type="text", placeholder="Search..."]
│
└── div [cmdk-list, role="listbox"]
    ├── div [role="group"]
    │   ├── div [cmdk-group-heading] "Products"
    │   └── div [role="option", aria-selected="false"]
    │       ├── svg [icon]
    │       ├── span "Product Title"
    │       └── span "Category"
    │
    ├── separator [role="separator"]
    │
    └── ... [more groups]
```

## Error Handling

### Network Errors
```typescript
try {
  const response = await fetch('/api/search?q=...');
  if (response.ok) {
    const data = await response.json();
    setResults(data.results);
  }
} catch (error) {
  console.error('Search error:', error);
  // Silent fail - user can retry
} finally {
  setIsLoading(false);
}
```

### Empty States
```typescript
// No query entered
{!query && <EmptyState />}

// No results found
{query && totalResults === 0 && <NoResults />}

// Loading
{isLoading && <LoadingState />}
```

## Future Scalability

### Potential Improvements
1. **React Query integration** - caching, deduplication
2. **Virtual scrolling** - for large result sets
3. **Search history** - localStorage persistence
4. **Analytics events** - track searches
5. **A/B testing** - result ranking experiments

### Database Integration Points
```typescript
// Replace in /app/api/search/route.ts
const products = await db.product.findMany({
  where: {
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ],
  },
  take: 5,
});
```

### Search Service Integration
```typescript
// Example: Algolia
import algoliasearch from 'algoliasearch';

const client = algoliasearch('APP_ID', 'API_KEY');
const index = client.initIndex('products');

const results = await index.search(query, {
  hitsPerPage: 5,
  attributesToRetrieve: ['title', 'description', 'category'],
});
```

## Testing Strategy

### Unit Tests
- useGlobalSearch hook behavior
- searchItems filtering logic
- API route response format

### Integration Tests
- Keyboard shortcuts trigger modal
- Search input triggers API call
- Results render correctly
- Navigation works

### E2E Tests (Playwright)
- Complete user flow
- Mobile/desktop variants
- Keyboard navigation
- Accessibility checks
