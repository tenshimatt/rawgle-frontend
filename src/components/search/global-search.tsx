'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  ShoppingBag,
  GraduationCap,
  Dog,
  Pill,
  MessageCircle,
  FileText,
  Package,
  BookOpen,
} from 'lucide-react';

// Types for search results
interface SearchResult {
  id: string;
  title: string;
  category: string;
  url: string;
  description?: string;
}

interface SearchResults {
  products: SearchResult[];
  courses: SearchResult[];
  breeds: SearchResult[];
  supplements: SearchResult[];
  posts: SearchResult[];
  guides: SearchResult[];
}

// Icon mapping for categories
const categoryIcons = {
  products: ShoppingBag,
  courses: GraduationCap,
  breeds: Dog,
  supplements: Pill,
  posts: MessageCircle,
  guides: BookOpen,
};

// Category labels
const categoryLabels = {
  products: 'Products',
  courses: 'Courses',
  breeds: 'Breed Guides',
  supplements: 'Supplements',
  posts: 'Community Posts',
  guides: 'Learning Guides',
};

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResults>({
    products: [],
    courses: [],
    breeds: [],
    supplements: [],
    posts: [],
    guides: [],
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // Debounced search
  React.useEffect(() => {
    if (!query || query.length < 2) {
      setResults({
        products: [],
        courses: [],
        breeds: [],
        supplements: [],
        posts: [],
        guides: [],
      });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.results);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle result selection
  const handleSelect = (url: string) => {
    onOpenChange(false);
    setQuery('');
    router.push(url);
  };

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  // Count total results
  const totalResults = Object.values(results).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search products, courses, guides, community..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading && query.length >= 2 && (
          <div className="py-6 text-center text-sm text-gray-600">
            Searching...
          </div>
        )}

        {!isLoading && query.length >= 2 && totalResults === 0 && (
          <CommandEmpty>
            No results found for &ldquo;{query}&rdquo;
          </CommandEmpty>
        )}

        {!isLoading && totalResults > 0 && (
          <>
            {/* Products */}
            {results.products.length > 0 && (
              <>
                <CommandGroup heading={categoryLabels.products}>
                  {results.products.map((item) => {
                    const Icon = categoryIcons.products;
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        onSelect={() => handleSelect(item.url)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Icon className="h-4 w-4 text-teal-600" />
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-gray-900">{item.title}</span>
                          {item.description && (
                            <span className="text-xs text-gray-600 line-clamp-1">
                              {item.description}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.category}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Courses */}
            {results.courses.length > 0 && (
              <>
                <CommandGroup heading={categoryLabels.courses}>
                  {results.courses.map((item) => {
                    const Icon = categoryIcons.courses;
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        onSelect={() => handleSelect(item.url)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Icon className="h-4 w-4 text-teal-600" />
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-gray-900">{item.title}</span>
                          {item.description && (
                            <span className="text-xs text-gray-600 line-clamp-1">
                              {item.description}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.category}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Breed Guides */}
            {results.breeds.length > 0 && (
              <>
                <CommandGroup heading={categoryLabels.breeds}>
                  {results.breeds.map((item) => {
                    const Icon = categoryIcons.breeds;
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        onSelect={() => handleSelect(item.url)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Icon className="h-4 w-4 text-teal-600" />
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-gray-900">{item.title}</span>
                          {item.description && (
                            <span className="text-xs text-gray-600 line-clamp-1">
                              {item.description}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.category}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Supplements */}
            {results.supplements.length > 0 && (
              <>
                <CommandGroup heading={categoryLabels.supplements}>
                  {results.supplements.map((item) => {
                    const Icon = categoryIcons.supplements;
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        onSelect={() => handleSelect(item.url)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Icon className="h-4 w-4 text-teal-600" />
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-gray-900">{item.title}</span>
                          {item.description && (
                            <span className="text-xs text-gray-600 line-clamp-1">
                              {item.description}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.category}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Learning Guides */}
            {results.guides.length > 0 && (
              <>
                <CommandGroup heading={categoryLabels.guides}>
                  {results.guides.map((item) => {
                    const Icon = categoryIcons.guides;
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        onSelect={() => handleSelect(item.url)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Icon className="h-4 w-4 text-teal-600" />
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-gray-900">{item.title}</span>
                          {item.description && (
                            <span className="text-xs text-gray-600 line-clamp-1">
                              {item.description}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.category}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Community Posts */}
            {results.posts.length > 0 && (
              <CommandGroup heading={categoryLabels.posts}>
                {results.posts.map((item) => {
                  const Icon = categoryIcons.posts;
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.title}
                      onSelect={() => handleSelect(item.url)}
                      className="flex items-center gap-3"
                    >
                      <Icon className="h-4 w-4 text-teal-600" />
                      <div className="flex flex-col flex-1">
                        <span className="font-medium">{item.title}</span>
                        {item.description && (
                          <span className="text-xs text-gray-600 line-clamp-1">
                            {item.description}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {item.category}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </>
        )}

        {/* Empty state when no query */}
        {!query && (
          <div className="py-6 text-center text-sm text-gray-700">
            <div className="mb-2">
              <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            </div>
            <p className="font-medium">Quick Search</p>
            <p className="mt-1 text-xs">
              Find products, courses, guides, and more...
            </p>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}

/**
 * Hook to control global search modal state and keyboard shortcuts
 *
 * Usage:
 * const { open, setOpen } = useGlobalSearch();
 * <GlobalSearch open={open} onOpenChange={setOpen} />
 */
export function useGlobalSearch() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+K on Mac, Ctrl+K on Windows/Linux
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return { open, setOpen };
}
