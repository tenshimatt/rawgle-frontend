'use client';

import * as React from 'react';
import { GlobalSearch, useGlobalSearch } from './global-search';

/**
 * SearchProvider - Wraps the app and provides global search functionality
 *
 * Features:
 * - Cmd+K / Ctrl+K keyboard shortcut
 * - Search across all content types
 * - Accessible from anywhere in the app
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useGlobalSearch();

  return (
    <>
      {children}
      <GlobalSearch open={open} onOpenChange={setOpen} />
    </>
  );
}

/**
 * Hook to programmatically open the search modal
 *
 * Usage in any component:
 * const { openSearch } = useSearchContext();
 * <button onClick={openSearch}>Search</button>
 */
const SearchContext = React.createContext<{
  openSearch: () => void;
  closeSearch: () => void;
} | null>(null);

export function SearchProviderWithContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open, setOpen } = useGlobalSearch();

  const openSearch = React.useCallback(() => setOpen(true), [setOpen]);
  const closeSearch = React.useCallback(() => setOpen(false), [setOpen]);

  return (
    <SearchContext.Provider value={{ openSearch, closeSearch }}>
      {children}
      <GlobalSearch open={open} onOpenChange={setOpen} />
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within SearchProvider');
  }
  return context;
}
