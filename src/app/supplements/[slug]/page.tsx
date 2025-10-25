'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingCart,
  Star,
  ArrowLeft,
  Package,
  Heart,
  Shield,
  Info,
  MessageSquare
} from 'lucide-react';
import { getSupplementBySlug, supplementCategories } from '@/data/supplements';
import { useCart } from '@/components/cart/cart-provider';
import { FavoriteButton } from '@/components/favorites/favorite-button';

export default function SupplementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const supplement = getSupplementBySlug(slug);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  if (!supplement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Supplement Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The supplement you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push('/supplements')}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Supplements
          </Button>
        </div>
      </div>
    );
  }

  const category = supplementCategories.find(c => c.id === supplement.category);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(supplement.id, quantity, supplement.size);
    setIsAdding(false);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link href="/supplements" className="text-teal-600 hover:text-teal-700 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Supplements
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{category?.name}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{supplement.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image/Icon */}
          <div className="relative">
            <div className="aspect-square bg-white rounded-lg border overflow-hidden sticky top-4">
              {supplement.featured && (
                <Badge className="absolute top-4 left-4 z-10 bg-yellow-100 text-yellow-800">
                  Featured
                </Badge>
              )}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-teal-50">
                <span className="text-9xl">
                  {category?.icon}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category and Species Badges */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                {category?.icon} {category?.name}
              </Badge>
              <Badge variant="outline">
                {supplement.forSpecies.includes('both') ? 'Dogs & Cats' :
                 supplement.forSpecies.includes('dog') && supplement.forSpecies.includes('cat') ? 'Dogs & Cats' :
                 supplement.forSpecies.includes('dog') ? 'Dogs' : 'Cats'}
              </Badge>
              {!supplement.inStock && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Product Name and Brand */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {supplement.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">by {supplement.brand}</p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(supplement.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 fill-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {supplement.rating} out of 5 ({supplement.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-teal-600">
                  ${supplement.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed">
              {supplement.fullDescription || supplement.description}
            </p>

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Package className="h-5 w-5 text-teal-600" />
                <span className="font-medium">Size:</span>
                <span>{supplement.size}</span>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
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
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={!supplement.inStock || isAdding}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-lg py-6"
                size="lg"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {supplement.inStock ? `Add to Cart - $${(supplement.price * quantity).toFixed(2)}` : 'Out of Stock'}
                  </>
                )}
              </Button>
              <FavoriteButton productId={supplement.id} variant="icon" size="lg" />
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <Shield className="h-6 w-6 text-green-600 mb-2" />
                  <p className="text-sm font-semibold text-green-900">Safe for Raw Diets</p>
                  <p className="text-xs text-green-700">Specially selected for raw-fed pets</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <Info className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="text-sm font-semibold text-blue-900">Quality Guaranteed</p>
                  <p className="text-xs text-blue-700">Premium ingredients and sourcing</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="benefits" className="mb-12">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="dosage">Dosage</TabsTrigger>
            <TabsTrigger value="safety">Safety Info</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle>Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {supplement.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-teal-600 text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ingredients">
            <Card>
              <CardHeader>
                <CardTitle>Active Ingredients</CardTitle>
                {supplement.sources && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Sources:</strong> {supplement.sources}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {supplement.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dosage">
            <Card>
              <CardHeader>
                <CardTitle>Dosage Guidelines by Weight</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Always consult with your veterinarian before starting any new supplement regimen.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Dogs Dosage */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Dogs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900 mb-1">Small (under 25 lbs)</p>
                        <p className="text-sm text-gray-700">{supplement.dosageByWeight.dogs.small}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900 mb-1">Medium (25-50 lbs)</p>
                        <p className="text-sm text-gray-700">{supplement.dosageByWeight.dogs.medium}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900 mb-1">Large (50-100 lbs)</p>
                        <p className="text-sm text-gray-700">{supplement.dosageByWeight.dogs.large}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900 mb-1">Giant (over 100 lbs)</p>
                        <p className="text-sm text-gray-700">{supplement.dosageByWeight.dogs.giant}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cats Dosage */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cats</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900 mb-1">All Sizes</p>
                      <p className="text-sm text-gray-700">{supplement.dosageByWeight.cats}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety">
            <Card>
              <CardHeader>
                <CardTitle>Safety Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {supplement.safetyInfo ? (
                    <p className="text-gray-700 leading-relaxed">{supplement.safetyInfo}</p>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      This supplement is generally safe when used as directed. Always consult your veterinarian
                      before starting any new supplement, especially if your pet has pre-existing health conditions
                      or is taking medications. Store in a cool, dry place away from direct sunlight. Keep out of
                      reach of children and pets.
                    </p>
                  )}

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-900 mb-2">Important Notice:</p>
                    <p className="text-sm text-yellow-800">
                      This product is a dietary supplement and is not intended to diagnose, treat, cure, or
                      prevent any disease. If your pet experiences any adverse reactions, discontinue use and
                      consult your veterinarian immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Customer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-8 h-8 ${
                            i < Math.floor(supplement.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 fill-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{supplement.rating}</span>
                  </div>
                  <p className="text-gray-600 mb-6">Based on {supplement.reviews} customer reviews</p>

                  <div className="bg-gray-50 p-8 rounded-lg">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      Customer reviews coming soon! Be the first to share your experience with this supplement.
                    </p>
                    <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                      Write a Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Supplements</h2>
          <p className="text-gray-600 mb-4">
            You might also be interested in these supplements from the same category.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push(`/supplements?category=${supplement.category}`)}
          >
            View More {category?.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
