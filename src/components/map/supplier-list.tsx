'use client';

import { Supplier } from '@/types/supplier';
import { Phone, Globe, MapPin, Star, Truck, Store } from 'lucide-react';

interface SupplierListProps {
  suppliers: Supplier[];
  onSupplierClick?: (supplier: Supplier) => void;
  selectedSupplierId?: string | null;
  isLoading?: boolean;
}

export default function SupplierList({
  suppliers,
  onSupplierClick,
  selectedSupplierId,
  isLoading = false,
}: SupplierListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-900-600 font-medium">Finding suppliers near you...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (suppliers.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900-700 mb-2">No suppliers found</h3>
          <p className="text-gray-900-600">
            Try increasing the search radius or searching in a different area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Results header */}
        <div className="sticky top-0 bg-white z-10 pb-3 border-b border-seasalt-400">
          <h3 className="text-lg font-bold text-gray-900-700">
            {suppliers.length} {suppliers.length === 1 ? 'Supplier' : 'Suppliers'} Found
          </h3>
        </div>

        {/* Supplier cards */}
        {suppliers.map((supplier) => {
          const isSelected = supplier.id === selectedSupplierId;

          return (
            <div
              key={supplier.id}
              onClick={() => onSupplierClick?.(supplier)}
              className={`
                p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? 'border-sandy-brown bg-maize-100 shadow-lg scale-[1.02]'
                    : 'border-orange-500 bg-white hover:bg-seasalt-100 shadow-md hover:shadow-lg'
                }
              `}
            >
              {/* Supplier name */}
              <h4 className="text-lg font-bold text-gray-900-800 mb-2">
                {supplier.name}
              </h4>

              {/* Distance badge */}
              {supplier.distance !== undefined && supplier.distance < 999 && (
                <div className="inline-flex items-center gap-1 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>~{Math.round(supplier.distance)} km away</span>
                </div>
              )}

              {/* Address */}
              <div className="space-y-2 text-sm text-gray-900-700">
                <p>
                  <span className="font-semibold">Address:</span> {supplier.address}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {supplier.city}, {supplier.state}
                </p>

                {/* Phone */}
                {supplier.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-600" />
                    <a
                      href={`tel:${supplier.phone}`}
                      className="text-teal-600 hover:text-myrtle-green font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {supplier.phone}
                    </a>
                  </div>
                )}

                {/* Website */}
                {supplier.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-teal-600" />
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-myrtle-green font-medium underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {/* Rating */}
                {supplier.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-sandy-brown text-sandy-brown" />
                    <span className="font-semibold text-sandy-brown">
                      {supplier.rating.toFixed(1)}/5
                    </span>
                    {supplier.reviews && (
                      <span className="text-gray-900-600">({supplier.reviews} reviews)</span>
                    )}
                  </div>
                )}

                {/* Species served */}
                {supplier.speciesServed && supplier.speciesServed.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">Serves:</span>
                    {supplier.speciesServed.map((species) => (
                      <span
                        key={species}
                        className="bg-teal-700-200 text-teal-700-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {species === 'dog' ? '🐕 Dogs' : species === 'cat' ? '🐈 Cats' : '🐾 Both'}
                      </span>
                    ))}
                  </div>
                )}

                {/* Delivery/Pickup options */}
                <div className="flex items-center gap-3 pt-2">
                  {supplier.deliveryAvailable && (
                    <div className="flex items-center gap-1 text-xs bg-teal-600-100 text-teal-600-800 px-2 py-1 rounded-full">
                      <Truck className="w-3 h-3" />
                      <span>Delivery</span>
                    </div>
                  )}
                  {supplier.pickupAvailable && (
                    <div className="flex items-center gap-1 text-xs bg-teal-600-100 text-teal-600-800 px-2 py-1 rounded-full">
                      <Store className="w-3 h-3" />
                      <span>Pickup</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
