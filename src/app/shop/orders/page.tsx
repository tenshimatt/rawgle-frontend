'use client';

import { Package, Calendar, DollarSign } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package className="h-16 w-16 text-gray-900/20 mx-auto mb-4" />
          <p className="text-gray-900/60 text-lg">No orders yet</p>
        </div>
      </div>
    </div>
  );
}
