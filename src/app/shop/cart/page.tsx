'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, summary, isLoading, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = async (productId: string, sizeOption: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(productId, sizeOption);
    } else {
      await updateQuantity(productId, sizeOption, newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-charcoal mb-8">Shopping Cart</h1>
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some supplements to get started</p>
            <Link href="/shop">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                Browse Supplements
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-charcoal mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.productId}-${item.sizeOption}`}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Item Image */}
                  {item.productSnapshot.imageUrl ? (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.productSnapshot.imageUrl}
                        alt={item.productSnapshot.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-10 w-10 text-teal-600" />
                    </div>
                  )}

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-charcoal mb-1">{item.productSnapshot.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{item.productSnapshot.category}</p>
                    <p className="text-sm text-gray-600">{item.sizeOption}</p>

                    <div className="flex items-center gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId, item.sizeOption, item.quantity - 1)}
                          className="px-3"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              handleQuantityChange(item.productId, item.sizeOption, value);
                            }
                          }}
                          className="w-16 text-center border-0 focus-visible:ring-0"
                          min="1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId, item.sizeOption, item.quantity + 1)}
                          className="px-3"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId, item.sizeOption)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-teal-600">
                      ${(item.productSnapshot.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      ${item.productSnapshot.price.toFixed(2)} each
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-charcoal mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'})</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{summary.qualifiesForFreeShipping ? 'FREE' : `$${summary.shipping.toFixed(2)}`}</span>
                </div>
                {summary.qualifiesForFreeShipping && (
                  <p className="text-sm text-teal-600">Free shipping on orders over ${summary.freeShippingThreshold}!</p>
                )}
                {!summary.qualifiesForFreeShipping && summary.amountToFreeShipping > 0 && (
                  <p className="text-sm text-gray-600">
                    Add ${summary.amountToFreeShipping.toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-charcoal">
                  <span>Total</span>
                  <span>${summary.total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/shop/checkout">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white mb-3">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/shop">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure checkout
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  30-day money-back guarantee
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free returns
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
