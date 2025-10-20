"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  image?: string;
  aiReason?: string;
}

interface ProductRecommendationsProps {
  petId: string;
  petData?: any;
}

export function ProductRecommendations({ petId, petData }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [petId]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/recommendations?petId=${petId}`, {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setRecommendations(data.data || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    // Cart functionality to be implemented
    console.log('Added to cart:', product);
  };

  if (loading) {
    return <p className="text-muted">Loading recommendations...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 icon-primary" />
        <h3 className="text-lg font-semibold text-charcoal">AI-Powered Recommendations</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((product) => (
          <Card key={product.id} className="card-feature-secondary">
            <CardHeader>
              <div className="w-full h-40 bg-sandy-brown/10 rounded-lg mb-2 flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <ShoppingCart className="h-16 w-16 text-sandy-brown" />
                )}
              </div>
              <CardTitle className="text-base text-charcoal">{product.name}</CardTitle>
              <p className="text-sm text-muted">{product.category}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < product.rating ? 'text-maize fill-maize' : 'text-charcoal/20'}`}
                  />
                ))}
                <span className="text-sm text-muted ml-1">({product.rating})</span>
              </div>
              <p className="text-2xl font-bold text-persian-green mb-2">${product.price}</p>
              {product.aiReason && (
                <div className="mb-3 p-2 bg-persian-green/10 rounded text-sm text-charcoal">
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  {product.aiReason}
                </div>
              )}
              <Button className="btn-secondary w-full" onClick={() => addToCart(product)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && (
        <p className="text-center text-muted py-8">No recommendations available yet</p>
      )}
    </div>
  );
}
