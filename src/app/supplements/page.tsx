'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Star, Search, X, Package } from 'lucide-react';
import { supplements, supplementCategories, type SupplementCategory, type PetSpecies } from '@/data/supplements';
import { useCart } from '@/components/cart/cart-provider';
import { FavoriteButton } from '@/components/favorites/favorite-button';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

export default function SupplementsPage() {
  const { addToCart } = useCart();
  const [addingProduct, setAddingProduct] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SupplementCategory | 'all'>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies | 'all'>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
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
  const filteredSupplements = useMemo(() => {
    return supplements.filter((supplement) => {
      // Search filter
      const matchesSearch =
        debouncedSearchQuery === '' ||
        supplement.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        supplement.brand.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        supplement.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        supplement.benefits.some((benefit) =>
          benefit.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ) ||
        supplement.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || supplement.category === selectedCategory;

      // Species filter
      const matchesSpecies =
        selectedSpecies === 'all' ||
        supplement.forSpecies.includes(selectedSpecies) ||
        supplement.forSpecies.includes('both');

      // Featured filter
      const matchesFeatured = !showFeaturedOnly || supplement.featured;

      return matchesSearch && matchesCategory && matchesSpecies && matchesFeatured;
    });
  }, [debouncedSearchQuery, selectedCategory, selectedSpecies, showFeaturedOnly]);

  const handleAddToCart = async (supplementId: string) => {
    setAddingProduct(supplementId);
    const supplement = supplements.find(s => s.id === supplementId);
    if (supplement) {
      await addToCart(supplementId, 1, supplement.size);
    }
    setAddingProduct(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSpecies('all');
    setShowFeaturedOnly(false);
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'all' || selectedSpecies !== 'all' || showFeaturedOnly;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Raw Diet Supplements</h1>
          <p className="text-lg text-gray-700">
            Premium supplements specifically selected for raw-fed dogs and cats
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search supplements, ingredients, benefits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-teal-600 border-t-transparent rounded-full" />
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
                <SelectItem value="dog">Dogs Only</SelectItem>
                <SelectItem value="cat">Cats Only</SelectItem>
                <SelectItem value="both">Both Dogs & Cats</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured Toggle and Active Filters */}
          <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Only</span>
              </label>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {supplementCategories.find((c) => c.id === selectedCategory)?.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                  </Badge>
                )}
                {selectedSpecies !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedSpecies}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSpecies('all')} />
                  </Badge>
                )}
                {showFeaturedOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Featured
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setShowFeaturedOnly(false)} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700">
            Showing <span className="font-semibold text-teal-600">{filteredSupplements.length}</span> supplements
          </p>
        </div>

        {/* Supplements Grid */}
        {filteredSupplements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSupplements.map((supplement) => (
              <Card key={supplement.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                      {supplementCategories.find((c) => c.id === supplement.category)?.icon}{' '}
                      {supplementCategories.find((c) => c.id === supplement.category)?.name}
                    </Badge>
                    {supplement.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    )}
                  </div>
                  <Link href={`/supplements/${supplement.slug}`}>
                    <CardTitle className="text-lg hover:text-teal-600 transition-colors cursor-pointer">
                      {supplement.name}
                    </CardTitle>
                  </Link>
                  <p className="text-sm text-gray-600">{supplement.brand}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{supplement.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(supplement.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({supplement.reviews})</span>
                  </div>

                  {/* Benefits Preview */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Key Benefits:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {supplement.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-teal-600 mt-0.5">•</span>
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Size */}
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {supplement.size}
                  </p>

                  {/* Stock */}
                  {supplement.inStock ? (
                    <Badge variant="secondary" className="mb-3 bg-green-100 text-green-800 w-fit">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="mb-3 bg-red-100 text-red-800 w-fit">
                      Out of Stock
                    </Badge>
                  )}

                  {/* Price and Buttons */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-teal-600">
                        ${supplement.price.toFixed(2)}
                      </span>
                      <FavoriteButton productId={supplement.id} variant="icon" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/supplements/${supplement.slug}`}>
                        <Button variant="outline" className="w-full text-sm">
                          Details
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleAddToCart(supplement.id)}
                        disabled={!supplement.inStock || addingProduct === supplement.id}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm"
                      >
                        {addingProduct === supplement.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No supplements found</h3>
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
