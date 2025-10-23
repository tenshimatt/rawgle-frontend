'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import SupplierList from '@/components/map/supplier-list';
import LocationControls from '@/components/map/location-controls';
import { Supplier, UserLocation } from '@/types/supplier';

// Dynamically import map component to avoid SSR issues with Leaflet
const SupplierMap = dynamic(() => import('@/components/map/supplier-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-seasalt-200 rounded-lg flex items-center justify-center">
      <div className="text-gray-900-600">Loading map...</div>
    </div>
  ),
});

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [radius, setRadius] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  // Fetch user location on mount
  useEffect(() => {
    async function fetchUserLocation() {
      try {
        setIsLocationLoading(true);
        const response = await fetch('/api/location');
        const data = await response.json();

        if (data.latitude && data.longitude) {
          setUserLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city || 'Unknown',
            region: data.region || 'Unknown',
            country: data.country || 'Unknown',
          });
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
        // Fallback to default location (e.g., London)
        setUserLocation({
          latitude: 51.5074,
          longitude: -0.1278,
          city: 'London',
          region: 'England',
          country: 'UK',
        });
      } finally {
        setIsLocationLoading(false);
      }
    }

    fetchUserLocation();
  }, []);

  // Find nearby suppliers
  const findNearbySuppliers = useCallback(async () => {
    if (!userLocation) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/suppliers/nearby?lat=${userLocation.latitude}&lng=${userLocation.longitude}&radius=${radius}`
      );
      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        setSuppliers(data.results);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error fetching nearby suppliers:', error);
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, radius]);

  // Text search for suppliers
  const searchSuppliers = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/suppliers/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        setSuppliers(data.results);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error searching suppliers:', error);
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchSuppliers();
  };

  // Handle supplier click from map or list
  const handleSupplierClick = useCallback((supplier: Supplier) => {
    setSelectedSupplierId(supplier.id);

    // Scroll to supplier in list if needed
    setTimeout(() => {
      const element = document.getElementById(`supplier-${supplier.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-seasalt-100 via-white to-teal-700/10">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900-800 mb-2">
            Find Raw Food Suppliers
          </h1>
          <p className="text-gray-900-600">
            Discover quality raw food suppliers near you with our interactive map
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by business name, city, or area..."
                className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-seasalt-300 focus:border-teal-600 focus:outline-none text-gray-900-800"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className={`
                px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200
                ${
                  isLoading || !searchQuery.trim()
                    ? 'bg-gray-900-300 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-burnt-sienna shadow-md hover:shadow-lg'
                }
              `}
            >
              Search
            </button>
          </form>
        </div>

        {/* Location controls */}
        <div className="mb-6">
          <LocationControls
            userLocation={userLocation}
            isLoading={isLoading || isLocationLoading}
            onFindNearby={findNearbySuppliers}
            radius={radius}
            onRadiusChange={setRadius}
          />
        </div>

        {/* Map and List grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map container */}
          <div className="h-[500px] lg:h-[700px] rounded-lg overflow-hidden shadow-xl">
            <SupplierMap
              suppliers={suppliers}
              userLocation={userLocation}
              onSupplierClick={handleSupplierClick}
              selectedSupplierId={selectedSupplierId}
              radius={radius}
            />
          </div>

          {/* Supplier list container */}
          <div className="h-[500px] lg:h-[700px] bg-white rounded-lg shadow-xl overflow-hidden">
            <SupplierList
              suppliers={suppliers}
              onSupplierClick={handleSupplierClick}
              selectedSupplierId={selectedSupplierId}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Mobile: Stack vertically */}
        <style jsx>{`
          @media (max-width: 1023px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
