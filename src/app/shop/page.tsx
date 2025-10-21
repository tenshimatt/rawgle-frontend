'use client';

import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';

export default function ShopPage() {
  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="hero-title">Shop & Marketplace</h1>
            <p className="hero-description">Browse products, supplements, and feeding essentials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <Card key={product.id} className="card-feature-secondary">
                <CardHeader>
                  <div className="h-48 bg-charcoal/5 rounded-lg mb-4 flex items-center justify-center">
                    <ShoppingCart className="h-16 w-16 icon-dark" />
                  </div>
                  <CardTitle className="text-lg text-charcoal">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted text-sm mb-3">{product.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-sandy-brown text-sandy-brown'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-persian-green">${product.price.toFixed(2)}</span>
                    <Button variant="accent">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
