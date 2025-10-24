'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Construction } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/shop/cart">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
        </Link>

        <Card>
          <CardContent className="p-12 text-center">
            <Construction className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-charcoal mb-4">Checkout Coming Soon</h1>
            <p className="text-gray-600 mb-8">
              We're working on integrating Stripe payment processing for a secure and seamless checkout experience.
            </p>
            <div className="space-y-3 text-left bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-charcoal mb-2">Coming Soon:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Secure payment processing with Stripe
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Multiple payment methods (Card, Apple Pay, Google Pay)
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Shipping address management
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Order tracking and history
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Subscription options for regular deliveries
                </li>
              </ul>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/shop/cart">
                <Button variant="outline">Back to Cart</Button>
              </Link>
              <Link href="/shop">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
