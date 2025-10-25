'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import {
  getProductById,
  type SupplementProduct,
} from '@/data/products/shop-products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const product = getProductById(productId);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-sea-salt flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-charcoal mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push('/shop')}
            className="bg-persian-green hover:bg-moss-green"
          >
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const currentPrice = product.price + (product.sizeOptions[selectedSize].priceModifier || 0);
  const comparePrice = product.compareAtPrice
    ? product.compareAtPrice + (product.sizeOptions[selectedSize].priceModifier || 0)
    : null;

  const discountPercentage = comparePrice
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user', // TODO: Replace with actual user ID from auth
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          sizeOption: product.sizeOptions[selectedSize].size,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const data = await response.json();
      alert(`Added ${quantity} x ${product.name} (${product.sizeOptions[selectedSize].size}) to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) setQuantity(quantity + 1);
  };

  return (
    <div className="min-h-screen bg-sea-salt">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link href="/shop" className="text-persian-green hover:text-moss-green">
              Shop
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">
              {product.category.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-charcoal font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-white rounded-lg border overflow-hidden sticky top-4">
              {product.featured && (
                <Badge variant="featured" className="absolute top-4 left-4 z-10">
                  Featured
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="warning" className="absolute top-4 right-4 z-10">
                  {discountPercentage}% OFF
                </Badge>
              )}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sea-salt to-sandy-brown/20">
                <span className="text-9xl text-charcoal/20">
                  {product.category === 'joint-mobility' && '🦴'}
                  {product.category === 'digestive-health' && '🌿'}
                  {product.category === 'skin-coat' && '✨'}
                  {product.category === 'immune-support' && '🛡️'}
                  {product.category === 'calming-anxiety' && '😌'}
                  {product.category === 'multivitamin' && '💊'}
                  {product.category === 'specialty' && '⭐'}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category and Species Badges */}
            <div className="flex gap-2 mb-4">
              <Badge variant="secondary">
                {product.category.split('-').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Badge>
              <Badge variant="outline">
                {product.species === 'both' ? 'Dogs & Cats' :
                 product.species === 'dog' ? 'Dogs' : 'Cats'}
              </Badge>
              {!product.inStock && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-charcoal mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.reviews.rating)
                        ? 'text-maize fill-current'
                        : 'text-gray-300 fill-current'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.reviews.rating} out of 5 ({product.reviews.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-persian-green">
                  ${currentPrice.toFixed(2)}
                </span>
                {comparePrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${comparePrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.stockQuantity > 0 && product.stockQuantity < 20 && (
                <p className="text-sm text-coral mt-2">
                  Only {product.stockQuantity} left in stock!
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <label htmlFor="size" className="block text-sm font-medium text-charcoal mb-2">
                Size
              </label>
              <Select
                id="size"
                value={selectedSize.toString()}
                onChange={(e) => setSelectedSize(parseInt(e.target.value))}
                className="w-full"
                aria-label="Select product size"
              >
                {product.sizeOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option.size} - {option.servings} servings
                    {option.priceModifier && ` (+$${option.priceModifier.toFixed(2)})`}
                  </option>
                ))}
              </Select>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </Button>
                <span className="text-xl font-semibold w-12 text-center" aria-live="polite">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stockQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-persian-green hover:bg-moss-green text-white text-lg py-6 mb-4"
              size="lg"
            >
              {product.inStock ? `Add to Cart - $${(currentPrice * quantity).toFixed(2)}` : 'Out of Stock'}
            </Button>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Key Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2" role="list">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-moss-green flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Active Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2" role="list">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-persian-green flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Dosage Instructions */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Dosage Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-sea-salt rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{product.dosageInstructions}</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Note:</strong> Always consult with your veterinarian before starting any new supplement regimen.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
