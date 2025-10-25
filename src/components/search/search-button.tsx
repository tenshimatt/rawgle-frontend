'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchButtonProps {
  onClick: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

/**
 * SearchButton - Trigger button for global search
 *
 * Features:
 * - Shows keyboard shortcut hint (Cmd+K)
 * - Multiple variants and sizes
 * - Optional label
 * - Click to open search modal
 *
 * Usage:
 * <SearchButton onClick={openSearch} />
 * <SearchButton onClick={openSearch} showLabel />
 */
export function SearchButton({
  onClick,
  variant = 'ghost',
  size = 'sm',
  showLabel = false,
  className = '',
}: SearchButtonProps) {
  // Detect OS for keyboard shortcut display
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'));
  }, []);

  const shortcut = isMac ? '⌘K' : 'Ctrl+K';

  if (!showLabel) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        className={className}
        aria-label="Search"
        title={`Search (${shortcut})`}
      >
        <Search className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`gap-2 ${className}`}
      aria-label="Search"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600">
        {shortcut}
      </kbd>
    </Button>
  );
}

/**
 * SearchInput - Inline search trigger styled as input
 *
 * Shows a fake input that opens the search modal when clicked
 * Better UX than actual input for global search
 */
export function SearchInput({ onClick }: { onClick: () => void }) {
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'));
  }, []);

  const shortcut = isMac ? '⌘K' : 'Ctrl+K';

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full sm:w-64 px-3 py-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md hover:border-teal-300 hover:bg-white transition-colors"
      aria-label="Search"
    >
      <Search className="h-4 w-4 text-gray-400" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-600">
        {shortcut}
      </kbd>
    </button>
  );
}
