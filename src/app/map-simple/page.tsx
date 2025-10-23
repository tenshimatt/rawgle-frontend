'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { rawgleQueries, type Supplier } from '@/lib/rawgle-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Navigation, ExternalLink } from 'lucide-react';

export default function SimpleMapPage() {
  const [mounted, setMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([39.8283, -98.5795]); // US center
  const [searchRadius, setSearchRadius] = useState(50);
  const [locationDetected, setLocationDetected] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect user location
  const { data: detectedLocation, isLoading: locationLoading } = useQuery({
    ...rawgleQueries.location(),
    enabled: mounted,
  });

  useEffect(() => {
    if (detectedLocation) {
      setUserLocation([detectedLocation.latitude, detectedLocation.longitude]);
      setLocationDetected(true);
    }
  }, [detectedLocation]);

  // Fetch nearby suppliers
  const {
    data: suppliers,
    isLoading: suppliersLoading,
    error,
  } = useQuery({
    ...rawgleQueries.nearby({
      lat: userLocation[0],
      lng: userLocation[1],
      radius: searchRadius,
    }),
    enabled: mounted && locationDetected,
  });

  // Get stats
  const { data: stats } = useQuery({
    ...rawgleQueries.stats(),
    enabled: mounted,
  });

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationDetected(true);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to detect your location. Please enable location services.');
        }
      );
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br gradient-hero">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Raw Dog Food Suppliers Near You
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            {stats?.total_suppliers ? `Showing ${suppliers?.length || 0} of ${stats.total_suppliers.toLocaleString()} suppliers` : 'Loading...'}
          </p>

          {/* Location Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-600" />
              <span className="text-sm text-gray-700">
                {locationDetected
                  ? `${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}`
                  : 'Location not detected'}
              </span>
            </div>

            <Button onClick={handleGetCurrentLocation} className="gap-2">
              <Navigation className="h-4 w-4" />
              Detect My Location
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Radius:</span>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="5">5 miles</option>
                <option value="10">10 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
                <option value="200">200 miles</option>
                <option value="500">500 miles</option>
              </select>
            </div>

            <Link href="/suppliers">
              <Button variant="outline">View All Suppliers</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {(locationLoading || suppliersLoading) && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-3" />
              <p className="text-gray-700">
                {locationLoading ? 'Detecting location...' : 'Loading suppliers...'}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="pt-6">
              <p className="text-red-800">
                Error loading suppliers: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* No Location */}
        {!locationDetected && !locationLoading && (
          <Card className="border-yellow-200 bg-yellow-50 mb-6">
            <CardContent className="pt-6">
              <p className="text-yellow-800">
                Click "Detect My Location" to find suppliers near you, or view all suppliers.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Suppliers Grid */}
        {suppliers && suppliers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier: Supplier) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{supplier.name}</CardTitle>
                  {supplier.business_name && supplier.business_name !== supplier.name && (
                    <CardDescription>{supplier.business_name}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      {supplier.address && <p>{supplier.address}</p>}
                      <p>
                        {supplier.city}, {supplier.state} {supplier.zip}
                      </p>
                    </div>
                  </div>

                  {/* Distance */}
                  {supplier.distance_miles && (
                    <p className="text-sm font-semibold text-teal-600">
                      {supplier.distance_miles.toFixed(1)} miles away
                    </p>
                  )}

                  {/* Coordinates */}
                  <p className="text-xs text-gray-500">
                    {supplier.latitude.toFixed(4)}, {supplier.longitude.toFixed(4)}
                  </p>

                  {/* Website */}
                  {supplier.website && (
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-teal-600 hover:underline"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {suppliers && suppliers.length === 0 && locationDetected && !suppliersLoading && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No suppliers found
            </h3>
            <p className="text-gray-600">
              Try increasing your search radius or browsing all suppliers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
