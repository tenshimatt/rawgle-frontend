'use client';

import * as React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Cart item interface matching API response
export interface CartItem {
  productId: string;
  quantity: number;
  sizeOption: string;
  addedAt: string;
  productSnapshot: {
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    species: string;
    inStock: boolean;
  };
}

// Cart summary interface
export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  qualifiesForFreeShipping: boolean;
  amountToFreeShipping: number;
}

// Cart context state
interface CartContextValue {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  addToCart: (productId: string, quantity: number, sizeOption: string) => Promise<boolean>;
  removeFromCart: (productId: string, sizeOption: string) => Promise<boolean>;
  updateQuantity: (productId: string, sizeOption: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
  recentlyAdded: string | null;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    freeShippingThreshold: 50,
    qualifiesForFreeShipping: false,
    amountToFreeShipping: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  // Fetch cart on mount
  useEffect(() => {
    refreshCart();
  }, []);

  // Refresh cart data from API
  const refreshCart = useCallback(async () => {
    try {
      const response = await fetch('/v2/api/cart', {
        headers: {
          'x-user-id': 'demo-user',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const result = await response.json();

      if (result.success) {
        setItems(result.data.items);
        setSummary(result.data.summary);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    }
  }, []);

  // Add item to cart
  const addToCart = useCallback(async (
    productId: string,
    quantity: number,
    sizeOption: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('/v2/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          productId,
          quantity,
          sizeOption,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add to cart');
      }

      if (result.success) {
        setItems(result.data.items);
        setSummary(result.data.summary);

        // Set recently added indicator
        const itemKey = `${productId}-${sizeOption}`;
        setRecentlyAdded(itemKey);

        // Clear after 3 seconds
        setTimeout(() => {
          setRecentlyAdded(null);
        }, 3000);

        // Get product name for toast
        const addedItem = result.data.items.find(
          (item: CartItem) => item.productId === productId && item.sizeOption === sizeOption
        );

        toast.success(`Added ${addedItem?.productSnapshot.name || 'item'} to cart`, {
          description: `${quantity} x ${sizeOption}`,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback(async (
    productId: string,
    sizeOption: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/v2/api/cart?productId=${encodeURIComponent(productId)}&sizeOption=${encodeURIComponent(sizeOption)}`,
        {
          method: 'DELETE',
          headers: {
            'x-user-id': 'demo-user',
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to remove item');
      }

      if (result.success) {
        setItems(result.data.items);
        setSummary(result.data.summary);
        toast.success('Removed item from cart');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove item');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(async (
    productId: string,
    sizeOption: string,
    quantity: number
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('/v2/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          productId,
          sizeOption,
          quantity,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update quantity');
      }

      if (result.success) {
        setItems(result.data.items);
        setSummary(result.data.summary);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update quantity');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear entire cart
  const clearCart = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('/v2/api/cart', {
        method: 'DELETE',
        headers: {
          'x-user-id': 'demo-user',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to clear cart');
      }

      if (result.success) {
        setItems([]);
        setSummary({
          itemCount: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          freeShippingThreshold: 50,
          qualifiesForFreeShipping: false,
          amountToFreeShipping: 50,
        });
        toast.success('Cart cleared');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to clear cart');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: CartContextValue = {
    items,
    summary,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    recentlyAdded,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
