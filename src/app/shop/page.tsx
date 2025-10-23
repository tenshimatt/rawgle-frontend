'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Star, Search, X } from 'lucide-react';
import { supplements, supplementCategories, type SupplementCategory, type PetSpecies } from '@/data/products/supplements';
import { useCart } from '@/components/cart/cart-provider';
import { useState, useMemo, useEffect } from 'react';

export default function ShopPage() {
  const { addToCart } = useCart();
  const [addingProduct, setAddingProduct] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SupplementCategory | 'all'>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies | 'all'>('all');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return supplements.filter((product) => {
      // Search filter
      const matchesSearch =
        debouncedSearchQuery === '' ||
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.benefits.some((benefit) =>
          benefit.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ) ||
        product.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      // Species filter
      const matchesSpecies =
        selectedSpecies === 'all' ||
        product.forSpecies.includes(selectedSpecies) ||
        product.forSpecies.includes('both');

      return matchesSearch && matchesCategory && matchesSpecies;
    });
  }, [debouncedSearchQuery, selectedCategory, selectedSpecies]);

  const handleAddToCart = async (productId: string) => {
    setAddingProduct(productId);
    await addToCart(productId, 1, '60 chews'); // Default size
    setAddingProduct(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSpecies('all');
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'all' || selectedSpecies !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛍️ Supplement Shop</h1>
          <p className="text-lg text-gray-700">Premium supplements for your raw-fed pets</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search supplements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full" />
                </div>
              )}
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {supplementCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Species Filter */}
            <Select value={selectedSpecies} onValueChange={(value: any) => setSelectedSpecies(value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Pets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pets</SelectItem>
                <SelectItem value="dog">🐕 Dogs Only</SelectItem>
                <SelectItem value="cat">🐈 Cats Only</SelectItem>
                <SelectItem value="both">🐾 Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Category: {getAllCategories().find((c) => c.id === selectedCategory)?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </Badge>
              )}
              {selectedSpecies !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Species: {selectedSpecies}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSpecies('all')} />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700">
            Showing <span className="font-semibold">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={product.featured ? 'default' : 'secondary'} className="bg-green-100 text-green-800">
                      {getAllCategories().find((c) => c.id === product.category)?.icon}{' '}
                      {getAllCategories().find((c) => c.id === product.category)?.name}
                    </Badge>
                    {product.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">⭐ Featured</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{product.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>

                  {/* Size */}
                  <p className="text-sm text-gray-600 mb-2">Size: {product.size}</p>

                  {/* Stock */}
                  {product.inStock ? (
                    <Badge variant="secondary" className="mb-3 bg-green-100 text-green-800">
                      ✓ In Stock
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="mb-3 bg-red-100 text-red-800">
                      Out of Stock
                    </Badge>
                  )}

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.inStock || addingProduct === product.id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {addingProduct === product.id ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
