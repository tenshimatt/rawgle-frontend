'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { rawgleApi, rawgleQueries, type Supplier } from '@/lib/rawgle-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, MapPin, Search, Navigation } from 'lucide-react';

// Dynamically import Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function SupplierMapPage() {
  const [mounted, setMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([39.8283, -98.5795]); // US center
  const [searchRadius, setSearchRadius] = useState(50);
  const [locationDetected, setLocationDetected] = useState(false);

  // Detect user location on mount
  const { data: detectedLocation } = useQuery(rawgleQueries.location());

  useEffect(() => {
    setMounted(true);

    if (detectedLocation) {
      setUserLocation([detectedLocation.latitude, detectedLocation.longitude]);
      setLocationDetected(true);
    }
  }, [detectedLocation]);

  // Fetch nearby suppliers
  const {
    data: suppliers,
    isLoading,
    refetch,
  } = useQuery({
    ...rawgleQueries.nearby({
      lat: userLocation[0],
      lng: userLocation[1],
      radius: searchRadius,
    }),
    enabled: mounted && locationDetected,
  });

  // Get current location from browser
  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(newLocation);
          setLocationDetected(true);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to detect your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
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
    <div className="h-screen w-full flex flex-col">
      {/* Header Controls */}
      <div className="bg-white border-b shadow-sm z-20 relative">
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                🗺️ Find Raw Dog Food Suppliers
              </h1>
              <p className="text-gray-600 mt-1">
                {isLoading
                  ? 'Loading suppliers...'
                  : locationDetected
                  ? `${suppliers?.length || 0} suppliers within ${searchRadius} miles`
                  : 'Detect your location to see nearby suppliers'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="5"
                max="500"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="w-24"
                placeholder="Miles"
              />
              <span className="text-sm text-gray-600">miles</span>

              <Button
                onClick={handleGetCurrentLocation}
                variant="outline"
                className="gap-2"
              >
                <Navigation className="h-4 w-4" />
                My Location
              </Button>

              <Button onClick={() => refetch()} disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={userLocation}
          zoom={locationDetected ? 10 : 4}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User location marker */}
          {locationDetected && (
            <Marker position={userLocation}>
              <Popup>
                <div className="text-center">
                  <MapPin className="h-6 w-6 text-persian-green mx-auto mb-2" />
                  <p className="font-semibold">Your Location</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Supplier markers */}
          {suppliers?.map((supplier: Supplier) => (
            <Marker
              key={supplier.id}
              position={[supplier.latitude, supplier.longitude]}
            >
              <Popup maxWidth={300}>
                <Card className="border-0 shadow-none">
                  <h3 className="font-bold text-lg mb-2">{supplier.name}</h3>

                  {supplier.business_name && supplier.business_name !== supplier.name && (
                    <p className="text-sm text-gray-600 mb-2">{supplier.business_name}</p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {supplier.city}, {supplier.state}
                    </span>
                  </div>

                  {supplier.distance_miles && (
                    <p className="text-sm font-semibold text-persian-green mb-3">
                      📍 {supplier.distance_miles.toFixed(1)} miles away
                    </p>
                  )}

                  {supplier.website && (
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-persian-green hover:underline text-sm font-medium"
                    >
                      Visit Website →
                    </a>
                  )}

                  {supplier.phone && (
                    <p className="text-sm text-gray-600 mt-2">
                      📞 {supplier.phone}
                    </p>
                  )}

                  {supplier.description && (
                    <p className="text-sm text-gray-700 mt-3 border-t pt-2">
                      {supplier.description.substring(0, 150)}
                      {supplier.description.length > 150 && '...'}
                    </p>
                  )}
                </Card>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-persian-green" />
              <span className="font-medium">Loading suppliers...</span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile supplier list */}
      <div className="md:hidden max-h-48 overflow-y-auto bg-white border-t">
        <div className="p-4">
          <h2 className="font-bold mb-3">Nearby Suppliers ({suppliers?.length || 0})</h2>
          <div className="space-y-2">
            {suppliers?.slice(0, 5).map((supplier: Supplier) => (
              <Card key={supplier.id} className="p-3">
                <h3 className="font-semibold text-sm">{supplier.name}</h3>
                <p className="text-xs text-gray-600">
                  {supplier.city}, {supplier.state} • {supplier.distance_miles?.toFixed(1)} mi
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
