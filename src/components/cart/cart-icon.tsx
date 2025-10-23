'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useCart } from './cart-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CartSidebar } from './cart-sidebar';

/**
 * Floating cart icon with item count badge
 * - Fixed position (bottom-right on desktop, top-right on mobile)
 * - Animated bounce effect when items are added
 * - Opens cart sidebar on click
 */
export function CartIcon() {
  const { summary, recentlyAdded } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [shouldBounce, setShouldBounce] = useState(false);

  // Trigger bounce animation when item is added
  useEffect(() => {
    if (recentlyAdded) {
      setShouldBounce(true);
      setTimeout(() => setShouldBounce(false), 600);
    }
  }, [recentlyAdded]);

  return (
    <>
      {/* Fixed cart button */}
      <div className="fixed z-50 md:bottom-8 md:right-8 top-4 right-4">
        <Button
          onClick={() => setIsOpen(true)}
          className={`
            relative bg-green-600 hover:bg-green-700 text-white
            shadow-lg hover:shadow-xl transition-all duration-300
            w-14 h-14 md:w-16 md:h-16 rounded-full
            ${shouldBounce ? 'animate-bounce' : ''}
          `}
          aria-label={`Shopping cart with ${summary.itemCount} items`}
        >
          {/* Cart icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 md:w-7 md:h-7"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>

          {/* Item count badge */}
          {summary.itemCount > 0 && (
            <Badge
              variant="destructive"
              className={`
                absolute -top-1 -right-1
                w-6 h-6 md:w-7 md:h-7
                flex items-center justify-center
                rounded-full p-0 text-xs md:text-sm font-bold
                bg-red-500 border-2 border-white
                ${shouldBounce ? 'animate-pulse' : ''}
              `}
            >
              {summary.itemCount > 99 ? '99+' : summary.itemCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart sidebar */}
      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
