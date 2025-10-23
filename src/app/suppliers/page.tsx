'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { rawgleApi, type Supplier } from '@/lib/rawgle-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Phone, Globe, Star, ExternalLink, Dog, Loader2 } from 'lucide-react';

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationDetected, setLocationDetected] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 51.5074, lng: -0.1278 }); // London default

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      // Get nearest suppliers based on user location
      const data = await rawgleApi.getNearbySuppliers({
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: 50 // miles
      });
      // Limit to 5 suppliers
      setSuppliers(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get user location
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setLocationDetected(true);
          // Reload suppliers with new location
          loadSuppliers();
        },
        () => {
          setLocationDetected(true); // Use default anyway
        }
      );
    } else {
      setLocationDetected(true);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      loadSuppliers();
      return;
    }
    try {
      setLoading(true);
      const data = await rawgleApi.searchSuppliers({ q: searchQuery, limit: 5 });
      setSuppliers(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers;

  return (
    <div className="min-h-screen page-gradient">
      {/* Header Banner */}
      <div className="section-gradient-primary text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-lg">🔒</span>
            <span className="font-semibold text-sm">SECURE & PROTECTED - 8,844+ Verified Raw Dog Food Suppliers</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Dog className="h-12 w-12 icon-accent" />
              <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Find Raw Dog Food Near You
                </h1>
                <p className="text-gray-700 text-sm mt-1">
                  Rawgle - Your #1 source for finding raw dog food stores, BARF diet suppliers, and natural pet nutrition near you
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search raw dog food stores, BARF suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="btn-accent px-6"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Search className="h-5 w-5 mr-2" />}
                Search
              </Button>
              <Button
                onClick={handleGetLocation}
                size="lg"
                className="btn-primary px-6"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Near Me
              </Button>
            </div>

            {/* Sign In Button */}
            <Link href="/auth/login">
              <Button variant="default">
                🔐 Sign In to Review
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Location Badge */}
      {locationDetected && (
        <div className="bg-sandy-brown/10 border-b border-sandy-brown/20">
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 icon-secondary" />
              <span className="text-sm font-medium text-sandy-brown">
                📍 Located in Saint Helier, null
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Grid */}
      <div className="container-page">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Top 5 Closest Suppliers
            </h2>
            <p className="text-gray-700 text-sm">
              Showing your nearest raw dog food suppliers - you won't need to travel further
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-16 w-16 icon-accent mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Loading suppliers...
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSuppliers.map((supplier, index) => (
              <Card key={supplier.id} className="card-feature-accent">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm text-burnt-sienna font-semibold mb-1">
                        #{index + 1} Closest
                      </div>
                      <CardTitle className="text-xl mb-2 text-gray-900">{supplier.business_name || supplier.name}</CardTitle>
                      {supplier.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(supplier.rating || 0)
                                    ? 'fill-sandy-brown text-sandy-brown'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {supplier.rating} ({supplier.user_ratings_total || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Address */}
                  {(supplier.address || supplier.city) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 icon-dark mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-900">
                        {supplier.address && <p>{supplier.address}</p>}
                        {(supplier.city || supplier.state || supplier.zip) && (
                          <p>{[supplier.city, supplier.state, supplier.zip].filter(Boolean).join(', ')}</p>
                        )}
                        {supplier.country && <p>{supplier.country}</p>}
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {(supplier.phone || supplier.phone_number) && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 icon-dark" />
                      <a href={`tel:${supplier.phone || supplier.phone_number}`} className="text-sm text-teal-600 hover:underline">
                        {supplier.phone || supplier.phone_number}
                      </a>
                    </div>
                  )}

                  {/* Website */}
                  {supplier.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 icon-dark" />
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-600 hover:underline flex items-center gap-1"
                      >
                        {supplier.website.replace('https://', '')}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {/* Distance */}
                  {(supplier.distance_miles || supplier.distance_km) && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-burnt-sienna">
                          📏 {supplier.distance_miles ? `${supplier.distance_miles.toFixed(1)} miles` : `${supplier.distance_km?.toFixed(1)} km`} away
                        </span>
                        <Link href="/pets">
                          <Button size="sm" variant="accent">
                            ✍️ Write Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              ))}
            </div>
          )}

          {!loading && filteredSuppliers.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No suppliers found
              </h3>
              <p className="text-muted">
                Try adjusting your search or click "Near Me"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info Section */}
      <div className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title">
              Find Raw Dog Food Near You - The Complete Guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🥩</div>
                <h3 className="font-bold text-burnt-sienna text-lg mb-3">Raw Dog Food Basics</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Raw dog food, also known as BARF (Biologically Appropriate Raw Food), provides dogs with natural
                  nutrition closest to their ancestral diet. Find verified suppliers offering premium raw meat, bones, and organs.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-5xl mb-4">📍</div>
                <h3 className="font-bold text-burnt-sienna text-lg mb-3">Local Store Finder</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Search our database of 8,844+ verified raw dog food suppliers near you. Use our interactive map to find stores
                  offering frozen raw meals, BARF diets, and natural pet nutrition products.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="font-bold text-burnt-sienna text-lg mb-3">Quality Assurance</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  All suppliers in our network are verified for quality, safety, and reliability. Read reviews, check ratings,
                  and find the best raw dog food stores with delivery, pickup, and bulk ordering options.
                </p>
              </div>
            </div>

            <div className="bg-gray-900/5 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-gray-900">Popular Searches:</strong> Raw dog food near me | BARF diet suppliers |
                Natural dog food stores | Frozen raw dog food | Raw pet food delivery | Raw dog food bulk buying |
                Premium raw meat for dogs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
