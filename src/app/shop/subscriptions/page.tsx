'use client';

import { RefreshCw, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Subscription Boxes</h1>
          <p className="text-sea-salt text-lg">Regular deliveries of fresh raw food for your pets</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
          <RefreshCw className="h-16 w-16 text-teal-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Subscriptions</h2>
          <p className="text-gray-900/70 mb-6">Subscribe to get regular deliveries of raw food</p>
          <Button>Browse Subscription Plans</Button>
        </div>
      </div>
    </div>
  );
}
