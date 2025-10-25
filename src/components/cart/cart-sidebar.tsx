'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './cart-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Slide-in cart sidebar
 * - Shows cart items with thumbnails
 * - Quantity controls
 * - Order summary
 * - Actions: View Cart, Checkout
 */
export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const { items, summary, removeFromCart, updateQuantity, isLoading, recentlyAdded } = useCart();

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleViewCart = () => {
    onClose();
    router.push('/cart');
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  const handleIncrement = async (productId: string, sizeOption: string, currentQty: number) => {
    await updateQuantity(productId, sizeOption, currentQty + 1);
  };

  const handleDecrement = async (productId: string, sizeOption: string, currentQty: number) => {
    if (currentQty > 1) {
      await updateQuantity(productId, sizeOption, currentQty - 1);
    }
  };

  const handleRemove = async (productId: string, sizeOption: string) => {
    await removeFromCart(productId, sizeOption);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-50
          shadow-2xl transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-labelledby="cart-sidebar-title"
        aria-modal="true"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-sea-salt">
            <div>
              <h2 id="cart-sidebar-title" className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h2>
              <p className="text-sm text-gray-600">
                {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close cart"
              className="hover:bg-gray-900/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {items.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-700 mb-6">
                  Add some products to get started!
                </p>
                <Button
                  onClick={() => {
                    onClose();
                    router.push('/shop');
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Shop Now
                </Button>
              </div>
            ) : (
              // Cart items list
              items.map((item) => {
                const itemKey = `${item.productId}-${item.sizeOption}`;
                const isRecent = recentlyAdded === itemKey;

                return (
                  <div
                    key={itemKey}
                    className={`
                      bg-white border rounded-lg p-4 transition-all duration-300
                      ${isRecent ? 'border-teal-600 bg-teal-600/5 shadow-sm' : 'border-gray-200'}
                    `}
                  >
                    <div className="flex gap-4">
                      {/* Product image placeholder */}
                      <div className="w-20 h-20 bg-sea-salt rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">
                          {item.productSnapshot.category === 'joint-mobility' && '🦴'}
                          {item.productSnapshot.category === 'digestive-health' && '🌿'}
                          {item.productSnapshot.category === 'skin-coat' && '✨'}
                          {item.productSnapshot.category === 'immune-support' && '🛡️'}
                          {item.productSnapshot.category === 'calming-anxiety' && '😌'}
                          {item.productSnapshot.category === 'multivitamin' && '💊'}
                          {item.productSnapshot.category === 'specialty' && '⭐'}
                        </span>
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {item.productSnapshot.name}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {item.sizeOption}
                        </p>

                        {/* Recently added badge */}
                        {isRecent && (
                          <Badge variant="default" className="mb-2 bg-teal-600 text-white text-xs">
                            Just added!
                          </Badge>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleDecrement(item.productId, item.sizeOption, item.quantity)}
                              disabled={isLoading || item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              -
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleIncrement(item.productId, item.sizeOption, item.quantity)}
                              disabled={isLoading}
                              aria-label="Increase quantity"
                            >
                              +
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm font-bold text-teal-600">
                              ${(item.productSnapshot.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10"
                        onClick={() => handleRemove(item.productId, item.sizeOption)}
                        disabled={isLoading}
                        aria-label={`Remove ${item.productSnapshot.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer - Order Summary & Actions */}
          {items.length > 0 && (
            <div className="border-t bg-sea-salt p-4 space-y-4">
              {/* Free shipping indicator */}
              {!summary.qualifiesForFreeShipping && summary.amountToFreeShipping > 0 && (
                <div className="bg-maize/20 border border-maize rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">
                    Add ${summary.amountToFreeShipping.toFixed(2)} more for free shipping!
                  </p>
                  <div className="mt-2 w-full bg-white rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-maize h-full transition-all duration-300"
                      style={{
                        width: `${(summary.subtotal / summary.freeShippingThreshold) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {summary.qualifiesForFreeShipping && (
                <div className="bg-teal-700/20 border border-teal-700 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-teal-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    You qualify for free shipping!
                  </p>
                </div>
              )}

              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>
                    {summary.shipping === 0 ? (
                      <span className="text-teal-700 font-semibold">FREE</span>
                    ) : (
                      `$${summary.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="text-teal-600">${summary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  onClick={handleViewCart}
                  variant="outline"
                  className="w-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                  size="lg"
                >
                  View Full Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
