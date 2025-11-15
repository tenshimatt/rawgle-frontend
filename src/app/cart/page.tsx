'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

/**
 * Full cart page
 * - Complete cart items table
 * - Quantity controls
 * - Order summary card
 * - Empty state
 */
export default function CartPage() {
  const router = useRouter();
  const { items, summary, removeFromCart, updateQuantity, clearCart, isLoading } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

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

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);

      // Store order data for success page
      localStorage.setItem('lastOrder', JSON.stringify(items));
      localStorage.setItem('lastOrderTotal', summary.total.toString());

      // Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.error) {
        alert(`Checkout error: ${data.error}`);
        setCheckingOut(false);
        return;
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate checkout. Please try again.');
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-sea-salt">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <p className="text-gray-700">
                {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={isLoading}
                className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                Clear Cart
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          // Empty cart state
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-700 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button
                onClick={() => router.push('/shop')}
                className="bg-teal-600 hover:bg-teal-700 text-white"
                size="lg"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free shipping progress */}
              {!summary.qualifiesForFreeShipping && summary.amountToFreeShipping > 0 && (
                <Card className="border-maize bg-maize/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-900">
                        You're ${summary.amountToFreeShipping.toFixed(2)} away from free shipping!
                      </p>
                      <Badge className="bg-maize text-gray-900">
                        ${summary.freeShippingThreshold} minimum
                      </Badge>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-maize h-full transition-all duration-300"
                        style={{
                          width: `${Math.min((summary.subtotal / summary.freeShippingThreshold) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {summary.qualifiesForFreeShipping && (
                <Card className="border-teal-700 bg-teal-700/10">
                  <CardContent className="pt-6">
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6 text-teal-700"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Congratulations! You qualify for free shipping!
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Cart items list */}
              {items.map((item) => (
                <Card key={`${item.productId}-${item.sizeOption}`}>
                  <CardContent className="pt-6">
                    <div className="flex gap-6">
                      {/* Product image */}
                      <div className="w-24 h-24 bg-sea-salt rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl">
                          {item.productSnapshot.category === 'joint-mobility' && '🦴'}
                          {item.productSnapshot.category === 'digestive-health' && '🌿'}
                          {item.productSnapshot.category === 'skin-coat' && '✨'}
                          {item.productSnapshot.category === 'immune-support' && '🛡️'}
                          {item.productSnapshot.category === 'calming-anxiety' && '😌'}
                          {item.productSnapshot.category === 'multivitamin' && '💊'}
                          {item.productSnapshot.category === 'specialty' && '⭐'}
                        </span>
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">
                              {item.productSnapshot.name}
                            </h3>
                            <p className="text-sm text-gray-700">
                              Size: {item.sizeOption}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {item.productSnapshot.category.split('-').map(word =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.productSnapshot.species === 'both' ? 'Dogs & Cats' :
                                 item.productSnapshot.species === 'dog' ? 'Dogs' : 'Cats'}
                              </Badge>
                            </div>
                          </div>

                          {/* Remove button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-orange-500 hover:bg-orange-500/10"
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

                        {/* Quantity and price row */}
                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">Quantity:</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDecrement(item.productId, item.sizeOption, item.quantity)}
                                disabled={isLoading || item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                -
                              </Button>
                              <span className="text-base font-semibold w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleIncrement(item.productId, item.sizeOption, item.quantity)}
                                disabled={isLoading}
                                aria-label="Increase quantity"
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm text-gray-700">
                              ${item.productSnapshot.price.toFixed(2)} each
                            </p>
                            <p className="text-xl font-bold text-teal-600">
                              ${(item.productSnapshot.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Continue shopping button */}
              <Button
                variant="outline"
                onClick={() => router.push('/shop')}
                className="w-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
              >
                Continue Shopping
              </Button>
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Order summary card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Summary details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="font-semibold">${summary.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Tax (8.5%)</span>
                        <span className="font-semibold">${summary.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Shipping</span>
                        <span className="font-semibold">
                          {summary.shipping === 0 ? (
                            <span className="text-teal-700">FREE</span>
                          ) : (
                            `$${summary.shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-lg font-bold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-teal-600">${summary.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout button */}
                    <Button
                      onClick={handleCheckout}
                      disabled={checkingOut || isLoading}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                      size="lg"
                    >
                      {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Trust badges */}
                <Card className="bg-sea-salt border-none">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 text-teal-700 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75m-2.25 0a8.25 8.25 0 11-16.5 0 8.25 8.25 0 0116.5 0z"
                          />
                        </svg>
                        <span className="text-gray-700">Secure checkout</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 text-teal-700 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                          />
                        </svg>
                        <span className="text-gray-700">Fast & free shipping over $50</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 text-teal-700 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>
                        <span className="text-gray-700">30-day return policy</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
