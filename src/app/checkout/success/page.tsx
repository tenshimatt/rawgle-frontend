'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, Truck, Mail } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Create order record
      fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          sessionId,
          items: JSON.parse(localStorage.getItem('lastOrder') || '[]'),
          total: parseFloat(localStorage.getItem('lastOrderTotal') || '0'),
          shippingAddress: {},
        }),
      })
        .then(res => res.json())
        .then(data => {
          setOrderData(data.data);
          setLoading(false);
          // Clear cart after successful order
          localStorage.removeItem('cart');
          localStorage.removeItem('lastOrder');
          localStorage.removeItem('lastOrderTotal');
        })
        .catch(err => {
          console.error('Error creating order:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-900/60">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient">
      <div className="container-page">
        <div className="max-w-3xl mx-auto py-12">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl text-gray-900/70">
              Thank you for your purchase. We've received your order and will begin processing it shortly.
            </p>
          </div>

          {/* Order Details */}
          {orderData && (
            <Card className="card-feature-primary p-8 mb-8">
              <div className="border-b border-gray-900/10 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Order Details
                </h2>
                <p className="text-gray-900/60">
                  Order ID: <span className="font-mono text-teal-600">{orderData.id}</span>
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-600/10 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Order Status
                    </h3>
                    <p className="text-gray-900/60">
                      {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Estimated Delivery
                    </h3>
                    <p className="text-gray-900/60">
                      5-7 business days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Order Confirmation
                    </h3>
                    <p className="text-gray-900/60">
                      A confirmation email has been sent to your email address
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="card-feature-secondary p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">What's Next?</h3>
            <ul className="space-y-3 text-gray-900/70">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <span>We'll send you tracking information once your order ships</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <span>You can track your order status in your dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <span>Questions? Contact our support team anytime</span>
              </li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" asChild>
              <Link href="/dashboard">
                View Order History
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
